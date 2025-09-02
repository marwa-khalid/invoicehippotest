import { BudgetModel, BudgetPost, BudgetPostModel } from "./_models";

import {
  getRequest,
  postRequest,
  deleteRequest,
} from "../../../auth/core/_apiservice";
import { BUDGET_API } from "./constants";
import { GenericBooleanModel } from "../../../invoices/overview/core/_models";

export function getBudgets(
  searchTerm: string,
  pageIndex: number,
  pageMax: number,
  productGroupId: number | null
) {
  return postRequest<BudgetModel>(
    `${BUDGET_API}/search`,
    {
      pageMax: pageMax,
      pageIndex: searchTerm ? 1 : pageIndex,
      searchTerm: searchTerm,
      budgetGroupId: productGroupId,
    },
    true
  );
}
export function getBudgetById(editModalId: number) {
  return getRequest<BudgetPostModel>(`${BUDGET_API}/${editModalId}`, true);
}

export function postBudget(values: BudgetPost) {
  return postRequest<BudgetPostModel>(BUDGET_API, values, true);
}

export function deleteBudget(ids: number[]) {
  return deleteRequest<GenericBooleanModel>(BUDGET_API, ids, true);
}
