import { useState } from "react";
import { useIntl } from "react-intl";
import { enableAutoProcessing } from "../core/_requests";
import { handleToast } from "../../../../../auth/core/_toast";
import { useAuth } from "../../../../../auth";

interface ComponentProps {
  setDeleteModalOpen: (type: boolean) => void;
  setRefresh: (type: boolean) => void;
  refresh: boolean;
  financialAccountId: number | null;
}

const AutoProcessModalFooter = ({
  setDeleteModalOpen,
  setRefresh,
  refresh,
  financialAccountId,
}: ComponentProps) => {
  // For localization support
  const intl = useIntl();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { currentUser } = useAuth();
  const startProcess = async () => {
    setIsSubmitting(true);
    const response = await enableAutoProcessing(
      currentUser?.result?.activeCompany.id,
      financialAccountId
    );
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
            localStorage.removeItem("ModalData");
          }}
          className="btn btn-secondary me-3"
        >
          {intl.formatMessage({ id: "Fields.ActionClose" })}
        </button>

        {/* Save Button */}
        <button
          type="submit"
          className="btn btn-primary"
          onClick={startProcess}
        >
          {!isSubmitting &&
            intl.formatMessage({ id: "Fields.ActionStartProcess" })}
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

export { AutoProcessModalFooter };
