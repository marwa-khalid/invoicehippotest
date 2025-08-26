import { KTCardBody } from "../../../../../../../_metronic/helpers";
import { useEffect, useState } from "react";
import { KTIcon } from "../../../../../../../_metronic/helpers";
import { useIntl } from "react-intl";
import clsx from "clsx";
import { RuleFilter } from "./RuleFilter";
import { Menu, MenuButton, MenuList } from "@chakra-ui/react";
// @ts-ignore
import { resetPaginationModule } from "../../../../../../helpers/paginationUtils";
// @ts-ignore
import { updatePagination } from "../../../../../../helpers/paginationUtils";
import { AccountsResult } from "../core/_models";

interface ComponentProps {
  setSearchTerm: (term: string) => void;
  searchTerm: string;
  setSearchCounter: React.Dispatch<React.SetStateAction<number>>;
  setBalanceType: (type: number) => void;
  balanceType: number;
  financialAccountId: number;
  setFinancialAccountId: (type: number) => void;
  setClientIdForFilter: (type: number | null) => void;
  clientIdForFilter: number | null;
  setShowClientSearch: (type: boolean) => void;
  setClientName: (type: string) => void;
  clientName: string;
  setTempClientId: (type: number | null) => void;
  tempClientId: number | null;
  setPageIndexState: (type: number) => void;
  financialAccounts: AccountsResult[];
}

const RuleHeader = ({
  setSearchTerm,
  searchTerm,
  setSearchCounter,
  setBalanceType,
  balanceType,
  financialAccountId,
  setFinancialAccountId,
  setClientIdForFilter,
  clientIdForFilter,
  setShowClientSearch,
  setClientName,
  clientName,
  setTempClientId,
  tempClientId,
  setPageIndexState,
  financialAccounts,
}: ComponentProps) => {
  const [localSearchTerm, setLocalSearchTerm] = useState<string>(searchTerm);
  const intl = useIntl();

  const [tempAccountId, setTempAccountId] =
    useState<number>(financialAccountId);

  const [tempBalanceType, setTempBalanceType] = useState<number>(balanceType);

  const [isFilterApplied, setIsFilterApplied] = useState<boolean>(false);
  useEffect(() => {
    if (clientIdForFilter) {
      setClientName(
        JSON.parse(localStorage.getItem("storedClientForRule")!)?.displayName
      );
    }
  }, [clientIdForFilter]);
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => {
    setIsOpen((prev) => !prev); // Toggle menu open/close
  };

  const handleSearchClick = () => {
    if (localSearchTerm !== undefined) {
      setSearchTerm(localSearchTerm);
      const moduleKey = "rule-module";
      updatePagination(moduleKey, { searchTerm: localSearchTerm || "" }, 1);
      setPageIndexState(1);
      setSearchCounter((prev) => prev + 1);
    }
  };

  useEffect(() => {
    if (clientIdForFilter || balanceType !== 0 || financialAccountId != 0) {
      setIsFilterApplied(true);
    } else {
      setIsFilterApplied(false);
    }
  }, [clientIdForFilter, balanceType, financialAccountId]);
  const handleResetClick = () => {
    setLocalSearchTerm("");
    valueSetter();
    setSearchTerm("");
    const moduleKey = "rule-module";
    resetPaginationModule(moduleKey);
    setIsOpen(false);
  };

  const valueSetter = () => {
    setTempClientId(null);
    setTempBalanceType(0);
    setClientIdForFilter(null);
    setBalanceType(0);
    setTempAccountId(0);
    setFinancialAccountId(0);
    setClientName("");
    localStorage.removeItem("storedClientForRule");
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
              id="searchTerm"
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
                  <RuleFilter
                    valueSetter={valueSetter}
                    isFilterApplied={isFilterApplied}
                    toggleMenu={toggleMenu}
                    setIsOpen={setIsOpen}
                    isOpen={isOpen}
                    setClientIdForFilter={setClientIdForFilter}
                    tempBalanceType={tempBalanceType}
                    setTempBalanceType={setTempBalanceType}
                    setBalanceType={setBalanceType}
                    tempAccountId={tempAccountId}
                    setTempAccountId={setTempAccountId}
                    setFinancialAccountId={setFinancialAccountId}
                    tempClientId={tempClientId}
                    setTempClientId={setTempClientId}
                    setIsFilterApplied={setIsFilterApplied}
                    setShowClientSearch={setShowClientSearch}
                    clientName={clientName}
                    setClientName={setClientName}
                    setPageStateIndex={setPageIndexState}
                    financialAccounts={financialAccounts}
                  />
                </MenuList>
              </Menu>

              {/* Menu button for filter */}

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

export { RuleHeader };
