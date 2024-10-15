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
  const [bearingGroups, setBearingGroups] = useState<GroupedOption[]>([]);
  const [filteredBearingGroups, setFilteredBearingGroups] = useState<
    GroupedOption[]
  >([]);

  useEffect(() => {
    const toTitleCase = (str: string) => {
      return str.replace(/\w\S*/g, (txt) => {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      });
    };

    const transformBearingTypes = () => {
      const groupMap: { [key: string]: GroupedOption } = {};

      enums.BearingTypes.forEach((item: any) => {
        const group = toTitleCase(item.Group);
        const subGroup = toTitleCase(item.SubGroup);
        const groupKey = `${group} - ${subGroup}`;

        if (!groupMap[groupKey]) {
          groupMap[groupKey] = {
            label: (
              <div>
                {group} - <small>{subGroup}</small>
              </div>
            ) as any,
            options: [],
          };
        }

        groupMap[groupKey].options.push({
          value: item.Value,
          label: item.Title,
        });
      });

      const sortedGroups = Object.values(groupMap).sort((a, b) => {
        const aLabel = (a.label as any).props.children[0];
        const bLabel = (b.label as any).props.children[0];
        return aLabel.localeCompare(bLabel);
      });

      setBearingGroups(sortedGroups);
    };

    transformBearingTypes();
  }, []);

  useEffect(() => {
    if (tempLedgerTypeOption) {
      const selectedTypeLabel = enums.LedgerTypes.find((item) => {
        return item.Value === tempLedgerTypeOption;
      })?.Title;
      const filteredGroups = bearingGroups
        .filter((group) => {
          return group.label.props.children[0].includes(selectedTypeLabel);
        })
        .map((group) => ({
          ...group,
          label: (
            <div>
              {selectedTypeLabel || selectedTypeLabel} -{" "}
              <small>{group.label.props.children[2]}</small>
            </div>
          ),
        }));
      setFilteredBearingGroups(filteredGroups);
    } else {
      setFilteredBearingGroups(bearingGroups);
    }
  }, [tempLedgerTypeOption, bearingGroups]);

  const handleLedgerTypeChange = (option: any) => {
    if (option === null) {
      setTempLedgerTypeOption(0);
    } else setTempLedgerTypeOption(option.value);
  };

  const handleBearingTypeChange = (option: any) => {
    if (option === null) {
      setTempBearingTypeOption(0);
    } else setTempBearingTypeOption(option.value);
  };

  const handleApply = () => {
    setLedgerTypeFilter(tempLedgerTypeOption ? tempLedgerTypeOption : 0);
    setBearingTypeFilter(tempBearingTypeOption ? tempBearingTypeOption : 0);

    const storedPaginationString = localStorage.getItem("pagination");
    const pagination = storedPaginationString
      ? JSON.parse(storedPaginationString)
      : JSON.parse(import.meta.env.VITE_APP_PAGINATION);

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
              id: "Fields.SelectOptionDefaultLedgerAccountType",
            })}
            :
          </label>
          <Select
            className="react-select-styled"
            placeholder={intl.formatMessage({
              id: "Fields.SelectOptionDefaultLedgerAccountType",
            })}
            menuPlacement="bottom"
            value={
              enums.LedgerTypes.map((item: any) => ({
                value: item.Value,
                label: item.Title,
              })).find((option) => option.value === tempLedgerTypeOption) || 0
            }
            onChange={handleLedgerTypeChange}
            options={enums.LedgerTypes.map((item: any) => ({
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
              id: "Fields.SelectOptionDefaultLedgerAccountBearingType",
            })}
            :
          </label>

          <Select
            className="react-select-styled"
            placeholder={intl.formatMessage({
              id: "Fields.SelectOptionDefaultLedgerAccountBearingType",
            })}
            menuPlacement="top"
            value={
              filteredBearingGroups
                .flatMap((group) => group.options)
                .find((option) => option.value === tempBearingTypeOption) || 0
            }
            onChange={handleBearingTypeChange}
            options={filteredBearingGroups}
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
