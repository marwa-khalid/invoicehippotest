/* eslint-disable react-refresh/only-export-components */
import { FC, createContext, useContext, useState, useEffect } from "react";
import { WithChildren } from "../helpers";
import { useAuth } from "../../app/modules/auth";

const I18N_CONFIG_KEY =
  import.meta.env.VITE_APP_I18N_CONFIG_KEY || "i18nConfig";

export type Language = 1 | 2 | 4 | 8 | 16 | 32 | 64;

type I18nContextProps = {
  selectedLang?: number;
  setLanguage: (lang: Language) => void;
};

// Function to get the current language from local storage
function getConfig(): number {
  const ls = localStorage.getItem(I18N_CONFIG_KEY);
  if (ls) {
    try {
      const config = JSON.parse(ls);

      return config.selectedLang as number; // Ensure it returns a number
    } catch (er) {
      console.error(er);
    }
  }
  return 1; // Default to English (or any other default)
}

// Create the context with initial state
const I18nContext = createContext<I18nContextProps>({
  selectedLang: 1,
  setLanguage: () => {},
});

const useSetLang = () => {
  return useContext(I18nContext).setLanguage;
};
const useLang = () => {
  return useContext(I18nContext).selectedLang;
};

export function getLang(): number {
  const ls = localStorage.getItem(
    import.meta.env.VITE_APP_I18N_CONFIG_KEY || "i18nConfig"
  );
  if (ls) {
    try {
      const config = JSON.parse(ls);
      return config.selectedLang as number; // Ensure it's a number
    } catch (er) {
      console.error("Error parsing language from localStorage", er);
    }
  }
  return 1; // Default language (English)
}

// Provider component
const MetronicI18nProvider: FC<WithChildren> = ({ children }) => {
  const { currentUser } = useAuth(); // 🔥 Move hook inside the component
  const [selectedLang, setSelectedLang] = useState<number>(getConfig());

  useEffect(() => {
    if (currentUser?.result.languageType) {
      setSelectedLang(currentUser.result.languageType.value); // Ensure it's a number
    }
  }, [currentUser]);

  const setLanguage = (lang: number) => {
    setSelectedLang(lang);
    localStorage.setItem(
      I18N_CONFIG_KEY,
      JSON.stringify({ selectedLang: lang })
    );
  };

  return (
    <I18nContext.Provider value={{ selectedLang, setLanguage }}>
      {children}
    </I18nContext.Provider>
  );
};

export { MetronicI18nProvider, useLang, useSetLang };
