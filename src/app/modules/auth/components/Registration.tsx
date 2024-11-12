import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import clsx from "clsx";
import { Link } from "react-router-dom";
import { PasswordMeterComponent } from "../../../../_metronic/assets/ts/components";
import { useAuth } from "../core/Auth";
import { useIntl } from "react-intl";
import { LanguagesAuth } from "../../../../_metronic/partials/layout/header-menus/LanguagesAuth";
import { toAbsoluteUrl } from "../../../../_metronic/helpers";
// Initial form values
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
  const { saveAuth } = useAuth();
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
    <div className="d-flex flex-column flex-root" id="kt_app_root">
      <div className="d-flex flex-column flex-lg-row flex-column-fluid">
        <a href="#" className="d-block d-lg-none mx-auto py-20">
          <img
            alt="Logo"
            src="media/logos/logo.png"
            className="theme-light-show h-200px"
          />
          <img
            alt="Logo"
            src="media/logos/logo.png"
            className="theme-dark-show h-200px"
          />
        </a>
        {/* Aside */}
        <div className="d-flex flex-column flex-column-fluid flex-center w-lg-50 p-10">
          {/* Wrapper */}
          <div className="d-flex justify-content-between flex-column-fluid flex-column w-100 mw-450px">
            {/* Header */}
            <div className="d-flex flex-lg-stack flex-sm-center py-2">
              {/* Back link */}
              <div className="me-2">
                <Link to="/" className="btn btn-icon bg-light rounded-circle">
                  <i className="ki-outline ki-black-left fs-2 text-gray-800"></i>
                </Link>
              </div>

              {/* Sign Up link */}
              <div className="m-0">
                <span className="text-gray-500 fw-bold fs-5 me-2">
                  {intl.formatMessage({
                    id: "LoginAndRegistration.SubTitleRegister",
                  })}
                </span>
                <Link to="/auth/login" className="link-primary fw-bold fs-5">
                  {intl.formatMessage({
                    id: "LoginAndRegistration.SubTitleLinkRegister",
                  })}
                </Link>
              </div>
            </div>
            <div className="py-20">
              {/* Form */}
              <form
                className="form w-100"
                noValidate
                id="kt_login_signup_form"
                onSubmit={formik.handleSubmit}
              >
                {/* Heading */}
                <div className="text-start mb-10">
                  <h1 className="text-gray-900 mb-3 fs-3x">
                    {intl.formatMessage({
                      id: "LoginAndRegistration.TitleRegister",
                    })}
                  </h1>
                  <div className="text-gray-500 fw-semibold fs-6">
                    {intl.formatMessage({
                      id: "LoginAndRegistration.RegistrationStep3SubTitle",
                    })}
                  </div>
                </div>

                {/* Input Fields */}
                <div className="row fv-row mb-7">
                  <div className="col-xl-6">
                    <input
                      placeholder={intl.formatMessage({
                        id: "LoginAndRegistration.FirstName",
                      })}
                      type="text"
                      autoComplete="off"
                      {...formik.getFieldProps("firstname")}
                      className={clsx(
                        "form-control form-control-lg form-control-solid",
                        {
                          "is-invalid":
                            formik.touched.firstname && formik.errors.firstname,
                          "is-valid":
                            formik.touched.firstname &&
                            !formik.errors.firstname,
                        }
                      )}
                      name="first-name"
                    />
                    {formik.touched.firstname && formik.errors.firstname && (
                      <div className="fv-plugins-message-container">
                        <div className="fv-help-block">
                          <span role="alert">{formik.errors.firstname}</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="col-xl-6">
                    <input
                      placeholder={intl.formatMessage({
                        id: "LoginAndRegistration.LastName",
                      })}
                      type="text"
                      autoComplete="off"
                      {...formik.getFieldProps("lastname")}
                      className={clsx(
                        "form-control form-control-lg form-control-solid",
                        {
                          "is-invalid":
                            formik.touched.lastname && formik.errors.lastname,
                          "is-valid":
                            formik.touched.lastname && !formik.errors.lastname,
                        }
                      )}
                      name="last-name"
                    />
                    {formik.touched.lastname && formik.errors.lastname && (
                      <div className="fv-plugins-message-container">
                        <div className="fv-help-block">
                          <span role="alert">{formik.errors.lastname}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="fv-row mb-10">
                  <input
                    placeholder={intl.formatMessage({
                      id: "LoginAndRegistration.EmailAddress",
                    })}
                    type="email"
                    autoComplete="off"
                    {...formik.getFieldProps("email")}
                    className={clsx(
                      "form-control form-control-lg form-control-solid",
                      {
                        "is-invalid":
                          formik.touched.email && formik.errors.email,
                        "is-valid":
                          formik.touched.email && !formik.errors.email,
                      }
                    )}
                    name="email"
                  />
                  {formik.touched.email && formik.errors.email && (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">
                        <span role="alert">{formik.errors.email}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="fv-row mb-10" data-kt-password-meter="true">
                  <div className="mb-1">
                    <div className="position-relative mb-3">
                      <input
                        placeholder={intl.formatMessage({
                          id: "LoginAndRegistration.Password",
                        })}
                        type="password"
                        autoComplete="off"
                        {...formik.getFieldProps("password")}
                        className={clsx(
                          "form-control form-control-lg form-control-solid",
                          {
                            "is-invalid":
                              formik.touched.password && formik.errors.password,
                            "is-valid":
                              formik.touched.password &&
                              !formik.errors.password,
                          }
                        )}
                        name="password"
                      />
                      <span
                        className="btn btn-sm btn-icon position-absolute translate-middle top-50 end-0 me-n2"
                        data-kt-password-meter-control="visibility"
                      >
                        <i className="ki-outline ki-eye-slash fs-2"></i>
                        <i className="ki-outline ki-eye fs-2 d-none"></i>
                      </span>
                    </div>
                    <div
                      className="d-flex align-items-center mb-3"
                      data-kt-password-meter-control="highlight"
                    >
                      <div className="flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2"></div>
                      <div className="flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2"></div>
                      <div className="flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2"></div>
                      <div className="flex-grow-1 bg-secondary bg-active-success rounded h-5px"></div>
                    </div>
                  </div>
                  <div className="text-muted">
                    {intl.formatMessage({
                      id: "Fields.WeakPasswordMessage",
                    })}
                  </div>
                  {formik.touched.password && formik.errors.password && (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">
                        <span role="alert">{formik.errors.password}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="fv-row mb-10">
                  <input
                    placeholder={intl.formatMessage({
                      id: "LoginAndRegistration.PasswordVerification",
                    })}
                    type="password"
                    autoComplete="off"
                    {...formik.getFieldProps("changepassword")}
                    className={clsx(
                      "form-control form-control-lg form-control-solid",
                      {
                        "is-invalid":
                          formik.touched.changepassword &&
                          formik.errors.changepassword,
                        "is-valid":
                          formik.touched.changepassword &&
                          !formik.errors.changepassword,
                      }
                    )}
                    name="confirm-password"
                  />
                  {formik.touched.changepassword &&
                    formik.errors.changepassword && (
                      <div className="fv-plugins-message-container">
                        <div className="fv-help-block">
                          <span role="alert">
                            {formik.errors.changepassword}
                          </span>
                        </div>
                      </div>
                    )}
                </div>

                <div className="d-flex flex-stack">
                  <button
                    type="submit"
                    className="btn btn-primary me-4"
                    disabled={formik.isSubmitting || !formik.isValid}
                  >
                    {!loading && (
                      <span className="indicator-label">
                        {intl.formatMessage({
                          id: "LoginAndRegistration.TitleRegister",
                        })}
                      </span>
                    )}
                    {loading && (
                      <span className="indicator-progress">
                        {intl.formatMessage({ id: "General.Loading" })}...
                        <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                      </span>
                    )}
                  </button>
                </div>
              </form>
            </div>

            <div className="m-0">
              <LanguagesAuth />
            </div>
          </div>
        </div>

        <div
          className="d-none d-lg-flex flex-lg-row-fluid w-50 bgi-size-cover bgi-position-y-center bgi-position-x-start bgi-no-repeat"
          style={{
            backgroundImage: `url(${toAbsoluteUrl("media/auth/bg11.png")})`,
          }}
        ></div>
      </div>
    </div>
  );
}
