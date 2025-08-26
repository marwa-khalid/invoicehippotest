
export const INBOX_ARCHIVE_DETAILS = (inboxList: any, intl: any) => [
  {
    iconClass: "ki-duotone ki-calendar", // Icon for Due Date
    labelId: "Fields.DocumentDate",
    value: inboxList.documentDateAsString,
    colorClass: "text-danger",
  },
  {
    iconClass: "ki-duotone ki-calendar", // Icon for Due Date
    labelId: "Fields.DateOfUpload",
    value: inboxList.dateOfUploadAsString,
    colorClass: "text-primary",
  },
];
  