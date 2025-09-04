import { KTCardBody } from "../../../../../_metronic/helpers";
import { useEffect, useState } from "react";
import { KTIcon } from "../../../../../_metronic/helpers";
import { useIntl } from "react-intl";
import clsx from "clsx";
import { useLayout } from "../../../../../_metronic/layout/core";
import { TemplateFilter } from "./TemplateFilter";
import { Menu, MenuButton, MenuList } from "@chakra-ui/react";
// @ts-ignore
import { resetPaginationModule } from "../../../../helpers/paginationUtils";
// @ts-ignore
import { updatePagination } from "../../../../helpers/paginationUtils";

interface ComponentProps {
  setSearchTerm: (term: string) => void;
  searchTerm: string;
  setSearchCounter: React.Dispatch<React.SetStateAction<number>>;
  setStatusType: (type: number) => void;
  statusType: number;
  setSubscriberIdForFilter: (type: number | null) => void;
  subscriberIdForFilter: number | null;
  setShowSubscriberSearch: (type: boolean) => void;
  setSubscriberName: (type: string) => void;
  subscriberName: string;
  setTempSubscriberId: (type: number | null) => void;
  tempSubscriberId: number | null;
  setPageIndexState: (type: number) => void;
}

const TemplateHeader = ({
  setSearchTerm,
  searchTerm,
  setSearchCounter,
  setStatusType,
  statusType,
  setSubscriberIdForFilter,
  subscriberIdForFilter,
  setShowSubscriberSearch,
  setSubscriberName,
  subscriberName,
  setTempSubscriberId,
  tempSubscriberId,
  setPageIndexState,
}: ComponentProps) => {
  const [localSearchTerm, setLocalSearchTerm] = useState<string>(searchTerm);
  const intl = useIntl();
  const [tempStatus, setTempStatus] = useState<number>(statusType);
  const [isFilterApplied, setIsFilterApplied] = useState<boolean>(false);
  useEffect(() => {
    if (subscriberIdForFilter) {
      setSubscriberName(
        JSON.parse(localStorage.getItem("storedSubscriberForTemplate")!)
          ?.billingContact
      );
    }
  }, [subscriberIdForFilter]);
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => {
    setIsOpen((prev) => !prev); // Toggle menu open/close
  };

  const handleSearchClick = () => {
    if (localSearchTerm !== undefined) {
      setSearchTerm(localSearchTerm);
      const moduleKey = "template-module";
      updatePagination(moduleKey, { searchTerm: localSearchTerm || "" }, 1);
      setPageIndexState(1);
      setSearchCounter((prev) => prev + 1);
    }
  };

  useEffect(() => {
    if (statusType != 0 || subscriberIdForFilter) {
      setIsFilterApplied(true);
    } else {
      setIsFilterApplied(false);
    }
  }, [statusType, subscriberIdForFilter]);
  const handleResetClick = () => {
    setLocalSearchTerm("");
    valueSetter();
    setSearchTerm("");
    const moduleKey = "template-module";
    resetPaginationModule(moduleKey);
    setIsOpen(false);
  };

  const valueSetter = () => {
    setTempSubscriberId(null);
    setTempStatus(0);
    setStatusType(0);
    setSubscriberIdForFilter(null);
    setSubscriberName("");
    localStorage.removeItem("storedSubscriberForTemplate");
    setIsOpen(false);
    setPageIndexState(1);
  };

  const { config } = useLayout();
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
                  <TemplateFilter
                    valueSetter={valueSetter}
                    isFilterApplied={isFilterApplied}
                    toggleMenu={toggleMenu}
                    setIsOpen={setIsOpen}
                    isOpen={isOpen}
                    tempStatus={tempStatus}
                    setTempStatus={setTempStatus}
                    setStatusType={setStatusType}
                    setSubscriberIdForFilter={setSubscriberIdForFilter}
                    tempSubscriberId={tempSubscriberId}
                    setTempSubscriberId={setTempSubscriberId}
                    setIsFilterApplied={setIsFilterApplied}
                    setShowSubscriberSearch={setShowSubscriberSearch}
                    subscriberName={subscriberName}
                    setSubscriberName={setSubscriberName}
                    setPageStateIndex={setPageIndexState}
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

export { TemplateHeader };
