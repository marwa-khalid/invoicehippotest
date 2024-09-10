import clsx from "clsx";
import { useRef } from "react";
import { useIntl } from "react-intl";
import { FormikProps } from "formik";
import Select from "react-select";
import enums from "../../../../../../invoicehippo.enums.json";
import Tags from "@yaireo/tagify/dist/react.tagify";

type Props = {
  formik: FormikProps<any>;
  isSubmitting: boolean;
};

const CustomFieldsAddModalForm = ({ formik, isSubmitting }: Props) => {
  const intl = useIntl();

  const tagifyRef = useRef<any>();

  return (
    <form className="form p-3" onSubmit={formik.handleSubmit} noValidate>
      {/* begin::Input group */}
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

      <div className="row d-flex mb-5">
        <label className=" required fw-bold fs-6 ">
          {intl.formatMessage({
            id: "Fields.CustomFieldsGroupDisplayName",
          })}
        </label>

        <div
          className="row d-flex mb-5 alert alert-custom alert-default align-items-center mt-5 mx-0 bg-secondary"
          // style={{ backgroundColor: "secondary" }}
          role="alert"
        >
          <div className="alert-icon col-1">
            <i className="ki-duotone ki-information-4 fs-3x text-center text-primary">
              <span className="path1"></span>
              <span className="path2"></span>
              <span className="path3"></span>
            </i>
          </div>
          <div className="alert-text col-11 text-gray-600">
            {intl.formatMessage({
              id: "Fields.CustomFieldsGroupDisplayNameInfo",
            })}
          </div>
        </div>
        <input
          type="text"
          {...formik.getFieldProps("groupDisplayName")}
          className={clsx(
            "form-control form-control-solid",
            {
              "is-invalid":
                formik.touched.groupDisplayName &&
                formik.errors.groupDisplayName,
            },
            {
              "is-valid":
                formik.touched.groupDisplayName &&
                !formik.errors.groupDisplayName,
            }
          )}
          disabled={isSubmitting}
          placeholder={intl.formatMessage({
            id: "Fields.CustomFieldsGroupDisplayName",
          })}
        />

        {formik.touched.groupDisplayName && formik.errors.groupDisplayName && (
          <div className="fv-plugins-message-container">
            <div className="fv-help-block">
              <span
                dangerouslySetInnerHTML={{
                  __html: formik.errors.groupDisplayName,
                }}
                role="alert"
              />
            </div>
          </div>
        )}
      </div>

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
            value={enums.CustomFeatureFieldTypes.map((fieldType) => {
              return {
                value: fieldType.Value,
                label: fieldType.Title,
              };
            }).find((option) => {
              return option.value === formik.values.fieldType;
            })}
            onChange={(selectedOption: any) => {
              formik.setFieldValue(
                "fieldType",
                selectedOption ? selectedOption.value : 0
              );
            }}
            onBlur={() => formik.setFieldTouched("fieldType", true)}
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
            value={enums.CustomFeatureAreaUsageTypes.map((areaUsageType) => {
              return {
                value: areaUsageType.Value,
                label: areaUsageType.Title,
              };
            }).find((option) => {
              return option.value === formik.values.areaUsageType;
            })}
            onChange={(selectedOption: any) => {
              formik.setFieldValue(
                "areaUsageType",
                selectedOption ? selectedOption.value : 0
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
            value={enums.IncludeOnDocumentAreaTypes.map((item) => {
              return {
                value: item.Value,
                label: item.Title,
              };
            }).find((option) => {
              return option.value === formik.values.includeOnInvoiceType;
            })}
            onChange={(selectedOption: any) => {
              formik.setFieldValue(
                "includeOnInvoiceType",
                selectedOption ? selectedOption.value : 0
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
            value={enums.IncludeOnDocumentAreaTypes.map((item) => {
              return {
                value: item.Value,
                label: item.Title,
              };
            }).find((option) => {
              return option.value === formik.values.includeOnQuoteType;
            })}
            onChange={(selectedOption: any) => {
              formik.setFieldValue(
                "includeOnQuoteType",
                selectedOption ? selectedOption.value : 0
              );
            }}
            isClearable
          />
        </div>
      </div>

      {(formik.values.fieldType === 16 || formik.values.fieldType === 32) && (
        <>
          <div className="row d-flex mt-5">
            <label className="fw-bold fs-6 mb-3 required">
              {intl.formatMessage({
                id: "Fields.OptionsOrMultipleOptions",
              })}
            </label>
          </div>

          {/* Alert Box */}
          <div
            className="row  d-flex flex-row mx-0 bg-secondary mb-3 p-5 rounded"
            role="alert"
          >
            <div className="alert-icon me-4 col-1">
              <i className="ki-duotone ki-information-4 fs-3x text-center text-primary">
                <span className="path1"></span>
                <span className="path2"></span>
                <span className="path3"></span>
              </i>
            </div>
            <div className="alert-text col-10">
              <p className="my-auto fs-xs">
                {intl.formatMessage({
                  id: "Fields.OptionsOrMultipleOptionsInfo",
                })}
              </p>
            </div>
          </div>
          <div className="row d-flex mt-5">
            {/* Tags Input */}
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
              }}
              value={formik.values.customData || ""}
              onChange={(e: any) => {
                // Convert tags to a semicolon-separated string
                const value = e.detail.tagify.value.map(
                  (tag: any) => tag.value
                );
                formik.setFieldValue("customData", value);
              }}
            />
          </div>
        </>
      )}
    </form>
  );
};

export { CustomFieldsAddModalForm };
