import { useState } from "react";
import { useIntl } from "react-intl";
import { deleteInboxList } from "../core/_requests";

import { handleToast } from "../../../auth/core/_toast";

interface ComponentProps {
  setDeleteModalOpen: (type: boolean) => void;
  deleteModalId: number;
  setRefresh: (type: boolean) => void;
  refresh: boolean;
  keepAttachments: boolean;
}

const InboxDeleteModalFooter = ({
  deleteModalId,
  setDeleteModalOpen,
  setRefresh,
  refresh,
  keepAttachments,
}: ComponentProps) => {
  // For localization support
  const intl = useIntl();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const deleteInbox = async () => {
    setIsSubmitting(true);
    const response = await deleteInboxList(deleteModalId, keepAttachments);
    if (response.isValid) {
      setRefresh(!refresh);
      setDeleteModalOpen(false);
      localStorage.removeItem("ModalData");
    }
    setIsSubmitting(false);
    handleToast(response);
  };
  return (
    <div className="modal-footer d-flex justify-content-end align-items-center ">
      <div className="d-flex">
        {/* Cancel Button */}
        <button
          type="reset"
          onClick={() => {
            setDeleteModalOpen(false);
            localStorage.removeItem("ModalData");
          }}
          className="btn btn-light me-3"
        >
          {intl.formatMessage({ id: "Fields.ActionClose" })}
        </button>

        {/* Save Button */}
        <button
          type="submit"
          className="btn btn-danger"
          onClick={deleteInbox}
          //   disabled={!isValid || isSubmitting || !touched}
        >
          {!isSubmitting && intl.formatMessage({ id: "Fields.ActionDelete" })}
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

export { InboxDeleteModalFooter };
