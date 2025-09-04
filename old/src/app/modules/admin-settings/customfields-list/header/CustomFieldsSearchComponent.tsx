import { useState } from "react";
import { KTIcon } from "../../../../../_metronic/helpers";
import { useIntl } from "react-intl";
import { Filter } from "./Filter";
import clsx from "clsx";
import { useLayout } from "../../../../../_metronic/layout/core";
// @ts-ignore
import { resetPaginationModule } from "../../../../helpers/paginationUtils.js";
// @ts-ignore
import { updatePagination } from "../../../../helpers/paginationUtils.js";

interface ComponentProps {
  setSearchTerm: (term: string) => void;
  searchTerm: string;
  setSearchCounter: React.Dispatch<React.SetStateAction<number>>;
  setFieldTypeFilter: (type: number) => void;
  setAreaTypeFilter: (type: number) => void;
  areaTypeFilter: number;
  fieldTypeFilter: number;
  setIsFilterApplied: (type: boolean) => void;
  isFilterApplied: boolean;
  setPageIndex: (type: number) => void;
}
const CustomFieldsSearchComponent = ({
  setSearchTerm,
  searchTerm,
  setSearchCounter,
  setFieldTypeFilter,
  setAreaTypeFilter,
  areaTypeFilter,
  fieldTypeFilter,
  setIsFilterApplied,
  isFilterApplied,
  setPageIndex,
}: ComponentProps) => {
  const [localSearchTerm, setLocalSearchTerm] = useState<string>(searchTerm);
  const [tempFieldTypeOption, setTempFieldTypeOption] =
    useState<any>(fieldTypeFilter);
  const [tempAreaTypeOption, setTempAreaTypeOption] =
    useState<any>(areaTypeFilter);
  const intl = useIntl();

  const handleSearchClick = () => {
    if (localSearchTerm !== undefined) {
      // Update the query state and parent search term when search button is clicked
      setSearchTerm(localSearchTerm);
      const moduleKey = "customfields-module";
      updatePagination(moduleKey, { searchTerm: localSearchTerm || "" }, 1);
      setSearchCounter((prev) => prev + 1);
      setPageIndex(1);
    }
  };
  const handleResetClick = () => {
    setLocalSearchTerm("");
    setSearchTerm(""); // Reset the parent search term
    const moduleKey = "customfields-module";
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
    setFieldTypeFilter(0);
    setAreaTypeFilter(0);
    setTempAreaTypeOption(0);
    setTempFieldTypeOption(0);
    setIsFilterApplied(false);
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
                className={clsx(
                  "ki-solid ki-filter fs-3 me-1",

                  isFilterApplied ? "text-white" : "text-muted"
                )}
              />
            </a>
            <Filter
              setFieldTypeFilter={setFieldTypeFilter}
              setAreaTypeFilter={setAreaTypeFilter}
              onFilterApply={handleFilterApply}
              tempAreaTypeOption={tempAreaTypeOption}
              tempFieldTypeOption={tempFieldTypeOption}
              setTempAreaTypeOption={setTempAreaTypeOption}
              setTempFieldTypeOption={setTempFieldTypeOption}
              valueSetter={valueSetter}
              setPageIndex={setPageIndex}
            />
          </div>
          {/* {filterModalOpen && <Filter />} */}
          <button
            className="btn btn-secondary btn-icon"
            onClick={handleResetClick}
          >
            <i className="la la-remove fs-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

export { CustomFieldsSearchComponent };
