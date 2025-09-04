import { CostListModel, CostPostModel, CostPostResult } from "./_models";
import { AttachmentsModel } from "../../../bookings/components/core/_models";
import {
  ActivitiesModel,
  MutationsModel,
} from "../../../bookings/components/core/_models";
import {
  getRequest,
  postRequest,
  deleteRequest,
} from "../../../../auth/core/_apiservice";
import {
  GET_COMPANY_TRADE_NAMES,
  GET_DEFAULT_EMPTY,
  MIN_MAX_YEAR,
  GET_ATTACHMENTS,
  COST_API,
  COST_MUTATIONS,
  COST_ATTACHMENT,
  COST_ACTION_HISTORY,
  COST_MUTATION,
} from "./constants";
import { GenericBooleanModel } from "../../../../quotes/overview/core/_models";
import {
  BookingMutationPostModel,
  RestoreOrDeleteModel,
} from "../../../bankTransactions/overview/components/core/_models";

export function getCosts(
  searchTerm: string,
  pageIndex: number,
  dateRange: any,
  clientId: number | null,
  attachmentType: number,
  paymentSourceType: number,
  statusTypes: string[]
) {
  return postRequest<CostListModel>(
    `${COST_API}/search`,
    {
      pageMax: 25,
      pageIndex: searchTerm ? 1 : pageIndex,
      searchTerm: searchTerm,
      dateRange: dateRange,
      clientId: clientId,
      includingAttachmentsType: attachmentType,
      includingPaymentSourceType: paymentSourceType,
      statusTypes: statusTypes,
    },
    true
  );
}

export function getCostsForPicker(
  searchTerm: string,
  pageIndex: number,
  dateRange: any,
  mutationId: number
) {
  return postRequest<CostListModel>(
    `${COST_API}/search`,
    {
      pageMax: 5,
      pageIndex: searchTerm ? 1 : pageIndex,
      searchTerm: searchTerm,
      dateRange: dateRange,
      bankMutationId: mutationId,
    },
    true
  );
}

export function postCostItem(values: CostPostResult) {
  return postRequest<CostPostModel>(COST_API, values, true);
}
export function postCostForMutation(
  id: number,
  saveAsRule: boolean,
  isAutoBooking: boolean,
  values: any
) {
  return postRequest<RestoreOrDeleteModel>(
    COST_MUTATION,
    {
      bankMutationId: id,
      saveAsRule: saveAsRule,
      isAutoBooking: isAutoBooking,
      model: values,
    },
    true
  );
}

export function deleteCostRecord(id: number, keepAttachments: boolean) {
  return deleteRequest<GenericBooleanModel>(
    COST_API,
    { invoiceId: id, keepAttachments: keepAttachments },
    true
  );
}

export function getCostById(editModalId: number) {
  return getRequest<CostPostModel>(`${COST_API}/${editModalId}`, true);
}

export function getDefaultEmpty() {
  return getRequest<CostPostModel>(`${GET_DEFAULT_EMPTY}`, true);
}

export function getCostActivitiesById(id: number) {
  return getRequest<ActivitiesModel>(`${COST_ACTION_HISTORY}/${id}`, true);
}

export function getAttachmentsForCost(id: number) {
  return getRequest<AttachmentsModel>(`${GET_ATTACHMENTS}/${id}`, true);
}

export function getCostMutationsById(id: number) {
  return getRequest<MutationsModel>(`${COST_MUTATIONS}/${id}`, true);
}

export function attachCostFile(
  inboxItemId: number,
  fileId: number,
  id: number
) {
  return postRequest<GenericBooleanModel>(
    `${COST_ATTACHMENT}/${id}`,
    {
      inboxItemId,
      fileId,
    },
    true
  );
}

export function getTradeNames() {
  return getRequest<any>(GET_COMPANY_TRADE_NAMES, true);
}

//extraa
export function getMinMaxYear() {
  return getRequest<any>(MIN_MAX_YEAR, true);
}
