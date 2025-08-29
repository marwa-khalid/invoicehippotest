import { useIntl } from "react-intl";

interface Props {
  isSubmitting: boolean;
  showLinking?: boolean;
  setAction: (type: number) => void;
  setLinkingModalOpen: (type: boolean) => void;
  setAttachmentsModalOpen?: (type: boolean) => void;
  handleSubmit?: () => void;
  setAttatchCostModalOpen: (type: boolean) => void;
}
const BookingAddModalFooter = ({
  isSubmitting,
  setAttachmentsModalOpen,
  setLinkingModalOpen,
  setAttatchCostModalOpen,
  showLinking,
  handleSubmit,
}: Props) => {
  const intl = useIntl();

  return (
    <div className="modal-footer d-flex justify-content-between">
      <div className="btn-group" role="group">
        {showLinking !== false && (
          <button
            type="button"
            className="btn btn-primary d-flex align-items-center"
            onClick={() =>
              setAttachmentsModalOpen && setAttachmentsModalOpen(true)
            }
          >
            <i className="fas fa-upload me-2"></i>
            {intl.formatMessage({
              id: "Fields.ActionPickerAddAttachment",
            })}
          </button>
        )}
      </div>
      <div className="text-end">
        <>
          <button
            type="button"
            className="btn btn-secondary me-3"
            data-bs-dismiss="modal"
            data-bs-target="booking_add_modal"
            onClick={() => {
              setAttatchCostModalOpen(false);
            }}
            disabled={isSubmitting}
          >
            <i className="fa-solid fa-ban me-1 fs-3 text-muted"></i>
            {intl.formatMessage({ id: "Fields.ActionCancel" })}
          </button>
          <div className="btn-group dropup">
            {showLinking !== false && (
              <button
                type="button"
                className={`btn btn-warning me-3  d-flex align-items-center`}
                onClick={() => handleSubmit && handleSubmit()}
              >
                <i className="fa fas fa-save fs-2 me-2"></i>

                {isSubmitting ? (
                  <span className="indicator-progress d-flex align-items-center">
                    <span
                      dangerouslySetInnerHTML={{
                        __html: intl.formatMessage({ id: "Common.Busy" }),
                      }}
                    />
                    <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                  </span>
                ) : (
                  intl.formatMessage({ id: "Common.DefaultSaveButtonText" })
                )}
              </button>
            )}
            <button
              type="button"
              className="btn btn-secondary me-3"
              onClick={() => {
                setLinkingModalOpen(true);
                setAttatchCostModalOpen(false);
              }}
            >
              {intl.formatMessage({ id: "Fields.ActionShowSelectionScreen" })}
            </button>
          </div>
        </>
      </div>
    </div>
  );
};

export { BookingAddModalFooter };
