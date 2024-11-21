const API_URL_V1 = import.meta.env.VITE_APP_INVOICEHIPPO_API_CORE_V1;

export const SEARCH_VAT_TYPES = `${API_URL_V1}/admin/vat-type/search`;
export const POST_VAT_TYPES = `${API_URL_V1}/admin/vat-type`;
export const GET_VAT_BY_ID = `${API_URL_V1}/admin/vat-type`;
export const GET_LEDGDER_FOR_VAT = `${API_URL_V1}/lists/ledger-accounts/for/vat`;
export const REQUEST_PASSWORD_URL = `${API_URL_V1}/profile/password/reset/request`;
export const GET_PROFILE_INFO = `${API_URL_V1}/profile/info`;
export const REDIRECT_URL_V1 = "https://dev.invoicehippo.nl/reset";
export const CHANGE_PASSWORD = `${API_URL_V1}/profile/password/reset/change`;
export const SEPA_CONFIRM = `${API_URL_V1}/registration/sepa/confirm`;
