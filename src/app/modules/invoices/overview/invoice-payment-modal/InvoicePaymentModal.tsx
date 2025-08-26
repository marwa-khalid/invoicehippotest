import { useEffect, useState } from "react";
import { InvoicePaymentModalHeader } from "./InvoicePaymentModalHeader";
import { InvoicePaymentModalFooter } from "./InvoicePaymentModalFooter";
import { useIntl } from "react-intl";
import Flatpickr from "react-flatpickr";
import { useAuth } from "../../../auth";
import Select from "react-select";
import { getAccountsForPayment, registerPayment } from "../core/_requests";
import * as Yup from "yup";
import { useFormik } from "formik";
import { handleToast } from "../../../auth/core/_toast";
interface ComponentProps {
  invoiceId: number;
  invoiceNr: string;
  setPaymentModalOpen: (type: boolean) => void;
  setRefresh: (type: boolean) => void;
  refresh: boolean;
}

const InvoicePaymentModal = ({
  invoiceId,
  invoiceNr,
  setPaymentModalOpen,
  setRefresh,
  refresh,
}: ComponentProps) => {
  useEffect(() => {
    document.body.classList.add("modal-open");
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, []);

  const intl = useIntl();
  const { currentUser } = useAuth();
  const [accountsForPayment, setAccountsForPayment] = useState<any>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formik = useFormik({
    initialValues: {
      invoiceId: invoiceId,
      amount: 0,
      accountId: 0,
      isFullPayment: false,
      dateOfPayment: "",
      sourceType: 1,
      residualAmountActionType: 0,
      residualAmountBookingLedgerAccountId: 0,
      replaceExitingPayment: false,
      existingPaymentId: 0,
      isAutoBooking: false,
    },

    validationSchema: Yup.object().shape({
      dateOfPayment: Yup.string().required(
        intl
          .formatMessage({ id: "Common.RequiredFieldHint2" })
          .replace("{0}", intl.formatMessage({ id: "Fields.DateOfPayment" }))
      ),
    }),

    onSubmit: async (values) => {
      setIsSubmitting(true);

      try {
        const response = await registerPayment(values);

        if (response.isValid) {
          setRefresh(!refresh);
          setPaymentModalOpen(false);
          setIsSubmitting(false);
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
    const fetchAccounts = async () => {
      const response = await getAccountsForPayment();
      if (response.isValid) {
        // setAccountsForPayment(response.result);
        const transformedData = [
          {
            label: response.result.accountItemsGroupTitle,
            options: response.result.accountItems.map((item) => ({
              value: item.id,
              label: `${item.title} (${item.paymentItemType.description})`,
            })),
          },
          {
            label: response.result.balanceActivaItemsGroupTitle,
            options: response.result.balanceActivaItems.map((item) => ({
              value: item.id,
              label: `${item.title} (${item.paymentItemType.description})`,
            })),
          },
          {
            label: response.result.balancePassivaItemsGroupTitle,
            options: response.result.balancePassivaItems.map((item) => ({
              value: item.id,
              label: `${item.title} (${item.paymentItemType.description})`,
            })),
          },
          {
            label: response.result.resultItemsGroupTitle,
            options: response.result.resultItems.map((item) => ({
              value: item.id,
              label: `${item.title} (${item.paymentItemType.description})`,
            })),
          },
        ];
        setAccountsForPayment(transformedData);
      }
    };
    fetchAccounts();
  }, []);

  useEffect(() => {
    if (formik.values.isFullPayment) {
      formik.setFieldValue("amount", 0);
    }
  }, [formik.values.isFullPayment]);

  return (
    <>
      <div
        className="modal fade show d-block"
        id="kt_modal_payment_invoice"
        role="dialog"
        tabIndex={-1}
        aria-modal="true"
      >
        {/* begin::Modal dialog */}
        <div className="modal-dialog modal-dialog-centered ">
          {/* begin::Modal content */}
          <div className="modal-content">
            <InvoicePaymentModalHeader
              setPaymentModalOpen={setPaymentModalOpen}
              invoiceNr={invoiceNr}
            />
            {/* begin::Modal body */}
            <div className="modal-body p-10">
              <div className="row d-flex form-wrapper bg-secondary p-5 rounded mb-7">
                <div className="col-2">
                  <i className="ki-duotone ki-information-4 fs-3x text-center text-primary">
                    <span className="path1"></span>
                    <span className="path2"></span>
                    <span className="path3"></span>
                  </i>
                </div>
                <span
                  className="col-10"
                  dangerouslySetInnerHTML={{
                    __html: intl.formatMessage({
                      id: "Fields.IsFullPaymentInfo",
                    }),
                  }}
                />
              </div>

              <div className="mb-5">
                <div className="form-check form-switch mt-10 ms-2 d-flex align-items-center">
                  <input
                    className="form-check-input h-25px w-45px me-5 cursor-pointer"
                    type="checkbox"
                    id="fullPaymentSwitch"
                    checked={formik.values.isFullPayment}
                    onChange={(e) => {
                      formik.setFieldValue(
                        "isFullPayment",
                        !formik.values.isFullPayment
                      );
                    }}
                  />
                  <label
                    className="form-check-label fs-sm text-muted"
                    htmlFor="fullPaymentSwitch"
                  >
                    {intl.formatMessage({ id: "Fields.IsFullPayment" })}
                  </label>
                </div>
              </div>
              <div className="row mb-7">
                <div className="col-6">
                  {" "}
                  <label className="required fw-bold fs-6 mb-3">
                    {intl.formatMessage({ id: "Fields.DateOfPayment" })}
                  </label>
                  <div
                    className="input-group"
                    id="kt_td_picker_date_only"
                    data-td-target-input="nearest"
                    data-td-target-toggle="nearest"
                  >
                    <span
                      className="input-group-text"
                      data-td-target="#kt_td_picker_date_only"
                      data-td-toggle="datetimepicker"
                    >
                      <i className="ki-duotone ki-calendar fs-2 text-primary">
                        <span className="path1"></span>
                        <span className="path2"></span>
                      </i>
                    </span>
                    <Flatpickr
                      value={formik.values.dateOfPayment}
                      onChange={(date: Date[]) => {
                        if (date[0]) {
                          // Adjust the date to avoid time zone issues and format as ISO string
                          const adjustedDate = new Date(
                            date[0].getTime() -
                              date[0].getTimezoneOffset() * 60000
                          );
                          formik.setFieldValue(
                            "dateOfPayment",
                            adjustedDate.toISOString()
                          );
                        }
                      }}
                      options={{
                        weekNumbers: true,
                        dateFormat: "d-m-Y",
                        allowInput: true,
                      }}
                      className="form-control"
                      placeholder="dd-MM-yyyy"
                    />
                  </div>
                  {formik.touched.dateOfPayment &&
                    formik.errors.dateOfPayment && (
                      <div className="fv-plugins-message-container">
                        <div className="fv-help-block">
                          <span
                            dangerouslySetInnerHTML={{
                              __html: formik.errors.dateOfPayment,
                            }}
                          />
                        </div>
                      </div>
                    )}
                </div>
                <div className="col-6">
                  <label className="required fw-bold fs-6 mb-3">
                    {intl.formatMessage({ id: "Fields.Amount" })}
                  </label>
                  <div className="input-group">
                    <span className="input-group-text me-1">
                      {
                        currentUser?.result.activeCompanyDefaults.defaultValuta
                          .sign
                      }
                    </span>
                    <input
                      type="number"
                      {...formik.getFieldProps("amount")}
                      className="form-control form-control-solid"
                      disabled={formik.values.isFullPayment}
                      placeholder={intl.formatMessage({ id: "Fields.Amount" })}
                    />
                  </div>

                  {formik.touched.amount && formik.errors.amount && (
                    <div className="fv-plugins-message-container">
                      <div className="fv-help-block">
                        <span
                          dangerouslySetInnerHTML={{
                            __html: formik.errors.amount,
                          }}
                          role="alert"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <Select
                  className="react-select react-select-styled"
                  options={accountsForPayment}
                  placeholder={intl.formatMessage({
                    id: "Fields.SelectOptionDefaultFinancialAccount",
                  })}
                  isClearable
                  isSearchable
                  value={accountsForPayment?.find(
                    (type: any) => type.value === formik.values.accountId
                  )}
                  onChange={(e) => {
                    formik.setFieldValue("accountId", e?.value);
                  }}
                />
              </div>
            </div>
            {/* end::Modal body */}
            <InvoicePaymentModalFooter
              setPaymentModalOpen={setPaymentModalOpen}
              formik={formik}
              isSubmitting={isSubmitting}
            />
          </div>
          {/* end::Modal content */}
        </div>
        {/* end::Modal dialog */}
      </div>
      {/* begin::Modal Backdrop */}
      <div className="modal-backdrop fade show"></div>
      {/* end::Modal Backdrop */}
    </>
  );
};

export { InvoicePaymentModal };
