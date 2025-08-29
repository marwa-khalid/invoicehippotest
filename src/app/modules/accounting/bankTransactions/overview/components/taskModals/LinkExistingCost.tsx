import { useIntl } from "react-intl";
import { KTIcon } from "../../../../../../../_metronic/helpers";
import { FC, useEffect, useState } from "react";
import { ListLoading } from "../../../../../generic/ListLoading";
import { useAuth } from "../../../../../auth";
import { InvoiceAddButtons } from "../../../../../generic/InvoiceAddButtons";
import { CostListResult } from "../../../../costs/components/core/_models";
import { getTransferOptionsCost, registerPaymentCost } from "../core/_requests";
import { useFormik } from "formik";
import Select from "react-select";
import { handleToast } from "../../../../../auth/core/_toast";
import { AccountsResult } from "../core/_models";
import { getLedgerAccountsForFilter } from "../../../../../admin-settings/ledgeraccounts-list/core/_requests";
interface Props {
  handleClose: any;
  costData: CostListResult | null;
  setShowCosts: (type: boolean) => void;
  setCostData: (type: CostListResult | null) => void;
  mutationId: number;
  financialAccounts: AccountsResult[];
}

const LinkExistingCost: FC<Props> = ({
  handleClose,
  costData,
  setShowCosts,
  setCostData,
  mutationId,
  financialAccounts,
}) => {
  const intl = useIntl();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const accounts = financialAccounts.map((account) => {
    return { value: account.id, label: account.title };
  });

  const [transferOptions, setTransferOptions] = useState<any>({});
  const fetchData = async () => {
    try {
      setIsLoading(true);
      if (costData) {
        const res = await getTransferOptionsCost(costData.id, mutationId);
        if (res.isValid) {
          setTransferOptions(res.result);
          formik.setFieldValue("dateOfPayment", res.result?.bankMutationDate);
          // const account = accounts.find(
          //   (option) => res.result.accountInfo.name === option.label
          // );
          formik.setFieldValue("accountId", mutationId);
          // if (res.result?.replaceablePaymentOptions) {
          //   formik.setFieldValue(
          //     "existingPaymentId",
          //     res.result.replaceablePaymentOptions.paymentId
          //   );
          // }
        }
      }
    } finally {
      setIsLoading(false);
    }
  };
  const reset = () => {
    setCostData(null);
  };
  useEffect(() => {
    fetchData();
  }, []);
  const [isExpanded, setIsExpanded] = useState<boolean>();
  const drawerData = JSON.parse(localStorage.getItem("DrawerData")!);
  const { currentUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const formik = useFormik({
    initialValues: {
      invoiceId: costData?.id,
      amount: drawerData?.amount,
      accountId: null,
      isFullPayment: false,
      dateOfPayment: "",
      sourceType: 3,
      residualAmountActionType: null,
      residualAmountBookingLedgerAccountId: null,
      replaceExitingPayment: true,
      existingPaymentId: null,
      isAutoBooking: false,
    },
    // validationSchema: {},
    // validateOnChange: true,
    // validateOnBlur: true,
    onSubmit: async (values) => {
      setIsSubmitting(true);

      try {
        const response = await registerPaymentCost(values);
        if (response.isValid) {
          handleClose();
        }
        handleToast(response);
      } catch (error) {
        console.error("Post failed:", error);
      } finally {
        setIsSubmitting(false);
      }
    },
  });
  const [ledgers, setLedgers] = useState<any[]>([]);
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

  return (
    <>
      <div
        className="modal fade show d-block"
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-dialog mw-800px">
          <div className="modal-content">
            <div className="modal-header bg-primary d-flex flex-column position-relative">
              {/* Title Row */}
              <div className="d-flex justify-content-between align-items-center w-100 mb-2 mt-5">
                <h2 className="fw-bolder mb-0 text-white">
                  {intl.formatMessage({
                    id: "Fields.ModalBankMutationAsCostExisting",
                  })}
                </h2>
                <div
                  className="btn btn-icon btn-sm btn-active-icon-primary"
                  onClick={() => handleClose()}
                  style={{ cursor: "pointer" }}
                >
                  <KTIcon iconName="cross" className="fs-1 text-white" />
                </div>
              </div>
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
                  {!drawerData?.isDebet && "-"}
                  {currentUser?.result.activeCompanyDefaults.defaultValuta.sign}
                  {drawerData?.amount.toFixed(2)}
                  <span className="ribbon-inner bg-dark"></span>
                </div>
              </div>
              {/* </Tippy> */}
              {transferOptions?.accountInfo && (
                <div
                  className="ribbon ribbon-start ribbon-clip position-absolute"
                  style={{
                    left: "0px",
                    top: "10px", // Keep it centered
                    whiteSpace: "nowrap",
                    height: "30px",
                    width: "100px",
                  }}
                >
                  <div className="ribbon-label fw-bold">
                    <span className="ribbon-inner bg-dark" />
                    {transferOptions?.accountInfo?.name}
                  </div>
                </div>
              )}

              {/* Calendar, Date, Reference and Toggle */}
              <div className="d-flex justify-content-between align-items-start w-100 text-white mt-2">
                {/* Left side: Calendar + Date + Description */}
                <div className="d-flex flex-column">
                  <div className="d-flex align-items-center gap-2">
                    <i className="ki-duotone ki-calendar-2 fs-3x text-white">
                      <span className="path1"></span>
                      <span className="path2"></span>
                      <span className="path3"></span>
                      <span className="path4"></span>
                      <span className="path5"></span>
                    </i>
                    <span className="d-flex flex-column fw-bold">
                      {drawerData?.transactionDate || "-"}
                      <small className="mt-1">
                        {drawerData?.reference || "-"}
                      </small>
                    </span>
                  </div>
                </div>

                {/* Right side: Toggle button */}
                <div
                  className="cursor-pointer"
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  {isExpanded ? (
                    <i className="ki-duotone ki-double-up fs-1 text-white me-1">
                      <span className="path1"></span>
                      <span className="path2"></span>
                      <span className="path3"></span>
                    </i>
                  ) : (
                    <i className="ki-duotone ki-double-down fs-1 text-white me-1">
                      <span className="path1"></span>
                      <span className="path2"></span>
                      <span className="path3"></span>
                    </i>
                  )}
                </div>
              </div>

              {/* Conditionally show the table below */}
              {isExpanded && (
                <div className="w-100 text-white mt-3">
                  <table className="table mt-0" style={{ lineHeight: "0.5" }}>
                    <tbody>
                      <tr className="my-0">
                        <td className="fw-bold">
                          {intl.formatMessage({
                            id: "Fields.CounterPartyAccountHolderId",
                          })}
                        </td>
                        <td>: {drawerData?.counterAccount.number}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold"></td>
                        <td>: {drawerData?.counterAccount.name}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">
                          {intl.formatMessage({ id: "Fields.Amount" })}
                        </td>
                        <td>
                          :{" "}
                          {
                            currentUser?.result.activeCompanyDefaults
                              .defaultValuta.sign
                          }{" "}
                          {drawerData?.amount.toFixed(2)}
                        </td>
                      </tr>
                      <tr>
                        <td className="fw-bold">
                          {intl.formatMessage({
                            id: "Fields.ImportResourceFile",
                          })}
                        </td>
                        <td>: {drawerData?.document}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="modal-body">
              <div
                className="d-flex alert alert-custom alert-default bg-secondary align-items-center "
                role="alert"
              >
                <div className="alert-icon col-1 me-4">
                  <i className="ki-duotone ki-information-4 fs-3x text-center text-primary">
                    <span className="path1"></span>
                    <span className="path2"></span>
                    <span className="path3"></span>
                  </i>
                </div>
                <div className="alert-text col-10 d-flex flex-column">
                  <span
                    dangerouslySetInnerHTML={{
                      __html: intl.formatMessage({
                        id: "Fields.ModalBankMutationAttachToExistingInfo",
                      }),
                    }}
                  />
                </div>
              </div>
              <div className="col-7 mt-5">
                <h5 className="required">
                  {intl
                    .formatMessage({ id: "Fields.TabInvoice" })
                    .toLocaleLowerCase()}
                </h5>
                <InvoiceAddButtons
                  setInvoiceSearch={setShowCosts}
                  data={costData}
                  reset={reset}
                />
              </div>
              <div className="mt-5 col-7" style={{ lineHeight: "0.5" }}>
                <table className="table mt-0">
                  <tbody>
                    <tr className="my-0">
                      <td className="fw-bold">
                        {intl.formatMessage({ id: "Fields.InvoiceStatus" })}
                      </td>
                      <td>: {costData?.invoiceStatus.description}</td>
                    </tr>
                    <tr>
                      <td className="fw-bolder">
                        {intl.formatMessage({
                          id: "Fields.Date",
                        })}
                      </td>
                      <td>: {costData?.invoiceDateAsString}</td>
                    </tr>
                    {costData?.client && (
                      <tr>
                        <td className="fw-bold">
                          {intl.formatMessage({ id: "Fields.Client" })}
                        </td>
                        <td>: {costData?.client}</td>
                      </tr>
                    )}
                    <tr>
                      <td className="fw-bold">
                        {intl.formatMessage({ id: "Fields.Amount" })}
                      </td>
                      <td>
                        :{" "}
                        {
                          currentUser?.result.activeCompanyDefaults
                            .defaultValuta.sign
                        }{" "}
                        {costData?.totals.totalPriceWithVAT.toFixed(2)}
                      </td>
                    </tr>
                    <tr>
                      <td className="fw-bold"></td>
                      <td className="text-danger">
                        {transferOptions?.restAmountInfo?.message}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="separator mb-10"></div>

              {transferOptions?.replaceablePaymentOptions?.length > 0 && (
                <>
                  <div
                    className="d-flex alert alert-custom alert-default bg-info align-items-center "
                    role="alert"
                  >
                    <div className="alert-icon col-1 me-4">
                      <i className="ki-duotone ki-information-4 fs-3x text-center text-white">
                        <span className="path1"></span>
                        <span className="path2"></span>
                        <span className="path3"></span>
                      </i>
                    </div>
                    <div className="alert-text col-10 d-flex flex-column text-white">
                      <span
                        dangerouslySetInnerHTML={{
                          __html: intl.formatMessage({
                            id: "Fields.ReplaceablePaymentOptionsInfo",
                          }),
                        }}
                      />
                    </div>
                  </div>
                  <div className="separator my-10"></div>
                </>
              )}
              {transferOptions?.replaceablePaymentOptions?.map(
                (option: any) => {
                  <div className="form-check form-switch form-check-custom form-check-success form-check-solid mt-1 ms-2 d-flex align-items-center mb-7">
                    <input
                      className="form-check-input h-25px w-45px me-5 cursor-pointer"
                      type="checkbox"
                      id="fullOrPartialSwitch"
                      checked={
                        formik.values.existingPaymentId === option.paymentId
                      }
                      onChange={(e) => {
                        formik.setFieldValue(
                          "existingPaymentId",
                          option.paymentId
                        );
                      }}
                    />
                    <label
                      className="form-check-label fs-sm"
                      htmlFor="fullOrPartialSwitch"
                    >
                      <span
                        dangerouslySetInnerHTML={{
                          __html: intl
                            .formatMessage({
                              id: "Fields.ReplaceablePaymentOptionTransferInfo",
                            })
                            .replace(
                              "{0}",
                              `${
                                currentUser?.result.activeCompanyDefaults
                                  .defaultValuta.sign
                              } ${option.amount.toFixed(2)}`
                            )
                            .replace("{1}", `${option.dateOfPaymentAsString}`),
                        }}
                      />
                    </label>
                  </div>;
                }
              )}

              {formik.values.existingPaymentId !== null && (
                <div className="form-check form-switch form-check-custom form-check-success form-check-solid mt-1 ms-2 d-flex align-items-center mb-7">
                  <input
                    className="form-check-input h-25px w-45px me-5 cursor-pointer"
                    type="checkbox"
                    id="resetSwitch"
                    onChange={(e) => {
                      formik.setFieldValue("existingPaymentId", null);
                      formik.setFieldValue("residualAmountActionType", null);
                    }}
                  />
                  <label
                    className="form-check-label fs-sm"
                    htmlFor="resetSwitch"
                  >
                    {intl.formatMessage({ id: "Fields.ResetOption" })}
                  </label>
                </div>
              )}
              {transferOptions?.restAmountOptions
                ?.restAmountOptionsRequired && (
                <div
                  className="d-flex alert alert-custom alert-default bg-info align-items-center "
                  role="alert"
                >
                  <div className="alert-icon col-1 me-4">
                    <i className="ki-duotone ki-information-4 fs-3x text-center text-white">
                      <span className="path1"></span>
                      <span className="path2"></span>
                      <span className="path3"></span>
                    </i>
                  </div>
                  <div className="alert-text col-10 d-flex flex-column text-white">
                    <span
                      dangerouslySetInnerHTML={{
                        __html: intl.formatMessage({
                          id: "Fields.ModalBankMutationAttachToExistingOptionRestAmountInfo",
                        }),
                      }}
                    />
                  </div>
                </div>
              )}
              {transferOptions?.restAmountOptions
                ?.restAmountOptionsRequired && (
                <>
                  {transferOptions?.canBeBookedAsFullOrPartialPayment &&
                    !transferOptions?.restAmountOptions
                      ?.restAmountCanBeBookAsSplittedTransaction && (
                      <div className="form-check form-switch form-check-custom form-check-success form-check-solid mt-1 ms-2 d-flex align-items-center mb-7">
                        <input
                          className="form-check-input h-25px w-45px me-5 cursor-pointer"
                          type="checkbox"
                          id="fullOrPartialSwitch"
                          checked={
                            formik.values.residualAmountActionType === null
                          }
                          onChange={(e) => {
                            formik.setFieldValue(
                              "residualAmountActionType",
                              null
                            );
                          }}
                        />
                        <label
                          className="form-check-label fs-sm"
                          htmlFor="fullOrPartialSwitch"
                        >
                          <span
                            dangerouslySetInnerHTML={{
                              __html: intl
                                .formatMessage({
                                  id: "Fields.ModalBankMutationAttachToExistingOptionAsFullOrPartial",
                                })
                                .replace(
                                  "{0}",
                                  `${currentUser?.result.activeCompanyDefaults.defaultValuta.sign} ${transferOptions?.restAmountOptions?.restAmount}`
                                ),
                            }}
                          />
                        </label>
                      </div>
                    )}
                  {transferOptions?.restAmountOptions
                    ?.restAmountCanBeBookAsSplittedTransaction && (
                    <>
                      <div className="form-check form-switch form-check-custom form-check-success form-check-solid mt-1 ms-2 d-flex align-items-center">
                        <input
                          className="form-check-input h-25px w-45px me-5 cursor-pointer"
                          type="checkbox"
                          id="paymentDifferenceSwitch"
                          checked={formik.values.residualAmountActionType === 3}
                          onChange={(e) => {
                            formik.setFieldValue("residualAmountActionType", 3);
                          }}
                        />
                        <label
                          className="form-check-label fs-sm text-dark"
                          htmlFor="paymentDifferenceSwitch"
                        >
                          <span
                            dangerouslySetInnerHTML={{
                              __html: intl.formatMessage({
                                id: "Fields.ResidualPaymentAmountActionTypeSplitTransaction",
                              }),
                            }}
                          />
                        </label>
                      </div>

                      <small
                        className="ms-2 text-muted"
                        dangerouslySetInnerHTML={{
                          __html: intl
                            .formatMessage({
                              id: "Fields.ResidualPaymentAmountActionTypeSplitTransactionInfo",
                            })
                            .replace(
                              "{0}",
                              `${currentUser?.result.activeCompanyDefaults.defaultValuta.sign} ${transferOptions?.restAmountOptions?.restAmount}`
                            ),
                        }}
                      />
                    </>
                  )}

                  <div className="form-check form-switch form-check-custom form-check-success form-check-solid mt-7 ms-2 d-flex align-items-center mb-7">
                    <input
                      className="form-check-input h-25px w-45px me-5 cursor-pointer"
                      type="checkbox"
                      id="paymentDifferenceSwitch"
                      checked={formik.values.residualAmountActionType === 1}
                      onChange={(e) => {
                        formik.setFieldValue("residualAmountActionType", 1);
                      }}
                    />
                    <label
                      className="form-check-label fs-sm text-dark"
                      htmlFor="paymentDifferenceSwitch"
                    >
                      <span
                        dangerouslySetInnerHTML={{
                          __html: intl
                            .formatMessage({
                              id: "Fields.ResidualPaymentAmountActionTypeBookOnDefaultPaymentDifferences",
                            })
                            .replace(
                              "{0}",
                              `${currentUser?.result.activeCompanyDefaults.defaultValuta.sign} ${transferOptions?.restAmountOptions?.restAmount}`
                            ),
                        }}
                      />
                    </label>
                  </div>
                  <div className="form-check form-switch form-check-custom form-check-success form-check-solid mt-1 ms-2 d-flex align-items-center mb-7">
                    <input
                      className="form-check-input h-25px w-45px me-5 cursor-pointer"
                      type="checkbox"
                      id="customLedgerSwitch"
                      checked={formik.values.residualAmountActionType === 2}
                      onChange={(e) => {
                        formik.setFieldValue("residualAmountActionType", 2);
                      }}
                    />
                    <label
                      className="form-check-label fs-sm text-dark"
                      htmlFor="customLedgerSwitch"
                    >
                      <span
                        dangerouslySetInnerHTML={{
                          __html: intl
                            .formatMessage({
                              id: "Fields.ResidualPaymentAmountActionTypeBookOnCustomLedgerAccount",
                            })
                            .replace(
                              "{0}",
                              `${currentUser?.result.activeCompanyDefaults.defaultValuta.sign} ${transferOptions?.restAmountOptions?.restAmount}`
                            ),
                        }}
                      />
                    </label>
                  </div>
                  {formik.values.residualAmountActionType === 2 && (
                    <Select
                      value={
                        ledgers
                          .flatMap((group: any) => group.options)
                          .find(
                            (option: any) =>
                              option.value ===
                              formik.values.residualAmountBookingLedgerAccountId
                          ) || null
                      }
                      className="react-select-styled"
                      options={ledgers}
                      onChange={(e: any) =>
                        formik.setFieldValue(
                          "residualAmountBookingLedgerAccountId",
                          e?.value
                        )
                      }
                      menuPlacement="top"
                      placeholder={intl.formatMessage({
                        id: "Fields.SelectOptionDefaultLedgerAccount",
                      })}
                    />
                  )}
                </>
              )}
            </div>
            {isLoading && <ListLoading />}
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleClose}
              >
                {intl.formatMessage({ id: "Fields.ActionClose" })}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                id="kt_drawer_process_toggle"
                onClick={() => {
                  setTimeout(() => {
                    handleClose(); // delay close to allow drawer JS to read the ID
                  }, 100);
                }}
              >
                {intl.formatMessage({ id: "Fields.ActionShowSelectionScreen" })}
              </button>

              <button
                type="button"
                className="btn btn-primary"
                disabled={isSubmitting}
                onClick={() => formik.handleSubmit()}
              >
                {isSubmitting ? (
                  <span
                    dangerouslySetInnerHTML={{
                      __html: intl.formatMessage({ id: "Common.Busy" }),
                    }}
                  />
                ) : (
                  intl.formatMessage({ id: "Fields.ActionSave" })
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  );
};

export { LinkExistingCost };
