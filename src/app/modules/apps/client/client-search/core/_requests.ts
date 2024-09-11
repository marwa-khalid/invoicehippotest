import {
  FinancialAccountsModel,
  PrivateLedgersModel,
  ClientModel,
  ClientFormValues,
  ContactModel,
  ContactResult,
  VatTypesForClientModel,
  ClientFormValuesModel,
} from "./_models";

import {
  getRequest,
  postRequest,
  deleteRequest,
} from "../../../../auth/core/_apiservice";
import {
  GET_CLIENTS,
  POST_CLIENT,
  POST_CONTACT,
  GET_CONTACT_BY_ID,
  GET_LEDGDER_FOR_CLIENT,
  GET_VAT_FOR_CLIENT,
  GET_DEFAULT_EMPTY,
} from "./constants";
interface DeleteResult extends Partial<ClientModel> {}
interface ContactValues extends Partial<ContactResult> {}
interface PartialClientFormValues extends Partial<ClientFormValues> {}

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

export function getClientById(id: number) {
  return getRequest<ClientFormValuesModel>(
    `${POST_CLIENT}/${id}`,

    true
  );
}

export function getDefaultEmpty() {
  return getRequest<ClientFormValuesModel>(
    `${GET_DEFAULT_EMPTY}`,

    true
  );
}

export function postClient(values: ClientFormValues) {
  return postRequest<ClientFormValuesModel>(
    POST_CLIENT,
    {
      id: values.id,
      companyId: values.companyId,
      businessName: values.businessName,
      kvkNr: values.kvkNr,
      btwNr: values.btwNr,
      isPrivateClient: values.isPrivateClient,
      factoringSessionStatement: values.factoringSessionStatement,
      clientTypes: values.clientTypes,
      invoiceAddress: values.invoiceAddress,
      deliveryAddress: values.deliveryAddress,
      customFields: values.customFields,
      invoiceAndQuoteSettings: values.invoiceAndQuoteSettings,
      financialSettings: values.financialSettings,
    },
    true
  );
}

export function postClientFinancial(
  values: PartialClientFormValues,
  response: any
) {
  return postRequest<FinancialAccountsModel>(
    POST_CLIENT,
    {
      id: response.id,
      businessName: response.businessName,
      clientTypes: response.clientTypes,
      invoiceAddress: response.invoiceAddress,
      deliveryAddress: response.deliveryAddress,
      invoiceAndQuoteSettings: values.invoiceAndQuoteSettings,
      financialSettings: values.financialSettings,
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

export function deleteClient(id: number[]) {
  return deleteRequest<DeleteResult>(POST_CLIENT, id, true);
}
