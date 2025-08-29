import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import clsx from "clsx";
// import { getUserByToken, register } from "../core/_requests";
import { Link } from "react-router-dom";
import { toAbsoluteUrl } from "../../../../_metronic/helpers";
import { PasswordMeterComponent } from "../../../../_metronic/assets/ts/components";
import { useAuth } from "../core/Auth";
import { LanguagesAuth } from "../../../../_metronic/partials/layout/header-menus/LanguagesAuth";
import { useIntl } from "react-intl";
const initialValues = {
  firstname: "",
  lastname: "",
  email: "",
  password: "",
  changepassword: "",
  acceptTerms: false,
};

// Validation schema
const registrationSchema = Yup.object().shape({
  firstname: Yup.string()
    .min(3, "Minimum 3 symbols")
    .max(50, "Maximum 50 symbols")
    .required("First name is required"),
  lastname: Yup.string()
    .min(3, "Minimum 3 symbols")
    .max(50, "Maximum 50 symbols")
    .required("Last name is required"),
  email: Yup.string()
    .email("Wrong email format")
    .min(3, "Minimum 3 symbols")
    .max(50, "Maximum 50 symbols")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Minimum 8 symbols")
    .max(50, "Maximum 50 symbols")
    .required("Password is required"),
  changepassword: Yup.string()
    .min(8, "Minimum 8 symbols")
    .max(50, "Maximum 50 symbols")
    .required("Password confirmation is required")
    .oneOf([Yup.ref("password")], "Passwords do not match"),
  acceptTerms: Yup.bool().required("You must accept the terms and conditions"),
});

