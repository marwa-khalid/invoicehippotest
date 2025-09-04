import { useEffect, useState } from "react";
import { BankLinkModalHeader } from "./BankLinkModalHeader";
import { BankLinkModalFooter } from "./BankLinkModalFooter";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useIntl } from "react-intl";
import { postAccounAutomation, postFinancialAccount } from "../core/_requests";
import BankLinkModalForm from "./BankLinkModalForm";
import { handleToast } from "../../../auth/core/_toast";
import { useAuth } from "../../../auth";
interface Props {
  setRefresh: (type: boolean) => void;
  setLinkModalOpen: (type: boolean) => void;
  refresh: boolean;
}
const BankLinkModal = ({ setRefresh, setLinkModalOpen, refresh }: Props) => {
  useEffect(() => {
    document.body.classList.add("modal-open");
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, []);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const intl = useIntl();
  const auth = useAuth();

  const formik = useFormik({
    initialValues: {
      companyId: auth.currentUser?.result.activeCompany.id || 0,
      importDateMarker: "",
      optionalFinancialInstitutionId: "",
      redirectCommand: {
        successUrl: `${window.location.origin}/banking/connect/success`,
        oopsUrl: `${window.location.origin}/banking/connect`,
      },
    },

    validationSchema: Yup.object().shape({
      importDateMarker: Yup.string().required(
        intl.formatMessage({ id: "Common.RequiredFieldHint2" }).replace(
          "{0}",
          intl.formatMessage({
            id: "Fields.FinancialBankConnectSelectStartPeriod",
          })
        )
      ),
      optionalFinancialInstitutionId: Yup.string().required(
        intl.formatMessage({ id: "Common.RequiredFieldHint2" }).replace(
          "{0}",
          intl.formatMessage({
            id: "Fields.FinancialBankConnectSelectStartPeriod",
          })
        )
      ),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setIsSubmitting(true);
      try {
        const response = await postAccounAutomation(
          values.companyId,
          values.importDateMarker,
          values.optionalFinancialInstitutionId,
          values.redirectCommand
        );

        if (response.isValid) {
          // formik.resetForm();
          // setLinkModalOpen(false);
          setRefresh(!refresh);
          window.location.href = response.result.requestUrlForConsent;
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
