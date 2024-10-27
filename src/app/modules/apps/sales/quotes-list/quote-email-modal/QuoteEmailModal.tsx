import { useEffect, useRef, useState } from "react";
import { QuoteEmailModalHeader } from "./QuoteEmailModalHeader";
import { QuoteEmailModalFooter } from "./QuoteEmailModalFooter";
import { useIntl } from "react-intl";
import ReactQuill from "react-quill";
import * as Yup from "yup";
import Select from "react-select";
import { useFormik } from "formik";
import Tags from "@yaireo/tagify/dist/react.tagify";
interface ComponentProps {
  quoteId: number;
  quoteNumber: string;
  setValidateModalOpen: (type: boolean) => void;
  setRefresh: (type: boolean) => void;
  refresh: boolean;
}
const QuoteEmailModal = ({
  quoteId,
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
  const tagifyRef = useRef<any>();
  const formik = useFormik({
    initialValues: {
      quoteId: quoteId,
      overrideNotificationType: 0,
      finalizeQuote: true,
      emailOptions: {
        sendToClient: false,
        sendMeAnCopy: false,
        extraToRecipients: [""],
        extraCcRecipients: [""],
        extraBccRecipients: [""],
      },
      actionType: 0,
      adjustQuoteDateToToday: true,
    },

    validationSchema: Yup.object().shape({
      //   products: Yup.array()
      //     .min(1, "At least one product is required.")
      //     .of(
      //       Yup.object().shape({
      //         title: Yup.string()
      //           .trim()
      //           .required("Product title is required.")
      //           .min(1, "Product title cannot be an empty string."),
      //       })
      //     ),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      // setIsSubmitting(true);
      // try {
      //   if (values.products.length === 0) {
      //     toast.error("At least one product is required.");
      //     return; // Stop execution here
      //   }
      //   // Loop through products and check for empty titles
      //   for (let i = 0; i < values.products.length; i++) {
      //     if (
      //       !values.products[i].title ||
      //       values.products[i].title.trim() === ""
      //     ) {
      //       toast.error("Product title cannot be empty.");
      //       return; // Stop execution here
      //     }
      //   }
      //   const response = await postQuote(values);
      //   if (response.isValid) {
      //     switch (action) {
      //       case 1:
      //         setAddModalOpen(false);
      //         setContactResponse(null);
      //         break;
      //       case 2:
      //         setEditModalId(0);
      //         formik.setValues(formik.initialValues);
      //         setContactResponse(null);
      //         setActiveTab(tabs[0]);
      //         break;
      //       case 3:
      //         setEditModalId(response.result.id);
      //         setResponse(response.result);
      //         break;
      //       default:
      //         setEditModalId(response.result.id);
      //         setResponse(response.result);
      //         break;
      //     }
      //   }
      //   setRefresh(!refresh);
      //   handleToast(response);
      // } catch (error) {
      //   console.error("Post failed:", error);
      // } finally {
      //   setIsSubmitting(false);
      //   setSubmitting(false);
      // }
    },
  });
  const handleInvalidEmail = (e: any) => {
    const tagData = e.detail.data;

    if (!Yup.string().email(tagData.value)) {
      // Highlight invalid email with red background
      tagifyRef.current?.tagify.editTag(tagData, false, {
        className: "tagify__tag--invalid",
        style: { backgroundColor: "red" },
      });

      // Remove invalid email after highlighting
      setTimeout(() => {
        tagifyRef.current?.tagify.removeTag(tagData);
      }, 1500);
    }
  };

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
                  id="sendToClientSwitch"
                  checked={formik.values.emailOptions.sendToClient}
                  onChange={(e) => {
                    formik.setFieldValue(
                      "emailOptions.sendToClient",
                      !formik.values.emailOptions.sendToClient
                    );
                  }}
                />
                <label
                  className="form-check-label fs-sm text-muted"
                  htmlFor="sendToClientSwitch"
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
                  id="sendMeCopySwitch"
                  checked={formik.values.emailOptions.sendMeAnCopy}
                  onChange={(e) => {
                    formik.setFieldValue(
                      "emailOptions.sendMeAnCopy",
                      !formik.values.emailOptions.sendMeAnCopy
                    );
                  }}
                />
                <label
                  className="form-check-label fs-sm text-muted"
                  htmlFor="sendMeCopySwitch"
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
                          <Tags
                            tagifyRef={tagifyRef}
                            className="form-control form-control-solid tagify p-3"
                            placeholder={intl.formatMessage({
                              id: "Fields.OptionsOrMultipleOptions",
                            })}
                            settings={{
                              dropdown: {
                                enabled: 0,
                              },
                              validate: (tagData: any) =>
                                /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                                  tagData.value
                                ),
                            }}
                            value={
                              formik.values.emailOptions.extraToRecipients || []
                            }
                            onChange={(e: any) => {
                              const value = e.detail.tagify.value.map(
                                (tag: any) => tag.value
                              ); // Get the clean value from Tagify
                              formik.setFieldValue(
                                "emailOptions.extraToRecipients",
                                value
                              );
                            }}
                            onInvalid={handleInvalidEmail}
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
                  {console.log(formik.values)!}
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
                          <Tags
                            tagifyRef={tagifyRef}
                            className="form-control form-control-solid tagify p-3"
                            placeholder={intl.formatMessage({
                              id: "Fields.OptionsOrMultipleOptions",
                            })}
                            settings={{
                              dropdown: {
                                enabled: 0,
                              },
                              validate: (tagData: any) =>
                                /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                                  tagData.value
                                ),
                            }}
                            value={
                              formik.values.emailOptions.extraCcRecipients || []
                            }
                            onChange={(e: any) => {
                              const value = e.detail.tagify.value.map(
                                (tag: any) => tag.value
                              ); // Get the clean value from Tagify
                              formik.setFieldValue(
                                "emailOptions.extraCcRecipients",
                                value
                              );
                            }}
                            onInvalid={handleInvalidEmail}
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
                          <Tags
                            tagifyRef={tagifyRef}
                            className="form-control form-control-solid tagify p-3"
                            placeholder={intl.formatMessage({
                              id: "Fields.OptionsOrMultipleOptions",
                            })}
                            value={
                              formik.values.emailOptions.extraBccRecipients ||
                              []
                            }
                            settings={{
                              dropdown: {
                                enabled: 0,
                              },
                              validate: (tagData: any) =>
                                /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                                  tagData.value
                                ),
                            }}
                            onChange={(e: any) => {
                              const value = e.detail.tagify.value.map(
                                (tag: any) => tag.value
                              ); // Get the clean value from Tagify
                              formik.setFieldValue(
                                "emailOptions.extraBccRecipients",
                                value
                              );
                            }}
                            onInvalid={handleInvalidEmail}
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

              <div
                className="row alert alert-custom alert-default align-items-center mt-8 mx-0 bg-danger-light"
                style={{ backgroundColor: "#ffe2e6" }}
                role="alert"
              >
                <div className="alert-icon col-1 me-4">
                  <i className="ki-duotone ki-information-4 fs-3x text-center text-danger">
                    <span className="path1"></span>
                    <span className="path2"></span>
                    <span className="path3"></span>
                  </i>
                </div>
                <div className="alert-text col-10">
                  <span
                    dangerouslySetInnerHTML={{
                      __html: intl.formatMessage({
                        id: "Fields.ModalSendOneOrMoreRecipientsAreRequired",
                      }),
                    }}
                    className="text-danger"
                  />
                </div>
              </div>
            </div>

            {/* end::Modal body */}
            <QuoteEmailModalFooter
              formik={formik}
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
