import { useEffect, useState } from "react";
import { ListLoading } from "../../../generic/ListLoading";
import { ListPagination } from "../../../generic/ListPagination";
import { useIntl } from "react-intl";
import { toAbsoluteUrl } from "../../../../../_metronic/helpers";
import * as Tooltip from "@radix-ui/react-tooltip";
import { getBudgets } from "../core/_requests";
import { BudgetResult } from "../core/_models";
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
      const response = await getBudgets(
        searchTerm,
        pageIndex,
        10,
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
  }, [searchTerm, searchCounter, refresh, pageIndex, productGroupId]);

  const openEditModal = (id: number) => {
    setEditModalId(id);
    setAddModalOpen(true);
  };

  const openDeleteModal = (product: BudgetResult) => {
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
                {/* {intl.formatMessage({ id: "Fields.BudgetGroup" })} */}
                budget group
              </th>
              <th>
                related {intl.formatMessage({ id: "Fields.LedgerAccount" })}
              </th>
              {/* <th className="mw-80px text-end">
                {intl.formatMessage({ id: "Fields.SalePrice" })}
              </th> */}
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products?.result?.map((product: BudgetResult) => (
              <tr key={product.id}>
                <td width={60}>
                  <img
                    alt="PNG"
                    src={toAbsoluteUrl("media/logos/budget.png")}
                    width={60}
                    height={40}
                  />
                </td>
                <td width={150}>
                  <div className="d-flex flex-column align-items-start">
                    <small className="text-muted font-weight-light fs-9">
                      {product.description}
                    </small>
                  </div>
                  <div
                    className="d-flex flex-column align-items-start cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      openEditModal(product.id);
                    }}
                  >
                    <span className="fw-bold">{product.title}</span>
                  </div>
                </td>
                {product.hasBudgetGroup && (
                  <td width={200}>
                    <div className="d-flex flex-column align-items-start">
                      <small className="text-muted font-weight-light fs-9">
                        {product.budgetGroup.description}
                      </small>
                    </div>

                    <div className="d-flex flex-column align-items-start cursor-pointer">
                      <span className="fw-bold">
                        {product.budgetGroup.title}
                      </span>
                      {/* {product.budgetGroup.title}
                        {product.budgetGroup.subjects?.map(
                          (subject) => subject.description
                        )} */}
                    </div>
                  </td>
                )}
                {product.hasRelatedLedgerAccounts && (
                  <td className="text-muted" width={300}>
                    {product.relatedLedgerAccounts.map((account) => (
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
                          {account.code}-{account.title}
                        </span>
                      </div>
                    ))}
                  </td>
                )}

                <td className="text-end">
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
