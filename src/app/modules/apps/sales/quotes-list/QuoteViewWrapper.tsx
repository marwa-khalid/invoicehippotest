import { useEffect, useRef, useState } from "react";
import { Content } from "../../../../../_metronic/layout/components/content";
import { ListLoading } from "../../components/ListLoading";
import Tippy from "@tippyjs/react";
import { useIntl } from "react-intl";
import { KTIcon, toAbsoluteUrl } from "../../../../../_metronic/helpers";
import { QuoteAddModal } from "./quote-add-modal/QuoteAddModal";
import { QuoteValidateModal } from "./quote-validate-modal/QuoteValidateModal";
import { ToolbarWrapper } from "../../../../../_metronic/layout/components/toolbar";
import { QuoteViewModal } from "./quote-view-modal/QuoteViewModal";
import { getQuoteById } from "./core/_requests";
import { getEstimationActivitiesById } from "./core/_requests";
import {
  EstimationActivitiesModel,
  EstimationActivitiesResult,
} from "./core/_models";
import { Item1 } from "../../../../../_metronic/partials/content/activity/Item1";
import { Item2 } from "../../../../../_metronic/partials/content/activity/Item2";
import { Item3 } from "../../../../../_metronic/partials/content/activity/Item3";

const QuoteViewInnerWrapper = () => {
  const { BASE_URL } = import.meta.env;
  const intl = useIntl();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [validateModalOpen, setValidateModalOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [editModalId, setEditModalId] = useState(0);
  const [activities, setActivities] = useState<any>();

  const currentQuote = JSON.parse(localStorage.getItem("currentQuote")!);

  const valueSetter = () => {
    localStorage.setItem(
      "ModalData",
      JSON.stringify({
        quoteDateAsString: currentQuote?.quoteDateAsString,
        client: currentQuote?.client,
        totalPriceWithVat: currentQuote?.totals.totalPriceWithVAT,
        sign: currentQuote?.valuta.sign,
        status: currentQuote?.quoteStatus.value,
        attachmentsCount: currentQuote?.attachmentsCount,
      })
    );
  };
  const [response, setResponse] = useState<any>();

  console.log(response);
  useEffect(() => {
    const fetch = async () => {
      const response = await getQuoteById(currentQuote?.id);
      setResponse(response.result);
    };
    fetch();
  }, []);

  useEffect(() => {
    const fetchEstimations = async () => {
      const responseEstimation = await getEstimationActivitiesById(
        currentQuote?.id
      );
      if (responseEstimation.isValid) {
        setActivities(responseEstimation);
      }
    };
    fetchEstimations();
  }, []);

  useEffect(() => {
    setIsLoading(true);
    if (currentQuote?.downloadInfo.downloadUrl) {
      const container = containerRef.current;
      let PSPDFKit: any, instance;

      (async function () {
        PSPDFKit = await import("pspdfkit");
        PSPDFKit.unload(container);
        instance = await PSPDFKit.load({
          container,
          initialViewState: new PSPDFKit.ViewState({ zoom: 1.25 }),
          document: currentQuote.downloadInfo.downloadUrl,
          baseUrl: `${window.location.protocol}//${window.location.host}/${BASE_URL}`,
        });
        instance.setViewState((viewState: any) =>
          viewState.set("showToolbar", !viewState.showToolbar)
        );
        setIsLoading(false);
      })();

      return () => PSPDFKit && PSPDFKit.unload(container);
    }
  }, []);

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
  return (
    <div className="">
      {/* <div className="text-end">
        {currentQuote?.actions.canApprove && (
          <Tippy
            content={intl.formatMessage({
              id: "Fields.ActionApproveOrDecline",
            })}
          >
            <button
              type="button"
              className="btn btn-success btn-sm mb-3 me-7"
              onClick={() => {
                valueSetter();
                setValidateModalOpen(true);
              }}
            >
              <i className="fa far fa-credit-card me-2 fs-1"></i>
              {intl.formatMessage({ id: "Fields.ActionApproveOrDecline" })}
            </button>
          </Tippy>
        )}
        <Tippy content={intl.formatMessage({ id: "Fields.ToolTipNew" })}>
          <button
            type="button"
            className="btn btn-primary btn-sm mb-3"
            onClick={() => {
              localStorage.removeItem("contactResponse");
              localStorage.removeItem("clientResponse");
              setAddModalOpen(true);
            }}
          >
            <KTIcon iconName="plus" className="fs-1" />
            {intl.formatMessage({ id: "Fields.ActionNew" })}
          </button>
        </Tippy>
      </div> */}
      {/* Header with Client Name and Tabs */}
      <div className="card card-custom rounded-0 mt-5">
        <div className="card-header card-header-stretch mt-10">
          <h3 className="card-title">
            <i className="far fa-user fs-6 text-primary me-2" />
            {currentQuote?.client}
          </h3>
          <div className="card-toolbar">
            <ul className="nav nav-tabs nav-line-tabs nav-stretch fs-6 border-0">
              <li className="nav-item">
                <a
                  className="nav-link active"
                  data-bs-toggle="tab"
                  href="#kt_tab_pane_7"
                >
                  {intl.formatMessage({ id: "Fields.Quotes" })}
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link"
                  data-bs-toggle="tab"
                  href="#kt_tab_pane_8"
                >
                  <i className="fas fa-history me-2"></i>
                  {intl.formatMessage({ id: "Fields.TabActionHistory" })}
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link cursor-pointer"

                  // data-bs-toggle="tab"
                  // href="#kt_tab_pane_9"
                >
                  <div className="btn-group drop-left">
                    <button
                      className="btn btn-icon  btn-sm ms-5 me-2 text-muted"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <i className="ki-outline ki-gear me-2 fs-2"></i>

                      {intl.formatMessage({ id: "Fields.TabOptions" })}
                      <i className="fa fa-chevron-down ms-1"></i>
                    </button>
                    <ul className="dropdown-menu w-content-fit py-4">
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
                          <i className="fa-solid fa-cloud-arrow-down me-2 fs-3"></i>
                          {intl.formatMessage({
                            id: "Fields.ActionDownload",
                          })}
                        </a>
                      </li>
                      <div className="dropdown-divider border-gray-200"></div>
                      <li
                        // onClick={() => {
                        //   setQuoteNumber(quoteList.quoteNr);
                        //   setDownloadUrl(quoteList.downloadInfo.downloadUrl);
                        //   setFileExtension(
                        //     quoteList.downloadInfo.fileExtension
                        //   );
                        // }}
                        data-bs-toggle="offcanvas"
                        data-bs-target="#offcanvasRight"
                        aria-controls="offcanvasRight"
                      >
                        <a className="dropdown-item d-flex align-items-center cursor-pointer">
                          <i className="far fa-file-pdf me-3 fs-3"></i>
                          {intl.formatMessage({
                            id: "Fields.ToolTipView",
                          })}
                        </a>
                      </li>
                      {/* {quoteList.actions.canApprove && (
                        <>
                          <div className="dropdown-divider border-gray-200"></div>
                          <li onClick={() => openValidateModal(quoteList)}>
                            <a className="dropdown-item d-flex align-items-center cursor-pointer">
                              <i className="fa far fa-credit-card me-2 fs-3"></i>
                              {intl.formatMessage({
                                id: "Fields.ActionApproveOrDecline",
                              })}
                            </a>
                          </li>
                        </>
                      )} */}
                      <div className="dropdown-divider border-gray-200"></div>
                      <li
                      // onClick={() => {
                      //   openEmailModal(quoteList);
                      // }}
                      >
                        <a className="dropdown-item d-flex align-items-center text-center cursor-pointer">
                          <i className="ki-duotone ki-send fs-1 me-2">
                            <span className="path1"></span>
                            <span className="path2"></span>
                          </i>
                          {intl.formatMessage({
                            id: "Fields.ActionSendEmail",
                          })}
                        </a>
                      </li>
                      {/* {quoteList.actions.canCreateCopy && (
                        <>
                          <div className="dropdown-divider border-gray-200"></div>
                          <li
                            onClick={() => {
                              openCopyModal(quoteList);
                            }}
                          >
                            <a className="dropdown-item d-flex align-items-center cursor-pointer">
                              <i className="ki-duotone ki-copy fs-1 me-2" />
                              {intl.formatMessage({
                                id: "Fields.ActionCopy",
                              })}
                            </a>
                          </li>
                        </>
                      )}
                      {quoteList.actions.canFinalize && (
                        <>
                          <div className="dropdown-divider border-gray-200"></div>
                          <li
                            onClick={() => {
                              openActivateModal(quoteList);
                            }}
                          >
                            <a className="dropdown-item d-flex align-items-center cursor-pointer">
                              <i className="fa fas fa-flag-checkered fs-1 me-2" />
                              {intl.formatMessage({
                                id: "Fields.ActionActivate",
                              })}
                            </a>
                          </li>
                        </>
                      )}
                      {quoteList.actions.canDelete && (
                        <>
                          <div className="dropdown-divider border-gray-200"></div>
                          <li
                            onClick={() => {
                              openDeleteModal(quoteList);
                            }}
                          >
                            <a className="dropdown-item  d-flex align-items-center cursor-pointer">
                              <i className="ki-solid ki-trash fs-1 me-2"></i>
                              {intl.formatMessage({
                                id: "Fields.ActionDelete",
                              })}
                            </a>
                          </li>
                        </>
                      )} */}
                    </ul>
                  </div>
                </a>
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
            {currentQuote?.quoteNr}
            <span className="ribbon-inner bg-gray-600"></span>
          </div>
        </div>
        <div
          className="ribbon ribbon-end ribbon-clip position-absolute"
          style={{
            top: "10px",
            right: "0px",
            height: "30px",
            width: "100px",
          }}
        >
          <div className="ribbon-label fw-bold">
            {currentQuote?.valuta.sign}{" "}
            {currentQuote?.totals.totalPriceWithVAT.toFixed(2)}
            <span className="ribbon-inner bg-gray-600"></span>
          </div>
        </div>

        <div className="card-body p-0 m-0">
          <div className="tab-content p-0 m-0" id="myTabContent">
            <div
              className="tab-pane p-0 fade show active bg-body"
              id="kt_tab_pane_7"
              role="tabpanel"
              ref={containerRef}
              style={{ width: "100%", height: "100vh" }}
            />

            <div
              className="tab-pane fade p-10"
              id="kt_tab_pane_8"
              role="tabpanel"
            >
              <div className="timeline">
                {activities?.result?.map(
                  (activity: EstimationActivitiesResult, index: number) => {
                    return (
                      <div className="timeline-item" key={index}>
                        <div className="timeline-line w-40px"></div>
                        <div className="timeline-icon symbol symbol-circle symbol-40px me-4">
                          <div className="symbol-label bg-light">
                            <KTIcon
                              iconName="message-text-2"
                              className="fs-2 text-gray-500"
                            />
                          </div>
                        </div>
                        <div className="timeline-content mb-7 mt-n1">
                          <div className="pe-3 mb-5">
                            <div className="fs-5 fw-bold mb-2">
                              {activity.activity.description}
                            </div>
                            <div className="d-flex align-items-center mt-1 fs-6">
                              <div className="text-muted me-2 fs-7">
                                Added at {activity.dateCreatedAsString}
                              </div>
                              {activity.userEmail && (
                                <>
                                  by{" "}
                                  <span className="badge bg-secondary">
                                    {activity.userEmail}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>

                          <span className="badge bg-secondary">
                            {activity.actorType}
                          </span>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
            <div className="tab-pane fade" id="kt_tab_pane_9" role="tabpanel">
              Sint sit mollit irure quis est nostrud cillum consequat Lorem esse
              do quis dolor esse fugiat sunt do. Eu ex commodo veniam Lorem
              aliquip laborum occaecat qui Lorem esse mollit dolore anim
              cupidatat. eserunt officia id Lorem nostrud aute id commodo elit
              eiusmod enim irure amet eiusmod qui reprehenderit nostrud tempor.
              Fugiat ipsum excepteur in aliqua non et quis aliquip ad irure in
              labore cillum elit enim. Consequat aliquip incididunt ipsum et
              minim laborum laborum laborum et cillum labore. Deserunt
              adipisicing cillum id nulla minim nostrud labore eiusmod et amet.
            </div>
          </div>
        </div>
      </div>
      {/* MARWA KHALID */}
      {console.log(currentQuote)!}
      {response?.hasAttachments && (
        <div className="p-10 bg-secondary border-white">
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

          {/* <QuoteViewModal
            downloadUrl={downloadUrl}
            fileExtension={fileExtension}
          /> */}

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
                            data-bs-target="#offcanvasRight"
                            aria-controls="offcanvasRight"
                            // onClick={() => {
                            //   setDownloadUrl(attachment.downloadInfo.downloadUrl);
                            //   setFileExtension(
                            //     attachment.downloadInfo.fileExtension
                            //   );
                            // }}
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
                              link.href = attachment.downloadInfo.downloadUrl;
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
                      {attachment.actions.canDelete && (
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
                      )}
                    </div>
                  </div>

                  {index < response?.attachments?.attachments?.length - 1 && (
                    <div className="separator border-10 my-5"></div>
                  )}
                </div>
              )
            )}
          </div>
        </div>
      )}

      <div className="text-end p-5 bg-body shadow mb-10">
        <Tippy
          content={intl.formatMessage({
            id: "Fields.ToolTipEdit",
          })}
        >
          <button
            type="button"
            className="btn btn-warning btn-sm me-5"
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
            className="btn btn-success me-5 btn-sm"
            onClick={() => {
              const link = document.createElement("a");
              link.href = response.downloadInfo.downloadUrl;
              link.setAttribute("download", response.downloadInfo.fileName);
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
          >
            <i className="fa-solid fa-cloud-arrow-down fs-3"></i>
          </button>
        </Tippy>
        <Tippy content="versturen">
          <button
            type="button"
            className="btn btn-success btn-sm"
            // onClick={() => setExportModalOpen(true)}
          >
            <i className="fas fa-location-arrow fs-3"></i>
          </button>
        </Tippy>
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
          quoteNumber={currentQuote?.quoteNr}
          setValidateModalOpen={setValidateModalOpen}
          setRefresh={setRefresh}
          refresh={refresh}
        />
      )}
    </div>
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
