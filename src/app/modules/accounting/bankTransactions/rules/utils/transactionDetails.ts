export const TRANSACTION_DETAILS = (transaction: any, intl: any) => {
  const associatedAccounts =
    transaction?.associatedAccounts?.map((account: any) => ({
      iconClass: "ki-duotone ki-black-up", // Red upward arrow icon
      labelId: "Fields.MainAccountNumber",
      value: account.displayName,
      colorClass: "text-danger",
    })) || [];

  const associatedAccountHolders =
    transaction?.associatedAccountHolders?.map((holder: any) => ({
      iconClass: "ki-duotone ki-black-down", // Green downward arrow icon
      labelId: "Fields.CounterPartyAccountNumber",
      value: holder.displayName,
      colorClass: "text-success",
    })) || [];

  return [...associatedAccounts, ...associatedAccountHolders];
};
