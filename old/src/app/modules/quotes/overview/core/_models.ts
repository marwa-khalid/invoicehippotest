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
  uniqueId: string;
  isQuoteEditable: boolean;
  status: number;
  attachmentsTempId: string;
  title: string;
  downloadInfo: any;
  header: {
    prospect: any;
    hasProspect?: boolean;
    quoteDate: string;
    expectedDeliveryDate: string;
    clientId: number;
    clientContactId: number;
    deadLineForAcceptanceDays: number;
    clientReferenceNr: string;
    valutaType: number;
    companyTradeNameId: number;
    hasCompanyTradeName?: boolean;
    clientDisplayName: string;
  };
  customizations: {
    useCustomQuoteNr: boolean;
    customQuoteNr: string;
    customOrderNr: string;
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
    hasLinkedProductDescription?: boolean;
    hasDescription?: boolean;
    verifiedDescription?: string;
    ledgerAccountId: number;
    vatTypeId: number;
    discountMarginId: number;
    orderIndex: number;
    isValidProduct?: boolean;
  }[];
  comments: {
    quoteComments: string;
    privateComments: string;
  };
  customFields: {
    fieldLabel: string;
    fieldInfo: string;
    groupDisplayName: string;
    options: string[];
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
      asOptions: string[];
    };
  }[];
  hasCustomFields: boolean;
  attachments: any;
  hasAttachments: boolean;
}

export interface QuoteListResult {
  id: number;
  uniqueId: string;
  oData: string;
  client: any;
  clientReferenceNr: string;
  quoteNr: string;
  hasClientReferenceNr?: boolean;
  quoteStatus: QuoteStatus;
  isDraft: boolean;
  quoteDate: string;
  expectedDeliveryDate: string;
  quoteDateAsString: string;
  quoteDueDate: string;
  quoteDueDateAsString: string;
  attachmentsCount: number;
  hasAttachments?: boolean;
  isSendFromTradeName: boolean;
  companyTradeName: string;
  relatedInvoice: RelatedInvoice;
  hasRelatedInvoice?: boolean;
  totals: Totals;
  downloadInfo: DownloadInfo;
  valuta: Valuta;
  actions: Actions;
  activeSendInstructions: ActiveSendInstructions;
  hasActiveSendInstructions?: boolean;
}

interface QuoteStatus {
  value: number;
  name: string;
  description: string;
}

