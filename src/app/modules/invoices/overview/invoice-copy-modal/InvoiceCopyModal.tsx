import { useEffect, useState } from "react";
import { InvoiceCopyModalHeader } from "./InvoiceCopyModalHeader";
import { InvoiceCopyModalFooter } from "./InvoiceCopyModalFooter";
import { useIntl } from "react-intl";
interface ComponentProps {
  invoiceId: number;
  invoiceNr: string;
  setCopyModalOpen: (type: boolean) => void;
  setRefresh: (type: boolean) => void;
  refresh: boolean;
  setAddModalOpen: (type: boolean) => void;
  setEditModalId: (type: number) => void;
}
const InvoiceCopyModal = ({
  invoiceId,
  invoiceNr,
  setCopyModalOpen,
  setRefresh,
  refresh,
  setAddModalOpen,
  setEditModalId,
}: ComponentProps) => {
  useEffect(() => {
    document.body.classList.add("modal-open");
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, []);
  const intl = useIntl();
  const [copyAttachments, setCopyAttachments] = useState<boolean>(false);
  const [openDraftSwitch, setOpenDraftSwitch] = useState<boolean>(false);
  return (
    <>
      <div
        className="modal fade show d-block"
        id="kt_modal_copy_invoice"
        role="dialog"
        tabIndex={-1}
        aria-modal="true"
      >
        {/* begin::Modal dialog */}
        <div className="modal-dialog modal-dialog-centered ">
          {/* begin::Modal content */}
          <div className="modal-content">
            <InvoiceCopyModalHeader
              setCopyModalOpen={setCopyModalOpen}
              invoiceNr={invoiceNr}
            />
            {/* begin::Modal body */}
            <div className="modal-body p-10">
              <div className="row d-flex form-wrapper bg-secondary p-5 rounded mb-7">
                <div className="col-2">
                  <i className="ki-duotone ki-information-4 fs-3x text-center text-primary">
                    <span className="path1"></span>
                    <span className="path2"></span>
                    <span className="path3"></span>
                  </i>
                </div>
                <span
                  className="col-10"
                  dangerouslySetInnerHTML={{
                    __html: intl
                      .formatMessage({
                        id: "Fields.ModalCopyInvoiceInfo",
                      })
                      .replace("{0}", invoiceNr),
                  }}
                />
              </div>
              <div className="form-check form-switch mt-1 ms-2 d-flex align-items-center mb-10">
                <input
                  className="form-check-input h-25px w-45px me-5"
                  type="checkbox"
                  id="copyAttachmentsSwitch"
                  checked={copyAttachments}
                  onChange={(e) => {
                    setCopyAttachments(!copyAttachments);
                  }}
                />
                <label
                  className="form-check-label fs-sm text-muted"
                  htmlFor="copyAttachmentsSwitch"
                >
                  {intl.formatMessage({
                    id: "Fields.CopyAttachments",
                  })}
                </label>
              </div>

              <div className="form-check form-switch mt-1 ms-2 d-flex align-items-center">
                <input
                  className="form-check-input h-25px w-45px me-5"
                  type="checkbox"
                  id="openDraftSwitch"
                  checked={openDraftSwitch}
                  onChange={() => setOpenDraftSwitch(!openDraftSwitch)}
                />
                <label
                  className="form-check-label fs-sm text-muted"
                  htmlFor="openDraftSwitch"
                >
                  {intl.formatMessage({
                    id: "Fields.ModalOpenDraftAfterAction",
                  })}
                </label>
              </div>
            </div>

            {/* end::Modal body */}
            <InvoiceCopyModalFooter
              invoiceId={invoiceId}
              setCopyModalOpen={setCopyModalOpen}
              setRefresh={setRefresh}
              refresh={refresh}
              copyAttachments={copyAttachments}
              openDraftSwitch={openDraftSwitch}
              setAddModalOpen={setAddModalOpen}
              setEditModalId={setEditModalId}
            />
          </div>
          {/* end::Modal content */}
        </div>
        {/* end::Modal dialog */}
      </div>
      {/* begin::Modal Backdrop */}
      <div className="modal-backdrop fade show"></div>
      {/* end::Modal Backdrop */}
    </>
  );
};

export { InvoiceCopyModal };
