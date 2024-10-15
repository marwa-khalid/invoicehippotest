import clsx from "clsx";
import { FC } from "react";
import { toAbsoluteUrl } from "../../../helpers";

import { useLang, useSetLang } from "../../../i18n/i18n";
import Language from "../../../i18n/i18n";
import { useIntl } from "react-intl";
import { useState } from "react";

const languages = [
  {
    lang: "nl",
    name: "Dutch",
    flag: toAbsoluteUrl("media/flags/netherlands.svg"),
  },
  {
    lang: "en",
    name: "English",
    flag: toAbsoluteUrl("media/flags/united-states.svg"),
  },
];

const LanguagesAuth: FC = () => {
  const lang = useLang();
  const setLanguage = useSetLang();
  const currentLanguage = languages.find((x) => x.lang === lang);
  const intl = useIntl();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className=" position-relative ">
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
          {currentLanguage?.name}
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
          {languages.map((lang) => (
            <div key={lang.name} className="menu-item px-3 ">
              <a
                href="#"
                className="menu-link d-flex px-5"
                key={lang.lang}
                onClick={() => {
                  setLanguage(lang.lang as Language);
                  toggleMenu();
                }}
              >
                <span className="symbol symbol-20px me-4">
                  <img
                    data-kt-element="lang-flag"
                    className="rounded-1"
                    src={lang.flag}
                    alt=""
                  />
                </span>
                <span data-kt-element="lang-name">{lang.name}</span>
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export { LanguagesAuth };
