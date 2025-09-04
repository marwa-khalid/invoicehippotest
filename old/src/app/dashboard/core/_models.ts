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

interface FinancialSummaryLabel {
  title: string;
  openCount?: string;
  overDueCount?: string;
  openAmount?: string;
  overDueAmount?: string;
  draftCount?: string;
  draftAmount?: string;
  scheduledCount?: string;
  scheduledAmount?: string;
  openSepaVerificationsCount?: string;
  openDraftCount?: string;
  noDataInfo: string;
}

export interface FinancialSummaryBase {
  totalCount: number;
  openCount: number;
  overDueCount: number;
  openAmount: number;
  overDueAmount: number;
  labels: FinancialSummaryLabel;
  hasData: boolean;
}

export interface InvoiceSummary extends FinancialSummaryBase {
  draftCount: number;
  draftAmount: number;
  scheduledCount: number;
  scheduledAmount: number;
  openSepaVerificationsCount: number;
}

export interface QuoteSummary extends FinancialSummaryBase {
  openDraftCount: number;
}

export interface OpenTotalsResult {
  invoices: InvoiceSummary;
  receipts: FinancialSummaryBase;
  quotes: QuoteSummary;
}
export type OpenTotalsModel = ApiResponse<OpenTotalsResult>;
