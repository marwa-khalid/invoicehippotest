import {
  FinancialAccountsModel,
  FinancialAccountByIdModel,
  PrivateLedgersModel,
  VatTypesForLedgerModel,
} from "./_models";

import {
  getRequest,
  postRequest,
  deleteRequest,
} from "../../../../auth/core/_apiservice";
import {
  SEARCH_FINANCIAL_ACCOUNTS,
  GET_LEDGDER_FOR_FILTER,
  POST_FINANCIAL_ACCOUNT,
  GET_VAT_FOR_LEDGER,
  GET_PRIVATE_LEDGDER,
  GET_LEDGDER_FOR_FINANCIAL,
  GET_FINANCIALACCOUNT_BY_ID,
} from "./constants";
import { LedgerAccountsModel, LedgerAccountsForFilterModel } from "./_models";

interface DeleteResult extends Partial<LedgerAccountsModel> {}

export function getFinancialAccounts(searchTerm: string, pageIndex: number) {
  return postRequest<FinancialAccountsModel>(
    SEARCH_FINANCIAL_ACCOUNTS,
    {
      pageMax: 25,
      pageIndex: searchTerm ? 1 : pageIndex,
      searchTerm: searchTerm,
    },
    true
  );
}

export function getFinancialAccountById(editModalId: number) {
  return getRequest<FinancialAccountByIdModel>(
    `${GET_FINANCIALACCOUNT_BY_ID}/${editModalId}`,
    true
  );
}

export function getLedgerForFinancial(id: number) {
  return getRequest<PrivateLedgersModel>(
    `${GET_LEDGDER_FOR_FINANCIAL}/${id}`,
    true
  );
}

export function postFinancialAccount(
  id: number,
  accountName: string,
  accountNumber: string,
  ledgerAccountId: number,
  bankConnectMinImportDate: string,
  autoCreateLedgerAccount: boolean,
  accountType: number,
  bankAccountCompanyType: number,
  afterSaveModel: {
    ledgerAccountDisplayName: string;
  },
  bankConnectInfo: {
    isConnected: boolean;
    isActive: boolean;
    accessExpirtationDate: string;
    lastSyncRequestDate: string;
  }
) {
  return postRequest<FinancialAccountsModel>(
    POST_FINANCIAL_ACCOUNT,
    {
      id: id,
      accountName: accountName,
      accountNumber: accountNumber,
      ledgerAccountId: ledgerAccountId,
      bankConnectMinImportDate: bankConnectMinImportDate,
      accountType: accountType,
      autoCreateLedgerAccount: autoCreateLedgerAccount,
      bankAccountCompanyType: bankAccountCompanyType,
      afterSaveModel: afterSaveModel,
      bankConnectInfo: bankConnectInfo,
    },
    true
  );
}

//extraaaaaa

export function getLedgerAccountsForFilter() {
  return getRequest<LedgerAccountsForFilterModel>(GET_LEDGDER_FOR_FILTER, true);
}

export function getPrivateLedgerAccounts() {
  return getRequest<PrivateLedgersModel>(GET_PRIVATE_LEDGDER, true);
}

export function getVatTypesForLedger() {
  return getRequest<VatTypesForLedgerModel>(GET_VAT_FOR_LEDGER, true);
}

export function deleteLedgerAccount(id: number) {
  return deleteRequest<DeleteResult>(POST_FINANCIAL_ACCOUNT, [id], true);
}
