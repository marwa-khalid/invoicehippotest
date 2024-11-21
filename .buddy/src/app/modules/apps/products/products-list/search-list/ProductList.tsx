import React, { useEffect, useState } from "react";
import { ListLoading } from "../../../components/ListLoading";
import { ProductGroupPagination } from "../components/pagination/ProductGroupPagination";
import { useIntl } from "react-intl";
import { toAbsoluteUrl } from "../../../../../../_metronic/helpers";
import Tippy from "@tippyjs/react";
import { getProducts } from "../core/_requests";
import { ProductResult } from "../core/_models";
interface ComponentProps {
  searchTerm: string;
  setTotalRows: (type: number) => void;
  setAddModalOpen: (type: boolean) => void;
  setEditModalId: (type: number) => void;
  setProductGroupTitle: (type: string) => void;
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
}

const ProductList = ({
  searchTerm,
  setTotalRows,
  setAddModalOpen,
  setEditModalId,
  setProductGroupTitle,
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
}: ComponentProps) => {
  const [products, setProducts] = useState<any>([]);
  const [selectAll, setSelectAll] = useState(false);
  const intl = useIntl();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (deleteModalId.length == 0) {
      setDeleteSelectedButton(false);
    }
  }, [deleteModalId]);
  const fetchProducts = async () => {
    const response = await getProducts(searchTerm, pageIndex, 25);

    if (response.isValid) {
      setProducts(response);
    }
  };
  const handlePageChange = (page: number) => {
    setPageIndex(page);
    fetchProducts();
  };
  useEffect(() => {
    fetchProducts();
  }, [searchTerm, searchCounter, refresh, pageIndex]);

  const toggleRowSelection = (id: number) => {
    setDeleteModalId((prevSelected: number[]) => {
      const newSelected = [...prevSelected];
      if (newSelected.includes(id)) {
        // Remove the ID if it's already selected
        setDeleteSelectedButton(newSelected.length > 1);
        return newSelected.filter((itemId) => itemId !== id);
      } else {
        // Add the ID if it's not selected
        const updatedSelected = [...newSelected, id];
        setDeleteSelectedButton(updatedSelected.length > 0);
        return updatedSelected;
      }
    });
  };

  const toggleAllRowsSelection = () => {
    if (selectAll) {
      setDeleteModalId([]);
      setDeleteSelectedButton(false);
    } else {
      const allIds = products.result.map((item: ProductResult) => item.id);
      setDeleteModalId(allIds);
      setDeleteSelectedButton(true);
    }
    setSelectAll(!selectAll);
  };

  const openEditModal = (id: number) => {
    setEditModalId(id);
    setAddModalOpen(true);
  };

  const openDeleteModal = (product: ProductResult) => {
    setDeleteModalId([product.id]);

    setDeleteModalOpen(true);
    localStorage.setItem("ModalData", JSON.stringify(product));
  };

  return (
    <div className="card py-3  p-10">
      <div className="table-responsive">
        <table className="table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4">
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
              <th>{intl.formatMessage({ id: "Fields.SalePrice" })}</th>
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
                <td className="text-muted" width={200}>
                  {product.ledgerAccountDisplayName}
                </td>
                <td>
                  {product.units} {intl.formatMessage({ id: "Fields.Units" })}
                </td>
                <td className="text-center">
                  <div className="position-relative">
                    €{product.totals.totalPriceWithVAT}
                    <Tippy
                      content={
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
                                €{product.totals.totalPrice.toFixed(2)}
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
                                €{product.totals.totalVATAmount.toFixed(2)}
                              </div>
                            </div>
                          </div>
                        </div>
                      }
                    >
                      <div
                        className="circle"
                        style={{
                          position: "absolute",
                          top: "-14px",
                          right: "7px",
                        }}
                      >
                        <i className="ki-duotone ki-information-4 fs-2 cursor-pointer text-primary ms-1">
                          <span className="path1"></span>
                          <span className="path2"></span>
                          <span className="path3"></span>
                        </i>
                      </div>
                    </Tippy>
                  </div>
                </td>

                <td className="text-end">
                  {product.actions.canEdit && (
                    <Tippy
                      content={intl.formatMessage({
                        id: "Fields.ToolTipEdit",
                      })}
                    >
                      <button
                        className="btn btn-icon btn-light btn-sm me-2"
                        onClick={() => openEditModal(product.id)}
                      >
                        <i className="ki-solid ki-pencil text-warning fs-2" />
                      </button>
                    </Tippy>
                  )}

                  {product.actions.canDelete && (
                    <Tippy
                      content={intl.formatMessage({
                        id: "Fields.ToolTipDelete",
                      })}
                    >
                      <button
                        className="btn btn-icon btn-light btn-sm"
                        onClick={() => openDeleteModal(product)}
                      >
                        <i className="ki-solid ki-trash text-danger fs-2" />
                      </button>
                    </Tippy>
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
        <ProductGroupPagination
          totalPages={products.totalPages}
          pageIndex={pageIndex}
          setPageIndex={setPageIndex}
          onPageChange={handlePageChange}
          totalItems={products.totalRows}
        />
      )}
    </div>
  );
};

export { ProductList };