interface RelatedInvoice {
  id: number;
  voucherNr: string;
  hasVoucherNr?: boolean;
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
  canConvertToOrderConfirmation: boolean;
  canSendOrderConfirmation: boolean;
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
  hasCustomTemplate?: boolean;
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
  hasDefaultVat?: boolean;
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

export interface QuoteViewDataResult {
  documentId: number;
  documentSignatureId: string;
  hasDocumentSignatureId: boolean;
  subscriberId: number;
  companyId: number;
  companySettingsId: number;
  isValid: boolean;
  isInPrintMode: boolean;
  editUrl: string;
  newUrl: string;
  downloadUrl: string;
  status: string;
  emailNotificationStatus: string;
  isQuote: boolean;
  showCustomTemplateErrors: boolean;
  disableSpacesAfter: boolean;
  documentTitle: string;
  addressedToTitle: string;
  customerNrTitle: string;
  documentNrTitle: {
    value: string;
  };
  invoiceNrLabel: {
    value: string;
  };
  quoteNrLabel: {
    value: string;
  };
  invoiceDateLabel: {
    value: string;
  };
  invoiceDeliveryDateLabel: {
    value: string;
  };
  invoiceDueDateLabel: {
    value: string;
  };
  invoiceDueDaysLabel: {
    value: string;
  };
  quoteDateLabel: {
    value: string;
  };
  quoteDueDateLabel: {
    value: string;
  };
  quoteDueDaysLabel: {
    value: string;
  };
  documentDateTitle: {
    value: string;
  };
  documentDueDateTitle: {
    value: string;
  };
  documentDeliveryDateTitle: {
    value: string;
  };
  documentDeadlineDaysTitle: {
    value: string;
  };
  documentAmountTitle: string;
  exchangeRate: string;
  exchangeRateLabel: string;
  fileFormatString: string;
  fileName: string;
  companyLogoUrl: {
    value: string;
  };
  companyName: {
    value: string;
  };
  companySlogan: {
    value: string;
  };
  companyAddressAndHousNr: {
    value: string;
  };
  companyAddress: {
    value: string;
  };
  companyHousNr: {
    value: string;
  };
  companyPostCodeAndCity: {
    value: string;
  };
  companyPostCode: {
    value: string;
  };
  companyCity: {
    value: string;
  };
  companyCountry: {
    value: string;
  };
  companyPhoneNr: {
    value: string;
  };
  companyMobileNr: {
    value: string;
  };
  companyEmailAddress: {
    value: string;
  };
  companyWebUrl: {
    value: string;
  };
  companyFaxNr: {
    value: string;
  };
  companyKvkNr: {
    value: string;
  };
  companyBtwNr: {
    value: string;
  };
  hasCompanyLogoUrl: boolean;
  hasCompanyWebUrl: boolean;
  hasCompanyMobileNr: boolean;
  hasCompanyEmailAddress: boolean;
  hasCompanyAddressAndHousNr: boolean;
  hasCompanySlogan: boolean;
  hasCompanyPostCodeAndCity: boolean;
  hasCompanyCountry: boolean;
  hasCompanyPhoneNr: boolean;
  hasCompanyFaxNr: boolean;
  hasCompanyKvkNr: boolean;
  hasCompanyBtwNr: boolean;
  htmlCompanyAddress: {
    value: string;
  };
  htmlCompanyAddressInline1: {
    value: string;
  };
  htmlCompanyAddressInline2: {
    value: string;
  };
  hasFactoring: boolean;
  factoringCompanyName: {
    value: string;
  };
  factoringSessionStatement: {
    value: string;
  };
  hasFactoringCompanyName: boolean;
  hasFactoringSessionStatement: boolean;
  companyUsedValutaSign: {
    value: string;
  };
  companyUsedValutaCode: {
    value: string;
  };
  companyFinancialAccountName: {
    value: string;
  };
  companyFinancialAccountNameLabel: {
    value: string;
  };
  companyFinancialAccountHolder: {
    value: string;
  };
  companyFinancialAccountHolderLabel: {
    value: string;
  };
  companyFinancialAccountIban: {
    value: string;
  };
  companyFinancialAccountIbanLabel: {
    value: string;
  };
  companyFinancialAccountBic: {
    value: string;
  };
  companyFinancialAccountBicLabel: {
    value: string;
  };
  companyFinancialAccountAddress: {
    value: string;
  };
  companyFinancialAccountPostcode: {
    value: string;
  };
  companyFinancialAccountCity: {
    value: string;
  };
  companyFinancialAccountCountry: {
    value: string;
  };
  hasCompanyFinancialAccountHolder: boolean;
  hasCompanyFinancialAccountName: boolean;
  hasCompanyFinancialAccountIban: boolean;
  hasCompanyFinancialAccountBic: boolean;
  hasCompanyFinancialAccountAddress: boolean;
  hasCompanyFinancialAccountPostcode: boolean;
  hasCompanyFinancialAccountCity: boolean;
  hasCompanyFinancialAccountCountry: boolean;
  clientReferenceNr: {
    value: string;
  };
  clientReferenceNrLabel: {
    value: string;
  };
  clientInvoiceReferenceNr: {
    value: string;
  };
  clientInvoiceReferenceNrLabel: {
    value: string;
  };
  customerNr: {
    value: string;
  };
  customerNrLabel: {
    value: string;
  };
  clientCompanyName: {
    value: string;
  };
  clientContactFullName: {
    value: string;
  };
  clientContactFullNameLabel: {
    value: string;
  };
  clientContactDepartment: {
    value: string;
  };
  clientStreetAndHouseNr: {
    value: string;
  };
  clientPostCodeAndCity: {
    value: string;
  };
  clientPostCode: {
    value: string;
  };
  clientCity: {
    value: string;
  };
  clientHouseNr: {
    value: string;
  };
  clientStreet: {
    value: string;
  };
  clientCountry: {
    value: string;
  };
  clientPhoneNr: {
    value: string;
  };
  clientEmailAddress: {
    value: string;
  };
  kvkNrLabel: {
    value: string;
  };
  btwNrLabel: {
    value: string;
  };
  clientKvkNrLabel: {
    value: string;
  };
  clientBtwNrLabel: {
    value: string;
  };
  ibanNrLabel: {
    value: string;
  };
  ibanBicNrLabel: {
    value: string;
  };
  clientKvkNr: {
    value: string;
  };
  clientBtwNr: {
    value: string;
  };
  htmlClientAddress: {
    value: string;
  };
  htmlCompanyInfoBanner: {
    value: string;
  };
  clientAddressingType: {
    value: string;
  };
  clientFirstName: {
    value: string;
  };
  clientLastName: {
    value: string;
  };
  clientMobileNr: {
    value: string;
  };
  hasClientAddressingType: boolean;
  hasClientFirstName: boolean;
  hasClientLastName: boolean;
  hasClientMobileNr: boolean;
  hasClientReferenceNr: boolean;
  hasCustomerNr: boolean;
  hasClientInvoiceReferenceNr: boolean;
  hasClientCompanyName: boolean;
  hasClientContactFullName: boolean;
  hasClientContactDepartment: boolean;
  hasClientStreetAndHouseNr: boolean;
  hasClientPostCodeAndCity: boolean;
  hasClientCountry: boolean;
  hasClientPhoneNr: boolean;
  hasClientEmailAddress: boolean;
  hasClientKvkNr: boolean;
  hasClientBtwNr: boolean;
  invoiceNr: {
    value: string;
  };
  invoiceDate: {
    value: string;
  };
  documentDate: {
    value: string;
  };
  documentDueDate: {
    value: string;
  };
  documentDeadlineDays: {
    value: string;
  };
  documentDeadlineSingleDayLabel: {
    value: string;
  };
  documentDeadlinePluralDaysLabel: {
    value: string;
  };
  documentNr: {
    value: string;
  };
  rawInvoiceDate: string;
  invoiceDeliveryDate: {
    value: string;
  };
  invoiceDeadlineForPaymentDays: {
    value: string;
  };
  invoiceDueDate: {
    value: string;
  };
  rawInvoiceDueDate: string;
  documentSubTotalPrice: {
    value: string;
  };
  documentTotalPrice: {
    value: string;
  };
  documentSubTotalPriceLabel: {
    value: string;
  };
  documentTotalPriceLabel: {
    value: string;
  };
  invoiceTotalPrice: {
    value: string;
  };
  invoiceSubTotalLabel: {
    value: string;
  };
  invoiceTotalLabel: {
    value: string;
  };
  rawInvoiceTotalPrice: number;
  invoiceTotalPriceWithVat: {
    value: string;
  };
  rawInvoiceTotalPriceWithVat: number;
  rawInvoiceTotalVat: number;
  invoiceDoNotShowTaxes: boolean;
  documentComments: {
    value: string;
  };
  hasDocumentComments: boolean;
  invoiceComments: {
    value: string;
  };
  hasInvoiceComments: boolean;
  documentConditions: {
    value: string;
  };
  documentConditionsLabel: {
    value: string;
  };
  invoiceConditions: {
    value: string;
  };
  invoiceTotalAppliedDiscount: {
    value: string;
  };
  invoiceTotalAppliedDiscountLabel: {
    value: string;
  };
  documentTotalAppliedDiscount: {
    value: string;
  };
  documentTotalAppliedDiscountLabel: {
    value: string;
  };
  rawInvoiceTotalAppliedDiscount: number;
  taxTotals: [
    {
      title: {
        value: string;
      };
      total: {
        value: string;
      };
      rawPriceVatTotal: number;
      percentage: number;
      rawPriceExVatTotal: number;
      companyUsedValutaSign: {
        value: string;
      };
    }
  ];
  hasInvoiceDeliveryDate: boolean;
  hasInvoiceTotalAppliedDiscount: boolean;
  invoiceIsCreditNota: boolean;
  invoiceCreditNota: {
    value: string;
  };
  relatedParentInvoiceNr: {
    value: string;
  };
  relatedParentInvoiceDate: {
    value: string;
  };
  hasRelatedParentInvoiceNr: boolean;
  hasRelatedParentInvoiceDate: boolean;
  subscriptionStartDate: {
    value: string;
  };
  subscriptionPeriodStartDate: {
    value: string;
  };
  subscriptionPeriodEndDate: {
    value: string;
  };
  subscriptionPeriodStartDateLabel: {
    value: string;
  };
  subscriptionPeriodEndDateLabel: {
    value: string;
  };
  subscriptionPeriodStartDateBasedOnContractDate: {
    value: string;
  };
  subscriptionPeriodEndDateBasedOnContractDate: {
    value: string;
  };
  subscriptionNextRenewalDate: {
    value: string;
  };
  subscriptionPeriod: {
    value: string;
  };
  subscriptionPeriodLabel: {
    value: string;
  };
  periodIfMarkerStart: {
    value: string;
  };
  periodIfMarkerEnd: {
    value: string;
  };
  subscriptionNextRenewalDateLabel: {
    value: string;
  };
  hasSubscriptionStartDate: boolean;
  hasSubscriptionPeriodStartDate: boolean;
  hasSubscriptionPeriodEndDate: boolean;
  hasSubscriptionPeriodStartDateBasedOnContractDate: boolean;
  hasSubscriptionPeriodEndDateBasedOnContractDate: boolean;
  hasSubscriptionNextRenewalDate: boolean;
  hasSubscriptionPeriod: boolean;
  hasSubscriptionInfo: boolean;
  isPayed: boolean;
  payed: {
    value: string;
  };
  quoteNr: {
    value: string;
  };
  quoteDate: {
    value: string;
  };
  quoteDeadlineForAcceptanceDays: {
    value: string;
  };
  quoteDueDate: {
    value: string;
  };
  quoteTotalPrice: {
    value: string;
  };
  quoteTotalPriceWithVat: {
    value: string;
  };
  quoteComments: {
    value: string;
  };
  hasQuoteComments: boolean;
  quoteConditions: {
    value: string;
  };
  quoteTotalAppliedDiscount: {
    value: string;
  };
  hasQuoteTotalAppliedDiscount: boolean;
  productHidePrices: boolean;
  productHideProductCodes: boolean;
  productDoNotShowTaxes: boolean;
  showSpecialTaxText: boolean;
  specialTaxText: {
    value: string;
  };
  products: [
    {
      code: {
        value: string;
      };
      title: {
        value: string;
      };
      units: {
        value: string;
      };
      unitType: {
        value: string;
      };
      unitPrice: {
        value: string;
      };
      taxOnlyAmount: {
        value: string;
      };
      totalPrice: {
        value: string;
      };
      rawTotalVat: number;
      rawTotalPrice: number;
      rawUnitPrice: number;
      totalPriceWithVat: {
        value: string;
      };
      rawTotalPriceWithVat: number;
      btwType: {
        value: string;
      };
      btwTypeValue: number;
      priceIsExBtw: boolean;
      discountType: {
        value: string;
      };
      discountMarginPrice: {
        value: string;
      };
      discountMarginType: {
        value: string;
      };
      images: [
        {
          imageUrl: {
            value: string;
          };
          title: {
            value: string;
          };
        }
      ];
      linkedDescription: {
        value: string;
      };
      inlineDescription: {
        value: string;
      };
      description: {
        value: string;
      };
      descriptionWithNewLine: {
        value: string;
      };
      hasDescription: boolean;
      companyUsedValutaSign: {
        value: string;
      };
      hasLinkedDescription: boolean;
      hasInlineDescription: boolean;
      hasCode: boolean;
      hasDiscount: boolean;
      hasImages: boolean;
    }
  ];
  canPayViaPaymentProvider: boolean;
  anonymousViewUrl: {
    value: string;
  };
  anonymousAccessCode: {
    value: string;
  };
  templateColor: {
    value: string;
  };
  templateBackground: {
    value: string;
  };
  isCustomTemplateBackground: boolean;
  customFields: [
    {
      title: {
        value: string;
      };
      value: {
        value: string;
      };
      isValidField: boolean;
      documentAreaType: number;
      subjectType: 1;
    }
  ];
  customFieldsAreaAfterComments: [
    {
      title: {
        value: string;
      };
      value: {
        value: string;
      };
      isValidField: boolean;
      documentAreaType: number;
      subjectType: 1;
    }
  ];
  customFieldsAreaBeforeComments: [
    {
      title: {
        value: string;
      };
      value: {
        value: string;
      };
      isValidField: boolean;
      documentAreaType: number;
      subjectType: 1;
    }
  ];
  customFieldsAreaOnClientDetails: [
    {
      title: {
        value: string;
      };
      value: {
        value: string;
      };
      isValidField: boolean;
      documentAreaType: number;
      subjectType: 1;
    }
  ];
  customFieldsAreaOnInvoiceOrQuoteDetails: [
    {
      title: {
        value: string;
      };
      value: {
        value: string;
      };
      isValidField: boolean;
      documentAreaType: number;
      subjectType: 1;
    }
  ];
  hasCustomFields: boolean;
  hasCustomFieldsAreaAfterComments: boolean;
  hasCustomFieldsAreaBeforeComments: boolean;
  hasCustomFieldsAreaOnClientDetails: boolean;
  hasCustomFieldsAreaOnInvoiceOrQuoteDetails: boolean;
  templateType: number;
  isAcceptedByClient: boolean;
  isRejectedByClient: boolean;
  confirmationComments: {
    value: string;
  };
  showCompanyInfoBlock: boolean;
  showPaymentsInfoBlock: boolean;
  hasCompanyPostCodeAndCityOrAddressAndHouseNr: boolean;
  hasCompanyPhoneNrOrFaxNrOrPostCodeAndCityOrAddressAndHouseNr: boolean;
  hasCompanyPhoneNrOrHasCompanyFaxNr: boolean;
  hasClientContactFullNameAndCompanyName: boolean;
  hasClientContactFullNameAndNotCompanyName: boolean;
  hasInvoiceDeadlineForPaymentDays: boolean;
  hasCompanyKvkNrOrHasCompanyBtwNrAndHasHasCompanyFaxNrOrHasCompanyPhoneNrOrHasCompanyAddressAndHousNrOrHasCompanyPostCodeAndCity: boolean;
  hasCompanyAddressAndHousNrOrHasCompanyPostCodeAndCityOrHasCompanyPhoneNrOrHasCompanyFaxNr: boolean;
  dataOfSignee: {
    signeeName: string;
    signReason: string;
    signSignatureBase64: string;
    signSignatureUrl: string;
    hasBase64Signature: boolean;
    signeeLocation: string;
    signeeEmailAddress: string;
    signDate: string;
    signDateAsString: string;
    actionTraces: [
      {
        dateOfAction: string;
        dateOfActionAsString: string;
        comments: string;
        actionType: number;
        actionTypeAsString: string;
      }
    ];
  };
  hasDataOfSignee: boolean;
  columnBtwTypeLabel: {
    value: string;
  };
  columnServiceLabel: {
    value: string;
  };
  columnAmountLabel: {
    value: string;
  };
  columnUnitsLabel: {
    value: string;
  };
  columnTotalLabel: {
    value: string;
  };
  invoicePaymentTermsQuote: {
    value: string;
  };
  clientContactEmailLabel: {
    value: string;
  };
  clientContactAddressLabel: {
    value: string;
  };
  clientContactCompanyNameLabel: {
    value: string;
  };
  paymentDetailsTitle: { value: string };
  invoiceVatSummaryLabel: {
    value: string;
  };
}
export type QuoteViewDataModel = ApiResponse<QuoteViewDataResult>;
export type GenericBooleanModel = ApiResponse<boolean>;
export type QuotePostModel = ApiResponse<QuotePostResult>;
export type QuoteListModel = ApiResponse<QuoteListResult>;
export type FinancialAccountByIdModel = ApiResponse<FinancialAccountByIdResult>;
export type PrivateLedgersModel = ApiResponse<BalanceItem[]>;
