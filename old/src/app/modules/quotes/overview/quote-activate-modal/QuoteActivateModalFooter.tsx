import { useState } from "react";
import { useIntl } from "react-intl";
import { finalizeQuote } from "../core/_requests";
import { handleToast } from "../../../auth/core/_toast";

interface ComponentProps {
  setActivateModalOpen: (type: boolean) => void;
  quoteId: number;
  setRefresh: (type: boolean) => void;
  refresh: boolean;
  dontSendRemindersOnlyTrackStatus: boolean;
  adjustQuoteDateToToday: boolean;
}

const QuoteActivateModalFooter = ({
  quoteId,
  setActivateModalOpen,
  setRefresh,
  refresh,
  dontSendRemindersOnlyTrackStatus,
  adjustQuoteDateToToday,
}: ComponentProps) => {
  // For localization support
  const intl = useIntl();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const copyModal = async () => {
    setIsSubmitting(true);
    const response = await finalizeQuote(
      quoteId,
      dontSendRemindersOnlyTrackStatus,
      adjustQuoteDateToToday
    );
    if (response.isValid) {
      setRefresh(!refresh);
      setActivateModalOpen(false);
      setIsSubmitting(false);
      localStorage.removeItem("ModalData");
    }
    handleToast(response);
    setIsSubmitting(false);
  };
  return (
    <div className="modal-footer d-flex justify-content-end align-items-center ">
      <div className="d-flex">
        {/* Cancel Button */}
        <button
          type="reset"
          onClick={() => {
            setActivateModalOpen(false);
            localStorage.removeItem("ModalData");
          }}
          className="btn btn-secondary me-3"
        >
          {intl.formatMessage({ id: "Fields.ActionClose" })}
        </button>

        {/* Save Button */}
        <button
          type="submit"
          className="btn btn-info"
          onClick={copyModal}
          //   disabled={!isValid || isSubmitting || !touched}
        >
          {!isSubmitting && intl.formatMessage({ id: "Fields.ActionActivate" })}
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

export { QuoteActivateModalFooter };
