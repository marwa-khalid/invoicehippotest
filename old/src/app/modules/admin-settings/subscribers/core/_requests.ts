import {
  getRequest,
  postRequest,
  deleteRequest,
} from "../../../auth/core/_apiservice";
import {
  SUBSCRIBER,
  GET_USAGE_QUOTAS,
  PROLONG_LICENSE,
  BILLING_DATA,
} from "./constants";
import { Subscriber, SubscriberModel } from "./_models";
import {
  BillingModel,
  GenericBooleanModel,
} from "../../../invoices/overview/core/_models";

export function getSubscribers(
  pageIndex: number,
  searchTerm: string,
  pageMax: number,
  dateRange?: any
) {
  return postRequest<SubscriberModel>(
    `${SUBSCRIBER}/search`,
    {
      pageMax: pageMax,
      pageIndex: searchTerm ? 1 : pageIndex,
      searchTerm: searchTerm,
      dateRange: dateRange,
    },
    true
  );
}

export function getSubscriberUsageQuotas(subscriberId?: number | string) {
  return getRequest<any>(`${GET_USAGE_QUOTAS}/${subscriberId}`, true);
}

export function getSubscriberById(id: number | string) {
  return getRequest<Subscriber>(`${SUBSCRIBER}/${id}`, true);
}

export function getBillingData(
  subscriberId: number,
  dateRange: any,
  pageMax: number
) {
  // if (dateRange && Object.keys(dateRange).length > 0) {
  //   payload.dateRange = dateRange;
  // }

  return postRequest<BillingModel>(
    BILLING_DATA,
    {
      pageMax: pageMax,
      pageIndex: 1,
      subscriberId,
      dateRange: dateRange,
    },
    true
  );
}

export function postSubscriberDetail(values: any) {
  return postRequest<SubscriberModel>(`${SUBSCRIBER}`, values, true);
}
export function prolongLicense(values: any) {
  return postRequest<SubscriberModel>(
    `${PROLONG_LICENSE}`,
    {
      subscriberId: 0,
      reActivateAccount: true,
      prolongationPeriodType: 1,
      disableTrialMode: true,
      proLongManagedSubAccounts: true,
    },
    true
  );
}

export function deleteSubscriber(id: number) {
  return deleteRequest<GenericBooleanModel>(SUBSCRIBER, [id.toString()], true);
}
