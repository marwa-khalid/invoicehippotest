import { FC, useState } from "react";
import { useIntl } from "react-intl";
import { KTIcon } from "../../../../../../_metronic/helpers";
import Tippy from "@tippyjs/react";
import ReactQuill from "react-quill";
import clsx from "clsx";
import { FormikProps } from "formik";
import { FormValues } from "./QuoteValidateStep1";

type Props = { formik: FormikProps<FormValues> };

const QuoteValidateStep3 = ({ formik }: Props) => {
  const intl = useIntl();

  return (
    <div className="modal-body py-10 px-20 ">
      <h2 className="fw-bolder d-flex align-items-center mb-7">
        {intl.formatMessage({
          id: "Fields.SigningPersonalDetail",
        })}
      </h2>
      <div className="row pb-lg-10">
        <div className="fv-row col-6">
          <label className="required fw-bold fs-6 mb-3">
            {intl.formatMessage({ id: "Fields.FullName" })}
          </label>
          <input
            type="text"
            {...formik.getFieldProps(
              "quoteValidationSignee.validatedByFullName"
            )}
            className={clsx(
              "form-control form-control-white",
              {
                "is-invalid":
                  formik.touched.quoteValidationSignee?.validatedByFullName &&
                  formik.errors.quoteValidationSignee?.validatedByFullName,
              },
              {
                "is-valid":
                  formik.touched.quoteValidationSignee?.validatedByFullName &&
                  !formik.errors.quoteValidationSignee?.validatedByFullName,
              }
            )}
            placeholder={intl.formatMessage({
              id: "Fields.FullName",
            })}
          />
          {formik.touched.quoteValidationSignee?.validatedByFullName &&
            formik.errors.quoteValidationSignee?.validatedByFullName && (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  <span
                    dangerouslySetInnerHTML={{
                      __html:
                        formik.errors.quoteValidationSignee
                          ?.validatedByFullName,
                    }}
                    role="alert"
                  />
                </div>
              </div>
            )}
        </div>

        <div className="fv-row col-6">
          <label className="required fw-bold fs-6 mb-3">
            {intl.formatMessage({ id: "Fields.EmailAddress" })}
          </label>
          <input
            type="text"
            {...formik.getFieldProps(
              "quoteValidationSignee.validatedByEmailAddress"
            )}
            className={clsx(
              "form-control form-control-white",
              {
                "is-invalid":
                  formik.touched.quoteValidationSignee
                    ?.validatedByEmailAddress &&
                  formik.errors.quoteValidationSignee?.validatedByEmailAddress,
              },
              {
                "is-valid":
                  formik.touched.quoteValidationSignee
                    ?.validatedByEmailAddress &&
                  !formik.errors.quoteValidationSignee?.validatedByEmailAddress,
              }
            )}
            placeholder={intl.formatMessage({
              id: "Fields.EmailAddress",
            })}
          />
          {formik.touched.quoteValidationSignee?.validatedByEmailAddress &&
            formik.errors.quoteValidationSignee?.validatedByEmailAddress && (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  <span
                    dangerouslySetInnerHTML={{
                      __html:
                        formik.errors.quoteValidationSignee
                          ?.validatedByEmailAddress,
                    }}
                    role="alert"
                  />
                </div>
              </div>
            )}
        </div>
      </div>
      <div className="row">
        <div className="fv-row">
          <label className="required fw-bold fs-6 mb-3">
            {intl.formatMessage({ id: "Fields.Location" })}-/
            {intl.formatMessage({ id: "Fields.City" })}
          </label>
          <input
            type="text"
            {...formik.getFieldProps("quoteValidationSignee.validatedByCity")}
            className={clsx(
              "form-control form-control-white",
              {
                "is-invalid":
                  formik.touched.quoteValidationSignee?.validatedByCity &&
                  formik.errors.quoteValidationSignee?.validatedByCity,
              },
              {
                "is-valid":
                  formik.touched.quoteValidationSignee?.validatedByCity &&
                  !formik.errors.quoteValidationSignee?.validatedByCity,
              }
            )}
            placeholder={`${intl.formatMessage({
              id: "Fields.Location",
            })}-/${intl.formatMessage({ id: "Fields.City" })}`}
          />
          {formik.touched.quoteValidationSignee?.validatedByCity &&
            formik.errors.quoteValidationSignee?.validatedByCity && (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">
                  <span
                    dangerouslySetInnerHTML={{
                      __html:
                        formik.errors.quoteValidationSignee?.validatedByCity,
                    }}
                    role="alert"
                  />
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export { QuoteValidateStep3 };
