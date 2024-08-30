import { FinancialListHeader } from "./components/header/FinancialListHeader";
import { FinancialAccountsList } from "./search-list/FinancialAccountsList";
import { ClientAddModal } from "./client-add-modal/ClientAddModal";
import { ToolbarWrapper } from "../../../../../_metronic/layout/components/toolbar";
import { Content } from "../../../../../_metronic/layout/components/content";
import { useState } from "react";
import { FinancialAccountsToolbar } from "./components/header/FinancialAccountsToolbar";
import { FinancialDeleteModal } from "./financial-delete-modal/FinancialDeleteModal";

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

  const [totalRows, setTotalRows] = useState(0);
  const [editModalId, setEditModalId] = useState<number>(0);
  const [deleteModalId, setDeleteModalId] = useState<number[]>([0]);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [addModalOpen, setAddModalOpen] = useState<boolean>(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [intlMessage, setIntlMessage] = useState<string>("");
  const [refresh, setRefresh] = useState(false);

  return (
    <>
      <FinancialListHeader
        setSearchTerm={setSearchTermState}
        searchTerm={searchTerm}
      />
      <FinancialAccountsToolbar
        totalRows={totalRows}
        setAddModalOpen={setAddModalOpen}
      />
      <FinancialAccountsList
        searchTerm={searchTerm}
        setTotalRows={setTotalRows}
        setEditModalOpen={setEditModalOpen}
        setDeleteModalOpen={setDeleteModalOpen}
        setEditModalId={setEditModalId}
        setDeleteModalId={setDeleteModalId}
        setTitle={setTitle}
        refresh={refresh}
        pageIndex={pageIndex}
        setPageIndex={setPageIndexState}
        editModalOpen={editModalOpen}
        deleteModalOpen={deleteModalOpen}
        setIntlMessage={setIntlMessage}
      />
      {(addModalOpen || editModalOpen) && (
        <ClientAddModal
          setRefresh={setRefresh}
          setAddModalOpen={setAddModalOpen}
          setDeleteModalOpen={setDeleteModalOpen}
          setEditModalId={setEditModalId}
          setDeleteModalId={setDeleteModalId}
          setTitle={setTitle}
          editModalId={editModalId}
          setIntlMessage={setIntlMessage}
          deleteModalOpen={deleteModalOpen}
          setEditModalOpen={setEditModalOpen}
        />
      )}

      {/* {editModalOpen && (
        <FinancialEditModal
          editModalId={editModalId}
          setRefresh={setRefresh}
          setEditModalOpen={setEditModalOpen}
        />
      )} */}
      {deleteModalOpen && (
        <FinancialDeleteModal
          deleteModalId={deleteModalId}
          title={title}
          setDeleteModalOpen={setDeleteModalOpen}
          setRefresh={setRefresh}
          intlMessage={intlMessage}
        />
      )}
    </>
  );
};

const ClientWrapper = () => (
  <>
    <ToolbarWrapper />
    <Content>
      <FinancialListInnerWrapper />
    </Content>
  </>
);

export { ClientWrapper };
