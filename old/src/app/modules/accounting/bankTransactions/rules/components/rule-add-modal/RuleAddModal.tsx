import { useCallback, useEffect, useMemo, useState } from "react";
import { RuleAddModalHeader } from "./RuleAddModalHeader";
import { RuleAddModalFooter } from "./RuleAddModalFooter";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useIntl } from "react-intl";
import enums from "../../../../../../../_metronic/i18n/messages/invoicehippo.enums.json";
// import {
//   getBookingById,
//   getDefaultEmpty,
//   getTradeNames,
//   postBookingForMutation,
//   postBookingItem,
// } from "../core/_requests";
import { handleToast } from "../../../../../auth/core/_toast";
import { RuleAddStep1 } from "./RuleAddStep1";
import { RuleAddStep2 } from "./RuleAddStep2";
import Select from "react-select";
import { KTSVG } from "../../../../../../../_metronic/helpers";
// import { ListLoading } from "../../../../components/ListLoading";
// import {
//   getLedgerAccountsForFilter,
//   getVatTypesForLedger,
// } from "../../../../../../../../admin-settings/ledgeraccounts-list/core/_requests";
import { CustomTabManager } from "../../../../../generic/Tabs/CustomTabManager";
import { AttachmentListing } from "../../../../../generic/FileManager/AttachmentListing";
import { AttachmentsModal } from "../../../../../generic/FileManager/AttachmentsModal";
import { ViewCanvas } from "../../../../../generic/ViewCanvas";
import { getBookingForMutation } from "../../../overview/components/core/_requests";
import { ListLoading } from "../../../../../generic/ListLoading";
import { getRuleById, postBookingRule } from "../core/_requests";
import { AccountsResult, CounterPartyAccounts } from "../core/_models";
import {
  getLedgerAccountsForFilter,
  getVatTypesForLedger,
} from "../../../../../admin-settings/ledgeraccounts-list/core/_requests";
interface Props {
  setRefresh: (type: boolean) => void;
  refresh: boolean;
  setAddModalOpen: (type: boolean) => void;
  editModalId: number;
  setEditModalId: (type: number) => void;
  hasMutation: boolean;
  financialAccounts: AccountsResult[];
  counterPartyAccounts: CounterPartyAccounts[];
}

