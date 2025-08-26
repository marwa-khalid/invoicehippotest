import { useIntl } from "react-intl";
import { FormikProps } from "formik";
import { LocalizationPost, TemplatePost } from "../core/_models";

interface Props {
  isSubmitting: boolean;
  setAddModalOpen: (type: boolean) => void;
  formik: FormikProps<TemplatePost>;
}
const TemplateAddModalFooter = ({
  isSubmitting,
  setAddModalOpen,
  formik,
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

      <button
        type="button"
        className="btn btn-primary me-3"
        onClick={() => {
          formik.handleSubmit();
        }}
      >
        <i className="fa fas fa-save fs-2 me-2"></i>
        {intl.formatMessage({ id: "Fields.ActionSave" })}
      </button>
    </div>
  );
};

export { TemplateAddModalFooter };
