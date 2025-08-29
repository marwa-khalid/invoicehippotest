// utils/invoiceDetails.ts
export const INVOICE_DETAILS = (invoiceList: any, intl: any) => [
  {
    iconClass: "ki-duotone ki-calendar", // Icon for Invoice Date
    labelId: "Fields.InvoiceDate",
    value: invoiceList.invoiceDateAsString, // The value to display
    colorClass: "text-primary",
    attachmentsCount: invoiceList.attachmentsCount,
    hasAttachments: invoiceList.hasAttachments,
  },
  {
    iconClass: "ki-duotone ki-calendar", // Icon for Due Date
    labelId: "Fields.InvoiceDueDate",
    value: invoiceList.invoiceDueDateAsString,
    colorClass: "text-danger",
  },
  {
    iconClass: "ki-duotone ki-calendar", // Icon for Subscription Period
    labelId: "Fields.InvoiceSubscriptionPeriod",
    value: invoiceList.isAutomated
      ? invoiceList.automation.hasPeriodInfo
        ? `${invoiceList.automation?.periodStartDateAsString} t/m ${invoiceList.automation?.periodEndDateAsString}`
        : null
      : null,
    colorClass: "text-muted",
  },
  {
    iconClass: "ki-duotone ki-document", // Icon for Company Trade Name
    labelId: "Fields.CompanyTradeNameId",
    value: invoiceList.companyTradeName,
    colorClass: "text-warning",
  },
  {
    iconClass: "ki-duotone ki-receipt-square", // Icon for invoice number
    labelId: "orderNr",
    value: invoiceList.hasRelatedOrder
      ? invoiceList.relatedOrder?.orderNr
      : null,
    colorClass: "text-dark",
  },
];
