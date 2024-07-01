import { ListViewProvider, useListView } from "./core/ListViewProvider";
import { QueryRequestProvider } from "./core/QueryRequestProvider";
import { QueryResponseProvider } from "./core/QueryResponseProvider";
import { UsersListHeader } from "./components/header/UsersListHeader";
import { UsersTable } from "./table/UsersTable";
import { UserAddModal } from "./user-add-modal/UserAddModal";
import { KTCard } from "../../../../../_metronic/helpers";
import { ToolbarWrapper } from "../../../../../_metronic/layout/components/toolbar";
import { Content } from "../../../../../_metronic/layout/components/content";
import { useState } from "react";
import { UsersListToolbar } from "./components/header/UserListToolbar";
import { UserEditModal } from "./user-edit-modal/UserEditModal";
import { UserDeleteModal } from "./user-delete-modal/UserDeleteModal";
const UsersList = () => {
  const { itemIdForUpdate } = useListView();
  const [searchTerm, setSearchTerm] = useState("");
  const [vatAreaUsageTypeFilter, setVatAreaUsageTypeFilter] = useState(1);
  const [currentRows, setCurrentRows] = useState(0);
  const [editModalId, setEditModalId] = useState<number>(0);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [ledgerAccountDisplayName, setLedgerAccountDisplayName] =
    useState<string>("");
  const [vatTitle, setVatTitle] = useState<string>("");
  return (
    <>
      <UsersListHeader
        setSearchTerm={setSearchTerm}
        setVatAreaUsageTypeFilter={setVatAreaUsageTypeFilter}
      />

      <UsersListToolbar currentRows={currentRows} />

      <UsersTable
        searchTerm={searchTerm}
        vatAreaUsageTypeFilter={vatAreaUsageTypeFilter}
        setCurrentRows={setCurrentRows}
        setEditModalOpen={setEditModalOpen}
        setDeleteModalOpen={setDeleteModalOpen}
        setEditModalId={setEditModalId}
        setLedgerAccountDisplayName={setLedgerAccountDisplayName}
        setVatTitle={setVatTitle}
      />

      {itemIdForUpdate !== undefined && <UserAddModal />}
      {editModalOpen && (
        <UserEditModal
          editModalId={editModalId}
          ledgerAccountDisplayName={ledgerAccountDisplayName}
          setEditModalOpen={setEditModalOpen}
        />
      )}
      {deleteModalOpen && (
        <UserDeleteModal
          deleteModalId={editModalId}
          vatTitle={vatTitle}
          setDeleteModalOpen={setDeleteModalOpen}
        />
      )}
    </>
  );
};

const UsersListWrapper = () => (
  <QueryRequestProvider>
    <QueryResponseProvider>
      <ListViewProvider>
        <ToolbarWrapper />
        <Content>
          {/* <div style={{ maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}> */}
          <UsersList />
          {/* </div> */}
        </Content>
      </ListViewProvider>
    </QueryResponseProvider>
  </QueryRequestProvider>
);

export { UsersListWrapper };
