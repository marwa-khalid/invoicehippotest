import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { BookingRuleModel, BookingRuleResult } from "../core/_models";
import {
  callAutoRouteCount,
  changeStatus,
  copyBookingRule,
  getBookingRules,
  restoreTransaction,
} from "../core/_requests";
import { ListLoading } from "../../../../../generic/ListLoading";
import {
  KTCardBody,
  KTIcon,
  KTSVG,
} from "../../../../../../../_metronic/helpers";
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
  setDeleteModalOpen: (type: boolean) => void;
  refresh: boolean;
  setPageIndex: (type: number) => void;
  pageIndex: number;
  searchCounter: number;
  financialAccountId: number;
  clientIdForFilter: number | null;
  balanceType: number;
  setRefresh: (type: boolean) => void;
  setBookingRules: React.Dispatch<
    React.SetStateAction<BookingRuleModel | undefined>
  >;
  bookingRules: BookingRuleModel | undefined;
  setHasMutation: (type: boolean) => void;
  setAddModalOpen: (type: boolean) => void;
  setEditModalId: (type: number) => void;
}
const BookingRuleList = ({
  searchTerm,
  setTotalRows,
  setDeleteModalOpen,
  setAddModalOpen,
  setEditModalId,
  searchCounter,
  refresh,
  setPageIndex,
  pageIndex,
  financialAccountId,
  clientIdForFilter,
  balanceType,
  setRefresh,
  setBookingRules,
  bookingRules,
  setHasMutation,
}: ComponentProps) => {
  const intl = useIntl();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchBookingRules = async () => {
    setIsLoading(true);

    let dateRange;
    try {
      const response = await getBookingRules(
        pageIndex,
        searchTerm,
        clientIdForFilter,
        financialAccountId,
        balanceType
      );
      if (response.isValid) {
        setBookingRules(response);
        setTotalRows(response.totalRows);
        setIsLoading(false);
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

  useEffect(() => {
    fetchBookingRules();
  }, [
    financialAccountId,
    clientIdForFilter,
    balanceType,
    pageIndex,
    searchCounter,
    refresh,
  ]);

  const handleDelete = async (bookingRule: BookingRuleResult) => {
    setEditModalId(bookingRule.id);
    valueSetter(bookingRule);
    setDeleteModalOpen(true);
  };
  const copyRule = async (id: number) => {
    try {
      const res = await copyBookingRule(id);
      if (res.isValid) {
        handleToast(res);
        setRefresh(!refresh);
      }
    } catch {}
  };

  const handleRestore = async (id: number) => {
    try {
      const res = await restoreTransaction(id);
      if (res.isValid) {
        // setBookingRules((prev) => {
        //   if (!prev) return prev; // if undefined, return as is
        //   return {
        //     ...prev,
        //     result: prev.result.map((item) =>
        //       item.id === res.result.id ? res.result : item
        //     ),
        //   };
        // });
      }
      handleToast(res);
    } catch {}
  };

  const valueSetter = (bankTransaction: BookingRuleResult) => {
    setEditModalId(bankTransaction.id);
    localStorage.setItem(
      "ModalData",
      JSON.stringify({
        title: bankTransaction.title,
        accounts: bankTransaction.associatedAccounts,
        holders: bankTransaction.associatedAccountHolders,
      })
    );
  };

  const openEditModal = (bankTransaction: BookingRuleResult) => {
    valueSetter(bankTransaction);
    setAddModalOpen(true);
  };
  const renderLockIcon = (isChecked: boolean) => {
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
    <KTCardBody>
      <div className="row row-cols-1 row-cols-md-1 g-4">
        {
          // !isLoading &&
          bookingRules?.result?.map((bookingRule: BookingRuleResult) => (
            <div className="card" key={bookingRule.id}>
              <div className="card-body">
                {/* First Row: Checkbox, Divider, Value */}
                <div className="d-flex align-items-center justify-content-between mb-1">
                  <div
                    className="d-flex align-items-center gap-3 cursor-pointer title-clickable"
                    onClick={() => {
                      openEditModal(bookingRule);
                    }}
                  >
                    <>
                      {renderLockIcon(bookingRule.isActive)}
                      <span className="mx-2 text-muted">|</span>
                    </>
                    <strong>{bookingRule.title}</strong>
                  </div>
                  <div className="align-items-center my-lg-0 my-1 necessary-icons">
                    <Tippy
                      content={intl.formatMessage({
                        id: "Fields.ToolTipEdit",
                      })}
                    >
                      <button
                        className="btn btn-icon btn-light btn-sm me-4"
                        onClick={() => {
                          openEditModal(bookingRule);
                        }}
                      >
                        <i className="ki-solid ki-pencil text-warning fs-2 "></i>
                      </button>
                    </Tippy>

                    <Tippy
                      content={intl.formatMessage({
                        id: "Fields.ActionCopy",
                      })}
                    >
                      <button
                        className="btn btn-icon btn-light btn-sm me-4"
                        onClick={() => {
                          copyRule(bookingRule.id);
                        }}
                      >
                        <i className="ki-duotone ki-copy text-info fs-2"></i>
                      </button>
                    </Tippy>

                    <Tippy
                      content={intl.formatMessage({
                        id: "Fields.ToolTipDelete",
                      })}
                    >
                      <button
                        className="btn btn-icon btn-light btn-sm"
                        onClick={() => {
                          handleDelete(bookingRule);
                        }}
                      >
                        <i className="ki-solid ki-trash text-danger fs-2"></i>
                      </button>
                    </Tippy>
                  </div>
                </div>

                <ul className="breadcrumb breadcrumb-secondary breadcrumb-dot mb-3 text-muted">
                  <li className="breadcrumb-item">
                    <small className="rounded p-1 text-white bg-gray-500 px-2 fw-bold fs-9">
                      {intl
                        .formatMessage({ id: "Fields.FilterByTerm" })
                        .toLowerCase()}
                      : {bookingRule.filterTerm1}
                    </small>
                  </li>
                  {bookingRule.filterTerm2 && (
                    <li className="breadcrumb-item">
                      <small className="rounded p-1 text-white bg-gray-500 px-2 fw-bold fs-9">
                        {intl
                          .formatMessage({ id: "Fields.FilterByTerm" })
                          .toLowerCase()}
                        : {bookingRule.filterTerm2}
                      </small>
                    </li>
                  )}
                  {bookingRule.filterAmount > 0 && (
                    <li className="breadcrumb-item">
                      <small className="rounded p-1 text-white bg-gray-500 px-2 fw-bold fs-9">
                        {intl
                          .formatMessage({ id: "Fields.FilterAmount" })
                          .toLowerCase()}
                        : {bookingRule.filterAmount.toFixed(2)}
                      </small>
                    </li>
                  )}
                  {bookingRule.clientCompanyName && (
                    <li className="breadcrumb-item">
                      <small className="rounded p-1 text-white bg-gray-500 px-2 fw-bold fs-9">
                        {intl.formatMessage({ id: "Fields.CompanyName" })}:{" "}
                        {bookingRule.clientCompanyName}
                      </small>
                    </li>
                  )}
                </ul>
                {/* separator Line */}

                <div className="separator separator-solid mb-3"></div>

                <div className="d-flex flex-row flex-wrap fs-8 gap-4 mt-3 align-items-center justify-content-between position-relative">
                  <DetailsCard
                    details={TRANSACTION_DETAILS(bookingRule, intl)}
                    intl={intl}
                  />
                </div>
              </div>
            </div>
          ))
        }

        {bookingRules?.result?.length == 0 && <NoItemsPage />}
        {isLoading && <ListLoading />}
      </div>

      {bookingRules && bookingRules.result?.length > 0 && (
        <ListPagination
          totalPages={bookingRules.totalPages}
          pageIndex={pageIndex}
          onPageChange={handlePageChange}
          totalItems={bookingRules.totalRows}
          moduleName="rule-module"
        />
      )}
    </KTCardBody>
  );
};

export { BookingRuleList };
