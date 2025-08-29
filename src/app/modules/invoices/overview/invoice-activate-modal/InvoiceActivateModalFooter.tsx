import { useState } from "react";
import { useIntl } from "react-intl";
import { finalizeInvoice } from "../core/_requests";

import { handleToast } from "../../../auth/core/_toast";

interface ComponentProps {
  setActivateModalOpen: (type: boolean) => void;
  invoiceId: number;
  setRefresh: (type: boolean) => void;
  refresh: boolean;
  dontSendRemindersOnlyTrackStatus: boolean;
  adjustInvoiceDateToToday: boolean;
  modalData: any;
}

const InvoiceActivateModalFooter = ({
  invoiceId,
  setActivateModalOpen,
  setRefresh,
  refresh,
  dontSendRemindersOnlyTrackStatus,
  adjustInvoiceDateToToday,
  modalData,
}: ComponentProps) => {
  // For localization support
  const intl = useIntl();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const finalize = async () => {
    setIsSubmitting(true);
    const response = await finalizeInvoice(
      invoiceId,
      dontSendRemindersOnlyTrackStatus,
      adjustInvoiceDateToToday
    );
    if (response.isValid) {
      if (modalData.actionType === "download") {
        const link = document.createElement("a");
        link.href = modalData.downloadInfo.downloadUrl;
        link.setAttribute("download", modalData.downloadInfo.fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
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
          onClick={finalize}
          //   disabled={!isValid || isSubmitting || !touched}
        >
          {!isSubmitting && intl.formatMessage({ id: "Fields.ActionFinalize" })}
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

export { InvoiceActivateModalFooter };
