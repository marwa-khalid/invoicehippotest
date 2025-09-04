import { Outlet } from "react-router-dom";
import { CompanyHeader } from "./CompanyHeader";
import { Content } from "../../../../_metronic/layout/components/content";
import { CommonInvoices } from "./components/settings-invoices/CommonInvoices";
import { CommonQuote } from "./components/settings-quotes/CommonQuote";
import { useEffect, useState } from "react";
import {
  getCompanyById,
  getCompanySettings,
  getUsageQuotas,
  postCompanyData,
} from "./core/_requests";
import { useAuth } from "../../auth";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useIntl } from "react-intl";
import { handleToast } from "../../auth/core/_toast";
import { CompanyTab } from "./components/my-company/CompanyTab";
import { AttachmentsModal } from "../../generic/FileManager/AttachmentsModal";
import { getProfileInfo } from "../../auth/core/_requests";
import { ClientProductsTab } from "./components/clients-products/ClientProductsTab";
import { TradeNamesAddModal } from "../tradenames/tradenames-add-modal/TradeNamesAddModal";
import { TradeNameDeleteModal } from "../tradenames/tradename-delete-modal/TradeNameDeleteModal";
import { KTIcon } from "../../../../_metronic/helpers";
type AccordionProps = {
  title: string;
  icon: string;
  onEditClick?: () => void;
};
const AccordionItem = ({
  title,
  icon,
  onEditClick,
  children,
}: AccordionProps & { children?: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-4 border-bottom pb-2">
      <div
        className="d-flex justify-content-between align-items-center cursor-pointer p-4"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="d-flex align-items-center">
          <KTIcon
            iconName={isOpen ? "minus-square" : "plus-square"}
            className={`fs-2 me-2 ${isOpen && "text-primary"}`}
          />
          <h4 className="text-muted mb-0">{title}</h4>
        </div>
      </div>
      {isOpen && (
        <>
          {children ? (
            <div className="p-4">{children}</div>
          ) : (
            <div
              className="my-5 ms-10 d-flex align-items-center cursor-pointer text-muted"
              onClick={onEditClick}
            >
              <KTIcon iconName={icon} className="fs-2 me-2" />
              <span>Edit Details</span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

const CompanyWrapper = () => {
  const { currentUser, setCurrentUser } = useAuth();
  const [activeCompanyId, setActiveCompanyId] = useState<number | undefined>(
    currentUser?.result.activeCompany.id
  );
  const intl = useIntl();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [tradeNameId, setTradeNameId] = useState<number>(0);
  const [title, setTitle] = useState<string>("");
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);

  const [refresh, setRefresh] = useState<boolean>(false);
  const [attachmentsModalOpen, setAttachmentsModalOpen] =
    useState<boolean>(false);

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const response = await getCompanyById(activeCompanyId);

        handleToast(response);
        if (response.isValid) {
          setActiveCompanyId(response.result.id);
          formik.setValues(response.result);
        }
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };
    fetchCompanyData();
  }, [activeCompanyId]);
  useEffect(() => {
    const fetchCompanySettings = async () => {
      const response = await getCompanySettings(
        currentUser?.result.activeCompany.id
      );
      if (response.isValid) {
        settings.setValues(response.result);
      }
    };
    fetchCompanySettings();
  }, []);
  const [usageQuotas, setUsageQuotas] = useState<any>({});
  const [licenseData, setLicenseData] = useState<any>();

  useEffect(() => {
    const fetchUsageQuotas = async () => {
      const response = await getUsageQuotas(activeCompanyId);
      if (response.isValid) {
        setUsageQuotas(response.result.usage);
        setLicenseData(response.result.licenseInfo);
      }
    };
    fetchUsageQuotas();
  }, [activeCompanyId]);

  const formik = useFormik({
    initialValues: {},
    validationSchema: Yup.object()
      .shape({
        accountNrIBAN: Yup.string().required(
          intl
            .formatMessage({ id: "Common.RequiredFieldHint2" })
            .replace("{0}", intl.formatMessage({ id: "Fields.AccountNrIBAN" }))
        ),
        accountHolderName: Yup.string().required(
          intl
            .formatMessage({ id: "Common.RequiredFieldHint2" })
            .replace(
              "{0}",
              intl.formatMessage({ id: "Fields.AccountHolderName" })
            )
        ),
        companyName: Yup.string().required(
          intl
            .formatMessage({ id: "Common.RequiredFieldHint2" })
            .replace("{0}", intl.formatMessage({ id: "Fields.CompanyName" }))
        ),
        bankAccountCompanyType: Yup.number().required(
          intl
            .formatMessage({ id: "Common.RequiredFieldHint2" })
            .replace(
              "{0}",
              intl.formatMessage({ id: "Fields.BankAccountCompanyType" })
            )
        ),
        notificationEmailAddresses: Yup.array().required(
          intl
            .formatMessage({ id: "Common.RequiredFieldHint2" })
            .replace("{0}", intl.formatMessage({ id: "Fields.EmailAddress" }))
        ),
        companyPhoneNumber: Yup.string(),
        mobilePhoneNumber: Yup.string(),
      })
      .test(
        "phone-required",
        intl
          .formatMessage({ id: "Common.RequiredFieldHint2" })
          .replace("{0}", intl.formatMessage({ id: "Fields.PhoneNr" })), // You can localize this message
        function (values) {
          return !!values.companyPhoneNumber || !!values.mobilePhoneNumber;
        }
      ),

    onSubmit: async (values, { setSubmitting }) => {
      setIsSubmitting(true);
      try {
        const response = await postCompanyData(values);
        if (response.isValid) {
          // formik.resetForm();
          // setAddModalOpen(false);
          setRefresh(true);
          formik.setValues(response.result);
          setCompanyDetailsModalOpen(false);
          const data = await getProfileInfo();
          if (data) {
            setCurrentUser(data);
          }
        }
        handleToast(response);
      } catch (error) {
        console.error("Post failed:", error);
      } finally {
        setIsSubmitting(false);
        setSubmitting(false);
      }
    },
  });
  const settings = useFormik({
    initialValues: {},
    validationSchema: Yup.object().shape({
      // accountNrIBAN: Yup.string()
      //   .required(
      //     intl
      //       .formatMessage({ id: "Common.RequiredFieldHint2" })
      //       .replace("{0}", intl.formatMessage({ id: "Fields.AccountNrIBAN" }))
      //   )
      //   .matches(
      //     /\bGB\d{2}[A-Z]{4}\d{14}\b/,
      //     intl
      //       .formatMessage({ id: "Common.InvalidFormat" })
      //       .replace("{0}", intl.formatMessage({ id: "Fields.AccountNrIBAN" }))
      //   ),
      // accountHolderName: Yup.string().required(
      //   intl
      //     .formatMessage({ id: "Common.RequiredFieldHint2" })
      //     .replace(
      //       "{0}",
      //       intl.formatMessage({ id: "Fields.AccountHolderName" })
      //     )
      // ),
      // companyName: Yup.string().required(
      //   intl
      //     .formatMessage({ id: "Common.RequiredFieldHint2" })
      //     .replace("{0}", intl.formatMessage({ id: "Fields.CompanyName" }))
      // ),
      // bankAccountCompanyType: Yup.number().required(
      //   intl
      //     .formatMessage({ id: "Common.RequiredFieldHint2" })
      //     .replace(
      //       "{0}",
      //       intl.formatMessage({ id: "Fields.BankAccountCompanyType" })
      //     )
      // ),
      // notificationEmailAddresses: Yup.array().required(
      //   intl
      //     .formatMessage({ id: "Common.RequiredFieldHint2" })
      //     .replace(
      //       "{0}",
      //       intl.formatMessage({ id: "Fields.BankAccountCompanyType" })
      //     )
      // ),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setIsSubmitting(true);
      try {
        const response = await postCompanyData(values);
        if (response.isValid) {
          // formik.resetForm();
          // setAddModalOpen(false);
          setRefresh(true);
          settings.setValues(response.result);
          setCompanyDetailsModalOpen(false);
          const data = await getProfileInfo();
          if (data) {
            setCurrentUser(data);
          }
        }
        handleToast(response);
      } catch (error) {
        console.error("Post failed:", error);
      } finally {
        setIsSubmitting(false);
        setSubmitting(false);
      }
    },
  });
  const [companyDetailsModalOpen, setCompanyDetailsModalOpen] =
    useState<boolean>(false);
  const [clientProductModalOpen, setClientProductModalOpen] =
    useState<boolean>(false);

  const [quoteModalOpen, setQuoteModalOpen] = useState<boolean>(false);
  const [invoiceModalOpen, setInvoiceModalOpen] = useState<boolean>(false);

  return (
    <>
      <CompanyHeader
        formik={formik}
        setAttachmentsModalOpen={setAttachmentsModalOpen}
        activeCompanyId={activeCompanyId}
        setActiveCompanyId={setActiveCompanyId}
        licenseData={licenseData}
        usageQuotas={usageQuotas}
      />
      <Outlet />

      {attachmentsModalOpen && (
        <AttachmentsModal
          formik={formik}
          setAttachmentsModalOpen={setAttachmentsModalOpen}
          type="companyLogo"
          info="Fields.ImageUploadModuleInfo"
        />
      )}
      {companyDetailsModalOpen && (
        <CompanyTab
          formik={formik}
          isSubmitting={isSubmitting}
          setAttachmentsModalOpen={setAttachmentsModalOpen}
          setModalOpen={setCompanyDetailsModalOpen}
        />
      )}
      {clientProductModalOpen && (
        <ClientProductsTab
          formik={settings}
          isSubmitting={isSubmitting}
          setModalOpen={setClientProductModalOpen}
        />
      )}
      {quoteModalOpen && <CommonQuote setModalOpen={setQuoteModalOpen} />}
      {invoiceModalOpen && (
        <CommonInvoices setModalOpen={setInvoiceModalOpen} />
      )}
      <Content>
        <div className="card p-9 mb-5 mb-xl-10">
          <AccordionItem
            title={intl.formatMessage({ id: "Settings.SideMenuMyCompany" })}
            icon="office-bag"
            onEditClick={() => setCompanyDetailsModalOpen(true)}
          />
          <AccordionItem
            title={intl.formatMessage({
              id: "Settings.SideMenuClientsAndProducts",
            })}
            icon="add-item"
            onEditClick={() => setClientProductModalOpen(true)}
          />
          <AccordionItem
            title={intl.formatMessage({ id: "Settings.SideMenuQuote" })}
            icon="finance-calculator"
            onEditClick={() => setQuoteModalOpen(true)}
          />
          <AccordionItem
            title={intl.formatMessage({ id: "Settings.SideMenuInvoice" })}
            icon="receipt-square"
            onEditClick={() => setInvoiceModalOpen(true)}
          />
          {/* <AccordionItem
            title={intl.formatMessage({ id: "Settings.SideMenuTradeNames" })}
            icon="finance-calculator"
          >
            <TradeNamesTab
              companyId={currentUser?.result.activeCompany.id}
              setTradeNamesModalOpen={setTradeNamesModalOpen}
              setTradeNameId={setTradeNameId}
              setDeleteModalOpen={setDeleteModalOpen}
              setTitle={setTitle}
              refresh={refresh}
            />
          </AccordionItem> */}
        </div>
      </Content>
      <div className="tab-content">
        <div
          className="tab-pane fade show active"
          id="company_tab"
          role="tabpanel"
        >
          <Content>
            {/* <CompanyTab
              formik={formik}
              isSubmitting={isSubmitting}
              setAttachmentsModalOpen={setAttachmentsModalOpen}
              setModalOpen={setCompanyDetailsModalOpen}
            /> */}
          </Content>
        </div>
        <div className="tab-pane fade" id="clientproduct_tab" role="tabpanel">
          <Content>
            {/* <ClientProductsTab formik={settings} isSubmitting={isSubmitting} /> */}
          </Content>
        </div>
        <div className="tab-pane fade" id="quote_tab" role="tabpanel">
          <Content>{/* <CommonQuote /> */}</Content>
        </div>
        <div className="tab-pane fade" id="invoice_tab" role="tabpanel">
          <Content>{/* <CommonInvoices /> */}</Content>
        </div>
        <div className="tab-pane fade" id="tradename_tab" role="tabpanel">
          <Content>
            {/* <TradeNamesTab
              companyId={currentUser?.result.activeCompany.id}
              setTradeNamesModalOpen={setTradeNamesModalOpen}
              setTradeNameId={setTradeNameId}
              setDeleteModalOpen={setDeleteModalOpen}
              setTitle={setTitle}
              refresh={refresh}
            /> */}
          </Content>
        </div>
      </div>
    </>
  );
};

export { CompanyWrapper };
