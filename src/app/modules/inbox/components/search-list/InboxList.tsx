import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { InboxListResult } from "../core/_models";
import { getInboxes } from "../core/_requests";
import { ListLoading } from "../../../generic/ListLoading";
import { KTCardBody } from "../../../../../_metronic/helpers";
import { useIntl } from "react-intl";
import { ListPagination } from "../../../generic/ListPagination";
import { getDateRange, parseDate } from "../../../../utils/dateUtils";
import DetailsCard from "../../../generic/ListElements/DetailsCard";
import { INBOX_DETAILS } from "../../utils/inboxDetails";
import ListCard from "../../../generic/ListElements/ListCard";
import { NoItemsPage } from "../../../generic/NoItemsPage";
import Tippy from "@tippyjs/react";
interface ComponentProps {
  searchTerm: string;
  setTotalRows: (type: number) => void;
  setAddModalOpen: (type: boolean) => void;
  setEditModalId: (type: number) => void;
  setDeleteModalOpen: (type: boolean) => void;
  setDownloadUrl: (type: string) => void;
  refresh: boolean;
  setPageIndex: (type: number) => void;
  pageIndex: number;
  searchCounter: number;
  periodValueType: number | null;
  statusTypes: number;
  clientIdForFilter: number | null;
  year: number | null;
  setUnArchiveModalOpen: (type: boolean) => void;
  setLinkingModalOpen: (type: boolean) => void;
  setInboxData: (type: any) => void;
  setKey: Dispatch<SetStateAction<number>>;
}

