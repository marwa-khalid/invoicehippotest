import { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import Select from "react-select";
import enums from "../../../../../_metronic/i18n/messages/invoicehippo.enums.json";
import { getMinMaxYear } from "../core/_requests";
// @ts-ignore
import { updatePagination } from "../../../../helpers/paginationUtils.js";
import { getDateRange } from "../../../../utils/dateUtils";

interface ComponentProps {
  tempYear: number | null;
  setYear: (year: number | null) => void;
  setTempYear: (year: number | null) => void;
  setPeriodValueType: (type: number | null) => void;
  setClientIdForFilter: (clientId: number | null) => void;
  setStatusTypes: (types: number) => void;
  tempStatus: number;
  tempPeriodType: number | null;
  tempClientId: number | null;
  setIsFilterApplied: (type: boolean) => void;
  isFilterApplied: boolean;
  setTempStatus: (status: any) => void;
  setTempPeriodType: (type: number | null) => void;
  setTempClientId: (clientId: number | null) => void;
  setShowClientSearch: (type: boolean) => void;
  setClientName: (type: string) => void;
  setIsOpen: (type: boolean) => void;
  clientName: string;
  toggleMenu: any;
  valueSetter: any;
  isOpen: boolean;
}

export function InboxFilter({
  tempYear,
  isFilterApplied,
  setYear,
  setTempYear,
  setPeriodValueType,
  setStatusTypes,
  setClientIdForFilter,
  tempStatus,
  setIsOpen,
  tempPeriodType,
  tempClientId,
  setIsFilterApplied,
  setTempPeriodType,
  setTempClientId,
  setShowClientSearch,
  setClientName,
  toggleMenu,
  valueSetter,
  isOpen,
}: ComponentProps) {
  const intl = useIntl();
  const [minMaxYear, setMinMaxYear] = useState<any>();
  useEffect(() => {
    const fetchMinMaxYear = async () => {
      const response = await getMinMaxYear();
      setMinMaxYear(response.result);
    };
    fetchMinMaxYear();
  }, []);

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

  const handleApply = () => {
    setStatusTypes(tempStatus);
    setPeriodValueType(tempPeriodType);
    setClientIdForFilter(tempClientId);
    setYear(tempYear);
    // Update the pagination state for the "inbox-module"
    const moduleKey = "inbox-module";
    updatePagination(
      moduleKey,
      {
        status: tempStatus || 0,
        periodType: tempPeriodType || null,
        clientFilter: tempClientId || null,
        yearFilter: tempYear || null,
      },
      1
    );
    toggleMenu();
  };
  const handleReset = () => {
    if (!isFilterApplied) {
      setIsOpen(false);
      return;
    } else {
      setIsFilterApplied(false);
      const moduleKey = "inbox-module";
      updatePagination(
        moduleKey,
        {
          status: [],
          periodType: null,
          clientFilter: null,
          creditFilter: null,
          yearFilter: null,
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
          <label className="form-label fw-bold">
            {intl.formatMessage({ id: "Fields.SelectOptionDefaultYear" })}:
          </label>
          <Select
            className="react-select-styled"
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
          <label className="form-label fw-bold">
            {intl.formatMessage({ id: "Fields.SelectOptionDefaultPeriod" })}:
          </label>
          <Select
            className="react-select-styled"
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
      </div>
      <div className="separator border-gray-200 mb-4"></div>
      <div className="d-flex justify-content-end gap-2">
        <button
          type="reset"
          className="btn btn-sm btn-secondary btn-active-light-primary"
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
