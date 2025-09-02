import { KTCardBody, KTIcon } from "../../../../../_metronic/helpers/index.js";
import { useLayout } from "../../../../../_metronic/layout/core/index.js";
import { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import clsx from "clsx";
import { Menu, MenuButton, MenuList } from "@chakra-ui/react";
import { BudgetFilter } from "./BudgetFilter.js";
// @ts-ignore
import { resetPaginationModule } from "../../../../helpers/paginationUtils.js";
// @ts-ignore
import { updatePagination } from "../../../../helpers/paginationUtils.js";

interface ComponentProps {
  setSearchTerm: (term: string) => void;
  searchTerm: string;
  setSearchCounter: React.Dispatch<React.SetStateAction<number>>;
  setBudgetGroupId: (type: number | null) => void;
  budgetGroupId: number | null;
  setPageIndexState: (type: number) => void;
}

const BudgetHeader = ({
  setSearchTerm,
  searchTerm,
  setSearchCounter,
  setBudgetGroupId,
  budgetGroupId,
  setPageIndexState,
}: ComponentProps) => {
  const [localSearchTerm, setLocalSearchTerm] = useState<string>(searchTerm);
  const intl = useIntl();
  const [tempBudgetGroupId, setTempBudgetGroupId] = useState<number | null>(
    budgetGroupId
  );
  useEffect(() => {
    setTempBudgetGroupId(budgetGroupId);
  }, []);
  const [isFilterApplied, setIsFilterApplied] = useState<boolean>(false);

  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => {
    setIsOpen((prev) => !prev); // Toggle menu open/close
  };
  const handleSearchClick = () => {
    if (localSearchTerm !== undefined) {
      setSearchTerm(localSearchTerm);
      const moduleKey = "budgets-module";
      updatePagination(moduleKey, { searchTerm: localSearchTerm || "" }, 1);
      setSearchCounter((prev) => prev + 1);
      setPageIndexState(1);
    }
  };

  useEffect(() => {
    if (budgetGroupId) {
      setIsFilterApplied(true);
    } else {
      setIsFilterApplied(false);
    }
  }, [budgetGroupId]);
  const handleResetClick = () => {
    setLocalSearchTerm("");
    setSearchCounter((prev) => prev + 1);
    setSearchTerm("");
    const moduleKey = "budgets-module";
    resetPaginationModule(moduleKey);
    valueSetter();
  };

  const valueSetter = () => {
    setTempBudgetGroupId(null);
    setBudgetGroupId(null);
    setIsOpen(false);
    setPageIndexState(1);
  };

  return (
    <KTCardBody className="card mb-5 mb-xl-10 pb-0">
      <div className="card-body pt-9 pb-0">
        {/* Full-width search and button */}
        <div className="w-full mb-10">
          {/* Full-width search input */}
          <div className="d-flex align-items-center position-relative mb-2 gap-1 ">
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
              id="searchTerm"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearchClick();
                }
              }}
            />
            <div className="btn-group gap-1">
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
                    isFilterApplied
                      ? "bg-warning"
                      : !searchTerm && "rounded-end"
                  )}
                  onClick={toggleMenu}
                >
                  <i
                    className={`ki-solid ki-filter fs-3 me-1 
            ${isFilterApplied ? "text-white" : "text-muted"}
          `}
                  />
                </MenuButton>
                <MenuList
                  className="p-5 bg-body border-0 shadow-sm"
                  zIndex={10}
                >
                  <BudgetFilter
                    valueSetter={valueSetter}
                    setPageStateIndex={setPageIndexState}
                    isFilterApplied={isFilterApplied}
                    toggleMenu={toggleMenu}
                    setIsOpen={setIsOpen}
                    isOpen={isOpen}
                    setBudgetGroupId={setBudgetGroupId}
                    tempBudgetGroupId={tempBudgetGroupId}
                    setTempBudgetGroupId={setTempBudgetGroupId}
                    setIsFilterApplied={setIsFilterApplied}
                  />
                </MenuList>
              </Menu>

              {/* Menu button for filter */}
              {(isFilterApplied || searchTerm) && (
                <button
                  className="btn btn-secondary btn-icon"
                  onClick={handleResetClick}
                >
                  <i className="la la-remove fs-3"></i>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </KTCardBody>
  );
};

export { BudgetHeader };