const InboxList = ({
  searchTerm,
  setTotalRows,
  setDownloadUrl,
  setDeleteModalOpen,
  setUnArchiveModalOpen,
  setLinkingModalOpen,
  searchCounter,
  refresh,
  setPageIndex,
  pageIndex,
  periodValueType,
  statusTypes,
  clientIdForFilter,
  year,
  setInboxData,
  setKey,
}: ComponentProps) => {
  const [InboxLists, setInboxList] = useState<any>([]);
  const intl = useIntl();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchInboxs = async () => {
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
      const response = await getInboxes(
        searchTerm,
        pageIndex,
        dateRange,
        statusTypes
      );
      if (response.isValid) {
        setInboxList(response);
        setTotalRows(response.totalRows);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error fetching Inbox List:", error);
    } finally {
      setIsLoading(false);
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
    fetchInboxs();
  }, [
    searchTerm,
    pageIndex,
    periodValueType,
    statusTypes,
    clientIdForFilter,
    searchCounter,
    refresh,
  ]);

  const openDeleteModal = (inboxArchiveList: any) => {
    setDeleteModalOpen(true);
    valueSetter(inboxArchiveList);
  };

  const openUnArchiveModal = (inboxArchiveList: any) => {
    valueSetter(inboxArchiveList);
    setUnArchiveModalOpen(true);
  };

  const openLinkingModel = (inboxArchiveList: any) => {
    valueSetter(inboxArchiveList);
    setLinkingModalOpen(true);
  };

  const valueSetter = (inboxArchiveList: any) => {
    setInboxData(inboxArchiveList);
  };

  return (
    <KTCardBody className="py-4">
      <div className="row row-cols-1 row-cols-md-1 g-4">
        {
          // !isLoading &&
          InboxLists?.result?.map((InboxList: InboxListResult) => (
            <ListCard
              cardClass="card h-100 pt-3 position-relative mb-2"
              key={InboxList.id}
            >
              <div
                className="ribbon ribbon-end ribbon-clip position-absolute"
                style={{
                  top: "9px",
                  right: "0px",
                  height: "25px",
                  width: "90px",
                }}
              >
                <div className="ribbon-label fw-normal fs-7 text-lowercase">
                  {InboxList?.sizeDescription}
                  <span className="ribbon-inner bg-gray-600"></span>
                </div>
              </div>

              <div
                className="ribbon ribbon-start"
                style={{
                  top: "11px",
                  right: "0px",
                  height: "25px",
                  width: "90px",
                }}
              >
                <div className="ribbon-label fw-normal bg-transparent">
                  <img
                    src={
                      InboxList?.fileType.value === 6
                        ? "/media/svg/024-pdf.svg"
                        : InboxList.fileType.value === 3
                        ? "/media/svg/025-png.svg"
                        : "/media/svg/017-jpg.svg"
                    }
                    width={40}
                    height={40}
                    alt={
                      InboxList?.fileType.value === 6
                        ? "pdf"
                        : InboxList.fileType.value === 3
                        ? "png"
                        : "jpg"
                    }
                  />
                  <span className="ribbon-inner bg-white opacity-0"></span>
                </div>
              </div>

              <div className="card-body pb-2">
                {/* Document Name */}
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <div className="d-flex align-items-center ms-4">
                    <span
                      className="text-dark fw-normal fs-6 text-lowercase cursor-pointer link-primary"
                      data-bs-toggle="offcanvas"
                      data-bs-target="#offcanvasRight"
                      aria-controls="offcanvasRight"
                    >
                      {InboxList?.archiveTitle}
                    </span>
                  </div>
                </div>

                <div className="separator separator-solid mb-4"></div>

                <div className="d-flex flex-row flex-wrap fs-8 gap-3 mt-3 align-items-center justify-content-between">
                  <DetailsCard
                    details={INBOX_DETAILS(InboxList, intl)}
                    intl={intl}
                  />

                  {/* Buttons */}
                  <div className="d-flex align-items-center">
                    {InboxList.actions.canArchive && (
                      <Tippy
                        content={intl.formatMessage({
                          id: "Fields.ActionArchive",
                        })}
                      >
                        <i className="ki-duotone ki-archive fs-2">
                          <span className="path1"></span>
                          <span className="path2"></span>
                          <span className="path3"></span>
                        </i>
                      </Tippy>
                    )}
                    {InboxList?.ocrStatus?.htmlInfo && (
                      <Tippy
                        content={
                          <div
                            dangerouslySetInnerHTML={{
                              __html: InboxList?.ocrStatus?.htmlInfo,
                            }}
                          />
                        }
                      >
                        <button className="btn btn-icon btn-light btn-sm me-3">
                          <i className="fa-solid fa-cookie-bite fs-2"></i>
                        </button>
                      </Tippy>
                    )}

                    {InboxList?.ocrStatus?.htmlInfo && (
                      <Tippy
                        content={
                          <div
                            dangerouslySetInnerHTML={{
                              __html: InboxList?.ocrStatus?.htmlInfo,
                            }}
                          />
                        }
                      >
                        <button className="btn btn-icon btn-light btn-sm me-3">
                          <i className="fa-solid fa-cookie-bite fs-2"></i>
                        </button>
                      </Tippy>
                    )}

                    {InboxList.actions.canRoute && (
                      <Tippy
                        content={intl.formatMessage({
                          id: "Fields.ActionRouteMutation",
                        })}
                      >
                        <button
                          className="btn btn-icon btn-light btn-sm me-3"
                          onClick={() => openLinkingModel(InboxList)}
                        >
                          <i className="fa-solid fa-link"></i>
                        </button>
                      </Tippy>
                    )}

                    {InboxList.actions.canView && (
                      <button
                        className="btn btn-icon btn-light btn-sm me-4"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#offcanvasRight"
                        aria-controls="offcanvasRight"
                        onClick={() =>
                          setDownloadUrl(InboxList.downloadInfo.downloadUrl)
                        }
                      >
                        <i className="ki-duotone ki-eye fs-2">
                          <span className="path1"></span>
                          <span className="path2"></span>
                          <span className="path3"></span>
                        </i>
                      </button>
                    )}

                    <div className="btn-group drop-left">
                      <button
                        className="btn btn-icon btn-light btn-sm"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <i className="fa fas fa-list-ul text-muted fs-2"></i>
                      </button>
                      <ul className="dropdown-menu w-content-fit py-3">
                        <li
                          onClick={() => {
                            const link = document.createElement("a");
                            link.href = InboxList.downloadInfo.downloadUrl;
                            link.setAttribute(
                              "download",
                              InboxList.downloadInfo.fileName
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
                        {InboxList.actions.canDelete && (
                          <>
                            <div className="dropdown-divider border-gray-200"></div>
                            <li onClick={() => openDeleteModal(InboxList)}>
                              <a className="dropdown-item d-flex align-items-center cursor-pointer">
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
              </div>
            </ListCard>
          ))
        }

        {InboxLists?.result?.length == 0 && <NoItemsPage />}
        {isLoading && <ListLoading />}
      </div>

      {InboxLists?.result?.length > 0 && (
        <ListPagination
          totalPages={InboxLists.totalPages}
          pageIndex={pageIndex}
          onPageChange={handlePageChange}
          totalItems={InboxLists.totalRows}
          moduleName="inbox-module"
        />
      )}
    </KTCardBody>
  );
};

export { InboxList };
