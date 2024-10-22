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
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [addModalOpen, setAddModalOpen] = useState<boolean>(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [downloadUrl, setDownloadUrl] = useState<string>("");
  const [fileExtension, setFileExtension] = useState<any>();
  const [quoteNumber, setQuoteNumber] = useState<string>("");
  const [refresh, setRefresh] = useState(false);
  const [deleteModalId, setDeleteModalId] = useState<number[]>([0]);
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
        deleteModalOpen={deleteModalOpen}
        addModalOpen={addModalOpen}
      />
      {addModalOpen && (
        <QuoteAddModal
          setRefresh={setRefresh}
          setAddModalOpen={setAddModalOpen}
          refresh={refresh}
          setDeleteModalOpen={setDeleteModalOpen}
          setDeleteModalId={setDeleteModalId}
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
      `
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
