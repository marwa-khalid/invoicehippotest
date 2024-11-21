import axios, { AxiosRequestConfig } from "axios";
import { getAuth } from "./AuthHelpers";
import { toast } from "react-toastify";

async function apiRequest<T>(
  url: string,
  config: AxiosRequestConfig,
  useToken: boolean
): Promise<T> {
  try {
    if (useToken) {
      const auth = getAuth();
      const headers = { Authorization: "Bearer " + auth?.result.token };
      config.headers = { ...headers, ...config.headers };
    }

    const response = await axios(url, config);
    return response.data;
  } catch (error: any) {
    // Check for network error or no response received from the server
    if (!error.response) {
      // It's a network error
      toast.error("Netwerk fout. Controleer uw internet verbinding.");
    } else {
      // Handle other errors (optional)
      toast.error(
        `Error: ${error.response.status} ${error.response.statusText}`
      );
    }
    throw error; // Rethrow the error if further handling is needed
  }
}

export async function getRequest<T>(
  url: string,
  useToken: boolean
): Promise<T> {
  //add GET mehtod string in here

  return apiRequest(
    url,
    {
      method: "GET",
    },
    useToken
  );
}

export async function postRequest<T>(
  url: string,
  data: any,
  useToken: boolean
): Promise<T> {
  //add POST mehtod string in here
  return apiRequest(
    url,
    {
      method: "POST",
      data: data,
    },
    useToken
  );
}

export async function deleteRequest<T>(
  url: string,
  data: any,
  useToken: boolean
): Promise<T> {
  //add POST mehtod string in here
  return apiRequest(
    url,
    {
      method: "DELETE",
      data: data,
    },
    useToken
  );
}
