import { useEffect, useState } from "react";
import { InvoiceAddModalHeader } from "./InvoiceAddModalHeader";
import { InvoiceAddModalFooter } from "./InvoiceAddModalFooter";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useIntl } from "react-intl";
import { toast } from "react-toastify";
import {
  getDefaultEmpty,
  getInvoiceById,
  postInvoice,
  getNotificationCycles,
  getDiscountTypes,
  getLedgerTypes,
  getTradeNames,
  getUnitTypes,
  getVatList,
  getFactoringClients,
  getQuickViewInvoice,
} from "../core/_requests";
import { handleToast } from "../../../auth/core/_toast";
import { InvoiceAddStep3 } from "./InvoiceAddStep3";
import { InvoiceAddStep2 } from "./InvoiceAddStep2";
import { InvoiceAddStep1 } from "./InvoiceAddStep1";
import { useAuth } from "../../../auth";
import { ViewCanvas } from "../../../generic/ViewCanvas";
import { ListLoading } from "../../../generic/ListLoading";
import { InvoiceRecurringModal } from "../invoice-recurring-modal/InvoiceRecurringModal";
import { useNavigate } from "react-router-dom";
import { CustomTabManager } from "../../../generic/Tabs/CustomTabManager";
import ModalWrapper from "../../../generic/Modals/ModalWrapper";
import { AttachmentListing } from "../../../generic/FileManager/AttachmentListing";
import { InvoiceAddStep4 } from "./InvoiceAddStep4";
import { ExtraOptionsModal } from "../extra-options-modal/ExtraOptionsModal";
import { ProductPicker } from "./ProductPicker";
import { ClientAddModal } from "../../../client/client-search/client-add-modal/ClientAddModal";
import { ClientSearch } from "../../../generic/ClientSearch";
interface Props {
  setRefresh: (type: boolean) => void;
  refresh: boolean;
  setAddModalOpen: (type: boolean) => void;
  editModalId: number;
  setEditModalId: (type: number) => void;
  setActivateModalOpen: (type: boolean) => void;
  setInvoiceNr: (type: string) => void;
  setEmailModalOpen: (type: boolean) => void;
  addModalOpen: boolean;
}
type VatTotal = {
  title: string;
  totalVat: number;
};
const InvoiceAddModal = ({
  setRefresh,
  setAddModalOpen,
  refresh,
  setEditModalId,
  editModalId,
  setActivateModalOpen,
  setInvoiceNr,
  setEmailModalOpen,
  addModalOpen,
}: Props) => {
  useEffect(() => {
    document.body.classList.add("modal-open");
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, []);
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitting2, setIsSubmitting2] = useState<boolean>(false);
  const [actionType, setActionType] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(true);
  const intl = useIntl();
  const auth = useAuth();
  const [response, setResponse] = useState<any>([]);
  const [action, setAction] = useState<number>();
  const [contactResponse, setContactResponse] = useState<any>();
  const [clientCheck, setClientCheck] = useState<boolean>(false);
  const openActivate = (actionType: string, id: number) => {
    setActivateModalOpen(true);
    valueSetter(actionType, id);
  };

  const openSend = (actionType: string, id: number) => {
    setEmailModalOpen(true);
    valueSetter(actionType, id);
  };

  const valueSetter = async (actionType: string, id: number) => {
    const data = await getQuickViewInvoice(formik.values.id);
    if (data.isValid) {
      setEditModalId(data.result.id);
      setInvoiceNr(data.result.invoiceNr);
      localStorage.setItem(
        "ModalData",
        JSON.stringify({
          invoiceDateAsString: data?.result.invoiceDateAsString,
          client: data?.result.client.companyName,
          totalPriceWithVat: data?.result.totals.totalPriceWithVAT,
          sign: data?.result.valuta.sign,
          status: data?.result.invoiceStatus.value,
          activeSendInstructions: data?.result?.activeSendInstructions,
          totalOpen: data?.result.totals.totalOpen,
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
      isInvoiceEditable: true,
      status: 0,
      canUseAutomation: true,
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
        invoiceDate: "",
        deliveryDate: "",
        clientId: 0,
        clientContactId: 0,
        deadLineForPaymentDays: 0,
        clientReferenceNr: "",
        valutaType: 0,
        companyTradeNameId: 0,
        quoteId: 0,
        exchangeRate: {
          lastUpdated: "",
          rate: 0,
        },
        clientDisplayName: "",
      },
      customizations: {
        useCustomInvoiceNr: true,
        customInvoiceNr: "",
        hideProductCodes: true,
        isCreditNota: true,
        canChangeCreditNotaStatus: true,
        notificationCycleId: 0,
        factoringClientId: 0,
        dontSendRemindersOnlyTrackStatus: true,
      },
      products: [
        {
          productId: 0,
          title: "",
          code: "",
          description: "",
          units: 0,
          unitPrice: 0,
          companyUnitTypeId: 0,
          btwExclusive: true,
          includeLinkedProductDesciption: true,
          linkedProductDescription: "",
          linkedProductId: 0,
          ledgerAccountId: 0,
          vatTypeId: 0,
          discountMarginId: 0,
          orderIndex: 0,
        },
      ],
      comments: {
        invoiceComments: "",
        privateComments: "",
      },
      automationSettings: {
        afterAutomationNotifyMe: true,
        afterAutomationSendMeAnCopy: true,
        enableAutomation: false,
        autoSendAfterRecurringAutoCopy: true,
        recurringEndDate: "",
        subscriptionStartDate: "",
        invoiceRecurringType: 0,
        automationEnableSepaIncasso: true,
        automationPreferedIncassoDay: 0,
        recurringMaxCount: 0,
        automationBankReferenceDescription: "",
        sendDaysBeforeActualDate: 0,
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
            asDate: "",
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

        const response = await postInvoice(values);

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
              navigate(`/invoice/view/${response.result.uniqueId}`);

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
              openSend("send", response.result.id);
              setAddModalOpen(false);
              setContactResponse(null);
              setRefresh(!refresh);
              break;
            case 6:
              openActivate("download", response.result.id);
              setAddModalOpen(false);
              setContactResponse(null);
              setRefresh(!refresh);
              break;
            case 7:
              openActivate("activate", response.result.id);
              setAddModalOpen(false);
              setContactResponse(null);
              setRefresh(!refresh);
              break;
            case 8:
              openSend("save", response.result.id);
              setAddModalOpen(false);
              setContactResponse(null);
              setRefresh(!refresh);
              break;
            default:
              setEditModalId(response.result.id);
              setResponse(response.result);
              setRefresh(!refresh);
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
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        let res;
        if (editModalId != 0) {
          res = await getInvoiceById(editModalId);

          // setDisableTabs(false);
        } else if (editModalId == 0) {
          res = await getDefaultEmpty();
        } else {
          return;
        }
        formik.setValues({
          ...formik.values,
          ...res.result, // Merge the response with the existing form values
        });
      } finally {
        setClientCheck(true);
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [editModalId, refresh]);

  const [ledgers, setLedgers] = useState<any>([]);
  const [vatTypes, setVatTypes] = useState<any>([]);
  const [discountTypes, setDiscountTypes] = useState<any>([]);
  const [unitTypes, setUnitTypes] = useState<any>([]);
  const [companyTradeNames, setCompanyTradeNames] = useState<any>([]);
  const [factoringClients, setFactoringClients] = useState<any>([]);
  const [notificationCycles, setNotificationCycles] = useState<any>([]);
  const [extraOptionsModal, setExtraOptionsModal] = useState<boolean>(false);
  const [subscriptionsModal, setSubscriptionsModal] = useState<boolean>(false);

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
  const [ledgerRefresh, setLedgerRefresh] = useState<boolean>(false);
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
    fetchLedgersForSale();
  }, [ledgerRefresh]);

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
    const fetchFactoringClients = async () => {
      const response = await getFactoringClients();

      if (response.isValid) {
        const options = response.result.map((item: any) => ({
          value: item.id,
          label: item.title,
        }));
        setFactoringClients(options);
      }
    };
    if (factoringClients?.length === 0) {
      fetchFactoringClients();
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
    if (formik.values.customizations.customInvoiceNr === "") {
      formik.setFieldValue("customizations.useCustomInvoiceNr", false);
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
  const [productPicker, setProductPicker] = useState<any>();
  const closeProductPicker = () => {
    setProductPicker(false);
    setRefreshTotal(!refreshTotal);
  };
  const [clientModal, setClientModalOpen] = useState<boolean>(false);
  const [clientModalId, setClientModalId] = useState<number>(0);

  const [clientSearch, setClientSearch] = useState<any>();
  const handleClose = () => {
    setClientSearch(false);
  };
  return (
    <>
      <ModalWrapper
        id="invoice_add_modal"
        isOpen={addModalOpen} // Replace with the appropriate state for your modal
        onClose={() => setAddModalOpen(false)} // Pass the close handler
        modalPopup={productPicker || clientSearch || clientModal}
      >
        <ViewCanvas downloadUrl={downloadUrl} keyy={key} />

        <InvoiceAddModalHeader
          setAddModalOpen={setAddModalOpen}
          formik={formik}
          editModalId={editModalId}
        />
        <CustomTabManager
          tabs={tabs}
          activeTab={activeTab}
          onTabClick={handleTabClick}
          onExtraOptionsClick={() => setExtraOptionsModal(true)}
          onSubscriptionsClick={() => setSubscriptionsModal(true)}
          hasOptions={true}
          hasSubscriptions={true}
          hasCustomFields={formik.values.hasCustomFields}
        />
        {editModalId === 0 && (
          <div
            className="d-flex alert alert-custom alert-default align-items-center"
            style={{ backgroundColor: "#FFF4DE" }}
            role="alert"
          >
            <div className="alert-icon col-1 me-4">
              <i className="ki-duotone ki-information-4 fs-3x text-center text-warning">
                <span className="path1"></span>
                <span className="path2"></span>
                <span className="path3"></span>
              </i>
            </div>
            <div className="alert-text col-10 d-flex flex-column text-warning">
              {intl.formatMessage({ id: "Fields.InvoiceDraftModeInfo" })}
            </div>
          </div>
        )}

        <div className="hippo-tab-content" id="myTabContent">
          {activeTab.id === "tab1" && (
            <InvoiceAddStep1
              formik={formik}
              contactResponse={contactResponse}
              setContactResponse={setContactResponse}
              clientCheck={clientCheck}
              clientModal={clientModal}
              clientSearch={clientSearch}
              setClientModalId={setClientModalId}
              setClientModalOpen={setClientModalOpen}
              setClientSearch={setClientSearch}
            />
          )}
          {activeTab.id === "tab2" && (
            <InvoiceAddStep2
              formik={formik}
              vatTypes={vatTypes}
              ledgers={ledgers}
              unitTypes={unitTypes}
              discountTypes={discountTypes}
              setProductPicker={setProductPicker}
              setDiscountRefresh={setDiscountRefresh}
              discountRefresh={discountRefresh}
              setLedgerRefresh={setLedgerRefresh}
              ledgerRefresh={ledgerRefresh}
            />
          )}
          {activeTab.id === "tab3" && <InvoiceAddStep3 formik={formik} />}
          {formik.values.hasCustomFields && activeTab.id === "tab4" && (
            <InvoiceAddStep4 formik={formik} />
          )}
        </div>
        {extraOptionsModal && (
          <ExtraOptionsModal
            formik={formik}
            setExtraOptionsModal={setExtraOptionsModal}
            companyTradeNames={companyTradeNames}
            notificationCycles={notificationCycles}
            factoringClients={factoringClients}
          />
        )}

        {subscriptionsModal && (
          <InvoiceRecurringModal
            invoiceId={formik.values.id}
            setRecurringModalOpen={setSubscriptionsModal}
            formik={formik}
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
                <th>
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
                      {vatTotals?.map((vatTotal: any, index: number) => (
                        <tbody key={index}>
                          <tr className="border-0">
                            <td className="p-0 border-0 text-end">
                              {vatTotal.title}
                            </td>
                            <td className="p-0 text-end mr-5  text-nowrap">
                              {formik.values.customizations.isCreditNota && "-"}
                              {
                                auth.currentUser?.result.activeCompanyDefaults
                                  .defaultValuta.sign
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
                  {formik.values.customizations.isCreditNota && "-"}
                  {
                    auth.currentUser?.result.activeCompanyDefaults.defaultValuta
                      .sign
                  }{" "}
                  {totalPriceExcVat.toFixed(2)}
                </td>
                <td
                  className={`cursor-pointer rounded fw-bold fs-2 text-end ${
                    formik.values.customizations.isCreditNota
                      ? "text-danger"
                      : "text-success"
                  }`}
                >
                  {formik.values.customizations.isCreditNota && "-"}
                  {
                    auth.currentUser?.result.activeCompanyDefaults.defaultValuta
                      .sign
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
        <InvoiceAddModalFooter
          formik={formik}
          isSubmitting2={isSubmitting2}
          setAddModalOpen={setAddModalOpen}
          isSubmitting={isSubmitting}
          setAction={setAction}
          attachmentsModalOpen={attachmentsModalOpen}
          setAttachmentsModalOpen={setAttachmentsModalOpen}
          setActionType={setActionType}
        />
      </ModalWrapper>
      {isLoading && <ListLoading />}
      <div className="modal-backdrop fade show"></div>
      {productPicker && (
        <ProductPicker
          closeProductPicker={closeProductPicker}
          formik={formik}
        />
      )}
      {clientModal && (
        <ClientAddModal
          setEditModalId={setClientModalId}
          setAddModalOpen={setClientModalOpen}
          editModalId={clientModalId}
        />
      )}
      {clientSearch && (
        <ClientSearch
          handleClose={handleClose}
          formik={formik}
          storageName="storedClient"
        />
      )}
    </>
  );
};

export { InvoiceAddModal };
