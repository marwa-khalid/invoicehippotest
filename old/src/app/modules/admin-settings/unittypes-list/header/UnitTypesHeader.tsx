import { KTCardBody, KTIcon } from "../../../../../_metronic/helpers";
import { useIntl } from "react-intl";
// @ts-ignore
import { resetPaginationModule } from "../../../../helpers/paginationUtils.js";
// @ts-ignore
import { updatePagination } from "../../../../helpers/paginationUtils.js";
import { useState } from "react";

interface ComponentProps {
  setSearchTerm: (term: string) => void;
  searchTerm: string;
  setSearchCounter: React.Dispatch<React.SetStateAction<number>>;
  setPageIndex: (type: number) => void;
}

const UnitTypesHeader = ({
  setSearchTerm,
  searchTerm,
  setSearchCounter,
  setPageIndex,
}: ComponentProps) => {
  const [localSearchTerm, setLocalSearchTerm] = useState<string>(searchTerm);
  const intl = useIntl();

  const handleSearchClick = () => {
    if (localSearchTerm !== undefined) {
      setSearchTerm(localSearchTerm);
      const moduleKey = "unit-types-module";
      updatePagination(moduleKey, { searchTerm: localSearchTerm || "" }, 1);
      setSearchCounter((prev) => prev + 1);
      setPageIndex(1);
    }
  };
  const handleResetClick = () => {
    setLocalSearchTerm("");
    setSearchTerm("");
    const moduleKey = "unit-types-module";
    resetPaginationModule(moduleKey);
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

export { UnitTypesHeader };
