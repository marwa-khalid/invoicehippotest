import { useEffect, useState } from "react";
import { QuoteDeleteModalHeader } from "./QuoteDeleteModalHeader";
import { QuoteDeleteModalFooter } from "./QuoteDeleteModalFooter";
import { useIntl } from "react-intl";
import { FormValues } from "../quote-add-modal/QuoteAddStep1";
import { FormikProps } from "formik";
interface ComponentProps {
  attachment: any;
  setRestoreModalOpen: (type: boolean) => void;
  formik: FormikProps<FormValues>;
}
const QuoteRestorationModal = ({
  attachment,
  setRestoreModalOpen,
  formik,
}: ComponentProps) => {
  useEffect(() => {
    document.body.classList.add("modal-open");
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, []);
  const intl = useIntl();
  const [restoreAttachment, setRestoreAttachment] = useState<boolean>(false);

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
        <div className="modal-dialog modal-dialog-centered ">
          {/* begin::Modal content */}
          <div className="modal-content">
            <QuoteDeleteModalHeader
              setRestoreModalOpen={setRestoreModalOpen}
              attachment={attachment}
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
                        id: "Fields.ModalUnlinkFile",
                      })
                      .replace("{0}", attachment.fileName),
                  }}
                />
              </div>

              <div className="separator my-10"></div>
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
                    __html: intl.formatMessage({
                      id: "Fields.ModalUnlinkKeepAttachmentsInfo",
                    }),
                  }}
                />
              </div>

              <div className="form-check form-switch d-flex align-items-center mt-10">
                <input
                  className="form-check-input h-25px w-45px me-5"
                  type="checkbox"
                  id="restoreSwitch"
                  checked={restoreAttachment}
                  onChange={() => setRestoreAttachment(!restoreAttachment)}
                />
                <label
                  className="form-check-label text-muted"
                  htmlFor="restoreSwitch"
                >
                  {intl.formatMessage({
                    id: "Fields.KeepAttachments",
                  })}
                </label>
              </div>
            </div>

            {/* end::Modal body */}
            <QuoteDeleteModalFooter
              setRestoreModalOpen={setRestoreModalOpen}
              restoreAttachment={restoreAttachment}
              attachment={attachment}
              formik={formik}
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

export { QuoteRestorationModal };
