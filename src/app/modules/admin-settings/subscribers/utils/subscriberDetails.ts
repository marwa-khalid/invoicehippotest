// utils/invoiceDetails.ts
export const SUBSCRIBER_DETAILS = (subscriber: any, intl: any) => [
  {
    iconClass: "ki-duotone ki-calendar", // Icon for Invoice Date
    labelId: "Fields.StartDate",
    value: subscriber.lastActiveLicense.validFromAsString, // The value to display
    colorClass: "text-primary",
  },
  {
    iconClass: "ki-duotone ki-calendar", // Icon for Due Date
    labelId: "Fields.EndDate",
    value: subscriber.lastActiveLicense.validTillAsString,
    colorClass: "text-danger",
  },
  {
    iconClass: "", // Icon for Subscription Period
    labelId: "Fields.LicenseProgressPercentage",
    hasProgress: true,
    value: subscriber.lastActiveLicense.usagePercentage,
    colorClass: "text-danger",
  },
];
