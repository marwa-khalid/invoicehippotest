import {
  AccountsModel,
  BankTransactionsModel,
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
  CHANGE_STATUS,
  DELETE_TRANSACTION,
  GET_ACCOUNTS_LIST,
  GET_COUNT,
  GET_TRANSACTIONS,
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

export function getBankTransactions(
  pageIndex: number,
  searchTerm: string,
  processStatusTypes: any[],
  dateRange: any,
  clientId: number | null,
  financialAccountId: number,
  includingAttachmentsType: number | null,
  balanceType: number | null
) {
  const payload: any = {
    pageMax: 25,
    pageIndex,
  };

  if (searchTerm) payload.searchTerm = searchTerm;
  if (processStatusTypes && processStatusTypes.length > 0)
    payload.processStatusTypes = processStatusTypes;
  if (dateRange) payload.dateRange = dateRange;
  if (clientId) payload.clientId = clientId;
  if (financialAccountId) payload.financialAccountId = financialAccountId;
  if (includingAttachmentsType)
    payload.includingAttachmentsType = includingAttachmentsType;
  if (balanceType) payload.balanceType = balanceType;

  return postRequest<BankTransactionsModel>(
    `${GET_TRANSACTIONS}`,
    payload,
    true
  );
}
export function getTransferOptionsCost(costId: number, mutationId: number) {
  return getRequest<any>(
    `${GET_TRANSFER_OPTIONS_COST}/${costId}/for-mutation/${mutationId}`,
    true
  );
}

export function getTransferOptionsInvoice(
  invoiceId: number,
  mutationId: number
) {
  return getRequest<any>(
    `${GET_TRANSFER_OPTIONS_INVOICE}/${invoiceId}/for-mutation/${mutationId}`,
    true
  );
}
export function getAccountsList() {
  return getRequest<AccountsModel>(GET_ACCOUNTS_LIST, true);
}

export function deleteTransaction(id: number) {
  return deleteRequest<RestoreOrDeleteModel>(
    `${DELETE_TRANSACTION}/${id}`,
    {},
    true
  );
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
