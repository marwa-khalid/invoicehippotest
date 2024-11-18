import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import clsx from "clsx";
import { Link } from "react-router-dom";
import { useIntl } from "react-intl";
import { login } from "../core/_requests";
import { useAuth } from "../core/Auth";
import "react-toastify/dist/ReactToastify.css";
import { LanguagesAuth } from "../../../../_metronic/partials/layout/header-menus/LanguagesAuth";
import { toAbsoluteUrl } from "../../../../_metronic/helpers";
const initialValues = {
  username: "",
  password: "",
};

const Login = () => {
  const [loading, setLoading] = useState(false);
  const { saveAuth } = useAuth();
  const intl = useIntl();

  // Define the validation schema using Yup
  const loginSchema = Yup.object().shape({
    username: Yup.string()
      .email(
        intl
          .formatMessage({ id: "Common.InvalidFormat" })
          .replace("{0}", intl.formatMessage({ id: "Fields.EmailAddress" }))
      )
      .min(
        3,
        intl
          .formatMessage({ id: "Common.ValidationMin" })
          .replace("{0}", intl.formatMessage({ id: "Fields.Password" }))
          .replace("{1}", `3`)
      )
      .max(
        50,
        intl
          .formatMessage({ id: "Common.ValidationMax" })
          .replace("{0}", intl.formatMessage({ id: "Fields.Password" }))
          .replace("{1}", `50`)
      )
      .required(
        intl
          .formatMessage({ id: "Common.RequiredFieldHint2" })
          .replace("{0}", intl.formatMessage({ id: "Fields.EmailAddress" }))
      ),
    password: Yup.string()
      .min(
        3,
        intl
          .formatMessage({ id: "Common.ValidationMin" })
          .replace("{0}", intl.formatMessage({ id: "Fields.Password" }))
          .replace("{1}", `3`)
      )
      .max(
        50,
        intl
          .formatMessage({ id: "Common.ValidationMax" })
          .replace("{0}", intl.formatMessage({ id: "Fields.Password" }))
          .replace("{1}", `50`)
      )
      .required(
        intl
          .formatMessage({ id: "Common.RequiredFieldHint2" })
          .replace("{0}", intl.formatMessage({ id: "Fields.Password" }))
      ),
  });

  // Initialize Formik
  const formik = useFormik({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      try {
        const auth = await login(values.username, values.password);
        console.log(auth);
        saveAuth(auth);
      } catch (error) {
        saveAuth(undefined);
        setStatus(intl.formatMessage({ id: "Common.LoginError" }));
        setSubmitting(false);
        setLoading(false);
      }
    },
  });

  return (
    <div className="d-flex flex-column flex-root" id="kt_app_root">
      <div className="d-flex flex-column flex-lg-row flex-column-fluid">
        {/* Logo for mobile view */}
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
              <div className="me-2"></div>
              <div className="m-0">
                <span className="text-gray-500 fw-bold fs-5 me-2">
                  {intl.formatMessage({
                    id: "LoginAndRegistration.SubTitleLogin",
                  })}
                </span>
                <Link to="/registration" className="link-primary fw-bold fs-5">
                  {intl.formatMessage({
                    id: "LoginAndRegistration.SubTitleLinkLogin",
                  })}
                </Link>
              </div>
            </div>
            {/* Body */}
            <div className="py-20">
              <form
                className="form w-100"
                noValidate
                id="kt_sign_in_form"
                onSubmit={formik.handleSubmit}
              >
                <div className="card-body">
                  <div className="text-start mb-10">
                    <h1 className="text-gray-900 mb-3 fs-3x">
                      {intl.formatMessage({
                        id: "LoginAndRegistration.TitleLogin",
                      })}
                    </h1>
                    <div className="text-gray-500 fw-semibold fs-6">
                      {intl.formatMessage({
                        id: "LoginAndRegistration.TitleLoginSlogan",
                      })}
                    </div>
                  </div>
                  {/* Email Input */}
                  <div className="fv-row mb-8">
                    <input
                      type="username"
                      id="username"
                      autoComplete="username"
                      data-np-autofill-field-type="username"
                      placeholder={intl.formatMessage({
                        id: "LoginAndRegistration.UserName",
                      })}
                      // style={{ backgroundColor: "#f9f9f9" }}
                      {...formik.getFieldProps("username")}
                      className={clsx("form-control form-control-solid", {
                        "is-invalid":
                          formik.touched.username && formik.errors.username,
                        "is-valid":
                          formik.touched.username && !formik.errors.username,
                      })}
                    />
                    {formik.touched.username && formik.errors.username && (
                      <div className="fv-plugins-message-container ms-2">
                        <div className="fv-help-block">
                          <span
                            dangerouslySetInnerHTML={{
                              __html: formik.errors.username,
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  {/* Password Input */}
                  <div className="fv-row mb-7">
                    <input
                      autoComplete="password"
                      type="password"
                      placeholder={intl.formatMessage({
                        id: "LoginAndRegistration.Password",
                      })}
                      {...formik.getFieldProps("password")}
                      // style={{ backgroundColor: "#f9f9f9" }}
                      className={clsx("form-control form-control-solid", {
                        "is-invalid":
                          formik.touched.password && formik.errors.password,
                        "is-valid":
                          formik.touched.password && !formik.errors.password,
                      })}
                    />
                    {formik.touched.password && formik.errors.password && (
                      <div className="fv-plugins-message-container ms-2">
                        <div className="fv-help-block">
                          <span
                            dangerouslySetInnerHTML={{
                              __html: formik.errors.password,
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  {/* Forgot Password Link */}
                  <div className="d-flex flex-stack flex-wrap gap-3 fs-base fw-semibold mb-10">
                    <div></div>
                    <Link to="/forgot-password" className="link-primary">
                      {intl.formatMessage({
                        id: "LoginAndRegistration.ForgotPassword",
                      })}
                    </Link>
                  </div>
                  {/* Actions */}
                  <div className="d-flex flex-stack">
                    <button
                      type="submit"
                      id="kt_sign_in_submit"
                      className="btn btn-primary me-2 flex-shrink-0 rounded-50"
                      disabled={formik.isSubmitting || !formik.isValid}
                    >
                      {!loading && (
                        <span className="indicator-label">
                          {intl.formatMessage({
                            id: "LoginAndRegistration.LoginButtonText",
                          })}
                        </span>
                      )}
                      {loading && (
                        <span
                          className="indicator-progress"
                          style={{ display: "block" }}
                        >
                          {intl.formatMessage({ id: "Common.Busy" })}...
                          <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                        </span>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
            {/* Footer */}
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
};

export default Login;
