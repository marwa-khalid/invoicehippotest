import { ProductGroupModel } from "./_models";

import {
  getRequest,
  postRequest,
  deleteRequest,
} from "../../../../auth/core/_apiservice";
import { PRODUCT_GROUP } from "./constants";

interface PartialResult extends Partial<ProductGroupModel> {}

export function getProductGroups(searchTerm: string, pageIndex: number) {
  return postRequest<ProductGroupModel>(
    `${PRODUCT_GROUP}/search`,
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


