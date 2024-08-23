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
  // formik: FormikProps<FormValues>;
  isSubmitting: boolean;
};

const FinancialAddModalForm: FC<Props> = ({ isSubmitting }) => {
  const intl = useIntl();

  return (
    <>
      <ul className="modal-header rounded-0 bg-primary nav nav-tabs nav-line-tabs nav-line-tabs-2x mb-5 fs-6 mt-0 d-flex justify-content-around text-white">
        <li className="nav-item flex-fill text-center">
          <a
            className="nav-link active d-flex align-items-center justify-content-center"
            data-bs-toggle="tab"
            href="#kt_tab_pane_4"
          >
            <i className="ki-duotone ki-user fs-2 text-white me-2">
              <span className="path1"></span>
              <span className="path2"></span>
              <span className="path3"></span>
            </i>
            <span className="text-white">
              {intl.formatMessage({ id: "Fields.ClientSettings" })}
            </span>
          </a>
        </li>
        <li className="nav-item flex-fill text-center">
          <a
            className="nav-link d-flex align-items-center justify-content-center"
            data-bs-toggle="tab"
            href="#kt_tab_pane_5"
          >
            <i className="ki-duotone ki-people fs-1 text-white me-2">
              <span className="path1"></span>
              <span className="path2"></span>
              <span className="path3"></span>
              <span className="path4"></span>
              <span className="path5"></span>
            </i>
            <span className="text-white">
              {intl.formatMessage({ id: "Fields.ContactPersonSettings" })}
            </span>
          </a>
        </li>
        <li className="nav-item flex-fill text-center">
          <a
            className="nav-link d-flex align-items-center justify-content-center"
            data-bs-toggle="tab"
            href="#kt_tab_pane_6"
          >
            <i className="ki-duotone ki-bank fs-1 text-white me-2">
              <span className="path1"></span>
              <span className="path2"></span>
            </i>
            <span className="text-white">overige instellingen</span>
          </a>
        </li>
        <li className="nav-item flex-fill text-center">
          <a
            className="nav-link d-flex align-items-center justify-content-center"
            data-bs-toggle="tab"
            href="#kt_tab_pane_7"
          >
            <i className="ki-duotone ki-information-4 fs-1 text-white me-2">
              <span className="path1"></span>
              <span className="path2"></span>
              <span className="path3"></span>
            </i>
            <span className="text-white">
              {intl.formatMessage({ id: "Fields.SideMenuCustomFeatures" })}
            </span>
          </a>
        </li>
      </ul>

      <div className="tab-content" id="myTabContent">
        <div
          className="tab-pane fade show active"
          id="kt_tab_pane_4"
          role="tabpanel"
        >
          <div className="modal-body">
            <form
              className="form p-1"
              // onSubmit={formik.handleSubmit}
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
                    // {...formik.getFieldProps("isPrivateClient")}
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              <div className="row d-flex mb-5">
                <input
                  type="text"
                  // {...formik.getFieldProps("companyId")}
                  className="form-control form-control-solid"
                  placeholder={intl.formatMessage({
                    id: "Fields.CompanyName",
                  })}
                />
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
                  // onChange={(option: any) =>
                  //   formik.setFieldValue("clientTypes", option?.value)
                  // }
                  // isDisabled={formik.isSubmitting}
                  className="react-select-styled"
                  isClearable
                />
              </div>

              <div className="row d-flex mb-5">
                <div className="fv-row col-6">
                  <label className="fw-bold fs-6 mb-2">
                    {intl.formatMessage({ id: "Fields.KvkNr" })}
                  </label>
                  <input
                    type="text"
                    // {...formik.getFieldProps("KvkNr")}
                    className="form-control form-control-solid"
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
                    // {...formik.getFieldProps("BtwNr")}
                    className="form-control form-control-solid"
                    placeholder={intl.formatMessage({
                      id: "Fields.BtwNr",
                    })}
                  />
                </div>
              </div>
              <ul className="nav nav-tabs nav-line-tabs nav-line-tabs-2xe mb-5 fs-6 align-items-center d-flex justify-content-start">
                <li className="nav-item">
                  <a
                    className="nav-link active d-flex align-items-center justify-content-center"
                    data-bs-toggle="tab"
                    href="#kt_tab_pane_1"
                  >
                    <i className="ki-duotone ki-home me-2 fs-2" />
                    {intl.formatMessage({ id: "Fields.InvoiceAddress" })}
                  </a>
                </li>
                <li className="nav-item ">
                  <a
                    className="nav-link d-flex align-items-center justify-content-center"
                    data-bs-toggle="tab"
                    href="#kt_tab_pane_2"
                  >
                    <i className="ki-duotone ki-home me-2 fs-2" />
                    {intl.formatMessage({
                      id: "Fields.DeliveryAddress",
                    })}
                  </a>
                </li>
              </ul>

              <div className="tab-content" id="myTabContent">
                <div
                  className="tab-pane fade show active"
                  id="kt_tab_pane_1"
                  role="tabpanel"
                >
                  <div className="row d-flex mb-5">
                    <label className=" fw-bold fs-6 mb-2">
                      {intl.formatMessage({ id: "Fields.Street" })} &{" "}
                      {intl.formatMessage({ id: "Fields.HouseNr" })}
                    </label>
                    <div className="fv-row col-4">
                      <input
                        type="text"
                        // {...formik.getFieldProps("deliveryAddress.streetName")}
                        className="form-control form-control-solid"
                        placeholder={intl.formatMessage({
                          id: "Fields.Street",
                        })}
                      />
                    </div>
                    <div className="fv-row col-4">
                      <input
                        type="text"
                        // {...formik.getFieldProps("deliveryAddress.houseNr")}
                        className="form-control form-control-solid"
                        placeholder={intl.formatMessage({
                          id: "Fields.HouseNr",
                        })}
                      />
                    </div>
                    <div className="fv-row col-4">
                      <input
                        type="text"
                        // {...formik.getFieldProps(
                        //   "deliveryAddress.houseNrAddition"
                        // )}
                        className="form-control form-control-solid"
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
                        // {...formik.getFieldProps("deliveryAddress.postCode")}
                        className="form-control form-control-solid"
                        placeholder={intl.formatMessage({
                          id: "Fields.PostCode",
                        })}
                      />
                    </div>
                    <div className="fv-row col-6">
                      <input
                        type="text"
                        // {...formik.getFieldProps("deliveryAddress.city")}
                        className="form-control form-control-solid"
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
                      // onChange={(option) =>
                      //   formik.setFieldValue(
                      //     "deliveryAddress.countryType",
                      //     option?.value
                      //   )
                      // }
                      className="react-select-styled"
                      isClearable
                    />
                  </div>
                </div>

                <div
                  className="tab-pane fade"
                  id="kt_tab_pane_2"
                  role="tabpanel"
                >
                  <div className="row d-flex mb-5">
                    <label className=" fw-bold fs-6 mb-2">
                      {intl.formatMessage({ id: "Fields.Street" })} &{" "}
                      {intl.formatMessage({ id: "Fields.HouseNr" })}
                    </label>
                    <div className="fv-row col-4">
                      <input
                        type="text"
                        // {...formik.getFieldProps("invoiceAddress.streetName")}
                        className="form-control form-control-solid"
                        placeholder={intl.formatMessage({
                          id: "Fields.Street",
                        })}
                      />
                    </div>
                    <div className="fv-row col-4">
                      <input
                        type="text"
                        // {...formik.getFieldProps("invoiceAddress.houseNr")}
                        className="form-control form-control-solid"
                        placeholder={intl.formatMessage({
                          id: "Fields.HouseNr",
                        })}
                      />
                    </div>
                    <div className="fv-row col-4">
                      <input
                        type="text"
                        // {...formik.getFieldProps(
                        //   "invoiceAddress.houseNrAddition"
                        // )}
                        className="form-control form-control-solid"
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
                        // {...formik.getFieldProps("invoiceAddress.postCode")}
                        className="form-control form-control-solid"
                        placeholder={intl.formatMessage({
                          id: "Fields.PostCode",
                        })}
                      />
                    </div>
                    <div className="fv-row col-6">
                      <input
                        type="text"
                        // {...formik.getFieldProps("invoiceAddress.city")}
                        className="form-control form-control-solid"
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
                      // onChange={(option) =>
                      //   formik.setFieldValue(
                      //     "invoiceAddress.countryType",
                      //     option?.value
                      //   )
                      // }
                      className="react-select-styled"
                      isClearable
                    />
                  </div>
                </div>
              </div>
              {/* Advanced Settings and other sections if needed */}
            </form>
          </div>
        </div>

        <div className="tab-pane fade" id="kt_tab_pane_5" role="tabpanel">
          {/* Add content for Contact Persons */}
        </div>

        <div className="tab-pane fade" id="kt_tab_pane_6" role="tabpanel">
          {/* Add content for About */}
        </div>

        <div className="tab-pane fade" id="kt_tab_pane_7" role="tabpanel">
          {/* Add content for Custom Features */}
        </div>
      </div>
    </>
  );
};

export default FinancialAddModalForm;
