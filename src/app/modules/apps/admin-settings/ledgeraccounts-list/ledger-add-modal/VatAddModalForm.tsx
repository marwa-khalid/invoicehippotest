import { FC, useEffect, useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import clsx from "clsx";
import { useIntl } from "react-intl";
import Select from "react-select";
import {
  getPrivateLedgerAccounts,
  getReportingq5b,
  postVatType,
} from "../core/_requests";
import {
  BalanceItem,
  LedgerForVatResult,
  PrivateLedgersModel,
} from "../core/_models";
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
  options: {
    value: number;
    label: string;
    IsAccountTypeOmzet: boolean;
    IsAccountTypeBtw: boolean;
    IsAccountTypeCost: boolean;
    IsAccountTypeResult: boolean;
    IsAccountTypePrive: boolean;
  }[];
}

type Props = {
  isUserLoading: boolean;
  user: any; // Adjust the type according to your user model
  formik: FormikProps<FormValues>;
  isSubmitting: boolean;
  vatTypes: { value: number; label: string }[];
  setSelectedBearingTypeOption: (option: any) => void;
  selectedBearingTypeOption: any;
};

interface SelectorOption {
  value: number;
  label: string;
}

const VatAddModalForm: FC<Props> = ({
  isUserLoading,
  user,
  formik,
  isSubmitting,
  vatTypes,
  setSelectedBearingTypeOption,
  selectedBearingTypeOption,
}) => {
  const intl = useIntl();
  const [bearingGroups, setBearingGroups] = useState<GroupedOption[]>([]);
  const [privateLedgers, setPrivateLedgers] = useState<SelectorOption[]>([]);
  const [reportingLedgers, setReportingLedgers] = useState<SelectorOption[]>(
    []
  );
  useEffect(() => {
    const getLedgerforPrivate = async () => {
      const response = await getPrivateLedgerAccounts();
      console.log(response.result);
      setPrivateLedgers(
        response.result.map((item: BalanceItem) => ({
          value: item.id,
          label: item.title,
        }))
      );
    };
    getLedgerforPrivate();
  }, []);

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
          IsAccountTypeOmzet: item.IsAccountTypeOmzet,
          IsAccountTypeBtw: item.IsAccountTypeBtw,
          IsAccountTypeCost: item.IsAccountTypeCost,
          IsAccountTypeResult: item.IsAccountTypeResult,
          IsAccountTypePrive: item.IsAccountTypePrive,
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

  useEffect(() => {
    const getLedgerForReporting = async () => {
      try {
        const response = await getReportingq5b();

        console.log(selectedBearingTypeOption);

        const options = response.result.map((item) => ({
          value: item.id,
          label: item.title,
        }));
        setReportingLedgers(options);
      } catch (error) {
        console.error("Error fetching ledger accounts:", error);
      }
    };

    getLedgerForReporting();
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
          options={bearingGroups}
          value={selectedBearingTypeOption || null}
          onChange={setSelectedBearingTypeOption}
          placeholder={
            selectedBearingTypeOption
              ? selectedBearingTypeOption.label
              : intl.formatMessage({
                  id: "Fields.SelectOptionDefaultLedgerAccountBearingType",
                })
          }
        />
        {console.log(selectedBearingTypeOption)!}
      </div>
      {/* end::Input group */}

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
            isDisabled={!selectedBearingTypeOption}
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
              className="form-check-input h-30px w-50px"
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
      {selectedBearingTypeOption?.IsAccountTypeBtw && (
        <div className="form-group mb-8">
          <label className="d-block fw-bold fs-6 mb-2">
            {intl.formatMessage({ id: "Fields.VatReportReferenceType" })}
          </label>
          <Select
            className="react-select-styled"
            options={enums.VatReportReferenceTypes.map((item: any) => ({
              value: item.Value,
              label: item.Title,
            }))}
            placeholder={intl.formatMessage({
              id: "Fields.SelectOptionDefaultVatReportCategory",
            })}
          />
        </div>
      )}
      {selectedBearingTypeOption?.IsAccountTypeBtw && (
        <div className="form-group">
          <label className="d-block fw-bold fs-6 mb-2">
            {intl.formatMessage({
              id: "Fields.VatReportReferenceTypeInputTaxGHeadingCategory",
            })}
          </label>
          <Select
            className="react-select-styled"
            options={reportingLedgers}
            placeholder={intl.formatMessage({
              id: "Fields.SelectOptionDefaultLedgerAccountType",
            })}
          />
        </div>
      )}
      {selectedBearingTypeOption?.IsAccountTypeCost && (
        <div className="form-group">
          <div className="row">
            <div className="col-md-12">
              <div
                className="row alert alert-custom alert-default bg-secondary  align-items-center"
                role="alert"
              >
                <div className="alert-icon col-1">
                  <i className="ki-duotone ki-information-4 fs-3x text-center me- text-primary">
                    <span className="path1"></span>
                    <span className="path2"></span>
                    <span className="path3"></span>
                  </i>
                </div>
                <div className="alert-text  col-11">
                  <h4 className="alert-heading">
                    {intl.formatMessage({ id: "Fields.TaxDeductibleSettings" })}
                  </h4>
                  <p>
                    {intl.formatMessage({
                      id: "Fields.TaxDeductibleSettingsInfo",
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="fv-row col-3 flex-grow-1">
              <label className="required fw-bold fs-6 mb-4">
                {" "}
                {intl.formatMessage({ id: "Fields.IsNotFullyTaxDeductible" })}
              </label>
              <div className="form-check form-switch">
                <input
                  className="form-check-input h-30px w-50px"
                  type="checkbox"
                  id="IsNotFullyTaxDeductibleSwitch"
                  {...formik.getFieldProps(
                    formik.values.taxDeductibleSettings.isNotFullyTaxDeductible
                  )}
                  onChange={(e) =>
                    formik.setFieldValue(
                      "taxDeductibleSettings.isNotFullyTaxDeductible",
                      e.target.checked
                    )
                  }
                  disabled={isSubmitting || isUserLoading}
                />
              </div>
            </div>

            <div className="fv-row col-3 flex-grow-1">
              <label className="required fw-bold fs-6 mb-2">
                {" "}
                {intl.formatMessage({ id: "Fields.TaxDeductiblePercentage" })}
              </label>
              <div className="input-group">
                <input
                  type="number"
                  className={clsx(
                    "form-control form-control-solid",
                    {
                      "is-invalid":
                        formik.touched.taxDeductibleSettings
                          ?.isNotFullyTaxDeductible &&
                        formik.errors.taxDeductibleSettings
                          ?.isNotFullyTaxDeductible,
                    },
                    {
                      "is-valid":
                        formik.touched.taxDeductibleSettings
                          ?.isNotFullyTaxDeductible &&
                        !formik.errors.taxDeductibleSettings
                          ?.isNotFullyTaxDeductible,
                    }
                  )}
                  id="taxDeductiblePercentage"
                  maxLength={2}
                  min={0}
                  max={99}
                  step={1}
                  disabled={
                    !formik.values.taxDeductibleSettings.isNotFullyTaxDeductible
                  }
                  value={
                    formik.values.taxDeductibleSettings.taxDeductiblePercentage
                  }
                />

                <span className="input-group-text ms-1">%</span>
              </div>
            </div>

            <div className="fv-row col-5 flex-grow-1">
              <label className="fw-bold fs-6 mb-2">
                {" "}
                {intl.formatMessage({
                  id: "Fields.DeductiblePrivateLedgerAccountId",
                })}
              </label>
              <Select
                className="react-select-styled"
                {...formik.getFieldProps("deductiblePrivateLedgerAccountId")}
                isDisabled={
                  !formik.values.taxDeductibleSettings.isNotFullyTaxDeductible
                }
                // value={
                //   formik.values.taxDeductibleSettings
                //     .deductiblePrivateLedgerAccountId
                // }
                options={privateLedgers}
                menuPlacement="top"
                placeholder={intl.formatMessage({
                  id: "Fields.SelectOptionDefaultLedgerAccount",
                })}
              />
              {console.log(privateLedgers)!}
            </div>
          </div>
        </div>
      )}
      {/* end::Input group */}
    </form>
  );
};

export { VatAddModalForm };
