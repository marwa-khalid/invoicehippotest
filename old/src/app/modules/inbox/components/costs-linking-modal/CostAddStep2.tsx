import { FC } from "react";
import { useIntl } from "react-intl";
import Select from "react-select";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { FormikProps } from "formik";
import {
  CostItem,
  CostPostResult,
} from "../../../accounting/costs/components/core/_models";
import { useAuth } from "../../../auth";
import enums from "../../../../../_metronic/i18n/messages/invoicehippo.enums.json";
import { get } from "lodash";
type Props = {
  formik: FormikProps<CostPostResult>;
  ledgers: any;
  vatTypes: any;
  refreshTotal: boolean;
  setRefreshTotal: (type: boolean) => void;
};

const CostAddStep2: FC<Props> = ({
  formik,
  ledgers,
  vatTypes,
  refreshTotal,
  setRefreshTotal,
}) => {
  const intl = useIntl();
  const auth = useAuth();

  const errorMessage = get(formik.errors, "header.totalValidationAmount");
  const handleInputChange = (index: number, field: string, value: any) => {
    const updatedProducts = [...formik.values.products];
    updatedProducts[index] = { ...updatedProducts[index], [field]: value };

    if (field === "ledgerAccountId") {
      updatedProducts[index] = {
        ...updatedProducts[index],
        ["vatTypeId"]: 0,
      };
    }
    formik.setFieldValue("products", updatedProducts);
  };
  const { currentUser } = useAuth();
  const handleAddRow = (e: any, costItem: CostItem) => {
    e.preventDefault();
    const newRow = {
      productId: 0,
      description: "",
      totalPrice: 0,
      totalPriceIsExVat: costItem.totalPriceIsExVat,
      ledgerAccountId: costItem.ledgerAccountId,
      vatTypeId: costItem.vatTypeId,
    };
    formik.setFieldValue("products", [...formik.values.products, newRow]);
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

    formik.setFieldValue("products", updatedProducts);
  };

  const getFilteredVatTypes = (ledgerAccountId: number) => {
    if (!ledgerAccountId) return vatTypes; // Return all if no ledger selected

    // Find the selected ledger
    const selectedLedger = ledgers
      .flatMap((group: any) => group.options)
      .find((ledger: any) => ledger.value === ledgerAccountId);

    if (!selectedLedger) return vatTypes; // Return all if no matching ledger

    // Find the corresponding Bearing Type in enums
    const bearingType = enums.BearingTypes.find(
      (type: any) => type.Value === selectedLedger.bearingType
    );

    if (!bearingType) return vatTypes; // Return all if no matching bearing type

    // Return VAT types based on bearingType properties
    if (bearingType.IsAccountTypeOmzet) {
      return [vatTypes[0]]; // Show only 'Inkomsten' VAT types
    } else if (bearingType.IsAccountTypeCost) {
      return [vatTypes[1]]; // Show only 'Kosten' VAT types
    } else {
      return vatTypes; // Show all VAT types
    }
  };

  return (
    <div className="modal-body" id="#kt_tab_pane_5">
      <form className="form" noValidate>
        <div className="d-flex justify-content-between align-items-center mb-5">
          {/* Left Section: Title and Subtitle */}
          <div>
            <h2>
              {intl.formatMessage({
                id: "Fields.CostItemsRegionTitle",
              })}
            </h2>
            <span className="text-muted">
              {intl.formatMessage({
                id: "Fields.CostItemsRegionSubTitle",
              })}
            </span>
          </div>

          {/* Right Section: Amount */}
          <div className="d-flex flex-column align-items-end">
            <div className="form-check form-switch d-flex flex-row-reverse align-items-center gap-2">
              <input
                className="form-check-input h-20px w-40px cursor-pointer"
                type="checkbox"
                id="isBtwExclusiveSwitch"
                checked={formik.values.header.validateTotalAmountWithoutVat}
                onChange={(e) =>
                  formik.setFieldValue(
                    "header.validateTotalAmountWithoutVat",
                    !formik.values.header.validateTotalAmountWithoutVat
                  )
                }
              />
              <label
                className="form-check-label fs-sm text-muted me-15"
                htmlFor="btwExclusiveSwitch"
              >
                {intl.formatMessage({
                  id: "Fields.BtwExclusive",
                })}
              </label>
            </div>

            <div className="d-flex position-relative align-items-center mt-4">
              <label
                className="required text-muted w-100 me-n20"
                htmlFor="amount"
              >
                {intl.formatMessage({
                  id: "Fields.TotalValidationAmount",
                })}
              </label>

              <div className="input-group flex-nowrap">
                <span className="input-group-text me-1" id="basic-addon1">
                  {currentUser?.result.activeCompanyDefaults.defaultValuta.sign}
                </span>

                <input
                  id="amount"
                  type="number"
                  {...formik.getFieldProps("header.totalValidationAmount")}
                  className="form-control form-control-solid"
                  aria-label="TotalValidationAmount"
                  aria-describedby="basic-addon1"
                />
              </div>
            </div>
          </div>
        </div>

        <div
          className="d-flex alert alert-custom alert-default bg-secondary align-items-center "
          role="alert"
        >
          <div className="alert-icon col-1 me-4">
            <i className="ki-duotone ki-information-4 fs-3x text-center text-primary">
              <span className="path1"></span>
              <span className="path2"></span>
              <span className="path3"></span>
            </i>
          </div>
          <div className="alert-text col-10 d-flex flex-column">
            <span
              dangerouslySetInnerHTML={{
                __html: intl.formatMessage({
                  id: "Fields.TotalValidationAmountInfo",
                }),
              }}
            />
          </div>
        </div>

        {/* Editable Table with Drag and Drop */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="costItems">
            {(provided) => (
              <table
                className="table gs-3 gy-3"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <thead>
                  <tr className="fw-bold text-muted">
                    <th style={{ width: "50px" }}></th>
                    <th className="required">
                      {intl
                        .formatMessage({ id: "Fields.Amount" })
                        .toUpperCase()}
                    </th>
                    <th className="required w-100px">
                      {intl
                        .formatMessage({ id: "Fields.LedgerAccount" })
                        .toUpperCase()}
                    </th>
                    <th>
                      {intl
                        .formatMessage({ id: "Fields.VatRegistrationType" })
                        .toUpperCase()}
                    </th>
                    <th>
                      {intl
                        .formatMessage({ id: "Fields.BtwExclusive" })
                        .toUpperCase()}
                    </th>
                    <th></th>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td
                      colSpan={6}
                      style={{
                        borderTop: "1px dotted #d6d4ce",
                        width: "100%",
                        margin: "0",
                      }}
                    />
                  </tr>
                  {formik.values.products.map(
                    (costItem: CostItem, index: number) => (
                      <Draggable
                        key={index}
                        draggableId={index.toString()}
                        index={index}
                      >
                        {(provided) => (
                          <>
                            <tr
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                            >
                              <td
                                style={{ width: "50px", textAlign: "center" }}
                              >
                                <span
                                  {...provided.dragHandleProps}
                                  className="btn btn-icon btn-sm btn-light drag-handle"
                                  style={{ cursor: "grab" }}
                                >
                                  <i className="ki-duotone ki-arrow-mix text-muted fs-1">
                                    <span className="path1"></span>
                                    <span className="path2"></span>
                                  </i>
                                </span>
                              </td>
                              <td className="w-150px">
                                <div className="input-group">
                                  <span
                                    className="input-group-text me-1"
                                    id="basic-addon1"
                                    style={{ height: "38px" }}
                                  >
                                    {
                                      currentUser?.result.activeCompanyDefaults
                                        .defaultValuta.sign
                                    }
                                  </span>
                                  <input
                                    type="number"
                                    style={{ height: "38px" }}
                                    className="form-control form-control-solid border-0 p-3"
                                    value={costItem.totalPrice}
                                    onChange={(e) =>
                                      handleInputChange(
                                        index,
                                        "totalPrice",
                                        parseFloat(e.target.value)
                                      )
                                    }
                                  />
                                </div>
                                {costItem.vatTypeId !== 0 &&
                                  costItem.totalPrice > 0 && (
                                    <div
                                      className="text-muted mt-2"
                                      style={{
                                        fontFamily: "monospace",
                                        width: "100%",
                                      }}
                                    >
                                      {(() => {
                                        const vatEntry = vatTypes
                                          .flatMap(
                                            (group: any) => group.options
                                          )
                                          .find((vat: any) => {
                                            return (
                                              vat.value === costItem.vatTypeId
                                            );
                                          });

                                        const vatPercentage = vatEntry?.amount
                                          ? vatEntry.amount
                                          : NaN;
                                        const isAlwaysExBtw =
                                          vatEntry?.isAlwaysExBtw;
                                        const currencySign =
                                          auth.currentUser?.result
                                            .activeCompanyDefaults.defaultValuta
                                            .sign;

                                        const basePrice =
                                          isAlwaysExBtw ||
                                          costItem.totalPriceIsExVat ||
                                          isNaN(vatPercentage)
                                            ? costItem.totalPrice
                                            : costItem.totalPrice /
                                              (1 + vatPercentage / 100);

                                        const vatAmount = isNaN(vatPercentage)
                                          ? 0
                                          : basePrice * (vatPercentage / 100);

                                        return (
                                          <>
                                            <div className="d-flex justify-content-between px-2">
                                              <span>
                                                {intl.formatMessage({
                                                  id: "Fields.Amount",
                                                })}{" "}
                                                {costItem.totalPriceIsExVat
                                                  ? "(inc):"
                                                  : "(exc):"}
                                              </span>
                                              <span>
                                                {currencySign}
                                                {costItem.totalPriceIsExVat
                                                  ? (
                                                      basePrice + vatAmount
                                                    ).toFixed(2)
                                                  : basePrice.toFixed(2)}
                                              </span>
                                            </div>
                                            <div className="d-flex justify-content-between px-2">
                                              <span>
                                                {intl.formatMessage({
                                                  id: "Fields.VatTitle",
                                                })}
                                                :
                                              </span>
                                              <span>
                                                {currencySign}
                                                {vatAmount.toFixed(2)}
                                              </span>
                                            </div>
                                          </>
                                        );
                                      })()}
                                    </div>
                                  )}
                              </td>

                              <td className="w-250px">
                                <Select
                                  value={
                                    ledgers
                                      .flatMap((group: any) => group.options)
                                      .find(
                                        (option: any) =>
                                          option.value ===
                                          costItem.ledgerAccountId
                                      ) || null
                                  }
                                  className="react-select-styled"
                                  options={ledgers}
                                  onChange={(e) => {
                                    handleInputChange(
                                      index,
                                      "ledgerAccountId",
                                      e?.value
                                    );
                                  }}
                                  placeholder={intl.formatMessage({
                                    id: "Fields.SelectOptionDefaultLedgerAccount",
                                  })}
                                />
                              </td>

                              <td className="w-150px">
                                <Select
                                  value={
                                    costItem.vatTypeId !== 0 &&
                                    vatTypes
                                      .flatMap((group: any) =>
                                        group.options.map((item: any) => ({
                                          value: item.value,
                                          label: item.label,
                                        }))
                                      )
                                      .find(
                                        (vat: any) =>
                                          vat.value === costItem.vatTypeId
                                      )
                                  }
                                  className="react-select-styled"
                                  options={getFilteredVatTypes(
                                    costItem.ledgerAccountId
                                  )}
                                  isClearable
                                  onChange={(e: any) =>
                                    handleInputChange(
                                      index,
                                      "vatTypeId",
                                      e?.value
                                    )
                                  }
                                  placeholder={intl.formatMessage({
                                    id: "Fields.SelectOptionNoVatType",
                                  })}
                                />
                              </td>

                              <td>
                                <div className="custom-switch-vat mt-1 ms-2 d-flex align-items-center mb-7 position-relative">
                                  <input
                                    className="custom-input-vat"
                                    type="checkbox"
                                    id={`toggle-${index}`}
                                    checked={costItem.totalPriceIsExVat}
                                    onChange={() =>
                                      handleInputChange(
                                        index,
                                        "totalPriceIsExVat",
                                        !costItem.totalPriceIsExVat
                                      )
                                    }
                                  />
                                  <label
                                    className={`custom-label-vat ${
                                      costItem.totalPriceIsExVat
                                        ? "bg-gray-200"
                                        : "bg-primary"
                                    }`}
                                    htmlFor={`toggle-${index}`}
                                  >
                                    {costItem.totalPriceIsExVat
                                      ? "exc. vat"
                                      : "inc. vat"}
                                  </label>
                                </div>
                              </td>

                              <td className="text-end">
                                {formik.values.products.length === 1 ? (
                                  // Other rows: Only show the remove button
                                  <button
                                    className="btn btn-icon btn-light btn-sm"
                                    onClick={(e) => handleAddRow(e, costItem)}
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
                                      onClick={(e) => handleAddRow(e, costItem)}
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
                            <tr>
                              <td></td>
                              {/* Ensure each row has valid td elements */}
                              <td colSpan={3} className="pt-0">
                                <div>
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={costItem.description || ""} // Prevent undefined issues
                                    onChange={(e) =>
                                      handleInputChange(
                                        index,
                                        "description",
                                        e.target.value
                                      )
                                    }
                                  />
                                </div>
                              </td>
                            </tr>
                            {index <= formik.values.products.length - 1 && (
                              <tr>
                                <td
                                  colSpan={6}
                                  style={{
                                    borderTop: "1px dotted #d6d4ce",
                                    width: "100%",
                                    margin: "0",
                                  }}
                                />
                              </tr>
                            )}
                          </>
                        )}
                      </Draggable>
                    )
                  )}
                  {provided.placeholder}
                </tbody>
              </table>
            )}
          </Droppable>
        </DragDropContext>
      </form>

      {errorMessage && (
        <div
          className="d-flex alert alert-custom alert-default align-items-center"
          style={{ backgroundColor: "#FFF4DE" }}
          role="alert"
        >
          <div className="alert-icon col-1 me-4">
            <i className="ki-duotone ki-information-4 fs-3x text-center text-warning">
              <span className="path1"></span>
              <span className="path2"></span>
              <span className="path3"></span>
            </i>
          </div>
          <div className="alert-text col-10 d-flex flex-column text-warning">
            <span
              dangerouslySetInnerHTML={{
                __html: errorMessage,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export { CostAddStep2 };
