import { useState } from "react";
import { KTIcon } from "../../../../../../../_metronic/helpers";
import { useIntl } from "react-intl";
import { useLayout } from "../../../../../../../_metronic/layout/core";

interface ComponentProps {
  setSearchTerm: (term: string) => void;
  searchTerm: string;
}

const FinancialListSearchComponent = ({
  setSearchTerm,
  searchTerm,
}: ComponentProps) => {
  const [localSearchTerm, setLocalSearchTerm] = useState<string>(searchTerm);
  const intl = useIntl();

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
          };

      // Update the filter in the financial-module
      pagination["financial-module"].filters.searchTerm = localSearchTerm;

      // Convert the updated object back to a JSON string
      const updatedPaginationString = JSON.stringify(pagination);

      // Store the updated JSON string in local storage
      localStorage.setItem("pagination", updatedPaginationString);
    }
  };
  const handleResetClick = () => {
    setLocalSearchTerm("");
    setSearchTerm("");
  };
  const { config } = useLayout();

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

export { FinancialListSearchComponent };
