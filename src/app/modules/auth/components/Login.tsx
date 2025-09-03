import { useState } from "react";
import * as Yup from "yup";
import clsx from "clsx";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import { login } from "../core/_requests";
import { toAbsoluteUrl } from "../../../../_metronic/helpers";
import { useAuth } from "../core/Auth";
import { getLang } from "../../../../_metronic/i18n/i18n";
import { handleToast } from "../core/_toast";
import { useIntl } from "react-intl";
import { LanguagesAuth } from "../../../../_metronic/partials/layout/header-menus/LanguagesAuth";

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
      } finally {
        setLoading(false);
      }
    },
  });
  return (
    <form
      className="form w-100"
      onSubmit={formik.handleSubmit}
      noValidate
      id="kt_login_signin_form"
    >
      {/* begin::Heading */}
      <div className="text-center mb-11">
        <h1 className="text-gray-900 fw-bolder mb-3">
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
      {/* begin::Heading */}

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
            {intl.formatMessage({
              id: "LoginAndRegistration.SignInWithGoogle",
            })}
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
            {intl.formatMessage({ id: "LoginAndRegistration.SignInWithApple" })}
          </a>
          {/* end::Google link */}
        </div>
        {/* end::Col */}
      </div>
      {/* end::Login options */}

      {/* begin::Separator */}
      <div className="separator separator-content my-14">
        <span className="w-125px text-gray-500 fw-semibold fs-7">
          {intl.formatMessage({ id: "LoginAndRegistration.SignInWithEmail" })}
        </span>
      </div>
      {/* end::Separator */}
      {/* 
      {formik.status ? (
        <div className="mb-lg-15 alert alert-danger">
          <div className="alert-text font-weight-bold">{formik.status}</div>
        </div>
      ) : (
        <div className="mb-10 bg-light-info p-8 rounded">
          <div className="text-info">
            Use account <strong>admin@demo.com</strong> and password{" "}
            <strong>demo</strong> to continue.
          </div>
        </div>
      )} */}

      {/* begin::Form group */}
      <div className="fv-row mb-8">
        <label className="form-label fs-6 fw-bolder text-gray-900">
          {intl.formatMessage({
            id: "LoginAndRegistration.UserName",
          })}
        </label>
        <input
          placeholder={intl.formatMessage({
            id: "LoginAndRegistration.UserName",
          })}
          {...formik.getFieldProps("username")}
          className={clsx(
            "form-control bg-transparent",
            { "is-invalid": formik.touched.username && formik.errors.username },
            {
              "is-valid": formik.touched.username && !formik.errors.username,
            }
          )}
          type="username"
          id="username"
          autoComplete="username"
        />
        {formik.touched.username && formik.errors.username && (
          <div className="fv-plugins-message-container">
            <div className="fv-help-block">
              <span
                role="alert"
                dangerouslySetInnerHTML={{
                  __html: formik.errors.username,
                }}
              />
            </div>
          </div>
        )}
      </div>
      {/* end::Form group */}

      {/* begin::Form group */}
      <div className="fv-row mb-3">
        <label className="form-label fw-bolder text-gray-900 fs-6 mb-0">
          {intl.formatMessage({
            id: "LoginAndRegistration.Password",
          })}
        </label>
        <input
          type="password"
          autoComplete="current-password"
          placeholder={intl.formatMessage({
            id: "LoginAndRegistration.Password",
          })}
          {...formik.getFieldProps("password")}
          className={clsx(
            "form-control bg-transparent",
            {
              "is-invalid": formik.touched.password && formik.errors.password,
            },
            {
              "is-valid": formik.touched.password && !formik.errors.password,
            }
          )}
          name="password"
        />
        {formik.touched.password && formik.errors.password && (
          <div className="fv-plugins-message-container">
            <div className="fv-help-block">
              <span
                role="alert"
                dangerouslySetInnerHTML={{
                  __html: formik.errors.password,
                }}
              />
            </div>
          </div>
        )}
      </div>
      {/* end::Form group */}

      {/* begin::Wrapper */}
      <div className="d-flex flex-stack flex-wrap gap-3 fs-base fw-semibold mb-8">
        <div />

        {/* begin::Link */}
        <Link to="/forgot-password" className="link-primary">
          {intl.formatMessage({
            id: "LoginAndRegistration.ForgotPassword",
          })}
        </Link>
        {/* end::Link */}
      </div>
      {/* end::Wrapper */}

      {/* begin::Action */}
      <div className="d-grid mb-10">
        <button
          type="submit"
          id="kt_sign_in_submit"
          className="btn btn-primary"
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
      </div>
      {/* end::Action */}

      <div className="text-gray-500 text-center fw-semibold fs-6">
        {intl.formatMessage({
          id: "LoginAndRegistration.SubTitleLogin",
        })}{" "}
        <Link to="/registration" className="link-primary">
          {intl.formatMessage({
            id: "LoginAndRegistration.SubTitleLinkLogin",
          })}
        </Link>
      </div>
      <div className="mt-10 d-flex justify-content-center">
        <LanguagesAuth />
      </div>
    </form>
  );
};

export default Login;
