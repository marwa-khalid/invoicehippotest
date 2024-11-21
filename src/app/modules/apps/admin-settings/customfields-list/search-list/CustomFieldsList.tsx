import React, { useEffect, useState } from "react";
import { getCustomFields } from "../core/_requests";
import { CustomFieldResult, DiscountMarginResult } from "../core/_models";
import { ListLoading } from "../../../components/ListLoading";
import { CustomFieldsPagination } from "../components/pagination/CustomFieldsPagination";
import { useIntl } from "react-intl";
import { toAbsoluteUrl } from "../../../../../../_metronic/helpers";
import Tippy from "@tippyjs/react";
interface ComponentProps {
  searchTerm: string;
  setTotalRows: (type: number) => void;
  setAddModalOpen: (type: boolean) => void;
  setEditModalId: (type: number) => void;
  setDiscountMarginTitle: (type: string) => void;
  setDeleteModalOpen: (type: boolean) => void;
  refresh: boolean;
  setPageIndex: (type: number) => void;
  pageIndex: number;
  addModalOpen: boolean;
  deleteModalOpen: boolean;
  setDeleteSelectedButton: (type: boolean) => void;
  deleteModalId: any;
  setDeleteModalId: any;
  fieldTypeFilter: number;
  areaTypeFilter: number;
  searchCounter: number;
}

const CustomFieldsList = ({
  searchTerm,
  setTotalRows,
  setAddModalOpen,
  setEditModalId,
  setDiscountMarginTitle,
  setDeleteModalOpen,
  refresh,
  searchCounter,
  setPageIndex,
  pageIndex,
  addModalOpen,
  deleteModalOpen,
  setDeleteSelectedButton,
  deleteModalId,
  setDeleteModalId,
  fieldTypeFilter,
  areaTypeFilter,
}: ComponentProps) => {
  const [discountMargins, setDiscountMargins] = useState<any>([]);
  const [selectAll, setSelectAll] = useState(false);
  const intl = useIntl();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchCustomFields = async () => {
    setIsLoading(true);
    try {
      const response = await getCustomFields(
        searchTerm,
        fieldTypeFilter,
        areaTypeFilter,
        pageIndex
      );
      setDiscountMargins(response);
      setPageIndex(response.pageIndex);
      setTotalRows(response.totalRows);
    } catch (error) {
      console.error("Error fetching custom fields:", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchCustomFields();
  }, [
    searchTerm,
    areaTypeFilter,
    fieldTypeFilter,
    pageIndex,
    searchCounter,
    refresh,
  ]);

  const handlePageChange = (page: number) => {
    setPageIndex(page);
    fetchCustomFields();
  };
  useEffect(() => {
    if (deleteModalId.length == 0) {
      setDeleteSelectedButton(false);
    }
  }, [deleteModalId]);

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
        (item: CustomFieldResult) => item.id
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
              <th>{intl.formatMessage({ id: "Fields.AreaUsageType" })}</th>
              <th>{intl.formatMessage({ id: "Fields.FieldType" })}</th>
              <th className="text-center">
                {intl.formatMessage({ id: "Fields.ShowOnInvoice" })}
              </th>
              <th className="text-center">
                {intl.formatMessage({
                  id: "Fields.ShowOnQuote",
                })}
              </th>
            </tr>
          </thead>
          <tbody>
            {discountMargins?.result?.map(
              (discountMargin: CustomFieldResult, index: number) => (
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
                  <td className="cursor-pointer fw-bold">
                    {discountMargin.areaUsageType.name}
                  </td>
                  <td className="cursor-pointer fw-bold">
                    {discountMargin.fieldType.name}
                  </td>

                  <td className="cursor-pointer text-center">
                    {discountMargin.includeOnInvoiceType.value != 0 ? (
                      <i className="ki-duotone ki-check text-success fs-2x" />
                    ) : (
                      <i className="ki-duotone ki-check text-secondary fs-2x" />
                    )}
                  </td>
                  <td className="cursor-pointer text-center">
                    {discountMargin.includeOnQuoteType.value != 0 ? (
                      <i className="ki-duotone ki-check text-success fs-2x" />
                    ) : (
                      <i className="ki-duotone ki-check text-secondary fs-2x" />
                    )}
                  </td>

                  <td className="text-end">
                    {discountMargin.actions.canEdit && (
                      <Tippy
                        content={intl.formatMessage({
                          id: "Fields.ToolTipEdit",
                        })}
                      >
                        <button
                          className="btn btn-icon btn-light btn-sm me-2"
                          onClick={() => openEditModal(discountMargin.id)}
                        >
                          <i className="ki-solid ki-pencil text-warning fs-2" />
                        </button>
                      </Tippy>
                    )}

                    {discountMargin.actions.canDelete && (
                      <Tippy
                        content={intl.formatMessage({
                          id: "Fields.ToolTipDelete",
                        })}
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
                      </Tippy>
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
        <CustomFieldsPagination
          totalPages={discountMargins.totalPages}
          pageIndex={pageIndex}
          setPageIndex={setPageIndex}
          filterType1={fieldTypeFilter}
          filterType2={areaTypeFilter}
          onPageChange={handlePageChange}
          totalItems={discountMargins.totalRows}
        />
      )}
    </div>
  );
};

export { CustomFieldsList };
