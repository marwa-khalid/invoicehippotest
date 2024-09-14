import enums from "../../../../../../invoicehippo.enums.json";
import { KTIcon, toAbsoluteUrl } from "../../../../../../_metronic/helpers";
import { FC, useEffect, useState } from "react";
import Select from "react-select";
import { useIntl } from "react-intl";
import { FormikProps } from "formik";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import clsx from "clsx";
import { ClientAddModalFooter } from "./ClientAddModalFooter";
import { Tooltip } from "@chakra-ui/react";
interface FormValues {
  customFields: {
    fieldLabel: string;
    fieldInfo: string;
    groupDisplayName: string;
    options: string[];
    fieldType: {
      value: number;
      description: string;
      name: string;
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
  contactlist: {
    contacts: [
      {
        id: 0;
        clientId: 0;
        isDefaultContact: true;
        firstName: "";
        betweenName: "";
        lastName: "";
        addressingType: 0;
        emailAddress: "";
        phoneNr: "";
        mobileNr: "";
        department: "";
      }
    ];
    listOfDeletedClientContactIDs: [0];
  };
}

type Props = {
  formik: FormikProps<FormValues>;
  isSubmitting: boolean;
  setAddModalOpen: (type: boolean) => void;
};

const ClientAddStep1: FC<Props> = ({
  formik,
  isSubmitting,
  setAddModalOpen,
}) => {
  const intl = useIntl();
  const [isModalOpen, setModalOpen] = useState(false);

  const hasClientType16 = formik.values.clientTypes.includes(16);

  const handleQuillChange = (content: string) => {
    formik.setFieldValue("factoringSessionStatement", content); // Set statement number in formik
  };

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  return (
    <>
      <div className="modal-body">
        <form
          className="form p-6"
          // onSubmit={formik.handleSubmit}
          noValidate
        >
          {/* begin::Input group */}
          <div className="fv-row col-12 d-flex d-flex justify-content-between align-items-center mb-3">
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
              />
            </div>
          </div>

          <div className="row d-flex mb-5">
            <div className="input-group">
              <input
                type="text"
                {...formik.getFieldProps("businessName")}
                className={clsx(
                  "form-control form-control-solid me-1 ",
                  {
                    "is-invalid":
                      formik.touched.businessName && formik.errors.businessName,
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

              <span className="input-group-text">
                {/* <Tooltip
                  className="tooltip"
                  label={intl.formatMessage({
                    id: "Fields.PickerClientToolTipSearchChaimberOfCommerce",
                  })}
                  placement="top" // Adjust the placement if needed
                > */}
                <i
                  className="la la-search-plus fs-1 cursor-pointer text-primary"
                  onClick={() => handleOpenModal()}
                  data-bs-toggle="tooltip"
                  data-bs-placement="top"
                  title={intl.formatMessage({
                    id: "Fields.PickerClientToolTipSearchChaimberOfCommerce",
                  })}
                />
                {/* </Tooltip> */}
              </span>
            </div>

            {formik.touched.businessName && formik.errors.businessName && (
              <div className="fv-plugins-message-container mt-2 ">
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
          {/* <div className="row d-flex mb-5">
            <a href="#">
              <i className="la la-search-plus me-2"></i>
              {intl.formatMessage({
                id: "Fields.PickerClientToolTipSearchChaimberOfCommerce",
              })}
            </a>
          </div> */}
          {/*  client type Field */}
          <div className="row flex-grow-1 d-flex mb-5">
            <label className="fw-bold fs-6 mb-2">
              {intl.formatMessage({ id: "Fields.ClientTypes" })}
            </label>
            <Select
              className="react-select-styled"
              options={enums.ClientTypes.map((clientType) => ({
                value: clientType.Value,
                label: clientType.Title,
              }))}
              value={formik.values.clientTypes
                .filter(
                  (clientTypeValue) =>
                    clientTypeValue !== 0 && clientTypeValue !== undefined
                )
                .map((clientTypeValue) => {
                  const clientType = enums.ClientTypes.find(
                    (ct) => ct.Value === clientTypeValue
                  );
                  return {
                    value: clientType?.Value,
                    label: clientType?.Title,
                  };
                })}
              isMulti
              onChange={(selectedOptions) =>
                formik.setFieldValue(
                  "clientTypes",
                  selectedOptions
                    ? selectedOptions.map((option) => option.value)
                    : []
                )
              }
              isClearable
            />
          </div>

          <div className="row d-flex mb-5">
            {/* KvkNr Field */}
            <div className="fv-row col-6">
              <label className="fw-bold fs-6 mb-2">
                {intl.formatMessage({ id: "Fields.KvkNr" })}
              </label>
              <input
                type="text"
                {...formik.getFieldProps("kvkNr")}
                className="form-control form-control-solid"
                placeholder={intl.formatMessage({
                  id: "Fields.KvkNr",
                })}
              />
            </div>

            {/* BtwNr Field */}
            <div className="fv-row col-6 mb-3">
              <label className="fw-bold fs-6 mb-2">
                {intl.formatMessage({ id: "Fields.BtwNr" })}
              </label>
              <input
                type="text"
                {...formik.getFieldProps("btwNr")}
                className="form-control form-control-solid"
                placeholder={intl.formatMessage({
                  id: "Fields.BtwNr",
                })}
              />
            </div>

            {/* Quill Editor - This will appear on a new full row if editing */}
            {hasClientType16 && (
              <div className="fv-row col-12 mb-3">
                <label className="fw-bold fs-6 mb-2">
                  {intl.formatMessage({
                    id: "Fields.FactoringSessionStatement",
                  })}
                </label>
                <ReactQuill
                  theme="snow"
                  value={formik.values.factoringSessionStatement}
                  onChange={handleQuillChange}
                />
              </div>
            )}
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
                <div className="fv-row col-5">
                  <input
                    type="text"
                    {...formik.getFieldProps("invoiceAddress.streetName")}
                    className="form-control form-control-solid"
                    placeholder={intl.formatMessage({
                      id: "Fields.Street",
                    })}
                  />
                </div>
                <div className="fv-row col-3">
                  <input
                    type="text"
                    {...formik.getFieldProps("invoiceAddress.houseNr")}
                    className="form-control form-control-solid"
                    placeholder={intl.formatMessage({
                      id: "Fields.HouseNr",
                    })}
                  />
                </div>
                <div className="fv-row col-4">
                  <input
                    type="text"
                    {...formik.getFieldProps("invoiceAddress.houseNrAddition")}
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
                    {...formik.getFieldProps("invoiceAddress.postCode")}
                    className="form-control form-control-solid"
                    placeholder={intl.formatMessage({
                      id: "Fields.PostCode",
                    })}
                  />
                </div>
                <div className="fv-row col-6">
                  <input
                    type="text"
                    {...formik.getFieldProps("invoiceAddress.city")}
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
                  value={
                    formik.values.invoiceAddress.countryType === 0
                      ? null
                      : enums.CountryType.filter(
                          (item) =>
                            item.Value ===
                            formik.values.invoiceAddress.countryType
                        ).map((item) => ({
                          value: item.Value,
                          label: item.Title,
                        }))[0] || null
                  }
                  onChange={(option: any) =>
                    formik.setFieldValue(
                      "invoiceAddress.countryType",
                      option?.value
                    )
                  }
                  className="react-select-styled"
                  isClearable
                />
              </div>
            </div>

            <div className="tab-pane fade" id="kt_tab_pane_2" role="tabpanel">
              <div className="row d-flex mb-5">
                <label className=" fw-bold fs-6 mb-2">
                  {intl.formatMessage({ id: "Fields.Street" })} &{" "}
                  {intl.formatMessage({ id: "Fields.HouseNr" })}
                </label>
                <div className="fv-row col-4">
                  <input
                    type="text"
                    {...formik.getFieldProps("deliveryAddress.streetName")}
                    className="form-control form-control-solid"
                    placeholder={intl.formatMessage({
                      id: "Fields.Street",
                    })}
                  />
                </div>
                <div className="fv-row col-4">
                  <input
                    type="text"
                    {...formik.getFieldProps("deliveryAddress.houseNr")}
                    className="form-control form-control-solid"
                    placeholder={intl.formatMessage({
                      id: "Fields.HouseNr",
                    })}
                  />
                </div>
                <div className="fv-row col-4">
                  <input
                    type="text"
                    {...formik.getFieldProps("deliveryAddress.houseNrAddition")}
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
                    {...formik.getFieldProps("deliveryAddress.postCode")}
                    className="form-control form-control-solid"
                    placeholder={intl.formatMessage({
                      id: "Fields.PostCode",
                    })}
                  />
                </div>
                <div className="fv-row col-6">
                  <input
                    type="text"
                    {...formik.getFieldProps("deliveryAddress.city")}
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
                  value={
                    formik.values.invoiceAddress.countryType === 0
                      ? null
                      : enums.CountryType.filter(
                          (item) =>
                            item.Value ===
                            formik.values.invoiceAddress.countryType
                        ).map((item) => ({
                          value: item.Value,
                          label: item.Title,
                        }))[0] || null
                  }
                  onChange={(option) =>
                    formik.setFieldValue(
                      "deliveryAddress.countryType",
                      option?.value
                    )
                  }
                  className="react-select-styled"
                  isClearable
                />
              </div>
            </div>
          </div>
          {/* Advanced Settings and other sections if needed */}
        </form>
      </div>

      {isModalOpen && (
        <div
          className="modal fade show d-block"
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
        >
          <div className="modal-dialog mw-800px">
            <div className="modal-content">
              <div className="modal-header bg-primary">
                <div className="fv-row col-12 d-flex justify-content-between align-items-center mb-0">
                  <h2 className="fw-bolder mb-0 text-white">
                    {intl.formatMessage({
                      id: "Fields.ActionClientSearchViaChaimberOfCommerce",
                    })}
                  </h2>
                  <div
                    className="btn btn-icon btn-sm btn-active-icon-primary"
                    onClick={() => setModalOpen(false)}
                    style={{ cursor: "pointer" }}
                  >
                    <KTIcon iconName="cross" className="fs-1 text-white" />
                  </div>
                </div>
              </div>
              <div className="modal-body">
                {/* <div
                  className="w-full mb-20 p-10 rounded"
                  style={{ backgroundColor: "#32388e" }}
                > */}
                {/* Full-width search input */}
                <div className="d-flex align-items-center position-relative mb-10 gap-2 ">
                  <KTIcon
                    iconName="magnifier"
                    className="fs-3 position-absolute ms-6"
                  />

                  <input
                    type="text"
                    data-kt-user-table-filter="search"
                    className="form-control form-control-solid w-100 ps-14 rounded-lg me-6"
                    placeholder={intl.formatMessage({
                      id: "Fields.SearchTerm",
                    })}
                    //value={localSearchTerm}
                    onChange={(e) => {
                      e.preventDefault();
                      // setLocalSearchTerm(e.target.value);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        //  handleSearchClick();
                      }
                    }}
                  />
                  <div className="btn-group">
                    <button
                      className="btn btn-primary d-inline-flex align-items-center"
                      // onClick={handleSearchClick}
                    >
                      <i className="la la-search fs-2"></i>
                      <span className="ms-1">
                        {intl.formatMessage({ id: "Fields.SearchBtn" })}
                      </span>
                    </button>

                    <button
                      className="btn btn-secondary btn-icon"
                      // onClick={handleResetClick}
                    >
                      <i className="la la-remove fs-3"></i>
                    </button>
                  </div>
                </div>
                {/* </div> */}
                <div className="text-center">
                  <img
                    alt=""
                    src={toAbsoluteUrl("media/logos/searchnotfound.png")}
                    className="h-250px w-350px"
                  />
                  <h4>
                    {intl.formatMessage({
                      id: "Fields.SearchNoItemsAvailableDefault",
                    })}
                  </h4>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setModalOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export { ClientAddStep1 };
