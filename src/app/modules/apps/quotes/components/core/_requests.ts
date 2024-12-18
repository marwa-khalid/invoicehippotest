import {
  QuotePostModel,
  PrivateLedgersModel,
  FinancialInstitutionsModel,
  AccountAutomationModel,
  QuoteListModel,
  GenericBooleanModel,
  EstimationActivitiesModel,
} from "./_models";

import {
  getRequest,
  postRequest,
  deleteRequest,
} from "../../../../auth/core/_apiservice";
import {
  GET_LEDGERS,
  GET_VATS,
  SEARCH_QUOTE_LIST,
  QUOTE_API,
  GET_UNIT_TYPES,
  GET_DISCOUNT_TYPES,
  GET_COMPANY_TRADE_NAMES,
  GET_NOTIFICATION_CYCLES,
  GET_PRODUCT_BY_ID,
  GET_DEFAULT_EMPTY,
  GET_CONTACTS,
  UPLOAD_ATTACHMENTS,
  INBOX_SEARCH,
  MIN_MAX_YEAR,
  CREATE_COPY,
  SEND_EMAIL,
  FINALIZE_QUOTE,
  VALIDATE_QUOTE,
  ESTIMATION_ACTIVITIES,
} from "./constants";
import { ContactModel } from "../../../client/client-search/core/_models";

interface DeleteResult extends Partial<QuotePostModel> {}

export function getQuotes(
  searchTerm: string,
  pageIndex: number,
  dateRange: any,
  quoteStatusTypes: any,
  clientId: number | null
) {
  const payload: any = {
    pageMax: 25,
    pageIndex: searchTerm ? 1 : pageIndex,
    searchTerm: searchTerm,
    dateRange: dateRange,
  };

  // Conditionally add statusTypes if not empty
  if (quoteStatusTypes && quoteStatusTypes.length > 0) {
    payload.statusTypes = quoteStatusTypes;
  }

  // Conditionally add clientId if not null
  if (clientId !== null) {
    payload.clientId = clientId;
  }

  return postRequest<QuoteListModel>(SEARCH_QUOTE_LIST, payload, true);
}

export function getLedgerTypes() {
  return getRequest<PrivateLedgersModel>(GET_LEDGERS, true);
}

export function getUnitTypes() {
  return getRequest<any>(GET_UNIT_TYPES, true);
}

export function getDiscountTypes() {
  return getRequest<any>(GET_DISCOUNT_TYPES, true);
}

export function getVatList() {
  return getRequest<any>(GET_VATS, true);
}

export function getTradeNames() {
  return getRequest<any>(GET_COMPANY_TRADE_NAMES, true);
}

export function getNotificationCycles() {
  return getRequest<any>(GET_NOTIFICATION_CYCLES, true);
}

export function createCopy(quoteId: number, copyAttachments: boolean) {
  return postRequest<any>(
    CREATE_COPY,
    {
      quoteId: quoteId,
      copyAttachments: copyAttachments,
    },
    true
  );
}

export function sendEmail(values: any) {
  return postRequest<GenericBooleanModel>(SEND_EMAIL, values, true);
}

export function validateQuote(values: any) {
  return postRequest<GenericBooleanModel>(VALIDATE_QUOTE, values, true);
}

export function finalizeQuote(
  quoteId: number,
  dontSendRemindersOnlyTrackStatus: boolean,
  adjustQuoteDateToToday: boolean
) {
  return postRequest<GenericBooleanModel>(
    FINALIZE_QUOTE,
    {
      quoteId: quoteId,
      adjustQuoteDateToToday: adjustQuoteDateToToday,
      dontSendRemindersOnlyTrackStatus: dontSendRemindersOnlyTrackStatus,
    },
    true
  );
}

export function getProductById(id: number) {
  return getRequest<any>(`${GET_PRODUCT_BY_ID}/${id}`, true);
}

export function getDefaultEmpty() {
  return getRequest<QuoteListModel>(
    `${GET_DEFAULT_EMPTY}`,

    true
  );
}

export function deleteQuoteList(id: number, keepAttachments: boolean) {
  return deleteRequest<DeleteResult>(
    QUOTE_API,
    { invoiceId: id, keepAttachments: keepAttachments },
    true
  );
}

export function getQuoteById(editModalId: number) {
  return getRequest<QuoteListModel>(`${QUOTE_API}/${editModalId}`, true);
}

export function getQuickViewQuote(quoteId: number) {
  return getRequest<QuoteListModel>(
    `${QUOTE_API}/quick-view-for/${quoteId}`,
    true
  );
}

export function postQuote(values: any) {
  return postRequest<QuotePostModel>(
    QUOTE_API,

    values,

    true
  );
}

export function getClientContacts(contactId: number) {
  return getRequest<ContactModel>(`${GET_CONTACTS}/${contactId}`, true);
}

export function uploadAttachments(formData: FormData) {
  return postRequest<any>(`${UPLOAD_ATTACHMENTS}/0/false`, formData, true);
}

export function getInboxAttachments(searchTerm: string, pageIndex: number) {
  return postRequest<any>(
    INBOX_SEARCH,
    {
      pageMax: 5,
      searchTerm: searchTerm,
      pageIndex: pageIndex,
    },
    true
  );
}

export function getMinMaxYear() {
  return getRequest<any>(MIN_MAX_YEAR, true);
}

export function getEstimationActivitiesById(id: number) {
  return getRequest<EstimationActivitiesModel>(
    `${ESTIMATION_ACTIVITIES}/${id}`,
    true
  );
}
