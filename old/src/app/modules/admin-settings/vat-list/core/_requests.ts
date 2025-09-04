interface DeleteResult extends Partial<VatTypesModel> {}
import {
  getRequest,
  postRequest,
  deleteRequest,
} from "../../../auth/core/_apiservice";
import {
  SEARCH_VAT_TYPES,
  GET_VAT_BY_ID,
  POST_VAT_TYPES,
  GET_LEDGDER_FOR_VAT,
} from "./constants";
import { VatTypesModel, VatTypeByIdModel, LedgerForVatModel } from "./_models";

export function getVatTypes(
  searchTerm: string,
  pageIndex: number,
  vatAreaUsageTypeFilter: number | undefined
) {
  if (vatAreaUsageTypeFilter === 0) {
    vatAreaUsageTypeFilter = undefined;
  }
  return postRequest<VatTypesModel>(
    SEARCH_VAT_TYPES,
    {
      pageMax: 25,
      pageIndex: searchTerm ? 1 : pageIndex,
      searchTerm: searchTerm,
      vatAreaUsageTypeFilter: vatAreaUsageTypeFilter,
    },
    true
  );
}

export function postVatType(
  id: number,
  ledgerAccountId: number,
  title: string,
  value: number,
  vatAreaUsageType: number,
  isAlwaysExBtw: boolean,
  useInLists: boolean,
  showOnDocuments: boolean,
  isNoneVatType: boolean
) {
  return postRequest<VatTypesModel>(
    POST_VAT_TYPES,
    {
      id: id,
      ledgerAccountId: ledgerAccountId,
      templateId: 0,
      title: title,
      value: value,
      vatAreaUsageType: vatAreaUsageType,
      isAlwaysExBtw: isAlwaysExBtw,
      showOnDocuments: showOnDocuments,
      useInLists: useInLists,
      isNoneVatType: isNoneVatType,
    },
    true
  );
}

export function getVatById(editModalId: number) {
  return getRequest<VatTypeByIdModel>(`${GET_VAT_BY_ID}/${editModalId}`, true);
}

export function getLedgerAccount() {
  return getRequest<LedgerForVatModel>(GET_LEDGDER_FOR_VAT, true);
}

export function deleteVatType(id: number) {
  return deleteRequest<DeleteResult>(POST_VAT_TYPES, [id], true);
}
