import React, { FC, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { Tooltip } from "@chakra-ui/react";
import Select from "react-select";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import { FormikProps } from "formik";
import { FormValues } from "./QuoteAddStep1";
import { KTIcon, KTSVG } from "../../../../../../_metronic/helpers";
import ReactQuill from "react-quill";
import { ProductPicker } from "./ProductPicker";
import { useAuth } from "../../../../auth";
type Props = {
  clientId: number;
  refresh: boolean;
  formik: FormikProps<FormValues>;
  ledgers: any;
  vatTypes: any;
  unitTypes: any;
  discountTypes: any;
};

const QuoteAddStep2: FC<Props> = ({
  clientId,
  refresh,
  formik,
  ledgers,
  vatTypes,
  unitTypes,
  discountTypes,
}) => {
  const intl = useIntl();
  const [productModalOpen, setProductModalOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [productPicker, setProductPicker] = useState<any>();
  const [productModalIndex, setProductModalIndex] = useState<number>();
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
    let discount = discountTypes.find((discountType: any) => {
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
      orderIndex: 0,
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

  return (
    <div className="modal-body" id="#kt_tab_pane_5">
      <form className="form p-3" noValidate>
        <div className="container">
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
                      <th>
                        {intl
                          .formatMessage({ id: "Fields.Product" })
                          .toUpperCase()}
                      </th>
                      <th className="w-100px">
                        {intl
                          .formatMessage({ id: "Fields.Units" })
                          .toUpperCase()}
                      </th>
                      <th></th>
                      <th className="w-100px">
                        {intl
                          .formatMessage({ id: "Fields.UnitPrice" })
                          .toUpperCase()}
                      </th>
                      <th>
                        {intl
                          .formatMessage({ id: "Fields.VatTypeId" })
                          .toUpperCase()}
                      </th>
                      <th>
                        {intl
                          .formatMessage({ id: "Fields.Total" })
                          .toUpperCase()}
                      </th>
                    </tr>
                  </thead>
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
                  <tbody>
                    {formik.values.products.map((product, index) => (
                      <>
                        {productModalOpen && productModalIndex === index && (
                          <div
                            className="modal fade show d-block"
                            tabIndex={-1}
                            role="dialog"
                            id="additional_add_modal"
                            aria-modal="true"
                          >
                            <div
                              className="modal-dialog"
                              style={{ minWidth: "600px" }}
                            >
                              <div className="modal-content">
                                <div className="modal-header bg-dark d-flex justify-content-between">
                                  <h5 className="modal-title text-white">
                                    {intl.formatMessage({
                                      id: "Fields.ModalTitleEditUpdateProduct",
                                    })}
                                  </h5>
                                  <div
                                    className="btn btn-icon btn-sm ms-2"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                    onClick={() => setProductModalOpen(false)}
                                  >
                                    <KTSVG
                                      path="media/icons/duotune/arrows/arr061.svg"
                                      className="svg-icon svg-icon-2x text-white"
                                    />
                                  </div>
                                </div>
                                <div className="modal-body">
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
                                        checked={
                                          selectedProduct.btwExclusive || false
                                        }
                                        onChange={(e) =>
                                          handleTempInputChange(
                                            "btwExclusive",
                                            e.target.checked
                                          )
                                        }
                                      />
                                    </div>
                                  </div>
                                  <div className="row mb-5">
                                    <input
                                      type="text"
                                      onChange={(e) =>
                                        handleTempInputChange(
                                          "title",
                                          e.target.value
                                        )
                                      }
                                      value={selectedProduct.title || ""}
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
                                            ledger.value ===
                                            selectedProduct.ledgerAccountId
                                        )}
                                        className="react-select-styled"
                                        options={ledgers}
                                        onChange={(e) =>
                                          handleTempInputChange(
                                            "ledgerAccountId",
                                            e?.value
                                          )
                                        }
                                        placeholder={intl.formatMessage({
                                          id: "Fields.LedgerAccount",
                                        })}
                                      />
                                    </div>
                                    <div className="fv-row col-4">
                                      <label className="fw-bold fs-6 mb-3">
                                        {intl.formatMessage({
                                          id: "Fields.TotalDiscountSummary",
                                        })}
                                      </label>
                                      <Select
                                        value={discountTypes?.find(
                                          (discountType: any) =>
                                            discountType.value ===
                                            selectedProduct.discountMarginId
                                        )}
                                        className="react-select-styled"
                                        options={discountTypes}
                                        onChange={(e) =>
                                          handleTempInputChange(
                                            "discountMarginId",
                                            e?.value
                                          )
                                        }
                                        isClearable
                                        placeholder={intl.formatMessage({
                                          id: "Fields.TotalDiscountSummary",
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
                                        {intl.formatMessage({
                                          id: "Fields.Description",
                                        })}
                                      </a>
                                    </li>
                                  </ul>

                                  <div
                                    className="tab-content"
                                    id="myTabContent"
                                  >
                                    <div
                                      className="tab-pane fade show active"
                                      id="kt_tab_pane_1"
                                      role="tabpanel"
                                    >
                                      <div className="row d-flex mb-5">
                                        <ReactQuill
                                          theme="snow"
                                          placeholder="Jouw tekst hier..."
                                          style={{ height: "300px" }}
                                          onChange={(content) =>
                                            handleQuillChange(
                                              "description",
                                              content
                                            )
                                          }
                                          value={
                                            selectedProduct.description || ""
                                          }
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="modal-footer">
                                  <button
                                    type="button"
                                    className="btn btn-secondary"
                                    data-bs-dismiss="modal"
                                    onClick={() => setProductModalOpen(false)}
                                  >
                                    {intl.formatMessage({
                                      id: "Fields.ActionClose",
                                    })}
                                  </button>
                                  <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={handleSave}
                                  >
                                    {intl.formatMessage({
                                      id: "Fields.SearchApplyBtn",
                                    })}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

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
                                {...provided.dragHandleProps}
                              >
                                <td>
                                  <div className="d-flex align-items-center mb-2">
                                    <Tooltip
                                      label={intl.formatMessage({
                                        id: "Fields.ToolTipEdit",
                                      })}
                                      fontSize="sm"
                                      className="bg-gray-800 text-white p-2 rounded"
                                      placement="top"
                                    >
                                      <button
                                        className="btn btn-icon btn-light btn-sm me-2"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          setProductModalOpen(true);
                                          setSelectedProduct(product);
                                        }}
                                      >
                                        <i className="ki-solid ki-pencil text-warning fs-2" />
                                      </button>
                                    </Tooltip>
                                    <input
                                      type="text"
                                      className="form-control form-control-solid border-0 p-3"
                                      value={product.title}
                                      onChange={(e) =>
                                        handleInputChange(
                                          index,
                                          "title",
                                          e.target.value
                                        )
                                      }
                                    />
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
                                <td>
                                  <input
                                    type="number"
                                    className="form-control form-control-solid border-0 w-100px"
                                    value={product.units}
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
                                    placeholder="Select UnitType"
                                  />
                                </td>

                                <td>
                                  <input
                                    type="number"
                                    className="form-control form-control-solid border-0 w-100px"
                                    value={product.unitPrice}
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
                                </td>
                                <td>
                                  <Select
                                    value={vatTypes?.find(
                                      (vat: any) =>
                                        vat.value === product.vatTypeId
                                    )}
                                    className="react-select-styled"
                                    options={vatTypes}
                                    onChange={(e: any) =>
                                      handleInputChange(
                                        index,
                                        "vatTypeId",
                                        e.value
                                      )
                                    }
                                    placeholder="Select VAT"
                                  />
                                </td>
                                <td className="text-center ">
                                  <div className="d-flex flex-column">
                                    <span className="fw-bold">
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

                                    {product.discountMarginId != null && (
                                      <span className="text-danger">
                                        -
                                        {
                                          discountTypes.find(
                                            (discountType: any) => {
                                              return (
                                                discountType.value ===
                                                product.discountMarginId
                                              );
                                            }
                                          )?.label
                                        }
                                      </span>
                                    )}
                                  </div>
                                </td>
                                <td className="text-end">
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
                                        onClick={(e) =>
                                          handleRemoveRow(index, e)
                                        }
                                      >
                                        <i className="ki-solid ki-minus text-danger fs-2" />
                                      </button>
                                      <button
                                        className="btn btn-icon btn-light btn-sm"
                                        onClick={(e) =>
                                          handleAddRow(product, e)
                                        }
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
                      </>
                    ))}
                    {provided.placeholder}
                  </tbody>
                </table>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </form>
      {productPicker && (
        <ProductPicker setProductPicker={setProductPicker} formik={formik} />
      )}
    </div>
  );
};

export { QuoteAddStep2 };
