import { FC, useEffect, useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import clsx from "clsx";
import { useIntl } from "react-intl";
import Select from "react-select";
import { postVatType } from "../core/_requests";
import { LedgerForVatResult } from "../core/_models";
import { FormikProps } from "formik";
import { VatTypesResult } from "../core/_models";
import enums from "../../../../../../invoicehippo.enums.json";

interface FormValues {
  id: number;
  title: string;
  code: string;
  defaultTaxTypeId: number;
  bearingType: number;
  reportReferenceType1: number;
  reportReferenceType2LegderAccountId: number;
  disableManualInput: boolean;
  taxDeductibleSettings: {
    isNotFullyTaxDeductible: boolean;
    taxDeductiblePercentage: number;
    deductiblePrivateLedgerAccountId: number;
  };
}
interface GroupedOption {
  label: any;
  options: { value: number; label: string }[];
}

type Props = {
  isUserLoading: boolean;
  user: any; // Adjust the type according to your user model
  formik: FormikProps<FormValues>;
  isSubmitting: boolean;
  vatTypes: { value: number; label: string }[];
};

type VatAreaUsageTypeOption = {
  value: number;
  label: string;
};

const VatAddModalForm: FC<Props> = ({
  isUserLoading,
  user,
  formik,
  isSubmitting,
  vatTypes,
}) => {
  const intl = useIntl();
  const [bearingGroups, setBearingGroups] = useState<GroupedOption[]>([]);

  useEffect(() => {
    const toTitleCase = (str: string) => {
      return str.replace(/\w\S*/g, (txt) => {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      });
    };

    const transformBearingTypes = () => {
      const groupMap: { [key: string]: GroupedOption } = {};

      enums.BearingTypes.forEach((item: any) => {
        const group = toTitleCase(item.Group);
        const subGroup = toTitleCase(item.SubGroup);
        const groupKey = `${group} - ${subGroup}`;

        if (!groupMap[groupKey]) {
          groupMap[groupKey] = {
            label: (
              <div>
                {group} - <small>{subGroup}</small>
              </div>
            ) as any,
            options: [],
          };
        }

        groupMap[groupKey].options.push({
          value: item.Value,
          label: item.Title,
        });
      });

      const sortedGroups = Object.values(groupMap).sort((a, b) => {
        const aLabel = (a.label as any).props.children[0];
        const bLabel = (b.label as any).props.children[0];
        return aLabel.localeCompare(bLabel);
      });

      setBearingGroups(sortedGroups);
    };

    transformBearingTypes();
  }, []);

  return (
    <form className="form p-3" onSubmit={formik.handleSubmit} noValidate>
      {/* begin::Input group */}
      <div className="fv-row mb-7">
        <label className="required fw-bold fs-6 mb-2">
          {intl.formatMessage({ id: "Fields.BearingType" })}
        </label>
        <Select
          className="react-select-styled react-select-transparent border-bottom z-index-999"
          placeholder={intl.formatMessage({
            id: "Fields.SelectOptionDefaultLedgerAccountBearingType",
          })}
          options={bearingGroups}
          closeMenuOnSelect={false}
          isClearable
          data-kt-menu-dismiss="false"
        />
      </div>
      {/* end::Input group */}

      {/* begin::Description */}
      {/* <div className="text-muted mb-7">
        {intl.formatMessage({ id: "Fields.IsNoneVatTypeInfo" })}
      </div> */}
      {/* end::Description */}

      {/* begin::Input group */}
      <div className="row d-flex mb-7">
        {/* code Field */}
        <div className={clsx("fv-row  flex-grow-1 col-5")}>
          <label className="required fw-bold fs-6 mb-2">
            {" "}
            {intl.formatMessage({ id: "Fields.Code" })}
          </label>
          <div className="input-group">
            <span className="input-group-text border-end-0">
              <i className="fa fa-c"></i>
            </span>
            <input
              type="text"
              {...formik.getFieldProps("code")}
              className={clsx(
                "form-control border-end-0 border-top-0",
                { "is-invalid": formik.touched.code && formik.errors.code },
                { "is-valid": formik.touched.code && !formik.errors.code }
              )}
              disabled={isSubmitting || isUserLoading}
              placeholder={intl.formatMessage({ id: "Fields.Code" })}
            />
          </div>

          {formik.touched.code && formik.errors.code && (
            <div className="fv-plugins-message-container">
              <div className="fv-help-block">
                <span
                  dangerouslySetInnerHTML={{
                    __html: formik.errors.code,
                  }}
                  role="alert"
                />
              </div>
            </div>
          )}
        </div>

        {/* title Field */}
        <div className="fv-row col-7 flex-grow-1">
          <label className="required fw-bold fs-6 mb-2">
            {" "}
            {intl.formatMessage({ id: "Fields.Title" })}
          </label>
          <input
            type="text"
            {...formik.getFieldProps("title")}
            className={clsx(
              "form-control border-end-0 border-top-0 border-start-0",
              { "is-invalid": formik.touched.title && formik.errors.title },
              { "is-valid": formik.touched.title && !formik.errors.title }
            )}
            disabled={isSubmitting || isUserLoading}
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
      </div>

      {/* begin::Input group */}
      <div className="row">
        <div className="fv-row mb-7 col-5">
          <label className=" fw-bold fs-6 mb-2">
            {intl.formatMessage({ id: "Fields.DefaultTax" })}
          </label>
          <Select
            name="defaultTaxTypeId"
            // value={formik.values.documentGroup}

            onBlur={() => formik.setFieldTouched("defaultTaxTypeId", true)}
            placeholder={intl.formatMessage({
              id: "Fields.SelectOptionNoVatType",
            })}
            className={clsx(
              "react-select-styled",
              {
                "is-invalid":
                  formik.touched.defaultTaxTypeId &&
                  formik.errors.defaultTaxTypeId,
              },
              {
                "is-valid":
                  formik.touched.defaultTaxTypeId &&
                  !formik.errors.defaultTaxTypeId,
              }
            )}
            classNamePrefix="react-select"
            options={vatTypes}
          />

          {formik.touched.defaultTaxTypeId &&
            formik.errors.defaultTaxTypeId && (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  <span
                    dangerouslySetInnerHTML={{
                      __html: formik.errors.defaultTaxTypeId,
                    }}
                    role="alert"
                  />
                </div>
              </div>
            )}
        </div>
        <div className="fv-row mb-7 col-7">
          <label className="d-block fw-bold fs-6 mb-2">
            {" "}
            {intl.formatMessage({ id: "Fields.DisableManualInput" })}
          </label>
          <div className="form-check form-switch mt-4">
            <input
              className="form-check-input"
              type="checkbox"
              id="disableManualInputSwitch"
              {...formik.getFieldProps("disableManualInput")}
              disabled={isSubmitting || isUserLoading}
            />
            <label
              className="form-check-label"
              htmlFor="disableManualInputSwitch"
            ></label>
          </div>
        </div>
      </div>
      {/* end::Input group */}
    </form>
  );
};

export { VatAddModalForm };
