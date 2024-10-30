import { useEffect, useState } from "react";
import { ClientAddModalHeader } from "./ClientAddModalHeader";
import { ClientAddModalFooter } from "./ClientAddModalFooter";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useIntl } from "react-intl";
import {
  getClientById,
  getDefaultEmpty,
  postClient,
  postContact,
} from "../core/_requests";
import { handleToast } from "../../../../auth/core/_toast";
import { useAuth } from "../../../../auth";
import { toast } from "react-toastify";
import { ClientAddStep4 } from "./ClientAddStep4";
import { ClientAddStep3 } from "./ClientAddStep3";
import { ClientAddStep2 } from "./ClientAddStep2";
import { ClientAddStep1 } from "./ClientAddStep1";
interface Props {
  setRefresh: (type: boolean) => void;
  refresh: boolean;
  setAddModalOpen: (type: boolean) => void;
  editModalId: number;
  setEditModalId: (type: number) => void;
}
const ClientAddModal = ({
  setRefresh,
  refresh,
  setEditModalId,
  setAddModalOpen,
  editModalId,
}: Props) => {
  useEffect(() => {
    document.body.classList.add("modal-open");
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, []);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitting2, setIsSubmitting2] = useState<boolean>(false);

  const intl = useIntl();
  const auth = useAuth();
  const [response, setResponse] = useState<any>([]);
  const [disableTabs, setDisableTabs] = useState(true);
  const [close, setClose] = useState(false);

  const tabs = [
    {
      id: "tab1",
      label: intl.formatMessage({ id: "Fields.ClientSettings" }),
      icon: <i className="fa-regular fa-address-book fs-3 hippo-tab-icon"></i>,
    },
    {
      id: "tab2",
      label: intl.formatMessage({ id: "Fields.ContactPersonSettings" }),
      icon: <i className="fa-solid fa-file-invoice fs-3 hippo-tab-icon"></i>,
    },
    {
      id: "tab3",
      label: "overige instellingen",
      icon: (
        <i className="fa-regular fa-closed-captioning fs-3 hippo-tab-icon"></i>
      ),
    },
    {
      id: "tab4",
      label: intl.formatMessage({ id: "Fields.SideMenuCustomFeatures" }),
      icon: <i className="fa-solid fa-file-invoice fs-3 hippo-tab-icon"></i>,
    },
  ];

  const [activeTab, setActiveTab] = useState(tabs[0]);

  const handleTabClick = (tab: any) => {
    setActiveTab(tab);
  };
  const formik = useFormik({
    initialValues: {
      customFields: [
        {
          fieldLabel: "",
          fieldInfo: "",
          groupDisplayName: "",
          options: [""],
          fieldType: {
            value: 0,
            description: "",
            name: "",
          },
          fieldId: 0,
          value: {
            asDate: "",
            asText: "",
            asMoney: 0,
            asNumber: 0,
            asOptions: [""],
          },
        },
      ],
      id: response?.id || 0,
      companyId: auth.currentUser?.result.activeCompany.id || 0,
      customerNr: "",
      importReference: "",
      businessName: "",
      kvkNr: "",
      btwNr: "",
      isPrivateClient: true,
      factoringSessionStatement: "",
      clientTypes: [0],
      financialSettings: {
        bankAccountCompanyType: 0,
        accountIbanNr: "",
        accountHolderName: "",
        hasSepaMandate: true,
        sepaMandateDate: "",
        sepaMandateReference: "",
      },
      invoiceAndQuoteSettings: {
        defaultDeadlineDaysForPayment: 0,
        defaultVatTypeId: 0,
        defaultLedgerAccountId: 0,
        extraCcEmailAddressesInvoice: [""],
        extraCcEmailAddressesQuotes: [""],
        costDefaultLedgerAccountId: 0,
        costDefaultVatTypeId: 0,
        costDefaultReference: "",
        costDefaultLineReference: "",
      },
      invoiceAddress: {
        id: 0,
        streetName: "",
        houseNr: "",
        houseNrAddition: "",
        postCode: "",
        city: "",
        countryType: 0,
      },
      deliveryAddress: {
        id: 0,
        streetName: "",
        houseNr: "",
        houseNrAddition: "",
        postCode: "",
        city: "",
        countryType: 0,
      },
      contactlist: {
        contacts: [
          {
            id: 0,
            clientId: 0,
            isDefaultContact: true,
            firstName: "",
            betweenName: "",
            lastName: "",
            addressingType: 0,
            emailAddress: "",
            phoneNr: "",
            mobileNr: "",
            department: "",
          },
        ],
        listOfDeletedClientContactIDs: [0],
      },
      hasCustomFields: false,
    },
    validationSchema: Yup.object().shape({
      businessName: Yup.string()
        .min(
          3,
          intl
            .formatMessage({ id: "Common.ValidationMin" })
            .replace("{0}", intl.formatMessage({ id: "Fields.CompanyName" }))
            .replace("{1}", `3`)
        )
        .max(
          50,
          intl
            .formatMessage({ id: "Common.ValidationMax" })
            .replace("{0}", intl.formatMessage({ id: "Fields.CompanyName" }))
            .replace("{1}", `50`)
        )
        .required(
          intl
            .formatMessage({ id: "Common.RequiredFieldHint2" })
            .replace("{0}", intl.formatMessage({ id: "Fields.CompanyName" }))
        ),
      "financialSettings.accountIbanNr": Yup.string().matches(
        /^([A-Z]{2}[0-9]{2})(?:[ ]?[0-9A-Z]{4}){3}(?:[ ]?[0-9A-Z]{1,2})?$/,
        intl
          .formatMessage({ id: "Common.InvalidFormat" })
          .replace("{0}", intl.formatMessage({ id: "Fields.AccountNrIBAN" }))
      ),
      contactlist: Yup.object().shape({
        contacts: Yup.array().of(
          Yup.object().shape({
            firstName: Yup.string().nullable(),
            lastName: Yup.string().nullable(),
            emailAddress: Yup.string()
              .nullable()
              .email(
                intl
                  .formatMessage({ id: "Common.InvalidFormat" })
                  .replace("{0}", "Email")
              ),
            phoneNr: Yup.string()
              .nullable() // Allow null values
              .matches(
                /^\+?\d{1,4}\s?\(?\d{1,4}\)?\s?\d{1,4}\s?\d{1,4}\s?\d{4,15}$/,
                intl
                  .formatMessage({ id: "Common.InvalidFormat" })
                  .replace("{0}", intl.formatMessage({ id: "Fields.PhoneNr" }))
              ),
            mobileNr: Yup.string()
              .nullable() // Allow null values
              .matches(
                /^\+?\d{1,4}\s?\(?\d{1,4}\)?\s?\d{1,4}\s?\d{1,4}\s?\d{4,15}$/,
                intl
                  .formatMessage({ id: "Common.InvalidFormat" })
                  .replace("{0}", intl.formatMessage({ id: "Fields.MobileNr" }))
              ),
          })
        ),
      }),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      if (close) {
        setIsSubmitting2(true);
      } else {
        setIsSubmitting(true);
      }

      try {
        if (values.contactlist.contacts.length === 0) {
          toast.error("At least one contact is required.");
          return; // Stop execution here
        }

        const response = await postClient(values);
        if (response.isValid) {
          // formik.resetForm();

          // formik.resetForm();
          setEditModalId(response.result.id);

          setResponse(response.result);
          localStorage.setItem(
            "clientResponse",
            JSON.stringify(response.result)
          );
          let postContactsPromise;
          values.contactlist.contacts.forEach(
            (contact) => (contact.clientId = response.result.id)
          );

          // return;
          if (values.contactlist.contacts.length > 0) {
            postContactsPromise = await postContact(values.contactlist);
          }
          if (postContactsPromise?.isValid) {
            // formik.resetForm();

            // formik.resetForm();
            localStorage.setItem(
              "contactResponse",
              JSON.stringify(postContactsPromise.result)
            );
            // setEditModalId(response.result.id);
            // setResponse(response.result);
            // setDisableTabs(false);
          } else {
            handleToast(postContactsPromise);
          }

          if (close) {
            setAddModalOpen(false);
            setRefresh(!refresh);
          }
        }
        handleToast(response);
      } catch (error) {
        console.error("Post failed:", error);
      } finally {
        setIsSubmitting(false);
        setIsSubmitting2(false);
        setSubmitting(false);
      }
    },
  });

  const [hideTab4, setHideTab4] = useState(false);
  useEffect(() => {
    const fetchInitialData = async () => {
      let res;
      if (editModalId != 0) {
        res = await getClientById(editModalId);
        setDisableTabs(false);
      } else {
        res = await getDefaultEmpty();
      }
      setResponse(res.result);
      if (!res.result.hasCustomFields) {
        setHideTab4(true);
      }
    };

    fetchInitialData();
  }, []);
  useEffect(() => {
    if (response) {
      formik.setValues({
        ...formik.values,
        ...response, // Merge the response with the existing form values
      });
    }
  }, [response]);
  useEffect(() => {
    if (formik.errors.businessName) {
      setDisableTabs(true);
    } else {
      setDisableTabs(false);
    }
  }, [formik.errors.businessName]);
  return (
    <>
      <div
        className="modal fade show d-block"
        tabIndex={-1}
        role="dialog"
        id="client_add_modal"
        aria-modal="true"
      >
        <div className="modal-dialog mw-800px">
          <div className="modal-content">
            <ClientAddModalHeader
              businessName={response?.businessName}
              customerNr={response?.customerNr}
              setAddModalOpen={setAddModalOpen}
            />
            <div className="hippo-tab-manager d-flex justify-content-between p-5 flex-grow-1 bg-secondary">
              <div className="d-flex justify-content-start">
                {tabs.map((tab: any) => (
                  <>
                    {!(tab.id === "tab4" && hideTab4) && (
                      <button
                        key={tab.id}
                        onClick={() => {
                          handleTabClick(tab);
                        }}
                        className={`btn bg-light border-0 mx-2 px-4 ${
                          activeTab.id === tab.id
                            ? "hippo-selected-tab text-white bg-dark"
                            : "text-gray bg-body"
                        }  `}
                        data-bs-toggle="tab"
                        style={{ borderBottomColor: "1px solid black" }}
                      >
                        {tab.icon}
                        <span className="me-1">|</span>
                        {tab.label}
                      </button>
                    )}
                  </>
                ))}
              </div>
            </div>
            <div className="hippo-tab-content" id="myTabContent">
              {activeTab.id === "tab1" && (
                <ClientAddStep1
                  formik={formik}
                  isSubmitting={isSubmitting}
                  setAddModalOpen={setAddModalOpen}
                  setResponse={setResponse}
                />
              )}

              {activeTab.id === "tab2" && (
                <ClientAddStep2
                  clientId={response?.id}
                  refresh={refresh}
                  formik={formik}
                  // setDeleteModalOpen={setDeleteModalOpen}
                  // setDeleteModalId={setDeleteModalId}
                  // setIntlMessage={setIntlMessage}
                  // setTitle={setTitle}
                  // deleteModalOpen={deleteModalOpen}
                />
              )}
              {activeTab.id === "tab3" && (
                <ClientAddStep3
                  setIsSubmitting={setIsSubmitting}
                  isSubmitting={isSubmitting}
                  formik={formik}
                  setAddModalOpen={setAddModalOpen}
                />
              )}

              {activeTab.id === "tab4" && !hideTab4 && (
                <ClientAddStep4
                  setIsSubmitting={setIsSubmitting}
                  isSubmitting={isSubmitting}
                  formik={formik}
                  setAddModalOpen={setAddModalOpen}
                />
              )}
            </div>

            <ClientAddModalFooter
              formik={formik}
              setAddModalOpen={setAddModalOpen}
              isSubmitting={isSubmitting}
              isSubmitting2={isSubmitting2}
              setClose={setClose}
            />
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  );
};

export { ClientAddModal };
