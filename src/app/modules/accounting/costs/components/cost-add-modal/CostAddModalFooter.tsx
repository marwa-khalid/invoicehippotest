import { useIntl } from "react-intl";
import { FormikProps } from "formik";
import { CostPostResult } from "../core/_models";

interface Props {
  isSubmitting: boolean;
  setAddModalOpen: (type: boolean) => void;
  formik: FormikProps<CostPostResult>;
  setAction: (type: number) => void;
  attachmentsModalOpen: boolean;
  setAttachmentsModalOpen: (type: boolean) => void;
  hasMutation: boolean;
}
const CostAddModalFooter = ({
  isSubmitting,
  setAddModalOpen,
  setAction,
  formik,
  attachmentsModalOpen,
  setAttachmentsModalOpen,
  hasMutation,
}: Props) => {
  const intl = useIntl();

  return (
    <div className="modal-footer d-flex justify-content-between">
      <div className="btn-group" role="group">
        <button
          type="button"
          className="btn btn-primary d-flex align-items-center"
          onClick={() => setAttachmentsModalOpen(true)}
        >
          <i className="fas fa-upload me-2"></i>
          {intl.formatMessage({
            id: "Fields.ActionPickerAddAttachment",
          })}
        </button>
      </div>
      <div className="text-end">
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
        {hasMutation ? (
          <button
            type="button"
            className="btn btn-warning me-3"
            onClick={() => {
              formik.handleSubmit();
              setAction(1);
            }}
          >
            <i className="fa fas fa-save fs-2 me-2"></i>
            {intl.formatMessage({ id: "Fields.ActionSave" })}
          </button>
        ) : (
          <div className="btn-group dropup">
            <button
              type="submit"
              className={`btn btn-warning me-3 ${
                !isSubmitting && "dropdown-toggle"
              } d-flex align-items-center`}
              data-bs-toggle="dropdown"
              aria-expanded="false"
              disabled={!formik.isValid || isSubmitting}
            >
              <i className="fa fas fa-save fs-2 me-2"></i>

              {isSubmitting ? (
                <span className="indicator-progress d-flex align-items-center">
                  {intl.formatMessage({ id: "Common.Busy" })}
                  <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                </span>
              ) : (
                intl.formatMessage({ id: "Common.DefaultSaveButtonText" })
              )}
            </button>

            <ul className="dropdown-menu w-content-fit py-4">
              <li
                onClick={() => {
                  formik.handleSubmit();
                }}
              >
                <a className="dropdown-item d-flex align-items-center cursor-pointer">
                  <i className="fa fas fa-save fs-2 me-2"></i>
                  {intl.formatMessage({ id: "Fields.ActionSave" })}
                </a>
              </li>
              <div className="dropdown-divider border-gray-200"></div>
              <li
                onClick={() => {
                  formik.handleSubmit();
                  setAction(1);
                }}
              >
                <a className="dropdown-item d-flex align-items-center text-center cursor-pointer">
                  <i className="fa fas fa-save fs-2 me-2"></i>

                  {intl.formatMessage({ id: "Fields.ActionSaveAndClose" })}
                </a>
              </li>
              <div className="dropdown-divider border-gray-200"></div>

              <li
                onClick={() => {
                  formik.handleSubmit();
                  setAction(2);
                }}
              >
                <a className="dropdown-item d-flex align-items-center cursor-pointer">
                  <i className="fa fas fa-save fs-2 me-2"></i>{" "}
                  {intl.formatMessage({ id: "Fields.ActionSaveAndNew" })}
                </a>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export { CostAddModalFooter };
