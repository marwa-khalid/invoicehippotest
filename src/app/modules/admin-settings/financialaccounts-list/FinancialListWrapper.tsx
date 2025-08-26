import { FinancialListHeader } from "./components/header/FinancialListHeader";
import { FinancialAccountsList } from "./search-list/FinancialAccountsList";
import { FinancialAddModal } from "./financial-add-modal/FinancialAddModal";
import { ToolbarWrapper } from "../../../../_metronic/layout/components/toolbar";
import { Content } from "../../../../_metronic/layout/components/content";
import { useState } from "react";
import { FinancialAccountsToolbar } from "./components/header/FinancialAccountsToolbar";
import { FinancialEditModal } from "./financial-edit-modal/FinancialEditModal";
import { FinancialDeleteModal } from "./financial-delete-modal/FinancialDeleteModal";
import { BankLinkModal } from "./financial-link-modal/BankLinkModal";
import { FinancialUnlinkModal } from "./financial-unlink-modal/FinancialUnlinkModal";
// @ts-ignore
import { getPaginationModule } from "../../../helpers/paginationUtils.js";

const FinancialListInnerWrapper = () => {
  const moduleKey = "financial-module";
  let filters = getPaginationModule(moduleKey);

  const [pageIndexState, setPageIndexState] = useState<number>(
    filters.pageIndex || 1
  );
  const [searchTermState, setSearchTermState] = useState(
    filters.searchTerm || ""
  );
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
        searchTerm={searchTermState}
        setSearchCounter={setSearchCounter}
        setPageIndex={setPageIndexState}
      />
      <FinancialAccountsToolbar
        totalRows={totalRows}
        setAddModalOpen={setAddModalOpen}
        setLinkModalOpen={setLinkModalOpen}
      />
      <FinancialAccountsList
        searchCounter={searchCounter}
        searchTerm={searchTermState}
        setTotalRows={setTotalRows}
        setEditModalOpen={setEditModalOpen}
        setDeleteModalOpen={setDeleteModalOpen}
        setUnlinkModalOpen={setUnlinkModalOpen}
        setEditModalId={setEditModalId}
        setLedgerAccountTitle={setLedgerAccountTitle}
        refresh={refresh}
        pageIndex={pageIndexState}
        setPageIndex={setPageIndexState}
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
