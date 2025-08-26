import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { InvoiceListResult } from "../core/_models";
import {
  getInvoiceActivitiesById,
  getInvoiceMutationsById,
  getInvoices,
} from "../core/_requests";
import { ListLoading } from "../../../generic/ListLoading";
import { KTCardBody } from "../../../../../_metronic/helpers";
import { useIntl } from "react-intl";
import Tippy from "@tippyjs/react";
import { useNavigate } from "react-router-dom";
import { ListPagination } from "../../../generic/ListPagination";
import { getDateRange, parseDate } from "../../../../utils/dateUtils";
import { getStatusClass } from "../../../../utils/statusUtils";
import DetailsCard from "../../../generic/ListElements/DetailsCard";
import { INVOICE_DETAILS } from "../../utils/invoiceDetails";
import ListCard from "../../../generic/ListElements/ListCard";
import { NoItemsPage } from "../../../generic/NoItemsPage";
import { getEnumOptions } from "../../../../helpers/intlHelper";
import enums from "../../../../../_metronic/i18n/messages/invoicehippo.enums.json";
import {
  ActivitiesModel,
  AttachmentsResult,
  MutationsModel,
} from "../../../accounting/bookings/components/core/_models";
import { ExpandedRows } from "../../../generic/ExpandedRows";

