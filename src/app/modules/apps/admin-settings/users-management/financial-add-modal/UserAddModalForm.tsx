import { FC, useState } from "react";
import clsx from "clsx";
import { useIntl } from "react-intl";
import Select from "react-select";
import { FormikProps } from "formik";
import { toAbsoluteUrl } from "../../../../../../_metronic/helpers";
import { Avatar, Box, IconButton, Stack, Input } from "@chakra-ui/react";
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
  requestingUserProfileIda: number;
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

const UserAddModalForm: FC<Props> = ({ formik, isSubmitting }) => {
  const intl = useIntl();

  const blankImg = toAbsoluteUrl("media/svg/avatars/blank.svg");

  // User type options for react-select
  const userTypeOptions = [
    { value: 1, label: "Administrator" },
    { value: 2, label: "Accountant" },
  ];

  // Gender type options for react-select
  const genderOptions = [
    { value: 1, label: "Man" },
    { value: 2, label: "Vrouw" },
  ];

  // Accessible companies options for react-select
  const companyOptions = [{ value: 1, label: "ZTech" }];

  // Language options for react-select
  const languageOptions = [
    { value: "nl", label: "Nederlands" },
    { value: "en", label: "English" },
  ];

  const [avatar, setAvatar] = useState<string | ArrayBuffer | null>(null);

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeAvatar = () => setAvatar(null);

  return (
    <>
      <form
        id="kt_modal_add_user_form"
        className="form"
        onSubmit={formik.handleSubmit}
        noValidate
      >
        {/* Avatar upload */}
        <div className="fv-row mb-7">
          <label className="d-block fw-bold fs-6 mb-5">Avatar</label>
          <Stack direction="row" align="center">
            <Avatar
              src={
                avatar
                  ? avatar.toString()
                  : toAbsoluteUrl("media/svg/avatars/blank.svg")
              }
              bg="gray.100"
              width={100}
              height={100}
            />
            <Box>
              <Input
                type="file"
                accept=".png, .jpg, .jpeg"
                onChange={handleAvatarChange}
                display="none"
                id="avatar-upload"
              />
              <IconButton
                icon={<i className="bi bi-pencil-fill fs-7" />}
                aria-label="Change avatar"
                as="label"
                htmlFor="avatar-upload"
                mr={2}
              />
              {avatar && (
                <IconButton
                  icon={<i className="bi bi-x fs-2" />}
                  aria-label="Remove avatar"
                  onClick={removeAvatar}
                />
              )}
            </Box>
          </Stack>
        </div>

        {/* User type select */}
        <div className="fv-row mb-7">
          <label className="required fw-bold fs-6 mb-2">
            {intl.formatMessage({ id: "Fields.UserType" })}
          </label>
          <Select
            name="userType"
            options={userTypeOptions}
            value={userTypeOptions.find(
              (option) => option.value === formik.values.userType
            )}
            onChange={(option) =>
              formik.setFieldValue("userType", option?.value)
            }
            isDisabled={formik.isSubmitting}
            className="react-select-styled"
            isClearable
          />
          {formik.touched.userType && formik.errors.userType && (
            <div className="fv-plugins-message-container">
              <span role="alert">{formik.errors.userType}</span>
            </div>
          )}
        </div>

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
                <span role="alert">{formik.errors.loginEmailAddress}</span>
              </div>
            )}
        </div>

        {/* Gender type and name fields */}
        <div className="fv-row mb-7 d-flex justify-content-between">
          <div className="me-3" style={{ width: "20%" }}>
            <label className="required fw-bold fs-6 mb-2">
              {" "}
              {intl.formatMessage({ id: "Fields.GenderType" })}
            </label>
            <Select
              name="genderType"
              options={genderOptions}
              value={genderOptions.find(
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
                <span role="alert">{formik.errors.genderType}</span>
              </div>
            )}
          </div>
          <div className="me-3" style={{ width: "25%" }}>
            <label className="required fw-bold fs-6 mb-2">
              {intl.formatMessage({ id: "Fields.FirstName" })}
            </label>
            <input
              placeholder="First name"
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
                  <span role="alert">{formik.errors.firstName}</span>
                </div>
              </div>
            )}
          </div>
          <div className="me-3" style={{ width: "25%" }}>
            <label className="fw-bold fs-6 mb-2">
              {intl.formatMessage({ id: "Fields.BetweenName" })}
            </label>
            <input
              placeholder="Middle name"
              {...formik.getFieldProps("middleName")}
              type="text"
              name="middleName"
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
                  <span role="alert">{formik.errors.betweenName}</span>
                </div>
              </div>
            )}
          </div>
          <div className="me-3" style={{ width: "25%" }}>
            <label className="required fw-bold fs-6 mb-2">
              {intl.formatMessage({ id: "Fields.LastName" })}
            </label>
            <input
              placeholder="Last name"
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
                  <span role="alert">{formik.errors.lastName}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Accessible Companies */}
        <div className="fv-row mb-7">
          <label className="fw-bold fs-6 mb-2">
            {intl.formatMessage({ id: "Fields.AccessibleCompanies" })}
          </label>
          <Select
            name="accessibleCompanies"
            options={companyOptions}
            value={formik.values.accessibleCompanies.map((company) =>
              companyOptions.find(
                (option) => option.value === company.companyId
              )
            )}
            onChange={(selectedOptions) =>
              formik.setFieldValue(
                "accessibleCompanies",
                selectedOptions?.map((option: any) => ({
                  companyId: option.value,
                  isDefault: false,
                }))
              )
            }
            placeholder={intl.formatMessage({
              id: "Fields.SelectOptionDefaultStatusType",
            })}
            isMulti
            isDisabled={formik.isSubmitting}
            className="react-select-styled"
            isClearable
          />
          {/* {formik.touched.accessibleCompanies &&
            formik.errors.accessibleCompanies && (
              <div className="fv-plugins-message-container">
                <span role="alert">{formik.errors.accessibleCompanies}</span>
              </div>
            )} */}
        </div>

        {/* Language Selection */}
        <div className="fv-row mb-7">
          <label className="required fw-bold fs-6 mb-2">
            {intl.formatMessage({ id: "Fields.LanguagePreferenceType" })}
          </label>
          <Select
            name="languageType"
            options={languageOptions}
            value={languageOptions.find(
              (option: any) => option.value === formik.values.languageType
            )}
            onChange={(option) =>
              formik.setFieldValue("languageType", option?.value)
            }
            isDisabled={formik.isSubmitting}
            className="react-select-styled"
            isClearable
          />
          {formik.touched.languageType && formik.errors.languageType && (
            <div className="fv-plugins-message-container">
              <span role="alert">{formik.errors.languageType}</span>
            </div>
          )}
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
          <div className="alert-text  col-11">
            <p className="my-0 p-3">
              {intl.formatMessage({
                id: "Fields.RegionInfoUserNewInfo",
              })}
            </p>
          </div>
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
            {...formik.getFieldProps("passwordSet.password")}
            className={clsx(
              "form-control form-control-solid mb-3 mb-lg-0",
              {
                "is-invalid":
                  formik.touched.passwordSet?.password &&
                  formik.errors.passwordSet?.password,
              },
              {
                "is-valid":
                  formik.touched.passwordSet?.password &&
                  !formik.errors.passwordSet?.password,
              }
            )}
            disabled={formik.isSubmitting}
          />
          {formik.touched.passwordSet?.password &&
            formik.errors.passwordSet?.password && (
              <div className="fv-plugins-message-container">
                <span role="alert">{formik.errors.passwordSet?.password}</span>
              </div>
            )}
        </div>
      </form>
    </>
  );
};

export { UserAddModalForm };
