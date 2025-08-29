import { ToolbarWrapper } from "../../../../../../_metronic/layout/components/toolbar";
import { Content } from "../../../../../../_metronic/layout/components/content";
import { useEffect, useState } from "react";
import { ViewCanvas } from "../../../../generic/ViewCanvas";
import { ClientSearch } from "../../../../generic/ClientSearch";
// @ts-ignore
import { getPaginationModule } from "../../../../../helpers/paginationUtils.js";
import { RuleToolbar } from "./header/RuleToolbar";
import { RuleHeader } from "./header/RuleHeader";
import { BookingRuleList } from "./search-list/BookingRuleList";
import { getAccountsList, getCounterPartyAccounts } from "./core/_requests";
import {
  AccountsResult,
  BookingRuleModel,
  CounterPartyAccounts,
} from "./core/_models";
import { CostAddModal } from "../../../costs/components/cost-add-modal/CostAddModal";
import { InvoiceAddModal } from "../../../../invoices/overview/invoice-add-modal/InvoiceAddModal";
import { InvoiceEmailModal } from "../../../../invoices/overview/invoice-email-modal/InvoiceEmailModal";
import { InvoiceActivateModal } from "../../../../invoices/overview/invoice-activate-modal/InvoiceActivateModal";
import { RuleAddModal } from "./rule-add-modal/RuleAddModal";
import { BookingDeleteModal } from "./rule-delete-modal/BookingDeleteModal";

