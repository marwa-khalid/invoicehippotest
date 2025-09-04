import { FormikProps } from "formik";
import { useIntl } from "react-intl";
import { getEnumOptions } from "../../../../../../helpers/intlHelper";
import Select from "react-select";
import enums from "../../../../../../../_metronic/i18n/messages/invoicehippo.enums.json";
import { SubscriberSingle } from "../../../core/_models";
import { KTIcon } from "../../../../../../../_metronic/helpers";
import Tippy from "@tippyjs/react";

interface props {
  formik: FormikProps<SubscriberSingle>;
}
const FinancialAccount = ({ formik }: props) => {
  const intl = useIntl();
  return (
    <div className="card mb-5 mb-xl-10">
      <div
        className="card-header border-0 cursor-pointer"
        role="button"
        data-bs-toggle="collapse"
        data-bs-target="#kt_account_signin_method"
      >
        <div className="card-title m-0">
          <h3 className="fw-bolder m-0">
            {intl.formatMessage({
              id: "Fields.FinancialAccountDetailHeader",
            })}
          </h3>
        </div>
      </div>

      <div id="kt_account_signin_method" className="collapse show">
        <div className="card-body border-top p-9">
          <div className="row mb-6">
            <div className="col-lg-6 fv-row">
              <label className="required fw-bold fs-6 mb-3">
                {intl.formatMessage({ id: "Fields.CompanyName" })}
              </label>
              <input
                type="text"
                className="form-control form-control-lg form-control-solid"
                placeholder={intl.formatMessage({ id: "Fields.CompanyName" })}
                {...formik.getFieldProps("financialAccount.billingCompanyName")}
                value={formik.values.financialAccount.billingCompanyName || ""}
              />
              {formik.touched.financialAccount?.billingCompanyName &&
                formik.errors.financialAccount?.billingCompanyName && (
                  <div className="fv-plugins-message-container">
                    <span
                      className="fv-help-block"
                      dangerouslySetInnerHTML={{
                        __html:
                          formik.errors.financialAccount?.billingCompanyName,
                      }}
                    />
                  </div>
                )}
            </div>
            <div className="col-lg-6 fv-row">
              <label className="required fw-bold fs-6 mb-3">
                {intl.formatMessage({ id: "Fields.BankAccountCompanyType" })}
              </label>
              <Select
                className="react-select-styled react-select-transparent"
                value={
                  formik.values.financialAccount
                    .billingBankAccountCompanyType === 0
                    ? null
                    : getEnumOptions(enums.BankAccountCompanyTypes, intl).find(
                        (option) =>
                          option.value ===
                          formik.values.financialAccount
                            .billingBankAccountCompanyType
                      ) || null
                }
                onBlur={() =>
                  formik.setFieldTouched(
                    "financialAccount.billingBankAccountCompanyType",
                    true
                  )
                }
                placeholder={intl.formatMessage({
                  id: "Fields.SelectOptionDefaultBankAccountCompanyType",
                })}
                isClearable
                options={getEnumOptions(enums.BankAccountCompanyTypes, intl)}
                onChange={(selectedOption: any) => {
                  formik.setFieldValue(
                    "financialAccount.billingBankAccountCompanyType",
                    selectedOption ? selectedOption.value : null
                  );
                }}
              />

              {formik.touched.financialAccount?.billingBankAccountCompanyType &&
                formik.errors.financialAccount
                  ?.billingBankAccountCompanyType && (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">
                      <span
                        dangerouslySetInnerHTML={{
                          __html:
                            formik.errors.financialAccount
                              ?.billingBankAccountCompanyType,
                        }}
                        role="alert"
                      />
                    </div>
                  </div>
                )}
            </div>
          </div>
          <div className="row mb-6">
            <div className="col-lg-6 fv-row">
              <label className="required fw-bold fs-6 mb-3">
                {intl.formatMessage({ id: "Fields.AccountHolderName" })}
              </label>
              <input
                type="text"
                className="form-control form-control-lg form-control-solid"
                placeholder={intl.formatMessage({
                  id: "Fields.AccountHolderName",
                })}
                {...formik.getFieldProps(
                  "financialAccount.billingAccountHolderName"
                )}
                value={
                  formik.values.financialAccount.billingAccountHolderName || ""
                }
              />
              {formik.touched.financialAccount?.billingAccountHolderName &&
                formik.errors.financialAccount?.billingAccountHolderName && (
                  <div className="fv-plugins-message-container">
                    <span
                      className="fv-help-block"
                      dangerouslySetInnerHTML={{
                        __html:
                          formik.errors.financialAccount
                            ?.billingAccountHolderName,
                      }}
                    />
                  </div>
                )}
            </div>
            <div className="col-lg-6 fv-row position-relative">
              <label className="fw-bold fs-6 mb-3">
                <span className="required">
                  {intl.formatMessage({ id: "Fields.BtwNr" })}
                </span>
              </label>

              <div className="position-relative">
                <input
                  type="text"
                  className="form-control form-control-lg form-control-solid pe-10" // add padding-end for icon space
                  placeholder={intl.formatMessage({
                    id: "Fields.BtwNr",
                  })}
                  {...formik.getFieldProps(
                    "financialAccount.billingCompanyVatNr"
                  )}
                  value={
                    formik.values.financialAccount.billingCompanyVatNr || ""
                  }
                />

                {formik.touched.financialAccount?.billingCompanyVatNr &&
                  formik.errors.financialAccount?.billingCompanyVatNr && (
                    <div className="fv-plugins-message-container">
                      <span
                        className="fv-help-block"
                        dangerouslySetInnerHTML={{
                          __html:
                            formik.errors.financialAccount?.billingCompanyVatNr,
                        }}
                      />
                    </div>
                  )}
              </div>
            </div>
          </div>
          <div className="row position-relative">
            <label className="fw-bold fs-6 mb-3">
              <span className="required">
                {intl.formatMessage({ id: "Fields.AccountNrIBAN" })}
              </span>
            </label>

            <div className="position-relative">
              <input
                type="text"
                className="form-control form-control-lg form-control-solid pe-10" // add padding-end for icon space
                placeholder={intl.formatMessage({
                  id: "Fields.AccountNrIBAN",
                })}
                {...formik.getFieldProps(
                  "financialAccount.billingAccountNrIBAN"
                )}
                value={
                  formik.values.financialAccount.billingAccountNrIBAN || ""
                }
              />

              {/* Check Icon */}
              <Tippy
                content={
                  formik.values.financialAccount.billingAccountNrIBANValidated
                    ? "validated"
                    : "not validated"
                }
              >
                <div
                  className="position-absolute top-50 end-0 translate-middle-y me-3 "
                  // avoid blocking clicks on input
                >
                  <KTIcon
                    iconName="double-check-circle"
                    className={`fs-1 cursor-pointer ${
                      formik.values.financialAccount
                        .billingAccountNrIBANValidated
                        ? "text-success"
                        : "text-danger"
                    }`}
                  />
                </div>
              </Tippy>
            </div>

            {formik.touched.financialAccount?.billingAccountNrIBAN &&
              formik.errors.financialAccount?.billingAccountNrIBAN && (
                <div className="fv-plugins-message-container">
                  <span
                    className="fv-help-block"
                    dangerouslySetInnerHTML={{
                      __html:
                        formik.errors.financialAccount?.billingAccountNrIBAN,
                    }}
                  />
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export { FinancialAccount };
