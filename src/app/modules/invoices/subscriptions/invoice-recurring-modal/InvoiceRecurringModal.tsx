import { useEffect } from "react";
import { QuoteCopyModalHeader } from "./QuoteCopyModalHeader";
import { QuoteCopyModalFooter } from "./QuoteCopyModalFooter";
import { useIntl } from "react-intl";
import { FormikProps } from "formik";
import { InvoicePostResult } from "../core/_models";
import Flatpickr from "react-flatpickr";
import Select from "react-select";
import enums from "../../../../../_metronic/i18n/messages/invoicehippo.enums.json";
import { getEnumOptions } from "../../../../helpers/intlHelper";
interface ComponentProps {
  invoiceId: number;
  setRecurringModalOpen: (type: boolean) => void;
  formik: FormikProps<InvoicePostResult>;
}
const InvoiceRecurringModal = ({
  invoiceId,
  setRecurringModalOpen,
  formik,
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
            <QuoteCopyModalHeader
              setRecurringModalOpen={setRecurringModalOpen}
            />
            {/* begin::Modal body */}
            <div className="modal-body p-10">
              <div className="row d-flex form-wrapper bg-secondary p-5 rounded mb-7">
                <div className="col-2">
                  <i className="ki-duotone ki-information-4 fs-3x text-center text-info">
                    <span className="path1"></span>
                    <span className="path2"></span>
                    <span className="path3"></span>
                  </i>
                </div>

                <span
                  className="col-10"
                  dangerouslySetInnerHTML={{
                    __html: intl.formatMessage({
                      id: "Fields.InvoiceAutomationInfo",
                    }),
                  }}
                />
              </div>
              <div className="form-check form-switch mt-1 ms-2 d-flex align-items-center mb-7">
                <input
                  className="form-check-input h-25px w-45px me-5"
                  type="checkbox"
                  id="enableAutomationSwitch"
                  checked={formik.values.automationSettings.enableAutomation}
                  onChange={(e) => {
                    formik.setFieldValue(
                      "automationSettings.enableAutomation",
                      !formik.values.automationSettings.enableAutomation
                    );
                  }}
                />
                <label
                  className="form-check-label fs-sm text-muted"
                  htmlFor="enableAutomationSwitch"
                >
                  {intl.formatMessage({
                    id: "Fields.EnableAutomation",
                  })}
                </label>
              </div>
              {formik.values.automationSettings.enableAutomation && (
                <>
                  <div className="separator my-7"></div>

                  <div className="row d-flex form-wrapper bg-secondary p-5 rounded mb-7">
                    <div className="col-2">
                      <i className="ki-duotone ki-information-4 fs-3x text-center text-info">
                        <span className="path1"></span>
                        <span className="path2"></span>
                        <span className="path3"></span>
                      </i>
                    </div>

                    <span
                      className="col-10"
                      dangerouslySetInnerHTML={{
                        __html: intl.formatMessage({
                          id: "Fields.SubscriptionStartDateInfo",
                        }),
                      }}
                    />
                  </div>

                  <div className="separator my-7"></div>

                  <div className="row mb-7">
                    <div className="col-6">
                      <label className="required fw-bold fs-6 mb-3">
                        {intl.formatMessage({
                          id: "Fields.SubscriptionStartDate",
                        })}
                      </label>
                      <div
                        className="input-group"
                        id="kt_td_picker_date_only"
                        data-td-target-input="nearest"
                        data-td-target-toggle="nearest"
                      >
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
                        <Flatpickr
                          value={
                            formik.values.automationSettings
                              .subscriptionStartDate
                          }
                          onChange={(date: Date[]) =>
                            formik.setFieldValue(
                              "automationSettings.subscriptionStartDate",
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
                      </div>
                    </div>
                    <div className="col-6">
                      <label className="fw-bold fs-6 mb-3">
                        {intl.formatMessage({ id: "Fields.RecurringEndDate" })}
                      </label>
                      <div
                        className="input-group"
                        id="kt_td_picker_date_only"
                        data-td-target-input="nearest"
                        data-td-target-toggle="nearest"
                      >
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
                        <Flatpickr
                          value={
                            formik.values.automationSettings.recurringEndDate
                          }
                          onChange={(date: Date[]) =>
                            formik.setFieldValue(
                              "automationSettings.recurringEndDate",
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
                      </div>
                    </div>
                  </div>
                  <div className="separator my-7"></div>

                  <div className="row mb-7">
                    <label className="required fw-bold fs-6 mb-3">
                      {intl.formatMessage({
                        id: "Fields.InvoiceRecurringType",
                      })}
                    </label>
                    <Select
                      name="automationSettings.invoiceRecurringType"
                      onChange={(option) =>
                        formik.setFieldValue(
                          "automationSettings.invoiceRecurringType",
                          option
                        )
                      }
                      value={
                        getEnumOptions(enums.InvoiceRecurringTypes, intl).find(
                          (option) =>
                            option.value ===
                            formik.values.automationSettings
                              .invoiceRecurringType
                        ) || 0
                      }
                      options={getEnumOptions(
                        enums.InvoiceRecurringTypes,
                        intl
                      )}
                      closeMenuOnSelect={false}
                      isClearable
                      data-kt-menu-dismiss="false"
                    />
                  </div>
                  <div className="separator my-7"></div>
                  <div className="row mb-7">
                    <div className="col-6">
                      <label className="required fw-bold fs-6 mb-3">
                        {intl.formatMessage({
                          id: "Fields.RecurringMaxCount",
                        })}
                      </label>
                      <Select
                        name="automationSettings.recurringMaxCount"
                        value={
                          formik.values.automationSettings.recurringMaxCount ===
                          0
                            ? null
                            : {
                                value:
                                  formik.values.automationSettings
                                    .recurringMaxCount,
                                label:
                                  formik.values.automationSettings.recurringMaxCount.toString(),
                              }
                        }
                        onChange={(option) =>
                          formik.setFieldValue(
                            "automationSettings.recurringMaxCount",
                            option ? option.value : null
                          )
                        }
                        options={Array.from({ length: 59 }, (_, index) => {
                          const value = index + 2;
                          return { value, label: value.toString() };
                        })}
                        closeMenuOnSelect={false}
                        isClearable
                        data-kt-menu-dismiss="false"
                      />
                    </div>
                    <div className="col-6">
                      <label className="required fw-bold fs-6 mb-3">
                        {intl.formatMessage({
                          id: "Fields.AutomationPreferedIncassoDay",
                        })}
                      </label>
                      <Select
                        name="automationSettings.automationPreferedIncassoDay"
                        value={
                          formik.values.automationSettings
                            .automationPreferedIncassoDay === 0
                            ? null
                            : {
                                value:
                                  formik.values.automationSettings
                                    .automationPreferedIncassoDay,
                                label:
                                  formik.values.automationSettings.automationPreferedIncassoDay.toString(),
                              }
                        }
                        onChange={(option) =>
                          formik.setFieldValue(
                            "automationSettings.automationPreferedIncassoDay",
                            option ? option.value : null
                          )
                        }
                        options={Array.from({ length: 28 }, (_, index) => {
                          const value = index + 1;
                          return { value, label: value.toString() };
                        })}
                        closeMenuOnSelect={false}
                        isClearable
                        data-kt-menu-dismiss="false"
                      />
                    </div>
                  </div>

                  <div className="separator my-7"></div>
                  <div className="form-check form-switch mt-1 ms-2 d-flex align-items-center mb-7">
                    <input
                      className="form-check-input h-25px w-45px me-5"
                      type="checkbox"
                      id="autoSendAfterRecurringAutoCopySwitch"
                      checked={
                        formik.values.automationSettings
                          .autoSendAfterRecurringAutoCopy
                      }
                      onChange={(e) => {
                        formik.setFieldValue(
                          "automationSettings.autoSendAfterRecurringAutoCopy",
                          !formik.values.automationSettings
                            .autoSendAfterRecurringAutoCopy
                        );
                      }}
                    />
                    <label
                      className="form-check-label fs-sm text-muted"
                      htmlFor="autoSendAfterRecurringAutoCopySwitch"
                    >
                      {intl.formatMessage({
                        id: "Fields.AutoSendAfterRecurringAutoCopy",
                      })}
                    </label>
                  </div>

                  <div className="separator my-7"></div>
                  <div className="form-check form-switch mt-1 ms-2 d-flex align-items-center mb-7">
                    <input
                      className="form-check-input h-25px w-45px me-5"
                      type="checkbox"
                      id="automationEnableSepaIncassoSwitch"
                      checked={
                        formik.values.automationSettings
                          .automationEnableSepaIncasso
                      }
                      onChange={(e) => {
                        formik.setFieldValue(
                          "automationSettings.automationEnableSepaIncasso",
                          !formik.values.automationSettings
                            .automationEnableSepaIncasso
                        );
                      }}
                    />
                    <label
                      className="form-check-label fs-sm text-muted"
                      htmlFor="automationEnableSepaIncassoSwitch"
                    >
                      {intl.formatMessage({
                        id: "Fields.AutomationEnableSepaIncasso",
                      })}
                    </label>
                  </div>

                  <div className="separator my-7"></div>
                  <div className="form-check form-switch mt-1 ms-2 d-flex align-items-center mb-7">
                    <input
                      className="form-check-input h-25px w-45px me-5"
                      type="checkbox"
                      id="afterAutomationNotifyMeSwitch"
                      checked={
                        formik.values.automationSettings.afterAutomationNotifyMe
                      }
                      onChange={(e) => {
                        formik.setFieldValue(
                          "automationSettings.afterAutomationNotifyMe",
                          !formik.values.automationSettings
                            .afterAutomationNotifyMe
                        );
                      }}
                    />
                    <label
                      className="form-check-label fs-sm text-muted"
                      htmlFor="afterAutomationNotifyMeSwitch"
                    >
                      {intl.formatMessage({
                        id: "Fields.AfterAutomationNotifyMe",
                      })}
                    </label>
                  </div>

                  <div className="separator my-7"></div>
                  <div className="form-check form-switch mt-1 ms-2 d-flex align-items-center">
                    <input
                      className="form-check-input h-25px w-45px me-5"
                      type="checkbox"
                      id="afterAutomationSendMeAnCopySwitch"
                      checked={
                        formik.values.automationSettings
                          .afterAutomationSendMeAnCopy
                      }
                      onChange={(e) => {
                        formik.setFieldValue(
                          "automationSettings.afterAutomationSendMeAnCopy",
                          !formik.values.automationSettings
                            .afterAutomationSendMeAnCopy
                        );
                      }}
                    />
                    <label
                      className="form-check-label fs-sm text-muted"
                      htmlFor="afterAutomationSendMeAnCopySwitch"
                    >
                      {intl.formatMessage({
                        id: "Fields.AfterAutomationSendMeAnCopy",
                      })}
                    </label>
                  </div>
                </>
              )}
            </div>

            {/* end::Modal body */}
            <QuoteCopyModalFooter
              invoiceId={invoiceId}
              setRecurringModalOpen={setRecurringModalOpen}
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

export { InvoiceRecurringModal };
