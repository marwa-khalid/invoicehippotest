import { useEffect, useState } from "react";
import { InboxHeader } from "./header/InboxHeader";
import { InboxToolbar } from "./header/InboxToolbar";
import { InboxArchiveList } from "./search-list/InboxArchiveList";
import { ViewCanvas } from "../../generic/ViewCanvas";
import { AttachmentsModal } from "./attachments/AttachmentsModal";
import { InboxDeleteModal } from "./inbox-delete-modal/InboxDeleteModal";
import { InboxArchiveModal } from "./inbox-archive-modal/InboxArchiveModal";
import { getInboxArchiveType } from "./core/_requests";
import { ToolbarWrapper } from "../../../../_metronic/layout/components/toolbar";
import { Content } from "../../../../_metronic/layout/components/content";
//@ts-ignore
import { getPaginationModule } from "../../../helpers/paginationUtils.js";

const InboxListInnerWrapper = () => {
  const moduleKey = "inbox-module";
  const filters = getPaginationModule(moduleKey);

  // Pagination & Filter States
  const [pageIndex, setPageIndex] = useState(filters?.pageIndex || 1);
  const [searchTerm, setSearchTerm] = useState(filters?.searchTerm || "");
  const [periodType, setPeriodType] = useState(filters?.periodType || null);
  const [statusTypes, setStatusTypes] = useState(filters?.status || 0);
  const [clientId, setClientId] = useState(filters?.clientFilter || null);
  const [tempClientId, setTempClientId] = useState(clientId || null);
  const [year, setYear] = useState(filters?.yearFilter || null);
  const [searchCounter, setSearchCounter] = useState(0);
  const [totalRows, setTotalRows] = useState(0);

  // Data Management States
  const [editModalId, setEditModalId] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [key, setKey] = useState<number>(1);
  const [clientName, setClientName] = useState("");
  const [archiveTypeList, setArchiveTypeList] = useState([]);
  const [inboxData, setInboxData] = useState([]);
  const [refresh, setRefresh] = useState(false);

  // Modal State Management
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isUnArchiveModalOpen, setIsUnArchiveModalOpen] = useState(false);
  const [isAttachmentsModalOpen, setIsAttachmentsModalOpen] = useState(false);
  const [isClientSearchOpen, setIsClientSearchOpen] = useState(false);

  useEffect(() => {
    const fetchArchiveTypes = async () => {
      try {
        const response = await getInboxArchiveType();
        if (response.isValid) {
          setArchiveTypeList(response.result);
        }
      } catch (error) {
        console.error("Error fetching Inbox archive Types:", error);
      }
    };
    fetchArchiveTypes();
    setRefresh(false);
  }, [refresh]);

  useEffect(() => {
    localStorage.removeItem("contactResponse");
    localStorage.removeItem("clientResponse");
  }, [isAddModalOpen]);

  return (
    <>
      <InboxHeader
        setShowClientSearch={setIsClientSearchOpen}
        setSearchTerm={setSearchTerm}
        searchTerm={searchTerm}
        setPeriodValueType={setPeriodType}
        periodValueType={periodType}
        setStatusTypes={setStatusTypes}
        statusTypes={statusTypes}
        setClientIdForFilter={setClientId}
        clientIdForFilter={clientId}
        setSearchCounter={setSearchCounter}
        year={year}
        setYear={setYear}
        clientName={clientName}
        setClientName={setClientName}
        tempClientId={tempClientId}
        setTempClientId={setTempClientId}
        setPageIndexState={setPageIndex}
      />

      <InboxToolbar
        totalRows={totalRows}
        setAttachmentsModalOpen={setIsAttachmentsModalOpen}
      />

      <ViewCanvas downloadUrl={downloadUrl} keyy={key} />
      <InboxArchiveList
        searchTerm={searchTerm}
        archiveTypeList={archiveTypeList}
        setTotalRows={setTotalRows}
        setDeleteModalOpen={setIsDeleteModalOpen}
        searchCounter={searchCounter}
        refresh={refresh}
        setPageIndex={setPageIndex}
        pageIndex={pageIndex}
        periodValueType={periodType}
        statusTypes={statusTypes}
        setStatusTypes={setStatusTypes}
        clientIdForFilter={clientId}
        year={year}
        setUnArchiveModalOpen={setIsUnArchiveModalOpen}
        setInboxData={setInboxData}
        setDownloadUrl={setDownloadUrl}
        setKey={setKey}
      />

      {isDeleteModalOpen && (
        <InboxDeleteModal
          deleteModalId={editModalId}
          setDeleteModalOpen={setIsDeleteModalOpen}
          setRefresh={setRefresh}
          refresh={refresh}
        />
      )}
      {isUnArchiveModalOpen && (
        <InboxArchiveModal
          inboxDetail={inboxData}
          setArchiveModalOpen={setIsUnArchiveModalOpen}
          showBackButton={true}
          archiveTypeList={archiveTypeList}
          setRefresh={setRefresh}
          refresh={false}
        />
      )}
      {isAttachmentsModalOpen && (
        <AttachmentsModal
          setAttachmentsModalOpen={setIsAttachmentsModalOpen}
          archiveTypeList={archiveTypeList}
          isArchive={true}
          setRefresh={setRefresh}
        />
      )}
    </>
  );
};

const InboxArchiveListWrapper = () => (
  <>
    <ToolbarWrapper />
    <Content>
      <InboxListInnerWrapper />
    </Content>
  </>
);

export { InboxArchiveListWrapper };
