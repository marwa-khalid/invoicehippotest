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

export interface ProductGroupResult {
  id: number;
  title: string;
  actions: {
    canEdit: boolean;
    canDelete: boolean;
  };
}
export type ProductGroupModel = ApiResponse<ProductGroupResult>;
