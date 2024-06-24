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

  {
    lang: "es",
    name: "Spanish",
    flag: toAbsoluteUrl("media/flags/spain.svg"),
  },

  {
    lang: "de",
    name: "German",
    flag: toAbsoluteUrl("media/flags/germany.svg"),
  },
  {
    lang: "fr",
    name: "French",
    flag: toAbsoluteUrl("media/flags/france.svg"),
  },
];

const LanguagesAuth: FC = () => {
  const lang = useLang();
  const setLanguage = useSetLang();
  const currentLanguage = languages.find((x) => x.lang === lang);
  const intl = useIntl();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    console.log("hello working");
    setMenuOpen(!menuOpen);
  };

  return (
    // <div
    //   className='menu-item px-5'
    //   data-kt-menu-trigger='hover'
    //   data-kt-menu-placement='left-start'
    //   data-kt-menu-flip='bottom'
    // >
    //   <a href='#' className='menu-link px-5'>
    //     <span className='menu-title position-relative'>
    //       {intl.formatMessage({id: 'FIELDS.LANGUAGEPREFERENCETYPE'})}
    //       <span className='fs-8 rounded bg-light px-3 py-2 position-absolute translate-middle-y top-50 end-0'>
    //         {currentLanguage?.name}{' '}
    //         <img
    //           className='w-15px h-15px rounded-1 ms-2'
    //           src={currentLanguage?.flag}
    //           alt='metronic'
    //         />
    //       </span>
    //     </span>
    //   </a>

    //   <div className=''>
    //     {languages.map((l) => (
    //       <div
    //         className='menu-item px-3'
    //         key={l.lang}
    //         onClick={() => {
    //           debugger;
    //           console.log("hello")
    //           setLanguage(l.lang)
    //         }}
    //       >
    //         <a
    //           href='#'
    //           className={clsx('menu-link d-flex px-5', {active: l.lang === currentLanguage?.lang})}
    //         >
    //           <span className='symbol symbol-20px me-4'>
    //             <img className='rounded-1' src={l.flag} alt='metronic' />
    //           </span>
    //           {l.name}
    //         </a>
    //       </div>
    //     ))}
    //   </div>
    // </div>

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
          className="menu-column menu-rounded menu-gray-800 bg-white fw-semibold py-4 position-absolute w-200px bottom-100"
          data-kt-menu="true"
          id="kt_auth_lang_menu"
          data-kt-menu-flip="top"
        >
          {languages.map((lang) => (
            <div key={lang.name} className="menu-item px-3 rounded-lg">
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
