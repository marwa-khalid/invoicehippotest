import {
  AccountsModel,
  BookingGetRuleModel,
  BookingRuleModel,
  CounterPartyModel,
  GetCountModel,
  RestoreOrDeleteModel,
} from "./_models";

import {
  getRequest,
  postRequest,
  deleteRequest,
} from "../../../../../auth/core/_apiservice";
import {
  AUTO_PROCESS,
  BOOKING_RULE_API,
  CHANGE_STATUS,
  DELETE_TRANSACTION,
  GET_ACCOUNTS_LIST,
  GET_COUNT,
  GET_COUNTERPARTY_ACCOUNTS,
  GET_TRANSFER_OPTIONS_COST,
  GET_TRANSFER_OPTIONS_INVOICE,
  PREPARE_FOR_BOOKING,
  PREPARE_FOR_RECEIPT,
  REGISTER_PAYMENT_COST,
  REGISTER_PAYMENT_INVOICE,
  RESTORE_ROUTED,
  RESTORE_TRANSACTION,
} from "./constants";
import { BookingPostModel } from "../../../../bookings/components/core/_models";
import { CostPostModel } from "../../../../costs/components/core/_models";
import { GenericBooleanModel } from "../../../../../invoices/overview/core/_models";

export function getBookingRules(
  pageIndex: number,
  searchTerm: string,
  clientId: number | null,
  financialAccountId: number,
  balanceType: number | null
) {
  const payload: any = {
    pageMax: 25,
    pageIndex,
  };

  if (searchTerm) payload.searchTerm = searchTerm;
  if (clientId) payload.clientId = clientId;
  if (financialAccountId) payload.financialAccountId = financialAccountId;
  if (balanceType) payload.balanceType = balanceType;
  payload.ledgerAccountId = 0;
  payload.financialImportAccountHolderId = 0;
  return postRequest<BookingRuleModel>(
    `${BOOKING_RULE_API}/search`,
    payload,
    true
  );
}
export function getRuleById(ruleId: number) {
  return getRequest<BookingGetRuleModel>(`${BOOKING_RULE_API}/${ruleId}`, true);
}

export function deleteBookingRule(id: number) {
  return deleteRequest<GenericBooleanModel>(BOOKING_RULE_API, [id], true);
}
export function postBookingRule(values: any) {
  return postRequest<BookingRuleModel>(BOOKING_RULE_API, values, true);
}
export function copyBookingRule(id: number) {
  return postRequest<BookingGetRuleModel>(
    `${BOOKING_RULE_API}/copy/${id}`,
    {},
    true
  );
}
export function getCounterPartyAccounts() {
  return getRequest<CounterPartyModel>(GET_COUNTERPARTY_ACCOUNTS, true);
}

//extraaa
export function getAccountsList() {
  return getRequest<AccountsModel>(GET_ACCOUNTS_LIST, true);
}
export function restoreTransaction(id: number) {
  return postRequest<RestoreOrDeleteModel>(
    `${RESTORE_TRANSACTION}/${id}`,
    {},
    true
  );
}
export function changeStatus(id: number, status: boolean) {
  return postRequest<RestoreOrDeleteModel>(
    `${CHANGE_STATUS}/${id}/${status}`,
    {},
    true
  );
}
export function enableAutoProcessing(
  companyId: number | undefined,
  financialAccountId: number | null
) {
  return postRequest<RestoreOrDeleteModel>(
    AUTO_PROCESS,
    { companyId, financialAccountId, selectedBankMutationIdList: [] },
    true
  );
}

export function callAutoRouteCount() {
  return getRequest<GetCountModel>(GET_COUNT, true);
}

export function restoreRouted(
  bankMutationId: number,
  deleteBankMutation: boolean,
  restoreAttachments: boolean,
  deleteRelatedBooking: boolean
) {
  return deleteRequest<RestoreOrDeleteModel>(
    RESTORE_ROUTED,
    {
      bankMutationId: bankMutationId,
      deleteRelatedBooking: deleteRelatedBooking,
      deleteBankMutation: deleteBankMutation,
      restoreAttachments: restoreAttachments,
    },
    true
  );
}
export function getBookingForMutation(mutationId: number) {
  return getRequest<BookingPostModel>(
    `${PREPARE_FOR_BOOKING}/${mutationId}`,
    true
  );
}
export function getCostForMutation(mutationId: number) {
  return getRequest<CostPostModel>(
    `${PREPARE_FOR_RECEIPT}/${mutationId}`,
    true
  );
}
export function registerPaymentCost(values: any) {
  return postRequest<GenericBooleanModel>(REGISTER_PAYMENT_COST, values, true);
}

export function registerPaymentInvoice(values: any) {
  return postRequest<GenericBooleanModel>(
    REGISTER_PAYMENT_INVOICE,
    values,
    true
  );
}
