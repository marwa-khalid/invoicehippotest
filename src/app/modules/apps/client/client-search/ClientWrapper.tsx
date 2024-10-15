import { ClientHeader } from "./components/header/ClientHeader";
import { ClientsList } from "./search-list/ClientsList";
import { ClientAddModal } from "./client-add-modal/ClientAddModal";
import { ToolbarWrapper } from "../../../../../_metronic/layout/components/toolbar";
import { Content } from "../../../../../_metronic/layout/components/content";
import { useState } from "react";
import { ClientToolbar } from "./components/header/ClientToolbar";
import { ClientDeleteModal } from "./client-delete-modal/ClientDeleteModal";

const getPaginationValues = () => {
  const storedPaginationString = localStorage.getItem("pagination")!;
  if (storedPaginationString) {
    const pagination = JSON.parse(storedPaginationString);

    const currentPage = pagination["clients-module"].pageIndex || 1;
    const searchTerm = pagination["clients-module"].filters.searchTerm || "";

    return {
      pageIndex: currentPage,
      searchTerm: searchTerm,
    };
  }
  return { pageIndex: 1, searchTerm: "" };
};
const ClientInnerWrapper = () => {
  const { pageIndex, searchTerm } = getPaginationValues();
  const [pageIndexState, setPageIndexState] = useState<number>(pageIndex);
  const [searchTermState, setSearchTermState] = useState(searchTerm);
  const [totalRows, setTotalRows] = useState(0);
  const [editModalId, setEditModalId] = useState<number>(0);
  const [deleteModalId, setDeleteModalId] = useState<number[]>([0]);
  const [addModalOpen, setAddModalOpen] = useState<boolean>(false);
  const [searchCounter, setSearchCounter] = useState(0);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [intlMessage, setIntlMessage] = useState<string>("");
  const [refresh, setRefresh] = useState(false);

  return (
    <>
      <ClientHeader
        setSearchTerm={setSearchTermState}
        searchTerm={searchTerm}
        setSearchCounter={setSearchCounter}
      />
      <ClientToolbar
        totalRows={totalRows}
        setAddModalOpen={setAddModalOpen}
        setEditModalId={setEditModalId}
      />
      <ClientsList
        searchTerm={searchTerm}
        searchCounter={searchCounter}
        setTotalRows={setTotalRows}
        setAddModalOpen={setAddModalOpen}
        setDeleteModalOpen={setDeleteModalOpen}
        setEditModalId={setEditModalId}
        setDeleteModalId={setDeleteModalId}
        setTitle={setTitle}
        refresh={refresh}
        pageIndex={pageIndex}
        setPageIndex={setPageIndexState}
        addModalOpen={addModalOpen}
        deleteModalOpen={deleteModalOpen}
        setIntlMessage={setIntlMessage}
      />
      {addModalOpen && (
        <ClientAddModal
          setRefresh={setRefresh}
          refresh={refresh}
          setAddModalOpen={setAddModalOpen}
          setDeleteModalOpen={setDeleteModalOpen}
          setEditModalId={setEditModalId}
          setDeleteModalId={setDeleteModalId}
          setTitle={setTitle}
          editModalId={editModalId}
          setIntlMessage={setIntlMessage}
          deleteModalOpen={deleteModalOpen}
        />
      )}

      {deleteModalOpen && (
        <ClientDeleteModal
          deleteModalId={deleteModalId}
          title={title}
          refresh={refresh}
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
      <ClientInnerWrapper />
    </Content>
  </>
);

export { ClientWrapper };
