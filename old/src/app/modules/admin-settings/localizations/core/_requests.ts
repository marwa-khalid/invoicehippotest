import {
  LocalizationModel,
  LocalizationPostModel,
  LocalizationSingleModel,
} from "./_models";

import {
  getRequest,
  postRequest,
  deleteRequest,
} from "../../../auth/core/_apiservice";
import { GET_LOCALIZATIONS, LOCALIZATION_API } from "./constants";
import { GenericBooleanModel } from "../../../invoices/overview/core/_models";

export function getLocalizations(
  pageIndex: number,
  searchTerm: string,
  pageMax: number
) {
  return postRequest<LocalizationModel>(
    GET_LOCALIZATIONS,
    {
      pageMax: pageMax,
      pageIndex: pageIndex,
      searchTerm: searchTerm,
      moduleType: 0,
    },
    true
  );
}
export function postLocalization(values: any) {
  return postRequest<LocalizationSingleModel>(LOCALIZATION_API, values, true);
}

export function getLocalizationById(id: number) {
  return getRequest<LocalizationPostModel>(`${LOCALIZATION_API}/${id}`, true);
}
export function deleteLocalization(id: number) {
  return deleteRequest<GenericBooleanModel>(LOCALIZATION_API, [id], true);
}
