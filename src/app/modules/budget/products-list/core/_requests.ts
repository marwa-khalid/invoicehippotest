import { BudgetModel, ProductModel } from "./_models";

import {
  getRequest,
  postRequest,
  deleteRequest,
} from "../../../auth/core/_apiservice";
import { BUDGET_API, PRODUCT_API, PRODUCT_GROUP_API } from "./constants";
import { FormValues } from "../product-add-modal/ProductAddModalForm";

interface PartialResult extends Partial<BudgetModel> {}

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

//extraaa
export function getProducts(
  searchTerm: string,
  pageIndex: number,
  pageMax: number,
  clientId: number | null,
  productGroupId: number | null
) {
  return postRequest<ProductModel>(
    `${PRODUCT_API}/search`,
    {
      pageMax: pageMax,
      pageIndex: searchTerm ? 1 : pageIndex,
      searchTerm: searchTerm,
      productGroupId: productGroupId,
      supplierClientId: clientId,
    },
    true
  );
}

export function getProductGroupList() {
  return getRequest<PartialResult>(PRODUCT_GROUP_API, true);
}
export function getProductById(editModalId: number) {
  return getRequest<PartialResult>(`${PRODUCT_API}/${editModalId}`, true);
}

export function postProduct(values: FormValues) {
  return postRequest<PartialResult>(PRODUCT_API, values, true);
}

export function deleteProductGroup(ids: number[]) {
  return deleteRequest<PartialResult>(PRODUCT_API, ids, true);
}
