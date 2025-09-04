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

interface FileType {
  value: number;
  name: string;
  description: string;
}

interface FileTypePost {
  value: number;
  description: string;
}
interface DownloadInfo {
  fileName: string;
  fileId: number;
  fileType: FileType;
  fileExtension: string;
  canView: boolean;
  downloadUrl: string;
}

interface DownloadInfoPost {
  fileName: string;
  fileId: number;
  fileType: FileTypePost;
  downloadUrl: string;
}

interface Actions {
  canDelete: boolean;
  canDownload: boolean;
  canView: boolean;
  canChangeState: boolean;
}

interface CompanyLogo {
  id: number;
  relatedEntityId: number;
  fileName: string;
  dateOfUpload: Date;
  dateOfUploadAsString: string;
  fileType: FileType;
  sizeDescription: string;
  downloadInfo: DownloadInfo;
  actions: Actions;
}
interface CompanyPostLogo {
  id: number;
  relatedEntityId: number;
  fileName: string;
  dateOfUpload: string;
  fileType: FileTypePost;
  sizeDescription: string;
  downloadInfo: DownloadInfoPost;
  actions: Actions;
}

interface OnSaveActions {
  removeLogo: boolean;
  newLogo: {
    inboxItemId: number;
    attachmentId: number;
    isRemoved: boolean;
    restoreAttachment: boolean;
    isDirectFileReference: boolean;
  };
}

interface CustomField {}

export interface CompanyResult {
  id: number;
  subscriberId: number;
  companyName: string;
  subTitle: string;
  notificationEmailAddresses: string[];
  onSaveActions: OnSaveActions;
  legalEntityType: number;
  companyBrancheType: number;
  companyLogoFileId: number;
  companyLogo: CompanyLogo;
  companyAddress: string;
  companyHouseNr: string;
  companyHouseNrAddition: string;
  companyPostCode: string;
  companyCity: string;
  companyState: string;
  companyCountryType: number;
  companyPhoneNumber: string;
  companyMobileNumber: string;
  companyFaxNumber: string;
  companyEmailAddress: string;
  companyWebUrl: string;
  companyPostbus: string;
  companyPostbusPostCode: string;
  companyPostbusCity: string;
  companyPostbusCountryType: number;
  btwNr: string;
  kvkNr: string;
  bankAccountCompanyType: number;
  accountHolderName: string;
  accountNrIBAN: string;
  accountNrIBANValidated: boolean;
  languageType: number;
  customFields: CustomField[];
  hasCustomFields: boolean;
}

export interface CompanyPostResult {
  id: number;
  subscriberId: number;
  companyName: string;
  subTitle: string;
  notificationEmailAddresses: string[];
  onSaveActions: OnSaveActions;
  legalEntityType: number;
  companyBrancheType: number;
  companyLogoFileId: number;
  companyLogo: CompanyPostLogo;
  companyAddress: string;
  companyHouseNr: string;
  companyHouseNrAddition: string;
  companyPostCode: string;
  companyCity: string;
  companyState: string;
  companyCountryType: number;
  companyPhoneNumber: string;
  companyMobileNumber: string;
  companyFaxNumber: string;
  companyEmailAddress: string;
  companyWebUrl: string;
  companyPostbus: string;
  companyPostbusPostCode: string;
  companyPostbusCity: string;
  companyPostbusCountryType: number;
  btwNr: string;
  kvkNr: string;
  bankAccountCompanyType: number;
  accountHolderName: string;
  accountNrIBAN: string;
  accountNrIBANValidated: boolean;
  languageType: number;
  customFields: CustomField[];
}

interface Template {
  id: number;
  relatedEntityId: number;
  fileName: string;
  dateOfUpload: string;
  dateOfUploadAsString: string;
  fileType: FileType;
  sizeDescription: string;
  downloadInfo: DownloadInfo;
  actions: Actions;
}

interface OnSaveActions2 {
  removeCustomTemplateStandard: boolean;
  removeCustomTemplateCreditNota?: boolean;
  removeCustomTemplateAutomation?: boolean;
  removeExtraAttachment: boolean;
  customTemplateStandard: AttachmentAction;
  customTemplateCreditNota?: AttachmentAction;
  customTemplateAutomation?: AttachmentAction;
  extraAttachment: AttachmentAction;
}

interface AttachmentAction {
  inboxItemId: number;
  attachmentId: number;
  isRemoved: boolean;
  restoreAttachment: boolean;
  isDirectFileReference: boolean;
}

