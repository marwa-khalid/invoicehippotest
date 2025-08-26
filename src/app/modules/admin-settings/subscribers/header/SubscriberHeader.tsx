import { KTCardBody } from "../../../../../_metronic/helpers";
import React, { useEffect, useState } from "react";
import { KTIcon } from "../../../../../_metronic/helpers";
import { useIntl } from "react-intl";
import { SubscriberFilter } from "./SubscriberFilter";
import clsx from "clsx";
import { useLayout } from "../../../../../_metronic/layout/core";
import { Menu, MenuButton, MenuList } from "@chakra-ui/react";
// @ts-ignore
import { resetPaginationModule } from "../../../../helpers/paginationUtils.js";
// @ts-ignore
import { updatePagination } from "../../../../helpers/paginationUtils.js";

interface ComponentProps {
  setSearchTerm: (term: string) => void;
  setPeriodValueType: (type: number | null) => void;
  periodValueType: number | null;
  year: number | null;
  setYear: (year: number | null) => void;
  setIsFilterApplied: (type: boolean) => void;
  isFilterApplied: boolean;
  searchTerm: string;
  setPageIndex: (index: number) => void;
  setSearchCounter: React.Dispatch<React.SetStateAction<number>>;
}

const SubscriberHeader = ({
  setSearchTerm,
  setYear,
  year,
  setPeriodValueType,
  periodValueType,
  setIsFilterApplied,
  searchTerm,
  isFilterApplied,
  setSearchCounter,
  setPageIndex,
}: ComponentProps) => {
  const [localSearchTerm, setLocalSearchTerm] = useState<string>(searchTerm);
  const intl = useIntl();
  const [tempYear, setTempYear] = useState<number | null>(year);
  const [tempPeriodType, setTempPeriodType] = useState<number | null>(
    periodValueType
  );
  const handleSearchClick = () => {
    if (localSearchTerm !== undefined) {
      setSearchTerm(localSearchTerm);
      const moduleKey = "subscriber-module";
      updatePagination(moduleKey, { searchTerm: localSearchTerm || "" }, 1);
      setSearchCounter((prev) => prev + 1);
      setPageIndex(1);
    }
  };
  useEffect(() => {
    if (year || periodValueType) {
      setIsFilterApplied(true);
    } else {
      setIsFilterApplied(false);
    }
  }, [year, periodValueType]);
  const handleResetClick = () => {
    setLocalSearchTerm("");
    setSearchTerm("");
    setSearchCounter((prev) => prev + 1);
    const moduleKey = "subscriber-module";
    resetPaginationModule(moduleKey);
    valueSetter();
  };
  const valueSetter = () => {
    setTempPeriodType(null);
    setPeriodValueType(null);
    setTempYear(null);
    setYear(null);
  };
  const { config } = useLayout();
  const daterangepickerButtonClass = config.app?.toolbar?.fixed?.desktop
    ? "btn-light"
    : "bg-body btn-color-gray-700 btn-active-color-primary";
  const handleFilterApply = (isApplied: boolean) => {
    setIsFilterApplied(isApplied); // Update the filter applied state
  };
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => {
    setIsOpen((prev) => !prev); // Toggle menu open/close
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
              <Menu
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                closeOnBlur={false}
                flip={false}
                placement="bottom-end"
              >
                <MenuButton
                  className={clsx(
                    "btn bg-secondary btn-icon fw-bold rounded-0",
                    daterangepickerButtonClass,
                    { "bg-warning": isFilterApplied }
                  )}
                  onClick={toggleMenu}
                >
                  <i
                    className={`ki-solid ki-filter fs-3 me-1 
            ${isFilterApplied ? "text-white" : "text-muted"}
          `}
                  />
                </MenuButton>
                <MenuList className="p-5 bg-body border-0 shadow-sm" zIndex={3}>
                  <SubscriberFilter
                    tempYear={tempYear}
                    setYear={setYear}
                    setTempYear={setTempYear}
                    setPeriodValueType={setPeriodValueType}
                    tempPeriodType={tempPeriodType}
                    setTempPeriodType={setTempPeriodType}
                    toggleMenu={toggleMenu}
                    valueSetter={valueSetter}
                    setPageStateIndex={setPageIndex}
                    isFilterApplied={isFilterApplied}
                    setIsOpen={setIsOpen}
                    isOpen={isOpen}
                    setIsFilterApplied={setIsFilterApplied}
                  />
                </MenuList>
              </Menu>
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

export { SubscriberHeader };
