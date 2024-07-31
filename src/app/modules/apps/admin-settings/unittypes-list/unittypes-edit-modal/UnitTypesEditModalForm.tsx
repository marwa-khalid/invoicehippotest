import { FC, useEffect, useState } from "react";
import clsx from "clsx";
import { useIntl } from "react-intl";
import Select from "react-select";
import { FormikProps } from "formik";
import enums from "../../../../../../invoicehippo.enums.json";
import { getLedgerForFinancial } from "../core/_requests";
import { BalanceItem } from "../core/_models";

interface FormValues {
  id: number;
  title: string;
  isDefault: boolean;
}

type Props = {
  formik: FormikProps<FormValues>;
  isSubmitting: boolean;
  setSelectedBearingTypeOption: (option: any) => void;
  selectedBearingTypeOption: any;
  setReportReferenceType1: (type: any) => void;
  reportReferenceType1: any;
};

interface SelectorOption {
  value: number;
  label: string;
}

const UnitTypesEditModalForm: FC<Props> = ({
  formik,
  setSelectedBearingTypeOption,
  isSubmitting,
  setReportReferenceType1,
  reportReferenceType1,
}) => {
  const intl = useIntl();
  const [ledgerAccounts, setLedgerAccounts] = useState<SelectorOption[]>([]);

  useEffect(() => {
    const getLedgerAccounts = async () => {
      try {
        const response = await getLedgerForFinancial(formik.values.id);
        const options = response.result.map((item) => ({
          value: item.id,
          label: item.title,
        }));
        setLedgerAccounts(options);
      } catch (error) {
        console.error("Error fetching ledger accounts:", error);
      }
    };
    if (formik.values.id !== 0) {
      getLedgerAccounts();
    }
  }, [formik.values.id]);

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
        <div className="fv-row col-7 flex-grow-1">
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
        <div className="fv-row mb-7 col-5">
          <label className="d-block fw-bold fs-6 mb-2">
            {" "}
            {intl.formatMessage({ id: "Fields.IsDefault" })}
          </label>
          <div className="form-check form-switch mt-4">
            <input
              className="form-check-input h-30px w-50px"
              type="checkbox"
              id="isDefaultSwitch"
              checked={formik.values.isDefault}
              {...formik.getFieldProps("isDefault")}
              disabled={isSubmitting}
            />
            <label
              className="form-check-label"
              htmlFor="isDefaultSwitch"
            ></label>
          </div>
        </div>
      </div>
    </form>
  );
};

export default UnitTypesEditModalForm;
