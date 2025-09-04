const API_URL_V1 = import.meta.env.VITE_APP_INVOICEHIPPO_API_CORE_V1;

export const COMPANY_DATA = `${API_URL_V1}/admin/company`;
export const COMPANY_SETTINGS = `${API_URL_V1}/admin/company/settings`;
export const TRADENAMES = `${API_URL_V1}/admin/company/trade-name`;
export const GET_USAGE_QUOTAS = `${API_URL_V1}/admin/company/summarized-usage-quotas`;
export const POST_CLIENT_PRODUCTS = `${API_URL_V1}/admin/company/settings-for-products-and-clients`;
