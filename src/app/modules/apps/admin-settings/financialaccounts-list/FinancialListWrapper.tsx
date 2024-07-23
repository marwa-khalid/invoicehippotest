import { FinancialListHeader } from "./components/header/FinancialListHeader";
import { FinancialAccountsList } from "./search-list/FinancialAccountsList";
import { FinancialAddModal } from "./financial-add-modal/FinancialAddModal";
import { ToolbarWrapper } from "../../../../../_metronic/layout/components/toolbar";
import { Content } from "../../../../../_metronic/layout/components/content";
import { useEffect, useState } from "react";
import { LedgerListToolbar } from "./components/header/LedgerListToolbar";
import { FinancialEditModal } from "./financial-edit-modal/FinancialEditModal";
import { FinancialDeleteModal } from "./financial-delete-modal/FinancialDeleteModal";

const getPaginationValues = () => {
  const storedPaginationString = localStorage.getItem("pagination")!;
  if (storedPaginationString) {
    const pagination = JSON.parse(storedPaginationString);

    const currentMainFilter =
      pagination["ledger-module"].filters.ledgerTypeFilter || 0;
    const currentSubTypeFilter =
      pagination["ledger-module"].filters.bearingTypeFilter || 0;

    const currentPage = pagination["ledger-module"].pageIndex || 1;
    const searchTerm = pagination["ledger-module"].filters.searchTerm || "";

    return {
      mainfilter: currentMainFilter,
      subTypeFilter: currentSubTypeFilter,
      pageIndex: currentPage,
      searchTerm: searchTerm,
    };
  }
  return { mainfilter: 0, subTypeFilter: 0, pageIndex: 1, searchTerm: "" };
};
const FinancialListInnerWrapper = () => {
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const { mainfilter, subTypeFilter, pageIndex, searchTerm } =
    getPaginationValues();

  const [ledgerTypeFilter, setLedgerTypeFilter] = useState<number>(mainfilter);
  const [bearingTypeFilter, setBearingTypeFilter] =
    useState<number>(subTypeFilter);
  const [pageIndexState, setPageIndexState] = useState<number>(pageIndex);
  const [searchTermState, setSearchTermState] = useState(searchTerm);
  useEffect(() => {
    if (mainfilter !== 0) {
      setIsFilterApplied(true);
    }
  }, [mainfilter]);

  const [totalRows, setTotalRows] = useState(0);
  const [editModalId, setEditModalId] = useState<number>(0);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [addModalOpen, setAddModalOpen] = useState<boolean>(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [ledgerAccountTitle, setLedgerAccountTitle] = useState<string>("");
  const [refresh, setRefresh] = useState(false);

  return (
    <>
      <FinancialListHeader
        setSearchTerm={setSearchTermState}
        searchTerm={searchTerm}
        setLedgerTypeFilter={setLedgerTypeFilter}
        ledgerTypeFilter={ledgerTypeFilter}
        setBearingTypeFilter={setBearingTypeFilter}
        bearingTypeFilter={bearingTypeFilter}
        setIsFilterApplied={setIsFilterApplied}
        isFilterApplied={isFilterApplied}
      />

      <LedgerListToolbar
        totalRows={totalRows}
        setAddModalOpen={setAddModalOpen}
      />

      <FinancialAccountsList
        searchTerm={searchTerm}
        ledgerTypeFilter={ledgerTypeFilter}
        bearingTypeFilter={bearingTypeFilter}
        setTotalRows={setTotalRows}
        setEditModalOpen={setEditModalOpen}
        setDeleteModalOpen={setDeleteModalOpen}
        setEditModalId={setEditModalId}
        setLedgerAccountTitle={setLedgerAccountTitle}
        refresh={refresh}
        pageIndex={pageIndex}
        setPageIndex={setPageIndexState}
        editModalOpen={editModalOpen}
        deleteModalOpen={deleteModalOpen}
      />

      {addModalOpen && (
        <FinancialAddModal
          setRefresh={setRefresh}
          setAddModalOpen={setAddModalOpen}
        />
      )}
      {editModalOpen && (
        <FinancialEditModal
          editModalId={editModalId}
          setRefresh={setRefresh}
          setEditModalOpen={setEditModalOpen}
        />
      )}
      {deleteModalOpen && (
        <FinancialDeleteModal
          deleteModalId={editModalId}
          ledgerAccountTitle={ledgerAccountTitle}
          setDeleteModalOpen={setDeleteModalOpen}
          setRefresh={setRefresh}
        />
      )}
    </>
  );
};

const FinancialListWrapper = () => (
  <>
    <ToolbarWrapper />
    <Content>
      <FinancialListInnerWrapper />
    </Content>
  </>
);

export { FinancialListWrapper };
