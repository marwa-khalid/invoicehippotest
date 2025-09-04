const API_URL_V1 = import.meta.env.VITE_APP_INVOICEHIPPO_API_CORE_V1;

export const COST_API = `${API_URL_V1}/receipt`;
export const GET_DEFAULT_EMPTY = `${API_URL_V1}/receipt/default-empty`;
export const COST_ACTION_HISTORY = `${API_URL_V1}/report/activities-for-cost`;
export const COST_MUTATIONS = `${API_URL_V1}/report/mutations-for-cost`;
export const GET_ATTACHMENTS = `${API_URL_V1}/receipt/attachments-for`;
export const GET_COMPANY_TRADE_NAMES = `${API_URL_V1}/lists/company-tradenames`;
export const COST_ATTACHMENT = `${API_URL_V1}/inbox/attach-to-cost`;
export const MIN_MAX_YEAR = `${API_URL_V1}/lists/company/min-max-year`;
export const COST_MUTATION = `${API_URL_V1}/bank-mutation-route/as-receipt`;
