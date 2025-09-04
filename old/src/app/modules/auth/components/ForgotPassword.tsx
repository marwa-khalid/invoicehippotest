import { useState } from "react";
import * as Yup from "yup";
import clsx from "clsx";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import { requestResetLink } from "../core/_requests";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { useIntl } from "react-intl";
import { handleToast } from "../core/_toast";
import { LanguagesAuth } from "../../../../_metronic/partials/layout/header-menus/LanguagesAuth";
import { toAbsoluteUrl } from "../../../../_metronic/helpers";
const initialValues = {
  email: "",
};

export function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [hasErrors, setHasErrors] = useState<boolean | undefined>(undefined);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const intl = useIntl();

  const forgotPasswordSchema = Yup.object().shape({
    email: Yup.string()
      .email("Wrong email format")
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols")
      .required(
        intl
          .formatMessage({ id: "Common.RequiredFieldHint2" })
          .replace("{0}", intl.formatMessage({ id: "Fields.EmailAddress" }))
      ),
  });

  const formik = useFormik({
    initialValues,
    validationSchema: forgotPasswordSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      setHasErrors(undefined);

      const reset = await requestResetLink(values.email);
  
      if (reset.isValid) {
        setHasErrors(false);
        setLoading(false);
        localStorage.setItem("reset_email", values.email);
        navigate("/forgot-password/success", {
          state: { textInfo: reset.textInfo },
        });
      } else {
        handleToast(reset);
        setHasErrors(true);
        setLoading(false);
        setSubmitting(false);
        setStatus("The login detail is incorrect");
      }
    },
  });

  return (
    <div className="d-flex flex-column flex-root" id="kt_app_root">
      <div className="d-flex flex-column flex-lg-row flex-column-fluid">
        {/* Logo for small screens */}
        <Link to="/" className="d-block d-lg-none mx-auto py-20">
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
        </Link>

        {/* Left side content */}
        <div className="d-flex flex-column flex-column-fluid flex-center w-lg-50 p-10">
          <div className="d-flex justify-content-between flex-column-fluid flex-column w-100 mw-450px">
            <div className="d-flex flex-stack py-2">
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
                <Link to="/" className="link-primary fw-bold fs-5">
                  {intl.formatMessage({
                    id: "LoginAndRegistration.SubTitleLinkRegister",
                  })}
                </Link>
              </div>
            </div>

            <div className="py-20">
              <form
                className="form w-100 fv-plugins-bootstrap5 fv-plugins-framework"
                noValidate
                id="kt_login_password_reset_form"
                onSubmit={formik.handleSubmit}
              >
                <div className="text-start mb-10">
                  <h1 className="text-gray-900 mb-3 fs-3x">
                    {intl.formatMessage({
                      id: "LoginAndRegistration.ResetTitle",
                    })}
                  </h1>
                  <div className="text-gray-500 fw-semibold fs-6">
                    {intl.formatMessage({
                      id: "LoginAndRegistration.ResetSubTitle",
                    })}
                  </div>
                </div>

                <div className="fv-row mb-10">
                  <input
                    type="email"
                    placeholder={intl.formatMessage({
                      id: "Fields.EmailAddress",
                    })}
                    autoComplete="off"
                    {...formik.getFieldProps("email")}
                    className={clsx(
                      "form-control form-control-solid",
                      {
                        "is-invalid":
                          formik.touched.email && formik.errors.email,
                      },
                      {
                        "is-valid":
                          formik.touched.email && !formik.errors.email,
                      }
                    )}
                  />
                  {formik.touched.email && formik.errors.email && (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">
                        <span
                          dangerouslySetInnerHTML={{
                            __html: formik.errors.email,
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="d-flex ">
                  <button
                    type="submit"
                    id="kt_password_reset_submit"
                    className="btn btn-primary me-2"
                  >
                    <span className="indicator-label">
                      {intl.formatMessage({ id: "Fields.ActionSendEmail" })}
                    </span>
                    {loading && (
                      <span className="indicator-progress">
                        {intl.formatMessage({
                          id: "Common.Busy",
                        })}
                        ...
                        <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                      </span>
                    )}
                  </button>
                  <Link to="/">
                    <button
                      type="button"
                      id="kt_login_password_reset_form_cancel_button"
                      className="btn btn-lg btn-light-primary fw-bold"
                      disabled={formik.isSubmitting || !formik.isValid}
                    >
                      {intl.formatMessage({ id: "Fields.ActionCancel" })}
                    </button>
                  </Link>
                </div>
              </form>
            </div>

            <div className="m-0">
              <LanguagesAuth />
            </div>
          </div>
        </div>

        {/* Right side image */}
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
      <ToastContainer />
    </div>
  );
}
