import axios, { AxiosResponse } from "axios";
import { ID, Response } from "../../../../../../_metronic/helpers";
import { User, UsersQueryResponse } from "./_models";

import {
  getRequest,
  postRequest,
  deleteRequest,
} from "../../../../auth/core/_apiservice";
import {
  SEARCH_LEDGER_ACCOUNTS,
  GET_LEDGDER_FOR_FILTER,
  GET_VAT_BY_ID,
  POST_VAT_TYPES,
  GET_LEDGDER_FOR_VAT,
} from "./constants";
import {
  LedgerAccountsModel,
  LedgerAccountsForFilterModel,
  VatTypeByIdModel,
  LedgerForVatModel,
} from "./_models";

//extra imports remove afterwards
import { VatTypesModel } from "../../vat-list/core/_models";
interface DeleteResult extends Partial<VatTypesModel> {}
const API_URL = import.meta.env.VITE_APP_THEME_API_URL;
const USER_URL = `${API_URL}/user`;
const GET_USERS_URL = `${API_URL}/users/query`;

export function getLedgerAccounts(
  searchTerm: string,
  ledgerTypeFilter: number,
  bearingTypeFilter: number,
  pageIndex: number
) {
  // pageIndex: number,
  // vatAreaUsageTypeFilter: number
  console.log(ledgerTypeFilter);
  return postRequest<LedgerAccountsModel>(
    SEARCH_LEDGER_ACCOUNTS,
    {
      pageMax: 25,
      pageIndex: pageIndex,
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
