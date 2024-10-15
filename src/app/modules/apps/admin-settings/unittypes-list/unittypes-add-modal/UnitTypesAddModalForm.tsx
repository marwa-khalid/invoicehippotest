import { FC } from "react";
import clsx from "clsx";
import { useIntl } from "react-intl";
import { FormikProps } from "formik";

interface FormValues {
  id: number;
  title: string;
  isDefault: boolean;
}

type Props = {
  formik: FormikProps<FormValues>;
  isSubmitting: boolean;
};

const UnitTypesAddModalForm: FC<Props> = ({ formik, isSubmitting }) => {
  const intl = useIntl();

  return (
    <form className="form p-3 " onSubmit={formik.handleSubmit} noValidate>
      {/* begin::Input group */}
      <div className="fv-row col-12 d-flex justify-content-between align-items-center mb-7">
        <label className="required fw-bold fs-6">
          {intl.formatMessage({ id: "Fields.Title" })}
        </label>
        <div className="form-check form-switch mt-1 d-flex align-items-center">
          <label
            className="form-check-label me-20 fs-sm text-muted"
            htmlFor="isDefaultSwitch"
          >
            {intl.formatMessage({ id: "Fields.IsDefault" })}
          </label>
          <input
            className="form-check-input h-20px w-40px"
            type="checkbox"
            id="isDefaultSwitch"
            {...formik.getFieldProps("isDefault")}
            disabled={isSubmitting}
          />
        </div>
      </div>
      <div className="row">
        <input
          type="text"
          {...formik.getFieldProps("title")}
          className={clsx(
            "form-control form-control-solid",
            { "is-invalid": formik.touched.title && formik.errors.title },
            { "is-valid": formik.touched.title && !formik.errors.title }
          )}
          disabled={isSubmitting}
          placeholder={intl.formatMessage({ id: "Fields.Title" })}
        />

        {formik.touched.title && formik.errors.title && (
          <div className="fv-plugins-message-container">
            <div className="fv-help-block">
              <span
                dangerouslySetInnerHTML={{
                  __html: formik.errors.title,
                }}
                role="alert"
              />
            </div>
          </div>
        )}
      </div>
    </form>
  );
};

export { UnitTypesAddModalForm };
