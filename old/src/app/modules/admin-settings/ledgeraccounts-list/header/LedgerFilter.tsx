import { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import Select from "react-select";
import enums from "../../../../../_metronic/i18n/messages/invoicehippo.enums.json";
// @ts-ignore
import { updatePagination } from "../../../../helpers/paginationUtils.js";
import { getEnumOptions } from "../../../../helpers/intlHelper";

interface GroupedOption {
  label: any;
  options: { value: number; label: string }[];
}
interface ComponentProps {
  setLedgerTypeFilter: (type: number) => void;
  setBearingTypeFilter: (type: number) => void;
  setIsFilterApplied: (isApplied: boolean) => void;
  tempLedgerTypeOption: number;
  tempBearingTypeOption: number;
  setTempLedgerTypeOption: (type: number) => void;
  setTempBearingTypeOption: (type: number) => void;
  valueSetter: any;
  setPageIndex: (type: number) => void;
  isFilterApplied: boolean;
  setIsOpen: (type: boolean) => void;
  isOpen: boolean;
  toggleMenu: any;
}

export function LedgerFilter({
  setLedgerTypeFilter,
  setBearingTypeFilter,
  setIsFilterApplied,
  tempLedgerTypeOption,
  tempBearingTypeOption,
  setTempLedgerTypeOption,
  setTempBearingTypeOption,
  valueSetter,
  setPageIndex,
  isFilterApplied,
  setIsOpen,
  isOpen,
  toggleMenu,
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
          label: item.LocalizationValueKey
            ? intl.formatMessage({
                id: `Enums.${item.LocalizationValueKey}`,
              })
            : item.Title,
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
  const ledgerTypeOptions = getEnumOptions(enums.LedgerTypes, intl);
  useEffect(() => {
    if (tempLedgerTypeOption) {
      const selectedTypeLabel = enums.LedgerTypes.find((item) => {
        return item.Value === tempLedgerTypeOption;
      })?.Title;
      const label = ledgerTypeOptions.find((item) => {
        return item.value === tempLedgerTypeOption;
      })?.label;
      const filteredGroups = bearingGroups
        .filter((group) => {
          return group.label.props.children[0].includes(selectedTypeLabel);
        })
        .map((group) => ({
          ...group,
          label: (
            <div>
              {label || label} - <small>{group.label.props.children[2]}</small>
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
    const moduleKey = "ledger-module";
    updatePagination(
      moduleKey,
      {
        ledgerTypeFilter: tempLedgerTypeOption || 0,
        bearingTypeFilter: tempBearingTypeOption || 0,
      },
      1
    );
    setPageIndex(1);
    toggleMenu();
  };
  const handleReset = () => {
    if (!isFilterApplied) {
      setIsOpen(false);
      return;
    } else {
      setIsFilterApplied(false);
      const moduleKey = "ledger-module";
      updatePagination(
        moduleKey,
        {
          ledgerTypeFilter: 0,
          bearingTypeFilter: 0,
        },
        1
      );
      valueSetter();
    }
  };

  return (
    <div style={{ display: isOpen ? "block" : "none" }}>
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
              getEnumOptions(enums.LedgerTypes, intl).find(
                (option) => option.value === tempLedgerTypeOption
              ) || 0
            }
            onChange={handleLedgerTypeChange}
            options={getEnumOptions(enums.LedgerTypes, intl)}
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
            className="btn btn-secondary me-2"
            onClick={handleReset}
            data-kt-menu-dismiss="true"
          >
            {intl.formatMessage({ id: "Fields.FilterResetBtn" })}
          </button>

          <button
            type="submit"
            className="btn btn-primary"
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
