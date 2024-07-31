import {
  UnitTypesModel,
  FinancialAccountsModel,
  FinancialAccountByIdModel,
  PrivateLedgersModel,
  VatTypesForLedgerModel,
} from "./_models";

import {
  getRequest,
  postRequest,
  deleteRequest,
} from "../../../../auth/core/_apiservice";
import {
  UNIT_TYPES,
  GET_LEDGDER_FOR_FILTER,
  POST_FINANCIAL_ACCOUNT,
  GET_VAT_FOR_LEDGER,
  GET_PRIVATE_LEDGDER,
  GET_LEDGDER_FOR_FINANCIAL,
  GET_FINANCIALACCOUNT_BY_ID,
} from "./constants";
import { LedgerAccountsModel, LedgerAccountsForFilterModel } from "./_models";

interface PartialResult extends Partial<UnitTypesModel> {}

export function getUnitTypes(searchTerm: string, pageIndex: number) {
  return postRequest<UnitTypesModel>(
    `${UNIT_TYPES}/search`,
    {
      pageMax: 25,
      pageIndex: searchTerm ? 1 : pageIndex,
      searchTerm: searchTerm,
    },
    true
  );
}

export function getUnitTypesById(editModalId: number) {
  return getRequest<PartialResult>(`${UNIT_TYPES}/${editModalId}`, true);
}

export function getLedgerForFinancial(id: number) {
  return getRequest<PrivateLedgersModel>(
    `${GET_LEDGDER_FOR_FINANCIAL}/${id}`,
    true
  );
}

export function postUnitType(id: number, title: string, isDefault: boolean) {
  return postRequest<PartialResult>(
    UNIT_TYPES,
    {
      id: id,
      title: title,
      isDefault: isDefault,
    },
    true
  );
}

export function deleteUnitType(id: number) {
  return deleteRequest<PartialResult>(UNIT_TYPES, [id], true);
}
