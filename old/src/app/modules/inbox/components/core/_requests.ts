import {
  InboxArchivePayload,
  InboxLinkPayload,
  InboxListModel,
} from "./_models";
import {
  getRequest,
  postRequest,
  deleteRequest,
} from "../../../auth/core/_apiservice";
import {
  SEARCH_INBOX_LIST,
  INBOX_API,
  UPLOAD_ATTACHMENTS,
  INBOX_SEARCH,
  MIN_MAX_YEAR,
  SEARCH_INBOX_ARCHIVE_LIST,
  INBOX_UNARCHIVE,
  INBOX_ARCHIVE,
  INBOX_ARCHIVE_TYPE_LIST,
  INBOX_COST_LINK,
  INBOX_BOOKING_LINK,
  INBOX_INVOICE_LINK,
} from "./constants";

interface DeleteResult extends Partial<InboxListModel> {}

export function getInboxes(
  searchTerm: string,
  pageIndex: number,
  dateRange: any,
  quoteStatusTypes: number
) {
  return postRequest<InboxListModel>(
    SEARCH_INBOX_LIST,
    {
      pageMax: 25,
      pageIndex: searchTerm ? 1 : pageIndex,
      searchTerm: searchTerm,
      dateRange: dateRange,
      statusTypes: quoteStatusTypes,
    },
    true
  );
}

export function getInboxArchive(
  searchTerm: string,
  pageIndex: number,
  dateRange: any,
  statusTypes: number
) {
  return postRequest<InboxListModel>(
    SEARCH_INBOX_ARCHIVE_LIST,
    {
      pageMax: 25,
      pageIndex: searchTerm ? 1 : pageIndex,
      searchTerm: searchTerm,
      dateRange: dateRange,
      archiveType: statusTypes,
    },
    true
  );
}

export function getInboxArchiveType() {
  return getRequest<any>(INBOX_ARCHIVE_TYPE_LIST, true);
}

export function archiveInbox(payload: InboxArchivePayload) {
  return postRequest(INBOX_ARCHIVE, payload, true);
}

export function costLinkInbox(payload: InboxLinkPayload, costid: number) {
  return postRequest(`${INBOX_COST_LINK}/${costid}`, payload, true);
}
export function bookingLinkInbox(payload: InboxLinkPayload, bookingId: number) {
  return postRequest(`${INBOX_BOOKING_LINK}/${bookingId}`, payload, true);
}

export function invoiceLinkInbox(payload: InboxLinkPayload, invoiceId: number) {
  return postRequest(`${INBOX_INVOICE_LINK}/${invoiceId}`, payload, true);
}

export function unArchiveInbox(payload: any) {
  return postRequest(INBOX_UNARCHIVE, payload, true);
}

export function deleteInboxList(id: number, keepAttachments: boolean) {
  return deleteRequest<DeleteResult>(
    INBOX_API,
    { inboxId: id, keepAttachments: keepAttachments },
    true
  );
}

export function getInboxById(editModalId: number) {
  return getRequest<InboxListModel>(`${INBOX_API}/${editModalId}`, true);
}

export function uploadAttachments(
  formData: FormData,
  archiveType: number,
  ocr: boolean
) {
  return postRequest<any>(
    `${UPLOAD_ATTACHMENTS}/${archiveType}/${ocr}`,
    formData,
    true
  );
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
