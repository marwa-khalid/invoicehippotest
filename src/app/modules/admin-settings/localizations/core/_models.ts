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
