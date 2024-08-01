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

export interface LedgerAccountsResult {
  id: number;
  defaultTax: string;
  displayName: string;
  allowManualBookings: boolean;
  ledgerType: {
    value: number;
    name: string;
    description: string;
  };
  ledgerSubType: {
    value: number;
    name: string;
    description: string;
  };
  bearingType: {
    value: number;
    name: string;
    description: string;
  };
  notFullyDeductibleSettings: {
    isNotFullyTaxDeductible: boolean;
    taxDeductiblePercentage: string;
    privateLedgerAccount: string;
  };
  vatReportReferenceType1: {
    value: number;
    name: string;
    description: string;
  };
  vatReportReferenceType2: {
    value: number;
    name: string;
    description: string;
  };
  vatReportReferenceType2LedgerAccountDisplayName: string;
  actions: {
    canEdit: boolean;
    canDelete: boolean;
    canShowMutationsOverview: boolean;
  };
}
export interface BalanceItem {
  id: number;
  title: string;
  isDisabledForManualInput: boolean;
  hasDefaultVat: boolean;
  defaultVat: {
    id: number;
    title: string;
    value: number;
    hideOnDocuments: boolean;
    isAlwaysExBtw: boolean;
    isDefault: boolean;
    vatAreaUsageType: {
      value: number;
      name: string;
      description: string;
    };
    isDisabledForManualInput: boolean;
  };
  ledgerType: {
    value: number;
    name: string;
    description: string;
  };
  ledgerSubType: {
    value: number;
    name: string;
    description: string;
  };
  bearingType: {
    value: number;
    name: string;
    description: string;
  };
  vatReportReferenceType1: {
    value: number;
    name: string;
    description: string;
  };
  vatReportReferenceType2: {
    value: number;
    name: string;
    description: string;
  };
}

export interface LedgerAccountsForFilterResult {
  balanceActivaItemsGroupTitle: string;
  balanceActivaItems: BalanceItem[];
  balancePassivaItemsGroupTitle: string;
  balancePassivaItems: BalanceItem[];
  resultItemsGroupTitle: string;
  resultItems: BalanceItem[];
}

export interface LedgerAccountByIdResult {
  id: number;
  templateId: number;
  title: string;
  code: string;
  defaultTaxTypeId: number;
  bearingType: number;
  reportReferenceType1: number;
  reportReferenceType2LegderAccountId: number;
  disableManualInput: boolean;
  taxDeductibleSettings: {
    isNotFullyTaxDeductible: boolean;
    taxDeductiblePercentage: number;
    deductiblePrivateLedgerAccountId: number;
  };
}

export interface LedgerForVatResult {
  map(arg0: (account: any) => { value: any; label: any }): unknown;
  id: number;
  title: string;
  isDisabledForManualInput: boolean;
  hasDefaultVat: boolean;

  // Nested object for default VAT details
  defaultVat: {
    id: number;
    title: string;
    value: number;
    hideOnDocuments: boolean;
    isAlwaysExBtw: boolean;
    isDefault: boolean;

    // Nested object within defaultVat for VAT area usage type
    vatAreaUsageType: {
      value: number;
      name: string;
      description: string;
    };

    isDisabledForManualInput: boolean;
  };

  // Ledger and type details
  ledgerType: {
    value: number;
    name: string;
    description: string;
  };

  ledgerSubType: {
    value: number;
    name: string;
    description: string;
  };

  // Bearing type details
  bearingType: {
    value: number;
    name: string;
    description: string;
  };

  // VAT report reference types
  vatReportReferenceType1: {
    value: number;
    name: string;
    description: string;
  };

  vatReportReferenceType2: {
    value: number;
    name: string;
    description: string;
  };
}

interface VatListItem {
  id: number;
  title: string;
  value: number;
  hideOnDocuments: boolean;
  isAlwaysExBtw: boolean;
  isDefault: boolean;
  vatAreaUsageType: {
    value: number;
    name: string;
    description: string;
  };
  isDisabledForManualInput: boolean;
}

export interface VatTypesForLedgerResult {
  listForSalesGroupTitle: string;
  listForSales: VatListItem[];
  listForCostsGroupTitle: string;
  listForCosts: VatListItem[];
}

export type LedgerAccountsModel = ApiResponse<LedgerAccountsResult>;
export type LedgerAccountsForFilterModel =
  ApiResponse<LedgerAccountsForFilterResult>;
export type LedgerAccountByIdModel = ApiResponse<LedgerAccountByIdResult>;
export type VatTypesForLedgerModel = ApiResponse<VatTypesForLedgerResult>;
export type PrivateLedgersModel = ApiResponse<BalanceItem[]>;
