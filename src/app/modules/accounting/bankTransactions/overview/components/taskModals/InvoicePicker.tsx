import { useIntl } from "react-intl";
import { KTIcon } from "../../../../../../../_metronic/helpers";
import { FC, useEffect, useState } from "react";
import { ListPagination } from "../../../../../generic/ListPagination";
import Select from "react-select";
import Tippy from "@tippyjs/react";
import { Menu, MenuList, MenuButton } from "@chakra-ui/react";
// @ts-ignore
import { updatePagination } from "../../../../../../helpers/paginationUtils.js";
// @ts-ignore
import { getPaginationModule } from "../../../../../../helpers/paginationUtils.js";
// @ts-ignore
import { resetPaginationModule } from "../../../../../../helpers/paginationUtils.js";
import {
  InvoiceListResult,
  InvoicePickerModel,
} from "../../../../../invoices/overview/core/_models";
import { ListLoading } from "../../../../../generic/ListLoading";
import enums from "../../../../../../../_metronic/i18n/messages/invoicehippo.enums.json";
import { getInvoicesForPicker } from "../../../../../invoices/overview/core/_requests";
import { getMinMaxYear } from "../../../../../inbox/components/core/_requests";
import { getDateRange, parseDate } from "../../../../../../utils/dateUtils";
import { getStatusClass } from "../../../../../../utils/statusUtils";
import { getEnumOptions } from "../../../../../../helpers/intlHelper";
import clsx from "clsx";
import { NoItemsPage } from "../../../../../generic/NoItemsPage";
import ListCard from "../../../../../generic/ListElements/ListCard";

