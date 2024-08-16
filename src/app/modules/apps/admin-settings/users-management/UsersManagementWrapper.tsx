import { UsersHeader } from "./components/header/UsersHeader";
import { UsersList } from "./search-list/UsersList";
import { UserAddModal } from "./user-add-modal/UserAddModal";
import { ToolbarWrapper } from "../../../../../_metronic/layout/components/toolbar";
import { Content } from "../../../../../_metronic/layout/components/content";
import { useState } from "react";
import { UsersToolbar } from "./components/header/UsersToolbar";
import { UserEditModal } from "./user-edit-modal/UserEditModal";
import { UserDeleteModal } from "./user-delete-modal/UserDeleteModal";

const getPaginationValues = () => {
  const storedPaginationString = localStorage.getItem("pagination")!;
  if (storedPaginationString) {
    const pagination = JSON.parse(storedPaginationString);

    const currentPage = pagination["users-module"].pageIndex || 1;
    const searchTerm = pagination["users-module"].filters.searchTerm || "";

    return {
      pageIndex: currentPage,
      searchTerm: searchTerm,
    };
  }
  return { pageIndex: 1, searchTerm: "" };
};
const UsersManagementInnerWrapper = () => {
  const { pageIndex, searchTerm } = getPaginationValues();
  const [pageIndexState, setPageIndexState] = useState<number>(pageIndex);
  const [searchTermState, setSearchTermState] = useState(searchTerm);

  const [totalRows, setTotalRows] = useState(0);
  const [editModalId, setEditModalId] = useState<number>(0);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [addModalOpen, setAddModalOpen] = useState<boolean>(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>("");
  const [refresh, setRefresh] = useState(false);

  return (
    <>
      <UsersHeader setSearchTerm={setSearchTermState} searchTerm={searchTerm} />
      <UsersToolbar totalRows={totalRows} setAddModalOpen={setAddModalOpen} />
      <UsersList
        searchTerm={searchTerm}
        setTotalRows={setTotalRows}
        setEditModalOpen={setEditModalOpen}
        setDeleteModalOpen={setDeleteModalOpen}
        setEditModalId={setEditModalId}
        setUserName={setUserName}
        refresh={refresh}
        pageIndex={pageIndex}
        setPageIndex={setPageIndexState}
        editModalOpen={editModalOpen}
        deleteModalOpen={deleteModalOpen}
      />
      {addModalOpen && (
        <UserAddModal
          setRefresh={setRefresh}
          setAddModalOpen={setAddModalOpen}
        />
      )}
      s
      {editModalOpen && (
        <UserEditModal
          editModalId={editModalId}
          setRefresh={setRefresh}
          setEditModalOpen={setEditModalOpen}
        />
      )}
      {deleteModalOpen && (
        <UserDeleteModal
          deleteModalId={editModalId}
          userName={userName}
          setDeleteModalOpen={setDeleteModalOpen}
          setRefresh={setRefresh}
        />
      )}
    </>
  );
};

const UsersManagementWrapper = () => (
  <>
    <ToolbarWrapper />
    <Content>
      <UsersManagementInnerWrapper />
    </Content>
  </>
);

export { UsersManagementWrapper };
