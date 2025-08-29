import { useState } from "react";
import { useIntl } from "react-intl";
import { createCopy } from "../core/_requests";
import { handleToast } from "../../../auth/core/_toast";
import { FormikProps } from "formik";
import { InvoicePostResult } from "../core/_models";

interface ComponentProps {
  invoiceId: number;
  setRecurringModalOpen: (type: boolean) => void;
  formik: FormikProps<InvoicePostResult>;
}

const QuoteCopyModalFooter = ({
  invoiceId,
  setRecurringModalOpen,
  formik,
}: ComponentProps) => {
  // For localization support
  const intl = useIntl();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const save = async () => {
    setIsSubmitting(true);
    const response = await createCopy(
      invoiceId,
      formik.values.automationSettings.enableAutomation
    );
    if (response.isValid) {
      setRecurringModalOpen(false);
      setIsSubmitting(false);
    }
    handleToast(response);
    setIsSubmitting(false);
  };
  return (
    <div className="modal-footer d-flex justify-content-end align-items-center ">
      <div className="d-flex">
        {/* Cancel Button */}
        <button
          type="reset"
          onClick={() => {
            setRecurringModalOpen(false);
          }}
          className="btn btn-secondary me-3"
        >
          {intl.formatMessage({ id: "Fields.ActionClose" })}
        </button>

        {/* Save Button */}
        <button
          type="submit"
          className="btn btn-dark"
          onClick={save}
          //   disabled={!isValid || isSubmitting || !touched}
        >
          {!isSubmitting && intl.formatMessage({ id: "Fields.ActionSave" })}
          {isSubmitting && (
            <span className="indicator-progress" style={{ display: "block" }}>
              <span
                dangerouslySetInnerHTML={{
                  __html: intl.formatMessage({ id: "Common.Busy" }),
                }}
              />
              <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export { QuoteCopyModalFooter };
