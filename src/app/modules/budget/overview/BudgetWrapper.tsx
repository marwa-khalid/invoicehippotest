import { BudgetHeader } from "./header/BudgetHeader.js";
import { BudgetList } from "./search-list/BudgetList.js";
import { BudgetAddModal } from "./budget-add-modal/BudgetAddModal.js";
import { ToolbarWrapper } from "../../../../_metronic/layout/components/toolbar/index.js";
import { Content } from "../../../../_metronic/layout/components/content/index.js";
import { useState } from "react";
import { BudgetToolbar } from "./header/BudgetToolbar.js";
import { BudgetDeleteModal } from "./budget-delete-modal/BudgetDeleteModal.js";
// @ts-ignore
import { getPaginationModule } from "../../../helpers/paginationUtils.js";

const BudgetInnerWrapper = () => {
  const moduleKey = "budgets-module";
  let filters = getPaginationModule(moduleKey);

  const [pageIndexState, setPageIndexState] = useState<number>(
    filters.pageIndex || 1
  );
  const [searchTermState, setSearchTermState] = useState(
    filters.searchTerm || ""
  );
  const [deleteSelectedButton, setDeleteSelectedButton] =
    useState<boolean>(false);
  const [totalRows, setTotalRows] = useState(0);
  const [editModalId, setEditModalId] = useState<number>(0);
  const [deleteModalId, setDeleteModalId] = useState<number[]>([]);
  const [addModalOpen, setAddModalOpen] = useState<boolean>(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [searchCounter, setSearchCounter] = useState(0);
  const [budgetTitle, setBudgetTitle] = useState<string>("");
  const [budgetGroupId, setBudgetGroupId] = useState<number | null>(
    filters.budgetGroupId || null
  );

  return (
    <>
      <BudgetHeader
        setSearchTerm={setSearchTermState}
        searchTerm={searchTermState}
        setBudgetGroupId={setBudgetGroupId}
        budgetGroupId={budgetGroupId}
        setSearchCounter={setSearchCounter}
        setPageIndexState={setPageIndexState}
      />

      <BudgetToolbar
        totalRows={totalRows}
        setAddModalOpen={setAddModalOpen}
        setEditModalId={setEditModalId}
      />

      <BudgetList
        searchCounter={searchCounter}
        searchTerm={searchTermState}
        budgetGroupId={budgetGroupId}
        setBudgetTitle={setBudgetTitle}
        setTotalRows={setTotalRows}
        setAddModalOpen={setAddModalOpen}
        setDeleteModalOpen={setDeleteModalOpen}
        setEditModalId={setEditModalId}
        refresh={refresh}
        pageIndex={pageIndexState}
        setPageIndex={setPageIndexState}
        deleteModalId={deleteModalId}
        setDeleteSelectedButton={setDeleteSelectedButton}
        setDeleteModalId={setDeleteModalId}
      />

      {addModalOpen && (
        <BudgetAddModal
          setRefresh={setRefresh}
          setAddModalOpen={setAddModalOpen}
          editModalId={editModalId}
          refresh={refresh}
          setEditModalId={setEditModalId}
        />
      )}

      {deleteModalOpen && (
        <BudgetDeleteModal
          deleteModalId={deleteModalId}
          setDeleteModalOpen={setDeleteModalOpen}
          setRefresh={setRefresh}
          budgetTitle={budgetTitle}
          setDeleteModalId={setDeleteModalId}
          refresh={refresh}
        />
      )}
    </>
  );
};

const BudgetWrapper = () => (
  <>
    <ToolbarWrapper />
    <Content>
      <BudgetInnerWrapper />
    </Content>
  </>
);

export { BudgetWrapper };
