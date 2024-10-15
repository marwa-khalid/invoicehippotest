import React, { useState } from "react";
import { useIntl } from "react-intl";
import Select from "react-select";
import enums from "../../../../../../../invoicehippo.enums.json";

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

      // Retrieve the stored JSON string from local storage, if it exists
      let storedPaginationString = localStorage.getItem("pagination");

      // Parse the JSON string to get the JavaScript object, or initialize an empty object if it doesn't exist
      let pagination = storedPaginationString
        ? JSON.parse(storedPaginationString)
        : JSON.parse(import.meta.env.VITE_APP_PAGINATION);

      // Update the filter in the vat-module
      pagination["vat-module"].filters.documentGroup = value;
      pagination["vat-module"].pageIndex = 1;

      // Convert the updated object back to a JSON string
      const updatedPaginationString = JSON.stringify(pagination);

      // Store the updated JSON string in local storage
      localStorage.setItem("pagination", updatedPaginationString);

      onFilterApply(true);
    }
  };

  // Reset the selection
  const handleReset = () => {
    setTempSelectedOption(null);
    setSelectedOption(null);
    onFilterApply(false);
    localStorage.setItem(
      "pagination",
      JSON.stringify({
        ...JSON.parse(localStorage.getItem("pagination") || "{}"),
        "vat-module": {
          ...JSON.parse(localStorage.getItem("pagination") || "{}")[
            "vat-module"
          ],
          filters: {
            ...JSON.parse(localStorage.getItem("pagination") || "{}")[
              "vat-module"
            ]?.filters,
            documentGroup: 0,
          },
        },
      })
    );
    setVatAreaUsageTypeFilter(0); // Clear the selected option
  };

  return (
    <div
      className="menu menu-sub menu-sub-dropdown w-250px w-md-300px"
      data-kt-menu="true"
    >
      <div className="px-7 py-5">
        <div className="fs-5 text-gray-900 fw-bolder">
          {" "}
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
            options={enums.VatAreaUsageTypes.map((item) => ({
              value: item.Value,
              label: item.Title,
            }))} // Options for the select component
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
            {intl.formatMessage({ id: "Fields.SearchResetBtn" })}
          </button>

          <button
            type="submit"
            className="btn btn-sm btn-primary"
            onClick={handleApply} // Apply filter on click
            data-kt-menu-dismiss="true"
          >
            {intl.formatMessage({ id: "Fields.SearchApplyBtn" })}
          </button>
        </div>
      </div>
    </div>
  );
}
