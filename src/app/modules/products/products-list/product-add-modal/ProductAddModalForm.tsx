import { useIntl } from "react-intl";
import { FormikProps } from "formik";
import ReactQuill from "react-quill-new";
import { useEffect, useState } from "react";
import {
  getLedgerTypes,
  getNotificationCycles,
  getTradeNames,
  getUnitTypes,
  getVatList,
} from "../../../quotes/overview/core/_requests";
import Select from "react-select";
import { ClientAddModal } from "../../../client/client-search/client-add-modal/ClientAddModal";
import { ClientSearch } from "../../../generic/ClientSearch";
import enums from "../../../../../_metronic/i18n/messages/invoicehippo.enums.json";
import { getProductGroupList } from "../core/_requests";
import * as Tooltip from "@radix-ui/react-tooltip";
import { ClientAddButtons } from "../../../generic/ClientAddButtons";
import { KTIcon } from "../../../../../_metronic/helpers";
import { ProductGroupsAddModal } from "../../../admin-settings/productgroups-list/productgroups-add-modal/ProductGroupsAddModal";
import { UnitTypesAddModal } from "../../../admin-settings/unittypes-list/unittypes-add-modal/UnitTypesAddModal";
import { getEnumOptions } from "../../../../helpers/intlHelper";
import { useAuth } from "../../../auth";
import { LedgerAddModal } from "../../../admin-settings/ledgeraccounts-list/ledger-add-modal/LedgerAddModal";
export interface FormValues {
  id: number;
  title: string;
  description: string;
  code: string;
  eanCode: string;
  supplierInhouseCode: string;
  supplierClientId: number;
  supplierClientDisplayName: string;
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
  amountReadOnly: boolean;
};

