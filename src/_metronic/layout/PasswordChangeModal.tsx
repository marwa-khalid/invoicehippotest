import { useIntl } from "react-intl";
import { KTIcon } from "../helpers";
import * as Yup from "yup";
import { useFormik } from "formik";
import { handleToast } from "../../app/modules/auth/core/_toast";
import {
  changePassword,
  changePasswordForProfile,
} from "../../app/modules/auth/core/_requests";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { useAuth } from "../../app/modules/auth";
import { PasswordMeterComponent } from "../assets/ts/components";
type Props = {
  setProfileModalOpen: (type: boolean) => void;
  targerUserId: number | undefined;
};

const PasswordChangeModal = ({ setProfileModalOpen, targerUserId }: Props) => {
  const intl = useIntl();
  useEffect(() => {
    // Use type assertion to access KTPasswordMeter
    const ktPasswordMeter = (window as any).KTPasswordMeter;
    if (ktPasswordMeter) {
      ktPasswordMeter.createInstances();
    }
  }, []);
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const formik = useFormik({
    initialValues: {
      requestingUserProfileId: currentUser?.result.id,
      requestingUserPassword: "",
      targetUserProfileId: targerUserId ? targerUserId : currentUser?.result.id,
      password: "",
      passwordVerification: "",
    },
    validationSchema: Yup.object().shape({
      requestingUserPassword: Yup.string().required(
        intl
          .formatMessage({ id: "Common.RequiredFieldHint2" })
          .replace(
            "{0}",
            intl.formatMessage({ id: "Fields.RequestingUserPassword" })
          )
      ),
      password: Yup.string().required(
        intl
          .formatMessage({ id: "Common.RequiredFieldHint2" })
          .replace("{0}", intl.formatMessage({ id: "Fields.Password" }))
      ),
      passwordVerification: Yup.string()
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
        const response = await changePasswordForProfile(values);
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
  useEffect(() => {
    PasswordMeterComponent.bootstrap();
  }, []);

  const [passwordStrength, setPasswordStrength] = useState(0);

  const evaluatePasswordStrength = (password: string) => {
    if (!password) return 0;

    let strength = 0;

    // Evaluate password strength criteria
    if (password.length > 1) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    return strength;
  };

  const getStrengthLabel = (strength: number) => {
    switch (strength) {
      case 0:
        return;
      case 1:
        return intl.formatMessage({ id: "Common.PasswordStrengthPoor" });
      case 2:
        return intl.formatMessage({ id: "Common.PasswordStrengthNotGood" });
      case 3:
        return intl.formatMessage({ id: "Common.PasswordStrengthAverage" });
      case 4:
        return intl.formatMessage({ id: "Common.PasswordStrengthGood" });
      default:
        return "";
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    formik.setFieldValue("password", password);
    const strength = evaluatePasswordStrength(password);
    setPasswordStrength(strength);
  };

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
              <div className="fv-row mb-10" data-kt-password-meter="true">
                <label className="required fw-bold mb-2">
                  {intl.formatMessage({ id: "LoginAndRegistration.Password" })}
                </label>
                <div className="mb-1">
                  <div className="position-relative mb-3">
                    <input
                      type="password"
                      placeholder={intl.formatMessage({
                        id: "LoginAndRegistration.Password",
                      })}
                      autoComplete="new-password"
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
                      onChange={handlePasswordChange}
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
                    <div
                      className={clsx(
                        "flex-grow-1 rounded h-5px me-2",
                        passwordStrength >= 1 ? "bg-danger" : "bg-secondary"
                      )}
                    ></div>
                    <div
                      className={clsx(
                        "flex-grow-1 rounded h-5px me-2",
                        passwordStrength >= 2 ? "bg-warning" : "bg-secondary"
                      )}
                    ></div>
                    <div
                      className={clsx(
                        "flex-grow-1 rounded h-5px me-2",
                        passwordStrength >= 3 ? "bg-warning" : "bg-secondary"
                      )}
                    ></div>
                    <div
                      className={clsx(
                        "flex-grow-1 rounded h-5px",
                        passwordStrength >= 4 ? "bg-success" : "bg-secondary"
                      )}
                    ></div>
                  </div>
                </div>

                <div className="mb-2" data-kt-translate="reset-hint">
                  {getStrengthLabel(passwordStrength)}
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
                  autoComplete="new-password"
                  {...formik.getFieldProps("passwordVerification")}
                  name="passwordVerification"
                  data-kt-translate="sign-up-input-confirm-password"
                  className={clsx(
                    "form-control bg-light form-control-lg form-control-solid",
                    {
                      "is-invalid":
                        formik.touched.passwordVerification &&
                        formik.errors.passwordVerification,
                    },
                    {
                      "is-valid":
                        formik.touched.passwordVerification &&
                        !formik.errors.passwordVerification,
                    }
                  )}
                />
                {formik.touched.passwordVerification &&
                  formik.errors.passwordVerification && (
                    <div className="fv-plugins-message-container mb-1">
                      <div className="fv-help-block">
                        <span
                          dangerouslySetInnerHTML={{
                            __html: formik.errors.passwordVerification,
                          }}
                        />
                      </div>
                    </div>
                  )}
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
                  autoComplete="current-password"
                  {...formik.getFieldProps("requestingUserPassword")}
                  name="requestingUserPassword"
                  data-kt-translate="sign-up-input-password"
                  className={clsx(
                    "form-control form-control-lg form-control-solid bg-light",
                    {
                      "is-invalid":
                        formik.touched.requestingUserPassword &&
                        formik.errors.requestingUserPassword,
                    },
                    {
                      "is-valid":
                        formik.touched.requestingUserPassword &&
                        !formik.errors.requestingUserPassword,
                    }
                  )}
                />
                {formik.touched.requestingUserPassword &&
                  formik.errors.requestingUserPassword && (
                    <div className="fv-plugins-message-container mt-1">
                      <div className="fv-help-block">
                        <span
                          dangerouslySetInnerHTML={{
                            __html: formik.errors.requestingUserPassword,
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
                    <span
                      dangerouslySetInnerHTML={{
                        __html: intl.formatMessage({ id: "Common.Busy" }),
                      }}
                    />
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
