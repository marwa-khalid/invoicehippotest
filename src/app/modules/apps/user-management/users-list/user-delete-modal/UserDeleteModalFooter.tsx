import { FC, useState } from "react";
import { useIntl } from "react-intl";
import { useFormikContext } from "formik";
import { useListView } from "../core/ListViewProvider";
import { deleteVatType } from "../core/_requests";
import { toast } from "react-toastify";

interface ComponentProps {
  setDeleteModalOpen: (type: boolean) => void;
  deleteModalId: number;
  setRefresh: (type: boolean) => void;
  vatTitle: string;
}

const UserDeleteModalFooter = ({
  deleteModalId,
  setDeleteModalOpen,
  setRefresh,
  vatTitle,
}: ComponentProps) => {
  // For localization support
  const intl = useIntl();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const deleteVat = async () => {
    setIsSubmitting(true);
    const response = await deleteVatType(deleteModalId);
    if (response.result) {
      setDeleteModalOpen(false);
      setRefresh(true);
      setIsSubmitting(false);
      toast.success(
        intl
          .formatMessage({ id: "System.DeleteSuccessVatType" })
          .replace("{0}", vatTitle)
      );
    }
  };
  return (
    <div className="modal-footer d-flex justify-content-end align-items-center ">
      <div className="d-flex">
        {/* Cancel Button */}
        <button
          type="reset"
          onClick={() => setDeleteModalOpen(false)}
          className="btn btn-light me-3"
          //   disabled={isSubmitting}
        >
          {intl.formatMessage({ id: "Fields.ActionCancel" })}
        </button>

        {/* Save Button */}
        <button
          type="submit"
          className="btn btn-danger"
          onClick={deleteVat}
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

export { UserDeleteModalFooter };
