import { useEffect, useState } from "react";
import { ClientAddModalHeader } from "./ClientAddModalHeader";
import { ClientAddModalFooter } from "./ClientAddModalFooter";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useIntl } from "react-intl";
import { getClientById, getDefaultEmpty, postClient } from "../core/_requests";
import { ClientAddModalForm } from "./ClientAddModalForm";
import { handleToast } from "../../../../auth/core/_toast";
import { useAuth } from "../../../../auth";
interface Props {
  setRefresh: (type: boolean) => void;
  refresh: boolean;
  setAddModalOpen: (type: boolean) => void;
  setEditModalOpen: (type: boolean) => void;
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
  setEditModalOpen,
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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const intl = useIntl();
  const auth = useAuth();
  const [showTabs, setShowTabs] = useState(false);
  const [response, setResponse] = useState<any>([]);

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
      id: 0,
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
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setIsSubmitting(true);
      try {
        const response = await postClient(values);
        if (response.isValid) {
          formik.resetForm();
          // setAddModalOpen(false);
          setRefresh(true);
          // setShowTabs(true);
          formik.resetForm();
          setResponse(response.result);
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
      let res;
      if (editModalId != 0) {
        res = await getClientById(editModalId);
      } else {
        res = await getDefaultEmpty();
        console.log(res);
      }
      setResponse(res.result);
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
              setEditModalOpen={setEditModalOpen}
              businessName={response?.businessName}
              customerNr={response?.customerNr}
              setAddModalOpen={setAddModalOpen}
              showTabs={showTabs}
              setEditModalId={setEditModalId}
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
              setEditModalOpen={setEditModalOpen}
              setAddModalOpen={setAddModalOpen}
              deleteModalOpen={deleteModalOpen}
              response={response}
              setEditModalId={setEditModalId}
              editModalId={editModalId}
            />

            <ClientAddModalFooter />
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  );
};

export { ClientAddModal };
