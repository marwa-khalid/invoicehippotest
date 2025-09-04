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
export interface TemplatePost {
  id: number;
  title: string;
  categoryType: number;
  ownerSubscriberId: number;
  documents: Document[];
  previewImageFileId: number;
  previewImageFileUrl: string;
  hasOwner: boolean;
  owner: {
    id: number;
    fullName: string;
  };
  hasPreviewImage: boolean;
}

export interface Document {
  id: number;
  documentType: number;
  wordTemplateDocumentFileId: number;
  htmlTemplateDocumentFileId: number;
  previewImageFileId: number;
  htmlTemplateDocumentFileName: string;
  wordTemplateDocumentFileName: string;
  hasWordTemplateDocumentFileName: boolean;
  hasHtmlTemplateDocumentFileName: boolean;
}
export interface TemplateListResult {
  id: number;
  title: string;
  categoryType: {
    value: number;
    name: string;
    description: string;
  };
  statusType: {
    value: number;
    name: string;
    description: string;
  };
  actions: {
    canEdit: true;
    canDelete: true;
    canPublish: true;
  };
  hasOwner: true;
  owner: {
    id: number;
    fullName: string;
  };
  hasPreviewImage: true;
  previewImageFileUrl: string;
}
export type TemplatePostModel = ApiResponse<TemplatePost>;
export type TemplateListModel = ApiResponse<TemplateListResult[]>;

export interface LocalizationResult {
  id: number;
  key: string;
  hasNL: boolean;
  hasEN: boolean;
  hasDE: boolean;
  hasFR: boolean;
  hasES: boolean;
  hasPL: boolean;
  hasTR: boolean;
  moduleType: {
    value: number;
    name: string;
    description: string;
  };
  editStatusType: {
    value: number;
    name: string;
    description: string;
  };
  previewContent: string;
  isSystemCreated: boolean;
  canDelete: boolean;
}
export interface LocalizationPost {
  id: number;
  moduleType: number;
  key: string;
  isSystemCreated: boolean;
  webTranslations: {
    contentNL: string;
    contentEN: string;
    contentPL: string;
    contentES: string;
    contentDE: string;
    contentFR: string;
    contentTR: string;
  };
  mobileTranslations: {
    contentNL: string;
    contentEN: string;
    contentPL: string;
    contentES: string;
    contentDE: string;
    contentFR: string;
    contentTR: string;
  };
}
export type LocalizationPostModel = ApiResponse<LocalizationPost>;
export type LocalizationSingleModel = ApiResponse<LocalizationResult>;
export type LocalizationModel = ApiResponse<LocalizationResult[]>;
