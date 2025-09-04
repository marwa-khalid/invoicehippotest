import { ToolbarWrapper } from "../../../../../../_metronic/layout/components/toolbar";
import { Content } from "../../../../../../_metronic/layout/components/content";
import { useEffect, useState } from "react";
import { ViewCanvas } from "../../../../generic/ViewCanvas";
import { ClientSearch } from "../../../../generic/ClientSearch";
// @ts-ignore
import { getPaginationModule } from "../../../../../helpers/paginationUtils.js";
import { useIntl } from "react-intl";
import { TransactionToolbar } from "./header/TransactionToolbar";
import { TransactionHeader } from "./header/TransactionHeader";
import { TransactionList } from "./search-list/TransactionList";
import { getAccountsList } from "./core/_requests";
import { AccountsResult, BankTransactionsModel } from "./core/_models";
import { DrawerProcess } from "./tasks/DrawerProcess";
import { InvoicePicker } from "./taskModals/InvoicePicker";
import { LinkExistingInvoice } from "./taskModals/LinkExistingInvoice";
import { InvoiceListResult } from "../../../../invoices/overview/core/_models";
import { CostListResult } from "../../../costs/components/core/_models";
import { CostPicker } from "./taskModals/CostPicker";
import { LinkExistingCost } from "./taskModals/LinkExistingCost";
import { BankLinkModal } from "../../../../admin-settings/financialaccounts-list/financial-link-modal/BankLinkModal";
import { AutoProcessModal } from "./auto-process-modal/AutoProcessModal";
import { TransactionUnlinkModal } from "./unlink-modal/TransactionUnlinkModal";
import { BookingAddModal } from "../../../bookings/components/booking-add-modal/BookingAddModal";
import { CostAddModal } from "../../../costs/components/cost-add-modal/CostAddModal";
import { AttachmentsResult } from "../../../bookings/components/core/_models";
import { toast } from "react-toastify";
import {
  attachBookingFile,
  getAttachmentsForBooking,
} from "../../../bookings/components/core/_requests";
import {
  attachCostFile,
  getAttachmentsForCost,
} from "../../../costs/components/core/_requests";
import {
  attachInvoiceFile,
  getAttachmentsForInvoice,
} from "../../../../invoices/overview/core/_requests";
import { InvoiceAddModal } from "../../../../invoices/overview/invoice-add-modal/InvoiceAddModal";
import { InvoiceEmailModal } from "../../../../invoices/overview/invoice-email-modal/InvoiceEmailModal";
import { InvoiceActivateModal } from "../../../../invoices/overview/invoice-activate-modal/InvoiceActivateModal";
import { useToast } from "react-toastify";
import { handleToast } from "../../../../auth/core/_toast";
import { AttachmentsModal } from "../../../../generic/FileManager/AttachmentsModal";

