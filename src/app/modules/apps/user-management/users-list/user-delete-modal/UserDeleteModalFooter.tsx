import { FC } from "react";
import { useIntl } from "react-intl";
import { useFormikContext } from "formik";
import { useListView } from "../core/ListViewProvider";
import { deleteVatType } from "../core/_requests";

interface ComponentProps {
  setDeleteModalOpen: (type: boolean) => void;
  deleteModalId: number;
  setRefresh: (type: boolean) => void;
}

const UserDeleteModalFooter = ({
  deleteModalId,
  setDeleteModalOpen,
  setRefresh,
}: ComponentProps) => {
  // For localization support
  const intl = useIntl();
  console.log(deleteModalId);

  const deleteVat = async () => {
    const response = await deleteVatType(deleteModalId);
    if (response.result) {
      setDeleteModalOpen(false);
      setRefresh(true);
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
          <span className="indicator-label">
            {intl.formatMessage({ id: "Fields.ActionDelete" })}
          </span>
          {/* {isSubmitting && ( */}
          <span className="indicator-progress">
            {intl.formatMessage({ id: "Common.Busy" })}...{" "}
            <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
          </span>
          {/* )} */}
        </button>
      </div>
    </div>
  );
};

export { UserDeleteModalFooter };
