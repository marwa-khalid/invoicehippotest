import { useState } from "react";
import { useIntl } from "react-intl";
import { handleToast } from "../../../auth/core/_toast";
import { createInvoiceForQuote } from "../core/_requests";
import { useNavigate } from "react-router-dom";

interface ComponentProps {
  setCreateInvoiceModalOpen: (type: boolean) => void;
  quoteId: number;
  setRefresh: (type: boolean) => void;
  refresh: boolean;
  invoiceDate: string;
  actionType: number;
  openDraftSwitch: boolean;
  setEditModalId: (type: number) => void;
  copyAttachments: boolean;
}

const InvoiceCreditModalFooter = ({
  quoteId,
  setCreateInvoiceModalOpen,
  setRefresh,
  refresh,
  invoiceDate,
  actionType,
  openDraftSwitch,
  setEditModalId,
  copyAttachments,
}: ComponentProps) => {
  // For localization support
  const intl = useIntl();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const parsedData = JSON.parse(localStorage.getItem("ModalData")!);
  const navigate = useNavigate();
  const copyModal = async () => {
    try {
      setIsSubmitting(true);
      const response = await createInvoiceForQuote(
        quoteId,
        invoiceDate,
        actionType,
        copyAttachments
      );
      if (response.isValid) {
        setRefresh(!refresh);
        setCreateInvoiceModalOpen(false);
        setEditModalId(0);
        if (openDraftSwitch) {
          localStorage.setItem("currentItem", JSON.stringify(response.result));
          navigate(`/invoice/view/${response.result}`);
        }
        localStorage.removeItem("ModalData");
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
            setCreateInvoiceModalOpen(false);
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
          {!isSubmitting &&
            intl.formatMessage({ id: "Fields.ActionCreateInvoice" })}
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
