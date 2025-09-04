import { InvoiceHeader } from "./header/InvoiceHeader";
import { SubscriptionList } from "./search-list/SubscriptionList";
import { ToolbarWrapper } from "../../../../_metronic/layout/components/toolbar";
import { Content } from "../../../../_metronic/layout/components/content";
import { useEffect, useState } from "react";
import { InvoiceToolbar } from "./header/InvoiceToolbar";
import { InvoiceDeleteModal } from "./invoice-delete-modal/InvoiceDeleteModal";
import { ViewCanvas } from "../../generic/ViewCanvas";
import { InvoiceAddModal } from "./invoice-add-modal/InvoiceAddModal";
import { ClientSearch } from "../../generic/ClientSearch";
import { InvoiceCopyModal } from "./invoice-copy-modal/InvoiceCopyModal";
import { InvoiceEmailModal } from "./invoice-email-modal/InvoiceEmailModal";
import { InvoiceActivateModal } from "./invoice-activate-modal/InvoiceActivateModal";
import { InvoiceCreditModal } from "./invoice-credit-modal/InvoiceCreditModal";
import { toast } from "react-toastify";
// @ts-ignore
import { getPaginationModule } from "../../../helpers/paginationUtils.js";
import { AttachmentsResult } from "../../accounting/bookings/components/core/_models";
import { attachInvoiceFile, getAttachmentsById } from "./core/_requests";
import { useIntl } from "react-intl";
import { AttachmentsModal } from "../../generic/FileManager/AttachmentsModal";
import { handleToast } from "../../auth/core/_toast";
import { InvoicePaymentModal } from "./invoice-payment-modal/InvoicePaymentModal";
const InvoiceListInnerWrapper = ({
  isModal,
  setInvoiceId,
}: {
  isModal?: boolean;
  setInvoiceId?: (type: number) => void;
}) => {
  const intl = useIntl();
  const moduleKey = "subscription-module";
  let filters = getPaginationModule(moduleKey);
  const [pageIndexState, setPageIndexState] = useState<number>(
    filters.pageIndex || 1
  );
  const [searchTermState, setSearchTermState] = useState(
    filters.searchTerm || ""
  );

  const [periodValueType, setPeriodValueType] = useState<number | null>(
    filters.periodType || null
  );
  const [subscriptionStatus, setSubscriptionStatus] = useState<number>(
    filters.subscriptionTypeFilter || 0
  );

  const [statusTypes, setStatusTypes] = useState<any>(filters.status || []);
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
  const [invoiceNr, setInvoiceNr] = useState<string>("");
  const [refresh, setRefresh] = useState(false);
  const [clientName, setClientName] = useState<string>("");
  const [key, setKey] = useState<number>(1);
  const [showClientSearch, setShowClientSearch] = useState<boolean>(false);
  const [copyModalOpen, setCopyModalOpen] = useState<boolean>(false);
  const [emailModalOpen, setEmailModalOpen] = useState<boolean>(false);
  const [activateModalOpen, setActivateModalOpen] = useState<boolean>(false);
  const [creditModalOpen, setCreditModalOpen] = useState<boolean>(false);
  const [alterEmail, setAlterEmail] = useState<boolean>(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState<boolean>(false);
  const [attachmentsModalOpen, setAttachmentsModalOpen] =
    useState<boolean>(false);

  const handleClientModalClose = () => {
    const storedClient = JSON.parse(
      localStorage.getItem("storedClientForSubscription")!
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
        const response = await attachInvoiceFile(
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
      <InvoiceHeader
        setShowClientSearch={setShowClientSearch}
        setSearchTerm={setSearchTermState}
        searchTerm={searchTermState}
        setPeriodValueType={setPeriodValueType}
        periodValueType={periodValueType}
        setStatusTypes={setStatusTypes}
        setSubscriptionStatus={setSubscriptionStatus}
        subscriptionStatus={subscriptionStatus}
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
      {!isModal && (
        <InvoiceToolbar
          totalRows={totalRows}
          setAddModalOpen={setAddModalOpen}
          setEditModalId={setEditModalId}
        />
      )}
      <SubscriptionList
        searchCounter={searchCounter}
        year={year}
        searchTerm={searchTermState}
        periodValueType={periodValueType}
        statusTypes={statusTypes}
        subscriptionStatus={subscriptionStatus}
        clientIdForFilter={clientIdForFilter}
        setTotalRows={setTotalRows}
        setDownloadUrl={setDownloadUrl}
        setAddModalOpen={setAddModalOpen}
        setDeleteModalOpen={setDeleteModalOpen}
        setEditModalId={setEditModalId}
        setInvoiceNr={setInvoiceNr}
        refresh={refresh}
        pageIndex={pageIndexState}
        setPageIndex={setPageIndexState}
        setCopyModalOpen={setCopyModalOpen}
        setEmailModalOpen={setEmailModalOpen}
        setActivateModalOpen={setActivateModalOpen}
        setCreditModalOpen={setCreditModalOpen}
        setAlterEmail={setAlterEmail}
        setAttachmentsModalOpen={setAttachmentsModalOpen}
        setPaymentModalOpen={setPaymentModalOpen}
        isModal={isModal}
        setInvoiceId={setInvoiceId}
        attachments={attachments}
        fetchAttachments={fetchAttachments}
        setKey={setKey}
      />
      <ViewCanvas downloadUrl={downloadUrl} keyy={key} />

      {addModalOpen && (
        <InvoiceAddModal
          setRefresh={setRefresh}
          setAddModalOpen={setAddModalOpen}
          refresh={refresh}
          setEditModalId={setEditModalId}
          editModalId={editModalId}
          setActivateModalOpen={setActivateModalOpen}
          setInvoiceNr={setInvoiceNr}
          setEmailModalOpen={setEmailModalOpen}
        />
      )}
      {deleteModalOpen && (
        <InvoiceDeleteModal
          deleteModalId={editModalId}
          invoiceNr={invoiceNr}
          setDeleteModalOpen={setDeleteModalOpen}
          setRefresh={setRefresh}
          refresh={refresh}
        />
      )}
      {showClientSearch && (
        <ClientSearch
          handleClose={handleClientModalClose}
          formik={null}
          storageName="storedClientForSubscription"
        />
      )}
      {copyModalOpen && (
        <InvoiceCopyModal
          invoiceId={editModalId}
          invoiceNr={invoiceNr}
          setCopyModalOpen={setCopyModalOpen}
          setRefresh={setRefresh}
          refresh={refresh}
          setAddModalOpen={setAddModalOpen}
          setEditModalId={setEditModalId}
        />
      )}
      {creditModalOpen && (
        <InvoiceCreditModal
          invoiceId={editModalId}
          invoiceNr={invoiceNr}
          setCreditModalOpen={setCreditModalOpen}
          setRefresh={setRefresh}
          refresh={refresh}
          setAddModalOpen={setAddModalOpen}
          setEditModalId={setEditModalId}
        />
      )}

      {emailModalOpen && (
        <InvoiceEmailModal
          invoiceId={editModalId}
          invoiceNr={invoiceNr}
          setEmailModalOpen={setEmailModalOpen}
          setRefresh={setRefresh}
          refresh={refresh}
          alterEmail={alterEmail}
        />
      )}
      {activateModalOpen && (
        <InvoiceActivateModal
          invoiceId={editModalId}
          invoiceNr={invoiceNr}
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
      {paymentModalOpen && (
        <InvoicePaymentModal
          invoiceId={editModalId}
          invoiceNr={invoiceNr}
          setPaymentModalOpen={setPaymentModalOpen}
          setRefresh={setRefresh}
          refresh={refresh}
        />
      )}
    </>
  );
};

const SubscriptionListWrapper = ({
  isModal,
  setInvoiceId,
}: {
  isModal?: boolean;
  setInvoiceId?: (type: number) => void;
}) => (
  <>
    {!isModal && <ToolbarWrapper />}
    <Content>
      <InvoiceListInnerWrapper isModal={isModal} setInvoiceId={setInvoiceId} />
    </Content>
  </>
);

export { SubscriptionListWrapper };
