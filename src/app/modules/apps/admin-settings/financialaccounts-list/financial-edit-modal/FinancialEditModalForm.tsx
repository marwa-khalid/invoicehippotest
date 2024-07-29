import { FC, useEffect, useState } from "react";
import clsx from "clsx";
import { useIntl } from "react-intl";
import Select from "react-select";
import { FormikProps } from "formik";
import enums from "../../../../../../invoicehippo.enums.json";
import {
  getPrivateLedgerAccounts,
  getLedgerForFinancial,
} from "../core/_requests";
import { BalanceItem } from "../core/_models";

interface FormValues {
  id: number;
  accountName: string;
  accountNumber: string;
  ledgerAccountId: number;
  bankConnectMinImportDate: string;
  accountType: number;
  autoCreateLedgerAccount: boolean;
  bankAccountCompanyType: number;
  afterSaveModel: {
    ledgerAccountDisplayName: string;
  };
  bankConnectInfo: {
    isConnected: boolean;
    isActive: boolean;
    accessExpirtationDate: string;
    lastSyncRequestDate: string;
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

const FinancialEditModalForm: FC<Props> = ({
  formik,
  setSelectedBearingTypeOption,
  isSubmitting,
  setReportReferenceType1,
  reportReferenceType1,
}) => {
  const intl = useIntl();
  const [bearingGroups, setBearingGroups] = useState<GroupedOption[]>([]);
  const [privateLedgers, setPrivateLedgers] = useState<SelectorOption[]>([]);
  const [ledgerAccounts, setLedgerAccounts] = useState<SelectorOption[]>([]);
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

  // useEffect(() => {
  //   const fetchVatTypes = async () => {
  //     try {
  //       const response = await getVatTypesForLedger();
  //       let options = [];
  //       if (
  //         enums.BearingTypes.find((item) => {
  //           return item.Value === formik.values.bearingType;
  //         })?.IsAccountTypeOmzet
  //       ) {
  //         options = [
  //           {
  //             label: response.result.listForSalesGroupTitle,
  //             options: response.result.listForSales.map((item) => ({
  //               value: item.id,
  //               label: item.title,
  //             })),
  //           },
  //         ];
  //       } else if (
  //         enums.BearingTypes.find((item) => {
  //           return item.Value === formik.values.bearingType;
  //         })?.IsAccountTypeCost
  //       ) {
  //         options = [
  //           {
  //             label: response.result.listForCostsGroupTitle,
  //             options: response.result.listForCosts.map((item) => ({
  //               value: item.id,
  //               label: item.title,
  //             })),
  //           },
  //         ];
  //       } else {
  //         options = [
  //           {
  //             label: response.result.listForSalesGroupTitle,
  //             options: response.result.listForSales.map((item) => ({
  //               value: item.id,
  //               label: item.title,
  //             })),
  //           },
  //           {
  //             label: response.result.listForCostsGroupTitle,
  //             options: response.result.listForCosts.map((item) => ({
  //               value: item.id,
  //               label: item.title,
  //             })),
  //           },
  //         ];
  //       }

  //       setVatTypes(options);
  //     } catch (error) {
  //       console.error("Error fetching ledger accounts:", error);
  //     }
  //   };

  //   fetchVatTypes();
  // }, [formik.values.bearingType]);

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
    const getLedgerAccounts = async () => {
      try {
        const response = await getLedgerForFinancial(formik.values.id);
        const options = response.result.map((item) => ({
          value: item.id,
          label: item.title,
        }));
        setLedgerAccounts(options);
      } catch (error) {
        console.error("Error fetching ledger accounts:", error);
      }
    };
    if (formik.values.id !== 0) {
      getLedgerAccounts();
    }
  }, [formik.values.id]);

  // useEffect(() => {
  //   if (
  //     enums.BearingTypes.find((item) => {
  //       return item.Value === formik.values.bearingType;
  //     })?.IsAccountTypeBtw
  //   ) {
  //     formik.setFieldValue("taxDeductibleSettings", {
  //       isNotFullyTaxDeductible: false,
  //       taxDeductiblePercentage: 0,
  //       deductiblePrivateLedgerAccountId: 0,
  //     });
  //   }
  // }, [formik.values.bearingType]);

  // useEffect(() => {
  //   if (
  //     enums.BearingTypes.find((item) => {
  //       return item.Value === formik.values.bearingType;
  //     })?.IsAccountTypeCost
  //   ) {
  //     formik.setFieldValue("reportReferenceType1", 0);
  //     formik.setFieldValue("reportReferenceType2LegderAccountId", 0);
  //   }
  // }, [formik.values.bearingType]);

  // useEffect(() => {
  //   if (!formik.values.taxDeductibleSettings.isNotFullyTaxDeductible) {
  //     formik.setFieldValue("taxDeductibleSettings", {
  //       isNotFullyTaxDeductible: false,
  //       taxDeductiblePercentage: 0,
  //       deductiblePrivateLedgerAccountId: 0,
  //     });
  //   }
  // }, [formik.values.taxDeductibleSettings.isNotFullyTaxDeductible]);

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
      <div className="row d-flex mb-7">
        {/* account type Field */}
        <div className="fv-row flex-grow-1 col-5">
          <label className="required fw-bold fs-6 mb-2">
            {" "}
            {intl.formatMessage({ id: "Fields.AccountType" })}
          </label>

