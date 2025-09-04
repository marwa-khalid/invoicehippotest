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

export interface BudgetPost {
  id: number;
  title: string;
  description: string;
  budgetGroupId: number | null;
  relatedLedgerAccounts: number[];
}
export interface BudgetResult {
  id: number;
  title: string;
  description: string;
  hasBudgetGroup: boolean;
  budgetGroup: {
    id: number;
    title: string;
    description: string;
    subjects: {
      id: number;
      title: string;
      description: string;
      orderIndex: number;
      relatedLedgerAccounts: number[];
    }[];
  };
  hasRelatedLedgerAccounts: boolean;
  relatedLedgerAccounts: {
    id: number;
    title: string;
    code: string;
  }[];
  actions: {
    canEdit: boolean;
    canDelete: boolean;
  };
}
export type BudgetPostModel = ApiResponse<BudgetPost>;
export type BudgetModel = ApiResponse<BudgetResult[]>;