const BookingRuleInnerWrapper = () => {
  const moduleKey = "rule-module";
  let filters = getPaginationModule(moduleKey);
  const [pageIndexState, setPageIndexState] = useState<number>(
    filters?.pageIndex || 1
  );
  const [searchTermState, setSearchTermState] = useState(
    filters?.searchTerm || ""
  );

  const [clientIdForFilter, setClientIdForFilter] = useState<number | null>(
    filters?.clientFilter || null
  );
  const [tempClientId, setTempClientId] = useState<number | null>(
    clientIdForFilter || null
  );

  const [balanceType, setBalanceType] = useState<number>(
    filters?.balanceTypeFilter || 0
  );
  const [financialAccountId, setFinancialAccountId] = useState<number>(
    filters?.financialAccountFilter || 0
  );
  const [searchCounter, setSearchCounter] = useState(0);
  const [totalRows, setTotalRows] = useState(0);
  const [editModalId, setEditModalId] = useState<number>(0);
  const [invoiceModalOpen, setInvoiceModalOpen] = useState<boolean>(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [costModalOpen, setCostModalOpen] = useState<boolean>(false);
  const [addModalOpen, setAddModalOpen] = useState<boolean>(false);

  const [downloadUrl, setDownloadUrl] = useState<string>("");
  const [invoiceNr, setInvoiceNr] = useState<string>("");
  const [refresh, setRefresh] = useState(false);
  const [clientName, setClientName] = useState<string>("");

  const [key, setKey] = useState(1);
  const [showClientSearch, setShowClientSearch] = useState<boolean>(false);
  const [financialAccounts, setFinancialAccounts] = useState<AccountsResult[]>(
    []
  );
  const [counterPartyAccounts, setCounterPartyAccounts] = useState<
    CounterPartyAccounts[]
  >([]);
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
  useEffect(() => {
    const fetchCounterPartyAccounts = async () => {
      try {
        const res = await getCounterPartyAccounts();
        if (res.isValid) {
          setCounterPartyAccounts(res.result);
        }
      } catch {}
    };
    fetchCounterPartyAccounts();
  }, []);
  const handleClientModalClose = () => {
    const storedClient = JSON.parse(
      localStorage.getItem("storedClientForRule")!
    );

    if (storedClient) {
      setTempClientId(storedClient.id);
      setClientName(storedClient.displayName);
    }
    setShowClientSearch(false);
  };

  const [hasMutation, setHasMutation] = useState<boolean>(false);
  const [bookingRules, setBookingRules] = useState<BookingRuleModel>();

  const [emailModalOpen, setEmailModalOpen] = useState<boolean>(false);
  const [activateModalOpen, setActivateModalOpen] = useState<boolean>(false);

  return (
    <>
      <RuleHeader
        setShowClientSearch={setShowClientSearch}
        setSearchTerm={setSearchTermState}
        searchTerm={searchTermState}
        setBalanceType={setBalanceType}
        balanceType={balanceType}
        financialAccountId={financialAccountId}
        setFinancialAccountId={setFinancialAccountId}
        setClientIdForFilter={setClientIdForFilter}
        clientIdForFilter={clientIdForFilter}
        setSearchCounter={setSearchCounter}
        clientName={clientName}
        setClientName={setClientName}
        tempClientId={tempClientId}
        setTempClientId={setTempClientId}
        setPageIndexState={setPageIndexState}
        financialAccounts={financialAccounts}
      />
      <RuleToolbar
        totalRows={totalRows}
        setEditModalId={setEditModalId}
        setAddModalOpen={setAddModalOpen}
      />
      <BookingRuleList
        searchCounter={searchCounter}
        searchTerm={searchTermState}
        balanceType={balanceType}
        financialAccountId={financialAccountId}
        clientIdForFilter={clientIdForFilter}
        setTotalRows={setTotalRows}
        setRefresh={setRefresh}
        setEditModalId={setEditModalId}
        setAddModalOpen={setAddModalOpen}
        refresh={refresh}
        pageIndex={pageIndexState}
        setPageIndex={setPageIndexState}
        bookingRules={bookingRules}
        setBookingRules={setBookingRules}
        setDeleteModalOpen={setDeleteModalOpen}
        setHasMutation={setHasMutation}
      />
      <ViewCanvas downloadUrl={downloadUrl} keyy={key} />
      {addModalOpen && (
        <RuleAddModal
          setRefresh={setRefresh}
          setAddModalOpen={setAddModalOpen}
          refresh={refresh}
          setEditModalId={setEditModalId}
          editModalId={editModalId}
          hasMutation={hasMutation}
          financialAccounts={financialAccounts}
          counterPartyAccounts={counterPartyAccounts}
          // transactionData={transactionData}
        />
      )}
      {deleteModalOpen && (
        <BookingDeleteModal
          refresh={refresh}
          setRefresh={setRefresh}
          deleteModalId={editModalId}
          setDeleteModalOpen={setDeleteModalOpen}
        />
      )}
      {invoiceModalOpen && (
        <InvoiceAddModal
          setRefresh={setRefresh}
          setAddModalOpen={setInvoiceModalOpen}
          refresh={refresh}
          setEditModalId={setEditModalId}
          editModalId={editModalId}
          setActivateModalOpen={setActivateModalOpen}
          setInvoiceNr={setInvoiceNr}
          setEmailModalOpen={setEmailModalOpen}
          addModalOpen={invoiceModalOpen}
        />
      )}
      {emailModalOpen && (
        <InvoiceEmailModal
          invoiceId={editModalId}
          invoiceNr={invoiceNr}
          setEmailModalOpen={setEmailModalOpen}
          setRefresh={setRefresh}
          refresh={refresh}
          alterEmail={false}
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
      {costModalOpen && (
        <CostAddModal
          setRefresh={setRefresh}
          setAddModalOpen={setCostModalOpen}
          refresh={refresh}
          setEditModalId={setEditModalId}
          editModalId={editModalId}
          hasMutation={hasMutation}
        />
      )}
      {showClientSearch && (
        <ClientSearch
          handleClose={handleClientModalClose}
          formik={null}
          storageName="storedClientForRule"
        />
      )}
      {/* {attachmentsModalOpen && (
        <AttachmentsModal
          setAttachmentsModalOpen={setAttachmentsModalOpen}
          type="separate"
          attachFile={attachFile}
          separateAttachments={attachments}
        />
      )} */}
    </>
  );
};

const BookingRuleWrapper = ({
  isModal,
  setCostId,
}: {
  isModal?: boolean;
  setCostId?: (type: number) => void;
}) => (
  <>
    {!isModal && <ToolbarWrapper />}
    <Content>
      <BookingRuleInnerWrapper />
    </Content>
  </>
);

export { BookingRuleWrapper };