interface ComponentProps {
  searchTerm: string;
  setTotalRows: (type: number) => void;
  setAddModalOpen: (type: boolean) => void;
  setEditModalId: (type: number) => void;
  setInvoiceNr: (type: string) => void;
  setDeleteModalOpen: (type: boolean) => void;
  setDownloadUrl: (type: string) => void;
  refresh: boolean;
  isModal?: boolean;
  setPageIndex: (type: number) => void;
  pageIndex: number;
  searchCounter: number;
  periodValueType: number | null;
  statusTypes: any;
  onlyCreditInvoices: boolean | null;
  clientIdForFilter: number | null;
  year: number | null;
  setCopyModalOpen: (type: boolean) => void;
  setEmailModalOpen: (type: boolean) => void;
  setActivateModalOpen: (type: boolean) => void;
  setAttachmentsModalOpen: (type: boolean) => void;
  setPaymentModalOpen: (type: boolean) => void;
  setCreditModalOpen: (type: boolean) => void;
  setOrderConfirmationModalOpen: (type: boolean) => void;
  setAlterEmail: (type: boolean) => void;
  setInvoiceId?: (type: number) => void;
  attachments: Record<number, AttachmentsResult[]>;
  fetchAttachments: (type: number) => void;
  setKey: Dispatch<SetStateAction<number>>;
  invoiceLists: any;
  setInvoiceList: any;
}
export const getRibbonStyle = (totalPrice: number) => {
  if (totalPrice > 99) return "75px";
  if (totalPrice < -99) return "82px";
  return "60px";
};
const InvoiceList = ({
  searchTerm,
  setTotalRows,
  setAddModalOpen,
  setEditModalId,
  setInvoiceNr,
  setDeleteModalOpen,
  setDownloadUrl,
  searchCounter,
  refresh,
  onlyCreditInvoices,
  setPageIndex,
  pageIndex,
  periodValueType,
  statusTypes,
  clientIdForFilter,
  year,
  setCopyModalOpen,
  setEmailModalOpen,
  setActivateModalOpen,
  setCreditModalOpen,
  setAlterEmail,
  setAttachmentsModalOpen,
  setOrderConfirmationModalOpen,
  isModal,
  setInvoiceId,
  attachments,
  setPaymentModalOpen,
  fetchAttachments,
  setKey,
  invoiceLists,
  setInvoiceList,
}: ComponentProps) => {
  const navigate = useNavigate();
  const intl = useIntl();
  const [isListLoading, setIsListLoading] = useState<boolean>(false);
  const [loadingRows, setLoadingRows] = useState<Record<number, boolean>>({});

  const fetchInvoices = async () => {
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
      const response = await getInvoices(
        searchTerm,
        pageIndex,
        dateRange,
        statusTypes,
        onlyCreditInvoices,
        clientIdForFilter
      );
      if (response.isValid) {
        setInvoiceList(response);
        setTotalRows(response.totalRows);
        setIsListLoading(false);
      }
    } catch (error) {
      console.error("Error fetching Invoice List:", error);
    } finally {
      setIsListLoading(false);
    }
  };
  const handlePageChange = (page: number) => {
    setPageIndex(page);
  };

  useEffect(() => {
    localStorage.removeItem("currentItem");
    localStorage.removeItem("currentNr");
  }, []);

  useEffect(() => {
    fetchInvoices();
  }, [
    searchTerm,
    pageIndex,
    periodValueType,
    statusTypes,
    onlyCreditInvoices,
    clientIdForFilter,
    searchCounter,
    refresh,
  ]);

  const openEditModal = (id: number) => {
    setEditModalId(id);
    setAddModalOpen(true);
  };

  const openAttachmentsModal = (id: number) => {
    setEditModalId(id);
    setAttachmentsModalOpen(true);
  };
  const openDeleteModal = (invoiceList: any) => {
    setDeleteModalOpen(true);
    valueSetter(invoiceList);
  };

  const openPaymentModal = (invoiceList: any) => {
    valueSetter(invoiceList);
    setPaymentModalOpen(true);
  };
  const openCopyModal = (invoiceList: any) => {
    valueSetter(invoiceList);
    setCopyModalOpen(true);
  };
  const openCreditModal = (invoiceList: any) => {
    valueSetter(invoiceList);
    setCreditModalOpen(true);
  };

  const openEmailModal = (invoiceList: any) => {
    valueSetter(invoiceList);
    setEmailModalOpen(true);
  };
  const openOrderConfirmationModal = (invoiceList: any) => {
    valueSetter(invoiceList);
    setOrderConfirmationModalOpen(true);
  };

  const openActivateModal = (invoiceList: any) => {
    valueSetter(invoiceList);
    setActivateModalOpen(true);
  };
  const valueSetter = (invoiceList: any) => {
    setInvoiceNr(invoiceList.invoiceNr);
    setEditModalId(invoiceList.id);
    localStorage.setItem(
      "ModalData",
      JSON.stringify({
        invoiceDateAsString: invoiceList.invoiceDateAsString,
        invoiceDate: invoiceList.invoiceDate,
        client: invoiceList.client,
        totalPriceWithVat: invoiceList.totals.totalPriceWithVAT,
        sign: invoiceList.valuta.sign,
        status: invoiceList.invoiceStatus.value,
        attachmentsCount: invoiceList.attachmentsCount,
        activeSendInstructions: invoiceList.activeSendInstructions,
        totalOpen: invoiceList.totals.totalOpen,
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
  const [mutations, setMutations] = useState<Record<number, MutationsModel>>(
    {}
  );
  const [activities, setActivities] = useState<Record<number, ActivitiesModel>>(
    {}
  );

  const fetchMutations = async (id: number) => {
    const response = await getInvoiceMutationsById(id);
    if (response.isValid && response.result.length > 0) {
      setMutations((prev) => ({
        ...prev,
        [id]: response,
      }));
    }
  };

  const fetchActionHistory = async (id: number) => {
    const response = await getInvoiceActivitiesById(id);
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
    let defaultTab = "mutations";
    if (isDraft) {
      defaultTab = "attachments";
    }

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
          // !isLoading &&
          invoiceLists?.result?.map((invoiceList: InvoiceListResult) => (
            <ListCard key={invoiceList.id}>
              {invoiceList.relatedParentInvoice !== null && (
                <div
                  className="position-absolute text-muted fs-8 fw-bold"
                  style={{
                    top: "17px",
                    zIndex: 2,
                    right: getRibbonStyle(invoiceList.totals.totalPriceWithVAT),
                  }}
                >
                  <i className="fa fas fa-share text-danger fs-7 me-2"></i>

                  <Tippy
                    content={intl.formatMessage({
                      id: "Fields.RelatedInvoice",
                    })}
                  >
                    <span
                      className="cursor-pointer text-danger border border-danger rounded p-2"
                      onClick={() => {
                        localStorage.setItem(
                          "currentItem",
                          JSON.stringify(invoiceList.relatedParentInvoice)
                        );
                        navigate(`/invoice/view/${invoiceList.uniqueId}`);
                      }}
                    >
                      {invoiceList.relatedParentInvoice?.invoiceNr}
                    </span>
                  </Tippy>
                </div>
              )}
              {invoiceList.relatedCreditInvoice !== null && (
                <div
                  className="position-absolute text-muted fs-8 fw-bold"
                  style={{
                    top: "17px",
                    zIndex: 2,
                    right:
                      invoiceList.totals.totalPriceWithVAT > 99 ||
                      invoiceList.totals.totalPriceWithVAT < -99
                        ? "75px"
                        : "60px",
                  }}
                >
                  <i className="fa fas fa-share text-warning fs-7 me-2"></i>
                  <Tippy
                    content={intl.formatMessage({
                      id: "Fields.RelatedCreditInvoice",
                    })}
                  >
                    <span
                      className="cursor-pointer text-warning border border-warning rounded p-2"
                      onClick={() => {
                        localStorage.setItem(
                          "currentItem",
                          JSON.stringify(invoiceList.relatedCreditInvoice)
                        );
                        navigate(`/invoice/view/${invoiceList.uniqueId}`);
                      }}
                    >
                      {invoiceList.relatedCreditInvoice.invoiceNr}
                    </span>
                  </Tippy>
                </div>
              )}

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
                            {intl.formatMessage({ id: "Fields.TotalPrice" })}:
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
                      {invoiceList.totals.totalVATAmount && (
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
                            {invoiceList.totals.totalVATAmount.toFixed(2)}
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

              <div
                className="ribbon ribbon-start ribbon-clip position-absolute cursor-pointer"
                style={{
                  top: "10px",
                  height: "30px",
                  minWidth: "250px",
                }}
                onClick={(e) => {
                  if (invoiceList.isDraft) {
                    e.preventDefault();
                    openEditModal(invoiceList.id);
                  } else {
                    localStorage.setItem(
                      "currentItem",
                      JSON.stringify(invoiceList)
                    );
                    navigate(`/invoice/view/${invoiceList.uniqueId}`);
                  }
                }}
                onContextMenu={(e) => {
                  if (invoiceList.isDraft) {
                    e.preventDefault(); // Prevent navigation for drafts
                    openEditModal(invoiceList.id);
                  } else {
                    localStorage.setItem(
                      "currentItem",
                      JSON.stringify(invoiceList)
                    );
                    navigate(`/invoice/view/${invoiceList.uniqueId}`);
                  }
                }}
              >
                <div
                  className={`ribbon-label fw-bold  ${
                    invoiceList.invoiceStatus.value === 1 && "text-dark"
                  }
                  ${getStatusClass(invoiceList.invoiceStatus.value)}`}
                >
                  {
                    getEnumOptions(enums.InvoiceStatusTypes, intl).find(
                      (item) => item.value === invoiceList.invoiceStatus.value
                    )?.label
                  }
                  <span
                    className={`ribbon-inner ${getStatusClass(
                      invoiceList.invoiceStatus.value
                    )} text-white`}
                  ></span>
                </div>
              </div>

              <div className="card-body pb-4">
                {/* First Row: Client Name (Left) and Amount (Right) */}
                <div className="d-flex align-items-center text-muted gap-2 mt-1">
                  {/* Client Name on the Left */}
                  <a
                    className="d-flex flex-column cursor-pointer"
                    href={
                      invoiceList.isDraft
                        ? undefined
                        : `/invoice/view/${invoiceList.uniqueId}`
                    }
                    target={invoiceList.isDraft ? undefined : "_self"}
                    onClick={(e) => {
                      if (invoiceList.isDraft) {
                        e.preventDefault(); // Prevent navigation for drafts
                        openEditModal(invoiceList.id);
                      } else {
                        localStorage.setItem(
                          "currentItem",
                          JSON.stringify(invoiceList)
                        );
                      }
                    }}
                    onContextMenu={(e) => {
                      if (invoiceList.isDraft) {
                        e.preventDefault(); // Prevent navigation for drafts
                        openEditModal(invoiceList.id);
                      } else {
                        localStorage.setItem(
                          "currentItem",
                          JSON.stringify(invoiceList)
                        );
                      }
                    }}
                  >
                    <strong className="text-primary">
                      {invoiceList.invoiceNr}
                    </strong>
                  </a>
                  {/* {invoiceList.hasClientReferenceNr && (
                    <small className="fs-9">
                      {invoiceList.clientReferenceNr}
                    </small>
                  )} */}
                </div>
                <div className="d-flex gap-2 align-items-center justify-content-between">
                  <small className="rounded p-1 text-white bg-gray-500 px-2 fw-bold fs-9">
                    {invoiceList.client}
                  </small>
                  {invoiceList.hasClientReferenceNr && (
                    <small className="fs-9 text-muted">
                      {invoiceList.clientReferenceNr}
                    </small>
                  )}
                </div>

                {/* separator Line */}
                <div className="separator separator-solid mt-2"></div>

                <div className="d-flex flex-row flex-wrap fs-8 gap-4 mt-3 align-items-center justify-content-between position-relative">
                  <div className="position-absolute" style={{ left: "-28px" }}>
                    <button
                      className="btn btn-icon btn-sm"
                      onClick={() => {
                        if (!expandedRows.includes(invoiceList.id)) {
                          // Only fetch data if it's being expanded
                          setLoadingRows((prev) => ({
                            ...prev,
                            [invoiceList.id]: true,
                          }));
                          toggleRow(invoiceList.id, invoiceList.isDraft);
                          fetchMutations(invoiceList.id);
                          fetchActionHistory(invoiceList.id);
                          fetchAttachments(invoiceList.id);
                        } else {
                          toggleRow(invoiceList.id, invoiceList.isDraft);
                        }
                      }}
                    >
                      {expandedRows.includes(invoiceList.id) ? (
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
                    details={INVOICE_DETAILS(invoiceList, intl)}
                    intl={intl}
                  />

                  {/* Buttons Section */}
                  <div className="d-flex align-items-center">
                    {!isModal && invoiceList.actions.canShowPreview && (
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
                              JSON.stringify(invoiceList)
                            );
                            navigate(`/invoice/view/${invoiceList.uniqueId}`);
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

                    {!isModal && invoiceList.actions.canEdit && (
                      <Tippy
                        content={intl.formatMessage({
                          id: "Fields.ToolTipEdit",
                        })}
                      >
                        <button
                          className="btn btn-icon btn-light btn-sm me-4"
                          onClick={() => {
                            openEditModal(invoiceList.id);
                          }}
                        >
                          <i className="ki-solid ki-pencil text-warning fs-2"></i>
                        </button>
                      </Tippy>
                    )}
                    {isModal && (
                      <Tippy
                        content={intl.formatMessage({
                          id: "Fields.ToolTipEdit",
                        })}
                      >
                        <button
                          className="btn btn-icon btn-primary btn-sm me-4"
                          onClick={() => {
                            setInvoiceId && setInvoiceId(invoiceList.id);
                          }}
                        >
                          <i className="ki-duotone ki-pin text-white fs-2">
                            <span className="path1"></span>
                            <span className="path2"></span>
                          </i>
                        </button>
                      </Tippy>
                    )}
                    {!isModal && (
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
                              link.href = invoiceList.downloadInfo.downloadUrl;
                              link.setAttribute(
                                "download",
                                invoiceList.downloadInfo.fileName
                              );
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                            }}
                          >
                            <a className="dropdown-item d-flex align-items-center cursor-pointer">
                              <i className="fa-solid fa-cloud-arrow-down me-2 fs-3 text-primary"></i>
                              {intl.formatMessage({
                                id: "Fields.ActionDownload",
                              })}
                            </a>
                          </li>

                          {!isModal && invoiceList?.actions.canCredit && (
                            <>
                              <div className="dropdown-divider border-gray-200"></div>
                              <li
                                onClick={() => {
                                  openCreditModal(invoiceList);
                                }}
                              >
                                <a className="dropdown-item d-flex align-items-center text-center cursor-pointer">
                                  <i className="fa fas fa-trash-restore-alt fs-3 me-2 text-warning" />
                                  {intl.formatMessage({
                                    id: "Fields.ActionCredit",
                                  })}
                                </a>
                              </li>
                            </>
                          )}
                          {!isModal &&
                            invoiceList?.actions.canCreateOrderConfirmation && (
                              <>
                                <div className="dropdown-divider border-gray-200"></div>

                                <li
                                  onClick={() =>
                                    openOrderConfirmationModal(invoiceList)
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
                            )}

                          <div className="dropdown-divider border-gray-200"></div>
                          <li
                            onClick={() => {
                              setInvoiceNr(invoiceList.invoiceNr);
                              setDownloadUrl(
                                invoiceList.downloadInfo.downloadUrl
                              );
                              setKey((prev) => prev + 1);
                            }}
                            data-bs-toggle="offcanvas"
                            data-bs-target="#offcanvasRight"
                            aria-controls="offcanvasRight"
                          >
                            <a className="dropdown-item d-flex align-items-center cursor-pointer">
                              <i className="far fa-file-pdf me-3 fs-3 text-info"></i>
                              {intl.formatMessage({
                                id: "Fields.ToolTipView",
                              })}
                            </a>
                          </li>
                          {invoiceList.actions.canSettle && (
                            <>
                              <div className="dropdown-divider border-gray-200"></div>
                              <li

                              // onClick={() => openValidateModal(invoiceList)}
                              >
                                <a className="dropdown-item d-flex align-items-center cursor-pointer">
                                  <i className="fa far fa-credit-card me-2 fs-3"></i>
                                  {intl.formatMessage({
                                    id: "Fields.ActionSettle",
                                  })}
                                </a>
                              </li>
                            </>
                          )}
                          {invoiceList.actions.canRegisterPayment && (
                            <>
                              <div className="dropdown-divider border-gray-200"></div>
                              <li
                                onClick={() => {
                                  openPaymentModal(invoiceList);
                                }}
                              >
                                <a className="dropdown-item d-flex align-items-center text-center cursor-pointer">
                                  <i className="fa far fa-credit-card text-info fs-2 me-2"></i>
                                  {intl.formatMessage({
                                    id: "Fields.ActionPayment",
                                  })}
                                </a>
                              </li>
                            </>
                          )}
                          {invoiceList?.actions.canAddAttachments && (
                            <>
                              <div className="dropdown-divider border-gray-200"></div>
                              <li
                                onClick={() => {
                                  openAttachmentsModal(invoiceList.id);
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
                          {invoiceList.actions.canSend && (
                            <>
                              <div className="dropdown-divider border-gray-200"></div>
                              <li
                                onClick={() => {
                                  openEmailModal(invoiceList);
                                  setAlterEmail(false);
                                }}
                              >
                                <a className="dropdown-item d-flex align-items-center text-center cursor-pointer">
                                  <i className="ki-duotone ki-send fs-2 me-2 text-success">
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

                          {invoiceList.actions.canAlterSendInstructions && (
                            <>
                              <div className="dropdown-divider border-gray-200"></div>
                              <li
                                onClick={() => {
                                  openEmailModal(invoiceList);
                                  setAlterEmail(true);
                                }}
                              >
                                <a className="dropdown-item d-flex align-items-center text-center cursor-pointer">
                                  <i className="fas fa-mail-bulk fs-2 me-2 text-success"></i>
                                  {intl.formatMessage({
                                    id: "Fields.ActionAlterSendEmailInstructions",
                                  })}
                                </a>
                              </li>
                            </>
                          )}
                          {invoiceList.actions.canCreateCopy && (
                            <>
                              <div className="dropdown-divider border-gray-200"></div>
                              <li
                                onClick={() => {
                                  openCopyModal(invoiceList);
                                }}
                              >
                                <a className="dropdown-item d-flex align-items-center cursor-pointer">
                                  <i className="ki-duotone ki-copy fs-2 me-2 text-info" />
                                  {intl.formatMessage({
                                    id: "Fields.ActionCopy",
                                  })}
                                </a>
                              </li>
                            </>
                          )}
                          {invoiceList.actions.canFinalize && (
                            <>
                              <div className="dropdown-divider border-gray-200"></div>
                              <li
                                onClick={() => {
                                  openActivateModal(invoiceList);
                                }}
                              >
                                <a className="dropdown-item d-flex align-items-center cursor-pointer">
                                  <i className="fa fas fa-flag-checkered fs-2 me-2" />
                                  {intl.formatMessage({
                                    id: "Fields.ActionFinalize",
                                  })}
                                </a>
                              </li>
                            </>
                          )}
                          {invoiceList.actions.canDelete && (
                            <>
                              <div className="dropdown-divider border-gray-200"></div>
                              <li
                                onClick={() => {
                                  openDeleteModal(invoiceList);
                                }}
                              >
                                <a className="dropdown-item  d-flex align-items-center cursor-pointer">
                                  <i className="ki-solid ki-trash fs-1 me-2 text-danger"></i>
                                  {intl.formatMessage({
                                    id: "Fields.ActionDelete",
                                  })}
                                </a>
                              </li>
                            </>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
                {!isModal && expandedRows.includes(invoiceList.id) && (
                  <ExpandedRows
                    attachments={attachments}
                    activities={activities}
                    mutations={mutations}
                    activeTab={activeTab}
                    handleTabChange={handleTabChange}
                    setDownloadUrl={setDownloadUrl}
                    setKey={setKey}
                    id={invoiceList.id}
                    loadingRows={loadingRows}
                  />
                )}

                {invoiceList.hasVoucherNr && (
                  <div className="mt-2">
                    <span className="text-gray-400 fs-8">
                      #{invoiceList.voucherNr}
                    </span>
                  </div>
                )}
              </div>
            </ListCard>
          ))
        }

        {invoiceLists?.result?.length == 0 && <NoItemsPage />}
        {isListLoading && <ListLoading />}
      </div>

      {invoiceLists?.result?.length > 0 && (
        <ListPagination
          totalPages={invoiceLists.totalPages}
          pageIndex={pageIndex}
          onPageChange={handlePageChange}
          totalItems={invoiceLists.totalRows}
          moduleName="invoices-module"
        />
      )}
    </KTCardBody>
  );
};

export { InvoiceList };
