import axios, { AxiosRequestConfig } from "axios";
import { getAuth } from "./AuthHelpers";
import { toast } from "react-toastify";
import { getIntl } from "./../../../helpers/intlHelper";
import { getLang } from "../../../../_metronic/i18n/i18n";

async function apiRequest<T>(
  url: string,
  config: AxiosRequestConfig,
  useToken: boolean
): Promise<T> {
  try {
    const lang = getLang();
    if (useToken) {
      const auth = getAuth();

      const headers = {
        Authorization: "Bearer " + auth?.result.token,
        "X-Language-Type": lang,
      };
      config.headers = { ...headers, ...config.headers };
    } else {
      const headers = {
        "X-Language-Type": lang,
      };
      config.headers = { ...headers, ...config.headers };
    }

    const response = await axios(url, config);
    return response.data;
  } catch (error: any) {
    handleApiError(error, url); // Use the separate error handler
    throw error; // Rethrow the error if further handling is needed
  }
}

const shownErrors = new Set<string>(); // Track shown errors

export const handleApiError = (error: any, url: string): void => {
  const intl = getIntl();
  const errorKey = `${url}_${error?.response?.status || "network"}`; // Unique key for each API + error type

  shownErrors.add(errorKey);
  // Show the toast only when the Set has exactly 1 record
  if (shownErrors.size === 1) {
    if (!error.response) {
      // Network error
      toast.error(intl.formatMessage({ id: "Fields.ErrorNetworkError" }));
    } else {
      const { status } = error.response;
      if (status === 401) {
        toast.error(intl.formatMessage({ id: "Fields.ErrorNetwork401" }));
        setTimeout(() => {
          window.location.href = "/login"; // Adjust URL as needed
        }, 2000);
      } else {
        toast.error(`Error: ${status} ${error.response.statusText}`);
      }
    }

    // Optionally clear the error after some time
    setTimeout(() => {
      shownErrors.delete(errorKey);
    }, 5000);
  }
};

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
export async function putRequest<T>(
  url: string,
  useToken: boolean
): Promise<T> {
  //add POST mehtod string in here
  return apiRequest(
    url,
    {
      method: "PUT",
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