interface InvoiceSettings {
  onSaveActions: OnSaveActions2;
  defaultStartIndex: number;
  numberFormat: string;
  enableInvoiceNrContinuousCount: boolean;
  useProductDescriptionFromPredefinedProducts: boolean;
  useCustomInvoiceTemplate: boolean;
  useCustomInvoiceCreditNotaTemplate: boolean;
  useCustomInvoiceAutomationTemplate: boolean;
  customTemplateStandard: Template;
  customTemplateCreditNota: Template;
  customTemplateAutomation: Template;
  extraAttachment: Template;
  enableAutomationNotifications: boolean;
  removeCustomInvoiceCreditNotaTemplateFile: boolean;
  invoiceTemplateType: number;
  invoiceCcEmailAddresses: string[];
  invoiceFileFormat: string;
  defaultDeadlineForPayment: number;
  invoiceCreditNotaConditionFormat: string;
  invoiceConditionFormat: string;
  invoiceAutomationConditionFormat: string;
  disableTemplateSpacesAfter: boolean;
  showCustomTemplateErrors: boolean;
}

interface InvoiceAndQuoteSharedSettings {
  termsAndConditionsAttachment: Template;
  sendTermsAndConditionsOnInvoice: boolean;
  sendTermsAndConditionsOnQuote: boolean;
}

interface QuoteSettings {
  onSaveActions: OnSaveActions2;
  defaultStartIndex: number;
  numberFormat: string;
  enableQuoteNrContinuousCount: boolean;
  useProductDescriptionFromPredefinedProducts: boolean;
  useCustomQuoteTemplate: boolean;
  customTemplateStandard: Template;
  extraAttachment: Template;
  quoteTemplateType: number;
  quoteCcEmailAddresses: string[];
  customQuoteTemplateFileUrl: string;
  quoteDefaultAttachmentFileUrl: string;
  quoteFileFormat: string;
  defaultDeadlineForAcceptance: number;
  quoteConditionFormat: string;
  quoteValidationConditionFormat: string;
  disableTemplateSpacesAfter: boolean;
  showCustomTemplateErrors: boolean;
}

interface NumberingSettings {
  enableClientNrContinuousCount: boolean;
  enableProductNrContinuousCount: boolean;
  clientNumberFormat: string;
  productNumberFormat: string;
  defaultStartIndexClients: number;
  defaultStartIndexProducts: number;
}

interface TaxSettings {
  companyValutaType: number;
  defaultVatIdForCost: number;
  defaultVatIdForSales: number;
}

interface CompanyInstallationSettings {
  isActivated: boolean;
  isValidated: boolean;
  showInstallationWizard: boolean;
}

export interface CompanySettingsResult {
  id: number;
  companyInstallationSettings: CompanyInstallationSettings;
  companyInvoiceSettings: InvoiceSettings;
  invoiceAndQuoteSharedSettings: InvoiceAndQuoteSharedSettings;
  onInvoiceAndQuoteSharedSaveActions: OnSaveActions2;
  companyQuoteSettings: QuoteSettings;
  companyNumberingSettings: NumberingSettings;
  companyTaxSettings: TaxSettings;
}

export interface TradeNamesResult {
  id: number;
  title: string;
  companyLogoUrl: string;
  hasCompanyLogoUrl: boolean;
  addressAsHtml: string;
}

export interface TradeNamesPostResult {
  id: number;
  companyId: number;
  tradeName: string;
  onSaveActions: OnSaveActions;
  companyLogoFileId: number;
  companyLogo: CompanyLogo | {};
  companyAddress: string;
  companyHouseNr: string;
  companyHouseNrAddition: string;
  companyPostCode: string;
  companyCity: string;
  companyState: string;
  companyCountryType: number;
  companyPhoneNumber: string;
  companyMobileNumber: string;
  companyFaxNumber: string;
  companyEmailAddress: string;
  companyWebUrl: string;
  companyPostbus: string;
  companyPostbusPostCode: string;
  companyPostbusCity: string;
  companyPostbusCountryType: number;
  bankAccountCompanyType: number;
  accountHolderName: string;
  accountNrIBAN: string;
  accountNrIBANValidated: boolean;
  contactGenderType: number;
  contactFirstName: string;
  contactBetweenName: string;
  contactLastName: string;
  contactEmailAddress: string;
  contactPhoneNumber: string;
  contactMobileNumber: string;
}
export type CompanyModel = ApiResponse<CompanyResult>;
export type CompanyPostModel = ApiResponse<CompanyPostResult>;
export type CompanySettingsModel = ApiResponse<CompanySettingsResult>;
export type TradeNamesModel = ApiResponse<TradeNamesResult[]>;
export type TradeNamesPostModel = ApiResponse<TradeNamesPostResult>;
