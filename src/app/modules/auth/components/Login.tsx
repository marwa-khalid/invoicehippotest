import { useState } from "react";
import * as Yup from "yup";
import clsx from "clsx";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import { login } from "../core/_requests";
import { useAuth } from "../core/Auth";
import { Languages } from "../../../../_metronic/partials/layout/header-menus/Languages";
import "react-toastify/dist/ReactToastify.css";
import { FC } from "react";
import { useIntl } from "react-intl";

const initialValues = {
  email: "",
  password: "",
};

const Login: FC = () => {
  const [loading, setLoading] = useState(false);
  const { saveAuth } = useAuth();
  const intl = useIntl();

  const loginSchema = Yup.object().shape({
    email: Yup.string()
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

  const formik = useFormik({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      try {
        const auth = await login(values.email, values.password);
        saveAuth(auth);
      } catch (error) {
        saveAuth(undefined);
        setStatus("The login details are incorrect");
        setSubmitting(false);
        setLoading(false);
      }
    },
  });

  return (
    <div className="d-flex vh-100 justify-content-between flex-column">
      {/* Header */}

      <a
        href="/metronic8/demo39/index.html"
        className="d-block d-lg-none mx-auto "
      >
        <img
          alt="Logo"
          src="/media/logos/invoicehippo_art01.svg"
          className="theme-light-show h-150px"
        />
        <img
          alt="Logo"
          src="/media/logos/invoicehippo_art01.svg"
          className="theme-dark-show h-200px"
        />
      </a>
      <div className="p-5 ">
        <div className="mb-5">
          <span className="text-gray-500 fw-bold fs-5 me-2">
            {intl.formatMessage({ id: "LoginAndRegistration.SubTitleLogin" })}
          </span>
          <Link to="/registration" className="link-primary fw-bold fs-5">
            {intl.formatMessage({
              id: "LoginAndRegistration.SubTitleLinkLogin",
            })}
          </Link>
        </div>
      </div>

      <div className="text-start mb-5 mt-auto">
        <h1 className="text-gray-900 mb-3 fs-3x">
          {intl.formatMessage({ id: "LoginAndRegistration.TitleLogin" })}
        </h1>
        <div className="text-gray-500 fw-semibold fs-6 mb-10">
          {intl.formatMessage({
            id: "LoginAndRegistration.TitleLoginSlogan",
          })}
        </div>
      </div>

      {/* Form */}
      <div className="">
        <form
          className="w-full max-w-md"
          onSubmit={formik.handleSubmit}
          noValidate
          id="kt_login_signin_form"
        >
          {/* Email and Password inputs */}
          <div className="rounded mb-5">
            <div className="fv-row mb-3">
              <input
                placeholder={intl.formatMessage({
                  id: "LoginAndRegistration.UserName",
                })}
                {...formik.getFieldProps("email")}
                className={clsx(
                  "form-control bg-light border-0 mb-8",
                  { "is-invalid": formik.touched.email && formik.errors.email },
                  { "is-valid": formik.touched.email && !formik.errors.email }
                )}
                type="email"
                name="email"
                autoComplete="off"
              />
              {formik.touched.email && formik.errors.email && (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    <span
                      dangerouslySetInnerHTML={{
                        __html: formik.errors.email,
                      }}
                      role="alert"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="fv-row mb-3">
              <input
                type="password"
                placeholder={intl.formatMessage({
                  id: "LoginAndRegistration.Password",
                })}
                {...formik.getFieldProps("password")}
                className={clsx(
                  "form-control form-control-solid bg-light border-0 mb-8",
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
              {formik.touched.password && formik.errors.password && (
                <div className="fv-plugins-message-container">
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

            {/* Forgot Password link */}
            <div className="text-end  fs-base fw-semibold">
              <Link to="/forgot-password" className="link-primary">
                {intl.formatMessage({
                  id: "LoginAndRegistration.ForgotPassword",
                })}
              </Link>
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center mb-5">
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
        </form>
      </div>

      {/* Footer */}
      <div className="p-5 mt-auto">
        <Languages />
      </div>
    </div>
  );
};

export { Login };
