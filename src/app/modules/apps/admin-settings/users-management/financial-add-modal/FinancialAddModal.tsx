import { useEffect, useState } from "react";
import { FinancialAddModalHeader } from "./FinancialAddModalHeader";
import { FinancialAddModalFooter } from "./FinancialAddModalFooter";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useIntl } from "react-intl";
import { postUser } from "../core/_requests";
import { UserAddModalForm } from "./UserAddModalForm";
import { handleToast } from "../../../../auth/core/_toast";
interface Props {
  setRefresh: (type: boolean) => void;
  setAddModalOpen: (type: boolean) => void;
}
const FinancialAddModal = ({ setRefresh, setAddModalOpen }: Props) => {
  useEffect(() => {
    document.body.classList.add("modal-open");
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, []);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const intl = useIntl();

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
      requestingUserProfileIda: 0,
      requestingUserPassword: "",
      sendInvitationForNewUser: true,
      generatePasswordForNewUser: true,
      accountantBeconNumber: "",
      accountantNotificationEmailAddress: "",
    },
    validationSchema: Yup.object().shape({
      accountType: Yup.number().required(
        intl
          .formatMessage({ id: "Common.RequiredFieldHint2" })
          .replace("{0}", intl.formatMessage({ id: "Fields.AccountType" }))
      ),
      accountName: Yup.string()
        .min(
          3,
          intl
            .formatMessage({ id: "Common.ValidationMin" })
            .replace("{0}", intl.formatMessage({ id: "Fields.AccountName" }))
            .replace("{1}", `3`)
        )
        .max(
          50,
          intl
            .formatMessage({ id: "Common.ValidationMax" })
            .replace("{0}", intl.formatMessage({ id: "Fields.AccountName" }))
            .replace("{1}", `50`)
        )
        .required(
          intl
            .formatMessage({ id: "Common.RequiredFieldHint2" })
            .replace("{0}", intl.formatMessage({ id: "Fields.AccountName" }))
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
          values.requestingUserProfileIda,
          values.requestingUserPassword,
          values.sendInvitationForNewUser,
          values.generatePasswordForNewUser,
          values.accountantBeconNumber,
          values.accountantNotificationEmailAddress
        );

        if (response.isValid) {
          formik.resetForm();
          setAddModalOpen(false);
          setRefresh(true);
        }
        handleToast(response);
      } catch (error) {
        console.error("Post failed:", error);
      } finally {
        setIsSubmitting(false);
        setSubmitting(false);
      }
    },
  });

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
            <FinancialAddModalHeader setAddModalOpen={setAddModalOpen} />
            <div className="modal-body px-20 py-10">
              <UserAddModalForm formik={formik} isSubmitting={isSubmitting} />
            </div>
            <FinancialAddModalFooter
              formik={formik}
              isSubmitting={isSubmitting}
              setAddModalOpen={setAddModalOpen}
            />
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  );
};

export { FinancialAddModal };
