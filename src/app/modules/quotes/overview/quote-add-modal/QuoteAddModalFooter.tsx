import { useIntl } from "react-intl";
import { FormikProps } from "formik";
import { getQuickViewQuote } from "../core/_requests";
import { AttachmentsModal } from "../../../generic/FileManager/AttachmentsModal";

interface Props {
  isSubmitting: boolean;
  isSubmitting2: boolean;
  setAddModalOpen: (type: boolean) => void;
  formik: FormikProps<any>;
  setAction: (type: number) => void;
  attachmentsModalOpen: boolean;
  setAttachmentsModalOpen: (type: boolean) => void;
  openSend: any;
  setActionType: (type: number) => void;
}
const QuoteAddModalFooter = ({
  isSubmitting,
  isSubmitting2,
  setAddModalOpen,
  setAction,
  formik,
  attachmentsModalOpen,
  setAttachmentsModalOpen,
  openSend,
  setActionType,
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
      {attachmentsModalOpen && (
        <AttachmentsModal
          formik={formik}
          type="modal"
          setAttachmentsModalOpen={setAttachmentsModalOpen}
          info="Fields.InboxUploadModuleInfo"
        />
      )}

      <div className="text-end">
        <button
          type="button"
          className="btn btn-secondary me-3"
          data-bs-dismiss="modal"
          data-bs-target="client_add_modal"
          onClick={() => {
            setAddModalOpen(false);
          }}
        >
          <i className="fa-solid fa-ban me-1 fs-3 text-muted"></i>
          {intl.formatMessage({ id: "Fields.ActionCancel" })}
        </button>
        <div className="btn-group dropup">
          <button
            type="submit"
            className={`btn btn-warning me-3 ${
              !isSubmitting && "dropdown-toggle"
            } d-flex align-items-center`}
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i className="fa fas fa-save fs-2 me-2"></i>
            {!isSubmitting && formik.values.status === 1 ? (
              <>
                {intl.formatMessage({
                  id: "Fields.DraftLabel",
                })}{" "}
                {intl.formatMessage({ id: "Common.DefaultSaveButtonText" })}
              </>
            ) : (
              !isSubmitting && (
                <>
                  {intl.formatMessage({
                    id: "Fields.ActionEdit",
                  })}{" "}
                  {intl.formatMessage({ id: "Common.DefaultSaveButtonText" })}
                </>
              )
            )}
            {isSubmitting && (
              <span className="indicator-progress d-flex align-items-center">
                <span
                  dangerouslySetInnerHTML={{
                    __html: intl.formatMessage({ id: "Common.Busy" }),
                  }}
                />
                <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
              </span>
            )}
          </button>

          <ul className="dropdown-menu w-content-fit py-4">
            <li
              onClick={() => {
                setActionType(1);
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
                setAction(1);
                setActionType(1);
                formik.handleSubmit();
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
                setAction(2);
                setActionType(1);
                formik.handleSubmit();
              }}
            >
              <a className="dropdown-item d-flex align-items-center cursor-pointer">
                <i className="fa fas fa-save fs-2 me-2"></i>{" "}
                {intl.formatMessage({ id: "Fields.ActionSaveAndNew" })}
              </a>
            </li>
            <div className="dropdown-divider border-gray-200"></div>
            <li
              onClick={() => {
                setAction(3);
                setActionType(1);
                formik.handleSubmit();
              }}
            >
              <a className="dropdown-item  d-flex align-items-center cursor-pointer">
                <i className="fa fas fa-save fs-2 me-2"></i>{" "}
                {intl.formatMessage({ id: "Fields.ActionSaveAndPreview" })}
              </a>
            </li>
          </ul>
        </div>
        {formik.values.status === 1 ? (
          <div className="btn-group dropup">
            <button
              type="submit"
              className={`btn btn-success ${
                !isSubmitting2 && "dropdown-toggle"
              }`}
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i className="fas fa-location-arrow fs-2"></i>
              {!isSubmitting2 &&
                intl.formatMessage({ id: "Fields.ActionActivate" })}
              {isSubmitting2 && (
                <span className="indicator-progress d-flex align-items-center">
                  <span
                    dangerouslySetInnerHTML={{
                      __html: intl.formatMessage({ id: "Common.Busy" }),
                    }}
                  />
                  <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                </span>
              )}
            </button>
            <ul className="dropdown-menu w-200px py-4">
              <li
                onClick={() => {
                  setAction(5);
                  setActionType(2);
                  formik.handleSubmit();
                }}
              >
                <a className="dropdown-item d-flex align-items-center" href="#">
                  <i className="fa fas fa-paper-plane me-2 fs-3"></i>
                  {intl.formatMessage({ id: "Fields.ActionActivateAndSend" })}
                </a>
              </li>

              <div className="dropdown-divider border-gray-200"></div>
              <li
                onClick={() => {
                  setAction(6);
                  setActionType(2);
                  formik.handleSubmit();
                }}
              >
                <a className="dropdown-item d-flex align-items-center" href="#">
                  <i className="fa fas fa-cloud-download-alt me-2 fs-3"></i>
                  {intl.formatMessage({ id: "Fields.ActionActivate" })} &{" "}
                  {intl.formatMessage({ id: "Fields.ActionDownload" })}
                </a>
              </li>
              <div className="dropdown-divider border-gray-200"></div>
              <li
                onClick={() => {
                  setAction(7);
                  setActionType(2);
                  formik.handleSubmit();
                }}
              >
                <a className="dropdown-item d-flex align-items-center" href="#">
                  <i className="fa fas fa-flag-checkered me-2 fs-3"></i>
                  {intl.formatMessage({ id: "Fields.ActionActivate" })}
                </a>
              </li>
            </ul>
          </div>
        ) : (
          <div className="btn-group dropup">
            <button
              type="submit"
              className={`btn btn-success ${
                !isSubmitting2 && "dropdown-toggle"
              }`}
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {!isSubmitting2 && (
                <>
                  <i className="fas fa-location-arrow fs-2"></i>
                  {intl.formatMessage({
                    id: "Fields.ActionSendAndDownload",
                  })}
                </>
              )}
              {isSubmitting2 && (
                <span className="indicator-progress d-flex align-items-center w-full">
                  <span
                    dangerouslySetInnerHTML={{
                      __html: intl.formatMessage({ id: "Common.Busy" }),
                    }}
                  />
                  <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                </span>
              )}
            </button>
            <ul className="dropdown-menu w-200px py-4">
              <li
                onClick={() => {
                  setAction(4);
                  setActionType(2);
                  formik.handleSubmit();
                }}
              >
                <a className="dropdown-item d-flex align-items-center" href="#">
                  <i className="fa fas fa-cloud-download-alt me-2 fs-3"></i>
                  {intl.formatMessage({ id: "Fields.ActionSave" })} &{" "}
                  {intl.formatMessage({ id: "Fields.ActionDownload" })}
                </a>
              </li>

              <div className="dropdown-divider border-gray-200"></div>
              <li
                onClick={() => {
                  setAction(1);
                  setActionType(2);
                  formik.handleSubmit();
                  openSend("save");
                }}
              >
                <a className="dropdown-item d-flex align-items-center" href="#">
                  <i className="fa fas fa-paper-plane me-2 fs-3"></i>
                  {intl.formatMessage({ id: "Fields.ActionSaveAndSend" })}
                </a>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export { QuoteAddModalFooter };
