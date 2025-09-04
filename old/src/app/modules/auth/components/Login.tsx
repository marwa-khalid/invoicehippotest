import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import clsx from "clsx";
import { Link } from "react-router-dom";
import { useIntl } from "react-intl";
import { login, updateLanguage } from "../core/_requests";
import { useAuth } from "../core/Auth";
import "react-toastify/dist/ReactToastify.css";
import { LanguagesAuth } from "../../../../_metronic/partials/layout/header-menus/LanguagesAuth";
import { toAbsoluteUrl } from "../../../../_metronic/helpers";
import { handleToast } from "../core/_toast";
import { getLang } from "../../../../_metronic/i18n/i18n";
import IntercomService from "../../generic/IntercomService";
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
  const lang = getLang();

  const formik = useFormik({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      try {
        const auth = await login(values.username, values.password, lang);

        handleToast(auth);
        if (auth.isValid) {
          saveAuth(auth);
        }
      } catch (error) {
        saveAuth(undefined);
        setSubmitting(false);
        setLoading(false);
      }
    },
  });

  return (
    <div className="d-flex flex-column flex-root bg-light" id="kt_app_root">
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
                onSubmit={(e) => {
                  formik.handleSubmit();
                  e.preventDefault();
                }}
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
                      {...formik.getFieldProps("username")}
                      className={clsx(
                        "form-control form-control-solid bg-secondary",
                        {
                          "is-invalid":
                            formik.touched.username && formik.errors.username,
                          "is-valid":
                            formik.touched.username && !formik.errors.username,
                        }
                      )}
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
                    {/* <div className="position-relative mb-3"> */}
                    <input
                      autoComplete="current-password"
                      type="password"
                      placeholder={intl.formatMessage({
                        id: "LoginAndRegistration.Password",
                      })}
                      {...formik.getFieldProps("password")}
                      // style={{ backgroundColor: "#f9f9f9" }}
                      className={clsx(
                        "form-control form-control-solid bg-secondary",
                        {
                          "is-invalid":
                            formik.touched.password && formik.errors.password,
                          "is-valid":
                            formik.touched.password && !formik.errors.password,
                        }
                      )}
                      name="password"
                    />
                    {/* <span
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
                    </div> */}
                    {/* <div className="text-muted" data-kt-translate="reset-hint">
                      <p
                        dangerouslySetInnerHTML={{
                          __html: intl.formatMessage({
                            id: "Fields.WeakPasswordMessage",
                          }),
                        }}
                      />
                    </div> */}
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

        {/* <div
          className="d-flex flex-column flex-lg-row-auto w-lg-50 bgi-no-repeat bgi-position-center bgi-size-cover"
          style={{
            backgroundImage: `url(${toAbsoluteUrl("media/auth/login-bg.jpg")})`,
          }}
        ></div> */}
        <div
          className="d-none d-lg-flex flex-lg-row-auto w-lg-50 "
          style={{
            backgroundImage: `url(${toAbsoluteUrl("media/auth/new-bg.png")})`,
            backgroundSize: "cover",
            backgroundPosition: "center right",
            backgroundRepeat: "no-repeat",
            height: "100%",
          }}
        ></div>
      </div>
    </div>
  );
};

export default Login;
