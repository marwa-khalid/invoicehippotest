const API_URL_V1 = import.meta.env.VITE_APP_INVOICEHIPPO_API_CORE_V1;

export const GET_CLIENTS = `${API_URL_V1}/client/search`;
export const GET_DEFAULT_EMPTY = `${API_URL_V1}/client/default-empty`;
export const POST_CLIENT = `${API_URL_V1}/client`;
export const POST_CONTACT = `${API_URL_V1}/client/contact`;
export const GET_CONTACT_BY_ID = `${API_URL_V1}/client/contact-list`;
export const GET_LEDGDER_FOR_CLIENT = `${API_URL_V1}/lists/ledger-accounts/for/sale`;
export const GET_VAT_FOR_CLIENT = `${API_URL_V1}/lists/vat-types`;
export const CHAIMBER_SEARCH = `${API_URL_V1}/chaimber-of-commerce/search`;
export const GET_CHAIMBER_INITIAL_DATA = `${API_URL_V1}/chaimber-of-commerce/detail`;
