import { QuoteHeader } from "./header/QuoteHeader";
import { QuoteList } from "./search-list/QuoteList";
import { ToolbarWrapper } from "../../../../_metronic/layout/components/toolbar";
import { Content } from "../../../../_metronic/layout/components/content";
import { useEffect, useState } from "react";
import { QuoteToolbar } from "./header/QuoteToolbar";
import { QuoteDeleteModal } from "./quote-delete-modal/QuoteDeleteModal";
import { ViewCanvas } from "../../generic/ViewCanvas";
import { QuoteAddModal } from "./quote-add-modal/QuoteAddModal";
import { ClientSearch } from "../../generic/ClientSearch";
import { QuoteCopyModal } from "./quote-copy-modal/QuoteCopyModal";
import { QuoteValidateModal } from "./quote-validate-modal/QuoteValidateModal";
import { QuoteEmailModal } from "./quote-email-modal/QuoteEmailModal";
import { QuoteActivateModal } from "./quote-activate-modal/QuoteActivateModal";
import { toast } from "react-toastify";
// @ts-ignore
import { getPaginationModule } from "../../../helpers/paginationUtils.js";
import { handleToast } from "../../auth/core/_toast";
import { AttachmentsResult } from "../../accounting/bookings/components/core/_models";
import { attachQuoteFile, getAttachmentsById } from "./core/_requests";
import { useIntl } from "react-intl";
import { AttachmentsModal } from "../../generic/FileManager/AttachmentsModal";
import { QuoteOrderConfirmationModal } from "./quote-order-modal/QuoteOrderConfirmationModal";

