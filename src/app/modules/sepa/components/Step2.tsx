import React from "react";
import { useIntl } from "react-intl";
import clsx from "clsx";
import { useFormik } from "formik";
import * as Yup from "yup";
import { SepaResult } from "../../auth";
import { KTIcon } from "../../../../_metronic/helpers";
interface Step2Props {
  sepaResponse: SepaResult;
  prevStep: () => void;
  nextStep: () => void;
  setRefreshKey: (key: boolean) => void;
}

const validationSchema = Yup.object().shape({
  companyName: Yup.string()
    .required("Company Name is required for businesses")
    .label("Company Name"),
  kvkNumber: Yup.string().label("KVK Number"),
  btwNumber: Yup.string().label("BTW Number"),
  firstName: Yup.string()
    .required("First Name is required")
    .label("First Name"),
  betweenName: Yup.string().label("Between Name"),
  lastName: Yup.string().required("Last Name is required").label("Last Name"),
  ibanNumber: Yup.string()
    .required("IBAN is required")
    .matches(
      /^([A-Z]{2}[0-9]{2})(?:[ ]?[0-9A-Z]{4}){3}(?:[ ]?[0-9A-Z]{1,2})?$/,
      "Invalid IBAN format"
    )
    .label("IBAN"),
  emailAddress: Yup.string()
    .email("Invalid email address format")
    .label("Email Address")
    .min(3, "Minimum 3 symbols")
    .max(50, "Maximum 50 symbols")
    .required("E-mail is vereist"),
});

const Step2: React.FC<Step2Props> = ({
  sepaResponse,
  nextStep,
  prevStep,
  setRefreshKey,
}) => {
  const intl = useIntl();
  const initialValues = {
    companyName: sepaResponse.companyName || "", // Use sepaResponse value if available
    kvknr: "",
    btwnr: "",
    firstName: "",
    betweenName: "",
    lastName: "",
    ibanNumber: sepaResponse.ibanNumber || "",
    emailAddress: sepaResponse.emailAddress || "",
  };
  // Initialize Formik
  const formik = useFormik({
    initialValues: {
      ...initialValues,
    },
    validationSchema,

    onSubmit: (values) => {
      localStorage.setItem("sepaValues", JSON.stringify(values));
      const test = localStorage.getItem("sepaValues");
      console.log(test);
      setRefreshKey(true);
      nextStep();
      // handle form submission
    },
  });
  console.log("Current form values:", formik.values);

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
      {sepaResponse.isBusiness && (
        <div className="fv-row mb-10">
          <label className="fw-bold mb-3">
            {intl.formatMessage({
              id: "FIELDS.COMPANYNAME",
            })}
          </label>
          <span style={{ color: "red" }}>*</span>
          <input
            placeholder={intl.formatMessage({
              id: "FIELDS.COMPANYNAME",
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
                <span role="alert">{formik.errors.companyName}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {sepaResponse.isBusiness && (
        <div className="row mb-10">
          <div className="col-xl-6">
            <label className="fw-bold mb-3">
              {intl.formatMessage({
                id: "FIELDS.KVKNR",
              })}
            </label>

            <input
              placeholder={intl.formatMessage({
                id: "FIELDS.KVKNR",
              })}
              {...formik.getFieldProps("kvknr")}
              type="text"
              autoComplete="off"
              className={clsx(
                "form-control form-control-lg form-control-solid bg-secondary",
                {
                  "is-invalid": formik.touched.kvknr && formik.errors.kvknr,
                },
                {
                  "is-valid": formik.touched.kvknr && !formik.errors.kvknr,
                }
              )}
              data-kt-translate="sign-up-input-kvknr"
            />
            {formik.touched.kvknr && formik.errors.kvknr && (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  <span role="alert">{formik.errors.kvknr}</span>
                </div>
              </div>
            )}
          </div>
          {/* BTW Number */}
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
              {...formik.getFieldProps("btwnr")}
              type="text"
              autoComplete="off"
              className={clsx(
                "form-control form-control-lg form-control-solid bg-secondary",
                {
                  "is-invalid": formik.touched.btwnr && formik.errors.btwnr,
                },
                {
                  "is-valid": formik.touched.btwnr && !formik.errors.btwnr,
                }
              )}
              data-kt-translate="sign-up-input-btwnr"
            />
            {formik.touched.btwnr && formik.errors.btwnr && (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  <span role="alert">{formik.errors.btwnr}</span>
                </div>
              </div>
            )}
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
                <span role="alert">{formik.errors.firstName}</span>
              </div>
            </div>
          )}
        </div>
        {/* Between Name */}
        <div className="col-xl-3">
          <label className="fw-bold mb-3">
            {intl.formatMessage({
              id: "FIELDS.BETWEENNAME",
            })}
          </label>
          <input
            placeholder={intl.formatMessage({
              id: "FIELDS.BETWEENNAME",
            })}
            {...formik.getFieldProps("betweenName")}
            type="text"
            autoComplete="off"
            className={clsx(
              "form-control form-control-lg form-control-solid bg-secondary",
              {
                "is-invalid":
                  formik.touched.betweenName && formik.errors.betweenName,
              },
              {
                "is-valid":
                  formik.touched.betweenName && !formik.errors.betweenName,
              }
            )}
            data-kt-translate="sign-up-input-between-name"
          />
          {formik.touched.betweenName && formik.errors.betweenName && (
            <div className="fv-plugins-message-container">
              <div className="fv-help-block">
                <span role="alert">{formik.errors.betweenName}</span>
              </div>
            </div>
          )}
        </div>
        {/* Last Name */}
        <div className="col-xl-5">
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
                <span role="alert">{formik.errors.lastName}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* IBAN */}
      <div className="fv-row mb-10">
        <label className="fw-bold mb-3">
          {intl.formatMessage({
            id: "FIELDS.ACCOUNTNRIBAN",
          })}
        </label>
        <span style={{ color: "red" }}>*</span>
        <input
          placeholder={intl.formatMessage({
            id: "FIELDS.ACCOUNTNRIBAN",
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
              <span role="alert">{formik.errors.ibanNumber}</span>
            </div>
          </div>
        )}
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
              <span role="alert">{formik.errors.emailAddress}</span>
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
              id: "COMMON.WIZARDSTEPPREVIOUS",
            })}
          </button>
        </div>
        <div>
          <button type="submit" className="btn btn-lg btn-primary me-3">
            <span className="indicator-label align-items-center d-flex justify-center">
              {intl.formatMessage({
                id: "COMMON.WIZARDSTEPNEXT",
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