interface TaxInfo {
  amountExcludingTax: number;
  tax: number;
  totalAmount: number;
}
const ProductAddModalForm = ({
  formik,
  refresh,
  setRefresh,
  setEditModalId,
  editModalId,
  amountReadOnly,
}: Props) => {
  const intl = useIntl();
  const [ledgers, setLedgers] = useState<any>([]);
  const [vatTypes, setVatTypes] = useState<any>([]);
  const [unitTypes, setUnitTypes] = useState<any>([]);
  const [companyTradeNames, setCompanyTradeNames] = useState<any>([]);
  const [notificationCycles, setNotificationCycles] = useState<any>([]);
  const [productGroups, setProductGroups] = useState<any>([]);
  const [clientModal, setClientModalOpen] = useState<boolean>(false);
  const [clientSearch, setClientSearch] = useState<any>();
  const { currentUser } = useAuth();
  const [counter, setCounter] = useState<boolean>(false);
  const [counter1, setCounter1] = useState<boolean>(false);
  const [counter2, setCounter2] = useState<boolean>(false);
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
  useEffect(() => {
    if (ledgers?.length === 0 || counter) {
      fetchLedgersForSale();
    }
  }, []);
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
  useEffect(() => {
    if (unitTypes?.length === 0 || counter1) {
      fetchUnitTypes();
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
  const fetchProductGroups = async () => {
    const response = await getProductGroupList();
    if (response.isValid) {
      setProductGroups(response.result);
    }
  };
  useEffect(() => {
    if (productGroups?.length === 0 || counter2) {
      fetchProductGroups();
    }
  }, []);

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
  useEffect(() => {
    let calculatedAmount = 0;

    if (formik.values.pricingMargin.marginFactorType === 1) {
      // Percentage
      calculatedAmount =
        formik.values.pricingMargin.purchasePrice +
        (formik.values.pricingMargin.purchasePrice *
          formik.values.pricingMargin.marginFactor) /
          100;
      formik.setFieldValue("pricing.unitPrice", calculatedAmount.toFixed(2));
    } else if (formik.values.pricingMargin.marginFactorType === 2) {
      // Multiplier
      calculatedAmount =
        formik.values.pricingMargin.purchasePrice *
        formik.values.pricingMargin.marginFactor;
      formik.setFieldValue("pricing.unitPrice", calculatedAmount.toFixed(2));
    }
  }, [
    formik.values.pricingMargin.purchasePrice,
    formik.values.pricingMargin.marginFactor,
    // formik.values.pricingMargin.marginFactorType,
  ]);

  const [taxInfo, setTaxInfo] = useState<TaxInfo>({
    amountExcludingTax: 0,
    tax: 0,
    totalAmount: 0,
  });

  useEffect(() => {
    const clientResponse = JSON.parse(localStorage.getItem("clientResponse")!);

    if (clientResponse != null) {
      formik.setFieldValue("supplierClientId", clientResponse.id);

      formik.setFieldValue(
        "supplierClientDisplayName",
        clientResponse.customerNr + " " + clientResponse.businessName
      );
    }
  }, [clientModal, clientSearch]);

  useEffect(() => {
    localStorage.removeItem("isNew");
  }, [clientModal]);
  useEffect(() => {
    const taxAmount = vatTypes
      .map((vatType: any) => ({
        value: vatType.value,
        id: vatType.id,
        label: vatType.title,
      }))
      .find(
        (option: any) => option.id === formik.values.pricing.vatTypeId
      )?.value;

    const unitPrice = formik.values.pricing.unitPrice || 0;

    if (!taxAmount || !unitPrice) {
      if (unitPrice > 0) {
        setTaxInfo({
          amountExcludingTax: unitPrice,
          tax: 0,
          totalAmount: unitPrice,
        });
      } else {
        setTaxInfo({ amountExcludingTax: 0, tax: 0, totalAmount: 0 });
      }
      return;
    }

    let amountExcludingTax = 0;
    let tax = 0;
    let totalAmount = 0;

    if (formik.values.pricing.btwExclusive) {
      // VAT Exclusive Calculation
      tax = unitPrice * (taxAmount / 100);
      totalAmount = unitPrice + tax;
      amountExcludingTax = unitPrice; // Already exclusive
    } else {
      // VAT Inclusive Calculation
      const taxMultiplier = 1 + taxAmount / 100;
      amountExcludingTax = unitPrice / taxMultiplier;
      tax = unitPrice - amountExcludingTax;
      totalAmount = unitPrice; // Already inclusive
    }

    setTaxInfo({
      amountExcludingTax:
        amountExcludingTax && parseFloat(amountExcludingTax?.toFixed(2)),
      tax: parseFloat(tax.toFixed(2)),
      totalAmount: parseFloat(totalAmount.toString()),
    });
  }, [
    formik.values.pricing.unitPrice,
    formik.values.pricing.vatTypeId,
    formik.values.pricing.btwExclusive,
  ]);
  const openClientModal = () => {
    setEditModalId(formik.values.supplierClientId);
    setClientModalOpen(true);
  };
  const openClientModalInNewMode = () => {
    setEditModalId(0);
    setClientModalOpen(true);
  };
  const reset = () => {
    localStorage.removeItem("contactResponse");
    localStorage.removeItem("clientResponse");
    formik.setFieldValue("supplierClientDisplayName", "");
    formik.setFieldValue("supplierClientId", 0);
  };
  const [unitTypeModalOpen, setUnitTypeModalOpen] = useState<boolean>(false);
  const [ledgerModalOpen, setLedgerModalOpen] = useState(false);
  const [productGroupModalOpen, setProductGroupModalOpen] = useState(false);
  const openProductGroupModal = () => {
    setProductGroupModalOpen(true);
    setCounter2(true);
  };

  const closeProductModal = () => {
    setProductGroupModalOpen(false);
    fetchProductGroups();
  };
  const closeLedgerModal = () => {
    setLedgerModalOpen(false);
    fetchLedgersForSale();
  };

  const closeUnitModal = () => {
    setUnitTypeModalOpen(false);
    fetchUnitTypes();
  };
  useEffect(() => {
    if (counter) {
      // find ledger with highest value
      const maxLedger = ledgers.reduce((prev: any, curr: any) =>
        curr.value > prev.value ? curr : prev
      );
      formik.setFieldValue("pricing.ledgerAccountId", maxLedger.value);
      setCounter(false);
    }
  }, [ledgers]);
  useEffect(() => {
    if (counter2) {
      // find ledger with highest value
      const maxProductGroup = productGroups
        ?.map((item: any) => ({
          value: item.id,
          label: item.title,
        }))
        .reduce((prev: any, curr: any) =>
          curr.value > prev.value ? curr : prev
        );
      formik.setFieldValue("productGroupId", maxProductGroup.value);
      setCounter2(false);
    }
  }, [productGroups]);
  useEffect(() => {
    if (counter1) {
      // find ledger with highest value
      const maxUnitType = unitTypes?.reduce((prev: any, curr: any) =>
        curr.value > prev.value ? curr : prev
      );
      formik.setFieldValue("pricing.companyUnitTypeId", maxUnitType.value);
      setCounter1(false);
    }
  }, [unitTypes]);
  return (
    <form>
      <div className="row d-flex mb-2">
        <div className="fv-row col-4">
          <label className="fw-bold mb-3 fs-6">
            {intl.formatMessage({
              id: "Fields.Code",
            })}
          </label>
          <input
            type="text"
            onChange={(e) => formik.setFieldValue("code", e.target.value)}
            value={formik.values.code || ""}
            className="form-control form-control-solid"
            placeholder={intl.formatMessage({
              id: "Fields.Code",
            })}
          />
        </div>
        <div className="fv-row col-8">
          <label className="required fs-6 fw-bold ms-1 mb-3">
            {intl.formatMessage({
              id: "Fields.Product",
            })}
          </label>
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
      </div>
      <small className="text-muted">
        {intl.formatMessage({ id: "Fields.CodeInfo" })}
      </small>
      <div className="row d-flex mt-5">
        <div className="d-flex col-8 justify-content-between">
          <label className="required fw-bold fs-6 mb-3">
            {intl.formatMessage({
              id: "Fields.LedgerAccount",
            })}
          </label>
          <div
            className="cursor-pointer"
            onClick={() => {
              setLedgerModalOpen(true);
              setCounter(true);
            }}
          >
            <KTIcon iconName="plus" className="fs-2 text-primary" />
          </div>
        </div>

        <div className="fv-row col-3">
          <label className="required fw-bold fs-6 mb-3">
            {intl.formatMessage({
              id: "Fields.VatTypeId",
            })}
          </label>
        </div>
        <div className="fv-row col-1">
          <div className="form-check form-switch mb-3 d-flex align-items-center position-relative">
            <input
              className="form-check-input h-20px w-40px  cursor-pointer"
              type="checkbox"
              id="isBtwExclusiveSwitch"
              checked={formik.values.pricing.btwExclusive}
              onChange={(e) =>
                formik.setFieldValue("pricing.btwExclusive", e.target.checked)
              }
            />

            <Tooltip.Provider delayDuration={0}>
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <div
                    className="circle"
                    style={{
                      position: "absolute",
                      top: "-10px",
                      right: "-14px",
                    }}
                  >
                    <i className="ki-duotone ki-information-4 fs-2 cursor-pointer text-primary ms-1">
                      <span className="path1"></span>
                      <span className="path2"></span>
                      <span className="path3"></span>
                    </i>
                  </div>
                </Tooltip.Trigger>

                <Tooltip.Portal>
                  <Tooltip.Content side="top" className="app-tooltip">
                    {intl.formatMessage({
                      id: "Fields.BtwExclusive",
                    })}
                    <Tooltip.Arrow className="app-tooltip-arrow" />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            </Tooltip.Provider>
          </div>
        </div>
      </div>
      <div className="row d-flex mb-5">
        <div className="fv-row col-8">
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
              id: "Fields.SelectOptionDefaultLedgerAccountType",
            })}
          />
        </div>
        <div className="fv-row col-4">
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
            placeholder={intl.formatMessage({
              id: "Fields.SelectOptionDefaultVatRegistrationType",
            })}
          />
        </div>
      </div>
      <div className="row d-flex mb-5">
        <div className="fv-row col-8">
          <label className="fw-bold fs-6 mb-3">
            {intl.formatMessage({
              id: "Fields.Supplier",
            })}
          </label>
          <ClientAddButtons
            clientDisplayName={formik.values.supplierClientDisplayName}
            openClientModal={openClientModal}
            openClientModalInNewMode={openClientModalInNewMode}
            reset={reset}
            setClientSearch={setClientSearch}
            type="modal"
          />
        </div>
        <div className="fv-row col-4">
          <div className="d-flex justify-content-between">
            <label className="fw-bold fs-6 mb-3">
              {intl.formatMessage({
                id: "Fields.ProductGroup",
              })}
            </label>

            <div className="cursor-pointer" onClick={openProductGroupModal}>
              <KTIcon iconName="plus" className="fs-2 text-primary" />
            </div>
          </div>
          <Select
            value={productGroups
              ?.map((item: any) => ({
                value: item.id,
                label: item.title,
              }))
              .find(
                (productGroups: any) =>
                  productGroups.value === formik.values.productGroupId
              )}
            className="react-select-styled"
            options={productGroups.map((item: any) => ({
              value: item.id,
              label: item.title,
            }))}
            placeholder={intl.formatMessage({
              id: "System.ListOption_DefaultEmptyOption",
            })}
            onChange={(e) => formik.setFieldValue("productGroupId", e?.value)}
            isClearable
          />
        </div>
      </div>
      <div className="row d-flex mb-2">
        <div className="fv-row col-4 position-relative">
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
              formik.setFieldValue(
                "pricing.unitPrice",
                parseFloat(e.target.value) || 0
              )
            }
            value={formik.values.pricing.unitPrice || 0}
            className={`form-control form-control-solid ${
              amountReadOnly ? "bg-secondary" : ""
            }`}
            placeholder={intl.formatMessage({
              id: "Fields.Amount",
            })}
            disabled={amountReadOnly}
          />

          <Tooltip.Provider delayDuration={0}>
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <div
                  className="circle"
                  style={{
                    position: "absolute",
                    top: "0px",
                    right: "10px",
                  }}
                >
                  <i className="ki-duotone ki-information-4 fs-2 cursor-pointer text-primary ms-1">
                    <span className="path1"></span>
                    <span className="path2"></span>
                    <span className="path3"></span>
                  </i>
                </div>
              </Tooltip.Trigger>

              <Tooltip.Portal>
                <Tooltip.Content side="top" className="app-tooltip">
                  {formik.values.pricing.unitPrice !== 0 && (
                    <div style={{ fontFamily: "monospace" }}>
                      <div className="table" style={{ width: "100%" }}>
                        {/* Amount excluding VAT */}
                        {formik.values.pricing.btwExclusive ? (
                          <div style={{ display: "table-row" }}>
                            <div
                              className="px-2"
                              style={{
                                display: "table-cell",
                                textAlign: "left",
                              }}
                            >
                              {intl.formatMessage({ id: "Fields.Amount" })}{" "}
                              (inc):
                            </div>
                            <div
                              style={{
                                display: "table-cell",
                                textAlign: "right",
                              }}
                            >
                              {
                                currentUser?.result.activeCompanyDefaults
                                  .defaultValuta.sign
                              }
                              {taxInfo?.totalAmount?.toFixed(2)}
                            </div>
                          </div>
                        ) : (
                          <div style={{ display: "table-row" }}>
                            <div
                              className="px-2"
                              style={{
                                display: "table-cell",
                                textAlign: "left",
                              }}
                            >
                              {intl.formatMessage({ id: "Fields.Amount" })}{" "}
                              (exc):
                            </div>
                            <div
                              style={{
                                display: "table-cell",
                                textAlign: "right",
                              }}
                            >
                              {
                                currentUser?.result.activeCompanyDefaults
                                  .defaultValuta.sign
                              }
                              {taxInfo?.amountExcludingTax?.toFixed(2)}
                            </div>
                          </div>
                        )}
                        {/* VAT */}
                        <div style={{ display: "table-row" }}>
                          <div
                            className="px-2"
                            style={{
                              display: "table-cell",
                              textAlign: "left",
                            }}
                          >
                            {intl.formatMessage({ id: "Fields.VatTitle" })}:
                          </div>
                          <div
                            style={{
                              display: "table-cell",
                              textAlign: "right",
                            }}
                          >
                            {
                              currentUser?.result.activeCompanyDefaults
                                .defaultValuta.sign
                            }
                            {taxInfo?.tax?.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <Tooltip.Arrow className="app-tooltip-arrow" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </Tooltip.Provider>
        </div>

        <div className="fv-row col-4">
          <label className="required fw-bold fs-6 mb-3">
            {intl.formatMessage({ id: "Fields.Units" })}
          </label>

          <input
            type="number"
            min="0.00"
            step="0.01"
            onChange={(e) =>
              formik.setFieldValue(
                "pricing.units",
                parseFloat(e.target.value) || 0
              )
            }
            value={formik.values.pricing.units || 0}
            className="form-control form-control-solid"
            placeholder={intl.formatMessage({ id: "Fields.Units" })}
          />
        </div>
        <div className="fv-row col-4">
          <div className="d-flex justify-content-between">
            <label className="required fw-bold fs-6 mb-3">
              {intl.formatMessage({
                id: "Fields.CompanyUnitTypeId",
              })}
            </label>
            <div
              className="cursor-pointer"
              onClick={() => {
                setUnitTypeModalOpen(true);
                setCounter1(true);
              }}
            >
              <KTIcon iconName="plus" className="fs-2 text-primary" />
            </div>
          </div>

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
            placeholder={intl.formatMessage({
              id: "System.ListOption_DefaultEmptyOption",
            })}
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
            {intl.formatMessage({ id: "Fields.PurchasePrice" })}
          </label>
          <div className="input-group">
            <span className="input-group-text me-1" id="basic-addon1">
              {currentUser?.result.activeCompanyDefaults.defaultValuta.sign}
            </span>

            <input
              type="number"
              min="0.00"
              step="0.01"
              onChange={(e) =>
                formik.setFieldValue(
                  "pricingMargin.purchasePrice",
                  parseFloat(e.target.value) || 0
                )
              }
              value={formik.values.pricingMargin.purchasePrice || 0}
              className="form-control form-control-solid"
              placeholder={intl.formatMessage({ id: "Fields.PurchasePrice" })}
            />
          </div>
        </div>
        <div className="fv-row col-5">
          <label className="fw-bold fs-6 mb-3">
            {intl.formatMessage({ id: "Fields.MarginFactorType" })}
          </label>
          <Select
            value={getEnumOptions(enums.PriceMarginTypes, intl).find(
              (unitType: any) =>
                unitType.value === formik.values.pricingMargin.marginFactorType
            )}
            className="react-select-styled"
            options={getEnumOptions(enums.PriceMarginTypes, intl)}
            onChange={(e) =>
              formik.setFieldValue("pricingMargin.marginFactorType", e?.value)
            }
            isClearable
            placeholder={intl.formatMessage({
              id: "System.ListOption_DefaultEmptyOption",
            })}
          />
        </div>
        <div className="fv-row col-4">
          <label className="fw-bold fs-6 mb-3">
            {intl.formatMessage({ id: "Fields.MarginFactor" })}
          </label>
          <div className="input-group">
            <span className="input-group-text me-1" id="basic-addon1">
              {formik.values.pricingMargin.marginFactorType === 1
                ? "%"
                : formik.values.pricingMargin.marginFactorType === 2
                ? "x"
                : "?"}
            </span>
            <input
              type="number"
              onChange={(e) =>
                formik.setFieldValue(
                  "pricingMargin.marginFactor",
                  parseFloat(e.target.value) || 0
                )
              }
              disabled={
                !formik.values.pricingMargin.marginFactorType ||
                formik.values.pricingMargin.marginFactorType === 0
              }
              value={formik.values.pricingMargin.marginFactor || 0}
              className="form-control form-control-solid"
              placeholder={intl.formatMessage({ id: "Fields.MarginFactor" })}
            />
          </div>
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
          setEditModalId={setEditModalId}
          setAddModalOpen={setClientModalOpen}
          editModalId={editModalId}
        />
      )}
      {clientSearch && (
        <ClientSearch
          handleClose={() => setClientSearch(false)}
          formik={formik}
          storageName="clientResponse"
        />
      )}
      {productGroupModalOpen && (
        <ProductGroupsAddModal
          setRefresh={setRefresh}
          setAddModalOpen={closeProductModal}
          editModalId={0}
          refresh={refresh}
        />
      )}
      {unitTypeModalOpen && (
        <UnitTypesAddModal
          setRefresh={setRefresh}
          setAddModalOpen={closeUnitModal}
          refresh={refresh}
        />
      )}
      {ledgerModalOpen && (
        <LedgerAddModal
          setRefresh={setRefresh}
          setAddModalOpen={closeLedgerModal}
          refresh={refresh}
          fromInvoice={true}
        />
      )}
    </form>
  );
};

export { ProductAddModalForm };
