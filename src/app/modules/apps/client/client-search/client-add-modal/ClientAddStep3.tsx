import enums from "../../../../../../invoicehippo.enums.json";
import { FC, useEffect, useState, useRef } from "react";
import Select from "react-select";
import { useIntl } from "react-intl";
import { FormikProps } from "formik";
import { useFormik } from "formik";
import ReactQuill from "react-quill";
import * as Yup from "yup";
import Tags from "@yaireo/tagify/dist/react.tagify";
import { toast } from "react-toastify";

import {
  getLedgerForClient,
  getVatForClient,
  postClientFinancial,
} from "../core/_requests";
import { handleToast } from "../../../../auth/core/_toast";
import { getVatTypesForLedger } from "../../../admin-settings/ledgeraccounts-list/core/_requests";
import clsx from "clsx";
import { ClientAddModalFooter } from "./ClientAddModalFooter";
type Props = {
  isSubmitting: boolean;
  setAddModalOpen: (value: boolean) => void;
  setIsSubmitting: (value: boolean) => void;
  formik: any;
};
interface vatType {
  value: number;
  label: string;
}

interface GroupedOption {
  label: any;
  options: {
    value: number;
    label: string;
    IsAccountTypeOmzet: boolean;
    IsAccountTypeBtw: boolean;
    IsAccountTypeCost: boolean;
    IsAccountTypeResult: boolean;
    IsAccountTypePrive: boolean;
  }[];
}

