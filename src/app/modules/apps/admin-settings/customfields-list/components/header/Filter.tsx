import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import Select from "react-select";
import enums from "../../../../../../../invoicehippo.enums.json";

interface GroupedOption {
  label: any;
  options: { value: number; label: string }[];
}
interface ComponentProps {
  setFieldTypeFilter: (type: number) => void;
  setAreaTypeFilter: (type: number) => void;
  onFilterApply: (isApplied: boolean) => void;
  areaTypeFilter: number;
  fieldTypeFilter: number;
}

export function Filter({
  setFieldTypeFilter,
  setAreaTypeFilter,
  onFilterApply,
  areaTypeFilter,
  fieldTypeFilter,
}: ComponentProps) {
  const intl = useIntl();

  const [tempFieldTypeOption, setTempFieldTypeOption] =
    useState<any>(fieldTypeFilter);
  const [tempAreaTypeOption, setTempAreaTypeOption] =
    useState<any>(areaTypeFilter);

  const handleFieldTypeChange = (option: any) => {

    if (option === null) {
      setTempFieldTypeOption(0);
    } else setTempFieldTypeOption(option.value);
  };

  const handleAreaTypeChange = (option: any) => {
    if (option === null) {
      setTempAreaTypeOption(0);
    } else setTempAreaTypeOption(option.value);
  };

  const handleApply = () => {
    setAreaTypeFilter(tempAreaTypeOption ? tempAreaTypeOption : 0);
    setFieldTypeFilter(tempFieldTypeOption ? tempFieldTypeOption : 0);

    const storedPaginationString = localStorage.getItem("pagination");
    const pagination = storedPaginationString
      ? JSON.parse(storedPaginationString)
      : {
          "vat-module": {
            pageIndex: 1,
            filters: { searchTerm: "", documentGroup: 0 },
          },
          "ledger-module": {
            pageIndex: 1,
            filters: {
              searchTerm: "",
              ledgerTypeFilter: 0,
              bearingTypeFilter: 0,
            },
          },
          "financial-module": {
            pageIndex: 1,
            filters: { searchTerm: "" },
          },
          "unit-types-module": {
            pageIndex: 1,
            filters: { searchTerm: "" },
          },
          "productgroups-module": {
            pageIndex: 1,
            filters: { searchTerm: "" },
          },
          "discounts-module": {
            pageIndex: 1,
            filters: { searchTerm: "" },
          },
          "users-module": {
            pageIndex: 1,
            filters: { searchTerm: "" },
          },
          "customfields-module": {
            pageIndex: 1,
            filters: {
              searchTerm: "",
              areaTypeFilter: 0,
              fieldTypeFilter: 0,
            },
          },
        };

    pagination["customfields-module"].filters.fieldTypeFilter =
      tempFieldTypeOption ? tempFieldTypeOption : 0;
    pagination["customfields-module"].filters.areaTypeFilter =
      tempAreaTypeOption ? tempAreaTypeOption : 0;
    pagination["customfields-module"].pageIndex = 1;
    localStorage.setItem("pagination", JSON.stringify(pagination));

    onFilterApply(true);
  };

  const handleReset = () => {
    onFilterApply(false);
    localStorage.setItem(
      "pagination",
      JSON.stringify({
        ...JSON.parse(localStorage.getItem("pagination") || "{}"),
        "customfields-module": {
          ...JSON.parse(localStorage.getItem("pagination") || "{}")[
            "customfields-module"
          ],
          filters: {
            ...JSON.parse(localStorage.getItem("pagination") || "{}")[
              "customfields-module"
            ]?.filters,
            areaTypeFilter: 0,
            fieldTypeFilter: 0,
          },
        },
      })
    );
    setAreaTypeFilter(0);
    setFieldTypeFilter(0);
    setTempAreaTypeOption(0);
    setTempFieldTypeOption(0);
  };

  return (
    <div
      className="menu menu-sub menu-sub-dropdown w-full w-md-auto"
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
            {intl.formatMessage({
              id: "Fields.FieldType",
            })}
            :
          </label>
          <Select
            className="react-select-styled"
            placeholder={intl.formatMessage({
              id: "Fields.SelectOptionDefaultFieldType",
            })}
            menuPlacement="bottom"
            value={
              enums.CustomFeatureFieldTypes.map((item: any) => ({
                value: item.Value,
                label: item.Title,
              })).find((option) => option.value === tempFieldTypeOption) || 0
            }
            onChange={handleFieldTypeChange}
            options={enums.CustomFeatureFieldTypes.map((item: any) => ({
              value: item.Value,
              label: item.Title,
            }))}
            isClearable
            closeMenuOnSelect={false}
            data-kt-menu-dismiss="false"
          />
        </div>
        <div className="mb-10">
          <label className="form-label fw-bold">
            {intl.formatMessage({
              id: "Fields.AreaUsageType",
            })}
            :
          </label>

          <Select
            className="react-select-styled"
            placeholder={intl.formatMessage({
              id: "Fields.SelectOptionDefaultAreaType",
            })}
            menuPlacement="top"
            value={
              enums.CustomFeatureAreaUsageTypes.map((item: any) => ({
                value: item.Value,
                label: item.Title,
              })).find((option) => option.value === tempAreaTypeOption) || 0
            }
            onChange={handleAreaTypeChange}
            options={enums.CustomFeatureAreaUsageTypes.map((item: any) => ({
              value: item.Value,
              label: item.Title,
            }))}
            closeMenuOnSelect={false}
            isClearable
            data-kt-menu-dismiss="false"
          />
        </div>

        <div className="d-flex justify-content-end">
          <button
            type="reset"
            className="btn btn-sm btn-light btn-active-light-primary me-2"
            onClick={handleReset}
            data-kt-menu-dismiss="true"
          >
            {intl.formatMessage({ id: "Fields.FilterResetBtn" })}
          </button>

          <button
            type="submit"
            className="btn btn-sm btn-primary"
            onClick={handleApply}
            data-kt-menu-dismiss="true"
          >
            {intl.formatMessage({ id: "Fields.FilterApplyBtn" })}
          </button>
        </div>
      </div>
    </div>
  );
}
