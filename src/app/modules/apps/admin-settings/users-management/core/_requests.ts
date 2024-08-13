import {
  FinancialAccountsModel,
  FinancialAccountByIdModel,
  PrivateLedgersModel,
  FinancialInstitutionsResult,
  FinancialInstitutionsModel,
  AccountAutomationModel,
  UserModel,
  CompaniesModel,
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
  GET_ALL_USERS,
  GET_COMPANIES,
  GET_USER_TYPES,
} from "./constants";

interface DeleteResult extends Partial<FinancialAccountsModel> {}

export function getUsers(searchTerm: string, pageIndex: number) {
  return postRequest<UserModel>(
    `${GET_ALL_USERS}/search`,
    {
      pageMax: 25,
      pageIndex: searchTerm ? 1 : pageIndex,
      searchTerm: searchTerm,
    },
    true
  );
}

export function getCompanies() {
  return getRequest<CompaniesModel>(GET_COMPANIES, true);
}

export function getUserTypes() {
  return getRequest<CompaniesModel>(GET_USER_TYPES, true);
}
export function postUser(
  id: number,
  genderType: number,
  userType: number,
  firstName: string,
  languageType: number,
  betweenName: string,
  lastName: string,
  loginEmailAddress: string,
  isActive: boolean,
  accessibleCompanies: {
    isDefault: boolean;
    companyId: number;
  }[],
  passwordSet: {
    password: string;
    passwordVerification: string;
  },
  requestingUserProfileIda: number,
  requestingUserPassword: string,
  sendInvitationForNewUser: boolean,
  generatePasswordForNewUser: boolean,
  accountantBeconNumber: string,
  accountantNotificationEmailAddress: string
) {
  return postRequest<FinancialAccountsModel>(
    POST_FINANCIAL_ACCOUNT,
    {
      id: id,
      genderType: genderType,
      userType: userType,
      firstName: firstName,
      languageType: languageType,
      betweenName: betweenName,
      lastName: lastName,
      loginEmailAddress: loginEmailAddress,
      isActive: isActive,
      accessibleCompanies: accessibleCompanies,
      passwordSet: passwordSet,
      requestingUserProfileIda: requestingUserProfileIda,
      requestingUserPassword: requestingUserPassword,
      sendInvitationForNewUser: sendInvitationForNewUser,
      generatePasswordForNewUser: generatePasswordForNewUser,
      accountantBeconNumber: accountantBeconNumber,
      accountantNotificationEmailAddress: accountantNotificationEmailAddress,
    },
    true
  );
}

//extraaaaaaaaaa

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
