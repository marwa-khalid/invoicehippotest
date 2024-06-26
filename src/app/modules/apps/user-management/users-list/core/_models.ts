import { ID, Response } from "../../../../../../_metronic/helpers";

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

export interface VatTypesResult {
  id: number;
  title: string;
  value: number;

  vatAreaUsageType: {
    value: 0;
    name: string;
    description: string;
  };
  ledgerAccountDisplayName: string;
  useInLists: true;
  isAlwaysExBtw: true;
  actions: {
    canEdit: true;
    canDelete: true;
  };
}

export interface VatTypeByIdResult {
  id: number;
  ledgerAccountId: number;
  templateId: number;
  title: string;
  value: number;
  vatAreaUsageType: number;
  isAlwaysExBtw: boolean;
  showOnDocuments: boolean;
  useInLists: boolean;
  isNoneVatType: boolean;
}

export type User = {
  id?: ID;
  name?: string;
  avatar?: string;
  email?: string;
  position?: string;
  role?: string;
  last_login?: string;
  two_steps?: boolean;
  joined_day?: string;
  online?: boolean;
  initials?: {
    label: string;
    state: string;
  };
};

export type UsersQueryResponse = Response<Array<User>>;

export const initialUser: User = {
  avatar: "avatars/300-6.jpg",
  position: "Art Director",
  role: "Administrator",
  name: "",
  email: "",
};

export type VatTypesModel = ApiResponse<VatTypesResult>;
export type VatTypeByIdModel = ApiResponse<VatTypeByIdResult>;
