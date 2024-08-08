import { DiscountMarginModel, ProductGroupModel } from "./_models";

import {
  getRequest,
  postRequest,
  deleteRequest,
} from "../../../../auth/core/_apiservice";
import { PRODUCT_GROUP, DISCOUNT_MARGIN } from "./constants";

interface PartialResult extends Partial<ProductGroupModel> {}

export function getDiscountMargins(searchTerm: string, pageIndex: number) {
  return postRequest<DiscountMarginModel>(
    `${DISCOUNT_MARGIN}/search`,
    {
      pageMax: 25,
      pageIndex: searchTerm ? 1 : pageIndex,
      searchTerm: searchTerm,
    },
    true
  );
}

export function getProductGroupById(editModalId: number) {
  return getRequest<PartialResult>(`${PRODUCT_GROUP}/${editModalId}`, true);
}

export function postProductGroup(id: number, title: string) {
  return postRequest<PartialResult>(
    PRODUCT_GROUP,
    {
      id: id,
      title: title,
    },
    true
  );
}

export function deleteProductGroup(ids: number[]) {
  return deleteRequest<PartialResult>(PRODUCT_GROUP, ids, true);
}