const ClientAddStep3: FC<Props> = ({
  setIsSubmitting,
  formik,
  setAddModalOpen,
  isSubmitting,
}) => {
  const intl = useIntl();
  const tagifyRef = useRef<any>();

  const [ledgers, setLedgers] = useState<any>([]);
  const [vats, setVats] = useState<any>([]);
  useEffect(() => {
    const fetchLedgers = async () => {
      const response = await getLedgerForClient();

      if (response.isValid) {
        setLedgers(response.result);
      }
    };
    fetchLedgers();
  }, []);
  // useEffect(() => {
  //   const fetchVats = async () => {
  //     const response = await getVatForClient();

  //     if (response.isValid) {
  //       setVats(response.result.listForSales);
  //     }
  //   };
  //   fetchVats();
  // }, []);

  const [bearingGroups, setBearingGroups] = useState<GroupedOption[]>([]);
  const [vatTypes, setVatTypes] = useState<vatType | any>();
  useEffect(() => {
    const toTitleCase = (str: string) => {
      return str.replace(/\w\S*/g, (txt) => {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      });
    };

    const transformBearingTypes = () => {
      const groupMap: { [key: string]: GroupedOption } = {};

      enums.BearingTypes.forEach((item: any) => {
        const group = toTitleCase(item.Group);
        const subGroup = toTitleCase(item.SubGroup);
        const groupKey = `${group} - ${subGroup}`;

        if (!groupMap[groupKey]) {
          groupMap[groupKey] = {
            label: (
              <div>
                {group} - <small>{subGroup}</small>
              </div>
            ) as any,
            options: [],
          };
        }

        groupMap[groupKey].options.push({
          value: item.Value,
          label: item.Title,
          IsAccountTypeOmzet: item.IsAccountTypeOmzet,
          IsAccountTypeBtw: item.IsAccountTypeBtw,
          IsAccountTypeCost: item.IsAccountTypeCost,
          IsAccountTypeResult: item.IsAccountTypeResult,
          IsAccountTypePrive: item.IsAccountTypePrive,
        });
      });

      const sortedGroups = Object.values(groupMap).sort((a, b) => {
        const aLabel = (a.label as any).props.children[0];
        const bLabel = (b.label as any).props.children[0];
        return aLabel.localeCompare(bLabel);
      });

      setBearingGroups(sortedGroups);
    };

    transformBearingTypes();
  }, []);
  const [selectedBearingTypeOption, setSelectedBearingTypeOption] =
    useState<any>();
  useEffect(() => {
    const fetchVatTypes = async () => {
      try {
        const response = await getVatTypesForLedger();
        if (response.isValid) {
          setVats(response.result.listForSales);
          let options = [];

          if (selectedBearingTypeOption.IsAccountTypeOmzet) {
            options = [
              {
                label: response.result.listForSalesGroupTitle,
                options: response.result.listForSales.map((item) => ({
                  value: item.id,
                  label: item.title,
                })),
              },
            ];
          } else if (selectedBearingTypeOption.IsAccountTypeCost) {
            options = [
              {
                label: response.result.listForCostsGroupTitle,
                options: response.result.listForCosts.map((item) => ({
                  value: item.id,
                  label: item.title,
                })),
              },
            ];
          } else {
            options = [
              {
                label: response.result.listForSalesGroupTitle,
                options: response.result.listForSales.map((item) => ({
                  value: item.id,
                  label: item.title,
                })),
              },
              {
                label: response.result.listForCostsGroupTitle,
                options: response.result.listForCosts.map((item) => ({
                  value: item.id,
                  label: item.title,
                })),
              },
            ];
          }
          setVatTypes(options);
        }
      } catch (error) {
        console.error("Error fetching vats :", error);
      }
    };

    fetchVatTypes();
  }, [selectedBearingTypeOption]);

  // Function to handle invalid tags and remove them

  const handleInvalidEmail = (e: any) => {
    const tagData = e.detail.data;

    if (!Yup.string().email(tagData.value)) {
      // Highlight invalid email with red background
      tagifyRef.current?.tagify.editTag(tagData, false, {
        className: "tagify__tag--invalid",
        style: { backgroundColor: "red" },
      });

      // Remove invalid email after highlighting
      setTimeout(() => {
        tagifyRef.current?.tagify.removeTag(tagData);
      }, 1500);
    }
  };

  return (
    <>
      <div className="modal-body">
        <form
          className="form p-3"
          // onSubmit={formik.handleSubmit}
          noValidate
        >
          <div className="bg-secondary p-6 rounded mb-7">
            <h4 className="mb-2 text-start text-gray-600">
              {intl.formatMessage({ id: "Fields.FinancialSettings" })}
            </h4>
            <div className="separator border-gray-300 my-6"></div>

            {/* begin::Input group */}
            <div className="row d-flex mb-5">
              {/* KvkNr Field */}
              <label className="   fw-bold fs-6 mb-3">
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
                      "financialSettings.bankAccountCompanyType",
                      selectedOption ? selectedOption.value : null
                    );
                  }}
                  value={
                    formik.values.financialSettings.bankAccountCompanyType === 0
                      ? null
                      : enums.BankAccountCompanyTypes.filter(
                          (item) =>
                            item.Value ===
                            formik.values.financialSettings
                              .bankAccountCompanyType
                        ).map((item) => ({
                          value: item.Value,
                          label: item.Title,
                        }))[0] || null
                  }
                  isClearable
                />
              </div>

              <div className="fv-row col-6">
                <input
                  type="text"
                  {...formik.getFieldProps("financialSettings.accountIbanNr")}
                  className={clsx(
                    "form-control form-control-white",
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
                  placeholder={intl.formatMessage({
                    id: "Fields.AccountNrIBAN",
                  })}
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
              {/* accountholder Field */}
              <div className="fv-row">
                <label className="fw-bold fs-6 mb-2">
                  {intl.formatMessage({ id: "Fields.AccountHolderName" })}
                </label>
                <input
                  type="text"
                  {...formik.getFieldProps(
                    "financialSettings.accountHolderName"
                  )}
                  className="form-control form-control-white"
                  placeholder={intl.formatMessage({
                    id: "Fields.AccountHolderName",
                  })}
                />
              </div>
            </div>
          </div>
          <div className="bg-secondary p-6 rounded mb-7">
            <h4 className="mb-2 text-start text-gray-600">
              {intl.formatMessage({
                id: "Fields.DefaultSettingsForCreateInvoice",
              })}
            </h4>
            <div className="separator border-gray-300 my-6"></div>
            {/* begin::Input group */}
            <div className="row d-flex mb-5">
              {/* KvkNr Field */}
              <label className=" fw-bold fs-6 mb-3">
                {" "}
                {intl.formatMessage({
                  id: "Fields.DefaultLedgerAccount",
                })}
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
                      "invoiceAndQuoteSettings.defaultLedgerAccountId",
                      selectedOption ? selectedOption.value : null
                    );
                  }}
                  value={
                    formik.values.invoiceAndQuoteSettings
                      .defaultLedgerAccountId === 0
                      ? null
                      : ledgers
                          .map((ledger: any) => ({
                            label: ledger.title,
                            value: ledger.id,
                          }))
                          .find(
                            (item: any) =>
                              item.value ===
                              formik.values.invoiceAndQuoteSettings
                                .defaultLedgerAccountId
                          ) || null
                  }
                  isClearable
                  menuPlacement="top"
                />
              </div>
            </div>
            <div className="row d-flex mb-5">
              <div className="fv-row col-6">
                {/* KvkNr Field */}
                <label className="   fw-bold fs-6 mb-3">
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
                        "invoiceAndQuoteSettings.defaultDeadlineDaysForPayment",
                        selectedOption ? selectedOption.value : null
                      );
                    }}
                    value={
                      formik.values.invoiceAndQuoteSettings
                        .defaultDeadlineDaysForPayment !== null
                        ? {
                            value:
                              formik.values.invoiceAndQuoteSettings
                                .defaultDeadlineDaysForPayment,
                            label:
                              formik.values.invoiceAndQuoteSettings.defaultDeadlineDaysForPayment.toString(),
                          }
                        : null
                    }
                    isClearable
                    menuPlacement="top"
                  />
                </div>
              </div>
              <div className="fv-row col-6">
                {/* Vat Field */}
                <label className="   fw-bold fs-6 mb-3">
                  {intl.formatMessage({
                    id: "Fields.DefaultTax",
                  })}
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
                        "invoiceAndQuoteSettings.defaultVatTypeId",
                        selectedOption ? selectedOption.value : null
                      );
                    }}
                    value={
                      formik.values.invoiceAndQuoteSettings.defaultVatTypeId ===
                      0
                        ? null
                        : vats
                            .map((vat: any) => ({
                              label: vat.title,
                              value: vat.id,
                            }))
                            .find(
                              (item: any) =>
                                item.value ===
                                formik.values.invoiceAndQuoteSettings
                                  .defaultVatTypeId
                            ) || null
                    }
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

                <Tags
                  tagifyRef={tagifyRef}
                  className="form-control form-control-white tagify p-3"
                  placeholder={intl.formatMessage({
                    id: "Fields.ExtraCcEmailAddressesInvoice",
                  })}
                  settings={{
                    dropdown: {
                      enabled: 0,
                    },
                    validate: (tagData: any) =>
                      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(tagData.value),
                  }}
                  value={
                    formik.values.invoiceAndQuoteSettings
                      ?.extraCcEmailAddressesInvoice || []
                  }
                  onChange={(e: any) => {
                    const value = e.detail.tagify.value.map(
                      (tag: any) => tag.value
                    ); // Get the clean value from Tagify
                    formik.setFieldValue(
                      "invoiceAndQuoteSettings.extraCcEmailAddressesInvoice",
                      value
                    );
                  }}
                  onInvalid={handleInvalidEmail}
                />
              </div>
            </div>
          </div>

          <div className="bg-secondary p-6 rounded mb-7">
            <h4 className="mb-2 text-start text-gray-600">
              {intl.formatMessage({
                id: "Fields.DefaultSettingsForCreateQuote",
              })}
            </h4>

            <div className="separator border-gray-300 my-6"></div>

            <div className="row d-flex mb-5">
              {/* accountholder Field */}
              <div className="fv-row">
                <label className="fw-bold fs-6 mb-2">
                  {intl.formatMessage({
                    id: "Fields.ExtraCcEmailAddressesQuotes",
                  })}
                </label>
                <Tags
                  tagifyRef={tagifyRef}
                  className="form-control form-control-white tagify p-3"
                  placeholder={intl.formatMessage({
                    id: "Fields.ExtraCcEmailAddressesQuotes",
                  })}
                  settings={{
                    dropdown: {
                      enabled: 0,
                    },
                    validate: (tagData: any) =>
                      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(tagData.value),
                  }}
                  value={
                    formik.values.invoiceAndQuoteSettings
                      ?.extraCcEmailAddressesQuotes || []
                  }
                  onChange={(e: any) => {
                    const value = e.detail.tagify.value.map(
                      (tag: any) => tag.value
                    ); // Get the clean value from Tagify
                    formik.setFieldValue(
                      "invoiceAndQuoteSettings.extraCcEmailAddressesQuotes",
                      value
                    );
                  }}
                  onInvalid={handleInvalidEmail}
                />
              </div>
            </div>
          </div>
          <div className="bg-secondary p-6 rounded mb-7">
            <h4 className="mb-2 text-start text-gray-600">
              {intl.formatMessage({
                id: "Fields.DefaultSettingsForCreateCost",
              })}
            </h4>

            <div className="separator border-gray-300 my-6"></div>
            <div
              className="row alert alert-custom alert-default align-items-center mt-8 mx-0 "
              style={{ backgroundColor: "#fff" }}
              role="alert"
            >
              <div className="alert-icon col-1">
                <i className="ki-duotone ki-information-4 fs-3x text-center text-primary">
                  <span className="path1"></span>
                  <span className="path2"></span>
                  <span className="path3"></span>
                </i>
              </div>
              <div className="alert-text col-11 text-gray-600">
                {intl.formatMessage({
                  id: "Fields.DefaultSettingsForCreateCostInfo",
                })}
              </div>
            </div>
            <div className="row d-flex mb-5">
              {/* ledger Field */}
              <label className="   fw-bold fs-6 mb-3">
                {intl.formatMessage({
                  id: "Fields.DefaultLedgerAccount",
                })}
              </label>
              <div className="fv-row">
                <Select
                  className="react-select-styled"
                  placeholder={intl.formatMessage({
                    id: "Fields.SelectOptionDefaultLedgerAccount",
                  })}
                  options={bearingGroups}
                  onChange={(selectedOption: any) => {
                    formik.setFieldValue(
                      "invoiceAndQuoteSettings.costDefaultLedgerAccountId",
                      selectedOption ? selectedOption.value : null
                    );
                    setSelectedBearingTypeOption(selectedOption);
                  }}
                  value={
                    formik.values.invoiceAndQuoteSettings
                      .costDefaultLedgerAccountId === 0
                      ? null
                      : bearingGroups?.map((item: any) =>
                          item.options.find(
                            (option: any) =>
                              option.value ===
                              formik.values.invoiceAndQuoteSettings
                                .costDefaultLedgerAccountId
                          )
                        ) || null
                  }
                  isClearable
                  menuPlacement="top"
                />
              </div>
            </div>

            <div className="row d-flex mb-5">
              {/* KvkNr Field */}
              <label className="   fw-bold fs-6 mb-3">
                {intl.formatMessage({
                  id: "Fields.DefaultTax",
                })}
              </label>
              <div className="fv-row">
                <Select
                  className="react-select-styled"
                  placeholder={intl.formatMessage({
                    id: "Fields.SelectOptionDefaultVatType",
                  })}
                  options={vatTypes}
                  onChange={(selectedOption: any) => {
                    formik.setFieldValue(
                      "invoiceAndQuoteSettings.costDefaultVatTypeId",
                      selectedOption ? selectedOption.value : null
                    );
                  }}
                  value={
                    formik.values.invoiceAndQuoteSettings
                      .costDefaultVatTypeId === 0
                      ? null
                      : vatTypes?.map((item: any) =>
                          item.options.find(
                            (option: any) =>
                              option.value ===
                              formik.values.invoiceAndQuoteSettings
                                .costDefaultVatTypeId
                          )
                        ) || null
                  }
                  isClearable
                  menuPlacement="top"
                />
              </div>
            </div>

            <div className="row d-flex mb-5">
              <div>
                {/* KvkNr Field */}
                <label className="   fw-bold fs-6 mb-3">
                  {intl.formatMessage({ id: "Fields.DefaultCostReference" })}
                </label>
                <input
                  type="text"
                  {...formik.getFieldProps(
                    "invoiceAndQuoteSettings.costDefaultReference"
                  )}
                  className="form-control form-control-white"
                  placeholder={intl.formatMessage({
                    id: "Fields.DefaultCostReference",
                  })}
                />
              </div>
            </div>
            <div className="row d-flex mb-5">
              <div>
                {/* KvkNr Field */}
                <label className="fw-bold fs-6 mb-3">
                  {intl.formatMessage({
                    id: "Fields.DefaultCostItemDescritption",
                  })}
                </label>
                <input
                  type="text"
                  {...formik.getFieldProps(
                    "invoiceAndQuoteSettings.costDefaultLineReference"
                  )}
                  className="form-control form-control-white"
                  placeholder={intl.formatMessage({
                    id: "Fields.DefaultCostItemDescritption",
                  })}
                />
              </div>
            </div>
          </div>

          {/* Advanced Settings and other sections if needed */}
        </form>
        {/* <div className="text-end">
          <button
            type="submit"
            className="btn btn-primary "
            onClick={() => formik.handleSubmit()}
            // disabled={response.id === undefined || response.id === 0}
          >
            {intl.formatMessage({ id: "Fields.ActionSave" })}
          </button>
        </div> */}
      </div>
      {/* <ClientAddModalFooter
        formik={formik}
        setAddModalOpen={setAddModalOpen}
        isSubmitting={isSubmitting}
      /> */}
    </>
  );
};

export { ClientAddStep3 };
