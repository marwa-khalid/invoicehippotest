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
          <div className="col" key={clientList.id}>
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
                  </div>
                  <div className="align-items-center my-lg-0 my-1 necessary-icons">
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

                    {clientList.actions.canView && (
                      <Tippy content="view">
                        <button
                          className="btn btn-icon btn-light btn-sm me-4"
                          onClick={() => {
                            openEditModal(clientList.id);
                          }}
                        >
                          <i className="ki-duotone ki-eye text-dark fs-1">
                            <span className="path1"></span>
                            <span className="path2"></span>
                            <span className="path3"></span>
                          </i>
                        </button>
                      </Tippy>
                    )}
                    {clientList.actions.canCreateInvoice && (
                      <Tippy content="create invoice">
                        <button
                          className="btn btn-icon btn-light btn-sm me-4"
                          onClick={() => {
                            openEditModal(clientList.id);
                          }}
                        >
                          <i className="ki-duotone ki-cheque text-info fs-1">
                            <span className="path1"></span>
                            <span className="path2"></span>
                            <span className="path3"></span>
                            <span className="path4"></span>
                            <span className="path5"></span>
                            <span className="path6"></span>
                            <span className="path7"></span>
                          </i>
                        </button>
                      </Tippy>
                    )}

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
                    {clientList.actions.canDelete && (
                      <Tippy
                        content={intl.formatMessage({
                          id: "Fields.ToolTipDelete",
                        })}
                      >
                        <button
                          className="btn btn-icon btn-light btn-sm"
                          onClick={() => {
                            openDeleteModal(
                              clientList.id,
                              clientList.businessName
                            );
                          }}
                        >
                          <i className="ki-solid ki-trash text-danger fs-1"></i>
                        </button>
                      </Tippy>
                    )}
                  </div>
                </div>

                {clientList?.primaryContact?.fullName && (
                  <div className="mb-4">
                    <div className="separator separator-solid mb-3"></div>
                    <ul className="breadcrumb breadcrumb-black breadcrumb-dot">
                      <li className="breadcrumb-item">
                        <div className="breadcrumb-item bg-primary py-1 px-2 rounded text-white align-items-center">
                          <i className="ki-duotone ki-user fs-2 text-white me-2">
                            <span className="path1"></span>
                            <span className="path2"></span>
                          </i>
                          <small>
                            {clientList?.primaryContact?.fullName.toLowerCase()}
                          </small>
                        </div>
                      </li>

                      {clientList?.primaryContact?.emailAddress && (
                        <li className="breadcrumb-item">
                          <div className="breadcrumb-item bg-secondary py-1 px-2 rounded align-items-center">
                            <i className="ki-duotone ki-sms text-dark fs-2 me-2">
                              <span className="path1"></span>
                              <span className="path2"></span>
                            </i>

                            <small>
                              {clientList?.primaryContact?.emailAddress}
                            </small>
                          </div>
                        </li>
                      )}
                      {clientList?.primaryContact?.phoneNrs.length > 0 && (
                        <li className="breadcrumb-item align-items-center bg-secondary ms-2 py-1 px-2 rounded">
                          <i className="ki-duotone ki-phone text-dark fs-2 me-2">
                            <span className="path1"></span>
                            <span className="path2"></span>
                          </i>
                          <small>
                            {clientList?.primaryContact?.phoneNrs.map(
                              (phoneNumber, index) => {
                                return (
                                  <span className="me-2" key={index}>
                                    {phoneNumber}
                                  </span>
                                );
                              }
                            )}
                          </small>
                        </li>
                      )}
                    </ul>
                  </div>
                )}
                {clientList.contacts.length > 0 && (
                  <div
                    className="d-flex flex-column justify-content-end pe-0"
                    key={clientList.id}
                  >
                    <div className="separator separator-solid mb-3"></div>
                    <strong className="mb-3">
                      {intl.formatMessage({ id: "Fields.Contacts" })}
                    </strong>
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
                                  "symbol-label fw-bold",
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
