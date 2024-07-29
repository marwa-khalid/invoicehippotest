const API_URL_V1 = "https://api.invoicehippo.nl/api/v1";

export const SEARCH_VAT_TYPES = `${API_URL_V1}/admin/vat-type/searc`;
export const POST_VAT_TYPES = `${API_URL_V1}/admin/vat-typ`;
export const GET_FINANCIALACCOUNT_BY_ID = `${API_URL_V1}/admin/financialaccount`;
export const GET_LEDGDER_FOR_FINANCIAL = `${API_URL_V1}/lists/ledger-accounts/for/financial-accounts`;

export const GET_LEDGDER_FOR_VAT = `${API_URL_V1}/lists/ledger-accounts/for/va`;
export const SEARCH_FINANCIAL_ACCOUNTS = `${API_URL_V1}/admin/financialaccount/search`;
export const GET_LEDGDER_FOR_FILTER = `${API_URL_V1}/lists/ledger-accounts`;
export const GET_VAT_FOR_LEDGER = `${API_URL_V1}/lists/vat-types`;
export const GET_PRIVATE_LEDGDER = `${API_URL_V1}/lists/ledger-accounts/for/private`;

export const POST_LEDGER_ACCOUNT = `${API_URL_V1}/admin/ledgeraccount`;
