const API_URL_V1 = import.meta.env.VITE_APP_INVOICEHIPPO_API_CORE_V1;

export const LOGIN_URL = `${API_URL_V1}/authorization/authorize`;
export const AUTHORIZE_ANONYMOUS = `${API_URL_V1}/authorization/authorize-anonymous`;
export const REQUEST_PASSWORD_URL = `${API_URL_V1}/profile/password/reset/request`;
export const GET_PROFILE_INFO = `${API_URL_V1}/profile/info`;
export const REDIRECT_URL_V1 = "https://dev.invoicehippo.nl/reset";
export const CHANGE_PASSWORD = `${API_URL_V1}/profile/password/reset/change`;
export const CHANGE_PROFILE_PASSWORD = `${API_URL_V1}/admin/user/password/change`;
export const SEPA_CONFIRM = `${API_URL_V1}/registration/sepa/confirm`;
export const SWITCH_COMPANY = `${API_URL_V1}/authorization/authorize/switch-to`;
export const STOP_TAKEOVER = `${API_URL_V1}/authorization/authorize/switch-stop`;
export const UPDATE_LANGUAGE = `${API_URL_V1}/profile/update/language`;
export const UPDATE_THEME = `${API_URL_V1}/profile/update/theme-mode`;
