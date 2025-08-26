import { useEffect, useState } from "react";
import { CostDeleteModalHeader } from "./CostDeleteModalHeader";
import { CostDeleteModalFooter } from "./CostDeleteModalFooter";
import { useIntl } from "react-intl";
interface ComponentProps {
  deleteModalId: number;
  invoiceNr: string;
  setDeleteModalOpen: (type: boolean) => void;
  setRefresh: (type: boolean) => void;
  refresh: boolean;
}
const CostDeleteModal = ({
  deleteModalId,
  invoiceNr,
  setDeleteModalOpen,
  setRefresh,
  refresh,
}: ComponentProps) => {
  useEffect(() => {
    document.body.classList.add("modal-open");
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, []);
  const intl = useIntl();
  const delParsedData = JSON.parse(localStorage.getItem("ModalData")!);
  const [keepAttachments, setKeepAttachments] = useState<boolean>(false);

  return (
    <>
      <div
        className="modal fade show d-block"
        id="kt_modal_add_user"
        role="dialog"
        tabIndex={-1}
        aria-modal="true"
      >
        {/* begin::Modal dialog */}
        <div className="modal-dialog modal-dialog-centered">
          {/* begin::Modal content */}
          <div className="modal-content">
            <CostDeleteModalHeader
              setDeleteModalOpen={setDeleteModalOpen}
              delParsedData={delParsedData}
              invoiceNr={invoiceNr}
            />
            {/* begin::Modal body */}
            <div className="modal-body p-10">
              <div className="row d-flex form-wrapper bg-secondary p-5 rounded">
                <div className="col-2">
                  <i className="ki-duotone ki-information-4 fs-3x text-center text-danger">
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
                        id: "Fields.ModalDeleteDescriptionInvoice",
                      })
                      .replace("{0}", invoiceNr),
                  }}
                />
              </div>
              {delParsedData.hasAttachments && (
                <>
                  <div
                    className="row alert alert-custom alert-default align-items-center mt-8 mx-0 bg-danger"
                    style={{ backgroundColor: "#ffe2e6" }}
                    role="alert"
                  >
                    <div className="alert-text">
                      <span
                        dangerouslySetInnerHTML={{
                          __html: intl.formatMessage({
                            id: "Fields.KeepAttachmentsInfo",
                          }),
                        }}
                        className="text-white"
                      />
                    </div>
                  </div>
                  <div className="form-check form-switch d-flex align-items-center mt-10">
                    <input
                      className="form-check-input h-25px w-45px me-5 cursor-pointer"
                      type="checkbox"
                      id="keepAttachmentsSwitch"
                      checked={keepAttachments}
                      onChange={() => setKeepAttachments(!keepAttachments)}
                    />
                    <label
                      className="form-check-label text-muted"
                      htmlFor="keepAttachmentsSwitch"
                    >
                      {intl.formatMessage({
                        id: "Fields.KeepAttachments",
                      })}
                    </label>
                  </div>
                </>
              )}
            </div>

            {/* end::Modal body */}
            <CostDeleteModalFooter
              deleteModalId={deleteModalId}
              setDeleteModalOpen={setDeleteModalOpen}
              setRefresh={setRefresh}
              refresh={refresh}
              keepAttachments={keepAttachments}
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

export { CostDeleteModal };
