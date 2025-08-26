import { useEffect, useState } from "react";
import { getClients } from "../core/_requests";
import { ClientResult } from "../core/_models";
import { ListLoading } from "../../../generic/ListLoading";
import { KTCardBody, KTSVG } from "../../../../../_metronic/helpers";
import { useIntl } from "react-intl";
import { toAbsoluteUrl } from "../../../../../_metronic/helpers";
import Tippy from "@tippyjs/react";
import clsx from "clsx";
import { useAuth } from "../../../auth";
import { ListPagination } from "../../../generic/ListPagination";
interface ComponentProps {
  searchTerm: string;
  setTotalRows: (type: number) => void;
  setAddModalOpen: (type: boolean) => void;
  setEditModalId: (type: number) => void;
  setDeleteModalId: (type: number[]) => void;
  setTitle: (type: string) => void;
  setIntlMessage: (type: string) => void;
  setDeleteModalOpen: (type: boolean) => void;
  refresh: boolean;
  setPageIndex: (type: number) => void;
  pageIndex: number;
  searchCounter: number;
  setQuoteModalOpen: (type: boolean) => void;
  setInvoiceModalOpen: (type: boolean) => void;
}
const ClientsList = ({
  searchTerm,
  setTotalRows,
  setAddModalOpen,
  setEditModalId,
  setTitle,
  setDeleteModalOpen,
  setDeleteModalId,
  searchCounter,
  refresh,
  setPageIndex,
  pageIndex,
  setIntlMessage,
  setQuoteModalOpen,
  setInvoiceModalOpen,
}: ComponentProps) => {
  const [clients, setClients] = useState<any>([]);
  const auth = useAuth();
  const intl = useIntl();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchClients = async () => {
    try {
      setIsLoading(true);
      const response = await getClients(searchTerm, pageIndex, 24);
      if (response.isValid) {
        setClients(response);
        setTotalRows(response.totalRows);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error fetching clients :", error);
    } finally {
      setIsLoading(false);
    }
  };
  const handlePageChange = (page: number) => {
    setPageIndex(page);
  };

  useEffect(() => {
    fetchClients();
  }, [searchTerm, pageIndex, searchCounter, refresh]);

  const openEditModal = (id: number) => {
    setEditModalId(id);
    setAddModalOpen(true);
  };

  const openDeleteModal = (id: number, title: string) => {
    setDeleteModalId([id]);
    setDeleteModalOpen(true);
    setTitle(title);
    setIntlMessage("Fields.ModalDeleteDescriptionClient");
  };

  return (
    <KTCardBody className="pt-4">
      <div className="row row-cols-1 row-cols-md-1 g-4">
        {clients?.result?.map((clientList: ClientResult) => (
          <div className="col-md-6" key={clientList.id}>
            <div className="card h-100 pb-7">
              <div className="card-body position-relative">
                {/* First Row: Checkbox, Divider, Value */}
                <div className="d-flex justify-content-between mb-5">
                  <div
                    className="d-flex flex-column gap-1 cursor-pointer title-clickable"
                    onClick={() => {
                      openEditModal(clientList.id);
                    }}
                  >
                    <small className="text-muted fs-8">
                      {clientList.customerNr}
                    </small>
                    <strong>{clientList.businessName}</strong>
                    <div className="d-flex flex-row gap-1">
                      {clientList.clientTypes.map((client) => (
                        <span
                          className="badge bg-gray-300 fw-normal"
                          key={client}
                          style={{ width: "fit-content" }}
                        >
                          {client.toLowerCase()}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="d-flex ">
                    {clientList.contacts.length > 0 && (
                      <div
                        className="d-flex flex-column pe-0 "
                        key={clientList.id}
                      >
                        <div className="symbol-group symbol-hover flex-nowrap">
                          {clientList.contacts.map((contact, index) => {
                            const initials = contact.fullName
                              ? contact.fullName
                                  .split(" ")
                                  .map((name) => name[0])
                                  .join("")
                                  .substring(0, 2)
                              : contact.emailAddress?.[0].toUpperCase() || "";

                            // Define a list of colors
                            const colors = [
                              "bg-warning",
                              "bg-danger",
                              "bg-success",
                              "bg-primary",
                              "bg-info",
                            ];
                            // Choose a color based on the index
                            const backgroundColor =
                              colors[index % colors.length];

                            return (
                              <Tippy
                                content={
                                  <div>
                                    {contact.fullName && (
                                      <div className="d-flex rounded align-items-center mb-2">
                                        <i className="ki-duotone ki-user fs-3 me-1">
                                          <span className="path1"></span>
                                          <span className="path2"></span>
                                        </i>
                                        <small>
                                          {contact.fullName.toLowerCase()}
                                        </small>
                                      </div>
                                    )}
                                    {contact.emailAddress && (
                                      <div className="d-flex rounded align-items-center mb-2 ">
                                        <i className="ki-duotone ki-sms fs-3 me-1">
                                          <span className="path1"></span>
                                          <span className="path2"></span>
                                        </i>

                                        <small>{contact.emailAddress}</small>
                                      </div>
                                    )}
                                    {contact.phoneNrs.map(
                                      (phoneNumber, index) => {
                                        return (
                                          <div
                                            className="d-flex rounded align-items-center mb-2 "
                                            key={index}
                                          >
                                            <i className="ki-duotone ki-phone fs-4 me-1">
                                              <span className="path1"></span>
                                              <span className="path2"></span>
                                            </i>
                                            <small>{phoneNumber}</small>
                                          </div>
                                        );
                                      }
                                    )}
                                  </div>
                                }
                                key={contact.id}
                              >
                                <div
                                  className="symbol symbol-25px symbol-circle"
                                  key={`cw7-item-${index}`}
                                >
                                  <span
                                    className={clsx(
                                      "symbol-label fs-9",
                                      backgroundColor
                                    )}
                                  >
                                    {initials.toUpperCase()}
                                  </span>
                                </div>
                              </Tippy>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    <span className="h-25px bg-gray-400 w-1px mx-3"></span>
                    {/* <div className="text-end">
                      {clientList.actions.canEdit && (
                        <Tippy
                          content={intl.formatMessage({
                            id: "Fields.ToolTipEdit",
                          })}
                        >
                          <button
                            className="btn btn-icon btn-light btn-sm me-4"
                            onClick={() => {
                              openEditModal(clientList.id);
                            }}
                          >
                            <i className="ki-solid ki-pencil text-warning fs-1 " />
                          </button>
                        </Tippy>
                      )}
                    </div> */}
                    <div className="btn-group drop-left">
                      <button
                        className="btn btn-icon btn-light btn-sm"
                        style={{ fontSize: "0.55rem" }}
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <i className="fa fas fa-list-ul text-muted fs-4"></i>
                      </button>
                      <ul className="dropdown-menu w-content-fit py-4">
                        {clientList.actions.canEdit && (
                          <li
                            onClick={() => {
                              openEditModal(clientList.id);
                            }}
                          >
                            <a className="dropdown-item d-flex align-items-center cursor-pointer">
                              <i className="ki-solid ki-pencil text-warning fs-1 me-2 " />
                              {intl.formatMessage({
                                id: "Fields.ActionEdit",
                              })}
                            </a>
                          </li>
                        )}
                        {clientList.actions.canCreateQuote && (
                          <>
                            <div className="dropdown-divider border-gray-200"></div>
                            <li
                              onClick={() => {
                                localStorage.setItem(
                                  "clientResponse",
                                  JSON.stringify(clientList)
                                );
                                setEditModalId(0);
                                setQuoteModalOpen(true);
                              }}
                            >
                              <a className="dropdown-item d-flex align-items-center cursor-pointer">
                                <KTSVG
                                  className="svg-icon svg-icon-2 me-2"
                                  path="media/svg/general/estimation-01-bulk-rounded.svg"
                                />
                                {intl.formatMessage({
                                  id: "Fields.ActionQuoteNew",
                                })}
                              </a>
                            </li>
                          </>
                        )}
                        {clientList.actions.canCreateInvoice && (
                          <>
                            <div className="dropdown-divider border-gray-200"></div>
                            <li
                              onClick={() => {
                                localStorage.setItem(
                                  "clientResponse",
                                  JSON.stringify(clientList)
                                );
                                setEditModalId(0);
                                setInvoiceModalOpen(true);
                              }}
                            >
                              <a className="dropdown-item d-flex align-items-center cursor-pointer">
                                <i className="ki-duotone ki-cheque text-info fs-1 me-2">
                                  <span className="path1"></span>
                                  <span className="path2"></span>
                                  <span className="path3"></span>
                                  <span className="path4"></span>
                                  <span className="path5"></span>
                                  <span className="path6"></span>
                                  <span className="path7"></span>
                                </i>
                                {intl.formatMessage({
                                  id: "Fields.ActionInvoiceNew",
                                })}
                              </a>
                            </li>
                          </>
                        )}

                        {clientList.actions.canDelete && (
                          <>
                            {" "}
                            <div className="dropdown-divider border-gray-200"></div>
                            <li
                              onClick={() => {
                                openDeleteModal(
                                  clientList.id,
                                  clientList.businessName
                                );
                              }}
                            >
                              <a className="dropdown-item d-flex align-items-center cursor-pointer">
                                <i className="ki-solid ki-trash text-danger fs-1 me-2"></i>
                                Delete
                              </a>
                            </li>
                          </>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>

                {(clientList.totals.totalCostAmount !== 0 ||
                  clientList.totals.totalIncomeAmount !== 0 ||
                  clientList.totals.totalProfitAmount !== 0) && (
                  <>
                    <div className="separator separator-solid mt-5 mb-10"></div>
                    <div className="d-flex gap-5 totals-container position-absolute bottom-0 w-100">
                      {clientList.totals.totalIncomeAmount !== 0 && (
                        <span className="d-flex align-items-center ">
                          <KTSVG
                            className="svg-icon svg-icon-3x me-2"
                            path="media/svg/general/chart-up-bulk-rounded.svg"
                          />

                          <div className="d-flex flex-column">
                            <small className="text-muted">
                              {intl.formatMessage({
                                id: "Fields.TotalIncomeAmount",
                              })}
                              :
                            </small>
                            <small>
                              {
                                auth.currentUser?.result.activeCompanyDefaults
                                  .defaultValuta.sign
                              }
                              {clientList.totals.totalIncomeAmount}
                            </small>
                          </div>
                        </span>
                      )}
                      {clientList.totals.totalIncomeAmount !== 0 &&
                        clientList.totals.totalCostAmount !== 0 && (
                          <span className="h-37px bg-gray-400 w-1px me-3"></span>
                        )}
                      {clientList.totals.totalCostAmount !== 0 && (
                        <>
                          <span className="d-flex align-items-center">
                            <KTSVG
                              className="svg-icon svg-icon-3x me-2"
                              path="media/svg/general/chart-down-bulk-rounded.svg"
                            />
                            <div className="d-flex flex-column">
                              <small className="text-muted">
                                {intl.formatMessage({
                                  id: "Fields.TotalCostAmount",
                                })}
                                :
                              </small>
                              <small>
                                {
                                  auth.currentUser?.result.activeCompanyDefaults
                                    .defaultValuta.sign
                                }
                                {clientList.totals.totalCostAmount}
                              </small>
                            </div>
                          </span>
                        </>
                      )}
                      {clientList.totals.totalCostAmount !== 0 &&
                        clientList.totals.totalIncomeAmount !== 0 &&
                        clientList.totals.totalProfitAmount !== 0 && (
                          <>
                            <span className="h-37px bg-gray-400 w-1px me-3"></span>
                            <span className="d-flex align-items-center">
                              {clientList.totals.totalProfitAmount > 0 ? (
                                <KTSVG
                                  className="svg-icon svg-icon-3x me-2"
                                  path="media/svg/general/chart-rose-profit.svg"
                                />
                              ) : (
                                <KTSVG
                                  className="svg-icon svg-icon-3x me-2"
                                  path="media/svg/general/chart-rose-loss.svg"
                                />
                              )}
                              <div className="d-flex flex-column">
                                <small className="text-muted">
                                  {intl.formatMessage({
                                    id: "System.Charts_IncomeAndCost",
                                  })}
                                  :
                                </small>
                                <small>
                                  {
                                    auth.currentUser?.result
                                      .activeCompanyDefaults.defaultValuta.sign
                                  }
                                  {clientList.totals.totalProfitAmount}
                                </small>
                              </div>
                            </span>
                          </>
                        )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}

        {clients?.result?.length == 0 && (
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

      {clients?.result?.length > 0 && (
        <ListPagination
          totalPages={clients?.totalPages}
          pageIndex={pageIndex}
          onPageChange={handlePageChange}
          totalItems={clients?.totalRows}
          moduleName="clients-module"
        />
      )}
    </KTCardBody>
  );
};

export { ClientsList };
