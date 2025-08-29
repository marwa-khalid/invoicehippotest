import { FC } from "react";
import { useIntl } from "react-intl";
import { FormikProps } from "formik";

type Props = {
  formik: FormikProps<FormValues>;
  isSubmitting: boolean;
  setAddModalOpen: any;
};

interface FormValues {
  id: number;
  title: string;
}

const ProductGroupsAddModalFooter: FC<Props> = ({
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
        onClick={() => setAddModalOpen()}
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

export { ProductGroupsAddModalFooter };
