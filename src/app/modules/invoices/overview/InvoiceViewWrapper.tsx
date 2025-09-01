import { useEffect, useState } from "react";
import { Content } from "../../../../_metronic/layout/components/content";
import { ListLoading } from "../../generic/ListLoading";
import { useIntl } from "react-intl";
import { KTIcon, KTSVG } from "../../../../_metronic/helpers";
import { InvoiceAddModal } from "./invoice-add-modal/InvoiceAddModal";
import { ToolbarWrapper } from "../../../../_metronic/layout/components/toolbar";
import {
  getInvoicePaymentsById,
  getInvoiceViewData,
  getQuickViewInvoice,
  payOnline,
} from "./core/_requests";
import {
  getInvoiceMutationsById,
  getInvoiceActivitiesById,
} from "./core/_requests";
import { useNavigate } from "react-router-dom";
import { ErrorPage } from "../../generic/ErrorPage";
import { Activities } from "../../generic/Activities";
import { InvoiceCopyModal } from "./invoice-copy-modal/InvoiceCopyModal";
import { InvoiceEmailModal } from "./invoice-email-modal/InvoiceEmailModal";
import { InvoiceActivateModal } from "./invoice-activate-modal/InvoiceActivateModal";
import { InvoiceOdataModal } from "./invoice-odata-modal/InvoiceOdataModal";
import { useAuth } from "../../auth";
import { ThemeModeComponent } from "../../../../_metronic/assets/ts/layout";
import { useThemeMode } from "../../../../_metronic/partials";
import { Mutations } from "../../generic/Mutations";
import { Payments } from "../../generic/Payments";
import { InvoiceCreditModal } from "./invoice-credit-modal/InvoiceCreditModal";
import { handleToast } from "../../auth/core/_toast";
import { InvoicePaymentModal } from "./invoice-payment-modal/InvoicePaymentModal";
import { getStatusClass } from "../../../utils/statusUtils";
import enums from "../../../../_metronic/i18n/messages/invoicehippo.enums.json";
import { getEnumOptions } from "../../../helpers/intlHelper";
import {
  ActivitiesResult,
  MutationsResult,
} from "../../accounting/bookings/components/core/_models";
import { AttachmentListing } from "../../generic/FileManager/AttachmentListing";
import Invoice from "../../generic/Templates/Template003/Invoice";
import clsx from "clsx";
import { useLayout } from "../../../../_metronic/layout/core";
import * as Tooltip from "@radix-ui/react-tooltip";

