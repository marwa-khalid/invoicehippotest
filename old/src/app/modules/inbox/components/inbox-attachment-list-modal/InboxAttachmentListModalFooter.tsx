import { useIntl } from "react-intl";

interface ComponentProps {
  setLinkingModalOpen: (type: boolean) => void;
  handleAttachment: () => void;
}

const InboxAttachmentListModalFooter = ({
  setLinkingModalOpen,
  handleAttachment
}: ComponentProps) => {
  // For localization support
  const intl = useIntl();

  return (
    <div className="modal-footer  ">
      <div className="d-flex ">
        <div className="d-flex justify-content-start align-items-center">
        </div>
        {/* Cancel Button */}
        <div className="d-flex justify-content-end align-items-center">
          <button
            type="reset"
            onClick={() => {
              setLinkingModalOpen(false);
              localStorage.removeItem("ModalData");
            }}
            className="btn  btn-secondary me-3"
          >
            {intl.formatMessage({ id: "Fields.ActionClose" })}
          </button>
          <button
            type="button"
            onClick={() => {
              setLinkingModalOpen(false);
              handleAttachment()
              localStorage.removeItem("ModalData");
            }}
            className="btn  btn-primary me-3"
          >
            {intl.formatMessage({ id: "Fields.ActionSave" })}
          </button>

          {/* Save Button */}
        </div>
      </div>
    </div>
  );
};

export { InboxAttachmentListModalFooter };