const QuoteListInnerWrapper = ({
  isModal,
  setQuoteId,
}: {
  isModal?: boolean;
  setQuoteId?: (type: number) => void;
}) => {
  const intl = useIntl();
  const moduleKey = "quotes-module";
  const filters = getPaginationModule(moduleKey);

  const [pageIndexState, setPageIndexState] = useState<number>(
    filters.pageIndex || 1
  );
  const [searchTermState, setSearchTermState] = useState(
    filters.searchTerm || ""
  );
  const [searchCounter, setSearchCounter] = useState(0);
  const [totalRows, setTotalRows] = useState(0);
  const [editModalId, setEditModalId] = useState<number>(0);
  const [addModalOpen, setAddModalOpen] = useState<boolean>(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [downloadUrl, setDownloadUrl] = useState<string>("");
  const [key, setKey] = useState<number>(1);
  const [quoteNumber, setQuoteNumber] = useState<string>("");
  const [refresh, setRefresh] = useState(false);
  const [clientName, setClientName] = useState<string>("");

  const [periodValueType, setPeriodValueType] = useState<number | null>(
    filters.periodType || null
  );
  const [quoteStatusTypes, setQuoteStatusTypes] = useState<any>(
    filters.quoteStatus || []
  );
  const [clientIdForFilter, setClientIdForFilter] = useState<number | null>(
    filters.clientFilter || null
  );
  const [tempClientId, setTempClientId] = useState<number | null>(
    clientIdForFilter || null
  );
  const [year, setYear] = useState<number | null>(filters.yearFilter || null);
  const [showClientSearch, setShowClientSearch] = useState<boolean>(false);
  const [copyModalOpen, setCopyModalOpen] = useState<boolean>(false);
  const [validateModalOpen, setValidateModalOpen] = useState<boolean>(false);
  const [emailModalOpen, setEmailModalOpen] = useState<boolean>(false);
  const [activateModalOpen, setActivateModalOpen] = useState<boolean>(false);
  const [orderConfirmationModalOpen, setOrderConfirmationModalOpen] =
    useState<boolean>(false);
  const [attachmentsModalOpen, setAttachmentsModalOpen] =
    useState<boolean>(false);

  const handleClientModalClose = () => {
    const storedClient = JSON.parse(localStorage.getItem("storedClient")!);

    if (storedClient) {
      setTempClientId(storedClient.id);
      setClientName(storedClient.displayName);
    }
    setShowClientSearch(false); // Close the modal
  };

  useEffect(() => {
    localStorage.removeItem("contactResponse");
    localStorage.removeItem("clientResponse");
  }, [addModalOpen]);

  const [attachments, setAttachments] = useState<
    Record<number, AttachmentsResult[]>
  >({});
  const fetchAttachments = async (id: number) => {
    const response = await getAttachmentsById(id);
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
        const response = await attachQuoteFile(
          attachment.inboxItemId,
          attachment.fileId,
          editModalId
        );
        if (response.isValid) {
          fetchAttachments(editModalId);
          handleToast(response);
        }
      }
    } catch (error) {
      return;
    }
  };

  return (
    <>
      <QuoteHeader
        setShowClientSearch={setShowClientSearch}
        setSearchTerm={setSearchTermState}
        searchTerm={searchTermState}
        setPeriodValueType={setPeriodValueType}
        periodValueType={periodValueType}
        setQuoteStatusTypes={setQuoteStatusTypes}
        quoteStatusTypes={quoteStatusTypes}
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
        <QuoteToolbar
          totalRows={totalRows}
          setAddModalOpen={setAddModalOpen}
          setEditModalId={setEditModalId}
        />
      )}
      <QuoteList
        searchCounter={searchCounter}
        year={year}
        searchTerm={searchTermState}
        periodValueType={periodValueType}
        quoteStatusTypes={quoteStatusTypes}
        clientIdForFilter={clientIdForFilter}
        setTotalRows={setTotalRows}
        setDownloadUrl={setDownloadUrl}
        setKey={setKey}
        setAddModalOpen={setAddModalOpen}
        setDeleteModalOpen={setDeleteModalOpen}
        setEditModalId={setEditModalId}
        setQuoteNumber={setQuoteNumber}
        refresh={refresh}
        pageIndex={pageIndexState}
        setPageIndex={setPageIndexState}
        setCopyModalOpen={setCopyModalOpen}
        setValidateModalOpen={setValidateModalOpen}
        setEmailModalOpen={setEmailModalOpen}
        setActivateModalOpen={setActivateModalOpen}
        setAttachmentsModalOpen={setAttachmentsModalOpen}
        attachments={attachments}
        fetchAttachments={fetchAttachments}
        isModal={isModal}
        setQuoteId={setQuoteId}
        setOrderConfirmationModalOpen={setOrderConfirmationModalOpen}
      />
      {addModalOpen && (
        <QuoteAddModal
          setRefresh={setRefresh}
          setAddModalOpen={setAddModalOpen}
          refresh={refresh}
          setEditModalId={setEditModalId}
          editModalId={editModalId}
          setQuoteNumber={setQuoteNumber}
          setActivateModalOpen={setActivateModalOpen}
          setEmailModalOpen={setEmailModalOpen}
          addModalOpen={addModalOpen}
        />
      )}
      {orderConfirmationModalOpen && (
        <QuoteOrderConfirmationModal
          quoteId={editModalId}
          quoteNr={quoteNumber}
          setEmailModalOpen={setOrderConfirmationModalOpen}
          setRefresh={setRefresh}
          refresh={refresh}
        />
      )}
      <ViewCanvas downloadUrl={downloadUrl} keyy={key} />
      {deleteModalOpen && (
        <QuoteDeleteModal
          deleteModalId={editModalId}
          quoteNumber={quoteNumber}
          setDeleteModalOpen={setDeleteModalOpen}
          setRefresh={setRefresh}
          refresh={refresh}
        />
      )}
      {showClientSearch && (
        <ClientSearch
          handleClose={handleClientModalClose}
          formik={null}
          storageName="storedClient"
        />
      )}
      {copyModalOpen && (
        <QuoteCopyModal
          quoteId={editModalId}
          quoteNumber={quoteNumber}
          setCopyModalOpen={setCopyModalOpen}
          setRefresh={setRefresh}
          refresh={refresh}
          setAddModalOpen={setAddModalOpen}
          setEditModalId={setEditModalId}
        />
      )}

      {validateModalOpen && (
        <QuoteValidateModal
          quoteId={editModalId}
          quoteNumber={quoteNumber}
          setValidateModalOpen={setValidateModalOpen}
          setRefresh={setRefresh}
          refresh={refresh}
        />
      )}
      {emailModalOpen && (
        <QuoteEmailModal
          quoteId={editModalId}
          quoteNumber={quoteNumber}
          setEmailModalOpen={setEmailModalOpen}
          setRefresh={setRefresh}
          refresh={refresh}
        />
      )}
      {activateModalOpen && (
        <QuoteActivateModal
          quoteId={editModalId}
          quoteNumber={quoteNumber}
          setActivateModalOpen={setActivateModalOpen}
          setRefresh={setRefresh}
          refresh={refresh}
        />
      )}
      {attachmentsModalOpen && (
        <AttachmentsModal
          setAttachmentsModalOpen={setAttachmentsModalOpen}
          type="separate"
          attachFile={attachFile}
          separateAttachments={attachments}
          info="Fields.InboxUploadModuleInfo"
        />
      )}
    </>
  );
};
const QuoteListWrapper = ({
  isModal,
  setQuoteId,
}: {
  isModal?: boolean;
  setQuoteId?: (type: number) => void;
}) => (
  <>
    {!isModal && <ToolbarWrapper />}
    <Content>
      <QuoteListInnerWrapper isModal={isModal} setQuoteId={setQuoteId} />
    </Content>
  </>
);
export { QuoteListWrapper };
