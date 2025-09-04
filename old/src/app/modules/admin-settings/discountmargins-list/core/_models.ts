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

export interface DiscountMarginResult {
  id: number;
  title: string;
  isPercentageMargin: boolean;
  amount: number;
  actions: {
    canEdit: boolean;
    canDelete: boolean;
  };
}

export interface ProductGroupResult {
  id: number;
  title: string;
  actions: {
    canEdit: boolean;
    canDelete: boolean;
  };
}

export type DiscountMarginModel = ApiResponse<DiscountMarginResult>
export type ProductGroupModel = ApiResponse<ProductGroupResult>;
