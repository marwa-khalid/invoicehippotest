import { NotificationCycleItem } from "./_models";

import {
  getRequest,
  postRequest,
  deleteRequest,
} from "../../../auth/core/_apiservice";
import { NOTIFICATION_CYCLES } from "./constants";
import { NotificationSearchModel, NotificationCycleModel } from "./_models";
import { GenericBooleanModel } from "../../../invoices/overview/core/_models";

export function getNotificationCycle(
  pageIndex: number,
  searchTerm: string,
  notificationCycleAreaUsageType: number
) {
  return postRequest<NotificationSearchModel>(
    `${NOTIFICATION_CYCLES}/search`,
    {
      pageMax: 25,
      pageIndex: searchTerm ? 1 : pageIndex,
      searchTerm: searchTerm,
      notificationCycleAreaUsageType: notificationCycleAreaUsageType,
    },
    true
  );
}

export function postNotificationCycle(values: NotificationCycleItem) {
  return postRequest<NotificationCycleModel>(
    `${NOTIFICATION_CYCLES}`,
    values,
    true
  );
}

export function getNotificationById(id: number) {
  return getRequest<NotificationCycleModel>(
    `${NOTIFICATION_CYCLES}/${id}`,
    true
  );
}

export function deleteReminder(id: number) {
  return deleteRequest<GenericBooleanModel>(NOTIFICATION_CYCLES, [id], true);
}
