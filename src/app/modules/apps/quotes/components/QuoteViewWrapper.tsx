import { useEffect, useRef, useState } from "react";
import { Content } from "../../../../../_metronic/layout/components/content";
import { ListLoading } from "../../components/ListLoading";
import Tippy from "@tippyjs/react";
import { useIntl } from "react-intl";
import { KTIcon } from "../../../../../_metronic/helpers";
import { QuoteAddModal } from "./quote-add-modal/QuoteAddModal";
import { QuoteValidateModal } from "./quote-validate-modal/QuoteValidateModal";
import { ToolbarWrapper } from "../../../../../_metronic/layout/components/toolbar";
import { QuoteViewModal } from "./quote-view-modal/QuoteViewModal";
import { getQuickViewQuote } from "./core/_requests";
import { getEstimationActivitiesById } from "./core/_requests";
import { ErrorPage } from "../../components/ErrorPage";
import { Activities } from "../../components/Activities";
import { QuoteCopyModal } from "./quote-copy-modal/QuoteCopyModal";
import { QuoteEmailModal } from "./quote-email-modal/QuoteEmailModal";
import { QuoteActivateModal } from "./quote-activate-modal/QuoteActivateModal";
import { QuoteOdataModal } from "./quote-odata-modal/QuoteOdataModal";
const VIEWER_LICENSE_KEY = import.meta.env.VITE_APP_VIEWER_LICENSE_KEY;
const QuoteViewInnerWrapper = () => {
  const { BASE_URL } = import.meta.env;
  const intl = useIntl();
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
  const [errorPage, setErrorPage] = useState<boolean>(false);
  const currentQuote = JSON.parse(localStorage.getItem("currentQuote")!);

  const openCopyModal = () => {
    valueSetter();
    setCopyModalOpen(true);
  };
  const openValidateModal = () => {
    valueSetter();
    setValidateModalOpen(true);
  };

  const openEmailModal = () => {
    valueSetter();
    setEmailModalOpen(true);
  };

  const openActivateModal = () => {
    valueSetter();
    setActivateModalOpen(true);
  };

  const valueSetter = () => {
    localStorage.setItem(
      "ModalData",
      JSON.stringify({
        quoteDateAsString: response?.quoteDateAsString,
        client: response?.client,
        totalPriceWithVat: response?.totals.totalPriceWithVAT,
        sign: response?.valuta.sign,
        status: response?.quoteStatus.value,
        attachmentsCount: response?.attachmentsCount,
      })
    );
  };
  const [response, setResponse] = useState<any>();

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true);
      const response = await getQuickViewQuote(currentQuote?.id);
      if (response.isValid) {
        setResponse(response.result);
      }
      setIsLoading(false);
    };
    if (currentQuote?.id) {
      fetch();
    } else {
      setErrorPage(true);
    }
  }, [refresh]);
  useEffect(() => {
    const fetchEstimations = async () => {
      const responseEstimation = await getEstimationActivitiesById(
        currentQuote?.id
      );
      if (responseEstimation.isValid) {
        setActivities(responseEstimation);
      }
    };
    if (currentQuote?.id) {
      fetchEstimations();
    }
  }, []);

  useEffect(() => {
    if (response?.downloadInfo.downloadUrl) {
      setIsLoading(true);
      const container = containerRef.current;
      let PSPDFKit: any, instance;

      (async function () {
        PSPDFKit = await import("pspdfkit");
        PSPDFKit.unload(container);

        instance = await PSPDFKit.load({
          container,
          licenseKey: VIEWER_LICENSE_KEY,
          // initialViewState: new PSPDFKit.ViewState({ zoom: 1.5 }),
          document: response.downloadInfo.downloadUrl,
          baseUrl: `${window.location.protocol}//${window.location.host}/${BASE_URL}`,
        });
        instance.setViewState((viewState: any) =>
          viewState.set("showToolbar", !viewState.showToolbar)
        );
        PSPDFKit.ZoomMode.FIT_TO_WIDTH;
      })();
      setIsLoading(false);
      return () => PSPDFKit && PSPDFKit.unload(container);
    }
  }, [response, refresh]);

  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);
  useEffect(() => {
    if (response?.attachments?.attachments?.length === 1) {
      setIsCollapsed(false);
    } else {
      setIsCollapsed(true);
    }
  }, [response?.attachments?.attachments?.length]);
  const [downloadUrl, setDownloadUrl] = useState<string>("");
  const [fileExtension, setFileExtension] = useState<any>();
  const getStatusClass = (quoteStatusValue: number) => {
    switch (quoteStatusValue) {
      case 1: // Concept
        return "bg-secondary";
      case 2: // Wachten op goedkeuring (Waiting for approval)
        return "bg-info";
      case 4: // Geaccepteerd door de klant (Accepted by the client)
        return "bg-success";
      case 8: // Afgekeurd door de klant (Rejected by the client)
        return "bg-danger";
      case 16: // Verlopen-/1e Herinnering (Overdue/1st reminder)
        return "bg-warning";
      case 32: // Verlopen-/2e Herinnering (Overdue/2nd reminder)
      case 64: // Verlopen-/Laatste Herinnering (Overdue/Last reminder)
        return "bg-danger";
      case 128: // Geannuleerd (Cancelled)
        return "bg-dark";
      case 256: // Gepauzeerd (Paused)
        return "bg-warning";
      case 512: // Planning
        return "bg-primary";
      case 1024: // Realisatie (Realization)
        return "bg-info";
      case 2048: // Afgerond (Completed)
        return "bg-success";
      default:
        return "bg-default"; // Default case
    }
  };
  const [odata, setOdata] = useState<string>("");
  const [accessCode, setAccessCode] = useState<string>("");
  const [odataModalOpen, setOdataModalOpen] = useState<boolean>(false);
  const openOdataCopy = () => {
    setOdata(response?.anonymousAccessUrl);
    setAccessCode(response?.anonymousAccessCode);
    setOdataModalOpen(true);
  };
  return (
    <>
      {response?.actions.canApprove && (
        <button
          className="btn btn-success btn-sm"
          style={{
            position: "fixed",
            top: "110px",
            right: "210px",
            // zIndex: 1000,
          }}
          onClick={() => openValidateModal()}
        >
          <i className="fa far fa-credit-card me-2 fs-2"></i>
          {intl.formatMessage({ id: "Fields.ActionApproveOrDecline" })}
        </button>
      )}
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
        {intl.formatMessage({ id: "Menu.AddNewQuote" })}
      </button>
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
                  <div>
                    <Tippy
                      content={intl.formatMessage({ id: "Fields.QuoteDate" })}
                    >
                      <span className="mx-2 fs-9 fw-normal cursor-pointer">
                        <i className="fas fa-calendar-alt me-2 text-primary"></i>
                        {response?.quoteDateAsString}
                      </span>
                    </Tippy>
                    <Tippy
                      content={intl.formatMessage({
                        id: "Fields.QuoteDueDate",
                      })}
                    >
                      <span className="fs-9 fw-normal cursor-pointer">
                        <i className="fas fa-calendar-alt me-2"></i>
                        {response?.quoteDueDateAsString}
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
                      {intl.formatMessage({ id: "Fields.Quotes" })}
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

                  <li className="nav-item">
                    <div style={{ padding: "0.7rem 0", margin: "0 1rem" }}>
                      <div className="cursor-pointer btn-group drop-left">
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
                                setEditModalId(currentQuote?.id);
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
                          {response?.actions.canCreateInvoice && (
                            <>
                              <div className="dropdown-divider border-gray-200"></div>
                              <li
                              // onClick={() => {
                              //   const link = document.createElement("a");
                              //   link.href = quoteList.downloadInfo.downloadUrl;
                              //   link.setAttribute(
                              //     "download",
                              //     quoteList.downloadInfo.fileName
                              //   );
                              //   document.body.appendChild(link);
                              //   link.click();
                              //   document.body.removeChild(link);
                              // }}
                              >
                                <a className="dropdown-item d-flex align-items-center cursor-pointer">
                                  <i className="fa-solid fa-file-invoice text-info fs-2 me-3" />
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
                          <div className="dropdown-divider border-gray-200"></div>
                          <li
                            onClick={() => {
                              openOdataCopy();
                            }}
                          >
                            <a className="dropdown-item d-flex align-items-center cursor-pointer">
                              <i className="ki-duotone ki-square-brackets me-3 fs-2">
                                <span className="path1"></span>
                                <span className="path2"></span>
                                <span className="path3"></span>
                                <span className="path4"></span>
                              </i>
                              Odata
                            </a>
                          </li>
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
                              <li
                              // onClick={() => {
                              //   openEmailModal(quoteList);
                              // }}
                              >
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
                {response?.quoteNr}
                <span className="ribbon-inner bg-gray-600"></span>
              </div>
            </div>

            <div
              className="ribbon ribbon-top position-absolute"
              style={{
                left: "0",
                right: "0",
                height: "20px",
                width: "200px", // Adjust width as needed
                margin: "auto",
              }}
            >
              <div
                className={`ribbon-label fw-bold ${getStatusClass(
                  response?.quoteStatus?.value || 1
                )} ${response?.isDraft ? "text-dark" : "text-white"}`}
              >
                {response?.quoteStatus?.description.toLowerCase()}
              </div>
            </div>
            <Tippy
              content={
                <div style={{ fontFamily: "monospace" }}>
                  <div className="table" style={{ width: "100%" }}>
                    <div style={{ display: "table-row" }}>
                      <div
                        className="me-2"
                        style={{ display: "table-cell", textAlign: "right" }}
                      >
                        {intl.formatMessage({ id: "Fields.Amount" })}:
                      </div>
                      <div
                        style={{ display: "table-cell", textAlign: "right" }}
                      >
                        {"  "}
                        {response?.valuta.sign}
                        {response?.totals.totalPrice.toFixed(2)}
                      </div>
                    </div>
                    <div style={{ display: "table-row" }}>
                      <div
                        className="me-2"
                        style={{ display: "table-cell", textAlign: "right" }}
                      >
                        {intl.formatMessage({ id: "Fields.VatTitle" })}:
                      </div>
                      <div
                        style={{ display: "table-cell", textAlign: "right" }}
                      >
                        {"  "}
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
              <div className="p-10 bg-secondary">
                <div
                  className="d-flex align-items-center mb-3 cursor-pointer"
                  onClick={() =>
                    response?.attachments?.attachments?.length > 1 &&
                    setIsCollapsed(!isCollapsed)
                  }
                >
                  <h2 className="me-2">
                    {intl.formatMessage({ id: "Fields.Attachments" })}
                  </h2>
                  <span className="mb-1 bg-secondary text-dark rounded-pill px-2">
                    {response?.attachments?.attachments?.length}
                  </span>
                  {response?.attachments?.attachments?.length > 1 && (
                    <i
                      className={`fa fa-chevron-${
                        isCollapsed ? "down" : "up"
                      } ms-2 mb-1`}
                    ></i>
                  )}
                </div>

                <QuoteViewModal
                  downloadUrl={downloadUrl}
                  fileExtension={fileExtension}
                />

                {/* Collapsible section for multiple attachments */}
                <div className={`collapse ${!isCollapsed ? "show" : ""}`}>
                  {response?.attachments?.attachments?.map(
                    (attachment: any, index: any) => (
                      <div key={index}>
                        <div className="d-flex align-items-center justify-content-between mb-2 p-5">
                          {/* SVG icon and document name */}
                          <div className="d-flex align-items-center">
                            {/* {restoreModalOpen && (
                      <QuoteRestorationModal
                        attachment={selectedAttachment}
                        setRestoreModalOpen={setRestoreModalOpen}
                        formik={formik}
                      />
                    )} */}
                            {attachment.fileType.value === 6 ? (
                              <img
                                src="/media/svg/024-pdf.svg"
                                width={50}
                                height={50}
                                alt="pdf"
                              />
                            ) : attachment.fileType.value === 3 ? (
                              <img
                                alt="PNG"
                                src="/media/svg/025-png.svg"
                                width={50}
                                height={50}
                              />
                            ) : (
                              <img
                                src="/media/svg/017-jpg.svg"
                                width={50}
                                height={50}
                                alt="jpg"
                              />
                            )}

                            <div className="ms-2">
                              <span
                                className="text-primary fw-bold cursor-pointer"
                                data-bs-toggle="offcanvas"
                                data-bs-target="#offcanvasRight"
                                aria-controls="offcanvasRight"
                                onClick={() => {
                                  // setDownloadUrl(attachment.downloadInfo.downloadUrl);
                                  // setFileExtension(
                                  //   attachment.downloadInfo.fileExtension
                                  // );
                                }}
                              >
                                {attachment.fileName}
                              </span>
                              <div className="text-muted small">
                                {attachment.fileType.name} &bull;{" "}
                                {attachment.sizeDescription}
                              </div>
                            </div>
                          </div>

                          <div className="d-flex">
                            {attachment.actions.canView && (
                              <Tippy
                                content={intl.formatMessage({
                                  id: "Fields.ToolTipView",
                                })}
                              >
                                <button
                                  type="button"
                                  className="btn btn-icon btn-dark btn-sm me-2"
                                  data-bs-toggle="offcanvas"
                                  data-bs-trigger="click"
                                  data-bs-target="#offcanvasRight"
                                  aria-controls="offcanvasRight"
                                  onClick={() => {
                                    setDownloadUrl(
                                      attachment.downloadInfo.downloadUrl
                                    );
                                    setFileExtension(
                                      attachment.downloadInfo.fileExtension
                                    );
                                  }}
                                >
                                  <i className="ki-solid ki-eye fs-1"></i>
                                </button>
                              </Tippy>
                            )}
                            {attachment.actions.canDownload && (
                              <Tippy
                                content={intl.formatMessage({
                                  id: "Fields.ToolTipDownloadAttachment",
                                })}
                              >
                                <button
                                  type="button"
                                  className="btn btn-icon btn-primary btn-sm me-2"
                                  onClick={() => {
                                    const link = document.createElement("a");
                                    link.href =
                                      attachment.downloadInfo.downloadUrl;
                                    link.setAttribute(
                                      "download",
                                      attachment.fileName
                                    );
                                    document.body.appendChild(link);
                                    link.click();
                                    document.body.removeChild(link);
                                  }}
                                >
                                  <i className="fa-solid fa-cloud-arrow-down"></i>
                                </button>
                              </Tippy>
                            )}
                            {/* {attachment.actions.canDelete && (
                        <Tippy
                          content={intl.formatMessage({
                            id: "Fields.ToolTipDelete",
                          })}
                        >
                          <button
                            type="button"
                            className="btn btn-icon btn-danger btn-sm me-2"
                            // onClick={() => handleDelete(attachment)}
                          >
                            <i className="ki-solid ki-trash text-white fs-2"></i>
                          </button>
                        </Tippy>
                      )} */}
                          </div>
                        </div>

                        {index <
                          response?.attachments?.attachments?.length - 1 && (
                          <div className="separator border-gray-300 border-10 my-5"></div>
                        )}
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            <div className="card-footer justify-content-between d-flex p-5">
              <div></div>
              {response?.actions.canApprove && (
                <div>
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => openValidateModal()}
                  >
                    <i className="fa far fa-credit-card me-2 fs-2"></i>
                    {intl.formatMessage({
                      id: "Fields.ActionApproveOrDecline",
                    })}
                  </button>
                </div>
              )}
              <div>
                <Tippy
                  content={intl.formatMessage({
                    id: "Fields.ToolTipEdit",
                  })}
                >
                  <button
                    type="button"
                    className="btn btn-icon btn-warning btn-sm me-5"
                    onClick={() => {
                      setAddModalOpen(true), setEditModalId(currentQuote?.id);
                    }}
                  >
                    <i className="ki-solid ki-pencil fs-3" />
                  </button>
                </Tippy>
                <Tippy
                  content={intl.formatMessage({
                    id: "Fields.ActionDownload",
                  })}
                >
                  <button
                    type="button"
                    className="btn btn-icon btn-success me-5 btn-sm"
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

                <Tippy
                  content={intl.formatMessage({ id: "Fields.ActionSendEmail" })}
                >
                  <button
                    type="button"
                    className="btn btn-icon btn-success btn-sm"
                    onClick={() => openEmailModal()}
                  >
                    <i className="fas fa-location-arrow fs-3"></i>
                  </button>
                </Tippy>
                {response?.actions.canFinalize && (
                  <Tippy
                    content={intl.formatMessage({
                      id: "Fields.ActionActivate",
                    })}
                  >
                    <button
                      type="button"
                      className="btn btn-icon btn-success btn-sm"
                      onClick={() => openActivateModal()}
                    >
                      <i className="fa fas fa-flag-checkered text-success fs-3 me-2" />
                    </button>
                  </Tippy>
                )}
              </div>
            </div>
          </div>

          {isLoading && <ListLoading />}
          {/* Modals */}
          {addModalOpen && (
            <QuoteAddModal
              setRefresh={setRefresh}
              setAddModalOpen={setAddModalOpen}
              refresh={refresh}
              setEditModalId={setEditModalId}
              editModalId={editModalId}
            />
          )}
          {validateModalOpen && (
            <QuoteValidateModal
              quoteId={currentQuote?.id}
              quoteNumber={response?.quoteNr}
              setValidateModalOpen={setValidateModalOpen}
              setRefresh={setRefresh}
              refresh={refresh}
            />
          )}

          {copyModalOpen && (
            <QuoteCopyModal
              quoteId={currentQuote?.id}
              quoteNumber={response?.quoteNr}
              setCopyModalOpen={setCopyModalOpen}
              setRefresh={setRefresh}
              refresh={refresh}
              setAddModalOpen={setAddModalOpen}
              setEditModalId={setEditModalId}
            />
          )}
          {emailModalOpen && (
            <QuoteEmailModal
              quoteId={currentQuote?.id}
              quoteNumber={response?.quoteNr}
              setValidateModalOpen={setEmailModalOpen}
              setRefresh={setRefresh}
              refresh={refresh}
            />
          )}
          {activateModalOpen && (
            <QuoteActivateModal
              quoteId={currentQuote?.id}
              quoteNumber={response?.quoteNr}
              setActivateModalOpen={setActivateModalOpen}
              setRefresh={setRefresh}
              refresh={refresh}
            />
          )}

          {odataModalOpen && (
            <QuoteOdataModal
              setOdataModalOpen={setOdataModalOpen}
              setRefresh={setRefresh}
              refresh={refresh}
              odata={odata}
              accessCode={accessCode}
            />
          )}
        </div>
      )}
    </>
  );
};

const QuoteViewWrapper = () => (
  <>
    <ToolbarWrapper />
    <Content>
      <QuoteViewInnerWrapper />
    </Content>
  </>
);

export { QuoteViewWrapper };
