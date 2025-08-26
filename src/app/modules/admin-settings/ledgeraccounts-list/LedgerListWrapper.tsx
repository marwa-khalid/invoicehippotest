import { LedgerListHeader } from "./header/LedgerListHeader";
import { LedgerAccountsList } from "./search-list/LedgerAccountsList";
import { LedgerAddModal } from "./ledger-add-modal/LedgerAddModal";
import { ToolbarWrapper } from "../../../../_metronic/layout/components/toolbar";
import { Content } from "../../../../_metronic/layout/components/content";
import { useEffect, useState } from "react";
import { LedgerListToolbar } from "./header/LedgerListToolbar";
import { LedgerEditModal } from "./ledger-edit-modal/LedgerEditModal";
import { LedgerDeleteModal } from "./ledger-delete-modal/LedgerDeleteModal";
// @ts-ignore
import { getPaginationModule } from "../../../helpers/paginationUtils.js";

const LedgerListInnerWrapper = () => {
  const moduleKey = "ledger-module";
  let filters = getPaginationModule(moduleKey);

  const [searchCounter, setSearchCounter] = useState(0);
  const [ledgerTypeFilter, setLedgerTypeFilter] = useState<number>(
    filters.ledgerTypeFilter
  );
  const [bearingTypeFilter, setBearingTypeFilter] = useState<number>(
    filters.bearingTypeFilter
  );
  const [pageIndexState, setPageIndexState] = useState<number>(
    filters.pageIndex
  );
  const [searchTermState, setSearchTermState] = useState(filters.searchTerm);

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
        searchTerm={searchTermState}
        setLedgerTypeFilter={setLedgerTypeFilter}
        ledgerTypeFilter={ledgerTypeFilter}
        setBearingTypeFilter={setBearingTypeFilter}
        bearingTypeFilter={bearingTypeFilter}
        setSearchCounter={setSearchCounter}
        setPageIndex={setPageIndexState}
      />

      <LedgerListToolbar
        totalRows={totalRows}
        setAddModalOpen={setAddModalOpen}
      />

      <LedgerAccountsList
        searchCounter={searchCounter}
        searchTerm={searchTermState}
        ledgerTypeFilter={ledgerTypeFilter}
        bearingTypeFilter={bearingTypeFilter}
        setTotalRows={setTotalRows}
        setEditModalOpen={setEditModalOpen}
        setDeleteModalOpen={setDeleteModalOpen}
        setEditModalId={setEditModalId}
        setLedgerAccountTitle={setLedgerAccountTitle}
        refresh={refresh}
        pageIndex={pageIndexState}
        setPageIndex={setPageIndexState}
      />

      {addModalOpen && (
        <LedgerAddModal
          setRefresh={setRefresh}
          setAddModalOpen={setAddModalOpen}
          refresh={refresh}
        />
      )}
      {editModalOpen && (
        <LedgerEditModal
          editModalId={editModalId}
          setRefresh={setRefresh}
          setEditModalOpen={setEditModalOpen}
          refresh={refresh}
        />
      )}
      {deleteModalOpen && (
        <LedgerDeleteModal
          deleteModalId={editModalId}
          ledgerAccountTitle={ledgerAccountTitle}
          setDeleteModalOpen={setDeleteModalOpen}
          setRefresh={setRefresh}
          refresh={refresh}
        />
      )}
    </>
  );
};

const LedgerListWrapper = () => (
  <>
    <ToolbarWrapper />
    <Content>
      <LedgerListInnerWrapper />
    </Content>
  </>
);

export { LedgerListWrapper };
