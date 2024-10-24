import { useEffect, useState } from "react";
import { QuoteEmailModalHeader } from "./QuoteEmailModalHeader";
import { QuoteEmailModalFooter } from "./QuoteEmailModalFooter";
import { useIntl } from "react-intl";
import ReactQuill from "react-quill";
import Select from "react-select";
interface ComponentProps {
  deleteModalId: number;
  quoteNumber: string;
  setValidateModalOpen: (type: boolean) => void;
  setRefresh: (type: boolean) => void;
  refresh: boolean;
}
const QuoteEmailModal = ({
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
            <QuoteEmailModalHeader
              setValidateModalOpen={setValidateModalOpen}
              quoteNumber={quoteNumber}
            />
            {/* begin::Modal body */}

            <div className="modal-body p-10">
              <div className="form-check form-switch form-check-custom form-check-success form-check-solid mt-1 ms-2 d-flex align-items-center mb-7">
                <input
                  className="form-check-input h-25px w-45px me-5"
                  type="checkbox"
                  id="openDraftSwitch"
                  checked
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
                  {intl.formatMessage({
                    id: "Fields.ModalSendQuoteOptionSendToClient",
                  })}
                </label>
              </div>
              <div className="form-check form-switch form-check-custom form-check-success form-check-solid mt-1 ms-2 d-flex align-items-center">
                <input
                  className="form-check-input h-25px w-45px me-5"
                  type="checkbox"
                  id="openDraftSwitch"
                  checked
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
                  {intl.formatMessage({
                    id: "Fields.ModalSendQuoteOptionSendMeAnCopy",
                  })}
                </label>
              </div>

              <div className="separator border-gray-300 my-10"></div>

              <h2 className="fw-normal">
                {intl.formatMessage({
                  id: "Fields.ModalSendQuoteTabTitleRecipients",
                })}
              </h2>

              <div className="accordion pt-4 " id="contactAccordion">
                <div className="accordion-item mb-7">
                  <h2 className="accordion-header" id="heading_email_aan">
                    <button
                      className="accordion-button collapsed align-items-center bg-secondary "
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapse_email_aan"
                      aria-expanded="false"
                      aria-controls="collapse_email_aan"
                    >
                      <i className="ki-duotone ki-sms fs-1 me-4">
                        <span className="path1"></span>
                        <span className="path2"></span>
                      </i>
                      Aan
                    </button>
                  </h2>

                  <div
                    id="collapse_email_aan"
                    className="accordion-collapse collapse "
                    aria-labelledby="heading_email_aan"
                  >
                    <div className="separator border-gray-300"></div>
                    <div className="accordion-body bg-secondary">
                      {/* Secondary Contact Form Fields */}

                      <div className="innerContainer">
                        <div className="row d-flex mb-7">
                          <input
                            type="text"
                            className="form-control form-control-white"
                            // placeholder={intl.formatMessage({
                            //   id: "Fields.FirstName",
                            // })}
                            // value={contact?.firstName || ""}
                            // onChange={(e) =>
                            //   handleAdditionalContactChange(
                            //     index,
                            //     "firstName",
                            //     e.target.value
                            //   )
                            // }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="accordion-item mb-7">
                  <h2 className="accordion-header" id="heading_email_cc">
                    <button
                      className="accordion-button collapsed align-items-center bg-secondary "
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapse_email_cc"
                      aria-expanded="false"
                      aria-controls="collapse_email_cc"
                    >
                      <i className="ki-duotone ki-sms fs-1 me-4">
                        <span className="path1"></span>
                        <span className="path2"></span>
                      </i>
                      Cc
                    </button>
                  </h2>

                  <div
                    id="collapse_email_cc"
                    className="accordion-collapse collapse "
                    aria-labelledby="heading_email_cc"
                  >
                    <div className="separator border-gray-300"></div>
                    <div className="accordion-body bg-secondary">
                      {/* Secondary Contact Form Fields */}

                      <div className="innerContainer">
                        <div className="row d-flex mb-7">
                          <input
                            type="text"
                            className="form-control form-control-white"
                            // placeholder={intl.formatMessage({
                            //   id: "Fields.FirstName",
                            // })}
                            // value={contact?.firstName || ""}
                            // onChange={(e) =>
                            //   handleAdditionalContactChange(
                            //     index,
                            //     "firstName",
                            //     e.target.value
                            //   )
                            // }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="accordion-item mb-7">
                  <h2 className="accordion-header" id="heading_email_bcc">
                    <button
                      className="accordion-button collapsed align-items-center bg-secondary"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapse_email_bcc"
                      aria-expanded="false"
                      aria-controls="collapse_email_bcc"
                    >
                      <i className="ki-duotone ki-sms fs-1 me-4">
                        <span className="path1"></span>
                        <span className="path2"></span>
                      </i>
                      Bcc
                    </button>
                  </h2>

                  <div
                    id="collapse_email_bcc"
                    className="accordion-collapse collapse "
                    aria-labelledby="heading_email_bcc"
                  >
                    <div className="separator border-gray-300"></div>
                    <div className="accordion-body bg-secondary">
                      {/* Secondary Contact Form Fields */}

                      <div className="innerContainer">
                        <div className="row d-flex mb-7">
                          <input
                            type="text"
                            className="form-control form-control-white"
                            // placeholder={intl.formatMessage({
                            //   id: "Fields.FirstName",
                            // })}
                            // value={contact?.firstName || ""}
                            // onChange={(e) =>
                            //   handleAdditionalContactChange(
                            //     index,
                            //     "firstName",
                            //     e.target.value
                            //   )
                            // }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="separator border-gray-300 my-10"></div>
              <div>
                <h2 className="fw-normal mb-5">
                  {intl.formatMessage({
                    id: "Fields.ModalSendQuoteOptionOverrideTemplate",
                  })}
                </h2>
                <Select
                  className="react-slect react-select-styled"
                  placeholder="Aanvraag voor goedkeuring"
                />
              </div>
            </div>

            {/* end::Modal body */}
            <QuoteEmailModalFooter
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

export { QuoteEmailModal };
