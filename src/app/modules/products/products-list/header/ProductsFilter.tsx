import { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import Select from "react-select";
import { getProductGroupList } from "../core/_requests";
// @ts-ignore
import { updatePagination } from "../../../../helpers/paginationUtils.js";
import { ClientAddButtons } from "../../../generic/ClientAddButtons";
import { useAuth } from "../../../auth";

interface ComponentProps {
  setProductGroupId: (type: number | null) => void;
  setClientIdForFilter: (clientId: number | null) => void;
  tempClientId: number | null;
  setIsFilterApplied: (type: boolean) => void;
  tempProductGroupId: number | null;
  setTempProductGroupId: (type: number | null) => void;
  isFilterApplied: boolean;
  setTempClientId: (clientId: number | null) => void;
  setShowClientSearch: (type: boolean) => void;
  setClientName: (type: string) => void;
  setIsOpen: (type: boolean) => void;
  clientName: string;
  toggleMenu: any;
  resetClient: (type: any) => void;
  setPageStateIndex: (type: number) => void;
  valueSetter: any;
  isOpen: boolean;
}

export function ProductsFilter({
  setProductGroupId,
  tempProductGroupId,
  isFilterApplied,
  setClientIdForFilter,
  setIsOpen,
  tempClientId,
  setIsFilterApplied,
  setTempClientId,
  setShowClientSearch,
  setClientName,
  clientName,
  toggleMenu,
  setTempProductGroupId,
  resetClient,
  setPageStateIndex,
  valueSetter,
  isOpen,
}: ComponentProps) {
  const intl = useIntl();
  const { currentUser } = useAuth();

  const handleApply = () => {
    setProductGroupId(tempProductGroupId);
    setClientIdForFilter(tempClientId);
    const moduleKey = "products-module";
    updatePagination(
      moduleKey,
      {
        productGroupId: tempProductGroupId || null,
        clientFilter: tempClientId || null,
      },
      1
    );
    setPageStateIndex(1);
    toggleMenu();
  };

  const openClientModal = () => {
    setShowClientSearch(true);
  };

  const handleReset = () => {
    if (!isFilterApplied) {
      setIsOpen(false);
      return;
    } else {
      setIsFilterApplied(false);
      const moduleKey = "products-module";
      updatePagination(
        moduleKey,
        {
          productGroupId: null,
          clientFilter: null,
        },
        1
      );
      valueSetter();
    }
  };

  const [productGroups, setProductGroups] = useState<any>([]);
  useEffect(() => {
    const fetchProductGroups = async () => {
      const response = await getProductGroupList();
      if (response.isValid) {
        setProductGroups(response.result);
      }
    };
    if (productGroups?.length === 0) {
      fetchProductGroups();
    }
  }, []);

  return (
    <div style={{ display: isOpen ? "block" : "none" }}>
      <div className="px-7 py-5">
        <div className="fs-5 text-gray-900 fw-bolder">
          {intl.formatMessage({ id: "Fields.FilterPopUpTitle" })}
        </div>
      </div>

      <div className="separator border-gray-200"></div>

      <div className="px-7 py-5">
        {/* GROUP Selection */}
        <div className="mb-5">
          <label className="form-label fw-bold">
            {intl.formatMessage({ id: "Menu.ProductGroups" })}:
          </label>
          <Select
            value={
              tempProductGroupId
                ? productGroups
                    ?.map((item: any) => ({
                      value: item.id,
                      label: item.title,
                    }))
                    .find(
                      (productGroups: any) =>
                        productGroups.value === tempProductGroupId
                    )
                : null
            }
            className="react-select-styled"
            options={productGroups.map((item: any) => ({
              value: item.id,
              label: item.title,
            }))}
            placeholder={intl.formatMessage({ id: "Fields.SelectOptionNvt" })}
            onChange={(option) =>
              setTempProductGroupId(option ? option.value : null)
            }
            isClearable
          />
        </div>

        <div className="separator border-gray-200 mb-4"></div>
        {/* Client Search Button */}
        {!currentUser?.result.isAnonymousUser && (
          <>
            <ClientAddButtons
              clientDisplayName={clientName}
              openClientModal={openClientModal}
              openClientModalInNewMode={openClientModal}
              reset={resetClient}
              setClientSearch={openClientModal}
              type="filter"
            />
            <div className="separator border-gray-200 mb-4"></div>
          </>
        )}
      </div>
      <div className="separator border-gray-200 mb-4"></div>
      <div className="d-flex justify-content-end gap-2">
        <button
          type="reset"
          className="btn btn-sm btn-secondary btn-active-light-primary"
          onClick={handleReset}
          data-kt-menu-dismiss="true"
        >
          {intl.formatMessage({ id: "Fields.FilterResetBtn" })}
        </button>
        <button className="btn btn-primary" onClick={handleApply}>
          {intl.formatMessage({ id: "Fields.FilterApplyBtn" })}
        </button>
      </div>
    </div>
  );
}
