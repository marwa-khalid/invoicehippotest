import { useEffect, useState } from "react";
import { QuoteValidateModalHeader } from "./QuoteValidateModalHeader";
import { QuoteValidateModalFooter } from "./QuoteValidateModalFooter";
import { useIntl } from "react-intl";
import ReactQuill from "react-quill";
interface ComponentProps {
  deleteModalId: number;
  quoteNumber: string;
  setValidateModalOpen: (type: boolean) => void;
  setRefresh: (type: boolean) => void;
  refresh: boolean;
}
const QuoteValidateModal = ({
  deleteModalId,
  quoteNumber,
  setValidateModalOpen,
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

  return (
    <>
      <div
        className="modal fade show d-block"
        id="kt_modal_copy_quote"
        role="dialog"
        tabIndex={-1}
        aria-modal="true"
      >
        {/* begin::Modal dialog */}
        <div className="modal-dialog modal-dialog-centered ">
          {/* begin::Modal content */}
          <div className="modal-content">
            <QuoteValidateModalHeader
              setValidateModalOpen={setValidateModalOpen}
              quoteNumber={quoteNumber}
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
                    __html: intl.formatMessage({
                      id: "Fields.ValidateQuoteInfo",
                    }),
                  }}
                />
              </div>

              <div className="form-check form-check-custom form-check-success form-check-solid">
                <input
                  className="form-check-input"
                  type="radio"
                  value=""
                  checked
                  id="flexCheckboxSm"
                />
                <label className="form-check-label">
                  {intl.formatMessage({
                    id: "Fields.SelectOptionQuoteValidationStateTypeApproved",
                  })}
                </label>
              </div>
              <div className="form-check form-check-custom form-check-danger form-check-solid mt-5">
                <input
                  className="form-check-input"
                  type="radio"
                  value=""
                  id="flexCheckboxLg"
                />
                <label className="form-check-label">
                  {intl.formatMessage({
                    id: "Fields.SelectOptionQuoteValidationStateTypeDeclined",
                  })}
                </label>
              </div>

              <div className="separator border-gray-300 my-10"></div>
              <div className="row">
                <ReactQuill
                  theme="snow"
                  placeholder="Jouw tekst hier..."
                  style={{ height: "300px" }}
                  // onChange={handleQuillChange1}
                  // value={formik.values.comments.quoteComments}
                />
              </div>
              <div className="separator border-gray-300 mt-20 mb-10"></div>
              <div className="form-check form-switch mt-1 ms-2 d-flex align-items-center">
                <input
                  className="form-check-input h-25px w-45px me-5"
                  type="checkbox"
                  id="openDraftSwitch"
                  // checked={formik.values.customizations.useCustomQuoteNr}
                  // onChange={(e) => {
                  //   formik.setFieldValue(
                  //     "customizations.useCustomQuoteNr",
                  //     !formik.values.customizations.useCustomQuoteNr
                  //   );
                  // }}
                />
                <label
                  className="form-check-label fs-sm text-muted"
                  htmlFor="openDraftSwitch"
                >
                  verstuur de klant een notificatie van deze actie
                </label>
              </div>
            </div>

            {/* end::Modal body */}
            <QuoteValidateModalFooter
              deleteModalId={deleteModalId}
              setValidateModalOpen={setValidateModalOpen}
              setRefresh={setRefresh}
              refresh={refresh}
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

export { QuoteValidateModal };
