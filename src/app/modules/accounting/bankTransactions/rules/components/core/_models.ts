import { BookingPostResult } from "../../../../bookings/components/core/_models";

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
  extraResult?: {
    automationAwaitingItemsCount: number;
  };
}
export interface CounterPartyAccounts {
  id: 0;
  title: "";
  accountNumber: "";
  displayName: "";
}
export interface BookingRuleResult {
  id: number;
  title: string;
  isDebet?: boolean;
  balanceType: number;
  isActive: boolean;
  associatedAccounts: {
    id: number;
    accountNumber: string;
    accountName: string;
    displayName?: string;
  }[];
  associatedAccountHolders: {
    id: number;
    accountNumber: string;
    accountName: string;
    displayName?: string;
  }[];
  clientId: number;
  filterTerm1: string;
  filterTerm2: string;
  clientCompanyName: string;
  filterByAmountType: number;
  filterByTextType1: number;
  filterByTextType2: number;
  filterByAmountTypeAsInt32: number;
  filterAmount: number;
  bookingRouteType: number;
  bookingRouteTypeAsInt32: number;
  ledgerAccountId: number;
  btwTypeId: number;
  bookingDescription: string;
  splitDeviation: {
    splitType: number;
    splitAmount: number;
    ledgerAccountId: number;
    vatTypeId: number;
  };
  hasSplitting: boolean;
}

//extraaa
export interface BankTransactionsResult {
  id: number;
  excludeFromAutoProcessing: boolean;
  transactionDate: string;
  transactionDateAsString: string;
  processStatusType: {
    value: number;
    name: string;
    description: string;
  };
  routedRelation: {
    id: number;
    description: string;
    voucherNr: string;
    attachmentCount: number;
    hasAttachments: boolean;
    routingType: {
      value: number;
      name: string;
      description: string;
    };
  };
  parsedInvoiceReference: string;
  internalReference: string;
  isBooked: boolean;
  documentFileName: string;
  actions: {
    canBeDeleted: boolean;
    canBeBooked: boolean;
    canBeAutoProcessed: boolean;
    canBeRestoreToAwaiting: boolean;
  };
  balanceType: {
    value: number;
    name: string;
    description: string;
  };
  accountInfo: {
    ledgerAccountId: number;
    name: string;
    number: string;
  };
  counterPartyAccountInfo: {
    ledgerAccountId: number;
    name: string;
    number: string;
    clientId: number;
    companyName: string;
    hasClient: boolean;
  };
  description: string;
  shortDescription: string;
  isDebet: boolean;
  amount: number;
  splittedMutationInfo: {
    parentAmount: number;
    actualAmount: number;
    isParentItem: boolean;
  };
  isSplittedTransaction: boolean;
  automationRoutingInfo: {
    ruleId: number;
    ruleTitle: string;
    ruleRoutingType: {
      value: number;
      name: string;
      description: string;
    };
  };
  canBeAutoRouted: boolean;
}

export interface AccountsResult {
  id: number;
  title: string;
  isLedgerAcount: boolean;
  paymentItemType: {
    value: number;
    name: string;
    description: string;
  };
}
export interface GetCountResult {
  automationAwaitingItemsCount: number;
}

export interface BookingMutationPostResult {
  bankMutationId: number;
  saveAsRule: boolean;
  isAutoBooking: boolean;
  model: BookingPostResult;
}
export type BookingMutationPostModel = ApiResponse<BookingMutationPostResult>;
export type BankTransactionsModel = ApiResponse<BankTransactionsResult[]>;
export type RestoreOrDeleteModel = ApiResponse<BankTransactionsResult>;
export type AccountsModel = ApiResponse<AccountsResult[]>;
export type GetCountModel = ApiResponse<GetCountResult>;

//keeepp
export type BookingRuleModel = ApiResponse<BookingRuleResult[]>;
export type BookingGetRuleModel = ApiResponse<BookingRuleResult>;
export type CounterPartyModel = ApiResponse<CounterPartyAccounts[]>;
