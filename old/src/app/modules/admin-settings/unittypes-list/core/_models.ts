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

export interface UnitTypesResult {
  id: number;
  title: string;
  isDefault: boolean;
  actions: {
    canEdit: boolean;
    canDelete: boolean;
  };
}
export type UnitTypesModel = ApiResponse<UnitTypesResult>;
