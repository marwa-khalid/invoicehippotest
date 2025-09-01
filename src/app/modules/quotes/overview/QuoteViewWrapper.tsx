import { useEffect, useState } from "react";
import { Content } from "../../../../_metronic/layout/components/content";
import { ListLoading } from "../../generic/ListLoading";
import * as Tooltip from "@radix-ui/react-tooltip";
import { useIntl } from "react-intl";
import { KTIcon, KTSVG } from "../../../../_metronic/helpers";
import { QuoteAddModal } from "./quote-add-modal/QuoteAddModal";
import { QuoteValidateModal } from "./quote-validate-modal/QuoteValidateModal";
import { ToolbarWrapper } from "../../../../_metronic/layout/components/toolbar";
import { ViewCanvas } from "../../generic/ViewCanvas";
import { getQuickViewQuote, getQuoteViewData } from "./core/_requests";
import { getEstimationActivitiesById } from "./core/_requests";
import { ErrorPage } from "../../generic/ErrorPage";
import { Activities } from "../../generic/Activities";
import { QuoteCopyModal } from "./quote-copy-modal/QuoteCopyModal";
import { QuoteEmailModal } from "./quote-email-modal/QuoteEmailModal";
import { QuoteActivateModal } from "./quote-activate-modal/QuoteActivateModal";
import { QuoteOdataModal } from "./quote-odata-modal/QuoteOdataModal";
import { useAuth } from "../../auth";
import { ThemeModeComponent } from "../../../../_metronic/assets/ts/layout";
import { ThemeModeType, useThemeMode } from "../../../../_metronic/partials";
import enums from "../../../../_metronic/i18n/messages/invoicehippo.enums.json";
import { getStatusClass } from "../../../utils/statusUtils";
import { getEnumOptions } from "../../../helpers/intlHelper";
import { ActivitiesResult } from "../../accounting/bookings/components/core/_models";
import { AttachmentListing } from "../../generic/FileManager/AttachmentListing";
import Quote from "../../generic/Templates/Template003/Quote";
import { CreateInvoiceModal } from "./create-invoice-modal/CreateInvoiceModal";
import { QuoteList } from "./search-list/QuoteList";
const VIEWER_LICENSE_KEY = import.meta.env.VITE_APP_VIEWER_LICENSE_KEY;
const QuoteViewInnerWrapper = ({ setQuoteData }: any) => {
  const intl = useIntl();
  const [isLoading, setIsLoading] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [copyModalOpen, setCopyModalOpen] = useState(false);
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [activateModalOpen, setActivateModalOpen] = useState(false);
  const [validateModalOpen, setValidateModalOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [editModalId, setEditModalId] = useState(0);
  const [activities, setActivities] = useState<ActivitiesResult[]>([]);
  const [errorPage, setErrorPage] = useState<boolean>(false);
  const currentQuote = JSON.parse(localStorage.getItem("currentItem")!);
  const [quoteNr, setQuoteNumber] = useState<string>("");
  const systemMode = ThemeModeComponent.getSystemMode() as "light" | "dark";
  const { mode } = useThemeMode();
  const calculatedMode = mode === "light" ? systemMode : mode;

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
  const openCreateInvoiceModal = () => {
    valueSetter();
    setCreateInvoiceModalOpen(true);
  };
  const valueSetter = () => {
    localStorage.setItem(
      "ModalData",
      JSON.stringify({
        quoteDateAsString: response?.quoteDateAsString,
        client: response?.client?.companyName,
        quoteListItem: response,
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
      const response = await getQuickViewQuote(currentQuote);
      if (response.isValid) {
        setResponse(response.result);
        setQuoteData({
          openValidateModal: () => openValidateModal(),
          actions: response?.result.actions,
          setAddModalOpen: setAddModalOpen,
          setEditModalId: setEditModalId,
        });
        localStorage.setItem(
          "currentNr",
          JSON.stringify(response.result.quoteNr)
        );
      }
      setIsLoading(false);
    };
    if (currentQuote) {
      fetch();
    } else {
      setErrorPage(true);
    }
  }, [refresh]);
  useEffect(() => {
    const fetchEstimations = async () => {
      const responseEstimation = await getEstimationActivitiesById(
        currentQuote
      );
      if (responseEstimation.isValid) {
        setActivities(responseEstimation.result);
      }
    };
    if (currentQuote) {
      fetchEstimations();
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
  const [key, setKey] = useState<number>(1);

  const [odata, setOdata] = useState<string>("");
  const [accessCode, setAccessCode] = useState<string>("");
  const [odataModalOpen, setOdataModalOpen] = useState<boolean>(false);
  const openOdataCopy = () => {
    setOdata(response?.anonymousAccessUrl);
    setAccessCode(response?.anonymousAccessCode);
    setOdataModalOpen(true);
  };
  const auth = useAuth();
  const [viewData, setViewData] = useState<any>();
  useEffect(() => {
    const fetch = async () => {
      const response = await getQuoteViewData(currentQuote);
      if (response.isValid) {
        setViewData(response.result);
      }
    };
    fetch();
  }, [refresh]);
  const [createInvoiceModalOpen, setCreateInvoiceModalOpen] =
    useState<boolean>(false);
  return (
    <>
      {/* {response?.actions.canApprove && (
        <button
          className="btn btn-success btn-sm"
          style={{
            position: "fixed",
            top: "110px",
            right: auth.currentUser?.result.isAnonymousUser ? "60px" : "210px",
            // zIndex: 1000,
          }}
          onClick={() => openValidateModal()}
        >
          <KTSVG
            className="svg-icon svg-icon-2 me-2"
            path="media/svg/general/document-validation-white.svg"
          />
          {intl.formatMessage({ id: "Fields.ActionApproveOrDecline" })}
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
            {intl.formatMessage({ id: "Menu.AddNewQuote" })}
          </button>
        )} */}
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
                    <Tooltip.Provider delayDuration={0}>
                      <Tooltip.Root>
                        <Tooltip.Trigger asChild>
                          <span className="mx-2 fs-9 fw-normal cursor-pointer">
                            <i className="fas fa-calendar-alt me-2 text-primary"></i>
                            {response?.quoteDateAsString}
                          </span>
                        </Tooltip.Trigger>

                        <Tooltip.Portal>
                          <Tooltip.Content side="top" className="app-tooltip">
                            {intl.formatMessage({ id: "Fields.QuoteDate" })}
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
                            {response?.quoteDueDateAsString}
                          </span>
                        </Tooltip.Trigger>

                        <Tooltip.Portal>
                          <Tooltip.Content side="top" className="app-tooltip">
                            {intl.formatMessage({
                              id: "Fields.QuoteDueDate",
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
                        .formatMessage({ id: "Fields.TabQuote" })
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
                  {!auth.currentUser?.result.isAnonymousUser && (
                    <li className="nav-item">
                      <div style={{ padding: "0.7rem 0", margin: "0 1rem" }}>
                        <div className="cursor-pointer btn-group drop-left">
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
                                  setEditModalId(currentQuote);
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
                            {response?.actions.canApprove && (
                              <>
                                <div className="dropdown-divider border-gray-200"></div>
                                <li
                                  onClick={() => {
                                    openValidateModal();
                                  }}
                                >
                                  <a className="dropdown-item d-flex align-items-center text-center cursor-pointer">
                                    <KTSVG
                                      className="svg-icon svg-icon-2 me-2"
                                      path="media/svg/general/document-validation-bulk-rounded.svg"
                                    />
                                    {intl.formatMessage({
                                      id: "Fields.ActionApproveOrDecline",
                                    })}
                                  </a>
                                </li>
                              </>
                            )}
                            {response?.actions.canCreateInvoice && (
                              <>
                                <div className="dropdown-divider border-gray-200"></div>
                                <li
                                  onClick={() => {
                                    openCreateInvoiceModal();
                                  }}
                                >
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
                maxWidth: "220px", // Adjust width as needed
                margin: "auto",
              }}
            >
              <div
                className={`ribbon-label fw-bold ${getStatusClass(
                  response?.quoteStatus?.value || 1
                )} ${response?.isDraft ? "text-dark" : "text-white"}`}
              >
                {getEnumOptions(enums.QuoteStatusTypes, intl)
                  .find((item) => item.value === response?.quoteStatus.value)
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
            <div className="card-body p-0 m-0">
              <div className="tab-content" id="myTabContent">
                <div className="tab-content" id="myTabContent">
                  <div
                    className="tab-pane fade show active mt-1 bg-light"
                    id="kt_tab_file"
                    role="tabpanel"
                  >
                    <Quote data={viewData} />
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
                {response?.actions.canApprove && (
                  <div>
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => openValidateModal()}
                    >
                      <KTSVG
                        className="svg-icon svg-icon-2 me-2"
                        path="media/svg/general/document-validation-white.svg"
                      />
                      {intl.formatMessage({
                        id: "Fields.ActionApproveOrDecline",
                      })}
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
                              setAddModalOpen(true),
                                setEditModalId(currentQuote);
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
                setActivateModalOpen={setActivateModalOpen}
                setQuoteNumber={setQuoteNumber}
                setEmailModalOpen={setEmailModalOpen}
                addModalOpen={addModalOpen}
              />
            )}
            {validateModalOpen && (
              <QuoteValidateModal
                quoteId={currentQuote}
                quoteNumber={response?.quoteNr}
                setValidateModalOpen={setValidateModalOpen}
                setRefresh={setRefresh}
                refresh={refresh}
              />
            )}

            {copyModalOpen && (
              <QuoteCopyModal
                quoteId={currentQuote}
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
                quoteId={currentQuote}
                quoteNumber={response?.quoteNr}
                setEmailModalOpen={setEmailModalOpen}
                setRefresh={setRefresh}
                refresh={refresh}
              />
            )}
            {activateModalOpen && (
              <QuoteActivateModal
                quoteId={currentQuote}
                quoteNumber={response?.quoteNr}
                setActivateModalOpen={setActivateModalOpen}
                setRefresh={setRefresh}
                refresh={refresh}
              />
            )}

            {odataModalOpen && (
              <QuoteOdataModal
                setOdataModalOpen={setOdataModalOpen}
                odata={odata}
                accessCode={accessCode}
              />
            )}
            {createInvoiceModalOpen && (
              <CreateInvoiceModal
                quoteId={currentQuote}
                quoteNr={response?.quoteNr}
                setCreateInvoiceModalOpen={setCreateInvoiceModalOpen}
                setRefresh={setRefresh}
                refresh={refresh}
                setEditModalId={setEditModalId}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};

const QuoteViewWrapper = () => {
  const [quoteData, setQuoteData] = useState<any>();
  return (
    <>
      <ToolbarWrapper quoteData={quoteData} />
      <Content>
        <QuoteViewInnerWrapper setQuoteData={setQuoteData} />
      </Content>
    </>
  );
};

export { QuoteViewWrapper };
