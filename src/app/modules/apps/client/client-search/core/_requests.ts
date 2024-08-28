import {
  FinancialAccountsModel,
  FinancialAccountByIdModel,
  PrivateLedgersModel,
  FinancialInstitutionsResult,
  FinancialInstitutionsModel,
  AccountAutomationModel,
  ClientModel,
  ClientResult,
  ClientFormValues,
  ContactModel,
  ContactResult,
  VatTypesForClientModel,
} from "./_models";

import {
  getRequest,
  postRequest,
  deleteRequest,
} from "../../../../auth/core/_apiservice";
import {
  GET_CLIENTS,
  POST_CLIENT,
  POST_FINANCIAL_ACCOUNT,
  GET_LEDGDER_FOR_FINANCIAL,
  GET_FINANCIALACCOUNT_BY_ID,
  GET_FINANCIAL_INSTITUTIONS,
  POST_ACCOUNT_AUTOMATION,
  UNLINK_ACCOUNT,
  POST_CONTACT,
  GET_CONTACT_BY_ID,
  GET_LEDGDER_FOR_CLIENT,
  GET_VAT_FOR_CLIENT,
} from "./constants";
import { VatTypesForLedgerModel } from "../../../admin-settings/ledgeraccounts-list/core/_models";
interface DeleteResult extends Partial<ClientModel> {}
interface ContactValues extends Partial<ContactResult> {}

export function getClients(searchTerm: string, pageIndex: number) {
  return postRequest<ClientModel>(
    GET_CLIENTS,
    {
      pageMax: 25,
      pageIndex: searchTerm ? 1 : pageIndex,
      searchTerm: searchTerm,
      includeTotals: true,
      clientFilterType: 0,
    },
    true
  );
}

export function postClient(values: ClientFormValues) {
  return postRequest<FinancialAccountsModel>(
    POST_CLIENT,
    {
      id: 0,
      companyId: values.companyId,
      businessName: values.businessName,
      kvkNr: values.kvkNr,
      btwNr: values.btwNr,
      isPrivateClient: values.isPrivateClient,
      factoringSessionStatement: values.factoringSessionStatement,
      clientTypes: values.clientTypes,
      invoiceAddress: values.invoiceAddress,
      deliveryAddress: values.deliveryAddress,
    },
    true
  );
}

export function postContact(values: ContactValues) {
  return postRequest<ContactModel>(
    POST_CONTACT,
    {
      id: values.id,
      clientId: values.clientId,
      firstName: values.firstName,
      betweenName: values.betweenName,
      lastName: values.lastName,
      emailAddress: values.emailAddress,
      phoneNr: values.phoneNr,
      mobileNr: values.mobileNr,
      department: values.department,
    },
    true
  );
}
export function getContactListById(clientId: number) {
  return getRequest<ContactModel>(`${GET_CONTACT_BY_ID}/${clientId}`, true);
}

export function deleteContact(id: number[]) {
  return deleteRequest<DeleteResult>(POST_CONTACT, id, true);
}

export function getLedgerForClient() {
  return getRequest<PrivateLedgersModel>(GET_LEDGDER_FOR_CLIENT, true);
}

export function getVatForClient() {
  return getRequest<VatTypesForClientModel>(GET_VAT_FOR_CLIENT, true);
}

//extraaaaa

export function getFinancialAccountById(editModalId: number) {
  return getRequest<FinancialAccountByIdModel>(
    `${GET_FINANCIALACCOUNT_BY_ID}/${editModalId}`,
    true
  );
}

export function getLedgerForFinancial(id: number) {
  return getRequest<PrivateLedgersModel>(
    `${GET_LEDGDER_FOR_FINANCIAL}/${id}`,
    true
  );
}

export function deleteClient(id: number[]) {
  return deleteRequest<DeleteResult>(POST_CLIENT, id, true);
}

export function getFinancialInstitutions(countryType: number) {
  return getRequest<FinancialInstitutionsModel>(
    `${GET_FINANCIAL_INSTITUTIONS}/${countryType}`,
    true
  );
}

export function postAccounAutomation(
  companyId: number,
  importDateMarker: string,
  optionalFinancialInstitutionId: string,
  redirectCommand: {
    successUrl: string;
    oopsUrl: string;
  }
) {
  return postRequest<AccountAutomationModel>(
    `${POST_ACCOUNT_AUTOMATION}`,
    {
      companyId: companyId,
      importDateMarker: importDateMarker,
      optionalFinancialInstitutionId: optionalFinancialInstitutionId,
      redirectCommand: redirectCommand,
    },
    true
  );
}

export function deleteAutomation(id: number) {
  return deleteRequest<Boolean>(`${UNLINK_ACCOUNT}/${id}`, [], true);
}