export function Registration() {
  const [loading, setLoading] = useState(false);
  const intl = useIntl();

  const formik = useFormik({
    initialValues,
    validationSchema: registrationSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      // Handle form submission
      // Uncomment and complete with your register function
      // try {
      //   const { data: auth } = await register(values.email, values.firstname, values.lastname, values.password, values.changepassword);
      //   saveAuth(auth);
      // } catch (error) {
      //   console.error(error);
      //   saveAuth(undefined);
      //   setStatus("The registration details are incorrect");
      //   setSubmitting(false);
      //   setLoading(false);
      // }
    },
  });

  useEffect(() => {
    PasswordMeterComponent.bootstrap();
  }, []);

  return (
    <form
      className="form w-100 fv-plugins-bootstrap5 fv-plugins-framework"
      noValidate
      id="kt_login_signup_form"
      onSubmit={formik.handleSubmit}
    >
      {/* begin::Heading */}
      <div className="text-center mb-11">
        {/* begin::Title */}
        <h1 className="text-gray-900 fw-bolder mb-3">
          {intl.formatMessage({
            id: "LoginAndRegistration.TitleRegister",
          })}
        </h1>
        {/* end::Title */}

        <div className="text-gray-500 fw-semibold fs-6">
          {intl.formatMessage({
            id: "LoginAndRegistration.RegistrationStep3SubTitle",
          })}
        </div>
      </div>
      {/* end::Heading */}

      {/* begin::Login options */}
      <div className="row g-3 mb-9">
        {/* begin::Col */}
        <div className="col-md-6">
          {/* begin::Google link */}
          <a
            href="#"
            className="btn btn-flex btn-outline btn-text-gray-700 btn-active-color-primary bg-state-light flex-center text-nowrap w-100"
          >
            <img
              alt="Logo"
              src={toAbsoluteUrl("media/svg/brand-logos/google-icon.svg")}
              className="h-15px me-3"
            />
            Sign in with Google
          </a>
          {/* end::Google link */}
        </div>
        {/* end::Col */}

        {/* begin::Col */}
        <div className="col-md-6">
          {/* begin::Google link */}
          <a
            href="#"
            className="btn btn-flex btn-outline btn-text-gray-700 btn-active-color-primary bg-state-light flex-center text-nowrap w-100"
          >
            <img
              alt="Logo"
              src={toAbsoluteUrl("media/svg/brand-logos/apple-black.svg")}
              className="theme-light-show h-15px me-3"
            />
            <img
              alt="Logo"
              src={toAbsoluteUrl("media/svg/brand-logos/apple-black-dark.svg")}
              className="theme-dark-show h-15px me-3"
            />
            Sign in with Apple
          </a>
          {/* end::Google link */}
        </div>
        {/* end::Col */}
      </div>
      {/* end::Login options */}

      <div className="separator separator-content my-14">
        <span className="w-125px text-gray-500 fw-semibold fs-7">
          Or with email
        </span>
      </div>

      {/* begin::Form group Firstname */}
      <div className="fv-row mb-8">
        <label className="form-label fw-bolder text-gray-900 fs-6">
          {intl.formatMessage({
            id: "LoginAndRegistration.FirstName",
          })}
        </label>
        <input
          placeholder={intl.formatMessage({
            id: "LoginAndRegistration.FirstName",
          })}
          type="text"
          autoComplete="off"
          {...formik.getFieldProps("firstname")}
          className={clsx(
            "form-control bg-transparent",
            {
              "is-invalid": formik.touched.firstname && formik.errors.firstname,
            },
            {
              "is-valid": formik.touched.firstname && !formik.errors.firstname,
            }
          )}
        />
        {formik.touched.firstname && formik.errors.firstname && (
          <div className="fv-plugins-message-container">
            <div className="fv-help-block">
              <span role="alert">{formik.errors.firstname}</span>
            </div>
          </div>
        )}
      </div>
      {/* end::Form group */}
      <div className="fv-row mb-8">
        {/* begin::Form group Lastname */}
        <label className="form-label fw-bolder text-gray-900 fs-6">
          {intl.formatMessage({
            id: "LoginAndRegistration.LastName",
          })}
        </label>
        <input
          placeholder={intl.formatMessage({
            id: "LoginAndRegistration.LastName",
          })}
          type="text"
          autoComplete="off"
          {...formik.getFieldProps("lastname")}
          className={clsx(
            "form-control bg-transparent",
            {
              "is-invalid": formik.touched.lastname && formik.errors.lastname,
            },
            {
              "is-valid": formik.touched.lastname && !formik.errors.lastname,
            }
          )}
        />
        {formik.touched.lastname && formik.errors.lastname && (
          <div className="fv-plugins-message-container">
            <div className="fv-help-block">
              <span role="alert">{formik.errors.lastname}</span>
            </div>
          </div>
        )}
        {/* end::Form group */}
      </div>

      {/* begin::Form group Email */}
      <div className="fv-row mb-8">
        <label className="form-label fw-bolder text-gray-900 fs-6">
          {intl.formatMessage({
            id: "LoginAndRegistration.EmailAddress",
          })}
        </label>
        <input
          placeholder={intl.formatMessage({
            id: "LoginAndRegistration.EmailAddress",
          })}
          type="email"
          autoComplete="off"
          {...formik.getFieldProps("email")}
          className={clsx(
            "form-control bg-transparent",
            { "is-invalid": formik.touched.email && formik.errors.email },
            {
              "is-valid": formik.touched.email && !formik.errors.email,
            }
          )}
        />
        {formik.touched.email && formik.errors.email && (
          <div className="fv-plugins-message-container">
            <div className="fv-help-block">
              <span role="alert">{formik.errors.email}</span>
            </div>
          </div>
        )}
      </div>
      {/* end::Form group */}

      {/* begin::Form group Password */}
      <div className="fv-row mb-8" data-kt-password-meter="true">
        <div className="mb-1">
          <label className="form-label fw-bolder text-gray-900 fs-6">
            {intl.formatMessage({
              id: "LoginAndRegistration.Password",
            })}
          </label>
          <div className="position-relative mb-3">
            <input
              type="password"
              placeholder={intl.formatMessage({
                id: "LoginAndRegistration.Password",
              })}
              autoComplete="off"
              {...formik.getFieldProps("password")}
              className={clsx(
                "form-control bg-transparent",
                {
                  "is-invalid":
                    formik.touched.password && formik.errors.password,
                },
                {
                  "is-valid":
                    formik.touched.password && !formik.errors.password,
                }
              )}
            />
            <span
              className="btn btn-sm btn-icon position-absolute translate-middle top-50 end-0 me-n2"
              data-kt-password-meter-control="visibility"
            >
              <i className="ki-outline ki-eye-slash fs-2"></i>
              <i className="ki-outline ki-eye fs-2 d-none"></i>
            </span>
          </div>
          {/* begin::Meter */}
          <div
            className="d-flex align-items-center mb-3"
            data-kt-password-meter-control="highlight"
          >
            <div className="flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2"></div>
            <div className="flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2"></div>
            <div className="flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2"></div>
            <div className="flex-grow-1 bg-secondary bg-active-success rounded h-5px"></div>
          </div>
          {/* end::Meter */}
        </div>
        <div className="text-muted">
          <p
            dangerouslySetInnerHTML={{
              __html: intl.formatMessage({
                id: "Fields.WeakPasswordMessage",
              }),
            }}
          />
        </div>
        {formik.touched.password && formik.errors.password && (
          <div className="fv-plugins-message-container">
            <div className="fv-help-block">
              <span role="alert">{formik.errors.password}</span>
            </div>
          </div>
        )}
      </div>
      {/* end::Form group */}

      {/* begin::Form group Confirm password */}
      <div className="fv-row mb-5">
        <label className="form-label fw-bolder text-gray-900 fs-6">
          {intl.formatMessage({
            id: "LoginAndRegistration.PasswordVerification",
          })}
        </label>
        <input
          type="password"
          placeholder={intl.formatMessage({
            id: "LoginAndRegistration.PasswordVerification",
          })}
          autoComplete="off"
          {...formik.getFieldProps("changepassword")}
          className={clsx(
            "form-control bg-transparent",
            {
              "is-invalid":
                formik.touched.changepassword && formik.errors.changepassword,
            },
            {
              "is-valid":
                formik.touched.changepassword && !formik.errors.changepassword,
            }
          )}
        />
        {formik.touched.changepassword && formik.errors.changepassword && (
          <div className="fv-plugins-message-container">
            <div className="fv-help-block">
              <span role="alert">{formik.errors.changepassword}</span>
            </div>
          </div>
        )}
      </div>
      {/* end::Form group */}

      {/* begin::Form group */}
      <div className="fv-row mb-8">
        <label
          className="form-check form-check-inline"
          htmlFor="kt_login_toc_agree"
        >
          <input
            className="form-check-input"
            type="checkbox"
            id="kt_login_toc_agree"
            {...formik.getFieldProps("acceptTerms")}
          />
          <span>
            I Accept the{" "}
            <a
              href="https://keenthemes.com/metronic/?page=faq"
              target="_blank"
              className="ms-1 link-primary"
            >
              Terms
            </a>
            .
          </span>
        </label>
        {formik.touched.acceptTerms && formik.errors.acceptTerms && (
          <div className="fv-plugins-message-container">
            <div className="fv-help-block">
              <span role="alert">{formik.errors.acceptTerms}</span>
            </div>
          </div>
        )}
      </div>
      {/* end::Form group */}

      {/* begin::Form group */}
      <div className="text-center">
        <button
          type="submit"
          id="kt_sign_up_submit"
          className="btn btn-lg btn-primary w-100 mb-5"
          disabled={
            formik.isSubmitting || !formik.isValid || !formik.values.acceptTerms
          }
        >
          {!loading && (
            <span className="indicator-label">
              {intl.formatMessage({
                id: "LoginAndRegistration.TitleRegister",
              })}
            </span>
          )}
          {loading && (
            <span className="indicator-progress" style={{ display: "block" }}>
              <span
                dangerouslySetInnerHTML={{
                  __html: intl.formatMessage({ id: "Common.Busy" }),
                }}
              />
              ...
              <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
            </span>
          )}
        </button>
        <Link to="/auth/login">
          <button
            type="button"
            id="kt_login_signup_form_cancel_button"
            className="btn btn-lg btn-light-primary w-100 mb-5"
          >
            {intl.formatMessage({ id: "Fields.ActionCancel" })}...
          </button>
        </Link>
      </div>

      {/* Sign Up link */}
      <div className="m-0">
        <div className="text-gray-500 text-center fw-semibold fs-6">
          {intl.formatMessage({
            id: "LoginAndRegistration.SubTitleRegister",
          })}{" "}
          <Link to="/login" className="link-primary fw-bold fs-5">
            {intl.formatMessage({
              id: "LoginAndRegistration.SubTitleLinkRegister",
            })}
          </Link>
        </div>
      </div>
      <div className="mt-3">
        <LanguagesAuth />
      </div>
      {/* end::Form group */}
    </form>
  );
}
