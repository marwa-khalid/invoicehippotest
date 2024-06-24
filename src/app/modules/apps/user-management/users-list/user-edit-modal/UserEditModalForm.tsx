import { FC } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import clsx from "clsx";
import { useIntl } from "react-intl";

type Props = {
  isUserLoading: boolean;
  user: any; // Adjust the type according to your user model
};

const formSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  value: Yup.string().required("Value is required"),
  documentGroup: Yup.string().required("Document Group is required"),
  ledgerAccount: Yup.string().required("Ledger Account is required"),
});

const UserEditModalForm: FC<Props> = ({ isUserLoading, user }) => {
  const intl = useIntl();
  const formik = useFormik({
    initialValues: {
      title: "",
      value: "",
      documentGroup: "",
      ledgerAccount: "",
      exclusiveOfVAT: false,
      showInLists: false,
      showTax: false,
    },
    validationSchema: formSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      try {
        // Here, replace the console.log with your actual submit logic
        console.log(values);
      } catch (ex) {
        console.error(ex);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <form
      id="kt_modal_add_user_form"
      className="form"
      onSubmit={formik.handleSubmit}
      noValidate
    >
      {/* begin::Input group */}
      <div className="fv-row mb-7">
        <label className="d-block fw-bold fs-6 mb-2">
          {intl.formatMessage({ id: "Fields.IsNoneVatType" })}
        </label>
        <div className="form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            id="vatSwitch"
            {...formik.getFieldProps("exclusiveOfVAT")}
            disabled={formik.isSubmitting || isUserLoading}
          />
          <label className="form-check-label" htmlFor="vatSwitch"></label>
        </div>
      </div>
      {/* end::Input group */}

      {/* begin::Description */}
      <div className="text-muted mb-7">
        {intl.formatMessage({ id: "Fields.IsNoneVatTypeInfo" })}
      </div>
      {/* end::Description */}

      {/* begin::Input group */}
      <div className="d-flex mb-7">
        {/* Title Field */}
        <div
          className={clsx(
            "fv-row flex-grow-1",
            { "flex-grow-1 col-12": formik.values.exclusiveOfVAT },
            { "me-3": !formik.values.exclusiveOfVAT }
          )}
        >
          <label className="required fw-bold fs-6 mb-2">Title</label>
          <input
            type="text"
            {...formik.getFieldProps("title")}
            className={clsx(
              "form-control form-control-solid",
              { "is-invalid": formik.touched.title && formik.errors.title },
              { "is-valid": formik.touched.title && !formik.errors.title }
            )}
            disabled={formik.isSubmitting || isUserLoading}
          />
          {formik.touched.title && formik.errors.title && (
            <div className="fv-plugins-message-container">
              <div className="fv-help-block">
                <span role="alert">{formik.errors.title}</span>
              </div>
            </div>
          )}
        </div>

        {/* Value Field */}
        {!formik.values.exclusiveOfVAT && (
          <div className="fv-row flex-grow-1">
            <label className="required fw-bold fs-6 mb-2">Value</label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="fa fa-percent"></i>
              </span>
              <input
                type="number"
                {...formik.getFieldProps("value")}
                className={clsx(
                  "form-control form-control-solid",
                  { "is-invalid": formik.touched.value && formik.errors.value },
                  { "is-valid": formik.touched.value && !formik.errors.value }
                )}
                disabled={formik.isSubmitting || isUserLoading}
              />
            </div>
            {formik.touched.value && formik.errors.value && (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  <span role="alert">{formik.errors.value}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* begin::Input group */}
      <div className="fv-row mb-7">
        <label className="required fw-bold fs-6 mb-2">
          {intl.formatMessage({ id: "Fields.VatAreaUsageType" })}
        </label>
        <select
          {...formik.getFieldProps("documentGroup")}
          className={clsx(
            "form-control form-control-solid",
            {
              "is-invalid":
                formik.touched.documentGroup && formik.errors.documentGroup,
            },
            {
              "is-valid":
                formik.touched.documentGroup && !formik.errors.documentGroup,
            }
          )}
          disabled={formik.isSubmitting || isUserLoading}
        >
          <option value="">Select a group</option>
          {/* Add your document group options here */}
          <option value="Group1">Group 1</option>
          <option value="Group2">Group 2</option>
        </select>
        {formik.touched.documentGroup && formik.errors.documentGroup && (
          <div className="fv-plugins-message-container">
            <span role="alert">{formik.errors.documentGroup}</span>
          </div>
        )}
      </div>
      {/* end::Input group */}

      {/* begin::Input group */}

      {!formik.values.exclusiveOfVAT && (
        <div className="fv-row mb-7">
          <label className="required fw-bold fs-6 mb-2">
            {intl.formatMessage({ id: "Fields.LedgerAccount" })}
          </label>
          <select
            {...formik.getFieldProps("ledgerAccount")}
            className={clsx(
              "form-control form-control-solid",
              {
                "is-invalid":
                  formik.touched.ledgerAccount && formik.errors.ledgerAccount,
              },
              {
                "is-valid":
                  formik.touched.ledgerAccount && !formik.errors.ledgerAccount,
              }
            )}
            disabled={formik.isSubmitting || isUserLoading}
          >
            <option value="">Select an account</option>
            {/* Add your ledger account options here */}
            <option value="Account1">Account 1</option>
            <option value="Account2">Account 2</option>
          </select>
          {formik.touched.ledgerAccount && formik.errors.ledgerAccount && (
            <div className="fv-plugins-message-container">
              <span role="alert">{formik.errors.ledgerAccount}</span>
            </div>
          )}
        </div>
      )}
      {/* end::Input group */}

      {/* begin::Input group */}
      {!formik.values.exclusiveOfVAT && (
        <div className="fv-row mb-7">
          <label className="d-block fw-bold fs-6 mb-2">
            {intl.formatMessage({ id: "Fields.IsAlwaysExBtw" })}
          </label>
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              id="exclusiveOfVATSwtich"
              {...formik.getFieldProps("exclusiveOfVAT")}
              disabled={formik.isSubmitting || isUserLoading}
            />
            <label
              className="form-check-label"
              htmlFor="exclusiveOfVATSwtich"
            ></label>
          </div>
        </div>
      )}
      {/* end::Input group */}

      {/* begin::Input group */}
      <div className="fv-row mb-7">
        <label className="d-block fw-bold fs-6 mb-2">
          {" "}
          {intl.formatMessage({ id: "Fields.UseInLists" })}
        </label>
        <div className="form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            id="showInListsSwitch"
            {...formik.getFieldProps("showInLists")}
            disabled={formik.isSubmitting || isUserLoading}
          />
          <label
            className="form-check-label"
            htmlFor="showInListsSwitch"
          ></label>
        </div>
      </div>
      {/* end::Input group */}

      {/* begin::Description */}
      <div className="text-muted mb-7">
        {intl.formatMessage({ id: "Fields.UseInListsInfo" })}
      </div>
      {/* end::Description */}

      {/* begin::Input group */}
      {!formik.values.exclusiveOfVAT && (
        <div className="fv-row mb-7">
          <label className="d-block fw-bold fs-6 mb-2">
            {" "}
            {intl.formatMessage({ id: "Fields.ShowOnDocument" })}
          </label>
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              id="showTaxSwitch"
              {...formik.getFieldProps("showTax")}
              disabled={formik.isSubmitting || isUserLoading}
            />
            <label className="form-check-label" htmlFor="showTaxSwitch"></label>
          </div>
        </div>
      )}
      {/* end::Input group */}

      {/* begin::Description */}
      {!formik.values.exclusiveOfVAT && (
        <div className="text-muted mb-7">
          {intl.formatMessage({ id: "Fields.ShowOnDocumentInfo" })}
        </div>
      )}
      {/* end::Description */}

      {/* begin::Actions */}
      <div className="text-end">
        <button
          type="reset"
          onClick={() => formik.resetForm()}
          className="btn btn-light me-3"
          disabled={formik.isSubmitting || isUserLoading}
        >
          {intl.formatMessage({ id: "Fields.ActionCancel" })}
        </button>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={
            isUserLoading ||
            formik.isSubmitting ||
            !formik.isValid ||
            !formik.touched
          }
        >
          <span className="indicator-label">
            {intl.formatMessage({ id: "Fields.ActionSave" })}
          </span>
          {(formik.isSubmitting || isUserLoading) && (
            <span className="indicator-progress">
              {intl.formatMessage({ id: "Common.Busy" })}...{" "}
              <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
            </span>
          )}
        </button>
      </div>
      {/* end::Actions */}
    </form>
  );
};

export { UserEditModalForm };
