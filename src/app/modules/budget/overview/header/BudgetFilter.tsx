import { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import Select from "react-select";
import { getBudgetGroups } from "../../../admin-settings/budgetgroups-list/core/_requests.js";
// @ts-ignore
import { updatePagination } from "../../../../helpers/paginationUtils.js";
interface ComponentProps {
  setBudgetGroupId: (type: number | null) => void;
  setIsFilterApplied: (type: boolean) => void;
  tempBudgetGroupId: number | null;
  setTempBudgetGroupId: (type: number | null) => void;
  isFilterApplied: boolean;
  setIsOpen: (type: boolean) => void;
  toggleMenu: any;
  setPageStateIndex: (type: number) => void;
  valueSetter: any;
  isOpen: boolean;
}

export function BudgetFilter({
  setBudgetGroupId,
  tempBudgetGroupId,
  isFilterApplied,
  setIsOpen,
  setIsFilterApplied,
  toggleMenu,
  setTempBudgetGroupId,
  setPageStateIndex,
  valueSetter,
  isOpen,
}: ComponentProps) {
  const intl = useIntl();

  const handleApply = () => {
    setBudgetGroupId(tempBudgetGroupId);
    const moduleKey = "budgets-module";
    updatePagination(
      moduleKey,
      {
        budgetGroupId: tempBudgetGroupId || null,
      },
      1
    );
    setPageStateIndex(1);
    toggleMenu();
  };

  const handleReset = () => {
    if (!isFilterApplied) {
      setIsOpen(false);
      return;
    } else {
      setIsFilterApplied(false);
      const moduleKey = "budgets-module";
      updatePagination(
        moduleKey,
        {
          budgetGroupId: null,
        },
        1
      );
      valueSetter();
    }
  };

  const [budgetGroups, setBudgetGroups] = useState<any>([]);
  useEffect(() => {
    const fetchBudgetGroups = async () => {
      const response = await getBudgetGroups("", 1);
      if (response.isValid) {
        setBudgetGroups(response.result);
      }
    };
    if (budgetGroups?.length === 0) {
      fetchBudgetGroups();
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
            {/* {intl.formatMessage({ id: "Menu.BudgetGroups" })}: */}
            Budget Groups
          </label>
          <Select
            value={
              tempBudgetGroupId
                ? budgetGroups
                    ?.map((item: any) => ({
                      value: item.id,
                      label: item.title,
                    }))
                    .find(
                      (budgetGroups: any) =>
                        budgetGroups.value === tempBudgetGroupId
                    )
                : null
            }
            className="react-select-styled"
            options={budgetGroups.map((item: any) => ({
              value: item.id,
              label: item.title,
            }))}
            placeholder={intl.formatMessage({ id: "Fields.SelectOptionNvt" })}
            onChange={(option) =>
              setTempBudgetGroupId(option ? option.value : null)
            }
            isClearable
          />
        </div>
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
