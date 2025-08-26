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
import { Attachments } from "../../../../invoices/overview/core/_models";
export interface CostListResult {
  id: number;
  isInvoiceEditable?: boolean;
  uniqueId: string;
  client: string;
  hasClient: boolean;
  invoiceNr: string;
  invoiceReference: string;
  hasInvoiceReference: boolean;
  voucherNr: string;
  hasVoucherNr: boolean;
  hasPayments: boolean;
  hasMutations: boolean;
  invoiceStatus: Status;
  balanceType: Status;
  registrationType: Status;
  invoiceDate: string;
  invoiceDateAsString: string;
  invoiceDueDate: string;
  invoiceDueDateAsString: string;
  attachments: Attachment[];
  attachmentsCount: number;
  hasAttachments: boolean;
  isSendFromTradeName: boolean;
  companyTradeName: string;
  totals: Totals;
  valuta: Valuta;
  actions: Actions;
  isCreditNota: boolean;
}

export interface CostPostResult {
  id: number;
  isInvoiceEditable: boolean;
  attachmentsTempId: string;
  status: number;
  registrationType: number;
  title: string;
  header: {
    prospect: {
      clientName: string;
      kvKNr: string;
      vatNr: string;
      ibanNr: string;
    };
    invoiceDate: string;
    invoiceDueDate: string;
    clientId: number;
    invoiceNr: string;
    invoiceReference: string;
    valutaType: number;
    companyTradeNameId: number;
    totalValidationAmount: number;
    validateTotalAmountWithoutVat: boolean;
    disableAmountEdit: boolean;
    clientDisplayName: string;
  };
  products: CostItem[];
  comments: {
    privateComments: string;
  };
  isAutoBooked: boolean;
  attachments: Attachments;
  viewTabs: {
    showPayments: boolean;
    showActionHistory: boolean;
    showBookingMutations: boolean;
  };
  actions: Actions;
}

interface Status {
  value: number;
  name: string;
  description: string;
}

interface Attachment {
  fileName: string;
  fileId: number;
  fileType: Status;
  fileExtension: string;
  canView: boolean;
  downloadUrl: string;
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

interface Valuta {
  valutaType: Status;
  sign: string;
}

interface Actions {
  canEdit: boolean;
  canDelete: boolean;
  canRegisterPayment: boolean;
  canAddAttachments: boolean;
}

export interface AttachmentsResult {
  id: number;
  relatedEntityId: number;
  fileName: string;
  dateOfUpload: string; // ISO string format
  dateOfUploadAsString?: string;
  fileType: {
    value: number;
    name?: string;
    description: string;
  };
  sizeDescription: string;
  downloadInfo: {
    fileName: string;
    fileId: number;
    fileType: {
      value: number;
      name?: string;
      description: string;
    };
    fileExtension?: string;
    canView?: boolean;
    downloadUrl: string;
  };
  actions: {
    canDelete: boolean;
    canDownload: boolean;
    canView: boolean;
    canChangeState: boolean;
  };
}
export interface CostItem {
  orderIndex: number;
  productId: number;
  description: string;
  totalPrice: number;
  totalPriceIsExVat: boolean;
  ledgerAccountId: number;
  vatTypeId: number;
}
export type CostListModel = ApiResponse<CostListResult[]>;
export type CostPostModel = ApiResponse<CostPostResult>;
