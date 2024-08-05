import { useEffect, useState } from "react";
import { BankLinkModalHeader } from "./BankLinkModalHeader";
import { BankLinkModalFooter } from "./BankLinkModalFooter";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useIntl } from "react-intl";
import { postFinancialAccount } from "../core/_requests";
import BankLinkModalForm from "./BankLinkModalForm";
import { handleToast } from "../../../../auth/core/_toast";
interface Props {
  setRefresh: (type: boolean) => void;
  setLinkModalOpen: (type: boolean) => void;
}
const BankLinkModal = ({ setRefresh, setLinkModalOpen }: Props) => {
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
      id: 0,
      accountName: "",
      accountNumber: "",
      ledgerAccountId: 0,
      bankConnectMinImportDate: null,
      accountType: 0,
      autoCreateLedgerAccount: true,
      bankAccountCompanyType: 0,
      afterSaveModel: {
        ledgerAccountDisplayName: "",
      },
      bankConnectInfo: {
        isConnected: false,
        isActive: false,
        accessExpirtationDate: null,
        lastSyncRequestDate: null,
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
        const response = await postFinancialAccount(
          values.id,
          values.accountName,
          values.accountNumber,
          values.ledgerAccountId,
          values.bankConnectMinImportDate,
          values.autoCreateLedgerAccount,
          values.accountType,
          values.bankAccountCompanyType,
          values.afterSaveModel,
          values.bankConnectInfo
        );

        if (response.isValid) {
          formik.resetForm();
          setLinkModalOpen(false);
          setRefresh(true);
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
        <div className="modal-dialog mw-500px">
          <div className="modal-content">
            <BankLinkModalHeader setAddModalOpen={setLinkModalOpen} />
            <div className="modal-body p-10">
              <BankLinkModalForm formik={formik} isSubmitting={isSubmitting} />
            </div>
            <BankLinkModalFooter
              formik={formik}
              isSubmitting={isSubmitting}
              setAddModalOpen={setLinkModalOpen}
            />
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  );
};

export { BankLinkModal };
