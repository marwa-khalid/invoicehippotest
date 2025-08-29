import { FC, useState } from "react";
import { useIntl } from "react-intl";
import { deleteContact, deleteClient } from "../core/_requests";
import { handleToast } from "../../../auth/core/_toast";

interface ComponentProps {
  setDeleteModalOpen: (type: boolean) => void;
  deleteModalId: number[];
  setRefresh: (type: boolean) => void;
  intlMessage: string;
  refresh: boolean;
}

const ClientDeleteModalFooter = ({
  deleteModalId,
  setDeleteModalOpen,
  setRefresh,
  intlMessage,
  refresh,
}: ComponentProps) => {
  // For localization support
  const intl = useIntl();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const deleteItem = async () => {
    setIsSubmitting(true);
    let response;
    if (intlMessage === "Fields.ModalDeleteDescriptionClientContact") {
      response = await deleteContact(deleteModalId);
    } else {
      response = await deleteClient(deleteModalId);
    }
    if (response.isValid) {
      setRefresh(!refresh);
      setDeleteModalOpen(false);
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
            setRefresh(!refresh);
          }}
          className="btn btn-light me-3"
        >
          {intl.formatMessage({ id: "Fields.ActionClose" })}
        </button>

        {/* Save Button */}
        <button
          type="submit"
          className="btn btn-danger"
          onClick={deleteItem}
          //   disabled={!isValid || isSubmitting || !touched}
        >
          {!isSubmitting && intl.formatMessage({ id: "Fields.ActionDelete" })}
          {isSubmitting && (
            <span className="indicator-progress" style={{ display: "block" }}>
              <span
                dangerouslySetInnerHTML={{
                  __html: intl.formatMessage({ id: "Common.Busy" }),
                }}
              />
              <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export { ClientDeleteModalFooter };