const RuleAddModal = ({
  setRefresh,
  setAddModalOpen,
  refresh,
  setEditModalId,
  editModalId,
  hasMutation,
  financialAccounts,
  counterPartyAccounts,
}: Props) => {
  useEffect(() => {
    document.body.classList.add("modal-open");
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, []);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const intl = useIntl();
  const [saveAsRule, setSaveAsRule] = useState<boolean>(false);

  const formik = useFormik({
    initialValues: {
      id: 0,
      title: "",
      balanceType: 0,
      isActive: true,
      associatedAccounts: [
        {
          id: 0,
          accountNumber: "",
          accountName: "",
        },
      ],
      associatedAccountHolders: [
        {
          id: 0,
          accountNumber: "",
          accountName: "",
        },
      ],
      clientId: 0,
      filterTerm1: "",
      filterTerm2: "",
      clientCompanyName: "",
      filterByAmountType: 0,
      filterByTextType1: 0,
      filterByTextType2: 0,
      filterByAmountTypeAsInt32: 0,
      filterAmount: 0,
      bookingRouteType: 0,
      bookingRouteTypeAsInt32: 0,
      ledgerAccountId: 0,
      btwTypeId: 0,
      bookingDescription: "",
      splitDeviation: {
        splitType: 0,
        splitAmount: 0,
        ledgerAccountId: 0,
        vatTypeId: 0,
      },
      hasSplitting: false,
    },
    // validationSchema: Yup.object().shape({
    //   title: Yup.string()
    //     .required(
    //       intl
    //         .formatMessage({ id: "Common.RequiredFieldHint2" })
    //         .replace(
    //           "{0}",
    //           intl.formatMessage({ id: "Fields.BookingDescription" })
    //         )
    //     )
    //     .min(
    //       2,
    //       intl
    //         .formatMessage({ id: "Common.ValidationMin" })
    //         .replace(
    //           "{0}",
    //           intl.formatMessage({ id: "Fields.BookingDescription" })
    //         )
    //         .replace("{1}", `2`)
    //     )
    //     .max(
    //       100,
    //       intl
    //         .formatMessage({ id: "Common.ValidationMax" })
    //         .replace(
    //           "{0}",
    //           intl.formatMessage({ id: "Fields.BookingDescription" })
    //         )
    //         .replace("{1}", `100`)
    //     ),

    //   header: Yup.object().shape({
    //     totalValidationAmount: Yup.number()
    //       .required("Control amount is required.")
    //       .moreThan(0, "Control amount should be greater than 0"),
    //   }),

    //   bookingItems: Yup.array()
    //     .min(1, "At least one booking item is required.")
    //     .test(
    //       "debet-credit-present",
    //       "At least one debet and one credit entry required.",
    //       (items) => {
    //         if (!items || items.length === 0) return true;
    //         const hasDebet = items.some((item) => item.isDebet);
    //         const hasCredit = items.some((item) => !item.isDebet);
    //         return hasDebet && hasCredit;
    //       }
    //     )
    //     .test("balanced-entries", function (items) {
    //       if (!items || items.length === 0) return true;

    //       const totalDebet = items
    //         .filter((item) => item.isDebet)
    //         .reduce((sum, item) => sum + Number(item.amount || 0), 0);

    //       const totalCredit = items
    //         .filter((item) => !item.isDebet)
    //         .reduce((sum, item) => sum + Number(item.amount || 0), 0);

    //       const difference = Math.abs(totalDebet - totalCredit);

    //       if (difference !== 0) {
    //         return this.createError({
    //           message: intl
    //             .formatMessage({ id: "System.Booking_UnbalancedLineEntries" })
    //             .replace("{0}", `${difference.toFixed(2)}`),
    //         });
    //       }

    //       return true;
    //     })
    //     .test("control-amount-match", function (items) {
    //       const totalValidationAmount =
    //         this?.parent?.header?.totalValidationAmount;
    //       if (!items || items.length === 0 || !totalValidationAmount)
    //         return true;

    //       const totalDebet = items
    //         .filter((item) => item.isDebet)
    //         .reduce((sum, item) => sum + Number(item.amount || 0), 0);

    //       const totalCredit = items
    //         .filter((item) => !item.isDebet)
    //         .reduce((sum, item) => sum + Number(item.amount || 0), 0);

    //       if (
    //         totalCredit !== totalValidationAmount &&
    //         totalDebet !== totalValidationAmount
    //       ) {
    //         return this.createError({
    //           message: intl.formatMessage({
    //             id: "Fields.BookingEntiresDontMatchValidationAmount",
    //           }),
    //         });
    //       }

    //       return true;
    //     }),
    // }),

    // validateOnChange: true,
    // validateOnBlur: true,
    onSubmit: async (values) => {
      setIsSubmitting(true);

      try {
        const response = await postBookingRule(values);

        if (response.isValid) {
          setAddModalOpen(false);
        }
        handleToast(response);
        setRefresh(!refresh);
      } catch (error) {
        console.error("Post failed:", error);
      } finally {
        setIsSubmitting(false);
        localStorage.removeItem("ModalData");
      }
    },
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        let res;
        if (editModalId != 0 && !hasMutation) {
          res = await getRuleById(editModalId);
        } else if (editModalId != 0 && hasMutation) {
          res = await getBookingForMutation(editModalId);
        } else return;

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
  const [allVatTypes, setAllVatTypes] = useState<any>(null);
  // const [vatTypes, setVatTypes] = useState<any>([]);

  const [ledgers, setLedgers] = useState<any>([]);

  const [selectedBearingTypeOption, setSelectedBearingTypeOption] =
    useState<any>();
  useEffect(() => {
    const fetchLedgers = async () => {
      const response = await getLedgerAccountsForFilter();

      if (response.isValid) {
        // helper to group by ledgerSubType
        const groupByLedgerSubType = (items: any[], groupTitle: string) => {
          const groups: Record<number, { label: string; options: any[] }> = {};

          items.forEach((item) => {
            const subType = item.ledgerSubType;
            if (!groups[subType.value]) {
              groups[subType.value] = {
                label: `${groupTitle} - ${subType.description}`,
                options: [],
              };
            }
            groups[subType.value].options.push({
              value: item.id,
              label: item.title,
              bearingValue: item.bearingType.value,
            });
          });

          return Object.values(groups);
        };

        const groupedOptions = [
          ...groupByLedgerSubType(
            response.result.balanceActivaItems,
            response.result.balanceActivaItemsGroupTitle
          ),
          ...groupByLedgerSubType(
            response.result.balancePassivaItems,
            response.result.balancePassivaItemsGroupTitle
          ),
          ...groupByLedgerSubType(
            response.result.resultItems,
            response.result.resultItemsGroupTitle
          ),
        ];
        setSelectedBearingTypeOption(
          groupedOptions
            .flatMap((group: any) => group.options)
            .find(
              (option: any) => option.value === formik.values.ledgerAccountId
            )
        );
        setLedgers(groupedOptions);
      }
    };
    if (ledgers?.length === 0) {
      fetchLedgers();
    }
  }, []);
  // useEffect(() => {
  //   const fetchVatTypes = async () => {
  //     try {
  //       const response = await getVatTypesForLedger();
  //       let options = [];
  //       console.log(
  //         enums.BearingTypes.find(
  //           (option) =>
  //             ledgers
  //               .flatMap((group: any) => group.options)
  //               .find(
  //                 (option: any) =>
  //                   option.value === formik.values.ledgerAccountId
  //               ).bearingValue
  //         )
  //       );
  //       if (
  //         enums.BearingTypes.find(
  //           (option) =>
  //             option.Value ===
  //             ledgers
  //               .flatMap((group: any) => group.options)
  //               .find(
  //                 (option: any) =>
  //                   option.value === formik.values.ledgerAccountId
  //               ).bearingValue
  //         )?.IsAccountTypeOmzet
  //       ) {
  //         options = [
  //           {
  //             label: response.result.listForSalesGroupTitle,
  //             options: response.result.listForSales.map((item) => ({
  //               value: item.id,
  //               label: item.title,
  //             })),
  //           },
  //         ];
  //       } else if (
  //         enums.BearingTypes.find(
  //           (option) =>
  //             option.Value ===
  //             ledgers
  //               .flatMap((group: any) => group.options)
  //               .find(
  //                 (option: any) =>
  //                   option.value === formik.values.ledgerAccountId
  //               ).bearingValue
  //         )?.IsAccountTypeCost
  //       ) {
  //         options = [
  //           {
  //             label: response.result.listForCostsGroupTitle,
  //             options: response.result.listForCosts.map((item) => ({
  //               value: item.id,
  //               label: item.title,
  //             })),
  //           },
  //         ];
  //       } else {
  //         options = [
  //           {
  //             label: response.result.listForSalesGroupTitle,
  //             options: response.result.listForSales.map((item) => ({
  //               value: item.id,
  //               label: item.title,
  //             })),
  //           },
  //           {
  //             label: response.result.listForCostsGroupTitle,
  //             options: response.result.listForCosts.map((item) => ({
  //               value: item.id,
  //               label: item.title,
  //             })),
  //           },
  //         ];
  //       }

  //       setVatTypes(options);
  //     } catch (error) {
  //       console.error("Error fetching ledger accounts:", error);
  //     }
  //   };
  //   fetchVatTypes();
  // }, [formik.values.ledgerAccountId]);
  // const [allVatTypes, setAllVatTypes] = useState<any>(null);

  // Fetch only once
  useEffect(() => {
    const fetchVatTypes = async () => {
      try {
        const response = await getVatTypesForLedger();
        setAllVatTypes(response.result);
      } catch (error) {
        console.error("Error fetching vat types:", error);
      }
    };
    fetchVatTypes();
  }, []);

  // Helper function
  const getVatTypesForLedgerAccount = useCallback(
    (ledgerAccountId: number | null) => {
      if (!allVatTypes || !ledgerAccountId) return [];

      const selectedLedger = ledgers
        .flatMap((group: any) => group.options)
        .find((option: any) => option.value === ledgerAccountId);

      if (!selectedLedger) return [];

      const bearingType = enums.BearingTypes.find(
        (option) => option.Value === selectedLedger.bearingValue
      );

      if (bearingType?.IsAccountTypeOmzet) {
        return [
          {
            label: allVatTypes.listForSalesGroupTitle,
            options: allVatTypes.listForSales.map((item: any) => ({
              value: item.id,
              label: item.title,
            })),
          },
        ];
      } else if (bearingType?.IsAccountTypeCost) {
        return [
          {
            label: allVatTypes.listForCostsGroupTitle,
            options: allVatTypes.listForCosts.map((item: any) => ({
              value: item.id,
              label: item.title,
            })),
          },
        ];
      } else {
        return [
          {
            label: allVatTypes.listForSalesGroupTitle,
            options: allVatTypes.listForSales.map((item: any) => ({
              value: item.id,
              label: item.title,
            })),
          },
          {
            label: allVatTypes.listForCostsGroupTitle,
            options: allVatTypes.listForCosts.map((item: any) => ({
              value: item.id,
              label: item.title,
            })),
          },
        ];
      }
    },
    [allVatTypes, ledgers]
  );

  // Use in main ledger
  const vatTypes = useMemo(() => {
    const ledgerId = formik.values.ledgerAccountId;
    return ledgerId ? getVatTypesForLedgerAccount(ledgerId) : [];
  }, [formik.values.ledgerAccountId, getVatTypesForLedgerAccount]);

  // Use in splitting ledger
  const splitVatTypes = useMemo(() => {
    const ledgerId = formik.values.splitDeviation?.ledgerAccountId;
    return ledgerId ? getVatTypesForLedgerAccount(ledgerId) : [];
  }, [
    formik.values.splitDeviation?.ledgerAccountId,
    getVatTypesForLedgerAccount,
  ]);

  const tabs = [
    {
      id: "tab1",
      label: intl.formatMessage({
        id: "Fields.BookingRuleModalTabRecognitionRule",
      }),
      icon: "la la-list fs-3 hippo-tab-icon",
    },
    {
      id: "tab2",
      label: intl.formatMessage({
        id: "Fields.BookingRuleModalTabProcessingRule",
      }),
      icon: "la la-cloud-upload fs-3 hippo-tab-icon",
    },
  ];

  const [activeTab, setActiveTab] = useState(tabs[0]);

  const handleTabClick = (tab: any) => {
    setActiveTab(tab);
  };

  const [attachmentsModalOpen, setAttachmentsModalOpen] =
    useState<boolean>(false);

  return (
    <>
      <div
        className="modal fade show d-block"
        role="dialog"
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
            <RuleAddModalHeader
              setAddModalOpen={setAddModalOpen}
              formik={formik}
              editModalId={editModalId}
              hasMutation={hasMutation}
            />
            <CustomTabManager
              tabs={tabs}
              activeTab={activeTab}
              onTabClick={handleTabClick}
              hasOptions={false}
              hasSubscriptions={false}
            />
            <div className="row d-flex align-items-center p-10">
              <div className="fv-row col-10">
                <input
                  className="form-control form-control-solid"
                  readOnly
                  value={formik.values.title || "nieuw"}
                />
              </div>
              <div className="fv-row col-2">
                <div className="form-check form-switch form-check-custom form-check-success form-check-solid mt-1 ms-2 d-flex align-items-center">
                  <input
                    className="form-check-input h-25px w-45px me-2 cursor-pointer"
                    type="checkbox"
                    id="isActiveSwitch"
                    checked={formik.values.isActive}
                    onChange={(e) => {
                      formik.setFieldValue("isActive", !formik.values.isActive);
                    }}
                  />
                  <label
                    className="form-check-label fs-sm"
                    htmlFor="isActiveSwitch"
                  >
                    <span
                      dangerouslySetInnerHTML={{
                        __html: intl.formatMessage({
                          id: "Fields.ToolTipActive",
                        }),
                      }}
                    />
                  </label>
                </div>
              </div>
            </div>
            <div className="separator px-10"></div>
            <div className="hippo-tab-content">
              {activeTab.id === "tab1" && (
                <RuleAddStep1
                  formik={formik}
                  financialAccounts={financialAccounts}
                  counterPartyAccounts={counterPartyAccounts}
                />
              )}
              {activeTab.id === "tab2" && (
                <RuleAddStep2
                  formik={formik}
                  vatTypes={vatTypes}
                  splitVatTypes={splitVatTypes}
                  ledgers={ledgers}
                  setSelectedBearingTypeOption={setSelectedBearingTypeOption}
                />
              )}
            </div>

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
            <RuleAddModalFooter
              formik={formik}
              setAddModalOpen={setAddModalOpen}
              isSubmitting={isSubmitting}
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

export { RuleAddModal };
