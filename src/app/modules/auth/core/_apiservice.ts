import axios, { AxiosRequestConfig } from "axios";

async function apiRequest<T>(url: string, config: AxiosRequestConfig): Promise<T> {
  const response = await axios(url, config);
  return response.data;
}

export default apiRequest;