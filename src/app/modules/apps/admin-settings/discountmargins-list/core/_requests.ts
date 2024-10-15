import { DiscountMarginModel } from "./_models";

import {
  getRequest,
  postRequest,
  deleteRequest,
} from "../../../../auth/core/_apiservice";
import { DISCOUNT_MARGIN } from "./constants";

interface PartialResult extends Partial<DiscountMarginModel> {}

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

export function getDiscountMarginById(editModalId: number) {
  return getRequest<PartialResult>(`${DISCOUNT_MARGIN}/${editModalId}`, true);
}

export function postDiscountMargin(
  id: number,
  title: string,
  isPercentageMargin: boolean,
  amount: number
) {
  return postRequest<PartialResult>(
    DISCOUNT_MARGIN,
    {
      id: id,
      title: title,
      isPercentageMargin: isPercentageMargin,
      amount: amount,
    },
    true
  );
}

export function deleteDiscountMargin(ids: number[]) {
  return deleteRequest<PartialResult>(DISCOUNT_MARGIN, ids, true);
}
