import { FC, useEffect, useState } from "react";
import Select from "react-select";
import { useIntl } from "react-intl";
import { FormikProps } from "formik";
import "quill/dist/quill.snow.css";
import Flatpickr from "react-flatpickr";
import { ClientAddModal } from "../../../client/client-search/client-add-modal/ClientAddModal";
import { getContactListById } from "../../../client/client-search/core/_requests";
import { ClientSearch } from "../../../generic/ClientSearch";
import { ClientAddButtons } from "../../../generic/ClientAddButtons";
import { InvoicePostResult } from "../core/_models";
import { getEnumOptions } from "../../../../helpers/intlHelper";
import enums from "../../../../../_metronic/i18n/messages/invoicehippo.enums.json";
type Props = {
  formik: FormikProps<InvoicePostResult>;
  contactResponse: any;
  setContactResponse: (type: any) => void;
  clientCheck: boolean;
};

const InvoiceAddStep1: FC<Props> = ({
  formik,
  contactResponse,
  setContactResponse,
  clientCheck,
}) => {
  const intl = useIntl();
  const [clientModal, setClientModalOpen] = useState<boolean>(false);
  const [editModalId, setEditModalId] = useState<number>(0);

  const [clientSearch, setClientSearch] = useState<any>();

  const openClientModal = () => {
    setEditModalId(formik.values.header.clientId);
    setClientModalOpen(true);
  };
  const openClientModalInNewMode = () => {
    setEditModalId(0);
    setClientModalOpen(true);
  };

  useEffect(() => {
    if (clientCheck) {
      const clientResponse = JSON.parse(
        localStorage.getItem("clientResponse")!
      );

      if (clientResponse != null) {
        formik.setFieldValue("header.clientId", clientResponse.id);
        fetchContacts();

        formik.setFieldValue(
          "header.clientDisplayName",
          clientResponse.customerNr + " " + clientResponse.businessName
        );
      }
    }
  }, [clientCheck, clientModal, clientSearch]);

  useEffect(() => {
    localStorage.removeItem("isNew");
  }, [clientModal]);
  const fetchContacts = async () => {
    let count = 1;
    const response = await getContactListById(formik.values.header.clientId);

    if (response.isValid) {
      if (response.isValid) {
        const defaultContact = response.result.find(
          (contact) => contact.isDefaultContact === true
        )?.id;
        formik.setFieldValue("header.clientContactId", defaultContact);
        setContactResponse(response.result);
      }
    }
    count++;
  };
  useEffect(() => {
    if (formik.values.header.clientId != 0) {
      fetchContacts();
    }
  }, [formik.values.header.clientId]);

  const reset = () => {
    localStorage.removeItem("contactResponse");
    localStorage.removeItem("clientResponse");
    formik.setFieldValue("header.clientDisplayName", "");
    formik.setFieldValue("header.clientId", 0);
    setContactResponse(null);
  };
  const contactsArray = Array.isArray(contactResponse)
    ? contactResponse
    : contactResponse
    ? [contactResponse]
    : [];

  const contactOptions = contactsArray.map((contact: any) => ({
    value: contact.id,
    label: contact.fullName,
  }));

  const handleClose = () => {
    setClientSearch(false);
  };

  return (
    <>
      <div className="modal-body" id="#kt_tab_pane_4">
        <form className="form p-4" noValidate>
          <div className="row d-flex mb-5">
            <div className="col-4">
              <label className="required fw-bold fs-6 mb-3">
                {intl.formatMessage({ id: "Fields.InvoiceDate" })}
              </label>
              <div
                className="input-group"
                id="kt_td_picker_date_only"
                data-td-target-input="nearest"
                data-td-target-toggle="nearest"
              >
                <Flatpickr
                  value={formik.values.header.invoiceDate}
                  onChange={(date: Date[]) =>
                    formik.setFieldValue(
                      "header.invoiceDate",
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
            <div className="col-3">
              <label className="required fw-bold fs-6 mb-3">
                {intl.formatMessage({
                  id: "Fields.DeadLineForPaymentDays",
                })}
              </label>
              <Select
                name="header.deadLineForPaymentDays"
                value={
                  formik.values.header.deadLineForPaymentDays === 0
                    ? null
                    : {
                        value: formik.values.header.deadLineForPaymentDays,
                        label:
                          formik.values.header.deadLineForPaymentDays?.toString(),
                      }
                }
                onChange={(option) =>
                  formik.setFieldValue(
                    "header.deadLineForPaymentDays",
                    option ? option.value : null
                  )
                }
                options={Array.from({ length: 89 }, (_, index) => {
                  const value = index + 2;
                  return { value, label: value.toString() };
                })}
              />
            </div>
            <div className="col-5">
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
                  value={formik.values.header.deliveryDate}
                  onChange={(date: Date[]) =>
                    formik.setFieldValue(
                      "header.deliveryDate",
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
          <div className="row d-flex mb-7">
            <div className="col-7">
              {/* Label for the first field */}
              <label className="required fw-bold fs-6 mb-3">
                {intl.formatMessage({ id: "Fields.Client" })}
              </label>

              <ClientAddButtons
                clientDisplayName={formik.values.header.clientDisplayName}
                openClientModal={openClientModal}
                openClientModalInNewMode={openClientModalInNewMode}
                reset={reset}
                setClientSearch={setClientSearch}
                type="modal"
              />
            </div>
            <div className="col-5">
              {/* Label for the second field */}
              <label className=" fw-bold fs-6 mb-3">
                {intl.formatMessage({ id: "Fields.ClientReferenceNr" })}
              </label>
              {/* Input field */}
              <input
                type="text"
                name="header.clientReferenceNr"
                value={formik.values.header.clientReferenceNr || ""}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="form-control form-control-solid"
                placeholder={intl.formatMessage({
                  id: "Fields.ClientReferenceNr",
                })}
              />
            </div>
          </div>
          <div className="row d-flex mb-7">
            <div className="col-7">
              {contactsArray.length > 0 && (
                <Select
                  value={
                    formik.values.header.clientContactId != 0
                      ? contactOptions.find(
                          (contact) =>
                            contact.value ===
                            formik.values.header.clientContactId
                        )
                      : null
                  }
                  onChange={(selectedOption: any) => {
                    formik.setFieldValue(
                      "header.clientContactId",
                      selectedOption.value
                    );
                  }}
                  options={contactOptions}
                  placeholder={intl.formatMessage({ id: "Fields.Contacts" })}
                />
              )}
            </div>
          </div>
          {/* <div className="row d-flex form-wrapper bg-secondary p-5 rounded mb-7">
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
          </div> */}
          {/* <div className="form-check form-switch mt-1 ms-2 d-flex align-items-center mb-7">
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
          </div> */}

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
                  value={formik.values.automationSettings.subscriptionStartDate}
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
                      formik.values.automationSettings.invoiceRecurringType
                  ) || 0
                }
                options={getEnumOptions(enums.InvoiceRecurringTypes, intl)}
                closeMenuOnSelect={false}
                isClearable
                data-kt-menu-dismiss="false"
              />
            </div>
          </div>
          <div className="separator my-7"></div>

          <div className="row mb-7">
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
                  value={formik.values.automationSettings.recurringEndDate}
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

            <div className="col-6">
              <label className="required fw-bold fs-6 mb-3">
                {intl.formatMessage({
                  id: "Fields.RecurringMaxCount",
                })}
              </label>
              <Select
                name="automationSettings.recurringMaxCount"
                value={
                  formik.values.automationSettings.recurringMaxCount === 0
                    ? null
                    : {
                        value:
                          formik.values.automationSettings.recurringMaxCount,
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
          </div>
          <div className="row">
            <div className="fv-row col-6"></div>
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
          <div className="row">
            <div className="fv-row col-6">
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
            </div>
            <div className="fv-row col-6">
              <div className="form-check form-switch mt-1 ms-2 d-flex align-items-center mb-7">
                <input
                  className="form-check-input h-25px w-45px me-5"
                  type="checkbox"
                  id="automationEnableSepaIncassoSwitch"
                  checked={
                    formik.values.automationSettings.automationEnableSepaIncasso
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
            </div>
          </div>

          <div className="separator my-7"></div>
          <div className="row">
            <div className="fv-row col-6">
              {" "}
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
                      !formik.values.automationSettings.afterAutomationNotifyMe
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
            </div>
            <div className="fv-row col-6">
              {" "}
              <div className="form-check form-switch mt-1 ms-2 d-flex align-items-center">
                <input
                  className="form-check-input h-25px w-45px me-5"
                  type="checkbox"
                  id="afterAutomationSendMeAnCopySwitch"
                  checked={
                    formik.values.automationSettings.afterAutomationSendMeAnCopy
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
            </div>
          </div>
        </form>
        {clientModal && (
          <ClientAddModal
            setEditModalId={setEditModalId}
            setAddModalOpen={setClientModalOpen}
            editModalId={editModalId}
          />
        )}
        {clientSearch && (
          <ClientSearch
            handleClose={handleClose}
            formik={formik}
            storageName="storedClient"
          />
        )}
      </div>
    </>
  );
};

export { InvoiceAddStep1 };
