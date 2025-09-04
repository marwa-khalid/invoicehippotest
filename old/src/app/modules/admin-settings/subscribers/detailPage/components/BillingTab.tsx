import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { Content } from "../../../../../../_metronic/layout/components/content";
import { getBillingData } from "../../core/_requests";
import { InvoiceListResult } from "../../../../invoices/overview/core/_models";
import { handleToast } from "../../../../auth/core/_toast";
import { KTIcon } from "../../../../../../_metronic/helpers";
import { getStatusClass } from "../../../../../utils/statusUtils";
import Tippy from "@tippyjs/react";
import { ViewCanvas } from "../../../../generic/ViewCanvas";
import { getDateRange, parseDate } from "../../../../../utils/dateUtils";
import { NoItemsPage } from "../../../../generic/NoItemsPage";
import { getMinMaxYear } from "../../../../invoices/overview/core/_requests";
import { ListLoading } from "../../../../generic/ListLoading";
import { Dropdown2, Dropdown1 } from "../../../../../../_metronic/partials";
import { Menu, MenuButton, MenuList } from "@chakra-ui/react";
interface props {
  id: number;
}
const BillingTab: React.FC<props> = ({ id }) => {
  const intl = useIntl();
  const [response, setResponse] = useState<any>();
  const [dateRange, setDateRange] = useState<any>({});
  const [year, setYear] = useState<number>(-1);
  const [isLoading, setIsLoading] = useState<boolean>();
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => {
    setIsOpen((prev) => !prev); // Toggle menu open/close
  };
  useEffect(() => {
    const fetchBillingData = async () => {
      try {
        setIsLoading(true);
        let pageMax;
        let date = dateRange;
        if (year === -1) {
          pageMax = 12;
          date = undefined;
        } else {
          pageMax = 25;
        }
        const res = await getBillingData(id, date, pageMax);
        if (res.isValid) {
          setResponse(res);
        }
        handleToast(res);
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };
    if (id !== 0) {
      fetchBillingData();
    }
  }, [id, dateRange]);
  const [downloadUrl, setDownloadUrl] = useState<string>("");
  const [key, setKey] = useState<number>(1);
  const [selectedTab, setSelectedTab] = useState<string>("latest");
  useEffect(() => {
    if (year) {
      const range = getDateRange(13, year);
      const [startDate, endDate] = range.split(" - ");
      const start = parseDate(startDate).toISOString();
      const end = parseDate(endDate).toISOString();

      setDateRange({
        startDate: start,
        endDate: end,
      });
    }
  }, [year]);

  const [minMaxYear, setMinMaxYear] = useState<any>();
  useEffect(() => {
    const fetchMinMaxYear = async () => {
      const response = await getMinMaxYear();
      setMinMaxYear(response.result);
    };
    fetchMinMaxYear();
  }, []);
  const allYears =
    minMaxYear && minMaxYear.maxYear
      ? Array.from(
          { length: minMaxYear.maxYear - minMaxYear.minYear + 1 },
          (_, i) => minMaxYear.maxYear - i
        )
      : [];

  const topYears = allYears.slice(0, 3); // 2025, 2024, 2023
  const remainingYears = allYears.slice(3); // 2022–2018

  return (
    <Content>
      <div className="card mb-5 mb-xl-10">
        <div
          className="card-header border-0 cursor-pointer"
          role="button"
          data-bs-target="#kt_account_profile_details"
          aria-expanded="true"
          aria-controls="kt_account_profile_details"
        >
          <div className="card-title m-0">
            <h3 className="m-0 m-0 text-gray-800">Statements</h3>
          </div>
          <div className="card-toolbar m-0">
            <ul
              className="nav nav-stretch fs-5 fw-semibold nav-line-tabs border-transparent"
              role="tablist"
            >
              {/* <li className="nav-item" role="presentation">
                <a
                  className={`nav-link text-active-gray-800 ${
                    year === new Date().getFullYear() ? "active" : ""
                  }`}
                  role="tab"
                  onClick={() => setYear(new Date().getFullYear())}
                >
                 All
                </a>
              </li> */}
              <li className="nav-item" role="presentation">
                <a
                  className={`nav-link text-active-gray-800 ${
                    year === -1 ? "active" : ""
                  }`}
                  role="tab"
                  onClick={() => setYear(-1)}
                >
                  Latest
                </a>
              </li>

              {topYears.map((y) => (
                <li className="nav-item" role="presentation" key={y}>
                  <a
                    className={`nav-link text-active-gray-800 me-4 ${
                      year === y ? "active" : ""
                    }`}
                    role="tab"
                    onClick={() => setYear(y)}
                  >
                    {y}
                  </a>
                </li>
              ))}
            </ul>

            <Menu
              isOpen={isOpen}
              onClose={() => setIsOpen(false)}
              closeOnBlur={false}
              flip={false}
              placement="bottom-end"
            >
              <MenuButton
                className="btn btn-icon fw-bold "
                onClick={toggleMenu}
              >
                <i className="ki-duotone ki-dots-square fs-1 me-1 text-grey-500">
                  <span className="path1"></span>
                  <span className="path2"></span>
                  <span className="path3"></span>
                  <span className="path4"></span>
                </i>
              </MenuButton>
              <MenuList className="p-5 bg-body border-0 shadow-sm" zIndex={3}>
                <div style={{ display: isOpen ? "block" : "none" }}>
                  <div className="menu-item">
                    <div className="menu-content fs-6 text-muted">Years</div>
                  </div>

                  <div className="separator"></div>

                  {remainingYears.map((y, index) => (
                    <div className="menu-item" key={y}>
                      <a
                        href="#"
                        className="menu-link text-dark"
                        onClick={(e) => {
                          e.preventDefault();
                          setYear(y);
                          setIsOpen(false);
                        }}
                      >
                        {y}
                      </a>
                      {index !== remainingYears.length - 1 && (
                        <div className="separator"></div>
                      )}
                    </div>
                  ))}
                </div>
              </MenuList>
            </Menu>
          </div>
        </div>
        <div className="separator"></div>
        <div id="kt_account_profile_details" className="show">
          {response?.totalRows > 0 ? (
            <div className="table-responsive">
              <table className="table align-middle table-row-bordered table-row-solid gy-4 gs-9">
                <thead className="border-gray-200 fs-5 fw-semibold bg-lighten">
                  <tr>
                    <th>Invoice Nr</th>
                    <th>Invoice Date</th>
                    <th>Due Date</th>
                    <th>Total (inc.)</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody className="fs-6 fw-semibold text-gray-600">
                  {response?.result.map((invoice: InvoiceListResult) => (
                    <tr key={invoice.id}>
                      <td>{invoice.invoiceNr}</td>
                      <td>
                        <div className="d-flex align-items-center gap-1">
                          <KTIcon
                            iconName="calendar"
                            className="fs-3 text-primary"
                          ></KTIcon>
                          {invoice.invoiceDateAsString}
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center gap-1">
                          <KTIcon
                            iconName="calendar"
                            className="fs-3 text-primary"
                          ></KTIcon>
                          {invoice.invoiceDueDateAsString}
                        </div>
                      </td>
                      <td>
                        {invoice.valuta.sign}
                        {invoice.totals.totalPriceWithVAT}
                      </td>
                      <td>
                        <small
                          className={`${getStatusClass(
                            invoice.invoiceStatus.value
                          )} rounded p-1 text-white fw-bold px-3`}
                        >
                          {invoice.invoiceStatus.description}
                        </small>
                      </td>
                      <td>
                        {invoice.actions?.canShowPreview && (
                          <Tippy
                            content={intl.formatMessage({
                              id: "Fields.ToolTipView",
                            })}
                          >
                            <button
                              type="button"
                              className="btn btn-icon btn-dark btn-sm me-2"
                              data-bs-toggle="offcanvas"
                              data-bs-target="#offcanvasRight"
                              aria-controls="offcanvasRight"
                              onClick={() => {
                                setDownloadUrl(
                                  invoice.downloadInfo.downloadUrl
                                );
                                setKey((prev) => prev + 1);
                              }}
                            >
                              <i className="ki-solid ki-eye fs-1"></i>
                            </button>
                          </Tippy>
                        )}
                        {invoice.actions?.canDownload && (
                          <Tippy
                            content={intl.formatMessage({
                              id: "Fields.ToolTipDownloadAttachment",
                            })}
                          >
                            <button
                              type="button"
                              className="btn btn-icon btn-primary btn-sm me-2"
                              onClick={() => {
                                const link = document.createElement("a");
                                link.href = invoice.downloadInfo.downloadUrl;
                                link.setAttribute(
                                  "download",
                                  invoice.downloadInfo.fileName
                                );
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                              }}
                            >
                              <i className="fa-solid fa-cloud-arrow-down"></i>
                            </button>
                          </Tippy>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <NoItemsPage />
          )}
          {isLoading && <ListLoading />}
        </div>
      </div>

      <ViewCanvas downloadUrl={downloadUrl} keyy={key} />
    </Content>
  );
};

export { BillingTab };
