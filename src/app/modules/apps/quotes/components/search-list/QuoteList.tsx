import React, { useEffect, useState } from "react";
import { QuoteListResult } from "../core/_models";
import { getQuotes } from "../core/_requests";
import { ListLoading } from "../../../components/ListLoading";
import { QuoteListPagination } from "../components/pagination/QuoteListPagination";
import { KTCardBody, KTSVG } from "../../../../../../_metronic/helpers";
import { useIntl } from "react-intl";
import { toAbsoluteUrl } from "../../../../../../_metronic/helpers";
import { useAuth } from "../../../../auth";
import Tippy from "@tippyjs/react";
import { useNavigate } from "react-router-dom";
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
  searchCounter: number;
  periodValueType: number | null;
  quoteStatusTypes: any;
  clientIdForFilter: number | null;
  year: number | null;
  setCopyModalOpen: (type: boolean) => void;
  setValidateModalOpen: (type: boolean) => void;
  setEmailModalOpen: (type: boolean) => void;
  setActivateModalOpen: (type: boolean) => void;
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
  periodValueType,
  quoteStatusTypes,
  clientIdForFilter,
  year,
  setCopyModalOpen,
  setValidateModalOpen,
  setEmailModalOpen,
  setActivateModalOpen,
}: ComponentProps) => {
  const [quoteLists, setQuoteList] = useState<any>([]);
  const navigate = useNavigate();
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
      if (response.isValid) {
        setQuoteList(response);

        setPageIndex(response.pageIndex);
        setTotalRows(response.totalRows);
      }
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
    // const currentQuote = JSON.parse(localStorage.getItem("currentQuote")!);
    // console.log(currentQuote);
    // if (!auth.currentUser?.result.isAnonymousUser) {
    localStorage.removeItem("currentQuote");
    localStorage.removeItem("quoteNr");
    // }
  }, []);

  useEffect(() => {
    fetchQuotes();
  }, [
    searchTerm,
    pageIndex,
    periodValueType,
    quoteStatusTypes,
    clientIdForFilter,
    searchCounter,
    refresh,
  ]);

  const openEditModal = (id: number) => {
    setEditModalId(id);
    setAddModalOpen(true);
  };

  const openDeleteModal = (quoteList: any) => {
    setDeleteModalOpen(true);
    valueSetter(quoteList);
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
  const openCopyModal = (quoteList: any) => {
    valueSetter(quoteList);
    setCopyModalOpen(true);
  };
  const openValidateModal = (quoteList: any) => {
    valueSetter(quoteList);
    setValidateModalOpen(true);
  };

  const openEmailModal = (quoteList: any) => {
    valueSetter(quoteList);
    setEmailModalOpen(true);
  };

  const openActivateModal = (quoteList: any) => {
    valueSetter(quoteList);
    setActivateModalOpen(true);
  };
  const valueSetter = (quoteList: any) => {
    setQuoteNumber(quoteList.quoteNr);
    setEditModalId(quoteList.id);
    localStorage.setItem(
      "ModalData",
      JSON.stringify({
        quoteDateAsString: quoteList.quoteDateAsString,
        client: quoteList.client,
        totalPriceWithVat: quoteList.totals.totalPriceWithVAT,
        sign: quoteList.valuta.sign,
        status: quoteList.quoteStatus.value,
        attachmentsCount: quoteList.attachmentsCount,
      })
    );
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
                <Tippy
                  content={
                    <div style={{ fontFamily: "monospace" }}>
                      <div className="table" style={{ width: "100%" }}>
                        {/* Total Price */}
                        {quoteList.totals.totalPrice > 0 && (
                          <div style={{ display: "table-row" }}>
                            <div
                              className="me-2"
                              style={{
                                display: "table-cell",
                                textAlign: "right",
                              }}
                            >
                              {intl.formatMessage({ id: "Fields.TotalPrice" })}:
                            </div>
                            <div
                              style={{
                                display: "table-cell",
                                textAlign: "right",
                              }}
                            >
                              {quoteList.valuta.sign}
                              {quoteList.totals.totalPrice.toFixed(2)}
                            </div>
                          </div>
                        )}
                        {/* Total VAT Amount */}
                        {quoteList.totals.totalVATAmount > 0 && (
                          <div style={{ display: "table-row", gap: 3 }}>
                            <div
                              className="me-2"
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
                              {quoteList.valuta.sign}
                              {quoteList.totals.totalVATAmount.toFixed(2)}
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
                      {quoteList.valuta.sign}
                      {quoteList.totals.totalPriceWithVAT.toFixed(2)}
                      <span className="ribbon-inner bg-gray-600"></span>
                    </div>
                  </div>
                </Tippy>

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
                      onClick={() => {
                        if (quoteList?.isDraft) {
                          openEditModal(quoteList.id);
                        } else {
                          localStorage.setItem(
                            "currentQuote",
                            JSON.stringify(quoteList)
                          );
                          navigate("/estimation/view");
                        }
                      }}
                    >
                      <strong className="text-primary">
                        {quoteList.client}
                      </strong>
                    </div>

                    {/* Current/Total Amount on the Right */}
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
                                  id: "Fields.QuoteDueDate",
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
                      {quoteList.hasAttachments && (
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
                            <i className="far fa-file-pdf text-muted fs-3x" />
                            <div className="d-flex flex-column mx-6">
                              <span className="fs-sm text-muted">
                                {intl.formatMessage({
                                  id: "Fields.Attachments",
                                })}
                              </span>
                              <span className="text-primary fw-bolder">
                                {quoteList.attachmentsCount}
                              </span>
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Buttons Section */}
                    <div className="d-flex align-items-center">
                      {quoteList.actions.canShowPreview && (
                        <Tippy
                          content={intl.formatMessage({
                            id: "Fields.ToolTipView",
                          })}
                        >
                          <button
                            className="btn btn-icon btn-light btn-sm me-4"
                            onClick={() => {
                              localStorage.setItem(
                                "currentQuote",
                                JSON.stringify(quoteList)
                              );
                              navigate("/estimation/view");
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
                      <div className="btn-group drop-left">
                        <button
                          className="btn btn-icon btn-light btn-sm"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          <i className="fa fas fa-list-ul text-muted fs-2"></i>
                        </button>
                        <ul className="dropdown-menu w-content-fit py-4">
                          <li
                            onClick={() => {
                              const link = document.createElement("a");
                              link.href = quoteList.downloadInfo.downloadUrl;
                              link.setAttribute(
                                "download",
                                quoteList.downloadInfo.fileName
                              );
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                            }}
                          >
                            <a className="dropdown-item d-flex align-items-center cursor-pointer">
                              <i className="fa-solid fa-cloud-arrow-down text-primary me-2 fs-3"></i>
                              {intl.formatMessage({
                                id: "Fields.ActionDownload",
                              })}
                            </a>
                          </li>

                          <div className="dropdown-divider border-gray-200"></div>
                          <li
                            onClick={() => {
                              setQuoteNumber(quoteList.quoteNr);
                              setDownloadUrl(
                                quoteList.downloadInfo.downloadUrl
                              );
                              setFileExtension(
                                quoteList.downloadInfo.fileExtension
                              );
                            }}
                            data-bs-toggle="offcanvas"
                            data-bs-target="#offcanvasRight"
                            aria-controls="offcanvasRight"
                          >
                            <a className="dropdown-item d-flex align-items-center cursor-pointer">
                              <KTSVG
                                className="svg-icon svg-icon-1 me-2"
                                path="media/svg/general/file-view-bulk-rounded.svg"
                              />
                              {intl.formatMessage({
                                id: "Fields.ToolTipView",
                              })}
                            </a>
                          </li>
                          {quoteList.actions.canCreateCopy && (
                            <>
                              <div className="dropdown-divider border-gray-200"></div>
                              <li
                                onClick={() => {
                                  openCopyModal(quoteList);
                                }}
                              >
                                <a className="dropdown-item d-flex align-items-center cursor-pointer">
                                  <i className="ki-duotone ki-copy text-primary fs-1 me-2" />
                                  {intl.formatMessage({
                                    id: "Fields.ActionCopy",
                                  })}
                                </a>
                              </li>
                            </>
                          )}
                          {quoteList.actions.canSend && (
                            <>
                              <div className="dropdown-divider border-gray-200"></div>
                              <li
                                onClick={() => {
                                  openEmailModal(quoteList);
                                }}
                              >
                                <a className="dropdown-item d-flex align-items-center text-center cursor-pointer">
                                  <i className="ki-duotone ki-send text-success fs-1 me-2">
                                    <span className="path1"></span>
                                    <span className="path2"></span>
                                  </i>
                                  {intl.formatMessage({
                                    id: "Fields.ActionSendEmail",
                                  })}
                                </a>
                              </li>
                            </>
                          )}
                          {quoteList.actions.canApprove && (
                            <>
                              <div className="dropdown-divider border-gray-200"></div>
                              <li onClick={() => openValidateModal(quoteList)}>
                                <a className="dropdown-item d-flex align-items-center cursor-pointer">
                                  <KTSVG
                                    className="svg-icon svg-icon-2 me-2"
                                    path="media/svg/general/document-validation-bulk-rounded.svg"
                                  />
                                  {intl.formatMessage({
                                    id: "Fields.ActionApproveOrDecline",
                                  })}
                                </a>
                              </li>
                            </>
                          )}

                          {quoteList.actions.canCreateInvoice && (
                            <>
                              <div className="dropdown-divider border-gray-200"></div>
                              <li
                              // onClick={() => {
                              //   const link = document.createElement("a");
                              //   link.href = quoteList.downloadInfo.downloadUrl;
                              //   link.setAttribute(
                              //     "download",
                              //     quoteList.downloadInfo.fileName
                              //   );
                              //   document.body.appendChild(link);
                              //   link.click();
                              //   document.body.removeChild(link);
                              // }}
                              >
                                <a className="dropdown-item d-flex align-items-center cursor-pointer">
                                  <KTSVG
                                    className="svg-icon svg-icon-2 me-2"
                                    path="media/svg/general/invoice-01-bulk-rounded.svg"
                                  />
                                  {intl.formatMessage({
                                    id: "Fields.ActionCreateInvoice",
                                  })}
                                </a>
                              </li>
                            </>
                          )}
                          {quoteList.actions.canFinalize && (
                            <>
                              <div className="dropdown-divider border-gray-200"></div>
                              <li
                                onClick={() => {
                                  openActivateModal(quoteList);
                                }}
                              >
                                <a className="dropdown-item d-flex align-items-center cursor-pointer">
                                  <i className="fa fas fa-flag-checkered text-success fs-1 me-2" />
                                  {intl.formatMessage({
                                    id: "Fields.ActionActivate",
                                  })}
                                </a>
                              </li>
                            </>
                          )}
                          {quoteList.actions.canDelete && (
                            <>
                              <div className="dropdown-divider border-gray-200"></div>
                              <li
                                onClick={() => {
                                  openDeleteModal(quoteList);
                                }}
                              >
                                <a className="dropdown-item  d-flex align-items-center cursor-pointer">
                                  <i className="ki-solid ki-trash text-danger fs-1 me-2"></i>
                                  {intl.formatMessage({
                                    id: "Fields.ActionDelete",
                                  })}
                                </a>
                              </li>
                            </>
                          )}
                        </ul>
                      </div>

                      {/* {quoteList.actions.canDelete && (
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
                      )} */}
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
        <QuoteListPagination
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
