const API_URL_V1 = import.meta.env.VITE_APP_INVOICEHIPPO_API_CORE_V1;
const API_HANDLE_V1 = import.meta.env.VITE_APP_INVOICEHIPPO_API_HANDLE_V1;

export const SEARCH_INBOX_LIST = `${API_URL_V1}/inbox/search`;
export const SEARCH_INBOX_ARCHIVE_LIST = `${API_URL_V1}/inbox/search-archive`;
export const INBOX_ARCHIVE_TYPE_LIST = `${API_URL_V1}/inbox/get-tree-model`;
export const INBOX_API = `${API_URL_V1}/inbox`;
export const INBOX_ARCHIVE = `${API_URL_V1}/inbox/archive`;
export const INBOX_COST_LINK = `${API_URL_V1}/inbox/attach-to-cost`;
export const INBOX_BOOKING_LINK = `${API_URL_V1}/inbox/attach-to-booking`;
export const INBOX_INVOICE_LINK = `${API_URL_V1}/inbox/attach-to-invoice`;
export const INBOX_UNARCHIVE = `${API_URL_V1}/inbox/un-archive`;
export const UPLOAD_ATTACHMENTS = `${API_HANDLE_V1}/upload/attachment-for-inbox`;
export const INBOX_SEARCH = `${API_URL_V1}/inbox/search`;
export const MIN_MAX_YEAR = `${API_URL_V1}/lists/company/min-max-year`;

