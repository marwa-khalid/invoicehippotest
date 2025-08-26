import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { AttachmentsResult, CostListResult } from "../core/_models";
import {
  getCostActivitiesById,
  getCostMutationsById,
  getCosts,
} from "../core/_requests";
import { ListLoading } from "../../../../generic/ListLoading";
import { KTCardBody } from "../../../../../../_metronic/helpers";
import { useIntl } from "react-intl";
import Tippy from "@tippyjs/react";
import { useNavigate } from "react-router-dom";
import { ListPagination } from "../../../../generic/ListPagination";
import { getDateRange, parseDate } from "../../../../../utils/dateUtils";
import DetailsCard from "../../../../generic/ListElements/DetailsCard";
import { COST_DETAILS } from "../../utils/costDetails";
import ListCard from "../../../../generic/ListElements/ListCard";
import { NoItemsPage } from "../../../../generic/NoItemsPage";
import { getEnumOptions } from "../../../../../helpers/intlHelper";
import enums from "../../../../../../_metronic/i18n/messages/invoicehippo.enums.json";
import {
  ActivitiesModel,
  MutationsModel,
} from "../../../bookings/components/core/_models";
import { ExpandedRows } from "../../../../generic/ExpandedRows";
export const getStatusClass = (statusValue: number): string => {
  switch (statusValue) {
    case 1:
      return "bg-warning"; // Nog Te Betalen
    case 2:
      return "bg-primary"; //Gedeeltelijk Betaald-/Termijn Betaling
    case 4:
      return "bg-success"; // Betaald
    case 8:
      return "bg-danger"; // Verlopen-/Herinnering

    default:
      return "bg-default"; // Default
  }
};
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
  clientIdForFilter: number | null;
  year: number | null;
  setAttachmentsModalOpen: (type: boolean) => void;
  setCostId?: (type: number) => void;
  attachments: Record<number, AttachmentsResult[]>;
  fetchAttachments: (type: any) => void;
  paymentSourceType: number;
  attachmentType: number;
  setKey: Dispatch<SetStateAction<number>>;
}
const CostList = ({
  searchTerm,
  setTotalRows,
  setAddModalOpen,
  setEditModalId,
  setInvoiceNr,
  setDeleteModalOpen,
  setDownloadUrl,
  searchCounter,
  refresh,
  setPageIndex,
  pageIndex,
  periodValueType,
  statusTypes,
  clientIdForFilter,
  year,
  attachments,
  fetchAttachments,
  setAttachmentsModalOpen,
  isModal,
  setCostId,
  paymentSourceType,
  attachmentType,
  setKey,
}: ComponentProps) => {
  const [costLists, setcostList] = useState<any>([]);
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
      const response = await getCosts(
        searchTerm,
        pageIndex,
        dateRange,
        clientIdForFilter,
        attachmentType,
        paymentSourceType,
        statusTypes
      );
      if (response.isValid) {
        setcostList(response);
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
    attachmentType,
    paymentSourceType,
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
  const openDeleteModal = (costList: any) => {
    setDeleteModalOpen(true);
    valueSetter(costList);
  };

  const valueSetter = (costList: any) => {
    setInvoiceNr(costList.invoiceNr);
    setEditModalId(costList.id);
    localStorage.setItem(
      "ModalData",
      JSON.stringify({
        invoiceDateAsString: costList.invoiceDateAsString,
        client: costList.client,
        totalPriceWithVat: costList.totals.totalPriceWithVAT,
        sign: costList.valuta.sign,
        status: costList.invoiceStatus.value,
        attachmentsCount: costList.attachmentsCount,
        totalOpen: costList.totals.totalOpen,
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
    const response = await getCostMutationsById(id);
    if (response.isValid && response.result.length > 0) {
      setMutations((prev) => ({
        ...prev,
        [id]: response,
      }));
    }
  };

  const fetchActionHistory = async (id: number) => {
    const response = await getCostActivitiesById(id);
    if (response.isValid && response.result.length > 0) {
      setActivities((prev) => ({
        ...prev,
        [id]: response,
      }));
      setLoadingRows((prev) => ({ ...prev, [id]: false }));
    }
  };

  const toggleRow = (id: number) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
    let defaultTab = "mutations";

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
          costLists?.result?.map((costList: CostListResult) => (
            <ListCard key={costList.id}>
              <Tippy
                content={
                  <div style={{ fontFamily: "monospace" }}>
                    <div className="table" style={{ width: "100%" }}>
                      {/* Total Price */}
                      {costList.totals.totalPrice && (
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
                            {costList.valuta.sign}
                            {costList.totals.totalPrice.toFixed(2)}
                          </div>
                        </div>
                      )}
                      {/* Total VAT Amount */}
                      {costList.totals.totalVATAmount && (
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
                            {costList.valuta.sign}
                            {costList.totals.totalVATAmount.toFixed(2)}
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
                    {costList.valuta.sign}
                    {costList.totals.totalPriceWithVAT.toFixed(2)}
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
                  // if (costList.invoiceStatus.value === 1) {
                  e.preventDefault();
                  openEditModal(costList.id);
                  // }
                  // else {
                  //   localStorage.setItem(
                  //     "currentItem",
                  //     JSON.stringify(costList)
                  //   );
                  //   navigate(`/invoice/view/${costList.uniqueId}`);
                  // }
                }}
                // onContextMenu={(e) => {
                //   if (costList.invoiceStatus.value === 1) {
                //     e.preventDefault(); // Prevent navigation for drafts
                //     openEditModal(costList.id);
                //   } else {
                //     localStorage.setItem(
                //       "currentItem",
                //       JSON.stringify(costList)
                //     );
                //     navigate(`/invoice/view/${costList.uniqueId}`);
                //   }
                // }}
              >
                <div
                  className={`${getStatusClass(
                    costList.invoiceStatus.value
                  )} ribbon-label fw-bold`}
                >
                  {
                    getEnumOptions(enums.ReceiptStatusTypes, intl).find(
                      (item) => item.value === costList.invoiceStatus.value
                    )?.label
                  }
                  <span
                    className={`${getStatusClass(
                      costList.invoiceStatus.value
                    )} ribbon-inner bg-gray-600 `}
                  ></span>
                </div>
              </div>

              <div className="card-body pb-4">
                {/* First Row: Client Name (Left) and Amount (Right) */}
                <div className="d-flex align-items-center">
                  {/* Client Name on the Left */}
                  <a
                    className="d-flex flex-column cursor-pointer"
                    href={
                      costList.invoiceStatus.value === 1
                        ? undefined
                        : `/invoice/view/${costList.uniqueId}`
                    }
                    target={
                      costList.invoiceStatus.value === 1 ? undefined : "_self"
                    }
                    onClick={(e) => {
                      if (costList.invoiceStatus.value === 1) {
                        e.preventDefault(); // Prevent navigation for drafts
                        openEditModal(costList.id);
                      } else {
                        localStorage.setItem(
                          "currentItem",
                          JSON.stringify(costList)
                        );
                      }
                    }}
                    onContextMenu={(e) => {
                      if (costList.invoiceStatus.value === 1) {
                        e.preventDefault(); // Prevent navigation for drafts
                        openEditModal(costList.id);
                      } else {
                        localStorage.setItem(
                          "currentItem",
                          JSON.stringify(costList)
                        );
                      }
                    }}
                  >
                    <strong
                      className="text-primary"
                      dangerouslySetInnerHTML={{
                        __html: costList.invoiceNr,
                      }}
                    />
                  </a>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  {costList.hasClient && (
                    <small className="rounded p-1 text-white bg-gray-500 px-2 fw-bold fs-9">
                      {costList.client}
                    </small>
                  )}
                </div>
                {/* <ul className="breadcrumb breadcrumb-secondary breadcrumb-dot mb-3 text-muted">
                  <li className="breadcrumb-item">
                    {costList.invoiceStatus.name && (
                      <small
                        className={`${getStatusClass(
                          costList.invoiceStatus.value
                        )} rounded p-1 text-white fw-bold px-3`}
                      >
                        {
                          getEnumOptions(enums.ReceiptStatusTypes, intl).find(
                            (item) =>
                              item.value === costList.invoiceStatus.value
                          )?.label
                        }
                      </small>
                    )}
                  </li>
                </ul> */}

                {/* separator Line */}
                <div className="separator separator-solid mt-2 mb-3"></div>

                <div className="d-flex flex-row flex-wrap fs-8 gap-4 align-items-center justify-content-between position-relative">
                  <div className="position-absolute" style={{ left: "-28px" }}>
                    <button
                      className="btn btn-icon btn-sm"
                      onClick={() => {
                        if (!expandedRows.includes(costList.id)) {
                          // Only fetch data if it's being expanded
                          setLoadingRows((prev) => ({
                            ...prev,
                            [costList.id]: true,
                          }));
                          toggleRow(costList.id);
                          fetchMutations(costList.id);
                          fetchActionHistory(costList.id);
                          fetchAttachments(costList.id);
                        } else {
                          toggleRow(costList.id);
                        }
                      }}
                    >
                      {expandedRows.includes(costList.id) ? (
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
                    details={COST_DETAILS(costList, intl)}
                    intl={intl}
                  />

                  {/* Buttons Section */}
                  <div className="d-flex align-items-center">
                    {isModal && (
                      <Tippy
                        content={intl.formatMessage({
                          id: "Fields.ToolTipEdit",
                        })}
                      >
                        <button
                          className="btn btn-icon btn-primary btn-sm me-4"
                          onClick={() => {
                            setCostId && setCostId(costList.id);
                          }}
                        >
                          <i className="ki-duotone ki-pin text-white fs-2">
                            <span className="path1"></span>
                            <span className="path2"></span>
                          </i>
                        </button>
                      </Tippy>
                    )}

                    {!isModal && costList.actions.canEdit && (
                      <Tippy
                        content={intl.formatMessage({
                          id: "Fields.ToolTipEdit",
                        })}
                      >
                        <button
                          className="btn btn-icon btn-light btn-sm me-4"
                          onClick={() => {
                            openEditModal(costList.id);
                          }}
                        >
                          <i className="ki-solid ki-pencil text-warning fs-2"></i>
                        </button>
                      </Tippy>
                    )}
                    <div className="btn-group drop-left">
                      {!isModal && (
                        <button
                          className="btn btn-icon btn-light btn-sm"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          <i className="fa fas fa-list-ul text-muted fs-2"></i>
                        </button>
                      )}
                      <ul className="dropdown-menu w-content-fit py-4">
                        {costList?.actions.canRegisterPayment && (
                          <>
                            <li
                              onClick={() => {
                                // openPaymentModal();
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

                        {costList?.actions.canAddAttachments && (
                          <>
                            {costList?.actions.canRegisterPayment && (
                              <div className="dropdown-divider border-gray-200"></div>
                            )}
                            <li
                              onClick={() => {
                                openAttachmentsModal(costList.id);
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

                        {costList.actions.canDelete && (
                          <>
                            <div className="dropdown-divider border-gray-200"></div>
                            <li
                              onClick={() => {
                                openDeleteModal(costList);
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
                  </div>
                </div>
                {expandedRows.includes(costList.id) && (
                  <ExpandedRows
                    attachments={attachments}
                    activities={activities}
                    mutations={mutations}
                    activeTab={activeTab}
                    handleTabChange={handleTabChange}
                    setDownloadUrl={setDownloadUrl}
                    setKey={setKey}
                    id={costList.id}
                    loadingRows={loadingRows}
                  />
                )}
                {costList.hasVoucherNr && (
                  <div className="mt-1">
                    <span className="text-gray-400 fs-8">
                      #{costList.voucherNr}
                    </span>
                  </div>
                )}
              </div>
            </ListCard>
          ))
        }

        {costLists?.result?.length == 0 && <NoItemsPage />}
        {isListLoading && <ListLoading />}
      </div>

      {costLists?.result?.length > 0 && (
        <ListPagination
          totalPages={costLists.totalPages}
          pageIndex={pageIndex}
          onPageChange={handlePageChange}
          totalItems={costLists.totalRows}
          moduleName="cost-module"
        />
      )}
    </KTCardBody>
  );
};

export { CostList };
