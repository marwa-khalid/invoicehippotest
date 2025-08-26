import { useIntl } from "react-intl";
import Select from "react-select";
import enums from "../../../../../_metronic/i18n/messages/invoicehippo.enums.json";
// @ts-ignore
import { updatePagination } from "../../../../helpers/paginationUtils.js";
import { ClientAddButtons } from "../../../generic/ClientAddButtons";
import { useAuth } from "../../../auth";
import { getEnumOptions } from "../../../../helpers/intlHelper";

interface ComponentProps {
  setStatusType: (type: number) => void;
  setTempStatus: (type: number) => void;
  setSubscriberIdForFilter: (subscriberId: number | null) => void;
  setTempSubscriberId: (subscriberId: number | null) => void;
  tempStatus: number;
  tempSubscriberId: number | null;
  setIsFilterApplied: (type: boolean) => void;
  isFilterApplied: boolean;
  setShowSubscriberSearch: (type: boolean) => void;
  setSubscriberName: (type: string) => void;
  setIsOpen: (type: boolean) => void;
  subscriberName: string;
  toggleMenu: any;
  valueSetter: any;
  isOpen: boolean;
  setPageStateIndex: (type: number) => void;
}

export function TemplateFilter({
  isFilterApplied,
  setSubscriberIdForFilter,
  setIsOpen,
  tempSubscriberId,
  setIsFilterApplied,
  setTempSubscriberId,
  setShowSubscriberSearch,
  setSubscriberName,
  subscriberName,
  toggleMenu,
  valueSetter,
  isOpen,
  setStatusType,
  tempStatus,
  setTempStatus,
  setPageStateIndex,
}: ComponentProps) {
  const intl = useIntl();

  const openSubscriberModal = () => {
    setShowSubscriberSearch(true);
  };

  const resetSubscriber = () => {
    setTempSubscriberId(null);
    setSubscriberName("");
    setSubscriberIdForFilter(null);
    localStorage.removeItem("storedSubscriberForTemplate");
  };

  const handleStatusTypeChange = (selectedOption: any) => {
    setTempStatus(selectedOption ? selectedOption.value : 0);
  };

  const handleApply = () => {
    setStatusType(tempStatus);
    setSubscriberIdForFilter(tempSubscriberId);
    // Update the pagination state for the "template-module"
    const moduleKey = "template-module";
    updatePagination(
      moduleKey,
      {
        subscriberFilter: tempSubscriberId || null,
        statusType: tempStatus || 0,
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
      const moduleKey = "template-module";
      updatePagination(
        moduleKey,
        {
          statusType: 0,
          subscriberFilter: null,
        },
        1
      );
      valueSetter();
    }
  };

  const { currentUser } = useAuth();
  return (
    <div style={{ display: isOpen ? "block" : "none" }}>
      <div className="px-7 py-5">
        <div className="fs-5 text-gray-900 fw-bolder">
          {intl.formatMessage({ id: "Fields.FilterPopUpTitle" })}
        </div>
      </div>

      <div className="separator border-gray-200"></div>

      <div className="px-7 py-5">
        <div className="mb-5">
          <label className="fw-bold form-label" htmlFor="statusType">
            {intl.formatMessage({
              id: "Fields.SelectOptionFilterOnPaymentsFromMutations",
            })}
          </label>
          <Select
            className="react-select-styled flex flex-wrap w-350px"
            isClearable
            inputId="statusType"
            menuPlacement="top"
            placeholder={intl.formatMessage({
              id: "Fields.SelectOptionDefaultStatusType",
            })}
            value={
              getEnumOptions(enums.TemplateStatusTypes, intl).find(
                (option) => tempStatus === option.value
              ) || null
            }
            onChange={handleStatusTypeChange}
            options={getEnumOptions(enums.TemplateStatusTypes, intl)}
          />
        </div>

        {/* Subscriber Search Button */}
        {!currentUser?.result.isAnonymousUser && (
          <>
            <div className="separator border-gray-200 mb-4"></div>
            <ClientAddButtons
              clientDisplayName={subscriberName}
              openClientModal={openSubscriberModal}
              openClientModalInNewMode={openSubscriberModal}
              reset={resetSubscriber}
              setClientSearch={openSubscriberModal}
              type="modalTemplate"
            />
          </>
        )}
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
