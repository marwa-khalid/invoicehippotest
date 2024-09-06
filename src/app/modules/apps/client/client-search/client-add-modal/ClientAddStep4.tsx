import enums from "../../../../../../invoicehippo.enums.json";
import { FC } from "react";
import Select from "react-select";
import { useIntl } from "react-intl";
import clsx from "clsx";

type Props = {
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
  formik: any;
};

const ClientAddStep4: FC<Props> = ({ setIsSubmitting, formik }) => {
  const intl = useIntl();

  // Helper function to render form fields based on fieldType
  const renderFormField = (field: any) => {
    switch (field.fieldType.name) {
      case "Text":
        return (
          <div className="row mb-7" key={field.fieldId}>
            <label className="fw-bold fs-6 mb-3">{field.fieldLabel}</label>
            <input
              type="text"
              {...formik.getFieldProps(
                `customFields[${field.fieldId}].value.asText`
              )}
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

  return (
    <div className="modal-body">
      <form className="form p-3" noValidate>
        <div className="card bg-secondary">
          <div className="card-header d-flex flex-column p-3 mx-3">
            <h3 className="card-title text-gray-600 fw-bold mb-0 h-0">
              {intl.formatMessage({ id: "Fields.CustomFeatures" })}
            </h3>
            <span className="mt-0 text-muted fs-7">
              {intl.formatMessage({ id: "Fields.CustomFeaturesSubTitle" })}
            </span>
          </div>
          <div className="separator border-gray-300 "></div>
          <div className="card-body">
            <div className="row d-flex mb-5">
              {/* Replace formik.getFieldValue with formik.values */}
              {formik.values.customFields &&
                formik.values.customFields.map((field: any) =>
                  renderFormField(field)
                )}
            </div>
          </div>
        </div>
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
