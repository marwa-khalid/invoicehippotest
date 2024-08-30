import enums from "../../../../../../invoicehippo.enums.json";
import { FC, useEffect, useState, useRef } from "react";
import Select from "react-select";
import { useIntl } from "react-intl";
import { FormikProps } from "formik";
import { useFormik } from "formik";
import ReactQuill from "react-quill";
import * as Yup from "yup";
import { toast } from "react-toastify";

import {
  getLedgerForClient,
  getVatForClient,
  postClientFinancial,
} from "../core/_requests";
import { handleToast } from "../../../../auth/core/_toast";
import { getVatTypesForLedger } from "../../../admin-settings/ledgeraccounts-list/core/_requests";
import clsx from "clsx";

type Props = {
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
  response: any;
};

const ClientAddStep4: FC<Props> = ({ setIsSubmitting, response }) => {
  const intl = useIntl();
  const formik = useFormik({
    initialValues: {
      financialSettings: {
        bankAccountCompanyType: 0,
        accountIbanNr: "",
        accountHolderName: "",
      },
      invoiceAndQuoteSettings: {
        defaultDeadlineDaysForPayment: 0,
        defaultVatTypeId: 0,
        defaultLedgerAccountId: 0,
        extraCcEmailAddressesInvoice: [],
        extraCcEmailAddressesQuotes: [],
        costDefaultLedgerAccountId: 0,
        costDefaultVatTypeId: 0,
        costDefaultReference: "",
        costDefaultLineReference: "",
      },
    },
    validationSchema: Yup.object().shape({
      "financialSettings.accountIbanNr": Yup.string().matches(
        /^([A-Z]{2}[0-9]{2})(?:[ ]?[0-9A-Z]{4}){3}(?:[ ]?[0-9A-Z]{1,2})?$/,
        intl
          .formatMessage({ id: "Common.InvalidFormat" })
          .replace("{0}", intl.formatMessage({ id: "Fields.AccountNrIBAN" }))
      ),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setIsSubmitting(true);
      try {
        const responseStep3 = await postClientFinancial(values, response);
        if (responseStep3.isValid) {
          formik.resetForm();
          handleToast(responseStep3);
        }
      } catch (error: any) {
        if (error.response && error.response.status === 400) {
          // Handle specific error status
          toast.error("Client ID not provided. Please complete step 1.");
        }
      } finally {
        setIsSubmitting(false);
        setSubmitting(false);
      }
    },
  });

  const data = [
    { value: 1, label: "test1" },
    { value: 2, label: "test2" },
    { value: 3, label: "test90" },
  ];
  return (
    <div className="modal-body">
      <form
        className="form p-3"
        // onSubmit={formik.handleSubmit}
        noValidate
      >
        <div className="card">
          <div className="card-header d-flex flex-column p-3 mx-3">
            <h3 className="card-title text-gray-600 fw-bold mb-0 h-0">
              {intl.formatMessage({ id: "Fields.CustomFeatures" })}
            </h3>
            <span className="mt-0 text-muted fs-7">
              {intl.formatMessage({ id: "Fields.CustomFeaturesSubTitle" })}
            </span>
          </div>
          <div className="card-body">
            <div className="row d-flex mb-5">
              {/* KvkNr Field */}
              <div className="fv-row col-6">
                <label className="   fw-bold fs-6 mb-3">test1</label>
                <input
                  type="text"
                  {...formik.getFieldProps("financialSettings.accountIbanNr")}
                  className={clsx(
                    "form-control form-control-solid",
                    {
                      "is-invalid":
                        formik.touched.financialSettings?.accountIbanNr &&
                        formik.errors.financialSettings?.accountIbanNr,
                    },
                    {
                      "is-valid":
                        formik.touched.financialSettings?.accountIbanNr &&
                        !formik.errors.financialSettings?.accountIbanNr,
                    }
                  )}
                  placeholder="test1"
                />
              </div>

              <div className="fv-row col-6">
                <label className="   fw-bold fs-6 mb-3">test2</label>
                <input
                  type="text"
                  {...formik.getFieldProps("financialSettings.accountIbanNr")}
                  className={clsx(
                    "form-control form-control-solid",
                    {
                      "is-invalid":
                        formik.touched.financialSettings?.accountIbanNr &&
                        formik.errors.financialSettings?.accountIbanNr,
                    },
                    {
                      "is-valid":
                        formik.touched.financialSettings?.accountIbanNr &&
                        !formik.errors.financialSettings?.accountIbanNr,
                    }
                  )}
                  placeholder="test2"
                />

                {formik.touched.financialSettings?.accountIbanNr &&
                  formik.errors.financialSettings?.accountIbanNr && (
                    <div className="fv-plugins-message-container ">
                      <div className="fv-help-block">
                        <span
                          dangerouslySetInnerHTML={{
                            __html:
                              formik.errors.financialSettings?.accountIbanNr,
                          }}
                          role="alert"
                        />
                      </div>
                    </div>
                  )}
              </div>
            </div>
            <div className="row d-flex mb-5">
              <label className="   fw-bold fs-6 mb-3">test90</label>
              <Select
                className="react-select-styled"
                menuPlacement="top"
                placeholder={intl.formatMessage({
                  id: "Fields.SelectOptionNvt",
                })}
                options={data}
                onChange={(selectedOption: any) => {
                  formik.setFieldValue(
                    "financialSettings.bankAccountCompanyType",
                    selectedOption ? selectedOption.value : null
                  );
                }}
                isClearable
              />
            </div>
          </div>
        </div>
      </form>
      <div className="text-end">
        <button
          type="submit"
          className="btn btn-primary "
          onClick={() => formik.handleSubmit()}
          // disabled={isSubmitting || !formik.isValid}
        >
          {intl.formatMessage({ id: "Fields.ActionSave" })}
        </button>
      </div>
    </div>
  );
};

export { ClientAddStep4 };
