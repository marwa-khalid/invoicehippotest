import React from "react";
import { useIntl } from "react-intl";
import clsx from "clsx";
import { Link } from "react-router-dom";
import { KTIcon } from "../../../../_metronic/helpers";
import { SepaResult } from "../../auth";

interface Step1Props {
  sepaResponse: SepaResult; // Adjust the type according to your actual data structure
}
const Step2 = (sepaResponse: Step1Props) => {
  const intl = useIntl();

  return (
    <form
      className="form w-100 fv-plugins-bootstrap5 fv-plugins-framework py-20"
      noValidate
      id="kt_login_signup_form"
    >
      {/* begin::Heading */}
      <div className="text-start mb-11">
        {/* begin::Title */}
        <h1 className="text-gray-900 mb-3 fs-2x">
          {intl.formatMessage({
            id: "LOGINANDREGISTRATION.SEPAREGISTRATIONSTEP2",
          })}
        </h1>
        {/* end::Title */}

        <div
          className="text-gray-500 fw-semibold fs-6"
          data-kt-translate="general-desc"
        >
          {intl.formatMessage({
            id: "LOGINANDREGISTRATION.SEPAREGISTRATIONSTEP2SUBTITLE",
          })}
        </div>
      </div>
      {/* end::Heading */}

      {/* Company name */}
      {sepaResponse.sepaResponse.isBusiness && (
        <div className="fv-row mb-10">
          <label className="fw-bold mb-3">
            {intl.formatMessage({
              id: "FIELDS.COMPANYNAME",
            })}
          </label>
          <input
            placeholder={intl.formatMessage({
              id: "FIELDS.COMPANYNAME",
            })}
            value={sepaResponse.sepaResponse.companyName}
            type="companyName"
            autoComplete="off"
            data-kt-translate="sign-up-input-company-name"
            // {...formik.getFieldProps("email")}
            className={clsx(
              "form-control form-control-lg form-control-solid bg-secondary"
              // { "is-invalid": formik.touched.email && formik.errors.email },
              // {
              //   "is-valid": formik.touched.email && !formik.errors.email,
              // }
            )}
          />
          {/* {formik.touched.email && formik.errors.email && (
          <div className="fv-plugins-message-container">
            <div className="fv-help-block">
              <span role="alert">{formik.errors.email}</span>
            </div>
          </div>
        )} */}
        </div>
      )}

      {sepaResponse.sepaResponse.isBusiness && (
        <div className="row mb-10">
          <div className="col-xl-6">
            <label className="fw-bold mb-3">
              {intl.formatMessage({
                id: "FIELDS.KVKNR",
              })}
            </label>
            <span style={{ color: "red" }}>*</span>
            <input
              placeholder={intl.formatMessage({
                id: "FIELDS.KVKNR",
              })}
              type="text"
              autoComplete="off"
              // value={sepaResponse.sepaResponse.firstName}
              className={clsx(
                "form-control form-control-lg form-control-solid bg-secondary"
                // {
                //   "is-invalid":
                //     formik.touched.firstname && formik.errors.firstname,
                // },
                // {
                //   "is-valid":
                //     formik.touched.firstname && !formik.errors.firstname,
                // }
              )}
              name="first-name"
              data-kt-translate="sign-up-input-first-name"
            />
            {/* {formik.touched.firstname && formik.errors.firstname && (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  <span role="alert">{formik.errors.firstname}</span>
                </div>
              </div>
            )} */}
          </div>
          {/*Between Name*/}
          <div className="col-xl-6">
            <label className="fw-bold mb-3">
              {intl.formatMessage({
                id: "FIELDS.BTWNR",
              })}
            </label>
            <input
              placeholder={intl.formatMessage({
                id: "FIELDS.BTWNR",
              })}
              type="text"
              autoComplete="off"
              // {...formik.getFieldProps("lastname")}
              className={clsx(
                "form-control form-control-lg form-control-solid bg-secondary"
                // {
                //   "is-invalid": formik.touched.lastname && formik.errors.lastname,
                // },
                // {
                //   "is-valid": formik.touched.lastname && !formik.errors.lastname,
                // }
              )}
              name="between-name"
              data-kt-translate="sign-up-input-last-name"
            />
            {/* {formik.touched.lastname && formik.errors.lastname && (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  <span role="alert">{formik.errors.lastname}</span>
                </div>
              </div>
            )} */}
          </div>
        </div>
      )}
      <div className="row mb-10">
        <div className="col-xl-4">
          <label className="fw-bold mb-3">
            {intl.formatMessage({
              id: "FIELDS.FIRSTNAME",
            })}
          </label>
          <span style={{ color: "red" }}>*</span>
          <input
            placeholder={intl.formatMessage({
              id: "FIELDS.FIRSTNAME",
            })}
            type="text"
            autoComplete="off"
            // value={sepaResponse.sepaResponse.firstName}
            className={clsx(
              "form-control form-control-lg form-control-solid bg-secondary"
              // {
              //   "is-invalid":
              //     formik.touched.firstname && formik.errors.firstname,
              // },
              // {
              //   "is-valid":
              //     formik.touched.firstname && !formik.errors.firstname,
              // }
            )}
            name="first-name"
            data-kt-translate="sign-up-input-first-name"
          />
          {/* {formik.touched.firstname && formik.errors.firstname && (
            <div className="fv-plugins-message-container">
              <div className="fv-help-block">
                <span role="alert">{formik.errors.firstname}</span>
              </div>
            </div>
          )} */}
        </div>
        {/*Between Name*/}
        <div className="col-xl-4">
          <label className="fw-bold mb-3">
            {intl.formatMessage({
              id: "FIELDS.BETWEENNAME",
            })}
          </label>
          <input
            placeholder={intl.formatMessage({
              id: "FIELDS.BETWEENNAME",
            })}
            type="text"
            autoComplete="off"
            // {...formik.getFieldProps("lastname")}
            className={clsx(
              "form-control form-control-lg form-control-solid bg-secondary"
              // {
              //   "is-invalid": formik.touched.lastname && formik.errors.lastname,
              // },
              // {
              //   "is-valid": formik.touched.lastname && !formik.errors.lastname,
              // }
            )}
            name="between-name"
            data-kt-translate="sign-up-input-last-name"
          />
          {/* {formik.touched.lastname && formik.errors.lastname && (
            <div className="fv-plugins-message-container">
              <div className="fv-help-block">
                <span role="alert">{formik.errors.lastname}</span>
              </div>
            </div>
          )} */}
        </div>
        {/* Last Name */}
        <div className="col-xl-4">
          <label className="fw-bold mb-3">
            {intl.formatMessage({
              id: "FIELDS.LASTNAME",
            })}
            <span style={{ color: "red" }}>*</span>
          </label>
          <input
            placeholder={intl.formatMessage({
              id: "FIELDS.LASTNAME",
            })}
            type="text"
            autoComplete="off"
            // {...formik.getFieldProps("lastname")}
            className={clsx(
              "form-control form-control-lg form-control-solid bg-secondary"
              // {
              //   "is-invalid": formik.touched.lastname && formik.errors.lastname,
              // },
              // {
              //   "is-valid": formik.touched.lastname && !formik.errors.lastname,
              // }
            )}
            name="last-name"
            data-kt-translate="sign-up-input-last-name"
          />
          {/* {formik.touched.lastname && formik.errors.lastname && (
            <div className="fv-plugins-message-container">
              <div className="fv-help-block">
                <span role="alert">{formik.errors.lastname}</span>
              </div>
            </div>
          )} */}
        </div>
      </div>
      {/* IBAN */}
      <div className="fv-row mb-10">
        <label className="fw-bold mb-3">
          {intl.formatMessage({
            id: "FIELDS.ACCOUNTNRIBAN",
          })}
        </label>
        <input
          placeholder={intl.formatMessage({
            id: "FIELDS.ACCOUNTNRIBAN",
          })}
          type="iban"
          autoComplete="off"
          value={sepaResponse.sepaResponse.ibanNumber}
          data-kt-translate="sign-up-input-iban"
          // {...formik.getFieldProps("email")}
          className={clsx(
            "form-control form-control-lg form-control-solid bg-secondary"
            // { "is-invalid": formik.touched.email && formik.errors.email },
            // {
            //   "is-valid": formik.touched.email && !formik.errors.email,
            // }
          )}
        />
        {/* {formik.touched.email && formik.errors.email && (
          <div className="fv-plugins-message-container">
            <div className="fv-help-block">
              <span role="alert">{formik.errors.email}</span>
            </div>
          </div>
        )} */}
      </div>

      {/* Email */}
      <div className="fv-row mb-10">
        <label className="fw-bold mb-3">
          {intl.formatMessage({
            id: "FIELDS.EMAILADDRESS",
          })}
          <span style={{ color: "red" }}>*</span>
        </label>
        <input
          placeholder={intl.formatMessage({
            id: "FIELDS.EMAILADDRESS",
          })}
          type="email"
          value={sepaResponse.sepaResponse.emailAddress}
          autoComplete="off"
          data-kt-translate="sign-up-input-email"
          // {...formik.getFieldProps("email")}
          className={clsx(
            "form-control form-control-lg form-control-solid bg-secondary"
            // { "is-invalid": formik.touched.email && formik.errors.email },
            // {
            //   "is-valid": formik.touched.email && !formik.errors.email,
            // }
          )}
        />
        {/* {formik.touched.email && formik.errors.email && (
          <div className="fv-plugins-message-container">
            <div className="fv-help-block">
              <span role="alert">{formik.errors.email}</span>
            </div>
          </div>
        )} */}
      </div>

      {/* end::Login options */}
    </form>
  );
};

export default Step2;
