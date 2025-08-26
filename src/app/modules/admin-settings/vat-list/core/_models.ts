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

export interface VatTypesResult {
  id: number;
  title: string;
  value: number;

  vatAreaUsageType: {
    value: 0;
    name: string;
    description: string;
  };
  ledgerAccountDisplayName: string;
  useInLists: true;
  isAlwaysExBtw: true;
  actions: {
    canEdit: boolean;
    canDelete: boolean;
  };
}

export interface VatTypeByIdResult {
  id: number;
  ledgerAccountId: number;
  templateId: number;
  title: string;
  value: number;
  vatAreaUsageType: number;
  isAlwaysExBtw: boolean;
  showOnDocuments: boolean;
  useInLists: boolean;
  isNoneVatType: boolean;
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

export type VatTypesModel = ApiResponse<VatTypesResult>;
export type VatTypeByIdModel = ApiResponse<VatTypeByIdResult>;
export type LedgerForVatModel = ApiResponse<LedgerForVatResult>;
