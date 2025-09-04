import { FC, useEffect } from "react";
import { useLang } from "./i18n";
import { IntlProvider, useIntl } from "react-intl";
import "@formatjs/intl-relativetimeformat/polyfill";
import "@formatjs/intl-relativetimeformat/locale-data/en";
import "@formatjs/intl-relativetimeformat/locale-data/de";
import "@formatjs/intl-relativetimeformat/locale-data/es";
import "@formatjs/intl-relativetimeformat/locale-data/fr";
import "@formatjs/intl-relativetimeformat/locale-data/ja";
import "@formatjs/intl-relativetimeformat/locale-data/zh";
import "@formatjs/intl-relativetimeformat/locale-data/nl";

import deMessages from "./messages/de.json";
import enMessages from "./messages/en.json";
import esMessages from "./messages/es.json";
import frMessages from "./messages/fr.json";
import nlMessages from "./messages/nl.json";
import plMessages from "./messages/pl.json";
import trMessages from "./messages/tr.json";
import { WithChildren } from "../helpers";
import { setIntl } from "./../../app/helpers/intlHelper";

const allMessages: Record<
  1 | 2 | 4 | 8 | 16 | 32 | 64,
  Record<string, string>
> = {
  1: nlMessages,
  2: enMessages,
  4: deMessages,
  8: frMessages,
  16: esMessages,
  32: plMessages,
  64: trMessages,
};

// Child component to set the global `intl` instance
const IntlInitializer: FC = () => {
  const intl = useIntl();

  useEffect(() => {
    setIntl(intl); // Set the global intl instance
  }, [intl]);

  return null; // No UI rendering needed
};
const localeMap: Record<1 | 2 | 4 | 8 | 16 | 32 | 64, string> = {
  1: "nl",
  2: "en",
  4: "de",
  8: "fr",
  16: "es",
  32: "pl",
  64: "tr",
};

const I18nProvider: FC<WithChildren> = ({ children }) => {
  const localeNumber = (useLang() ?? 1) as 1 | 2 | 4 | 8 | 16 | 32 | 64; // Ensure valid number
  const locale = localeMap[localeNumber] || "en"; // Convert number to locale string
  const messages = allMessages[localeNumber] || enMessages; // Fetch correct messages

  return (
    <IntlProvider locale={locale} messages={messages}>
      <IntlInitializer />
      {children}
    </IntlProvider>
  );
};

export { I18nProvider };
