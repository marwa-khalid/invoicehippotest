import React, { useEffect, useState } from "react";
import {
  initialQueryState,
  KTIcon,
  useDebounce,
} from "../../../../../../../_metronic/helpers";
import { useQueryRequest } from "../../core/QueryRequestProvider";

interface UsersListSearchComponentProps {
  setSearchTerm: (term: string) => void;
}

const UsersListSearchComponent = ({
  setSearchTerm,
}: UsersListSearchComponentProps) => {
  const { updateState } = useQueryRequest();
  const [searchTerm, setSearchTermLocal] = useState<string>("");

  const debouncedSearchTerm = useDebounce(searchTerm, 150);

  useEffect(() => {
    if (debouncedSearchTerm !== undefined && searchTerm !== undefined) {
      updateState({ search: debouncedSearchTerm, ...initialQueryState });
      setSearchTerm(debouncedSearchTerm); // Update search term in parent component
    }
  }, [debouncedSearchTerm]);

  const handleSearchClick = () => {
    if (searchTerm !== undefined) {
      updateState({ search: searchTerm, ...initialQueryState });
      setSearchTerm(searchTerm);
    }
  };

  return (
    <div className="w-full">
      {/* Full-width search input */}
      <div className="d-flex align-items-center position-relative mb-2">
        <KTIcon iconName="magnifier" className="fs-3 position-absolute ms-6" />

        <input
          type="text"
          data-kt-user-table-filter="search"
          className="form-control form-control-solid w-100 ps-14 rounded-lg"
          placeholder="Search Tax Type"
          value={searchTerm}
          onChange={(e) => setSearchTermLocal(e.target.value)}
        />
      </div>
      {/* Search button */}
      <div className="d-flex justify-content-end mt-2">
        <button className="btn btn-primary" onClick={handleSearchClick}>
          Search
        </button>
      </div>
    </div>
  );
};

export { UsersListSearchComponent };
