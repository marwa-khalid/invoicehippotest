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
  setDeleteSelectedButton: (type: boolean) => void;
  deleteModalId: any;
  setDeleteModalId: any;
  searchCounter: number;
  budgetGroupId: number | null;
  setBudgetTitle: (type: string) => void;
}

const BudgetList = ({
  searchTerm,
  setAddModalOpen,
  setEditModalId,
  budgetGroupId,
  setBudgetTitle,
  setDeleteModalOpen,
  refresh,
  setPageIndex,
  pageIndex,
  setDeleteSelectedButton,
  deleteModalId,
  setDeleteModalId,
  searchCounter,
  setTotalRows,
}: ComponentProps) => {
  const [budgets, setBudgets] = useState<any>([]);
  const intl = useIntl();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (deleteModalId.length == 0) {
      setDeleteSelectedButton(false);
    }
  }, [deleteModalId]);
  const fetchBudgets = async () => {
    try {
      setIsLoading(true);
      const response = await getBudgets(
        searchTerm,
        pageIndex,
        10,
        budgetGroupId
      );

      if (response.isValid) {
        setBudgets(response);
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
    fetchBudgets();
  }, [searchTerm, searchCounter, refresh, pageIndex, budgetGroupId]);

  const openEditModal = (id: number) => {
    setEditModalId(id);
    setAddModalOpen(true);
  };

  const openDeleteModal = (budget: BudgetResult) => {
    setDeleteModalId([budget.id]);
    setBudgetTitle(budget.title);
    setDeleteModalOpen(true);
  };
  return (
    <div className="card py-3  p-10">
      <div className="table-responsive">
        <table className="table table-row-dashed table-row-gray-300 align-top gs-0 gy-4">
          <thead>
            <tr className="fw-bold text-muted">
              <th className="w-auto">
                {intl.formatMessage({ id: "Fields.Title" })}
              </th>
              <th className="w-25px">
                {intl.formatMessage({ id: "Menu.BudgetGroups" })}
              </th>
              <th>
                {intl.formatMessage({ id: "Fields.LinkedLedgerAccounts" })}
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {budgets?.result?.map((budget: BudgetResult) => (
              <tr key={budget.id}>
                <td width={350}>
                  <div
                    className="d-flex flex-column align-items-start cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      openEditModal(budget.id);
                    }}
                  >
                    <span className="fw-bold">{budget.title}</span>
                  </div>
                  {/* <div className="d-flex flex-column align-items-start">
                    <small
                      className="text-muted font-weight-light fs-9"
                      dangerouslySetInnerHTML={{ __html: budget.description }}
                    />
                  </div> */}
                </td>

                <td width={200}>
                  {budget.hasBudgetGroup && (
                    // <>
                    <div className="d-flex flex-column align-items-start cursor-pointer">
                      <span className="fw-bold">
                        {budget.budgetGroup.title}
                      </span>
                    </div>
                    // <div className="d-flex flex-column align-items-start">
                    //   <small
                    //     className="text-muted font-weight-light fs-9"
                    //     dangerouslySetInnerHTML={{
                    //       __html: budget.budgetGroup.description,
                    //     }}
                    //   />
                    // </div>
                    // </>
                  )}
                </td>
                {/* <td>
                  {budget.budgetGroup.subjects?.map(
                    (subject) => subject.title
                  )}
                  {budget.budgetGroup.subjects?.map(
                    (subject) => subject.description
                  )}
                </td> */}

                <td className="text-muted" width={360}>
                  {budget.hasRelatedLedgerAccounts &&
                    budget.relatedLedgerAccounts.map((account) => (
                      <div
                        key={account.id}
                        className="d-flex flex-column align-items-start"
                      >
                        <span className="text-muted fw-normal">
                          <i className="ki-duotone ki-file">
                            <span className="path1"></span>
                            <span className="path2"></span>
                          </i>
                          &nbsp;
                          {account.code}-{account.title}
                        </span>
                      </div>
                    ))}
                </td>

                <td className="text-end">
                  <div className="d-flex gap-1 text-end justify-content-end">
                    {budget.actions.canEdit && (
                      <Tooltip.Provider delayDuration={0}>
                        <Tooltip.Root>
                          <Tooltip.Trigger asChild>
                            <button
                              className="btn btn-icon btn-light btn-sm"
                              onClick={() => openEditModal(budget.id)}
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

                    {budget.actions.canDelete && (
                      <Tooltip.Provider delayDuration={0}>
                        <Tooltip.Root>
                          <Tooltip.Trigger asChild>
                            <button
                              className="btn btn-icon btn-light btn-sm"
                              onClick={() => openDeleteModal(budget)}
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
                  </div>
                </td>
              </tr>
            ))}
            {budgets?.result?.length == 0 && (
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
      {budgets?.result?.length > 0 && (
        <ListPagination
          totalPages={budgets?.totalPages}
          pageIndex={pageIndex}
          moduleName="budgets-module"
          onPageChange={handlePageChange}
          totalItems={budgets?.totalRows}
        />
      )}
    </div>
  );
};

export { BudgetList };
