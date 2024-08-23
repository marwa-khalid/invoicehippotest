import { useEffect, useState } from "react";
import { FinancialAddModalHeader } from "./FinancialAddModalHeader";
import { FinancialAddModalFooter } from "./FinancialAddModalFooter";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useIntl } from "react-intl";
import { postFinancialAccount } from "../core/_requests";
import FinancialAddModalForm from "./FinancialAddModalForm";
import { handleToast } from "../../../../auth/core/_toast";
interface Props {
  setRefresh: (type: boolean) => void;
  setAddModalOpen: (type: boolean) => void;
}
const FinancialAddModal = ({ setRefresh, setAddModalOpen }: Props) => {
  useEffect(() => {
    document.body.classList.add("modal-open");
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, []);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const intl = useIntl();

  const formik = useFormik({
    initialValues: {
      customFields: [
        {
          fieldLabel: "",
          fieldInfo: "",
          groupDisplayName: "",
          options: [],
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
            asOptions: [],
          },
        },
      ],
      id: 0,
      companyId: 0,
      customerNr: "",
      importReference: "",
      businessName: "",
      kvkNr: "",
      btwNr: "",
      isPrivateClient: false,
      factoringSessionStatement: "",
      clientTypes: [],
      financialSettings: {
        bankAccountCompanyType: 0,
        accountIbanNr: "",
        accountHolderName: "",
        hasSepaMandate: false,
        sepaMandateDate: "",
        sepaMandateReference: "",
      },
      invoiceAndQuoteSettings: {
        defaultDeadlineDaysForPayment: 0,
        defaultVatTypeId: 0,
        defaultLedgerAccountId: 0,
        extraCcEmailAddressesInvoice: [],
        extraCcEmailAddressesQuotes: [],
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
      accountType: Yup.number().required(
        intl
          .formatMessage({ id: "Common.RequiredFieldHint2" })
          .replace("{0}", intl.formatMessage({ id: "Fields.AccountType" }))
      ),
      accountName: Yup.string()
        .min(
          3,
          intl
            .formatMessage({ id: "Common.ValidationMin" })
            .replace("{0}", intl.formatMessage({ id: "Fields.AccountName" }))
            .replace("{1}", `3`)
        )
        .max(
          50,
          intl
            .formatMessage({ id: "Common.ValidationMax" })
            .replace("{0}", intl.formatMessage({ id: "Fields.AccountName" }))
            .replace("{1}", `50`)
        )
        .required(
          intl
            .formatMessage({ id: "Common.RequiredFieldHint2" })
            .replace("{0}", intl.formatMessage({ id: "Fields.AccountName" }))
        ),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setIsSubmitting(true);
      try {
        // const response = await postFinancialAccount(
        //   values.id,
        //   values.accountName,
        //   values.accountNumber,
        //   values.ledgerAccountId,
        //   values.bankConnectMinImportDate,
        //   values.autoCreateLedgerAccount,
        //   values.accountType,
        //   values.bankAccountCompanyType,
        //   values.afterSaveModel,
        //   values.bankConnectInfo
        // );
        // if (response.isValid) {
        //   formik.resetForm();
        //   setAddModalOpen(false);
        //   setRefresh(true);
        // }
        // handleToast(response);
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
            <FinancialAddModalHeader setAddModalOpen={setAddModalOpen} />

            <FinancialAddModalForm
              // formik={formik}
              isSubmitting={isSubmitting}
            />

            <FinancialAddModalFooter
              // formik={formik}
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

export { FinancialAddModal };
