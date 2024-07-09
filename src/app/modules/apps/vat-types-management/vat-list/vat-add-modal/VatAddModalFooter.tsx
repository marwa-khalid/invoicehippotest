import { FC } from "react";
import { useIntl } from "react-intl";
import { FormikProps } from "formik";
import { useListView } from "../core/ListViewProvider";

type Props = {
  formik: FormikProps<FormValues>;
  isSubmitting: boolean;
};

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

const VatAddModalFooter: FC<Props> = ({ formik, isSubmitting }) => {
  const intl = useIntl();
  const { setItemIdForUpdate } = useListView();

  return (
    <div className="modal-footer flex-end">
      <button
        type="button"
        className="btn btn-light me-3"
        onClick={() => setItemIdForUpdate(undefined)}
      >
        {intl.formatMessage({ id: "Fields.ActionCancel" })}
      </button>
      <button
        type="submit"
        className="btn btn-primary"
        onClick={() => formik.handleSubmit()}
        disabled={isSubmitting}
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

export { VatAddModalFooter };
