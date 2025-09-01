import {
  BudgetGroupModel,
  BudgetGroupPostModel,
  ProductGroupModel,
} from "./_models";

import {
  getRequest,
  postRequest,
  deleteRequest,
} from "../../../auth/core/_apiservice";
import { BUDGET_GROUP, PRODUCT_GROUP } from "./constants";

export interface PartialResult extends Partial<BudgetGroupModel> {}

export function getBudgetGroups(searchTerm: string, pageIndex: number) {
  return postRequest<BudgetGroupModel>(
    `${BUDGET_GROUP}/search`,
    {
      pageMax: 25,
      pageIndex: searchTerm ? 1 : pageIndex,
      searchTerm: searchTerm,
    },
    true
  );
}

export function postBudgetGroup(
  id: number,
  title: string,
  description: string,
  subjects: any
) {
  return postRequest<PartialResult>(
    BUDGET_GROUP,
    {
      id: id,
      title: title,
      description: description,
      subjects: subjects,
    },
    true
  );
}

export function getBudgetGroupById(editModalId: number) {
  return getRequest<BudgetGroupPostModel>(
    `${BUDGET_GROUP}/${editModalId}`,
    true
  );
}

export function deleteBudgetGroup(ids: number[]) {
  return deleteRequest<PartialResult>(BUDGET_GROUP, ids, true);
}
