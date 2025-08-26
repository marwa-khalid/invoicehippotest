export const defaultPaginationConfig = {
  "transaction-module": {
    pageIndex: 1,
    filters: {
      searchTerm: "",
      statusTypes: [],
      clientFilter: null,
      periodType: null,
      yearFilter: null,
      financialAccountFilter: null,
      attachmentTypeFilter: 0,
      balanceTypeFilter: 0,
    },
  },
  "rule-module": {
    pageIndex: 1,
    filters: {
      searchTerm: "",
      clientFilter: null,
      financialAccountFilter: null,
      balanceTypeFilter: 0,
    },
  },
  "subscriber-module": {
    pageIndex: 1,
    filters: {
      searchTerm: "",
      periodType: null,
      yearFilter: null,
    },
  },
  "localization-module": {
    pageIndex: 1,
    filters: {
      searchTerm: "",
    },
  },
  "template-module": {
    pageIndex: 1,
    filters: {
      searchTerm: "",
      statusType: 0,
      subscriberFilter: null,
    },
  },
  "subscription-module": {
    pageIndex: 1,
    filters: {
      searchTerm: "",
      status: [],
      clientFilter: null,
      subscriptionTypeFilter: 0,
      periodType: null,
      yearFilter: null,
    },
  },
  "invoices-module": {
    pageIndex: 1,
    filters: {
      searchTerm: "",
      status: [],
      clientFilter: null,
      creditFilter: false,
      periodType: null,
      yearFilter: null,
    },
  },
  "inbox-module": {
    pageIndex: 1,
    filters: {
      pageIndex: 1,
      searchTerm: "",
      status: 0,
      clientFilter: null,
      creditFilter: false,
      periodType: null,
      yearFilter: null,
    },
  },
  "bookings-module": {
    pageIndex: 1,
    filters: {
      searchTerm: "",
      clientFilter: null,
      periodType: null,
      yearFilter: null,
      attachmentTypeFilter: 0,
      paymentSourceTypeFilter: 0,
    },
  },
  "cost-module": {
    pageIndex: 1,
    filters: {
      searchTerm: "",
      clientFilter: null,
      periodType: null,
      yearFilter: null,
      attachmentTypeFilter: 0,
      paymentSourceTypeFilter: 0,
      status: [],
    },
  },
  "products-module": {
    pageIndex: 1,
    filters: { searchTerm: "", clientFilter: null, productGroupId: null },
  },
  "client-picker": { pageIndex: 1, filters: { searchTerm: "" } },
  "invoice-picker": {
    pageIndex: 1,
    filters: { searchTerm: "", periodType: null, yearFilter: null },
  },
  "product-picker": { pageIndex: 1, filters: { searchTerm: "" } },
  "attachment-picker": { pageIndex: 1, filters: { searchTerm: "" } },
  "vat-module": { pageIndex: 1, filters: { searchTerm: "", documentGroup: 0 } },
  "clients-module": { pageIndex: 1, filters: { searchTerm: "" } },
  "quotes-module": {
    pageIndex: 1,
    filters: {
      searchTerm: "",
      quoteStatus: [],
      clientFilter: null,
      periodType: null,
      yearFilter: null,
    },
  },
  "ledger-module": {
    pageIndex: 1,
    filters: { searchTerm: "", ledgerTypeFilter: 0, bearingTypeFilter: 0 },
  },
  "financial-module": { pageIndex: 1, filters: { searchTerm: "" } },
  "unit-types-module": { pageIndex: 1, filters: { searchTerm: "" } },
  "productgroups-module": { pageIndex: 1, filters: { searchTerm: "" } },
  "discounts-module": { pageIndex: 1, filters: { searchTerm: "" } },
  "users-module": { pageIndex: 1, filters: { searchTerm: "" } },
  "customfields-module": {
    pageIndex: 1,
    filters: { searchTerm: "", areaTypeFilter: 0, fieldTypeFilter: 0 },
  },
  "notifications-module": {
    pageIndex: 1,
    filters: { searchTerm: "", areaUsageType: 0 },
  },
};
