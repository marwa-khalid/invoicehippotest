import { FC, useState } from "react";
import { useIntl } from "react-intl";
import { useFormikContext } from "formik";
import { useListView } from "../core/ListViewProvider";
import { deleteLedgerAccount } from "../core/_requests";
import { toast } from "react-toastify";
import { handleToast } from "../../../../auth/core/_toast";

interface ComponentProps {
  setDeleteModalOpen: (type: boolean) => void;
  deleteModalId: number;
  setRefresh: (type: boolean) => void;
}

const VatDeleteModalFooter = ({
  deleteModalId,
  setDeleteModalOpen,
  setRefresh,
}: ComponentProps) => {
  // For localization support
  const intl = useIntl();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const deleteVat = async () => {
    setIsSubmitting(true);
    const response = await deleteLedgerAccount(deleteModalId);
    if (response.isValid) {
      setRefresh(true);
      setDeleteModalOpen(false);
      setIsSubmitting(false);
    }
    handleToast(response);
  };
  return (
    <div className="modal-footer d-flex justify-content-end align-items-center ">
      <div className="d-flex">
        {/* Cancel Button */}
        <button
          type="reset"
          onClick={() => setDeleteModalOpen(false)}
          className="btn btn-light me-3"
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

export { VatDeleteModalFooter };
