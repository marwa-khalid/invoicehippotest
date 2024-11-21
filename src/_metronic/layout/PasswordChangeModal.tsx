import { useIntl } from "react-intl";
import { KTIcon } from "../helpers";
import * as Yup from "yup";
import { useFormik } from "formik";
import { handleToast } from "../../app/modules/auth/core/_toast";
import { changePassword } from "../../app/modules/auth/core/_requests";
import { useState } from "react";
import clsx from "clsx";
type Props = {
  setProfileModalOpen: (type: boolean) => void;
};
const PasswordChangeModal = ({ setProfileModalOpen }: Props) => {
  const intl = useIntl();
  const [loading, setLoading] = useState<boolean>(false);
  const formik = useFormik({
    initialValues: {
      emailAddress: "",
      languageType: 0,
      password: "",
      changepassword: "",
      passwordResetToken: "",
    },
    validationSchema: Yup.object().shape({
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
    }),
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
        setProfileModalOpen(false);
      } catch (error) {
        console.error(error);
        setStatus("The registration details is incorrect");
        setSubmitting(false);
      } finally {
        setLoading(false);
      }
    },
  });
  return (
    <>
      <div
        className="modal fade show d-block"
        id="profileModal"
        role="dialog"
        tabIndex={-1}
        aria-modal="true"
      >
        {/* begin::Modal dialog */}
        <div className="modal-dialog modal-dialog-centered ">
          {/* begin::Modal content */}
          <div className="modal-content">
            <div className="modal-header bg-primary d-flex flex-column">
              {/* Modal title */}
              <div className="d-flex w-100 justify-content-between align-items-center">
                <h2 className="fw-bolder mb-0 text-white">
                  {intl.formatMessage({
                    id: "Fields.ModalTitleManagePassword",
                  })}
                </h2>
                <div
                  className="btn btn-icon btn-sm btn-active-icon-primary"
                  data-kt-users-modal-action="close"
                  onClick={() => {
                    setProfileModalOpen(false);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <KTIcon iconName="cross" className="fs-1 text-white" />
                </div>
              </div>
            </div>
            {/* begin::Modal body */}
            <div className="modal-body p-10">
              <div className="row d-flex form-wrapper bg-secondary p-5 rounded mb-7">
                <div className="col-2">
                  <i className="ki-duotone ki-information-4 fs-3x  my-auto">
                    <span className="path1"></span>
                    <span className="path2"></span>
                    <span className="path3"></span>
                  </i>
                </div>
                <span
                  className="col-10"
                  dangerouslySetInnerHTML={{
                    __html: intl.formatMessage({
                      id: "Fields.RegionInfoUserNewPassword",
                    }),
                  }}
                />
              </div>
              {/* Password */}
              <div className="row d-flex mb-7" data-kt-password-meter="true">
                <label htmlFor="" className="required fw-bold mb-2">
                  {intl.formatMessage({ id: "LoginAndRegistration.Password" })}
                </label>
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
                        formik.touched.password && !formik.errors.password,
                    }
                  )}
                />
                {formik.touched.password && formik.errors.password && (
                  <div className="fv-plugins-message-container mt-1">
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
              {/* Confirm Password */}
              <div className="row d-flex mb-7">
                <label htmlFor="" className="required fw-bold mb-2">
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
                    <div className="fv-plugins-message-container mb-1">
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
              <div className="row d-flex">
                <div
                  className="d-flex align-items-center mb-3"
                  data-kt-password-meter-control="highlight"
                >
                  <div className="flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2"></div>
                  <div className="flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2"></div>
                  <div className="flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2"></div>
                  <div className="flex-grow-1 bg-secondary bg-active-success rounded h-5px"></div>
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
              <div className="row d-flex form-wrapper bg-secondary p-5 rounded mb-7">
                <div className="col-2">
                  <i className="ki-duotone ki-information-4 fs-3x  my-auto">
                    <span className="path1"></span>
                    <span className="path2"></span>
                    <span className="path3"></span>
                  </i>
                </div>
                <span
                  className="col-10"
                  dangerouslySetInnerHTML={{
                    __html: intl.formatMessage({
                      id: "Fields.RegionInfoUserCurrentPassword",
                    }),
                  }}
                />
              </div>

              <div className="row d-flex" data-kt-password-meter="true">
                <label htmlFor="" className="required fw-bold mb-2">
                  {intl.formatMessage({
                    id: "Fields.RequestingUserPassword",
                  })}
                </label>
                <input
                  type="password"
                  placeholder={intl.formatMessage({
                    id: "Fields.RequestingUserPassword",
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
                  <div className="fv-plugins-message-container mt-1">
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
            </div>

            {/* end::Modal body */}
            <div className="modal-footer flex-end">
              <button
                type="button"
                className="btn btn-secondary me-3"
                onClick={() => {
                  setProfileModalOpen(false);
                  localStorage.removeItem("ModalData");
                }}
              >
                {intl.formatMessage({ id: "Fields.ActionClose" })}
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                onClick={() => formik.handleSubmit()}
                disabled={loading || !formik.isValid}
              >
                {!loading &&
                  intl.formatMessage({ id: "Fields.ActionSetPassword" })}
                {loading && (
                  <span
                    className="indicator-progress"
                    style={{ display: "block" }}
                  >
                    {intl.formatMessage({ id: "Common.Busy" })}
                    <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                  </span>
                )}
              </button>
            </div>
          </div>
          {/* end::Modal content */}
        </div>
        {/* end::Modal dialog */}
      </div>
      {/* begin::Modal Backdrop */}
      <div className="modal-backdrop fade show"></div>
      {/* end::Modal Backdrop */}
    </>
  );
};

export { PasswordChangeModal };
