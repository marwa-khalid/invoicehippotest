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

interface PrimaryContact {
  id: number;
  fullName: string;
  phoneNrs: string[];
  emailAddress: string;
  displayName: string;
}

interface Contact {
  id: number;
  fullName: string;
  phoneNrs: string[];
  emailAddress: string;
  displayName: string;
}

interface Actions {
  canEdit: boolean;
  canDelete: boolean;
  canView: boolean;
  canTakeOverAccount: boolean;
  canRevokeAccess: boolean;
  canCreateInvoice: boolean;
  canCreateQuote: boolean;
}

interface Totals {
  totalIncomeAmount: number;
  totalCostAmount: number;
  totalProfitAmount: number;
  totalIncomeCount: number;
  totalCostCount: number;
  totalQuotesCount: number;
  hasTotals: boolean;
}

export interface ClientResult {
  id: number;
  takeOverSubscriberId: number;
  displayName: string;
  customerNr: string;
  businessName: string;
  primaryContact: PrimaryContact;
  contacts: Contact[];
  totalContactsCount: number;
  hasPrimaryContact: boolean;
  clientTypes: string[];
  isPrivateClient: boolean;
  actions: Actions;
  totals: Totals;
  hasTotals: boolean;
}

export type ClientModel = ApiResponse<ClientResult[]>;

//extraaaaa
interface AccountType {
  value: number;
  name: string;
  description: string;
}

interface BankAccountCompanyType {
  value: number;
  name: string;
  description: string;
}

interface BankConnectInfo {
  isConnected: boolean;
  isActive: boolean;
  accessExpirtationDate: string;
  lastSyncRequestDate: string;
}

interface Actions {
  canEdit: boolean;
  canDelete: boolean;
  canRevokeAutomation: boolean;
  canExtendAutomation: boolean;
}

export interface FinancialAccountsResult {
  id: number;
  accountName: string;
  accountNumber: string;
  ledgerAccountDisplayName: string;
  ledgerAccountId: number;
  accountType: AccountType;
  bankAccountCompanyType: BankAccountCompanyType;
  bankConnectInfo: BankConnectInfo;
  actions: Actions;
}

interface FinancialAccountByIdResult {
  id: number;
  accountName: string;
  accountNumber: string;
  ledgerAccountId: number;
  bankConnectMinImportDate: string;
  accountType: number;
  autoCreateLedgerAccount: boolean;
  bankAccountCompanyType: number;
  afterSaveModel: {
    ledgerAccountDisplayName: string;
  };
  bankConnectInfo: BankConnectInfo;
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

export interface FinancialInstitutionsResult {
  id: string;
  name: string;
  transactionTotalDays: number;
  logo: string;
}

export interface AccountAutomationResult {
  requestUrlForConsent: string;
}

export type FinancialAccountsModel = ApiResponse<FinancialAccountsResult>;
export type FinancialAccountByIdModel = ApiResponse<FinancialAccountByIdResult>;
export type PrivateLedgersModel = ApiResponse<BalanceItem[]>;
export type FinancialInstitutionsModel = ApiResponse<
  FinancialInstitutionsResult[]
>;
export type AccountAutomationModel = ApiResponse<AccountAutomationResult>;
