const API_URL_V1 = "https://api.invoicehippo.nl/api/v1";

export const GET_FINANCIALACCOUNT_BY_ID = `${API_URL_V1}/admin/financialaccount`;
export const GET_LEDGDER_FOR_FINANCIAL = `${API_URL_V1}/lists/ledger-accounts/for/financial-accounts`;
export const POST_FINANCIAL_ACCOUNT = `${API_URL_V1}/admin/financialaccount`;
export const SEARCH_FINANCIAL_ACCOUNTS = `${API_URL_V1}/admin/financialaccount/search`;
export const GET_FINANCIAL_INSTITUTIONS = `${API_URL_V1}/admin/financialaccount/automation/nordigen/financial-institutions`;
export const POST_ACCOUNT_AUTOMATION = `${API_URL_V1}/admin/financialaccount/automation/nordigen/consent/request`;
export const UNLINK_ACCOUNT = `${API_URL_V1}/admin/financialaccount/automation/remove-consent`;

export const GET_ALL_USERS = `${API_URL_V1}/admin/user`;
export const GET_COMPANIES = `${API_URL_V1}/lists/companies/for/users`;
export const GET_USER_TYPES = `${API_URL_V1}/lists/user-types/for/users`;
