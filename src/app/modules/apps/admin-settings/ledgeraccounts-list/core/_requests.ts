import axios, { AxiosResponse } from "axios";
import { ID, Response } from "../../../../../../_metronic/helpers";
import {
  BalanceItem,
  PrivateLedgersModel,
  User,
  UsersQueryResponse,
  VatTypesForLedgerModel,
} from "./_models";

import {
  getRequest,
  postRequest,
  deleteRequest,
} from "../../../../auth/core/_apiservice";
import {
  SEARCH_LEDGER_ACCOUNTS,
  GET_LEDGDER_FOR_FILTER,
  GET_VAT_BY_ID,
  POST_LEDGER_ACCOUNT,
  GET_VAT_FOR_LEDGER,
  GET_PRIVATE_LEDGDER,
  GET_LEDGDER_FOR_REPORTING,
} from "./constants";
import {
  LedgerAccountsModel,
  LedgerAccountsForFilterModel,
  VatTypeByIdModel,
  LedgerForVatModel,
} from "./_models";

//extra imports remove afterwards
import { VatTypesModel } from "../../vat-list/core/_models";
interface DeleteResult extends Partial<LedgerAccountsModel> {}
const API_URL = import.meta.env.VITE_APP_THEME_API_URL;
const USER_URL = `${API_URL}/user`;
const GET_USERS_URL = `${API_URL}/users/query`;

export function getLedgerAccounts(
  searchTerm: string,
  ledgerTypeFilter: number,
  bearingTypeFilter: number,
  pageIndex: number
) {
  return postRequest<LedgerAccountsModel>(
    SEARCH_LEDGER_ACCOUNTS,
    {
      pageMax: 25,
      pageIndex: searchTerm ? 1 : pageIndex,
      searchTerm: searchTerm,
      ledgerTypeFilter: ledgerTypeFilter,
      bearingTypeFilter: bearingTypeFilter,
    },
    true
  );
}

export function getLedgerAccountsForFilter() {
  return getRequest<LedgerAccountsForFilterModel>(GET_LEDGDER_FOR_FILTER, true);
}

export function getPrivateLedgerAccounts() {
  return getRequest<PrivateLedgersModel>(GET_PRIVATE_LEDGDER, true);
}

export function getReportingq5b() {
  return getRequest<PrivateLedgersModel>(GET_LEDGDER_FOR_REPORTING, true);
}

export function getVatTypesForLedger() {
  return getRequest<VatTypesForLedgerModel>(GET_VAT_FOR_LEDGER, true);
}

export function postLedgerAccount(
  id: number,
  title: string,
  code: string,
  defaultTaxTypeId: number,
  bearingType: number,
  reportReferenceType1: number,
  reportReferenceType2LegderAccountId: number,
  disableManualInput: boolean,
  taxDeductibleSettings: {
    isNotFullyTaxDeductible: boolean;
    taxDeductiblePercentage: number;
    deductiblePrivateLedgerAccountId: number;
  }
) {
  return postRequest<LedgerAccountsModel>(
    POST_LEDGER_ACCOUNT,
    {
      id: id,
      title: title,
      code: code,
      defaultTaxTypeId: defaultTaxTypeId,
      bearingType: bearingType,
      reportReferenceType1: reportReferenceType1,
      reportReferenceType2LegderAccountId: reportReferenceType2LegderAccountId,
      disableManualInput: disableManualInput,
      taxDeductibleSettings: {
        isNotFullyTaxDeductible: taxDeductibleSettings.isNotFullyTaxDeductible,
        taxDeductiblePercentage: taxDeductibleSettings.taxDeductiblePercentage,
        deductiblePrivateLedgerAccountId:
          taxDeductibleSettings.deductiblePrivateLedgerAccountId,
      },
    },
    true
  );
}

export function getVatById(editModalId: number) {
  return getRequest<VatTypeByIdModel>(`${GET_VAT_BY_ID}/${editModalId}`, true);
}

export function deleteLedgerAccount(id: number) {
  return deleteRequest<DeleteResult>(POST_LEDGER_ACCOUNT, [id], true);
}

const getUsers = (query: string): Promise<UsersQueryResponse> => {
  return axios
    .get(`${GET_USERS_URL}?${query}`)
    .then((d: AxiosResponse<UsersQueryResponse>) => d.data);
};

const getUserById = (id: ID): Promise<User | undefined> => {
  return axios
    .get(`${USER_URL}/${id}`)
    .then((response: AxiosResponse<Response<User>>) => response.data)
    .then((response: Response<User>) => response.data);
};

const createUser = (user: User): Promise<User | undefined> => {
  return axios
    .put(USER_URL, user)
    .then((response: AxiosResponse<Response<User>>) => response.data)
    .then((response: Response<User>) => response.data);
};

const updateUser = (user: User): Promise<User | undefined> => {
  return axios
    .post(`${USER_URL}/${user.id}`, user)
    .then((response: AxiosResponse<Response<User>>) => response.data)
    .then((response: Response<User>) => response.data);
};

const deleteUser = (userId: ID): Promise<void> => {
  return axios.delete(`${USER_URL}/${userId}`).then(() => {});
};

const deleteSelectedUsers = (userIds: Array<ID>): Promise<void> => {
  const requests = userIds.map((id) => axios.delete(`${USER_URL}/${id}`));
  return axios.all(requests).then(() => {});
};

export {
  deleteUser,
  deleteSelectedUsers,
  getUserById,
  createUser,
  updateUser,
  getUsers,
};
