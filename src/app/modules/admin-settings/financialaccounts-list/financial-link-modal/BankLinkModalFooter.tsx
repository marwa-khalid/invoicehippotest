import { FC } from "react";
import { useIntl } from "react-intl";
import { FormikProps } from "formik";

type Props = {
  formik: FormikProps<FormValues>;
  isSubmitting: boolean;
  setAddModalOpen: (type: boolean) => void;
};

interface FormValues {
  companyId: number;
  importDateMarker: string;
  optionalFinancialInstitutionId: string;
  redirectCommand: {
    successUrl: string;
    oopsUrl: string;
  };
}

const BankLinkModalFooter: FC<Props> = ({
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
        {intl.formatMessage({ id: "Fields.ActionClose" })}
      </button>
      <button
        type="submit"
        className="btn btn-primary"
        onClick={() => formik.handleSubmit()}
        disabled={!formik.isValid || isSubmitting}
      >
        {!isSubmitting &&
          intl.formatMessage({ id: "Fields.ActionLinkFinancialAccounts" })}
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
  );
};

export { BankLinkModalFooter };
