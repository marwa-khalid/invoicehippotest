import { useState } from "react";
import { useIntl } from "react-intl";
import { createCredit } from "../../../invoices/overview/core/_requests";
import { handleToast } from "../../../auth/core/_toast";

interface ComponentProps {
  setCreditModalOpen: (type: boolean) => void;
  invoiceId: number;
  setRefresh: (type: boolean) => void;
  refresh: boolean;
  invoiceDate: string;
  actionType: number;
  openDraftSwitch: boolean;
  setAddModalOpen: (type: boolean) => void;
  setEditModalId: (type: number) => void;
}

const InvoiceCreditModalFooter = ({
  invoiceId,
  setCreditModalOpen,
  setRefresh,
  refresh,
  invoiceDate,
  actionType,
  openDraftSwitch,
  setAddModalOpen,
  setEditModalId,
}: ComponentProps) => {
  // For localization support
  const intl = useIntl();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const copyModal = async () => {
    setIsSubmitting(true);
    const response = await createCredit(invoiceId, invoiceDate, actionType);
    if (response.isValid) {
      setRefresh(!refresh);
      setCreditModalOpen(false);
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
            setCreditModalOpen(false);
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
          onClick={copyModal}
          disabled={invoiceDate === ""}
        >
          {!isSubmitting && intl.formatMessage({ id: "Fields.ActionCredit" })}
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

export { InvoiceCreditModalFooter };
