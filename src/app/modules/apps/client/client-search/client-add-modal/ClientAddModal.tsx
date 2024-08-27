import { useEffect, useState } from "react";
import { ClientAddModalHeader } from "./ClientAddModalHeader";
import { ClientAddModalFooter } from "./ClientAddModalFooter";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useIntl } from "react-intl";
import { postClient } from "../core/_requests";
import { ClientAddModalForm } from "./ClientAddModalForm";
import { handleToast } from "../../../../auth/core/_toast";
import { useAuth } from "../../../../auth";
interface Props {
  setRefresh: (type: boolean) => void;
  setAddModalOpen: (type: boolean) => void;
  setDeleteModalId: (type: number[]) => void;
  setDeleteModalOpen: (type: boolean) => void;
  setTitle: (type: string) => void;
  setIntlMessage: (type: string) => void;
  deleteModalOpen: boolean;
}
const ClientAddModal = ({
  setRefresh,
  setAddModalOpen,
  setDeleteModalId,
  setDeleteModalOpen,
  setIntlMessage,
  setTitle,
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
  const [clientId, setClientId] = useState(0);
  console.log(auth.currentUser?.result.activeCompany.id);
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
    validationSchema: Yup.object().shape({}),
    onSubmit: async (values, { setSubmitting }) => {
      setIsSubmitting(true);
      try {
        const response = await postClient(values);
        if (response.isValid) {
          formik.resetForm();
          // setAddModalOpen(false);
          setRefresh(true);
          setShowTabs(true);
          setClientId(response.result.id);
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

  return (
    <>
      <div
        className="modal fade show d-block"
        tabIndex={-1}
        role="dialog"
        id="kt_modal_1"
        aria-modal="true"
      >
        <div className="modal-dialog mw-800px">
          <div className="modal-content">
            <ClientAddModalHeader
              setAddModalOpen={setAddModalOpen}
              showTabs={showTabs}
            />

            <ClientAddModalForm
              formik={formik}
              isSubmitting={isSubmitting}
              showTabs={showTabs}
              clientId={clientId}
              setDeleteModalOpen={setDeleteModalOpen}
              setDeleteModalId={setDeleteModalId}
              setIntlMessage={setIntlMessage}
              setTitle={setTitle}
              deleteModalOpen={deleteModalOpen}
            />

            <ClientAddModalFooter
              formik={formik}
              isSubmitting={isSubmitting}
              setAddModalOpen={setAddModalOpen}
            />
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  );
};

export { ClientAddModal };
