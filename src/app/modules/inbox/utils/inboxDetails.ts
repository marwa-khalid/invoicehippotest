export const INBOX_DETAILS = (inboxList: any, intl: any) => [
  {
    iconClass: "ki-duotone ki-calendar", // Icon for Due Date
    labelId: "Fields.DocumentDate",
    value: inboxList.documentDateAsString,
    colorClass: "text-primary",
  },
  ...(inboxList.dateOfUploadAsString !== inboxList.documentDateAsString
    ? [
        {
          iconClass: "ki-duotone ki-calendar", // Icon for Due Date
          labelId: "Fields.DateOfUpload",
          value: inboxList.dateOfUploadAsString,
          colorClass: "text-primary",
        },
      ]
    : []),
];
