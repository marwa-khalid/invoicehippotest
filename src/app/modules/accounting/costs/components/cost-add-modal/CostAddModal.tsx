import { useEffect, useState } from "react";
import { CostAddModalHeader } from "./CostAddModalHeader";
import { CostAddModalFooter } from "./CostAddModalFooter";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useIntl } from "react-intl";
import {
  getCostById,
  getDefaultEmpty,
  getTradeNames,
  postCostForMutation,
  postCostItem,
} from "../core/_requests";
import { handleToast } from "../../../../auth/core/_toast";
import { CostAddStep1 } from "./CostAddStep1";
import { CostAddStep2 } from "./CostAddStep2";
import Select from "react-select";
import { KTSVG } from "../../../../../../_metronic/helpers";
import { ListLoading } from "../../../../generic/ListLoading";
import {
  getLedgerAccountsForFilter,
  getVatTypesForLedger,
} from "../../../../admin-settings/ledgeraccounts-list/core/_requests";
import { CustomTabManager } from "../../../../generic/Tabs/CustomTabManager";
import { AttachmentListing } from "../../../../generic/FileManager/AttachmentListing";
import { AttachmentsModal } from "../../../../generic/FileManager/AttachmentsModal";
import { useAuth } from "../../../../auth";
import { ViewCanvas } from "../../../../generic/ViewCanvas";
import { getCostForMutation } from "../../../bankTransactions/overview/components/core/_requests";
interface Props {
  setRefresh: (type: boolean) => void;
  refresh: boolean;
  setAddModalOpen: (type: boolean) => void;
  editModalId: number;
  setEditModalId: (type: number) => void;
  hasMutation: boolean;
}
type VatTotal = {
  title: string;
  totalVat: number;
};
const CostAddModal = ({
  setRefresh,
  setAddModalOpen,
  refresh,
  setEditModalId,
  editModalId,
  hasMutation,
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
  const [saveAsRule, setSaveAsRule] = useState<boolean>(false);
  const [isAutoBooking, setIsAutoBooking] = useState<boolean>(false);
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
      // title: Yup.string()
      //   .required(
      //     intl
      //       .formatMessage({ id: "Common.RequiredFieldHint2" })
      //       .replace(
      //         "{0}",
      //         intl.formatMessage({ id: "Fields.CostDescription" })
      //       )
      //   )
      //   .min(
      //     2,
      //     intl
      //       .formatMessage({ id: "Common.ValidationMin" })
      //       .replace(
      //         "{0}",
      //         intl.formatMessage({ id: "Fields.BookingDescription" })
      //       )
      //       .replace("{1}", `2`)
      //   )
      //   .max(
      //     100,
      //     intl
      //       .formatMessage({ id: "Common.ValidationMax" })
      //       .replace(
      //         "{0}",
      //         intl.formatMessage({ id: "Fields.BookingDescription" })
      //       )
      //       .replace("{1}", `100`)
      //   ),
      "header.invoiceNr": Yup.string()
        .min(
          2,
          intl
            .formatMessage({ id: "Common.ValidationMin" })
            .replace("{0}", intl.formatMessage({ id: "Fields.InvoiceNr" }))
            .replace("{1}", `2`)
        )
        .max(
          100,
          intl
            .formatMessage({ id: "Common.ValidationMax" })
            .replace("{0}", intl.formatMessage({ id: "Fields.InvoiceNr" }))
            .replace("{1}", `100`)
        ),
      "header.totalValidationAmount": Yup.number()
        .nullable()
        .test("total-match", function () {
          const totalValidationAmount = this.resolve(
            Yup.ref("header.totalValidationAmount")
          );
          const isEclusiveCheck = this.resolve(
            Yup.ref("header.validateTotalAmountWithoutVat")
          );

          if (typeof totalValidationAmount === "undefined") {
            return this.createError({
              message: "Total validation amount is missing.",
            });
          }
          if (isEclusiveCheck) {
            return totalValidationAmount === totalPriceExcVat
              ? true
              : this.createError({
                  message: `Total price ${totalValidationAmount} does not match the expected total ${totalPriceExcVat.toFixed(
                    2
                  )}`,
                });
          } else {
            return totalValidationAmount === totalPriceIncVat
              ? true
              : this.createError({
                  message: `Total price ${totalValidationAmount} does not match the expected total ${totalPriceIncVat.toFixed(
                    2
                  )}`,
                });
          }
        }),
    }),

    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      setIsSubmitting(true);

      try {
        let response;
        if (hasMutation) {
          response = await postCostForMutation(
            editModalId,
            saveAsRule,
            isAutoBooking,
            values
          );
        } else {
          response = await postCostItem(values);
        }
        if (response.isValid) {
          switch (action) {
            case 1:
              setAddModalOpen(false);
              break;
            case 2:
              setEditModalId(0);
              formik.setValues(formik.initialValues);
              setActiveTab(tabs[0]);
              break;
            default:
              setEditModalId(response.result.id);
              // formik.setValues({
              //   ...formik.values,
              //   ...response.result,
              // });
              break;
          }
          setRefresh(!refresh);
        }

        handleToast(response);
      } catch (error) {
        console.error("Post failed:", error);
      } finally {
        setIsSubmitting(false);
      }
    },
  });
  const calculateVatTotals = () => {
    const vatTotals: { [key: string]: VatTotal } = {};
    let totalPriceExcVat = 0;
    let totalPriceIncVat = 0;

    formik.values.products.forEach((product) => {
      const totalAmount = product.totalPrice;
      let vatAmount = 0;
      let vatRate = 0;
      let vatLabel = "0%";

      if (product.vatTypeId) {
        const vatInfo = vatTypes
          ?.flatMap((group: any) => group.options)
          .find((vatType: any) => vatType.value === product.vatTypeId);

        if (vatInfo) {
          vatRate = vatInfo.amount;
          vatLabel = vatInfo.label;
        }
      }

      if (product.totalPriceIsExVat) {
        // Price is exclusive of VAT
        totalPriceExcVat += totalAmount;
        vatAmount = (totalAmount * vatRate) / 100;
        totalPriceIncVat += totalAmount + vatAmount;
      } else {
        // Price is inclusive of VAT
        const exclusivePrice = totalAmount / (1 + vatRate / 100);
        vatAmount = totalAmount - exclusivePrice;
        totalPriceExcVat += exclusivePrice;
        totalPriceIncVat += totalAmount;
      }

      // Track VAT totals for each VAT rate, including 0%
      if (!vatTotals[vatLabel]) {
        vatTotals[vatLabel] = {
          title: vatLabel,
          totalVat: 0.0,
        };
      }
      vatTotals[vatLabel].totalVat += vatAmount;
    });

    return {
      vatTotals: Object.values(vatTotals),
      totalPriceExcVat,
      totalPriceIncVat,
    };
  };

  const auth = useAuth();

  const { vatTotals, totalPriceExcVat, totalPriceIncVat } =
    calculateVatTotals();

  useEffect(() => {
    calculateVatTotals();
  }, [formik.values.products]);
  useEffect(() => {
    formik.validateForm();
  }, [
    totalPriceIncVat,
    totalPriceExcVat,
    formik.values.header.totalValidationAmount,
    formik.values.header.validateTotalAmountWithoutVat,
  ]); // Dependencies to trigger recalculation

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
        if (editModalId != 0 && !hasMutation) {
          res = await getCostById(editModalId);
        } else if (editModalId != 0 && hasMutation) {
          res = await getCostForMutation(editModalId);
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
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [editModalId, refresh]);

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
            <CostAddModalHeader
              setAddModalOpen={setAddModalOpen}
              formik={formik}
              editModalId={editModalId}
              hasMutation={hasMutation}
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
            {hasMutation && (
              <div className="p-10">
                <div className="separator mb-10"></div>
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
                      id: "Fields.SaveBookingAsAutomationTemplateRuleInfo",
                    })}
                  </div>
                </div>

                <div className="form-check form-switch mt-10 d-flex align-items-center">
                  <input
                    className="form-check-input h-30px w-55px cursor-pointer"
                    type="checkbox"
                    id="saveAsRuleSwitch"
                    checked={saveAsRule}
                    onChange={(e) => setSaveAsRule(!saveAsRule)}
                  />
                  <label
                    className="form-check-label ms-5 text-muted"
                    htmlFor="saveAsRuleSwitch"
                  >
                    {intl.formatMessage({
                      id: "Fields.SaveBookingAsAutomationTemplateRule",
                    })}
                  </label>
                </div>
              </div>
            )}
            <CostAddModalFooter
              formik={formik}
              setAddModalOpen={setAddModalOpen}
              isSubmitting={isSubmitting}
              setAction={setAction}
              attachmentsModalOpen={attachmentsModalOpen}
              setAttachmentsModalOpen={setAttachmentsModalOpen}
              hasMutation={hasMutation}
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
