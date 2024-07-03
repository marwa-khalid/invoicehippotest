import { FC, useEffect } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import clsx from "clsx";
import { useIntl } from "react-intl";
import Select from "react-select";
// import { VatTypeByIdResult } from "../core/_models";
import { VatTypeByIdModel } from "../core/_models";

type Props = {
  isUserLoading: boolean;
  user: VatTypeByIdModel;
  ledgerAccountDisplayName: string;
};

const UserEditModalForm: FC<Props> = ({
  isUserLoading,
  user,
  ledgerAccountDisplayName,
}) => {
  const intl = useIntl();

  const formSchema = Yup.object().shape({
    title: Yup.string()
      .min(
        3,
        intl
          .formatMessage({ id: "Common.ValidationMin" })
          .replace("{0}", intl.formatMessage({ id: "Fields.Title" }))
          .replace("{1}", `3`)
      )
      .max(
        50,
        intl
          .formatMessage({ id: "Common.ValidationMax" })
          .replace("{0}", intl.formatMessage({ id: "Fields.Title" }))
          .replace("{1}", `50`)
      )
      .required(
        intl
          .formatMessage({ id: "Common.RequiredFieldHint2" })
          .replace("{0}", intl.formatMessage({ id: "Fields.Title" }))
      ),
    value: Yup.number().required(
      intl
        .formatMessage({ id: "Common.RequiredFieldHint2" })
        .replace("{0}", intl.formatMessage({ id: "Fields.Value" }))
    ),
    documentGroup: Yup.string().required(
      intl
        .formatMessage({ id: "Common.RequiredFieldHint2" })
        .replace("{0}", intl.formatMessage({ id: "Fields.VatAreaUsageType" }))
    ),
    ledgerAccount: Yup.string().required(
      intl
        .formatMessage({ id: "Common.RequiredFieldHint2" })
        .replace("{0}", intl.formatMessage({ id: "Fields.LedgerAccount" }))
    ),
  });

  useEffect(() => {
    if (user) {
      formik.setValues({
        title: user.result.title || "",
        excludeTax: user.result.isNoneVatType || false,
        value: user.result.value || 0,
        documentGroup:
          user.result.vatAreaUsageType === 1 ? "Invoices" : "Receipts",
        ledgerAccount: ledgerAccountDisplayName,
        alwaysExclusiveOfVAT: user.result.isAlwaysExBtw || false,
        useInLists: user.result.useInLists || false,
        showOnDocuments: user.result.showOnDocuments || false,
      });
    }
  }, [user]);
  console.log(user);
  console.log(user?.result?.title);
  const formik = useFormik({
    initialValues: {
      title: user?.result?.title || "",
      excludeTax: user?.result?.isNoneVatType || false,
      value: user?.result?.value || 0,
      documentGroup:
        user?.result?.vatAreaUsageType === 1 ? "Invoices" : "Receipts",
      ledgerAccount: ledgerAccountDisplayName || "",
      alwaysExclusiveOfVAT: user?.result?.isAlwaysExBtw || false,
      useInLists: user?.result?.useInLists || false,
      showOnDocuments: user?.result?.showOnDocuments || false,
    },
    validationSchema: formSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      try {
        // Replace with your actual submit logic
        console.log(values);
      } catch (ex) {
        console.error(ex);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleSelectChange = (name: string, value: any) => {
    formik.setFieldValue(name, value.value);
  };

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
            checked={formik.values.excludeTax}
            {...formik.getFieldProps("excludeTax")}
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
            { "flex-grow-1 col-12": formik.values.excludeTax },
            { "me-3": !formik.values.excludeTax }
          )}
        >
          <label className="required fw-bold fs-6 mb-2">
            {intl.formatMessage({ id: "Fields.Title" })}
          </label>
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

        {/* Value Field */}
        {!formik.values.excludeTax && (
          <div className="fv-row flex-grow-1">
            <label className="required fw-bold fs-6 mb-2">
              {intl.formatMessage({ id: "Fields.Value" })}
            </label>
            <div className="input-group">
              <span className="input-group-text me-1">
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
                  <span
                    dangerouslySetInnerHTML={{
                      __html: formik.errors.value,
                    }}
                    role="alert"
                  />
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
        <Select
          name="documentGroup"
          value={{
            value: formik.values.documentGroup,
            label: formik.values.documentGroup,
          }}
          onChange={(option) => handleSelectChange("documentGroup", option)}
          placeholder="Select a document group"
          classNamePrefix="react-select"
          className={clsx(
            "react-select-styled border",
            {
              "is-invalid":
                formik.touched.documentGroup && formik.errors.documentGroup,
            },
            {
              "is-valid":
                formik.touched.documentGroup && !formik.errors.documentGroup,
            }
          )}
          options={[
            { value: "Invoices", label: "Invoices" },
            { value: "Receipts", label: "Receipts" },
          ]}
          isDisabled={true}
        />
        {formik.touched.documentGroup && formik.errors.documentGroup && (
          <div className="fv-plugins-message-container">
            <div className="fv-help-block">
              <span
                dangerouslySetInnerHTML={{
                  __html: formik.errors.documentGroup,
                }}
                role="alert"
              />
            </div>
          </div>
        )}
      </div>
      {/* end::Input group */}

      {/* begin::Input group */}
      {!formik.values.excludeTax && (
        <div className="fv-row mb-7">
          <label className="required fw-bold fs-6 mb-2">
            {intl.formatMessage({ id: "Fields.LedgerAccount" })}
          </label>

          <Select
            name="ledgerAccount"
            value={{
              value: formik.values.ledgerAccount,
              label: ledgerAccountDisplayName,
            }}
            onChange={(option) => handleSelectChange("ledgerAccount", option)}
            placeholder="Select a ledger account"
            classNamePrefix="react-select"
            className={clsx(
              "react-select-styled border",
              {
                "is-invalid":
                  formik.touched.ledgerAccount && formik.errors.ledgerAccount,
              },
              {
                "is-valid":
                  formik.touched.ledgerAccount && !formik.errors.ledgerAccount,
              }
            )}
            options={[
              {
                value: "100001 - account test",
                label: "100001 - account test",
              },
              {
                value: "1600 - BTW Verkoop 21%",
                label: "1600 - BTW Verkoop 21%",
              },
              {
                value: "1601 - BTW Verkoop 9%",
                label: "1601 - BTW Verkoop 9%",
              },
              {
                value: "1610 - BTW Inkoop 21%",
                label: "1610 - BTW Inkoop 21%",
              },
              {
                value: "1611 - BTW Inkoop 9%",
                label: "1611 - BTW Inkoop 9%",
              },
              {
                value: "1620 - BTW Verkoop Prive",
                label: "1620 - BTW Verkoop Prive",
              },
              {
                value: "1625 - BTW Verkoop 0%",
                label: "1625 - BTW Verkoop 0%",
              },

              { value: "1626 - BTW Inkoop 0%", label: "1626 - BTW Inkoop 0%" },
              {
                value: "1627 - BTW Verkoop Vrijgesteld",
                label: "1627 - BTW Verkoop Vrijgesteld",
              },
              {
                value: "1640 - BTW Verkoop Verlegd",
                label: "1640 - BTW Verkoop Verlegd",
              },
              {
                value: "1641 - BTW Inkoop Verlegd",
                label: "1641 - BTW Inkoop Verlegd",
              },
              {
                value: "1642 - BTW Inkoop Verlegd - Voorbelasting",
                label: "1642 - BTW Inkoop Verlegd - Voorbelasting",
              },
              {
                value: "1643 - BTW Inkoop Verlegd 9%",
                label: "1643 - BTW Inkoop Verlegd 9%",
              },
              {
                value: "1644 - BTW Inkoop Verlegd  9%- Voorbelasting",
                label: "1644 - BTW Inkoop Verlegd  9%- Voorbelasting",
              },
              {
                value: "1650 - BTW Verkoop binnen EU",
                label: "1650 - BTW Verkoop binnen EU",
              },
              {
                value: "1651 - BTW Inkoop binnen EU",
                label: "1651 - BTW Inkoop binnen EU",
              },
              {
                value: "1652 - BTW Inkoop binnen EU - Voorbelasting",
                label: "1652 - BTW Inkoop binnen EU - Voorbelasting",
              },
              {
                value: "1657 - BTW Installatie binnen EU",
                label: "1657 - BTW Installatie binnen EU",
              },
              {
                value: "1660 - BTW Verkoop buiten EU",
                label: "1660 - BTW Verkoop buiten EU",
              },
              {
                value: "1661 - BTW Inkoop buiten EU",
                label: "1661 - BTW Inkoop buiten EU",
              },
              {
                value: "1662 - BTW Inkoop buiten EU - Voorbelasting",
                label: "1662 - BTW Inkoop buiten EU - Voorbelasting",
              },
              {
                value: "1690 - BTW Afdrachten-/Teruggaven",
                label: "1690 - BTW Afdrachten-/Teruggaven",
              },
              {
                value: "1695 - BTW Suppleties",
                label: "1695 - BTW Suppleties",
              },
              {
                value: "1700 - Afdrachten Loonheffing",
                label: "1700 - Afdrachten Loonheffing",
              },
              {
                value: "1710 - Afdrachten Bedrijfsvereniging",
                label: "1710 - Afdrachten Bedrijfsvereniging",
              },
              {
                value: "1720 - Afdrachten Bedrijfsfonds",
                label: "1720 - Afdrachten Bedrijfsfonds",
              },
              {
                value: "1780 - Afdrachten Pensioen",
                label: "1780 - Afdrachten Pensioen",
              },
              {
                value: "1800 - Afdrachten Venootschapsbelasting",
                label: "1800 - Afdrachten Venootschapsbelasting",
              },
            ]}
            isDisabled={formik.isSubmitting || isUserLoading}
          />
          {formik.touched.ledgerAccount && formik.errors.ledgerAccount && (
            <div className="fv-plugins-message-container">
              <div className="fv-help-block">
                <span
                  dangerouslySetInnerHTML={{
                    __html: formik.errors.ledgerAccount,
                  }}
                  role="alert"
                />
              </div>
            </div>
          )}
        </div>
      )}
      {/* end::Input group */}

      {/* begin::Input group */}
      {!formik.values.excludeTax && (
        <div className="fv-row mb-7">
          <label className="d-block fw-bold fs-6 mb-2">
            {intl.formatMessage({ id: "Fields.IsAlwaysExBtw" })}
          </label>
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              id="alwaysExclusiveOfVATSwtich"
              {...formik.getFieldProps("alwaysExclusiveOfVAT")}
              disabled={formik.isSubmitting || isUserLoading}
            />
            <label
              className="form-check-label"
              htmlFor="alwaysExclusiveOfVATSwtich"
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
            id="useInListsSwitch"
            checked={formik.values.useInLists}
            {...formik.getFieldProps("useInLists")}
            disabled={formik.isSubmitting || isUserLoading}
          />
          <label
            className="form-check-label"
            htmlFor="useInListsSwitch"
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
      {!formik.values.excludeTax && (
        <div className="fv-row mb-7">
          <label className="d-block fw-bold fs-6 mb-2">
            {" "}
            {intl.formatMessage({ id: "Fields.ShowOnDocument" })}
          </label>
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              id="showOnDocumentsSwitch"
              checked={formik.values.showOnDocuments}
              {...formik.getFieldProps("showOnDocuments")}
              disabled={formik.isSubmitting || isUserLoading}
            />
            <label
              className="form-check-label"
              htmlFor="showOnDocumentsSwitch"
            ></label>
          </div>
        </div>
      )}
      {!formik.values.excludeTax && (
        <div className="text-muted mb-7">
          {intl.formatMessage({ id: "Fields.ShowOnDocumentInfo" })}
        </div>
      )}
    </form>
  );
};

export { UserEditModalForm };
