import { Attachments } from "../../../../invoices/overview/core/_models";

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

interface RegistrationType {
  value: number;
  name: string;
  description: string;
}

interface BalanceType {
  value: number;
  name: string;
  description: string;
}

interface Actions {
  canEdit: boolean;
  canDelete: boolean;
  canAddAttachments: boolean;
}

export interface BookingsResult {
  id: number;
  client: string;
  hasClient: boolean;
  title: string;
  voucherNr: string;
  hasVoucherNr: boolean;
  registrationType: RegistrationType;
  balanceType: BalanceType;
  bookingDate: string;
  bookingDateAsString: string;
  attachmentsCount: number;
  hasAttachments: boolean;
  isFromCompanyTradeName: boolean;
  companyTradeName: string;
  amount: number;
  actions: Actions;
}

export interface ActivitiesResult {
  subjectId: number;
  activity: {
    value: number;
    name: string;
    description: string;
  };
  status: {
    value: number;
    name: string;
    description: string;
  };
  dateCreated: string; // ISO format string
  actualDateCreated: string; // ISO format string
  dateStartedProcessing: string; // ISO format string
  dateFinshedProcessing: string; // ISO format string
  hasDateStartedProcessing: boolean;
  hasDateFinshedProcessing: boolean;
  dateCreatedAsString: string;
  actualDateCreatedAsString: string;
  dateStartedProcessingAsString: string;
  dateFinshedProcessingAsString: string;
  description: string;
  processComments: string;
  technicalComments: string;
  actorType: string;
  isSystemUser: boolean;
  userEmail: string;
}
export interface MutationsResult {
  title: string;
  items: [
    {
      mutationDate: string;
      mutationDateAsString: string;
      ledgerAccountDisplayName: string;
      debetAmount: number;
      creditAmount: number;
    }
  ];
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
  sendWithEmail?: boolean; // Optional as it is not present in all attachments
}
export interface BookingItem {
  id: number;
  orderIndex: number;
  description: string;
  amount: number;
  balanceType: number;
  ledgerAccountId: number;
  vatTypeId: number;
  isOriginalFirstLinkedFromMutation: boolean;
  isValid?: boolean;
  isDebet: boolean;
  actions: {
    disableDelete: boolean;
    disableAmountEdit: boolean;
    disableBalanceTypeEdit: boolean;
    disableLedgerAccountEdit: boolean;
    disableVatTypeEdit: boolean;
  };
}

export interface BookingPostResult {
  id: number;
  isBookingEditable: boolean;
  attachmentsTempId: string;
  title: string;
  voucherNumber: string;
  comments: string;
  header: {
    prospect: {
      clientName: string;
      kvKNr: string;
      vatNr: string;
      ibanNr: string;
    };
    hasProspect?: boolean;
    bookingDate: string; // ISO string format
    clientId: number;
    companyTradeNameId: number;
    totalValidationAmount: number;
    relatedActivaInvoiceId: number;
    clientDisplayName: string;
  };
  bookingItems: BookingItem[];
  attachments: Attachments;
  hasAttachments?: boolean;
  actions: {
    canEdit: boolean;
    canDelete: boolean;
    canAddAttachments: boolean;
  };
  viewTabs: {
    showActionHistory: boolean;
    showBookingMutations: boolean;
  };
}

export type BookingPostModel = ApiResponse<BookingPostResult>;
export type ActivitiesModel = ApiResponse<ActivitiesResult[]>;
export type MutationsModel = ApiResponse<MutationsResult[]>;
export type BookingsModel = ApiResponse<BookingsResult[]>;
export type AttachmentsModel = ApiResponse<AttachmentsResult[]>;
