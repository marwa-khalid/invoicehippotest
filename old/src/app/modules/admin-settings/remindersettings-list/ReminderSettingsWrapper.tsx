import { ReminderListHeader } from "./header/ReminderListHeader";
import { RemindersList } from "./search-list/RemindersList";
import { ReminderAddModal } from "./reminder-add-modal/ReminderAddModal";
import { ToolbarWrapper } from "../../../../_metronic/layout/components/toolbar";
import { Content } from "../../../../_metronic/layout/components/content";
import { useEffect, useState } from "react";
import { ReminderListToolbar } from "./header/ReminderListToolbar";
import { ReminderDeleteModal } from "./reminder-delete-modal/ReminderDeleteModal";
// @ts-ignore
import { getPaginationModule } from "../../../helpers/paginationUtils.js";

const ReminderSettingsInnerWrapper = () => {
  const moduleKey = "notifications-module";
  let filters = getPaginationModule(moduleKey);

  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [searchCounter, setSearchCounter] = useState(0);
  const [areaUsageType, setAreaUsageType] = useState<number>(
    filters.areaUsageType || 0
  );
  const [pageIndexState, setPageIndexState] = useState<number>(
    filters.pageIndex || 1
  );
  const [searchTermState, setSearchTermState] = useState(
    filters.searchTerm || ""
  );
  useEffect(() => {
    if (filters.areaUsageType && filters.areaUsageType !== 0) {
      setIsFilterApplied(true);
    }
  }, [filters.areaUsageType]);

  const [totalRows, setTotalRows] = useState(0);
  const [editModalId, setEditModalId] = useState<number>(0);
  const [addModalOpen, setAddModalOpen] = useState<boolean>(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [notificationTitle, setNotificationTitle] = useState<string>("");
  const [refresh, setRefresh] = useState(false);

  return (
    <>
      <ReminderListHeader
        setSearchTerm={setSearchTermState}
        searchTerm={searchTermState}
        setAreaUsageType={setAreaUsageType}
        areaUsageType={areaUsageType}
        setIsFilterApplied={setIsFilterApplied}
        isFilterApplied={isFilterApplied}
        setSearchCounter={setSearchCounter}
        setPageIndex={setPageIndexState}
      />

      <ReminderListToolbar
        totalRows={totalRows}
        setAddModalOpen={setAddModalOpen}
        setEditModalId={setEditModalId}
      />

      <RemindersList
        searchCounter={searchCounter}
        searchTerm={searchTermState}
        areaUsageType={areaUsageType}
        setTotalRows={setTotalRows}
        setAddModalOpen={setAddModalOpen}
        setDeleteModalOpen={setDeleteModalOpen}
        setEditModalId={setEditModalId}
        setNotificationTitle={setNotificationTitle}
        refresh={refresh}
        pageIndex={pageIndexState}
        setPageIndex={setPageIndexState}
      />

      {addModalOpen && (
        <ReminderAddModal
          setRefresh={setRefresh}
          setAddModalOpen={setAddModalOpen}
          refresh={refresh}
          editModalId={editModalId}
        />
      )}

      {deleteModalOpen && (
        <ReminderDeleteModal
          deleteModalId={editModalId}
          notificationTitle={notificationTitle}
          setDeleteModalOpen={setDeleteModalOpen}
          setRefresh={setRefresh}
          refresh={refresh}
        />
      )}
    </>
  );
};

const ReminderSettingsWrapper = () => (
  <>
    <ToolbarWrapper />
    <Content>
      <ReminderSettingsInnerWrapper />
    </Content>
  </>
);

export { ReminderSettingsWrapper };
