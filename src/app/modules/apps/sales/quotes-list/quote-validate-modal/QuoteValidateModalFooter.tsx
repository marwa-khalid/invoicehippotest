import { useState } from "react";
import { useIntl } from "react-intl";
import { deleteQuoteList } from "../core/_requests";

import { handleToast } from "../../../../auth/core/_toast";

interface ComponentProps {
  setValidateModalOpen: (type: boolean) => void;
  quoteId: number;
  setRefresh: (type: boolean) => void;
  refresh: boolean;
}

const QuoteValidateModalFooter = ({
  quoteId,
  setValidateModalOpen,
  setRefresh,
  refresh,
}: ComponentProps) => {
  // For localization support
  const intl = useIntl();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const deleteQuote = async () => {
    setIsSubmitting(true);
    const response = await deleteQuoteList(quoteId);
    if (response.isValid) {
      setRefresh(!refresh);
      setValidateModalOpen(false);
      setIsSubmitting(false);
      localStorage.removeItem("ModalData");
    }
    handleToast(response);
  };
  return (
    <div className="modal-footer d-flex justify-content-end align-items-center ">
      <div className="d-flex">
        {/* Cancel Button */}
        <button
          type="reset"
          onClick={() => {
            setValidateModalOpen(false);
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
          onClick={deleteQuote}
          //   disabled={!isValid || isSubmitting || !touched}
        >
          {!isSubmitting && intl.formatMessage({ id: "Fields.ActionApprove" })}
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

export { QuoteValidateModalFooter };
