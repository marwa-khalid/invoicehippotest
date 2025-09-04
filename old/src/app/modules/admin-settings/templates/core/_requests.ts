import {
  LocalizationModel,
  LocalizationPostModel,
  LocalizationSingleModel,
  TemplateListModel,
  TemplatePostModel,
} from "./_models";

import {
  getRequest,
  postRequest,
  deleteRequest,
} from "../../../auth/core/_apiservice";
import { GET_LOCALIZATIONS, LOCALIZATION_API, TEMPLATE_API } from "./constants";
import { GenericBooleanModel } from "../../../invoices/overview/core/_models";

export function getTemplates(
  pageIndex: number,
  searchTerm: string,
  pageMax: number,
  statusType: number,
  subscriberId: number | null
) {
  return postRequest<TemplateListModel>(
    `${TEMPLATE_API}/search`,
    {
      pageMax: pageMax,
      pageIndex: pageIndex,
      searchTerm: searchTerm,
      statusType: statusType,
      ownerSubscriberId: subscriberId,
    },
    true
  );
}
export function postTemplate(values: any) {
  // Remove any undefined/null keys deeply
  // const cleanedValues = JSON.parse(
  //   JSON.stringify(values, (key, value) => {
  //     return value === undefined ? undefined : value;
  //   })
  // );
  const { previewImageFileUrl, ...rest } = values;

  return postRequest<TemplatePostModel>(TEMPLATE_API, rest, true);
}

export function getTemplateById(id: number) {
  return getRequest<TemplatePostModel>(`${TEMPLATE_API}/${id}`, true);
}
export function deleteTemplate(id: number) {
  return deleteRequest<GenericBooleanModel>(TEMPLATE_API, [id], true);
}
export function publishTemplate(id: number) {
  return postRequest<GenericBooleanModel>(
    `${TEMPLATE_API}/${id}/publish`,
    {},
    true
  );
}
