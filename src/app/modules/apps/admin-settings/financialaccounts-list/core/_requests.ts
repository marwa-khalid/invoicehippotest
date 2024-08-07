import {
  FinancialAccountsModel,
  FinancialAccountByIdModel,
  PrivateLedgersModel,
  FinancialInstitutionsResult,
  FinancialInstitutionsModel,
  AccountAutomationModel,
} from "./_models";

import {
  getRequest,
  postRequest,
  deleteRequest,
} from "../../../../auth/core/_apiservice";
import {
  SEARCH_FINANCIAL_ACCOUNTS,
  POST_FINANCIAL_ACCOUNT,
  GET_LEDGDER_FOR_FINANCIAL,
  GET_FINANCIALACCOUNT_BY_ID,
  GET_FINANCIAL_INSTITUTIONS,
  POST_ACCOUNT_AUTOMATION,
  UNLINK_ACCOUNT,
} from "./constants";

interface DeleteResult extends Partial<FinancialAccountsModel> {}

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
  bankConnectMinImportDate: any,
  autoCreateLedgerAccount: boolean,
  accountType: number,
  bankAccountCompanyType: number,
  afterSaveModel: {
    ledgerAccountDisplayName: string;
  },
  bankConnectInfo: {
    isConnected: boolean;
    isActive: boolean;
    accessExpirtationDate: any;
    lastSyncRequestDate: any;
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

export function deleteFinancialAccount(id: number) {
  return deleteRequest<DeleteResult>(POST_FINANCIAL_ACCOUNT, [id], true);
}

export function getFinancialInstitutions(countryType: number) {
  return getRequest<FinancialInstitutionsModel>(
    `${GET_FINANCIAL_INSTITUTIONS}/${countryType}`,
    true
  );
}

export function postAccounAutomation(
  companyId: number,
  importDateMarker: string,
  optionalFinancialInstitutionId: string,
  redirectCommand: {
    successUrl: string;
    oopsUrl: string;
  }
) {
  return postRequest<AccountAutomationModel>(
    `${POST_ACCOUNT_AUTOMATION}`,
    {
      companyId: companyId,
      importDateMarker: importDateMarker,
      optionalFinancialInstitutionId: optionalFinancialInstitutionId,
      redirectCommand: redirectCommand,
    },
    true
  );
}

export function deleteAutomation(id: number) {
  return deleteRequest<Boolean>(`${UNLINK_ACCOUNT}/${id}`, [], true);
}
