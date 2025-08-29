import { useState } from "react";
import { useIntl } from "react-intl";
import { createCopy } from "../core/_requests";
import { handleToast } from "../../../auth/core/_toast";

interface ComponentProps {
  setCopyModalOpen: (type: boolean) => void;
  invoiceId: number;
  setRefresh: (type: boolean) => void;
  refresh: boolean;
  copyAttachments: boolean;
  openDraftSwitch: boolean;
  setAddModalOpen: (type: boolean) => void;
  setEditModalId: (type: number) => void;
}

const InvoiceCopyModalFooter = ({
  invoiceId,
  setCopyModalOpen,
  setRefresh,
  refresh,
  copyAttachments,
  openDraftSwitch,
  setAddModalOpen,
  setEditModalId,
}: ComponentProps) => {
  // For localization support
  const intl = useIntl();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const copyModal = async () => {
    setIsSubmitting(true);
    const response = await createCopy(invoiceId, copyAttachments);
    if (response.isValid) {
      setRefresh(!refresh);
      setCopyModalOpen(false);
      setIsSubmitting(false);
      if (openDraftSwitch) {
        setEditModalId(response.result);
        setAddModalOpen(true);
      }
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
            setCopyModalOpen(false);
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
          {!isSubmitting && intl.formatMessage({ id: "Fields.ActionCopy" })}
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

export { InvoiceCopyModalFooter };
