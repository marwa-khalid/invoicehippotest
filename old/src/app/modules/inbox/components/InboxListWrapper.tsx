import { InboxHeader } from "./header/InboxHeader";
import { InboxList } from "./search-list/InboxList";
import { ToolbarWrapper } from "../../../../_metronic/layout/components/toolbar";
import { Content } from "../../../../_metronic/layout/components/content";
import { useEffect, useState } from "react";
import { InboxDeleteModal } from "./inbox-delete-modal/InboxDeleteModal";
import { ViewCanvas } from "../../generic/ViewCanvas";
import { ClientSearch } from "../../generic/ClientSearch";
// @ts-ignore
import { getPaginationModule } from "../../../helpers/paginationUtils.js";
import { InboxToolbar } from "./header/InboxToolbar";
import { AttachmentsModal } from "./attachments/AttachmentsModal";
import { InboxArchiveModal } from "./inbox-archive-modal/InboxArchiveModal";
import {
  bookingLinkInbox,
  costLinkInbox,
  getInboxArchiveType,
  invoiceLinkInbox,
} from "./core/_requests";
import { InboxLinkingModal } from "./inbox-linking-modal/InboxLinkingModal";
import { BookingAddModal } from "./booking-linking-modal/BookingAddModal";
import { BookingListModal } from "./booking-linking-modal/BookingListModal";
import { InvoiceListModal } from "./invoice-linking-modal/InvoiceListModal";
import { CostListModal } from "./costs-linking-modal/CostListModal";
import { InboxAttachmentListModal } from "./inbox-attachment-list-modal/InboxAttachmentListModal";
import { handleToast } from "../../auth/core/_toast";
import { InboxLinkPayload, InboxListResult } from "./core/_models";
import { CostAddModal } from "./costs-linking-modal/CostAddModal";
const InboxListInnerWrapper = () => {
  const moduleKey = "inbox-module";
  const filters = getPaginationModule(moduleKey);
  const [pageIndexState, setPageIndexState] = useState<number>(
    filters.pageIndex || 1
  );
  const [searchTermState, setSearchTermState] = useState(
    filters.searchTerm || ""
  );
  const [periodValueType, setPeriodValueType] = useState<number | null>(
    filters.periodType || null
  );
  const [statusTypes, setStatusTypes] = useState<number>(filters.status || 0);
  const [clientIdForFilter, setClientIdForFilter] = useState<number | null>(
    filters.clientFilter || null
  );
  const [tempClientId, setTempClientId] = useState<number | null>(
    clientIdForFilter || null
  );
  const [year, setYear] = useState<number | null>(filters.yearFilter || null);
  const [searchCounter, setSearchCounter] = useState(0);
  const [totalRows, setTotalRows] = useState(0);
  const [editModalId, setEditModalId] = useState<number>(0);
  const [addModalOpen, setAddModalOpen] = useState<boolean>(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [downloadUrl, setDownloadUrl] = useState<string>("");
  const [key, setKey] = useState<number>(1);
  const [refresh, setRefresh] = useState(false);
  const [clientName, setClientName] = useState<string>("");
  const [archiveTypeList, setArchiveTypeList] = useState<any[]>([]);
  const [showClientSearch, setShowClientSearch] = useState<boolean>(false);
  const [inboxData, setInboxData] = useState<InboxListResult>();
  const [unArchiveModalOpen, setUnArchiveModalOpen] = useState<boolean>(false);
  const [attachmentsModalOpen, setAttachmentsModalOpen] =
    useState<boolean>(false);
  const [linkingModalOpen, setLinkingModalOpen] = useState<boolean>(false);
  const [attachemtCostModalOpen, setAttachmentCostModalOpen] =
    useState<boolean>(false);
  const [bookingListModalOpen, setBookingListModalOpen] =
    useState<boolean>(false);
  const [invoiceListModalOpen, setIinvoiceListModalOpen] =
    useState<boolean>(false);
  const [costListModalOpen, setCostListModalOpen] = useState<boolean>(false);
  const [attachmentListModalOpen, setAttachmentListModalOpen] =
    useState<boolean>(false);
  const [costAddModalOpen, setCostAddModalOpen] = useState<boolean>(false);
  const [costId, setCostId] = useState<number>(0);
  const [bookingId, setBookingId] = useState<number>(0);
  const [invoiceId, setInvoiceId] = useState<number>(0);

  const handleClientModalClose = () => {
    setShowClientSearch(false);
  };

  useEffect(() => {
    const fetchArchiveTypes = async () => {
      try {
        const response = await getInboxArchiveType();
        if (response.isValid) {
          setArchiveTypeList(response.result);
        }
      } catch (error) {
        // console.error("Error fetching Inbox archive Types:", error);
      }
    };
    fetchArchiveTypes();
  }, []);

  useEffect(() => {
    if (costId !== 0 || bookingId !== 0 || invoiceId !== 0) {
      setAttachmentListModalOpen(true);
    }
    setCostListModalOpen(false);
    setBookingListModalOpen(false);
    setIinvoiceListModalOpen(false);
  }, [costId, bookingId, invoiceId]);

  const handleAttachment = () => {
    if (costId !== 0) {
      handleLinkCost();
    } else if (bookingId !== 0) {
      handleLinkBooking();
    } else if (invoiceId !== 0) {
      handleLinkInvoice();
    }
  };

  const handleLinkCost = async () => {
    try {
      // Extract required values first
      const inboxItemId = inboxData?.inboxItemId ?? 0; // Default to 0 if undefined
      const fileId = inboxData?.fileId ?? 0;

      // Create payload
      const payload: InboxLinkPayload = {
        inboxItemId,
        fileId,
      };

      const response = await costLinkInbox(payload, costId);

      setAttachmentListModalOpen(false);
      setLinkingModalOpen(false);
      setRefresh(!refresh);
      handleToast(response);
      setCostId(0);
    } catch (error) {
      console.error("Error Linking cost:", error);
    }
  };

  const handleLinkBooking = async () => {
    try {
      // Extract required values first
      const inboxItemId = inboxData?.inboxItemId ?? 0; // Default to 0 if undefined
      const fileId = inboxData?.fileId ?? 0;

      // Create payload
      const payload: InboxLinkPayload = {
        inboxItemId,
        fileId,
      };

      const response = await bookingLinkInbox(payload, bookingId);

      setAttachmentListModalOpen(false);
      setLinkingModalOpen(false);
      setRefresh(!refresh);
      handleToast(response);
      setBookingId(0);
    } catch (error) {
      console.error("Error Linking booking:", error);
    }
  };

  const handleLinkInvoice = async () => {
    try {
      // Extract required values first
      const inboxItemId = inboxData?.inboxItemId ?? 0; // Default to 0 if undefined
      const fileId = inboxData?.fileId ?? 0;

      // Create payload
      const payload: InboxLinkPayload = {
        inboxItemId,
        fileId,
      };

      const response = await invoiceLinkInbox(payload, invoiceId);

      setAttachmentListModalOpen(false);
      setLinkingModalOpen(false);
      setRefresh(!refresh);
      handleToast(response);
      setInvoiceId(0);
    } catch (error) {
      console.error("Error Linking invoice:", error);
    }
  };

  useEffect(() => {
    localStorage.removeItem("contactResponse");
    localStorage.removeItem("clientResponse");
  }, [addModalOpen]);

  return (
    <>
      <InboxHeader
        setShowClientSearch={setShowClientSearch}
        setSearchTerm={setSearchTermState}
        searchTerm={searchTermState}
        setPeriodValueType={setPeriodValueType}
        periodValueType={periodValueType}
        setStatusTypes={setStatusTypes}
        statusTypes={statusTypes}
        setClientIdForFilter={setClientIdForFilter}
        clientIdForFilter={clientIdForFilter}
        setSearchCounter={setSearchCounter}
        year={year}
        setYear={setYear}
        clientName={clientName}
        setClientName={setClientName}
        tempClientId={tempClientId}
        setTempClientId={setTempClientId}
        setPageIndexState={setPageIndexState}
      />

      <InboxToolbar
        totalRows={totalRows}
        setAttachmentsModalOpen={setAttachmentsModalOpen}
      />

      <InboxList
        searchCounter={searchCounter}
        year={year}
        searchTerm={searchTermState}
        periodValueType={periodValueType}
        statusTypes={statusTypes}
        clientIdForFilter={clientIdForFilter}
        setTotalRows={setTotalRows}
        setDownloadUrl={setDownloadUrl}
        setAddModalOpen={setAddModalOpen}
        setDeleteModalOpen={setDeleteModalOpen}
        setEditModalId={setEditModalId}
        refresh={refresh}
        pageIndex={pageIndexState}
        setPageIndex={setPageIndexState}
        setInboxData={setInboxData}
        setUnArchiveModalOpen={setUnArchiveModalOpen}
        setLinkingModalOpen={setLinkingModalOpen}
        setKey={setKey}
      />
      {linkingModalOpen && (
        <InboxLinkingModal
          inboxDetail={inboxData}
          setLinkingModalOpen={setLinkingModalOpen}
          setAttatchCostModalOpen={setAttachmentCostModalOpen}
          setBookingListModalOpen={setBookingListModalOpen}
          setIinvoiceListModalOpen={setIinvoiceListModalOpen}
          setCostAddModalOpen={setCostAddModalOpen}
          setCostListModalOpen={setCostListModalOpen}
          setRefresh={setRefresh}
          refresh={refresh}
        />
      )}
      {attachmentListModalOpen && inboxData && (
        <InboxAttachmentListModal
          inboxDetail={inboxData}
          setLinkingModalOpen={setAttachmentListModalOpen}
          handleAttachment={handleAttachment}
        />
      )}

      <ViewCanvas downloadUrl={downloadUrl} keyy={key} />
      {deleteModalOpen && (
        <InboxDeleteModal
          deleteModalId={editModalId}
          setDeleteModalOpen={setDeleteModalOpen}
          setRefresh={setRefresh}
          refresh={refresh}
        />
      )}
      {showClientSearch && (
        <ClientSearch
          handleClose={handleClientModalClose}
          formik={null}
          storageName="storedClientForInbox"
        />
      )}
      {unArchiveModalOpen && (
        <InboxArchiveModal
          inboxDetail={inboxData}
          setArchiveModalOpen={setUnArchiveModalOpen}
          setRefresh={setRefresh}
          refresh={refresh}
          archiveTypeList={archiveTypeList}
          showBackButton={false}
        />
      )}
      {attachemtCostModalOpen && (
        <BookingAddModal
          inboxDetail={inboxData}
          setAttatchCostModalOpen={setAttachmentCostModalOpen}
          setRefresh={setRefresh}
          refresh={refresh}
          setLinkingModalOpen={setLinkingModalOpen}
        />
      )}
      {costAddModalOpen && (
        <CostAddModal
          inboxDetail={inboxData}
          setAttatchCostModalOpen={setCostAddModalOpen}
          setRefresh={setRefresh}
          refresh={refresh}
          setLinkingModalOpen={setLinkingModalOpen}
        />
      )}
      {bookingListModalOpen && (
        <BookingListModal
          inboxDetail={inboxData}
          setAttatchCostModalOpen={setBookingListModalOpen}
          setLinkingModalOpen={setLinkingModalOpen}
          setBookingId={setBookingId}
        />
      )}
      {invoiceListModalOpen && (
        <InvoiceListModal
          inboxDetail={inboxData}
          setAttatchCostModalOpen={setIinvoiceListModalOpen}
          setLinkingModalOpen={setLinkingModalOpen}
          setInvoiceId={setInvoiceId}
        />
      )}
      {costListModalOpen && (
        <CostListModal
          inboxDetail={inboxData}
          setAttatchCostModalOpen={setCostListModalOpen}
          setLinkingModalOpen={setLinkingModalOpen}
          setCostId={setCostId}
        />
      )}
      {attachmentsModalOpen && (
        <AttachmentsModal
          setAttachmentsModalOpen={setAttachmentsModalOpen}
          isArchive={false}
          setRefresh={setRefresh}
          archiveTypeList={undefined}
        />
      )}
    </>
  );
};

const InboxListWrapper = () => (
  <>
    <ToolbarWrapper />
    <Content>
      <InboxListInnerWrapper />
    </Content>
  </>
);

export { InboxListWrapper };
