const API_URL_V1 = import.meta.env.VITE_APP_INVOICEHIPPO_API_CORE_V1;

export const GET_FINANCIALACCOUNT_BY_ID = `${API_URL_V1}/admin/financialaccount`;
export const GET_LEDGDER_FOR_FINANCIAL = `${API_URL_V1}/lists/ledger-accounts/for/financial-accounts`;
export const POST_FINANCIAL_ACCOUNT = `${API_URL_V1}/admin/financialaccount`;
export const SEARCH_FINANCIAL_ACCOUNTS = `${API_URL_V1}/admin/financialaccount/search`;
export const GET_FINANCIAL_INSTITUTIONS = `${API_URL_V1}/admin/financialaccount/automation/nordigen/financial-institutions`;
export const POST_ACCOUNT_AUTOMATION = `${API_URL_V1}/admin/financialaccount/automation/nordigen/consent/request`;
export const UNLINK_ACCOUNT = `${API_URL_V1}/admin/financialaccount/automation/remove-consent`;