interface Props {
  handleClose: any;
  id: number;
  setLinkInvoiceModalOpen: (type: boolean) => void;
  setInvoiceData: (type: InvoiceListResult) => void;
}
const InvoicePicker: FC<Props> = ({
  handleClose,
  id,
  setLinkInvoiceModalOpen,
  setInvoiceData,
}) => {
  const intl = useIntl();
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => {
    setIsOpen((prev) => !prev); // Toggle menu open/close
  };
  const [isFilterApplied, setIsFilterApplied] = useState<boolean>(false);

  const moduleKey = "invoice-picker";
  let filters = getPaginationModule(moduleKey);

  const [searchTerm, setSearchTerm] = useState<string>(
    filters.searchTerm || ""
  );
  const [year, setYear] = useState<number | null>(filters.yearFilter || null);
  const [periodValueType, setPeriodValueType] = useState<number | null>(
    filters?.periodType || null
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [localSearchTerm, setLocalSearchTerm] = useState<string>(searchTerm);
  const [counter, setCounter] = useState<number>(1);
  const [invoices, setInvoices] = useState<InvoicePickerModel>();
  const [pageIndex, setPageIndex] = useState<number>(filters.pageIndex || 1);
  const handleSearchClick = () => {
    if (localSearchTerm !== undefined) {
      setSearchTerm(localSearchTerm);
      setPeriodValueType(tempPeriodType);
      setYear(tempYear);
      setPageIndex(1);
      updatePagination(
        moduleKey,
        {
          searchTerm: localSearchTerm || "",
          periodType: tempPeriodType,
          yearFilter: tempYear,
        },
        1
      );
      setCounter((prev) => prev + 1);
      if (isOpen) {
        toggleMenu();
      }
    }
  };
  useEffect(() => {
    const fetchMinMaxYear = async () => {
      const response = await getMinMaxYear();
      setMinMaxYear(response.result);
    };
    fetchMinMaxYear();
  }, []);
  const handleReset = () => {
    resetPaginationModule(moduleKey);
    setLocalSearchTerm("");
    setSearchTerm("");
    setPageIndex(1);
    setPeriodValueType(null);
    setYear(null);
    setTempPeriodType(null);
    setTempYear(null);
    if (isOpen) {
      toggleMenu();
    }
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

  const [minMaxYear, setMinMaxYear] = useState<any>();
  const yearOptions = Array.from(
    { length: minMaxYear?.maxYear - minMaxYear?.minYear + 1 },
    (_, i) => {
      const year = minMaxYear.maxYear - i;
      return { value: year, label: year.toString() };
    }
  );
  const fetchInvoices = async () => {
    try {
      setIsLoading(true);
      let dateRange;
      if (periodValueType) {
        const range = getDateRange(periodValueType, year);

        const [startDate, endDate] = range.split(" - ");

        const start = parseDate(startDate).toISOString();
        const end = parseDate(endDate).toISOString();

        dateRange = {
          startDate: start,
          endDate: end,
        };
      }

      const response = await getInvoicesForPicker(
        searchTerm,
        pageIndex,
        dateRange,
        id
      );
      if (response.isValid) {
        setInvoices(response);
        setIsLoading(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [searchTerm, counter, pageIndex, id, year, periodValueType]);

  const handlePageChange = (page: number) => {
    setPageIndex(page);
  };
  const [tempYear, setTempYear] = useState<number | null>(year);
  const [tempPeriodType, setTempPeriodType] = useState<number | null>(
    periodValueType
  );
  useEffect(() => {
    if (tempYear == null) {
      setDisablePeriodSelect(true);
      setTempPeriodType(null);
    } else {
      setDisablePeriodSelect(false);
    }
  }, [tempYear]);
  useEffect(() => {
    if (year || periodValueType) {
      setIsFilterApplied(true);
    } else {
      setIsFilterApplied(false);
    }
  }, [year, periodValueType]);

  return (
    <>
      <div
        className="modal fade show d-block"
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-dialog mw-800px">
          <div className="modal-content">
            <div className="modal-header bg-primary">
              <div className="fv-row col-12 d-flex justify-content-between align-items-center mb-0">
                <h2 className="fw-bolder mb-0 text-white">
                  {intl.formatMessage({
                    id: "Fields.Invoices",
                  })}
                </h2>
                <div
                  className="btn btn-icon btn-sm btn-active-icon-primary"
                  onClick={handleClose}
                  style={{ cursor: "pointer" }}
                >
                  <KTIcon iconName="cross" className="fs-1 text-white" />
                </div>
              </div>
            </div>

            <div className="modal-body bg-secondary">
              <div className="w-full mb-10">
                {/* Full-width search input */}
                <div className="d-flex align-items-center position-relative mb-2 gap-1 ">
                  <KTIcon
                    iconName="magnifier"
                    className="fs-3 position-absolute ms-6"
                  />

                  <input
                    type="text"
                    data-kt-user-table-filter="search"
                    className="form-control form-control-solid w-100 ps-14 rounded-lg me-6"
                    placeholder={intl.formatMessage({
                      id: "Fields.SearchTerm",
                    })}
                    value={localSearchTerm}
                    id="searchTerm"
                    onChange={(e) => {
                      e.preventDefault();
                      setLocalSearchTerm(e.target.value);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSearchClick();
                      }
                    }}
                  />
                  <div className="btn-group gap-1">
                    <button
                      className="btn btn-primary d-inline-flex align-items-center"
                      onClick={handleSearchClick}
                    >
                      <i className="la la-search fs-2"></i>
                      <span className="ms-1">
                        {intl.formatMessage({ id: "Fields.SearchBtn" })}
                      </span>
                    </button>

                    <Menu
                      isOpen={isOpen}
                      onClose={() => setIsOpen(false)}
                      closeOnBlur={false}
                      flip={false}
                      placement="bottom-end"
                    >
                      <MenuButton
                        className={clsx(
                          "btn btn-icon fw-bold rounded-0",
                          isFilterApplied
                            ? "btn-warning btn-active-warning"
                            : "btn-light-dark btn-active-light-dark"
                        )}
                        onClick={toggleMenu}
                      >
                        <i
                          className={`ki-solid ki-filter fs-3 me-1 
                          ${isFilterApplied ? "text-white" : "text-muted"}
                        `}
                        />
                      </MenuButton>
                      <MenuList
                        className="p-5 bg-body border-0 shadow-sm"
                        zIndex={3}
                      >
                        <div
                          className="p-5"
                          style={{ display: isOpen ? "block" : "none" }}
                        >
                          <div className="fs-5 text-gray-900 fw-bolder">
                            {intl.formatMessage({
                              id: "Fields.FilterPopUpTitle",
                            })}
                          </div>
                          <div className="separator border-gray-200"></div>

                          <div className="my-5">
                            <label
                              className="form-label fw-bold"
                              htmlFor="year"
                            >
                              {intl.formatMessage({
                                id: "Fields.SelectOptionDefaultYear",
                              })}
                              :
                            </label>
                            <Select
                              className="react-select-styled"
                              placeholder={intl.formatMessage({
                                id: "Fields.SelectOptionDefaultYear",
                              })}
                              menuPlacement="bottom"
                              inputId="year"
                              value={
                                yearOptions.find(
                                  (option) => option.value === tempYear
                                ) || null
                              }
                              onChange={(option) => {
                                setTempYear(option ? option.value : null);
                                if (
                                  tempPeriodType === null ||
                                  tempPeriodType === null
                                ) {
                                  setTempPeriodType(13);
                                }
                              }}
                              options={yearOptions}
                              isClearable
                            />
                          </div>
                          <div className="separator border-gray-200"></div>
                          {/* Period Selection */}
                          <div className="my-5">
                            <label
                              className="form-label fw-bold"
                              htmlFor="period"
                            >
                              {intl.formatMessage({
                                id: "Fields.SelectOptionDefaultPeriod",
                              })}
                              :
                            </label>
                            <Select
                              className="react-select-styled"
                              menuPlacement="bottom"
                              value={
                                renderPeriodOptions()
                                  .flatMap((group) => group.options)
                                  .find(
                                    (option) => option.value === tempPeriodType
                                  ) || null
                              }
                              inputId="period"
                              onChange={handlePeriodTypeChange}
                              options={renderPeriodOptions()}
                              placeholder={intl.formatMessage({
                                id: "Fields.SelectOptionDefaultPeriod",
                              })}
                              isClearable
                              isDisabled={disablePeriodSelect}
                            />
                          </div>
                          <div className="separator border-gray-200 mb-5"></div>
                          <div className="d-flex justify-content-end gap-2">
                            <button
                              type="reset"
                              className="btn btn-secondary"
                              onClick={handleReset}
                              data-kt-menu-dismiss="true"
                            >
                              {intl.formatMessage({
                                id: "Fields.FilterResetBtn",
                              })}
                            </button>
                            <button
                              className="btn btn-primary"
                              onClick={handleSearchClick}
                            >
                              {intl.formatMessage({
                                id: "Fields.FilterApplyBtn",
                              })}
                            </button>
                          </div>
                        </div>
                      </MenuList>
                    </Menu>

                    <button
                      className="btn btn-light-dark btn-active-light-dark btn-icon"
                      onClick={handleReset}
                    >
                      <i className="la la-remove fs-3"></i>
                    </button>
                  </div>
                </div>
              </div>

              {invoices && invoices.totalRows > 0 && (
                <h5 className="px-2 mb-10">
                  {intl
                    .formatMessage({ id: "Fields.SearchResultHeaderCount" })
                    .replace("{0}", invoices?.totalRows.toString())}
                </h5>
              )}
              <div className="row row-cols-1 row-cols-md-1 g-4">
                {
                  // !isLoading &&
                  invoices?.result?.map((invoiceList: InvoiceListResult) => (
                    <ListCard key={invoiceList.id}>
                      {/* Ribbons */}

                      <Tippy
                        content={
                          <div style={{ fontFamily: "monospace" }}>
                            <div className="table" style={{ width: "100%" }}>
                              {/* Total Price */}
                              {invoiceList.totals.totalPrice && (
                                <div style={{ display: "table-row" }}>
                                  <div
                                    className="px-2"
                                    style={{
                                      display: "table-cell",
                                      textAlign: "right",
                                    }}
                                  >
                                    {intl.formatMessage({
                                      id: "Fields.TotalPrice",
                                    })}
                                    :
                                  </div>
                                  <div
                                    style={{
                                      display: "table-cell",
                                      textAlign: "right",
                                    }}
                                  >
                                    {invoiceList.valuta.sign}
                                    {invoiceList.totals.totalPrice.toFixed(2)}
                                  </div>
                                </div>
                              )}
                              {/* Total VAT Amount */}
                              {invoiceList.totals.totalVATAmount !== 0 && (
                                <div style={{ display: "table-row", gap: 3 }}>
                                  <div
                                    className="px-2"
                                    style={{
                                      display: "table-cell",
                                      textAlign: "right",
                                    }}
                                  >
                                    {intl.formatMessage({
                                      id: "Fields.TotalVATAmount",
                                    })}
                                    :
                                  </div>

                                  <div
                                    style={{
                                      display: "table-cell",
                                      textAlign: "right",
                                    }}
                                  >
                                    {invoiceList.valuta.sign}
                                    {invoiceList.totals.totalVATAmount.toFixed(
                                      2
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        }
                      >
                        <div
                          className="ribbon ribbon-end ribbon-clip position-absolute cursor-pointer"
                          style={{
                            top: "10px",
                            right: "0px",
                            height: "30px",
                            width: "100px",
                          }}
                        >
                          <div className="ribbon-label fw-bold">
                            {invoiceList.valuta.sign}
                            {invoiceList.totals.totalPriceWithVAT.toFixed(2)}
                            <span className="ribbon-inner bg-gray-600"></span>
                          </div>
                        </div>
                      </Tippy>
                      <Tippy
                        content={
                          <div>
                            <h5 className="text-white">
                              {intl.formatMessage({
                                id: "Fields.VoucherNr",
                              })}
                            </h5>
                            <span>{invoiceList.voucherNr}</span>
                          </div>
                        }
                      >
                        <div
                          className="ribbon ribbon-start ribbon-clip position-absolute cursor-pointer"
                          style={{
                            top: "10px",
                            height: "30px",
                            minWidth: "200px",
                          }}
                        >
                          <div className="ribbon-label fw-bold">
                            {invoiceList.invoiceNr}
                            <span className="ribbon-inner bg-gray-600"></span>
                          </div>
                        </div>
                      </Tippy>
                      <div className="px-7 pt-3">
                        {/* First Row: Client Name (Left) and Amount (Right) */}
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="d-flex align-items-center">
                            {/* Client Name on the Left */}
                            <div className="d-flex align-items-center flex-wrap">
                              <i className="ki-duotone ki-calendar-2 fs-3x text-primary">
                                <span className="path1"></span>
                                <span className="path2"></span>
                                <span className="path3"></span>
                                <span className="path4"></span>
                                <span className="path5"></span>
                              </i>

                              <div className="d-flex flex-column mx-6">
                                <span className="fs-sm text-muted d-flex align-items-center position-relative pe-6">
                                  {intl.formatMessage({
                                    id: "Fields.InvoiceDate",
                                  })}
                                  {invoiceList.hasAttachments && (
                                    <span className="position-absolute bottom-60 start-100 translate-middle badge badge-sm badge-square badge-primary fs-8 p-2">
                                      <KTIcon
                                        iconName="paper-clip"
                                        className="icon-1 text-white"
                                      />
                                      {invoiceList.attachmentsCount}
                                    </span>
                                  )}
                                </span>

                                <span className="fw-bolder text-primary">
                                  {invoiceList.invoiceDateAsString}
                                </span>
                              </div>
                            </div>

                            <span
                              style={{
                                backgroundColor: "#f1f1f4",
                                height: "40px",
                                width: "1px",
                              }}
                              className="mx-10 my-5"
                            ></span>
                            <div className="d-flex flex-column">
                              <strong className="cursor-pointer text-primary fs-7">
                                {invoiceList.client}
                              </strong>

                              <ul className="breadcrumb breadcrumb-secondary breadcrumb-dot my-1 text-muted">
                                <li className="breadcrumb-item">
                                  {invoiceList.invoiceStatus.name && (
                                    <small
                                      className={`${getStatusClass(
                                        invoiceList.invoiceStatus.value
                                      )} rounded p-1 text-white fw-bold px-3`}
                                    >
                                      {
                                        getEnumOptions(
                                          enums.InvoiceStatusTypes,
                                          intl
                                        ).find(
                                          (item) =>
                                            item.value ===
                                            invoiceList.invoiceStatus.value
                                        )?.label
                                      }
                                    </small>
                                  )}
                                </li>
                                {invoiceList.clientReferenceNr && (
                                  <li className="breadcrumb-item">
                                    <small>
                                      {invoiceList.clientReferenceNr}
                                    </small>
                                  </li>
                                )}
                              </ul>
                            </div>
                          </div>

                          <Tippy
                            content={intl.formatMessage({
                              id: "Fields.ModalBankMutationAsInvoiceExisting",
                            })}
                          >
                            <button
                              className="btn btn-icon btn-primary btn-sm "
                              onClick={(e) => {
                                e.preventDefault();
                                setInvoiceData(invoiceList);
                                handleClose();
                                setLinkInvoiceModalOpen(true);
                              }}
                            >
                              <i className="ki-duotone ki-fasten text-white fs-3 p-0">
                                <span className="path1"></span>
                                <span className="path2"></span>
                              </i>
                            </button>
                          </Tippy>
                        </div>

                        {/* {invoiceList.hasVoucherNr && (
                          <div className="mt-2">
                            <span className="text-gray-400 fs-8">
                              #{invoiceList.voucherNr}
                            </span>
                          </div>
                        )} */}
                      </div>
                    </ListCard>
                  ))
                }

                {invoices?.result?.length == 0 && <NoItemsPage />}
                {isLoading && <ListLoading />}
              </div>
            </div>
            {/* {isLoading && <ListLoading />} */}
            <div className="modal-footer bg-secondary d-flex">
              <div className="flex-grow-1">
                {invoices && invoices.totalRows > 0 && (
                  <ListPagination
                    totalPages={invoices?.totalPages}
                    pageIndex={invoices?.pageIndex}
                    onPageChange={handlePageChange}
                    totalItems={invoices?.totalRows}
                    moduleName="invoice-picker"
                  />
                )}
              </div>
              <div className="ms-auto">
                <button
                  type="button"
                  className="btn btn-light btn-active-light"
                  onClick={handleClose}
                >
                  {intl.formatMessage({ id: "Fields.ActionClose" })}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  );
};

export { InvoicePicker };
