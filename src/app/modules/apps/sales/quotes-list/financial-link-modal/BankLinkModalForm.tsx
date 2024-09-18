import { FC, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import Select from "react-select";
import { FormikProps } from "formik";
import { getFinancialInstitutions } from "../core/_requests";
import { FinancialInstitutionsResult } from "../core/_models";

interface FormValues {
  companyId: number;
  importDateMarker: string;
  optionalFinancialInstitutionId: string;
  redirectCommand: {
    successUrl: string;
    oopsUrl: string;
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

      // Use current time for the ISO string
      const isoDateString = new Date(
        `${firstDay.getFullYear()}-${("0" + (firstDay.getMonth() + 1)).slice(
          -2
        )}-${("0" + firstDay.getDate()).slice(
          -2
        )}T${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}.${now.getMilliseconds()}Z`
      ).toISOString();

      // Add to options array
      options.push({
        value: isoDateString,
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
          className="react-select-styled"
          options={financialInstitutions?.map((item: any) => ({
            value: item.id,
            label: item.name,
          }))}
          onChange={(selectedOption) =>
            formik.setFieldValue(
              "optionalFinancialInstitutionId",
              selectedOption?.value
            )
          }
          menuPlacement="top"
          isClearable
        />
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
          className="react-select-styled"
          menuPlacement="top"
          options={options}
          onChange={(selectedOption: any) =>
            formik.setFieldValue("importDateMarker", selectedOption?.value)
          }
          isClearable
        />
      </div>
    </form>
  );
};

export default BankLinkModalForm;
