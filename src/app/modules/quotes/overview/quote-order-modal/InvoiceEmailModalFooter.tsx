import { useIntl } from "react-intl";
import { FormikProps } from "formik";

interface FormValues {
  quoteId: number;
  expectedDeliveryDate: string;
  sendNotification: boolean;
  emailOptions: {
    sendToClient: boolean;
    sendMeAnCopy: boolean;
    extraToRecipients: any;
    extraCcRecipients: any;
    extraBccRecipients: any;
  };
}
interface ComponentProps {
  setEmailModalOpen: (type: boolean) => void;
  formik: FormikProps<FormValues>;
  isSubmitting: boolean;
}

const InvoiceEmailModalFooter = ({
  setEmailModalOpen,
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
            setEmailModalOpen(false);
            localStorage.removeItem("ModalData");
          }}
          className="btn btn-secondary me-3"
        >
          {intl.formatMessage({ id: "Fields.ActionClose" })}
        </button>

        {/* Save Button */}
        <button
          type="submit"
          className="btn btn-primary"
          onClick={() => formik.handleSubmit()}
          disabled={!formik.isValid || isSubmitting || !formik.touched}
        >
          {
            !isSubmitting && "create"
            // intl.formatMessage({ id: "Fields.ActionSendEmail" })
          }
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

export { InvoiceEmailModalFooter };
