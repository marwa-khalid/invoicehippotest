import { CustomFieldModel, DiscountMarginModel } from "./_models";

import {
  getRequest,
  postRequest,
  deleteRequest,
} from "../../../../auth/core/_apiservice";
import { CUSTOM_FIELD } from "./constants";

interface PartialResult extends Partial<DiscountMarginModel> {}

export function getCustomFields(searchTerm: string, pageIndex: number) {
  return postRequest<CustomFieldModel>(
    `${CUSTOM_FIELD}/search`,
    {
      pageMax: 25,
      pageIndex: searchTerm ? 1 : pageIndex,
      searchTerm: searchTerm,
    },
    true
  );
}

export function getDiscountMarginById(editModalId: number) {
  return getRequest<PartialResult>(`${CUSTOM_FIELD}/${editModalId}`, true);
}

export function postCustomField(
  id: number,
  title: string,
  areaUsageType: number,
  fieldType: number,
  includeOnInvoiceType: number,
  includeOnQuoteType: number
) {
  return postRequest<PartialResult>(
    CUSTOM_FIELD,
    {
      id: id,
      title: title,
      areaUsageType: areaUsageType,
      fieldType: fieldType,
      includeOnInvoiceType: includeOnInvoiceType,
      includeOnQuoteType: includeOnQuoteType,
    },
    true
  );
}

export function deleteDiscountMargin(ids: number[]) {
  return deleteRequest<PartialResult>(CUSTOM_FIELD, ids, true);
}
