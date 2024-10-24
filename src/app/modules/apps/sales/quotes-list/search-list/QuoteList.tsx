import React, { useEffect, useState } from "react";
import { QuoteListResult } from "../core/_models";
import { getQuotes } from "../core/_requests";
import { ListLoading } from "../../../components/ListLoading";
import { FinancialListPagination } from "../components/pagination/FinancialListPagination";
import { KTCardBody } from "../../../../../../_metronic/helpers";
import { useIntl } from "react-intl";
import { toAbsoluteUrl } from "../../../../../../_metronic/helpers";
import { KTSVG } from "../../../../../../_metronic/helpers";
import { Tooltip } from "@chakra-ui/react";
import { useAuth } from "../../../../auth";
import enums from "../../../../../../invoicehippo.enums.json";
import Tippy from "@tippyjs/react";
interface ComponentProps {
  searchTerm: string;
  setTotalRows: (type: number) => void;
  setAddModalOpen: (type: boolean) => void;
  setEditModalId: (type: number) => void;
  setQuoteNumber: (type: string) => void;
  setDeleteModalOpen: (type: boolean) => void;
  setDownloadUrl: (type: string) => void;
  setFileExtension: (type: any) => void;
  refresh: boolean;
  setPageIndex: (type: number) => void;
  pageIndex: number;
  deleteModalOpen: boolean;
  addModalOpen: boolean;
  searchCounter: number;
  periodValueType: number | null;
  quoteStatusTypes: any;
  clientIdForFilter: number | null;
  year: number | null;
}
const QuoteList = ({
  searchTerm,
  setTotalRows,
  setAddModalOpen,
  setEditModalId,
  setQuoteNumber,
  setDeleteModalOpen,
  setDownloadUrl,
  setFileExtension,
  searchCounter,
  refresh,
  setPageIndex,
  pageIndex,
  deleteModalOpen,
  addModalOpen,
  periodValueType,
  quoteStatusTypes,
  clientIdForFilter,
  year,
}: ComponentProps) => {
  const [quoteLists, setQuoteList] = useState<any>([]);

  const intl = useIntl();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const auth = useAuth();

  const getDateRange = (period: any, tempYear: any) => {
    const periodValue = typeof period === "number" ? period : period?.Value;
    if (periodValue >= 1 && periodValue <= 12) {
      const startDate = new Date(tempYear, periodValue - 1, 1); // First day of the month
      const endDate = new Date(tempYear, periodValue, 0); // Last day of the month

      const formatDate = (date: Date) => {
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
        const year = date.getFullYear();
        return `${day}-${month}-${year}`; // Format with "-"
      };

      return `${formatDate(startDate)} - ${formatDate(endDate)}`;
    }

    switch (periodValue) {
      case 101:
        return `01-01-${tempYear} - 31-03-${tempYear}`;
      case 102:
        return `01-04-${tempYear} - 30-06-${tempYear}`;
      case 103:
        return `01-07-${tempYear} - 30-09-${tempYear}`;
      case 104:
        return `01-10-${tempYear} - 31-12-${tempYear}`;
      case 201:
        return `01-01-${tempYear} - 30-06-${tempYear}`;
      case 202:
        return `01-07-${tempYear} - 31-12-${tempYear}`;
      case 13:
        return `01-01-${tempYear} - 31-12-${tempYear}`;
      default:
        return "";
    }
  };
  function parseDate(dateString: any) {
    const [day, month, year] = dateString.split("-");
    return new Date(Date.UTC(year, month - 1, day)); // Use UTC to avoid timezone shifts
  }
  const fetchQuotes = async () => {
    setIsLoading(true);

    let dateRange;
    if (periodValueType) {
      const range = getDateRange(periodValueType, year);
      // if (!range) return null;

      const [startDate, endDate] = range.split(" - ");

      const start = parseDate(startDate).toISOString();
      const end = parseDate(endDate).toISOString();

      dateRange = {
        startDate: start,
        endDate: end,
      };
    }

    try {
      const response = await getQuotes(
        searchTerm,
        pageIndex,
        dateRange,
        quoteStatusTypes,
        clientIdForFilter
      );
      setQuoteList(response);

      setPageIndex(response.pageIndex);
      setTotalRows(response.totalRows);
    } catch (error) {
      console.error("Error fetching Quote List:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const handlePageChange = (page: number) => {
    setPageIndex(page);
    fetchQuotes();
  };

  useEffect(() => {
    fetchQuotes();
  }, [
    searchTerm,
    pageIndex,
    periodValueType,
    quoteStatusTypes,
    clientIdForFilter,
    searchCounter,
  ]);

  useEffect(() => {
    fetchQuotes();
  }, [refresh]);

  const openEditModal = (id: number) => {
    setEditModalId(id);
    setAddModalOpen(true);
  };

  const openDeleteModal = (id: number, quoteNr: string) => {
    setEditModalId(id);
    setDeleteModalOpen(true);
    setQuoteNumber(quoteNr);
  };
  // Assuming enums.QuoteStatusTypes is available and properly imported

  const getStatusClass = (quoteStatusValue: number) => {
    switch (quoteStatusValue) {
      case 1: // Concept
        return "bg-secondary text-dark";
      case 2: // Wachten op goedkeuring (Waiting for approval)
        return "bg-info";
      case 4: // Geaccepteerd door de klant (Accepted by the client)
        return "bg-success";
      case 8: // Afgekeurd door de klant (Rejected by the client)
        return "bg-danger";
      case 16: // Verlopen-/1e Herinnering (Overdue/1st reminder)
        return "bg-warning";
      case 32: // Verlopen-/2e Herinnering (Overdue/2nd reminder)
      case 64: // Verlopen-/Laatste Herinnering (Overdue/Last reminder)
        return "bg-danger";
      case 128: // Geannuleerd (Cancelled)
        return "bg-dark";
      case 256: // Gepauzeerd (Paused)
        return "bg-warning";
      case 512: // Planning
        return "bg-primary";
      case 1024: // Realisatie (Realization)
        return "bg-info";
      case 2048: // Afgerond (Completed)
        return "bg-success";
      default:
        return "bg-default"; // Default case
    }
  };

  return (
    <KTCardBody className="py-4">
      <div className="row row-cols-1 row-cols-md-1 g-4">
        {
          // !isLoading &&
          quoteLists?.result?.map((quoteList: QuoteListResult) => (
            <div className="col" key={quoteList.id}>
              <div className="card h-100 pt-6 position-relative">
                {/* Ribbons */}

                <div
                  className="ribbon ribbon-end ribbon-clip position-absolute"
                  style={{
                    top: "10px",
                    right: "0px",
                    height: "30px",
                    width: "100px",
                  }}
                >
                  <div className="ribbon-label  fw-bold">
                    {quoteList.valuta.sign}{" "}
                    {quoteList.totals.totalPriceWithVAT.toFixed(2)}
                    <span className="ribbon-inner bg-gray-600"></span>
                  </div>
                </div>

                {/*center ribbon */}
                {/* <div
                  className="ribbon ribbon-top ribbon-vertical position-absolute"
                  style={{
                    top: "3px",
                    width: "100px",
                    left: "50%",
                    transform: "translateX(-50%)",
                  }}
                >
                  <div
                    className="ribbon-label fw-bold"
                    style={{
                      whiteSpace: "nowrap", // Prevents text wrapping
                      overflow: "hidden", // Clips overflowing content
                      textOverflow: "ellipsis",
                      backgroundColor: "#1BC5BD",
                      minHeight: "16px", // Adds ellipsis if the text is too long
                    }}
                  >
                    {quoteList.quoteStatus.description}
                    <span
                      className={`ribbon-inner ${getStatusClass(
                        quoteList.quoteStatus.value
                      )}`}
                    ></span>
                  </div>
                </div> */}

                <div
                  className="ribbon ribbon-start ribbon-clip position-absolute"
                  style={{
                    top: "10px",
                    height: "30px",
                    minWidth: "200px",
                  }}
                >
                  <div className="ribbon-label fw-bold">
                    {quoteList.quoteNr}
                    <span className="ribbon-inner bg-gray-600"></span>
                  </div>
                </div>
                <div className="card-body ">
                  {/* First Row: Client Name (Left) and Amount (Right) */}
                  <div className="d-flex justify-content-between align-items-center ">
                    {/* Client Name on the Left */}
                    <div
                      className="d-flex flex-column cursor-pointer"
                      onClick={() => openEditModal(quoteList.id)}
                    >
                      <strong className="text-primary">
                        {quoteList.client}
                      </strong>
                    </div>

                    {/* Current/Total Amount on the Right */}

                    <div className="d-flex flex-column text-end fs-9">
                      {/* Total Price */}
                      {quoteList.totals.totalPrice > 0 && (
                        <div className="d-flex gap-3 justify-content-end fs-sm">
                          <small className="text-muted">
                            {intl.formatMessage({ id: "Fields.TotalPrice" })}
                          </small>
                          <span className="text-muted ">
                            {quoteList.valuta.sign}{" "}
                            {quoteList.totals.totalPrice.toFixed(2)}
                          </span>
                        </div>
                      )}
                      {/* Total VAT Amount */}
                      {quoteList.totals.totalVATAmount > 0 && (
                        <div className="d-flex gap-3 justify-content-end fs-sm">
                          <small className="text-muted">
                            {intl.formatMessage({
                              id: "Fields.TotalVATAmount",
                            })}
                          </small>
                          <span className="text-muted">
                            {quoteList.valuta.sign}{" "}
                            {quoteList.totals.totalVATAmount.toFixed(2)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <ul className="breadcrumb breadcrumb-secondary breadcrumb-dot mb-3 text-muted">
                    <li className="breadcrumb-item">
                      {quoteList.quoteStatus.name && (
                        <small
                          className={`${getStatusClass(
                            quoteList.quoteStatus.value
                          )} rounded p-1 text-white fw-bold px-3`}
                        >
                          {quoteList.quoteStatus.description}
                        </small>
                      )}
                    </li>
                    {quoteList.clientReferenceNr && (
                      <li className="breadcrumb-item">
                        <small>{quoteList.clientReferenceNr}</small>
                      </li>
                    )}

                    {/* {quoteList.clientReferenceNr && (
                          <li className="breadcrumb-item">
                            <small>{quoteList.clientReferenceNr}</small>
                          </li>
                        )} */}
                  </ul>

                  {/* separator Line */}
                  <div className="separator separator-solid mb-6"></div>

                  <div className="d-flex flex-row flex-wrap fs-8 gap-4 mt-5 align-items-center justify-content-between">
                    <div className="d-flex align-items-center flex-wrap">
                      {quoteList.quoteDate && (
                        <div className="d-flex align-items-center flex-wrap">
                          <i className="ki-duotone ki-calendar fs-3x text-primary">
                            <span className="path1"></span>
                            <span className="path2"></span>
                          </i>
                          <div className="d-flex flex-column mx-6">
                            <span className="fs-sm text-muted">
                              {intl.formatMessage({
                                id: "Fields.QuoteDate",
                              })}
                            </span>
                            <span className="text-primary fw-bolder">
                              {quoteList.quoteDateAsString}
                            </span>
                          </div>
                        </div>
                      )}
                      {quoteList.quoteDueDate && (
                        <>
                          <span
                            style={{
                              backgroundColor: "#d3d3d3",
                              height: "37px",
                              width: "1px",
                            }}
                            className="me-5"
                          ></span>

                          <div className="d-flex align-items-center flex-wrap">
                            <i className="ki-duotone ki-calendar fs-3x text-danger">
                              <span className="path1"></span>
                              <span className="path2"></span>
                            </i>
                            <div className="d-flex flex-column mx-6">
                              <span className="fs-sm text-muted">
                                {intl.formatMessage({
                                  id: "Fields.InvoiceDueDate",
                                })}
                              </span>
                              <span className="text-primary fw-bolder">
                                {quoteList.quoteDueDateAsString}
                              </span>
                            </div>
                          </div>
                        </>
                      )}
                      {quoteList.companyTradeName && (
                        <>
                          <span
                            style={{
                              backgroundColor: "#d3d3d3",
                              height: "37px",
                              width: "1px",
                            }}
                            className="me-5"
                          ></span>

                          <div className="d-flex align-items-center flex-wrap">
                            <i className="ki-duotone ki-document fs-3x text-warning">
                              <span className="path1"></span>
                              <span className="path2"></span>
                            </i>
                            <div className="d-flex flex-column mx-6">
                              <span className="fs-sm text-muted">
                                {intl.formatMessage({
                                  id: "Fields.CompanyTradeNameId",
                                })}
                              </span>
                              <span className="text-warning fw-bolder">
                                {quoteList.companyTradeName}
                              </span>
                            </div>
                          </div>
                        </>
                      )}
                      {quoteList.hasRelatedInvoice && (
                        <>
                          <span
                            style={{
                              backgroundColor: "#d3d3d3",
                              height: "37px",
                              width: "1px",
                            }}
                            className="me-5"
                          ></span>

                          <div className="d-flex align-items-center flex-wrap">
                            <i className="ki-duotone ki-document fs-3x text-dark">
                              <span className="path1"></span>
                              <span className="path2"></span>
                            </i>
                            <div className="d-flex flex-column mx-6">
                              <span className="fs-sm text-muted">
                                {intl.formatMessage({
                                  id: "Fields.InvoiceNr",
                                })}
                              </span>
                              <span className="text-primary fw-bolder">
                                {quoteList.relatedInvoice.invoiceNr}
                              </span>
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Buttons Section */}
                    <div className="d-flex align-items-center">
                      {quoteList.actions.canShowPreview && (
                        <Tippy content="view">
                          <button
                            className="btn btn-icon btn-light btn-sm me-4"
                            data-bs-toggle="offcanvas"
                            data-bs-target="#offcanvasRight"
                            aria-controls="offcanvasRight"
                            onClick={() => {
                              setQuoteNumber(quoteList.quoteNr);
                              setDownloadUrl(
                                quoteList.downloadInfo.downloadUrl
                              );
                              setFileExtension(
                                quoteList.downloadInfo.fileExtension
                              );
                            }}
                          >
                            <i className="ki-duotone ki-eye fs-2">
                              <span className="path1"></span>
                              <span className="path2"></span>
                              <span className="path3"></span>
                            </i>
                          </button>
                        </Tippy>
                      )}

                      {quoteList.actions.canEdit && (
                        <Tippy
                          content={intl.formatMessage({
                            id: "Fields.ToolTipEdit",
                          })}
                        >
                          <button
                            className="btn btn-icon btn-light btn-sm me-4"
                            onClick={() => {
                              openEditModal(quoteList.id);
                            }}
                          >
                            <i className="ki-solid ki-pencil text-warning fs-2"></i>
                          </button>
                        </Tippy>
                      )}
                      <div className="btn-group">
                        <button className="btn btn-icon btn-light btn-sm dropdown-toggle custom-dropdown">
                          <i className="fa fas fa-list-ul"></i>
                        </button>
                      </div>

                      <div className="btn-group dropleft mr-2">
                        <button
                          className="btn btn-icon btn-light dropdown-toggle"
                          type="button"
                          data-toggle="dropdown"
                          aria-haspopup="true"
                          aria-expanded="false"
                        >
                          <i className="fa fas fa-list-ul"></i>
                        </button>
                        <div className="dropdown-menu">
                          <a
                            className="dropdown-item hippo-pointer"
                            data-toggle="modal"
                            data-target=""
                          >
                            <span>
                              <i className="fa fas fa-pencil-alt"></i>
                            </span>
                            <span>&nbsp;&nbsp;wijzigen</span>
                          </a>
                          <div className="dropdown-divider"></div>
                          <a
                            className="dropdown-item hippo-pointer"
                            data-toggle="modal"
                            data-target="#createCopyModal"
                          >
                            <span>
                              <i className="fa far fa-copy"></i>
                            </span>
                            <span>&nbsp;&nbsp;kopieren</span>
                          </a>
                          <div className="dropdown-divider"></div>
                          <a
                            className="dropdown-item hippo-pointer"
                            data-toggle="modal"
                            data-target="#sendModal"
                          >
                            <span>
                              <i className="fa fas fa-paper-plane"></i>
                            </span>
                            <span>&nbsp;&nbsp;verstuur e-mail</span>
                          </a>
                          <div className="dropdown-divider"></div>
                          <a
                            className="dropdown-item hippo-pointer"
                            data-toggle="modal"
                            data-target=""
                          >
                            <span>
                              <i className="fa fas fa-cloud-download-alt"></i>
                            </span>
                            <span>&nbsp;&nbsp;downloaden</span>
                          </a>
                          <div className="dropdown-divider"></div>
                          <a
                            className="dropdown-item hippo-pointer"
                            data-toggle="modal"
                            data-target="#quoteValidationModal"
                          >
                            <span>
                              <i className="fa far fa-credit-card"></i>
                            </span>
                            <span>&nbsp;&nbsp;goedkeuren-/afkeuren</span>
                          </a>
                          <div className="dropdown-divider"></div>
                          <a
                            className="dropdown-item hippo-pointer"
                            data-toggle="modal"
                            data-target="#deleteModal"
                          >
                            <span>
                              <i className="fa far fa-trash-alt"></i>
                            </span>
                            <span>&nbsp;&nbsp;verwijderen</span>
                          </a>
                        </div>
                      </div>

                      {quoteList.actions.canDelete && (
                        <Tippy
                          content={intl.formatMessage({
                            id: "Fields.ToolTipDelete",
                          })}
                        >
                          <button
                            className="btn btn-icon btn-light btn-sm"
                            onClick={() => {
                              openDeleteModal(quoteList.id, quoteList.quoteNr);
                              localStorage.setItem(
                                "DeleteData",
                                JSON.stringify({
                                  quoteDateAsString:
                                    quoteList.quoteDateAsString,
                                  client: quoteList.client,
                                  totalPriceWithVat:
                                    quoteList.totals.totalPriceWithVAT,
                                  sign: quoteList.valuta.sign,
                                })
                              );
                            }}
                          >
                            <i className="ki-solid ki-trash text-danger fs-2"></i>
                          </button>
                        </Tippy>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        }

        {quoteLists?.result?.length == 0 && (
          <div className="text-center">
            <img
              alt=""
              src={toAbsoluteUrl("media/logos/searchnotfound.png")}
              className="h-350px w-450px"
            />
            <h3>
              {intl.formatMessage({
                id: "Fields.SearchNoItemsAvailableDefault",
              })}
            </h3>
          </div>
        )}
        {isLoading && <ListLoading />}
      </div>

      {quoteLists?.result?.length > 0 && (
        <FinancialListPagination
          totalPages={quoteLists.totalPages}
          pageIndex={pageIndex}
          setPageIndex={setPageIndex}
          onPageChange={handlePageChange}
          totalItems={quoteLists.totalRows}
        />
      )}
    </KTCardBody>
  );
};

export { QuoteList };
