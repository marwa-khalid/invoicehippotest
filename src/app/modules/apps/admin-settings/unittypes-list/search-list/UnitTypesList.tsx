import { useEffect, useState } from "react";
import { getUnitTypes } from "../core/_requests";
import { UnitTypesResult } from "../core/_models";
import { ListLoading } from "../../../components/ListLoading";
import { UnitTypesPagination } from "../components/pagination/UnitTypesPagination";
import { useIntl } from "react-intl";
import { toAbsoluteUrl } from "../../../../../../_metronic/helpers";
import { Tooltip } from "@chakra-ui/react";
import Tippy from "@tippyjs/react";

interface ComponentProps {
  searchTerm: string;
  searchCounter: number;
  setTotalRows: (type: number) => void;
  setEditModalOpen: (type: boolean) => void;
  setEditModalId: (type: number) => void;
  setUnitTypeTitle: (type: string) => void;
  setDeleteModalOpen: (type: boolean) => void;
  refresh: boolean;
  setPageIndex: (type: number) => void;
  pageIndex: number;
  editModalOpen: boolean;
  deleteModalOpen: boolean;
  setDeleteSelectedButton: (type: boolean) => void;
  deleteModalId: any;
  addModalOpen: boolean;
  setDeleteModalId: any;
}

const UnitTypesList = ({
  searchTerm,
  setTotalRows,
  setEditModalOpen,
  setEditModalId,
  setUnitTypeTitle,
  setDeleteModalOpen,
  setDeleteModalId,
  addModalOpen,
  refresh,
  setPageIndex,
  pageIndex,
  editModalOpen,
  searchCounter,
  deleteModalOpen,
  setDeleteSelectedButton,
  deleteModalId,
}: ComponentProps) => {
  const [unitTypes, setUnitTypes] = useState<any>([]);

  const [selectAll, setSelectAll] = useState(false);
  const intl = useIntl();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchFinancialAccounts = async () => {
    setIsLoading(true);
    try {
      const response = await getUnitTypes(searchTerm, pageIndex);
      setUnitTypes(response);
      setPageIndex(response.pageIndex);
      setTotalRows(response.totalRows);
    } catch (error) {
      console.error("Error fetching unit types:", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (deleteModalId.length == 0) {
      setDeleteSelectedButton(false);
    }
  }, [deleteModalId]);

  useEffect(() => {
    fetchFinancialAccounts();
  }, [searchTerm, pageIndex, searchCounter]);

  useEffect(() => {
    fetchFinancialAccounts();
  }, [editModalOpen, deleteModalOpen, addModalOpen, refresh]);

  const handlePageChange = (page: number) => {
    setPageIndex(page);
    fetchFinancialAccounts();
  };

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
      const allIds = unitTypes.result.map((item: UnitTypesResult) => item.id);
      setDeleteModalId(allIds);
      setDeleteSelectedButton(true);
    }
    setSelectAll(!selectAll);
  };

  const openEditModal = (id: number) => {
    setEditModalId(id);
    setEditModalOpen(true);
  };

  const openDeleteModal = (id: number, unitTypeTitle: string) => {
    setDeleteModalId([id]);
    setDeleteModalOpen(true);
    setUnitTypeTitle(unitTypeTitle);
  };

  return (
    <div className="card py-3 p-10">
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
              <th>{intl.formatMessage({ id: "Fields.IsDefault" })}</th>
            </tr>
          </thead>
          <tbody>
            {unitTypes?.result?.map((unitType: UnitTypesResult) => (
              <tr key={unitType.id}>
                <td>
                  <div className="form-check form-check-sm form-check-custom form-check-solid">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={deleteModalId?.includes(unitType.id)}
                      onChange={() => toggleRowSelection(unitType.id)}
                    />
                  </div>
                </td>
                <td className="text-muted">|</td>
                <td
                  className="cursor-pointer fw-bold"
                  onClick={() => openEditModal(unitType.id)}
                >
                  {unitType.title}
                </td>
                <td className="cursor-pointer">
                  {unitType.isDefault ? (
                    <i className="ki-duotone ki-check text-success fs-2x" />
                  ) : (
                    <i className="ki-duotone ki-check text-secondary fs-2x" />
                  )}
                </td>
                <td className="text-end">
                  {unitType.actions.canEdit && (
                    <Tippy
                      content={intl.formatMessage({
                        id: "Fields.ToolTipEdit",
                      })}
                    >
                      <button
                        className="btn btn-icon btn-light btn-sm me-2"
                        onClick={() => openEditModal(unitType.id)}
                      >
                        <i className="ki-solid ki-pencil text-warning fs-2" />
                      </button>
                    </Tippy>
                  )}
                  {unitType.actions.canDelete && (
                    <Tippy
                      content={intl.formatMessage({
                        id: "Fields.ToolTipDelete",
                      })}
                    >
                      <button
                        className="btn btn-icon btn-light btn-sm"
                        onClick={() =>
                          openDeleteModal(unitType.id, unitType.title)
                        }
                      >
                        <i className="ki-solid ki-trash text-danger fs-2" />
                      </button>
                    </Tippy>
                  )}
                </td>
              </tr>
            ))}
            {unitTypes?.result?.length === 0 && (
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
      {unitTypes?.result?.length > 0 && (
        <UnitTypesPagination
          totalPages={unitTypes.totalPages}
          pageIndex={pageIndex}
          setPageIndex={setPageIndex}
          onPageChange={handlePageChange}
          totalItems={unitTypes.totalRows}
        />
      )}
    </div>
  );
};

export { UnitTypesList };
