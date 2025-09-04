import { UserModel, CompaniesModel, UserModelById } from "./_models";

import {
  getRequest,
  postRequest,
  deleteRequest,
} from "../../../auth/core/_apiservice";
import {
  USERS_API,
  GET_COMPANIES,
  GET_USER_TYPES,
  GET_LANGUAGES,
  CHECK_CREATE_USAGE,
} from "./constants";

interface DeleteResult extends Partial<UserModel> {}

export function getUsers(searchTerm: string, pageIndex: number) {
  return postRequest<UserModel>(
    `${USERS_API}/search`,
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

export function checkUsage() {
  return getRequest<Boolean>(CHECK_CREATE_USAGE, true);
}

export function getUserTypes() {
  return getRequest<CompaniesModel>(GET_USER_TYPES, true);
}

// export function getLanguages() {
//   return getRequest<LanguagesModel>(GET_LANGUAGES, true);
// }
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
  requestingUserProfileId: number,
  requestingUserPassword: string,
  sendInvitationForNewUser: boolean,
  generatePasswordForNewUser: boolean,
  accountantBeconNumber: string,
  accountantNotificationEmailAddress: string
) {
  return postRequest<UserModelById>(
    USERS_API,
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
      requestingUserProfileId: requestingUserProfileId,
      requestingUserPassword: requestingUserPassword,
      sendInvitationForNewUser: sendInvitationForNewUser,
      generatePasswordForNewUser: generatePasswordForNewUser,
      accountantBeconNumber: accountantBeconNumber,
      accountantNotificationEmailAddress: accountantNotificationEmailAddress,
    },
    true
  );
}

export function getUserById(editModalId: number) {
  return getRequest<UserModelById>(`${USERS_API}/${editModalId}`, true);
}

export function deleteUser(id: number) {
  return deleteRequest<DeleteResult>(USERS_API, [id], true);
}
