import {
  CompanyModel,
  CompanyResult,
  CompanySettingsModel,
  TradeNamesModel,
  TradeNamesPostModel,
  TradeNamesPostResult,
} from "./_models";

import {
  getRequest,
  postRequest,
  deleteRequest,
} from "../../../auth/core/_apiservice";
import {
  COMPANY_DATA,
  COMPANY_SETTINGS,
  TRADENAMES,
  GET_USAGE_QUOTAS,
} from "./constants";
import { GenericBooleanModel } from "../../../quotes/overview/core/_models";

interface PartialResult extends Partial<CompanyModel> {}

export function getCompanyById(id: number | undefined) {
  return getRequest<CompanyModel>(`${COMPANY_DATA}/${id}`, true);
}

export function getTradenameById(id: number) {
  return getRequest<TradeNamesPostModel>(`${TRADENAMES}/${id}`, true);
}

export function postTradename(values: TradeNamesPostResult) {
  return postRequest<TradeNamesPostModel>(TRADENAMES, values, true);
}
export function getTradenames(companyId?: number) {
  return getRequest<TradeNamesModel>(`${TRADENAMES}/list/${companyId}`, true);
}
export function getCompanySettings(id: number | undefined) {
  return getRequest<CompanySettingsModel>(`${COMPANY_SETTINGS}/${id}`, true);
}

export function getUsageQuotas(companyId?: number) {
  return getRequest<any>(`${GET_USAGE_QUOTAS}/${companyId}`, true);
}

export function postCompanyData(values: any) {
  return postRequest<CompanyModel>(COMPANY_DATA, values, true);
}

export function deleteTradeName(id: number) {
  return deleteRequest<GenericBooleanModel>(TRADENAMES, [id], true);
}
