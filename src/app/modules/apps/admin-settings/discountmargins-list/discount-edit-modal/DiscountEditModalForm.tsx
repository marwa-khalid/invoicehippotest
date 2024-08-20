import { FC } from "react";
import clsx from "clsx";
import { useIntl } from "react-intl";
import { FormikProps } from "formik";

interface FormValues {
  id: number;
  title: string;
  isPercentageMargin: boolean;
  amount: number;
}

type Props = {
  formik: FormikProps<FormValues>;
  isSubmitting: boolean;
};

const DiscountEditModalForm: FC<Props> = ({ formik, isSubmitting }) => {
  const intl = useIntl();

  return (
    <form
      className="form p-3"
      style={{ zIndex: "9999" }}
      onSubmit={formik.handleSubmit}
      noValidate
    >
      {/* begin::Input group */}
      <div className="row d-flex mb-7">
        {/* title Field */}
        <div className="fv-row flex-grow-1">
          <label className="required fw-bold fs-6 mb-2">
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
      </div>
      <div className="fv-row col-12 d-flex justify-content-between align-items-center mb-7">
        <label className="required fw-bold fs-6">
          {intl.formatMessage({ id: "Fields.Amount" })}
        </label>
        <div className="form-check form-switch mt-1 d-flex align-items-center">
          <label
            className="form-check-label me-20 fs-sm text-muted"
            htmlFor="isPercentageMarginSwitch"
          >
            {intl.formatMessage({ id: "Fields.IsPercentageMargin" })}
          </label>
          <input
            className="form-check-input h-30px w-50px"
            type="checkbox"
            id="isPercentageMarginSwitch"
            checked={formik.values.isPercentageMargin}
            {...formik.getFieldProps("isPercentageMargin")}
            disabled={isSubmitting}
          />
        </div>
      </div>
      <div className="col-12 input-group">
        <input
          type="number"
          {...formik.getFieldProps("amount")}
          className="form-control form-control-solid"
          disabled={isSubmitting}
          placeholder={intl.formatMessage({ id: "Fields.Amount" })}
          aria-label="Amount"
          aria-describedby="basic-addon1"
        />
        <span className="input-group-text ms-1" id="basic-addon1">
          {formik.values.isPercentageMargin ? "%" : "$"}
        </span>
      </div>

      {formik.touched.amount && formik.errors.amount && (
        <div className="fv-plugins-message-container">
          <div className="fv-help-block">
            <span
              dangerouslySetInnerHTML={{
                __html: formik.errors.amount,
              }}
              role="alert"
            />
          </div>
        </div>
      )}
    </form>
  );
};

export default DiscountEditModalForm;
