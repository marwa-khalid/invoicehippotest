import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import clsx from "clsx";
// import { register} from '../core/_requests'
import { Link } from "react-router-dom";
import { PasswordMeterComponent } from "../../../../_metronic/assets/ts/components";
import { useAuth } from "../core/Auth";
import { useIntl } from "react-intl";
import { Languages } from "../../../../_metronic/partials/layout/header-menus/Languages";

const initialValues = {
  firstname: "",
  lastname: "",
  email: "",
  password: "",
  changepassword: "",
  acceptTerms: false,
};

const registrationSchema = Yup.object().shape({
  firstname: Yup.string()
    .min(3, "Minimum 3 symbols")
    .max(50, "Maximum 50 symbols")
    .required("First name is required"),
  email: Yup.string()
    .email("Wrong email format")
    .min(3, "Minimum 3 symbols")
    .max(50, "Maximum 50 symbols")
    .required("Email is required"),
  lastname: Yup.string()
    .min(3, "Minimum 3 symbols")
    .max(50, "Maximum 50 symbols")
    .required("Last name is required"),
  password: Yup.string()
    .min(3, "Minimum 3 symbols")
    .max(50, "Maximum 50 symbols")
    .required("Password is required"),
  changepassword: Yup.string()
    .min(3, "Minimum 3 symbols")
    .max(50, "Maximum 50 symbols")
    .required("Password confirmation is required")
    .oneOf([Yup.ref("password")], "Password and Confirm Password didn't match"),
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
      // try {
      //   const {data: auth} = await register(
      //     values.email,
      //     values.firstname,
      //     values.lastname,
      //     values.password,
      //     values.changepassword
      //   )
      //   saveAuth(auth)
      // } catch (error) {
      //   console.error(error)
      //   saveAuth(undefined)
      //   setStatus('The registration details is incorrect')
      //   setSubmitting(false)
      //   setLoading(false)
      // }
    },
  });

  useEffect(() => {
    PasswordMeterComponent.bootstrap();
  }, []);

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between pb-lg-0 align-items-center">
        <Link to="/" className="btn btn-icon bg-light rounded-circle">
          <i className="ki-outline ki-black-left fs-2 text-gray-800"></i>
        </Link>
        <div>
          <span
            className="text-gray-500 fw-bold fs-5 me-2"
            data-kt-translate="sign-in-head-desc"
          >
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
            {intl.formatMessage({ id: "LoginAndRegistration.TitleRegister" })}
          </h1>
          {/* end::Title */}

          <div
            className="text-gray-500 fw-semibold fs-6"
            data-kt-translate="general-desc"
          >
            {intl.formatMessage({
              id: "LoginAndRegistration.RegistrationStep3SubTitle",
            })}
          </div>
        </div>
        {/* end::Heading */}
        <div className="row mb-10">
          <div className="col-xl-6">
            <input
              placeholder={intl.formatMessage({
                id: "LoginAndRegistration.FirstName",
              })}
              type="text"
              autoComplete="off"
              {...formik.getFieldProps("firstname")}
              className={clsx(
                "form-control form-control-lg form-control-solid bg-light",
                {
                  "is-invalid":
                    formik.touched.firstname && formik.errors.firstname,
                },
                {
                  "is-valid":
                    formik.touched.firstname && !formik.errors.firstname,
                }
              )}
              name="first-name"
              data-kt-translate="sign-up-input-first-name"
            />
            {formik.touched.firstname && formik.errors.firstname && (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  <span role="alert">{formik.errors.firstname}</span>
                </div>
              </div>
            )}
          </div>
          {/* Last Name */}
          <div className="col-xl-6">
            <input
              placeholder={intl.formatMessage({
                id: "LoginAndRegistration.LastName",
              })}
              type="text"
              autoComplete="off"
              {...formik.getFieldProps("lastname")}
              className={clsx(
                "form-control form-control-lg form-control-solid bg-light",
                {
                  "is-invalid":
                    formik.touched.lastname && formik.errors.lastname,
                },
                {
                  "is-valid":
                    formik.touched.lastname && !formik.errors.lastname,
                }
              )}
              name="last-name"
              data-kt-translate="sign-up-input-last-name"
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

        {/* Email */}
        <div className="fv-row mb-10">
          <input
            placeholder={intl.formatMessage({
              id: "LoginAndRegistration.EmailAddress",
            })}
            type="email"
            autoComplete="off"
            data-kt-translate="sign-up-input-email"
            {...formik.getFieldProps("email")}
            className={clsx(
              "form-control form-control-lg form-control-solid bg-light",
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

        {/* Password */}
        <div className="fv-row mb-10" data-kt-password-meter="true">
          <div className="mb-1">
            <div className="position-relative mb-3">
              <input
                type="password"
                placeholder={intl.formatMessage({
                  id: "LoginAndRegistration.PasswordRegistration",
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
                      formik.touched.password && !formik.errors.password,
                  }
                )}
              />
              {formik.touched.password && formik.errors.password && (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">
                    <span role="alert">{formik.errors.password}</span>
                  </div>
                </div>
              )}
              {/* <span className='btn btn-sm btn-icon position-absolute translate-middle top-50 end-0 me-n2' data-kt-password-meter-control='visibility'>
              <i className='ki-outline ki-eye-slash fs-2'></i>
              <i className='ki-outline ki-eye fs-2 d-none'></i>
            </span> */}
            </div>
            <div
              className="d-flex align-items-center mb-3"
              data-kt-password-meter-control="highlight"
            >
              <div className="flex-grow-1 bg-secondary bg-active-red rounded h-5px me-2"></div>
              <div className="flex-grow-1 bg-secondary bg-active-warning rounded h-5px me-2"></div>
              <div className="flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2"></div>
              <div className="flex-grow-1 bg-secondary bg-active-success rounded h-5px"></div>
            </div>
          </div>

          <div className="text-muted" data-kt-translate="sign-up-hint">
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
            name="confirm-password"
            data-kt-translate="sign-up-input-confirm-password"
            className={clsx(
              "form-control bg-light form-control-lg form-control-solid",
              {
                "is-invalid":
                  formik.touched.changepassword && formik.errors.changepassword,
              },
              {
                "is-valid":
                  formik.touched.changepassword &&
                  !formik.errors.changepassword,
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

        {/* Actions */}
        <div className="d-flex flex-stack">
          {/* Submit */}
          <button
            id="kt_sign_up_submit"
            className="btn btn-primary"
            data-kt-translate="sign-up-submit"
            disabled={
              formik.isSubmitting ||
              !formik.isValid ||
              !formik.values.acceptTerms
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
            <div className="alert-text font-weight-bold">{formik.status}</div>
          </div>
        )}
      </form>

      <Languages />
    </div>
  );
}
