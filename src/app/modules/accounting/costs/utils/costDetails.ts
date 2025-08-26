export const COST_DETAILS = (costList: any, intl: any) => [
  {
    iconClass: "ki-duotone ki-calendar", // Icon for Invoice Date
    labelId: "Fields.PurchaseDate",
    value: costList.invoiceDateAsString, // The value to display
    colorClass: "text-primary",
    attachmentsCount: costList.attachmentsCount,
    hasAttachments: costList.hasAttachments,
  },
  {
    iconClass: "ki-duotone ki-calendar", // Icon for Due Date
    labelId: "Fields.InvoiceDueDate",
    value: costList.invoiceDueDateAsString,
    colorClass: "text-danger",
  },
  {
    iconClass: "ki-duotone ki-document", // Icon for Company Trade Name
    labelId: "Fields.CompanyTradeName",
    value: costList.companyTradeNameId,
    colorClass: "text-warning",
  },
];
