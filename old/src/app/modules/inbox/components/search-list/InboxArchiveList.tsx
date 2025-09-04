import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { InboxListResult } from "../core/_models";
import { getInboxArchive } from "../core/_requests";
import { ListLoading } from "../../../generic/ListLoading";
import { KTCardBody } from "../../../../../_metronic/helpers";
import { useIntl } from "react-intl";
import Tippy from "@tippyjs/react";
import { ListPagination } from "../../../generic/ListPagination";
import { getDateRange, parseDate } from "../../../../utils/dateUtils";
import DetailsCard from "../../../generic/ListElements/DetailsCard";
import { INBOX_ARCHIVE_DETAILS } from "../../utils/inboxArchiveDetails";
import ListCard from "../../../generic/ListElements/ListCard";
import { NoItemsPage } from "../../../generic/NoItemsPage";
import ListSideBar from "./sidebar/ListSideBar";

interface ComponentProps {
  searchTerm: string;
  setTotalRows: (type: number) => void;
  setInboxData: (type: any) => void;
  setDeleteModalOpen: (type: boolean) => void;
  setDownloadUrl: (type: string) => void;
  refresh: boolean;
  setPageIndex: (type: number) => void;
  setStatusTypes: (type: number) => void;
  pageIndex: number;
  archiveTypeList: any;
  searchCounter: number;
  periodValueType: number | null;
  statusTypes: number;
  clientIdForFilter: number | null;
  year: number | null;
  setUnArchiveModalOpen: (type: boolean) => void;
  setKey: Dispatch<SetStateAction<number>>;
}

const InboxArchiveList = ({
  searchTerm,
  archiveTypeList,
  setTotalRows,
  setDeleteModalOpen,
  searchCounter,
  refresh,
  setPageIndex,
  pageIndex,
  periodValueType,
  statusTypes,
  setStatusTypes,
  clientIdForFilter,
  year,
  setUnArchiveModalOpen,
  setInboxData,
  setDownloadUrl,
  setKey,
}: ComponentProps) => {
  const [inboxArchiveLists, setInboxArchiveLists] = useState<any>([]);
  const intl = useIntl();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selected, setSelected] = useState(0);
  const fetchInboxArchives = async () => {
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
      const response = await getInboxArchive(
        searchTerm,
        pageIndex,
        dateRange,
        statusTypes
      );
      if (response.isValid) {
        setInboxArchiveLists(response);
        setTotalRows(response.totalRows);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error fetching Inbox archive List:", error);
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
    fetchInboxArchives();
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

  const valueSetter = (inboxArchiveList: any) => {
    setInboxData(inboxArchiveList);
  };

  return (
    <KTCardBody className="py-4">
      <div className="row row-cols-1 row-cols-md-1 g-4">
        {archiveTypeList && (
          <ListSideBar
            selected={selected}
            setSelected={setSelected}
            setStatusTypes={setStatusTypes}
            archiveTypeList={archiveTypeList}
          ></ListSideBar>
        )}
        <div className="col-lg-9 col-xl-9 ">
          {
            // !isLoading &&
            inboxArchiveLists?.result?.map(
              (inboxArchiveList: InboxListResult) => (
                <ListCard
                  cardClass="card h-100 pt-6 position-relative mb-4"
                  key={inboxArchiveList.id}
                >
                  {/* File Size Ribbon */}
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
                      {inboxArchiveList?.sizeDescription}
                      <span className="ribbon-inner bg-gray-600"></span>
                    </div>
                  </div>

                  <div
                    className="ribbon ribbon-start"
                    style={{
                      top: "3px",
                      right: "5px",
                    }}
                  >
                    <div
                      className="ribbon-label fw-normal bg-transparent"
                      style={{
                        boxShadow: "none",
                      }}
                    >
                      <img
                        src={
                          inboxArchiveList?.fileType.value === 6
                            ? "/media/svg/024-pdf.svg"
                            : inboxArchiveList.fileType.value === 3
                            ? "/media/svg/025-png.svg"
                            : "/media/svg/017-jpg.svg"
                        }
                        width={40}
                        height={40}
                        alt={
                          inboxArchiveList?.fileType.value === 6
                            ? "pdf"
                            : inboxArchiveList.fileType.value === 3
                            ? "png"
                            : "jpg"
                        }
                      />
                      <span className="ribbon-inner bg-transparent "></span>
                    </div>
                  </div>

                  <div className="card-body pb-4">
                    {/* First Row: Client Name (Left) and Amount (Right) */}
                    <div className="d-flex align-items-center justify-content-between">
                      {/* SVG icon and document name */}
                      <div className="d-flex align-items-center">
                        <div className="ms-7">
                          <span className="bg-secondary text-dark rounded p-1 text-muted fw-normal text-lowercase">
                            <i className="fas fa-suitcase icon-md"></i>{" "}
                            {inboxArchiveList?.archiveType.description}
                          </span>
                          <div>
                            <span
                              data-bs-toggle="offcanvas"
                              data-bs-target="#offcanvasRight"
                              aria-controls="offcanvasRight"
                            >
                              {" "}
                              <strong className="text-primary">
                                {inboxArchiveList?.archiveTitle}
                              </strong>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="separator separator-solid mb-6"></div>

                    <div className="d-flex flex-row flex-wrap fs-8 gap-4 mt-5 align-items-center justify-content-between">
                      <DetailsCard
                        details={INBOX_ARCHIVE_DETAILS(inboxArchiveList, intl)}
                        intl={intl}
                      />

                      {/* Buttons Section */}
                      <div className="d-flex align-items-center">
                        {inboxArchiveList.actions.canUnArchive && (
                          <Tippy
                            content={intl.formatMessage({
                              id: "Fields.ActionUnArchive",
                            })}
                          >
                            <button
                              className="btn btn-icon btn-light btn-sm me-4"
                              onClick={() =>
                                openUnArchiveModal(inboxArchiveList)
                              }
                            >
                              <i className="ki-duotone ki-archive fs-2">
                                <span className="path1"></span>
                                <span className="path2"></span>
                                <span className="path3"></span>
                              </i>
                            </button>
                          </Tippy>
                        )}

                        {inboxArchiveList.actions.canView && (
                          <button
                            className="btn btn-icon btn-light btn-sm me-4"
                            data-bs-toggle="offcanvas"
                            data-bs-target="#offcanvasRight"
                            aria-controls="offcanvasRight"
                            onClick={() =>
                              setDownloadUrl(
                                inboxArchiveList.downloadInfo.downloadUrl
                              )
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
                          <ul className="dropdown-menu w-content-fit py-4">
                            <li
                              onClick={() => {
                                const link = document.createElement("a");
                                link.href =
                                  inboxArchiveList.downloadInfo.downloadUrl;
                                link.setAttribute(
                                  "download",
                                  inboxArchiveList.downloadInfo.fileName
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
                            {inboxArchiveList.actions.canDelete && (
                              <>
                                <div className="dropdown-divider border-gray-200"></div>
                                <li
                                  onClick={() =>
                                    openDeleteModal(inboxArchiveList)
                                  }
                                >
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
              )
            )
          }

          {inboxArchiveLists?.result?.length == 0 && <NoItemsPage />}
          {isLoading && <ListLoading />}
          {inboxArchiveLists?.result?.length > 0 && (
            <ListPagination
              totalPages={inboxArchiveLists.totalPages}
              pageIndex={pageIndex}
              onPageChange={handlePageChange}
              totalItems={inboxArchiveLists.totalRows}
              moduleName="inbox-module"
            />
          )}
        </div>
      </div>
    </KTCardBody>
  );
};

export { InboxArchiveList };
