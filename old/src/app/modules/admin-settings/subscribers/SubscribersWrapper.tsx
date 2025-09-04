import { SubscriberHeader } from "./header/SubscriberHeader";
import { SubscribersList } from "./search-list/SubscribersList";
import { ToolbarWrapper } from "../../../../_metronic/layout/components/toolbar";
import { Content } from "../../../../_metronic/layout/components/content";
import { useEffect, useState } from "react";
import { ReminderListToolbar } from "./header/ReminderListToolbar";
import { ReminderDeleteModal } from "./reminder-delete-modal/ReminderDeleteModal";
// @ts-ignore
import { getPaginationModule } from "../../../helpers/paginationUtils.js";

const SubscribersInnerWrapper = () => {
  const moduleKey = "subscriber-module"; //changee
  let filters = getPaginationModule(moduleKey);

  const [isFilterApplied, setIsFilterApplied] = useState(false);
  const [searchCounter, setSearchCounter] = useState(0);
  const [year, setYear] = useState<number | null>(filters.yearFilter || null);
  const [periodValueType, setPeriodValueType] = useState<number | null>(
    filters.periodType || null
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
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [notificationTitle, setSubscriberTitle] = useState<string>("");
  const [refresh, setRefresh] = useState(false);

  return (
    <>
      <SubscriberHeader
        setSearchTerm={setSearchTermState}
        searchTerm={searchTermState}
        setPeriodValueType={setPeriodValueType}
        periodValueType={periodValueType}
        year={year}
        setYear={setYear}
        setIsFilterApplied={setIsFilterApplied}
        isFilterApplied={isFilterApplied}
        setSearchCounter={setSearchCounter}
        setPageIndex={setPageIndexState}
      />

      <ReminderListToolbar
        totalRows={totalRows}
        setEditModalId={setEditModalId}
      />

      <SubscribersList
        searchCounter={searchCounter}
        searchTerm={searchTermState}
        year={year}
        periodValueType={periodValueType}
        setTotalRows={setTotalRows}
        setDeleteModalOpen={setDeleteModalOpen}
        setEditModalId={setEditModalId}
        setSubscriberTitle={setSubscriberTitle}
        refresh={refresh}
        pageIndex={pageIndexState}
        setPageIndex={setPageIndexState}
      />

      {deleteModalOpen && (
        <ReminderDeleteModal
          deleteModalId={editModalId}
          notificationTitle={notificationTitle}
          setDeleteModalOpen={setDeleteModalOpen}
          setRefresh={setRefresh}
          refresh={refresh}
        />
      )}
      {/* {addModalOpen && (
        <SubscriberAddModal
          setRefresh={setRefresh}
          setAddModalOpen={setAddModalOpen}
          refresh={refresh}
          setEditModalId={setEditModalId}
          editModalId={editModalId}
          setActivateModalOpen={setActivateModalOpen}
          setInvoiceNr={setInvoiceNr}
          setEmailModalOpen={setEmailModalOpen}
        />
      )} */}
    </>
  );
};

const SubscribersWrapper = () => (
  <>
    <ToolbarWrapper />
    <Content>
      <SubscribersInnerWrapper />
    </Content>
  </>
);

export { SubscribersWrapper };
