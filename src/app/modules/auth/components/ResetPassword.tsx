import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import clsx from "clsx";
import { checkUUIDValidity, changePassword } from "../core/_requests";
import { Link } from "react-router-dom";
import { PasswordMeterComponent } from "../../../../_metronic/assets/ts/components";
import { useAuth } from "../core/Auth";
import { useLocation } from "react-router-dom";
import { handleToast } from "../core/_toast";
import { useNavigate } from "react-router-dom";
import { useIntl } from "react-intl";
import { toAbsoluteUrl } from "../../../../_metronic/helpers";
import { LanguagesAuth } from "../../../../_metronic/partials/layout/header-menus/LanguagesAuth";
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const initialValues = {
  emailAddress: "",
  languageType: 0,
  password: "",
  changepassword: "",
  passwordResetToken: "",
};

export function ResetPassword() {
  const [loading, setLoading] = useState(false);
  const { saveAuth } = useAuth();
  const navigate = useNavigate();
  const query = useQuery();
  const uuid = query.get("uuid");
  const intl = useIntl();
  // const reset_email = localStorage.getItem('reset_email')
  const resetSchema = Yup.object().shape({
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
    changepassword: Yup.string()
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
          .replace(
            "{0}",
            intl.formatMessage({ id: "Fields.PasswordVerification" })
          )
      )
      .oneOf(
        [Yup.ref("password")],
        "Password and Confirm Password didn't match"
      ),
  });

  useEffect(() => {
    const checkUUID = async () => {
      const response = await checkUUIDValidity(uuid);

      if (response.hasErrors) {
        navigate("/");
      } else {
        formik.setFieldValue("emailAddress", response.result.emailAddress);
        formik.setFieldValue(
          "passwordResetToken",
          response.result.passwordResetToken
        );
        formik.setFieldValue("languageType", response.result.languageType);
      }
      handleToast(response);
    };
    checkUUID();
  }, []);
  const formik = useFormik({
    initialValues,
    validationSchema: resetSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      try {
        const response = await changePassword(
          values.emailAddress,
          values.password,
          values.changepassword,
          values.passwordResetToken,
          values.languageType
        );
        handleToast(response);
        navigate("/");
      } catch (error) {
        saveAuth(undefined);
        setStatus("The registration details is incorrect");
        setSubmitting(false);
        setLoading(false);
      }
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
            <div>
              <form
                className="form w-100 fv-plugins-bootstrap5 fv-plugins-framework py-20"
                noValidate
                id="kt_login_signup_form"
                onSubmit={formik.handleSubmit}
              >
                {/* begin::Heading */}
                <div className="text-start mb-11">
                  {/* begin::Title */}
                  <h1 className="text-gray-900 mb-3 fs-3x">
                    {" "}
                    {intl.formatMessage({
                      id: "LoginAndRegistration.ResetByTokenTitle",
                    })}
                    !
                  </h1>
                  {/* end::Title */}

                  <div
                    className="text-gray-500 fw-semibold fs-6"
                    data-kt-translate="general-desc"
                  >
                    {intl.formatMessage({
                      id: "LoginAndRegistration.ResetByTokenSubTitle",
                    })}
                  </div>
                </div>
                {/* end::Heading */}

                {/* Email */}
                <div className="fv-row mb-10">
                  <input
                    placeholder="Email"
                    type="email"
                    readOnly
                    autoComplete="off"
                    data-kt-translate="sign-up-input-email"
                    {...formik.getFieldProps("emailAddress")}
                    className="form-control form-control-lg form-control-solid bg-light"
                  />
                </div>

                {/* Password */}
                <div className="fv-row mb-10" data-kt-password-meter="true">
                  <div className="mb-1">
                    <div className="position-relative mb-3">
                      <input
                        type="password"
                        placeholder={intl.formatMessage({
                          id: "LoginAndRegistration.Password",
                        })}
                        autoComplete="off"
                        {...formik.getFieldProps("password")}
                        name="password"
                        data-kt-translate="sign-up-input-password"
                        className={clsx(
                          "form-control form-control-lg form-control-solid bg-light",
                          {
                            "is-invalid":
                              formik.touched.password && formik.errors.password,
                          },
                          {
                            "is-valid":
                              formik.touched.password &&
                              !formik.errors.password,
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
                  <div className="text-muted" data-kt-translate="reset-hint">
                    <p
                      dangerouslySetInnerHTML={{
                        __html: intl.formatMessage({
                          id: "Fields.WeakPasswordMessage",
                        }),
                      }}
                    />
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="fv-row mb-10">
                  <input
                    type="password"
                    placeholder={intl.formatMessage({
                      id: "LoginAndRegistration.PasswordVerification",
                    })}
                    autoComplete="off"
                    {...formik.getFieldProps("changepassword")}
                    name="changepassword"
                    data-kt-translate="sign-up-input-confirm-password"
                    className={clsx(
                      "form-control bg-light form-control-lg form-control-solid",
                      {
                        "is-invalid":
                          formik.touched.changepassword &&
                          formik.errors.changepassword,
                      },
                      {
                        "is-valid":
                          formik.touched.changepassword &&
                          !formik.errors.changepassword,
                      }
                    )}
                  />
                  {formik.touched.changepassword &&
                    formik.errors.changepassword && (
                      <div className="fv-plugins-message-container">
                        <div className="fv-help-block">
                          <span
                            dangerouslySetInnerHTML={{
                              __html: formik.errors.changepassword,
                            }}
                          />
                        </div>
                      </div>
                    )}
                </div>

                {/* Actions */}
                <div className="d-flex flex-stack">
                  {/* Submit */}
                  <button
                    id="kt_sign_up_submit"
                    className="btn btn-primary"
                    data-kt-translate="sign-up-submit"
                    disabled={formik.isSubmitting || !formik.isValid}
                  >
                    {!loading && (
                      <span className="indicator-label">
                        {" "}
                        {intl.formatMessage({
                          id: "Fields.ActionSetPassword",
                        })}
                      </span>
                    )}
                    {loading && (
                      <span
                        className="indicator-progress"
                        style={{ display: "block" }}
                      >
                        {intl.formatMessage({
                          id: "Common.Busy",
                        })}
                        ...{" "}
                        <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                      </span>
                    )}
                    <span className="indicator-progress">
                      {intl.formatMessage({
                        id: "Common.Busy",
                      })}
                      ...{" "}
                      <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                    </span>
                  </button>
                </div>

                {/* end::Login options */}

                {formik.status && (
                  <div className="mb-lg-15 alert alert-danger">
                    <div className="alert-text font-weight-bold">
                      {formik.status}
                    </div>
                  </div>
                )}
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
    </div>
  );
}
