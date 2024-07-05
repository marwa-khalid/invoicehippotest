import React, { useState } from "react";
import { useIntl } from "react-intl";
import Select from "react-select";

interface ComponentProps {
  setVatAreaUsageTypeFilter: (type: number) => void;
  onFilterApply: (isApplied: boolean) => void;
  setSelectedOption: (type: any) => void;
  selectedOption: any;
}

export function Filter({
  setVatAreaUsageTypeFilter,
  onFilterApply,
  setSelectedOption,
  selectedOption,
}: ComponentProps) {
  const intl = useIntl();

  // Define options for the Select component
  const options = [
    {
      value: 1,
      label: intl.formatMessage({ id: "Fields.VatTabSaleCategories" }),
    },
    {
      value: 2,
      label: intl.formatMessage({ id: "Fields.VatTabCostCategories" }),
    },
  ];

  // State to manage the selected option locally

  // Handle change in selection
  const handleChange = (option: any) => {
    setSelectedOption(option);
    localStorage.setItem("filter", option.value); // Update state with selected option object
  };

  // Apply the selected filter when the Apply button is clicked
  const handleApply = () => {
    if (selectedOption) {
      const value = selectedOption.value;
      setVatAreaUsageTypeFilter(value);
      onFilterApply(true);
    }
  };

  // Reset the selection
  const handleReset = () => {
    setSelectedOption(null);
    localStorage.removeItem("filter");
    onFilterApply(false); // Clear the selected option
  };

  console.log(selectedOption);

  return (
    <div
      className="menu menu-sub menu-sub-dropdown w-250px w-md-300px"
      data-kt-menu="true"
    >
      <div className="px-7 py-5">
        <div className="fs-5 text-gray-900 fw-bolder">Filter Options</div>
      </div>

      <div className="separator border-gray-200"></div>

      <div className="px-7 py-5">
        <div className="mb-10">
          <label className="form-label fw-bold">
            {intl.formatMessage({ id: "Fields.VatAreaUsageType" })}:
          </label>

          <Select
            className="react-select-styled"
            placeholder="Select option"
            menuPlacement="bottom"
            value={selectedOption} // Set the current selected value
            onChange={handleChange} // Handle change in selection
            options={options} // Options for the select component
            closeMenuOnSelect={false}
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
            Reset
          </button>

          <button
            type="submit"
            className="btn btn-sm btn-primary"
            onClick={handleApply} // Apply filter on click
            data-kt-menu-dismiss="true"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
