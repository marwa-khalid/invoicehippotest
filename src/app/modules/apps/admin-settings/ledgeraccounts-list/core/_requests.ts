import {
  LedgerAccountByIdModel,
  PrivateLedgersModel,
  VatTypesForLedgerModel,
} from "./_models";

import {
  getRequest,
  postRequest,
  deleteRequest,
} from "../../../../auth/core/_apiservice";
import {
  SEARCH_LEDGER_ACCOUNTS,
  GET_LEDGDER_FOR_FILTER,
  POST_LEDGER_ACCOUNT,
  GET_VAT_FOR_LEDGER,
  GET_PRIVATE_LEDGDER,
  GET_LEDGDER_FOR_REPORTING,
  GET_LEDGER_BY_ID,
} from "./constants";
import { LedgerAccountsModel, LedgerAccountsForFilterModel } from "./_models";

interface DeleteResult extends Partial<LedgerAccountsModel> {}

export function getLedgerAccounts(
  searchTerm: string,
  ledgerTypeFilter: number,
  bearingTypeFilter: number,
  pageIndex: number
) {
  return postRequest<LedgerAccountsModel>(
    SEARCH_LEDGER_ACCOUNTS,
    {
      pageMax: 25,
      pageIndex: searchTerm ? 1 : pageIndex,
      searchTerm: searchTerm,
      ledgerTypeFilter: ledgerTypeFilter,
      bearingTypeFilter: bearingTypeFilter,
    },
    true
  );
}

export function getLedgerAccountsForFilter() {
  return getRequest<LedgerAccountsForFilterModel>(GET_LEDGDER_FOR_FILTER, true);
}

export function getPrivateLedgerAccounts() {
  return getRequest<PrivateLedgersModel>(GET_PRIVATE_LEDGDER, true);
}

export function getReportingq5b() {
  return getRequest<PrivateLedgersModel>(GET_LEDGDER_FOR_REPORTING, true);
}

export function getVatTypesForLedger() {
  return getRequest<VatTypesForLedgerModel>(GET_VAT_FOR_LEDGER, true);
}

export function postLedgerAccount(
  id: number,
  title: string,
  code: string,
  defaultTaxTypeId: number,
  bearingType: number,
  reportReferenceType1: number,
  reportReferenceType2LegderAccountId: number,
  disableManualInput: boolean,
  taxDeductibleSettings: {
    isNotFullyTaxDeductible: boolean;
    taxDeductiblePercentage: number;
    deductiblePrivateLedgerAccountId: number;
  }
) {
  return postRequest<LedgerAccountsModel>(
    POST_LEDGER_ACCOUNT,
    {
      id: id,
      title: title,
      code: code,
      defaultTaxTypeId: defaultTaxTypeId,
      bearingType: bearingType,
      reportReferenceType1: reportReferenceType1,
      reportReferenceType2LegderAccountId: reportReferenceType2LegderAccountId,
      disableManualInput: disableManualInput,
      taxDeductibleSettings: {
        isNotFullyTaxDeductible: taxDeductibleSettings.isNotFullyTaxDeductible,
        taxDeductiblePercentage: taxDeductibleSettings.taxDeductiblePercentage,
        deductiblePrivateLedgerAccountId:
          taxDeductibleSettings.deductiblePrivateLedgerAccountId,
      },
    },
    true
  );
}

export function getLedgerById(editModalId: number) {
  return getRequest<LedgerAccountByIdModel>(
    `${GET_LEDGER_BY_ID}/${editModalId}`,
    true
  );
}

export function deleteLedgerAccount(id: number) {
  return deleteRequest<DeleteResult>(POST_LEDGER_ACCOUNT, [id], true);
}
