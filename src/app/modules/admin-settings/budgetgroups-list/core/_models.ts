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
export interface BudgetGroupResult {
  id: number;
  title: string;
  description: string;
  actions: {
    canEdit: boolean;
    canDelete: boolean;
  };
}

export interface BudgetGroupPost {
  id: number;
  title: string;
  description: string;
  subjects: {
    title: string;
    description: string;
    relatedLedgerAccounts: number[];
  }[];
}
export type BudgetGroupPostModel = ApiResponse<BudgetGroupPost>;
export type BudgetGroupModel = ApiResponse<BudgetGroupResult>;

//extraa
export interface ProductGroupResult {
  id: number;
  title: string;
  actions: {
    canEdit: boolean;
    canDelete: boolean;
  };
}
export type ProductGroupModel = ApiResponse<ProductGroupResult>;
