import { useState } from "react";
import { useIntl } from "react-intl";
import { deleteQuoteList } from "../core/_requests";

import { handleToast } from "../../../../auth/core/_toast";
import { FormikProps } from "formik";

interface FormValues {
  quoteId: number;
  overrideNotificationType: number;
  finalizeQuote: boolean;
  emailOptions: {
    sendToClient: boolean;
    sendMeAnCopy: boolean;
    extraToRecipients: any;
    extraCcRecipients: any;
    extraBccRecipients: any;
  };
  actionType: number;
  adjustQuoteDateToToday: boolean;
}
interface ComponentProps {
  setValidateModalOpen: (type: boolean) => void;

  formik: FormikProps<FormValues>;
  isSubmitting: boolean;
}

const QuoteEmailModalFooter = ({
  setValidateModalOpen,
  formik,
  isSubmitting,
}: ComponentProps) => {
  // For localization support
  const intl = useIntl();

  return (
    <div className="modal-footer d-flex justify-content-end align-items-center ">
      <div className="d-flex">
        {/* Cancel Button */}
        <button
          type="reset"
          onClick={() => {
            setValidateModalOpen(false);
            localStorage.removeItem("ModalData");
          }}
          className="btn btn-secondary me-3"
        >
          {intl.formatMessage({ id: "Fields.ActionClose" })}
        </button>

        {/* Save Button */}
        <button
          type="submit"
          className="btn btn-success"
          onClick={() => formik.handleSubmit()}
          disabled={!formik.isValid || isSubmitting || !formik.touched}
        >
          {!isSubmitting &&
            intl.formatMessage({ id: "Fields.ActionSendEmail" })}
          {isSubmitting && (
            <span className="indicator-progress" style={{ display: "block" }}>
              {intl.formatMessage({ id: "Common.Busy" })}
              <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export { QuoteEmailModalFooter };
