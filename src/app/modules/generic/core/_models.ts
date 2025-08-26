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
export interface TaskResult {
  activeYear: number;
  title: string;
  gotoModule: boolean;
  invokeWizard: boolean;
  itemType: number;
  itemSubType: number;
  canClose: boolean;
  itemId: number;
  infoColor: string;
}

export type TaskModel = ApiResponse<TaskResult[]>;
