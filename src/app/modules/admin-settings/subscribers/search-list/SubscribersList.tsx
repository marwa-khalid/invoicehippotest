import { useEffect, useState } from "react";
import { getSubscribers } from "../core/_requests";
import { SubscriberResult } from "../core/_models";
import { ListLoading } from "../../../generic/ListLoading";
import { KTCardBody, KTIcon } from "../../../../../_metronic/helpers";
import { useIntl } from "react-intl";
import { toAbsoluteUrl } from "../../../../../_metronic/helpers";
import { KTSVG } from "../../../../../_metronic/helpers";
import Tippy from "@tippyjs/react";
import { ListPagination } from "../../../generic/ListPagination";
import { getDateRange, parseDate } from "../../../../utils/dateUtils";
import DetailsCard from "../../../generic/ListElements/DetailsCard";
import { SUBSCRIBER_DETAILS } from "../utils/subscriberDetails";
import { handleToast } from "../../../auth/core/_toast";
import { switchCompany } from "../../../auth/core/_requests";
import { useAuth } from "../../../auth";
import { useNavigate } from "react-router";
import ListCard from "../../../generic/ListElements/ListCard";
interface ComponentProps {
  searchTerm: string;
  periodValueType: number | null;
  year: number | null;
  setTotalRows: (type: number) => void;
  setEditModalId: (type: number) => void;
  setSubscriberTitle: (type: string) => void;
  setDeleteModalOpen: (type: boolean) => void;
  refresh: boolean;
  setPageIndex: (type: number) => void;
  pageIndex: number;
  searchCounter: number;
}
const SubscribersList = ({
  searchTerm,
  periodValueType,
  year,
  setTotalRows,
  setEditModalId,
  setSubscriberTitle,
  setDeleteModalOpen,
  refresh,
  setPageIndex,
  pageIndex,
  searchCounter,
}: ComponentProps) => {
  const [subscribers, setSubscribers] = useState<any>([]);
  const navigate = useNavigate();
  const intl = useIntl();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // const [pageIndex, setPageIndex] = useState<number>(1);
  const { currentUser, saveAuth } = useAuth();
  const [selectedSubscriberId, setSelectedSubscriberId] = useState<
    number | null
  >(null);
  const [companyOptions, setCompanyOptions] = useState<any[]>([]);
  const [showCompanyModal, setShowCompanyModal] = useState<boolean>(false);

  const handleTakeOver = (subscriberId: number, companies: any[]) => {
    if (companies.length === 1) {
      takeOver(subscriberId, companies[0].id);
    } else {
      setSelectedSubscriberId(subscriberId);
      setCompanyOptions(companies);
      setShowCompanyModal(true);
    }
  };

  const takeOver = async (subscriberId: number, companyId: number) => {
    try {
      const auth = await switchCompany(subscriberId, companyId);

      if (auth.isValid) {
        saveAuth(auth);
        window.location.href = "/dashboard"; // redirect with new token registered
      }
      handleToast(auth);
    } catch (error) {
      handleToast({ isValid: false, message: "Takeover failed." });
    }
  };

  const fetchSubscribers = async () => {
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
      const response = await getSubscribers(
        pageIndex,
        searchTerm,
        25,
        dateRange
      );

      if (response.isValid) {
        setSubscribers(response);
        setTotalRows(response.totalRows);
      }
    } catch (error) {
      console.error("Error fetching VAT types:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const handlePageChange = (page: number) => {
    setPageIndex(page);
  };

  useEffect(() => {
    fetchSubscribers();
  }, [searchTerm, periodValueType, pageIndex, searchCounter, refresh]);

  const renderLockIcon = (isChecked: boolean) => {
    return isChecked ? (
      <Tippy
        content={intl.formatMessage({
          id: "Fields.IsDefault",
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
          id: "Fields.IsDefault",
        })}
      >
        <span>
          <KTSVG
            path="media/icons/duotune/general/gen037.svg"
            className="svg-icon-warning svg-icon-2x"
          />
        </span>
      </Tippy>
    );
  };
  // const openEditModal = (id: number) => {
  //   setEditModalId(id);
  //   setAddModalOpen(true);
  // };

  const openDeleteModal = (id: number, title: string) => {
    setEditModalId(id);
    setDeleteModalOpen(true);
    setSubscriberTitle(title);
  };

  const goToDetailPage = (subscriber: SubscriberResult) => {
    navigate(`/admin/subscriber/detail/${subscriber.uniqueId}`);
  };
  return (
    <KTCardBody className="py-4">
      <div className="row row-cols-1 row-cols-md-1 g-4">
        {
          // !isLoading &&
          subscribers?.result?.map((subscriber: SubscriberResult) => (
            <ListCard key={subscriber.id}>
              <div className="card-body pt-0 pb-1">
                {/* First Row: Checkbox, Divider, Value */}
                <div className="d-flex flex-column mb-3 gap-1">
                  <strong
                    className="fs-2 cursor-pointer"
                    onClick={() => goToDetailPage(subscriber)}
                  >
                    {subscriber.billingContact}
                  </strong>
                  <span className="text-muted">
                    {subscriber.billingContactEmailAddress}
                  </span>
                  <span className="text-muted">
                    {subscriber.lastActiveLicense.licenseType.description}
                  </span>
                </div>
                {/* separator Line */}

                <div className="separator separator-solid mb-3"></div>
                <div className="d-flex flex-row flex-wrap fs-8 gap-4 my-5 align-items-center justify-content-between">
                  <DetailsCard
                    details={SUBSCRIBER_DETAILS(subscriber, intl)}
                    intl={intl}
                  />
                </div>
                <div className="separator separator-solid mb-3"></div>

                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div className="d-flex align-items-center gap-2">
                    <KTIcon className="fs-1" iconName="burger-menu-4" />
                    <span className="text-muted fs-sm">{subscriber.id}</span>
                  </div>

                  <div className="d-flex gap-3">
                    {subscriber.actions.canTakeOver && (
                      <Tippy
                        content={intl.formatMessage({
                          id: "Fields.ActionTakeOver",
                        })}
                      >
                        <button
                          className="btn btn-icon btn-light btn-sm"
                          onClick={() =>
                            handleTakeOver(subscriber.id, subscriber.companies)
                          }
                        >
                          <i className="ki-duotone ki-rocket text-warning fs-1">
                            <span className="path1"></span>
                            <span className="path2"></span>
                          </i>
                        </button>
                      </Tippy>
                    )}
                    {/* {subscriber.actions.canEdit && (
                        <Tippy
                          content={intl.formatMessage({
                            id: "Fields.ToolTipEdit",
                          })}
                        >
                          <button
                            className="btn btn-icon btn-light btn-sm me-4"
                            onClick={() => {
                              openEditModal(subscriber.id);
                            }}
                          >
                            <i className="ki-solid ki-pencil text-warning fs-2"></i>
                          </button>
                        </Tippy>
                      )} */}
                    {subscriber.actions.canDelete && (
                      <Tippy
                        content={intl.formatMessage({
                          id: "Fields.ToolTipDelete",
                        })}
                      >
                        <button
                          className="btn btn-icon btn-light btn-sm"
                          onClick={() => {
                            openDeleteModal(
                              subscriber.id,
                              subscriber.billingContact
                            );
                          }}
                        >
                          <i className="ki-solid ki-trash text-danger fs-2">
                            {/* <span className="path1"></span>
                          <span className="path2"></span>
                          <span className="path3"></span>
                          <span className="path4"></span>
                          <span className="path5"></span> */}
                          </i>
                        </button>
                      </Tippy>
                    )}
                  </div>
                </div>
              </div>
            </ListCard>
          ))
        }

        {subscribers?.result?.length == 0 && (
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
      {showCompanyModal && (
        <>
          <div className="modal fade show d-block" tabIndex={-1} role="dialog">
            <div
              className="modal-dialog modal-dialog-centered"
              style={{ maxWidth: "300px" }}
            >
              <div className="modal-content">
                <div className="modal-header bg-warning d-flex justify-content-between">
                  <h5 className="modal-title text-white">Select a Company</h5>
                  <div
                    className="btn btn-icon btn-sm btn-color-white ms-2"
                    data-bs-dismiss="modal"
                    onClick={() => setShowCompanyModal(false)}
                    aria-label="Close"
                  >
                    <i className="ki-duotone ki-cross fs-1">
                      <span className="path1"></span>
                      <span className="path2"></span>
                    </i>
                  </div>
                </div>
                <div className="modal-body">
                  {companyOptions.map((company) => (
                    <div
                      key={company.id}
                      className="d-flex justify-content-between align-items-center mb-2 border-bottom pb-2"
                    >
                      <span>{company.name}</span>
                      <button
                        className="btn btn-icon btn-sm"
                        onClick={() => {
                          setShowCompanyModal(false);
                          if (selectedSubscriberId) {
                            takeOver(selectedSubscriberId, company.id);
                          }
                        }}
                      >
                        <i className="ki-duotone ki-rocket text-warning fs-1">
                          <span className="path1"></span>
                          <span className="path2"></span>
                        </i>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}

      {subscribers?.result?.length > 0 && (
        <ListPagination
          totalPages={subscribers.totalPages}
          pageIndex={subscribers.pageIndex}
          onPageChange={handlePageChange}
          totalItems={subscribers.totalRows}
          moduleName="subscriber-module"
        />
      )}
    </KTCardBody>
  );
};

export { SubscribersList };
