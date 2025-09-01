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

export type BudgetModel = ApiResponse<BudgetResult>;

//extraa
export interface ProductResult {
  id: number;
  title: string;
  displayName: string;
  code: string;
  description: string;
  units: number;
  unitType: string;
  unitPrice: number;
  totals: {
    totalPriceWithVAT: number;
    totalVATAmount: number;
    totalPrice: number;
  };
  vatTitle: string;
  supplier: string;
  productGroup: string;
  ledgerAccountDisplayName: string;
  actions: {
    canEdit: boolean;
    canDelete: boolean;
  };
  unitTypeId: number;
  vatTypeId: number;
  ledgerAccountId: number;
  btwExclusive: boolean;
  useDescriptionOnInvoice: boolean;
  useDescriptionOnQuote: boolean;
}
export type ProductModel = ApiResponse<ProductResult>;
