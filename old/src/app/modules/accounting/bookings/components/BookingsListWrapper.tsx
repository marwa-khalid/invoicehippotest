import { BookingHeader } from "./header/BookingHeader";
import { BookingsList } from "./search-list/BookingsList";
import { ToolbarWrapper } from "../../../../../_metronic/layout/components/toolbar";
import { Content } from "../../../../../_metronic/layout/components/content";
import { useEffect, useState } from "react";
import { BookingToolbar } from "./header/BookingToolbar";
import { BookingDeleteModal } from "./booking-delete-modal/BookingDeleteModal";
import { ViewCanvas } from "../../../generic/ViewCanvas";
import { BookingAddModal } from "./booking-add-modal/BookingAddModal";
import { ClientSearch } from "../../../generic/ClientSearch";
import { toast } from "react-toastify";
// @ts-ignore
import { getPaginationModule } from "../../../../helpers/paginationUtils";
import { AttachmentsModal } from "../../../generic/FileManager/AttachmentsModal";
import { attachBookingFile, getAttachmentsForBooking } from "./core/_requests";
import { AttachmentsResult } from "./core/_models";
import { useIntl } from "react-intl";
const BookingsListInnerWrapper = ({
  isModal,
  setBookingId,
}: {
  isModal?: boolean;
  setBookingId?: (type: number) => void;
}) => {
  const intl = useIntl();
  const moduleKey = "bookings-module";

  let filters = getPaginationModule(moduleKey);
  const [pageIndexState, setPageIndexState] = useState<number>(
    filters?.pageIndex || 1
  );
  const [searchTermState, setSearchTermState] = useState(
    filters?.searchTerm || ""
  );

  const [periodValueType, setPeriodValueType] = useState<number | null>(
    filters?.periodType || null
  );

  const [clientIdForFilter, setClientIdForFilter] = useState<number | null>(
    filters?.clientFilter || null
  );
  const [tempClientId, setTempClientId] = useState<number | null>(
    clientIdForFilter || null
  );
  const [attachmentType, setAttachmentType] = useState<number>(
    filters?.attachmentTypeFilter || 0
  );

  const [paymentSourceType, setPaymentSourceType] = useState<number>(
    filters?.paymentSourceTypeFilter || 0
  );
  const [year, setYear] = useState<number | null>(filters?.yearFilter || null);
  const [searchCounter, setSearchCounter] = useState(0);
  const [totalRows, setTotalRows] = useState(0);
  const [editModalId, setEditModalId] = useState<number>(0);
  const [addModalOpen, setAddModalOpen] = useState<boolean>(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [downloadUrl, setDownloadUrl] = useState<string>("");
  const [refresh, setRefresh] = useState(false);
  const [clientName, setClientName] = useState<string>("");
  const [key, setKey] = useState<number>(1);
  const [showClientSearch, setShowClientSearch] = useState<boolean>(false);
  const [attachmentsModalOpen, setAttachmentsModalOpen] =
    useState<boolean>(false);

  const handleClientModalClose = () => {
    const storedClient = JSON.parse(
      localStorage.getItem("storedClientForBooking")!
    );

    if (storedClient) {
      setTempClientId(storedClient.id);
      setClientName(storedClient.displayName);
    }
    setShowClientSearch(false);
  };

  useEffect(() => {
    localStorage.removeItem("contactResponse");
    localStorage.removeItem("clientResponse");
  }, [addModalOpen]);

  const [attachments, setAttachments] = useState<
    Record<number, AttachmentsResult[]>
  >({});
  const fetchAttachments = async (id: number) => {
    const response = await getAttachmentsForBooking(id);
    if (response.isValid && response.result.length > 0) {
      setAttachments((prev) => ({
        ...prev,
        [id]: response.result,
      }));
    }
  };
  const attachFile = async (attachment: any) => {
    try {
      if (
        Object.entries(attachments).length > 0 &&
        attachments[attachment.fileId].length === 5
      ) {
        toast.warning(
          intl.formatMessage({
            id: "System.AccessValidation_MaxAttachmentUploadOnCommon",
          })
        );
      } else {
        const response = await attachBookingFile(
          attachment.inboxItemId,
          attachment.fileId,
          editModalId
        );
        if (response.isValid) {
          fetchAttachments(editModalId);
        }
      }
    } catch (error) {
      return;
    }
  };

  return (
    <>
      <BookingHeader
        setShowClientSearch={setShowClientSearch}
        setSearchTerm={setSearchTermState}
        searchTerm={searchTermState}
        setPeriodValueType={setPeriodValueType}
        periodValueType={periodValueType}
        attachmentType={attachmentType}
        setAttachmentType={setAttachmentType}
        setPaymentSourceType={setPaymentSourceType}
        paymentSourceType={paymentSourceType}
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
      {!isModal && (
        <BookingToolbar
          totalRows={totalRows}
          setAddModalOpen={setAddModalOpen}
          setEditModalId={setEditModalId}
        />
      )}
      <BookingsList
        searchCounter={searchCounter}
        year={year}
        searchTerm={searchTermState}
        periodValueType={periodValueType}
        attachmentType={attachmentType}
        paymentSourceType={paymentSourceType}
        clientIdForFilter={clientIdForFilter}
        setTotalRows={setTotalRows}
        setDownloadUrl={setDownloadUrl}
        setAddModalOpen={setAddModalOpen}
        setDeleteModalOpen={setDeleteModalOpen}
        setEditModalId={setEditModalId}
        refresh={refresh}
        pageIndex={pageIndexState}
        setPageIndex={setPageIndexState}
        setAttachmentsModalOpen={setAttachmentsModalOpen}
        fetchAttachments={fetchAttachments}
        attachments={attachments}
        isModal={isModal}
        setBookingId={setBookingId}
        setKey={setKey}
      />
      <ViewCanvas downloadUrl={downloadUrl} keyy={key} />

      {addModalOpen && (
        <BookingAddModal
          setRefresh={setRefresh}
          setAddModalOpen={setAddModalOpen}
          refresh={refresh}
          setEditModalId={setEditModalId}
          editModalId={editModalId}
          hasMutation={false}
        />
      )}
      {deleteModalOpen && (
        <BookingDeleteModal
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
          storageName="storedClientForBooking"
        />
      )}
      {attachmentsModalOpen && (
        <AttachmentsModal
          setAttachmentsModalOpen={setAttachmentsModalOpen}
          type="separate"
          attachFile={attachFile}
          info="Fields.InboxUploadModuleInfo"
        />
      )}
    </>
  );
};

const BookingsListWrapper = ({
  isModal,
  setBookingId,
}: {
  isModal?: boolean;
  setBookingId?: (type: number) => void;
}) => (
  <>
    {!isModal && <ToolbarWrapper />}
    <Content>
      <BookingsListInnerWrapper isModal={isModal} setBookingId={setBookingId} />
    </Content>
  </>
);

export { BookingsListWrapper };
