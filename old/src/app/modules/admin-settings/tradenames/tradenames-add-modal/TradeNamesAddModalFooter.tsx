import { FC } from "react";
import { useIntl } from "react-intl";
import { FormikProps } from "formik";
import { TradeNamesPostResult } from "../../my-company/core/_models";

type Props = {
  formik: FormikProps<TradeNamesPostResult | any>;
  isSubmitting: boolean;
  setAddModalOpen: (type: boolean) => void;
};

const TradeNamesAddModalFooter: FC<Props> = ({
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

export { TradeNamesAddModalFooter };
