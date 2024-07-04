import { ListViewProvider, useListView } from "./core/ListViewProvider";
import { QueryRequestProvider } from "./core/QueryRequestProvider";
import { QueryResponseProvider } from "./core/QueryResponseProvider";
import { VatListHeader } from "./components/header/VatListHeader";
import { VatTypesList } from "./table/VatTypesList";
import { UserAddModal } from "./user-add-modal/UserAddModal";
import { ToolbarWrapper } from "../../../../../_metronic/layout/components/toolbar";
import { Content } from "../../../../../_metronic/layout/components/content";
import { useState } from "react";
import { VatListToolbar } from "./components/header/VatListToolbar";
import { VatEditModal } from "./user-edit-modal/VatEditModal";
import { UserDeleteModal } from "./user-delete-modal/UserDeleteModal";
const VatListInnerWrapper = () => {
  const { itemIdForUpdate } = useListView();
  const [searchTerm, setSearchTerm] = useState("");
  const [vatAreaUsageTypeFilter, setVatAreaUsageTypeFilter] = useState(1);
  const [currentRows, setCurrentRows] = useState(0);
  const [editModalId, setEditModalId] = useState<number>(0);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [vatTitle, setVatTitle] = useState<string>("");
  const [refresh, setRefresh] = useState(false);
  return (
    <>
      <VatListHeader
        setSearchTerm={setSearchTerm}
        setVatAreaUsageTypeFilter={setVatAreaUsageTypeFilter}
      />

      <VatListToolbar currentRows={currentRows} />

      <VatTypesList
        searchTerm={searchTerm}
        vatAreaUsageTypeFilter={vatAreaUsageTypeFilter}
        setCurrentRows={setCurrentRows}
        setEditModalOpen={setEditModalOpen}
        setDeleteModalOpen={setDeleteModalOpen}
        setEditModalId={setEditModalId}
        setVatTitle={setVatTitle}
        refresh={refresh}
      />

      {itemIdForUpdate !== undefined && (
        <UserAddModal setRefresh={setRefresh} />
      )}
      {editModalOpen && (
        <VatEditModal
          editModalId={editModalId}
          setRefresh={setRefresh}
          setEditModalOpen={setEditModalOpen}
        />
      )}
      {deleteModalOpen && (
        <UserDeleteModal
          deleteModalId={editModalId}
          vatTitle={vatTitle}
          setDeleteModalOpen={setDeleteModalOpen}
          setRefresh={setRefresh}
        />
      )}
    </>
  );
};

const VatListWrapper = () => (
  <QueryRequestProvider>
    <QueryResponseProvider>
      <ListViewProvider>
        <ToolbarWrapper />
        <Content>
          {/* <div style={{ maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}> */}
          <VatListInnerWrapper />
          {/* </div> */}
        </Content>
      </ListViewProvider>
    </QueryResponseProvider>
  </QueryRequestProvider>
);

export { VatListWrapper };
