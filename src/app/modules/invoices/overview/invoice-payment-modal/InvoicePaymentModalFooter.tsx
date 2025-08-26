import { useIntl } from "react-intl";
import { FormikProps } from "formik";

interface ComponentProps {
  setPaymentModalOpen: (type: boolean) => void;
  formik: FormikProps<any>;
  isSubmitting: boolean;
}

const InvoicePaymentModalFooter = ({
  setPaymentModalOpen,
  formik,
  isSubmitting,
}: ComponentProps) => {
  // For localization support
  const intl = useIntl();

  return (
    <div className="modal-footer d-flex justify-content-end align-items-center">
      <div className="d-flex">
        {/* Cancel Button */}
        <button
          type="reset"
          onClick={() => {
            setPaymentModalOpen(false);
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
          disabled={!formik.isValid || isSubmitting}
        >
          {!isSubmitting && intl.formatMessage({ id: "Fields.ActionPayment" })}
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

export { InvoicePaymentModalFooter };
