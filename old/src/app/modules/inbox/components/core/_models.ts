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

export interface InboxListResult {
  id: number;
  inboxItemId: number;
  fileId: number | null;
  fileName: string;
  archiveTitle: string;
  documentDate: string; // ISO date string
  year: number;
  documentDateAsString: string;
  dateOfUpload: string; // ISO date string
  dateOfUploadAsString: string;
  fileType: {
    value: number;
    name: string;
    description: string | null;
  };
  archiveType: {
    value: number;
    name: string;
    description: string;
  };
  isArchivedItem: boolean;
  itemType: {
    value: number;
    name: string;
    description: string;
  };
  sizeDescription: string;
  downloadInfo: {
    fileName: string;
    fileId: number | null;
    fileType: {
      value: number;
      name: string;
      description: string | null;
    };
    fileExtension: string;
    canView: boolean;
    downloadUrl: string;
  };
  actions: {
    canDelete: boolean;
    canDownload: boolean;
    canView: boolean;
    canArchive: boolean;
    canUnArchive: boolean;
    canRoute: boolean;
    canAutoProcessAndRoute: boolean;
  };
  hasOcrStatus: boolean;
  ocrStatus: {
    hasOcrDate :  boolean,
    htmlInfo: string,
    isInProgress: boolean,
    ocrData: any,
    parseScore: number,
    parseScorePercentage: string,
    processStatusType : object
  };
}

export interface InboxArchivePayload {
  inboxItemId: number,
  fileId: number,
  archiveType: number,
  archiveItemTitle: string,
  archiveItemDate: string
}

export interface InboxLinkPayload {
  inboxItemId: number,
  fileId: number,
}

export type InboxListModel = ApiResponse<InboxListResult>;

