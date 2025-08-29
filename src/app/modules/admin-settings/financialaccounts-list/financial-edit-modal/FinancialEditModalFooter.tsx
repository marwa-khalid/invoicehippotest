import { useIntl } from "react-intl";

import { FormikProps } from "formik";

interface FormValues {
  id: number;
  accountName: string;
  accountNumber: string;
  ledgerAccountId: number;
  bankConnectMinImportDate: string;
  accountType: number;
  autoCreateLedgerAccount: boolean;
  bankAccountCompanyType: number;
  afterSaveModel: {
    ledgerAccountDisplayName: string;
  };
  bankConnectInfo: {
    isConnected: boolean;
    isActive: boolean;
    accessExpirtationDate: string;
    lastSyncRequestDate: string;
  };
}
interface ComponentProps {
  setEditModalOpen: (type: boolean) => void;
  formik: FormikProps<FormValues>;
  isSubmitting: boolean;
}
const FinancialEditModalFooter = ({
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
  );
};

export { FinancialEditModalFooter };
