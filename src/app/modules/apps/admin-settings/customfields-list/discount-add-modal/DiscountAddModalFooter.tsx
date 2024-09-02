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
  uniqueId: string;
  areaUsageType: number;
  title: string;
  customData: string;
  usageInfo: string;
  fieldType: number;
  editOptions: {
    isActivlyUsed: boolean;
  };
  groupDisplayName: string;
  defaultValue: string;
  includeOnInvoiceType: number;
  includeOnQuoteType: number;
  includeOnDocumentDisplayName: string;
}

const DiscountAddModalFooter: FC<Props> = ({
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

export { DiscountAddModalFooter };
