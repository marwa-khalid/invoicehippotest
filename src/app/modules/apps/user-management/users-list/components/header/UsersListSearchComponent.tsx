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

  return (
    <div className="card-title">
      <div className="d-flex align-items-center position-relative my-1">
        <KTIcon iconName="magnifier" className="fs-1 position-absolute ms-6" />
        <input
          type="text"
          data-kt-user-table-filter="search"
          className="form-control form-control-solid w-250px ps-14"
          placeholder="Search Tax Type"
          value={searchTerm}
          onChange={(e) => setSearchTermLocal(e.target.value)}
        />
      </div>
    </div>
  );
};

export { UsersListSearchComponent };
