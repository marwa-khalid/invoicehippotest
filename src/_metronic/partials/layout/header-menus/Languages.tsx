import clsx from "clsx";
import { FC } from "react";
import { toAbsoluteUrl } from "../../../helpers";
import { Language, useLang, useSetLang } from "../../../i18n/i18n";
import { getEnumOptions } from "../../../../app/helpers/intlHelper";
import enums from "../../../../_metronic/i18n/messages/invoicehippo.enums.json";
import { updateLanguage } from "../../../../app/modules/auth/core/_requests";
import { useAuth } from "../../../../app/modules/auth";
import { useIntl } from "react-intl";
const languages = [
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

const Languages: FC = () => {
  const lang = useLang();
  const setLanguage = useSetLang();
  const intl = useIntl();
  const { currentUser } = useAuth();
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
    await updateLanguage(newLanguage, currentUser?.result.id);
    setLanguage(newLanguage as Language);
  };

  return (
    <div
      className="menu-item px-5"
      data-kt-menu-trigger="hover"
      data-kt-menu-placement="left-start"
      data-kt-menu-flip="bottom"
    >
      <a href="#" className="menu-link px-5">
        <span className="menu-title position-relative">
          Language
          <span className="fs-8 rounded bg-light px-3 py-2 position-absolute translate-middle-y top-50 end-0">
            {currentLanguage?.label}{" "}
            <img
              className="w-15px h-15px rounded-1 ms-2"
              src={currentLanguage?.flag}
              alt="metronic"
            />
          </span>
        </span>
      </a>

      <div className="menu-sub menu-sub-dropdown w-175px py-4">
        {enumLanguages.map((l, index) => (
          <div
            className="menu-item px-3"
            key={l.value}
            onClick={() => {
              switchLanguage(l.value);
            }}
          >
            <a
              href="#"
              className={clsx("menu-link d-flex px-5", {
                active: l.value === currentLanguage?.value,
              })}
            >
              <span className="symbol symbol-20px me-4">
                <img className="rounded-1" src={l.flag} alt="metronic" />
              </span>
              {l.label}
            </a>
            {index < enumLanguages.length - 1 && (
              <div className="separator"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export { Languages };
