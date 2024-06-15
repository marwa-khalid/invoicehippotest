/* eslint-disable react-refresh/only-export-components */
import React, { FC, createContext, useContext, useState } from "react";
import { WithChildren } from "../helpers"; // Import your type for WithChildren

const I18N_CONFIG_KEY =
  import.meta.env.VITE_APP_I18N_CONFIG_KEY || "i18nConfig";

// Define the possible languages
type Language = "de" | "en" | "nl" | "es" | "fr" | "ja" | "zh";

type I18nContextProps = {
  selectedLang: Language;
  setLanguage: (lang: Language) => void;
};

// Initial state for the context
const initialState: I18nContextProps = {
  selectedLang: "nl",
  setLanguage: () => {}, // Placeholder function, will be overridden in the provider
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

// Function to save the selected language to local storage
function saveLanguage(lang: Language) {
  localStorage.setItem(I18N_CONFIG_KEY, JSON.stringify({ selectedLang: lang }));
}

// Create the context with initial state
const I18nContext = createContext<I18nContextProps>(initialState);

// Hook to use the current language in components
const useLang = () => {
  return useContext(I18nContext).selectedLang;
};

// Hook to use the setLanguage function in components
const useSetLang = () => {
  return useContext(I18nContext).setLanguage;
};

// Provider component to wrap around components that need access to language settings
const MetronicI18nProvider: FC<WithChildren> = ({ children }) => {
  // Use state to manage the selected language
  const [selectedLang, setSelectedLang] = useState<Language>(getConfig());

  // Function to update the language in the state and local storage
  const setLanguage = (lang: Language) => {
    setSelectedLang(lang);
    saveLanguage(lang); // Save to local storage
  };

  // Provide the current language and the function to update it
  const value = { selectedLang, setLanguage };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export { MetronicI18nProvider, useLang, useSetLang };
export default Language;
