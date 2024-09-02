import clsx from "clsx";
import { useIntl } from "react-intl";
import { FormikProps } from "formik";
import Select from "react-select";
import enums from "../../../../../../invoicehippo.enums.json";
interface FormValues {
  id: number;
  uniqueId: string;
  areaUsageType: number;
  title: string;
  customData: string;
  usageInfo: string;
  fieldType: number;
  editOptions: {
    isActivlyUsed: boolean;
  };
  groupDisplayName: string;
  defaultValue: string;
  includeOnInvoiceType: number;
  includeOnQuoteType: number;
  includeOnDocumentDisplayName: string;
}

type Props = {
  formik: FormikProps<FormValues>;
  isSubmitting: boolean;
};

const DiscountAddModalForm = ({ formik, isSubmitting }: Props) => {
  const intl = useIntl();

  const data = [
    { value: 1, label: "test1" },
    { value: 2, label: "test2" },
    { value: 3, label: "test90" },
  ];

  return (
    <form className="form p-3" onSubmit={formik.handleSubmit} noValidate>
      {/* begin::Input group */}
      <div className="row d-flex mb-5">
        {/* code Field */}
        <div className="col-6 d-flex flex-column">
          <label className="required fw-bold fs-6 mb-2">
            {intl.formatMessage({ id: "Fields.FieldType" })}
          </label>

          <Select
            className="react-select-styled"
            menuPlacement="bottom"
            placeholder={intl.formatMessage({
              id: "Fields.SelectOptionDefaultFieldType",
            })}
            options={enums.CustomFeatureFieldTypes.map((fieldType) => {
              return {
                value: fieldType.Value,
                label: fieldType.Title,
              };
            })}
            value={
              formik.values.fieldType
                ? enums.CustomFeatureFieldTypes.find(
                    (option) => option.Value === formik.values.fieldType
                  )
                : null
            }
            onChange={(selectedOption: any) => {
              formik.setFieldValue(
                "fieldType",
                selectedOption ? selectedOption.value : null
              );
            }}
            onBlur={() => formik.setFieldTouched("fieldType", true)} // Ensuring field is touched
            isClearable
          />
          {formik.touched.fieldType && formik.errors.fieldType && (
            <div className="fv-plugins-message-container">
              <div className="fv-help-block">
                <span
                  dangerouslySetInnerHTML={{
                    __html: formik.errors.fieldType,
                  }}
                  role="alert"
                />
              </div>
            </div>
          )}
        </div>
        <div className="col-6 d-flex flex-column">
          <label className="required fw-bold fs-6 mb-2">
            {intl.formatMessage({ id: "Fields.AreaUsageType" })}
          </label>
          <Select
            className="react-select-styled"
            menuPlacement="bottom"
            placeholder={intl.formatMessage({
              id: "Fields.SelectOptionDefaultAreaType",
            })}
            options={enums.CustomFeatureAreaUsageTypes.map((areaUsageType) => {
              return {
                value: areaUsageType.Value,
                label: areaUsageType.Title,
              };
            })}
            value={
              formik.values.areaUsageType
                ? enums.CustomFeatureAreaUsageTypes.find(
                    (option) => option.Value === formik.values.areaUsageType
                  )
                : null
            }
            onChange={(selectedOption: any) => {
              formik.setFieldValue(
                "areaUsageType",
                selectedOption ? selectedOption.value : null
              );
            }}
            onBlur={() => formik.setFieldTouched("areaUsageType", true)}
            isClearable
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
      </div>
      <div className="row d-flex mb-5">
        <label className="required fw-bold fs-6 mb-2">
          {intl.formatMessage({ id: "Fields.Title" })}
        </label>
        <input
          type="text"
          {...formik.getFieldProps("title")}
          className={clsx(
            "form-control form-control-solid",
            { "is-invalid": formik.touched.title && formik.errors.title },
            { "is-valid": formik.touched.title && !formik.errors.title }
          )}
          disabled={isSubmitting}
          placeholder={intl.formatMessage({ id: "Fields.Title" })}
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
      <div className="row d-flex">
        {/* code Field */}
        <div className="col-6 d-flex flex-column">
          <label className=" fw-bold fs-6 mb-2">
            {intl.formatMessage({ id: "Fields.IncludeOnInvoiceType" })}
          </label>
          <Select
            className="react-select-styled"
            menuPlacement="top"
            placeholder={intl.formatMessage({
              id: "Fields.SelectOptionDefaultIncludeInvoiceAreaType",
            })}
            options={enums.IncludeOnDocumentAreaTypes.map((option) => {
              return {
                value: option.Value,
                label: option.Title,
              };
            })}
            onChange={(selectedOption: any) => {
              formik.setFieldValue(
                "includeOnInvoiceType",
                selectedOption ? selectedOption.value : null
              );
            }}
            isClearable
          />
        </div>
        <div className="col-6 d-flex flex-column">
          <label className=" fw-bold fs-6 mb-2">
            {intl.formatMessage({ id: "Fields.IncludeOnQuoteType" })}
          </label>
          <Select
            className="react-select-styled"
            menuPlacement="top"
            placeholder={intl.formatMessage({
              id: "Fields.SelectOptionDefaultIncludeQuoteAreaType",
            })}
            options={enums.IncludeOnDocumentAreaTypes.map((option) => {
              return {
                value: option.Value,
                label: option.Title,
              };
            })}
            onChange={(selectedOption: any) => {
              formik.setFieldValue(
                "includeOnQuoteType",
                selectedOption ? selectedOption.value : null
              );
            }}
            isClearable
          />
        </div>
      </div>
    </form>
  );
};

export { DiscountAddModalForm };
