import { useEffect, useState } from "react";
import { UserEditModalHeader } from "./UserEditModalHeader";
import { UserEditModalFooter } from "./UserEditModalFooter";
import { getUserById, postUser } from "../core/_requests";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useIntl } from "react-intl";
import { UserEditModalForm } from "./UserEditModalForm";
import { handleToast } from "../../../auth/core/_toast";
import { useAuth } from "../../../auth";
import { getProfileInfo } from "../../../auth/core/_requests";
interface Props {
  setRefresh: (type: boolean) => void;
  setEditModalOpen: (type: boolean) => void;
  editModalId: number;
  refresh: boolean;
}
const UserEditModal = ({
  setRefresh,
  setEditModalOpen,
  editModalId,
  refresh,
}: Props) => {
  useEffect(() => {
    document.body.classList.add("modal-open");
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, []);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const intl = useIntl();
  const auth = useAuth();

  const formik = useFormik({
    initialValues: {
      id: 0,
      genderType: 0,
      userType: 0,
      firstName: "",
      languageType: 0,
      betweenName: "",
      lastName: "",
      loginEmailAddress: "",
      isActive: false,
      accessibleCompanies: [
        {
          isDefault: false,
          companyId: 0,
        },
      ],
      passwordSet: {
        password: "",
        passwordVerification: "",
      },
      requestingUserProfileId: 0,
      requestingUserPassword: "",
      sendInvitationForNewUser: true,
      generatePasswordForNewUser: true,
      accountantBeconNumber: "",
      accountantNotificationEmailAddress: "",
    },
    validationSchema: Yup.object().shape({
      firstName: Yup.string().required(
        intl
          .formatMessage({ id: "Common.RequiredFieldHint2" })
          .replace("{0}", intl.formatMessage({ id: "Fields.FirstName" }))
      ),
      lastName: Yup.string().required(
        intl
          .formatMessage({ id: "Common.RequiredFieldHint2" })
          .replace("{0}", intl.formatMessage({ id: "Fields.LastName" }))
      ),
      loginEmailAddress: Yup.string().required(
        intl
          .formatMessage({ id: "Common.RequiredFieldHint2" })
          .replace(
            "{0}",
            intl.formatMessage({ id: "Fields.LoginEmailAddress" })
          )
      ),
      requestingUserPassword: Yup.string().required(
        intl
          .formatMessage({ id: "Common.RequiredFieldHint2" })
          .replace("{0}", intl.formatMessage({ id: "Fields.Password" }))
      ),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setIsSubmitting(true);
      try {
        const response = await postUser(
          values.id,
          values.genderType,
          values.userType,
          values.firstName,
          values.languageType,
          values.betweenName,
          values.lastName,
          values.loginEmailAddress,
          values.isActive,
          values.accessibleCompanies,
          values.passwordSet,
          values.requestingUserProfileId,
          values.requestingUserPassword,
          values.sendInvitationForNewUser,
          values.generatePasswordForNewUser,
          values.accountantBeconNumber,
          values.accountantNotificationEmailAddress
        );

        if (response.isValid) {
          formik.resetForm();
          setEditModalOpen(false);
          setRefresh(!refresh);
          if (response.result.id === auth.currentUser?.result.id) {
            const data = await getProfileInfo();
            if (data) {
              auth.setCurrentUser(data);
            }
          }
        }

        handleToast(response);
      } catch (error) {
        console.error("Put failed:", error);
      } finally {
        setIsSubmitting(false);
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const response = await getUserById(editModalId);

        formik.setValues({
          id: response.result.id,
          genderType: response.result.genderType,
          userType: response.result.userType,
          firstName: response.result.firstName,
          languageType: response.result.languageType,
          betweenName: response.result.betweenName,
          lastName: response.result.lastName,
          loginEmailAddress: response.result.loginEmailAddress,
          isActive: response.result.isActive,
          accessibleCompanies: response.result.accessibleCompanies,
          passwordSet: response.result.passwordSet,
          requestingUserProfileId:
            auth.currentUser?.result.id ||
            response.result.requestingUserProfileId,
          requestingUserPassword: response.result.requestingUserPassword,
          sendInvitationForNewUser: response.result.sendInvitationForNewUser,
          generatePasswordForNewUser:
            response.result.generatePasswordForNewUser,
          accountantBeconNumber: response.result.accountantBeconNumber,
          accountantNotificationEmailAddress:
            response.result.accountantNotificationEmailAddress,
        });
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    fetchInitialData();
  }, [editModalId]);

  return (
    <>
      <div
        className="modal fade show d-block"
        tabIndex={-1}
        role="dialog"
        id="kt_modal_1"
        aria-modal="true"
      >
        <div className="modal-dialog mw-800px">
          <div className="modal-content">
            <UserEditModalHeader setEditModalOpen={setEditModalOpen} />
            <div className="modal-body p-10">
              <UserEditModalForm formik={formik} isSubmitting={isSubmitting} />
            </div>
            <UserEditModalFooter
              formik={formik}
              isSubmitting={isSubmitting}
              setEditModalOpen={setEditModalOpen}
            />
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  );
};

export { UserEditModal };
