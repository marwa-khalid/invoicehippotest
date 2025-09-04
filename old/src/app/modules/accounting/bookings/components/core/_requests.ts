import {
  ActivitiesModel,
  MutationsModel,
  BookingPostModel,
  AttachmentsModel,
  BookingsModel,
} from "./_models";

import {
  getRequest,
  postRequest,
  deleteRequest,
} from "../../../../auth/core/_apiservice";
import {
  GET_COMPANY_TRADE_NAMES,
  GET_DEFAULT_EMPTY,
  MIN_MAX_YEAR,
  BOOKING_MUTATIONS,
  GET_ACTION_HISTORY,
  BOOKING_API,
  GET_ATTACHMENTS,
  BOOKING_ATTACHMENT,
  BOOKING_MUTATION,
} from "./constants";
import { GenericBooleanModel } from "../../../../quotes/overview/core/_models";
import {
  BankTransactionsModel,
  BookingMutationPostModel,
  RestoreOrDeleteModel,
} from "../../../bankTransactions/overview/components/core/_models";

interface DeleteResult extends Partial<BookingPostModel> {}

export function getBookings(
  searchTerm: string,
  pageIndex: number,
  pageMax: number,
  clientId: number | null,
  dateRange: any,
  includingAttachmentsType: number,
  includingPaymentSourceType: number
) {
  return postRequest<BookingsModel>(
    `${BOOKING_API}/search`,
    {
      pageMax: pageMax,
      pageIndex: searchTerm ? 1 : pageIndex,
      searchTerm: searchTerm,
      dateRange: dateRange,
      clientId: clientId,
      includingAttachmentsType: includingAttachmentsType,
      includingPaymentSourceType: includingPaymentSourceType,
    },
    true
  );
}
export function getBookingActivitiesById(id: number) {
  return getRequest<ActivitiesModel>(`${GET_ACTION_HISTORY}/${id}`, true);
}

export function getAttachmentsForBooking(bookingId: number) {
  return getRequest<AttachmentsModel>(`${GET_ATTACHMENTS}/${bookingId}`, true);
}

export function getBookingMutationsById(id: number) {
  return getRequest<MutationsModel>(`${BOOKING_MUTATIONS}/${id}`, true);
}

export function postBookingItem(values: any) {
  return postRequest<BookingPostModel>(BOOKING_API, values, true);
}
export function postBookingForMutation(
  id: number,
  saveAsRule: boolean,
  isAutoBooking: boolean,
  values: any
) {
  return postRequest<RestoreOrDeleteModel>(
    BOOKING_MUTATION,
    {
      bankMutationId: id,
      saveAsRule: saveAsRule,
      isAutoBooking: isAutoBooking,
      model: values,
    },
    true
  );
}

export function attachBookingFile(
  inboxItemId: number,
  fileId: number,
  bookingId: number
) {
  return postRequest<GenericBooleanModel>(
    `${BOOKING_ATTACHMENT}/${bookingId}`,
    {
      inboxItemId,
      fileId,
    },
    true
  );
}

export function getBookingById(editModalId: number) {
  return getRequest<BookingPostModel>(`${BOOKING_API}/${editModalId}`, true);
}

export function getDefaultEmpty() {
  return getRequest<BookingPostModel>(`${GET_DEFAULT_EMPTY}`, true);
}

export function deleteBookingRecord(id: number, keepAttachments: boolean) {
  return deleteRequest<DeleteResult>(
    BOOKING_API,
    { bookingId: id, keepAttachments: keepAttachments },
    true
  );
}

export function getTradeNames() {
  return getRequest<any>(GET_COMPANY_TRADE_NAMES, true);
}
export function getMinMaxYear() {
  return getRequest<any>(MIN_MAX_YEAR, true);
}
