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

interface NamedValue {
  value: number;
  name: string;
  description: string;
}

interface ExchangeRate {
  lastUpdated: string;
  rate: number;
}

interface Totals {
  totalPriceWithVAT: number;
  totalVATAmount: number;
  totalPrice: number;
  totalPayed: number;
  hasOpenAmount: boolean;
  totalOpen: number;
  payedPercentage: number;
}

interface RelatedInvoice {
  id: number;
  voucherNr: string;
  hasVoucherNr: boolean;
  invoiceNr: string;
  invoiceDate: string;
  invoiceDateAsString: string;
  relationType: NamedValue;
}

interface FileTypeList {
  value: number;
  name: string;
  description: string;
}

interface DownloadInfoList {
  fileName: string;
  fileId: number;
  fileType: FileTypeList;
  fileExtension: string;
  canView: boolean;
  downloadUrl: string;
}

interface Valuta {
  valutaType: NamedValue;
  sign: string;
}

interface Actions {
  canEdit: boolean;
  canDelete: boolean;
  canSend: boolean;
  canAlterSendInstructions: boolean;
  canCredit: boolean;
  canRegisterPayment: boolean;
  canCreateCopy: boolean;
  canShowPreview: boolean;
  canAddAttachments: boolean;
  canDownload: boolean;
  canSettle: boolean;
  canFinalize: boolean;
  canReInvokeSepaPayment: boolean;
  canSendSepaConfirmationForm: boolean;
  canInvokeOnlinePayment: boolean;
  canStopSubscription: boolean;
  canReStartSubscription: boolean;
}

interface EmailOptions {
  sendToClient: boolean;
  sendMeAnCopy: boolean;
  extraToRecipients: string[];
  extraCcRecipients: string[];
  extraBccRecipients: string[];
  hasCustomTemplate: boolean;
  customTemplate: {
    templateType: number;
    useCustomTemplate: boolean;
    body: string;
    subject: string;
  };
  sendToFactoringClient: boolean;
  sendToAccountantInbox: boolean;
}

interface ActiveSendInstructions {
  invoiceId: number;
  overrideNotificationType: number;
  finalizeInvoice: boolean;
  emailOptions: EmailOptions;
  actionType: number;
  adjustInvoiceDateToToday: boolean;
  skipSepaVerificationIfMandateIsValid: boolean;
}

interface Automation {
  invoiceTemplateId: number;
  periodStartDate: string;
  periodEndDate: string;
  periodEndDateBasedOnContractDate: string;
  periodStartDateBasedOnContractDate: string;
  periodInvoiceDate: string;
  hasAlternateContractDate: boolean;
  periodInvoiceDateAsString: string;
  periodEndDateBasedOnContractDateAsString: string;
  periodStartDateBasedOnContractDateAsString: string;
  hasPeriodInfo: boolean;
  rootScheduledNextAutomationDate: string;
  rootIsActive: boolean;
  rootRecurringCycleType: NamedValue;
  hasNextAutomationDate: boolean;
  periodStartDateAsString: string;
  periodEndDateAsString: string;
  nextAutomationDateAsString: string;
  contractDate: string;
  contractDateAsString: string;
  hasContractDate: boolean;
}

export interface SubscriptionListResult {
  id: number;
  uniqueId: string;
  oData: string;
  client: string;
  clientReferenceNr: string;
  clientHasActiveMandate: boolean;
  invoiceNr: string;
  voucherNr: string;
  hasVoucherNr: boolean;
  hasClientReferenceNr: boolean;
  invoiceStatus: NamedValue;
  balanceType: NamedValue;
  isDraft: boolean;
  invoiceDate: string;
  scheduledDate: string;
  invoiceDateAsString: string;
  hasScheduledDate: boolean;
  scheduledDateAsString: string;
  invoiceDueDate: string;
  invoiceDueDateAsString: string;
  attachmentsCount: number;
  hasAttachments: boolean;
  isSendFromTradeName: boolean;
  hasFactoringCompany: boolean;
  companyTradeName: string;
  exchangeRate: ExchangeRate;
  totals: Totals;
  foreignTotals: Totals;
  isCreditNota: boolean;
  relatedParentInvoice: RelatedInvoice;
  creditedInvoiceNr: string;
  creditInvoiceNr: string;
  hasBeenCredited: boolean;
  downloadInfo: DownloadInfoList;
  relatedCreditInvoice: RelatedInvoice;
  valuta: Valuta;
  companyValuta: Valuta;
  actions: Actions;
  activeSendInstructions: ActiveSendInstructions;
  hasActiveSendInstructions: boolean;
  isRootAutomatedSubscription: boolean;
  isAutomated: boolean;
  automation: Automation;
}

export type SubscriptionListModel = ApiResponse<SubscriptionListResult[]>;

//extraaa

interface PaymentItemType {
  value: number;
  name: string;
  description: string;
}

interface AccountItem {
  id: number;
  title: string;
  isLedgerAcount: boolean;
  paymentItemType: PaymentItemType;
}

