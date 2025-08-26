const API_URL_V1 = import.meta.env.VITE_APP_INVOICEHIPPO_API_CORE_V1;

export const SUBSCRIBER = `${API_URL_V1}/admin/subscriber`;
export const TAKEOVER = `${API_URL_V1}/authorization/authorize/switch-to`;
export const GET_USAGE_QUOTAS = `${API_URL_V1}/admin/subscriber/summarized-usage-quotas`;
export const PROLONG_LICENSE = `${API_URL_V1}/license/prolong`;
export const BILLING_DATA = `${API_URL_V1}/invoice/search/my-invoices`;
