import clsx from "clsx";
import { useIntl } from "react-intl";
import { FormikProps } from "formik";
import { ProductResult } from "../core/_models";
import ReactQuill from "react-quill";
import { useEffect, useState } from "react";
import {
  getDiscountTypes,
  getLedgerTypes,
  getNotificationCycles,
  getTradeNames,
  getUnitTypes,
  getVatList,
} from "../../../quotes/components/core/_requests";
import Select from "react-select";
import { ClientAddModal } from "../../../client/client-search/client-add-modal/ClientAddModal";
import { ClientSearch } from "../../../quotes/components/quote-add-modal/ClientSearch";
import enums from "../../../../../../invoicehippo.enums.json";
export interface FormValues {
  id: number;
  title: string;
  description: string;
  code: string;
  eanCode: string;
  supplierInhouseCode: string;
  supplierClientId: number;
  productGroupId: number;
  pricing: {
    units: number;
    unitPrice: number;
    companyUnitTypeId: number;
    btwExclusive: boolean;
    ledgerAccountId: number;
    vatTypeId: number;
  };
  pricingMargin: {
    purchasePrice: number;
    marginFactorType: number;
    marginFactor: number;
  };
}

type Props = {
  formik: FormikProps<FormValues>;
  isSubmitting: boolean;
  setEditModalId: (id: number) => void;
  editModalId: number;
  refresh: boolean;
  setRefresh: (type: boolean) => void;
};

