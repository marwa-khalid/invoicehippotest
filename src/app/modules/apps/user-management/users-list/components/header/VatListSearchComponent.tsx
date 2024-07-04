import React, { useState } from "react";
import {
  initialQueryState,
  KTIcon,
} from "../../../../../../../_metronic/helpers";
import { useQueryRequest } from "../../core/QueryRequestProvider";
import { useIntl } from "react-intl";

interface ComponentProps {
  setSearchTerm: (term: string) => void;
}

const VatListSearchComponent = ({ setSearchTerm }: ComponentProps) => {
  const { updateState } = useQueryRequest();
  const [localSearchTerm, setLocalSearchTerm] = useState<string>("");
  const intl = useIntl();

  const handleSearchClick = () => {
    if (localSearchTerm !== undefined) {
      // Update the query state and parent search term when search button is clicked
      updateState({ search: localSearchTerm, ...initialQueryState });
      setSearchTerm(localSearchTerm);
    }
  };
  const handleResetClick = () => {
    setLocalSearchTerm("");
    updateState({ search: "", ...initialQueryState }); // Reset the search state
    setSearchTerm(""); // Reset the parent search term
  };

  return (
    <div className="w-full">
      {/* Full-width search input */}
      <div className="d-flex align-items-center position-relative mb-2 gap-2 ">
        <KTIcon iconName="magnifier" className="fs-3 position-absolute ms-6" />

        <input
          type="text"
          data-kt-user-table-filter="search"
          className="form-control form-control-solid w-100 ps-14 rounded-lg me-6"
          placeholder="Search Tax Type"
          value={localSearchTerm}
          onChange={(e) => setLocalSearchTerm(e.target.value)}
        />
        <div className="btn-group">
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
            <i className="la la-remove"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export { VatListSearchComponent };
