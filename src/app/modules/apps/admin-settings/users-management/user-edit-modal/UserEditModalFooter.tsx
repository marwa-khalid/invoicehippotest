import { useIntl } from "react-intl";

import { FormikProps } from "formik";
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

interface ComponentProps {
  setEditModalOpen: (type: boolean) => void;
  formik: FormikProps<FormValues>;
  isSubmitting: boolean;
}
const UserEditModalFooter = ({
  setEditModalOpen,
  formik,
  isSubmitting,
}: ComponentProps) => {
  // For localization support
  const intl = useIntl();

  return (
    <div className="modal-footer d-flex justify-content-end align-items-center ">
      <div className="d-flex">
        {/* Cancel Button */}
        <button
          type="reset"
          onClick={() => setEditModalOpen(false)}
          className="btn btn-light me-3"
          //   disabled={isSubmitting}
        >
          {intl.formatMessage({ id: "Fields.ActionClose" })}
        </button>

        {/* Save Button */}
        <button
          type="submit"
          className="btn btn-primary"
          onClick={() => formik.handleSubmit()}
          disabled={isSubmitting || !formik.isValid}
        >
          {!isSubmitting && intl.formatMessage({ id: "Fields.ActionSave" })}
          {isSubmitting && (
            <span className="indicator-progress" style={{ display: "block" }}>
              {intl.formatMessage({ id: "Common.Busy" })}
              <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export { UserEditModalFooter };
