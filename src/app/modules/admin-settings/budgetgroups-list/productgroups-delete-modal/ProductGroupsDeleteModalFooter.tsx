import { FC, useState } from "react";
import { useIntl } from "react-intl";
import { deleteBudgetGroup } from "../core/_requests";
import { handleToast } from "../../../auth/core/_toast";

interface ComponentProps {
  setDeleteModalOpen: (type: boolean) => void;
  deleteModalId: number[];
  setRefresh: (type: boolean) => void;
  setDeleteModalId: (type: number[]) => void;
  refresh: boolean;
}

const ProductGroupsDeleteModalFooter = ({
  deleteModalId,
  setDeleteModalOpen,
  setRefresh,
  setDeleteModalId,
  refresh,
}: ComponentProps) => {
  // For localization support
  const intl = useIntl();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const deleteProduct = async () => {
    setIsSubmitting(true);

    const response = await deleteBudgetGroup(deleteModalId);

    if (response.isValid) {
      setRefresh(!refresh);
      setDeleteModalOpen(false);
      setDeleteModalId([]);
      setIsSubmitting(false);
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
            setDeleteModalId([]);
          }}
          className="btn btn-light me-3"
        >
          {intl.formatMessage({ id: "Fields.ActionClose" })}
        </button>

        {/* Save Button */}
        <button
          type="submit"
          className="btn btn-danger"
          onClick={deleteProduct}
        >
          {!isSubmitting ? (
            intl.formatMessage({ id: "Fields.ActionDelete" })
          ) : (
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

export { ProductGroupsDeleteModalFooter };
