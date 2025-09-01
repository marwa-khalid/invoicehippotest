import { useEffect, useState } from "react";
import { ListLoading } from "../../../generic/ListLoading";
import { ListPagination } from "../../../generic/ListPagination";
import { useIntl } from "react-intl";
import { toAbsoluteUrl } from "../../../../../_metronic/helpers";
import * as Tooltip from "@radix-ui/react-tooltip";
import { getProducts } from "../core/_requests";
import { ProductResult } from "../core/_models";
import { useAuth } from "../../../auth";
interface ComponentProps {
  searchTerm: string;
  setTotalRows: (type: number) => void;
  setAddModalOpen: (type: boolean) => void;
  setEditModalId: (type: number) => void;
  setDeleteModalOpen: (type: boolean) => void;
  refresh: boolean;
  setPageIndex: (type: number) => void;
  pageIndex: number;
  addModalOpen: boolean;
  deleteModalOpen: boolean;
  setDeleteSelectedButton: (type: boolean) => void;
  deleteModalId: any;
  setDeleteModalId: any;
  searchCounter: number;
  productGroupId: number | null;
  clientId: number | null;
}

const ProductList = ({
  searchTerm,
  setAddModalOpen,
  setEditModalId,
  productGroupId,
  clientId,
  setDeleteModalOpen,
  refresh,
  setPageIndex,
  pageIndex,
  addModalOpen,
  deleteModalOpen,
  setDeleteSelectedButton,
  deleteModalId,
  setDeleteModalId,
  searchCounter,
  setTotalRows,
}: ComponentProps) => {
  const [products, setProducts] = useState<any>([]);
  const intl = useIntl();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (deleteModalId.length == 0) {
      setDeleteSelectedButton(false);
    }
  }, [deleteModalId]);
  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const response = await getProducts(
        searchTerm,
        pageIndex,
        10,
        clientId,
        productGroupId
      );

      if (response.isValid) {
        setProducts(response);
        setTotalRows(response.totalRows);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setPageIndex(page);
  };
  useEffect(() => {
    fetchProducts();
  }, [searchTerm, searchCounter, refresh, pageIndex, productGroupId, clientId]);

  const openEditModal = (id: number) => {
    setEditModalId(id);
    setAddModalOpen(true);
  };

  const openDeleteModal = (product: ProductResult) => {
    setDeleteModalId([product.id]);

    setDeleteModalOpen(true);
    localStorage.setItem("ModalData", JSON.stringify(product));
  };
  const { currentUser } = useAuth();
  return (
    <div className="card py-3  p-10">
      <div className="table-responsive">
        <table className="table table-row-dashed table-row-gray-300 align-top gs-0 gy-4">
          <thead>
            <tr className="fw-bold text-muted">
              <th></th>
              <th className="w-25px">
                {intl.formatMessage({ id: "Fields.Title" })}
              </th>
              <th className="w-25px">
                {intl.formatMessage({ id: "Fields.LedgerAccount" })}
              </th>
              <th>{intl.formatMessage({ id: "Fields.Units" })}</th>
              <th className="mw-80px text-end">
                {intl.formatMessage({ id: "Fields.SalePrice" })}
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products?.result?.map((product: ProductResult, index: number) => (
              <tr key={product.id}>
                <td width={60}>
                  <img
                    alt="PNG"
                    src={toAbsoluteUrl("media/logos/box.png")}
                    width={50}
                    height={50}
                  />
                </td>
                <td width={300}>
                  <div className="d-flex flex-column align-items-start mb-2">
                    <small className="text-muted font-weight-light fs-9">
                      {product.code}
                    </small>
                  </div>
                  <div
                    className="d-flex flex-column align-items-start cursor-pointer mb-2"
                    onClick={(e) => {
                      e.preventDefault();
                      openEditModal(product.id);
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
                <td
                  className="text-muted"
                  width={200}
                  style={{ paddingTop: "2.7rem" }}
                >
                  {product.ledgerAccountDisplayName}
                </td>
                <td style={{ paddingTop: "2.7rem" }}>
                  {product.units} {product.unitType}
                </td>
                <td className="text-end" style={{ paddingTop: "2.7rem" }}>
                  <div className="position-relative">
                    {
                      currentUser?.result.activeCompanyDefaults.defaultValuta
                        .sign
                    }
                    {product.totals.totalPriceWithVAT.toFixed(2)}
                    <Tooltip.Provider delayDuration={0}>
                      <Tooltip.Root>
                        <Tooltip.Trigger asChild>
                          <div
                            className="circle"
                            style={{
                              position: "absolute",
                              top: "-14px",
                              right: "-16px",
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
                                <div style={{ display: "table-row" }}>
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
                                    {
                                      currentUser?.result.activeCompanyDefaults
                                        .defaultValuta.sign
                                    }
                                    {product.totals.totalPrice.toFixed(2)}
                                  </div>
                                </div>
                                <div style={{ display: "table-row" }}>
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
                                    {
                                      currentUser?.result.activeCompanyDefaults
                                        .defaultValuta.sign
                                    }
                                    {product.totals.totalVATAmount.toFixed(2)}
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

                <td className="text-end" style={{ paddingTop: "2rem" }}>
                  {product.actions.canEdit && (
                    <Tooltip.Provider delayDuration={0}>
                      <Tooltip.Root>
                        <Tooltip.Trigger asChild>
                          <button
                            className="btn btn-icon btn-light btn-sm me-2"
                            onClick={() => openEditModal(product.id)}
                          >
                            <i className="ki-solid ki-pencil text-warning fs-2" />
                          </button>
                        </Tooltip.Trigger>

                        <Tooltip.Portal>
                          <Tooltip.Content side="top" className="app-tooltip">
                            {intl.formatMessage({
                              id: "Fields.ToolTipEdit",
                            })}
                            <Tooltip.Arrow className="app-tooltip-arrow" />
                          </Tooltip.Content>
                        </Tooltip.Portal>
                      </Tooltip.Root>
                    </Tooltip.Provider>
                  )}

                  {product.actions.canDelete && (
                    <Tooltip.Provider delayDuration={0}>
                      <Tooltip.Root>
                        <Tooltip.Trigger asChild>
                          <button
                            className="btn btn-icon btn-light btn-sm"
                            onClick={() => openDeleteModal(product)}
                          >
                            <i className="ki-solid ki-trash text-danger fs-2" />
                          </button>
                        </Tooltip.Trigger>

                        <Tooltip.Portal>
                          <Tooltip.Content side="top" className="app-tooltip">
                            {intl.formatMessage({
                              id: "Fields.ToolTipDelete",
                            })}
                            <Tooltip.Arrow className="app-tooltip-arrow" />
                          </Tooltip.Content>
                        </Tooltip.Portal>
                      </Tooltip.Root>
                    </Tooltip.Provider>
                  )}
                </td>
              </tr>
            ))}
            {products?.result?.length == 0 && (
              <tr>
                <td colSpan={7} className="text-center">
                  <img
                    alt=""
                    src={toAbsoluteUrl("media/logos/searchnotfound.png")}
                    className="h-350px w-450px"
                  />
                  <h3>
                    {intl.formatMessage({
                      id: "Fields.SearchNoItemsAvailableDefault",
                    })}
                  </h3>
                </td>
              </tr>
            )}
            {isLoading && (
              <tr>
                <td colSpan={7}>
                  <ListLoading />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {products?.result?.length > 0 && (
        <ListPagination
          totalPages={products?.totalPages}
          pageIndex={pageIndex}
          moduleName="products-module"
          onPageChange={handlePageChange}
          totalItems={products?.totalRows}
        />
      )}
    </div>
  );
};

export { ProductList };
