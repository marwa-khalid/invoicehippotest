import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  ActivitiesModel,
  AttachmentsResult,
  MutationsModel,
} from "../core/_models";
import { getBookingActivitiesById, getBookings } from "../core/_requests";
import { ListLoading } from "../../../../generic/ListLoading";
import { KTCardBody } from "../../../../../../_metronic/helpers";
import { useIntl } from "react-intl";
import Tippy from "@tippyjs/react";
import { ListPagination } from "../../../../generic/ListPagination";
import { getDateRange, parseDate } from "../../../../../utils/dateUtils";
import DetailsCard from "../../../../generic/ListElements/DetailsCard";
import { BOOKING_DETAILS } from "../../utils/bookingDetails";
import ListCard from "../../../../generic/ListElements/ListCard";
import { NoItemsPage } from "../../../../generic/NoItemsPage";
import { BookingsResult } from "../core/_models";
import { getBookingMutationsById } from "../core/_requests";
import { useAuth } from "../../../../auth";
import { ExpandedRows } from "../../../../generic/ExpandedRows";
interface ComponentProps {
  searchTerm: string;
  setTotalRows: (type: number) => void;
  setAddModalOpen: (type: boolean) => void;
  setEditModalId: (type: number) => void;
  setDeleteModalOpen: (type: boolean) => void;
  setDownloadUrl: (type: string) => void;
  refresh: boolean;
  isModal?: boolean;
  setPageIndex: (type: number) => void;
  pageIndex: number;
  searchCounter: number;
  periodValueType: number | null;
  paymentSourceType: number;
  attachmentType: number;
  clientIdForFilter: number | null;
  year: number | null;
  setAttachmentsModalOpen: (type: boolean) => void;
  attachments: Record<number, AttachmentsResult[]>;
  fetchAttachments: (type: number) => void;
  setBookingId?: (type: number) => void;
  setKey: Dispatch<SetStateAction<number>>;
}
const BookingsList = ({
  searchTerm,
  setTotalRows,
  setAddModalOpen,
  setEditModalId,
  setDeleteModalOpen,
  setDownloadUrl,
  searchCounter,
  refresh,
  paymentSourceType,
  attachmentType,
  setPageIndex,
  pageIndex,
  periodValueType,
  clientIdForFilter,
  year,
  setAttachmentsModalOpen,
  attachments,
  fetchAttachments,
  isModal,
  setBookingId,
  setKey,
}: ComponentProps) => {
  const [bookings, setBookings] = useState<any>([]);
  const intl = useIntl();
  const [isListLoading, setIsListLoading] = useState<boolean>(false);
  const [loadingRows, setLoadingRows] = useState<Record<number, boolean>>({});

  const fetchBookings = async () => {
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
      setIsListLoading(true);
      const response = await getBookings(
        searchTerm,
        pageIndex,
        25,
        clientIdForFilter,
        dateRange,
        attachmentType,
        paymentSourceType
      );

      if (response.isValid) {
        setBookings(response);
        setTotalRows(response.totalRows);
      }
    } finally {
      setIsListLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setPageIndex(page);
  };
  useEffect(() => {
    fetchBookings();
  }, [
    searchTerm,
    searchCounter,
    refresh,
    pageIndex,
    clientIdForFilter,
    attachmentType,
    paymentSourceType,
  ]);

  const openEditModal = (id: number) => {
    setEditModalId(id);
    setAddModalOpen(true);
  };
  const openDeleteModal = (booking: any) => {
    setDeleteModalOpen(true);
    valueSetter(booking);
  };
  const openAttachmentsModal = (id: number) => {
    setEditModalId(id);
    setAttachmentsModalOpen(true);
  };

  const { currentUser } = useAuth();

  const valueSetter = (booking: any) => {
    setEditModalId(booking.id);
    localStorage.setItem(
      "ModalData",
      JSON.stringify({
        bookingDateAsString: booking.bookingDateAsString,
        client: booking.client,
        amount: booking.amount,
        sign: currentUser?.result.activeCompanyDefaults.defaultValuta.sign,
        voucherNr: booking.voucherNr,
        hasAttachments: booking.hasAttachments,
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
    const response = await getBookingMutationsById(id);
    if (response.isValid && response.result.length > 0) {
      setMutations((prev) => ({
        ...prev,
        [id]: response,
      }));
    }
  };

  const fetchActionHistory = async (id: number) => {
    const response = await getBookingActivitiesById(id);
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

    setActiveTab((prev) => ({
      ...prev,
      [id]: prev[id] || defaultTab,
    }));
  };
  return (
    <KTCardBody>
      <div className="row row-cols-1 row-cols-md-1 g-4">
        {
          // !isListLoading &&
          bookings?.result?.map((booking: BookingsResult) => (
            <ListCard key={booking.id}>
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
                <div className="ribbon-label fw-bold">
                  {currentUser?.result.activeCompanyDefaults.defaultValuta.sign}
                  {booking.amount.toFixed(2)}
                  <span className="ribbon-inner bg-gray-600"></span>
                </div>
              </div>

              <div
                className="ribbon ribbon-start ribbon-clip position-absolute cursor-pointer"
                style={{
                  top: "10px",
                  height: "30px",
                  minWidth: "200px",
                }}
                onClick={() => openEditModal(booking.id)}
              >
                <div className="ribbon-label fw-bold">
                  {booking.voucherNr}
                  <span className="ribbon-inner bg-gray-600"></span>
                </div>
              </div>

              <div className="card-body">
                {/* First Row: Client Name (Left) and Amount (Right) */}

                <div className="d-flex flex-row flex-wrap fs-8 gap-4 align-items-center justify-content-between position-relative">
                  <div className="position-absolute" style={{ left: "-28px" }}>
                    <button
                      className="btn btn-icon btn-sm"
                      onClick={() => {
                        if (!expandedRows.includes(booking.id)) {
                          // Only fetch data if it's being expanded
                          setLoadingRows((prev) => ({
                            ...prev,
                            [booking.id]: true,
                          }));
                          toggleRow(booking.id);
                          fetchMutations(booking.id);
                          fetchActionHistory(booking.id);
                          fetchAttachments(booking.id);
                        } else {
                          toggleRow(booking.id);
                        }
                      }}
                    >
                      {expandedRows.includes(booking.id) ? (
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
                    details={BOOKING_DETAILS(booking, intl)}
                    intl={intl}
                    openEditMode={() => openEditModal(booking.id)}
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
                            setBookingId && setBookingId(booking.id);
                          }}
                        >
                          <i className="ki-duotone ki-pin text-white fs-2">
                            <span className="path1"></span>
                            <span className="path2"></span>
                          </i>
                        </button>
                      </Tippy>
                    )}

                    {!isModal && booking.actions.canEdit && (
                      <Tippy
                        content={intl.formatMessage({
                          id: "Fields.ToolTipEdit",
                        })}
                      >
                        <button
                          className="btn btn-icon btn-light btn-sm me-4"
                          onClick={() => {
                            openEditModal(booking.id);
                          }}
                        >
                          <i className="ki-solid ki-pencil text-warning fs-2"></i>
                        </button>
                      </Tippy>
                    )}
                    {!isModal && (
                      <div className="btn-group drop-left">
                        <button
                          className="btn btn-icon btn-light btn-sm"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                          type="button"
                        >
                          <i className="fa fas fa-list-ul text-muted fs-3"></i>
                        </button>
                        <ul className="dropdown-menu w-content-fit py-4">
                          {booking?.actions.canAddAttachments && (
                            <li
                              onClick={() => {
                                openAttachmentsModal(booking.id);
                              }}
                            >
                              <a className="dropdown-item d-flex align-items-center cursor-pointer">
                                <i className="fa-solid fa-cloud-arrow-up text-primary me-2 fs-3"></i>
                                {intl.formatMessage({
                                  id: "Fields.ActionUploadFiles",
                                })}
                              </a>
                            </li>
                          )}

                          {booking?.actions.canDelete && (
                            <>
                              {booking?.actions.canAddAttachments && (
                                <div className="dropdown-divider border-gray-200"></div>
                              )}
                              <li
                                onClick={() => {
                                  openDeleteModal(booking);
                                }}
                              >
                                <a className="dropdown-item d-flex align-items-center cursor-pointer">
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
                    )}
                  </div>
                </div>
                {expandedRows.includes(booking.id) && (
                  <ExpandedRows
                    attachments={attachments}
                    activities={activities}
                    mutations={mutations}
                    activeTab={activeTab}
                    handleTabChange={handleTabChange}
                    setDownloadUrl={setDownloadUrl}
                    setKey={setKey}
                    id={booking.id}
                    loadingRows={loadingRows}
                  />
                )}
              </div>
            </ListCard>
          ))
        }

        {bookings?.result?.length == 0 && <NoItemsPage />}
        {isListLoading && <ListLoading />}
      </div>

      {bookings?.result?.length > 0 && (
        <ListPagination
          totalPages={bookings.totalPages}
          pageIndex={pageIndex}
          onPageChange={handlePageChange}
          totalItems={bookings.totalRows}
          moduleName="bookings-module"
        />
      )}
    </KTCardBody>
  );
};

export { BookingsList };
