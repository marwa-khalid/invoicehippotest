import { Tabs, TabList, Tab, TabPanels, TabPanel, Box } from "@chakra-ui/react";
import { FC } from "react";
import clsx from "clsx";
import { useIntl } from "react-intl";
import Select from "react-select";
import { FormikProps } from "formik";
import enums from "../../../../../../invoicehippo.enums.json";

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
      asDate?: string;
      asText?: string;
      asMoney?: number;
      asNumber?: number;
      asOptions?: string[];
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
    houseNrAddition?: string;
    postCode: string;
    city: string;
    countryType: number;
  };
  deliveryAddress: {
    id: number;
    streetName: string;
    houseNr: string;
    houseNrAddition?: string;
    postCode: string;
    city: string;
    countryType: number;
  };
}

type Props = {
  formik: FormikProps<FormValues>;
  isSubmitting: boolean;
};

const FinancialAddModalForm: FC<Props> = ({ formik, isSubmitting }) => {
  const intl = useIntl();

  return (
    <Box p={3}>
      <Tabs isFitted variant="enclosed">
        <TabList>
          <Tab>
            <i className="ki-duotone ki-user fs-2 me-2 text-dark">
              <span className="path1"></span>
              <span className="path2"></span>
              <span className="path3"></span>
            </i>
            {intl.formatMessage({ id: "Fields.ClientSettings" })}
          </Tab>
          <Tab>
            <i className="ki-duotone ki-people fs-1 me-2 text-dark">
              <span className="path1"></span>
              <span className="path2"></span>
              <span className="path3"></span>
              <span className="path4"></span>
              <span className="path5"></span>
            </i>
            {intl.formatMessage({ id: "Fields.ContactPersonSettings" })}
          </Tab>
          <Tab>
            {" "}
            <i className="ki-duotone ki-bank fs-1 me-2 text-dark ">
              <span className="path1"></span>
              <span className="path2"></span>
            </i>
            overige instellingen
          </Tab>
          <Tab>
            <i className="ki-duotone ki-information-4 fs-1 me-2 text-dark">
              <span className="path1"></span>
              <span className="path2"></span>
              <span className="path3"></span>
            </i>
            {intl.formatMessage({ id: "Fields.SideMenuCustomFeatures" })}
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <div className="modal-body">
              <form
                className="form p-1"
                onSubmit={formik.handleSubmit}
                noValidate
              >
                {/* begin::Input group */}
                <div className="fv-row col-12 d-flex mb-3 d-flex justify-content-between align-items-center mb-3">
                  <label className="required fw-bold fs-6">
                    {intl.formatMessage({ id: "Fields.CompanyName" })}
                  </label>
                  <div className="form-check form-switch mt-1 d-flex align-items-center">
                    <label
                      className="form-check-label me-20 fs-sm text-muted"
                      htmlFor="isPrivateClientSwitch"
                    >
                      {intl.formatMessage({ id: "Fields.IsPrivateClient" })}
                    </label>
                    <input
                      className="form-check-input h-20px w-40px"
                      type="checkbox"
                      id="isPrivateClientSwitch"
                      {...formik.getFieldProps("isPrivateClient")}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
                <div className="row d-flex mb-5">
                  <input
                    type="text"
                    {...formik.getFieldProps("businessName")}
                    className={clsx(
                      "form-control form-control-solid",
                      {
                        "is-invalid":
                          formik.touched.businessName &&
                          formik.errors.businessName,
                      },
                      {
                        "is-valid":
                          formik.touched.businessName &&
                          !formik.errors.businessName,
                      }
                    )}
                    placeholder={intl.formatMessage({
                      id: "Fields.CompanyName",
                    })}
                  />
                  {formik.touched.businessName &&
                    formik.errors.businessName && (
                      <div className="fv-plugins-message-container">
                        <div className="fv-help-block">
                          <span
                            dangerouslySetInnerHTML={{
                              __html: formik.errors.businessName,
                            }}
                            role="alert"
                          />
                        </div>
                      </div>
                    )}
                </div>

                {/*  client type Field */}
                <div className="row flex-grow-1 d-flex mb-5">
                  <label className="fw-bold fs-6 mb-2">
                    {intl.formatMessage({ id: "Fields.ClientTypes" })}
                  </label>
                  <Select
                    options={enums.ClientTypes.map((clientType) => {
                      return {
                        value: clientType.Value,
                        label: clientType.Title,
                      };
                    })}
                    isMulti
                    onChange={(option: any) =>
                      formik.setFieldValue("clientType", option?.value)
                    }
                    isDisabled={formik.isSubmitting}
                    className="react-select-styled"
                    isClearable
                  />
                  {formik.touched.kvkNr && formik.errors.kvkNr && (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">
                        <span
                          dangerouslySetInnerHTML={{
                            __html: formik.errors.kvkNr,
                          }}
                          role="alert"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="row d-flex mb-5">
                  <div className="fv-row col-6">
                    <label className="fw-bold fs-6 mb-2">
                      {intl.formatMessage({ id: "Fields.KvkNr" })}
                    </label>
                    <input
                      type="text"
                      {...formik.getFieldProps("KvkNr")}
                      className={clsx(
                        "form-control form-control-solid",
                        {
                          "is-invalid":
                            formik.touched.businessName &&
                            formik.errors.businessName,
                        },
                        {
                          "is-valid":
                            formik.touched.businessName &&
                            !formik.errors.businessName,
                        }
                      )}
                      placeholder={intl.formatMessage({
                        id: "Fields.KvkNr",
                      })}
                    />
                  </div>
                  <div className="fv-row col-6 mb-3">
                    <label className=" fw-bold fs-6 mb-2">
                      {intl.formatMessage({ id: "Fields.BtwNr" })}
                    </label>
                    <input
                      type="text"
                      {...formik.getFieldProps("BtwNr")}
                      className={clsx(
                        "form-control form-control-solid",
                        {
                          "is-invalid":
                            formik.touched.businessName &&
                            formik.errors.businessName,
                        },
                        {
                          "is-valid":
                            formik.touched.businessName &&
                            !formik.errors.businessName,
                        }
                      )}
                      placeholder={intl.formatMessage({
                        id: "Fields.BtwNr",
                      })}
                    />
                  </div>
                </div>

                <h2 className="text-center">
                  {intl.formatMessage({ id: "Fields.InvoiceAddress" })}:
                </h2>
                <div className="row d-flex mb-5">
                  <label className=" fw-bold fs-6 mb-2">
                    {intl.formatMessage({ id: "Fields.Street" })} &{" "}
                    {intl.formatMessage({ id: "Fields.HouseNr" })}
                  </label>
                  <div className="fv-row col-4">
                    <input
                      type="text"
                      {...formik.getFieldProps("street")}
                      className={clsx(
                        "form-control form-control-solid",
                        {
                          "is-invalid":
                            formik.touched.businessName &&
                            formik.errors.businessName,
                        },
                        {
                          "is-valid":
                            formik.touched.businessName &&
                            !formik.errors.businessName,
                        }
                      )}
                      placeholder={intl.formatMessage({
                        id: "Fields.Street",
                      })}
                    />
                  </div>
                  <div className="fv-row col-4">
                    <input
                      type="text"
                      {...formik.getFieldProps("BtwNr")}
                      className={clsx(
                        "form-control form-control-solid",
                        {
                          "is-invalid":
                            formik.touched.businessName &&
                            formik.errors.businessName,
                        },
                        {
                          "is-valid":
                            formik.touched.businessName &&
                            !formik.errors.businessName,
                        }
                      )}
                      placeholder={intl.formatMessage({
                        id: "Fields.HouseNr",
                      })}
                    />
                  </div>
                  <div className="fv-row col-4">
                    <input
                      type="text"
                      {...formik.getFieldProps("BtwNr")}
                      className={clsx(
                        "form-control form-control-solid",
                        {
                          "is-invalid":
                            formik.touched.businessName &&
                            formik.errors.businessName,
                        },
                        {
                          "is-valid":
                            formik.touched.businessName &&
                            !formik.errors.businessName,
                        }
                      )}
                      placeholder={intl.formatMessage({
                        id: "Fields.HouseNrAddon",
                      })}
                    />
                  </div>
                </div>
                <div className="row d-flex mb-5">
                  <label className=" fw-bold fs-6 mb-2">
                    {intl.formatMessage({ id: "Fields.PostCode" })} &{" "}
                    {intl.formatMessage({ id: "Fields.City" })}
                  </label>
                  <div className="fv-row col-6">
                    <input
                      type="text"
                      {...formik.getFieldProps("street")}
                      className={clsx(
                        "form-control form-control-solid",
                        {
                          "is-invalid":
                            formik.touched.businessName &&
                            formik.errors.businessName,
                        },
                        {
                          "is-valid":
                            formik.touched.businessName &&
                            !formik.errors.businessName,
                        }
                      )}
                      placeholder={intl.formatMessage({
                        id: "Fields.PostCode",
                      })}
                    />
                  </div>
                  <div className="fv-row col-6">
                    <input
                      type="text"
                      {...formik.getFieldProps("BtwNr")}
                      className={clsx(
                        "form-control form-control-solid",
                        {
                          "is-invalid":
                            formik.touched.businessName &&
                            formik.errors.businessName,
                        },
                        {
                          "is-valid":
                            formik.touched.businessName &&
                            !formik.errors.businessName,
                        }
                      )}
                      placeholder={intl.formatMessage({
                        id: "Fields.City",
                      })}
                    />
                  </div>
                </div>
                <div className="row flex-grow-1 d-flex mb-5">
                  <label className="fw-bold fs-6 mb-2">
                    {intl.formatMessage({ id: "Fields.Country" })}
                  </label>
                  <Select
                    options={enums.CountryType.map((country) => {
                      return {
                        value: country.Value,
                        label: country.Title,
                      };
                    })}
                    onChange={(option) =>
                      formik.setFieldValue("clientType", option?.value)
                    }
                    isDisabled={formik.isSubmitting}
                    className="react-select-styled"
                    isClearable
                  />
                  {formik.touched.kvkNr && formik.errors.kvkNr && (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">
                        <span
                          dangerouslySetInnerHTML={{
                            __html: formik.errors.kvkNr,
                          }}
                          role="alert"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <h2 className="text-center">
                  {intl.formatMessage({ id: "Fields.DeliveryAddress" })}:
                </h2>
                <div className="row d-flex mb-5">
                  <label className=" fw-bold fs-6 mb-2">
                    {intl.formatMessage({ id: "Fields.Street" })} &{" "}
                    {intl.formatMessage({ id: "Fields.HouseNr" })}
                  </label>
                  <div className="fv-row col-4">
                    <input
                      type="text"
                      {...formik.getFieldProps("street")}
                      className={clsx(
                        "form-control form-control-solid",
                        {
                          "is-invalid":
                            formik.touched.businessName &&
                            formik.errors.businessName,
                        },
                        {
                          "is-valid":
                            formik.touched.businessName &&
                            !formik.errors.businessName,
                        }
                      )}
                      placeholder={intl.formatMessage({
                        id: "Fields.Street",
                      })}
                    />
                  </div>
                  <div className="fv-row col-4">
                    <input
                      type="text"
                      {...formik.getFieldProps("BtwNr")}
                      className={clsx(
                        "form-control form-control-solid",
                        {
                          "is-invalid":
                            formik.touched.businessName &&
                            formik.errors.businessName,
                        },
                        {
                          "is-valid":
                            formik.touched.businessName &&
                            !formik.errors.businessName,
                        }
                      )}
                      placeholder={intl.formatMessage({
                        id: "Fields.HouseNr",
                      })}
                    />
                  </div>
                  <div className="fv-row col-4">
                    <input
                      type="text"
                      {...formik.getFieldProps("BtwNr")}
                      className={clsx(
                        "form-control form-control-solid",
                        {
                          "is-invalid":
                            formik.touched.businessName &&
                            formik.errors.businessName,
                        },
                        {
                          "is-valid":
                            formik.touched.businessName &&
                            !formik.errors.businessName,
                        }
                      )}
                      placeholder={intl.formatMessage({
                        id: "Fields.HouseNrAddon",
                      })}
                    />
                  </div>
                </div>
                <div className="row d-flex mb-5">
                  <label className=" fw-bold fs-6 mb-2">
                    {intl.formatMessage({ id: "Fields.PostCode" })} &{" "}
                    {intl.formatMessage({ id: "Fields.City" })}
                  </label>
                  <div className="fv-row col-6">
                    <input
                      type="text"
                      {...formik.getFieldProps("street")}
                      className={clsx(
                        "form-control form-control-solid",
                        {
                          "is-invalid":
                            formik.touched.businessName &&
                            formik.errors.businessName,
                        },
                        {
                          "is-valid":
                            formik.touched.businessName &&
                            !formik.errors.businessName,
                        }
                      )}
                      placeholder={intl.formatMessage({
                        id: "Fields.PostCode",
                      })}
                    />
                  </div>
                  <div className="fv-row col-6">
                    <input
                      type="text"
                      {...formik.getFieldProps("BtwNr")}
                      className={clsx(
                        "form-control form-control-solid",
                        {
                          "is-invalid":
                            formik.touched.businessName &&
                            formik.errors.businessName,
                        },
                        {
                          "is-valid":
                            formik.touched.businessName &&
                            !formik.errors.businessName,
                        }
                      )}
                      placeholder={intl.formatMessage({
                        id: "Fields.City",
                      })}
                    />
                  </div>
                </div>
                <div className="row flex-grow-1 d-flex mb-5">
                  <label className="fw-bold fs-6 mb-2">
                    {intl.formatMessage({ id: "Fields.Country" })}
                  </label>
                  <Select
                    options={enums.CountryType.map((country) => {
                      return {
                        value: country.Value,
                        label: country.Title,
                      };
                    })}
                    onChange={(option) =>
                      formik.setFieldValue("clientType", option?.value)
                    }
                    isDisabled={formik.isSubmitting}
                    className="react-select-styled"
                    isClearable
                  />
                  {formik.touched.kvkNr && formik.errors.kvkNr && (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">
                        <span
                          dangerouslySetInnerHTML={{
                            __html: formik.errors.kvkNr,
                          }}
                          role="alert"
                        />
                      </div>
                    </div>
                  )}
                </div>
                {/* More fields related to Client Settings */}
                {/* Add as needed based on the FormValues structure */}

                {/* Financial Settings Section */}
                {/* <div className="row">
                  <div className="fv-row mb-7 col-5">
                    <label className=" fw-bold fs-6 mb-2">
                      {intl.formatMessage({
                        id: "Fields.BankAccountCompanyType",
                      })}
                    </label>
                    <Select
                      className="react-select-styled react-select-transparent"
                      value={
                        formik.values.financialSettings
                          .bankAccountCompanyType === 0
                          ? null
                          : enums.BankAccountCompanyTypes.map((item: any) => ({
                              value: item.Value,
                              label: item.Title,
                            })).find(
                              (option) =>
                                option.value ===
                                formik.values.financialSettings
                                  .bankAccountCompanyType
                            ) || null
                      }
                      onBlur={() =>
                        formik.setFieldTouched(
                          "financialSettings.bankAccountCompanyType",
                          true
                        )
                      }
                      placeholder={intl.formatMessage({
                        id: "Fields.SelectOptionDefaultBankAccountCompanyType",
                      })}
                      isClearable
                      options={enums.BankAccountCompanyTypes.map(
                        (item: any) => ({
                          value: item.Value,
                          label: item.Title,
                        })
                      )}
                      onChange={(selectedOption: any) => {
                        formik.setFieldValue(
                          "financialSettings.bankAccountCompanyType",
                          selectedOption ? selectedOption.value : null
                        );
                      }}
                    />
                    {formik.touched.financialSettings?.bankAccountCompanyType &&
                      formik.errors.financialSettings
                        ?.bankAccountCompanyType && (
                        <div className="fv-plugins-message-container">
                          <div className="fv-help-block">
                            <span
                              dangerouslySetInnerHTML={{
                                __html:
                                  formik.errors.financialSettings
                                    ?.bankAccountCompanyType,
                              }}
                              role="alert"
                            />
                          </div>
                        </div>
                      )}
                  </div>

                  <div className="fv-row mb-7 col-7">
                    <label className=" d-block fw-bold fs-6 mb-2">
                      {intl.formatMessage({ id: "Fields.AccountIbanNr" })}
                    </label>
                    <input
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
                      type="text"
                      {...formik.getFieldProps(
                        "financialSettings.accountIbanNr"
                      )}
                      disabled={isSubmitting}
                    />
                  </div>
                  {formik.touched.financialSettings?.accountIbanNr &&
                    formik.errors.financialSettings?.accountIbanNr && (
                      <div className="fv-plugins-message-container">
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
                </div> */}

                {/* Advanced Settings and other sections if needed */}
              </form>
            </div>
          </TabPanel>

          <TabPanel>{/* Add content for Contact Persons */}</TabPanel>

          <TabPanel>{/* Add content for About */}</TabPanel>

          <TabPanel>{/* Add content for Custom Features */}</TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default FinancialAddModalForm;
