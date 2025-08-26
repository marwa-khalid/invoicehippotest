import { IntlShape, useIntl } from "react-intl";

let intl: IntlShape | null = null;

// Setter function to initialize `intl` globally
export const setIntl = (newIntl: IntlShape) => {
  intl = newIntl;
};

export interface localizationModel {
  LocalizationValueKey: string | null;
  IgnoreTranslation: boolean;
  Title: string;
  Symbol: string | null;
  HasSymbol: boolean;
  Value: number;
  SubGroup: string | null;
  HasSubGroup: boolean;
  Group: string | null;
  ExtraDescription: string | null;
  HasGroup: boolean;
}
// Getter function to access `intl` globally
export const getIntl = (): IntlShape => {
  if (!intl) {
    throw new Error("Intl has not been set. Ensure `setIntl` is called first.");
  }
  return intl;
};

export const getEnumOptions = (enumArray: localizationModel[], intl: IntlShape) => {
  return enumArray.map((item: localizationModel) => ({
    value: item.Value,
    label: item.LocalizationValueKey
      ? intl.formatMessage({ id: `Enums.${item.LocalizationValueKey}` })
      : item.Title,
  }));
};
