import clsx from "clsx";
import { FC } from "react";
import { toAbsoluteUrl } from "../../../helpers";

import { Language, useLang, useSetLang } from "../../../i18n/i18n";
// import Language from "../../../i18n/i18n";
import { useIntl } from "react-intl";
import { useState } from "react";
import { updateLanguage } from "../../../../app/modules/auth/core/_requests";
import { useAuth } from "../../../../app/modules/auth";
import { getEnumOptions } from "../../../../app/helpers/intlHelper";
import enums from "../../../../_metronic/i18n/messages/invoicehippo.enums.json";
export const languages = [
  {
    lang: 1,
    flag: toAbsoluteUrl("media/flags/netherlands.svg"),
  },
  {
    lang: 2,
    flag: toAbsoluteUrl("media/flags/united-states.svg"),
  },

  {
    lang: 4,
    flag: toAbsoluteUrl("media/flags/germany.svg"),
  },
  {
    lang: 8,
    flag: toAbsoluteUrl("media/flags/france.svg"),
  },
  {
    lang: 16,
    flag: toAbsoluteUrl("media/flags/spain.svg"),
  },
  {
    lang: 32,
    flag: toAbsoluteUrl("media/flags/poland.svg"),
  },

  {
    lang: 64,
    flag: toAbsoluteUrl("media/flags/turkey.svg"),
  },
];

const LanguagesAuth: FC = () => {
  const lang = useLang();
  const setLanguage = useSetLang();
  const intl = useIntl();
  const [menuOpen, setMenuOpen] = useState(false);
  const { currentUser } = useAuth();
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  const enumLanguages = getEnumOptions(enums.LanguageTypesCompleet, intl).map(
    (enumLang) => {
      const matchingLang = languages.find(
        (lang) => lang.lang === enumLang.value
      );
      return {
        ...enumLang, // Keeps translated label from getEnumOptions
        flag: matchingLang?.flag || toAbsoluteUrl("media/flags/default.svg"), // Adds flag from languages array
      };
    }
  );
  const currentLanguage = enumLanguages.find((x) => x.value === lang);

  const switchLanguage = async (newLanguage: number) => {
    setLanguage(newLanguage as Language);
    setMenuOpen(false);
  };
  return (
    <div className="position-relative">
      <div
        className="btn btn-flex btn-link rotate"
        onClick={toggleMenu}
        aria-expanded={menuOpen}
      >
        <img
          data-kt-element="current-lang-flag"
          className="w-25px h-25px rounded-circle me-3"
          src={currentLanguage?.flag}
          alt=""
        />
        <span data-kt-element="current-lang-name" className="me-2">
          {currentLanguage?.label}
        </span>
        <i
          className={`ki-outline ki-down fs-2 text-muted ${
            menuOpen ? "rotate-180" : "rotate-0"
          } m-0`}
        ></i>
      </div>

      {menuOpen && (
        <div
          className="menu-column menu-rounded menu-gray-800 menu-state-bg-light-primary bg-white fw-semibold py-4 position-absolute w-200px bottom-100 shadow-2xl rounded shadow-lg"
          data-kt-menu="true"
          id="kt_auth_lang_menu"
          data-kt-menu-flip="top"
        >
          {enumLanguages.map((lang, index) => (
            <div key={lang.value} className="menu-item px-3">
              <a
                href="#"
                className="menu-link d-flex px-5"
                onClick={() => switchLanguage(lang.value)}
              >
                <span className="symbol symbol-20px me-4">
                  <img
                    data-kt-element="lang-flag"
                    className="rounded-1"
                    src={lang.flag}
                    alt=""
                  />
                </span>
                <span data-kt-element="lang-name">{lang.label}</span>{" "}
                {/* Translated label */}
              </a>
              {index < enumLanguages.length - 1 && (
                <div className="separator"></div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export { LanguagesAuth };
