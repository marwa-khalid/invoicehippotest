import { FinancialListHeader } from "./components/header/QuoteHeader";
import { QuoteList } from "./search-list/QuoteList";
import { ToolbarWrapper } from "../../../../../_metronic/layout/components/toolbar";
import { Content } from "../../../../../_metronic/layout/components/content";
import { useState } from "react";
import { FinancialAccountsToolbar } from "./components/header/FinancialAccountsToolbar";
import { QuoteDeleteModal } from "./quote-delete-modal/QuoteDeleteModal";
import { QuoteViewModal } from "./quote-view-modal/QuoteViewModal";
import { QuoteAddModal } from "./quote-add-modal/QuoteAddModal";
import { ClientSearch } from "./quote-add-modal/ClientSearch";
import { QuoteCopyModal } from "./quote-copy-modal/QuoteCopyModal";
import { QuoteValidateModal } from "./quote-validate-modal/QuoteValidateModal";
import { QuoteEmailModal } from "./quote-email-modal/QuoteEmailModal";

const getPaginationValues = () => {
  const storedPaginationString = localStorage.getItem("pagination")!;
  if (storedPaginationString) {
    const pagination = JSON.parse(storedPaginationString);

    const currentPeriodFilter =
      pagination["quotes-module"].filters.periodType || null;
    const currentQuoteStatusFilter =
      pagination["quotes-module"].filters.quoteStatus || [];
    const currentClientFilter =
      pagination["quotes-module"].filters.clientFilter || null;

    const currentYearFilter =
      pagination["quotes-module"].filters.yearFilter || null;
    const currentPage = pagination["quotes-module"].pageIndex || 1;
    const searchTerm = pagination["quotes-module"].filters.searchTerm || "";

    return {
      pageIndex: currentPage,
      searchTerm: searchTerm,
      periodValueFilter: currentPeriodFilter,
      quoteStatusFilter: currentQuoteStatusFilter,
      clientFilter: currentClientFilter,
      yearFilter: currentYearFilter,
    };
  }
  return {
    pageIndex: 1,
    searchTerm: "",
    periodValueFilter: null,
    quoteStatusFilter: [],
    clientFilter: null,
    yearFilter: null,
  };
};
const QuoteListInnerWrapper = () => {
  const {
    pageIndex,
    searchTerm,
    periodValueFilter,
    quoteStatusFilter,
    clientFilter,
    yearFilter,
  } = getPaginationValues();

  const [pageIndexState, setPageIndexState] = useState<number>(pageIndex);
  const [searchTermState, setSearchTermState] = useState(searchTerm);
  const [searchCounter, setSearchCounter] = useState(0);
  const [totalRows, setTotalRows] = useState(0);
  const [editModalId, setEditModalId] = useState<number>(0);
  const [addModalOpen, setAddModalOpen] = useState<boolean>(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [downloadUrl, setDownloadUrl] = useState<string>("");
  const [fileExtension, setFileExtension] = useState<any>();
  const [quoteNumber, setQuoteNumber] = useState<string>("");
  const [refresh, setRefresh] = useState(false);
  const [clientName, setClientName] = useState<string>("");
  const [periodValueType, setPeriodValueType] = useState<number | null>(
    periodValueFilter
  );
  const [quoteStatusTypes, setQuoteStatusTypes] =
    useState<any>(quoteStatusFilter);
  const [clientIdForFilter, setClientIdForFilter] = useState<number | null>(
    clientFilter
  );
  const [tempClientId, setTempClientId] = useState<number | null>(
    clientIdForFilter
  );
  const [year, setYear] = useState<number | null>(yearFilter);
  const [showClientSearch, setShowClientSearch] = useState<boolean>(false);
  const [copyModalOpen, setCopyModalOpen] = useState<boolean>(false);
  const [validateModalOpen, setValidateModalOpen] = useState<boolean>(false);
  const [emailModalOpen, setEmailModalOpen] = useState<boolean>(false);
  const handleClientModalClose = () => {
    const storedClient = JSON.parse(localStorage.getItem("storedClient")!);

    if (storedClient) {
      setTempClientId(storedClient.id);
      setClientName(storedClient.displayName);
    }
    setShowClientSearch(false); // Close the modal
  };

  return (
    <>
      <FinancialListHeader
        setShowClientSearch={setShowClientSearch}
        setSearchTerm={setSearchTermState}
        searchTerm={searchTerm}
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
      />
      <FinancialAccountsToolbar
        totalRows={totalRows}
        setAddModalOpen={setAddModalOpen}
        setEditModalId={setEditModalId}
      />
      <QuoteList
        searchCounter={searchCounter}
        year={year}
        searchTerm={searchTerm}
        periodValueType={periodValueType}
        quoteStatusTypes={quoteStatusTypes}
        clientIdForFilter={clientIdForFilter}
        setTotalRows={setTotalRows}
        setDownloadUrl={setDownloadUrl}
        setFileExtension={setFileExtension}
        setAddModalOpen={setAddModalOpen}
        setDeleteModalOpen={setDeleteModalOpen}
        setEditModalId={setEditModalId}
        setQuoteNumber={setQuoteNumber}
        refresh={refresh}
        pageIndex={pageIndex}
        setPageIndex={setPageIndexState}
        setCopyModalOpen={setCopyModalOpen}
        setValidateModalOpen={setValidateModalOpen}
        setEmailModalOpen={setEmailModalOpen}
      />
      {addModalOpen && (
        <QuoteAddModal
          setRefresh={setRefresh}
          setAddModalOpen={setAddModalOpen}
          refresh={refresh}
          setEditModalId={setEditModalId}
          editModalId={editModalId}
        />
      )}
      <QuoteViewModal downloadUrl={downloadUrl} fileExtension={fileExtension} />
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
        <ClientSearch handleClose={handleClientModalClose} formik={null} />
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
          deleteModalId={editModalId}
          quoteNumber={quoteNumber}
          setValidateModalOpen={setValidateModalOpen}
          setRefresh={setRefresh}
          refresh={refresh}
        />
      )}
      {emailModalOpen && (
        <QuoteEmailModal
          deleteModalId={editModalId}
          quoteNumber={quoteNumber}
          setValidateModalOpen={setEmailModalOpen}
          setRefresh={setRefresh}
          refresh={refresh}
        />
      )}
    </>
  );
};

const QuoteListWrapper = () => (
  <>
    <ToolbarWrapper />
    <Content>
      <QuoteListInnerWrapper />
    </Content>
  </>
);

export { QuoteListWrapper };
