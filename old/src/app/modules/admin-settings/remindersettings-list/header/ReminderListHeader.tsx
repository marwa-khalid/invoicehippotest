import { KTCardBody } from "../../../../../_metronic/helpers";
import React, { useState } from "react";
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
  setAreaUsageType: (type: number) => void;
  areaUsageType: number;
  setIsFilterApplied: (type: boolean) => void;
  isFilterApplied: boolean;
  searchTerm: string;
  setPageIndex: (index: number) => void;
  setSearchCounter: React.Dispatch<React.SetStateAction<number>>;
}

const ReminderListHeader = ({
  setSearchTerm,
  areaUsageType,
  setIsFilterApplied,
  searchTerm,
  isFilterApplied,
  setAreaUsageType,
  setSearchCounter,
  setPageIndex,
}: ComponentProps) => {
  const [localSearchTerm, setLocalSearchTerm] = useState<string>(searchTerm);
  const intl = useIntl();
  const [tempAreaTypeOption, setTempAreaTypeOption] =
    useState<any>(areaUsageType);

  const handleSearchClick = () => {
    if (localSearchTerm !== undefined) {
      setSearchTerm(localSearchTerm);
      const moduleKey = "notifications-module";
      updatePagination(moduleKey, { searchTerm: localSearchTerm || "" }, 1);
      setSearchCounter((prev) => prev + 1);
      setPageIndex(1);
    }
  };
  const handleResetClick = () => {
    setLocalSearchTerm("");
    setSearchTerm("");
    setSearchCounter((prev) => prev + 1);
    const moduleKey = "notifications-module";
    resetPaginationModule(moduleKey);
    valueSetter();
  };
  const valueSetter = () => {
    setAreaUsageType(0);
    setTempAreaTypeOption(0);
    setIsFilterApplied(false);
  };
  const { config } = useLayout();
  const daterangepickerButtonClass = config.app?.toolbar?.fixed?.desktop
    ? "btn-light"
    : "bg-body btn-color-gray-700 btn-active-color-primary";
  const handleFilterApply = (isApplied: boolean) => {
    setIsFilterApplied(isApplied); // Update the filter applied state
  };
  return (
    <KTCardBody className="card mb-5 mb-xl-10 pb-0">
      <div className="card-body pt-9 pb-0">
        {/* Full-width search and button */}
        <div className="w-full mb-10">
          {/* Full-width search input */}
          <div className="d-flex align-items-center position-relative mb-2 gap-2 ">
            <KTIcon
              iconName="magnifier"
              className="fs-3 position-absolute ms-6"
            />
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
            <div className="btn-group gap-2">
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
                  setAreaUsageType={setAreaUsageType}
                  onFilterApply={handleFilterApply}
                  tempAreaTypeOption={tempAreaTypeOption}
                  setTempAreaTypeOption={setTempAreaTypeOption}
                  valueSetter={valueSetter}
                  setPageStateIndex={setPageIndex}
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
      </div>
    </KTCardBody>
  );
};

export { ReminderListHeader };
