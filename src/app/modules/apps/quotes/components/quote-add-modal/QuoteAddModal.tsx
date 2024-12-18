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
} from "../core/_requests";
import { handleToast } from "../../../../auth/core/_toast";
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
import Select from "react-select";
import { useAuth } from "../../../../auth";
import { KTSVG } from "../../../../../../_metronic/helpers";
import { QuoteViewModal } from "../quote-view-modal/QuoteViewModal";
import { QuoteRestorationModal } from "../quote-restoration-modal/QuoteRestorationModal";
import { ListLoading } from "../../../components/ListLoading";
import Tippy from "@tippyjs/react";
interface Props {
  setRefresh: (type: boolean) => void;
  refresh: boolean;
  setAddModalOpen: (type: boolean) => void;
  editModalId: number;
  setEditModalId: (type: number) => void;
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
}: Props) => {
  useEffect(() => {
    document.body.classList.add("modal-open");
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, []);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const intl = useIntl();
  const auth = useAuth();
  const [response, setResponse] = useState<any>([]);
  const [disableTabs, setDisableTabs] = useState(true);
  const [action, setAction] = useState<number>();
  const [contactResponse, setContactResponse] = useState<any>();
  const formik = useFormik({
    initialValues: {
      id: 0,
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
        clientReferenceNr: "",
        valutaType: 0,
        companyTradeNameId: 0,
        clientDisplayName: "",
      },
      customizations: {
        useCustomQuoteNr: false,
        customQuoteNr: "",
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
          discountMarginId: null,
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
            fileId: 0,
            dateOfUpload: new Date().toISOString(),
            dateOfUploadAsString: "",
            documentDateAsString: "",
            documentDate: new Date().toISOString(),
            fileType: {
              value: 0,
              name: "",
              description: "",
            },
            sizeDescription: "",
            downloadInfo: {
              fileName: "",
              fileId: 0,
              fileType: {
                value: 0,
                name: "",
                description: "",
              },
              fileExtension: null,
              downloadUrl: "",
            },
            actions: {
              canDelete: false,
              canDownload: false,
              canView: false,
              canChangeState: false,
            },
            sendWithEmail: false,
          },
        ],
      },
      hasAttachments: false,
    },

    validationSchema: Yup.object().shape({}),
    onSubmit: async (values, { setSubmitting }) => {
      setIsSubmitting(true);

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
              break;
            default:
              setEditModalId(response.result.id);
              setResponse(response.result);
              break;
          }
        }
        setRefresh(!refresh);
        handleToast(response);
      } catch (error) {
        console.error("Post failed:", error);
      } finally {
        setIsSubmitting(false);
        setSubmitting(false);
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
      setIsLoading(true);
      let res;
      if (editModalId != 0 && editModalId != formik.values.id) {
        res = await getQuoteById(editModalId);
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
      // const clientResponse = JSON.parse(
      //   localStorage.getItem("clientResponse")!
      // );

      // if (clientResponse != null) {
      //   formik.setFieldValue("header.clientId", clientResponse.id);
      //   // formik.setFieldValue(
      //   //   "header.clientReferenceNr",
      //   //   clientResponse.customerNr
      //   // );
      //   formik.setFieldValue(
      //     "header.clientDisplayName",
      //     clientResponse.customerNr + " " + clientResponse.businessName
      //   );
      // }
      // const contactResponse = JSON.parse(
      //   localStorage.getItem("contactResponse")!
      // );
      // if (contactResponse != null) {
      //   formik.setFieldValue("header.clientContactId", 0);
      //   setContactResponse(contactResponse);
      // } else {

      //   const defaultContact = contactResponse?.find(
      //     (contact: any) => contact.isDefaultContact === true
      //   )?.id;
      //   formik.setFieldValue("header.clientContactId", defaultContact);
      // }

      setIsLoading(false);
    };

    fetchInitialData();
  }, [editModalId]);

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
      icon: <i className="fa-regular fa-address-book fs-3 hippo-tab-icon"></i>,
    },
    {
      id: "tab2",
      label: intl.formatMessage({ id: "Fields.Product" }),
      icon: <i className="fa-solid fa-file-invoice fs-3 hippo-tab-icon"></i>,
    },
    {
      id: "tab3",
      label: intl.formatMessage({ id: "Fields.Description" }),
      icon: (
        <i className="fa-regular fa-closed-captioning fs-3 hippo-tab-icon"></i>
      ),
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

  useEffect(() => {
    const fetchDiscountTypes = async () => {
      const response = await getDiscountTypes();

      if (response.isValid) {
        setDiscountTypes(response.result);
      }
    };
    if (discountTypes?.length === 0) {
      fetchDiscountTypes();
    }
  }, []);

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
      console.log(totalAmount); //
      totalPriceExcVat = totalAmount; // Add the price excluding VAT
      console.log(totalPriceExcVat);
      // Calculate VAT if VAT Type is available
      if (product.vatTypeId) {
        console.log(product.vatTypeId);
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

  const {
    vatTotals,
    totalPriceExcVat,
    totalPriceIncVat,
    hasDiscountmargin,
    totalDiscountAmount,
  } = calculateVatTotals();

  useEffect(() => {
    calculateVatTotals();
  }, [formik.values.products]);
  const [attachmentsModalOpen, setAttachmentsModalOpen] =
    useState<boolean>(false);

  const [restoreModalOpen, setRestoreModalOpen] = useState<boolean>(false);
  const [downloadUrl, setDownloadUrl] = useState<string>("");
  const [fileExtension, setFileExtension] = useState<any>();
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
        (item) => item.fileId !== attachmentId
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
            <QuoteAddModalHeader
              businessName={formik.values.header.clientDisplayName}
              tabs={tabs}
              activeTab={activeTab}
              customerNr={formik.values.header.clientReferenceNr}
              setAddModalOpen={setAddModalOpen}
              disableTabs={disableTabs}
              handleTabClick={handleTabClick}
              formik={formik}
              editModalId={editModalId}
            />

            <div className="hippo-tab-manager d-flex justify-content-between p-5 flex-grow-1 bg-secondary">
              <div className="d-flex justify-content-start">
                {tabs.map((tab: any) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      handleTabClick(tab);
                    }}
                    className={`btn bg-light border-0 mx-2 px-4 ${
                      activeTab.id === tab.id
                        ? "hippo-selected-tab text-white bg-dark"
                        : "text-gray bg-body"
                    }  `}
                    data-bs-toggle="tab"
                    style={{ borderBottomColor: "1px solid black" }}
                  >
                    {tab.icon}
                    <span className="me-1">|</span>
                    {tab.label}
                  </button>
                ))}
              </div>
              <div className="text-end">
                {" "}
                <button
                  onClick={() => {
                    setExtraOptionsModal(true);
                  }}
                  className="btn btn-icon btn-dark"
                >
                  <i className="ki-duotone ki-setting-2 fs-2x">
                    <span className="path1"></span>
                    <span className="path2"></span>
                  </i>
                </button>
              </div>
            </div>
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
                  setRefresh={setRefresh}
                  refresh={refresh}
                  setContactResponse={setContactResponse}
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
            </div>
            {extraOptionsModal && (
              <>
                <div
                  className="modal fade show d-block"
                  tabIndex={-1}
                  role="dialog"
                  id="additional_add_modal"
                  aria-modal="true"
                >
                  <div className="modal-dialog " style={{ minWidth: "600px" }}>
                    <div className="modal-content">
                      <div className="modal-header bg-dark d-flex justify-content-between">
                        <h5 className="modal-title text-white">
                          {intl.formatMessage({
                            id: "Fields.ActionExtraOptions",
                          })}
                        </h5>

                        <div
                          className="btn btn-icon btn-sm  ms-2"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                          onClick={() => setExtraOptionsModal(false)}
                        >
                          <KTSVG
                            path="media/icons/duotune/arrows/arr061.svg"
                            className="svg-icon svg-icon-2x text-white"
                          />
                        </div>
                      </div>
                      <div className="modal-body">
                        {formik.values.status === 1 && (
                          <>
                            <div className="row d-flex mb-7 mt-3">
                              <div className="form-check form-switch mt-1 ms-2 d-flex align-items-center">
                                <input
                                  className="form-check-input h-20px w-40px me-5"
                                  type="checkbox"
                                  id="customNrSwitch"
                                  checked={
                                    formik.values.customizations
                                      .useCustomQuoteNr
                                  }
                                  onChange={(e) => {
                                    formik.setFieldValue(
                                      "customizations.useCustomQuoteNr",
                                      !formik.values.customizations
                                        .useCustomQuoteNr
                                    );
                                  }}
                                />
                                <label
                                  className="form-check-label fs-sm text-muted"
                                  htmlFor="customNrSwitch"
                                >
                                  {intl.formatMessage({
                                    id: "Fields.UseCustomQuoteNr",
                                  })}
                                </label>
                              </div>
                              {formik.values.customizations
                                .useCustomQuoteNr && (
                                <div className="mt-5 ms-14 col-11">
                                  <label className="required fw-bold fs-6 mb-3">
                                    {intl.formatMessage({
                                      id: "Fields.CustomQuoteNr",
                                    })}
                                  </label>
                                  <input
                                    type="text"
                                    maxLength={20}
                                    className="form-control form-control-solid"
                                    value={
                                      formik.values.customizations.customQuoteNr
                                    }
                                    onChange={(e) => {
                                      formik.setFieldValue(
                                        "customizations.customQuoteNr",
                                        e.target.value
                                      );
                                    }}
                                  />
                                </div>
                              )}
                            </div>

                            <div className="border-bottom w-100 mt-10 mb-7"></div>
                          </>
                        )}
                        <div className="row d-flex mb-7 mt-3">
                          <div className="form-check form-switch mt-1 ms-2 d-flex align-items-center">
                            <input
                              className="form-check-input h-20px w-40px me-5"
                              type="checkbox"
                              id="hideProductCodesSwitch"
                              checked={
                                formik.values.customizations.hideProductCodes
                              }
                              onChange={(e) => {
                                formik.setFieldValue(
                                  "customizations.hideProductCodes",
                                  !formik.values.customizations.hideProductCodes
                                );
                              }}
                            />

                            <label
                              className="form-check-label  fs-sm text-muted"
                              htmlFor="hideProductCodesSwitch"
                            >
                              {intl.formatMessage({
                                id: "Fields.HideProductCodes",
                              })}
                            </label>
                          </div>
                        </div>
                        <div className="border-bottom w-100 mt-10 mb-10"></div>
                        <div className="d-flex info-container p-5 bg-secondary alert">
                          <div className="col-1 mx-5">
                            <i className="ki-duotone ki-information-4 fs-3x text-center text-primary">
                              <span className="path1"></span>
                              <span className="path2"></span>
                              <span className="path3"></span>
                            </i>
                          </div>
                          <div className="col-10">
                            {intl.formatMessage({
                              id: "Fields.CompanyTradeNameInfo",
                            })}
                          </div>
                        </div>

                        <div className="row d-flex mt-7">
                          <div className="fv-row">
                            <label className="fw-bold fs-6 mb-3">
                              {intl.formatMessage({
                                id: "Fields.CompanyTradeNameId",
                              })}
                            </label>
                            <Select
                              value={companyTradeNames?.find(
                                (company: any) =>
                                  company.value ===
                                  formik.values.header.companyTradeNameId
                              )}
                              className="react-select-styled"
                              options={companyTradeNames}
                              onChange={(e: any) =>
                                formik.setFieldValue(
                                  "header.companyTradeNameId",
                                  e?.value || null
                                )
                              }
                              placeholder={intl.formatMessage({
                                id: "Fields.CompanyTradeNameId",
                              })}
                              isClearable
                            />
                          </div>
                        </div>
                        <div className="border-bottom w-100 mt-10 mb-10"></div>
                        <div className="row d-flex mb-7">
                          <div className="fv-row">
                            <label className="required fw-bold fs-6 mb-3">
                              {intl.formatMessage({
                                id: "Fields.NotificationCycle",
                              })}
                            </label>
                            <Select
                              value={notificationCycles?.find((ledger: any) => {
                                return (
                                  ledger.value ===
                                  formik.values.customizations
                                    .notificationCycleId
                                );
                              })}
                              className="react-select-styled"
                              options={notificationCycles}
                              onChange={(e: any) =>
                                formik.setFieldValue(
                                  "customizations.notificationCycleId",
                                  e?.value || null
                                )
                              }
                              placeholder={intl.formatMessage({
                                id: "Fields.NotificationCycle",
                              })}
                            />
                          </div>
                        </div>
                        <div className="border-bottom w-100 mt-10 mb-10"></div>
                        <div className="row d-flex mb-7">
                          <div className="form-check form-switch mt-1 ms-2 d-flex align-items-center">
                            <input
                              className="form-check-input h-20px w-40px me-5"
                              type="checkbox"
                              id="dontSendRemindersOnlyTrackStatusSwitch"
                              checked={
                                formik.values.customizations
                                  .dontSendRemindersOnlyTrackStatus
                              }
                              onChange={(e) => {
                                formik.setFieldValue(
                                  "customizations.dontSendRemindersOnlyTrackStatus",
                                  !formik.values.customizations
                                    .dontSendRemindersOnlyTrackStatus
                                );
                              }}
                            />
                            <label
                              className="form-check-label fs-sm text-muted"
                              htmlFor="dontSendRemindersOnlyTrackStatusSwitch"
                            >
                              {intl.formatMessage({
                                id: "Fields.DontSendRemindersOnlyTrackStatus",
                              })}
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="modal-footer">
                        <button
                          type="button"
                          className="btn btn-secondary"
                          data-bs-dismiss="modal"
                          onClick={() => {
                            setExtraOptionsModal(false);
                          }}
                        >
                          {intl.formatMessage({
                            id: "Fields.ActionClose",
                          })}
                        </button>
                        <button
                          type="button"
                          className="btn btn-dark"
                          onClick={() => {
                            setExtraOptionsModal(false);
                          }}
                        >
                          {intl.formatMessage({
                            id: "Fields.FilterApplyBtn",
                          })}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-backdrop fade show"></div>
              </>
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
                            <tbody key={vatTotal}>
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

            {formik.values.attachments?.attachments?.length > 0 && (
              <div className="p-10">
                <div
                  className="d-flex align-items-center mb-3 cursor-pointer"
                  onClick={() =>
                    formik.values.attachments.attachments.length > 1 &&
                    setIsCollapsed(!isCollapsed)
                  }
                >
                  <h2 className="me-2">
                    {intl.formatMessage({ id: "Fields.Attachments" })}
                  </h2>
                  <span className="mb-1 bg-secondary text-dark rounded-pill px-2">
                    {formik.values.attachments.attachments.length}
                  </span>
                  {formik.values.attachments.attachments.length > 1 && (
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
                  {formik.values.attachments.attachments.map(
                    (attachment, index) => (
                      <div key={index}>
                        <div className="d-flex align-items-center justify-content-between mb-2 p-5">
                          {/* SVG icon and document name */}
                          <div className="d-flex align-items-center">
                            {restoreModalOpen && (
                              <QuoteRestorationModal
                                attachment={selectedAttachment}
                                setRestoreModalOpen={setRestoreModalOpen}
                                formik={formik}
                              />
                            )}
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
                                  setDownloadUrl(
                                    attachment.downloadInfo.downloadUrl
                                  );
                                  setFileExtension(
                                    attachment.downloadInfo.fileExtension
                                  );
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
                            {attachment.actions.canDelete && (
                              <Tippy
                                content={intl.formatMessage({
                                  id: "Fields.ToolTipDelete",
                                })}
                              >
                                <button
                                  type="button"
                                  className="btn btn-icon btn-danger btn-sm me-2"
                                  onClick={() => handleDelete(attachment)}
                                >
                                  <i className="ki-solid ki-trash text-white fs-2"></i>
                                </button>
                              </Tippy>
                            )}
                          </div>
                        </div>

                        {index <
                          formik.values.attachments.attachments.length - 1 && (
                          <div className="separator border-10 my-5"></div>
                        )}
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            <QuoteAddModalFooter
              formik={formik}
              setAddModalOpen={setAddModalOpen}
              isSubmitting={isSubmitting}
              setAction={setAction}
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
