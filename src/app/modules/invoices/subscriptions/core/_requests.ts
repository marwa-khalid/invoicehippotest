import {
  PrivateLedgersModel,
  GenericBooleanModel,
  InvoiceListModel,
  InvoicePostModel,
  GenericNumberModel,
  PaymentsModel,
  GenericStringModel,
  AccountsForPaymentModel,
} from "./_models";
import {
  MutationsModel,
  ActivitiesModel,
} from "../../../accounting/bookings/components/core/_models";
import {
  getRequest,
  postRequest,
  deleteRequest,
} from "../../../auth/core/_apiservice";
import {
  GET_LEDGERS,
  GET_VATS,
  SEARCH_INVOICE_LIST,
  INVOICE_API,
  GET_UNIT_TYPES,
  GET_DISCOUNT_TYPES,
  GET_COMPANY_TRADE_NAMES,
  GET_NOTIFICATION_CYCLES,
  PICK_PRODUCT,
  GET_PRODUCT_BY_ID,
  GET_DEFAULT_EMPTY,
  GET_CONTACTS,
  UPLOAD_ATTACHMENTS,
  INBOX_SEARCH,
  MIN_MAX_YEAR,
  CREATE_COPY,
  CREATE_CREDIT,
  SEND_EMAIL,
  FINALIZE_INVOICE,
  VALIDATE_QUOTE,
  INVOICE_ACTIVITIES,
  INVOICE_MUTATIONS,
  GET_FACTORING_CLIENTS,
  INVOICE_PAYMENTS,
  REMOVE_PAYMENT,
  PAY_ONLINE,
  GET_ACCOUNTS_FOR_PAYMENT,
  REGISTER_PAYMENT,
  GET_ATTACHMENTS,
  INVOICE_ATTACHMENT,
} from "./constants";
import { ContactModel } from "../../../client/client-search/core/_models";
import { AttachmentsModel } from "../../../accounting/bookings/components/core/_models";

interface DeleteResult extends Partial<InvoicePostModel> {}

export function getSubscriptions(
  searchTerm: string,
  pageIndex: number,
  dateRange: any,
  statusTypes: any,
  clientId: number | null,
  subscriptionStatus: number
) {
  return postRequest<InvoiceListModel>(
    SEARCH_INVOICE_LIST,
    {
      pageMax: 25,
      SearchSubscriptions: true,
      pageIndex: searchTerm ? 1 : pageIndex,
      searchTerm: searchTerm,
      dateRange: dateRange,
      statusTypes: statusTypes,
      clientId: clientId,
      searchSubscriptionsStatusType: subscriptionStatus,
    },
    true
  );
}

//EXTRAAAA

export function postInvoice(values: any) {
  return postRequest<InvoicePostModel>(INVOICE_API, values, true);
}

export function getQuickViewInvoice(quoteId: number) {
  return getRequest<InvoiceListModel>(
    `${INVOICE_API}/quick-view-for/${quoteId}`,
    true
  );
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

export function getFactoringClients() {
  return getRequest<any>(GET_FACTORING_CLIENTS, true);
}

export function getNotificationCycles() {
  return getRequest<any>(GET_NOTIFICATION_CYCLES, true);
}

export function pickProduct(searchTerm: string, pageIndex: number) {
  return postRequest<any>(
    PICK_PRODUCT,
    {
      pageMax: 5,
      searchTerm: searchTerm,
      pageIndex: pageIndex,
    },
    true
  );
}

export function createCopy(invoiceId: number, copyAttachments: boolean) {
  return postRequest<GenericNumberModel>(
    CREATE_COPY,
    {
      invoiceId: invoiceId,
      copyAttachments: copyAttachments,
    },
    true
  );
}
export function createCredit(
  invoiceId: number,
  invoiceDate: string,
  actionType: number
) {
  return postRequest<GenericNumberModel>(
    CREATE_CREDIT,
    {
      invoiceId: invoiceId,
      invoiceDate: invoiceDate,
      actionType: actionType,
    },
    true
  );
}

export function sendEmail(values: any) {
  return postRequest<GenericBooleanModel>(SEND_EMAIL, values, true);
}

export function getInvoiceActivitiesById(id: number) {
  return getRequest<ActivitiesModel>(`${INVOICE_ACTIVITIES}/${id}`, true);
}

export function getInvoiceMutationsById(id: number) {
  return getRequest<MutationsModel>(`${INVOICE_MUTATIONS}/${id}`, true);
}

export function getInvoicePaymentsById(id: number) {
  return getRequest<PaymentsModel>(`${INVOICE_PAYMENTS}/${id}`, true);
}

export function deleteInvoiceList(id: number, keepAttachments: boolean) {
  return deleteRequest<DeleteResult>(
    INVOICE_API,
    { invoiceId: id, keepAttachments: keepAttachments },
    true
  );
}

export function removePayment(deleteModalId: number) {
  return deleteRequest<GenericBooleanModel>(
    `${REMOVE_PAYMENT}/${deleteModalId}`,
    {},
    true
  );
}

export function payOnline(invoiceId: number) {
  return postRequest<GenericStringModel>(
    `${PAY_ONLINE}/${invoiceId}`,
    {},
    true
  );
}

export function getAccountsForPayment() {
  return getRequest<AccountsForPaymentModel>(GET_ACCOUNTS_FOR_PAYMENT, true);
}

export function registerPayment(values: any) {
  return postRequest<GenericBooleanModel>(REGISTER_PAYMENT, values, true);
}

export function getAttachmentsById(invoiceId: number) {
  return getRequest<AttachmentsModel>(`${GET_ATTACHMENTS}/${invoiceId}`, true);
}

export function attachInvoiceFile(
  inboxItemId: number,
  fileId: number,
  invoiceId: number
) {
  return postRequest<GenericBooleanModel>(
    `${INVOICE_ATTACHMENT}/${invoiceId}`,
    {
      inboxItemId,
      fileId,
    },
    true
  );
}
//EXTRAaa
export function validateQuote(values: any) {
  return postRequest<GenericBooleanModel>(VALIDATE_QUOTE, values, true);
}

export function finalizeInvoice(
  invoiceId: number,
  dontSendRemindersOnlyTrackStatus: boolean,
  adjustInvoiceDateToToday: boolean
) {
  return postRequest<GenericBooleanModel>(
    FINALIZE_INVOICE,
    {
      invoiceId: invoiceId,
      adjustInvoiceDateToToday: adjustInvoiceDateToToday,
      dontSendRemindersOnlyTrackStatus: dontSendRemindersOnlyTrackStatus,
    },
    true
  );
}

export function getProductById(id: number) {
  return getRequest<any>(`${GET_PRODUCT_BY_ID}/${id}`, true);
}

export function getDefaultEmpty() {
  return getRequest<InvoiceListModel>(`${GET_DEFAULT_EMPTY}`, true);
}

export function getInvoiceById(editModalId: number) {
  return getRequest<InvoiceListModel>(`${INVOICE_API}/${editModalId}`, true);
}

export function getAdditionalDataForQuote(editModalId: number) {
  return getRequest<InvoiceListModel>(
    `${SEARCH_INVOICE_LIST}/item/${editModalId}`,
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
