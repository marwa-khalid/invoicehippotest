const API_URL_V1 = import.meta.env.VITE_APP_INVOICEHIPPO_API_CORE_V1;

export const USERS_API = `${API_URL_V1}/admin/user`;
export const GET_COMPANIES = `${API_URL_V1}/lists/companies/for/users`;
export const GET_USER_TYPES = `${API_URL_V1}/lists/user-types/for/users`;
export const GET_LANGUAGES = `${API_URL_V1}/localization/available-languages`;
export const CHECK_CREATE_USAGE = `${API_URL_V1}/usage/check-can-create/user`;
