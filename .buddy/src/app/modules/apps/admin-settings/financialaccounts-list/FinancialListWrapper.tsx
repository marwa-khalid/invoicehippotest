import { FinancialListHeader } from "./components/header/FinancialListHeader";
import { FinancialAccountsList } from "./search-list/FinancialAccountsList";
import { FinancialAddModal } from "./financial-add-modal/FinancialAddModal";
import { ToolbarWrapper } from "../../../../../_metronic/layout/components/toolbar";
import { Content } from "../../../../../_metronic/layout/components/content";
import { useState } from "react";
import { FinancialAccountsToolbar } from "./components/header/FinancialAccountsToolbar";
import { FinancialEditModal } from "./financial-edit-modal/FinancialEditModal";
import { FinancialDeleteModal } from "./financial-delete-modal/FinancialDeleteModal";
import { BankLinkModal } from "./financial-link-modal/BankLinkModal";
import { FinancialUnlinkModal } from "./financial-unlink-modal/FinancialUnlinkModal";

const getPaginationValues = () => {
  const storedPaginationString = localStorage.getItem("pagination")!;
  if (storedPaginationString) {
    const pagination = JSON.parse(storedPaginationString);
    const currentPage = pagination["financial-module"].pageIndex || 1;
    const searchTerm = pagination["financial-module"].filters.searchTerm || "";

    return {
      pageIndex: currentPage,
      searchTerm: searchTerm,
    };
  }
  return { pageIndex: 1, searchTerm: "" };
};
const FinancialListInnerWrapper = () => {
  const { pageIndex, searchTerm } = getPaginationValues();
  const [pageIndexState, setPageIndexState] = useState<number>(pageIndex);
  const [searchTermState, setSearchTermState] = useState(searchTerm);
  const [searchCounter, setSearchCounter] = useState(0);
  const [totalRows, setTotalRows] = useState(0);
  const [editModalId, setEditModalId] = useState<number>(0);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [addModalOpen, setAddModalOpen] = useState<boolean>(false);
  const [linkModalOpen, setLinkModalOpen] = useState<boolean>(false);
  const [unlinkModalOpen, setUnlinkModalOpen] = useState<boolean>(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [ledgerAccountTitle, setLedgerAccountTitle] = useState<string>("");
  const [refresh, setRefresh] = useState(false);

  return (
    <>
      <FinancialListHeader
        setSearchTerm={setSearchTermState}
        searchTerm={searchTerm}
        setSearchCounter={setSearchCounter}
      />
      <FinancialAccountsToolbar
        totalRows={totalRows}
        setAddModalOpen={setAddModalOpen}
        setLinkModalOpen={setLinkModalOpen}
      />
      <FinancialAccountsList
        searchCounter={searchCounter}
        searchTerm={searchTerm}
        setTotalRows={setTotalRows}
        setEditModalOpen={setEditModalOpen}
        setDeleteModalOpen={setDeleteModalOpen}
        setUnlinkModalOpen={setUnlinkModalOpen}
        setEditModalId={setEditModalId}
        setLedgerAccountTitle={setLedgerAccountTitle}
        refresh={refresh}
        pageIndex={pageIndex}
        setPageIndex={setPageIndexState}
        editModalOpen={editModalOpen}
        deleteModalOpen={deleteModalOpen}
        addModalOpen={addModalOpen}
      />
      {addModalOpen && (
        <FinancialAddModal
          setRefresh={setRefresh}
          refresh={refresh}
          setAddModalOpen={setAddModalOpen}
        />
      )}
      {linkModalOpen && (
        <BankLinkModal
          setRefresh={setRefresh}
          setLinkModalOpen={setLinkModalOpen}
          refresh={refresh}
        />
      )}
      {unlinkModalOpen && (
        <FinancialUnlinkModal
          deleteModalId={editModalId}
          setUnlinkModalOpen={setUnlinkModalOpen}
          setRefresh={setRefresh}
          refresh={refresh}
        />
      )}
      {editModalOpen && (
        <FinancialEditModal
          editModalId={editModalId}
          setRefresh={setRefresh}
          refresh={refresh}
          setEditModalOpen={setEditModalOpen}
        />
      )}
      {deleteModalOpen && (
        <FinancialDeleteModal
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

const FinancialListWrapper = () => (
  <>
    <ToolbarWrapper />
    <Content>
      <FinancialListInnerWrapper />
    </Content>
  </>
);

export { FinancialListWrapper };
