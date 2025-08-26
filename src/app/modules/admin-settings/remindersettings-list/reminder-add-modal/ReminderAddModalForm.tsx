import { FC, useEffect, useState } from "react";
import clsx from "clsx";
import { useIntl } from "react-intl";
import Select from "react-select";
import { NotificationCycleItem } from "../core/_models";
import { FormikProps } from "formik";
import enums from "../../../../../_metronic/i18n/messages/invoicehippo.enums.json";
import { getEnumOptions } from "../../../../helpers/intlHelper";

type Props = {
  formik: FormikProps<NotificationCycleItem>;
  isSubmitting: boolean;
};

const ReminderAddModalForm = ({ formik, isSubmitting }: Props) => {
  const intl = useIntl();

  const reminderDaysOptions = Array.from({ length: 90 }, (_, i) => ({
    value: i + 1,
    label: `${i + 1}`,
  }));
  useEffect(() => {
    if (formik.values.areaUsageType === 2) {
      formik.setFieldValue("reminder1.emailReminderType", 6);
      formik.setFieldValue("reminder2.emailReminderType", 6);
      formik.setFieldValue("reminder3.emailReminderType", 6);
    } else {
      formik.setFieldValue("reminder1.emailReminderType", 1);
      formik.setFieldValue("reminder2.emailReminderType", 1);
      formik.setFieldValue("reminder3.emailReminderType", 1);
    }
  }, [formik.values.areaUsageType]);

  const emailReminderTypeOptions = getEnumOptions(
    enums.NotificationEmailTemplateTypes,
    intl
  );
  const tabs: {
    id: "reminder1" | "reminder2" | "reminder3";
    label: string;
    info: string;
  }[] = [
    {
      id: "reminder1",
      label: intl.formatMessage({ id: "Fields.Reminder1" }),
      info: "Hier kun je aangeven hoeveel dagen na de vervaldatum van de factuur of offerte de eerste herinnering verstuurd moet worden. Je kunt met de template selectie aangeven wat voor melding er verstuurd moet worden naar de klant",
    },
    {
      id: "reminder2",
      label: intl.formatMessage({ id: "Fields.Reminder2" }),
      info: "Hier kun je aangeven hoeveel dagen nadat de 1e herinnering van een factuur of offerte is verstuurd, de 2e herinnering verstuurd moet worden. Je kunt met de template selectie aangeven wat voor melding er verstuurd moet worden naar de klant",
    },
    {
      id: "reminder3",
      label: intl.formatMessage({ id: "Fields.Reminder3" }),
      info: "Hier kun je aangeven hoeveel dagen nadat de 2e herinnering van een factuur of offerte is verstuurd, de 3e en tevens laatste herinnering verstuurd moet worden. Je kunt met de template selectie aangeven wat voor melding er verstuurd moet worden naar de klant",
    },
  ];
  return (
    <form className="form p-3" onSubmit={formik.handleSubmit} noValidate>
      {/* begin::Input group */}
      <div className="row d-flex mb-2">
        <div className="fv-row col-3">
          <label className="required fw-bold fs-6 mb-2">
            {intl.formatMessage({
              id: "Fields.NotificationCycleAreaUsageType",
            })}
          </label>
        </div>
        <div className="fv-row col-6">
          <label className="required fw-bold fs-6 mb-2">
            {intl.formatMessage({
              id: "Fields.FullName",
            })}
          </label>
        </div>
        <div className="fv-row col-3">
          <div className="form-check form-switch form-check-custom form-check-success form-check-solid mt-1 ms-2 d-flex align-items-center">
            <label
              className="form-check-label fs-sm text-muted"
              htmlFor="isDefaultSwitch"
            >
              {intl.formatMessage({
                id: "Fields.IsDefault",
              })}
            </label>
            <input
              className="form-check-input h-20px w-40px ms-5 cursor-pointer"
              type="checkbox"
              id="isDefaultSwitch"
              checked={formik.values.isDefault}
              onChange={(e) => {
                formik.setFieldValue("isDefault", !formik.values.isDefault);
              }}
            />
          </div>
        </div>
      </div>
      <div className="row d-flex mb-7 mt-0">
        <div className="fv-row col-3">
          <Select
            className={clsx(
              "react-select-styled react-select-transparent border-bottom",
              {
                "is-invalid":
                  formik.touched.areaUsageType && formik.errors.areaUsageType,
              },
              {
                "is-valid":
                  formik.touched.areaUsageType && !formik.errors.areaUsageType,
              }
            )}
            options={getEnumOptions(
              enums.NotificationCycleAreaUsageTypes,
              intl
            )}
            value={
              formik.values.areaUsageType === 0
                ? null
                : getEnumOptions(
                    enums.NotificationCycleAreaUsageTypes,
                    intl
                  ).find(
                    (item) => item.value === formik.values.areaUsageType
                  ) || null
            }
            onChange={(selectedOption) => {
              formik.setFieldValue("areaUsageType", selectedOption?.value);
            }}
            onBlur={() => formik.setFieldTouched("areaUsageType", true)}
          />
          {formik.touched.areaUsageType && formik.errors.areaUsageType && (
            <div className="fv-plugins-message-container">
              <div className="fv-help-block">
                <span
                  dangerouslySetInnerHTML={{
                    __html: formik.errors.areaUsageType,
                  }}
                  role="alert"
                />
              </div>
            </div>
          )}
        </div>
        <div className="fv-row col-9">
          <input
            type="text"
            {...formik.getFieldProps("title")}
            className={clsx("form-control form-control-solid")}
            disabled={isSubmitting}
            placeholder={intl.formatMessage({ id: "Fields.FullName" })}
          />
          {formik.touched.title && formik.errors.title && (
            <div className="fv-plugins-message-container">
              <div className="fv-help-block">
                <span
                  dangerouslySetInnerHTML={{
                    __html: formik.errors.title,
                  }}
                  role="alert"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <ul className="nav nav-tabs nav-line-tabs nav-line-tabs-2xe mb-5 fs-6">
        {tabs.map((tab, index) => (
          <li className="nav-item" key={tab.id}>
            <a
              className={`nav-link ${index === 0 ? "active" : ""}`}
              data-bs-toggle="tab"
              href={`#${tab.id}`}
            >
              {tab.label}
            </a>
          </li>
        ))}
      </ul>

      {/* Tabs Content */}
      <div className="tab-content">
        {tabs.map((tab, index) => (
          <div
            key={tab.id}
            className={`tab-pane fade ${index === 0 ? "show active" : ""}`}
            id={tab.id}
          >
            <div
              className="row alert alert-custom alert-default bg-secondary align-items-center my-10"
              role="alert"
            >
              <div className="alert-icon col-1 me-4">
                <i className="ki-duotone ki-information-4 fs-3x text-center text-primary">
                  <span className="path1"></span>
                  <span className="path2"></span>
                  <span className="path3"></span>
                </i>
              </div>
              <div className="alert-text col-10 d-flex flex-column">
                {tab.info}
              </div>
            </div>

            {/* Selectors */}

            <div className="row mb-5">
              <div className="col-5">
                <label className="required fw-bold fs-6 mb-2">
                  {intl.formatMessage({ id: "Fields.ReminderDays" })}
                </label>
                <Select
                  options={reminderDaysOptions}
                  value={reminderDaysOptions.find(
                    (option) =>
                      option.value === formik.values[tab.id]?.reminderDays
                  )}
                  onChange={(option) =>
                    formik.setFieldValue(
                      `${tab.id}.reminderDays`,
                      option?.value
                    )
                  }
                />
              </div>
              <div className="col-7">
                <label className="required fw-bold fs-6 mb-2">
                  {intl.formatMessage({ id: "Fields.EmailReminderType" })}
                </label>
                <Select
                  options={
                    formik.values.areaUsageType === 1
                      ? emailReminderTypeOptions.slice(0, 5) // First 5 options
                      : formik.values.areaUsageType === 2
                      ? emailReminderTypeOptions.slice(-2) // Last 2 options
                      : emailReminderTypeOptions // Default: all options
                  }
                  value={emailReminderTypeOptions.find((option) => {
                    return (
                      option.value === formik.values[tab.id]?.emailReminderType
                    );
                  })}
                  onChange={(option) =>
                    formik.setFieldValue(
                      `${tab.id}.emailReminderType`,
                      option?.value
                    )
                  }
                />
              </div>
            </div>

            {/* Switches */}
            <div className="row mb-3">
              <div className="col-5 d-flex align-items-center">
                <label
                  className="form-check-label fs-sm text-muted me-3"
                  htmlFor="finalizeSwitch"
                >
                  {intl.formatMessage({
                    id: "Fields.IsActive",
                  })}
                </label>
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={formik.values[tab.id]?.isActive}
                    onChange={() =>
                      formik.setFieldValue(
                        `${tab.id}.isActive`,
                        !formik.values[tab.id]?.isActive
                      )
                    }
                  />
                </div>
              </div>
              <div className="col-7 d-flex align-items-center">
                <label
                  className="form-check-label fs-sm text-muted me-3"
                  htmlFor="finalizeSwitch"
                >
                  {intl.formatMessage({
                    id: "Fields.SendMeAnCopy",
                  })}
                </label>
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={formik.values[tab.id]?.sendMeAnCopy}
                    onChange={() =>
                      formik.setFieldValue(
                        `${tab.id}.sendMeAnCopy`,
                        !formik.values[tab.id]?.sendMeAnCopy
                      )
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* end::Input group */}

      {/* end::Input group */}
    </form>
  );
};

export { ReminderAddModalForm };
