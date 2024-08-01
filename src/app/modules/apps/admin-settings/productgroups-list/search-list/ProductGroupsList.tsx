import React, { useEffect, useState } from "react";
import { getProductGroups } from "../core/_requests";
import { ProductGroupResult } from "../core/_models";
import { ListLoading } from "../../components/ListLoading";
import { ProductGroupPagination } from "../components/pagination/ProductGroupPagination";
import { useIntl } from "react-intl";
import { toAbsoluteUrl } from "../../../../../../_metronic/helpers";
interface ComponentProps {
  searchTerm: string;
  setTotalRows: (type: number) => void;
  setEditModalOpen: (type: boolean) => void;
  setEditModalId: (type: number) => void;
  setProductGroupTitle: (type: string) => void;
  setDeleteModalOpen: (type: boolean) => void;
  refresh: boolean;
  setPageIndex: (type: number) => void;
  pageIndex: number;
  editModalOpen: boolean;
  deleteModalOpen: boolean;
}

const ProductGroupsList = ({
  searchTerm,
  setTotalRows,
  setEditModalOpen,
  setEditModalId,
  setProductGroupTitle,
  setDeleteModalOpen,
  refresh,
  setPageIndex,
  pageIndex,
  editModalOpen,
  deleteModalOpen,
}: ComponentProps) => {
  const [productGroups, setProductGroups] = useState<any>([]);
  const intl = useIntl();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchProductGroups = async () => {
    setIsLoading(true);
    try {
      const response = await getProductGroups(searchTerm, pageIndex);
      setProductGroups(response);
      setPageIndex(response.pageIndex);
      setTotalRows(response.totalRows);
    } catch (error) {
      console.error("Error fetching unit types:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setPageIndex(page);
    fetchProductGroups();
  };

  useEffect(() => {
    fetchProductGroups();
  }, [searchTerm, pageIndex]);

  useEffect(() => {
    fetchProductGroups();
  }, [editModalOpen, deleteModalOpen, refresh]);

  const openEditModal = (id: number) => {
    setEditModalId(id);
    setEditModalOpen(true);
  };

  const openDeleteModal = (id: number, productGroupTitle: string) => {
    setEditModalId(id);
    setDeleteModalOpen(true);
    setProductGroupTitle(productGroupTitle);
  };

  return (
    <div className="card py-3  p-10">
      <div className="table-responsive">
        <table className="table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4">
          <thead>
            <tr className="fw-bold text-muted">
              <th className="text-start">#</th>
              <th className="text-center">
                {intl.formatMessage({ id: "Fields.Title" })}
              </th>
              <th className="text-end">
                {intl.formatMessage({ id: "Fields.ColumnActions" })}
              </th>
            </tr>
          </thead>
          <tbody>
            {productGroups?.result?.map(
              (productGroup: ProductGroupResult, index: number) => (
                <tr key={productGroup.id}>
                  <td className="text-start">{index + 1}</td>
                  <td className="text-center">{productGroup.title}</td>

                  <td className="text-end">
                    {productGroup.actions.canEdit && (
                      <button
                        className="btn btn-icon btn-light btn-sm me-2"
                        onClick={() => openEditModal(productGroup.id)}
                      >
                        <i className="ki-solid ki-pencil text-warning fs-2" />
                      </button>
                    )}

                    {productGroup.actions.canDelete && (
                      <button
                        className="btn btn-icon btn-light btn-sm"
                        onClick={() =>
                          openDeleteModal(productGroup.id, productGroup.title)
                        }
                      >
                        <i className="ki-solid ki-trash text-danger fs-2" />
                      </button>
                    )}
                  </td>
                </tr>
              )
            )}
            {productGroups?.result?.length == 0 && (
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
      {productGroups?.result?.length > 0 && (
        <ProductGroupPagination
          totalPages={productGroups.totalPages}
          pageIndex={pageIndex}
          setPageIndex={setPageIndex}
          onPageChange={handlePageChange}
          totalItems={productGroups.totalRows}
        />
      )}
    </div>
  );
};

export { ProductGroupsList };
