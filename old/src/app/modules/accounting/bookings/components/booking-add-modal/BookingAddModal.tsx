import { useEffect, useState } from "react";
import { BookingAddModalHeader } from "./BookingAddModalHeader";
import { BookingAddModalFooter } from "./BookingAddModalFooter";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useIntl } from "react-intl";
import {
  getBookingById,
  getDefaultEmpty,
  getTradeNames,
  postBookingForMutation,
  postBookingItem,
} from "../core/_requests";
import { handleToast } from "../../../../auth/core/_toast";
import { BookingAddStep1 } from "./BookingAddStep1";
import { BookingAddStep2 } from "./BookingAddStep2";
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
import { ViewCanvas } from "../../../../generic/ViewCanvas";
import { getBookingForMutation } from "../../../bankTransactions/overview/components/core/_requests";
interface Props {
  setRefresh: (type: boolean) => void;
  refresh: boolean;
  setAddModalOpen: (type: boolean) => void;
  editModalId: number;
  setEditModalId: (type: number) => void;
  hasMutation: boolean;
}

const BookingAddModal = ({
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
  const [action, setAction] = useState<number>();
  const [saveAsRule, setSaveAsRule] = useState<boolean>(false);
  const [isAutoBooking, setIsAutoBooking] = useState<boolean>(false);

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
          id: 0,
          orderIndex: 0,
          description: "",
          amount: 0,
          balanceType: 0,
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
          id: 0,
          orderIndex: 0,
          description: "",
          amount: 0,
          isDebet: true,
          balanceType: 0,
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
            sendWithEmail: false,
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
          2,
          intl
            .formatMessage({ id: "Common.ValidationMin" })
            .replace(
              "{0}",
              intl.formatMessage({ id: "Fields.BookingDescription" })
            )
            .replace("{1}", `2`)
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

      header: Yup.object().shape({
        totalValidationAmount: Yup.number()
          .required("Control amount is required.")
          .moreThan(0, "Control amount should be greater than 0"),
      }),

      bookingItems: Yup.array()
        .min(1, "At least one booking item is required.")
        .test(
          "debet-credit-present",
          "At least one debet and one credit entry required.",
          (items) => {
            if (!items || items.length === 0) return true;
            const hasDebet = items.some((item) => item.isDebet);
            const hasCredit = items.some((item) => !item.isDebet);
            return hasDebet && hasCredit;
          }
        )
        .test("balanced-entries", function (items) {
          if (!items || items.length === 0) return true;

          const totalDebet = items
            .filter((item) => item.isDebet)
            .reduce((sum, item) => sum + Number(item.amount || 0), 0);

          const totalCredit = items
            .filter((item) => !item.isDebet)
            .reduce((sum, item) => sum + Number(item.amount || 0), 0);

          const difference = Math.abs(totalDebet - totalCredit);

          if (difference !== 0) {
            return this.createError({
              message: intl
                .formatMessage({ id: "System.Booking_UnbalancedLineEntries" })
                .replace("{0}", `${difference.toFixed(2)}`),
            });
          }

          return true;
        })
        .test("control-amount-match", function (items) {
          const totalValidationAmount =
            this?.parent?.header?.totalValidationAmount;
          if (!items || items.length === 0 || !totalValidationAmount)
            return true;

          const totalDebet = items
            .filter((item) => item.isDebet)
            .reduce((sum, item) => sum + Number(item.amount || 0), 0);

          const totalCredit = items
            .filter((item) => !item.isDebet)
            .reduce((sum, item) => sum + Number(item.amount || 0), 0);

          if (
            totalCredit !== totalValidationAmount &&
            totalDebet !== totalValidationAmount
          ) {
            return this.createError({
              message: intl.formatMessage({
                id: "Fields.BookingEntiresDontMatchValidationAmount",
              }),
            });
          }

          return true;
        }),
    }),

    validateOnChange: false,
    validateOnBlur: false,
    onSubmit: async (values) => {
      setIsSubmitting(true);

      try {
        let response;
        if (hasMutation) {
          response = await postBookingForMutation(
            editModalId,
            saveAsRule,
            isAutoBooking,
            values
          );
        } else {
          response = await postBookingItem(values);
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
          res = await getBookingById(editModalId);
        } else if (editModalId != 0 && hasMutation) {
          res = await getBookingForMutation(editModalId);
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
  const [vatTypes, setVatTypes] = useState<any>([]);
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
  useEffect(() => {
    formik.validateForm();
  }, [formik.values.header.totalValidationAmount, formik.values.bookingItems]); // Dependencies to trigger recalculation
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
              setKey={setKey}
              isBgGray={true}
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
                    id="saveRuleSwitch"
                    checked={saveAsRule}
                    onChange={(e) => setSaveAsRule(!saveAsRule)}
                  />
                  <label
                    className="form-check-label ms-5 text-muted"
                    htmlFor="saveRuleSwitch"
                  >
                    {intl.formatMessage({
                      id: "Fields.SaveBookingAsAutomationTemplateRule",
                    })}
                  </label>
                </div>
              </div>
            )}
            <BookingAddModalFooter
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

export { BookingAddModal };
