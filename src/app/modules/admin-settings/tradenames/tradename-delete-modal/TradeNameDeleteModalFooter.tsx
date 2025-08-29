import { FC, useState } from "react";
import { useIntl } from "react-intl";
import { deleteTradeName } from "../../my-company/core/_requests";
import { handleToast } from "../../../auth/core/_toast";

interface ComponentProps {
  setDeleteModalOpen: (type: boolean) => void;
  deleteModalId: number;
  setRefresh: (type: boolean) => void;
  setDeleteModalId: (type: number) => void;
  refresh: boolean;
}

const TradeNameDeleteModalFooter = ({
  deleteModalId,
  setDeleteModalOpen,
  setRefresh,
  setDeleteModalId,
  refresh,
}: ComponentProps) => {
  // For localization support
  const intl = useIntl();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const removeTradeName = async () => {
    try {
      setIsSubmitting(true);

      const response = await deleteTradeName(deleteModalId);

      if (response.isValid) {
        setRefresh(!refresh);
        setDeleteModalOpen(false);
        setDeleteModalId(0);
        setIsSubmitting(false);
      }
      handleToast(response);
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
            setDeleteModalId(0);
          }}
          className="btn btn-secondary me-3"
        >
          {intl.formatMessage({ id: "Fields.ActionClose" })}
        </button>

        {/* Save Button */}
        <button
          type="submit"
          className="btn btn-danger"
          onClick={removeTradeName}
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

export { TradeNameDeleteModalFooter };
