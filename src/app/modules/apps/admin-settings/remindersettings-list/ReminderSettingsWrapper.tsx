import { LedgerListHeader } from "./components/header/LedgerListHeader";
import { LedgerAccountsList } from "./search-list/LedgerAccountsList";
import { LedgerAddModal } from "./ledger-add-modal/LedgerAddModal";
import { ToolbarWrapper } from "../../../../../_metronic/layout/components/toolbar";
import { Content } from "../../../../../_metronic/layout/components/content";
import { useEffect, useState } from "react";
import { LedgerListToolbar } from "./components/header/LedgerListToolbar";
import { LedgerEditModal } from "./ledger-edit-modal/LedgerEditModal";
import { LedgerDeleteModal } from "./ledger-delete-modal/LedgerDeleteModal";

const getPaginationValues = () => {
  const storedPaginationString = localStorage.getItem("pagination")!;
  if (storedPaginationString) {
    const pagination = JSON.parse(storedPaginationString);

    const currentMainFilter =
      pagination["notifications-module"].filters.areaUsageType || 0;

    const currentPage = pagination["notifications-module"].pageIndex || 1;
    const searchTerm =
      pagination["notifications-module"].filters.searchTerm || "";

    return {
      mainfilter: currentMainFilter,
      pageIndex: currentPage,
      searchTerm: searchTerm,
    };
  }
  return { mainfilter: 0, subTypeFilter: 0, pageIndex: 1, searchTerm: "" };
};
const ReminderSettingsInnerWrapper = () => {
  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const { mainfilter, subTypeFilter, pageIndex, searchTerm } =
    getPaginationValues();
  const [searchCounter, setSearchCounter] = useState(0);
  const [ledgerTypeFilter, setLedgerTypeFilter] = useState<number>(mainfilter);
  const [bearingTypeFilter, setBearingTypeFilter] = useState<number>(0);
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
      <LedgerListHeader
        setSearchTerm={setSearchTermState}
        searchTerm={searchTerm}
        setLedgerTypeFilter={setLedgerTypeFilter}
        ledgerTypeFilter={ledgerTypeFilter}
        setBearingTypeFilter={setBearingTypeFilter}
        bearingTypeFilter={bearingTypeFilter}
        setIsFilterApplied={setIsFilterApplied}
        isFilterApplied={isFilterApplied}
        setSearchCounter={setSearchCounter}
      />

      <LedgerListToolbar
        totalRows={totalRows}
        setAddModalOpen={setAddModalOpen}
      />

      <LedgerAccountsList
      searchCounter={searchCounter}
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
        <LedgerAddModal
          setRefresh={setRefresh}
          setAddModalOpen={setAddModalOpen}
        />
      )}
      {editModalOpen && (
        <LedgerEditModal
          editModalId={editModalId}
          setRefresh={setRefresh}
          setEditModalOpen={setEditModalOpen}
        />
      )}
      {deleteModalOpen && (
        <LedgerDeleteModal
          deleteModalId={editModalId}
          ledgerAccountTitle={ledgerAccountTitle}
          setDeleteModalOpen={setDeleteModalOpen}
          setRefresh={setRefresh}
        />
      )}
    </>
  );
};

const ReminderSettingsWrapper = () => (
  <>
    <ToolbarWrapper />
    <Content>
      <ReminderSettingsInnerWrapper />
    </Content>
  </>
);

export { ReminderSettingsWrapper };
