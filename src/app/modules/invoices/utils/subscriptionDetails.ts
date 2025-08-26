
// utils/subscriptionDetails.ts
export const SUBSCRIPTION_DETAILS = (subscription: any, intl: any) => [

  {
    iconClass: "ki-duotone ki-calendar", // Icon for Invoice Date
    labelId: "Fields.InvoiceDate",
    value: subscription.invoiceDateAsString, // The value to display
    colorClass: "text-primary",
    attachmentsCount: subscription.attachmentsCount,
    hasAttachments: subscription.hasAttachments,
  },
  {
    iconClass: "ki-duotone ki-calendar", // Icon for Subscription Period
    labelId: "Fields.InvoiceRecurringType",
    value: subscription.isAutomated
      ? subscription.automation?.rootRecurringCycleType.description
      : null,
    colorClass: "text-muted",
  },
];
