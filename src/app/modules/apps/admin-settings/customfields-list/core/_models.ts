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

export interface CustomFieldResult {
  id: number;
  uniqueId: string;
  areaUsageType: {
    value: number;
    name: string;
    description: string;
  };
  includeOnInvoiceType: {
    value: number;
    name: string;
    description: string;
  };
  includeOnQuoteType: {
    value: number;
    name: string;
    description: string;
  };
  fieldType: {
    value: number;
    name: string;
    description: string;
  };
  title: string;
  groupDisplayName: string;
  defaultValue: string;
  includeOnDocumentDisplayName: string;
  actions: {
    canEdit: boolean;
    canDelete: boolean;
  };
}
export type CustomFieldModel = ApiResponse<CustomFieldResult>;

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

export type DiscountMarginModel = ApiResponse<DiscountMarginResult>;
