import { useEffect, useState } from "react";
import { getUnitTypes } from "../core/_requests";
import { UnitTypesResult } from "../core/_models";
import { ListLoading } from "../../components/ListLoading";
import { UnitTypesPagination } from "../components/pagination/UnitTypesPagination";
import { KTCardBody } from "../../../../../../_metronic/helpers";
import { useIntl } from "react-intl";
import { toAbsoluteUrl } from "../../../../../../_metronic/helpers";
import { KTSVG } from "../../../../../../_metronic/helpers";

interface ComponentProps {
  searchTerm: string;
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
}

const UnitTypesList = ({
  searchTerm,
  setTotalRows,
  setEditModalOpen,
  setEditModalId,
  setUnitTypeTitle,
  setDeleteModalOpen,
  refresh,
  setPageIndex,
  pageIndex,
  editModalOpen,
  deleteModalOpen,
}: ComponentProps) => {
  const [unitTypes, setUnitTypes] = useState<any>([]);
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

  const handlePageChange = (page: number) => {
    setPageIndex(page);
    fetchFinancialAccounts();
  };

  useEffect(() => {
    fetchFinancialAccounts();
  }, [searchTerm, pageIndex]);

  useEffect(() => {
    fetchFinancialAccounts();
  }, [editModalOpen, deleteModalOpen, refresh]);

  const openEditModal = (id: number) => {
    setEditModalId(id);
    setEditModalOpen(true);
  };

  const openDeleteModal = (id: number, unitTypeTitle: string) => {
    setEditModalId(id);
    setDeleteModalOpen(true);
    setUnitTypeTitle(unitTypeTitle);
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
                    value="1"
                    data-kt-check="true"
                    data-kt-check-target=".widget-9-check"
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
                  {" "}
                  <div className="form-check form-check-sm form-check-custom form-check-solid">
                    <input
                      className="form-check-input widget-9-check"
                      type="checkbox"
                      value="1"
                    />
                  </div>
                </td>
                <td className=" text-muted">|</td>
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
                    <button
                      className="btn btn-icon btn-light btn-sm me-2"
                      onClick={() => openEditModal(unitType.id)}
                    >
                      <i className="ki-solid ki-pencil text-warning fs-2" />
                    </button>
                  )}

                  {unitType.actions.canDelete && (
                    <button
                      className="btn btn-icon btn-light btn-sm"
                      onClick={() =>
                        openDeleteModal(unitType.id, unitType.title)
                      }
                    >
                      <i className="ki-solid ki-trash text-danger fs-2" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {unitTypes?.result?.length == 0 && (
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
