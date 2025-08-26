export const TRANSACTION_DETAILS = (transaction: any, intl: any) => [
  {
    iconClass: "ki-duotone ki-calendar", // Icon for Invoice Date
    labelId: "",
    hasAttachments: transaction.routedRelation?.hasAttachments,
    attachmentsCount: transaction.routedRelation?.attachmentCount,
    value2: transaction.transactionDateAsString,
    value3: transaction.description,
    value: transaction.accountInfo.number, // The value to display
    colorClass: "text-primary",
  },
  {
    iconClass: "", // Icon for Due Date
    labelId: "",
    value2: transaction.counterPartyAccountInfo.name,
    value: transaction.counterPartyAccountInfo.number,
    colorClass: "text-primary",
  },
];
