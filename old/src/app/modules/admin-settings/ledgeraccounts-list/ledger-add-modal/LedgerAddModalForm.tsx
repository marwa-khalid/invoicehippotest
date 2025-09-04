import { FC, useEffect, useState } from "react";
import clsx from "clsx";
import { useIntl } from "react-intl";
import Select from "react-select";
import { getPrivateLedgerAccounts, getReportingq5b } from "../core/_requests";
import { BalanceItem } from "../core/_models";
import { FormikProps } from "formik";
import enums from "../../../../../_metronic/i18n/messages/invoicehippo.enums.json";
import { getEnumOptions } from "../../../../helpers/intlHelper";

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
export interface GroupedOption {
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
  formik: FormikProps<FormValues>;
  isSubmitting: boolean;
  vatTypes: { value: number; label: string }[];
  setSelectedBearingTypeOption: (option: any) => void;
  selectedBearingTypeOption: any;
  setReportReferenceType1: (type: any) => void;
  reportReferenceType1: any;
  fromInvoice?: boolean;
};

interface SelectorOption {
  value: number;
  label: string;
}

const LedgerAddModalForm = ({
  formik,
  isSubmitting,
  vatTypes,
  setSelectedBearingTypeOption,
  selectedBearingTypeOption,
  setReportReferenceType1,
  reportReferenceType1,
  fromInvoice,
}: Props) => {
  const intl = useIntl();
  const [bearingGroups, setBearingGroups] = useState<GroupedOption[]>([]);
  const [privateLedgers, setPrivateLedgers] = useState<SelectorOption[]>([]);
  const [reportingLedgers, setReportingLedgers] = useState<SelectorOption[]>(
    []
  );
  const pattern = /NL\/(2A|4A|4B)/;

  useEffect(() => {
    const getLedgerforPrivate = async () => {
      const response = await getPrivateLedgerAccounts();
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
        if (fromInvoice) {
          if (item.IsAccountTypeOmzet) {
            groupMap[groupKey].options.push({
              value: item.Value,
              label: item.LocalizationValueKey
                ? intl.formatMessage({
                    id: `Enums.${item.LocalizationValueKey}`,
                  })
                : item.Title,
              IsAccountTypeOmzet: item.IsAccountTypeOmzet,
              IsAccountTypeBtw: item.IsAccountTypeBtw,
              IsAccountTypeCost: item.IsAccountTypeCost,
              IsAccountTypeResult: item.IsAccountTypeResult,
              IsAccountTypePrive: item.IsAccountTypePrive,
            });
          }
        } else {
          groupMap[groupKey].options.push({
            value: item.Value,
            label: item.LocalizationValueKey
              ? intl.formatMessage({
                  id: `Enums.${item.LocalizationValueKey}`,
                })
              : item.Title,
            IsAccountTypeOmzet: item.IsAccountTypeOmzet,
            IsAccountTypeBtw: item.IsAccountTypeBtw,
            IsAccountTypeCost: item.IsAccountTypeCost,
            IsAccountTypeResult: item.IsAccountTypeResult,
            IsAccountTypePrive: item.IsAccountTypePrive,
          });
        }
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

  useEffect(() => {
    if (selectedBearingTypeOption?.IsAccountTypeBtw) {
      formik.setFieldValue("taxDeductibleSettings", {
        isNotFullyTaxDeductible: false,
        taxDeductiblePercentage: 0,
        deductiblePrivateLedgerAccountId: 0,
      });
    }
  }, [selectedBearingTypeOption]);

  useEffect(() => {
    if (selectedBearingTypeOption?.IsAccountTypeCost) {
      formik.setFieldValue("reportReferenceType1", 0);
      formik.setFieldValue("reportReferenceType2LegderAccountId", 0);
    }
  }, [selectedBearingTypeOption]);

  useEffect(() => {
    if (!formik.values.taxDeductibleSettings.isNotFullyTaxDeductible) {
      formik.setFieldValue("taxDeductibleSettings", {
        isNotFullyTaxDeductible: false,
        taxDeductiblePercentage: 0,
        deductiblePrivateLedgerAccountId: 0,
      });
    }
  }, [formik.values.taxDeductibleSettings.isNotFullyTaxDeductible]);

  const handlePercentageChange = (e: any) => {
    let value = e.target.value;
    // Remove any non-numeric characters
    value = value.replace(/[^0-9]/g, "");
    // Ensure the value is within the range
    if (
      /^\d*$/.test(value) &&
      (value === "" || (Number(value) >= 0 && Number(value) <= 100))
    ) {
      formik.setFieldValue(
        "taxDeductibleSettings.taxDeductiblePercentage",
        value
      );
    }
  };

  return (
    <form className="form p-3" onSubmit={formik.handleSubmit} noValidate>
      {/* begin::Input group */}
      <div className="fv-row mb-7">
        <label className="required fw-bold fs-6 mb-2">
          {intl.formatMessage({ id: "Fields.BearingType" })}
        </label>
        <Select
          className={clsx(
            "react-select-styled react-select-transparent border-bottom",
            {
              "is-invalid":
                formik.touched.bearingType && formik.errors.bearingType,
            },
            {
              "is-valid":
                formik.touched.bearingType && !formik.errors.bearingType,
            }
          )}
          options={bearingGroups}
          value={selectedBearingTypeOption || null}
          onChange={(selectedOption) => {
            formik.setFieldValue("bearingType", selectedOption?.value);
            setSelectedBearingTypeOption(selectedOption);
          }}
          onBlur={() => formik.setFieldTouched("bearingType", true)}
          placeholder={
            selectedBearingTypeOption
              ? selectedBearingTypeOption.label
              : intl.formatMessage({
                  id: "Fields.SelectOptionDefaultLedgerAccountBearingType",
                })
          }
          isClearable
        />
        {formik.touched.bearingType && formik.errors.bearingType && (
          <div className="fv-plugins-message-container">
            <div className="fv-help-block">
              <span
                dangerouslySetInnerHTML={{
                  __html: formik.errors.bearingType,
                }}
                role="alert"
              />
            </div>
          </div>
        )}
      </div>
      {/* end::Input group */}
      {/* begin::Input group */}
      <div className="row d-flex mb-7">
        {/* code Field */}
        <div className="fv-row  flex-grow-1 col-5">
          <label className="required fw-bold fs-6 mb-2">
            {" "}
            {intl.formatMessage({ id: "Fields.Code" })}
          </label>
          <div className="input-group">
            <span className="input-group-text  me-1" id="basic-addon1">
              <i className="ki-duotone ki-text-number text-dark fs-1">
                <span className="path1"></span>
                <span className="path2"></span>
                <span className="path3"></span>
                <span className="path4"></span>
                <span className="path5"></span>
                <span className="path6"></span>
              </i>
            </span>
            <input
              type="text"
              {...formik.getFieldProps("code")}
              onKeyPress={(e) => {
                if (!/^\d$/.test(e.key)) {
                  e.preventDefault();
                }
              }}
              className={clsx(
                "form-control form-control-solid"
                // { "is-invalid": formik.touched.code && formik.errors.code },
                // { "is-valid": formik.touched.code && !formik.errors.code }
              )}
              disabled={isSubmitting}
              placeholder={intl.formatMessage({ id: "Fields.Code" })}
              aria-label="Code"
              aria-describedby="basic-addon1"
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
            {intl.formatMessage({ id: "Fields.Title" })}
          </label>
          <input
            type="text"
            {...formik.getFieldProps("title")}
            className={clsx(
              "form-control form-control-solid"
              // { "is-invalid": formik.touched.title && formik.errors.title },
              // { "is-valid": formik.touched.title && !formik.errors.title }
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
      </div>
      {/* begin::Input group */}
      <div className="row">
        <div className="fv-row mb-7 col-5">
          <label className=" fw-bold fs-6 mb-2">
            {intl.formatMessage({ id: "Fields.DefaultTax" })}
          </label>
          <Select
            // {...formik.getFieldProps("defaultTaxTypeId")}
            onChange={(selectedOption) =>
              formik.setFieldValue("defaultTaxTypeId", selectedOption?.value)
            }
            onBlur={() => formik.setFieldTouched("defaultTaxTypeId", true)}
            placeholder={intl.formatMessage({
              id: "Fields.SelectOptionNoVatType",
            })}
            menuPlacement="top"
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
            isClearable
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
              disabled={isSubmitting}
            />
            <label
              className="form-check-label"
              htmlFor="disableManualInputSwitch"
            ></label>
          </div>
        </div>
      </div>
      {selectedBearingTypeOption?.IsAccountTypeBtw && (
        <>
          <div
            className="row alert alert-custom alert-default bg-secondary align-items-center mt-8 mx-0 "
            role="alert"
          >
            <div className="alert-icon col-1">
              <i className="ki-duotone ki-information-4 fs-3x text-center text-primary">
                <span className="path1"></span>
                <span className="path2"></span>
                <span className="path3"></span>
              </i>
            </div>
            <div className="alert-text  col-11">
              <h4 className="alert-heading">
                {intl.formatMessage({ id: "Fields.TaxReportingSettings" })}
              </h4>
              <p>
                {intl.formatMessage({
                  id: "Fields.TaxReportingSettingsInfo",
                })}
              </p>
            </div>
          </div>

          <div className="form-group mb-8">
            <label className="d-block fw-bold fs-6 mb-2">
              {intl.formatMessage({ id: "Fields.VatReportReferenceType" })}
            </label>
            <Select
              className="react-select-styled"
              options={getEnumOptions(enums.VatReportReferenceTypes, intl)}
              onChange={(selectedOption) => {
                formik.setFieldValue(
                  "reportReferenceType1",
                  selectedOption?.value
                );

                setReportReferenceType1(selectedOption);
              }}
              placeholder={intl.formatMessage({
                id: "Fields.SelectOptionDefaultVatReportCategory",
              })}
              isClearable
            />
          </div>
        </>
      )}

      {selectedBearingTypeOption?.IsAccountTypeBtw &&
        pattern.test(reportReferenceType1?.label) && (
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
              onChange={(selectedOption) => {
                formik.setFieldValue(
                  "reportReferenceType2LegderAccountId",
                  selectedOption?.value
                );
              }}
              isClearable
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
                  disabled={isSubmitting}
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
                    "form-control form-control-solid"
                    // {
                    //   "is-invalid":
                    //     formik.touched.taxDeductibleSettings
                    //       ?.isNotFullyTaxDeductible &&
                    //     formik.errors.taxDeductibleSettings
                    //       ?.isNotFullyTaxDeductible,
                    // },
                    // {
                    //   "is-valid":
                    //     formik.touched.taxDeductibleSettings
                    //       ?.isNotFullyTaxDeductible &&
                    //     !formik.errors.taxDeductibleSettings
                    //       ?.isNotFullyTaxDeductible,
                    // }
                  )}
                  id="taxDeductiblePercentage"
                  min={0}
                  max={99}
                  disabled={
                    !formik.values.taxDeductibleSettings.isNotFullyTaxDeductible
                  }
                  value={
                    formik.values.taxDeductibleSettings.taxDeductiblePercentage
                  }
                  onChange={handlePercentageChange}
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
                onChange={(selectedOption) => {
                  formik.setFieldValue(
                    "taxDeductibleSettings.deductiblePrivateLedgerAccountId",
                    selectedOption?.value
                  );
                }}
                isDisabled={
                  !formik.values.taxDeductibleSettings.isNotFullyTaxDeductible
                }
                value={
                  formik.values.taxDeductibleSettings
                    .deductiblePrivateLedgerAccountId === 0
                    ? null
                    : privateLedgers.find(
                        (item) =>
                          item.value ===
                          formik.values.taxDeductibleSettings
                            .deductiblePrivateLedgerAccountId
                      ) || null
                }
                options={privateLedgers}
                menuPlacement="top"
                placeholder={intl.formatMessage({
                  id: "Fields.SelectOptionDefaultLedgerAccount",
                })}
                isClearable
              />
            </div>
          </div>
        </div>
      )}
      {/* end::Input group */}
    </form>
  );
};

export { LedgerAddModalForm };
