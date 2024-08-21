const API_URL_V1 =
  import.meta.env.INVOICEHIPPO_API_CORE_V1 ||
  "https://api-tst.invoicehippo.nl/api/v1";

export const PRODUCT_GROUP = `${API_URL_V1}/product-group`;
