import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { QuoteListResult } from "../core/_models";
import { getEstimationActivitiesById, getQuotes } from "../core/_requests";
import ListCard from "../../../generic/ListElements/ListCard";
import { ListLoading } from "../../../generic/ListLoading";
import { KTCardBody, KTSVG } from "../../../../../_metronic/helpers";
import { useIntl } from "react-intl";
import Tippy from "@tippyjs/react";
import { useNavigate } from "react-router-dom";
import { ListPagination } from "../../../generic/ListPagination";
import { getDateRange, parseDate } from "../../../../utils/dateUtils";
import { getStatusClass } from "../../../../utils/statusUtils";
import { getEnumOptions } from "../../../../helpers/intlHelper";
import enums from "../../../../../_metronic/i18n/messages/invoicehippo.enums.json";
import { QUOTE_DETAILS } from "../../utils/quoteDetails";
import DetailsCard from "../../../generic/ListElements/DetailsCard";
import {
  ActivitiesModel,
  AttachmentsResult,
} from "../../../accounting/bookings/components/core/_models";
import { NoItemsPage } from "../../../generic/NoItemsPage";
import { ExpandedRows } from "../../../generic/ExpandedRows";
interface ComponentProps {
  searchTerm: string;
  setTotalRows: (type: number) => void;
  setAddModalOpen: (type: boolean) => void;
  setEditModalId: (type: number) => void;
  setQuoteNumber: (type: string) => void;
  setDeleteModalOpen: (type: boolean) => void;
  setDownloadUrl: (type: string) => void;
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
  setAttachmentsModalOpen: (type: boolean) => void;
  setOrderConfirmationModalOpen: (type: boolean) => void;
  attachments: Record<number, AttachmentsResult[]>;
  fetchAttachments: (type: number) => void;
  setKey: Dispatch<SetStateAction<number>>;
  isModal?: boolean;
  setQuoteId?: (type: number) => void;
}
const QuoteList = ({
  searchTerm,
  setTotalRows,
  setAddModalOpen,
  setEditModalId,
  setQuoteNumber,
  setDeleteModalOpen,
  setDownloadUrl,
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
  setAttachmentsModalOpen,
  attachments,
  fetchAttachments,
  setKey,
  isModal,
  setOrderConfirmationModalOpen,
  setQuoteId,
}: ComponentProps) => {
  const [quoteLists, setQuoteList] = useState<any>([]);
  const navigate = useNavigate();
  const intl = useIntl();
  const [isListLoading, setIsListLoading] = useState<boolean>(false);
  const [loadingRows, setLoadingRows] = useState<Record<number, boolean>>({});

  const fetchQuotes = async () => {
    setIsListLoading(true);

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
        setTotalRows(response.totalRows);
      }
    } catch (error) {
      console.error("Error fetching Quote List:", error);
    } finally {
      setIsListLoading(false);
    }
  };
  const handlePageChange = (page: number) => {
    setPageIndex(page);
  };

  useEffect(() => {
    // const currentQuote = JSON.parse(localStorage.getItem("currentQuote")!);

    // if (!auth.currentUser?.result.isAnonymousUser) {
    localStorage.removeItem("currentItem");
    localStorage.removeItem("currentNr");
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
  const openAttachmentsModal = (id: number) => {
    setEditModalId(id);
    setAttachmentsModalOpen(true);
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

  const openOrderConfirmationModal = (invoiceList: any) => {
    valueSetter(invoiceList);
    setOrderConfirmationModalOpen(true);
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

  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState<{ [key: number]: string }>({});

  const handleTabChange = (id: number, tab: string) => {
    setActiveTab((prev) => ({
      ...prev,
      [id]: tab,
    }));
  };

  const [activities, setActivities] = useState<Record<number, ActivitiesModel>>(
    {}
  );

  const fetchActionHistory = async (id: number) => {
    const response = await getEstimationActivitiesById(id);
    if (response.isValid && response.result.length > 0) {
      setActivities((prev) => ({
        ...prev,
        [id]: response,
      }));
      setLoadingRows((prev) => ({ ...prev, [id]: false }));
    }
  };

  const toggleRow = (id: number, isDraft: boolean) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
    const record = quoteLists.result.find(
      (item: QuoteListResult) => item.id === id
    );
    let defaultTab;
    if (record.hasAttachments) {
      defaultTab = "attachments";
    } else defaultTab = "actionHistory";

    // Set default active tab for the expanded row
    setActiveTab((prev) => ({
      ...prev,
      [id]: prev[id] || defaultTab,
    }));
  };

  return (
    <KTCardBody className="py-4">
      <div className="row row-cols-1 row-cols-md-1 g-4">
        {
          // !isListLoading &&
          quoteLists?.result?.map((quoteList: QuoteListResult) => (
            <ListCard key={quoteList.id}>
              {/* Ribbons */}
              <Tippy
                content={
                  <div style={{ fontFamily: "monospace" }}>
                    <div className="table" style={{ width: "100%" }}>
                      {/* Total Price */}
                      {quoteList.totals.totalPrice > 0 && (
                        <div style={{ display: "table-row" }}>
                          <div
                            className="px-2"
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
                        <div style={{ display: "table-row" }}>
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
                className="ribbon ribbon-start ribbon-clip position-absolute cursor-pointer"
                style={{
                  top: "10px",
                  height: "30px",
                  minWidth: "250px",
                }}
                onClick={(e) => {
                  if (quoteList.isDraft) {
                    e.preventDefault(); // Prevent navigation for drafts
                    openEditModal(quoteList.id);
                  } else {
                    localStorage.setItem(
                      "currentItem",
                      JSON.stringify(quoteList)
                    );
                    navigate(`/estimation/view/${quoteList.uniqueId}`);
                  }
                }}
                onContextMenu={(e) => {
                  if (quoteList.isDraft) {
                    e.preventDefault(); // Prevent navigation for drafts
                    openEditModal(quoteList.id);
                  } else {
                    localStorage.setItem(
                      "currentItem",
                      JSON.stringify(quoteList)
                    );
                    navigate(`/estimation/view/${quoteList.uniqueId}`);
                  }
                }}
              >
                <div
                  className={`ribbon-label fw-bold ${getStatusClass(
                    quoteList.quoteStatus.value
                  )} `}
                >
                  {
                    getEnumOptions(enums.QuoteStatusTypes, intl).find(
                      (item) => item.value === quoteList.quoteStatus.value
                    )?.label
                  }

                  <span
                    className={`ribbon-inner ${getStatusClass(
                      quoteList.quoteStatus.value
                    )} `}
                  ></span>
                </div>
              </div>
              <div className="card-body pb-4">
                {/* First Row: Client Name (Left) and Amount (Right) */}
                <div className="d-flex justify-content-between align-items-center ">
                  {/* Client Name on the Left */}
                  <a
                    className="d-flex flex-column cursor-pointer"
                    href={
                      quoteList.isDraft
                        ? undefined
                        : `/estimation/view/${quoteList.uniqueId}`
                    }
                    target={quoteList.isDraft ? undefined : "_self"}
                    onClick={(e) => {
                      if (quoteList.isDraft) {
                        e.preventDefault(); // Prevent navigation for drafts
                        openEditModal(quoteList.id);
                      } else {
                        localStorage.setItem(
                          "currentItem",
                          JSON.stringify(quoteList)
                        );
                      }
                    }}
                    onContextMenu={(e) => {
                      if (quoteList.isDraft) {
                        e.preventDefault(); // Prevent navigation for drafts
                        openEditModal(quoteList.id);
                      } else {
                        localStorage.setItem(
                          "currentItem",
                          JSON.stringify(quoteList)
                        );
                      }
                    }}
                  >
                    <strong className="text-primary">
                      {quoteList.quoteNr}
                    </strong>
                  </a>

                  {/* Current/Total Amount on the Right */}
                </div>

                <div className="d-flex align-items-center justify-content-between gap-2">
                  <small className="rounded p-1 text-white bg-gray-500 px-2 fw-bold fs-9">
                    {quoteList.client}
                  </small>

                  {quoteList.clientReferenceNr && (
                    <small className="text-muted">
                      {quoteList.clientReferenceNr}
                    </small>
                  )}
                </div>

                {/* separator Line */}
                <div className="separator separator-solid mb-3 mt-2"></div>

                <div className="d-flex flex-row flex-wrap fs-8 gap-4 align-items-center justify-content-between position-relative">
                  <div className="position-absolute" style={{ left: "-28px" }}>
                    <button
                      className="btn btn-icon btn-sm"
                      onClick={() => {
                        if (!expandedRows.includes(quoteList.id)) {
                          // Only fetch data if it's being expanded
                          setLoadingRows((prev) => ({
                            ...prev,
                            [quoteList.id]: true,
                          }));
                          toggleRow(quoteList.id, quoteList.isDraft);
                          fetchActionHistory(quoteList.id);
                          fetchAttachments(quoteList.id);
                        } else {
                          toggleRow(quoteList.id, quoteList.isDraft);
                        }
                      }}
                    >
                      {expandedRows.includes(quoteList.id) ? (
                        <i className="ki-duotone ki-double-up fs-3 text-primary">
                          <span className="path1"></span>
                          <span className="path2"></span>
                          <span className="path3"></span>
                        </i>
                      ) : (
                        <i className="ki-duotone ki-double-down fs-3">
                          <span className="path1"></span>
                          <span className="path2"></span>
                          <span className="path3"></span>
                        </i>
                      )}
                    </button>
                  </div>

                  <DetailsCard
                    details={QUOTE_DETAILS(quoteList, intl)}
                    intl={intl}
                  />

                  {/* Buttons Section */}
                  <div className="d-flex align-items-center">
                    {/* <button
                      className="btn btn-icon btn-light btn-sm me-4"
                      onClick={() => {
                        if (!expandedRows.includes(quoteList.id)) {
                          // Only fetch data if it's being expanded
                          setLoadingRows((prev) => ({
                            ...prev,
                            [quoteList.id]: true,
                          }));
                          toggleRow(quoteList.id, quoteList.isDraft);
                          fetchActionHistory(quoteList.id);
                          fetchAttachments(quoteList.id);
                        } else {
                          toggleRow(quoteList.id, quoteList.isDraft);
                        }
                      }}
                    >
                      {expandedRows.includes(quoteList.id) ? (
                        <i className="ki-duotone ki-double-up fs-1">
                          <span className="path1"></span>
                          <span className="path2"></span>
                          <span className="path3"></span>
                        </i>
                      ) : (
                        <i className="ki-duotone ki-double-down fs-1">
                          <span className="path1"></span>
                          <span className="path2"></span>
                          <span className="path3"></span>
                        </i>
                      )}
                    </button> */}
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
                              "currentItem",
                              JSON.stringify(quoteList)
                            );
                            navigate(`/estimation/view/${quoteList.uniqueId}`);
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
                            setQuoteId && setQuoteId(quoteList.id);
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
                            setDownloadUrl(quoteList.downloadInfo.downloadUrl);
                            setKey((prev) => prev + 1);
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
                        {/* {quoteList.actions.canConvertToOrderConfirmation && (
                          <>
                            <div className="dropdown-divider border-gray-200"></div>
                            <li
                              onClick={() =>
                                openOrderConfirmationModal(quoteList)
                              }
                            >
                              <a className="dropdown-item d-flex align-items-center cursor-pointer">
                                <i className="ki-duotone ki-basket-ok me-2 fs-1 text-primary">
                                  <span className="path1"></span>
                                  <span className="path2"></span>
                                  <span className="path3"></span>
                                  <span className="path4"></span>
                                </i>
                                {intl.formatMessage({
                                  id: "Fields.ActionConvertToOrderConfirmation",
                                })}
                              </a>
                            </li>
                          </>
                        )} */}
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
                        {quoteList?.actions.canAddAttachments && (
                          <>
                            <div className="dropdown-divider border-gray-200"></div>
                            <li
                              onClick={() => {
                                openAttachmentsModal(quoteList.id);
                              }}
                            >
                              <a className="dropdown-item d-flex align-items-center cursor-pointer">
                                <i className="fa-solid fa-cloud-arrow-up text-primary me-2 fs-3"></i>
                                {intl.formatMessage({
                                  id: "Fields.ActionUploadFiles",
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
                  </div>
                </div>
                {expandedRows.includes(quoteList.id) && (
                  <ExpandedRows
                    attachments={attachments}
                    activities={activities}
                    mutations={[]}
                    activeTab={activeTab}
                    handleTabChange={handleTabChange}
                    setDownloadUrl={setDownloadUrl}
                    setKey={setKey}
                    id={quoteList.id}
                    loadingRows={loadingRows}
                  />
                )}
              </div>
            </ListCard>
          ))
        }

        {quoteLists?.result?.length == 0 && <NoItemsPage />}
        {isListLoading && <ListLoading />}
      </div>

      {quoteLists?.result?.length > 0 && (
        <ListPagination
          totalPages={quoteLists.totalPages}
          pageIndex={pageIndex}
          moduleName="quotes-module"
          onPageChange={handlePageChange}
          totalItems={quoteLists.totalRows}
        />
      )}
    </KTCardBody>
  );
};

export { QuoteList };
