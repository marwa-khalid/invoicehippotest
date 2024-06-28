import { ListViewProvider, useListView } from "./core/ListViewProvider";
import { QueryRequestProvider } from "./core/QueryRequestProvider";
import { QueryResponseProvider } from "./core/QueryResponseProvider";
import { UsersListHeader } from "./components/header/UsersListHeader";
import { UsersTable } from "./table/UsersTable";
import { UserEditModal } from "./user-edit-modal/UserEditModal";
import { KTCard } from "../../../../../_metronic/helpers";
import { ToolbarWrapper } from "../../../../../_metronic/layout/components/toolbar";
import { Content } from "../../../../../_metronic/layout/components/content";
import { useState } from "react";
import { UsersListToolbar } from "./components/header/UserListToolbar";
const UsersList = () => {
  const { itemIdForUpdate } = useListView();
  const [searchTerm, setSearchTerm] = useState("");
  const [vatAreaUsageTypeFilter, setVatAreaUsageTypeFilter] = useState(1);
  const [currentRows, setCurrentRows] = useState(0);
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
      />

      {itemIdForUpdate !== undefined && <UserEditModal />}
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
