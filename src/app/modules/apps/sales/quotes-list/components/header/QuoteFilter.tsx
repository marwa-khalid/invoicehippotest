import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import Select from "react-select";
import enums from "../../../../../../../invoicehippo.enums.json";
import { getMinMaxYear } from "../../core/_requests";
import { ClientSearch } from "../../quote-add-modal/ClientSearch";
import { MenuDivider } from "@chakra-ui/react";

interface ComponentProps {
  tempYear: number | null;
  setYear: (year: number | null) => void;
  setTempYear: (year: number | null) => void;
  setPeriodValueType: (type: number | null) => void;
  setQuoteStatusTypes: (types: any) => void;
  setClientIdForFilter: (clientId: number | null) => void;
  tempQuoteStatus: any;
  tempPeriodType: number | null;
  tempClientId: number | null;
  setIsFilterApplied: (type: boolean) => void;
  setTempQuoteStatus: (status: any) => void;
  setTempPeriodType: (type: number | null) => void;
  setTempClientId: (clientId: number | null) => void;
  setShowClientSearch: (type: boolean) => void;
  setClientName: (type: string) => void;
  setIsOpen: (type: boolean) => void;
  clientName: string;
  toggleMenu: any;
  checkForReset: boolean;
}

export function QuoteFilter({
  tempYear,
  setYear,
  setTempYear,
  setPeriodValueType,
  setQuoteStatusTypes,
  setClientIdForFilter,
  tempQuoteStatus,
  setIsOpen,
  tempPeriodType,
  tempClientId,
  setIsFilterApplied,
  setTempQuoteStatus,
  setTempPeriodType,
  setTempClientId,
  setShowClientSearch,
  setClientName,
  clientName,
  toggleMenu,
  checkForReset,
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
    enums.TaxDeclarationPeriodValueTypes[15],
    enums.TaxDeclarationPeriodValueTypes[16],
    enums.TaxDeclarationPeriodValueTypes[17],
    enums.TaxDeclarationPeriodValueTypes[18],
  ];

  const yearList = [
    enums.TaxDeclarationPeriodValueTypes[13],
    enums.TaxDeclarationPeriodValueTypes[19],
    enums.TaxDeclarationPeriodValueTypes[20],
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
  const getDateRange = (period: any, tempYear: any) => {
    const periodValue = typeof period === "number" ? period : period?.Value;

    switch (periodValue) {
      case 101:
        return `01-01-${tempYear} - 31-03-${tempYear}`;
      case 102:
        return `01-04-${tempYear} - 30-06-${tempYear}`;
      case 103:
        return `01-07-${tempYear} - 30-09-${tempYear}`;
      case 104:
        return `01-10-${tempYear} - 31-12-${tempYear}`;
      case 201:
        return `01-01-${tempYear} - 30-06-${tempYear}`;
      case 202:
        return `01-07-${tempYear} - 31-12-${tempYear}`;
      case 13:
        return `01-01-${tempYear} - 31-12-${tempYear}`;
      default:
        return "";
    }
  };

  const renderPeriodOptions = () => {
    let periodOptions = [];
    periodOptions.push({
      label: "Per Semester or Year",
      options: yearList.map((y) => ({
        label: `${y.Title} (${getDateRange(y, tempYear)})`,
        value: y.Value,
      })),
    });
    periodOptions.push({
      label: "Per Quarter",
      options: quarterList.map((q) => ({
        label: `${q.Title} (${getDateRange(q, tempYear)})`,
        value: q.Value,
      })),
    });
    periodOptions.push({
      label: "Per Month",
      options: enums.MonthTypes.map((q) => ({
        label: `${q.Title} ${tempYear}`,
        value: q.Value,
      })),
    });

    return periodOptions;
  };

  const handlePeriodTypeChange = (selectedOption: any) => {
    setTempPeriodType(selectedOption ? selectedOption.value : null);
  };

  const handleApply = () => {
    setQuoteStatusTypes(tempQuoteStatus);
    setPeriodValueType(tempPeriodType);
    setClientIdForFilter(tempClientId);
    setYear(tempYear);
    const storedPaginationString = localStorage.getItem("pagination");

    const pagination = storedPaginationString
      ? JSON.parse(storedPaginationString)
      : JSON.parse(import.meta.env.VITE_APP_PAGINATION);

    pagination["quotes-module"].filters.quoteStatus = tempQuoteStatus
      ? tempQuoteStatus
      : [];
    pagination["quotes-module"].filters.periodType = tempPeriodType
      ? tempPeriodType
      : null;
    pagination["quotes-module"].filters.clientFilter = tempClientId
      ? tempClientId
      : null;
    pagination["quotes-module"].filters.yearFilter = tempYear ? tempYear : null;
    pagination["quotes-module"].pageIndex = 1;
    localStorage.setItem("pagination", JSON.stringify(pagination));

    // You can add more logic to send this data to pagination or handle other states
    // setIsFilterApplied(true);
    toggleMenu();
  };
  const handleReset = () => {
    setIsFilterApplied(false);
    localStorage.setItem(
      "pagination",
      JSON.stringify({
        ...JSON.parse(localStorage.getItem("pagination") || "{}"),
        "quotes-module": {
          ...JSON.parse(localStorage.getItem("pagination") || "{}")[
            "quotes-module"
          ],
          filters: {},
        },
      })
    );
    // Clear selected client ID
    setTempClientId(null);
    setTempQuoteStatus([]);
    setTempPeriodType(null);
    setClientIdForFilter(null);
    setQuoteStatusTypes([]);
    setPeriodValueType(null);
    setTempYear(null);
    setYear(null);
    setClientName("");
    localStorage.removeItem("storedClient");
    setIsOpen(false);

    // Default to All Years
  };

  useEffect(() => {
    handleReset();
  }, [checkForReset]);

  const handleQuoteStatusChange = (selectedOptions: any) => {
    const selectedValues = selectedOptions
      ? selectedOptions.map((opt: any) => opt.value)
      : [];
    setTempQuoteStatus(selectedValues); // Store selected values in the temporary state
  };

  const yearOptions = Array.from(
    { length: minMaxYear?.maxYear - minMaxYear?.minYear + 1 },
    (_, i) => {
      const year = minMaxYear.maxYear - i;
      return { value: year, label: year.toString() };
    }
  );

  return (
    <div>
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
        <div className="separator border-gray-200 mb-4"></div>
        {/* Quote Status Selection */}
        <div className="mb-5">
          <label className="form-label fw-bold">
            {intl.formatMessage({ id: "Fields.SelectOptionDefaultStatusType" })}
          </label>
          <Select
            className="react-select-styled react-select flex flex-wrap w-350px"
            isClearable
            menuPlacement="bottom"
            isMulti
            placeholder={intl.formatMessage({
              id: "Fields.SelectOptionDefaultStatusType",
            })}
            value={enums.QuoteStatusTypes.map((item) => ({
              value: item.Value,
              label: item.Title,
            })).filter((option) => tempQuoteStatus?.includes(option.value))}
            onChange={handleQuoteStatusChange}
            options={enums.QuoteStatusTypes.map((item) => ({
              value: item.Value,
              label: item.Title,
            }))}
          />
        </div>
        <div className="separator border-gray-200 mb-4"></div>
        {/* Client Search Button */}
        <div className="mb-3 ">
          <label className="form-label fw-bold">
            {intl.formatMessage({ id: "Fields.SelectOptionDefaultClient" })}:
          </label>
          <div className="d-flex gap-1 w-100">
            <button
              className="btn btn-primary d-inline-flex align-items-center flex-grow-1 rounded-end-0 h-40px"
              onClick={() => {
                setShowClientSearch(true);
              }}
            >
              <i className="la la-user-plus fs-2"></i>
              <span className="ms-1">
                {!clientName
                  ? intl.formatMessage({
                      id: "Fields.SelectOptionDefaultClient",
                    })
                  : clientName?.length > 25
                  ? `${clientName?.slice(0, 25)}...`
                  : clientName}
              </span>
            </button>

            {clientName && (
              <button
                className="btn btn-icon btn-secondary cursor-pointer rounded-0 h-40px flex-shrink-0"
                onClick={() => {
                  setClientIdForFilter(null);
                  setClientName("");
                  localStorage.removeItem("storedClient");
                }}
              >
                <i className="la la-remove fs-3"></i>
              </button>
            )}

            <button
              className="btn btn-icon btn-warning cursor-pointer h-40px rounded-end rounded-0 flex-shrink-0"
              onClick={() => {
                setShowClientSearch(true);
              }}
            >
              <i className="la la-search-plus fs-3"></i>
            </button>
          </div>
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
