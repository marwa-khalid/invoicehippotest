import { AuthModel, UserModel ,PasswordResetModel} from "./_models";
import { LOGIN_URL,REQUEST_PASSWORD_URL, GET_PROFILE_INFO, REDIRECT_URL_V1,CHANGE_PASSWORD} from "./constants";
import { postRequest,getRequest } from "./_apiservice";
// Login request
export function login(email: string, password: string) {
  return postRequest<AuthModel>(LOGIN_URL, 
    {
      userName: email,
      password,
      languageType: 2,
      deviceType: 1,
      deviceId: "Windows"
    }
    ,
    false
  );
}

// Request password reset
export function requestResetLink(EmailAddress: string) {
  return postRequest<PasswordResetModel>(REQUEST_PASSWORD_URL, 
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
  return getRequest<PasswordResetModel>(`${CHANGE_PASSWORD}/${uuid}`, 
    false
  );
}

export function changePassword(emailAddress: string, password: string,passwordVerification: string,passwordResetToken: string,languageType:number) {
  return postRequest<Boolean>(CHANGE_PASSWORD, 
  {
      languageType,
      emailAddress,
      password,
      passwordVerification,
      passwordResetToken
    },
    false
  );
}

// Get profile information
export function getProfileInfo() {
  
  return getRequest<UserModel>(GET_PROFILE_INFO,
    true
  );
}
