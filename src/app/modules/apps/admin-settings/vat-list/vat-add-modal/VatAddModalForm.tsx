import { FC, useEffect, useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import clsx from "clsx";
import { useIntl } from "react-intl";
import Select from "react-select";
import { postVatType, getLedgerAccount } from "../core/_requests";
import { LedgerForVatResult } from "../core/_models";
import { FormikProps } from "formik";
import { VatTypesResult } from "../core/_models";
import enums from "../../../../../../invoicehippo.enums.json";

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

type Props = {
  isUserLoading: boolean;
  user: any; // Adjust the type according to your user model
  formik: FormikProps<FormValues>;
  isSubmitting: boolean;
  ledgerAccounts: { value: number; label: string }[];
};

type VatAreaUsageTypeOption = {
  value: number;
  label: string;
};

const VatAddModalForm: FC<Props> = ({
  isUserLoading,
  user,
  formik,
  isSubmitting,
  ledgerAccounts,
}) => {
  const intl = useIntl();

  return (
    <form
      id="kt_modal_add_user_form"
      className="form p-2"
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
            {...formik.getFieldProps("isNoneVatType")}
            disabled={isSubmitting || isUserLoading}
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
            { "flex-grow-1 col-12": formik.values.isNoneVatType },
            { "me-3": !formik.values.isNoneVatType }
          )}
        >
          <label className="required fw-bold fs-6 mb-2">
            {" "}
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
            disabled={isSubmitting || isUserLoading}
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
        {!formik.values.isNoneVatType && (
          <div className="fv-row flex-grow-1">
            <label className="required fw-bold fs-6 mb-2">
              {" "}
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
                disabled={isSubmitting || isUserLoading}
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
          // value={formik.values.documentGroup}
          onChange={(option: VatAreaUsageTypeOption | null) =>
            formik.setFieldValue("documentGroup", option?.value)
          }
          onBlur={() => formik.setFieldTouched("documentGroup", true)}
          placeholder={intl.formatMessage({
            id: "Fields.SelectOptionDefaultVatAreaUsageType",
          })}
          className={clsx(
            "react-select-styled",
            {
              "is-invalid":
                formik.touched.documentGroup && formik.errors.documentGroup,
            },
            {
              "is-valid":
                formik.touched.documentGroup && !formik.errors.documentGroup,
            }
          )}
          classNames={{
            control: () => "border-secondary",
          }}
          // Directly map the JSON data to the options prop
          options={enums.VatAreaUsageTypes.map((item) => ({
            value: item.Value,
            label: item.Title,
          }))}
          isClearable
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

      {!formik.values.isNoneVatType && (
        <div className="fv-row mb-7">
          <label className="required fw-bold fs-6 mb-2">
            {intl.formatMessage({ id: "Fields.LedgerAccount" })}
          </label>

          <Select
            name="ledgerAccount"
            placeholder={intl.formatMessage({
              id: "Fields.SelectOptionDefaultLedgerAccountBearingType",
            })}
            value={
              ledgerAccounts?.find(
                (option: any) => option.value === formik.values.ledgerAccountId
              ) || null
            }
            // value={
            //   formik.values.ledgerAccountId
            //     ? {
            //         value: formik.values.ledgerAccountId,
            //         label: formik.values.ledgerAccountId,
            //       }
            //     : null
            // }
            onChange={(option: { value: number; label: string } | null) => {
              formik.setFieldValue("ledgerAccountId", option?.value || "");
            }}
            // onChange={(option: OptionType | null) => {
            //   formik.setFieldValue("ledgerAccount", option?.value || "");
            // }}
            onBlur={() => formik.setFieldTouched("ledgerAccountId", true)}
            // classNamePrefix="react-select-styled"
            classNames={{
              control: () => "border-secondary",
            }}
            className={clsx(
              "react-select-styled",
              {
                "is-invalid":
                  formik.touched.ledgerAccountId &&
                  formik.errors.ledgerAccountId,
              },
              {
                "is-valid":
                  formik.touched.ledgerAccountId &&
                  !formik.errors.ledgerAccountId,
              }
            )}
            options={ledgerAccounts}
            isClearable
          />

          {formik.touched.ledgerAccountId && formik.errors.ledgerAccountId && (
            <div className="fv-plugins-message-container">
              <div className="fv-help-block">
                <span
                  dangerouslySetInnerHTML={{
                    __html: formik.errors.ledgerAccountId,
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
      {/* {!formik.values.isNoneVatType && (
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
              disabled={isSubmitting || isUserLoading}
            />
            <label
              className="form-check-label"
              htmlFor="alwaysExclusiveOfVATSwtich"
            ></label>
          </div>
        </div>
      )} */}
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
            disabled={isSubmitting || isUserLoading}
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
      {!formik.values.isNoneVatType && (
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
              {...formik.getFieldProps("showOnDocuments")}
              disabled={isSubmitting || isUserLoading}
            />
            <label
              className="form-check-label"
              htmlFor="showOnDocumentsSwitch"
            ></label>
          </div>
        </div>
      )}
      {/* end::Input group */}

      {/* begin::Description */}
      {!formik.values.isNoneVatType && (
        <div className="text-muted mb-7">
          {intl.formatMessage({ id: "Fields.ShowOnDocumentInfo" })}
        </div>
      )}
      {/* end::Description */}
    </form>
  );
};

export { VatAddModalForm };
