import enums from "../../../../../../invoicehippo.enums.json";
import { FC, useEffect, useState } from "react";
import Select from "react-select";
import { useIntl } from "react-intl";
import { FormikProps } from "formik";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { getLedgerForClient, getVatForClient } from "../core/_requests";
interface FormValues {
  customFields: {
    fieldLabel: string;
    fieldInfo: string;
    groupDisplayName: string;
    options: string[];
    fieldType: {
      value: number;
      description: string;
    };
    fieldId: number;
    value: {
      asDate: string;
      asText: string;
      asMoney: number;
      asNumber: number;
      asOptions: string[];
    };
  }[];
  id: number;
  companyId: number;
  customerNr: string;
  importReference: string;
  businessName: string;
  kvkNr: string;
  btwNr: string;
  isPrivateClient: boolean;
  factoringSessionStatement: string;
  clientTypes: number[];
  financialSettings: {
    bankAccountCompanyType: number;
    accountIbanNr: string;
    accountHolderName: string;
    hasSepaMandate: boolean;
    sepaMandateDate: string;
    sepaMandateReference: string;
  };
  invoiceAndQuoteSettings: {
    defaultDeadlineDaysForPayment: number;
    defaultVatTypeId: number;
    defaultLedgerAccountId: number;
    extraCcEmailAddressesInvoice: string[];
    extraCcEmailAddressesQuotes: string[];
    costDefaultLedgerAccountId: number;
    costDefaultVatTypeId: number;
    costDefaultReference: string;
    costDefaultLineReference: string;
  };
  invoiceAddress: {
    id: number;
    streetName: string;
    houseNr: string;
    houseNrAddition: string;
    postCode: string;
    city: string;
    countryType: number;
  };
  deliveryAddress: {
    id: number;
    streetName: string;
    houseNr: string;
    houseNrAddition: string;
    postCode: string;
    city: string;
    countryType: number;
  };
}

type Props = {
  formik: FormikProps<FormValues>;
  isSubmitting: boolean;
};