export interface AccountsForPaymentResult {
  accountItemsGroupTitle: string;
  accountItems: AccountItem[];
  balanceActivaItemsGroupTitle: string;
  balanceActivaItems: AccountItem[];
  balancePassivaItemsGroupTitle: string;
  balancePassivaItems: AccountItem[];
  resultItemsGroupTitle: string;
  resultItems: AccountItem[];
}

export interface PaymentsResult {
  id: number;
  voucherNr: string;
  dateOfPayment: string;
  dateOfPaymentAsString: string;
  paymentMethodDescription: string;
  paymentAmount: number;
  isBookedFromTransaction: boolean;
  uniqueTransactionId: string;
  actions: {
    canDelete: boolean;
  };
}

export interface InvoiceListResult {
  id: number;
  uniqueId: string;
  oData: string;
  client: any;
  clientReferenceNr: string;
  clientHasActiveMandate: boolean;
  invoiceNr: string;
  voucherNr: string;
  hasVoucherNr: boolean;
  hasClientReferenceNr: boolean;
  invoiceStatus: {
    value: number;
    name: string;
    description: string;
  };
  balanceType: {
    value: number;
    name: string;
    description: string;
  };
  isDraft: boolean;
  invoiceDate: string; // ISO date string
  scheduledDate: string; // ISO date string
  invoiceDateAsString: string;
  hasScheduledDate: boolean;
  scheduledDateAsString: string;
  invoiceDueDate: string; // ISO date string
  invoiceDueDateAsString: string;
  attachmentsCount: number;
  hasAttachments: boolean;
  isSendFromTradeName: boolean;
  hasFactoringCompany: boolean;
  companyTradeName: string;
  exchangeRate: {
    lastUpdated: string; // ISO date string
    rate: number;
  };
  totals: {
    totalPriceWithVAT: number;
    totalVATAmount: number;
    totalPrice: number;
    totalPayed: number;
    hasOpenAmount: boolean;
    totalOpen: number;
    payedPercentage: number;
  };
  foreignTotals: {
    totalPriceWithVAT: number;
    totalVATAmount: number;
    totalPrice: number;
    totalPayed: number;
    hasOpenAmount: boolean;
    totalOpen: number;
    payedPercentage: number;
  };
  isCreditNota: boolean;
  relatedParentInvoice: {
    id: number;
    voucherNr: string;
    hasVoucherNr: boolean;
    invoiceNr: string;
    invoiceDate: string; // ISO date string
    invoiceDateAsString: string;
    relationType: {
      value: number;
      name: string;
      description: string;
    };
  };
  creditedInvoiceNr: string;
  creditInvoiceNr: string;
  hasBeenCredited: boolean;
  downloadInfo: DownloadInfoList;
  relatedCreditInvoice: {
    id: number;
    voucherNr: string;
    hasVoucherNr: boolean;
    invoiceNr: string;
    invoiceDate: string; // ISO date string
    invoiceDateAsString: string;
    relationType: {
      value: number;
      name: string;
      description: string;
    };
  };
  valuta: {
    valutaType: {
      value: number;
      name: string;
      description: string;
    };
    sign: string;
  };
  companyValuta: {
    valutaType: {
      value: number;
      name: string;
      description: string;
    };
    sign: string;
  };
  actions: {
    canEdit: boolean;
    canDelete: boolean;
    canSend: boolean;
    canAlterSendInstructions: boolean;
    canCredit: boolean;
    canRegisterPayment: boolean;
    canCreateCopy: boolean;
    canShowPreview: boolean;
    canAddAttachments: boolean;
    canDownload: boolean;
    canSettle: boolean;
    canFinalize: boolean;
    canReInvokeSepaPayment: boolean;
    canSendSepaConfirmationForm: boolean;
    canInvokeOnlinePayment: boolean;
    canStopSubscription: boolean;
    canReStartSubscription: boolean;
  };
  activeSendInstructions: {
    invoiceId: number;
    overrideNotificationType: number;
    finalizeInvoice: boolean;
    emailOptions: {
      sendToClient: boolean;
      sendMeAnCopy: boolean;
      extraToRecipients: string[];
      extraCcRecipients: string[];
      extraBccRecipients: string[];
      hasCustomTemplate: boolean;
      customTemplate: {
        templateType: number;
        useCustomTemplate: boolean;
        body: string;
        subject: string;
      };
      sendToFactoringClient: boolean;
      sendToAccountantInbox: boolean;
    };
    actionType: number;
    adjustInvoiceDateToToday: boolean;
    skipSepaVerificationIfMandateIsValid: boolean;
  };
  hasActiveSendInstructions: boolean;
  isRootAutomatedSubscription: boolean;
  isAutomated: boolean;
  automation: {
    invoiceTemplateId: number;
    periodStartDate: string; // ISO date string
    periodEndDate: string; // ISO date string
    periodEndDateBasedOnContractDate: string; // ISO date string
    periodStartDateBasedOnContractDate: string; // ISO date string
    periodInvoiceDate: string; // ISO date string
    hasAlternateContractDate: boolean;
    periodInvoiceDateAsString: string;
    periodEndDateBasedOnContractDateAsString: string;
    periodStartDateBasedOnContractDateAsString: string;
    hasPeriodInfo: boolean;
    rootScheduledNextAutomationDate: string; // ISO date string
    rootIsActive: boolean;
    rootRecurringCycleType: {
      value: number;
      name: string;
      description: string;
    };
    hasNextAutomationDate: boolean;
    periodStartDateAsString: string;
    periodEndDateAsString: string;
    nextAutomationDateAsString: string;
    contractDate: string; // ISO date string
    contractDateAsString: string;
    hasContractDate: boolean;
  };
}

