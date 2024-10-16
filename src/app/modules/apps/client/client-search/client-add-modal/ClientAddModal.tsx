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
import { ClientAddModalForm } from "./ClientAddModalForm";
import { handleToast } from "../../../../auth/core/_toast";
import { useAuth } from "../../../../auth";
import { toast } from "react-toastify";
interface Props {
  setRefresh: (type: boolean) => void;
  refresh: boolean;
  setAddModalOpen: (type: boolean) => void;
  setDeleteModalId: (type: number[]) => void;
  setDeleteModalOpen: (type: boolean) => void;
  setTitle: (type: string) => void;
  setIntlMessage: (type: string) => void;
  deleteModalOpen: boolean;
  editModalId: number;
  setEditModalId: (type: number) => void;
}
const ClientAddModal = ({
  setRefresh,
  refresh,
  setEditModalId,
  setAddModalOpen,
  setDeleteModalId,
  setDeleteModalOpen,
  setIntlMessage,
  setTitle,
  editModalId,
  deleteModalOpen,
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
          setRefresh(!refresh);
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
            setRefresh(!refresh);
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
        }
        handleToast(response);

        if (close) {
          setAddModalOpen(false);
        }
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
  }, [formik.values.id, refresh]);
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
              disableTabs={disableTabs}
              hideTab4={hideTab4}
            />

            <ClientAddModalForm
              formik={formik}
              refresh={refresh}
              isSubmitting={isSubmitting}
              setIsSubmitting={setIsSubmitting}
              setDeleteModalOpen={setDeleteModalOpen}
              setDeleteModalId={setDeleteModalId}
              setIntlMessage={setIntlMessage}
              setTitle={setTitle}
              setAddModalOpen={setAddModalOpen}
              deleteModalOpen={deleteModalOpen}
              response={response}
              setResponse={setResponse}
            />

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
