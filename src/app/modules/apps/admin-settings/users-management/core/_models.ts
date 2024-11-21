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

interface UserType {
  value: number;
  name: string;
  description: string;
}

interface GenderType {
  value: number;
  name: string;
  description: string;
}

interface Company {
  isDefault: boolean;
  companyType: number;
  id: number;
  title: string;
  inboxEmailAddress: string;
  companyLogoUrl: string;
  hasCompanyLogoUrl: boolean;
  addressAsHtml: string;
  accountCompany: string;
  accountHolderName: string;
  accountNrIBAN: string;
  vatNr: string;
  registrationNr: string;
  factoringClientSessionStatement: string;
}

interface Actions {
  canEdit: boolean;
  canDelete: boolean;
}

export interface UserResult {
  id: number;
  fullName: string;
  loginEmailAddress: string;
  userType: UserType;
  genderType: GenderType;
  companies: Company[];
  actions: Actions;
}

export interface UserResultById {
  id: number;
  genderType: number;
  userType: number;
  firstName: string;
  languageType: number;
  betweenName: string;
  lastName: string;
  loginEmailAddress: string;
  isActive: boolean;
  accessibleCompanies: [
    {
      isDefault: boolean;
      companyId: number;
    }
  ];
  passwordSet: {
    password: string;
    passwordVerification: string;
  };
  requestingUserProfileId: number;
  requestingUserPassword: string;
  sendInvitationForNewUser: true;
  generatePasswordForNewUser: boolean;
  accountantBeconNumber: string;
  accountantNotificationEmailAddress: string;
}
export interface CompaniesResult {
  title: string;
  symbol: string;
  hasSymbol: boolean;
  value: number;
  subGroup: string;
  hasSubGroup: boolean;
  group: string;
  extraDescription: string;
  hasGroup: boolean;
  isAccountTypeOmzet: boolean;
  isAccountTypeBtw: boolean;
  isAccountTypeCost: boolean;
  isAccountTypeResult: boolean;
  isAccountTypePrive: boolean;
}

// export interface LanguagesResult {
//   languageType: {
//     value: number;
//     name: string;
//     description: string;
//   };
//   translatedItemsCount: number;
//   translatedCoveragePercentage: number;
//   useInLists: boolean;
// }

// export type LanguagesModel = ApiResponse<LanguagesResult[]>;
export type UserModel = ApiResponse<UserResult[]>;
export type UserModelById = ApiResponse<UserResultById>;
export type CompaniesModel = ApiResponse<CompaniesResult[]>;
