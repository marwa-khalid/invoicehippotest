// utils/quoteDetails.ts
export const QUOTE_DETAILS = (quote: any, intl: any) => [
  {
    iconClass: "ki-duotone ki-calendar", // Icon for Invoice Date
    labelId: "Fields.InvoiceDate",
    value: quote.quoteDateAsString, // The value to display
    colorClass: "text-primary",
    attachmentsCount: quote.attachmentsCount,
    hasAttachments: quote.hasAttachments,
  },
  {
    iconClass: "ki-duotone ki-calendar", // Icon for Due Date
    labelId: "Fields.InvoiceDueDate",
    value: quote.quoteDueDateAsString,
    colorClass: "text-danger",
  },
  {
    iconClass: "ki-duotone ki-receipt-square", // Icon for invoice number
    labelId: "Fields.InvoiceNr",
    value: quote.relatedInvoice?.invoiceNr,
    colorClass: "text-dark",
  },
  {
    iconClass: "ki-duotone ki-document", // Icon for Company Trade Name
    labelId: "Fields.CompanyTradeNameId",
    value: quote.companyTradeName,
    colorClass: "text-warning",
  },
];
