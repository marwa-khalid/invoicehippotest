import axios, { AxiosResponse } from "axios";
import { ID, Response } from "../../../../../../_metronic/helpers";
import { User, UsersQueryResponse } from "./_models";

const API_URL = import.meta.env.VITE_APP_THEME_API_URL;
const USER_URL = `${API_URL}/user`;
const GET_USERS_URL = `${API_URL}/users/query`;
import { getRequest, postRequest } from "../../../../auth/core/_apiservice";
import { SEARCH_VAT_TYPES, GET_VAT_BY_ID } from "./constants";
import { VatTypesModel, VatTypeByIdModel } from "./_models";
// export function getUsers(query: string): Promise<UsersQueryResponse> => {
//   return axios
//     .get(`${GET_USERS_URL}?${query}`)
//     .then((d: AxiosResponse<UsersQueryResponse>) => d.data);
// };

export function getVatTypes(searchTerm: string, pageIndex:number) {
  return postRequest<VatTypesModel>(
    SEARCH_VAT_TYPES,
    {
      pageMax: 0,
      pageIndex: pageIndex,
      searchTerm: searchTerm,
      templateIdFilter: 0,
      vatAreaUsageTypeFilter: 0,
    },
    true
  );
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

export function getVatById(id: number) {
  return getRequest<VatTypeByIdModel>(`${GET_VAT_BY_ID}/${id}`, true);
}

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

export { deleteUser, deleteSelectedUsers, getUserById, createUser, updateUser,getUsers };
