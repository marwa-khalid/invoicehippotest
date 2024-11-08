import { useIntl } from "react-intl";
import { KTIcon, toAbsoluteUrl } from "../../../../../../_metronic/helpers";
import { FC, useEffect, useState } from "react";
import { Tooltip } from "@chakra-ui/react";
import { ListPagination } from "../../../components/ListPagination";
import { FormikProps } from "formik";
import { FormValues } from "./QuoteAddStep1";
import {
  getClientById,
  getClients,
} from "../../../client/client-search/core/_requests";
import Tippy from "@tippyjs/react";
interface Props {
  handleClose: any;
  formik: FormikProps<FormValues> | null;
}
const ClientSearch: FC<Props> = ({ handleClose, formik }) => {
  const intl = useIntl();
  const [localSearchTerm, setLocalSearchTerm] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [counter, setCounter] = useState(false);
  const [clients, setClients] = useState<any>();
  const [pageIndex, setPageIndex] = useState<number>(1);
  const handleSearchClick = () => {
    setSearchTerm(localSearchTerm);
    setCounter(!counter);
  };

  const fetchClients = async () => {
    const response = await getClients(searchTerm, pageIndex, 5);

    if (response.isValid) {
      setClients(response);
    }
  };
  useEffect(() => {
    fetchClients();
  }, [searchTerm, counter, pageIndex]);

  const handlePageChange = (page: number) => {
    setPageIndex(page);
    fetchClients();
  };

  const setClient = async (client: any) => {
    if (formik != null) {
      formik?.setFieldValue("header.clientId", client.id);
      formik?.setFieldValue("header.clientDisplayName", client.displayName);
      // formik.setFieldValue("header.clientReferenceNr", client.customerNr);
      // formik.setFieldValue("header.clientContactId", 0);
    } else {
      localStorage.setItem("storedClient", JSON.stringify(client));
    }
    handleClose();
  };

  const avatarColors = [
    "bg-dark",
    "bg-warning",
    "bg-success",
    "bg-danger",
    "bg-primary",
    "bg-info",
    "bg-gray-500",
  ];
  return (
    <>
      <div
        className="modal fade show d-block"
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-dialog mw-900px">
          <div className="modal-content">
            <div className="modal-header bg-dark">
              <div className="fv-row col-12 d-flex justify-content-between align-items-center mb-0">
                <h2 className="fw-bolder mb-0 text-white">
                  {intl.formatMessage({
                    id: "Fields.Client",
                  })}
                </h2>
                <div
                  className="btn btn-icon btn-sm btn-active-icon-primary"
                  onClick={handleClose}
                  style={{ cursor: "pointer" }}
                >
                  <KTIcon iconName="cross" className="fs-1 text-white" />
                </div>
              </div>
            </div>

            <div className="modal-body">
              <div className="d-flex align-items-center position-relative mb-5 gap-2 ">
                <KTIcon
                  iconName="magnifier"
                  className="fs-3 position-absolute ms-6"
                />

                <input
                  type="text"
                  data-kt-user-table-filter="search"
                  className="form-control form-control-solid w-100 ps-14 rounded-lg me-6"
                  placeholder={intl.formatMessage({
                    id: "Fields.SearchTerm",
                  })}
                  value={localSearchTerm}
                  onChange={(e) => {
                    e.preventDefault();
                    setLocalSearchTerm(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearchClick();
                    }
                  }}
                />
                <div className="btn-group">
                  <button
                    className="btn btn-dark d-inline-flex align-items-center"
                    onClick={handleSearchClick}
                  >
                    <i className="la la-search fs-2"></i>
                    <span className="ms-1">
                      {intl.formatMessage({ id: "Fields.SearchBtn" })}
                    </span>
                  </button>

                  <button
                    className="btn btn-secondary btn-icon"
                    onClick={() => {
                      setSearchTerm("");
                      setLocalSearchTerm("");
                    }}
                  >
                    <i className="la la-remove fs-3"></i>
                  </button>
                </div>
              </div>
              {clients?.totalRows > 0 && (
                <h5>
                  {intl
                    .formatMessage({ id: "Fields.SearchResultHeaderCount" })
                    .replace("{0}", clients?.totalRows.toString())}
                </h5>
              )}

              <div className="text-center mt-6">
                {clients?.result.length > 0 ? (
                  clients?.result.map((client: any, index: number) => {
                    // Extract initials from the company name
                    const initials = client.businessName
                      .split(" ")
                      .map((word: any) => word.charAt(0))
                      .join("")
                      .toUpperCase()
                      .substring(0, 3);

                    // Pick a color based on the listIndex (cyclic pattern)
                    const avatarColor =
                      avatarColors[index % avatarColors.length];

                    return (
                      <div key={index}>
                        <table className="table table-row-dashed table-row-gray-300 gy-7">
                          <thead>{/* <tr></tr> */}</thead>
                          <tbody>
                            <tr className="table-row-dashed">
                              <td width={50}>
                                <div
                                  className={`avatar rounded-circle d-flex justify-content-center align-items-center my-auto me-3 ${avatarColor}`}
                                  style={{
                                    width: "50px",
                                    height: "50px",
                                    fontSize: "15px",
                                    color: "#fff",
                                  }}
                                >
                                  {initials}
                                </div>
                              </td>
                              <td width={500}>
                                <div
                                  className="d-flex flex-column align-items-start cursor-pointer mb-2"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setClient(client);
                                  }}
                                >
                                  <span className="text-primary fs-4 fw-bold">
                                    {client.displayName}
                                  </span>
                                </div>
                                {client.primaryContact && (
                                  <ul className="breadcrumb breadcrumb-secondary breadcrumb-dot mb-3 text-muted ">
                                    <li className="breadcrumb-item align-items-center">
                                      <i className="far fa-user fs-6 me-2" />
                                      <span className="fs-6">
                                        {client.primaryContact.fullName}
                                      </span>
                                    </li>
                                    {client.primaryContact.emailAddress && (
                                      <li className="breadcrumb-item align-items-center">
                                        <i className="fa fa-envelope fs-7 me-2" />
                                        <span className="fs-6">
                                          {client.primaryContact.emailAddress}
                                        </span>
                                      </li>
                                    )}
                                  </ul>
                                )}
                                {client.clientTypes.length > 0 && (
                                  <div className="d-flex flex-column align-items-start cursor-pointer mb-2">
                                    <small className="bg-gray-300 rounded p-1 px-2 align-items-start">
                                      {client.clientTypes.map(
                                        (clientType: any) => {
                                          return clientType.toLowerCase();
                                        }
                                      )}
                                    </small>
                                  </div>
                                )}
                              </td>
                              <td className="text-end" style={{ width: 250 }}>
                                <small className="bg-gray-300 rounded p-1 px-2">
                                  {intl.formatMessage({ id: "Fields.KvkNr" })}{" "}
                                  {client.customerNr}
                                </small>
                              </td>

                              <td className="text-end">
                                <Tippy
                                  content={intl.formatMessage({
                                    id: "Fields.ToolTipLinkClient",
                                  })}
                                >
                                  <button
                                    className="btn btn-icon btn-primary btn-sm me-2"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setClient(client);
                                    }}
                                  >
                                    <i className="ki-duotone ki-pin text-white fs-2">
                                      <span className="path1"></span>
                                      <span className="path2"></span>
                                    </i>
                                  </button>
                                </Tippy>
                              </td>
                            </tr>
                            <div className="dropdown-divider"></div>
                          </tbody>
                        </table>

                        {/* </div> */}

                        {/* Dotted divider under every row */}
                      </div>
                    );
                  })
                ) : (
                  <>
                    <img
                      alt=""
                      src={toAbsoluteUrl("media/logos/searchnotfound.png")}
                      className="h-250px w-350px"
                    />
                    <h4>
                      {intl.formatMessage({
                        id: "Fields.SearchNoItemsAvailableDefault",
                      })}
                    </h4>
                  </>
                )}
              </div>
            </div>
            {clients?.totalRows !== 0 && (
              <ListPagination
                totalPages={clients?.totalPages}
                pageIndex={clients?.pageIndex}
                onPageChange={handlePageChange}
                totalItems={clients?.totalRows}
              />
            )}
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleClose}
              >
                {intl.formatMessage({ id: "Fields.ActionClose" })}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  );
};

export { ClientSearch };
