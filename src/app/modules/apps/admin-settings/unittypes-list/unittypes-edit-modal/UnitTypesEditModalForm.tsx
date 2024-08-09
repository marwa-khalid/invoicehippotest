import { FC, useEffect, useState } from "react";
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

const UnitTypesEditModalForm: FC<Props> = ({ formik, isSubmitting }) => {
  const intl = useIntl();

  return (
    <form className="form p-3" onSubmit={formik.handleSubmit} noValidate>
      {/* begin::Input group */}
      <div className="row d-flex mb-7">
        <label className="required fw-bold fs-6 mb-2">
          {" "}
          {intl.formatMessage({ id: "Fields.Title" })}
        </label>
        <input
          type="text"
          {...formik.getFieldProps("title")}
          className={clsx(
            "form-control form-control-solid",
            {
              "is-invalid": formik.touched.title && formik.errors.title,
            },
            {
              "is-valid": formik.touched.title && !formik.errors.title,
            }
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
      <div className="row ">
        {/* title Field */}

        <div className="form-check form-switch mt-4">
          <input
            className="form-check-input h-25px w-45px"
            type="checkbox"
            id="isDefaultSwitch"
            checked={formik.values.isDefault}
            {...formik.getFieldProps("isDefault")}
            disabled={isSubmitting}
          />
          <label
            className="form-check-label ms-4  fw-bold fs-6 text-dark"
            htmlFor="isDefaultSwitch"
          >
            {intl.formatMessage({ id: "Fields.IsDefault" })}
          </label>
        </div>
      </div>
    </form>
  );
};

export default UnitTypesEditModalForm;
