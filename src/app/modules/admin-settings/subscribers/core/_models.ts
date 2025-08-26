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
export interface SubscriberResult {
  id: number;
  uniqueId: string;
  billingContact: string;
  billingContactGenderType: GenderType;
  billingContactEmailAddress: string;
  registrationDate: string;
  registrationDateAsString: string;
  isActive: boolean;
  companies: Company[];
  lastActiveLicense: License;
  actions: UserActions;
}

export interface GenderType {
  value: number;
  name: string;
  description: string;
}

export interface Company {
  id: number;
  name: string;
  logoUrl: string;
  hasLogoUrl: boolean;
}

export interface License {
  currentDate: string;
  trialIsExpiring: boolean;
  daysLeftToExpiration: number;
  licenseIsExpiring: boolean;
  id: number;
  isTrialMode: boolean;
  licenseIsManagedByAccountant: boolean;
  hasAutoRenew: boolean;
  hasFutureLicense: boolean;
  futureLicense: string;
  validFrom: string;
  validFromAsString: string;
  validTill: string;
  validTillAsString: string;
  isActive: boolean;
  title: string;
  statusType: LicenseType;
  licenseType: LicenseType;
  usagePercentage: number;
  canUseBankConnectModule: boolean;
  canUseOcrScan: boolean;
  canUseOcrMobileApp: boolean;
}

export interface LicenseType {
  value: number;
  name: string;
  description: string;
}

export interface UserActions {
  canEdit: boolean;
  canDelete: boolean;
  canView: boolean;
  canTakeOver: boolean;
}

export interface BillingContact {
  genderType: number;
  firstName: string;
  betweenName: string;
  lastName: string;
  phoneNr: string;
  mobileNr: string;
  emailAddress: string;
}

export interface BillingAddress {
  street: string;
  houseNr: string;
  houseNrAddon: string;
  postCode: string;
  city: string;
  state: string;
  countryType: number;
}

export interface FinancialAccount {
  billingCompanyName: string;
  billingCompanyVatNr: string;
  billingAccountNrIBANValidated: boolean;
  billingAccountHolderName: string;
  billingAccountNrIBAN: string;
  billingBankAccountCompanyType: number;
}

export interface PromotionCode {
  code: string;
  title: string;
  description: string;
}

export interface Company {
  name: string;
  id: number;
  logoUrl: string;
  hasLogoUrl: boolean;
}

export interface SubscriberSingle {
  id: number;
  billingContact: BillingContact;
  billingAddress: BillingAddress;
  financialAccount: FinancialAccount;
  isActive: boolean;
  isValidated: boolean;
  isNewSubscriber: boolean;
  hasFinishedInitialSetup: boolean;
  canUseOcrApi: boolean;
  registrationDate: string; // ISO date string
  registrationDateAsString: string;
  apiUniqueId: string;
  promotionCode: PromotionCode;
  companies: Company[];
}

export type SubscriberModel = ApiResponse<SubscriberResult[]>;
export type Subscriber = ApiResponse<SubscriberSingle>;
