const API_URL_V1 = import.meta.env.VITE_APP_INVOICEHIPPO_API_CORE_V1;
const API_HANDLE_V1 = import.meta.env.VITE_APP_INVOICEHIPPO_API_HANDLE_V1;
export const SEARCH_INVOICE_LIST = `${API_URL_V1}/invoice/search`;
export const SEARCH_QUOTE_LIST = `${API_URL_V1}/quote/search`;

//extraaa
export const PICK_PRODUCT = `${API_URL_V1}/product/search`;
export const GET_PRODUCT_BY_ID = `${API_URL_V1}/product`;
export const QUOTE_API = `${API_URL_V1}/invoice`;
export const GET_UNIT_TYPES = `${API_URL_V1}/lists/unit-types/for/products`;
export const GET_LEDGERS = `${API_URL_V1}/lists/ledger-accounts/for/sale`;
export const GET_VATS = `${API_URL_V1}/lists/vat-types/for/sales`;
export const GET_DISCOUNT_TYPES = `${API_URL_V1}/lists/discount-types/for/products`;
export const GET_NOTIFICATION_CYCLES = `${API_URL_V1}/lists/notification-cycle-types/for/quotes`;
export const GET_COMPANY_TRADE_NAMES = `${API_URL_V1}/lists/company-tradenames`;
export const GET_DEFAULT_EMPTY = `${API_URL_V1}/quote/default-empty`;
export const GET_CONTACTS = `${API_URL_V1}/client/contact`;
export const UPLOAD_ATTACHMENTS = `${API_HANDLE_V1}/upload/attachment-for-inbox`;
export const INBOX_SEARCH = `${API_URL_V1}/inbox/search`;
export const MIN_MAX_YEAR = `${API_URL_V1}/lists/company/min-max-year`;
export const CREATE_COPY = `${API_URL_V1}/quote/create-copy`;
export const SEND_EMAIL = `${API_URL_V1}/quote/send-email`;
export const FINALIZE_QUOTE = `${API_URL_V1}/quote/finalize`;
export const VALIDATE_QUOTE = `${API_URL_V1}/quote/validate`;
export const ESTIMATION_ACTIVITIES = `${API_URL_V1}/report/activities-for-esitmation`;
