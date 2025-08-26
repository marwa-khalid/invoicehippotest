// utils/bookingDetails.ts
export const BOOKING_DETAILS = (bookingList: any, intl: any) => [
  {
    iconClass: "ki-duotone ki-calendar", // Icon for booking Date
    labelId: "Fields.BookingDate",
    value: bookingList.bookingDateAsString, // The value to display
    colorClass: "text-primary",
    attachmentsCount: bookingList.attachmentsCount,
    hasAttachments: bookingList.hasAttachments,
  },
  {
    iconClass: "", // Icon for Due Date
    value2: bookingList.title,
    value: bookingList.client,
    colorClass: "text-warning",
  },
  {
    iconClass: "ki-duotone ki-document", // Icon for Company Trade Name
    labelId: "Fields.CompanyTradeNameId",
    value: bookingList.companyTradeName,
    colorClass: "text-warning",
  },
];
