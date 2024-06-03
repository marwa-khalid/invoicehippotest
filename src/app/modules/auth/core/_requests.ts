import { AuthModel, UserModel ,PasswordResetModel} from "./_models";
import { LOGIN_URL,REQUEST_PASSWORD_URL, GET_PROFILE_INFO, REDIRECT_URL_V1,CHANGE_PASSWORD} from "./constants";
import apiRequest from "./_apiservice";

// Login request
export function login(email: string, password: string) {
  return apiRequest<AuthModel>(LOGIN_URL, {
    method: 'POST',
    data: {
      userName: email,
      password,
      languageType: 2,
      deviceType: 1,
      deviceId: "Windows",
    },
  });
}

// Request password reset
export function requestResetLink(EmailAddress: string) {
  return apiRequest<PasswordResetModel>(REQUEST_PASSWORD_URL, {
    method: 'POST',
    data: {
      EmailAddress,
      languageType: 2,
      customRedirectUrl: REDIRECT_URL_V1,
    },
  });
}

//Check if UUID is valid
export function checkUUIDValidity(uuid: string | null) {
  return apiRequest<PasswordResetModel>(`${CHANGE_PASSWORD}/${uuid}`, {
    method: 'GET',
  });
}

export function changePassword(emailAddress: string, password: string,passwordVerification: string,passwordResetToken: string,languageType:number) {
  return apiRequest<Boolean>(CHANGE_PASSWORD, {
    method: 'POST',
    data:{
      languageType,
      emailAddress,
      password,
      passwordVerification,
      passwordResetToken
    }
  });
}

// Get profile information
export function getProfileInfo(token: string) {
  const headers = { "Authorization": "Bearer " + token };
  return apiRequest<UserModel>(GET_PROFILE_INFO, {
    method: 'GET',
    headers,
  });
}
