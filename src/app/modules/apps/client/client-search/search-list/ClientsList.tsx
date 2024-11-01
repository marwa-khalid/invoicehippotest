import { useEffect, useState } from "react";
import { getClients } from "../core/_requests";
import { ClientResult } from "../core/_models";
import { ListLoading } from "../../../components/ListLoading";
import { ClientPagination } from "../components/pagination/ClientPagination";
import { KTCardBody } from "../../../../../../_metronic/helpers";
import { useIntl } from "react-intl";
import { toAbsoluteUrl } from "../../../../../../_metronic/helpers";
import Tippy from "@tippyjs/react";
import clsx from "clsx";
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
  addModalOpen: boolean;
  deleteModalOpen: boolean;
  searchCounter: number;
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
  addModalOpen,
  deleteModalOpen,
  setIntlMessage,
}: ComponentProps) => {
  const [clients, setClients] = useState<any>([]);

  const intl = useIntl();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchClients = async () => {
    setIsLoading(true);

    try {
      const response = await getClients(searchTerm, pageIndex, 25);

      setClients(response);
      setPageIndex(response.pageIndex);
      setTotalRows(response.totalRows);
    } catch (error) {
      console.error("Error fetching clients :", error);
    } finally {
      setIsLoading(false);
    }
  };
  const handlePageChange = (page: number) => {
    setPageIndex(page);
    fetchClients();
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
    <KTCardBody className="py-4">
      <div className="row row-cols-1 row-cols-md-1 g-4">
        {clients?.result?.map((clientList: ClientResult) => (
          <div className="col-md-6" key={clientList.id}>
            <div className="card h-100 py-6 ">
              <div className="card-body">
                {/* First Row: Checkbox, Divider, Value */}
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div
                    className="d-flex flex-column gap-3 cursor-pointer title-clickable"
                    onClick={() => {
                      openEditModal(clientList.id);
                    }}
                  >
                    <small className="text-muted fs-9">
                      {clientList.customerNr}
                    </small>
                    <strong>{clientList.businessName}</strong>
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

                  <div className="d-flex">
                    <div className="text-end">
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
                    </div>
                    <div className="btn-group drop-left">
                      <button
                        className="btn btn-icon btn-light btn-sm"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <i className="fa fas fa-list-ul text-muted fs-2"></i>
                      </button>
                      <ul className="dropdown-menu w-content-fit py-4">
                        {clientList.actions.canCreateQuote && (
                          <li
                            onClick={() => {
                              openEditModal(clientList.id);
                            }}
                          >
                            <a className="dropdown-item d-flex align-items-center cursor-pointer">
                              <i className="ki-duotone ki-add-item text-success fs-1 me-2">
                                <span className="path1"></span>
                                <span className="path2"></span>
                                <span className="path3"></span>
                              </i>
                              {intl.formatMessage({
                                id: "Fields.ActionQuoteNew",
                              })}
                            </a>
                          </li>
                        )}
                        {clientList.actions.canCreateInvoice && (
                          <>
                            <div className="dropdown-divider border-gray-200"></div>
                            <li
                              onClick={() => {
                                openEditModal(clientList.id);
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
                        {/* 
                        
                        <li>
                          {clientList.actions.canTakeOverAccount && (
                            <Tippy content="takeover">
                              <button
                                className="btn btn-icon btn-light btn-sm me-4"
                                onClick={() => {
                                  openEditModal(clientList.id);
                                }}
                              >
                                <i className="ki-duotone ki-profile-user fs-1 text-danger">
                                  <span className="path1"></span>
                                  <span className="path2"></span>
                                  <span className="path3"></span>
                                  <span className="path4"></span>
                                </i>
                              </button>
                            </Tippy>
                          )}
                        </li>
                        <li>
                          {clientList.actions.canCreateQuote && (
                            <Tippy content="create quote">
                              <button
                                className="btn btn-icon btn-light btn-sm me-4"
                                onClick={() => {
                                  openEditModal(clientList.id);
                                }}
                              >
                                <i className="ki-duotone ki-add-item text-success fs-1">
                                  <span className="path1"></span>
                                  <span className="path2"></span>
                                  <span className="path3"></span>
                                </i>
                              </button>
                            </Tippy>
                          )}
                        </li>
                        <li>
                          {clientList.actions.canExtendAutomation && (
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
                        </li>
                        <li>
                          {clientList.actions.canRevokeAutomation && (
                            <Tippy
                              content={intl.formatMessage({
                                id: "Fields.ToolTipDisonnect",
                              })}
                            >
                              <button className="btn btn-icon btn-light btn-sm me-4">
                                <i className="fas fa-wifi text-danger fs-3" />
                              </button>
                            </Tippy>
                          )}
                        </li> */}

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

                {clientList?.primaryContact?.fullName && (
                  <div className="mb-4">
                    <div className="separator separator-solid mb-3"></div>
                    <div className="d-flex gap-2">
                      <div className="d-flex rounded align-items-center text-muted">
                        <i className="ki-duotone ki-user fs-3 me-1">
                          <span className="path1"></span>
                          <span className="path2"></span>
                        </i>
                        <small>
                          {clientList?.primaryContact?.fullName.toLowerCase()}
                        </small>
                      </div>

                      {clientList?.primaryContact?.emailAddress && (
                        <div className="d-flex rounded align-items-center text-muted">
                          <i className="ki-duotone ki-sms fs-3 me-1">
                            <span className="path1"></span>
                            <span className="path2"></span>
                          </i>

                          <small>
                            {clientList?.primaryContact?.emailAddress}
                          </small>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {clientList?.primaryContact?.phoneNrs.length > 0 && (
                  <div className="mb-5">
                    {clientList?.primaryContact?.phoneNrs.map(
                      (phoneNumber, index) => {
                        return (
                          <small
                            className="badge me-2 bg-secondary"
                            key={index}
                          >
                            <i className="ki-duotone ki-phone text-dark fs-4 me-1">
                              <span className="path1"></span>
                              <span className="path2"></span>
                            </i>
                            {phoneNumber}
                          </small>
                        );
                      }
                    )}
                  </div>
                )}
                {clientList.contacts.length > 0 && (
                  <div
                    className="d-flex flex-column justify-content-end pe-0"
                    key={clientList.id}
                  >
                    {/* <div className="separator separator-solid mb-3"></div>
                    <strong className="mb-3">
                      {intl.formatMessage({ id: "Fields.Contacts" })}
                    </strong> */}
                    <div className="symbol-group symbol-hover flex-nowrap">
                      {clientList.contacts.map((contact, index) => {
                        const initials = contact.fullName
                          ? contact.fullName
                              .split(" ")
                              .map((name) => name[0])
                              .join("")
                          : contact.emailAddress?.[0].toUpperCase() || "";

                        // Define a list of colors
                        const colors = [
                          "bg-warning",
                          "bg-primary",
                          "bg-success",
                          "bg-danger",
                          "bg-info",
                        ];
                        // Choose a color based on the index
                        const backgroundColor = colors[index % colors.length];

                        return (
                          <Tippy
                            content={contact.fullName || contact.emailAddress}
                            key={contact.id}
                          >
                            <div
                              className="symbol symbol-40px symbol-circle"
                              key={`cw7-item-${index}`}
                            >
                              <span
                                className={clsx(
                                  "symbol-label ",
                                  backgroundColor
                                )}
                              >
                                {initials}
                              </span>
                            </div>
                          </Tippy>
                        );
                      })}
                    </div>
                  </div>
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
        <ClientPagination
          totalPages={clients.totalPages}
          pageIndex={pageIndex}
          setPageIndex={setPageIndex}
          onPageChange={handlePageChange}
          totalItems={clients.totalRows}
        />
      )}
    </KTCardBody>
  );
};

export { ClientsList };
