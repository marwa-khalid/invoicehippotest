import React, { useEffect, useState } from "react";
import { getNotificationCycle } from "../core/_requests";
import { NotificationSearchResult } from "../core/_models";
import { ListLoading } from "../../../generic/ListLoading";
import { KTCardBody } from "../../../../../_metronic/helpers";
import { useIntl } from "react-intl";
import { toAbsoluteUrl } from "../../../../../_metronic/helpers";
import { KTSVG } from "../../../../../_metronic/helpers";
import Tippy from "@tippyjs/react";
import { ListPagination } from "../../../generic/ListPagination";
interface ComponentProps {
  searchTerm: string;
  areaUsageType: number;
  setTotalRows: (type: number) => void;
  setAddModalOpen: (type: boolean) => void;
  setEditModalId: (type: number) => void;
  setNotificationTitle: (type: string) => void;
  setDeleteModalOpen: (type: boolean) => void;
  refresh: boolean;
  setPageIndex: (type: number) => void;
  pageIndex: number;
  searchCounter: number;
}
const RemindersList = ({
  searchTerm,
  areaUsageType,
  setTotalRows,
  setAddModalOpen,
  setEditModalId,
  setNotificationTitle,
  setDeleteModalOpen,
  refresh,
  setPageIndex,
  pageIndex,
  searchCounter,
}: ComponentProps) => {
  const [notificationCycles, setNotificationCycles] = useState<any>([]);

  const intl = useIntl();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // const [pageIndex, setPageIndex] = useState<number>(1);

  const fetchLedgers = async () => {
    setIsLoading(true);

    try {
      const response = await getNotificationCycle(
        pageIndex,
        searchTerm,
        areaUsageType
      );

      if (response.isValid) {
        setNotificationCycles(response);
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
    fetchLedgers();
  }, [searchTerm, areaUsageType, pageIndex, searchCounter, refresh]);

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
  const openEditModal = (id: number) => {
    setEditModalId(id);
    setAddModalOpen(true);
  };

  const openDeleteModal = (id: number, title: string) => {
    setEditModalId(id);
    setDeleteModalOpen(true);
    setNotificationTitle(title);
  };
  return (
    <KTCardBody className="py-4">
      <div className="row row-cols-1 row-cols-md-1 g-4">
        {
          // !isLoading &&
          notificationCycles?.result?.map(
            (notification: NotificationSearchResult) => (
              <div className="col" key={notification.id}>
                <div className="card h-100 py-6 ">
                  <div className="card-body">
                    {/* First Row: Checkbox, Divider, Value */}
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <div
                        className="d-flex align-items-center gap-3 cursor-pointer title-clickable"
                        onClick={() => {
                          openEditModal(notification.id);
                        }}
                      >
                        <>
                          {renderLockIcon(notification.isDefault)}
                          <span className="mx-2 text-muted">|</span>
                        </>
                        <strong>{notification.title}</strong>
                      </div>
                      <div className="align-items-center my-lg-0 my-1 necessary-icons">
                        {notification.actions.canEdit && (
                          <Tippy
                            content={intl.formatMessage({
                              id: "Fields.ToolTipEdit",
                            })}
                          >
                            <button
                              className="btn btn-icon btn-light btn-sm me-4"
                              onClick={() => {
                                openEditModal(notification.id);
                              }}
                            >
                              <i className="ki-solid ki-pencil text-warning fs-2 ">
                                {/* <span className="path1"></span>
                          <span className="path2"></span> */}
                              </i>
                            </button>
                          </Tippy>
                        )}

                        {notification.actions.canDelete && (
                          <Tippy
                            content={intl.formatMessage({
                              id: "Fields.ToolTipDelete",
                            })}
                          >
                            <button
                              className="btn btn-icon btn-light btn-sm"
                              onClick={() => {
                                openDeleteModal(
                                  notification.id,
                                  notification.title
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
                    {/* separator Line */}

                    <div className="separator separator-solid mb-3"></div>

                    {/* Verkoopfacturen Text */}

                    <div className="text-muted">
                      <small className="mb-4">
                        {notification.areaUsageType.name}
                      </small>

                      <div className="d-flex flex-row flex-wrap fs-8 gap-4">
                        {/* {/* Small Image and Ledger Account + Title */}
                        <div className="d-flex align-items-center flex-wrap">
                          {notification.hasActiveReminder1 ? (
                            <i className="ki-duotone ki-check fs-3x text-success "></i>
                          ) : (
                            <i className="ki-duotone ki-check fs-3x text-danger "></i>
                          )}
                          <div className="d-flex flex-column mx-6">
                            <span className="fs-sm text-muted">
                              {intl.formatMessage({
                                id: "Fields.TabReminder1",
                              })}
                            </span>
                          </div>
                        </div>

                        <span className="ms-2 h-37px bg-gray-400 w-1px me-6 "></span>
                        <div className="d-flex align-items-center flex-wrap">
                          {notification.hasActiveReminder2 ? (
                            <i className="ki-duotone ki-check fs-3x text-success "></i>
                          ) : (
                            <i className="ki-duotone ki-check fs-3x text-danger "></i>
                          )}
                          <div className="d-flex flex-column mx-6">
                            <span className="fs-sm text-muted">
                              {intl.formatMessage({
                                id: "Fields.TabReminder2",
                              })}
                            </span>
                          </div>
                        </div>

                        <span className="ms-2 h-37px bg-gray-400 w-1px me-6 "></span>
                        <div className="d-flex align-items-center flex-wrap">
                          {notification.hasActiveReminder3 ? (
                            <i className="ki-duotone ki-check fs-3x text-success "></i>
                          ) : (
                            <i className="ki-duotone ki-check fs-3x text-danger "></i>
                          )}
                          <div className="d-flex flex-column mx-6">
                            <span className="fs-sm text-muted">
                              {intl.formatMessage({
                                id: "Fields.TabReminder3",
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          )
        }

        {notificationCycles?.result?.length == 0 && (
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

      {notificationCycles?.result?.length > 0 && (
        <ListPagination
          totalPages={notificationCycles.totalPages}
          pageIndex={notificationCycles.pageIndex}
          onPageChange={handlePageChange}
          totalItems={notificationCycles.totalRows}
          moduleName="notifications-module"
        />
      )}
    </KTCardBody>
  );
};

export { RemindersList };
