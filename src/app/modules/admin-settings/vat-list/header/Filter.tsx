import { useState } from "react";
import { useIntl } from "react-intl";
import Select from "react-select";
import enums from "../../../../../_metronic/i18n/messages/invoicehippo.enums.json";
// @ts-ignore
import { updatePagination } from "../../../../helpers/paginationUtils.js";
import { getEnumOptions } from "../../../../helpers/intlHelper";

interface ComponentProps {
  setVatAreaUsageTypeFilter: (type: number) => void;
  onFilterApply: (isApplied: boolean) => void;
  setSelectedOption: (type: any) => void;
  selectedOption: any;
  valueSetter: any;
  setPageIndex: (index: number) => void;
}

export function Filter({
  setVatAreaUsageTypeFilter,
  onFilterApply,
  setSelectedOption,
  selectedOption,
  valueSetter,
  setPageIndex,
}: ComponentProps) {
  const intl = useIntl();

  // State to manage the selected option locally
  const [tempSelectedOption, setTempSelectedOption] =
    useState<any>(selectedOption);

  // Handle change in selection
  const handleChange = (option: any) => {
    setTempSelectedOption(option);
  };

  // Apply the selected filter when the Apply button is clicked
  const handleApply = () => {
    if (tempSelectedOption) {
      const value = tempSelectedOption.value;
      setSelectedOption(tempSelectedOption);
      setVatAreaUsageTypeFilter(value);
      const moduleKey = "vat-module";
      updatePagination(
        moduleKey,
        {
          documentGroup: value || 0,
        },
        1
      );
      setPageIndex(1);
      onFilterApply(true);
    }
  };

  // Reset the selection
  const handleReset = () => {
    const moduleKey = "vat-module";
    updatePagination(
      moduleKey,
      {
        documentGroup: 0,
      },
      1
    );
    setPageIndex(1);
    valueSetter();
  };

  return (
    <div
      className="menu menu-sub menu-sub-dropdown w-250px w-md-300px"
      data-kt-menu="true"
    >
      <div className="px-7 py-5">
        <div className="fs-5 text-gray-900 fw-bolder">
          {intl.formatMessage({ id: "Fields.FilterPopUpTitle" })}
        </div>
      </div>

      <div className="separator border-gray-200"></div>

      <div className="px-7 py-5">
        <div className="mb-10">
          <label className="form-label fw-bold">
            {intl.formatMessage({ id: "Fields.VatAreaUsageType" })}:
          </label>

          <Select
            className="react-select-styled"
            placeholder={
              tempSelectedOption
                ? tempSelectedOption.label
                : intl.formatMessage({
                    id: "Fields.SelectOptionDefaultVatAreaUsageType",
                  })
            }
            menuPlacement="bottom"
            value={tempSelectedOption || ""} // Set the current selected value
            onChange={handleChange} // Handle change in selection
            options={getEnumOptions(enums.VatAreaUsageTypes, intl)} // Options for the select component
            closeMenuOnSelect={false}
            isClearable
            data-kt-menu-dismiss="false"
          />
        </div>

        <div className="d-flex justify-content-end">
          <button
            type="reset"
            className="btn btn-sm btn-light btn-active-light-primary me-2"
            onClick={handleReset} // Reset selection on click
            data-kt-menu-dismiss="true"
          >
            {intl.formatMessage({ id: "Fields.FilterResetBtn" })}
          </button>

          <button
            type="submit"
            className="btn btn-sm btn-primary"
            onClick={handleApply} // Apply filter on click
            data-kt-menu-dismiss="true"
          >
            {intl.formatMessage({ id: "Fields.FilterApplyBtn" })}
          </button>
        </div>
      </div>
    </div>
  );
}
