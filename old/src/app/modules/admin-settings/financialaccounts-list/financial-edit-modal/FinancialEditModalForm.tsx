import { FC, useEffect, useState } from "react";
import clsx from "clsx";
import { useIntl } from "react-intl";
import Select from "react-select";
import { FormikProps } from "formik";
import enums from "../../../../../_metronic/i18n/messages/invoicehippo.enums.json";
import { getLedgerForFinancial } from "../core/_requests";
import { getEnumOptions } from "../../../../helpers/intlHelper";

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

type Props = {
  formik: FormikProps<FormValues>;
  isSubmitting: boolean;
};

interface SelectorOption {
  value: number;
  label: string;
}

const FinancialEditModalForm: FC<Props> = ({ formik, isSubmitting }) => {
  const intl = useIntl();
  const [ledgerAccounts, setLedgerAccounts] = useState<SelectorOption[]>([]);

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
                    : getEnumOptions(enums.BankAccountCompanyTypes, intl).find(
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
                options={getEnumOptions(enums.BankAccountCompanyTypes, intl)}
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
            formik.setFieldValue(
              "afterSaveModel.ledgerAccountDisplayName",
              selectedOption?.label
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
