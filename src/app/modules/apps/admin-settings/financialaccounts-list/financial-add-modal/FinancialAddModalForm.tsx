import { FC, useEffect, useState } from "react";
import clsx from "clsx";
import { useIntl } from "react-intl";
import Select from "react-select";
import { FormikProps } from "formik";
import enums from "../../../../../../invoicehippo.enums.json";
import { getLedgerForFinancial } from "../core/_requests";

interface FormValues {
  id: number;
  accountName: string;
  accountNumber: string;
  ledgerAccountId: number;
  bankConnectMinImportDate: any;
  accountType: number;
  autoCreateLedgerAccount: boolean;
  bankAccountCompanyType: number;
  afterSaveModel: {
    ledgerAccountDisplayName: string;
  };
  bankConnectInfo: {
    isConnected: boolean;
    isActive: boolean;
    accessExpirtationDate: any;
    lastSyncRequestDate: any;
  };
}

type Props = {
  formik: FormikProps<FormValues>;
  isSubmitting: boolean;
};

interface SelectorOption {
  value: number;
  label: string;
}

const FinancialAddModalForm: FC<Props> = ({ formik, isSubmitting }) => {
  const intl = useIntl();

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
            placeholder={intl.formatMessage({
              id: "Fields.SelectOptionDefaultFinancialAccountType",
            })}
            className={clsx(
              "react-select-styled",
              {
                "is-invalid":
                  formik.touched.accountType && formik.errors.accountType,
              },
              {
                "is-valid":
                  formik.touched.accountType && !formik.errors.accountType,
              }
            )}
            options={enums.AccountTypes.map((item: any) => ({
              value: item.Value,
              label: item.Title,
            }))}
            onChange={(selectedOption) =>
              formik.setFieldValue("accountType", selectedOption?.value)
            }
          />
          {formik.touched.accountType && formik.errors.accountType && (
            <div className="fv-plugins-message-container">
              <div className="fv-help-block">
                <span
                  dangerouslySetInnerHTML={{
                    __html: formik.errors.accountType,
                  }}
                  role="alert"
                />
              </div>
            </div>
          )}
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
            />
          </div>
        </div>
      )}

      {formik.values.accountType == 1 ||
      formik.values.accountType == 4 ||
      formik.values.accountType == 8 ||
      formik.values.accountType == 16 ? (
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
      ) : null}

      <div className="row">
        <label className="required fw-bold fs-6 mb-2">
          {intl.formatMessage({ id: "Fields.AutoCreateLedgerAccount" })}
        </label>

        <div className="form-check form-switch mt-4 ms-4">
          <input
            className="form-check-input h-30px w-50px"
            type="checkbox"
            id="automaticLedgerSwitch"
            checked={formik.values.autoCreateLedgerAccount}
            {...formik.getFieldProps("autoCreateLedgerAccount")}
          />
          <label
            className="form-check-label"
            htmlFor="automaticLedgerSwitch"
          ></label>
        </div>
      </div>
    </form>
  );
};

export default FinancialAddModalForm;
