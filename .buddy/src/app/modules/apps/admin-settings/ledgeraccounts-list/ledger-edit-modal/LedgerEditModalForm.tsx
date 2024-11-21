import { FC, useEffect, useState } from "react";
import clsx from "clsx";
import { useIntl } from "react-intl";
import Select from "react-select";
import { FormikProps } from "formik";
import enums from "../../../../../../invoicehippo.enums.json";
import {
  getPrivateLedgerAccounts,
  getReportingq5b,
  getVatTypesForLedger,
} from "../core/_requests";
import { BalanceItem } from "../core/_models";

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
  formik: FormikProps<FormValues>;
  isSubmitting: boolean;
  setSelectedBearingTypeOption: (option: any) => void;
  selectedBearingTypeOption: any;
  setReportReferenceType1: (type: any) => void;
  reportReferenceType1: any;
};

interface SelectorOption {
  value: number;
  label: string;
}

const LedgerEditModalForm: FC<Props> = ({
  formik,
  setSelectedBearingTypeOption,
  isSubmitting,
  setReportReferenceType1,
  reportReferenceType1,
}) => {
  const intl = useIntl();
  const [bearingGroups, setBearingGroups] = useState<GroupedOption[]>([]);
  const [privateLedgers, setPrivateLedgers] = useState<SelectorOption[]>([]);
  const [reportingLedgers, setReportingLedgers] = useState<SelectorOption[]>(
    []
  );
  const [vatTypes, setVatTypes] = useState<SelectorOption | any>();
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
    const fetchVatTypes = async () => {
      try {
        const response = await getVatTypesForLedger();
        let options = [];
        if (
          enums.BearingTypes.find((item) => {
            return item.Value === formik.values.bearingType;
          })?.IsAccountTypeOmzet
        ) {
          options = [
            {
              label: response.result.listForSalesGroupTitle,
              options: response.result.listForSales.map((item) => ({
                value: item.id,
                label: item.title,
              })),
            },
          ];
        } else if (
          enums.BearingTypes.find((item) => {
            return item.Value === formik.values.bearingType;
          })?.IsAccountTypeCost
        ) {
          options = [
            {
              label: response.result.listForCostsGroupTitle,
              options: response.result.listForCosts.map((item) => ({
                value: item.id,
                label: item.title,
              })),
            },
          ];
        } else {
          options = [
            {
              label: response.result.listForSalesGroupTitle,
              options: response.result.listForSales.map((item) => ({
                value: item.id,
                label: item.title,
              })),
            },
            {
              label: response.result.listForCostsGroupTitle,
              options: response.result.listForCosts.map((item) => ({
                value: item.id,
                label: item.title,
              })),
            },
          ];
        }

        setVatTypes(options);
      } catch (error) {
        console.error("Error fetching ledger accounts:", error);
      }
    };

    fetchVatTypes();
  }, [formik.values.bearingType]);

  useEffect(() => {
    const transformBearingTypes = () => {
      const groupMap: { [key: string]: GroupedOption } = {};

      enums.BearingTypes.forEach((item: any) => {
        const groupKey = `${item.Group} - ${item.SubGroup}`;

        if (!groupMap[groupKey]) {
          groupMap[groupKey] = {
            label: (
              <div>
                {item.Group} - <small>{item.SubGroup}</small>
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
    if (
      enums.BearingTypes.find((item) => {
        return item.Value === formik.values.bearingType;
      })?.IsAccountTypeBtw
    ) {
      formik.setFieldValue("taxDeductibleSettings", {
        isNotFullyTaxDeductible: false,
        taxDeductiblePercentage: 0,
        deductiblePrivateLedgerAccountId: 0,
      });
    }
  }, [formik.values.bearingType]);

  useEffect(() => {
    if (
      enums.BearingTypes.find((item) => {
        return item.Value === formik.values.bearingType;
      })?.IsAccountTypeCost
    ) {
      formik.setFieldValue("reportReferenceType1", 0);
      formik.setFieldValue("reportReferenceType2LegderAccountId", 0);
    }
  }, [formik.values.bearingType]);

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
    <form
      className="form p-3"
      style={{ zIndex: "9999" }}
      onSubmit={formik.handleSubmit}
      noValidate
    >
      {/* begin::Input group */}
      <div className="fv-row mb-7">
        <label className="required fw-bold fs-6 mb-2">
          {intl.formatMessage({ id: "Fields.BearingType" })}
        </label>

        <Select
          className="react-select-styled react-select-transparent border-bottom"
          options={bearingGroups}
          onChange={(selectedOption: any) => {
            formik.setFieldValue("bearingType", selectedOption?.value!);
          }}
          value={
            formik.values.bearingType === 0
              ? null
              : bearingGroups.map((item: any) =>
                  item.options.find(
                    (option: any) => option.value === formik.values.bearingType
                  )
                ) || null
          }
          placeholder={intl.formatMessage({
            id: "Fields.SelectOptionDefaultLedgerAccountBearingType",
          })}
          isClearable
        />
      </div>
      {/* end::Input group */}
      {/* begin::Input group */}
      <div className="row d-flex mb-7">
        {/* code Field */}
        <div className="fv-row flex-grow-1 col-5">
          <label className="required fw-bold fs-6 mb-2">
            {" "}
            {intl.formatMessage({ id: "Fields.Code" })}
          </label>
          <div className="input-group">
            <span className="input-group-text me-1">
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
              onKeyPress={(e) => {
                if (!/^\d$/.test(e.key)) {
                  e.preventDefault();
                }
              }}
              {...formik.getFieldProps("code")}
              className="form-control form-control-solid "
              disabled={isSubmitting}
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
      </div>
      {/* begin::Input group */}
      <div className="row">
        <div className="fv-row mb-7 col-5">
          <label className=" fw-bold fs-6 mb-2">
            {intl.formatMessage({ id: "Fields.DefaultTax" })}
          </label>

          <Select
            onChange={(selectedOption: any) => {
              formik.setFieldValue("defaultTaxTypeId", selectedOption?.value);
            }}
            value={
              formik.values.defaultTaxTypeId === 0
                ? null
                : vatTypes?.map((item: any) =>
                    item.options.find(
                      (option: any) =>
                        option.value === formik.values.defaultTaxTypeId
                    )
                  ) || null
            }
            menuPlacement="top"
            onBlur={() => formik.setFieldTouched("defaultTaxTypeId", true)}
            placeholder={intl.formatMessage({
              id: "Fields.SelectOptionNoVatType",
            })}
            isClearable
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
            isDisabled={!formik.values.bearingType}
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
              checked={formik.values.disableManualInput}
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

      {enums.BearingTypes.find((item) => {
        return item.Value === formik.values.bearingType;
      })?.IsAccountTypeBtw && (
        <>
          <div className="separator mb-6"></div>
          <div
            className="row alert alert-custom alert-default bg-secondary align-items-center mt-8 mx-0"
            role="alert"
          >
            <div className="alert-icon col-1 me-4">
              <i className="ki-duotone ki-information-4 fs-3x text-center text-primary">
                <span className="path1"></span>
                <span className="path2"></span>
                <span className="path3"></span>
              </i>
            </div>
            <div className="alert-text col-10">
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
              options={enums.VatReportReferenceTypes.map((item: any) => ({
                value: item.Value,
                label: item.Title,
              }))}
              value={
                formik.values.reportReferenceType1 === 0
                  ? null
                  : enums.VatReportReferenceTypes.filter(
                      (item) =>
                        item.Value === formik.values.reportReferenceType1
                    ).map((item) => ({
                      value: item.Value,
                      label: item.Title,
                    }))[0] || null
              }
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

      {enums.BearingTypes.find((item) => {
        return item.Value === formik.values.bearingType;
      })?.IsAccountTypeBtw &&
        pattern.test(
          enums.VatReportReferenceTypes.find((item) => {
            return item.Value === formik.values.reportReferenceType1;
          })!?.Title
        ) && (
          <div className="form-group">
            <label className="d-block fw-bold fs-6 mb-2">
              {intl.formatMessage({
                id: "Fields.VatReportReferenceTypeInputTaxGHeadingCategory",
              })}
            </label>
            <Select
              className="react-select-styled"
              options={reportingLedgers}
              value={
                formik.values.reportReferenceType2LegderAccountId === 0
                  ? null
                  : reportingLedgers.find((item) => {
                      return (
                        item.value ===
                        formik.values.reportReferenceType2LegderAccountId
                      );
                    }) || null
              }
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

      {enums.BearingTypes.find((item) => {
        return item.Value === formik.values.bearingType;
      })?.IsAccountTypeCost && (
        <>
          <div className="separator mb-6"></div>
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
                      {intl.formatMessage({
                        id: "Fields.TaxDeductibleSettings",
                      })}
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
                      formik.values.taxDeductibleSettings
                        .isNotFullyTaxDeductible
                    )}
                    checked={
                      formik.values.taxDeductibleSettings
                        .isNotFullyTaxDeductible
                    }
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
                    min={0}
                    max={100}
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
                    disabled={
                      !formik.values.taxDeductibleSettings
                        .isNotFullyTaxDeductible
                    }
                    value={
                      formik.values.taxDeductibleSettings
                        .taxDeductiblePercentage
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
                  onChange={(selectedOption) => {
                    formik.setFieldValue(
                      "taxDeductibleSettings.deductiblePrivateLedgerAccountId",
                      selectedOption?.value
                    );
                  }}
                  isDisabled={
                    !formik.values.taxDeductibleSettings.isNotFullyTaxDeductible
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
        </>
      )}
    </form>
  );
};

export default LedgerEditModalForm;