          <Select
            {...formik.getFieldProps("accountType")}
            placeholder={
              enums.AccountTypes?.find(
                (item: any) => item.Value === formik.values.accountType
              )?.Title
            }
            className="react-select-styled"
            isDisabled
          />
        </div>

        {/* account name Field */}
        <div className="fv-row col-7 flex-grow-1">
          <label className="required fw-bold fs-6 mb-2">
            {" "}
            {intl.formatMessage({ id: "Fields.AccountName" })}
          </label>
          <input
            type="text"
            {...formik.getFieldProps("accountName")}
            className={clsx(
              "form-control form-control-solid",
              {
                "is-invalid":
                  formik.touched.accountName && formik.errors.accountName,
              },
              {
                "is-valid":
                  formik.touched.accountName && !formik.errors.accountName,
              }
            )}
            disabled={isSubmitting}
            placeholder={intl.formatMessage({ id: "Fields.AccountName" })}
          />

          {formik.touched.accountName && formik.errors.accountName && (
            <div className="fv-plugins-message-container">
              <div className="fv-help-block">
                <span
                  dangerouslySetInnerHTML={{
                    __html: formik.errors.accountName,
                  }}
                  role="alert"
                />
              </div>
            </div>
          )}
        </div>
      </div>
      {formik.values.accountType === 64 && (
        <div className="row ">
          <div className="fv-row mb-7">
            <label className="required fw-bold fs-6 mb-2">
              {intl.formatMessage({ id: "Fields.PayPalAccountNumber" })}
            </label>
            <input
              type="text"
              {...formik.getFieldProps("accountNumber")}
              className="form-control form-control-solid"
              readOnly
            />
          </div>
        </div>
      )}
      {formik.values.bankAccountCompanyType != 0 && (
        <>
          {/* begin::Input group */}
          <div className="row">
            <div className="fv-row mb-7 col-5">
              <label className="required fw-bold fs-6 mb-2">
                {intl.formatMessage({
                  id: "Fields.BankAccountCompanyType",
                })}
              </label>

              <Select
                className="react-select-styled react-select-transparent"
                value={
                  formik.values.bankAccountCompanyType === 0
                    ? null
                    : enums.BankAccountCompanyTypes.map((item: any) => ({
                        value: item.Value,
                        label: item.Title,
                      })).find(
                        (option) =>
                          option.value === formik.values.bankAccountCompanyType
                      ) || null
                }
                onBlur={() =>
                  formik.setFieldTouched("bankAccountCompanyType", true)
                }
                placeholder={intl.formatMessage({
                  id: "Fields.SelectOptionDefaultBankAccountCompanyType",
                })}
                isClearable
                options={enums.BankAccountCompanyTypes.map((item: any) => ({
                  value: item.Value,
                  label: item.Title,
                }))}
                onChange={(selectedOption: any) => {
                  formik.setFieldValue(
                    "bankAccountCompanyType",
                    selectedOption ? selectedOption.value : null
                  );
                }}
              />

              {formik.touched.bankAccountCompanyType &&
                formik.errors.bankAccountCompanyType && (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">
                      <span
                        dangerouslySetInnerHTML={{
                          __html: formik.errors.bankAccountCompanyType,
                        }}
                        role="alert"
                      />
                    </div>
                  </div>
                )}
            </div>
            <div className="fv-row mb-7 col-7">
              <label className="required d-block fw-bold fs-6 mb-2">
                {intl.formatMessage({ id: "Fields.AccountNumber" })}
              </label>
              <input
                className={clsx(
                  "form-control form-control-solid",
                  {
                    "is-invalid":
                      formik.touched.accountNumber &&
                      formik.errors.accountNumber,
                  },
                  {
                    "is-valid":
                      formik.touched.accountNumber &&
                      !formik.errors.accountNumber,
                  }
                )}
                type="text"
                {...formik.getFieldProps("accountNumber")}
                disabled={isSubmitting}
              />
            </div>
            {formik.touched.accountNumber && formik.errors.accountNumber && (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  <span
                    dangerouslySetInnerHTML={{
                      __html: formik.errors.accountNumber,
                    }}
                    role="alert"
                  />
                </div>
              </div>
            )}
          </div>
        </>
      )}

      <div className="row">
        <label className="required fw-bold fs-6 mb-2">
          {intl.formatMessage({ id: "Fields.LedgerAccount" })}
        </label>

        <Select
          className="react-select-styled react-select-transparent"
          value={
            formik.values.ledgerAccountId === 0
              ? null
              : ledgerAccounts.find(
                  (option) => option.value === formik.values.ledgerAccountId
                ) || null
          }
          onBlur={() => formik.setFieldTouched("ledgerAccountId", true)}
          placeholder={intl.formatMessage({
            id: "Fields.SelectOptionDefaultLedgerAccount",
          })}
          isClearable
          options={ledgerAccounts}
          onChange={(selectedOption: any) => {
            formik.setFieldValue(
              "ledgerAccountId",
              selectedOption ? selectedOption.value : null
            );
          }}
        />

        {formik.touched.ledgerAccountId && formik.errors.ledgerAccountId && (
          <div className="fv-plugins-message-container">
            <div className="fv-help-block">
              <span
                dangerouslySetInnerHTML={{
                  __html: formik.errors.ledgerAccountId,
                }}
                role="alert"
              />
            </div>
          </div>
        )}
      </div>
    </form>
  );
};

export default FinancialEditModalForm;
