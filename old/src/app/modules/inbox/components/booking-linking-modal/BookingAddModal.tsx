import { useEffect, useState } from "react";
import { BookingAddModalHeader } from "./BookingAddModalHeader";
import { BookingAddModalFooter } from "./BookingAddModalFooter";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useIntl } from "react-intl";
import {
  getTradeNames,
  postBookingItem,
} from "../../../accounting/bookings/components/core/_requests";
import { BookingAddStep1 } from "./BookingAddStep1";
import { BookingAddStep2 } from "./BookingAddStep2";
import Select from "react-select";
import { KTSVG } from "../../../../../_metronic/helpers";
import { ListLoading } from "../../../generic/ListLoading";
import {
  getLedgerAccountsForFilter,
  getVatTypesForLedger,
} from "../../../admin-settings/ledgeraccounts-list/core/_requests";
import { CustomTabManager } from "../../../generic/Tabs/CustomTabManager";
import { AttachmentListing } from "../../../generic/FileManager/AttachmentListing";
import { AttachmentsModal } from "../../../generic/FileManager/AttachmentsModal";
import { handleToast } from "../../../auth/core/_toast";
import { ViewCanvas } from "../../../generic/ViewCanvas";

interface Props {
  setRefresh: (type: boolean) => void;
  setAttatchCostModalOpen: (type: boolean) => void;
  inboxDetail: any;
  refresh: boolean;
  setLinkingModalOpen: (type: boolean) => void;
}

const BookingAddModal = ({
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
  const [action, setAction] = useState<number>();
  const formik = useFormik({
    initialValues: {
      id: 0,
      isBookingEditable: true,
      attachmentsTempId: "",
      title: "",
      voucherNumber: "",
      comments: "",
      header: {
        prospect: {
          clientName: "",
          kvKNr: "",
          vatNr: "",
          ibanNr: "",
        },
        bookingDate: "",
        clientId: 0,
        companyTradeNameId: 0,
        totalValidationAmount: 0,
        relatedActivaInvoiceId: 0,
        clientDisplayName: "",
      },
      bookingItems: [
        {
          id: 1,
          orderIndex: 1,
          description: "",
          amount: 0,
          balanceType: 1,
          ledgerAccountId: 0,
          vatTypeId: 0,
          isDebet: false,
          isOriginalFirstLinkedFromMutation: true,
          actions: {
            disableDelete: true,
            disableAmountEdit: true,
            disableBalanceTypeEdit: true,
            disableLedgerAccountEdit: true,
            disableVatTypeEdit: true,
          },
        },
        {
          id: 2,
          orderIndex: 2,
          description: "",
          amount: 0,
          isDebet: true,
          balanceType: 2,
          ledgerAccountId: 0,
          vatTypeId: 0,
          isOriginalFirstLinkedFromMutation: true,
          actions: {
            disableDelete: true,
            disableAmountEdit: true,
            disableBalanceTypeEdit: true,
            disableLedgerAccountEdit: true,
            disableVatTypeEdit: true,
          },
        },
      ],
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
            sendWithEmail: true,
          },
        ],
      },

      actions: {
        canEdit: true,
        canDelete: true,
        canAddAttachments: true,
      },
      viewTabs: {
        showActionHistory: true,
        showBookingMutations: true,
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
      bookingItems: Yup.array()
        .min(1, "At least one booking item is required.")
        .test("is-balanced", function (bookingItems) {
          if (!bookingItems || bookingItems.length === 0) return true;

          const totalDebet = bookingItems
            .filter((item) => item.isDebet)
            .reduce((sum, item) => sum + item.amount, 0);

          const totalCredit = bookingItems
            .filter((item) => !item.isDebet)
            .reduce((sum, item) => sum + item.amount, 0);

          const difference = totalDebet - totalCredit;

          if (difference !== 0) {
            return this.createError({
              message: intl
                .formatMessage({ id: "System.Booking_UnbalancedLineEntries" })
                .replace("{0}", `${difference.toFixed(2)}`),
            });
          }

          return true;
        }),
    }),

    validateOnChange: true,
    onSubmit: async (values) => {
      handleSubmit();
    },
  });
  useEffect(() => {
    if (formik.values.attachments?.attachments?.length > 0) {
      formik.setFieldValue("hasAttachments", true);
    }
  }, [formik.values.attachments?.attachments?.length]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
  const [ledgers, setLedgers] = useState<any[]>([]);
  const [vatTypes, setVatTypes] = useState<any>([]);
  const [companyTradeNames, setCompanyTradeNames] = useState<any>([]);
  const [extraOptionsModal, setExtraOptionsModal] = useState<boolean>(false);
  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const response = await postBookingItem(formik.values);

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
  const tabs = [
    {
      id: "tab1",
      label: intl.formatMessage({ id: "Fields.Client" }),
      icon: "fa-regular fa-address-book fs-3 hippo-tab-icon",
    },
    {
      id: "tab2",
      label: intl.formatMessage({ id: "Fields.BookingItemsRegionTitle" }),
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
            })),
          },
          {
            label: response.result.balancePassivaItemsGroupTitle,
            options: response.result.balancePassivaItems.map((item: any) => ({
              value: item.id,
              label: item.title,
            })),
          },
          {
            label: response.result.resultItemsGroupTitle,
            options: response.result.resultItems.map((item: any) => ({
              value: item.id,
              label: item.title,
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
        // }
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
            <BookingAddModalHeader
              setAttatchCostModalOpen={setAttatchCostModalOpen}
              formik={formik}
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
                <BookingAddStep1
                  formik={formik}
                  setRefresh={setRefresh}
                  refresh={refresh}
                />
              )}
              {activeTab.id === "tab2" && (
                <BookingAddStep2
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
              isBgGray={true}
              setKey={setKey}
            />
            <BookingAddModalFooter
              isSubmitting={isSubmitting}
              setAction={setAction}
              setAttachmentsModalOpen={setAttachmentsModalOpen}
              setLinkingModalOpen={setLinkingModalOpen}
              handleSubmit={handleSubmit}
              setAttatchCostModalOpen={setAttatchCostModalOpen}
              showLinking={true}
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

export { BookingAddModal };
