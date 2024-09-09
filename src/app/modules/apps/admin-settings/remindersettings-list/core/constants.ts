const API_URL_V1 = import.meta.env.VITE_APP_INVOICEHIPPO_API_CORE_V1;

export const NOTIFICATION_CYCLES = `${API_URL_V1}/admin/notification-cycle-type`;
//Extra
export const GET_LEDGER_BY_ID = `${API_URL_V1}/admin/ledgeraccount`;
export const SEARCH_LEDGER_ACCOUNTS = `${API_URL_V1}/admin/ledgeraccount/search`;
export const GET_LEDGDER_FOR_FILTER = `${API_URL_V1}/lists/ledger-accounts`;
export const GET_VAT_FOR_LEDGER = `${API_URL_V1}/lists/vat-types`;
export const GET_PRIVATE_LEDGDER = `${API_URL_V1}/lists/ledger-accounts/for/private`;
export const GET_LEDGDER_FOR_REPORTING = `${API_URL_V1}/lists/ledger-accounts/for/reporting-q5b`;
export const POST_LEDGER_ACCOUNT = `${API_URL_V1}/admin/ledgeraccount`;
