import { KTCardBody } from "../../../../../_metronic/helpers";
import React, { useEffect, useState } from "react";
import { KTIcon } from "../../../../../_metronic/helpers";
import { useIntl } from "react-intl";
import { LedgerFilter } from "./LedgerFilter";
import clsx from "clsx";
import { useLayout } from "../../../../../_metronic/layout/core";
// @ts-ignore
import { resetPaginationModule } from "../../../../helpers/paginationUtils.js";
// @ts-ignore
import { updatePagination } from "../../../../helpers/paginationUtils.js";
import { Menu, MenuButton, MenuList } from "@chakra-ui/react";

interface ComponentProps {
  setSearchTerm: (term: string) => void;
  setLedgerTypeFilter: (type: number) => void;
  setBearingTypeFilter: (type: number) => void;
  searchTerm: string;
  ledgerTypeFilter: number;
  setSearchCounter: React.Dispatch<React.SetStateAction<number>>;
  bearingTypeFilter: number;
  setPageIndex: (type: number) => void;
}

const LedgerListHeader = ({
  setSearchTerm,
  setLedgerTypeFilter,
  searchTerm,
  ledgerTypeFilter,
  setBearingTypeFilter,
  bearingTypeFilter,
  setSearchCounter,
  setPageIndex,
}: ComponentProps) => {
  const [localSearchTerm, setLocalSearchTerm] = useState<string>(searchTerm);
  const intl = useIntl();
  const [tempLedgerTypeOption, setTempLedgerTypeOption] =
    useState<number>(ledgerTypeFilter);
  const [tempBearingTypeOption, setTempBearingTypeOption] =
    useState<number>(bearingTypeFilter);
  const [isFilterApplied, setIsFilterApplied] = useState<boolean>(false);

  const handleSearchClick = () => {
    if (localSearchTerm !== undefined) {
      // Update the query state and parent search term when search button is clicked
      setSearchTerm(localSearchTerm);
      const moduleKey = "ledger-module";
      updatePagination(moduleKey, { searchTerm: localSearchTerm || "" }, 1);
      setSearchCounter((prev) => prev + 1);
      setPageIndex(1);
    }
  };

  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => {
    setIsOpen((prev) => !prev); // Toggle menu open/close
  };
  useEffect(() => {
    if (bearingTypeFilter || ledgerTypeFilter) {
      setIsFilterApplied(true);
    } else {
      setIsFilterApplied(false);
    }
  }, [bearingTypeFilter, ledgerTypeFilter]);
  const handleResetClick = () => {
    setLocalSearchTerm("");
    valueSetter();
    setSearchTerm("");
    const moduleKey = "ledger-module";
    resetPaginationModule(moduleKey);
    setIsOpen(false);
  };
  const { config } = useLayout();
  const daterangepickerButtonClass = config.app?.toolbar?.fixed?.desktop
    ? "btn-light"
    : "bg-body btn-color-gray-700 btn-active-color-primary";

  const valueSetter = () => {
    setBearingTypeFilter(0);
    setLedgerTypeFilter(0);
    setTempBearingTypeOption(0);
    setTempLedgerTypeOption(0);
    setIsOpen(false);
    setPageIndex(1);
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
                  <LedgerFilter
                    setLedgerTypeFilter={setLedgerTypeFilter}
                    setBearingTypeFilter={setBearingTypeFilter}
                    setIsFilterApplied={setIsFilterApplied}
                    tempBearingTypeOption={tempBearingTypeOption}
                    tempLedgerTypeOption={tempLedgerTypeOption}
                    setTempBearingTypeOption={setTempBearingTypeOption}
                    setTempLedgerTypeOption={setTempLedgerTypeOption}
                    valueSetter={valueSetter}
                    setPageIndex={setPageIndex}
                    isFilterApplied={isFilterApplied}
                    toggleMenu={toggleMenu}
                    setIsOpen={setIsOpen}
                    isOpen={isOpen}
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

export { LedgerListHeader };
