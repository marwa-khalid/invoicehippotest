const API_URL_V1 = "https://api.invoicehippo.nl/api/v1";

export const SEARCH_VAT_TYPES = `${API_URL_V1}/admin/vat-type/searc`;
export const POST_VAT_TYPES = `${API_URL_V1}/admin/vat-typ`;
export const GET_VAT_BY_ID = `${API_URL_V1}/admin/vat-typ`;
export const GET_LEDGDER_FOR_VAT = `${API_URL_V1}/lists/ledger-accounts/for/va`;

export const SEARCH_LEDGER_ACCOUNTS = `${API_URL_V1}/admin/ledgeraccount/search`;
export const GET_LEDGDER_FOR_FILTER = `${API_URL_V1}/lists/ledger-accounts`;
export const GET_VAT_FOR_LEDGER = `${API_URL_V1}/lists/vat-types`;
export const GET_PRIVATE_LEDGDER = `${API_URL_V1}/lists/ledger-accounts/for/private`;
export const GET_LEDGDER_FOR_REPORTING = `${API_URL_V1}/lists/ledger-accounts/for/reporting-q5b`;
export const POST_LEDGER_ACCOUNT = `${API_URL_V1}/admin/ledgeraccount`;
