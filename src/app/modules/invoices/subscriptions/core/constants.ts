const API_URL_V1 = import.meta.env.VITE_APP_INVOICEHIPPO_API_CORE_V1;
const API_HANDLE_V1 = import.meta.env.VITE_APP_INVOICEHIPPO_API_HANDLE_V1;

export const SEARCH_INVOICE_LIST = `${API_URL_V1}/invoice/search`;
export const INVOICE_API = `${API_URL_V1}/invoice`;
export const GET_NOTIFICATION_CYCLES = `${API_URL_V1}/lists/notification-cycle-types/for/invoices`;
export const GET_COMPANY_TRADE_NAMES = `${API_URL_V1}/lists/company-tradenames`;
export const GET_FACTORING_CLIENTS = `${API_URL_V1}/lists/factoring-clients`;
export const CREATE_COPY = `${API_URL_V1}/invoice/create-copy`;
export const CREATE_CREDIT = `${API_URL_V1}/invoice/create-credit`;
export const SEND_EMAIL = `${API_URL_V1}/invoice/send-email`;
export const INVOICE_ACTIVITIES = `${API_URL_V1}/report/activities-for-invoice`;
export const INVOICE_MUTATIONS = `${API_URL_V1}/report/mutations-for-invoice`;
export const INVOICE_PAYMENTS = `${API_URL_V1}/invoice/payments-for`;
export const REMOVE_PAYMENT = `${API_URL_V1}/invoice/remove-payment`;
export const FINALIZE_INVOICE = `${API_URL_V1}/invoice/finalize`;
export const GET_DEFAULT_EMPTY = `${API_URL_V1}/invoice/default-empty`;
export const PAY_ONLINE = `${API_HANDLE_V1}/payments/create-for/invoice`;
export const GET_ACCOUNTS_FOR_PAYMENT = `${API_URL_V1}/lists/financial-accounts/for/payments`;
export const REGISTER_PAYMENT = `${API_URL_V1}/invoice/register-payment`;
export const GET_ATTACHMENTS = `${API_URL_V1}/invoice/attachments-for`;
export const INVOICE_ATTACHMENT = `${API_URL_V1}/inbox/attach-to-invoice`;

//extraaa
export const PICK_PRODUCT = `${API_URL_V1}/product/search`;
export const GET_PRODUCT_BY_ID = `${API_URL_V1}/product`;
export const GET_UNIT_TYPES = `${API_URL_V1}/lists/unit-types/for/products`;
export const GET_LEDGERS = `${API_URL_V1}/lists/ledger-accounts/for/sale`;
export const GET_VATS = `${API_URL_V1}/lists/vat-types/for/sales`;
export const GET_DISCOUNT_TYPES = `${API_URL_V1}/lists/discount-types/for/products`;

export const GET_CONTACTS = `${API_URL_V1}/client/contact`;
export const UPLOAD_ATTACHMENTS = `${API_HANDLE_V1}/upload/attachment-for-inbox`;
export const INBOX_SEARCH = `${API_URL_V1}/inbox/search`;
export const MIN_MAX_YEAR = `${API_URL_V1}/lists/company/min-max-year`;
export const VALIDATE_QUOTE = `${API_URL_V1}/invoice/validate`;
