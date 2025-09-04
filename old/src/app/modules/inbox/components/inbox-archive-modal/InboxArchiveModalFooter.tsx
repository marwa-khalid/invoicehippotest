import { useState } from "react";
import { useIntl } from "react-intl";
import {  unArchiveInbox } from "../core/_requests";
import { InboxListResult } from "../core/_models";


interface ComponentProps {
  setArchiveModalOpen: (type: boolean) => void;
  inboxDetail: InboxListResult;
  setRefresh: (type: boolean) => void;
  refresh: boolean;
  showBackButton: boolean;
}

const InboxArchiveModalFooter = ({
  inboxDetail,
  setArchiveModalOpen,
  setRefresh,
  refresh,
  showBackButton
}: ComponentProps) => {
  // For localization support
  const intl = useIntl();
  const [isSubmitting, setIsSubmitting] = useState(false);



  const handleUnArchive = async () => {
    try {
      setIsSubmitting(true)
      // Extract required values first
      const inboxItemId = inboxDetail.inboxItemId ?? 0; // Default to 0 if undefined
      const fileId = inboxDetail.fileId ?? 0;

      // Create payload
      const payload = {
        inboxItemId,
        fileId,
      };
      const response = await unArchiveInbox(payload);
      console.log("API Response:", response);
      setArchiveModalOpen(false);
      setRefresh(true);
    } catch (error) {
      console.error("Error Un Archiving:", error);
      setArchiveModalOpen(false);
    }
  };

  return (
    <div className="modal-footer  ">
      <div className="d-flex ">
        <div className="d-flex justify-content-start align-items-center">
        {showBackButton && <button
          type="reset"
          onClick={() => {
            handleUnArchive();
          }}
          className="btn btn-warning me-3"
        >
          {intl.formatMessage({ id: "Fields.ActionBackToInbox" })}
        </button>}
        </div>
        {/* Cancel Button */}
        <div className="d-flex justify-content-end align-items-center">
          <button
            type="reset"
            onClick={() => {
              setArchiveModalOpen(false);
              localStorage.removeItem("ModalData");
            }}
            className="btn  btn-secondary me-3"
          >
            {intl.formatMessage({ id: "Fields.ActionClose" })}
          </button>

          {/* Save Button */}
          <button
            type="submit"
            className="btn btn-primary"
          //   disabled={!isValid || isSubmitting || !touched}
          >
            {!isSubmitting && intl.formatMessage({ id: "Fields.ActionArchive" })}
            {isSubmitting && (
              <span className="indicator-progress" style={{ display: "block" }}>
                {intl.formatMessage({ id: "Common.Busy" })}
                <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export { InboxArchiveModalFooter };
