import { useEffect, useRef, useState } from "react";
import { Content } from "../../../../_metronic/layout/components/content";
import { ListLoading } from "../../generic/ListLoading";
import Tippy from "@tippyjs/react";
import { useIntl } from "react-intl";
import { KTIcon, KTSVG } from "../../../../_metronic/helpers";
import { InvoiceAddModal } from "./invoice-add-modal/InvoiceAddModal";
import { ToolbarWrapper } from "../../../../_metronic/layout/components/toolbar";
import {
  getInvoicePaymentsById,
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
import { AttachmentListing } from "../../generic/FileManager/AttachmentListing";
const VIEWER_LICENSE_KEY = import.meta.env.VITE_APP_VIEWER_LICENSE_KEY;
const InvoiceViewInnerWrapper = () => {
  const { BASE_URL } = import.meta.env;
  const intl = useIntl();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [copyModalOpen, setCopyModalOpen] = useState(false);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [activateModalOpen, setActivateModalOpen] = useState(false);
  const [validateModalOpen, setValidateModalOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [editModalId, setEditModalId] = useState(0);
  const [activities, setActivities] = useState<any>();
  const [mutations, setMutations] = useState<any>();
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
      const response = await getQuickViewInvoice(currentInvoice?.id);
      if (response.isValid) {
        setResponse(response.result);
        localStorage.setItem(
          "currentNr",
          JSON.stringify(response.result.invoiceNr)
        );
      }
      setIsLoading(false);
    };
    if (currentInvoice?.id) {
      fetch();
    } else {
      setErrorPage(true);
    }
  }, [refresh]);
  useEffect(() => {
    const fetchActivities = async () => {
      const responseEstimation = await getInvoiceActivitiesById(
        currentInvoice?.id
      );
      if (responseEstimation.isValid) {
        setActivities(responseEstimation);
      }
    };
    if (currentInvoice?.id) {
      fetchActivities();
    }
  }, [refresh]);

  useEffect(() => {
    const fetchMutations = async () => {
      const response = await getInvoiceMutationsById(currentInvoice?.id);
      if (response.isValid) {
        setMutations(response);
      }
    };
    if (currentInvoice?.id) {
      fetchMutations();
    }
  }, [refresh]);
  useEffect(() => {
    const fetchPayments = async () => {
      const response = await getInvoicePaymentsById(currentInvoice?.id);
      if (response.isValid) {
        setPayments(response);
      }
    };
    if (currentInvoice?.id) {
      fetchPayments();
    }
  }, [refresh]);

  useEffect(() => {
    if (response?.downloadInfo.downloadUrl) {
      setIsLoading(true);
      const container = containerRef.current;
      let PSPDFKit: any, instance;

      (async function () {
        PSPDFKit = await import("pspdfkit");
        PSPDFKit.unload(container);

        instance = await PSPDFKit.load({
          licenseKey: VIEWER_LICENSE_KEY,
          container,
          theme:
            calculatedMode === "dark"
              ? PSPDFKit.Theme.DARK
              : PSPDFKit.Theme.LIGHT,
          document: response.downloadInfo.downloadUrl,
          baseUrl: `${window.location.protocol}//${window.location.host}/${BASE_URL}`,
        });
        instance.setViewState((viewState: any) =>
          viewState.set("showToolbar", !viewState.showToolbar)
        );
        PSPDFKit.ZoomMode.FIT_PAGE;
      })();
      setIsLoading(false);
      return () => PSPDFKit && PSPDFKit.unload(container);
    }
  }, [response, refresh, calculatedMode]);

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
      {response?.actions.canInvokeOnlinePayment && (
        <button
          className="btn btn-success btn-sm"
          style={{
            position: "fixed",
            top: "110px",
            right: auth.currentUser?.result.isAnonymousUser ? "60px" : "220px",
          }}
          onClick={() => getPayOnlineUrl()}
        >
          {spinner ? (
            <span className="indicator-progress" style={{ display: "block" }}>
              {intl.formatMessage({ id: "Common.Busy" })}
              <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
            </span>
          ) : (
            <>
              {
                auth.currentUser?.result.activeCompanyDefaults.defaultValuta
                  .sign
              }{" "}
              {intl.formatMessage({ id: "Fields.ActionInvokeOnlinePayment" })}
            </>
          )}
        </button>
      )}

      {!auth.currentUser?.result.isAnonymousUser &&
        response?.actions.canEdit && (
          <button
            className="btn btn-primary btn-sm"
            style={{
              position: "fixed",
              top: "110px",
              right: "60px",
            }}
            onClick={() => {
              setAddModalOpen(true);
              setEditModalId(0);
            }}
          >
            <KTIcon iconName="plus" className="fs-2" />
            {intl.formatMessage({ id: "Menu.AddNewInvoice" })}
          </button>
        )}
      {errorPage ? (
        <div className="text-center">
          <ErrorPage />
        </div>
      ) : (
        <div>
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
                    <Tippy
                      content={intl.formatMessage({ id: "Fields.InvoiceDate" })}
                    >
                      <span className="mx-2 fs-9 fw-normal cursor-pointer">
                        <i className="fas fa-calendar-alt me-2 text-primary"></i>
                        {response?.invoiceDateAsString}
                      </span>
                    </Tippy>
                    <Tippy
                      content={intl.formatMessage({
                        id: "Fields.InvoiceDueDate",
                      })}
                    >
                      <span className="fs-9 fw-normal cursor-pointer">
                        <i className="fas fa-calendar-alt me-2"></i>
                        {response?.invoiceDueDateAsString}
                      </span>
                    </Tippy>
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
                      {intl.formatMessage({ id: "Fields.TabInvoice" })}
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
                        {intl.formatMessage({
                          id: "Fields.TabPrivateComments",
                        })}
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
                        {intl.formatMessage({ id: "Fields.TabActionHistory" })}
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
                        {intl.formatMessage({
                          id: "Fields.TabActivaMutations",
                        })}
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
                        {intl.formatMessage({
                          id: "Fields.TabPayments",
                        })}
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

                            {intl.formatMessage({ id: "Fields.TabOptions" })}
                            <i className="fa fa-chevron-down ms-2"></i>
                          </button>
                          <ul className="dropdown-menu w-content-fit py-4">
                            <li
                              onClick={() => {
                                setAddModalOpen(true),
                                  setEditModalId(currentInvoice?.id);
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
                <Tippy
                  content={intl.formatMessage({
                    id: "Fields.RelatedInvoice",
                  })}
                >
                  <span
                    className="cursor-pointer text-danger border border-danger rounded p-2"
                    onClick={() => {
                      localStorage.setItem(
                        "currentItem",
                        JSON.stringify(response?.relatedParentInvoice)
                      );
                      navigate(`/invoice/view/${response?.uniqueId}`);
                      setRefresh(!refresh);
                    }}
                  >
                    {response?.relatedParentInvoice.invoiceNr}
                  </span>
                </Tippy>
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
                <Tippy
                  content={intl.formatMessage({
                    id: "Fields.RelatedCreditInvoice",
                  })}
                >
                  <span
                    className="cursor-pointer text-warning border border-warning rounded p-2"
                    onClick={() => {
                      localStorage.setItem(
                        "currentItem",
                        JSON.stringify(response?.relatedCreditInvoice)
                      );
                      navigate(`/invoice/view/${response.uniqueId}`);
                      setRefresh(!refresh);
                    }}
                  >
                    {response?.relatedCreditInvoice?.invoiceNr}
                  </span>
                </Tippy>
              </div>
            )}

            <div
              className="ribbon ribbon-top position-absolute"
              style={{
                left: "0",
                right: "0",
                height: "20px",
                maxWidth: "240px", // Adjust width as needed
                margin: "auto",
              }}
            >
              <div
                className={`ribbon-label fw-bold ${getStatusClass(
                  response?.invoiceStatus?.value || 1
                )} ${response?.isDraft ? "text-dark" : "text-white"}`}
              >
                {getEnumOptions(enums.InvoiceStatusTypes, intl)
                  .find((item) => item.value === response?.invoiceStatus.value)
                  ?.label.toLowerCase()}
              </div>
            </div>
            <Tippy
              content={
                <div style={{ fontFamily: "monospace" }}>
                  <div className="table" style={{ width: "100%" }}>
                    <div style={{ display: "table-row" }}>
                      <div
                        className="px-2"
                        style={{ display: "table-cell", textAlign: "right" }}
                      >
                        {intl.formatMessage({ id: "Fields.Amount" })}:
                      </div>
                      <div
                        style={{ display: "table-cell", textAlign: "right" }}
                      >
                        {response?.valuta.sign}
                        {response?.totals.totalPrice.toFixed(2)}
                      </div>
                    </div>
                    <div style={{ display: "table-row" }}>
                      <div
                        className="px-2"
                        style={{ display: "table-cell", textAlign: "right" }}
                      >
                        {intl.formatMessage({ id: "Fields.VatTitle" })}:
                      </div>
                      <div
                        style={{ display: "table-cell", textAlign: "right" }}
                      >
                        {response?.valuta.sign}
                        {response?.totals.totalVATAmount.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              }
            >
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
            </Tippy>

            <div className="card-body p-0 m-0">
              <div className="tab-content" id="myTabContent">
                <div
                  className="tab-pane fade show active mt-1"
                  id="kt_tab_file"
                  role="tabpanel"
                  ref={containerRef}
                  style={{ width: "100%", height: "100vh" }}
                />

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

            <div className="card-footer justify-content-between d-flex p-5">
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
                        {intl.formatMessage({ id: "Common.Busy" })}
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
                  <Tippy
                    content={intl.formatMessage({
                      id: "Fields.ToolTipEdit",
                    })}
                  >
                    <button
                      type="button"
                      className="btn btn-icon btn-warning btn-sm"
                      onClick={() => {
                        setAddModalOpen(true),
                          setEditModalId(currentInvoice?.id);
                      }}
                    >
                      <i className="ki-solid ki-pencil fs-3" />
                    </button>
                  </Tippy>
                )}
                {response?.actions.canDownload && (
                  <Tippy
                    content={intl.formatMessage({
                      id: "Fields.ActionDownload",
                    })}
                  >
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
                  </Tippy>
                )}
                {response?.actions.canSend && (
                  <Tippy
                    content={intl.formatMessage({
                      id: "Fields.ActionSendEmail",
                    })}
                  >
                    <button
                      type="button"
                      className="btn btn-icon btn-success btn-sm ms-5"
                      onClick={() => openEmailModal()}
                    >
                      <i className="fas fa-location-arrow fs-3"></i>
                    </button>
                  </Tippy>
                )}
                {response?.actions.canFinalize && (
                  <Tippy
                    content={intl.formatMessage({
                      id: "Fields.ActionActivate",
                    })}
                  >
                    <button
                      type="button"
                      className="btn btn-icon btn-success btn-sm ms-5"
                      onClick={() => openActivateModal()}
                    >
                      <i className="fa fas fa-flag-checkered fs-3" />
                    </button>
                  </Tippy>
                )}
              </div>
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
            />
          )}

          {copyModalOpen && (
            <InvoiceCopyModal
              invoiceId={currentInvoice?.id}
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
              invoiceId={currentInvoice?.id}
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
              invoiceId={currentInvoice?.id}
              invoiceNr={response?.invoiceNr}
              setEmailModalOpen={setEmailModalOpen}
              setRefresh={setRefresh}
              refresh={refresh}
              alterEmail={alterEmail}
            />
          )}
          {activateModalOpen && (
            <InvoiceActivateModal
              invoiceId={currentInvoice?.id}
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
              invoiceId={currentInvoice?.id}
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

const InvoiceViewWrapper = () => (
  <>
    <ToolbarWrapper />
    <Content>
      <InvoiceViewInnerWrapper />
    </Content>
  </>
);

export { InvoiceViewWrapper };
