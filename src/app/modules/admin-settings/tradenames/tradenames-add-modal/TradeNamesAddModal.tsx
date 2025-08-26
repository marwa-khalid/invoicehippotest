import { useEffect, useState } from "react";
import { TradeNamesAddModalHeader } from "./TradeNamesAddModalHeader";
import { TradeNamesAddModalFooter } from "./TradeNamesAddModalFooter";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useIntl } from "react-intl";
// import { postDiscountMargin } from "../../../../core/_requests";
import { handleToast } from "../../../auth/core/_toast";
import { KTIcon } from "../../../../../_metronic/helpers";
import { ContactAndAddress } from "../../my-company/components/my-company/ContactAndAddress";
import { TradeNamesCompanyDetails } from "../components/TradeNamesCompanyDetails";
import { ListLoading } from "../../../generic/ListLoading";
import { getTradeNames } from "../../../quotes/overview/core/_requests";
import {
  getTradenameById,
  postTradename,
} from "../../my-company/core/_requests";
import { AttachmentsModal } from "../../../generic/FileManager/AttachmentsModal";
import { CustomTabManager } from "../../../generic/Tabs/CustomTabManager";
interface Props {
  setRefresh: (type: boolean) => void;
  setAddModalOpen: (type: boolean) => void;
  refresh: boolean;
  tradeNameId: number;
  companyId: number;
}
const TradeNamesAddModal = ({
  setRefresh,
  setAddModalOpen,
  refresh,
  tradeNameId,
  companyId,
}: Props) => {
  useEffect(() => {
    document.body.classList.add("modal-open");
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, []);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [attachmentsModalOpen, setAttachmentsModalOpen] =
    useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const intl = useIntl();

  const formik = useFormik({
    initialValues: {
      id: 0,
      companyId: companyId,
      tradeName: "",
      onSaveActions: {
        removeLogo: true,
        newLogo: {
          inboxItemId: 0,
          attachmentId: 0,
          isRemoved: true,
          restoreAttachment: true,
          isDirectFileReference: true,
        },
      },
      companyLogoFileId: 0,
      companyLogo: {},
      companyAddress: "",
      companyHouseNr: "",
      companyHouseNrAddition: "",
      companyPostCode: "",
      companyCity: "",
      companyState: "",
      companyCountryType: 0,
      companyPhoneNumber: "",
      companyMobileNumber: "",
      companyFaxNumber: "",
      companyEmailAddress: "",
      companyWebUrl: "",
      companyPostbus: "",
      companyPostbusPostCode: "",
      companyPostbusCity: "",
      companyPostbusCountryType: 0,
      bankAccountCompanyType: 0,
      accountHolderName: "",
      accountNrIBAN: "",
      accountNrIBANValidated: true,
      contactGenderType: 0,
      contactFirstName: "",
      contactBetweenName: "",
      contactLastName: "",
      contactEmailAddress: "",
      contactPhoneNumber: "",
      contactMobileNumber: "",
    },
    validationSchema: Yup.object().shape({
      tradeName: Yup.string()
        .min(
          3,
          intl
            .formatMessage({ id: "Common.ValidationMin" })
            .replace("{0}", intl.formatMessage({ id: "Fields.Title" }))
            .replace("{1}", `3`)
        )
        .max(
          50,
          intl
            .formatMessage({ id: "Common.ValidationMax" })
            .replace("{0}", intl.formatMessage({ id: "Fields.Title" }))
            .replace("{1}", `50`)
        )
        .required(
          intl
            .formatMessage({ id: "Common.RequiredFieldHint2" })
            .replace(
              "{0}",
              intl.formatMessage({ id: "Fields.CompanyTradeNameId" })
            )
        ),
      accountNrIBAN: Yup.string().required(
        intl
          .formatMessage({ id: "Common.RequiredFieldHint2" })
          .replace("{0}", intl.formatMessage({ id: "Fields.AccountNrIBAN" }))
      ),
      // .matches(
      //   /\bGB\d{2}[A-Z]{4}\d{14}\b/,
      //   intl
      //     .formatMessage({ id: "Common.InvalidFormat" })
      //     .replace("{0}", intl.formatMessage({ id: "Fields.AccountNrIBAN" }))
      // )
      accountHolderName: Yup.string().required(
        intl
          .formatMessage({ id: "Common.RequiredFieldHint2" })
          .replace(
            "{0}",
            intl.formatMessage({ id: "Fields.AccountHolderName" })
          )
      ),
      bankAccountCompanyType: Yup.number().required(
        intl
          .formatMessage({ id: "Common.RequiredFieldHint2" })
          .replace(
            "{0}",
            intl.formatMessage({ id: "Fields.BankAccountCompanyType" })
          )
      ),
    }),

    onSubmit: async (values, { setSubmitting }) => {
      setIsSubmitting(true);
      try {
        // if (values.companyLogo.downloadInfo.downloadUrl === "") {
        //   values.companyLogo = {};
        // }
        const response = await postTradename(values);
        if (response.isValid) {
          formik.resetForm();
          setAddModalOpen(false);
          setRefresh(!refresh);
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
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        let res;
        if (tradeNameId != 0) {
          res = await getTradenameById(tradeNameId);
        } else {
          return;
        }
        formik.setValues({
          ...formik.values,
          ...res.result, // Merge the response with the existing form values
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [tradeNameId, refresh]);
  const tabs = [
    {
      id: "tab1",
      label: intl.formatMessage({
        id: "Fields.CompanyEditTabCommon",
      }),
      icon: "ki-solid ki-office-bag fs-2 hippo-tab-icon",
    },
    {
      id: "tab2",
      label: intl.formatMessage({
        id: "Fields.CompanyEditTabContact",
      }),
      icon: "ki-solid ki-home fs-2 hippo-tab-icon",
    },
  ];

  const [activeTab, setActiveTab] = useState(tabs[0]);
  const handleTabClick = (tab: any) => {
    setActiveTab(tab);
  };
  return (
    <>
      <div
        className="modal fade show d-block"
        tabIndex={-1}
        role="dialog"
        id="kt_modal_1"
        aria-modal="true"
      >
        <div className="modal-dialog mw-700px">
          <div className="modal-content">
            <TradeNamesAddModalHeader
              setAddModalOpen={setAddModalOpen}
              tradeNameId={tradeNameId}
            />
            <CustomTabManager
              tabs={tabs}
              activeTab={activeTab}
              onTabClick={handleTabClick}
              hasOptions={false}
              hasSubscriptions={false}
            />
            <div className="modal-body p-10">
              <div className="hippo-tab-content" id="myTabContent">
                {activeTab.id === "tab1" && (
                  <TradeNamesCompanyDetails
                    formik={formik}
                    setAttachmentsModalOpen={setAttachmentsModalOpen}
                  />
                )}
                {activeTab.id === "tab2" && (
                  <ContactAndAddress formik={formik} />
                )}
              </div>
            </div>
            <TradeNamesAddModalFooter
              formik={formik}
              isSubmitting={isSubmitting}
              setAddModalOpen={setAddModalOpen}
            />
          </div>
        </div>
      </div>
      {isLoading && <ListLoading />}
      {attachmentsModalOpen && (
        <AttachmentsModal
          formik={formik}
          setAttachmentsModalOpen={setAttachmentsModalOpen}
          type="companyLogo"
          info="Fields.ImageUploadModuleInfo"
        />
      )}
      <div className="modal-backdrop fade show"></div>
    </>
  );
};

export { TradeNamesAddModal };
