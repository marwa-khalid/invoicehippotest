import { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import Select from "react-select";
import enums from "../../../../../../../_metronic/i18n/messages/invoicehippo.enums.json";
import { getMinMaxYear } from "../../../../costs/components/core/_requests";
// @ts-ignore
import { updatePagination } from "../../../../../../helpers/paginationUtils";
import { ClientAddButtons } from "../../../../../generic/ClientAddButtons";
import { useAuth } from "../../../../../auth";
import { getDateRange } from "../../../../../../utils/dateUtils";
import { getEnumOptions } from "../../../../../../helpers/intlHelper";
import { AccountsResult } from "../core/_models";

interface ComponentProps {
  tempYear: number | null;
  setYear: (year: number | null) => void;
  setTempYear: (year: number | null) => void;
  setPeriodValueType: (type: number | null) => void;
  setClientIdForFilter: (clientId: number | null) => void;
  setAttachmentType: (type: number) => void;
  setBalanceType: (type: number) => void;
  setTempBalanceType: (types: number) => void;
  setTempAttachmentType: (type: number) => void;
  tempBalanceType: number;
  tempAttachmentType: number;
  tempPeriodType: number | null;
  tempClientId: number | null;
  setIsFilterApplied: (type: boolean) => void;
  isFilterApplied: boolean;
  setTempPeriodType: (type: number | null) => void;
  setTempClientId: (clientId: number | null) => void;
  setShowClientSearch: (type: boolean) => void;
  setClientName: (type: string) => void;
  setIsOpen: (type: boolean) => void;
  clientName: string;
  toggleMenu: any;
  valueSetter: any;
  isOpen: boolean;
  setPageStateIndex: (type: number) => void;
  setTempStatus: (status: any) => void;
  setProcessStatusTypes: (types: any) => void;
  tempStatus: any;
  financialAccounts: AccountsResult[];
  setFinancialAccountId: (type: number) => void;
  setTempAccountId: (type: number) => void;
  tempAccountId: number;
}

export function TransactionFilter({
  tempYear,
  isFilterApplied,
  setYear,
  setTempYear,
  setPeriodValueType,
  setClientIdForFilter,
  setIsOpen,
  tempPeriodType,
  tempClientId,
  setIsFilterApplied,
  setAttachmentType,
  setBalanceType,
  setTempBalanceType,
  tempBalanceType,
  setProcessStatusTypes,
  setFinancialAccountId,
  tempAccountId,
  setTempAccountId,
  setTempAttachmentType,
  tempAttachmentType,
  setTempPeriodType,
  setTempClientId,
  setShowClientSearch,
  setClientName,
  clientName,
  toggleMenu,
  valueSetter,
  isOpen,
  setPageStateIndex,
  setTempStatus,
  tempStatus,
  financialAccounts,
}: ComponentProps) {
  const intl = useIntl();
  const [minMaxYear, setMinMaxYear] = useState<any>();
  const { currentUser } = useAuth();
  useEffect(() => {
    const fetchMinMaxYear = async () => {
      const response = await getMinMaxYear();
      setMinMaxYear(response.result);
    };
    fetchMinMaxYear();
  }, []);

  const openClientModal = () => {
    setShowClientSearch(true);
  };

  const resetClient = () => {
    setTempClientId(null);
    setClientName("");
    setClientIdForFilter(null);
    localStorage.removeItem("storedClientForTransaction");
  };
  const quarterList = [
    enums.TaxDeclarationPeriodValueTypes[0],
    enums.TaxDeclarationPeriodValueTypes[1],
    enums.TaxDeclarationPeriodValueTypes[2],
    enums.TaxDeclarationPeriodValueTypes[3],
  ];

  const yearList = [
    enums.TaxDeclarationPeriodValueTypes[16],
    enums.TaxDeclarationPeriodValueTypes[18],
    enums.TaxDeclarationPeriodValueTypes[19],
  ];

  const [disablePeriodSelect, setDisablePeriodSelect] = useState<any>(false);

  useEffect(() => {
    if (tempYear == null) {
      setDisablePeriodSelect(true);
      setTempPeriodType(null);
    } else {
      setDisablePeriodSelect(false);
    }
  }, [tempYear]);
  // Get date range based on the selected period and year

  const renderPeriodOptions = () => {
    const periodOptions = [];
    periodOptions.push({
      label: "Per Semester or Year",
      options: yearList.map((y) => ({
        label: y.LocalizationValueKey
          ? `${intl.formatMessage({
              id: `Enums.${y.LocalizationValueKey}`,
            })} (${getDateRange(y, tempYear)})`
          : `${y?.Title} (${getDateRange(y, tempYear)})`,
        value: y?.Value,
      })),
    });
    periodOptions.push({
      label: "Per Quarter",
      options: quarterList.map((q) => ({
        label: q.LocalizationValueKey
          ? `${intl.formatMessage({
              id: `Enums.${q.LocalizationValueKey}`,
            })} (${getDateRange(q, tempYear)})`
          : `${q.Title} (${getDateRange(q, tempYear)})`,
        value: q.Value,
      })),
    });
    periodOptions.push({
      label: "Per Month",
      options: enums.MonthTypes.map((m) => ({
        label: m.LocalizationValueKey
          ? `${intl.formatMessage({
              id: `Enums.${m.LocalizationValueKey}`,
            })} ${tempYear}`
          : `${m.Title} ${tempYear}`,
        value: m.Value,
      })),
    });

    return periodOptions;
  };

  const handlePeriodTypeChange = (selectedOption: any) => {
    setTempPeriodType(selectedOption ? selectedOption.value : null);
  };

  const handleBalanceTypeChange = (selectedOption: any) => {
    setTempBalanceType(selectedOption ? selectedOption.value : null);
  };

  const handleAttachmentTypeChange = (selectedOption: any) => {
    setTempAttachmentType(selectedOption ? selectedOption.value : null);
  };
  const handleAccountChange = (selectedOption: any) => {
    setTempAccountId(selectedOption ? selectedOption.value : null);
  };
  const handleStatusChange = (selectedOptions: any) => {
    const selectedValues = selectedOptions
      ? selectedOptions.map((opt: any) => opt.value)
      : [];
    setTempStatus(selectedValues); // Store selected values in the temporary state
  };
  const handleApply = () => {
    setProcessStatusTypes(tempStatus);
    setAttachmentType(tempAttachmentType);
    setBalanceType(tempBalanceType);
    setFinancialAccountId(tempAccountId);
    setPeriodValueType(tempPeriodType);
    setClientIdForFilter(tempClientId);
    setYear(tempYear);
    // Update the pagination state for the "transaction-module"
    const moduleKey = "transaction-module";
    updatePagination(
      moduleKey,
      {
        periodType: tempPeriodType || null,
        clientFilter: tempClientId || null,
        balanceTypeFilter: tempBalanceType || 0,
        financialAccountFilter: tempAccountId || null,
        attachmentTypeFilter: tempAttachmentType || 0,
        yearFilter: tempYear || null,
        statusTypes: tempStatus || [],
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
      const moduleKey = "transaction-module";
      updatePagination(
        moduleKey,
        {
          balanceTypeFilter: 0,
          periodType: null,
          clientFilter: null,
          attachmentTypeFilter: 0,
          yearFilter: null,
          financialAccountFilter: null,
          statusTypes: [],
        },
        1
      );
      valueSetter();
    }
  };

  const yearOptions = Array.from(
    { length: minMaxYear?.maxYear - minMaxYear?.minYear + 1 },
    (_, i) => {
      const year = minMaxYear.maxYear - i;
      return { value: year, label: year.toString() };
    }
  );
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
        {/* Year Selection */}
        <div className="mb-5">
          <label className="form-label fw-bold" htmlFor="year">
            {intl.formatMessage({ id: "Fields.SelectOptionDefaultYear" })}:
          </label>
          <Select
            className="react-select-styled"
            inputId="year"
            placeholder={intl.formatMessage({
              id: "Fields.SelectOptionDefaultYear",
            })}
            menuPlacement="bottom"
            value={
              yearOptions.find((option) => option.value === tempYear) || null
            }
            onChange={(option) => {
              setTempYear(option ? option.value : null);
              if (tempPeriodType === null || tempPeriodType === null) {
                setTempPeriodType(13);
              }
            }}
            options={yearOptions}
            isClearable
          />
        </div>

        {/* Period Selection */}
        <div className="mb-5">
          <label className="form-label fw-bold" htmlFor="period">
            {intl.formatMessage({ id: "Fields.SelectOptionDefaultPeriod" })}:
          </label>
          <Select
            className="react-select-styled"
            inputId="period"
            menuPlacement="bottom"
            value={
              renderPeriodOptions()
                .flatMap((group) => group.options)
                .find((option) => option.value === tempPeriodType) || null
            }
            onChange={handlePeriodTypeChange}
            options={renderPeriodOptions()}
            placeholder={intl.formatMessage({
              id: "Fields.SelectOptionDefaultPeriod",
            })}
            isClearable
            isDisabled={disablePeriodSelect}
          />
        </div>
        <div className="separator border-gray-200 mb-4"></div>
        {/* receipt Status Selection */}
        <div className="mb-5">
          <label className="fw-bold form-label" htmlFor="status">
            {intl.formatMessage({ id: "Fields.SelectOptionDefaultStatusType" })}
          </label>
          <Select
            className="react-select-styled flex flex-wrap w-350px"
            isClearable
            menuPlacement="bottom"
            isMulti
            placeholder={intl.formatMessage({
              id: "Fields.SelectOptionDefaultStatusType",
            })}
            inputId="status"
            value={getEnumOptions(
              enums.TransactionsItemProcessStatusTypes,
              intl
            ).filter((option) => tempStatus?.includes(option.value))}
            onChange={handleStatusChange}
            options={getEnumOptions(
              currentUser?.result.isAnonymousUser
                ? enums.TransactionsItemProcessStatusTypes.filter(
                    (item) => item.Value === 1 || item.Value === 512
                  )
                : enums.TransactionsItemProcessStatusTypes,
              intl
            )}
          />
        </div>
        <div className="separator border-gray-200 mb-4"></div>
        {/* attachment type Selection */}
        <div className="mb-5">
          <label className="fw-bold form-label" htmlFor="accountType">
            {intl.formatMessage({
              id: "Fields.SelectOptionDefaultFinancialAccount",
            })}
          </label>
          <Select
            inputId="accountType"
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
        {/* attachment type Selection */}
        <div className="mb-5">
          <label className="fw-bold form-label" htmlFor="attachmentType">
            select an attachment type
          </label>
          <Select
            inputId="attachmentType"
            className="react-select-styled flex flex-wrap w-350px"
            isClearable
            menuPlacement="bottom"
            placeholder="select an attachment type"
            value={getEnumOptions(enums.IncludingAttachmentsTypes, intl).filter(
              (option) => tempAttachmentType === option.value
            )}
            onChange={handleAttachmentTypeChange}
            options={getEnumOptions(enums.IncludingAttachmentsTypes, intl)}
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
            select a balance type
          </label>
          <Select
            className="react-select-styled flex flex-wrap w-350px"
            isClearable
            inputId="balanceType"
            menuPlacement="top"
            placeholder="select a balance type"
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
