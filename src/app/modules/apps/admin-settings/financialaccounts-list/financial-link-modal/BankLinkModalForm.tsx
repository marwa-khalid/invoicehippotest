import { FC, useEffect, useState } from "react";
import clsx from "clsx";
import { useIntl } from "react-intl";
import Select from "react-select";
import { FormikProps } from "formik";
import enums from "../../../../../../invoicehippo.enums.json";
import {
  getFinancialInstitutions,
  getLedgerForFinancial,
} from "../core/_requests";
import {
  FinancialAccountsModel,
  FinancialAccountsResult,
  FinancialInstitutionsResult,
} from "../core/_models";

interface FormValues {
  id: number;
  accountName: string;
  accountNumber: string;
  ledgerAccountId: number;
  bankConnectMinImportDate: any;
  accountType: number;
  autoCreateLedgerAccount: boolean;
  bankAccountCompanyType: number;
  afterSaveModel: {
    ledgerAccountDisplayName: string;
  };
  bankConnectInfo: {
    isConnected: boolean;
    isActive: boolean;
    accessExpirtationDate: any;
    lastSyncRequestDate: any;
  };
}

type Props = {
  formik: FormikProps<FormValues>;
  isSubmitting: boolean;
};

const BankLinkModalForm: FC<Props> = ({ formik, isSubmitting }) => {
  const intl = useIntl();
  const [financialInstitutions, setFinancialInstitutions] =
    useState<FinancialInstitutionsResult[]>();

  useEffect(() => {
    const getFinancialInstitutionsList = async () => {
      const response = await getFinancialInstitutions(149);
      setFinancialInstitutions(response.result);
    };
    getFinancialInstitutionsList();
  }, []);

  const generateMonthOptions = () => {
    const options = [];
    const now = new Date();

    for (let i = 0; i < 12; i++) {
      const year = now.getFullYear();
      const month = now.getMonth(); // getMonth() is zero-based (0 = January, 11 = December)

      // Create the date for the first day of the current month
      const firstDay = new Date(year, month, 1);

      // Format the date as dd-mm-yyyy
      const formattedDate = `${("0" + firstDay.getDate()).slice(-2)}-${(
        "0" +
        (firstDay.getMonth() + 1)
      ).slice(-2)}-${firstDay.getFullYear()}`;

      // Add to options array
      options.push({
        value: formattedDate,
        label: formattedDate,
      });

      // Move to the previous month
      now.setMonth(now.getMonth() - 1);
    }

    return options;
  };

  const [options, setOptions] = useState<any>();

  useEffect(() => {
    setOptions(generateMonthOptions());
  }, []);

  return (
    <form className="form" onSubmit={formik.handleSubmit} noValidate>
      {/* begin::Input group */}

      <span
        dangerouslySetInnerHTML={{
          __html: intl.formatMessage({
            id: "Fields.FinancialBankConnectIntro",
          }),
        }}
      />

      <div
        className="row alert alert-custom alert-default bg-secondary align-items-center mt-8 "
        role="alert"
      >
        <div className="alert-icon col-1 me-4">
          <i className="ki-duotone ki-information-4 fs-3x text-center text-primary">
            <span className="path1"></span>
            <span className="path2"></span>
            <span className="path3"></span>
          </i>
        </div>
        <div className="alert-text col-10">
          <p>
            {intl.formatMessage({
              id: "Fields.FinancialBankConnectPeriodeStartInfo",
            })}
          </p>
        </div>
      </div>

      <div className="row d-flex mb-7">
        {/* account type Field */}

        <label className="required fw-bold fs-6 mb-2">
          {" "}
          {intl.formatMessage({
            id: "Fields.FinancialBankConnectSelectInstitution",
          })}
        </label>

        <Select
          placeholder={intl.formatMessage({
            id: "Fields.FinancialBankConnectSelectInstitution",
          })}
          className={clsx(
            "react-select-styled",
            {
              "is-invalid":
                formik.touched.accountType && formik.errors.accountType,
            },
            {
              "is-valid":
                formik.touched.accountType && !formik.errors.accountType,
            }
          )}
          options={financialInstitutions?.map((item: any) => ({
            value: item.id,
            label: item.name,
          }))}
          onChange={(selectedOption) =>
            formik.setFieldValue("accountType", selectedOption?.value)
          }
          menuPlacement="top"
        />
        {formik.touched.accountType && formik.errors.accountType && (
          <div className="fv-plugins-message-container">
            <div className="fv-help-block">
              <span
                dangerouslySetInnerHTML={{
                  __html: formik.errors.accountType,
                }}
                role="alert"
              />
            </div>
          </div>
        )}
      </div>
      <div className="row d-flex mb-7">
        {/* account type Field */}

        <label className="required fw-bold fs-6 mb-2">
          {" "}
          {intl.formatMessage({
            id: "Fields.FinancialBankConnectSelectStartPeriod",
          })}
        </label>

        <Select
          placeholder={intl.formatMessage({
            id: "Fields.FinancialBankConnectSelectStartPeriod",
          })}
          className={clsx(
            "react-select-styled",
            {
              "is-invalid":
                formik.touched.accountType && formik.errors.accountType,
            },
            {
              "is-valid":
                formik.touched.accountType && !formik.errors.accountType,
            }
          )}
          menuPlacement="top"
          options={options}
          onChange={(selectedOption) =>
            formik.setFieldValue("accountType", selectedOption)
          }
        />
        {formik.touched.accountType && formik.errors.accountType && (
          <div className="fv-plugins-message-container">
            <div className="fv-help-block">
              <span
                dangerouslySetInnerHTML={{
                  __html: formik.errors.accountType,
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

export default BankLinkModalForm;
