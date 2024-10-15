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

export interface QuotePostResult {
  id: number;
  isQuoteEditable: boolean;
  status: number;
  attachmentsTempId: string;
  title: string;
  downloadInfo: any;
  header: {
    prospect: any;
    hasProspect: boolean;
    quoteDate: string;
    clientId: number;
    clientContactId: number;
    deadLineForAcceptanceDays: number;
    clientReferenceNr: string;
    valutaType: number;
    companyTradeNameId: number;
    hasCompanyTradeName: boolean;
    clientDisplayName: string;
  };
  customizations: {
    useCustomQuoteNr: boolean;
    customQuoteNr: string;
    hideProductCodes: boolean;
    notificationCycleId: number;
    dontSendRemindersOnlyTrackStatus: boolean;
  };
  products: {
    productId: number;
    title: string;
    code: string;
    description: string;
    units: number;
    unitPrice: number;
    companyUnitTypeId: number;
    btwExclusive: boolean;
    includeLinkedProductDesciption: boolean;
    linkedProductDescription: string;
    linkedProductId: number;
    hasLinkedProductDescription: boolean;
    hasDescription: boolean;
    verifiedDescription: string;
    ledgerAccountId: number;
    vatTypeId: number;
    discountMarginId: number;
    orderIndex: number;
    isValidProduct: boolean;
  }[];
  comments: {
    quoteComments: string;
    privateComments: string;
  };
  customFields: any[];
  hasCustomFields: boolean;
  attachments: any;
  hasAttachments: boolean;
}

export interface QuoteListResult {
  id: number;
  oData: string;
  client: string;
  clientReferenceNr: string;
  quoteNr: string;
  hasClientReferenceNr: boolean;
  quoteStatus: QuoteStatus;
  isDraft: boolean;
  quoteDate: string;
  quoteDateAsString: string;
  quoteDueDate: string;
  quoteDueDateAsString: string;
  attachmentsCount: number;
  hasAttachments: boolean;
  isSendFromTradeName: boolean;
  companyTradeName: string;
  relatedInvoice: RelatedInvoice;
  hasRelatedInvoice: boolean;
  totals: Totals;
  downloadInfo: DownloadInfo;
  valuta: Valuta;
  actions: Actions;
  activeSendInstructions: ActiveSendInstructions;
  hasActiveSendInstructions: boolean;
}

interface QuoteStatus {
  value: number;
  name: string;
  description: string;
}

interface RelatedInvoice {
  id: number;
  voucherNr: string;
  hasVoucherNr: boolean;
  invoiceNr: string;
  invoiceDate: string;
  invoiceDateAsString: string;
  relationType: RelationType;
}

interface RelationType {
  value: number;
  name: string;
  description: string;
}

interface Totals {
  totalPriceWithVAT: number;
  totalVATAmount: number;
  totalPrice: number;
}

interface DownloadInfo {
  fileName: string;
  fileId: number;
  fileType: FileType;
  fileExtension: string;
  canView: boolean;
  downloadUrl: string;
}

interface FileType {
  value: number;
  name: string;
  description: string;
}

interface Valuta {
  valutaType: ValutaType;
  sign: string;
}

interface ValutaType {
  value: number;
  name: string;
  description: string;
}

interface Actions {
  canEdit: boolean;
  canDelete: boolean;
  canSend: boolean;
  canCreateCopy: boolean;
  canShowPreview: boolean;
  canAddAttachments: boolean;
  canDownload: boolean;
  canFinalize: boolean;
  canApprove: boolean;
  canReOpen: boolean;
  canCreateInvoice: boolean;
}

interface ActiveSendInstructions {
  quoteId: number;
  overrideNotificationType: number;
  finalizeQuote: boolean;
  emailOptions: EmailOptions;
  actionType: number;
  adjustQuoteDateToToday: boolean;
}

interface EmailOptions {
  sendToClient: boolean;
  sendMeAnCopy: boolean;
  extraToRecipients: string[];
  extraCcRecipients: string[];
  extraBccRecipients: string[];
  hasCustomTemplate: boolean;
  customTemplate: CustomTemplate;
}

interface CustomTemplate {
  templateType: number;
  useCustomTemplate: boolean;
  body: string;
  subject: string;
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

export type QuotePostModel = ApiResponse<QuotePostResult>;
export type QuoteListModel = ApiResponse<QuoteListResult>;
export type FinancialAccountByIdModel = ApiResponse<FinancialAccountByIdResult>;
export type PrivateLedgersModel = ApiResponse<BalanceItem[]>;
export type FinancialInstitutionsModel = ApiResponse<
  FinancialInstitutionsResult[]
>;
export type AccountAutomationModel = ApiResponse<AccountAutomationResult>;
