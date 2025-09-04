const API_URL_V1 = import.meta.env.VITE_APP_INVOICEHIPPO_API_CORE_V1;
export const BOOKING_RULE_API = `${API_URL_V1}/booking-rule`;
export const GET_COUNTERPARTY_ACCOUNTS = `${API_URL_V1}/lists/financial-counterparty-accounts`;
//EXTRAAAAA
export const GET_TRANSACTIONS = `${API_URL_V1}/bank-mutation/search`;
export const GET_ACCOUNTS_LIST = `${API_URL_V1}/lists/financial-accounts`;
export const GET_TRANSFER_OPTIONS_COST = `${API_URL_V1}/bank-mutation/build-transferoptions-to-cost`;
export const GET_TRANSFER_OPTIONS_INVOICE = `${API_URL_V1}/bank-mutation/build-transferoptions-to-invoice`;
export const DELETE_TRANSACTION = `${API_URL_V1}/bank-mutation/action/delete`;
export const RESTORE_TRANSACTION = `${API_URL_V1}/bank-mutation/action/restore`;
export const CHANGE_STATUS = `${API_URL_V1}/bank-mutation/action/exclude-from-autoprocessing`;
export const AUTO_PROCESS = `${API_URL_V1}/bank-mutation-route/auto-process`;
export const GET_COUNT = `${API_URL_V1}/bank-mutation/auto-route-count`;
export const RESTORE_ROUTED = `${API_URL_V1}/bank-mutation-route/restore-routed`;
export const PREPARE_FOR_BOOKING = `${API_URL_V1}/bank-mutation-route/prepare-for-booking`;
export const PREPARE_FOR_RECEIPT = `${API_URL_V1}/bank-mutation-route/prepare-for-receipt`;
export const REGISTER_PAYMENT_COST = `${API_URL_V1}/receipt/register-payment`;
export const REGISTER_PAYMENT_INVOICE = `${API_URL_V1}/invoice/register-payment`;
