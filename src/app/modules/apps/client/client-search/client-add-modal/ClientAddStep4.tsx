import enums from "../../../../../../invoicehippo.enums.json";
import { FC } from "react";
import Select from "react-select";
import { useIntl } from "react-intl";
import clsx from "clsx";
import Flatpickr from "react-flatpickr";
import { ClientAddModalFooter } from "./ClientAddModalFooter";

type Props = {
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
  formik: any;
  setAddModalOpen: (type: boolean) => void;
};

const ClientAddStep4: FC<Props> = ({
  isSubmitting,
  formik,
  setAddModalOpen,
}) => {
  const intl = useIntl();
  // Helper function to render form fields based on fieldType with global index
  const renderFormField = (field: any, fieldIndex: number) => {
    switch (field?.fieldType?.name) {
      case "Text":
        return (
          <div className="row mb-7" key={field.fieldId}>
            <label className="fw-bold fs-6 mb-3">{field.fieldLabel}</label>
            <input
              type="text"
              {...formik.getFieldProps(
                `customFields[${fieldIndex}].value.asText`
              )}
              value={
                formik.values.customFields?.[fieldIndex]?.value?.asText || ""
              }
              onChange={formik.handleChange}
              className={clsx(
                "form-control form-control-white",
                {
                  "is-invalid":
                    formik.touched.customFields?.[fieldIndex]?.value?.asText &&
                    formik.errors.customFields?.[fieldIndex]?.value?.asText,
                },
                {
                  "is-valid":
                    formik.touched.customFields?.[fieldIndex]?.value?.asText &&
                    !formik.errors.customFields?.[fieldIndex]?.value?.asText,
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
                `customFields[${fieldIndex}].value.asNumber`
              )}
              value={
                formik.values.customFields?.[fieldIndex]?.value?.asNumber || ""
              }
              onChange={formik.handleChange}
              className={clsx(
                "form-control form-control-white",
                {
                  "is-invalid":
                    formik.touched.customFields?.[fieldIndex]?.value
                      ?.asNumber &&
                    formik.errors.customFields?.[fieldIndex]?.value?.asNumber,
                },
                {
                  "is-valid":
                    formik.touched.customFields?.[fieldIndex]?.value
                      ?.asNumber &&
                    !formik.errors.customFields?.[fieldIndex]?.value?.asNumber,
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
                  formik.values.customFields?.[fieldIndex]?.value?.asDate || ""
                }
                {...formik.getFieldProps(
                  `customFields[${fieldIndex}].value.asDate`
                )}
                onChange={(date: Date[]) => {
                  formik.setFieldValue(
                    `customFields[${fieldIndex}].value.asDate`,
                    date.length > 0 ? date[0].toISOString() : "" // Convert Date to ISO string
                  );
                }}
                options={{
                  weekNumbers: true,
                  dateFormat: "d-m-Y",
                }}
                className="form-control"
                placeholder="dd-MM-yyyy"
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
          <div className="fv-row mb-7" key={field.fieldId}>
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
              value={
                formik.values.customFields?.[fieldIndex]?.value?.asText
                  ? {
                      value:
                        formik.values.customFields?.[fieldIndex]?.value.asText,
                      label:
                        formik.values.customFields?.[fieldIndex]?.value.asText,
                    }
                  : null
              }
              onChange={(selectedOption: any) => {
                formik.setFieldValue(
                  `customFields[${fieldIndex}].value.asText`,
                  selectedOption ? selectedOption.value : ""
                );
              }}
              isClearable
            />
          </div>
        );
      case "MultipleOptions":
        return (
          <div className="fv-row mb-7" key={field.fieldId}>
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
              value={
                formik.values.customFields?.[fieldIndex]?.value?.asOptions
                  ? formik.values.customFields?.[
                      fieldIndex
                    ]?.value.asOptions.map((opt: string) => ({
                      value: opt,
                      label: opt,
                    }))
                  : []
              }
              onChange={(selectedOptions: any) => {
                formik.setFieldValue(
                  `customFields[${fieldIndex}].value.asOptions`,
                  selectedOptions
                    ? selectedOptions.map((opt: any) => opt.value)
                    : []
                );
              }}
              isClearable
              isMulti
            />
          </div>
        );

      default:
        return null;
    }
  };

  // Group fields by their groupDisplayName and use global index
  const groupedFields = formik.values.customFields
    ?.filter((field: any) => field !== undefined)
    .reduce((groups: any, field: any, index: number) => {
      const group =
        field?.groupDisplayName ||
        intl.formatMessage({ id: "Fields.CustomFeaturesUngrouped" });
      if (!groups[group]) {
        groups[group] = [];
      }
      groups[group].push({ field, index });
      return groups;
    }, {});
  return (
    <>
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
                {groupedFields[groupName].map(
                  ({ field, index }: { field: any; index: number }) => {
                    return renderFormField(field, index);
                  }
                )}
              </div>
            </div>
          ))}
        </form>

        {/* <ClientAddModalFooter
          formik={formik}
          setAddModalOpen={setAddModalOpen}
          isSubmitting={isSubmitting}
        /> */}
      </div>
    </>
  );
};

export { ClientAddStep4 };