const InvoiceViewInnerWrapper = ({ setInvoiceData }: any) => {
  const intl = useIntl();
  const { config } = useLayout();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [copyModalOpen, setCopyModalOpen] = useState(false);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [activateModalOpen, setActivateModalOpen] = useState(false);
  const [validateModalOpen, setValidateModalOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [editModalId, setEditModalId] = useState(0);
  const [activities, setActivities] = useState<ActivitiesResult[]>([]);
  const [mutations, setMutations] = useState<MutationsResult[]>([]);
  const [payments, setPayments] = useState<any>();
  const [errorPage, setErrorPage] = useState<boolean>(false);
  const currentInvoice = JSON.parse(localStorage.getItem("currentItem")!);
  const systemMode = ThemeModeComponent.getSystemMode() as "light" | "dark";
  const { mode } = useThemeMode();
  const calculatedMode = mode === "light" ? systemMode : mode;
  const [invoiceNr, setInvoiceNr] = useState<string>("");
  const [creditModalOpen, setCreditModalOpen] = useState<boolean>(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState<boolean>(false);
  const openCopyModal = () => {
    valueSetter();
    setCopyModalOpen(true);
  };
  const openValidateModal = () => {
    valueSetter();
    setValidateModalOpen(true);
  };

  const openPaymentModal = () => {
    valueSetter();
    setPaymentModalOpen(true);
  };

  const openEmailModal = () => {
    valueSetter();
    setEmailModalOpen(true);
  };

  const openActivateModal = () => {
    valueSetter();
    setActivateModalOpen(true);
  };

  const openCreditModal = () => {
    valueSetter();
    setCreditModalOpen(true);
  };

  const valueSetter = () => {
    localStorage.setItem(
      "ModalData",
      JSON.stringify({
        invoiceDateAsString: response?.invoiceDateAsString,
        client: response?.client?.companyName,
        totalPriceWithVat: response?.totals.totalPriceWithVAT,
        sign: response?.valuta.sign,
        status: response?.invoiceStatus.value,
        attachmentsCount: response?.attachmentsCount,
        activeSendInstructions: response?.activeSendInstructions,
        totalOpen: response?.totals.totalOpen,
      })
    );
  };
  const [response, setResponse] = useState<any>();

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true);
      const response = await getQuickViewInvoice(currentInvoice);
      if (response.isValid) {
        setResponse(response.result);
        setInvoiceData({
          getPayOnlineUrl: () => getPayOnlineUrl(),
          actions: response?.result.actions,
          setAddModalOpen: setAddModalOpen,
          setEditModalId: setEditModalId,
          spinner: spinner,
        });
        localStorage.setItem(
          "currentNr",
          JSON.stringify(response.result.invoiceNr)
        );
      }
      setIsLoading(false);
    };
    if (currentInvoice) {
      fetch();
    } else {
      setErrorPage(true);
    }
  }, [refresh]);
  const [viewData, setViewData] = useState<any>();
  useEffect(() => {
    const fetch = async () => {
      const response = await getInvoiceViewData(currentInvoice);
      if (response.isValid) {
        setViewData(response.result);
      }
    };
    fetch();
  }, [refresh]);

  useEffect(() => {
    const fetchActivities = async () => {
      const responseEstimation = await getInvoiceActivitiesById(currentInvoice);
      if (responseEstimation.isValid) {
        setActivities(responseEstimation.result);
      }
    };
    if (currentInvoice) {
      fetchActivities();
    }
  }, [refresh]);

  useEffect(() => {
    const fetchMutations = async () => {
      const response = await getInvoiceMutationsById(currentInvoice);
      if (response.isValid) {
        setMutations(response.result);
      }
    };
    if (currentInvoice) {
      fetchMutations();
    }
  }, [refresh]);
  useEffect(() => {
    const fetchPayments = async () => {
      const response = await getInvoicePaymentsById(currentInvoice);
      if (response.isValid) {
        setPayments(response);
      }
    };
    if (currentInvoice) {
      fetchPayments();
    }
  }, [refresh]);

  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);
  useEffect(() => {
    if (response?.attachments?.length === 1) {
      setIsCollapsed(false);
    } else {
      setIsCollapsed(true);
    }
  }, [response?.attachments?.length, refresh]);

  const [downloadUrl, setDownloadUrl] = useState<string>("");
  const [key, setKey] = useState<number>(1);

  const [odata, setOdata] = useState<string>("");
  const [accessCode, setAccessCode] = useState<string>("");
  const [odataModalOpen, setOdataModalOpen] = useState<boolean>(false);
  const [alterEmail, setAlterEmail] = useState<boolean>(false);
  const openOdataCopy = () => {
    setOdata(response?.anonymousAccessUrl);
    setAccessCode(response?.anonymousAccessCode);
    setOdataModalOpen(true);
  };
  const auth = useAuth();
  const [spinner, setSpinner] = useState<boolean>(false);

  const getPayOnlineUrl = async () => {
    try {
      setSpinner(true);
      const res = await payOnline(response?.id);
      if (res.isValid) {
        window.location.href = res.result;
      }
      handleToast(res);
    } finally {
      setSpinner(false);
    }
  };
  return (
    <>
      {errorPage ? (
        <div className="text-center">
          <ErrorPage />
        </div>
      ) : (
        <div className="invoice-container-12">
          <div className="card card-custom rounded-0 mt-5">
            <div className="card-header card-header-stretch mt-10 flex-grow-1 ">
              <div className="card-title my-4">
                <img
                  className="h-60px me-2"
                  src="/media/svg/general/invoice-report.svg"
                />
                <div className="d-flex flex-column">
                  {response?.hasVoucherNr && (
                    <small className="ms-2 text-muted fs-9">
                      #{response?.voucherNr}
                    </small>
                  )}
                  <div>
                    <Tooltip.Provider delayDuration={0}>
                      <Tooltip.Root>
                        <Tooltip.Trigger asChild>
                          <span className="mx-2 fs-9 fw-normal cursor-pointer">
                            <i className="fas fa-calendar-alt me-2 text-primary"></i>
                            {response?.invoiceDateAsString}
                          </span>
                        </Tooltip.Trigger>

                        <Tooltip.Portal>
                          <Tooltip.Content side="top" className="app-tooltip">
                            {intl.formatMessage({ id: "Fields.InvoiceDate" })}
                            <Tooltip.Arrow className="app-tooltip-arrow" />
                          </Tooltip.Content>
                        </Tooltip.Portal>
                      </Tooltip.Root>
                    </Tooltip.Provider>
                    <Tooltip.Provider delayDuration={0}>
                      <Tooltip.Root>
                        <Tooltip.Trigger asChild>
                          <span className="fs-9 fw-normal cursor-pointer">
                            <i className="fas fa-calendar-alt me-2"></i>
                            {response?.invoiceDueDateAsString}
                          </span>
                        </Tooltip.Trigger>

                        <Tooltip.Portal>
                          <Tooltip.Content side="top" className="app-tooltip">
                            {intl.formatMessage({
                              id: "Fields.InvoiceDueDate",
                            })}
                            <Tooltip.Arrow className="app-tooltip-arrow" />
                          </Tooltip.Content>
                        </Tooltip.Portal>
                      </Tooltip.Root>
                    </Tooltip.Provider>
                  </div>

                  <span className="ms-1 mt-1 fs-5 fw-bold">
                    {response?.client.companyName}
                  </span>
                  {response?.clientReferenceNr && (
                    <div>
                      <span className="badge bg-secondary fs-9 fw-normal">
                        {response?.clientReferenceNr}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="card-toolbar mt-15">
                <ul className="nav nav-tabs nav-line-tabs nav-stretch fs-6 border-0 bottom-0">
                  <li className="nav-item">
                    <a
                      className="nav-link active"
                      data-bs-toggle="tab"
                      href="#kt_tab_file"
                    >
                      {intl
                        .formatMessage({ id: "Fields.TabInvoice" })
                        .toLowerCase()}
                    </a>
                  </li>
                  {response?.viewTabs?.showPrivateComments && (
                    <li className="nav-item">
                      <a
                        className="nav-link"
                        data-bs-toggle="tab"
                        href="#kt_tab_comments"
                      >
                        <KTIcon
                          iconName="message-text-2"
                          className="me-2 fs-2"
                        />
                        {intl
                          .formatMessage({
                            id: "Fields.TabPrivateComments",
                          })
                          .toLowerCase()}
                      </a>
                    </li>
                  )}
                  {response?.viewTabs?.showActionHistory && (
                    <li className="nav-item">
                      <a
                        className="nav-link"
                        data-bs-toggle="tab"
                        href="#kt_tab_activities"
                      >
                        <i className="fas fa-history me-2"></i>
                        {intl
                          .formatMessage({ id: "Fields.TabActionHistory" })
                          .toLowerCase()}
                      </a>
                    </li>
                  )}
                  {response?.viewTabs?.showBookingMutations && (
                    <li className="nav-item">
                      <a
                        className="nav-link"
                        data-bs-toggle="tab"
                        href="#kt_tab_mutations"
                      >
                        <i className="fas fa-list me-2"></i>
                        {intl
                          .formatMessage({
                            id: "Fields.TabActivaMutations",
                          })
                          .toLowerCase()}
                      </a>
                    </li>
                  )}

                  {response?.viewTabs?.hasPayments && (
                    <li className="nav-item">
                      <a
                        className="nav-link"
                        data-bs-toggle="tab"
                        href="#kt_tab_payments"
                      >
                        <i className="fa far fa-credit-card me-2"></i>
                        {intl
                          .formatMessage({
                            id: "Fields.TabPayments",
                          })
                          .toLowerCase()}
                      </a>
                    </li>
                  )}
                  {!auth.currentUser?.result.isAnonymousUser && (
                    <li className="nav-item">
                      <div style={{ padding: "1.3rem 0", margin: "0 1rem" }}>
                        <div className="cursor-pointer btn-group drop-right">
                          <button
                            className="btn btn-icon btn-sm ms-5 me-2 text-muted align-items-center d-flex"
                            data-bs-toggle="dropdown"
                          >
                            <i className="ki-outline ki-gear me-1 fs-3"></i>

                            {intl
                              .formatMessage({ id: "Fields.TabOptions" })
                              .toLowerCase()}
                            <i className="fa fa-chevron-down ms-2"></i>
                          </button>
                          <ul className="dropdown-menu w-content-fit py-4">
                            <li
                              onClick={() => {
                                setAddModalOpen(true),
                                  setEditModalId(currentInvoice);
                              }}
                            >
                              <a className="dropdown-item d-flex align-items-center cursor-pointer">
                                <i className="ki-solid ki-pencil text-warning fs-3 me-2" />
                                {intl.formatMessage({
                                  id: "Fields.ActionEdit",
                                })}
                              </a>
                            </li>

                            {response?.actions.canSend && (
                              <>
                                <div className="dropdown-divider border-gray-200"></div>
                                <li
                                  onClick={() => {
                                    openEmailModal();
                                  }}
                                >
                                  <a className="dropdown-item d-flex align-items-center text-center cursor-pointer">
                                    <i className="ki-duotone ki-send text-success fs-1 me-2">
                                      <span className="path1"></span>
                                      <span className="path2"></span>
                                    </i>
                                    {intl.formatMessage({
                                      id: "Fields.ActionSendEmail",
                                    })}
                                  </a>
                                </li>
                              </>
                            )}

                            {response?.actions.canRegisterPayment && (
                              <>
                                <div className="dropdown-divider border-gray-200"></div>
                                <li
                                  onClick={() => {
                                    openPaymentModal();
                                  }}
                                >
                                  <a className="dropdown-item d-flex align-items-center text-center cursor-pointer">
                                    <i className="fa far fa-credit-card text-info fs-2 me-2"></i>
                                    {intl.formatMessage({
                                      id: "Fields.ActionPayment",
                                    })}
                                  </a>
                                </li>
                              </>
                            )}
                            {response?.actions.canAlterSendInstructions && (
                              <>
                                <div className="dropdown-divider border-gray-200"></div>
                                <li
                                  onClick={() => {
                                    openEmailModal();
                                    setAlterEmail(true);
                                  }}
                                >
                                  <a className="dropdown-item d-flex align-items-center text-center cursor-pointer">
                                    <i className="ki-duotone ki-send text-success fs-1 me-2">
                                      <span className="path1"></span>
                                      <span className="path2"></span>
                                    </i>
                                    {intl.formatMessage({
                                      id: "Fields.ActionAlterSendEmailInstructions",
                                    })}
                                  </a>
                                </li>
                              </>
                            )}
                            {response?.actions.canCredit && (
                              <>
                                <div className="dropdown-divider border-gray-200"></div>
                                <li
                                  onClick={() => {
                                    openCreditModal();
                                  }}
                                >
                                  <a className="dropdown-item d-flex align-items-center text-center cursor-pointer">
                                    <i className="fa fas fa-trash-restore-alt fs-3 me-2" />
                                    {intl.formatMessage({
                                      id: "Fields.ActionCredit",
                                    })}
                                  </a>
                                </li>
                              </>
                            )}
                            {response?.actions.canCreateInvoice && (
                              <>
                                <div className="dropdown-divider border-gray-200"></div>
                                <li>
                                  <a className="dropdown-item d-flex align-items-center cursor-pointer">
                                    <KTSVG
                                      className="svg-icon svg-icon-2 me-2"
                                      path="media/svg/general/invoice-01-bulk-rounded.svg"
                                    />
                                    {intl.formatMessage({
                                      id: "Fields.ActionCreateInvoice",
                                    })}
                                  </a>
                                </li>
                              </>
                            )}
                            {response?.actions.canCreateCopy && (
                              <>
                                <div className="dropdown-divider border-gray-200"></div>
                                <li onClick={() => openCopyModal()}>
                                  <a className="dropdown-item d-flex align-items-center cursor-pointer">
                                    <i className="ki-duotone ki-copy fs-2 me-2 text-primary" />
                                    {intl.formatMessage({
                                      id: "Fields.ActionCopy",
                                    })}
                                  </a>
                                </li>
                              </>
                            )}
                            {response?.actions.canFinalize && (
                              <>
                                <div className="dropdown-divider border-gray-200"></div>
                                <li
                                  onClick={() => {
                                    openActivateModal();
                                  }}
                                >
                                  <a className="dropdown-item d-flex align-items-center cursor-pointer">
                                    <i className="fa fas fa-flag-checkered text-success fs-3 me-2" />
                                    {intl.formatMessage({
                                      id: "Fields.ActionActivate",
                                    })}
                                  </a>
                                </li>
                              </>
                            )}
                            {!response?.isDraft && (
                              <>
                                <div className="dropdown-divider border-gray-200"></div>
                                <li
                                  onClick={() => {
                                    openOdataCopy();
                                  }}
                                >
                                  <a className="dropdown-item d-flex align-items-center cursor-pointer">
                                    <KTSVG
                                      className="svg-icon svg-icon-3 me-2"
                                      path="media/svg/general/link-square-01-bulk-rounded.svg"
                                    />
                                    Odata
                                  </a>
                                </li>
                              </>
                            )}
                            {response?.actions.canDownload && (
                              <>
                                <div className="dropdown-divider border-gray-200"></div>
                                <li
                                  onClick={() => {
                                    const link = document.createElement("a");
                                    link.href =
                                      response?.downloadInfo.downloadUrl;
                                    link.setAttribute(
                                      "download",
                                      response?.downloadInfo.fileName
                                    );
                                    document.body.appendChild(link);
                                    link.click();
                                    document.body.removeChild(link);
                                  }}
                                  // onClick={() =>
                                  //   exportInvoiceToPDF(
                                  //     "kt_tab_file",
                                  //     response?.downloadInfo.fileName
                                  //   )
                                  // }
                                >
                                  <a className="dropdown-item d-flex align-items-center cursor-pointer">
                                    <i className="fa-solid fa-cloud-arrow-down text-primary me-2 fs-3"></i>
                                    {intl.formatMessage({
                                      id: "Fields.ActionDownload",
                                    })}
                                  </a>
                                </li>
                              </>
                            )}
                            {response?.actions.canDelete && (
                              <>
                                <div className="dropdown-divider border-gray-200"></div>
                                <li>
                                  <a className="dropdown-item d-flex align-items-center text-center cursor-pointer">
                                    <i className="ki-solid ki-trash text-danger fs-2 me-2"></i>
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
                    </li>
                  )}
                </ul>
              </div>
            </div>

            <div
              className="ribbon ribbon-start ribbon-clip position-absolute"
              style={{
                top: "10px",
                height: "30px",
                minWidth: "200px",
              }}
            >
              <div className="ribbon-label fw-bold">
                {response?.invoiceNr}
                <span className="ribbon-inner bg-gray-600"></span>
              </div>
            </div>
            {response?.relatedParentInvoice !== null && (
              <div
                className="position-absolute text-muted fs-8 fw-bold"
                style={{
                  top: "17px",
                  zIndex: 2,
                  right:
                    response?.totals.totalPriceWithVAT > 99
                      ? "75px"
                      : response?.totals.totalPriceWithVAT < -99
                      ? "82px"
                      : "60px",
                }}
              >
                <i className="fa fas fa-share text-danger fs-7 me-2"></i>

                <Tooltip.Provider delayDuration={0}>
                  <Tooltip.Root>
                    <Tooltip.Trigger asChild>
                      <span
                        className="cursor-pointer text-danger border border-danger rounded p-2"
                        onClick={() => {
                          localStorage.setItem(
                            "currentItem",
                            JSON.stringify(response?.relatedParentInvoice.id)
                          );
                          navigate(`/invoice/view/${response?.uniqueId}`);
                          setRefresh(!refresh);
                        }}
                      >
                        {response?.relatedParentInvoice.invoiceNr}
                      </span>
                    </Tooltip.Trigger>

                    <Tooltip.Portal>
                      <Tooltip.Content side="top" className="app-tooltip">
                        {intl.formatMessage({
                          id: "Fields.RelatedInvoice",
                        })}
                        <Tooltip.Arrow className="app-tooltip-arrow" />
                      </Tooltip.Content>
                    </Tooltip.Portal>
                  </Tooltip.Root>
                </Tooltip.Provider>
              </div>
            )}

            {response?.relatedCreditInvoice !== null && (
              <div
                className="position-absolute text-muted fs-8 fw-bold"
                style={{
                  top: "17px",
                  zIndex: 2,
                  right:
                    response?.totals.totalPriceWithVAT > 99
                      ? "75px"
                      : response?.totals.totalPriceWithVAT < -99
                      ? "82px"
                      : "60px",
                }}
              >
                <i className="fa fas fa-share text-warning fs-7 me-2"></i>

                <Tooltip.Provider delayDuration={0}>
                  <Tooltip.Root>
                    <Tooltip.Trigger asChild>
                      <span
                        className="cursor-pointer text-warning border border-warning rounded p-2"
                        onClick={() => {
                          localStorage.setItem(
                            "currentItem",
                            JSON.stringify(response?.relatedCreditInvoice.id)
                          );
                          navigate(`/invoice/view/${response.uniqueId}`);
                          setRefresh(!refresh);
                        }}
                      >
                        {response?.relatedCreditInvoice?.invoiceNr}
                      </span>
                    </Tooltip.Trigger>

                    <Tooltip.Portal>
                      <Tooltip.Content side="top" className="app-tooltip">
                        {intl.formatMessage({
                          id: "Fields.RelatedCreditInvoice",
                        })}
                        <Tooltip.Arrow className="app-tooltip-arrow" />
                      </Tooltip.Content>
                    </Tooltip.Portal>
                  </Tooltip.Root>
                </Tooltip.Provider>
              </div>
            )}

            <div
              className="ribbon ribbon-top position-absolute"
              style={{
                left: "60%",
                transform: "translateX(-50%)",
                height: "20px",
                whiteSpace: "nowrap",
              }}
            >
              <div
                className={`ribbon-label fw-bold ${getStatusClass(
                  response?.invoiceStatus?.value || 1
                )} `}
              >
                {getEnumOptions(enums.InvoiceStatusTypes, intl)
                  .find((item) => item.value === response?.invoiceStatus.value)
                  ?.label.toLowerCase()}
              </div>
            </div>

            <Tooltip.Provider delayDuration={0}>
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <div
                    className="ribbon ribbon-end ribbon-clip position-absolute cursor-pointer"
                    style={{
                      top: "10px",
                      right: "0px",
                      height: "30px",
                      width: "100px",
                    }}
                  >
                    <div className="ribbon-label fw-bold">
                      {response?.valuta.sign}{" "}
                      {response?.totals.totalPriceWithVAT.toFixed(2)}
                      <span className="ribbon-inner bg-gray-600"></span>
                    </div>
                  </div>
                </Tooltip.Trigger>

                <Tooltip.Portal>
                  <Tooltip.Content side="top" className="app-tooltip">
                    <div style={{ fontFamily: "monospace" }}>
                      <div className="table" style={{ width: "100%" }}>
                        <div style={{ display: "table-row" }}>
                          <div
                            className="px-2"
                            style={{
                              display: "table-cell",
                              textAlign: "right",
                            }}
                          >
                            {intl.formatMessage({ id: "Fields.Amount" })}:
                          </div>
                          <div
                            style={{
                              display: "table-cell",
                              textAlign: "right",
                            }}
                          >
                            {response?.valuta.sign}
                            {response?.totals.totalPrice.toFixed(2)}
                          </div>
                        </div>
                        <div style={{ display: "table-row" }}>
                          <div
                            className="px-2"
                            style={{
                              display: "table-cell",
                              textAlign: "right",
                            }}
                          >
                            {intl.formatMessage({ id: "Fields.VatTitle" })}:
                          </div>
                          <div
                            style={{
                              display: "table-cell",
                              textAlign: "right",
                            }}
                          >
                            {response?.valuta.sign}
                            {response?.totals.totalVATAmount.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                    <Tooltip.Arrow className="app-tooltip-arrow" />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            </Tooltip.Provider>
            <div className="card-body p-0 m-0 ">
              <div className="tab-content" id="myTabContent">
                <div
                  className="tab-pane fade show active mt-1 bg-light"
                  id="kt_tab_file"
                  role="tabpanel"
                >
                  <Invoice data={viewData} />
                </div>

                <div
                  className="tab-pane fade p-10 mw-1024px"
                  id="kt_tab_activities"
                  role="tabpanel"
                >
                  <Activities activities={activities} />
                </div>

                <div
                  className="tab-pane fade p-10 mw-1024px"
                  id="kt_tab_mutations"
                  role="tabpanel"
                >
                  <Mutations mutations={mutations} />
                </div>
                <div
                  className="tab-pane fade p-10 mw-1024px"
                  id="kt_tab_payments"
                  role="tabpanel"
                >
                  <Payments
                    payments={payments}
                    refresh={refresh}
                    setRefresh={setRefresh}
                  />
                </div>

                <div
                  className="tab-pane fade p-10 mw-1024px"
                  id="kt_tab_comments"
                  role="tabpanel"
                >
                  <span
                    dangerouslySetInnerHTML={{
                      __html: response?.privateComments,
                    }}
                  />
                </div>
              </div>
            </div>
            {response?.hasAttachments && (
              <AttachmentListing
                attachments={response?.attachments}
                setIsCollapsed={setIsCollapsed}
                isCollapsed={isCollapsed}
                setDownloadUrl={setDownloadUrl}
                setKey={setKey}
                isBgGray={true}
              />
            )}
          </div>
          <div
            className={clsx("justify-content-between d-flex p-5", {
              "bg-dark": config.layoutType === "dark-sidebar",
              "bg-light": config.layoutType === "light-sidebar",
            })}
          >
            <div></div>
            {response?.actions.canInvokeOnlinePayment && (
              <div>
                <button
                  className="btn btn-success btn-sm"
                  onClick={() => getPayOnlineUrl()}
                >
                  {spinner ? (
                    <span
                      className="indicator-progress"
                      style={{ display: "block" }}
                    >
                      <span
                        dangerouslySetInnerHTML={{
                          __html: intl.formatMessage({ id: "Common.Busy" }),
                        }}
                      />
                      <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
                    </span>
                  ) : (
                    <>
                      {
                        auth.currentUser?.result.activeCompanyDefaults
                          .defaultValuta.sign
                      }{" "}
                      {intl.formatMessage({
                        id: "Fields.ActionInvokeOnlinePayment",
                      })}
                    </>
                  )}
                </button>
              </div>
            )}
            <div>
              {response?.actions.canEdit && (
                <Tooltip.Provider delayDuration={0}>
                  <Tooltip.Root>
                    <Tooltip.Trigger asChild>
                      <button
                        type="button"
                        className="btn btn-icon btn-warning btn-sm"
                        onClick={() => {
                          setAddModalOpen(true), setEditModalId(currentInvoice);
                        }}
                      >
                        <i className="ki-solid ki-pencil fs-3" />
                      </button>
                    </Tooltip.Trigger>

                    <Tooltip.Portal>
                      <Tooltip.Content side="top" className="app-tooltip">
                        {intl.formatMessage({
                          id: "Fields.ToolTipEdit",
                        })}
                        <Tooltip.Arrow className="app-tooltip-arrow" />
                      </Tooltip.Content>
                    </Tooltip.Portal>
                  </Tooltip.Root>
                </Tooltip.Provider>
              )}
              {response?.actions.canDownload && (
                <Tooltip.Provider delayDuration={0}>
                  <Tooltip.Root>
                    <Tooltip.Trigger asChild>
                      <button
                        type="button"
                        className="btn btn-icon btn-success ms-5 btn-sm"
                        onClick={() => {
                          const link = document.createElement("a");
                          link.href = response.downloadInfo.downloadUrl;
                          link.setAttribute(
                            "download",
                            response.downloadInfo.fileName
                          );
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        }}
                      >
                        <i className="fa-solid fa-cloud-arrow-down fs-4"></i>
                      </button>
                    </Tooltip.Trigger>

                    <Tooltip.Portal>
                      <Tooltip.Content side="top" className="app-tooltip">
                        {intl.formatMessage({
                          id: "Fields.ActionDownload",
                        })}
                        <Tooltip.Arrow className="app-tooltip-arrow" />
                      </Tooltip.Content>
                    </Tooltip.Portal>
                  </Tooltip.Root>
                </Tooltip.Provider>
              )}
              {response?.actions.canSend && (
                <Tooltip.Provider delayDuration={0}>
                  <Tooltip.Root>
                    <Tooltip.Trigger asChild>
                      <button
                        type="button"
                        className="btn btn-icon btn-success btn-sm ms-5"
                        onClick={() => openEmailModal()}
                      >
                        <i className="fas fa-location-arrow fs-3"></i>
                      </button>
                    </Tooltip.Trigger>

                    <Tooltip.Portal>
                      <Tooltip.Content side="top" className="app-tooltip">
                        {intl.formatMessage({
                          id: "Fields.ActionSendEmail",
                        })}
                        <Tooltip.Arrow className="app-tooltip-arrow" />
                      </Tooltip.Content>
                    </Tooltip.Portal>
                  </Tooltip.Root>
                </Tooltip.Provider>
              )}
              {response?.actions.canFinalize && (
                <Tooltip.Provider delayDuration={0}>
                  <Tooltip.Root>
                    <Tooltip.Trigger asChild>
                      <button
                        type="button"
                        className="btn btn-icon btn-success btn-sm ms-5"
                        onClick={() => openActivateModal()}
                      >
                        <i className="fa fas fa-flag-checkered fs-3" />
                      </button>
                    </Tooltip.Trigger>

                    <Tooltip.Portal>
                      <Tooltip.Content side="top" className="app-tooltip">
                        {intl.formatMessage({
                          id: "Fields.ActionActivate",
                        })}
                        <Tooltip.Arrow className="app-tooltip-arrow" />
                      </Tooltip.Content>
                    </Tooltip.Portal>
                  </Tooltip.Root>
                </Tooltip.Provider>
              )}
            </div>
          </div>
          {isLoading && <ListLoading />}
          {/* Modals */}
          {addModalOpen && (
            <InvoiceAddModal
              setRefresh={setRefresh}
              setAddModalOpen={setAddModalOpen}
              refresh={refresh}
              setEditModalId={setEditModalId}
              editModalId={editModalId}
              setActivateModalOpen={setActivateModalOpen}
              setInvoiceNr={setInvoiceNr}
              setEmailModalOpen={setEmailModalOpen}
              addModalOpen={addModalOpen}
            />
          )}

          {copyModalOpen && (
            <InvoiceCopyModal
              invoiceId={currentInvoice}
              invoiceNr={response?.invoiceNr}
              setCopyModalOpen={setCopyModalOpen}
              setRefresh={setRefresh}
              refresh={refresh}
              setAddModalOpen={setAddModalOpen}
              setEditModalId={setEditModalId}
            />
          )}
          {creditModalOpen && (
            <InvoiceCreditModal
              invoiceId={currentInvoice}
              invoiceNr={response?.invoiceNr}
              setCreditModalOpen={setCreditModalOpen}
              setRefresh={setRefresh}
              refresh={refresh}
              setAddModalOpen={setAddModalOpen}
              setEditModalId={setEditModalId}
            />
          )}
          {emailModalOpen && (
            <InvoiceEmailModal
              invoiceId={currentInvoice}
              invoiceNr={response?.invoiceNr}
              setEmailModalOpen={setEmailModalOpen}
              setRefresh={setRefresh}
              refresh={refresh}
              alterEmail={alterEmail}
            />
          )}
          {activateModalOpen && (
            <InvoiceActivateModal
              invoiceId={currentInvoice}
              invoiceNr={response?.invoiceNr}
              setActivateModalOpen={setActivateModalOpen}
              setRefresh={setRefresh}
              refresh={refresh}
            />
          )}

          {odataModalOpen && (
            <InvoiceOdataModal
              setOdataModalOpen={setOdataModalOpen}
              odata={odata}
              accessCode={accessCode}
            />
          )}
          {paymentModalOpen && (
            <InvoicePaymentModal
              invoiceId={currentInvoice}
              invoiceNr={response?.invoiceNr}
              setPaymentModalOpen={setPaymentModalOpen}
              setRefresh={setRefresh}
              refresh={refresh}
            />
          )}
        </div>
      )}
    </>
  );
};

const InvoiceViewWrapper = () => {
  const [invoiceData, setInvoiceData] = useState<any>();
  return (
    <>
      <ToolbarWrapper invoiceData={invoiceData} />
      <Content>
        <InvoiceViewInnerWrapper setInvoiceData={setInvoiceData} />
      </Content>
    </>
  );
};

export { InvoiceViewWrapper };
