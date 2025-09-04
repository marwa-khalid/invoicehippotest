import { KTCardBody, KTIcon } from "../../../../../_metronic/helpers";
import { useLayout } from "../../../../../_metronic/layout/core";
import { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import clsx from "clsx";
import { Menu, MenuButton, MenuList } from "@chakra-ui/react";
import { ProductsFilter } from "./ProductsFilter";
// @ts-ignore
import { resetPaginationModule } from "../../../../helpers/paginationUtils.js";
// @ts-ignore
import { updatePagination } from "../../../../helpers/paginationUtils.js";

interface ComponentProps {
  setSearchTerm: (term: string) => void;
  searchTerm: string;
  setSearchCounter: React.Dispatch<React.SetStateAction<number>>;
  setProductGroupId: (type: number | null) => void;
  productGroupId: number | null;
  setClientIdForFilter: (type: number | null) => void;
  clientIdForFilter: number | null;
  setShowClientSearch: (type: boolean) => void;
  setClientName: (type: string) => void;
  clientName: string;
  setTempClientId: (type: number | null) => void;
  tempClientId: number | null;
  setPageIndexState: (type: number) => void;
  resetClient: (type: any) => void;
}

const ProductsHeader = ({
  setSearchTerm,
  searchTerm,
  setSearchCounter,
  setClientIdForFilter,
  clientIdForFilter,
  setShowClientSearch,
  setClientName,
  clientName,
  setTempClientId,
  tempClientId,
  setProductGroupId,
  productGroupId,
  setPageIndexState,
  resetClient,
}: ComponentProps) => {
  const [localSearchTerm, setLocalSearchTerm] = useState<string>(searchTerm);
  const intl = useIntl();
  const [tempProductGroupId, setTempProductGroupId] = useState<number | null>(
    productGroupId
  );
  useEffect(() => {
    setTempProductGroupId(productGroupId);
  }, []);
  const [isFilterApplied, setIsFilterApplied] = useState<boolean>(false);
  useEffect(() => {
    if (clientIdForFilter) {
      setClientName(
        JSON.parse(localStorage.getItem("storedClientForProduct")!)?.displayName
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
      const moduleKey = "products-module";
      updatePagination(moduleKey, { searchTerm: localSearchTerm || "" }, 1);
      setSearchCounter((prev) => prev + 1);
      setPageIndexState(1);
    }
  };

  useEffect(() => {
    if (clientIdForFilter || productGroupId) {
      setIsFilterApplied(true);
    } else {
      setIsFilterApplied(false);
    }
  }, [productGroupId, clientIdForFilter]);
  const handleResetClick = () => {
    setLocalSearchTerm("");
    setSearchCounter((prev) => prev + 1);
    setSearchTerm("");
    const moduleKey = "products-module";
    resetPaginationModule(moduleKey);
    valueSetter();
  };

  const valueSetter = () => {
    setTempClientId(null);
    setTempProductGroupId(null);
    setClientIdForFilter(null);
    setProductGroupId(null);
    setClientName("");
    localStorage.removeItem("storedClientForProduct");
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
                <MenuList
                  className="p-5 bg-body border-0 shadow-sm"
                  zIndex={10}
                >
                  <ProductsFilter
                    valueSetter={valueSetter}
                    setPageStateIndex={setPageIndexState}
                    isFilterApplied={isFilterApplied}
                    toggleMenu={toggleMenu}
                    setIsOpen={setIsOpen}
                    isOpen={isOpen}
                    setProductGroupId={setProductGroupId}
                    tempProductGroupId={tempProductGroupId}
                    setTempProductGroupId={setTempProductGroupId}
                    setClientIdForFilter={setClientIdForFilter}
                    tempClientId={tempClientId}
                    setTempClientId={setTempClientId}
                    setIsFilterApplied={setIsFilterApplied}
                    setShowClientSearch={setShowClientSearch}
                    clientName={clientName}
                    setClientName={setClientName}
                    resetClient={resetClient}
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

export { ProductsHeader };
