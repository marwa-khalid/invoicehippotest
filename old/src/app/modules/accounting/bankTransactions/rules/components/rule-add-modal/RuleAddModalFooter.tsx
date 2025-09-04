import { useIntl } from "react-intl";
import { FormikProps } from "formik";
import { BookingRuleResult } from "../core/_models";

interface Props {
  isSubmitting: boolean;
  setAddModalOpen: (type: boolean) => void;
  formik: FormikProps<BookingRuleResult>;
  hasMutation: boolean;
}
const RuleAddModalFooter = ({
  isSubmitting,
  setAddModalOpen,
  formik,
  hasMutation,
}: Props) => {
  const intl = useIntl();

  return (
    <div className="modal-footer d-flex justify-content-end">
      <button
        type="button"
        className="btn btn-secondary me-3"
        data-bs-dismiss="modal"
        data-bs-target="booking_add_modal"
        onClick={() => {
          setAddModalOpen(false);
        }}
        disabled={isSubmitting}
      >
        <i className="fa-solid fa-ban me-1 fs-3 text-muted"></i>
        {intl.formatMessage({ id: "Fields.ActionCancel" })}
      </button>
      {hasMutation && (
        <button
          type="button"
          className="btn btn-secondary me-3"
          id="kt_drawer_process_toggle"
          onClick={() => {
            setTimeout(() => {
              setAddModalOpen(false); // delay close to allow drawer JS to read the ID
            }, 100);
          }}
        >
          {intl.formatMessage({ id: "Fields.ActionShowSelectionScreen" })}
        </button>
      )}
      <button
        type="button"
        className="btn btn-primary me-3"
        onClick={() => formik.handleSubmit()}
      >
        <i className="fa fas fa-save fs-2 me-2"></i>
        {intl.formatMessage({ id: "Fields.ActionSave" })}
      </button>
    </div>
  );
};

export { RuleAddModalFooter };
