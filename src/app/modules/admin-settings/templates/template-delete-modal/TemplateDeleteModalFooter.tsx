import { useState } from "react";
import { useIntl } from "react-intl";
import { deleteTemplate } from "../core/_requests";
import { handleToast } from "../../../auth/core/_toast";

interface ComponentProps {
  setDeleteModalOpen: (type: boolean) => void;
  deleteModalId: number;
  setRefresh: (type: boolean) => void;
  refresh: boolean;
}

const TemplateDeleteModalFooter = ({
  deleteModalId,
  setDeleteModalOpen,
  setRefresh,
  refresh,
}: ComponentProps) => {
  // For localization support
  const intl = useIntl();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const deleteRecord = async () => {
    try {
      setIsSubmitting(true);
      const response = await deleteTemplate(deleteModalId);
      if (response.isValid) {
        setRefresh(!refresh);
        setDeleteModalOpen(false);
      }
      handleToast(response);
    } catch {
    } finally {
      setIsSubmitting(false);
    }
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
          className="btn btn-secondary me-3"
        >
          {intl.formatMessage({ id: "Fields.ActionClose" })}
        </button>

        {/* Save Button */}
        <button
          type="submit"
          className="btn btn-danger"
          onClick={deleteRecord}
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

export { TemplateDeleteModalFooter };