const ProductAddModalForm = ({
  formik,
  refresh,
  setRefresh,
  setEditModalId,
  editModalId,
}: Props) => {
  const intl = useIntl();
  const [ledgers, setLedgers] = useState<any>([]);
  const [vatTypes, setVatTypes] = useState<any>([]);
  const [discountTypes, setDiscountTypes] = useState<any>([]);
  const [unitTypes, setUnitTypes] = useState<any>([]);
  const [companyTradeNames, setCompanyTradeNames] = useState<any>([]);
  const [notificationCycles, setNotificationCycles] = useState<any>([]);
  const [clientModal, openClientModal] = useState<boolean>(false);
  const [clientSearch, setClientSearch] = useState<any>();
  useEffect(() => {
    const fetchLedgersForSale = async () => {
      const response = await getLedgerTypes();
      if (response.isValid) {
        const options = response.result.map((item: any) => ({
          value: item.id,
          label: item.title,
        }));
        setLedgers(options);
      }
    };
    if (ledgers?.length === 0) {
      fetchLedgersForSale();
    }
  }, []);
  console.log(ledgers);
  useEffect(() => {
    const fetchUnitTypes = async () => {
      const response = await getUnitTypes();
      if (response.isValid) {
        const options = response.result.map((item: any) => ({
          value: item.id,
          label: item.title,
        }));
        setUnitTypes(options);
      }
    };
    if (unitTypes?.length === 0) {
      fetchUnitTypes();
    }
  }, []);

  useEffect(() => {
    const fetchDiscountTypes = async () => {
      const response = await getDiscountTypes();

      if (response.isValid) {
        setDiscountTypes(response.result);
      }
    };
    if (discountTypes?.length === 0) {
      fetchDiscountTypes();
    }
  }, []);

  useEffect(() => {
    const fetchVatsForSale = async () => {
      const response = await getVatList();
      if (response.isValid) {
        setVatTypes(response.result);
      }
    };
    if (vatTypes?.length === 0) {
      fetchVatsForSale();
    }
  }, []);
  console.log(unitTypes);

  useEffect(() => {
    const fetchTradeNames = async () => {
      const response = await getTradeNames();

      if (response.isValid) {
        const options = response.result.map((item: any) => ({
          value: item.id,
          label: item.title,
        }));
        setCompanyTradeNames(options);
      }
    };
    if (companyTradeNames?.length === 0) {
      fetchTradeNames();
    }
  }, []);

  useEffect(() => {
    const fetchNotificationCycles = async () => {
      const response = await getNotificationCycles();

      if (response.isValid) {
        const options = response.result.map((item: any) => ({
          value: item.id,
          label: item.title,
        }));
        setNotificationCycles(options);
      }
    };
    if (notificationCycles?.length === 0) {
      fetchNotificationCycles();
    }
  }, []);
  const handleQuillChange = (content: string) => {
    formik.setFieldValue("description", content);
  };
  return (
    <form>
      <div className="fv-row col-12 d-flex justify-content-between align-items-center mb-3">
        <label className="required fw-bold fs-6">
          {intl.formatMessage({
            id: "Fields.Product",
          })}
        </label>
        <div className="form-check form-switch mt-1 d-flex align-items-center">
          <label
            className="form-check-label me-20 fs-sm text-muted"
            htmlFor="btwExclusiveSwitch"
          >
            {intl.formatMessage({
              id: "Fields.BtwExclusive",
            })}
          </label>
          <input
            className="form-check-input h-20px w-40px"
            type="checkbox"
            id="isBtwExclusiveSwitch"
            checked={formik.values.pricing.btwExclusive}
            onChange={(e) =>
              formik.setFieldValue("pricing.btwExclusive", e.target.checked)
            }
          />
        </div>
      </div>
      <div className="row mb-5">
        <input
          type="text"
          onChange={(e) => formik.setFieldValue("title", e.target.value)}
          value={formik.values.title || ""}
          className="form-control form-control-solid"
          placeholder={intl.formatMessage({
            id: "Fields.Product",
          })}
        />
      </div>
      <div className="row d-flex mb-5">
        <div className="fv-row col-8">
          <label className="required fw-bold fs-6 mb-3">
            {intl.formatMessage({
              id: "Fields.LedgerAccount",
            })}
          </label>
          <Select
            value={ledgers?.find(
              (ledger: any) =>
                ledger.value === formik.values.pricing.ledgerAccountId
            )}
            className="react-select-styled"
            options={ledgers}
            onChange={(e: any) =>
              formik.setFieldValue("pricing.ledgerAccountId", e?.value)
            }
            placeholder={intl.formatMessage({
              id: "Fields.LedgerAccount",
            })}
          />
        </div>
        <div className="fv-row col-4">
          <label className="required fw-bold fs-6 mb-3">
            {intl.formatMessage({
              id: "Fields.VatTypeId",
            })}
          </label>
          <Select
            value={vatTypes
              ?.map((item: any) => ({
                value: item.id,
                label: item.title,
              }))
              .find(
                (vatTypes: any) =>
                  vatTypes.value === formik.values.pricing.vatTypeId
              )}
            className="react-select-styled"
            options={vatTypes.map((item: any) => ({
              value: item.id,
              label: item.title,
            }))}
            onChange={(e) =>
              formik.setFieldValue("pricing.vatTypeId", e?.value)
            }
            isClearable
          />
        </div>
      </div>
      <div className="row d-flex mb-5">
        <div className="fv-row col-8">
          <label className="required fw-bold fs-6 mb-3">
            {intl.formatMessage({
              id: "Fields.Supplier",
            })}
          </label>
          <div className="d-flex w-100 h-40px">
            {/* Primary button - long */}
            {formik.values.supplierClientId !== 0 ? (
              <button
                className="btn btn-primary d-inline-flex align-items-center w-100 rounded-end-0 flex-grow-1"
                // onClick={(e) => {
                //   e.preventDefault();
                //   setEditModalId(formik.values.header.clientId);
                //   openClientModal(true);
                // }}
              >
                <i className="la la-user fs-2"></i>
                <span className="ms-1">{formik.values.supplierClientId}</span>
              </button>
            ) : (
              <button
                className="btn btn-primary d-inline-flex align-items-center w-100 rounded-end-0 flex-grow-1"
                onClick={(e) => {
                  e.preventDefault();
                  setEditModalId(0);
                  openClientModal(true);
                }}
              >
                <i className="la la-user-plus fs-2"></i>
                <span className="ms-1">
                  {intl.formatMessage({
                    id: "Fields.ActionPickerAddNewClient",
                  })}
                </span>
              </button>
            )}
            {/* Small icon buttons */}
            {formik.values.supplierClientId !== 0 && (
              <button
                className="btn btn-secondary btn-icon h-40px rounded-0 ms-1 flex-shrink-0"
                // onClick={() => reset()}
              >
                <i className="fa fa-remove fs-3"></i>
              </button>
            )}
            <button
              className="btn btn-warning btn-icon rounded-start-0 mx-1 h-40px flex-shrink-0"
              onClick={(e) => {
                e.preventDefault();
                setClientSearch(true);
              }}
            >
              <i className="la la-search-plus fs-3"></i>
            </button>
          </div>
        </div>
        <div className="fv-row col-4">
          <label className="fw-bold fs-6 mb-3">
            {intl.formatMessage({
              id: "Fields.Code",
            })}
          </label>
          <input
            type="text"
            onChange={(e) => formik.setFieldValue("code", e.target.value)}
            value={formik.values.code}
            className="form-control form-control-solid"
            placeholder={intl.formatMessage({
              id: "Fields.Code",
            })}
          />

          <small className="text-muted">
            {intl.formatMessage({ id: "Fields.CodeInfo" })}
          </small>
        </div>
      </div>
      <div className="row d-flex mb-5">
        <div className="fv-row col-4">
          <label className="required fw-bold fs-6 mb-3">
            {intl.formatMessage({
              id: "Fields.Amount",
            })}
          </label>
          <input
            type="number"
            min="0.00"
            step="0.01"
            onChange={(e) =>
              formik.setFieldValue("pricing.unitPrice", e.target.value)
            }
            value={formik.values.pricing.unitPrice}
            className="form-control form-control-solid"
            placeholder={intl.formatMessage({
              id: "Fields.Amount",
            })}
          />
        </div>
        <div className="fv-row col-4">
          <label className="required fw-bold fs-6 mb-3">
            {intl.formatMessage({
              id: "Fields.Units",
            })}
          </label>
          <input
            type="number"
            min="0.00"
            step="0.01"
            onChange={(e) =>
              formik.setFieldValue("pricing.units", e.target.value)
            }
            value={formik.values.pricing.units}
            className="form-control form-control-solid"
            placeholder={intl.formatMessage({
              id: "Fields.Amount",
            })}
          />
        </div>
        {console.log(formik.values)!}
        <div className="fv-row col-4">
          <label className="required fw-bold fs-6 mb-3">
            {intl.formatMessage({
              id: "Fields.CompanyUnitTypeId",
            })}
          </label>
          <Select
            value={unitTypes?.find(
              (unitType: any) =>
                unitType.value === formik.values.pricing.companyUnitTypeId
            )}
            className="react-select-styled"
            options={unitTypes}
            onChange={(e) =>
              formik.setFieldValue("pricing.companyUnitTypeId", e?.value)
            }
            isClearable
          />
        </div>
      </div>
      <div
        className="row alert alert-custom alert-default align-items-center mt-8 mx-0 bg-info-light"
        style={{ backgroundColor: "#eee6fe" }}
        role="alert"
      >
        <div className="alert-icon col-1 me-4">
          <i className="ki-duotone ki-information-4 fs-3x text-center text-info">
            <span className="path1"></span>
            <span className="path2"></span>
            <span className="path3"></span>
          </i>
        </div>
        <div className="alert-text col-10">
          <span
            dangerouslySetInnerHTML={{
              __html: intl.formatMessage({
                id: "Fields.RegionInfoMargin",
              }),
            }}
            className="text-info"
          />
        </div>
      </div>
      <div className="row d-flex mb-5">
        <div className="fv-row col-3">
          <label className="fw-bold fs-6 mb-3">
            {intl.formatMessage({
              id: "Fields.PurchasePrice",
            })}
          </label>
          <input
            type="number"
            min="0.00"
            step="0.01"
            onChange={(e) =>
              formik.setFieldValue(
                "pricingMargin.purchasePrice",
                e.target.value
              )
            }
            value={formik.values.pricingMargin.purchasePrice}
            className="form-control form-control-solid"
            placeholder={intl.formatMessage({
              id: "Fields.PurchasePrice",
            })}
          />
        </div>

        <div className="fv-row col-5">
          <label className="fw-bold fs-6 mb-3">
            {intl.formatMessage({
              id: "Fields.MarginFactorType",
            })}
          </label>
          <Select
            value={enums.PriceMarginTypes.map((item: any) => ({
              value: item.Value,
              label: item.Title,
            })).find(
              (unitType: any) =>
                unitType.value === formik.values.pricingMargin.marginFactorType
            )}
            className="react-select-styled"
            options={enums.PriceMarginTypes.map((item: any) => ({
              value: item.Value,
              label: item.Title,
            }))}
            onChange={(e) =>
              formik.setFieldValue("pricingMargin.marginFactorType", e?.value)
            }
            isClearable
            placeholder={intl.formatMessage({ id: "Fields.SelectOptionNvt" })}
          />
        </div>
        <div className="fv-row col-4">
          <label className="fw-bold fs-6 mb-3">
            {intl.formatMessage({
              id: "Fields.MarginFactor",
            })}
          </label>
          <input
            type="number"
            onChange={(e) =>
              formik.setFieldValue("pricingMargin.marginFactor", e.target.value)
            }
            value={formik.values.pricingMargin.marginFactor}
            className="form-control form-control-solid"
            placeholder={intl.formatMessage({
              id: "Fields.MarginFactor",
            })}
          />
        </div>
      </div>
      <div className="row d-flex mb-5">
        <label htmlFor="" className="fw-bold mb-2">
          {intl.formatMessage({
            id: "Fields.Description",
          })}
        </label>

        <ReactQuill
          theme="snow"
          placeholder="Jouw tekst hier..."
          style={{ height: "200px" }}
          onChange={(content) => handleQuillChange(content)}
          value={formik.values.description || ""}
        />
      </div>
      {clientModal && (
        <ClientAddModal
          setRefresh={setRefresh}
          refresh={refresh}
          setEditModalId={setEditModalId}
          setAddModalOpen={openClientModal}
          editModalId={editModalId}
        />
      )}
      {/* {clientSearch && (
        <ClientSearch handleClose={handleClose} formik={formik} />
      )} */}
    </form>
  );
};

export { ProductAddModalForm };
