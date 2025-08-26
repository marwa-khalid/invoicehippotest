import { KTCardBody } from "../../../../../../../_metronic/helpers";
import { useEffect, useState } from "react";
import { KTIcon } from "../../../../../../../_metronic/helpers";
import { useIntl } from "react-intl";
import clsx from "clsx";
import { useLayout } from "../../../../../../../_metronic/layout/core";
import { TransactionFilter } from "./TransactionFilter";
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
  setPeriodValueType: (type: number | null) => void;
  periodValueType: number | null;
  setBalanceType: (type: number) => void;
  balanceType: number;
  setProcessStatusTypes: (type: any) => void;
  processStatusTypes: any;
  financialAccountId: number;
  setFinancialAccountId: (type: number) => void;
  setAttachmentType: (type: number) => void;
  attachmentType: number;
  setClientIdForFilter: (type: number | null) => void;
  clientIdForFilter: number | null;
  year: number | null;
  setYear: (year: number | null) => void;
  setShowClientSearch: (type: boolean) => void;
  setClientName: (type: string) => void;
  clientName: string;
  setTempClientId: (type: number | null) => void;
  tempClientId: number | null;
  setPageIndexState: (type: number) => void;
  financialAccounts: AccountsResult[];
}

const TransactionHeader = ({
  setSearchTerm,
  searchTerm,
  setSearchCounter,
  setPeriodValueType,
  periodValueType,
  setBalanceType,
  balanceType,
  financialAccountId,
  setFinancialAccountId,
  setProcessStatusTypes,
  processStatusTypes,
  setAttachmentType,
  attachmentType,
  setClientIdForFilter,
  clientIdForFilter,
  year,
  setShowClientSearch,
  setYear,
  setClientName,
  clientName,
  setTempClientId,
  tempClientId,
  setPageIndexState,
  financialAccounts,
}: ComponentProps) => {
  const [localSearchTerm, setLocalSearchTerm] = useState<string>(searchTerm);
  const intl = useIntl();
  const [tempYear, setTempYear] = useState<number | null>(year);
  const [tempPeriodType, setTempPeriodType] = useState<number | null>(
    periodValueType
  );
  const [tempStatus, setTempStatus] = useState<any>(processStatusTypes);
  const [tempAccountId, setTempAccountId] =
    useState<number>(financialAccountId);

  const [tempBalanceType, setTempBalanceType] = useState<number>(balanceType);
  const [tempAttachmentType, setTempAttachmentType] =
    useState<number>(attachmentType);
  const [isFilterApplied, setIsFilterApplied] = useState<boolean>(false);
  useEffect(() => {
    if (clientIdForFilter) {
      setClientName(
        JSON.parse(localStorage.getItem("storedClientForTransaction")!)
          ?.displayName
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
      const moduleKey = "transaction-module";
      updatePagination(moduleKey, { searchTerm: localSearchTerm || "" }, 1);
      setPageIndexState(1);
      setSearchCounter((prev) => prev + 1);
    }
  };

  useEffect(() => {
    if (
      year ||
      attachmentType != 0 ||
      clientIdForFilter ||
      periodValueType ||
      balanceType !== 0 ||
      processStatusTypes.length > 0 ||
      financialAccountId != 0
    ) {
      setIsFilterApplied(true);
    } else {
      setIsFilterApplied(false);
    }
  }, [
    year,
    periodValueType,
    clientIdForFilter,
    balanceType,
    attachmentType,
    processStatusTypes,
    financialAccountId,
  ]);
  const handleResetClick = () => {
    setLocalSearchTerm("");
    valueSetter();
    setSearchTerm("");
    const moduleKey = "transaction-module";
    resetPaginationModule(moduleKey);
    setIsOpen(false);
  };

  const valueSetter = () => {
    setTempClientId(null);
    setTempStatus([]);
    setTempAttachmentType(0);
    setTempBalanceType(0);
    setTempPeriodType(null);
    setClientIdForFilter(null);
    setAttachmentType(0);
    setBalanceType(0);
    setPeriodValueType(null);
    setProcessStatusTypes([]);
    setTempAccountId(0);
    setFinancialAccountId(0);
    setTempYear(null);
    setYear(null);
    setClientName("");
    localStorage.removeItem("storedClientForTransaction");
    setIsOpen(false);
    setPageIndexState(1);
  };

  const { config } = useLayout();
  const daterangepickerButtonClass = config.app?.toolbar?.fixed?.desktop
    ? "btn-light"
    : "bg-body btn-color-gray-700 btn-active-color-primary";
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
                  <TransactionFilter
                    valueSetter={valueSetter}
                    isFilterApplied={isFilterApplied}
                    toggleMenu={toggleMenu}
                    setIsOpen={setIsOpen}
                    isOpen={isOpen}
                    tempYear={tempYear}
                    setYear={setYear}
                    setTempYear={setTempYear}
                    setPeriodValueType={setPeriodValueType}
                    setProcessStatusTypes={setProcessStatusTypes}
                    setClientIdForFilter={setClientIdForFilter}
                    tempStatus={tempStatus}
                    setTempStatus={setTempStatus}
                    tempBalanceType={tempBalanceType}
                    setTempBalanceType={setTempBalanceType}
                    setTempAttachmentType={setTempAttachmentType}
                    tempAttachmentType={tempAttachmentType}
                    setBalanceType={setBalanceType}
                    tempAccountId={tempAccountId}
                    setTempAccountId={setTempAccountId}
                    setFinancialAccountId={setFinancialAccountId}
                    setAttachmentType={setAttachmentType}
                    tempPeriodType={tempPeriodType}
                    setTempPeriodType={setTempPeriodType}
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

export { TransactionHeader };
