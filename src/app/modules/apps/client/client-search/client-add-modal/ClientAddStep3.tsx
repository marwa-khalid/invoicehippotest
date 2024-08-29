import enums from "../../../../../../invoicehippo.enums.json";
import { FC, useEffect, useState, useRef } from "react";
import Select from "react-select";
import { useIntl } from "react-intl";
import { FormikProps } from "formik";
import { useFormik } from "formik";
import ReactQuill from "react-quill";
import * as Yup from "yup";
import Tags from "@yaireo/tagify/dist/react.tagify";
import "@yaireo/tagify/dist/tagify.css";

import {
  getLedgerForClient,
  getVatForClient,
  postClientFinancial,
} from "../core/_requests";
import { handleToast } from "../../../../auth/core/_toast";
import { getVatTypesForLedger } from "../../../admin-settings/ledgeraccounts-list/core/_requests";
type Props = {
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
  clientId: number;
  businessName: string;
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
  clientId,
  businessName,
}) => {
  const intl = useIntl();
  const tagifyRef = useRef<any>();
  const formik = useFormik({
    initialValues: {
      id: clientId || 0,
      businessName: businessName || "",
      financialSettings: {
        bankAccountCompanyType: 0,
        accountIbanNr: "",
        accountHolderName: "",
        hasSepaMandate: true,
        sepaMandateDate: "",
        sepaMandateReference: "",
      },
      invoiceAndQuoteSettings: {
        defaultDeadlineDaysForPayment: 0,
        defaultVatTypeId: 0,
        defaultLedgerAccountId: 0,
        extraCcEmailAddressesInvoice: [""],
        extraCcEmailAddressesQuotes: [""],
        costDefaultLedgerAccountId: 0,
        costDefaultVatTypeId: 0,
        costDefaultReference: "",
        costDefaultLineReference: "",
      },
    },
    validationSchema: Yup.object().shape({}),
    onSubmit: async (values, { setSubmitting }) => {
      setIsSubmitting(true);
      try {
        const response = await postClientFinancial(values);
        if (response.isValid) {
          formik.resetForm();
        }
        handleToast(response);
      } catch (error) {
        console.error("Post failed:", error);
      } finally {
        setIsSubmitting(false);
        setSubmitting(false);
      }
    },
  });
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
          let options = [];

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

          setVatTypes(options);
        }
      } catch (error) {
        console.error("Error fetching vats :", error);
      }
    };

    fetchVatTypes();
  }, [selectedBearingTypeOption]);
  console.log(formik.values);
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
                      "financialSettings.bankAccountCompanyType",
                      selectedOption ? selectedOption.value : null
                    );
                  }}
                  isClearable
                />
              </div>

              <div className="fv-row col-6">
                <input
                  type="text"
                  {...formik.getFieldProps("financialSettings.accountIbanNr")}
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
                  {...formik.getFieldProps(
                    "financialSettings.accountHolderName"
                  )}
                  className="form-control form-control-solid"
                  placeholder={intl.formatMessage({
                    id: "Fields.AccountHolderName",
                  })}
                />
              </div>
            </div>
          </div>
          <div className="bg-secondary p-6 rounded mb-7">
            <h4 className="mb-2 text-start text-gray-600">
              standaard instellingen voor het opmaken van facturen
            </h4>
            <div className="separator border-gray-300 my-6"></div>
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
                      "invoiceAndQuoteSettings.defaultLedgerAccountId",
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
                        "invoiceAndQuoteSettings.defaultDeadlineDaysForPayment",
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
                        "invoiceAndQuoteSettings.defaultVatTypeId",
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

                <Tags
                  tagifyRef={tagifyRef}
                  className="form-control form-control-solid tagify p-3"
                  placeholder={intl.formatMessage({
                    id: "Fields.ExtraCcEmailAddressesInvoice",
                  })}
                  settings={{
                    dropdown: {
                      enabled: 0,
                    },
                    validate: (tagData) =>
                      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(tagData.value),
                  }}
                  //   value={formik.values.invoiceAndQuoteSettings?.extraCcEmailAddressesInvoice?.join(
                  //     ", "
                  //   )}
                  onChange={(e: any) =>
                    formik.setFieldValue(
                      "invoiceAndQuoteSettings.extraCcEmailAddressesInvoice",
                      e.target.value
                    )
                  }
                  onInvalid={handleInvalidEmail}
                />
              </div>
              {console.log(formik.values.invoiceAndQuoteSettings)!}
            </div>
          </div>

          <div className="bg-secondary p-6 rounded mb-7">
            <h4 className="mb-2 text-start text-gray-600">
              standaard instellingen voor het opmaken van offertes
            </h4>
            {console.log(formik.values.invoiceAndQuoteSettings)!}
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
                  className="form-control form-control-solid tagify p-3"
                  placeholder={intl.formatMessage({
                    id: "Fields.ExtraCcEmailAddressesQuotes",
                  })}
                  settings={{
                    dropdown: {
                      enabled: 0,
                    },
                    validate: (tagData) =>
                      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(tagData.value),
                  }}
                  value={formik.values.invoiceAndQuoteSettings?.extraCcEmailAddressesQuotes?.join(
                    ", "
                  )}
                  onChange={(e: any) =>
                    formik.setFieldValue(
                      "invoiceAndQuoteSettings.extraCcEmailAddressesQuotes",
                      e.target.value?.split(", ")
                    )
                  }
                  onInvalid={handleInvalidEmail}
                />
              </div>
            </div>
          </div>
          <div className="bg-secondary p-6 rounded mb-7">
            <h4 className="mb-2 text-start text-gray-600">
              standaard instellingen voor het verwerken van kosten
            </h4>
            {console.log(formik.values.invoiceAndQuoteSettings)!}
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
                Hier krijg je de mogelijkheid om een standaard kosten rubriek en
                BTW-tarief toe te passen op de klant voor het verwerken van
                kosten. Dit is handig indien je voor bepaalde klanten altijd de
                zelfde kosten rubriek en BTW-tarief moet gebruiken. Ook kun je
                een standaard referentie opgeven, maar we raden je aan om deze
                het liefst uniek te houden per boeking. Dit bereik je door het
                'referentie' veld hier leeg te laten!
              </div>
            </div>
            <div className="row d-flex mb-5">
              {/* ledger Field */}
              <label className="required fw-bold fs-6 mb-3">
                Standaard Grootboek
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
                  isClearable
                  menuPlacement="top"
                />
              </div>
            </div>

            <div className="row d-flex mb-5">
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
                  options={vatTypes}
                  onChange={(selectedOption: any) => {
                    formik.setFieldValue(
                      "invoiceAndQuoteSettings.costDefaultVatTypeId",
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
                  Standaard referentie
                </label>
                <input
                  type="text"
                  {...formik.getFieldProps(
                    "invoiceAndQuoteSettings.costDefaultReference"
                  )}
                  className="form-control form-control-solid"
                  placeholder="Standaard referentie"
                />
              </div>
              <div className="fv-row col-6">
                {/* KvkNr Field */}
                <label className="required fw-bold fs-6 mb-3">
                  Standaard regelomschrijving
                </label>
                <input
                  type="text"
                  {...formik.getFieldProps(
                    "invoiceAndQuoteSettings.costDefaultLineReference"
                  )}
                  className="form-control form-control-solid"
                  placeholder="Standaard regelomschrijving"
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
