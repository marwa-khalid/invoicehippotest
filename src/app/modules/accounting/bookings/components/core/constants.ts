const API_URL_V1 = import.meta.env.VITE_APP_INVOICEHIPPO_API_CORE_V1;

export const BOOKING_API = `${API_URL_V1}/booking`;
export const GET_ACTION_HISTORY = `${API_URL_V1}/report/activities-for-booking`;
export const BOOKING_MUTATIONS = `${API_URL_V1}/report/mutations-for-booking`;
export const GET_DEFAULT_EMPTY = `${API_URL_V1}/booking/default-empty`;
export const GET_ATTACHMENTS = `${API_URL_V1}/booking/attachments-for`;
export const MIN_MAX_YEAR = `${API_URL_V1}/lists/company/min-max-year`;
export const GET_COMPANY_TRADE_NAMES = `${API_URL_V1}/lists/company-tradenames`;
export const BOOKING_ATTACHMENT = `${API_URL_V1}/inbox/attach-to-booking`;
export const BOOKING_MUTATION = `${API_URL_V1}/bank-mutation-route/as-booking`;
