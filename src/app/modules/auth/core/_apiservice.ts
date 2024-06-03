import axios, { AxiosRequestConfig } from "axios";
 import { getAuth } from "./AuthHelpers";

async function apiRequest<T>(url: string, config: AxiosRequestConfig, useToken: boolean): Promise<T> {
  if(useToken){
    const auth = getAuth()
    const headers = { "Authorization": "Bearer " + auth?.result.token };
    config.headers = { ...headers, ...config.headers };
  }
    const response = await axios(url, config);
    return response.data;
  }
 
export async function getRequest<T>(url: string, useToken: boolean): Promise<T> {
//add GET mehtod string in here

  return apiRequest( url, {
    method: 'GET',
  },
  useToken);
}
 
export async function postRequest<T>(url: string, data: any, useToken: boolean): Promise<T> {
//add POST mehtod string in here
   return apiRequest( url, {
    method: 'POST',
    data: data,
  },
  useToken);
}
