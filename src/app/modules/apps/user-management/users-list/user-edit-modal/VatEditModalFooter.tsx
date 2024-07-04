import { FC } from "react";
import { useIntl } from "react-intl";
import { useFormikContext } from "formik";
import { useListView } from "../core/ListViewProvider";
import { FormikProps } from "formik";

interface FormValues {
  id: number;
  title: string;
  value: number;
  documentGroup: string;
  ledgerAccountId: number;
  isNoneVatType: boolean;
  alwaysExclusiveOfVAT: boolean;
  showInLists: boolean;
  showOnDocuments: boolean;
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

  //   // Accessing Formik's context
  //   const { submitForm, isSubmitting, isValid, touched, resetForm } =
  //     useFormikContext<any>();

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
          {intl.formatMessage({ id: "Fields.ActionCancel" })}
        </button>

        {/* Save Button */}
        <button
          type="submit"
          className="btn btn-primary"
          onClick={() => formik.handleSubmit()}
          disabled={isSubmitting}
          //   onClick={submitForm}
          //   disabled={!formik.isValid || isSubmitting || !touched}
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
