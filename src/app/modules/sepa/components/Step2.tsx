import React from "react";
import { useIntl } from "react-intl";
import clsx from "clsx";
import { useFormik } from "formik";
import * as Yup from "yup";
import { SepaResult } from "../../auth";
import { KTIcon } from "../../../../_metronic/helpers";

import { createAccountSchemas } from "./CreateAccountWizardHelper";

interface Step2Props {
  sepaResponse: SepaResult;
  prevStep: () => void;
  nextStep: () => void;
  setStoredValues: (value: any) => void;
}

const Step2: React.FC<Step2Props> = ({
  sepaResponse,
  nextStep,
  prevStep,
  setStoredValues,
}) => {
  const intl = useIntl();
  // const validationSchema = Yup.object().shape({
  //   ...(sepaResponse.isBusiness
  //     ? {
  //         companyName: Yup.string().required(
  //           "Company Name is required for businesses"
  //         ),
  //       }
  //     : {}),

  //   firstName: Yup.string().required("First Name is required"),
  //   betweenName: Yup.string().label("Between Name"),
  //   lastName: Yup.string().required("Last Name is required"),
  //   ibanNumber: Yup.string()
  //     .required("IBAN is required")
  //     .matches(
  //       /^([A-Z]{2}[0-9]{2})(?:[ ]?[0-9A-Z]{4}){3}(?:[ ]?[0-9A-Z]{1,2})?$/,
  //       "Invalid IBAN format"
  //     ),
  //   emailAddress: Yup.string()
  //     .email("Invalid email address format")
  //     .min(3, "Minimum 3 symbols")
  //     .max(50, "Maximum 50 symbols")
  //     .required("E-mail is required"),
  // });

  const validationSchema = Yup.object().shape({
    ...(sepaResponse.isBusiness
      ? {
          companyName: Yup.string().required(
            intl
              .formatMessage({ id: "Common.RequiredFieldHint2" })
              .replace("{0}", intl.formatMessage({ id: "Fields.CompanyName" }))
          ),
        }
      : {}),
    firstName: Yup.string().required(
      intl
        .formatMessage({ id: "Common.RequiredFieldHint2" })
        .replace("{0}", intl.formatMessage({ id: "Fields.FirstName" }))
    ),
    betweenName: Yup.string().label("BetweenName"),
    lastName: Yup.string().required(
      intl
        .formatMessage({ id: "Common.RequiredFieldHint2" })
        .replace("{0}", intl.formatMessage({ id: "Fields.LastName" }))
    ),
    ibanNumber: Yup.string()
      .required(
        intl
          .formatMessage({ id: "Common.RequiredFieldHint2" })
          .replace("{0}", intl.formatMessage({ id: "Fields.AccountNrIBAN" }))
      )
      .matches(
        /^([A-Z]{2}[0-9]{2})(?:[ ]?[0-9A-Z]{4}){3}(?:[ ]?[0-9A-Z]{1,2})?$/,
        intl
          .formatMessage({ id: "Common.InvalidFormat" })
          .replace("{0}", intl.formatMessage({ id: "Fields.AccountNrIBAN" }))
      ),
    emailAddress: Yup.string()
      .email(
        intl
          .formatMessage({ id: "Common.InvalidFormat" })
          .replace("{0}", intl.formatMessage({ id: "Fields.EmailAddress" }))
      )

      .required(
        intl
          .formatMessage({ id: "Common.RequiredFieldHint2" })
          .replace("{0}", intl.formatMessage({ id: "Fields.EmailAddress" }))
      ),
  });
  const initialValues = {
    companyName: sepaResponse.companyName || "", // Use sepaResponse value if available
    kvknr: "",
    btwnr: "",
    firstName: sepaResponse.firstName,
    betweenName: "",
    lastName: sepaResponse.lastName || "",
    ibanNumber: sepaResponse.ibanNumber || "",
    emailAddress: sepaResponse.emailAddress || "",
    isBusiness: sepaResponse.isBusiness,
  };
  // Initialize Formik
  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,

    onSubmit: (values) => {
      // localStorage.setItem("sepaValues", JSON.stringify(values));
      setStoredValues(values);
      nextStep();
      // handle form submission
    },
  });

  return (
    <form
      className="form w-100 fv-plugins-bootstrap5 fv-plugins-framework py-20"
      noValidate
      id="kt_login_sepa_form"
      onSubmit={formik.handleSubmit} // Handle form submission
    >
      {/* begin::Heading */}
      <div className="text-start mb-11">
        {/* begin::Title */}
        <h1 className="text-gray-900 mb-3 fs-2x">
          {intl.formatMessage({
            id: "LoginAndRegistration.SepaRegistrationStep2",
          })}
        </h1>
        {/* end::Title */}

        <div
          className="text-gray-500 fw-semibold fs-6"
          data-kt-translate="general-desc"
        >
          {intl.formatMessage({
            id: "LoginAndRegistration.SepaRegistrationStep2SubTitle",
          })}
        </div>
      </div>
      {/* end::Heading */}

      {/* Company name */}
      {sepaResponse.isBusiness && (
        <div className="fv-row mb-10">
          <label className="fw-bold mb-3">
            {intl.formatMessage({
              id: "Fields.CompanyName",
            })}
          </label>
          <span style={{ color: "red" }}>*</span>
          <input
            placeholder={intl.formatMessage({
              id: "Fields.CompanyName",
            })}
            {...formik.getFieldProps("companyName")}
            type="text"
            name="companyName"
            autoComplete="off"
            data-kt-translate="sign-up-input-company-name"
            className={clsx(
              "form-control form-control-lg form-control-solid bg-secondary",
              {
                "is-invalid":
                  formik.touched.companyName && formik.errors.companyName,
              },
              {
                "is-valid":
                  formik.touched.companyName && !formik.errors.companyName,
              }
            )}
          />
          {formik.touched.companyName && formik.errors.companyName && (
            <div className="fv-plugins-message-container">
              <div className="fv-help-block">
                <span
                  dangerouslySetInnerHTML={{
                    __html: formik.errors.companyName,
                  }}
                  role="alert"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {sepaResponse.isBusiness && (
        <div className="row mb-10 ">
          <div className="col-xl-6 mb-6 xl:mb-0">
            <label className="fw-bold mb-3">
              {intl.formatMessage({
                id: "Fields.KvkNr",
              })}
            </label>

            <input
              placeholder={intl.formatMessage({
                id: "Fields.KvkNr",
              })}
              {...formik.getFieldProps("kvknr")}
              type="text"
              autoComplete="off"
              className={clsx(
                "form-control form-control-lg form-control-solid bg-secondary"
                // {
                //   "is-invalid": formik.touched.kvknr && formik.errors.kvknr,
                // },
                // {
                //   "is-valid": formik.touched.kvknr && !formik.errors.kvknr,
                // }
              )}
              data-kt-translate="sign-up-input-kvknr"
            />
            {formik.touched.kvknr && formik.errors.kvknr && (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  <span
                    dangerouslySetInnerHTML={{
                      __html: formik.errors.kvknr,
                    }}
                  />
                </div>
              </div>
            )}
          </div>
          {/* BTW Number */}
          <div className="col-xl-6">
            <label className="fw-bold mb-3">
              {intl.formatMessage({
                id: "Fields.BtwNr",
              })}
            </label>
            <input
              placeholder={intl.formatMessage({
                id: "Fields.BtwNr",
              })}
              {...formik.getFieldProps("btwnr")}
              type="text"
              autoComplete="off"
              className={clsx(
                "form-control form-control-lg form-control-solid bg-secondary"
                // {
                //   "is-invalid": formik.touched.btwnr && formik.errors.btwnr,
                // },
                // {
                //   "is-valid": formik.touched.btwnr && !formik.errors.btwnr,
                // }
              )}
              data-kt-translate="sign-up-input-btwnr"
            />
            {formik.touched.btwnr && formik.errors.btwnr && (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  <span
                    dangerouslySetInnerHTML={{
                      __html: formik.errors.btwnr,
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="row mb-10">
        <div className="col-xl-4 mb-6 xl:mb-0">
          <label className="fw-bold mb-3">
            {intl.formatMessage({
              id: "Fields.FirstName",
            })}
          </label>
          <span style={{ color: "red" }}>*</span>
          <input
            placeholder={intl.formatMessage({
              id: "Fields.FirstName",
            })}
            {...formik.getFieldProps("firstName")}
            type="text"
            autoComplete="off"
            className={clsx(
              "form-control form-control-lg form-control-solid bg-secondary",
              {
                "is-invalid":
                  formik.touched.firstName && formik.errors.firstName,
              },
              {
                "is-valid":
                  formik.touched.firstName && !formik.errors.firstName,
              }
            )}
            data-kt-translate="sign-up-input-first-name"
          />
          {formik.touched.firstName && formik.errors.firstName && (
            <div className="fv-plugins-message-container">
              <div className="fv-help-block">
                <span
                  dangerouslySetInnerHTML={{
                    __html: formik.errors.firstName,
                  }}
                />
              </div>
            </div>
          )}
        </div>
        {/* Between Name */}
        <div className="col-xl-3 mb-6 xl:mb-0">
          <label className="fw-bold mb-3">
            {intl.formatMessage({
              id: "Fields.BetweenName",
            })}
          </label>
          <input
            placeholder={intl.formatMessage({
              id: "Fields.BetweenName",
            })}
            {...formik.getFieldProps("betweenName")}
            type="text"
            autoComplete="off"
            className={clsx(
              "form-control form-control-lg form-control-solid bg-secondary"
              // {
              //   "is-invalid":
              //     formik.touched.betweenName && formik.errors.betweenName,
              // },
              // {
              //   "is-valid":
              //     formik.touched.betweenName && !formik.errors.betweenName,
              // }
            )}
            data-kt-translate="sign-up-input-between-name"
          />
          {formik.touched.betweenName && formik.errors.betweenName && (
            <div className="fv-plugins-message-container">
              <div className="fv-help-block">
                <span
                  dangerouslySetInnerHTML={{
                    __html: formik.errors.betweenName,
                  }}
                />
              </div>
            </div>
          )}
        </div>
        {/* Last Name */}
        <div className="col-xl-5">
          <label className="fw-bold mb-3">
            {intl.formatMessage({
              id: "Fields.LastName",
            })}
            <span style={{ color: "red" }}>*</span>
          </label>
          <input
            placeholder={intl.formatMessage({
              id: "Fields.LastName",
            })}
            {...formik.getFieldProps("lastName")}
            type="text"
            autoComplete="off"
            className={clsx(
              "form-control form-control-lg form-control-solid bg-secondary",
              {
                "is-invalid": formik.touched.lastName && formik.errors.lastName,
              },
              {
                "is-valid": formik.touched.lastName && !formik.errors.lastName,
              }
            )}
            data-kt-translate="sign-up-input-last-name"
          />
          {formik.touched.lastName && formik.errors.lastName && (
            <div className="fv-plugins-message-container">
              <div className="fv-help-block">
                <span
                  dangerouslySetInnerHTML={{
                    __html: formik.errors.lastName,
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* IBAN */}
      <div className="fv-row mb-10">
        <label className="fw-bold mb-3">
          {intl.formatMessage({
            id: "Fields.AccountNrIBAN",
          })}
        </label>
        <span style={{ color: "red" }}>*</span>
        <input
          placeholder={intl.formatMessage({
            id: "Fields.AccountNrIBAN",
          })}
          {...formik.getFieldProps("ibanNumber")}
          type="iban"
          autoComplete="off"
          className={clsx(
            "form-control form-control-lg form-control-solid bg-secondary",
            {
              "is-invalid":
                formik.touched.ibanNumber && formik.errors.ibanNumber,
            },
            {
              "is-valid":
                formik.touched.ibanNumber && !formik.errors.ibanNumber,
            }
          )}
          data-kt-translate="sign-up-input-iban"
        />
        {formik.touched.ibanNumber && formik.errors.ibanNumber && (
          <div className="fv-plugins-message-container">
            <div className="fv-help-block">
              <span
                dangerouslySetInnerHTML={{
                  __html: formik.errors.ibanNumber,
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Email */}
      <div className="fv-row mb-10">
        <label className="fw-bold mb-3">
          {intl.formatMessage({
            id: "Fields.EmailAddress",
          })}
          <span style={{ color: "red" }}>*</span>
        </label>
        <input
          placeholder={intl.formatMessage({
            id: "Fields.EmailAddress",
          })}
          {...formik.getFieldProps("emailAddress")}
          type="email"
          autoComplete="off"
          className={clsx(
            "form-control form-control-lg form-control-solid bg-secondary",
            {
              "is-invalid":
                formik.touched.emailAddress && formik.errors.emailAddress,
            },
            {
              "is-valid":
                formik.touched.emailAddress && !formik.errors.emailAddress,
            }
          )}
          data-kt-translate="sign-up-input-email"
        />
        {formik.touched.emailAddress && formik.errors.emailAddress && (
          <div className="fv-plugins-message-container">
            <div className="fv-help-block">
              <span
                dangerouslySetInnerHTML={{
                  __html: formik.errors.emailAddress,
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* end::Login options */}

      {/* Submit Button */}
      <div className="d-flex flex-stack">
        <div className="mr-2">
          <button
            onClick={prevStep}
            type="button"
            className="btn btn-lg btn-light-primary me-3"
            data-kt-stepper-action="previous"
          >
            <KTIcon iconName="arrow-left" className="fs-4 me-1" />
            {intl.formatMessage({
              id: "Common.WizardStepPrevious",
            })}
          </button>
        </div>
        <div>
          <button type="submit" className="btn btn-lg btn-primary me-3">
            <span className="indicator-label align-items-center d-flex justify-center">
              {intl.formatMessage({
                id: "Common.WizardStepNext",
              })}
              <KTIcon iconName="arrow-right" className="fs-3 ms-2 me-0" />
            </span>
          </button>
        </div>
      </div>
    </form>
  );
};

export default Step2;
