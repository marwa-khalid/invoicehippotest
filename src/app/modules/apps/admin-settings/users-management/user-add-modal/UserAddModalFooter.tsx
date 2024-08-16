import { FC } from "react";
import { useIntl } from "react-intl";
import { FormikProps } from "formik";

type Props = {
  formik: FormikProps<FormValues>;
  isSubmitting: boolean;
  setAddModalOpen: (type: boolean) => void;
};

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

const UserAddModalFooter: FC<Props> = ({
  formik,
  isSubmitting,
  setAddModalOpen,
}) => {
  const intl = useIntl();

  return (
    <div className="modal-footer flex-end">
      <button
        type="button"
        className="btn btn-light me-3"
        onClick={() => setAddModalOpen(false)}
      >
        {intl.formatMessage({ id: "Fields.ActionCancel" })}
      </button>
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
  );
};

export { UserAddModalFooter };
