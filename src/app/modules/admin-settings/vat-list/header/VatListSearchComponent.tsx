import React, { useState } from "react";
import { KTIcon } from "../../../../../_metronic/helpers";
import { useIntl } from "react-intl";
import { Filter } from "./Filter";
import clsx from "clsx";
import { useLayout } from "../../../../../_metronic/layout/core";
import enums from "../../../../../_metronic/i18n/messages/invoicehippo.enums.json";
// @ts-ignore
import { resetPaginationModule } from "../../../../helpers/paginationUtils.js";
// @ts-ignore
import { updatePagination } from "../../../../helpers/paginationUtils.js";
import { getEnumOptions } from "../../../../helpers/intlHelper";

interface ComponentProps {
  setSearchTerm: (term: string) => void;
  setVatAreaUsageTypeFilter: (type: number) => void;
  setIsFilterApplied: (type: boolean) => void;
  isFilterApplied: boolean;
  searchTerm: string;
  vatAreaUsageTypeFilter: number;
  setSearchCounter: React.Dispatch<React.SetStateAction<number>>;
  setPageIndex: (index: number) => void;
}

const VatListSearchComponent = ({
  setSearchTerm,
  setVatAreaUsageTypeFilter,
  isFilterApplied,
  setIsFilterApplied,
  searchTerm,
  vatAreaUsageTypeFilter,
  setSearchCounter,
  setPageIndex,
}: ComponentProps) => {
  const [localSearchTerm, setLocalSearchTerm] = useState<string>(searchTerm);
  const intl = useIntl();
  const [selectedOption, setSelectedOption] = useState<any>(
    getEnumOptions(enums.VatAreaUsageTypes, intl).find(
      (item) => item.value === vatAreaUsageTypeFilter
    )?.label || ""
  );

  const handleSearchClick = () => {
    if (localSearchTerm !== undefined) {
      setSearchTerm(localSearchTerm);
      const moduleKey = "vat-module";
      updatePagination(moduleKey, { searchTerm: localSearchTerm || "" }, 1);
      setSearchCounter((prev) => prev + 1);
    }
  };
  const handleResetClick = () => {
    setLocalSearchTerm("");
    setSearchTerm(""); // Reset the parent search term
    setSearchCounter((prev) => prev + 1);
    const moduleKey = "vat-module";
    resetPaginationModule(moduleKey);
    valueSetter();
  };
  const { config } = useLayout();
  const daterangepickerButtonClass = config.app?.toolbar?.fixed?.desktop
    ? "btn-light"
    : "bg-body btn-color-gray-700 btn-active-color-primary";

  const handleFilterApply = (isApplied: boolean) => {
    setIsFilterApplied(isApplied); // Update the filter applied state
  };

  const valueSetter = () => {
    setSelectedOption(null);
    setIsFilterApplied(false);
    setVatAreaUsageTypeFilter(0);
    setPageIndex(1);
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
              setVatAreaUsageTypeFilter={setVatAreaUsageTypeFilter}
              onFilterApply={handleFilterApply}
              selectedOption={selectedOption}
              setSelectedOption={setSelectedOption}
              valueSetter={valueSetter}
              setPageIndex={setPageIndex}
            />
          </div>
          {/* {filterModalOpen && <Filter />} */}
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

export { VatListSearchComponent };
