import { useIntl } from "react-intl";
import { FormikProps } from "formik";
import { getQuickViewInvoice } from "../core/_requests";
import { AttachmentsModal } from "../../../generic/FileManager/AttachmentsModal";

interface Props {
  isSubmitting: boolean;
  isSubmitting2: boolean;
  setAddModalOpen: (type: boolean) => void;
  formik: FormikProps<any>;
  setAction: (type: number) => void;
  attachmentsModalOpen: boolean;
  setAttachmentsModalOpen: (type: boolean) => void;
  setActivateModalOpen: (type: boolean) => void;
  setInvoiceNr: (type: string) => void;
  setActionType: (type: number) => void;
  setEditModalId: (type: number) => void;
  setEmailModalOpen: (type: boolean) => void;
}
const InvoiceAddModalFooter = ({
  isSubmitting,
  isSubmitting2,
  setAddModalOpen,
  setAction,
  formik,
  attachmentsModalOpen,
  setAttachmentsModalOpen,
  setActivateModalOpen,
  setInvoiceNr,
  setEmailModalOpen,
  setEditModalId,
  setActionType,
}: Props) => {
  const intl = useIntl();

  const openActivate = (actionType: string) => {
    setActivateModalOpen(true);
    valueSetter(actionType);
  };

  const openSend = (actionType: string) => {
    setEmailModalOpen(true);
    valueSetter(actionType);
  };

  const valueSetter = async (actionType: string) => {
    const response = await getQuickViewInvoice(formik.values.id);
    if (response.isValid) {
      setEditModalId(response.result.id);
      setInvoiceNr(response.result.invoiceNr);
      localStorage.setItem(
        "ModalData",
        JSON.stringify({
          invoiceDateAsString: response?.result.invoiceDateAsString,
          client: response?.result.client.companyName,
          totalPriceWithVat: response?.result.totals.totalPriceWithVAT,
          sign: response?.result.valuta.sign,
          status: response?.result.invoiceStatus.value,
          activeSendInstructions: response?.result?.activeSendInstructions,
          totalOpen: response?.result.totals.totalOpen,
          downloadInfo: response?.result.downloadInfo,
          actionType: actionType,
        })
      );
    }
  };

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
              <>
                {intl.formatMessage({
                  id: "Fields.ActionEdit",
                })}{" "}
                {intl.formatMessage({ id: "Common.DefaultSaveButtonText" })}
              </>
            )}
            {isSubmitting && (
              <span className="indicator-progress d-flex align-items-center">
                {intl.formatMessage({ id: "Common.Busy" })}
                <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
              </span>
            )}
          </button>

          <ul className="dropdown-menu w-content-fit py-4">
            <li
              onClick={() => {
                formik.handleSubmit();
                setActionType(1);
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
                setActionType(1);
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
                setActionType(1);
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
                formik.handleSubmit();
                setAction(3);
                setActionType(1);
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
                  {intl.formatMessage({ id: "Common.Busy" })}
                  <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                </span>
              )}
            </button>
            <ul className="dropdown-menu w-200px py-4">
              <li
                onClick={() => {
                  openSend("send");
                  setAction(1);
                  setActionType(2);
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
                  openActivate("download");
                  setAction(1);
                  setActionType(2);
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
                  openActivate("activate");
                  setAction(1);
                  setActionType(2);
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
                  {intl.formatMessage({ id: "Common.Busy" })}
                  <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                </span>
              )}
            </button>
            <ul className="dropdown-menu w-200px py-4">
              <li
                onClick={() => {
                  formik.handleSubmit();
                  setAction(4);
                  setActionType(2);
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
                  formik.handleSubmit();
                  setAction(1);
                  openSend("save");
                  setActionType(2);
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

export { InvoiceAddModalFooter };
