import { useIntl } from "react-intl";
import Select from "react-select";
import enums from "../../../../../_metronic/i18n/messages/invoicehippo.enums.json";
// @ts-ignore
import { updatePagination } from "../../../../helpers/paginationUtils.js";
import { getEnumOptions } from "../../../../helpers/intlHelper";

interface ComponentProps {
  setAreaUsageType: (type: number) => void;
  onFilterApply: (isApplied: boolean) => void;
  tempAreaTypeOption: number;
  setTempAreaTypeOption: (type: number) => void;
  setPageStateIndex: (type: number) => void;
  valueSetter: any;
}
export function Filter({
  setAreaUsageType,
  onFilterApply,
  tempAreaTypeOption,
  setTempAreaTypeOption,
  setPageStateIndex,
  valueSetter,
}: ComponentProps) {
  const intl = useIntl();

  const handleAreaTypeChange = (option: any) => {
    if (option === null) {
      setTempAreaTypeOption(0);
    } else setTempAreaTypeOption(option.value);
  };

  const handleApply = () => {
    setAreaUsageType(tempAreaTypeOption ? tempAreaTypeOption : 0);
    const moduleKey = "notifications-module";
    updatePagination(
      moduleKey,
      {
        areaUsageType: tempAreaTypeOption || 0,
      },
      1
    );
    setPageStateIndex(1);
    onFilterApply(true);
  };
  const handleReset = () => {
    onFilterApply(false);
    const moduleKey = "notifications-module";
    updatePagination(
      moduleKey,
      {
        areaUsageType: 0,
      },
      1
    );
    valueSetter();
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
            value={
              getEnumOptions(enums.NotificationCycleAreaUsageTypes, intl).find(
                (option) => option.value === tempAreaTypeOption
              ) || 0
            }
            onChange={handleAreaTypeChange}
            options={getEnumOptions(
              enums.NotificationCycleAreaUsageTypes,
              intl
            )}
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
