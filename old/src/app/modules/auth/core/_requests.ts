import {
  AuthModel,
  UserModel,
  PasswordResetModel,
  SepaModel,
  SepaResult,
} from "./_models";
import { ICreateAccount } from "../../sepa/components/CreateAccountWizardHelper";
interface StoredValues extends Partial<ICreateAccount> {}

import {
  LOGIN_URL,
  REQUEST_PASSWORD_URL,
  GET_PROFILE_INFO,
  REDIRECT_URL_V1,
  CHANGE_PASSWORD,
  SEPA_CONFIRM,
  AUTHORIZE_ANONYMOUS,
  CHANGE_PROFILE_PASSWORD,
  SWITCH_COMPANY,
  UPDATE_LANGUAGE,
  UPDATE_THEME,
  STOP_TAKEOVER,
} from "./constants";
import { postRequest, getRequest, putRequest } from "./_apiservice";
import { GenericBooleanModel } from "../../invoices/overview/core/_models";
// Login request
export function login(
  userName: string,
  password: string,
  languageType?: number
) {
  return postRequest<AuthModel>(
    LOGIN_URL,
    {
      userName: userName,
      password,
      languageType: languageType,
      deviceType: 1,
      deviceId: "Windows",
    },
    false
  );
}

//authorize anonymous
export function authorizeAnonymous(values: any) {
  return postRequest<AuthModel>(
    AUTHORIZE_ANONYMOUS,
    {
      languageType: 2,
      deviceType: 1,
      deviceId: "Windows",
      accessCode: values.accessCode,
      oData: values.odata,
    },
    false
  );
}

//switch language
export function updateLanguage(languageType?: number, userProfileId?: number) {
  return putRequest<GenericBooleanModel>(
    `${UPDATE_LANGUAGE}/${userProfileId}/${languageType}`,
    true
  );
}

//switch theme
export function updateTheme(themeModeType: number, userProfileId?: number) {
  return putRequest<GenericBooleanModel>(
    `${UPDATE_THEME}/${userProfileId}/${themeModeType}`,
    true
  );
}
//switch company
export function switchCompany(subscriberId?: number, companyId?: number) {
  return postRequest<AuthModel>(
    `${SWITCH_COMPANY}/${subscriberId}/${companyId}`,
    {},
    true
  );
}
//switch off takeover
export function stopTakeOver() {
  return postRequest<AuthModel>(STOP_TAKEOVER, {}, true);
}
// Request password reset
export function requestResetLink(EmailAddress: string) {
  return postRequest<PasswordResetModel>(
    REQUEST_PASSWORD_URL,
    {
      EmailAddress,
      languageType: 2,
      customRedirectUrl: REDIRECT_URL_V1,
    },
    false
  );
}

//Check if UUID is valid
export function checkUUIDValidity(uuid: string | null) {
  return getRequest<PasswordResetModel>(`${CHANGE_PASSWORD}/${uuid}`, false);
}

export function changePassword(
  emailAddress: string,
  password: string,
  passwordVerification: string,
  passwordResetToken: string,
  languageType: number
) {
  return postRequest<Boolean>(
    CHANGE_PASSWORD,
    {
      languageType,
      emailAddress,
      password,
      passwordVerification,
      passwordResetToken,
    },
    false
  );
}

export function changePasswordForProfile(values: any) {
  return postRequest<Boolean>(CHANGE_PROFILE_PASSWORD, values, true);
}

// Get profile information
export function getProfileInfo() {
  return getRequest<UserModel>(GET_PROFILE_INFO, true);
}

export function checkSepaOdata(odata: string | null) {
  return getRequest<SepaModel>(`${SEPA_CONFIRM}?odata=${odata}`, false);
}

export function sepaRegisterConfirm(
  sepaResponse: SepaResult,
  formData: StoredValues,
  isConsentGiven: boolean
) {
  return postRequest<SepaModel>(
    SEPA_CONFIRM,
    {
      id: sepaResponse.id,
      taskId: sepaResponse.taskId,
      companyName: formData.companyName,
      emailAddress: formData.emailAddress,
      btwNumber: formData.btwnr,
      registrationNumber: sepaResponse.registrationNumber,
      ibanNumber: formData.ibanNumber,
      firstName: formData.firstName,
      betweenName: formData.betweenName,
      lastName: formData.lastName,
      isConsentGiven: true,
      isBusiness: sepaResponse.isBusiness,
      clientHasActiveSepaMandate: sepaResponse.clientHasActiveSepaMandate,
    },
    false
  );
}
