import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import Select from "react-select";
import enums from "../../../../../../../invoicehippo.enums.json";

interface GroupedOption {
  label: any;
  options: { value: number; label: string }[];
}
interface ComponentProps {
  setLedgerTypeFilter: (type: number) => void;
  setBearingTypeFilter: (type: number) => void;
  onFilterApply: (isApplied: boolean) => void;
  tempLedgerTypeOption: number;
  tempBearingTypeOption: number;
  setTempLedgerTypeOption: (type: number) => void;
  setTempBearingTypeOption: (type: number) => void;
}

export function Filter({
  setLedgerTypeFilter,
  setBearingTypeFilter,
  onFilterApply,
  tempLedgerTypeOption,
  tempBearingTypeOption,
  setTempLedgerTypeOption,
  setTempBearingTypeOption,
}: ComponentProps) {
  const intl = useIntl();

  const handleLedgerTypeChange = (option: any) => {
    if (option === null) {
      setTempLedgerTypeOption(0);
    } else setTempLedgerTypeOption(option.value);
  };

  const handleApply = () => {
    setLedgerTypeFilter(tempLedgerTypeOption ? tempLedgerTypeOption : 0);
    setBearingTypeFilter(tempBearingTypeOption ? tempBearingTypeOption : 0);

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

    pagination["ledger-module"].filters.ledgerTypeFilter = tempLedgerTypeOption
      ? tempLedgerTypeOption
      : 0;
    pagination["ledger-module"].filters.bearingTypeFilter =
      tempBearingTypeOption ? tempBearingTypeOption : 0;
    pagination["ledger-module"].pageIndex = 1;
    localStorage.setItem("pagination", JSON.stringify(pagination));

    onFilterApply(true);
  };
  const handleReset = () => {
    onFilterApply(false);
    localStorage.setItem(
      "pagination",
      JSON.stringify({
        ...JSON.parse(localStorage.getItem("pagination") || "{}"),
        "ledger-module": {
          ...JSON.parse(localStorage.getItem("pagination") || "{}")[
            "ledger-module"
          ],
          filters: {
            ...JSON.parse(localStorage.getItem("pagination") || "{}")[
              "ledger-module"
            ]?.filters,
            ledgerTypeFilter: 0,
            bearingTypeFilter: 0,
          },
        },
      })
    );
    setTempLedgerTypeOption(0);
    setTempBearingTypeOption(0);
    setLedgerTypeFilter(0);
    setBearingTypeFilter(0);
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
              id: "Fields.NotificationCycleAreaUsageType",
            })}
            :
          </label>
          <Select
            className="react-select-styled"
            placeholder={intl.formatMessage({
              id: "Fields.NotificationCycleAreaUsageType",
            })}
            menuPlacement="bottom"
            // value={
            //   enums.NotificationCycleAreaUsageTypes.map((item: any) => ({
            //     value: item.Value,
            //     label: item.Title,
            //   })).find((option) => option.value === tempLedgerTypeOption) || 0
            // }
            onChange={handleLedgerTypeChange}
            options={enums.NotificationCycleAreaUsageTypes.map((item: any) => ({
              value: item.Value,
              label: item.Title,
            }))}
            isClearable
            closeMenuOnSelect={false}
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
