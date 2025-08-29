import { useIntl } from "react-intl";
import { KTIcon, toAbsoluteUrl } from "../../../../../_metronic/helpers";
import { FC, useEffect, useState } from "react";
import { getProductById, getProductsForPicker } from "../core/_requests";
import { ListPagination } from "../../../generic/ListPagination";
import { FormikProps } from "formik";
import * as Tooltip from "@radix-ui/react-tooltip";
// @ts-ignore
import { updatePagination } from "../../../../helpers/paginationUtils.js";
// @ts-ignore
import { getPaginationModule } from "../../../../helpers/paginationUtils.js";
// @ts-ignore
import { resetPaginationModule } from "../../../../helpers/paginationUtils.js";
import { ListLoading } from "../../../generic/ListLoading";
import { QuotePostResult } from "../core/_models";
import { useAuth } from "../../../auth/index.js";
import { toast } from "react-toastify";

interface Props {
  closeProductPicker: any;
  formik: FormikProps<QuotePostResult>;
}
const ProductPicker: FC<Props> = ({ closeProductPicker, formik }) => {
  const intl = useIntl();
  const moduleKey = "product-picker";
  let filters = getPaginationModule(moduleKey);
  const [searchTerm, setSearchTerm] = useState<string>(
    filters.searchTerm || ""
  );
  const { currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [localSearchTerm, setLocalSearchTerm] = useState<string>(searchTerm);
  const [counter, setCounter] = useState(false);
  const [products, setProducts] = useState<any>();
  const [pageIndex, setPageIndex] = useState<number>(filters.pageIndex || 1);
  const handleSearchClick = (e: any) => {
    e.preventDefault();
    setSearchTerm(localSearchTerm);
    setCounter(!counter);
    setPageIndex(1);
    const moduleKey = "product-picker";
    updatePagination(moduleKey, { searchTerm: localSearchTerm || "" }, 1);
  };

  const handleReset = () => {
    resetPaginationModule(moduleKey);
    setLocalSearchTerm("");
    setSearchTerm("");
    setPageIndex(1);
  };

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await getProductsForPicker(searchTerm, pageIndex, 5);

      if (response.isValid) {
        setProducts(response);
      }
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchProducts();
  }, [searchTerm, counter, pageIndex]);

  const handlePageChange = (page: number) => {
    setPageIndex(page);
  };

  const fetchProductById = async (id: number) => {
    const response = await getProductById(id);

    if (response.isValid) {
      const newRow = {
        productId: response.result.id,
        title: response.result.title,
        description: response.result.description,
        code: response.result.code,
        eanCode: response.result.eanCode,
        supplierInhouseCode: response.result.supplierInhouseCode,
        supplierClientId: response.result.supplierClientId,
        productGroupId: response.result.productGroupId,
        units: response.result.pricing.units,
        unitPrice: response.result.pricing.unitPrice,
        companyUnitTypeId: response.result.pricing.companyUnitTypeId,
        btwExclusive: response.result.pricing.btwExclusive,
        includeLinkedProductDesciption:
          response.result.pricing.includeLinkedProductDesciption,
        linkedProductDescription:
          response.result.pricing.linkedProductDescription,
        linkedProductId: response.result.pricing.linkedProductId,
        ledgerAccountId: response.result.pricing.ledgerAccountId,
        vatTypeId: response.result.pricing.vatTypeId,
        discountMarginId: response.result.pricing.discountMarginId,
        orderIndex: response.result.orderIndex,
        pricingMargin: response.result.pricingMargin,
      };

      // Check if the product already exists
      const existingProductIndex = formik.values.products.findIndex(
        (product) => {
          return (
            product.productId === newRow.productId &&
            product.title === newRow.title &&
            product.description === newRow.description &&
            product.code === newRow.code &&
            product.unitPrice === newRow.unitPrice &&
            product.companyUnitTypeId === newRow.companyUnitTypeId &&
            product.btwExclusive === newRow.btwExclusive &&
            product.includeLinkedProductDesciption ===
              newRow.includeLinkedProductDesciption &&
            product.linkedProductDescription ===
              newRow.linkedProductDescription &&
            product.linkedProductId === newRow.linkedProductId &&
            product.ledgerAccountId === newRow.ledgerAccountId &&
            product.vatTypeId === newRow.vatTypeId &&
            product.discountMarginId === newRow.discountMarginId &&
            product.orderIndex === newRow.orderIndex
          );
        }
      );

      if (existingProductIndex !== -1) {
        // Product exists, so update the units by adding the new units
        const updatedProducts = formik.values.products.map((product, index) =>
          index === existingProductIndex
            ? { ...product, units: product.units + newRow.units }
            : product
        );

        // Update the products in formik state
        formik.values.products = updatedProducts;
      } else {
        // Product does not exist, so add it to the list
        formik.values.products = [...formik.values.products, newRow];
      }
      toast.success("product successfully linked");
    }
  };

  return (
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
                  id: "Menu.Products",
                })}
              </h2>
              <div
                className="btn btn-icon btn-sm btn-active-icon-primary"
                onClick={() => closeProductPicker()}
                style={{ cursor: "pointer" }}
              >
                <KTIcon iconName="cross" className="fs-1 text-white" />
              </div>
            </div>
          </div>

          <div className="modal-body">
            <div className="d-flex align-items-center position-relative mb-5 gap-2 ">
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
                value={localSearchTerm}
                onChange={(e) => {
                  e.preventDefault();
                  setLocalSearchTerm(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearchClick(e);
                  }
                }}
              />
              <div className="btn-group">
                <button
                  className="btn btn-primary d-inline-flex align-items-center"
                  onClick={(e) => handleSearchClick(e)}
                >
                  <i className="la la-search fs-2"></i>
                  <span className="ms-1">
                    {intl.formatMessage({ id: "Fields.SearchBtn" })}
                  </span>
                </button>

                <button
                  className="btn btn-secondary btn-icon"
                  onClick={() => handleReset()}
                >
                  <i className="la la-remove fs-3"></i>
                </button>
              </div>
            </div>
            {products?.totalRows > 0 && (
              <h5>
                {intl
                  .formatMessage({ id: "Fields.SearchResultHeaderCount" })
                  .replace("{0}", products?.totalRows.toString())}
              </h5>
            )}
            <div className="text-center mt-6">
              {products?.result.length > 0 ? (
                products?.result.map((product: any, index: number) => {
                  // Extract initials from the company name

                  return (
                    <div key={index}>
                      <table className="table table-row-dashed table-row-gray-300 gy-7">
                        <tbody>
                          <tr className="table-row-dashed">
                            <td width={60}>
                              <img
                                alt="PNG"
                                src={toAbsoluteUrl("media/logos/box.png")}
                                width={60}
                                height={60}
                              />
                            </td>
                            <td width={350}>
                              <div className="d-flex flex-column align-items-start mb-2">
                                <small className="text-muted font-weight-light fs-9">
                                  {product.code}
                                </small>
                              </div>
                              <div
                                className="d-flex flex-column text-start cursor-pointer mb-2"
                                onClick={(e) => {
                                  e.preventDefault();
                                  fetchProductById(product.id);
                                }}
                              >
                                <span className="fw-bold">{product.title}</span>
                              </div>
                              {product.supplier && (
                                <div className="d-flex flex-column align-items-start mb-2">
                                  <span className="text-muted fw-normal">
                                    <i className="far fa-user"></i>&nbsp;
                                    {product.supplier}
                                  </span>
                                </div>
                              )}
                              {product.productGroup && (
                                <div className="d-flex flex-column align-items-start">
                                  <span className="text-muted fw-normal">
                                    <i className="ki-duotone ki-dropbox">
                                      <span className="path1"></span>
                                      <span className="path2"></span>
                                      <span className="path3"></span>
                                      <span className="path4"></span>
                                      <span className="path5"></span>
                                    </i>
                                    &nbsp;
                                    {product.productGroup}
                                  </span>
                                </div>
                              )}
                            </td>

                            <td className="text-start">
                              <div className="card-toolbar mb-7 justify-content-end fw-normal">
                                {product.units}{" "}
                                {intl.formatMessage({ id: "Fields.Units" })}
                              </div>
                            </td>

                            <td className="text-end">
                              <div className="position-relative">
                                {
                                  currentUser?.result.activeCompanyDefaults
                                    .defaultValuta.sign
                                }
                                {product.totals.totalPriceWithVAT}
                                <Tooltip.Provider delayDuration={0}>
                                  <Tooltip.Root>
                                    <Tooltip.Trigger asChild>
                                      <div
                                        className="circle"
                                        style={{
                                          position: "absolute",
                                          top: "-14px",
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
                                      <Tooltip.Content
                                        side="top"
                                        className="app-tooltip"
                                      >
                                        <div
                                          style={{
                                            fontFamily: "monospace",
                                          }}
                                        >
                                          <div
                                            className="table text-end"
                                            style={{ width: "100%" }}
                                          >
                                            {/* Total Price */}
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
                                                  id: "Fields.TotalPrice",
                                                })}
                                                :
                                              </div>
                                              <div
                                                style={{
                                                  display: "table-cell",
                                                  textAlign: "right",
                                                }}
                                              >
                                                €
                                                {product.totals.totalPrice.toFixed(
                                                  2
                                                )}
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
                                                  id: "Fields.TotalVATAmount",
                                                })}
                                                :
                                              </div>
                                              <div
                                                style={{
                                                  display: "table-cell",
                                                  textAlign: "right",
                                                }}
                                              >
                                                €
                                                {product.totals.totalVATAmount.toFixed(
                                                  2
                                                )}
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
                            <td className="text-end">
                              <Tooltip.Provider delayDuration={0}>
                                <Tooltip.Root>
                                  <Tooltip.Trigger asChild>
                                    <button
                                      className="btn btn-icon btn-primary btn-sm me-2"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        fetchProductById(product.id);
                                      }}
                                    >
                                      <i className="ki-duotone ki-pin text-white fs-2">
                                        <span className="path1"></span>
                                        <span className="path2"></span>
                                      </i>
                                    </button>
                                  </Tooltip.Trigger>

                                  <Tooltip.Portal>
                                    <Tooltip.Content
                                      side="top"
                                      className="app-tooltip"
                                    >
                                      {intl.formatMessage({
                                        id: "Fields.ToolTipLinkProduct",
                                      })}
                                      <Tooltip.Arrow className="app-tooltip-arrow" />
                                    </Tooltip.Content>
                                  </Tooltip.Portal>
                                </Tooltip.Root>
                              </Tooltip.Provider>
                            </td>
                          </tr>
                          <tr></tr>
                        </tbody>
                      </table>

                      {/* </div> */}

                      {/* Dotted divider under every row */}
                    </div>
                  );
                })
              ) : (
                <>
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
                </>
              )}
            </div>
          </div>
          {isLoading && <ListLoading />}
          {products?.totalRows !== 0 && (
            <ListPagination
              totalPages={products?.totalPages}
              pageIndex={products?.pageIndex}
              onPageChange={handlePageChange}
              totalItems={products?.totalRows}
              moduleName="product-picker"
            />
          )}
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => closeProductPicker()}
            >
              {intl.formatMessage({ id: "Fields.ActionClose" })}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export { ProductPicker };
