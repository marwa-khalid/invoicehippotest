/* eslint-disable react-refresh/only-export-components */
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
import { toast, ToastOptions, Id } from "react-toastify";
import { handleToast } from "./_toast";

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

  const requestUser = async () => {
    try {
      if (!currentUser) {
        const data = await getProfileInfo();
        if (data) {
          setCurrentUser(data);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const saveAuth = (auth: AuthModel | undefined) => {
    if (auth) {
      authHelper.setAuth(auth);
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
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setShowSplashScreen(false);
      }
    };

    if (auth && auth.result.token) {
      // Check if the token has expired
      if (auth.result.tokenIsValid) {
        // const hasRunOnce = localStorage.getItem("hasRunOnce");

        // // If it hasn't run, execute the code
        // if (!hasRunOnce) {
        //   localStorage.removeItem("pagination"),
        //     // Set the flag in localStorage to mark it as run
        //     localStorage.setItem("hasRunOnce", "true");
        // }
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
    // eslint-disable-next-line
  }, []);

  return showSplashScreen ? <LayoutSplashScreen /> : <>{children}</>;
};

export { AuthProvider, AuthInit, useAuth };
