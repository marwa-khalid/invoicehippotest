import { useIntl } from "react-intl";
import Select from "react-select";
import enums from "../../../../../../../_metronic/i18n/messages/invoicehippo.enums.json";
// @ts-ignore
import { updatePagination } from "../../../../../../helpers/paginationUtils";
import { ClientAddButtons } from "../../../../../generic/ClientAddButtons";
import { useAuth } from "../../../../../auth";
import { getEnumOptions } from "../../../../../../helpers/intlHelper";
import { AccountsResult } from "../core/_models";

interface ComponentProps {
  setClientIdForFilter: (clientId: number | null) => void;
  setBalanceType: (type: number) => void;
  setTempBalanceType: (types: number) => void;
  tempBalanceType: number;
  tempClientId: number | null;
  setIsFilterApplied: (type: boolean) => void;
  isFilterApplied: boolean;
  setTempClientId: (clientId: number | null) => void;
  setShowClientSearch: (type: boolean) => void;
  setClientName: (type: string) => void;
  setIsOpen: (type: boolean) => void;
  clientName: string;
  toggleMenu: any;
  valueSetter: any;
  isOpen: boolean;
  setPageStateIndex: (type: number) => void;
  financialAccounts: AccountsResult[];
  setFinancialAccountId: (type: number) => void;
  setTempAccountId: (type: number) => void;
  tempAccountId: number;
}

export function RuleFilter({
  isFilterApplied,
  setClientIdForFilter,
  setIsOpen,
  tempClientId,
  setIsFilterApplied,
  setBalanceType,
  setTempBalanceType,
  tempBalanceType,
  setFinancialAccountId,
  tempAccountId,
  setTempAccountId,
  setTempClientId,
  setShowClientSearch,
  setClientName,
  clientName,
  toggleMenu,
  valueSetter,
  isOpen,
  setPageStateIndex,
  financialAccounts,
}: ComponentProps) {
  const intl = useIntl();
  const { currentUser } = useAuth();

  const openClientModal = () => {
    setShowClientSearch(true);
  };

  const resetClient = () => {
    setTempClientId(null);
    setClientName("");
    setClientIdForFilter(null);
    localStorage.removeItem("storedClientForRule");
  };

  const handleBalanceTypeChange = (selectedOption: any) => {
    setTempBalanceType(selectedOption ? selectedOption.value : null);
  };

  const handleAccountChange = (selectedOption: any) => {
    setTempAccountId(selectedOption ? selectedOption.value : null);
  };

  const handleApply = () => {
    setBalanceType(tempBalanceType);
    setFinancialAccountId(tempAccountId);
    setClientIdForFilter(tempClientId);
    // Update the pagination state for the "rule-module"
    const moduleKey = "rule-module";
    updatePagination(
      moduleKey,
      {
        clientFilter: tempClientId || null,
        balanceTypeFilter: tempBalanceType || 0,
        financialAccountFilter: tempAccountId || null,
      },
      1
    );
    setPageStateIndex(1);
    toggleMenu();
  };
  const handleReset = () => {
    if (!isFilterApplied) {
      setIsOpen(false);
      return;
    } else {
      setIsFilterApplied(false);
      const moduleKey = "rule-module";
      updatePagination(
        moduleKey,
        {
          balanceTypeFilter: 0,
          clientFilter: null,
          financialAccountFilter: null,
        },
        1
      );
      valueSetter();
    }
  };

  const accounts = financialAccounts.map((account) => {
    return { value: account.id, label: account.title };
  });
  return (
    <div style={{ display: isOpen ? "block" : "none" }}>
      <div className="px-7 py-5">
        <div className="fs-5 text-gray-900 fw-bolder">
          {intl.formatMessage({ id: "Fields.FilterPopUpTitle" })}
        </div>
      </div>

      <div className="separator border-gray-200"></div>

      <div className="px-7 py-5">
        {/* financial account type Selection */}
        <div className="mb-5">
          <label className="fw-bold form-label" htmlFor="accountId">
            {intl.formatMessage({
              id: "Fields.SelectOptionDefaultFinancialAccount",
            })}
          </label>
          <Select
            inputId="accountId"
            className="react-select-styled flex flex-wrap w-350px"
            isClearable
            menuPlacement="bottom"
            placeholder={intl.formatMessage({
              id: "Fields.SelectOptionDefaultFinancialAccount",
            })}
            value={accounts.filter((option) => tempAccountId === option.value)}
            onChange={handleAccountChange}
            options={accounts}
          />
        </div>
        <div className="separator border-gray-200 mb-4"></div>

        {/* Client Search Button */}
        {!currentUser?.result.isAnonymousUser && (
          <>
            <ClientAddButtons
              clientDisplayName={clientName}
              openClientModal={openClientModal}
              openClientModalInNewMode={openClientModal}
              reset={resetClient}
              setClientSearch={openClientModal}
              type="filter"
            />
            <div className="separator border-gray-200 mb-4"></div>
          </>
        )}
        <div className="separator border-gray-200 mb-4"></div>
        <div className="mb-5">
          <label className="fw-bold form-label" htmlFor="balanceType">
            {intl.formatMessage({ id: "Fields.SelectOptionBalanceType" })}
          </label>
          <Select
            className="react-select-styled flex flex-wrap w-350px"
            isClearable
            inputId="balanceType"
            menuPlacement="top"
            placeholder={intl.formatMessage({
              id: "Fields.SelectOptionBalanceType",
            })}
            value={getEnumOptions(enums.TransactionBalanceTypes, intl).find(
              (option) => tempBalanceType === option.value
            )}
            onChange={handleBalanceTypeChange}
            options={getEnumOptions(enums.TransactionBalanceTypes, intl)}
          />
        </div>
      </div>
      <div className="separator border-gray-200 mb-4"></div>
      <div className="d-flex justify-content-end gap-2">
        <button
          type="reset"
          className="btn btn-secondary"
          onClick={handleReset}
          data-kt-menu-dismiss="true"
        >
          {intl.formatMessage({ id: "Fields.FilterResetBtn" })}
        </button>
        <button className="btn btn-primary" onClick={handleApply}>
          {intl.formatMessage({ id: "Fields.FilterApplyBtn" })}
        </button>
      </div>
    </div>
  );
}
