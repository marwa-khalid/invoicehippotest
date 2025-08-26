import { useIntl } from "react-intl";
import Select from "react-select";
import enums from "../../../../../_metronic/i18n/messages/invoicehippo.enums.json";
// @ts-ignore
import { updatePagination } from "../../../../helpers/paginationUtils.js";
import { getEnumOptions } from "../../../../helpers/intlHelper";

interface ComponentProps {
  setFieldTypeFilter: (type: number) => void;
  setAreaTypeFilter: (type: number) => void;
  onFilterApply: (isApplied: boolean) => void;
  tempAreaTypeOption: number;
  tempFieldTypeOption: number;
  setTempAreaTypeOption: (type: number) => void;
  setTempFieldTypeOption: (type: number) => void;
  valueSetter: any;
  setPageIndex: (type: number) => void;
}

export function Filter({
  setFieldTypeFilter,
  setAreaTypeFilter,
  onFilterApply,
  tempAreaTypeOption,
  tempFieldTypeOption,
  setTempAreaTypeOption,
  setTempFieldTypeOption,
  valueSetter,
  setPageIndex,
}: ComponentProps) {
  const intl = useIntl();
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
    const moduleKey = "customfields-module";
    updatePagination(
      moduleKey,
      {
        fieldTypeFilter: tempFieldTypeOption || 0,
        areaTypeFilter: tempAreaTypeOption || 0,
      },
      1
    );
    setPageIndex(1);
    onFilterApply(true);
  };
  const handleReset = () => {
    onFilterApply(false);
    const moduleKey = "customfields-module";
    updatePagination(
      moduleKey,
      {
        fieldTypeFilter: 0,
        areaTypeFilter: 0,
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
              getEnumOptions(enums.CustomFeatureFieldTypes, intl).find(
                (option) => option.value === tempFieldTypeOption
              ) || 0
            }
            onChange={handleFieldTypeChange}
            options={getEnumOptions(enums.CustomFeatureFieldTypes, intl)}
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
              getEnumOptions(enums.CustomFeatureAreaUsageTypes, intl).find(
                (option) => option.value === tempAreaTypeOption
              ) || 0
            }
            onChange={handleAreaTypeChange}
            options={getEnumOptions(enums.CustomFeatureAreaUsageTypes, intl)}
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
