import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { BankTransactionsModel, BankTransactionsResult } from "../core/_models";
import {
  callAutoRouteCount,
  changeStatus,
  deleteTransaction,
  getBankTransactions,
  restoreTransaction,
} from "../core/_requests";
import { ListLoading } from "../../../../../generic/ListLoading";
import { KTCardBody, KTIcon } from "../../../../../../../_metronic/helpers";
import { TRANSACTION_DETAILS } from "../../utils/transactionDetails";
import { useIntl } from "react-intl";
import Tippy from "@tippyjs/react";
import { ListPagination } from "../../../../../generic/ListPagination";
import { getDateRange, parseDate } from "../../../../../../utils/dateUtils";
import {
  AttachmentsResult,
  MutationsModel,
} from "../../../../bookings/components/core/_models";
import { NoItemsPage } from "../../../../../generic/NoItemsPage";
import { useAuth } from "../../../../../auth";
import DetailsCard from "../../../../../generic/ListElements/DetailsCard";
import { getBookingMutationsById } from "../../../../bookings/components/core/_requests";
import { ExpandedRows } from "../../../../../generic/ExpandedRows";
import { getCostMutationsById } from "../../../../costs/components/core/_requests";
import { getInvoiceMutationsById } from "../../../../../invoices/overview/core/_requests";
import { getEnumOptions } from "../../../../../../helpers/intlHelper";
import enums from "../../../../../../../_metronic/i18n/messages/invoicehippo.enums.json";
import { handleToast } from "../../../../../auth/core/_toast";
import ListCard from "../../../../../generic/ListElements/ListCard";
export const getStatusClass = (statusValue: number): string => {
  switch (statusValue) {
    case 1:
      return "bg-dark";
    case 2:
      return "bg-success";
    case 4:
      return "bg-gray-600";
    case 8:
      return "bg-success";
    case 16:
      return "bg-warning";
    case 32:
      return "bg-danger";
    case 64:
      return "bg-dark";
    case 128:
      return "bg-danger";
    default:
      return "bg-gray-600";
  }
};
export const getIcon = (statusValue: number): string => {
  switch (statusValue) {
    case 1:
      return "ki-solid ki-loading text-white fs-4";
    case 2:
      return "ki-solid ki-double-check text-white fs-3";
    case 8:
      return "ki-solid ki-double-check text-white fs-3";
    case 16:
      return "ki-solid ki-copy text-white fs-4";
    case 32:
      return "ki-solid ki-trash text-white fs-4";
    case 64:
      return "fa-solid fa-robot text-white fs-5";
    case 128:
      return "ki-solid ki-minus-circle text-white fs-4";
    default:
      return "";
  }
};
interface ComponentProps {
  searchTerm: string;
  setTotalRows: (type: number) => void;
  setBookingModalOpen: (type: boolean) => void;
  setCostModalOpen: (type: boolean) => void;
  setInvoiceModalOpen: (type: boolean) => void;
  setMutationId: (type: number) => void;
  setDownloadUrl: (type: string) => void;
  refresh: boolean;
  setPageIndex: (type: number) => void;
  pageIndex: number;
  searchCounter: number;
  periodValueType: number | null;
  processStatusTypes: any;
  financialAccountId: number;
  clientIdForFilter: number | null;
  year: number | null;
  balanceType: number;
  attachmentType: number;
  setKey: Dispatch<SetStateAction<number>>;
  setItemsCount: (type: number) => void;
  setUnlinkModalOpen: (type: boolean) => void;
  setBankTransactions: React.Dispatch<
    React.SetStateAction<BankTransactionsModel | undefined>
  >;
  bankTransactions: BankTransactionsModel | undefined;
  setHasMutation: (type: boolean) => void;
  attachments: Record<number, AttachmentsResult[]>;
  fetchAttachments: any;
  setAttachmentsModalOpen: (type: boolean) => void;
}
const TransactionList = ({
  searchTerm,
  setTotalRows,
  setBookingModalOpen,
  setCostModalOpen,
  setInvoiceModalOpen,
  setMutationId,
  setDownloadUrl,
  searchCounter,
  refresh,
  setPageIndex,
  pageIndex,
  periodValueType,
  processStatusTypes,
  financialAccountId,
  clientIdForFilter,
  year,
  balanceType,
  attachmentType,
  setKey,
  setItemsCount,
  setUnlinkModalOpen,
  setBankTransactions,
  bankTransactions,
  setHasMutation,
  attachments,
  fetchAttachments,
  setAttachmentsModalOpen,
}: ComponentProps) => {
  const intl = useIntl();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState<{ [key: number]: string }>({});
  const fetchCount = async () => {
    const res = await callAutoRouteCount();
    if (res.isValid) {
      setItemsCount(res.result.automationAwaitingItemsCount);
    }
  };
  useEffect(() => {
    fetchCount();

    const intervalId = setInterval(() => {
      fetchCount();
    }, 30000); // every 30 seconds

    // Clear interval on unmount
    return () => clearInterval(intervalId);
  }, [refresh]);

  const toggleRow = (id: number) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
    let defaultTab = "file";

    setActiveTab((prev) => ({
      ...prev,
      [id]: prev[id] || defaultTab,
    }));
  };

  const fetchBankTransactions = async () => {
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

    try {
      const response = await getBankTransactions(
        pageIndex,
        searchTerm,
        processStatusTypes,
        dateRange,
        clientIdForFilter,
        financialAccountId,
        attachmentType,
        balanceType
      );
      if (response.isValid) {
        setBankTransactions(response);
        setTotalRows(response.totalRows);
        setIsLoading(false);
        setItemsCount(response.extraResult?.automationAwaitingItemsCount || 0);
      }
    } catch (error) {
      console.error("Error fetching banking Transactions List:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const handlePageChange = (page: number) => {
    setPageIndex(page);
  };
  const openAttachmentsModal = (id: number) => {
    setMutationId(id);
    setAttachmentsModalOpen(true);
  };
  useEffect(() => {
    fetchBankTransactions();
  }, [
    financialAccountId,
    processStatusTypes,
    clientIdForFilter,
    attachmentType,
    balanceType,
    year,
    periodValueType,
    pageIndex,
    searchCounter,
    refresh,
  ]);

  const handleDelete = async (id: number) => {
    try {
      const res = await deleteTransaction(id);

      if (res.isValid) {
        setBankTransactions((prev) => {
          if (!prev) return prev; // if undefined, return as is

          return {
            ...prev,
            result: prev.result.map((item) =>
              item.id === res.result.id ? res.result : item
            ),
          };
        });
      }

      handleToast(res);
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  const handleRestore = async (id: number) => {
    try {
      const res = await restoreTransaction(id);
      if (res.isValid) {
        setBankTransactions((prev) => {
          if (!prev) return prev; // if undefined, return as is

          return {
            ...prev,
            result: prev.result.map((item) =>
              item.id === res.result.id ? res.result : item
            ),
          };
        });
      }
      handleToast(res);
    } catch {}
  };
  const changeState = async (id: number, state: boolean) => {
    try {
      const res = await changeStatus(id, state);
      if (res.isValid) {
        fetchCount();
        setBankTransactions((prev) => {
          if (!prev) return prev; // if undefined, return as is

          return {
            ...prev,
            result: prev.result.map((item) =>
              item.id === res.result.id ? res.result : item
            ),
          };
        });
      }
      handleToast(res);
    } catch {}
  };
  const { currentUser } = useAuth();
  const openUnlinkmodal = (bankTransaction: BankTransactionsResult) => {
    valueSetter(bankTransaction);
    setMutationId(bankTransaction.id);
    setUnlinkModalOpen(true);
  };
  const valueSetter = (bankTransaction: BankTransactionsResult) => {
    setMutationId(bankTransaction.id);
    localStorage.setItem(
      "DrawerData",
      JSON.stringify({
        transactionDate: bankTransaction.transactionDateAsString,
        counterAccount: bankTransaction.counterPartyAccountInfo,
        amount: bankTransaction.amount,
        reference: bankTransaction.description,
        document: bankTransaction.documentFileName,
        accountInfo: bankTransaction.accountInfo,
      })
    );
  };
  const getRibbonStyle = (totalPrice: number) => {
    if (totalPrice > 99) return "75px";
    if (totalPrice < -99) return "82px";
    return "65px";
  };
  const [mutations, setMutations] = useState<Record<number, MutationsModel>>(
    {}
  );
  const [loadingRows, setLoadingRows] = useState<Record<number, boolean>>({});

  const fetchMutations = async (routedRelation: any, id: number) => {
    let response;
    if (routedRelation.routingType.value === 4) {
      response = await getBookingMutationsById(routedRelation.id);
    } else if (routedRelation.routingType.value === 1) {
      response = await getCostMutationsById(routedRelation.id);
    } else if (routedRelation.routingType.value === 2) {
      response = await getInvoiceMutationsById(routedRelation.id);
    } else {
      return;
    }

    if (response.isValid && response.result.length > 0) {
      setMutations((prev) => ({
        ...prev,
        [id]: response,
      }));
      setLoadingRows((prev) => ({ ...prev, [id]: false }));
    }
  };
  const handleTabChange = (id: number, tab: string) => {
    setActiveTab((prev) => ({
      ...prev,
      [id]: tab,
    }));
  };

  return (
    <KTCardBody>
      <div className="row row-cols-1 row-cols-md-1 g-4">
        {bankTransactions?.result?.map(
          (bankTransaction: BankTransactionsResult) => {
            const isExpanded = expandedRows.includes(bankTransaction.id);
            return (
              <ListCard key={bankTransaction.id}>
                {bankTransaction.routedRelation !== null && (
                  <div
                    className="position-absolute text-muted fs-8 fw-bold"
                    style={{
                      top: "17px",
                      zIndex: 2,
                      right: getRibbonStyle(bankTransaction.amount),
                    }}
                  >
                    <i className="fa fas fa-share text-muted fs-7 me-2"></i>

                    <Tippy
                      content={
                        <span
                          dangerouslySetInnerHTML={{
                            __html: bankTransaction.routedRelation?.voucherNr,
                          }}
                        />
                      }
                    >
                      <span
                        className="cursor-pointer text-muted border border-muted rounded p-2"
                        onClick={() => {
                          setMutationId(bankTransaction.routedRelation.id);
                          setHasMutation(false);
                          if (
                            bankTransaction.routedRelation.routingType.value ===
                            4
                          ) {
                            setHasMutation(false);
                            setBookingModalOpen(true);
                          } else if (
                            bankTransaction.routedRelation.routingType.value ===
                            1
                          ) {
                            setHasMutation(false);
                            setCostModalOpen(true);
                          } else if (
                            bankTransaction.routedRelation.routingType.value ===
                            2
                          ) {
                            setHasMutation(false);
                            setInvoiceModalOpen(true);
                          }

                          // navigate(`/invoice/view/${bankTransaction.uniqueId}`);
                        }}
                        dangerouslySetInnerHTML={{
                          __html: bankTransaction.routedRelation?.description,
                        }}
                      />
                    </Tippy>
                  </div>
                )}

                {/* <div
                    className="ribbon ribbon-top position-absolute"
                    style={{
                      left: "60%",
                      transform: "translateX(-50%)",
                      height: "20px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <small
                      className={`ribbon-label fw-bold ${getStatusClass(
                        bankTransaction?.processStatusType?.value
                      )}  text-white
                      }`}
                    >
                      {getEnumOptions(
                        enums.TransactionsItemProcessStatusTypes,
                        intl
                      )
                        .find(
                          (item) =>
                            item.value ===
                            bankTransaction?.processStatusType.value
                        )
                        ?.label.toLowerCase()}
                    </small>
                  </div> */}
                {bankTransaction?.processStatusType?.value === 64 ? (
                  <Tippy content={"enable/disable automatic processing"}>
                    <div
                      className="ribbon ribbon-start ribbon-clip position-absolute cursor-pointer"
                      style={{
                        top: "10px",
                        height: "30px",
                        minWidth: "400px",
                        left: "0px",
                      }}
                      onClick={() => {
                        changeState(
                          bankTransaction.id,
                          !bankTransaction?.excludeFromAutoProcessing
                        );
                      }}
                    >
                      <div
                        className={`ribbon-label fw-bold ${
                          bankTransaction.excludeFromAutoProcessing
                            ? "bg-secondary text-dark"
                            : "bg-dark text-white"
                        }`}
                      >
                        <i
                          className={`${getIcon(
                            bankTransaction?.processStatusType?.value
                          )} ${
                            bankTransaction.excludeFromAutoProcessing
                              ? "text-dark"
                              : "text-white"
                          } 
                           me-1`}
                        ></i>
                        {getEnumOptions(
                          enums.TransactionsItemProcessStatusTypes,
                          intl
                        )
                          .find(
                            (item) =>
                              item.value ===
                              bankTransaction?.processStatusType.value
                          )
                          ?.label.toLowerCase()}

                        <span
                          className={`ribbon-inner ${
                            bankTransaction.excludeFromAutoProcessing
                              ? "bg-secondary text-dark"
                              : "bg-dark text-dark"
                          } `}
                        ></span>
                      </div>
                    </div>
                  </Tippy>
                ) : (
                  <div
                    className="ribbon ribbon-start ribbon-clip position-absolute"
                    style={{
                      top: "10px",
                      height: "30px",
                      minWidth: "400px",
                      left: "0px",
                    }}
                  >
                    <div className="ribbon-label fw-bold">
                      <i
                        className={`${getIcon(
                          bankTransaction?.processStatusType?.value
                        )} me-1`}
                      ></i>
                      {getEnumOptions(
                        enums.TransactionsItemProcessStatusTypes,
                        intl
                      )
                        .find(
                          (item) =>
                            item.value ===
                            bankTransaction?.processStatusType.value
                        )
                        ?.label.toLowerCase()}

                      <span
                        className={`ribbon-inner ${getStatusClass(
                          bankTransaction?.processStatusType?.value
                        )}  `}
                      ></span>
                    </div>
                  </div>
                )}

                {/* <div
                  className="position-absolute"
                  style={{
                    left: "55%",
                    transform: "translateX(-50%)",
                    whiteSpace: "nowrap",
                    top: "-8px",
                  }}
                >
                  <small
                    className={`ribbon-label fw-bold ${getStatusClass(
                      bankTransaction?.processStatusType?.value
                    )}  text-white p-2 rounded
                      }`}
                  >
                    {getEnumOptions(
                      enums.TransactionsItemProcessStatusTypes,
                      intl
                    )
                      .find(
                        (item) =>
                          item.value ===
                          bankTransaction?.processStatusType.value
                      )
                      ?.label.toLowerCase()}
                  </small>
                </div> */}
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
                    {!bankTransaction.isDebet && "-"}
                    {
                      currentUser?.result.activeCompanyDefaults.defaultValuta
                        .sign
                    }
                    {bankTransaction.amount.toFixed(2)}
                    <span className="ribbon-inner bg-gray-600"></span>
                  </div>
                </div>

                <div className="card-body pb-7">
                  <div className="d-flex flex-row flex-wrap fs-8 gap-4 align-items-center justify-content-between pt-7 position-relative">
                    <div
                      className="position-absolute"
                      style={{ left: "-28px" }}
                    >
                      <button
                        className="btn btn-icon btn-sm"
                        onClick={() => {
                          if (!expandedRows.includes(bankTransaction.id)) {
                            toggleRow(bankTransaction.id);
                            if (bankTransaction.routedRelation) {
                              setMutationId(bankTransaction.id);
                              fetchMutations(
                                bankTransaction.routedRelation,
                                bankTransaction.id
                              );
                              fetchAttachments(bankTransaction.routedRelation);
                            }
                          } else {
                            toggleRow(bankTransaction.id);
                          }
                        }}
                      >
                        {expandedRows.includes(bankTransaction.id) ? (
                          <i className="ki-duotone ki-double-up text-primary fs-3">
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
                      details={TRANSACTION_DETAILS(bankTransaction, intl)}
                      intl={intl}
                    />

                    <div className="d-flex align-items-center">
                      {/* <button
                        className="btn btn-icon btn-light btn-sm"
                        onClick={() => {
                          if (!expandedRows.includes(bankTransaction.id)) {
                            toggleRow(bankTransaction.id);
                            if (bankTransaction.routedRelation) {
                              setMutationId(bankTransaction.id);
                              fetchMutations(
                                bankTransaction.routedRelation,
                                bankTransaction.id
                              );
                              fetchAttachments(bankTransaction.routedRelation);
                            }
                          } else {
                            toggleRow(bankTransaction.id);
                          }
                        }}
                      >
                        {expandedRows.includes(bankTransaction.id) ? (
                          <i className="ki-duotone ki-double-up text-primary fs-1">
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
                      {/* {bankTransaction.actions.canAddAttachments && (
                        <> */}
                      {(bankTransaction.processStatusType.value === 2 ||
                        bankTransaction.processStatusType.value === 8) && (
                        <Tippy
                          content={intl.formatMessage({
                            id: "Fields.ActionUploadFiles",
                          })}
                        >
                          <button
                            className="btn btn-icon btn-light btn-sm ms-4"
                            onClick={() => {
                              openAttachmentsModal(bankTransaction.id);
                            }}
                          >
                            <i className="fa-solid fa-cloud-arrow-up text-primary me-2 fs-3"></i>
                          </button>
                        </Tippy>
                      )}
                      {/* </>
                      )} */}
                      {bankTransaction.actions.canBeRestoreToAwaiting && (
                        <Tippy
                          content={intl.formatMessage({
                            id: "Fields.ActionRestoreMutation",
                          })}
                        >
                          <button
                            className="btn btn-icon btn-light btn-sm ms-4"
                            onClick={() => handleRestore(bankTransaction.id)}
                          >
                            <i className="ki-solid ki-arrows-circle text-warning fs-2" />
                          </button>
                        </Tippy>
                      )}
                      {bankTransaction.actions.canBeBooked && (
                        <Tippy
                          content={intl.formatMessage({
                            id: "Fields.ActionRouteMutation",
                          })}
                        >
                          <button
                            className="btn btn-icon btn-light btn-sm ms-4"
                            id="kt_drawer_process_toggle"
                            onClick={() => valueSetter(bankTransaction)}
                          >
                            <i className="ki-duotone ki-fasten text-success fs-2">
                              <span className="path1"></span>
                              <span className="path2"></span>
                            </i>
                          </button>
                        </Tippy>
                      )}
                      {(bankTransaction.processStatusType.value === 2 ||
                        bankTransaction.processStatusType.value === 8) && (
                        <Tippy
                          content={intl.formatMessage({
                            id: "Fields.ActionUnlinkMutation",
                          })}
                        >
                          <button
                            className="btn btn-icon btn-light btn-sm ms-4"
                            onClick={() => openUnlinkmodal(bankTransaction)}
                          >
                            <KTIcon
                              iconName="disconnect"
                              className="fs-2 text-danger"
                            />
                          </button>
                        </Tippy>
                      )}

                      {bankTransaction.actions.canBeDeleted && (
                        <Tippy
                          content={intl.formatMessage({
                            id: "Fields.ToolTipDelete",
                          })}
                        >
                          <button
                            className="btn btn-icon btn-light btn-sm ms-4"
                            onClick={() => handleDelete(bankTransaction.id)}
                          >
                            <i className="ki-solid ki-trash text-danger fs-2" />
                          </button>
                        </Tippy>
                      )}
                    </div>
                  </div>

                  {/* <div className="d-flex justify-content-between mt-6 align-items-center">
                    {bankTransaction.description && (
                        <div>
                          <span className="text-gray-400 fs-8">
                            {bankTransaction.description}
                          </span>
                        </div>
                      )}
                  </div> */}
                  {isExpanded && (
                    <ExpandedRows
                      attachments={attachments}
                      mutations={mutations}
                      activeTab={activeTab}
                      handleTabChange={handleTabChange}
                      activities={[]}
                      setDownloadUrl={setDownloadUrl}
                      setKey={setKey}
                      id={bankTransaction.id}
                      loadingRows={loadingRows}
                      documentFileName={bankTransaction.documentFileName}
                      description={bankTransaction.description}
                      rule={bankTransaction.automationRoutingInfo?.ruleTitle}
                    />
                  )}
                </div>
              </ListCard>
            );
          }
        )}

        {bankTransactions?.result?.length == 0 && <NoItemsPage />}
        {isLoading && <ListLoading />}
      </div>

      {bankTransactions && bankTransactions.result?.length > 0 && (
        <ListPagination
          totalPages={bankTransactions.totalPages}
          pageIndex={pageIndex}
          onPageChange={handlePageChange}
          totalItems={bankTransactions.totalRows}
          moduleName="transaction-module"
        />
      )}
    </KTCardBody>
  );
};

export { TransactionList };
