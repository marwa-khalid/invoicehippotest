import { CustomFieldModel, DiscountMarginModel } from "./_models";

import {
  getRequest,
  postRequest,
  deleteRequest,
} from "../../../../auth/core/_apiservice";
import { CUSTOM_FIELD } from "./constants";

interface PartialResult extends Partial<CustomFieldModel> {}

export function getCustomFields(
  searchTerm: string,

  fieldFilterType: number,
  areaFilterType: number,
  pageIndex: number
) {
  return postRequest<CustomFieldModel>(
    `${CUSTOM_FIELD}/search`,
    {
      pageMax: 25,
      pageIndex: searchTerm ? 1 : pageIndex,
      searchTerm: searchTerm,
      areaUsageType: areaFilterType,
      fieldType: fieldFilterType,
    },
    true
  );
}

export function getCustomFieldById(editModalId: number) {
  return getRequest<CustomFieldModel>(`${CUSTOM_FIELD}/${editModalId}`, true);
}

export function postCustomField(
  id: number,
  title: string,
  groupDisplayName: string,
  areaUsageType: number,
  fieldType: number,
  includeOnInvoiceType: number,
  includeOnQuoteType: number,
  customData: any
) {
  return postRequest<PartialResult>(
    CUSTOM_FIELD,
    {
      id: id,
      title: title,
      groupDisplayName: groupDisplayName,
      areaUsageType: areaUsageType,
      fieldType: fieldType,
      includeOnInvoiceType: includeOnInvoiceType,
      includeOnQuoteType: includeOnQuoteType,
      customData: customData,
    },
    true
  );
}

export function deleteDiscountMargin(ids: number[]) {
  return deleteRequest<PartialResult>(CUSTOM_FIELD, ids, true);
}
