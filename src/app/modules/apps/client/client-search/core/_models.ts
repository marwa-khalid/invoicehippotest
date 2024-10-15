import { debug } from "webpack";

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

export interface ClientFormValues {
  customFields: {
    fieldLabel: string;
    fieldInfo: string;
    groupDisplayName: string;
    options: any[];
    fieldType: {
      value: number;
      description: string;
    };
    fieldId: number;
    value: {
      asDate: string;
      asText: string;
      asMoney: number;
      asNumber: number;
      asOptions: any[];
    };
  }[];
  id: number;
  companyId: number;
  customerNr: string;
  importReference: string;
  businessName: string;
  kvkNr: string;
  btwNr: string;
  isPrivateClient: boolean;
  factoringSessionStatement: string;
  clientTypes: any[];
  financialSettings: {
    bankAccountCompanyType: number;
    accountIbanNr: string;
    accountHolderName: string;
  };
  invoiceAndQuoteSettings: {
    defaultDeadlineDaysForPayment: number;
    defaultVatTypeId: number;
    defaultLedgerAccountId: number;
    extraCcEmailAddressesInvoice: any[];
    extraCcEmailAddressesQuotes: any[];
    costDefaultLedgerAccountId: number;
    costDefaultVatTypeId: number;
    costDefaultReference: string;
    costDefaultLineReference: string;
  };
  invoiceAddress: {
    id: number;
    streetName: string;
    houseNr: string;
    houseNrAddition: string;
    postCode: string;
    city: string;
    countryType: number;
  };
  deliveryAddress: {
    id: number;
    streetName: string;
    houseNr: string;
    houseNrAddition: string;
    postCode: string;
    city: string;
    countryType: number;
  };
  hasCustomFields: boolean;
}

export type ClientFormValuesModel = ApiResponse<ClientFormValues>;

export interface ContactResult {
  id: number;
  clientId: number;
  isDefaultContact: boolean;
  firstName: string;
  betweenName: string;
  lastName: string;
  addressingType: number;
  emailAddress: string;
  phoneNr: string;
  mobileNr: string;
  department: string;
}

export type ContactModel = ApiResponse<ContactResult[]>;

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

export interface VatTypesForClientResult {
  listForSalesGroupTitle: string;
  listForSales: VatListItem[];
}

export interface VatTypesForClientModel
  extends ApiResponse<VatTypesForClientResult> {}

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

export type FinancialAccountsModel = ApiResponse<FinancialAccountsResult>;
export type PrivateLedgersModel = ApiResponse<BalanceItem[]>;
