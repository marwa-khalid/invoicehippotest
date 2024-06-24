/* eslint-disable react-refresh/only-export-components */
import { FC, createContext, useContext, useState, useEffect } from "react";
import { WithChildren } from "../helpers";

const I18N_CONFIG_KEY =
  import.meta.env.VITE_APP_I18N_CONFIG_KEY || "i18nConfig";

type Language = "de" | "en" | "es" | "fr" | "ja" | "zh";

type I18nContextProps = {
  selectedLang: Language;
  setLanguage: (lang: Language) => void; // Function to change the language
};

const initialState: I18nContextProps = {
  selectedLang: "en",
  setLanguage: () => {}, // Placeholder, will be replaced in provider
};

// Function to get the current language from local storage or default to initial state
function getConfig(): Language {
  const ls = localStorage.getItem(I18N_CONFIG_KEY);
  if (ls) {
    try {
      const config = JSON.parse(ls) as { selectedLang: Language };
      return config.selectedLang;
    } catch (er) {
      console.error(er);
    }
  }
  return initialState.selectedLang;
}

// Create the context with initial state
const I18nContext = createContext<I18nContextProps>(initialState);

const useLang = () => {
  return useContext(I18nContext).selectedLang;
};

const useSetLang = () => {
  return useContext(I18nContext).setLanguage;
};

// Provider component to wrap around components that need access to language settings
const MetronicI18nProvider: FC<WithChildren> = ({ children }) => {
  const [selectedLang, setSelectedLang] = useState<Language>(getConfig());

  // Function to update the language in the state and local storage
  const setLanguage = (lang: Language) => {
    setSelectedLang(lang);
    localStorage.setItem(
      I18N_CONFIG_KEY,
      JSON.stringify({ selectedLang: lang })
    ); // Save to local storage for persistence
  };

  // Provide the current language and the function to update it
  const value = { selectedLang, setLanguage };

  useEffect(() => {
    // Load initial language setting from local storage
    setSelectedLang(getConfig());
  }, []);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export { MetronicI18nProvider, useLang, useSetLang };
export default Language;
