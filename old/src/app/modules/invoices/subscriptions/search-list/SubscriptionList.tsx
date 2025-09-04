import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { InvoiceListResult } from "../core/_models";
import {
  getInvoiceActivitiesById,
  getInvoiceMutationsById,
  getSubscriptions,
} from "../core/_requests";
import { ListLoading } from "../../../generic/ListLoading";
import { KTCardBody, KTSVG } from "../../../../../_metronic/helpers";
import { useIntl } from "react-intl";
import Tippy from "@tippyjs/react";
import { useNavigate } from "react-router-dom";
import { ListPagination } from "../../../generic/ListPagination";
import { getDateRange, parseDate } from "../../../../utils/dateUtils";
import { getStatusClass } from "../../../../utils/statusUtils";
import DetailsCard from "../../../generic/ListElements/DetailsCard";
import { SUBSCRIPTION_DETAILS } from "../../utils/subscriptionDetails";
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
  subscriptionStatus: number;
  clientIdForFilter: number | null;
  year: number | null;
  setCopyModalOpen: (type: boolean) => void;
  setEmailModalOpen: (type: boolean) => void;
  setActivateModalOpen: (type: boolean) => void;
  setAttachmentsModalOpen: (type: boolean) => void;
  setPaymentModalOpen: (type: boolean) => void;
  setCreditModalOpen: (type: boolean) => void;
  setAlterEmail: (type: boolean) => void;
  setInvoiceId?: (type: number) => void;
  attachments: Record<number, AttachmentsResult[]>;
  fetchAttachments: (type: number) => void;
  setKey: Dispatch<SetStateAction<number>>;
}
const SubscriptionList = ({
  searchTerm,
  setTotalRows,
  setAddModalOpen,
  setEditModalId,
  setInvoiceNr,
  setDeleteModalOpen,
  setDownloadUrl,
  searchCounter,
  refresh,
  subscriptionStatus,
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
  isModal,
  setInvoiceId,
  attachments,
  setPaymentModalOpen,
  fetchAttachments,
  setKey,
}: ComponentProps) => {
  const [subscriptions, setSubscriptions] = useState<any>([]);
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
      const response = await getSubscriptions(
        searchTerm,
        pageIndex,
        dateRange,
        statusTypes,
        clientIdForFilter,
        subscriptionStatus
      );
      if (response.isValid) {
        setSubscriptions(response);
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
    subscriptionStatus,
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
  const openDeleteModal = (subscription: any) => {
    setDeleteModalOpen(true);
    valueSetter(subscription);
  };

  const openPaymentModal = (subscription: any) => {
    valueSetter(subscription);
    setPaymentModalOpen(true);
  };
  const openCopyModal = (subscription: any) => {
    valueSetter(subscription);
    setCopyModalOpen(true);
  };
  const openCreditModal = (subscription: any) => {
    valueSetter(subscription);
    setCreditModalOpen(true);
  };

  const openEmailModal = (subscription: any) => {
    valueSetter(subscription);
    setEmailModalOpen(true);
  };

  const openActivateModal = (subscription: any) => {
    valueSetter(subscription);
    setActivateModalOpen(true);
  };
  const valueSetter = (subscription: any) => {
    setInvoiceNr(subscription.invoiceNr);
    setEditModalId(subscription.id);
    localStorage.setItem(
      "ModalData",
      JSON.stringify({
        invoiceDateAsString: subscription.invoiceDateAsString,
        client: subscription.client,
        totalPriceWithVat: subscription.totals.totalPriceWithVAT,
        sign: subscription.valuta.sign,
        status: subscription.invoiceStatus.value,
        attachmentsCount: subscription.attachmentsCount,
        activeSendInstructions: subscription.activeSendInstructions,
        totalOpen: subscription.totals.totalOpen,
      })
    );
  };
  const getRibbonStyle = (totalPrice: number) => {
    if (totalPrice > 99) return "75px";
    if (totalPrice < -99) return "82px";
    return "60px";
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
    let defaultTab = "actionHistory";
    if (isDraft) {
      defaultTab = "attachments";
    }

    // Set default active tab for the expanded row
    setActiveTab((prev) => ({
      ...prev,
      [id]: prev[id] || defaultTab,
    }));
  };

  const renderCheckIcon = (isChecked: boolean) => {
    return isChecked ? (
      <Tippy
        content={intl.formatMessage({
          id: "Fields.ToolTipActive",
        })}
      >
        <span>
          <KTSVG
            path="media/icons/duotune/general/gen037.svg"
            className="svg-icon-success svg-icon-2x"
          />
        </span>
      </Tippy>
    ) : (
      <Tippy
        content={intl.formatMessage({
          id: "Fields.ToolTipInactive",
        })}
      >
        <span>
          <KTSVG
            path="media/icons/duotune/general/gen037.svg"
            className="svg-icon-danger svg-icon-2x"
          />
        </span>
      </Tippy>
    );
  };
  return (
    <KTCardBody className="py-4">
      <div className="row row-cols-1 row-cols-md-1 g-4">
        {
          // !isListLoading &&
          subscriptions?.result?.map((subscription: InvoiceListResult) => (
            <ListCard key={subscription.id}>
              {subscription.relatedParentInvoice !== null && (
                <div
                  className="position-absolute text-muted fs-8 fw-bold"
                  style={{
                    top: "17px",
                    zIndex: 2,
                    right: getRibbonStyle(
                      subscription.totals.totalPriceWithVAT
                    ),
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
                          JSON.stringify(subscription.relatedParentInvoice)
                        );
                        navigate(`/invoice/view/${subscription.uniqueId}`);
                      }}
                    >
                      {subscription.relatedParentInvoice?.invoiceNr}
                    </span>
                  </Tippy>
                </div>
              )}
              {subscription.relatedCreditInvoice !== null && (
                <div
                  className="position-absolute text-muted fs-8 fw-bold"
                  style={{
                    top: "17px",
                    zIndex: 2,
                    right:
                      subscription.totals.totalPriceWithVAT > 99 ||
                      subscription.totals.totalPriceWithVAT < -99
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
                          JSON.stringify(subscription.relatedCreditInvoice)
                        );
                        navigate(`/invoice/view/${subscription.uniqueId}`);
                      }}
                    >
                      {subscription.relatedCreditInvoice.invoiceNr}
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
                      {subscription.totals.totalPrice && (
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
                            {subscription.valuta.sign}
                            {subscription.totals.totalPrice.toFixed(2)}
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
                    {subscription.valuta.sign}
                    {subscription.totals.totalPriceWithVAT.toFixed(2)}
                    <span className="ribbon-inner bg-gray-600"></span>
                  </div>
                </div>
              </Tippy>

              <div
                className="ribbon ribbon-start ribbon-clip position-absolute cursor-pointer"
                style={{
                  top: "10px",
                  height: "30px",
                  minWidth: "200px",
                }}
                onClick={(e) => {
                  if (subscription.isDraft) {
                    e.preventDefault();
                    openEditModal(subscription.id);
                  } else {
                    localStorage.setItem(
                      "currentItem",
                      JSON.stringify(subscription)
                    );
                    navigate(`/invoice/view/${subscription.uniqueId}`);
                  }
                }}
                onContextMenu={(e) => {
                  if (subscription.isDraft) {
                    e.preventDefault(); // Prevent navigation for drafts
                    openEditModal(subscription.id);
                  } else {
                    localStorage.setItem(
                      "currentItem",
                      JSON.stringify(subscription)
                    );
                    navigate(`/invoice/view/${subscription.uniqueId}`);
                  }
                }}
              >
                <div
                  className={`ribbon-label fw-bold ${getStatusClass(
                    subscription.invoiceStatus.value
                  )}`}
                >
                  {
                    getEnumOptions(enums.InvoiceStatusTypes, intl).find(
                      (item) => item.value === subscription.invoiceStatus.value
                    )?.label
                  }
                  <span
                    className={`ribbon-inner ${getStatusClass(
                      subscription.invoiceStatus.value
                    )}`}
                  ></span>
                </div>
              </div>

              <div className="card-body pb-4">
                {/* First Row: Client Name (Left) and Amount (Right) */}
                <div className="d-flex align-items-center cursor-pointer title-clickable mb-2">
                  {/* Client Name on the Left */}
                  <a
                    className="gap-3"
                    href={
                      subscription.isDraft
                        ? undefined
                        : `/invoice/view/${subscription.uniqueId}`
                    }
                    target={subscription.isDraft ? undefined : "_self"}
                    onClick={(e) => {
                      if (subscription.isDraft) {
                        e.preventDefault(); // Prevent navigation for drafts
                        openEditModal(subscription.id);
                      } else {
                        localStorage.setItem(
                          "currentItem",
                          JSON.stringify(subscription)
                        );
                      }
                    }}
                    onContextMenu={(e) => {
                      if (subscription.isDraft) {
                        e.preventDefault(); // Prevent navigation for drafts
                        openEditModal(subscription.id);
                      } else {
                        localStorage.setItem(
                          "currentItem",
                          JSON.stringify(subscription)
                        );
                      }
                    }}
                  >
                    {renderCheckIcon(subscription.automation.rootIsActive)}
                    <span className="mx-5 text-muted">|</span>
                    <strong className="text-primary">
                      {subscription.invoiceNr}
                    </strong>
                  </a>
                </div>
                <div className="d-flex gap-2 align-items-center justify-content-between text-muted fs-9">
                  {subscription.client && (
                    <small className="rounded p-1 text-white bg-gray-500 px-2 fw-bold">
                      {subscription.client}
                    </small>
                  )}
                  {subscription.hasClientReferenceNr && (
                    <small>{subscription.clientReferenceNr}</small>
                  )}
                </div>

                {/* separator Line */}
                <div className="separator mt-2"></div>

                <div className="d-flex flex-row flex-wrap fs-8 gap-4 mt-2 align-items-center justify-content-between position-relative">
                  <div className="position-absolute" style={{ left: "-28px" }}>
                    {!isModal && (
                      <button
                        className="btn btn-icon btn-sm"
                        onClick={() => {
                          if (!expandedRows.includes(subscription.id)) {
                            // Only fetch data if it's being expanded
                            setLoadingRows((prev) => ({
                              ...prev,
                              [subscription.id]: true,
                            }));
                            toggleRow(subscription.id, subscription.isDraft);
                            fetchMutations(subscription.id);
                            fetchActionHistory(subscription.id);
                            fetchAttachments(subscription.id);
                          } else {
                            toggleRow(subscription.id, subscription.isDraft);
                          }
                        }}
                      >
                        {expandedRows.includes(subscription.id) ? (
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
                    )}
                  </div>
                  <DetailsCard
                    details={SUBSCRIPTION_DETAILS(subscription, intl)}
                    intl={intl}
                  />

                  {/* Buttons Section */}
                  <div className="d-flex align-items-center">
                    {!isModal && subscription.actions.canShowPreview && (
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
                              JSON.stringify(subscription)
                            );
                            navigate(`/invoice/view/${subscription.uniqueId}`);
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

                    {!isModal && subscription.actions.canEdit && (
                      <Tippy
                        content={intl.formatMessage({
                          id: "Fields.ToolTipEdit",
                        })}
                      >
                        <button
                          className="btn btn-icon btn-light btn-sm me-4"
                          onClick={() => {
                            openEditModal(subscription.id);
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
                            setInvoiceId && setInvoiceId(subscription.id);
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
                              link.href = subscription.downloadInfo.downloadUrl;
                              link.setAttribute(
                                "download",
                                subscription.downloadInfo.fileName
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

                          {!isModal && subscription?.actions.canCredit && (
                            <>
                              <div className="dropdown-divider border-gray-200"></div>
                              <li
                                onClick={() => {
                                  openCreditModal(subscription);
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
                          <div className="dropdown-divider border-gray-200"></div>
                          <li
                            onClick={() => {
                              setInvoiceNr(subscription.invoiceNr);
                              setDownloadUrl(
                                subscription.downloadInfo.downloadUrl
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
                          {subscription.actions.canSettle && (
                            <>
                              <div className="dropdown-divider border-gray-200"></div>
                              <li

                              // onClick={() => openValidateModal(subscription)}
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
                          {subscription.actions.canRegisterPayment && (
                            <>
                              <div className="dropdown-divider border-gray-200"></div>
                              <li
                                onClick={() => {
                                  openPaymentModal(subscription);
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
                          {subscription?.actions.canAddAttachments && (
                            <>
                              <div className="dropdown-divider border-gray-200"></div>
                              <li
                                onClick={() => {
                                  openAttachmentsModal(subscription.id);
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
                          {subscription.actions.canSend && (
                            <>
                              <div className="dropdown-divider border-gray-200"></div>
                              <li
                                onClick={() => {
                                  openEmailModal(subscription);
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

                          {subscription.actions.canAlterSendInstructions && (
                            <>
                              <div className="dropdown-divider border-gray-200"></div>
                              <li
                                onClick={() => {
                                  openEmailModal(subscription);
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
                          {subscription.actions.canCreateCopy && (
                            <>
                              <div className="dropdown-divider border-gray-200"></div>
                              <li
                                onClick={() => {
                                  openCopyModal(subscription);
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
                          {subscription.actions.canFinalize && (
                            <>
                              <div className="dropdown-divider border-gray-200"></div>
                              <li
                                onClick={() => {
                                  openActivateModal(subscription);
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
                          {subscription.actions.canDelete && (
                            <>
                              <div className="dropdown-divider border-gray-200"></div>
                              <li
                                onClick={() => {
                                  openDeleteModal(subscription);
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
                {!isModal && expandedRows.includes(subscription.id) && (
                  <ExpandedRows
                    attachments={attachments}
                    activities={activities}
                    mutations={mutations}
                    activeTab={activeTab}
                    handleTabChange={handleTabChange}
                    setDownloadUrl={setDownloadUrl}
                    setKey={setKey}
                    id={subscription.id}
                    loadingRows={loadingRows}
                  />
                )}
                {subscription.hasVoucherNr && (
                  <div className="mt-2">
                    <span className="text-gray-400 fs-8">
                      #{subscription.voucherNr}
                    </span>
                  </div>
                )}
              </div>
            </ListCard>
          ))
        }

        {subscriptions?.result?.length == 0 && <NoItemsPage />}
        {isListLoading && <ListLoading />}
      </div>

      {subscriptions?.result?.length > 0 && (
        <ListPagination
          totalPages={subscriptions.totalPages}
          pageIndex={pageIndex}
          onPageChange={handlePageChange}
          totalItems={subscriptions.totalRows}
          moduleName="subscription-module"
        />
      )}
    </KTCardBody>
  );
};

export { SubscriptionList };
