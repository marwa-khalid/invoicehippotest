import { FC, useEffect, useState } from "react";
import clsx from "clsx";
import { useIntl } from "react-intl";
import Select from "react-select";
import { FormikProps } from "formik";
import enums from "../../../../../../invoicehippo.enums.json";
import { getLedgerForFinancial } from "../core/_requests";
import { KTSVG } from "../../../../../../_metronic/helpers";

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

    getLedgerAccounts();
  }, []);

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
            isClearable
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

      <div className="accordion accordion-icon-toggle" id="kt_accordion_2">
        <div className="mb-5">
          <div
            className="accordion-header py-3 d-flex"
            data-bs-toggle="collapse"
            data-bs-target="#kt_accordion_2_item_1"
          >
            <span className="accordion-icon">
              <KTSVG
                className="svg-icon svg-icon-4"
                path="media/icons/duotune/arrows/arr064.svg"
              />
            </span>
            <h3 className="fs-6 text-gray-800 fw-bold mb-0 ms-4">
              Advanced Settings
            </h3>
          </div>
          <div
            id="kt_accordion_2_item_1"
            className="fs-6 collapse p-10 bg-secondary align-items-center alert"
            data-bs-parent="#kt_accordion_2"
          >
            <div className="form-check form-switch my-4 ms-2">
              <input
                className="form-check-input h-25px w-45px me-4"
                type="checkbox"
                id="automaticLedgerSwitch"
                checked={formik.values.autoCreateLedgerAccount}
                {...formik.getFieldProps("autoCreateLedgerAccount")}
              />
              <label className="required fw-bold fs-6 mb-2">
                {intl.formatMessage({ id: "Fields.AutoCreateLedgerAccount" })}
              </label>
            </div>

            {!formik.values.autoCreateLedgerAccount && (
              <div className="row">
                <label className="required fw-bold fs-6 mb-4">
                  {intl.formatMessage({ id: "Fields.LedgerAccount" })}
                </label>

                <Select
                  className="react-select-styled react-select-transparent"
                  value={
                    formik.values.ledgerAccountId === 0
                      ? null
                      : ledgerAccounts.find(
                          (option) =>
                            option.value === formik.values.ledgerAccountId
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

                {formik.touched.ledgerAccountId &&
                  formik.errors.ledgerAccountId && (
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
            )}
          </div>
        </div>
      </div>
    </form>
  );
};

export default FinancialAddModalForm;
