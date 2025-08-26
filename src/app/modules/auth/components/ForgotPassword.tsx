import { useState } from "react";
import * as Yup from "yup";
import clsx from "clsx";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { requestResetLink } from "../core/_requests";
import { handleToast } from "../core/_toast";
import { useIntl } from "react-intl";
const initialValues = {
  email: "",
};

export function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [hasErrors, setHasErrors] = useState<boolean | undefined>(undefined);
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

      const reset = await requestResetLink(values.email);

      if (reset.isValid) {
        setLoading(false);
        localStorage.setItem("reset_email", values.email);
        navigate("/forgot-password/success", {
          state: { textInfo: reset.textInfo },
        });
      } else {
        handleToast(reset);
        setLoading(false);
        setSubmitting(false);
        setStatus("The login detail is incorrect");
      }
    },
  });

  return (
    <form
      className="form w-100 fv-plugins-bootstrap5 fv-plugins-framework"
      noValidate
      id="kt_login_password_reset_form"
      onSubmit={formik.handleSubmit}
    >
      <div className="text-center mb-10">
        {/* begin::Title */}
        <h1 className="text-gray-900 fw-bolder mb-3">
          {intl.formatMessage({
            id: "LoginAndRegistration.ResetTitle",
          })}
        </h1>
        {/* end::Title */}

        {/* begin::Link */}
        <div className="text-gray-500 fw-semibold fs-6">
          {intl.formatMessage({
            id: "LoginAndRegistration.ResetSubTitle",
          })}
        </div>
        {/* end::Link */}
      </div>

      {/* begin::Form group */}
      <div className="fv-row mb-8">
        <label className="form-label fw-bolder text-gray-900 fs-6">
          {intl.formatMessage({
            id: "Fields.EmailAddress",
          })}
        </label>
        <input
          type="email"
          placeholder={intl.formatMessage({
            id: "Fields.EmailAddress",
          })}
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
              <span
                role="alert"
                dangerouslySetInnerHTML={{
                  __html: formik.errors.email,
                }}
              />
            </div>
          </div>
        )}
      </div>
      {/* end::Form group */}

      {/* begin::Form group */}
      <div className="d-flex flex-wrap justify-content-center pb-lg-0">
        <button
          type="submit"
          id="kt_password_reset_submit"
          className="btn btn-primary me-4"
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
            className="btn btn-light"
            disabled={formik.isSubmitting || !formik.isValid}
          >
            {intl.formatMessage({ id: "Fields.ActionCancel" })}
          </button>
        </Link>
      </div>
      {/* end::Form group */}
    </form>
  );
}
