import { useEffect, useState } from "react";
import { CostLinkingModalHeader } from "./CostLinkingModalHeader";
import { CostLinkingModalFooter } from "./CostLinkingModalFooter";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useIntl } from "react-intl";
import { CostAddStep1 } from "./CostAddStep1";
import { CostAddStep2 } from "./CostAddStep2";
import Select from "react-select";
import { ListLoading } from "../../../generic/ListLoading";
import { AttachmentsModal } from "../../../generic/FileManager/AttachmentsModal";
import { AttachmentListing } from "../../../generic/FileManager/AttachmentListing";
import {
  getDefaultEmpty,
  getTradeNames,
  postCostItem,
} from "../../../accounting/costs/components/core/_requests";
import { CustomTabManager } from "../../../generic/Tabs/CustomTabManager";
import { KTSVG } from "../../../../../_metronic/helpers";
import { useAuth } from "../../../auth";
import { handleToast } from "../../../auth/core/_toast";
import { ViewCanvas } from "../../../generic/ViewCanvas";
import {
  getLedgerAccountsForFilter,
  getVatTypesForLedger,
} from "../../../admin-settings/ledgeraccounts-list/core/_requests";

interface Props {
  setRefresh: (type: boolean) => void;
  setAttatchCostModalOpen: (type: boolean) => void;
  inboxDetail: any;
  refresh: boolean;
  setLinkingModalOpen: (type: boolean) => void;
}
type VatTotal = {
  title: string;
  totalVat: number;
};
const CostAddModal = ({
  setRefresh,
  refresh,
  setAttatchCostModalOpen,
  setLinkingModalOpen,
  inboxDetail,
}: Props) => {
  useEffect(() => {
    document.body.classList.add("modal-open");
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, []);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const intl = useIntl();
  const [key, setKey] = useState<number>(1);
  const [action, setAction] = useState<number>();
  const [vatTypes, setVatTypes] = useState<any>([]);
  const formik = useFormik({
    initialValues: {
      id: 0,
      isInvoiceEditable: true,
      attachmentsTempId: "",
      status: 0,
      registrationType: 0,
      title: "",
      header: {
        prospect: {
          clientName: "",
          kvKNr: "",
          vatNr: "",
          ibanNr: "",
        },
        invoiceDate: "",
        invoiceDueDate: "",
        clientId: 0,
        invoiceNr: "",
        invoiceReference: "",
        valutaType: 0,
        companyTradeNameId: 0,
        totalValidationAmount: 0,
        validateTotalAmountWithoutVat: true,
        disableAmountEdit: true,
        clientDisplayName: "",
      },
      products: [
        {
          orderIndex: 0,
          productId: 0,
          description: "",
          totalPrice: 0,
          totalPriceIsExVat: true,
          ledgerAccountId: 0,
          vatTypeId: 0,
        },
      ],
      comments: {
        privateComments: "",
      },
      isAutoBooked: true,
      attachments: {
        attachmentsToLink: [
          {
            inboxItemId: 0,
            attachmentId: 0,
            isRemoved: true,
            restoreAttachment: true,
            isDirectFileReference: true,
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
              canDelete: true,
              canDownload: true,
              canView: true,
              canChangeState: true,
            },
          },
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
              canDelete: true,
              canDownload: true,
              canView: true,
              canChangeState: true,
            },
            sendWithEmail: false,
          },
        ],
      },
      viewTabs: {
        showPayments: true,
        showActionHistory: true,
        showBookingMutations: true,
      },
      actions: {
        canEdit: true,
        canDelete: true,
        canRegisterPayment: true,
        canAddAttachments: true,
      },
    },
    validationSchema: Yup.object().shape({
      // "header.invoiceDate": Yup.string().required(
      //   intl
      //     .formatMessage({ id: "Common.RequiredFieldHint2" })
      //     .replace("{0}", intl.formatMessage({ id: "Fields.BookingDate" }))
      // ),
      title: Yup.string()
        .required(
          intl
            .formatMessage({ id: "Common.RequiredFieldHint2" })
            .replace(
              "{0}",
              intl.formatMessage({ id: "Fields.BookingDescription" })
            )
        )
        .min(
          0,
          intl
            .formatMessage({ id: "Common.ValidationMin" })
            .replace(
              "{0}",
              intl.formatMessage({ id: "Fields.BookingDescription" })
            )
            .replace("{1}", `20`)
        )
        .max(
          100,
          intl
            .formatMessage({ id: "Common.ValidationMax" })
            .replace(
              "{0}",
              intl.formatMessage({ id: "Fields.BookingDescription" })
            )
            .replace("{1}", `100`)
        ),
      "header.totalValidationAmount": Yup.number()
        .nullable()
        .test("total-match", function () {
          const totalValidationAmount = this.resolve(
            Yup.ref("header.totalValidationAmount")
          );

          if (typeof totalValidationAmount === "undefined") {
            return this.createError({
              message: "Total validation amount is missing.",
            });
          }
          return totalValidationAmount === totalPriceIncVat
            ? true
            : this.createError({
                message: `Total price ${totalValidationAmount} does not match the expected total ${totalPriceIncVat.toFixed(
                  2
                )}`,
              });
        }),
    }),

    validateOnChange: true,
    onSubmit: async (values) => {
      handleSubmit();
    },
  });
  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const response = await postCostItem(formik.values);

      if (response.isValid) {
        setAttatchCostModalOpen(false);
        setRefresh(!refresh);
      }

      handleToast(response);
    } catch (error) {
      console.error("Post failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  const calculateVatTotals = () => {
    const vatTotals: { [key: string]: VatTotal } = {}; // VAT percentages as keys
    let totalPriceExcVat = 0;
    let totalPriceIncVat = 0;

    formik.values.products.forEach((product) => {
      // let totalAmount = product.units * product.unitPrice;
      let totalAmount = product.totalPrice;
      let vatAmount = 0;

      // Calculate VAT if VAT Type is available
      if (product.vatTypeId) {
        const vatInfo = vatTypes
          ?.flatMap((group: any) => group.options)

          .find((vatType: any) => vatType.value === product.vatTypeId);

        if (vatInfo) {
          if (product.totalPriceIsExVat) {
            // VAT Exclusive Calculation
            totalPriceExcVat += totalAmount; // Add the price excluding VAT
            vatAmount = (totalAmount * vatInfo.amount) / 100;
            totalPriceIncVat += totalAmount + vatAmount;
          } else {
            // return;
            // VAT Inclusive Calculation
            const exclusivePrice = totalAmount / (1 + vatInfo.amount / 100);

            vatAmount = totalAmount - exclusivePrice;

            totalPriceExcVat += exclusivePrice;
            totalPriceIncVat += totalAmount; // Since totalAmount is already inclusive
          }

          // Track VAT totals for each VAT percentage, including the 0.00 case
          if (!vatTotals[vatInfo.label]) {
            vatTotals[vatInfo.label] = {
              title: vatInfo.label,
              totalVat: 0.0,
            };
          }
          // setPrice(totalPriceIncVat);

          vatTotals[vatInfo.label].totalVat += vatAmount || 0.0;
        }
      }
    });

    // Return final totals and VAT breakdown
    return {
      vatTotals: Object.values(vatTotals),
      totalPriceExcVat,
      totalPriceIncVat,
    };
  };
  const auth = useAuth();
  const [refreshTotal, setRefreshTotal] = useState<boolean>(false);

  const { vatTotals, totalPriceExcVat, totalPriceIncVat } =
    calculateVatTotals();

  useEffect(() => {
    calculateVatTotals();
  }, [formik.values.products, refreshTotal]);
  useEffect(() => {
    formik.validateForm();
  }, [totalPriceIncVat]); // Dependencies to trigger recalculation

  useEffect(() => {
    if (formik.values.attachments?.attachments?.length > 0) {
      formik.setFieldValue("hasAttachments", true);
    }
  }, [formik.values.attachments?.attachments?.length]);
  useEffect(() => {
    formik.setFieldValue("hasAttachments", true);
    formik.setValues({
      ...formik.values, // Preserve existing values
      attachments: {
        ...formik.values.attachments, // Preserve existing attachments object
        attachments: [inboxDetail], // Update the nested attachments array
        attachmentsToLink: [
          {
            inboxItemId: inboxDetail?.id,
            attachmentId: inboxDetail?.fileId,
            isRemoved: false,
            restoreAttachment: true,
            isDirectFileReference: false,
          },
        ],
      },
    });
  }, []);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        let res;

        res = await getDefaultEmpty();

        formik.setValues({
          ...formik.values,
          ...res.result, // Merge the response with the existing form values
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const [ledgers, setLedgers] = useState<any[]>([]);

  const [companyTradeNames, setCompanyTradeNames] = useState<any>([]);
  const [extraOptionsModal, setExtraOptionsModal] = useState<boolean>(false);

  const tabs = [
    {
      id: "tab1",
      label: intl.formatMessage({ id: "Fields.Client" }),
      icon: "fa-regular fa-address-book fs-3 hippo-tab-icon",
    },
    {
      id: "tab2",
      label: intl.formatMessage({ id: "Fields.CostItemsRegionTitle" }),
      icon: "fa-solid fa-file-invoice fs-3 hippo-tab-icon",
    },
  ];

  const [activeTab, setActiveTab] = useState(tabs[0]);

  const handleTabClick = (tab: any) => {
    setActiveTab(tab);
  };
  useEffect(() => {
    const fetchLedgers = async () => {
      const response = await getLedgerAccountsForFilter();

      if (response.isValid) {
        const groupedOptions = [
          {
            label: response.result.balanceActivaItemsGroupTitle,
            options: response.result.balanceActivaItems.map((item: any) => ({
              value: item.id, // or any unique identifier
              label: item.title, // replace with the relevant property
              bearingType: item.bearingType.value,
            })),
          },
          {
            label: response.result.balancePassivaItemsGroupTitle,
            options: response.result.balancePassivaItems.map((item: any) => ({
              value: item.id,
              label: item.title,
              bearingType: item.bearingType.value,
            })),
          },
          {
            label: response.result.resultItemsGroupTitle,
            options: response.result.resultItems.map((item: any) => ({
              value: item.id,
              label: item.title,
              bearingType: item.bearingType.value,
            })),
          },
        ];

        setLedgers(groupedOptions);
      }
    };
    if (ledgers?.length === 0) {
      fetchLedgers();
    }
  }, []);

  useEffect(() => {
    const fetchVatsForSale = async () => {
      const response = await getVatTypesForLedger();
      if (response.isValid) {
        let options = [];

        options = [
          {
            label: response.result.listForSalesGroupTitle,
            options: response.result.listForSales.map((item) => ({
              amount: item.value,
              value: item.id,
              label: item.title,
              isAlwaysExBtw: item.isAlwaysExBtw,
            })),
          },
          {
            label: response.result.listForCostsGroupTitle,
            options: response.result.listForCosts.map((item) => ({
              amount: item.value,
              value: item.id,
              label: item.title,
              isAlwaysExBtw: item.isAlwaysExBtw,
            })),
          },
        ];
        setVatTypes(options);
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

  const [attachmentsModalOpen, setAttachmentsModalOpen] =
    useState<boolean>(false);

  const [restoreModalOpen, setRestoreModalOpen] = useState<boolean>(false);
  const [downloadUrl, setDownloadUrl] = useState<string>("");
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
        id="booking_add_modal"
        aria-modal="true"
        tabIndex={-1}
      >
        <div
          className="modal-dialog"
          style={{
            maxWidth: "1024px",
            width: "100%",
          }}
        >
          <div className="modal-content">
            <ViewCanvas downloadUrl={downloadUrl} keyy={key} />
            <CostLinkingModalHeader
              setAttatchCostModalOpen={setAttatchCostModalOpen}
              inboxDetail={inboxDetail}
            />
            <CustomTabManager
              tabs={tabs}
              activeTab={activeTab}
              onTabClick={handleTabClick}
              onExtraOptionsClick={() => setExtraOptionsModal(true)}
              hasOptions={true}
              hasSubscriptions={false}
            />
            <div className="hippo-tab-content" id="myTabContent">
              {activeTab.id === "tab1" && (
                <CostAddStep1
                  formik={formik}
                  setRefresh={setRefresh}
                  refresh={refresh}
                />
              )}
              {activeTab.id === "tab2" && (
                <CostAddStep2
                  formik={formik}
                  vatTypes={vatTypes}
                  ledgers={ledgers}
                  refreshTotal={refreshTotal}
                  setRefreshTotal={setRefreshTotal}
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
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <div className="modal-header bg-primary d-flex justify-content-between">
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
                          className="btn btn-primary"
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
            <CostLinkingModalFooter
              isSubmitting={isSubmitting}
              setAttachmentsModalOpen={setAttachmentsModalOpen}
              setLinkingModalOpen={setLinkingModalOpen}
              handleSubmit={handleSubmit}
              setAttatchCostModalOpen={setAttatchCostModalOpen}
              attachmentsModalOpen={attachmentsModalOpen}
            />
            {attachmentsModalOpen && (
              <AttachmentsModal
                formik={formik}
                setAttachmentsModalOpen={setAttachmentsModalOpen}
                type="modal"
                info="Fields.InboxUploadModuleInfo"
              />
            )}
          </div>
        </div>
      </div>
      {isLoading && <ListLoading />}
      <div className="modal-backdrop fade show"></div>
    </>
  );
};

export { CostAddModal };
