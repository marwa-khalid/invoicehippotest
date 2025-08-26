import { FC, useEffect, useState } from "react";
import clsx from "clsx";
import { useIntl } from "react-intl";
import Select from "react-select";
import { FormikProps } from "formik";
import { getCompanies, getUserTypes } from "../core/_requests";
import { CompaniesResult } from "../core/_models";
import enums from "../../../../../_metronic/i18n/messages/invoicehippo.enums.json";
import { getEnumOptions } from "../../../../helpers/intlHelper";
interface FormValues {
  id: number;
  genderType: number;
  userType: number;
  firstName: string;
  languageType: number;
  betweenName: string;
  lastName: string;
  loginEmailAddress: string;
  isActive: boolean;
  accessibleCompanies: {
    isDefault: boolean;
    companyId: number;
  }[];
  passwordSet: {
    password: string;
    passwordVerification: string;
  };
  requestingUserProfileId: number;
  requestingUserPassword: string;
  sendInvitationForNewUser: boolean;
  generatePasswordForNewUser: boolean;
  accountantBeconNumber: string;
  accountantNotificationEmailAddress: string;
}

type Props = {
  formik: FormikProps<FormValues>;
  isSubmitting: boolean;
};

const UserEditModalForm: FC<Props> = ({ formik, isSubmitting }) => {
  const intl = useIntl();
  const [companies, setCompanies] = useState<CompaniesResult[]>([]);
  const [userTypes, setUserTypes] = useState<CompaniesResult[]>([]);
  // const [languages, setLanguages] = useState<LanguagesResult[]>([]);
  useEffect(() => {
    const fetchAccessibleCompanies = async () => {
      const response = await getCompanies();

      setCompanies(response.result);
    };
    fetchAccessibleCompanies();
  }, []);

  useEffect(() => {
    const fetchUserTypes = async () => {
      const response = await getUserTypes();

      setUserTypes(response.result);
    };
    fetchUserTypes();
  }, []);

  return (
    <>
      <form
        id="kt_modal_add_user_form"
        className="form"
        onSubmit={formik.handleSubmit}
        noValidate
      >
        {/* Email address */}
        <div className="fv-row mb-7">
          <label className="required fw-bold fs-6 mb-2">
            {intl.formatMessage({ id: "Fields.LoginEmailAddress" })}
          </label>
          <input
            placeholder="Email"
            {...formik.getFieldProps("loginEmailAddress")}
            className={clsx(
              "form-control form-control-solid mb-3 mb-lg-0",
              {
                "is-invalid":
                  formik.touched.loginEmailAddress &&
                  formik.errors.loginEmailAddress,
              },
              {
                "is-valid":
                  formik.touched.loginEmailAddress &&
                  !formik.errors.loginEmailAddress,
              }
            )}
            type="email"
            name="loginEmailAddress"
            autoComplete="off"
            disabled={formik.isSubmitting}
          />
          {formik.touched.loginEmailAddress &&
            formik.errors.loginEmailAddress && (
              <div className="fv-plugins-message-container">
                <span
                  className="text-danger"
                  dangerouslySetInnerHTML={{
                    __html: formik.errors.loginEmailAddress,
                  }}
                />
              </div>
            )}
        </div>

        {/* Gender type and name fields */}
        <div className="row d-flex mb-7">
          <label className="required fw-bold fs-6 mb-2">
            {" "}
            {intl.formatMessage({ id: "Fields.GenderType" })}
          </label>
          <Select
            name="genderType"
            options={getEnumOptions(enums.GenderTypes, intl)}
            value={getEnumOptions(enums.GenderTypes, intl).find(
              (option) => option.value === formik.values.genderType
            )}
            onChange={(option) =>
              formik.setFieldValue("genderType", option?.value)
            }
            isDisabled={formik.isSubmitting}
            className="react-select-styled"
            isClearable
          />
          {formik.touched.genderType && formik.errors.genderType && (
            <div className="fv-plugins-message-container">
              <span
                dangerouslySetInnerHTML={{ __html: formik.errors.genderType }}
                role="alert"
              />
            </div>
          )}
        </div>
        {/* name fields */}
        <div className="row mb-7 d-flex">
          <div className="fv-row col-4">
            <label className="required fw-bold fs-6 mb-2">
              {intl.formatMessage({ id: "Fields.FirstName" })}
            </label>
            <input
              placeholder={intl.formatMessage({ id: "Fields.FirstName" })}
              {...formik.getFieldProps("firstName")}
              type="text"
              name="firstName"
              className={clsx("form-control form-control-solid mb-3 mb-lg-0", {
                "is-invalid":
                  formik.touched.firstName && formik.errors.firstName,
              })}
              autoComplete="off"
              disabled={formik.isSubmitting}
            />
            {formik.touched.firstName && formik.errors.firstName && (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  <span
                    className="text-danger"
                    dangerouslySetInnerHTML={{
                      __html: formik.errors.firstName,
                    }}
                  />
                </div>
              </div>
            )}
          </div>
          <div className="fv-row col-4">
            <label className="fw-bold fs-6 mb-2">
              {intl.formatMessage({ id: "Fields.BetweenName" })}
            </label>
            <input
              placeholder={intl.formatMessage({ id: "Fields.BetweenName" })}
              {...formik.getFieldProps("betweenName")}
              type="text"
              name="betweenName"
              className={clsx("form-control form-control-solid mb-3 mb-lg-0", {
                "is-invalid":
                  formik.touched.betweenName && formik.errors.betweenName,
              })}
              autoComplete="off"
              disabled={formik.isSubmitting}
            />
            {formik.touched.betweenName && formik.errors.betweenName && (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  <span
                    className="text-danger"
                    dangerouslySetInnerHTML={{
                      __html: formik.errors.betweenName,
                    }}
                  />
                </div>
              </div>
            )}
          </div>
          <div className="fv-row col-4">
            <label className="required fw-bold fs-6 mb-2">
              {intl.formatMessage({ id: "Fields.LastName" })}
            </label>
            <input
              placeholder={intl.formatMessage({ id: "Fields.LastName" })}
              {...formik.getFieldProps("lastName")}
              type="text"
              name="lastName"
              className={clsx("form-control form-control-solid mb-3 mb-lg-0", {
                "is-invalid": formik.touched.lastName && formik.errors.lastName,
              })}
              autoComplete="off"
              disabled={formik.isSubmitting}
            />
            {formik.touched.lastName && formik.errors.lastName && (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  <span
                    className="text-danger"
                    dangerouslySetInnerHTML={{ __html: formik.errors.lastName }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Language Selection */}
        <div className="row mb-7 d-flex">
          <div className="fv-row col-6 ">
            <label className="required fw-bold fs-6 mb-2">
              {intl.formatMessage({ id: "Fields.LanguagePreferenceType" })}
            </label>
            <Select
              name="languageType"
              options={getEnumOptions(enums.LanguageTypesCompleet, intl)}
              onChange={(option) =>
                formik.setFieldValue("languageType", option?.value)
              }
              value={getEnumOptions(enums.LanguageTypesCompleet, intl).find(
                (option) => option.value === formik.values.languageType
              )}
              isDisabled={formik.isSubmitting}
              className="react-select-styled"
              isClearable
            />
            {formik.touched.languageType && formik.errors.languageType && (
              <div className="fv-plugins-message-container">
                <span
                  className="text-danger"
                  dangerouslySetInnerHTML={{
                    __html: formik.errors.languageType,
                  }}
                />
              </div>
            )}
          </div>

          <div className="fv-row col-6">
            <label className="required fw-bold fs-6 mb-2">
              {intl.formatMessage({ id: "Fields.UserType" })}
            </label>
            <Select
              name="userType"
              options={userTypes.map((userType) => {
                return {
                  value: userType.value,
                  label: userType.title,
                };
              })}
              onChange={(option) =>
                formik.setFieldValue("userType", option?.value)
              }
              value={userTypes
                .map((userType) => {
                  return {
                    value: userType.value,
                    label: userType.title,
                  };
                })
                .find((option) => option.value === formik.values.userType)}
              isDisabled={formik.isSubmitting}
              className="react-select-styled"
              isClearable
            />
            {formik.touched.userType && formik.errors.userType && (
              <div className="fv-plugins-message-container">
                <span
                  className="text-danger"
                  dangerouslySetInnerHTML={{ __html: formik.errors.userType }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Accessible Companies */}

        <div className="fv-row mb-7">
          <label className="fw-bold fs-6 mb-2">
            {intl.formatMessage({ id: "Fields.AccessibleCompanies" })}
          </label>
          {companies.map((company, index) => {
            const isActive = formik.values.accessibleCompanies.some(
              (selectedCompany) => selectedCompany.companyId === company.value
            );
            const isDefault = isActive
              ? formik.values.accessibleCompanies.find(
                  (selectedCompany) =>
                    selectedCompany.companyId === company.value
                )?.isDefault
              : false;

            return (
              <div
                key={company.value}
                className="d-flex align-items-center justify-content-between mb-3 alert alert-custom alert-default bg-secondary  "
              >
                <div className="d-flex align-items-center">
                  <i className="ki-duotone ki-office-bag text-primary fs-2x me-2">
                    <span className="path1"></span>
                    <span className="path2"></span>
                    <span className="path3"></span>
                    <span className="path4"></span>
                  </i>
                  <label className="me-3">{company.title}</label>
                </div>

                <div className="d-flex align-items-center">
                  <label className="me-2">Active</label>
                  <div className="form-check form-switch d-flex align-items-center ">
                    <input
                      className="form-check-input h-20px w-35px"
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => {
                        const updatedCompanies = e.target.checked
                          ? [
                              ...formik.values.accessibleCompanies,
                              { companyId: company.value, isDefault: false },
                            ]
                          : formik.values.accessibleCompanies.filter(
                              (selectedCompany) =>
                                selectedCompany.companyId !== company.value
                            );

                        formik.setFieldValue(
                          "accessibleCompanies",
                          updatedCompanies
                        );
                      }}
                    />
                  </div>

                  <label className="me-2">isDefault</label>
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input h-20px w-35px"
                      type="checkbox"
                      checked={isDefault}
                      disabled={!isActive}
                      onChange={(e) => {
                        const updatedCompanies =
                          formik.values.accessibleCompanies.map(
                            (selectedCompany) => ({
                              ...selectedCompany,
                              isDefault:
                                selectedCompany.companyId === company.value
                                  ? e.target.checked
                                  : false,
                            })
                          );

                        formik.setFieldValue(
                          "accessibleCompanies",
                          updatedCompanies
                        );
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div
          className="row alert alert-custom alert-default bg-secondary align-items-center mt-8 mx-0 "
          role="alert"
        >
          <div className="alert-icon col-1">
            <i className="ki-duotone ki-information-4 fs-3x text-center text-primary">
              <span className="path1"></span>
              <span className="path2"></span>
              <span className="path3"></span>
            </i>
          </div>
          <div className="alert-text col-11">
            <p className="my-0 p-3">
              {intl.formatMessage({
                id: "Fields.RegionInfoEditOrAddCurrentUserPassword",
              })}
            </p>
          </div>
        </div>

        {/* Password  */}
        <div className="fv-row mb-7">
          <label className="required fw-bold fs-6 mb-2">
            {intl.formatMessage({ id: "Fields.RequestingUserPassword" })}
          </label>
          <input
            placeholder="Password"
            type="password"
            autoComplete="off"
            {...formik.getFieldProps("requestingUserPassword")}
            className={clsx(
              "form-control form-control-solid mb-3 mb-lg-0",
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
            disabled={formik.isSubmitting}
          />
          {formik.touched.requestingUserPassword &&
            formik.errors.requestingUserPassword && (
              <div className="fv-plugins-message-container">
                <span
                  className="text-danger"
                  dangerouslySetInnerHTML={{
                    __html: formik.errors.requestingUserPassword,
                  }}
                />
              </div>
            )}
        </div>
      </form>
    </>
  );
};

export { UserEditModalForm };
