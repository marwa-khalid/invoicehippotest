import React, { useEffect, useState } from "react";
import { getProductGroups } from "../core/_requests";
import { ProductGroupResult } from "../core/_models";
import { ListLoading } from "../../../components/ListLoading";
import { ProductGroupPagination } from "../components/pagination/ProductGroupPagination";
import { useIntl } from "react-intl";
import { toAbsoluteUrl } from "../../../../../../_metronic/helpers";
import Tippy from "@tippyjs/react";
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

const ProductGroupsList = ({
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
  const [productGroups, setProductGroups] = useState<any>([]);
  const [selectAll, setSelectAll] = useState(false);
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
    if (deleteModalId.length == 0) {
      setDeleteSelectedButton(false);
    }
  }, [deleteModalId]);
  useEffect(() => {
    fetchProductGroups();
  }, [searchTerm, pageIndex, searchCounter]);

  useEffect(() => {
    fetchProductGroups();
  }, [addModalOpen, deleteModalOpen, refresh]);

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
      const allIds = productGroups.result.map(
        (item: ProductGroupResult) => item.id
      );
      setDeleteModalId(allIds);
      setDeleteSelectedButton(true);
    }
    setSelectAll(!selectAll);
  };

  const openEditModal = (id: number) => {
    setEditModalId(id);
    setAddModalOpen(true);
  };

  const openDeleteModal = (id: number, productGroupTitle: string) => {
    setDeleteModalId([id]);
    setDeleteModalOpen(true);
    setProductGroupTitle(productGroupTitle);
  };

  return (
    <div className="card py-3  p-10">
      <div className="table-responsive">
        <table className="table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4">
          <thead>
            <tr className="fw-bold text-muted">
              <th className="w-25px">
                <div className="form-check form-check-sm form-check-custom form-check-solid">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={selectAll}
                    onChange={toggleAllRowsSelection}
                  />
                </div>
              </th>
              <th className="w-25px"></th>
              <th>{intl.formatMessage({ id: "Fields.Title" })}</th>
            </tr>
          </thead>
          <tbody>
            {productGroups?.result?.map(
              (productGroup: ProductGroupResult, index: number) => (
                <tr key={productGroup.id}>
                  <td>
                    <div className="form-check form-check-sm form-check-custom form-check-solid">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={deleteModalId?.includes(productGroup.id)}
                        onChange={() => toggleRowSelection(productGroup.id)}
                      />
                    </div>
                  </td>
                  <td className="text-muted">|</td>
                  <td
                    className="cursor-pointer fw-bold"
                    onClick={() => openEditModal(productGroup.id)}
                  >
                    {productGroup.title}
                  </td>

                  <td className="text-end">
                    {productGroup.actions.canEdit && (
                      <Tippy
                        content={intl.formatMessage({
                          id: "Fields.ToolTipEdit",
                        })}
                      >
                        <button
                          className="btn btn-icon btn-light btn-sm me-2"
                          onClick={() => openEditModal(productGroup.id)}
                        >
                          <i className="ki-solid ki-pencil text-warning fs-2" />
                        </button>
                      </Tippy>
                    )}

                    {productGroup.actions.canDelete && (
                      <Tippy
                        content={intl.formatMessage({
                          id: "Fields.ToolTipDelete",
                        })}
                      >
                        <button
                          className="btn btn-icon btn-light btn-sm"
                          onClick={() =>
                            openDeleteModal(productGroup.id, productGroup.title)
                          }
                        >
                          <i className="ki-solid ki-trash text-danger fs-2" />
                        </button>
                      </Tippy>
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
