import React, { useEffect, useState } from "react";
import { getDiscountMargins } from "../core/_requests";
import { DiscountMarginResult, ProductGroupResult } from "../core/_models";
import { ListLoading } from "../../../components/ListLoading";
import { DiscountPagination } from "../components/pagination/DiscountPagination";
import { useIntl } from "react-intl";
import { toAbsoluteUrl } from "../../../../../../_metronic/helpers";
import { Tooltip } from "@chakra-ui/react";
interface ComponentProps {
  searchTerm: string;
  setTotalRows: (type: number) => void;
  setEditModalOpen: (type: boolean) => void;
  setEditModalId: (type: number) => void;
  setDiscountMarginTitle: (type: string) => void;
  setDeleteModalOpen: (type: boolean) => void;
  refresh: boolean;
  setPageIndex: (type: number) => void;
  pageIndex: number;
  editModalOpen: boolean;
  deleteModalOpen: boolean;
  setDeleteSelectedButton: (type: boolean) => void;
  deleteModalId: any;
  setDeleteModalId: any;
  searchCounter: number;
}

const DiscountMarginsList = ({
  searchTerm,
  setTotalRows,
  setEditModalOpen,
  setEditModalId,
  setDiscountMarginTitle,
  setDeleteModalOpen,
  refresh,
  setPageIndex,
  pageIndex,
  editModalOpen,
  deleteModalOpen,
  setDeleteSelectedButton,
  deleteModalId,
  setDeleteModalId,
  searchCounter,
}: ComponentProps) => {
  const [discountMargins, setDiscountMargins] = useState<any>([]);
  const [selectAll, setSelectAll] = useState(false);
  const intl = useIntl();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchDiscountTypes = async () => {
    setIsLoading(true);
    try {
      const response = await getDiscountMargins(searchTerm, pageIndex);
      setDiscountMargins(response);
      setPageIndex(response.pageIndex);
      setTotalRows(response.totalRows);
    } catch (error) {
      console.error("Error fetching discount types:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setPageIndex(page);
    fetchDiscountTypes();
  };
  useEffect(() => {
    if (deleteModalId.length == 0) {
      setDeleteSelectedButton(false);
    }
  }, [deleteModalId]);
  useEffect(() => {
    fetchDiscountTypes();
  }, [searchTerm, pageIndex, searchCounter]);

  useEffect(() => {
    fetchDiscountTypes();
  }, [editModalOpen, deleteModalOpen, refresh]);

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
      const allIds = discountMargins.result.map(
        (item: ProductGroupResult) => item.id
      );
      setDeleteModalId(allIds);
      setDeleteSelectedButton(true);
    }
    setSelectAll(!selectAll);
  };

  const openEditModal = (id: number) => {
    setEditModalId(id);
    setEditModalOpen(true);
  };

  const openDeleteModal = (id: number, discountMarginTitle: string) => {
    setDeleteModalId([id]);
    setDeleteModalOpen(true);
    setDiscountMarginTitle(discountMarginTitle);
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
              <th className="text-center">
                {intl.formatMessage({ id: "Fields.IsPercentageMargin" })}
              </th>
            </tr>
          </thead>
          <tbody>
            {discountMargins?.result?.map(
              (discountMargin: DiscountMarginResult, index: number) => (
                <tr key={discountMargin.id}>
                  <td>
                    <div className="form-check form-check-sm form-check-custom form-check-solid">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={deleteModalId?.includes(discountMargin.id)}
                        onChange={() => toggleRowSelection(discountMargin.id)}
                      />
                    </div>
                  </td>
                  <td className="text-muted">|</td>
                  <td
                    className="cursor-pointer fw-bold"
                    onClick={() => openEditModal(discountMargin.id)}
                  >
                    {discountMargin.title}
                  </td>
                  <td className="cursor-pointer text-center">
                    {discountMargin.isPercentageMargin ? (
                      <i className="ki-duotone ki-check text-success fs-2x" />
                    ) : (
                      <i className="ki-duotone ki-check text-secondary fs-2x" />
                    )}
                  </td>

                  <td className="text-end">
                    {discountMargin.actions.canEdit && (
                      <Tooltip
                        label={intl.formatMessage({ id: "Fields.ToolTipEdit" })}
                        fontSize="sm"
                        className="bg-gray-800 text-white p-2 rounded"
                        placement="top"
                      >
                        <button
                          className="btn btn-icon btn-light btn-sm me-2"
                          onClick={() => openEditModal(discountMargin.id)}
                        >
                          <i className="ki-solid ki-pencil text-warning fs-2" />
                        </button>
                      </Tooltip>
                    )}

                    {discountMargin.actions.canDelete && (
                      <Tooltip
                        label={intl.formatMessage({
                          id: "Fields.ToolTipDelete",
                        })}
                        fontSize="sm"
                        className="bg-gray-800 text-white p-2 rounded"
                        placement="top"
                      >
                        <button
                          className="btn btn-icon btn-light btn-sm"
                          onClick={() =>
                            openDeleteModal(
                              discountMargin.id,
                              discountMargin.title
                            )
                          }
                        >
                          <i className="ki-solid ki-trash text-danger fs-2" />
                        </button>
                      </Tooltip>
                    )}
                  </td>
                </tr>
              )
            )}
            {discountMargins?.result?.length == 0 && (
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
      {discountMargins?.result?.length > 0 && (
        <DiscountPagination
          totalPages={discountMargins.totalPages}
          pageIndex={pageIndex}
          setPageIndex={setPageIndex}
          onPageChange={handlePageChange}
          totalItems={discountMargins.totalRows}
        />
      )}
    </div>
  );
};

export { DiscountMarginsList };