const BankTransactionInnerWrapper = ({
  isModal,
  setCostId,
}: {
  isModal?: boolean;
  setCostId?: (type: number) => void;
}) => {
  const intl = useIntl();
  const moduleKey = "transaction-module";
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
  const [processStatusTypes, setProcessStatusTypes] = useState<any>(
    filters?.statusTypes || []
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

  const [balanceType, setBalanceType] = useState<number>(
    filters?.balanceTypeFilter || 0
  );
  const [financialAccountId, setFinancialAccountId] = useState<number>(
    filters?.financialAccountFilter || 0
  );
  const [year, setYear] = useState<number | null>(filters?.yearFilter || null);
  const [searchCounter, setSearchCounter] = useState(0);
  const [totalRows, setTotalRows] = useState(0);
  const [mutationId, setMutationId] = useState<number>(0);
  const [invoiceModalOpen, setInvoiceModalOpen] = useState<boolean>(false);
  const [bookingModalOpen, setBookingModalOpen] = useState<boolean>(false);
  const [costModalOpen, setCostModalOpen] = useState<boolean>(false);

  const [downloadUrl, setDownloadUrl] = useState<string>("");
  const [invoiceNr, setInvoiceNr] = useState<string>("");
  const [refresh, setRefresh] = useState(false);
  const [clientName, setClientName] = useState<string>("");
  const [showInvoices, setShowInvoices] = useState<boolean>(false);
  const [showCosts, setShowCosts] = useState<boolean>(false);

  const [key, setKey] = useState(1);
  const [showClientSearch, setShowClientSearch] = useState<boolean>(false);
  const [financialAccounts, setFinancialAccounts] = useState<AccountsResult[]>(
    []
  );
  const [invoiceData, setInvoiceData] = useState<InvoiceListResult | null>(
    null
  );
  const [costData, setCostData] = useState<CostListResult | null>(null);
  const [linkModalOpen, setLinkModalOpen] = useState<boolean>(false);
  useEffect(() => {
    const fetchFinancialAccounts = async () => {
      try {
        const res = await getAccountsList();
        if (res.isValid) {
          setFinancialAccounts(res.result);
        }
      } catch {}
    };
    fetchFinancialAccounts();
  }, []);

  const handleClientModalClose = () => {
    const storedClient = JSON.parse(
      localStorage.getItem("storedClientForTransaction")!
    );

    if (storedClient) {
      setTempClientId(storedClient.id);
      setClientName(storedClient.displayName);
    }
    setShowClientSearch(false);
  };

  const [linkInvoiceModalOpen, setLinkInvoiceModalOpen] =
    useState<boolean>(false);
  const [hasMutation, setHasMutation] = useState<boolean>(false);
  const [linkCostModalOpen, setLinkCostModalOpen] = useState<boolean>(false);
  const [autoProcessModalOpen, setAutoProcessModalOpen] =
    useState<boolean>(false);
  const [unlinkModalOpen, setUnlinkModalOpen] = useState<boolean>(false);

  const [itemsCount, setItemsCount] = useState<number>(0);
  const [bankTransactions, setBankTransactions] =
    useState<BankTransactionsModel>();
  const [attachments, setAttachments] = useState<
    Record<number, AttachmentsResult[]>
  >({});
  const fetchAttachments = async (routedRelation: any) => {
    let response;
    if (routedRelation.routingType.value === 4) {
      response = await getAttachmentsForBooking(routedRelation.id);
    } else if (routedRelation.routingType.value === 1) {
      response = await getAttachmentsForCost(routedRelation.id);
    } else if (routedRelation.routingType.value === 2) {
      response = await getAttachmentsForInvoice(routedRelation.id);
    } else {
      return;
    }

    if (response.isValid && response.result.length > 0) {
      setAttachments((prev) => ({
        ...prev,
        [mutationId]: response.result,
      }));
      // setLoadingRows((prev) => ({ ...prev, [id]: false }));
    }
  };
  const attachFile = async (attachment: any) => {
    try {
      if (attachments[mutationId].length === 5) {
        toast.warning(
          intl.formatMessage({
            id: "System.AccessValidation_MaxAttachmentUploadOnCommon",
          })
        );
      } else {
        let response;
        // return;
        const item = bankTransactions?.result.find((transaction) => {
          return transaction.id === mutationId;
        });
        if (item?.routedRelation.routingType.value === 4) {
          response = await attachBookingFile(
            attachment.inboxItemId,
            attachment.fileId,
            item?.routedRelation.id
          );
        } else if (item?.routedRelation.routingType.value === 1) {
          response = await attachCostFile(
            attachment.inboxItemId,
            attachment.fileId,
            item?.routedRelation.id
          );
        } else if (item?.routedRelation.routingType.value === 2) {
          response = await attachInvoiceFile(
            attachment.inboxItemId,
            attachment.fileId,
            item?.routedRelation.id
          );
        } else {
          return;
        }

        if (response.isValid) {
          fetchAttachments(item?.routedRelation);
          handleToast(response);
          setRefresh(!refresh);
        }
      }
    } catch (error) {
      return;
    }
  };
  const [emailModalOpen, setEmailModalOpen] = useState<boolean>(false);
  const [activateModalOpen, setActivateModalOpen] = useState<boolean>(false);
  const [alterEmail, setAlterEmail] = useState<boolean>(false);
  const [attachmentsModalOpen, setAttachmentsModalOpen] =
    useState<boolean>(false);
  return (
    <>
      <TransactionHeader
        setShowClientSearch={setShowClientSearch}
        setSearchTerm={setSearchTermState}
        searchTerm={searchTermState}
        setPeriodValueType={setPeriodValueType}
        periodValueType={periodValueType}
        attachmentType={attachmentType}
        setAttachmentType={setAttachmentType}
        setBalanceType={setBalanceType}
        balanceType={balanceType}
        financialAccountId={financialAccountId}
        setFinancialAccountId={setFinancialAccountId}
        setProcessStatusTypes={setProcessStatusTypes}
        processStatusTypes={processStatusTypes}
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
        financialAccounts={financialAccounts}
      />
      {!isModal && (
        <TransactionToolbar
          itemsCount={itemsCount}
          totalRows={totalRows}
          setAutoProcessModalOpen={setAutoProcessModalOpen}
          setEditModalId={setMutationId}
          setLinkModalOpen={setLinkModalOpen}
        />
      )}
      <TransactionList
        searchCounter={searchCounter}
        year={year}
        searchTerm={searchTermState}
        periodValueType={periodValueType}
        processStatusTypes={processStatusTypes}
        attachmentType={attachmentType}
        balanceType={balanceType}
        financialAccountId={financialAccountId}
        clientIdForFilter={clientIdForFilter}
        setTotalRows={setTotalRows}
        setDownloadUrl={setDownloadUrl}
        setKey={setKey}
        setMutationId={setMutationId}
        refresh={refresh}
        pageIndex={pageIndexState}
        setPageIndex={setPageIndexState}
        setItemsCount={setItemsCount}
        setUnlinkModalOpen={setUnlinkModalOpen}
        bankTransactions={bankTransactions}
        setBankTransactions={setBankTransactions}
        setBookingModalOpen={setBookingModalOpen}
        setCostModalOpen={setCostModalOpen}
        setInvoiceModalOpen={setInvoiceModalOpen}
        setHasMutation={setHasMutation}
        fetchAttachments={fetchAttachments}
        attachments={attachments}
        setAttachmentsModalOpen={setAttachmentsModalOpen}
      />
      <DrawerProcess
        setShowInvoices={setShowInvoices}
        setShowCosts={setShowCosts}
        setBookingModalOpen={setBookingModalOpen}
        setHasMutation={setHasMutation}
        setCostModalOpen={setCostModalOpen}
      />
      <ViewCanvas downloadUrl={downloadUrl} keyy={key} />
      {linkInvoiceModalOpen && (
        <LinkExistingInvoice
          handleClose={() => setLinkInvoiceModalOpen(false)}
          invoiceData={invoiceData}
          setShowInvoices={setShowInvoices}
          setInvoiceData={setInvoiceData}
          mutationId={mutationId}
          financialAccounts={financialAccounts}
        />
      )}
      {autoProcessModalOpen && (
        <AutoProcessModal
          itemsCount={itemsCount}
          setDeleteModalOpen={setAutoProcessModalOpen}
          refresh={refresh}
          setRefresh={setRefresh}
          financialAccounts={financialAccounts}
        />
      )}
      {bookingModalOpen && (
        <BookingAddModal
          setRefresh={setRefresh}
          setAddModalOpen={setBookingModalOpen}
          refresh={refresh}
          setEditModalId={setMutationId}
          editModalId={mutationId}
          hasMutation={hasMutation}
          // transactionData={transactionData}
        />
      )}
      {invoiceModalOpen && (
        <InvoiceAddModal
          setRefresh={setRefresh}
          setAddModalOpen={setInvoiceModalOpen}
          refresh={refresh}
          setEditModalId={setMutationId}
          editModalId={mutationId}
          setActivateModalOpen={setActivateModalOpen}
          setInvoiceNr={setInvoiceNr}
          setEmailModalOpen={setEmailModalOpen}
        />
      )}
      {emailModalOpen && (
        <InvoiceEmailModal
          invoiceId={mutationId}
          invoiceNr={invoiceNr}
          setEmailModalOpen={setEmailModalOpen}
          setRefresh={setRefresh}
          refresh={refresh}
          alterEmail={alterEmail}
        />
      )}
      {activateModalOpen && (
        <InvoiceActivateModal
          invoiceId={mutationId}
          invoiceNr={invoiceNr}
          setActivateModalOpen={setActivateModalOpen}
          setRefresh={setRefresh}
          refresh={refresh}
        />
      )}
      {costModalOpen && (
        <CostAddModal
          setRefresh={setRefresh}
          setAddModalOpen={setCostModalOpen}
          refresh={refresh}
          setEditModalId={setMutationId}
          editModalId={mutationId}
          hasMutation={hasMutation}
        />
      )}
      {unlinkModalOpen && (
        <TransactionUnlinkModal
          setBankTransactions={setBankTransactions}
          setUnlinkModalOpen={setUnlinkModalOpen}
          bankTransactions={bankTransactions}
          bankMutationId={mutationId}
        />
      )}
      {linkCostModalOpen && (
        <LinkExistingCost
          handleClose={() => setLinkCostModalOpen(false)}
          costData={costData}
          setCostData={setCostData}
          setShowCosts={setShowCosts}
          mutationId={mutationId}
          financialAccounts={financialAccounts}
        />
      )}
      {showClientSearch && (
        <ClientSearch
          handleClose={handleClientModalClose}
          formik={null}
          storageName="storedClientForTransaction"
        />
      )}
      {linkModalOpen && (
        <BankLinkModal
          setRefresh={setRefresh}
          setLinkModalOpen={setLinkModalOpen}
          refresh={refresh}
        />
      )}
      {showInvoices && (
        <InvoicePicker
          handleClose={() => setShowInvoices(false)}
          id={mutationId}
          setLinkInvoiceModalOpen={setLinkInvoiceModalOpen}
          setInvoiceData={setInvoiceData}
        />
      )}
      {showCosts && (
        <CostPicker
          handleClose={() => setShowCosts(false)}
          id={mutationId}
          setLinkCostModalOpen={setLinkCostModalOpen}
          setCostData={setCostData}
          setMutationId={setMutationId}
        />
      )}
      {attachmentsModalOpen && (
        <AttachmentsModal
          setAttachmentsModalOpen={setAttachmentsModalOpen}
          type="separate"
          attachFile={attachFile}
          separateAttachments={attachments}
          info="Fields.BankMutationUploadModuleInfo"
        />
      )}
    </>
  );
};

const BankTransactionWrapper = ({
  isModal,
  setCostId,
}: {
  isModal?: boolean;
  setCostId?: (type: number) => void;
}) => (
  <>
    {!isModal && <ToolbarWrapper />}
    <Content>
      <BankTransactionInnerWrapper isModal={isModal} setCostId={setCostId} />
    </Content>
  </>
);

export { BankTransactionWrapper };