const ClientAddStep3: FC<Props> = ({ formik, isSubmitting }) => {
  const intl = useIntl();
  const [ledgers, setLedgers] = useState<any>([]);
  const [vats, setVats] = useState<any>([]);
  useEffect(() => {
    const fetchLedgers = async () => {
      const response = await getLedgerForClient();
      console.log(response.result);
      if (response.isValid) {
        setLedgers(response.result);
      }
    };
    fetchLedgers();
  }, []);
  useEffect(() => {
    const fetchVats = async () => {
      const response = await getVatForClient();
      console.log(response.result);
      if (response.isValid) {
        setVats(response.result.listForSales);
      }
    };
    fetchVats();
  }, []);
  console.log(formik.values);
  return (
    <>
      <div className="modal-body">
        <form
          className="form p-3"
          // onSubmit={formik.handleSubmit}
          noValidate
        >
          <div className="bg-secondary p-6 rounded mb-7">
            <h3 className="mb-2 text-center">
              {intl.formatMessage({ id: "Fields.FinancialSettings" })}
            </h3>
            {/* begin::Input group */}
            <div className="row d-flex mb-5">
              {/* KvkNr Field */}
              <label className="required fw-bold fs-6 mb-3">
                {intl.formatMessage({ id: "Fields.BankAccountCompanyType" })} &{" "}
                {intl.formatMessage({ id: "Fields.AccountNrIBAN" })}
              </label>
              <div className="fv-row col-6">
                <Select
                  className="react-select-styled"
                  placeholder={intl.formatMessage({
                    id: "Fields.SelectOptionDefaultBankAccountCompanyType",
                  })}
                  options={enums.BankAccountCompanyTypes.map((item: any) => ({
                    value: item.Value,
                    label: item.Title,
                  }))}
                  onChange={(selectedOption: any) => {
                    formik.setFieldValue(
                      "bankAccountCompanyType",
                      selectedOption ? selectedOption.value : null
                    );
                  }}
                  isClearable
                />
              </div>
              <div className="fv-row col-6">
                <input
                  type="text"
                  {...formik.getFieldProps("kvkNr")}
                  className="form-control form-control-solid"
                  placeholder={intl.formatMessage({
                    id: "Fields.AccountNrIBAN",
                  })}
                />
              </div>
            </div>
            <div className="row d-flex mb-5">
              {/* accountholder Field */}
              <div className="fv-row">
                <label className="fw-bold fs-6 mb-2">
                  {intl.formatMessage({ id: "Fields.AccountHolderName" })}
                </label>
                <input
                  type="text"
                  {...formik.getFieldProps("kvkNr")}
                  className="form-control form-control-solid"
                  placeholder={intl.formatMessage({
                    id: "Fields.AccountHolderName",
                  })}
                />
              </div>
            </div>
          </div>
          <div className="bg-secondary p-6 rounded mb-7">
            <h3 className="mb-3 text-center">
              standaard instellingen voor het opmaken van facturen
            </h3>
            {/* begin::Input group */}
            <div className="row d-flex mb-5">
              {/* KvkNr Field */}
              <label className="required fw-bold fs-6 mb-3">
                Standaard Grootboek
              </label>
              <div className="fv-row">
                <Select
                  className="react-select-styled"
                  placeholder={intl.formatMessage({
                    id: "Fields.SelectOptionDefaultLedgerAccount",
                  })}
                  options={ledgers.map((ledger: any) => {
                    return { label: ledger.title, value: ledger.id };
                  })}
                  onChange={(selectedOption: any) => {
                    formik.setFieldValue(
                      "bankAccountCompanyType",
                      selectedOption ? selectedOption.value : null
                    );
                  }}
                  isClearable
                  menuPlacement="top"
                />
              </div>
            </div>
            <div className="row d-flex mb-5">
              <div className="fv-row col-6">
                {/* KvkNr Field */}
                <label className="required fw-bold fs-6 mb-3">
                  {intl.formatMessage({
                    id: "Fields.DefaultDeadlineDaysForPayment",
                  })}
                </label>
                <div className="fv-row">
                  <Select
                    className="react-select-styled"
                    placeholder={intl.formatMessage({
                      id: "Fields.DefaultDeadlineDaysForPaymentSelectOption",
                    })}
                    options={Array.from({ length: 89 }, (_, index) => {
                      const value = index + 2;
                      return { value, label: value.toString() };
                    })}
                    onChange={(selectedOption: any) => {
                      formik.setFieldValue(
                        "bankAccountCompanyType",
                        selectedOption ? selectedOption.value : null
                      );
                    }}
                    isClearable
                    menuPlacement="top"
                  />
                </div>
              </div>
              <div className="fv-row col-6">
                {/* KvkNr Field */}
                <label className="required fw-bold fs-6 mb-3">
                  Standaard BTW
                </label>
                <div className="fv-row">
                  <Select
                    className="react-select-styled"
                    placeholder={intl.formatMessage({
                      id: "Fields.SelectOptionDefaultVatType",
                    })}
                    options={vats.map((vat: any) => {
                      return { label: vat.title, value: vat.id };
                    })}
                    onChange={(selectedOption: any) => {
                      formik.setFieldValue(
                        "bankAccountCompanyType",
                        selectedOption ? selectedOption.value : null
                      );
                    }}
                    isClearable
                    menuPlacement="top"
                  />
                </div>
              </div>
            </div>

            <div className="row d-flex mb-5">
              {/* accountholder Field */}
              <div className="fv-row">
                <label className="fw-bold fs-6 mb-2">
                  {intl.formatMessage({
                    id: "Fields.ExtraCcEmailAddressesInvoice",
                  })}
                </label>
                <input
                  type="text"
                  data-role="tagsinput"
                  {...formik.getFieldProps(
                    "financialSettings.sepaMandateReference"
                  )}
                  className="form-control form-control-solid tagify"
                  placeholder={intl.formatMessage({
                    id: "Fields.ExtraCcEmailAddressesInvoice",
                  })}
                />
              </div>
            </div>
          </div>

          {/* Advanced Settings and other sections if needed */}
        </form>
      </div>
      <div className="modal-footer flex-end p-10"></div>
    </>
  );
};

export { ClientAddStep3 };
