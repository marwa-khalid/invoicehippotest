import { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import Select from "react-select";
import enums from "../../../../../../_metronic/i18n/messages/invoicehippo.enums.json";
import { getMinMaxYear } from "../core/_requests";
// @ts-ignore
import { updatePagination } from "../../../../../helpers/paginationUtils.js";
import { ClientAddButtons } from "../../../../generic/ClientAddButtons";
import { useAuth } from "../../../../auth";
import { getDateRange } from "../../../../../utils/dateUtils";
import { getEnumOptions } from "../../../../../helpers/intlHelper";

interface ComponentProps {
  tempYear: number | null;
  setYear: (year: number | null) => void;
  setTempYear: (year: number | null) => void;
  setPeriodValueType: (type: number | null) => void;
  setClientIdForFilter: (clientId: number | null) => void;
  setAttachmentType: (type: number) => void;
  setPaymentSourceType: (type: number) => void;
  setTempPaymentType: (types: number) => void;
  setTempAttachmentType: (type: number) => void;
  tempPaymentType: number;
  tempAttachmentType: number;
  tempPeriodType: number | null;
  tempClientId: number | null;
  setIsFilterApplied: (type: boolean) => void;
  isFilterApplied: boolean;
  setTempPeriodType: (type: number | null) => void;
  setTempClientId: (clientId: number | null) => void;
  setShowClientSearch: (type: boolean) => void;
  setClientName: (type: string) => void;
  setIsOpen: (type: boolean) => void;
  clientName: string;
  toggleMenu: any;
  valueSetter: any;
  isOpen: boolean;
  setPageStateIndex: (type: number) => void;
  setTempStatus: (status: any) => void;
  setStatusTypes: (types: any) => void;
  tempStatus: any;
}

export function CostFilter({
  tempYear,
  isFilterApplied,
  setYear,
  setTempYear,
  setPeriodValueType,
  setClientIdForFilter,
  setIsOpen,
  tempPeriodType,
  tempClientId,
  setIsFilterApplied,
  setAttachmentType,
  setPaymentSourceType,
  setTempPaymentType,
  setTempAttachmentType,
  tempPaymentType,
  tempAttachmentType,
  setTempPeriodType,
  setTempClientId,
  setShowClientSearch,
  setClientName,
  clientName,
  toggleMenu,
  valueSetter,
  isOpen,
  setPageStateIndex,
  setTempStatus,
  setStatusTypes,
  tempStatus,
}: ComponentProps) {
  const intl = useIntl();
  const [minMaxYear, setMinMaxYear] = useState<any>();
  const { currentUser } = useAuth();
  useEffect(() => {
    const fetchMinMaxYear = async () => {
      const response = await getMinMaxYear();
      setMinMaxYear(response.result);
    };
    fetchMinMaxYear();
  }, []);

  const openClientModal = () => {
    setShowClientSearch(true);
  };

  const resetClient = () => {
    setTempClientId(null);
    setClientName("");
    setClientIdForFilter(null);
    localStorage.removeItem("storedClientForCost");
  };
  const quarterList = [
    enums.TaxDeclarationPeriodValueTypes[0],
    enums.TaxDeclarationPeriodValueTypes[1],
    enums.TaxDeclarationPeriodValueTypes[2],
    enums.TaxDeclarationPeriodValueTypes[3],
  ];

  const yearList = [
    enums.TaxDeclarationPeriodValueTypes[16],
    enums.TaxDeclarationPeriodValueTypes[18],
    enums.TaxDeclarationPeriodValueTypes[19],
  ];

  const [disablePeriodSelect, setDisablePeriodSelect] = useState<any>(false);

  useEffect(() => {
    if (tempYear == null) {
      setDisablePeriodSelect(true);
      setTempPeriodType(null);
    } else {
      setDisablePeriodSelect(false);
    }
  }, [tempYear]);
  // Get date range based on the selected period and year

  const renderPeriodOptions = () => {
    const periodOptions = [];
    periodOptions.push({
      label: "Per Semester or Year",
      options: yearList.map((y) => ({
        label: y.LocalizationValueKey
          ? `${intl.formatMessage({
              id: `Enums.${y.LocalizationValueKey}`,
            })} (${getDateRange(y, tempYear)})`
          : `${y?.Title} (${getDateRange(y, tempYear)})`,
        value: y?.Value,
      })),
    });
    periodOptions.push({
      label: "Per Quarter",
      options: quarterList.map((q) => ({
        label: q.LocalizationValueKey
          ? `${intl.formatMessage({
              id: `Enums.${q.LocalizationValueKey}`,
            })} (${getDateRange(q, tempYear)})`
          : `${q.Title} (${getDateRange(q, tempYear)})`,
        value: q.Value,
      })),
    });
    periodOptions.push({
      label: "Per Month",
      options: enums.MonthTypes.map((m) => ({
        label: m.LocalizationValueKey
          ? `${intl.formatMessage({
              id: `Enums.${m.LocalizationValueKey}`,
            })} ${tempYear}`
          : `${m.Title} ${tempYear}`,
        value: m.Value,
      })),
    });

    return periodOptions;
  };

  const handlePeriodTypeChange = (selectedOption: any) => {
    setTempPeriodType(selectedOption ? selectedOption.value : null);
  };

  const handlePaymentTypeChange = (selectedOption: any) => {
    setTempPaymentType(selectedOption ? selectedOption.value : null);
  };

  const handleAttachmentTypeChange = (selectedOption: any) => {
    setTempAttachmentType(selectedOption ? selectedOption.value : null);
  };
  const handleStatusChange = (selectedOptions: any) => {
    const selectedValues = selectedOptions
      ? selectedOptions.map((opt: any) => opt.value)
      : [];
    setTempStatus(selectedValues); // Store selected values in the temporary state
  };
  const handleApply = () => {
    setStatusTypes(tempStatus);
    setAttachmentType(tempAttachmentType);
    setPaymentSourceType(tempPaymentType);
    setPeriodValueType(tempPeriodType);
    setClientIdForFilter(tempClientId);
    setYear(tempYear);
    // Update the pagination state for the "cost-module"
    const moduleKey = "cost-module";
    updatePagination(
      moduleKey,
      {
        periodType: tempPeriodType || null,
        clientFilter: tempClientId || null,
        paymentSourceTypeFilter: tempPaymentType || 0,
        attachmentTypeFilter: tempAttachmentType || 0,
        yearFilter: tempYear || null,
        status: tempStatus || [],
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
      const moduleKey = "cost-module";
      updatePagination(
        moduleKey,
        {
          paymentSourceTypeFilter: 0,
          periodType: null,
          clientFilter: null,
          attachmentTypeFilter: 0,
          yearFilter: null,
          status: [],
        },
        1
      );
      valueSetter();
    }
  };

  const yearOptions = Array.from(
    { length: minMaxYear?.maxYear - minMaxYear?.minYear + 1 },
    (_, i) => {
      const year = minMaxYear.maxYear - i;
      return { value: year, label: year.toString() };
    }
  );

  return (
    <div style={{ display: isOpen ? "block" : "none" }}>
      <div className="px-7 py-5">
        <div className="fs-5 text-gray-900 fw-bolder">
          {intl.formatMessage({ id: "Fields.FilterPopUpTitle" })}
        </div>
      </div>

      <div className="separator border-gray-200"></div>

      <div className="px-7 py-5">
        {/* Year Selection */}
        <div className="mb-5">
          <label className="form-label fw-bold" htmlFor="year">
            {intl.formatMessage({ id: "Fields.SelectOptionDefaultYear" })}:
          </label>
          <Select
            className="react-select-styled"
            inputId="year"
            placeholder={intl.formatMessage({
              id: "Fields.SelectOptionDefaultYear",
            })}
            menuPlacement="bottom"
            value={
              yearOptions.find((option) => option.value === tempYear) || null
            }
            onChange={(option) => {
              setTempYear(option ? option.value : null);
              if (tempPeriodType === null || tempPeriodType === null) {
                setTempPeriodType(13);
              }
            }}
            options={yearOptions}
            isClearable
          />
        </div>

        {/* Period Selection */}
        <div className="mb-5">
          <label className="form-label fw-bold" htmlFor="period">
            {intl.formatMessage({ id: "Fields.SelectOptionDefaultPeriod" })}:
          </label>
          <Select
            className="react-select-styled"
            inputId="period"
            menuPlacement="bottom"
            value={
              renderPeriodOptions()
                .flatMap((group) => group.options)
                .find((option) => option.value === tempPeriodType) || null
            }
            onChange={handlePeriodTypeChange}
            options={renderPeriodOptions()}
            placeholder={intl.formatMessage({
              id: "Fields.SelectOptionDefaultPeriod",
            })}
            isClearable
            isDisabled={disablePeriodSelect}
          />
        </div>
        <div className="separator border-gray-200 mb-4"></div>
        {/* receipt Status Selection */}
        <div className="mb-5">
          <label className="fw-bold form-label" htmlFor="status">
            {intl.formatMessage({ id: "Fields.SelectOptionDefaultStatusType" })}
          </label>
          <Select
            className="react-select-styled flex flex-wrap w-350px"
            isClearable
            menuPlacement="bottom"
            isMulti
            placeholder={intl.formatMessage({
              id: "Fields.SelectOptionDefaultStatusType",
            })}
            inputId="status"
            value={getEnumOptions(enums.ReceiptStatusTypes, intl).filter(
              (option) => tempStatus?.includes(option.value)
            )}
            onChange={handleStatusChange}
            options={getEnumOptions(
              currentUser?.result.isAnonymousUser
                ? enums.ReceiptStatusTypes.filter(
                    (item) => item.Value === 1 || item.Value === 512
                  )
                : enums.ReceiptStatusTypes,
              intl
            )}
          />
        </div>
        <div className="separator border-gray-200 mb-4"></div>
        {/* attachment type Selection */}
        <div className="mb-5">
          <label className="fw-bold form-label" htmlFor="attachmentType">
            select a attachment type
          </label>
          <Select
            inputId="attachmentType"
            className="react-select-styled flex flex-wrap w-350px"
            isClearable
            menuPlacement="bottom"
            placeholder="select a attachment type"
            value={getEnumOptions(enums.IncludingAttachmentsTypes, intl).filter(
              (option) => tempAttachmentType === option.value
            )}
            onChange={handleAttachmentTypeChange}
            options={getEnumOptions(enums.IncludingAttachmentsTypes, intl)}
          />
        </div>
        <div className="separator border-gray-200 mb-4"></div>

        {/* Client Search Button */}
        {!currentUser?.result.isAnonymousUser && (
          <>
            <ClientAddButtons
              clientDisplayName={clientName}
              openClientModal={openClientModal}
              openClientModalInNewMode={openClientModal}
              reset={resetClient}
              setClientSearch={openClientModal}
              type="filter"
            />
            <div className="separator border-gray-200 mb-4"></div>
          </>
        )}
        <div className="separator border-gray-200 mb-4"></div>
        <div className="mb-5">
          <label className="fw-bold form-label" htmlFor="paymentSource">
            {intl.formatMessage({
              id: "Fields.SelectOptionDefaultExistingPayment",
            })}
          </label>
          <Select
            className="react-select-styled flex flex-wrap w-350px"
            isClearable
            inputId="paymentSource"
            menuPlacement="top"
            placeholder={intl.formatMessage({
              id: "Fields.SelectOptionDefaultExistingPayment",
            })}
            value={getEnumOptions(enums.IncludingPaymentSourceTypes, intl).find(
              (option) => tempPaymentType === option.value
            )}
            onChange={handlePaymentTypeChange}
            options={getEnumOptions(enums.IncludingPaymentSourceTypes, intl)}
          />
        </div>
      </div>
      <div className="separator border-gray-200 mb-4"></div>
      <div className="d-flex justify-content-end gap-2">
        <button
          type="reset"
          className="btn btn-secondary"
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
