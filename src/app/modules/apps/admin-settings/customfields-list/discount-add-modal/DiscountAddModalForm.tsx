import clsx from "clsx";
import { useIntl } from "react-intl";
import { FormikProps } from "formik";
import Select from "react-select";

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
      <div className="row d-flex mb-7">
        {/* code Field */}
        <div className="col-6 d-flex flex-column">
          <label className="required fw-bold fs-6 mb-2">
            {intl.formatMessage({ id: "Fields.FieldType" })}
          </label>
          {console.log(formik.values)!}
          <Select
            className="react-select-styled"
            menuPlacement="bottom"
            placeholder={intl.formatMessage({
              id: "Fields.SelectOptionNvt",
            })}
            options={data}
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
              id: "Fields.SelectOptionNvt",
            })}
            options={data}
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
      <div className="row d-flex mb-7">
        <label className="required fw-bold fs-6 mb-2 mt-4">
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
      <div className="row d-flex mb-7">
        {/* code Field */}
        <div className="col-6 d-flex flex-column">
          <label className=" fw-bold fs-6 mb-2">
            {intl.formatMessage({ id: "Fields.IncludeOnInvoiceType" })}
          </label>
          <Select
            className="react-select-styled"
            menuPlacement="top"
            placeholder={intl.formatMessage({
              id: "Fields.SelectOptionNvt",
            })}
            options={data}
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
              id: "Fields.SelectOptionNvt",
            })}
            options={data}
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
