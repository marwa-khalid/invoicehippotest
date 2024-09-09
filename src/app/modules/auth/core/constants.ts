const API_URL_V1 = import.meta.env.VITE_APP_INVOICEHIPPO_API_CORE_V1;

export const LOGIN_URL = `${API_URL_V1}/authorization/authorize`;
export const REQUEST_PASSWORD_URL = `${API_URL_V1}/profile/password/reset/request`;
export const GET_PROFILE_INFO = `${API_URL_V1}/profile/info`;
export const REDIRECT_URL_V1 = "https://dev.invoicehippo.nl/reset";
export const CHANGE_PASSWORD = `${API_URL_V1}/profile/password/reset/change`;
export const SEPA_CONFIRM = `${API_URL_V1}/registration/sepa/confirm`;
