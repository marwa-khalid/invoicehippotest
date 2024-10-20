import { useEffect, useRef, useState } from "react";
import { KTIcon } from "../../../../../../../_metronic/helpers";
import { useIntl } from "react-intl";
import clsx from "clsx";
import { useLayout } from "../../../../../../../_metronic/layout/core";
import { QuoteFilter } from "./QuoteFilter";
import { Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";

interface ComponentProps {
  setSearchTerm: (term: string) => void;
  searchTerm: string;
  setSearchCounter: React.Dispatch<React.SetStateAction<number>>;
  setPeriodValueType: (type: any) => void;
  periodValueType: any;
  setQuoteStatusTypes: (types: any) => void;
  quoteStatusTypes: any;
  setClientIdForFilter: (clientId: number) => void;
  clientIdForFilter: number;
  setTempClientId: (clientId: number) => void;
  tempClientId: number;
  year: number;
  setYear: (year: number) => void;
  setShowClientSearch: (type: boolean) => void;
  setClientName: (type: string) => void;
  clientName: string;
}

const QuoteSearchComponent = ({
  setSearchTerm,
  searchTerm,
  setSearchCounter,
  setPeriodValueType,
  periodValueType,
  setQuoteStatusTypes,
  quoteStatusTypes,
  setClientIdForFilter,
  clientIdForFilter,
  setTempClientId,
  tempClientId,
  year,
  setShowClientSearch,
  setYear,
  setClientName,
  clientName,
}: ComponentProps) => {
  const [localSearchTerm, setLocalSearchTerm] = useState<string>(searchTerm);
  const intl = useIntl();
  const [tempYear, setTempYear] = useState<any>(year);
  const [tempQuoteStatus, setTempQuoteStatus] = useState<any>(quoteStatusTypes);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [tempPeriodType, setTempPeriodType] = useState<any>(periodValueType);
  const [isFilterApplied, setIsFilterApplied] = useState<boolean>(false);
  useEffect(() => {
    if (clientIdForFilter != 0) {
      setClientName(
        JSON.parse(localStorage.getItem("storedClient")!)?.displayName
      );
    }
  }, [clientIdForFilter]);
  const [isOpen, setIsOpen] = useState(false);
  console.log(isOpen);
  const toggleMenu = () => {
    setIsOpen(true); // Toggle menu open/close
  };

  const handleSearchClick = () => {
    if (localSearchTerm !== undefined) {
      // Update the query state and parent search term when search button is clicked

      setSearchTerm(localSearchTerm);

      let storedPaginationString = localStorage.getItem("pagination");

      // Parse the JSON string to get the JavaScript object, or initialize an empty object if it doesn't exist
      let pagination = storedPaginationString
        ? JSON.parse(storedPaginationString)
        : JSON.parse(import.meta.env.VITE_APP_PAGINATION);

      // Update the filter in the quote-module
      pagination["quotes-module"].filters.searchTerm = localSearchTerm;

      // Convert the updated object back to a JSON string
      const updatedPaginationString = JSON.stringify(pagination);

      // Store the updated JSON string in local storage
      localStorage.setItem("pagination", updatedPaginationString);
      setSearchCounter((prev) => prev + 1);
    }
  };

  useEffect(() => {
    if (year! - 0) {
      setIsFilterApplied(true);
    }
  }, [year]);
  const handleResetClick = () => {
    setLocalSearchTerm("");
    setSearchTerm("");
    localStorage.setItem(
      "pagination",
      JSON.stringify({
        ...JSON.parse(localStorage.getItem("pagination") || "{}"),
        "quotes-module": {
          ...JSON.parse(localStorage.getItem("pagination") || "{}")[
            "quotes-module"
          ],
          filters: {
            ...JSON.parse(localStorage.getItem("pagination") || "{}")[
              "quotes-module"
            ]?.filters,
            searchTerm: "",
          },
        },
      })
    );
  };

  const { config } = useLayout();
  const daterangepickerButtonClass = config.app?.toolbar?.fixed?.desktop
    ? "btn-light"
    : "bg-body btn-color-gray-700 btn-active-color-primary";

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
          <Menu
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            closeOnBlur={false}
          >
            <MenuButton
              className={clsx(
                "btn btn-secondary btn-icon bg-secondary fw-bold rounded-0",
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
            <MenuList className="p-5 bg-body border-0 shadow-sm" zIndex={10}>
              <QuoteFilter
                tempYear={tempYear}
                setYear={setYear}
                setTempYear={setTempYear}
                setPeriodValueType={setPeriodValueType}
                setQuoteStatusTypes={setQuoteStatusTypes}
                setClientIdForFilter={setClientIdForFilter}
                tempQuoteStatus={tempQuoteStatus}
                setTempQuoteStatus={setTempQuoteStatus}
                tempPeriodType={tempPeriodType}
                setTempPeriodType={setTempPeriodType}
                tempClientId={tempClientId}
                setTempClientId={setTempClientId}
                setIsFilterApplied={setIsFilterApplied}
                setShowClientSearch={setShowClientSearch}
                clientName={clientName}
                setClientName={setClientName}
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
  );
};

export { QuoteSearchComponent };
