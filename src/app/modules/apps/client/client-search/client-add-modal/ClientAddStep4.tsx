import enums from "../../../../../../invoicehippo.enums.json";
import { FC } from "react";
import Select from "react-select";
import { useIntl } from "react-intl";
import clsx from "clsx";
import Flatpickr from "react-flatpickr";

type Props = {
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
  formik: any;
};

const ClientAddStep4: FC<Props> = ({ setIsSubmitting, formik }) => {
  const intl = useIntl();

  // Helper function to render form fields based on fieldType
  const renderFormField = (field: any) => {
    switch (field?.fieldType?.name) {
      case "Text":
        return (
          <div className="row mb-7" key={field.fieldId}>
            <label className="fw-bold fs-6 mb-3">{field.fieldLabel}</label>
            <input
              type="text"
              {...formik.getFieldProps(
                `customFields[${field.fieldId}].value.asText`
              )}
              value={
                formik.values.customFields?.[field.fieldId]?.value?.asText || ""
              }
              onChange={formik.handleChange}
              className={clsx(
                "form-control form-control-solid",
                {
                  "is-invalid":
                    formik.touched.customFields?.[field.fieldId]?.value
                      ?.asText &&
                    formik.errors.customFields?.[field.fieldId]?.value?.asText,
                },
                {
                  "is-valid":
                    formik.touched.customFields?.[field.fieldId]?.value
                      ?.asText &&
                    !formik.errors.customFields?.[field.fieldId]?.value?.asText,
                }
              )}
              placeholder={field.fieldLabel}
            />
          </div>
        );

      case "Number":
        return (
          <div className="row mb-7" key={field.fieldId}>
            <label className="fw-bold fs-6 mb-3">{field.fieldLabel}</label>
            <input
              type="number"
              {...formik.getFieldProps(
                `customFields[${field.fieldId}].value.asNumber`
              )}
              value={
                formik.values.customFields?.[field.fieldId]?.value?.asNumber ||
                ""
              }
              onChange={formik.handleChange}
              className={clsx(
                "form-control form-control-solid",
                {
                  "is-invalid":
                    formik.touched.customFields?.[field.fieldId]?.value
                      ?.asNumber &&
                    formik.errors.customFields?.[field.fieldId]?.value
                      ?.asNumber,
                },
                {
                  "is-valid":
                    formik.touched.customFields?.[field.fieldId]?.value
                      ?.asNumber &&
                    !formik.errors.customFields?.[field.fieldId]?.value
                      ?.asNumber,
                }
              )}
              placeholder={field.fieldLabel}
            />
          </div>
        );

      case "Date":
        return (
          <div className="row mb-7" key={field.fieldId}>
            <label className="fw-bold fs-6 mb-3">{field.fieldLabel}</label>
            <div
              className="input-group"
              id="kt_td_picker_date_only"
              data-td-target-input="nearest"
              data-td-target-toggle="nearest"
            >
              <Flatpickr
                value={
                  formik.values.customFields?.[field.fieldId]?.value?.asDate ||
                  ""
                }
                {...formik.getFieldProps(
                  `customFields[${field.fieldId}].value.asDate`
                )}
                onChange={(date: Date[]) => {
                  // Update the formik field value with the selected date
                  formik.setFieldValue(
                    `customFields[${field.fieldId}].value.asDate`,
                    date.length > 0 ? date[0] : ""
                  );
                }}
                options={{
                  weekNumbers: true,
                  dateFormat: "d-m-Y",
                }}
                className="form-control"
                placeholder="dd-MM-yyyy"
                isClearable="true"
              />
              <span
                className="input-group-text"
                data-td-target="#kt_td_picker_date_only"
                data-td-toggle="datetimepicker"
              >
                <i className="ki-duotone ki-calendar fs-2">
                  <span className="path1"></span>
                  <span className="path2"></span>
                </i>
              </span>
            </div>
          </div>
        );

      case "Options":
        return (
          <div className="fv-row" key={field.fieldId}>
            <label className="fw-bold fs-6 mb-3">{field.fieldLabel}</label>
            <Select
              className="react-select-styled"
              menuPlacement="top"
              placeholder={intl.formatMessage({
                id: "Fields.SelectOptionNvt",
              })}
              options={field.options.map((option: string) => ({
                value: option,
                label: option,
              }))}
              onChange={(selectedOption: any) => {
                formik.setFieldValue(
                  `customFields[${field.fieldId}].value.asOptions`,
                  selectedOption ? selectedOption.value : null
                );
              }}
              isClearable
            />
          </div>
        );

      default:
        return null;
    }
  };

  // Group fields by groupDisplayName
  const groupedFields = formik.values.customFields.reduce(
    (groups: any, field: any) => {
      const group =
        field?.groupDisplayName ||
        intl.formatMessage({ id: "Fields.CustomFeaturesUngrouped" }); // Default group name for ungrouped fields
      if (!groups[group]) {
        groups[group] = [];
      }
      groups[group].push(field);
      return groups;
    },
    {}
  );

  return (
    <div className="modal-body">
      <form className="form p-3" noValidate>
        {Object.keys(groupedFields).map((groupName) => (
          <div className="card bg-secondary mb-5" key={groupName}>
            <div className="card-header d-flex flex-column p-3 mx-3">
              <h4 className="card-title text-gray-600 fw-bold mb-0">
                {groupName}
              </h4>

              <span className="mt-0 text-muted fs-7">
                {intl.formatMessage({ id: "Fields.CustomFeaturesSubTitle" })}
              </span>
            </div>
            <div className="separator border-gray-300"></div>
            <div className="card-body">
              {groupedFields[groupName].map((field: any) =>
                renderFormField(field)
              )}
            </div>
          </div>
        ))}
      </form>

      <div className="text-end">
        <button
          type="submit"
          className="btn btn-primary"
          onClick={() => formik.handleSubmit()}
        >
          {intl.formatMessage({ id: "Fields.ActionSave" })}
        </button>
      </div>
    </div>
  );
};

export { ClientAddStep4 };
