/* eslint-disable @typescript-eslint/no-explicit-any */
import { AuthModel, SepaModel } from "./_models";

const AUTH_LOCAL_STORAGE_KEY = "kt-auth-react-v";

const SEPA_LOCAL_STORAGE_KEY = "kt-sepa-react-v";
const getAuth = (): AuthModel | undefined => {
  if (!localStorage) {
    return;
  }

  const lsValue: string | null = localStorage.getItem(AUTH_LOCAL_STORAGE_KEY);
  if (!lsValue) {
    return;
  }

  try {
    const auth: AuthModel = JSON.parse(lsValue) as AuthModel;
    if (auth) {
      return auth;
    }
  } catch (error) {
    console.error("AUTH LOCAL STORAGE PARSE ERROR", error);
  }
};

const getSepa = (): SepaModel | undefined => {
  if (!localStorage) {
    return;
  }

  const lsValue: string | null = localStorage.getItem(SEPA_LOCAL_STORAGE_KEY);
  if (!lsValue) {
    return;
  }

  try {
    const sepa: SepaModel = JSON.parse(lsValue) as SepaModel;
    if (sepa) {
      return sepa;
    }
  } catch (error) {
    console.error("SEPA LOCAL STORAGE PARSE ERROR", error);
  }
};

const setAuth = (auth: AuthModel) => {
  if (!localStorage) {
    return;
  }

  try {
    const lsValue = JSON.stringify(auth);
    localStorage.setItem(AUTH_LOCAL_STORAGE_KEY, lsValue);
  } catch (error) {
    console.error("AUTH LOCAL STORAGE SAVE ERROR", error);
  }
};

const setSepa = (sepa: SepaModel) => {
  if (!localStorage) {
    return;
  }

  try {
    const lsValue = JSON.stringify(sepa);
    localStorage.setItem(SEPA_LOCAL_STORAGE_KEY, lsValue);
  } catch (error) {
    console.error("SEPA LOCAL STORAGE SAVE ERROR", error);
  }
};

const removeAuth = () => {
  if (!localStorage) {
    return;
  }

  try {
    localStorage.removeItem(AUTH_LOCAL_STORAGE_KEY);
  } catch (error) {
    console.error("AUTH LOCAL STORAGE REMOVE ERROR", error);
  }
};

const removeSepa = () => {
  if (!localStorage) {
    return;
  }

  try {
    localStorage.removeItem(SEPA_LOCAL_STORAGE_KEY);
  } catch (error) {
    console.error("SEPA LOCAL STORAGE REMOVE ERROR", error);
  }
};

export {
  getAuth,
  setAuth,
  removeAuth,
  setSepa,
  removeSepa,
  getSepa,
  SEPA_LOCAL_STORAGE_KEY,
  AUTH_LOCAL_STORAGE_KEY,
};
