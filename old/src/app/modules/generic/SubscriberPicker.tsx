import { useIntl } from "react-intl";
import { KTIcon, KTSVG, toAbsoluteUrl } from "../../../_metronic/helpers";
import { FC, useEffect, useState } from "react";
import { ListPagination } from "./ListPagination";
import { FormikProps } from "formik";
import { getSubscribers } from "../admin-settings/subscribers/core/_requests";
import Tippy from "@tippyjs/react";
// @ts-ignore
import { updatePagination } from "../../helpers/paginationUtils.js";
// @ts-ignore
import { getPaginationModule } from "../../helpers/paginationUtils.js";
// @ts-ignore
import { resetPaginationModule } from "../../helpers/paginationUtils.js";
import { ListLoading } from "./ListLoading";
interface Props {
  handleClose: any;
  formik: FormikProps<any> | null;
  storageName: string;
}
const SubscriberPicker: FC<Props> = ({ handleClose, formik, storageName }) => {
  const intl = useIntl();

  const moduleKey = "subscriber-picker";
  let filters = getPaginationModule(moduleKey);

  const [searchTerm, setSearchTerm] = useState<string>(
    filters?.searchTerm || ""
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [localSearchTerm, setLocalSearchTerm] = useState<string>(searchTerm);
  const [counter, setCounter] = useState<number>(1);
  const [subscribers, setSubscribers] = useState<any>();
  const [pageIndex, setPageIndex] = useState<number>(filters?.pageIndex || 1);
  const handleSearchClick = () => {
    if (localSearchTerm !== undefined) {
      setSearchTerm(localSearchTerm);
      setPageIndex(1);
      updatePagination(moduleKey, { searchTerm: localSearchTerm || "" }, 1);
      setCounter((prev) => prev + 1);
    }
  };

  const handleReset = () => {
    resetPaginationModule(moduleKey);
    setLocalSearchTerm("");
    setSearchTerm("");
    setPageIndex(1);
  };
  const fetchSubscribers = async () => {
    try {
      setIsLoading(true);
      const response = await getSubscribers(pageIndex, searchTerm, 5);
      if (response.isValid) {
        setSubscribers(response);
        setIsLoading(false);
      }
    } finally {
      setIsLoading(false);
    }
  };
  const renderLockIcon = (isChecked: boolean) => {
    return isChecked ? (
      <Tippy
        content={intl.formatMessage({
          id: "Fields.ToolTipActive",
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
          id: "Fields.ToolTipInactive",
        })}
      >
        <span>
          <KTSVG
            path="media/icons/duotune/general/gen037.svg"
            className="svg-icon-danger svg-icon-2x"
          />
        </span>
      </Tippy>
    );
  };
  useEffect(() => {
    fetchSubscribers();
  }, [searchTerm, counter, pageIndex]);

  const handlePageChange = (page: number) => {
    setPageIndex(page);
  };

  const setSubscriber = async (subscriber: any) => {
    if (formik != null) {
      localStorage.setItem("subscriberResponse", JSON.stringify(subscriber));
    } else {
      localStorage.setItem(storageName, JSON.stringify(subscriber));
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
        <div className="modal-dialog mw-850px">
          <div className="modal-content">
            <div className="modal-header bg-primary">
              <div className="fv-row col-12 d-flex justify-content-between align-items-center mb-0">
                <h2 className="fw-bolder mb-0 text-white">
                  {intl.formatMessage({
                    id: "Fields.SearchPanelTitleSubscriber",
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
                    className="btn btn-primary d-inline-flex align-items-center"
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
                      handleReset();
                    }}
                  >
                    <i className="la la-remove fs-3"></i>
                  </button>
                </div>
              </div>
              {subscribers?.totalRows > 0 && (
                <h5 className="my-10">
                  {intl
                    .formatMessage({ id: "Fields.SearchResultHeaderCount" })
                    .replace("{0}", subscribers?.totalRows.toString())}
                </h5>
              )}

              <div className="text-center">
                {subscribers?.result.length > 0 ? (
                  subscribers?.result.map((subscriber: any, index: number) => {
                    // Extract initials from the company name
                    const initials = subscriber.billingContact
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
                        <table className="table table-row-dashed table-row-gray-300">
                          <tbody>
                            <tr>
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
                                    setSubscriber(subscriber);
                                  }}
                                >
                                  <span className="text-primary fs-4 fw-bold">
                                    {subscriber.billingContact}
                                  </span>

                                  {subscriber.billingContactEmailAddress && (
                                    <div className="text-muted">
                                      <i className="fa fa-envelope fs-7 me-2" />
                                      <span className="fs-6">
                                        {subscriber.billingContactEmailAddress}
                                      </span>
                                    </div>
                                  )}
                                  {subscriber.lastActiveLicense.licenseType
                                    .description && (
                                    <div className="text-muted">
                                      <i
                                        className={`fa fa-check fs-7 me-2 ${
                                          subscriber.lastActiveLicense
                                            .statusType.value === 4
                                            ? "text-success"
                                            : "text-muted"
                                        }`}
                                      />
                                      <span className="fs-6">
                                        {
                                          subscriber.lastActiveLicense
                                            .licenseType.description
                                        }
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </td>
                              {subscriber.companies > 0 && (
                                <td>
                                  <div className="d-flex flex-column align-items-start cursor-pointer mb-2">
                                    <small className="bg-gray-300 rounded p-1 px-2 align-items-start">
                                      {subscriber.companies.map((name: any) => {
                                        return name.toLowerCase();
                                      })}
                                    </small>
                                  </div>
                                </td>
                              )}

                              {/* <td className="text-end cursor-pointer">
                                {renderLockIcon(subscriber.isActive)}
                              </td> */}

                              <td className="text-end" style={{ width: 250 }}>
                                <small className="bg-gray-300 rounded p-1 px-2">
                                  {intl.formatMessage({
                                    id: "Fields.LicenseProgressPercentage",
                                  })}
                                  :
                                  {subscriber.lastActiveLicense.usagePercentage}
                                  %
                                </small>
                              </td>
                              <td className="text-end cursor-pointer">
                                {renderLockIcon(subscriber.isActive)}
                              </td>
                              <td className="text-end">
                                <Tippy content="link subscriber">
                                  <button
                                    className="btn btn-icon btn-primary btn-sm me-2"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setSubscriber(subscriber);
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
                            <div></div>
                            {/* <tr>
                              <td colSpan={4}>
                                <div className="dropdown-divider"></div>
                              </td>
                            </tr> */}
                          </tbody>
                        </table>
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
            {isLoading && <ListLoading />}
            {subscribers?.totalRows > 0 && (
              <ListPagination
                totalPages={subscribers?.totalPages}
                pageIndex={subscribers?.pageIndex}
                onPageChange={handlePageChange}
                totalItems={subscribers?.totalRows}
                moduleName="subscriber-picker"
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

export { SubscriberPicker };
