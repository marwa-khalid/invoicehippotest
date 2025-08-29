import { ClientHeader } from "./header/ClientHeader";
import { ClientsList } from "./search-list/ClientsList";
import { ClientAddModal } from "./client-add-modal/ClientAddModal";
import { ToolbarWrapper } from "../../../../_metronic/layout/components/toolbar";
import { Content } from "../../../../_metronic/layout/components/content";
import { useState } from "react";
import { ClientToolbar } from "./header/ClientToolbar";
import { ClientDeleteModal } from "./client-delete-modal/ClientDeleteModal";
import { QuoteAddModal } from "../../quotes/overview/quote-add-modal/QuoteAddModal";
// @ts-ignore
import { getPaginationModule } from "../../../helpers/paginationUtils.js";
import { QuoteEmailModal } from "../../quotes/overview/quote-email-modal/QuoteEmailModal";
import { QuoteActivateModal } from "../../quotes/overview/quote-activate-modal/QuoteActivateModal";
import { InvoiceAddModal } from "../../invoices/overview/invoice-add-modal/InvoiceAddModal";
import { InvoiceEmailModal } from "../../invoices/overview/invoice-email-modal/InvoiceEmailModal";
import { InvoiceActivateModal } from "../../invoices/overview/invoice-activate-modal/InvoiceActivateModal";

const ClientInnerWrapper = () => {
  const moduleKey = "clients-module";
  const filters = getPaginationModule(moduleKey);

  const [pageIndexState, setPageIndexState] = useState<number>(
    filters.pageIndex || 1
  );
  const [searchTermState, setSearchTermState] = useState(
    filters.searchTerm || ""
  );
  const [totalRows, setTotalRows] = useState(0);
  const [editModalId, setEditModalId] = useState<number>(0);
  const [deleteModalId, setDeleteModalId] = useState<number[]>([0]);
  const [addModalOpen, setAddModalOpen] = useState<boolean>(false);
  const [quoteModalOpen, setQuoteModalOpen] = useState<boolean>(false);
  const [invoiceModalOpen, setInvoiceModalOpen] = useState<boolean>(false);
  const [searchCounter, setSearchCounter] = useState(0);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [intlMessage, setIntlMessage] = useState<string>("");
  const [refresh, setRefresh] = useState(false);
  const [quoteNumber, setQuoteNumber] = useState<string>("");
  const [invoiceNr, setInvoiceNr] = useState<string>("");
  const [emailModalOpenQuote, setEmailModalOpenQuote] = useState(false);
  const [activateModalOpenQuote, setActivateModalOpenQuote] = useState(false);
  const [emailModalOpenInvoice, setEmailModalOpenInvoice] = useState(false);
  const [activateModalOpenInvoice, setActivateModalOpenInvoice] =
    useState(false);

  return (
    <>
      <ClientHeader
        setSearchTerm={setSearchTermState}
        searchTerm={searchTermState}
        setSearchCounter={setSearchCounter}
        setPageIndex={setPageIndexState}
      />
      <ClientToolbar
        totalRows={totalRows}
        setAddModalOpen={setAddModalOpen}
        setEditModalId={setEditModalId}
      />
      <ClientsList
        searchTerm={searchTermState}
        searchCounter={searchCounter}
        setTotalRows={setTotalRows}
        setAddModalOpen={setAddModalOpen}
        setDeleteModalOpen={setDeleteModalOpen}
        setEditModalId={setEditModalId}
        setDeleteModalId={setDeleteModalId}
        setTitle={setTitle}
        refresh={refresh}
        pageIndex={pageIndexState}
        setPageIndex={setPageIndexState}
        setIntlMessage={setIntlMessage}
        setQuoteModalOpen={setQuoteModalOpen}
        setInvoiceModalOpen={setInvoiceModalOpen}
      />
      {addModalOpen && (
        <ClientAddModal
          setRefresh={setRefresh}
          refresh={refresh}
          setAddModalOpen={setAddModalOpen}
          setEditModalId={setEditModalId}
          editModalId={editModalId}
        />
      )}

      {deleteModalOpen && (
        <ClientDeleteModal
          deleteModalId={deleteModalId}
          title={title}
          refresh={refresh}
          setDeleteModalOpen={setDeleteModalOpen}
          setRefresh={setRefresh}
          intlMessage={intlMessage}
        />
      )}
      {quoteModalOpen && (
        <QuoteAddModal
          setRefresh={setRefresh}
          refresh={refresh}
          setEditModalId={setEditModalId}
          editModalId={editModalId}
          setAddModalOpen={setQuoteModalOpen}
          setQuoteNumber={setQuoteNumber}
          setActivateModalOpen={setActivateModalOpenQuote}
          setEmailModalOpen={setEmailModalOpenQuote}
          addModalOpen={quoteModalOpen}
        />
      )}
      {emailModalOpenQuote && (
        <QuoteEmailModal
          quoteId={editModalId}
          quoteNumber={quoteNumber}
          setEmailModalOpen={setEmailModalOpenQuote}
          setRefresh={setRefresh}
          refresh={refresh}
        />
      )}
      {activateModalOpenQuote && (
        <QuoteActivateModal
          quoteId={editModalId}
          quoteNumber={quoteNumber}
          setActivateModalOpen={setActivateModalOpenQuote}
          setRefresh={setRefresh}
          refresh={refresh}
        />
      )}
      {invoiceModalOpen && (
        <InvoiceAddModal
          setRefresh={setRefresh}
          setAddModalOpen={setInvoiceModalOpen}
          refresh={refresh}
          setEditModalId={setEditModalId}
          editModalId={editModalId}
          setActivateModalOpen={setActivateModalOpenInvoice}
          setInvoiceNr={setInvoiceNr}
          setEmailModalOpen={setEmailModalOpenInvoice}
          addModalOpen={invoiceModalOpen}
        />
      )}
      {emailModalOpenInvoice && (
        <InvoiceEmailModal
          invoiceId={editModalId}
          invoiceNr={invoiceNr}
          setEmailModalOpen={setEmailModalOpenInvoice}
          setRefresh={setRefresh}
          refresh={refresh}
          alterEmail={false}
        />
      )}
      {activateModalOpenInvoice && (
        <InvoiceActivateModal
          invoiceId={editModalId}
          invoiceNr={invoiceNr}
          setActivateModalOpen={setActivateModalOpenInvoice}
          setRefresh={setRefresh}
          refresh={refresh}
        />
      )}
    </>
  );
};

const ClientWrapper = () => (
  <>
    <ToolbarWrapper />
    <Content>
      <ClientInnerWrapper />
    </Content>
  </>
);

export { ClientWrapper };