export interface InvoicePostResult {
  id: number;
  uniqueId: string;
  isInvoiceEditable: boolean;
  status: number;
  canUseAutomation: boolean;
  attachmentsTempId: string;
  title: string;
  downloadInfo: DownloadInfoPost;
  header: Header;
  customizations: Customizations;
  products: Product[];
  comments: Comments;
  automationSettings: AutomationSettings;
  customFields: CustomField[];
  hasCustomFields: boolean;
  attachments: Attachments;
}

interface DownloadInfoPost {
  fileName: string;
  fileId: number;
  fileType: FileTypePost;
  downloadUrl: string;
}

interface FileTypePost {
  value: number;
  description: string;
}

interface Header {
  prospect: Prospect;
  invoiceDate: string;
  deliveryDate: string;
  clientId: number;
  clientContactId: number;
  deadLineForPaymentDays: number;
  clientReferenceNr: string;
  valutaType: number;
  companyTradeNameId: number;
  quoteId: number;
  exchangeRate: ExchangeRate;
  clientDisplayName: string;
}

interface Prospect {
  clientName: string;
  kvKNr: string;
  vatNr: string;
  ibanNr: string;
}

interface ExchangeRate {
  lastUpdated: string;
  rate: number;
}

interface Customizations {
  useCustomInvoiceNr: boolean;
  customInvoiceNr: string;
  hideProductCodes: boolean;
  isCreditNota: boolean;
  canChangeCreditNotaStatus: boolean;
  notificationCycleId: number;
  factoringClientId: number;
  dontSendRemindersOnlyTrackStatus: boolean;
}

interface Product {
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
  ledgerAccountId: number;
  vatTypeId: number;
  discountMarginId: number;
  orderIndex: number;
}

interface Comments {
  invoiceComments: string;
  privateComments: string;
}

interface AutomationSettings {
  afterAutomationNotifyMe: boolean;
  afterAutomationSendMeAnCopy: boolean;
  enableAutomation: boolean;
  autoSendAfterRecurringAutoCopy: boolean;
  recurringEndDate: string;
  subscriptionStartDate: string;
  invoiceRecurringType: number;
  automationEnableSepaIncasso: boolean;
  automationPreferedIncassoDay: number;
  recurringMaxCount: number;
  automationBankReferenceDescription: string;
  sendDaysBeforeActualDate: number;
}

interface CustomField {
  fieldLabel: string;
  fieldInfo: string;
  groupDisplayName: string;
  options: string[];
  fieldType: FieldType;
  fieldId: number;
  value: CustomFieldValue;
}

interface FieldType {
  value: number;
  description: string;
}

interface CustomFieldValue {
  asDate: string;
  asText: string;
  asMoney: number;
  asNumber: number;
  asOptions: string[];
}

export interface Attachments {
  attachmentsToLink: AttachmentLink[];
  attachments: Attachment[];
}

interface AttachmentLink {
  inboxItemId: number;
  attachmentId: number;
  isRemoved: boolean;
  restoreAttachment: boolean;
  isDirectFileReference: boolean;
}

interface Attachment {
  id: number;
  relatedEntityId: number;
  fileName: string;
  dateOfUpload: string;
  fileType: FileTypePost;
  sizeDescription: string;
  downloadInfo: DownloadInfoPost;
  actions: AttachmentActions;
  sendWithEmail?: boolean;
}

interface AttachmentActions {
  canDelete: boolean;
  canDownload: boolean;
  canView: boolean;
  canChangeState: boolean;
}

export type InvoicePostModel = ApiResponse<InvoicePostResult>;
export type InvoiceListModel = ApiResponse<InvoiceListResult>;

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

export interface AccountAutomationResult {
  requestUrlForConsent: string;
}
export type GenericBooleanModel = ApiResponse<boolean>;
export type GenericStringModel = ApiResponse<string>;
export type GenericNumberModel = ApiResponse<number>;
export type PrivateLedgersModel = ApiResponse<BalanceItem[]>;
export type AccountAutomationModel = ApiResponse<AccountAutomationResult>;
export type AccountsForPaymentModel = ApiResponse<AccountsForPaymentResult>;
export type PaymentsModel = ApiResponse<PaymentsResult[]>;
