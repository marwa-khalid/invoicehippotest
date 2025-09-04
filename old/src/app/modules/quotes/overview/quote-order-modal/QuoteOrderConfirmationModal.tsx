import { useEffect, useRef, useState } from "react";
import { InvoiceEmailModalHeader } from "./InvoiceEmailModalHeader";
import { InvoiceEmailModalFooter } from "./InvoiceEmailModalFooter";
import { useIntl } from "react-intl";
import * as Yup from "yup";
import Flatpickr from "react-flatpickr";
import { useFormik } from "formik";
import Tags from "@yaireo/tagify/dist/react.tagify";
import { createOrderConfirmation } from "../core/_requests";
import { handleToast } from "../../../auth/core/_toast";
interface ComponentProps {
  quoteId: number;
  quoteNr: string;
  setEmailModalOpen: (type: boolean) => void;
  setRefresh: (type: boolean) => void;
  refresh: boolean;
}
const QuoteOrderConfirmationModal = ({
  quoteId,
  quoteNr,
  setEmailModalOpen,
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const tagifyRef = useRef<any>();
  const parsedData = JSON.parse(localStorage.getItem("ModalData")!);
  const formik = useFormik({
    initialValues: {
      quoteId: quoteId,
      expectedDeliveryDate: "",
      sendNotification: false,
      emailOptions: {
        sendToClient:
          parsedData?.activeSendInstructions?.emailOptions?.sendToClient ??
          false,
        sendMeAnCopy:
          parsedData?.activeSendInstructions?.emailOptions?.sendMeAnCopy ??
          false,
        extraToRecipients:
          parsedData?.activeSendInstructions?.emailOptions?.extraToRecipients ||
          [],
        extraCcRecipients:
          parsedData?.activeSendInstructions?.emailOptions?.extraCcRecipients ||
          [],
        extraBccRecipients:
          parsedData?.activeSendInstructions?.emailOptions
            ?.extraBccRecipients || [],
      },
    },

    validationSchema: Yup.object().shape({
      emailOptions: Yup.object()
        .shape({
          sendToClient: Yup.boolean(),
          sendMeAnCopy: Yup.boolean(),
          extraToRecipients: Yup.array(),
        })
        .test(
          "at-least-one-true",
          intl.formatMessage({
            id: "Fields.ModalSendOneOrMoreRecipientsAreRequired",
          }),
          (value) =>
            value?.sendToClient ||
            value?.sendMeAnCopy ||
            (value?.extraToRecipients && value.extraToRecipients.length > 0)
        ),
    }),

    onSubmit: async (values, { setSubmitting }) => {
      setIsSubmitting(true);

      // If sendNotification is false, remove emailOptions entirely
      let filteredValues;
      if (!values.sendNotification) {
        const { emailOptions, ...rest } = values;
        filteredValues = rest;
      } else {
        // Filter out empty email arrays from emailOptions
        const filteredEmailOptions = {
          ...values.emailOptions,
          ...(values.emailOptions.extraToRecipients.length === 0 && {
            extraToRecipients: undefined,
          }),
          ...(values.emailOptions.extraCcRecipients.length === 0 && {
            extraCcRecipients: undefined,
          }),
          ...(values.emailOptions.extraBccRecipients.length === 0 && {
            extraBccRecipients: undefined,
          }),
        };

        filteredValues = {
          ...values,
          emailOptions: filteredEmailOptions,
        };
      }

      try {
        const response = await createOrderConfirmation(filteredValues);
        let response2;
        if (response.isValid) {
          setRefresh(!refresh);
          setEmailModalOpen(false);
        }
        setIsSubmitting(false);
        handleToast(response);
        handleToast(response2);
      } catch (error) {
        console.error("Post failed:", error);
      } finally {
        setIsSubmitting(false);
        setSubmitting(false);
      }
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

  const modalData = JSON.parse(localStorage.getItem("ModalData")!);

  const formatExpirationDate = () => {
    const today = new Date();

    const days = [
      "Zondag",
      "Maandag",
      "Dinsdag",
      "Woensdag",
      "Donderdag",
      "Vrijdag",
      "Zaterdag",
    ];
    const months = [
      "Januari",
      "Februari",
      "Maart",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Augustus",
      "September",
      "Oktober",
      "November",
      "December",
    ];

    const dayName = days[today.getDay()];
    const dayy = today.getDate();
    const monthName = months[today.getMonth()];
    const yearFormatted = today.getFullYear();

    return `${dayName} ${dayy} ${monthName} ${yearFormatted}`;
  };
  return (
    <>
      <div
        className="modal fade show d-block"
        id="kt_modal_email_invoice"
        role="dialog"
        tabIndex={-1}
        aria-modal="true"
      >
        {/* begin::Modal dialog */}
        <div className="modal-dialog modal-dialog-centered ">
          {/* begin::Modal content */}
          <div className="modal-content">
            <InvoiceEmailModalHeader
              parsedData={parsedData}
              setEmailModalOpen={setEmailModalOpen}
              quoteNr={quoteNr}
            />
            {/* begin::Modal body */}

            <div className="modal-body p-10">
              <div className="row">
                <div className="col-6">
                  <label className="fw-bold fs-6 mb-3">
                    {intl.formatMessage({ id: "Fields.DeliveryDate" })}
                  </label>
                  <div
                    className="input-group"
                    id="kt_td_picker_date_only"
                    data-td-target-input="nearest"
                    data-td-target-toggle="nearest"
                  >
                    <Flatpickr
                      value={
                        formik.values.expectedDeliveryDate
                          ? new Date(formik.values.expectedDeliveryDate)
                          : ""
                      }
                      onChange={(date: Date[]) =>
                        formik.setFieldValue(
                          "expectedDeliveryDate",
                          date[0].toISOString()
                        )
                      }
                      options={{
                        weekNumbers: true,
                        dateFormat: "d-m-Y",
                        allowInput: true,
                      }}
                      className="form-control"
                      placeholder="dd-MM-yyyy"
                      style={{ height: "38px" }}
                    />

                    <span
                      className="input-group-text"
                      style={{ height: "38px" }}
                      data-td-target="#kt_td_picker_date_only"
                      data-td-toggle="datetimepicker"
                    >
                      <i className="ki-duotone ki-calendar fs-2 text-primary">
                        <span className="path1"></span>
                        <span className="path2"></span>
                      </i>
                    </span>
                  </div>
                </div>
              </div>
              <div className="separator border-gray-300 my-10"></div>
              <div className="form-check form-switch form-check-custom form-check-primary form-check-solid mt-1 ms-2 d-flex align-items-center mb-10">
                <input
                  className="form-check-input h-25px w-45px me-5 cursor-pointer"
                  type="checkbox"
                  id="sendNotificationSwitch"
                  checked={formik.values.sendNotification}
                  onChange={(e) => {
                    formik.setFieldValue(
                      "sendNotification",
                      !formik.values.sendNotification
                    );
                  }}
                />
                <label
                  className="form-check-label fs-sm text-muted"
                  htmlFor="sendNotificationSwitch"
                >
                  {intl.formatMessage({
                    id: "Fields.NotifyClient",
                  })}
                </label>
              </div>

              {formik.values.sendNotification && (
                <>
                  <div className="separator border-gray-300 my-10"></div>
                  <div className="form-check form-switch form-check-custom form-check-primary form-check-solid mt-1 ms-2 d-flex align-items-center mb-7">
                    <input
                      className="form-check-input h-25px w-45px me-5 cursor-pointer"
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
                        id: "Fields.ModalSendInvoiceOptionSendToClient",
                      })}
                    </label>
                  </div>
                  <div className="form-check form-switch form-check-custom form-check-primary form-check-solid mt-1 ms-2 d-flex align-items-center">
                    <input
                      className="form-check-input h-25px w-45px me-5 cursor-pointer"
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
                        id: "Fields.ModalSendInvoiceOptionSendMeAnCopy",
                      })}
                    </label>
                  </div>
                  {formik.errors.emailOptions && (
                    <div className="fv-plugins-message-container ms-2 mt-5">
                      <div className="fv-help-block">
                        <span
                          dangerouslySetInnerHTML={{
                            __html: formik.errors.emailOptions as string,
                          }}
                        />
                      </div>
                    </div>
                  )}
                  <div className="separator border-gray-300 my-10"></div>
                  <h2 className="fw-normal">
                    {intl.formatMessage({
                      id: "Fields.ModalSendInvoiceTabTitleRecipients",
                    })}
                  </h2>
                  <div className="accordion pt-4" id="contactAccordion">
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
                          {intl.formatMessage({
                            id: "Fields.ModalSendInvoiceTabTitleTo",
                          })}{" "}
                          {formik.values.emailOptions.extraToRecipients.length >
                            0 &&
                            `(${formik.values.emailOptions.extraToRecipients.length})`}
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
                                  formik.values.emailOptions
                                    .extraToRecipients || []
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
                          {intl.formatMessage({
                            id: "Fields.ModalSendInvoiceTabTitleCc",
                          })}{" "}
                          {formik.values.emailOptions.extraCcRecipients.length >
                            0 &&
                            `(${formik.values.emailOptions.extraCcRecipients.length})`}
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
                                  formik.values.emailOptions
                                    .extraCcRecipients || []
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
                          {intl.formatMessage({
                            id: "Fields.ModalSendInvoiceTabTitleBcc",
                          })}{" "}
                          {formik.values.emailOptions.extraBccRecipients
                            .length > 0 &&
                            `(${formik.values.emailOptions.extraBccRecipients.length})`}
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
                                  formik.values.emailOptions
                                    .extraBccRecipients || []
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
                </>
              )}
            </div>

            {/* end::Modal body */}
            <InvoiceEmailModalFooter
              formik={formik}
              setEmailModalOpen={setEmailModalOpen}
              isSubmitting={isSubmitting}
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

export { QuoteOrderConfirmationModal };
