import React, { useEffect, useState } from "react";
import { getUnitTypes } from "../core/_requests";
import { FinancialAccountsResult, UnitTypesResult } from "../core/_models";
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
  setAccountTitle: (type: string) => void;
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
  setAccountTitle,
  setDeleteModalOpen,
  refresh,
  setPageIndex,
  pageIndex,
  editModalOpen,
  deleteModalOpen,
}: ComponentProps) => {
  const [financialAccounts, setFinancialAccounts] = useState<any>([]);
  const intl = useIntl();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchFinancialAccounts = async () => {
    setIsLoading(true);
    try {
      const response = await getUnitTypes(searchTerm, pageIndex);
      setFinancialAccounts(response);
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

  const openDeleteModal = (id: number, ledgerTitle: string) => {
    setEditModalId(id);
    setDeleteModalOpen(true);
    setAccountTitle(ledgerTitle);
  };

  return (
    <div className="card-body py-3 bg-white p-10">
      <div className="table-responsive">
        <table className="table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4">
          <thead>
            <tr className="fw-bold text-muted">
              <th>#</th>
              <th>{intl.formatMessage({ id: "Fields.Title" })}</th>
              <th>{intl.formatMessage({ id: "Fields.IsDefault" })}</th>
              <th>{intl.formatMessage({ id: "Fields.ColumnActions" })}</th>
            </tr>
          </thead>
          <tbody>
            {financialAccounts?.result?.map(
              (financialAccount: UnitTypesResult, index: number) => (
                <tr key={financialAccount.id}>
                  <td>{index + 1}</td>
                  <td>{financialAccount.title}</td>
                  <td className="cursor-pointer">
                    {financialAccount.isDefault ? (
                      <KTSVG
                        path="media/icons/duotune/general/gen048.svg"
                        className="svg-icon-muted svg-icon-2hx text-success"
                      />
                    ) : (
                      <KTSVG
                        path="media/icons/duotune/general/gen050.svg"
                        className="svg-icon-muted svg-icon-2hx text-danger"
                      />
                    )}
                  </td>

                  <td>
                    {financialAccount.actions.canEdit && (
                      <button
                        className="btn btn-icon btn-light btn-sm me-2"
                        onClick={() => openEditModal(financialAccount.id)}
                      >
                        <i className="ki-solid ki-pencil text-warning fs-2" />
                      </button>
                    )}

                    {financialAccount.actions.canDelete && (
                      <button
                        className="btn btn-icon btn-light btn-sm"
                        onClick={() =>
                          openDeleteModal(
                            financialAccount.id,
                            financialAccount.title
                          )
                        }
                      >
                        <i className="ki-solid ki-trash text-danger fs-2" />
                      </button>
                    )}
                  </td>
                </tr>
              )
            )}
            {financialAccounts?.result?.length == 0 && (
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
      {financialAccounts?.result?.length > 0 && (
        <UnitTypesPagination
          totalPages={financialAccounts.totalPages}
          pageIndex={pageIndex}
          setPageIndex={setPageIndex}
          onPageChange={handlePageChange}
          totalItems={financialAccounts.totalRows}
        />
      )}
    </div>
  );
};

export { UnitTypesList };
