import React, { useEffect, useState } from "react";
import { KTIcon } from "../../../../../../../_metronic/helpers";
import { useIntl } from "react-intl";
import { Filter } from "./Filter";
import clsx from "clsx";
import { useLayout } from "../../../../../../../_metronic/layout/core";

interface ComponentProps {
  setSearchTerm: (term: string) => void;
  searchTerm: string;
  setLedgerTypeFilter: (type: number) => void;
  setIsFilterApplied: (type: boolean) => void;
  setBearingTypeFilter: (type: number) => void;
  bearingTypeFilter: number;
  isFilterApplied: boolean;
  ledgerTypeFilter: number;
}

const LedgerListSearchComponent = ({
  setSearchTerm,
  searchTerm,
  setLedgerTypeFilter,
  setIsFilterApplied,
  setBearingTypeFilter,
  bearingTypeFilter,
  isFilterApplied,
  ledgerTypeFilter,
}: ComponentProps) => {
  const [localSearchTerm, setLocalSearchTerm] = useState<string>(searchTerm);
  const intl = useIntl();
  const [tempLedgerTypeOption, setTempLedgerTypeOption] =
    useState<any>(ledgerTypeFilter);
  const [tempBearingTypeOption, setTempBearingTypeOption] =
    useState<any>(bearingTypeFilter);

  const handleSearchClick = () => {
    if (localSearchTerm !== undefined) {
      // Update the query state and parent search term when search button is clicked
      setSearchTerm(localSearchTerm);
      let storedPaginationString = localStorage.getItem("pagination");
      // Parse the JSON string to get the JavaScript object, or initialize an empty object if it doesn't exist
      let pagination = storedPaginationString
        ? JSON.parse(storedPaginationString)
        : {
            "vat-module": {
              pageIndex: 1,
              filters: { searchTerm: "", documentGroup: 0 },
            },
            "ledger-module": {
              pageIndex: 1,
              filters: {
                searchTerm: "",
                ledgerTypeFilter: 0,
                bearingTypeFilter: 0,
              },
            },
            "financial-module": {
              pageIndex: 1,
              filters: { searchTerm: "" },
            },
            "unit-types-module": {
              pageIndex: 1,
              filters: { searchTerm: "" },
            },
            "productgroups-module": {
              pageIndex: 1,
              filters: { searchTerm: "" },
            },
            "discounts-module": {
              pageIndex: 1,
              filters: { searchTerm: "" },
            },
            "users-module": {
              pageIndex: 1,
              filters: { searchTerm: "" },
            },
            "customfields-module": {
              pageIndex: 1,
              filters: {
                searchTerm: "",
                areaTypeFilter: 0,
                fieldTypeFilter: 0,
              },
            },
          };
      // Update the filter in the vat-module
      pagination["ledger-module"].filters.searchTerm = localSearchTerm;
      // Convert the updated object back to a JSON string
      const updatedPaginationString = JSON.stringify(pagination);
      // Store the updated JSON string in local storage
      localStorage.setItem("pagination", updatedPaginationString);
    }
  };
  const handleResetClick = () => {
    setLocalSearchTerm("");
    setSearchTerm("");
    setIsFilterApplied(false);
    resetFilter();
  };
  const { config } = useLayout();
  const daterangepickerButtonClass = config.app?.toolbar?.fixed?.desktop
    ? "btn-light"
    : "bg-body btn-color-gray-700 btn-active-color-primary";
  const handleFilterApply = (isApplied: boolean) => {
    setIsFilterApplied(isApplied); // Update the filter applied state
  };
  const resetFilter = () => {
    setBearingTypeFilter(0);
    setLedgerTypeFilter(0);
    setLocalSearchTerm("");
    setTempBearingTypeOption(0);
    setTempLedgerTypeOption(0);
    setSearchTerm(""); // Reset the parent search term
    setIsFilterApplied(false);
    localStorage.setItem(
      "pagination",
      JSON.stringify({
        ...JSON.parse(localStorage.getItem("pagination") || "{}"),
        "ledger-module": {
          ...JSON.parse(localStorage.getItem("pagination") || "{}")[
            "ledger-module"
          ],
          filters: {
            ...JSON.parse(localStorage.getItem("pagination") || "{}")[
              "ledger-module"
            ]?.filters,
            searchTerm: "",
            ledgerTypeFilter: 0,
            bearingTypeFilter: 0,
          },
        },
      })
    );
  };

  return (
    <div className="w-full mb-10">
      {/* Full-width search input */}
      <div className="d-flex align-items-center position-relative mb-2 gap-2 ">
        <KTIcon iconName="magnifier" className="fs-3 position-absolute ms-6" />
        <input
          type="text"
          data-kt-user-table-filter="search"
          className="form-control form-control-solid w-100 ps-14 rounded-lg me-6"
          placeholder={intl.formatMessage({ id: "Fields.SearchTerm" })}
          value={localSearchTerm}
          onChange={(e) => {
            e.preventDefault();
            setLocalSearchTerm(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearchClick();
            }
          }}
        />
        <div className="btn-group  gap-2">
          <button
            className="btn btn-primary d-inline-flex align-items-center"
            onClick={handleSearchClick}
          >
            <i className="la la-search fs-2"></i>
            <span className="ms-1">
              {intl.formatMessage({ id: "Fields.SearchBtn" })}
            </span>
          </button>
          <div className="m-0">
            <a
              href="#"
              className={clsx(
                "btn btn-secondary btn-icon bg-secondary fw-bold rounded-0",
                daterangepickerButtonClass,
                { "bg-warning": isFilterApplied }
              )}
              data-kt-menu-trigger="hover"
              data-kt-menu-placement="bottom-end"
            >
              <i
                className={`ki-solid ki-filter fs-3 me-1  ${
                  isFilterApplied ? "text-white" : "text-muted"
                }`}
              />
            </a>
            <Filter
              setLedgerTypeFilter={setLedgerTypeFilter}
              setBearingTypeFilter={setBearingTypeFilter}
              onFilterApply={handleFilterApply}
              tempBearingTypeOption={tempBearingTypeOption}
              tempLedgerTypeOption={tempLedgerTypeOption}
              setTempBearingTypeOption={setTempBearingTypeOption}
              setTempLedgerTypeOption={setTempLedgerTypeOption}
            />
          </div>
          <button
            className="btn btn-secondary btn-icon"
            onClick={handleResetClick}
          >
            <i className="la la-remove fs-3"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export { LedgerListSearchComponent };
