import React, { FC, useState } from "react";
import { useIntl } from "react-intl";
import Select from "react-select";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { FormikProps } from "formik";
import { useAuth } from "../../../auth";
import * as Tooltip from "@radix-ui/react-tooltip";
import { DiscountAddModal } from "../../../admin-settings/discountmargins-list/discount-add-modal/DiscountAddModal";
import { InvoicePostResult } from "../core/_models";
import { ProductDetailModal } from "./ProductDetailModal";
import { LedgerAddModal } from "../../../admin-settings/ledgeraccounts-list/ledger-add-modal/LedgerAddModal";

type Props = {
  formik: FormikProps<InvoicePostResult>;
  ledgers: any;
  vatTypes: any;
  unitTypes: any;
  discountTypes: any;
  setProductPicker: (type: boolean) => void;
  setDiscountRefresh: (type: boolean) => void;
  discountRefresh: boolean;
  setLedgerRefresh: (type: boolean) => void;
  ledgerRefresh: boolean;
};

const InvoiceAddStep2: FC<Props> = ({
  formik,
  ledgers,
  vatTypes,
  unitTypes,
  discountTypes,
  setProductPicker,
  setDiscountRefresh,
  discountRefresh,
  setLedgerRefresh,
  ledgerRefresh,
}) => {
  const intl = useIntl();
  const [productModalOpen, setProductModalOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  const [productModalIndex, setProductModalIndex] = useState<number>();
  const [discountAddModalOpen, setDiscountAddModalOpen] =
    useState<boolean>(false);
  const [ledgerAddModalOpen, setLedgerAddModalOpen] = useState<boolean>(false);
  const auth = useAuth();

  const handleTempInputChange = (key: any, value: any) => {
    setSelectedProduct((prev: any) => ({ ...prev, [key]: value })); // update temporary state
  };

  const handleQuillChange = (key: any, content: string) => {
    setSelectedProduct((prev: any) => ({ ...prev, [key]: content }));
  };
  const handleSave = () => {
    formik.setFieldValue(`products[${productModalIndex}]`, selectedProduct); // update Formik with temp values
    setProductModalOpen(false);
  };

  const handleInputChange = (index: number, field: string, value: any) => {
    const updatedProducts = [...formik.values.products];
    updatedProducts[index] = { ...updatedProducts[index], [field]: value };
    formik.setFieldValue("products", updatedProducts);
  };

  const calculateTotal = (
    units: number,
    unitPrice: number,
    discountMarginId: null | number
  ) => {
    // Find the discount label from discount types
    let discount = discountTypes
      ?.map((item: any) => ({
        value: item.id,
        label: item.title,
      }))
      .find((discountType: any) => {
        return discountType.value === discountMarginId;
      })?.label;

    let total = units * unitPrice;

    if (discountMarginId != null && discount) {
      if (discount.includes("%")) {
        // Handle percentage discount
        let percentageValue = parseFloat(discount.replace("%", ""));
        let discountAmount = (total * percentageValue) / 100;
        return total - discountAmount;
      } else if (discount.includes("Euro")) {
        // Handle fixed Euro discount
        let euroValue = parseFloat(discount.replace(" Euro", ""));
        return total - euroValue;
      }
    }

    return total; // Return the original total if no discount applies
  };

  const handleAddRow = (product: any, e: any) => {
    e.preventDefault();

    const currentProducts = formik.values.products || [];

    // Get the max orderIndex from current products, or -1 if empty
    const maxOrderIndex = currentProducts.length
      ? Math.max(...currentProducts.map((p: any) => p.orderIndex ?? 0))
      : -1;

    const newRow = {
      productId: 0,
      title: "",
      units: 0,
      description: "",
      unitPrice: 0,
      companyUnitTypeId: product.companyUnitTypeId,
      btwExclusive: product.btwExclusive,
      includeLinkedProductDesciption: false,
      linkedProductDescription: "",
      linkedProductId: 0,
      ledgerAccountId: product.ledgerAccountId,
      vatTypeId: product.vatTypeId,
      discountMarginId: null,
      orderIndex: maxOrderIndex + 1,
    };

    formik.setFieldValue("products", [...currentProducts, newRow]);
  };

  const handleRemoveRow = (index: number, e: any) => {
    e.preventDefault();
    const updatedProducts = formik.values.products.filter(
      (_, rowIndex) => rowIndex !== index
    );
    formik.setFieldValue("products", updatedProducts);
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const updatedProducts = [...formik.values.products];
    const [reorderedItem] = updatedProducts.splice(result.source.index, 1);
    updatedProducts.splice(result.destination.index, 0, reorderedItem);

    // Reassign orderIndex based on new position
    const reorderedWithIndexes = updatedProducts.map((item, idx) => ({
      ...item,
      orderIndex: idx,
    }));

    formik.setFieldValue("products", reorderedWithIndexes);
  };

  return (
    <div className="modal-body" id="#kt_tab_pane_5">
      <form className="form" noValidate>
        {/* Button at the top-right corner */}
        <div className="d-flex justify-content-end mb-4">
          <button
            className="btn btn-primary d-inline-flex align-items-center"
            onClick={(e) => {
              e.preventDefault();
              setProductPicker(true);
            }}
          >
            <i className="la la-search-plus fs-2"></i>
            <span className="ms-2">
              {intl.formatMessage({
                id: "Fields.PickerProductToolTipSearch",
              })}
            </span>
          </button>
        </div>

        {/* Editable Table with Drag and Drop */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="products">
            {(provided) => (
              <table
                className="table gs-3 gy-3"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <thead>
                  <tr className="fw-bold text-muted">
                    <th className="w-300px">
                      {intl
                        .formatMessage({ id: "Fields.Product" })
                        .toUpperCase()}
                    </th>
                    <th className="w-150px">
                      {intl.formatMessage({ id: "Fields.Units" }).toUpperCase()}
                    </th>
                    <th className="w-150px"></th>
                    <th className="w-100px">
                      {intl
                        .formatMessage({ id: "Fields.UnitPrice" })
                        .toUpperCase()}
                    </th>
                    <th className="w-250px">
                      {intl
                        .formatMessage({ id: "Fields.VatTypeId" })
                        .toUpperCase()}
                    </th>
                    <th className="text-end" style={{ width: "130px" }}>
                      {intl.formatMessage({ id: "Fields.Total" }).toUpperCase()}
                    </th>

                    {/* <th className="w-150px"></th> */}
                  </tr>
                </thead>

                <tbody>
                  <tr className="mt-10">
                    <td
                      colSpan={7}
                      style={{
                        borderTop: "1px dotted #d6d4ce",
                        width: "100%",
                        margin: "0",
                      }}
                    />
                  </tr>
                  {formik.values.products.map((product, index) => (
                    <React.Fragment key={index}>
                      <Draggable
                        key={index}
                        draggableId={index.toString()}
                        index={index}
                      >
                        {(provided) => (
                          <>
                            <tr
                              onClick={() => setProductModalIndex(index)}
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                            >
                              <td>
                                <div className="d-flex align-items-center mb-2">
                                  <span
                                    {...provided.dragHandleProps} // Attach dragHandleProps here
                                    className="btn btn-icon btn-light btn-sm me-2 drag-handle px-2"
                                    style={{ cursor: "grab" }}
                                  >
                                    <i className="ki-duotone ki-arrow-mix text-muted fs-2">
                                      <span className="path1"></span>
                                      <span className="path2"></span>
                                    </i>
                                  </span>

                                  <Tooltip.Provider delayDuration={0}>
                                    <Tooltip.Root>
                                      <Tooltip.Trigger asChild>
                                        <button
                                          className="btn btn-icon btn-light btn-sm me-2 px-2 "
                                          onClick={(e) => {
                                            e.preventDefault();
                                            setProductModalOpen(true);
                                            setSelectedProduct(product);
                                          }}
                                        >
                                          <i className="ki-solid ki-pencil text-warning fs-2" />
                                        </button>
                                      </Tooltip.Trigger>

                                      <Tooltip.Portal>
                                        <Tooltip.Content
                                          side="top"
                                          className="app-tooltip"
                                        >
                                          {intl.formatMessage({
                                            id: "Fields.ToolTipEdit",
                                          })}
                                          <Tooltip.Arrow className="app-tooltip-arrow" />
                                        </Tooltip.Content>
                                      </Tooltip.Portal>
                                    </Tooltip.Root>
                                  </Tooltip.Provider>
                                  <Tooltip.Provider delayDuration={0}>
                                    <Tooltip.Root>
                                      <Tooltip.Trigger asChild>
                                        <input
                                          type="text"
                                          id={`title_${index}`}
                                          className="form-control form-control-solid border-0 p-3"
                                          value={product.title || ""}
                                          onChange={(e) =>
                                            handleInputChange(
                                              index,
                                              "title",
                                              e.target.value
                                            )
                                          }
                                        />
                                      </Tooltip.Trigger>

                                      <Tooltip.Portal>
                                        <Tooltip.Content
                                          side="top"
                                          className="app-tooltip"
                                        >
                                          {product.title}
                                          <Tooltip.Arrow className="app-tooltip-arrow" />
                                        </Tooltip.Content>
                                      </Tooltip.Portal>
                                    </Tooltip.Root>
                                  </Tooltip.Provider>
                                </div>

                                <div>
                                  <span className="text-muted fs-8 d-flex align-items-center mt-2">
                                    <i className="ki-duotone ki-file me-2 fs-4">
                                      <span className="path1"></span>
                                      <span className="path2"></span>
                                    </i>
                                    {
                                      ledgers?.find(
                                        (ledger: any) =>
                                          ledger.value ===
                                          product.ledgerAccountId
                                      )?.label
                                    }
                                  </span>
                                </div>
                              </td>
                              <td className="w-25px">
                                <input
                                  type="number"
                                  id={`units_${index}`}
                                  className="form-control form-control-solid border-0"
                                  value={product.units || 0}
                                  onChange={(e) =>
                                    handleInputChange(
                                      index,
                                      "units",
                                      Number(e.target.value)
                                    )
                                  }
                                  min="0.00"
                                  step="0.01"
                                />
                              </td>
                              <td>
                                <Select
                                  value={unitTypes?.find((unitType: any) => {
                                    return (
                                      unitType.value ===
                                      product.companyUnitTypeId
                                    );
                                  })}
                                  className="react-select-styled"
                                  options={unitTypes}
                                  onChange={(e: any) =>
                                    handleInputChange(
                                      index,
                                      "companyUnitTypeId",
                                      e.value
                                    )
                                  }
                                  inputId={`companyUnitType_${index}`}
                                  placeholder="Select UnitType"
                                />
                              </td>
                              <td>
                                <div className="d-flex align-items-center position-relative">
                                  <input
                                    type="number"
                                    id={`unitPrice_${index}`}
                                    className="form-control form-control-solid border-0 w-100px"
                                    value={product.unitPrice || 0}
                                    onChange={(e) =>
                                      handleInputChange(
                                        index,
                                        "unitPrice",
                                        Number(e.target.value)
                                      )
                                    }
                                    min="0.00"
                                    step="0.01"
                                  />
                                  <Tooltip.Provider delayDuration={0}>
                                    <Tooltip.Root>
                                      <Tooltip.Trigger asChild>
                                        <div
                                          className="circle"
                                          style={{
                                            position: "absolute",
                                            top: "-10px",
                                            right: "-10px",
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
                                        <Tooltip.Content
                                          side="top"
                                          className="app-tooltip"
                                        >
                                          <div
                                            style={{ fontFamily: "monospace" }}
                                          >
                                            <div
                                              className="table"
                                              style={{ width: "100%" }}
                                            >
                                              <div
                                                style={{ display: "table-row" }}
                                              >
                                                <div
                                                  style={{
                                                    display: "table-cell",
                                                    textAlign: "right",
                                                  }}
                                                  className="px-2"
                                                >
                                                  {/* Determine Amount title with (inc) or (exc) based on condition */}
                                                  {(() => {
                                                    const vatEntry = vatTypes
                                                      ?.map((item: any) => ({
                                                        value: item.id,
                                                        label: item.title,
                                                      }))
                                                      .find(
                                                        (vat: any) =>
                                                          vat.value ===
                                                          product.vatTypeId
                                                      );
                                                    const isAlwaysExBtw =
                                                      vatEntry?.isAlwaysExBtw;

                                                    // Determine if the title should include "inc" or "exc"
                                                    const amountTitle =
                                                      isAlwaysExBtw
                                                        ? intl.formatMessage({
                                                            id: "Fields.Amount",
                                                          })
                                                        : product.btwExclusive
                                                        ? `${intl.formatMessage(
                                                            {
                                                              id: "Fields.Amount",
                                                            }
                                                          )} (inc):`
                                                        : `${intl.formatMessage(
                                                            {
                                                              id: "Fields.Amount",
                                                            }
                                                          )} (exc):`;

                                                    return amountTitle;
                                                  })()}
                                                </div>
                                                <div
                                                  style={{
                                                    display: "table-cell",
                                                    textAlign: "right",
                                                  }}
                                                >
                                                  {/* Display the amount based on VAT inclusivity/exclusivity */}
                                                  {(() => {
                                                    const vatEntry = vatTypes
                                                      ?.map((item: any) => ({
                                                        value: item.id,
                                                        label: item.title,
                                                      }))
                                                      .find(
                                                        (vat: any) =>
                                                          vat.value ===
                                                          product.vatTypeId
                                                      );
                                                    const isAlwaysExBtw =
                                                      vatEntry?.isAlwaysExBtw;
                                                    const vatPercentage =
                                                      vatEntry
                                                        ? parseFloat(
                                                            vatEntry.label.replace(
                                                              "%",
                                                              ""
                                                            )
                                                          )
                                                        : NaN;

                                                    if (
                                                      isAlwaysExBtw ||
                                                      isNaN(vatPercentage)
                                                    ) {
                                                      return `${
                                                        auth.currentUser?.result
                                                          .activeCompanyDefaults
                                                          .defaultValuta.sign
                                                      }${product.unitPrice.toFixed(
                                                        2
                                                      )}`;
                                                    }

                                                    if (product.btwExclusive) {
                                                      const totalInclusive = (
                                                        product.unitPrice +
                                                        product.unitPrice *
                                                          (vatPercentage / 100)
                                                      ).toFixed(2);

                                                      return `${auth.currentUser?.result.activeCompanyDefaults.defaultValuta.sign}${totalInclusive}`;
                                                    } else {
                                                      const basePriceExclusive =
                                                        (
                                                          product.unitPrice /
                                                          (1 +
                                                            vatPercentage / 100)
                                                        ).toFixed(2);

                                                      return `${auth.currentUser?.result.activeCompanyDefaults.defaultValuta.sign}${basePriceExclusive}`;
                                                    }
                                                  })()}
                                                </div>
                                              </div>

                                              <div
                                                style={{ display: "table-row" }}
                                              >
                                                <div
                                                  className="px-2"
                                                  style={{
                                                    display: "table-cell",
                                                    textAlign: "right",
                                                  }}
                                                >
                                                  {/* Display VAT title with calculated VAT value */}
                                                  {intl.formatMessage({
                                                    id: "Fields.VatTitle",
                                                  })}
                                                  :
                                                </div>
                                                <div
                                                  style={{
                                                    display: "table-cell",
                                                    textAlign: "right",
                                                  }}
                                                >
                                                  {(() => {
                                                    const vatEntry = vatTypes
                                                      ?.map((item: any) => ({
                                                        value: item.id,
                                                        label: item.title,
                                                      }))
                                                      .find(
                                                        (vat: any) =>
                                                          vat.value ===
                                                          product.vatTypeId
                                                      );
                                                    const isAlwaysExBtw =
                                                      vatEntry?.isAlwaysExBtw;
                                                    const vatPercentage =
                                                      vatEntry
                                                        ? parseFloat(
                                                            vatEntry.label.replace(
                                                              "%",
                                                              ""
                                                            )
                                                          )
                                                        : NaN;

                                                    if (
                                                      isAlwaysExBtw ||
                                                      isNaN(vatPercentage)
                                                    ) {
                                                      return `${auth.currentUser?.result.activeCompanyDefaults.defaultValuta.sign}0.00`;
                                                    }

                                                    if (product.btwExclusive) {
                                                      const vatAmountInclusive =
                                                        (
                                                          product.unitPrice *
                                                          (vatPercentage / 100)
                                                        ).toFixed(2);

                                                      return `${auth.currentUser?.result.activeCompanyDefaults.defaultValuta.sign}${vatAmountInclusive}`;
                                                    } else {
                                                      const basePriceExclusive =
                                                        product.unitPrice /
                                                        (1 +
                                                          vatPercentage / 100);
                                                      const vatAmountExclusive =
                                                        (
                                                          product.unitPrice -
                                                          basePriceExclusive
                                                        ).toFixed(2);

                                                      return `${auth.currentUser?.result.activeCompanyDefaults.defaultValuta.sign}${vatAmountExclusive}`;
                                                    }
                                                  })()}
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                          <Tooltip.Arrow className="app-tooltip-arrow" />
                                        </Tooltip.Content>
                                      </Tooltip.Portal>
                                    </Tooltip.Root>
                                  </Tooltip.Provider>
                                </div>
                              </td>

                              <td className="w-200px">
                                <Select
                                  value={vatTypes
                                    ?.map((item: any) => ({
                                      value: item.id,
                                      label: item.title,
                                    }))
                                    .find((vat: any) => {
                                      return vat.value === product.vatTypeId;
                                    })}
                                  className="react-select-styled"
                                  options={vatTypes?.map((item: any) => ({
                                    value: item.id,
                                    label: item.title,
                                  }))}
                                  onChange={(e: any) =>
                                    handleInputChange(
                                      index,
                                      "vatTypeId",
                                      e.value
                                    )
                                  }
                                  inputId={`vatType_${index}`}
                                  placeholder="Select VAT"
                                />
                              </td>

                              <td>
                                <div className="d-flex flex-column text-end position-relative">
                                  <span className="fw-bold cursor-pointer mt-2">
                                    {
                                      auth.currentUser?.result
                                        .activeCompanyDefaults.defaultValuta
                                        .sign
                                    }{" "}
                                    {calculateTotal(
                                      product.units,
                                      product.unitPrice,
                                      product.discountMarginId
                                    ).toFixed(2)}
                                  </span>

                                  {product.discountMarginId && (
                                    <small className="text-danger">
                                      -
                                      {
                                        discountTypes
                                          ?.map((item: any) => ({
                                            value: item.id,
                                            label: item.title,
                                          }))
                                          .find(
                                            (discountType: any) =>
                                              discountType.value ===
                                              product.discountMarginId
                                          )?.label
                                      }
                                    </small>
                                  )}
                                  <Tooltip.Provider delayDuration={0}>
                                    <Tooltip.Root>
                                      <Tooltip.Trigger asChild>
                                        <div
                                          className="circle"
                                          style={{
                                            position: "absolute",
                                            top: "-10px",
                                            right: "-17px",
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
                                        <Tooltip.Content
                                          side="top"
                                          className="app-tooltip"
                                        >
                                          <div
                                            style={{ fontFamily: "monospace" }}
                                          >
                                            <div
                                              className="table"
                                              style={{ width: "100%" }}
                                            >
                                              <div
                                                style={{ display: "table-row" }}
                                              >
                                                <div
                                                  className="px-2"
                                                  style={{
                                                    display: "table-cell",
                                                    textAlign: "right",
                                                  }}
                                                >
                                                  {/* Calculate Amount Title with (inc) or (exc) */}
                                                  {(() => {
                                                    const vatEntry = vatTypes
                                                      ?.map((item: any) => ({
                                                        value: item.id,
                                                        label: item.title,
                                                      }))
                                                      .find(
                                                        (vat: any) =>
                                                          vat.value ===
                                                          product.vatTypeId
                                                      );
                                                    const isAlwaysExBtw =
                                                      vatEntry?.isAlwaysExBtw;

                                                    const amountTitle =
                                                      isAlwaysExBtw
                                                        ? intl.formatMessage({
                                                            id: "Fields.Amount",
                                                          })
                                                        : product.btwExclusive
                                                        ? `${intl.formatMessage(
                                                            {
                                                              id: "Fields.Amount",
                                                            }
                                                          )} (inc):`
                                                        : `${intl.formatMessage(
                                                            {
                                                              id: "Fields.Amount",
                                                            }
                                                          )} (exc):`;

                                                    return amountTitle;
                                                  })()}
                                                </div>
                                                <div
                                                  style={{
                                                    display: "table-cell",
                                                    textAlign: "right",
                                                  }}
                                                >
                                                  {(() => {
                                                    const vatEntry = vatTypes
                                                      ?.map((item: any) => ({
                                                        value: item.id,
                                                        label: item.title,
                                                      }))
                                                      .find(
                                                        (vat: any) =>
                                                          vat.value ===
                                                          product.vatTypeId
                                                      );
                                                    const isAlwaysExBtw =
                                                      vatEntry?.isAlwaysExBtw;
                                                    const vatPercentage =
                                                      vatEntry
                                                        ? parseFloat(
                                                            vatEntry.label.replace(
                                                              "%",
                                                              ""
                                                            )
                                                          )
                                                        : NaN;

                                                    if (
                                                      isAlwaysExBtw ||
                                                      isNaN(vatPercentage)
                                                    ) {
                                                      return `${
                                                        auth.currentUser?.result
                                                          .activeCompanyDefaults
                                                          .defaultValuta.sign
                                                      }${(
                                                        product.unitPrice *
                                                        product.units
                                                      ).toFixed(2)}`;
                                                    }

                                                    if (product.btwExclusive) {
                                                      const totalInclusive = (
                                                        product.unitPrice +
                                                        product.unitPrice *
                                                          (vatPercentage / 100)
                                                      ).toFixed(2);

                                                      return `${
                                                        auth.currentUser?.result
                                                          .activeCompanyDefaults
                                                          .defaultValuta.sign
                                                      }${(
                                                        parseFloat(
                                                          totalInclusive
                                                        ) * product.units
                                                      ).toFixed(2)}`;
                                                    } else {
                                                      const basePriceExclusive =
                                                        (
                                                          product.unitPrice /
                                                          (1 +
                                                            vatPercentage / 100)
                                                        ).toFixed(2);

                                                      return `${
                                                        auth.currentUser?.result
                                                          .activeCompanyDefaults
                                                          .defaultValuta.sign
                                                      }${(
                                                        parseFloat(
                                                          basePriceExclusive
                                                        ) * product.units
                                                      ).toFixed(2)}`;
                                                    }
                                                  })()}
                                                </div>
                                              </div>

                                              <div
                                                style={{ display: "table-row" }}
                                              >
                                                <div
                                                  className="px-2"
                                                  style={{
                                                    display: "table-cell",
                                                    textAlign: "right",
                                                  }}
                                                >
                                                  {intl.formatMessage({
                                                    id: "Fields.VatTitle",
                                                  })}
                                                  :
                                                </div>
                                                <div
                                                  style={{
                                                    display: "table-cell",
                                                    textAlign: "right",
                                                  }}
                                                >
                                                  {(() => {
                                                    const vatEntry = vatTypes
                                                      ?.map((item: any) => ({
                                                        value: item.id,
                                                        label: item.title,
                                                      }))
                                                      .find(
                                                        (vat: any) =>
                                                          vat.value ===
                                                          product.vatTypeId
                                                      );
                                                    const isAlwaysExBtw =
                                                      vatEntry?.isAlwaysExBtw;
                                                    const vatPercentage =
                                                      vatEntry
                                                        ? parseFloat(
                                                            vatEntry.label.replace(
                                                              "%",
                                                              ""
                                                            )
                                                          )
                                                        : NaN;

                                                    if (
                                                      isAlwaysExBtw ||
                                                      isNaN(vatPercentage)
                                                    ) {
                                                      return `${auth.currentUser?.result.activeCompanyDefaults.defaultValuta.sign}0.00`;
                                                    }

                                                    if (product.btwExclusive) {
                                                      const vatAmountInclusive =
                                                        (
                                                          product.unitPrice *
                                                          (vatPercentage / 100)
                                                        ).toFixed(2);

                                                      return `${
                                                        auth.currentUser?.result
                                                          .activeCompanyDefaults
                                                          .defaultValuta.sign
                                                      }${(
                                                        parseFloat(
                                                          vatAmountInclusive
                                                        ) * product.units
                                                      ).toFixed(2)}`;
                                                    } else {
                                                      const basePriceExclusive =
                                                        product.unitPrice /
                                                        (1 +
                                                          vatPercentage / 100);
                                                      const vatAmountExclusive =
                                                        (
                                                          product.unitPrice -
                                                          basePriceExclusive
                                                        ).toFixed(2);

                                                      return `${
                                                        auth.currentUser?.result
                                                          .activeCompanyDefaults
                                                          .defaultValuta.sign
                                                      }${(
                                                        parseFloat(
                                                          vatAmountExclusive
                                                        ) * product.units
                                                      ).toFixed(2)}`;
                                                    }
                                                  })()}
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                          <Tooltip.Arrow className="app-tooltip-arrow" />
                                        </Tooltip.Content>
                                      </Tooltip.Portal>
                                    </Tooltip.Root>
                                  </Tooltip.Provider>
                                </div>
                              </td>

                              <td className="w-150px text-end">
                                {formik.values.products.length === 1 ? (
                                  // Other rows: Only show the remove button
                                  <button
                                    className="btn btn-icon btn-light btn-sm"
                                    onClick={(e) => handleAddRow(product, e)}
                                  >
                                    <i className="ki-solid ki-plus text-success fs-2" />
                                  </button>
                                ) : index ===
                                  formik.values.products.length - 1 ? (
                                  // Last row: Show both add and remove buttons
                                  <>
                                    <button
                                      className="btn btn-icon btn-light btn-sm me-2"
                                      onClick={(e) => handleRemoveRow(index, e)}
                                    >
                                      <i className="ki-solid ki-minus text-danger fs-2" />
                                    </button>
                                    <button
                                      className="btn btn-icon btn-light btn-sm"
                                      onClick={(e) => handleAddRow(product, e)}
                                    >
                                      <i className="ki-solid ki-plus text-success fs-2" />
                                    </button>
                                  </>
                                ) : (
                                  // Other rows: Only show the remove button
                                  <button
                                    className="btn btn-icon btn-light btn-sm"
                                    onClick={(e) => handleRemoveRow(index, e)}
                                  >
                                    <i className="ki-solid ki-minus text-danger fs-2" />
                                  </button>
                                )}
                              </td>
                            </tr>
                            {product.description && (
                              <tr>
                                <td colSpan={7}>
                                  {" "}
                                  <span
                                    dangerouslySetInnerHTML={{
                                      __html: product.description,
                                    }}
                                  />
                                </td>
                              </tr>
                            )}
                            <tr>
                              <td
                                colSpan={7}
                                style={{
                                  borderTop: "1px dotted #d6d4ce",
                                  width: "100%",
                                  margin: "0",
                                }}
                              />
                            </tr>
                          </>
                        )}
                      </Draggable>
                    </React.Fragment>
                  ))}
                  {provided.placeholder}
                </tbody>
              </table>
            )}
          </Droppable>
        </DragDropContext>
      </form>

      {productModalOpen && (
        <ProductDetailModal
          setProductModalOpen={setProductModalOpen}
          setLedgerAddModalOpen={setLedgerAddModalOpen}
          selectedProduct={selectedProduct}
          handleTempInputChange={handleTempInputChange}
          ledgers={ledgers}
          setDiscountAddModalOpen={setDiscountAddModalOpen}
          discountTypes={discountTypes}
          handleQuillChange={handleQuillChange}
          handleSave={handleSave}
        />
      )}
      {discountAddModalOpen && (
        <DiscountAddModal
          setRefresh={setDiscountRefresh}
          refresh={discountRefresh}
          setAddModalOpen={setDiscountAddModalOpen}
        />
      )}
      {ledgerAddModalOpen && (
        <LedgerAddModal
          setRefresh={setLedgerRefresh}
          refresh={ledgerRefresh}
          setAddModalOpen={setLedgerAddModalOpen}
          fromInvoice={true}
        />
      )}
    </div>
  );
};

export { InvoiceAddStep2 };
