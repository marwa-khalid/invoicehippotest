import { UsersHeader } from "./header/UsersHeader";
import { UsersList } from "./search-list/UsersList";
import { UserAddModal } from "./user-add-modal/UserAddModal";
import { ToolbarWrapper } from "../../../../_metronic/layout/components/toolbar";
import { Content } from "../../../../_metronic/layout/components/content";
import { useState } from "react";
import { UsersToolbar } from "./header/UsersToolbar";
import { UserEditModal } from "./user-edit-modal/UserEditModal";
import { UserDeleteModal } from "./user-delete-modal/UserDeleteModal";
import { useIntl } from "react-intl";
import { LimitationModal } from "../../license-limitation/LimitationModal";
import { PasswordChangeModal } from "../../../../_metronic/layout/PasswordChangeModal";
// @ts-ignore
import { getPaginationModule } from "../../../helpers/paginationUtils.js";

const UsersManagementInnerWrapper = () => {
  const moduleKey = "users-module";
  const filters = getPaginationModule(moduleKey);

  const [pageIndexState, setPageIndexState] = useState<number>(
    filters.pageIndex
  );
  const [searchTermState, setSearchTermState] = useState(filters.searchTerm);
  const [searchCounter, setSearchCounter] = useState(0);
  const [totalRows, setTotalRows] = useState(0);
  const [editModalId, setEditModalId] = useState<number>(0);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [addModalOpen, setAddModalOpen] = useState<boolean>(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>("");
  const [refresh, setRefresh] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUpgradeAvailable, setIsUpgradeAvailable] = useState(false);
  const intl = useIntl();
  const [profileModalOpen, setProfileModalOpen] = useState<boolean>();
  const [targetUserId, setTargetUserId] = useState<number>();
  return (
    <>
      <UsersHeader
        setSearchTerm={setSearchTermState}
        searchTerm={searchTermState}
        setSearchCounter={setSearchCounter}
        setPageIndex={setPageIndexState}
      />
      <UsersToolbar
        totalRows={totalRows}
        setAddModalOpen={setAddModalOpen}
        setIsLoading={setIsLoading}
        setIsUpgradeAvailable={setIsUpgradeAvailable}
      />
      <UsersList
        searchTerm={searchTermState}
        searchCounter={searchCounter}
        setTotalRows={setTotalRows}
        setEditModalOpen={setEditModalOpen}
        setDeleteModalOpen={setDeleteModalOpen}
        setEditModalId={setEditModalId}
        setUserName={setUserName}
        refresh={refresh}
        pageIndex={pageIndexState}
        setPageIndex={setPageIndexState}
        setIsLoading={setIsLoading}
        isLoading={isLoading}
        setProfileModalOpen={setProfileModalOpen}
        setTargetUserId={setTargetUserId}
      />
      {addModalOpen && (
        <UserAddModal
          setRefresh={setRefresh}
          setAddModalOpen={setAddModalOpen}
          refresh={refresh}
        />
      )}

      {editModalOpen && (
        <UserEditModal
          editModalId={editModalId}
          setRefresh={setRefresh}
          setEditModalOpen={setEditModalOpen}
          refresh={refresh}
        />
      )}
      {deleteModalOpen && (
        <UserDeleteModal
          deleteModalId={editModalId}
          userName={userName}
          setDeleteModalOpen={setDeleteModalOpen}
          setRefresh={setRefresh}
          refresh={refresh}
        />
      )}

      {isUpgradeAvailable && (
        <LimitationModal
          setIsUpgradeAvailable={setIsUpgradeAvailable}
          description={intl.formatMessage({
            id: "Fields.ModalUsageMaxUsersInfo",
          })}
        />
      )}

      {profileModalOpen && (
        <PasswordChangeModal
          setProfileModalOpen={setProfileModalOpen}
          targerUserId={targetUserId}
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
