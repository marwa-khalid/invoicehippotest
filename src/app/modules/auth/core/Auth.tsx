import {
  FC,
  useState,
  useEffect,
  createContext,
  useContext,
  Dispatch,
  SetStateAction,
} from "react";
import { LayoutSplashScreen } from "../../../../_metronic/layout/core";
import { AuthModel, UserModel } from "./_models";
import * as authHelper from "./AuthHelpers";
import { getProfileInfo } from "./_requests";
import { WithChildren } from "../../../../_metronic/helpers";
import { handleToast } from "./_toast";
import IntercomService from "../../generic/IntercomService";
const INTERCOM_KEY = import.meta.env.VITE_APP_INTERCOM_KEY;

type AuthContextProps = {
  auth: AuthModel | undefined;
  saveAuth: (auth: AuthModel | undefined) => void;
  currentUser: UserModel | undefined;
  setCurrentUser: Dispatch<SetStateAction<UserModel | undefined>>;
  logout: () => void;
};

const initAuthContextPropsState = {
  auth: authHelper.getAuth(),
  saveAuth: () => {},
  currentUser: undefined,
  setCurrentUser: () => {},
  logout: () => {},
};

const AuthContext = createContext<AuthContextProps>(initAuthContextPropsState);

const useAuth = () => {
  return useContext(AuthContext);
};

const AuthProvider: FC<WithChildren> = ({ children }) => {
  const [auth, setAuth] = useState<AuthModel | undefined>(authHelper.getAuth());
  const [currentUser, setCurrentUser] = useState<UserModel | undefined>();
  const currentItem = JSON.parse(localStorage.getItem("currentItem")!);

  const requestUser = async () => {
    try {
      if (currentItem || !currentUser) {
        const data = await getProfileInfo();
        if (data) {
          setCurrentUser(data);
          IntercomService.boot({
            app_id: INTERCOM_KEY,
            name: data.result.displayName,
            email: data.result.emailAddress,
            user_id: data.result.id,
            subscriber_id: data.result.subscriberId,
            alignment: "right",
            company: data.result.activeCompany.title,
            company_name: data.result.activeCompany.title,
            company_id: data.result.activeCompany.id,
            user_hash: data.result.thirdPartySettings.userIntercomIoHash,
            is_takeover: data.result.switches.isInTakeOverMode,
            is_anonymous_client: data.result.isAnonymousUser,
            license_name: data.result.activeLicense.licenseType.name,
            license_type: data.result.activeLicense.licenseType.value,
            license_trialIsExpiring: data.result.activeLicense.trialIsExpiring,
            license_daysLeftToExpiration:
              data.result.activeLicense.daysLeftToExpiration,
            license_licenseIsExpiring:
              data.result.activeLicense.licenseIsExpiring,
            license_isActive: data.result.activeLicense.isActive,
          });
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const saveAuth = (auth: AuthModel | undefined) => {
    if (auth) {
      authHelper.setAuth(auth);
      if (!auth.result.canRedirectToModule) {
        localStorage.removeItem("currentItem");
        localStorage.removeItem("currentNr");
      }
      //Check if the token has expired
      if (auth.isValid && auth.result.tokenIsValid) {
        requestUser();
      } else {
        handleToast(auth);
      }
    } else {
      authHelper.removeAuth();
    }
  };

  const logout = () => {
    saveAuth(undefined);
    setCurrentUser(undefined);
  };

  return (
    <AuthContext.Provider
      value={{ auth, saveAuth, currentUser, setCurrentUser, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const AuthInit: FC<WithChildren> = ({ children }) => {
  const { auth, currentUser, logout, setCurrentUser } = useAuth();
  const [showSplashScreen, setShowSplashScreen] = useState(true);

  useEffect(() => {
    const requestUser = async () => {
      try {
        if (!currentUser) {
          const data = await getProfileInfo();

          if (data) {
            setCurrentUser(data);
            const loggedInUser = JSON.parse(
              localStorage.getItem("loggedInUser")!
            );

            if (loggedInUser !== data.result.person.id) {
              localStorage.setItem(
                "loggedInUser",
                JSON.stringify(data.result.person.id)
              );

              localStorage.removeItem("pagination");
            }
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setShowSplashScreen(false);
      }
    };

    if (auth && auth.result?.token) {
      // Check if the token has expired
      if (auth.result.tokenIsValid) {
        const remove = localStorage.getItem("nPge");

        // If it hasn't run, execute the code
        if (!remove) {
          localStorage.removeItem("pagination"),
            // Set the flag in localStorage to mark it as run
            localStorage.setItem("nPge", "true");
          localStorage.removeItem("Pge");
        }
        localStorage.removeItem("clientResponse");
        localStorage.removeItem("contactResponse");
        const expirationDate = new Date(auth.result.expirationDateUtc);
        const currentDate = new Date();
        const diff = expirationDate.getTime() - currentDate.getTime();
        if (diff > 0) {
          requestUser();
        } else {
          localStorage.removeItem("currentUser");

          setShowSplashScreen(false);
        }
      } else {
        setShowSplashScreen(false);
      }
    } else {
      setShowSplashScreen(false);
    }
  }, []);

  return showSplashScreen ? <LayoutSplashScreen /> : <>{children}</>;
};

export { AuthProvider, AuthInit, useAuth };
