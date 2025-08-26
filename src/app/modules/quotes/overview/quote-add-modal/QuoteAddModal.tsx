import { useEffect, useState } from "react";
import { QuoteAddModalHeader } from "./QuoteAddModalHeader";
import { QuoteAddModalFooter } from "./QuoteAddModalFooter";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useIntl } from "react-intl";
import { toast } from "react-toastify";
import {
  getDefaultEmpty,
  getQuoteById,
  postQuote,
  getNotificationCycles,
  getQuickViewQuote,
} from "../core/_requests";
import { handleToast } from "../../../auth/core/_toast";
import { QuoteAddStep3 } from "./QuoteAddStep3";
import { QuoteAddStep2 } from "./QuoteAddStep2";
import { QuoteAddStep1 } from "./QuoteAddStep1";
import {
  getDiscountTypes,
  getLedgerTypes,
  getTradeNames,
  getUnitTypes,
  getVatList,
} from "../core/_requests";
import { useAuth } from "../../../auth";
import { ViewCanvas } from "../../../generic/ViewCanvas";
import { ListLoading } from "../../../generic/ListLoading";
import { useNavigate } from "react-router-dom";
import { CustomTabManager } from "../../../generic/Tabs/CustomTabManager";
import { AttachmentListing } from "../../../generic/FileManager/AttachmentListing";
import { QuoteAddStep4 } from "./QuoteAddStep4";
import { ExtraOptionsModal } from "../extra-options-modal/ExtraOptionsModal";
import { IdNotVerifiedFreeIcons } from "@hugeicons/core-free-icons";
interface Props {
  setRefresh: (type: boolean) => void;
  refresh: boolean;
  setAddModalOpen: (type: boolean) => void;
  editModalId: number;
  setEditModalId: (type: number) => void;
  setActivateModalOpen: (type: boolean) => void;
  setQuoteNumber: (type: string) => void;
  setEmailModalOpen: (type: boolean) => void;
}
type VatTotal = {
  title: string;
  totalVat: number;
};
const QuoteAddModal = ({
  setRefresh,
  setAddModalOpen,
  refresh,
  setEditModalId,
  editModalId,
  setActivateModalOpen,
  setQuoteNumber,
  setEmailModalOpen,
}: Props) => {
  useEffect(() => {
    document.body.classList.add("modal-open");
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, []);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitting2, setIsSubmitting2] = useState<boolean>(false);
  const [actionType, setActionType] = useState<number>(0);
  const intl = useIntl();
  const auth = useAuth();
  const [response, setResponse] = useState<any>([]);
  const [action, setAction] = useState<number>();
  const [contactResponse, setContactResponse] = useState<any>();
  const navigate = useNavigate();
  const openActivate = (actionType: string, id: number) => {
    valueSetter(actionType, id);
    console.log(action);
    setActivateModalOpen(true);
  };

  const openSend = (actionType: string, id: number) => {
    valueSetter(actionType, id);
    setEmailModalOpen(true);
  };

  const valueSetter = async (actionType: string, id: number) => {
    const data = await getQuickViewQuote(id);
    if (data.isValid) {
      console.log(data);
      setEditModalId(data.result.id);
      setQuoteNumber(data.result.quoteNr);

      localStorage.setItem(
        "ModalData",
        JSON.stringify({
          quoteDateAsString: data?.result.quoteDateAsString,
          client: data?.result.client.companyName,
          totalPriceWithVat: data?.result.totals.totalPriceWithVAT,
          sign: data?.result.valuta.sign,
          status: data?.result.quoteStatus.value,
          activeSendInstructions: data?.result?.activeSendInstructions,
          downloadInfo: data?.result.downloadInfo,
          actionType: actionType,
        })
      );
    }
  };
  const formik = useFormik({
    initialValues: {
      id: 0,
      uniqueId: "",
      isQuoteEditable: true,
      status: 0,
      attachmentsTempId: "",
      title: "",
      downloadInfo: {
        fileName: "",
        fileId: 0,
        fileType: {
          value: 0,
          description: "",
        },
        downloadUrl: "",
      },
      header: {
        prospect: {
          clientName: "",
          kvKNr: "",
          vatNr: "",
          ibanNr: "",
        },
        quoteDate: new Date().toISOString(),
        clientId: 0,
        clientContactId: 0,
        deadLineForAcceptanceDays: 0,
        expectedDeliveryDate: "",
        clientReferenceNr: "",
        valutaType: 0,
        companyTradeNameId: 0,
        clientDisplayName: "",
      },
      customizations: {
        useCustomQuoteNr: false,
        customQuoteNr: "",
        customOrderNr: "",
        hideProductCodes: false,
        notificationCycleId: 0,
        dontSendRemindersOnlyTrackStatus: false,
      },
      products: [
        {
          productId: 0,
          title: "",
          code: "",
          description: "",
          units: 0,
          unitPrice: 0,
          companyUnitTypeId: 3233,
          btwExclusive: true,
          includeLinkedProductDesciption: false,
          linkedProductDescription: "",
          linkedProductId: 0,
          ledgerAccountId: 77630,
          vatTypeId: 5906,
          discountMarginId: 0,
          orderIndex: 0,
        },
      ],
      comments: {
        quoteComments: "",
        privateComments: "",
      },
      customFields: [
        {
          fieldLabel: "",
          fieldInfo: "",
          groupDisplayName: "",
          options: [""],
          fieldType: {
            value: 0,
            description: "",
          },
          fieldId: 0,
          value: {
            asDate: new Date().toISOString(),
            asText: "",
            asMoney: 0,
            asNumber: 0,
            asOptions: [""],
          },
        },
      ],
      hasCustomFields: false,
      attachments: {
        attachmentsToLink: [
          {
            inboxItemId: 0,
            attachmentId: 0,
            isRemoved: false,
            restoreAttachment: false,
            isDirectFileReference: false,
          },
        ],
        attachments: [
          {
            id: 0,
            relatedEntityId: 0,
            fileName: "",
            dateOfUpload: "",
            fileType: {
              value: 0,
              description: "",
            },
            sizeDescription: "",
            downloadInfo: {
              fileName: "",
              fileId: 0,
              fileType: {
                value: 0,
                description: "",
              },
              downloadUrl: "",
            },
            actions: {
              canDelete: false,
              canDownload: false,
              canView: false,
              canChangeState: false,
            },
          },
        ],
      },
      hasAttachments: false,
    },

    validationSchema: Yup.object().shape({}),
    onSubmit: async (values) => {
      if (actionType === 1) {
        setIsSubmitting(true);
      } else setIsSubmitting2(true);

      try {
        if (values.products.length === 0) {
          toast.error("At least one product is required.");
          return; // Stop execution here
        }

        // Loop through products and check for empty titles
        for (let i = 0; i < values.products.length; i++) {
          if (
            !values.products[i].title ||
            values.products[i].title.trim() === ""
          ) {
            toast.error("Product title cannot be empty.");
            return; // Stop execution here
          }
        }

        const response = await postQuote(values);

        if (response.isValid) {
          switch (action) {
            case 1:
              setAddModalOpen(false);
              setContactResponse(null);
              setRefresh(!refresh);
              break;
            case 2:
              setEditModalId(0);
              formik.setValues(formik.initialValues);
              setContactResponse(null);
              setActiveTab(tabs[0]);
              break;
            case 3:
              setEditModalId(response.result.id);
              setResponse(response.result);

              localStorage.setItem(
                "currentItem",
                JSON.stringify(response.result)
              );
              navigate(`/estimation/view/${response.result.uniqueId}`);

              break;
            case 4:
              setAddModalOpen(false);
              const link = document.createElement("a");
              link.href = formik.values.downloadInfo.downloadUrl;
              link.setAttribute(
                "download",
                formik.values.downloadInfo.fileName
              );
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              break;
            case 5:
              setResponse(response.result);
              openSend("send", response.result.id);
              break;
            case 6:
              setResponse(response.result);
              openActivate("download", response.result.id);
              break;
            case 7:
              setResponse(response.result);
              openActivate("activate", response.result.id);
              break;
            default:
              setEditModalId(response.result.id);
              setResponse(response.result);
              break;
          }
        }

        handleToast(response);
      } catch (error) {
        console.error("Post failed:", error);
      } finally {
        setIsSubmitting(false);
        setIsSubmitting2(false);
      }
    },
  });
  useEffect(() => {
    if (formik.values.attachments?.attachments?.length > 0) {
      formik.setFieldValue("hasAttachments", true);
    }
  }, [formik.values.attachments?.attachments?.length]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [clientCheck, setClientCheck] = useState<boolean>(false);
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      let res;
      if (editModalId != 0) {
        res = await getQuoteById(editModalId);
        // setDisableTabs(false);
      } else if (formik.values.header.clientId === 0 && editModalId === 0) {
        res = await getDefaultEmpty();
      } else {
        setIsLoading(false);
        return;
      }
      formik.setValues({
        ...formik.values,
        ...res.result, // Merge the response with the existing form values
      });
      setClientCheck(true);
      setIsLoading(false);
    };

    fetchInitialData();
  }, [editModalId, refresh]);

  const [ledgers, setLedgers] = useState<any>([]);
  const [vatTypes, setVatTypes] = useState<any>([]);
  const [discountTypes, setDiscountTypes] = useState<any>([]);
  const [unitTypes, setUnitTypes] = useState<any>([]);
  const [companyTradeNames, setCompanyTradeNames] = useState<any>([]);
  const [notificationCycles, setNotificationCycles] = useState<any>([]);
  const [extraOptionsModal, setExtraOptionsModal] = useState<boolean>(false);

  const tabs = [
    {
      id: "tab1",
      label: intl.formatMessage({ id: "Fields.Client" }),
      icon: "fa-regular fa-address-book fs-3 hippo-tab-icon",
    },
    {
      id: "tab2",
      label: intl.formatMessage({ id: "Fields.Product" }),
      icon: "fa-solid fa-file-invoice fs-3 hippo-tab-icon",
    },
    {
      id: "tab3",
      label: intl.formatMessage({ id: "Fields.Description" }),
      icon: "fa-regular fa-closed-captioning fs-3 hippo-tab-icon",
    },
    {
      id: "tab4",
      label: intl.formatMessage({ id: "Fields.SideMenuCustomFeatures" }),
      icon: "fa-solid fa-file-invoice fs-3 hippo-tab-icon",
    },
  ];

  const [activeTab, setActiveTab] = useState(tabs[0]);

  const handleTabClick = (tab: any) => {
    setActiveTab(tab);
  };
  useEffect(() => {
    const fetchLedgersForSale = async () => {
      const response = await getLedgerTypes();
      if (response.isValid) {
        const options = response.result.map((item) => ({
          value: item.id,
          label: item.title,
        }));
        setLedgers(options);
      }
    };
    if (ledgers?.length === 0) {
      fetchLedgersForSale();
    }
  }, []);

  useEffect(() => {
    const fetchUnitTypes = async () => {
      const response = await getUnitTypes();
      if (response.isValid) {
        const options = response.result.map((item: any) => ({
          value: item.id,
          label: item.title,
        }));
        setUnitTypes(options);
      }
    };
    if (unitTypes?.length === 0) {
      fetchUnitTypes();
    }
  }, []);

  const [discountRefresh, setDiscountRefresh] = useState<boolean>(false);

  useEffect(() => {
    const fetchDiscountTypes = async () => {
      const response = await getDiscountTypes();

      if (response.isValid) {
        setDiscountTypes(response.result);
      }
    };

    fetchDiscountTypes();
  }, [discountRefresh]);

  useEffect(() => {
    const fetchVatsForSale = async () => {
      const response = await getVatList();
      if (response.isValid) {
        setVatTypes(response.result);
      }
    };
    if (vatTypes?.length === 0) {
      fetchVatsForSale();
    }
  }, []);

  useEffect(() => {
    const fetchTradeNames = async () => {
      const response = await getTradeNames();

      if (response.isValid) {
        const options = response.result.map((item: any) => ({
          value: item.id,
          label: item.title,
        }));
        setCompanyTradeNames(options);
      }
    };
    if (companyTradeNames?.length === 0) {
      fetchTradeNames();
    }
  }, []);

  useEffect(() => {
    const fetchNotificationCycles = async () => {
      const response = await getNotificationCycles();

      if (response.isValid) {
        const options = response.result.map((item: any) => ({
          value: item.id,
          label: item.title,
        }));
        setNotificationCycles(options);
      }
    };
    if (notificationCycles?.length === 0) {
      fetchNotificationCycles();
    }
  }, []);

  const calculateVatTotals = () => {
    const vatTotals: { [key: string]: VatTotal } = {}; // VAT percentages as keys
    let totalPriceExcVat = 0;
    let totalPriceIncVat = 0;
    let hasDiscountmargin = false;
    let totalDiscountAmount = 0;

    formik.values.products.forEach((product) => {
      let totalAmount = product.units * product.unitPrice;
      let discountAmount = 0;
      let vatAmount = 0;

      // Apply discount if available
      if (product.discountMarginId) {
        hasDiscountmargin = true;
        const discountInfo = discountTypes
          ?.map((item: any) => ({
            value: item.id,
            label: item.title,
            amount: item.amount,
            isPercentageMargin: item.isPercentageMargin,
          }))
          .find(
            (discountType: any) =>
              discountType.value === product.discountMarginId
          );

        if (discountInfo) {
          if (discountInfo.isPercentageMargin) {
            discountAmount = (totalAmount * discountInfo.amount) / 100; // Percentage-based discount
          } else {
            discountAmount = discountInfo.amount; // Fixed discount
          }

          totalAmount -= discountAmount; // Subtract discount from total amount
          totalDiscountAmount += discountAmount; // Add to total discount summary
        }
      }

      totalPriceExcVat = totalAmount; // Add the price excluding VAT

      // Calculate VAT if VAT Type is available
      if (product.vatTypeId) {
        const vatInfo = vatTypes
          ?.map((item: any) => ({
            value: item.id,
            label: item.title,
            amount: item.value,
            isAlwaysExBtw: item.isAlwaysExBtw, // Include isAlwaysExVat in the mapping
          }))
          .find((vatType: any) => vatType.value === product.vatTypeId);

        if (vatInfo) {
          const isBtwExclusive = !vatInfo?.isAlwaysExBtw;

          // Check if VAT should always be excluded (use 0.00 for VAT amount)

          if (vatInfo.isAlwaysExBtw) {
            vatAmount = 0.0; // Set VAT amount to 0.00
            totalPriceIncVat += totalAmount || 0.0; // No VAT adjustment for total
          } else {
            // Regular VAT calculation logic
            if (product.btwExclusive) {
              vatAmount = (totalAmount * vatInfo.amount) / 100; // Exclusive VAT calculation
              totalPriceIncVat += totalAmount + (vatAmount || 0.0); // Add VAT to total
            } else {
              vatAmount =
                (totalAmount * vatInfo.amount) /
                (100 + vatInfo.amount).toFixed(2); // Inclusive VAT calculation
              totalPriceIncVat += totalAmount || 0.0; // No need to adjust totalAmount for inclusive VAT

              totalPriceExcVat +=
                (product.unitPrice / (1 + vatInfo.amount / 100)) *
                product.units;
            }
          }

          // Track VAT totals for each VAT percentage, including the 0.00 case
          if (!vatTotals[vatInfo.label]) {
            vatTotals[vatInfo.label] = { title: vatInfo.label, totalVat: 0.0 };
          }
          vatTotals[vatInfo.label].totalVat += vatAmount || 0.0;
          totalPriceExcVat -= totalDiscountAmount;
        }
      }
    });

    // Return final totals and VAT breakdown
    return {
      vatTotals: Object.values(vatTotals),
      totalPriceExcVat,
      totalPriceIncVat,
      hasDiscountmargin,
      totalDiscountAmount,
    };
  };
  const [refreshTotal, setRefreshTotal] = useState<boolean>(false);

  const {
    vatTotals,
    totalPriceExcVat,
    totalPriceIncVat,
    hasDiscountmargin,
    totalDiscountAmount,
  } = calculateVatTotals();

  useEffect(() => {
    calculateVatTotals();
  }, [formik.values.products, refreshTotal]);
  const [attachmentsModalOpen, setAttachmentsModalOpen] =
    useState<boolean>(false);

  const [restoreModalOpen, setRestoreModalOpen] = useState<boolean>(false);
  const [downloadUrl, setDownloadUrl] = useState<string>("");
  const [key, setKey] = useState<number>(1);
  const [selectedAttachment, setSelectedAttachment] = useState<any>();

  const handleDelete = (attachment: any) => {
    const attachmentId = attachment.fileId;

    // Check if the attachmentId is already in attachmentsToLink
    const attachmentsToLink = formik.values.attachments.attachmentsToLink || [];

    const attachmentExists = attachmentsToLink.some((attach) => {
      return attach.attachmentId === attachmentId;
    });

    if (attachmentExists) {
      // Remove from attachmentsToLink
      const updatedAttachmentsToLink = attachmentsToLink.filter(
        (attach) => attach.attachmentId !== attachmentId
      );

      // Remove from attachments.attachments

      const updatedAttachments = formik.values.attachments.attachments.filter(
        (item) => item.id !== attachmentId
      );

      // Update formik values
      formik.setFieldValue(
        "attachments.attachmentsToLink",
        updatedAttachmentsToLink
      );
      formik.setFieldValue("attachments.attachments", updatedAttachments);
    } else {
      // Show modal to ask user if they want to restore the file after deletion

      setRestoreModalOpen(true);
      setSelectedAttachment(attachment);
    }
  };

  useEffect(() => {
    if (formik.values.customizations.customQuoteNr === "") {
      formik.setFieldValue("customizations.useCustomQuoteNr", false);
    }
  }, [extraOptionsModal]);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);
  useEffect(() => {
    if (formik.values.attachments?.attachments?.length === 1) {
      setIsCollapsed(false);
    } else {
      setIsCollapsed(true);
    }
  }, [formik.values.attachments?.attachments?.length]);

  return (
    <>
      <div
        className="modal fade show d-block"
        role="dialog"
        id="quote_add_modal"
        aria-modal="true"
        tabIndex={-1}
      >
        <div
          className="modal-dialog "
          style={{
            maxWidth: "1024px",
            width: "100%",
          }}
        >
          <div className="modal-content">
            <ViewCanvas downloadUrl={downloadUrl} keyy={key} />
            <QuoteAddModalHeader
              setAddModalOpen={setAddModalOpen}
              formik={formik}
              editModalId={editModalId}
            />

            <CustomTabManager
              tabs={tabs}
              activeTab={activeTab}
              onTabClick={handleTabClick}
              onExtraOptionsClick={() => setExtraOptionsModal(true)}
              hasOptions={true}
              hasSubscriptions={false}
            />
            {editModalId === 0 && (
              <div
                className="d-flex info-container p-5"
                style={{ backgroundColor: "#FFF4DE" }}
              >
                <div className="col-1 ms-5">
                  <i className="ki-duotone ki-information-4 fs-3x text-center text-warning">
                    <span className="path1"></span>
                    <span className="path2"></span>
                    <span className="path3"></span>
                  </i>
                </div>
                <div className="col-10 text-warning fw-bold">
                  {intl.formatMessage({ id: "Fields.ModalQuoteDraftInfo" })}
                </div>
              </div>
            )}

            <div className="hippo-tab-content" id="myTabContent">
              {activeTab.id === "tab1" && (
                <QuoteAddStep1
                  formik={formik}
                  contactResponse={contactResponse}
                  setContactResponse={setContactResponse}
                  clientCheck={clientCheck}
                />
              )}
              {activeTab.id === "tab2" && (
                <QuoteAddStep2
                  clientId={response?.id}
                  refresh={refresh}
                  formik={formik}
                  vatTypes={vatTypes}
                  ledgers={ledgers}
                  unitTypes={unitTypes}
                  discountTypes={discountTypes}
                  refreshTotal={refreshTotal}
                  setRefreshTotal={setRefreshTotal}
                  setDiscountRefresh={setDiscountRefresh}
                  discountRefresh={discountRefresh}
                />
              )}
              {activeTab.id === "tab3" && (
                <QuoteAddStep3
                  setIsSubmitting={setIsSubmitting}
                  isSubmitting={isSubmitting}
                  formik={formik}
                  setAddModalOpen={setAddModalOpen}
                />
              )}
              {formik.values.hasCustomFields && activeTab.id === "tab4" && (
                <QuoteAddStep4 formik={formik} />
              )}
            </div>
            {extraOptionsModal && (
              <ExtraOptionsModal
                formik={formik}
                setExtraOptionsModal={setExtraOptionsModal}
                companyTradeNames={companyTradeNames}
                notificationCycles={notificationCycles}
              />
            )}

            <div className="table-responsive bg-secondary p-10">
              <table className="table table-row-dashed table-row-gray-300  gs-0 gy-4 ">
                <thead>
                  <tr className="fw-bold text-muted">
                    {hasDiscountmargin && (
                      <th>
                        {intl
                          .formatMessage({ id: "Fields.TotalDiscountSummary" })
                          .toUpperCase()}
                      </th>
                    )}
                    <th className="text-end">
                      {intl
                        .formatMessage({ id: "Fields.TotalVATSummary" })
                        .toUpperCase()}
                    </th>

                    <th className="text-end">
                      {intl
                        .formatMessage({ id: "Fields.TotalPrice" })
                        .toUpperCase()}
                    </th>
                    <th className="text-end">
                      {intl.formatMessage({ id: "Fields.Total" }).toUpperCase()}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="fw-bold">
                    {hasDiscountmargin && (
                      <td>
                        {" "}
                        {
                          auth.currentUser?.result.activeCompanyDefaults
                            .defaultValuta.sign
                        }{" "}
                        {totalDiscountAmount.toFixed(2)}
                      </td>
                    )}
                    <td>
                      <div className="table-responsive">
                        <table className="table">
                          {vatTotals?.map((vatTotal: any) => (
                            <tbody key={vatTotal.title + 1}>
                              <tr className="border-0">
                                <td className="p-0 border-0 text-end">
                                  {vatTotal.title}
                                </td>
                                <td className="p-0 text-end mr-5  text-nowrap">
                                  {
                                    auth.currentUser?.result
                                      .activeCompanyDefaults.defaultValuta.sign
                                  }{" "}
                                  {isNaN(vatTotal.totalVat)
                                    ? "0.00"
                                    : vatTotal.totalVat.toFixed(2)}
                                </td>
                              </tr>
                            </tbody>
                          ))}
                        </table>
                      </div>
                    </td>

                    <td className="cursor-pointer fw-bold text-end">
                      {
                        auth.currentUser?.result.activeCompanyDefaults
                          .defaultValuta.sign
                      }{" "}
                      {totalPriceExcVat.toFixed(2)}
                    </td>
                    <td className="cursor-pointer rounded fw-bold fs-2 text-end text-success">
                      {
                        auth.currentUser?.result.activeCompanyDefaults
                          .defaultValuta.sign
                      }{" "}
                      {totalPriceIncVat.toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <AttachmentListing
              attachments={formik?.values?.attachments?.attachments}
              setIsCollapsed={setIsCollapsed}
              isCollapsed={isCollapsed}
              formik={formik}
              restoreModalOpen={restoreModalOpen}
              setRestoreModalOpen={setRestoreModalOpen}
              handleDelete={handleDelete}
              setDownloadUrl={setDownloadUrl}
              selectedAttachment={selectedAttachment}
              setKey={setKey}
            />
            <QuoteAddModalFooter
              formik={formik}
              setAddModalOpen={setAddModalOpen}
              setActionType={setActionType}
              isSubmitting={isSubmitting}
              isSubmitting2={isSubmitting2}
              setAction={setAction}
              openSend={openSend}
              attachmentsModalOpen={attachmentsModalOpen}
              setAttachmentsModalOpen={setAttachmentsModalOpen}
            />
          </div>
        </div>
      </div>
      {isLoading && <ListLoading />}
      <div className="modal-backdrop fade show"></div>
    </>
  );
};

export { QuoteAddModal };
