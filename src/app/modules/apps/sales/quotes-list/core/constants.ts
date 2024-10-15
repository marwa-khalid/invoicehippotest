const API_URL_V1 = import.meta.env.VITE_APP_INVOICEHIPPO_API_CORE_V1;
const API_HANDLE_V1 = import.meta.env.VITE_APP_INVOICEHIPPO_API_HANDLE_V1;
export const SEARCH_QUOTE_LIST = `${API_URL_V1}/quote/search`;
export const PICK_PRODUCT = `${API_URL_V1}/product/search`;
export const GET_PRODUCT_BY_ID = `${API_URL_V1}/product`;
export const QUOTE_API = `${API_URL_V1}/quote`;
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
//Extra

export const GET_LEDGDER_FOR_FINANCIAL = `${API_URL_V1}/lists/ledger-accounts/for/financial-accounts`;
export const POST_FINANCIAL_ACCOUNT = `${API_URL_V1}/admin/financialaccount`;
export const SEARCH_FINANCIAL_ACCOUNTS = `${API_URL_V1}/admin/financialaccount/search`;
export const GET_FINANCIAL_INSTITUTIONS = `${API_URL_V1}/admin/financialaccount/automation/nordigen/financial-institutions`;
export const POST_ACCOUNT_AUTOMATION = `${API_URL_V1}/admin/financialaccount/automation/nordigen/consent/request`;
export const UNLINK_ACCOUNT = `${API_URL_V1}/admin/financialaccount/automation/remove-consent`;
