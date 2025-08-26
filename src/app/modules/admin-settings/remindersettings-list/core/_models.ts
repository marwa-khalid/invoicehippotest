interface ApiResponse<T> {
  pageIndex: number;
  totalRows: number;
  totalPages: number;
  currentRows: number;
  result: T;
  messages: {
    message: string;
    type: number;
  }[];
  hasErrors: boolean;
  isValid: boolean;
  textInfo: any;
}
export interface NotificationSearchResult {
  id: number;
  title: string;
  areaUsageType: {
    value: number;
    name: string;
    description: string;
  };
  isDefault: boolean;
  hasActiveReminder1: boolean;
  hasActiveReminder2: boolean;
  hasActiveReminder3: boolean;
  actions: {
    canEdit: boolean;
    canDelete: boolean;
  };
}

interface Reminder {
  isActive: boolean;
  sendMeAnCopy: boolean;
  reminderDays: number;
  emailReminderType: number;
}

export interface NotificationCycleItem {
  id: number;
  title: string;
  isDefault: boolean;
  areaUsageType: number;
  reminder1: Reminder;
  reminder2: Reminder;
  reminder3: Reminder;
}

export type NotificationSearchModel = ApiResponse<NotificationSearchResult[]>;
export type NotificationCycleModel = ApiResponse<NotificationCycleItem>;
