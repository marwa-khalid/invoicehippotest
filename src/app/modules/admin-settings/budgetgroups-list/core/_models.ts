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
  subjects: {
    id: 6;
    hasChildren: boolean;
    children: null;
    title: string;
    extraValue: null;
    extraValue2: null;
    extraValue3: null;
    extraValue4: null;
    extraValue5: null;
    extraValue6: null;
    extraValue7: null;
    extraValue8: null;
    extraValue9: null;
    extraValue1number: null;
    extraValue11: null;
    extraValue12: null;
    extraValue13: null;
    extraValue14: null;
    extraValue15: null;
    text: string;
    isTrail: boolean;
    trailPath: null;
    isActive: boolean;
    hasChildrenForPartial: boolean;
    customCount: number;
    customCount2: number;
  }[];
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
