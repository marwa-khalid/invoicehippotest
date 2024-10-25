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
} from "./constants";
import { postRequest, getRequest } from "./_apiservice";
// Login request
export function login(userName: string, password: string) {
  return postRequest<AuthModel>(
    LOGIN_URL,
    {
      userName: userName,
      password,
      languageType: 2,
      deviceType: 1,
      deviceId: "Windows",
    },
    false
  );
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
