import React, { useEffect, useState } from "react";
import { getFinancialAccounts } from "../core/_requests";
import { FinancialAccountsResult } from "../core/_models";
import { ListLoading } from "../../../components/ListLoading";
import { FinancialListPagination } from "../components/pagination/FinancialListPagination";
import { KTCardBody } from "../../../../../../_metronic/helpers";
import { useIntl } from "react-intl";
import { toAbsoluteUrl } from "../../../../../../_metronic/helpers";
import { KTSVG } from "../../../../../../_metronic/helpers";
import Tippy from "@tippyjs/react";
interface ComponentProps {
  searchTerm: string;
  setTotalRows: (type: number) => void;
  setEditModalOpen: (type: boolean) => void;
  setUnlinkModalOpen: (type: boolean) => void;
  setEditModalId: (type: number) => void;
  setLedgerAccountTitle: (type: string) => void;
  setDeleteModalOpen: (type: boolean) => void;
  refresh: boolean;
  setPageIndex: (type: number) => void;
  pageIndex: number;
  editModalOpen: boolean;
  deleteModalOpen: boolean;
  addModalOpen: boolean;
  searchCounter: number;
}
const FinancialAccountsList = ({
  searchTerm,
  setTotalRows,
  setEditModalOpen,
  setEditModalId,
  setLedgerAccountTitle,
  setDeleteModalOpen,
  setUnlinkModalOpen,
  searchCounter,
  refresh,
  setPageIndex,
  pageIndex,
  editModalOpen,
  deleteModalOpen,
  addModalOpen,
}: ComponentProps) => {
  const [financialAccounts, setFinancialAccounts] = useState<any>([]);

  const intl = useIntl();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchFinancialAccounts = async () => {
    setIsLoading(true);

    try {
      const response = await getFinancialAccounts(searchTerm, pageIndex);
      setFinancialAccounts(response);
      setPageIndex(response.pageIndex);
      setTotalRows(response.totalRows);
    } catch (error) {
      console.error("Error fetching financial accounts:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const handlePageChange = (page: number) => {
    setPageIndex(page);
    fetchFinancialAccounts();
  };

  useEffect(() => {
    fetchFinancialAccounts();
  }, [searchTerm, pageIndex, searchCounter]);

  useEffect(() => {
    fetchFinancialAccounts();
  }, [refresh, editModalOpen, deleteModalOpen, addModalOpen]);

  const renderWifiIcon = () => {
    return <i className="fas fa-wifi text-success fs-2" />;
  };
  const openEditModal = (id: number) => {
    setEditModalId(id);
    setEditModalOpen(true);
  };

  const openDeleteModal = (id: number, ledgerTitle: string) => {
    setEditModalId(id);
    setDeleteModalOpen(true);
    setLedgerAccountTitle(ledgerTitle);
  };

  const openUnlinkModal = (id: number) => {
    setEditModalId(id);
    setUnlinkModalOpen(true);
  };

  const formatExpirationDate = (dateStr: string): string => {
    const date = new Date(dateStr);

    const days = [
      "Zondag",
      "Maandag",
      "Dinsdag",
      "Woensdag",
      "Donderdag",
      "Vrijdag",
      "Zaterdag",
    ];
    const months = [
      "Januari",
      "Februari",
      "Maart",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Augustus",
      "September",
      "Oktober",
      "November",
      "December",
    ];

    const dayName = days[date.getDay()];
    const day = date.getDate();
    const monthName = months[date.getMonth()];
    const year = date.getFullYear();

    return `${dayName} ${day} ${monthName} ${year}`;
  };
  const formatRequestDate = (dateTimeStr: any) => {
    const date = new Date(dateTimeStr);

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
  };
  return (
    <KTCardBody className="py-4">
      <div className="row row-cols-1 row-cols-md-1 g-4">
        {
          // !isLoading &&
          financialAccounts?.result?.map(
            (financialAccount: FinancialAccountsResult) => (
              <div className="col" key={financialAccount.id}>
                <div className="card h-100 py-6 ">
                  <div className="card-body">
                    {/* First Row: Checkbox, Divider, Value */}
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <div
                        className="d-flex align-items-center gap-3 cursor-pointer title-clickable"
                        onClick={() => {
                          openEditModal(financialAccount.id);
                        }}
                      >
                        {financialAccount.bankConnectInfo.isActive &&
                          renderWifiIcon()}

                        <strong>{financialAccount.accountName}</strong>
                      </div>
                      <div className="align-items-center my-lg-0 my-1 necessary-icons">
                        {financialAccount.actions.canEdit && (
                          <Tippy
                            content={intl.formatMessage({
                              id: "Fields.ToolTipEdit",
                            })}
                          >
                            <button
                              className="btn btn-icon btn-light btn-sm me-4"
                              onClick={() => {
                                openEditModal(financialAccount.id);
                              }}
                            >
                              <i className="ki-solid ki-pencil text-warning fs-2 " />
                            </button>
                          </Tippy>
                        )}

                        {financialAccount.actions.canExtendAutomation && (
                          <Tippy
                            content={intl.formatMessage({
                              id: "Fields.ToolTipReconnect",
                            })}
                          >
                            <button className="btn btn-icon btn-light btn-sm me-4">
                              <i className="fas fa-wifi text-primary fs-3" />
                            </button>
                          </Tippy>
                        )}
                        {financialAccount.actions.canRevokeAutomation && (
                          <Tippy
                            content={intl.formatMessage({
                              id: "Fields.ToolTipDisonnect",
                            })}
                          >
                            <button
                              className="btn btn-icon btn-light btn-sm me-4"
                              onClick={() => {
                                openUnlinkModal(financialAccount.id);
                              }}
                            >
                              <i className="fas fa-wifi text-danger fs-3" />
                            </button>
                          </Tippy>
                        )}
                        {financialAccount.actions.canDelete && (
                          <Tippy
                            content={intl.formatMessage({
                              id: "Fields.ToolTipDelete",
                            })}
                          >
                            <button
                              className="btn btn-icon btn-light btn-sm"
                              onClick={() => {
                                openDeleteModal(
                                  financialAccount.id,
                                  financialAccount.accountName
                                );
                              }}
                            >
                              <i className="ki-solid ki-trash text-danger fs-2"></i>
                            </button>
                          </Tippy>
                        )}
                      </div>
                    </div>
                    {/* separator Line */}

                    <div className="separator separator-solid mb-3"></div>

                    <div className="mb-4 text-muted">
                      <ul className="breadcrumb breadcrumb-black breadcrumb-dot">
                        <li className="breadcrumb-item">
                          <small>
                            {" "}
                            {financialAccount.accountType.description.toLowerCase()}
                          </small>
                        </li>
                        {financialAccount.bankAccountCompanyType
                          .description && (
                          <li className="breadcrumb-item">
                            <small>
                              {financialAccount.bankAccountCompanyType.description.toLowerCase()}
                            </small>
                          </li>
                        )}
                        {financialAccount.accountNumber && (
                          <li className="breadcrumb-item">
                            <small>
                              {financialAccount.accountNumber.toUpperCase()}
                            </small>
                          </li>
                        )}
                      </ul>
                    </div>
                    <div className="d-flex flex-row flex-wrap fs-8 gap-4">
                      {/* Small Image and Ledger Account + Title */}
                      {financialAccount.ledgerAccountId && (
                        <div className="d-flex align-items-center flex-wrap">
                          <i className="ki-duotone ki-file-added fs-3x text-warning ">
                            <span className="path1"></span>
                            <span className="path2"></span>
                            <span className="path3"></span>
                            <span className="path4"></span>
                            <span className="path5"></span>
                          </i>

                          <div className="d-flex flex-column mx-6">
                            <span className="fs-sm text-muted">
                              {intl.formatMessage({
                                id: "Fields.LedgerAccount",
                              })}
                            </span>
                            <span className="text-primary fw-bolder">
                              {financialAccount.ledgerAccountDisplayName}
                            </span>
                          </div>
                        </div>
                      )}
                      {financialAccount.bankConnectInfo.isActive && (
                        <>
                          <span className="h-37px bg-gray-400 w-1px me-3"></span>
                          <div className="d-flex align-items-center flex-wrap">
                            <i className="ki-duotone ki-calendar fs-3x text-danger">
                              <span className="path1"></span>
                              <span className="path2"></span>
                            </i>
                            <div className="d-flex flex-column mx-6">
                              <span className="fs-sm text-muted">
                                {intl.formatMessage({
                                  id: "Fields.ConnectedAccountsExpiresLabel",
                                })}
                              </span>
                              <span className="text-primary fw-bolder">
                                {formatExpirationDate(
                                  financialAccount.bankConnectInfo
                                    .accessExpirtationDate
                                )}
                              </span>
                            </div>
                          </div>
                          <span className=" h-37px bg-gray-400 w-1px me-3 "></span>
                          <div className="d-flex align-items-center flex-wrap">
                            <i className="ki-duotone ki-calendar fs-3x text-primary">
                              <span className="path1"></span>
                              <span className="path2"></span>
                            </i>
                            <div className="d-flex flex-column mx-6">
                              <span className="fs-sm text-muted">
                                {intl.formatMessage({
                                  id: "Fields.ConnectedAccountsLatestSyncRunLabel",
                                })}
                              </span>
                              <span className="text-primary fw-bolder">
                                {formatRequestDate(
                                  financialAccount.bankConnectInfo
                                    .lastSyncRequestDate
                                )}
                              </span>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          )
        }

        {financialAccounts?.result?.length == 0 && (
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

      {financialAccounts?.result?.length > 0 && (
        <FinancialListPagination
          totalPages={financialAccounts.totalPages}
          pageIndex={pageIndex}
          setPageIndex={setPageIndex}
          onPageChange={handlePageChange}
          totalItems={financialAccounts.totalRows}
        />
      )}
    </KTCardBody>
  );
};

export { FinancialAccountsList };
