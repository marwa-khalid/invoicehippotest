import { useEffect, useState } from "react";
import { InvoiceCreditModalHeader } from "./InvoiceCreditModalHeader";
import { InvoiceCreditModalFooter } from "./InvoiceCreditModalFooter";
import { useIntl } from "react-intl";
import Flatpickr from "react-flatpickr";

interface ComponentProps {
  invoiceId: number;
  invoiceNr: string;
  setCreditModalOpen: (type: boolean) => void;
  setRefresh: (type: boolean) => void;
  refresh: boolean;
  setAddModalOpen: (type: boolean) => void;
  setEditModalId: (type: number) => void;
}

const InvoiceCreditModal = ({
  invoiceId,
  invoiceNr,
  setCreditModalOpen,
  setRefresh,
  refresh,
  setAddModalOpen,
  setEditModalId,
}: ComponentProps) => {
  useEffect(() => {
    document.body.classList.add("modal-open");
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, []);

  const intl = useIntl();
  const [actionType, setActionType] = useState<number>(1);
  const [openDraftSwitch, setOpenDraftSwitch] = useState<boolean>(false);
  const [invoiceDate, setInvoiceDate] = useState<string>("");

  return (
    <>
      <div
        className="modal fade show d-block"
        id="kt_modal_credit_invoice"
        role="dialog"
        tabIndex={-1}
        aria-modal="true"
      >
        {/* begin::Modal dialog */}
        <div className="modal-dialog modal-dialog-centered ">
          {/* begin::Modal content */}
          <div className="modal-content">
            <InvoiceCreditModalHeader
              setCreditModalOpen={setCreditModalOpen}
              invoiceNr={invoiceNr}
            />
            {/* begin::Modal body */}
            <div className="modal-body p-10">
              <div className="mb-4">
                <label className="required fw-bold fs-6 mb-3">
                  {intl.formatMessage({ id: "Fields.InvoiceDate" })}
                </label>
                <div
                  className="input-group"
                  id="kt_td_picker_date_only"
                  data-td-target-input="nearest"
                  data-td-target-toggle="nearest"
                >
                  <Flatpickr
                    value={invoiceDate}
                    onChange={(date: Date[]) => {
                      if (date[0]) {
                        // Adjust the date to avoid time zone issues and format as ISO string
                        const adjustedDate = new Date(
                          date[0].getTime() -
                            date[0].getTimezoneOffset() * 60000
                        );
                        setInvoiceDate(adjustedDate.toISOString());
                      }
                    }}
                    options={{
                      weekNumbers: true,
                      dateFormat: "d-m-Y",
                      allowInput: true,
                    }}
                    className="form-control"
                    placeholder="dd-MM-yyyy"
                    style={{ height: "38px" }}
                  />

                  <span
                    className="input-group-text"
                    style={{ height: "38px" }}
                    data-td-target="#kt_td_picker_date_only"
                    data-td-toggle="datetimepicker"
                  >
                    <i className="ki-duotone ki-calendar fs-2 text-primary">
                      <span className="path1"></span>
                      <span className="path2"></span>
                    </i>
                  </span>
                </div>
              </div>
              <div className="mb-5">
                <div className="form-check mb-5">
                  <input
                    className="form-check-input cursor-pointer"
                    type="radio"
                    name="creditOption"
                    id="draftOption"
                    value={1}
                    checked={actionType === 1}
                    onChange={() => setActionType(1)}
                  />
                  <label className="form-check-label" htmlFor="draftOption">
                    {intl.formatMessage({
                      id: "Fields.ModalCreditCreateAsDraft",
                    })}
                  </label>
                </div>
                <div className="form-check mb-5">
                  <input
                    className="form-check-input cursor-pointer"
                    type="radio"
                    name="creditOption"
                    id="finalizeOption"
                    value={2}
                    checked={actionType === 2}
                    onChange={() => setActionType(2)}
                  />
                  <label className="form-check-label" htmlFor="finalizeOption">
                    {intl.formatMessage({
                      id: "Fields.ModalCreditCreateAndFinalize",
                    })}
                  </label>
                </div>
                <div className="form-check mb-5">
                  <input
                    className="form-check-input cursor-pointer"
                    type="radio"
                    name="creditOption"
                    id="settleOption"
                    value={3}
                    checked={actionType === 3}
                    onChange={() => setActionType(3)}
                  />
                  <label className="form-check-label" htmlFor="settleOption">
                    {intl.formatMessage({
                      id: "Fields.ModalCreditCreateFinalizeAndSettle",
                    })}
                  </label>
                </div>
              </div>

              {/* Info divs */}
              {actionType === 1 && (
                <>
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
                          id: "Fields.ModalCreditCreateAsDraftOptionInfo",
                        }),
                      }}
                    />
                  </div>
                  <div className="form-check form-switch mt-1 ms-2 d-flex align-items-center">
                    <input
                      className="form-check-input h-25px w-45px me-5 cursor-pointer"
                      type="checkbox"
                      id="openDraftSwitch"
                      checked={openDraftSwitch}
                      onChange={() => setOpenDraftSwitch(!openDraftSwitch)}
                    />
                    <label
                      className="form-check-label fs-sm text-muted"
                      htmlFor="openDraftSwitch"
                    >
                      {intl.formatMessage({
                        id: "Fields.ModalOpenDraftAfterAction",
                      })}
                    </label>
                  </div>
                </>
              )}
              {actionType === 2 && (
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
                        id: "Fields.ModalCreditCreateAndFinalizeOptionInfo",
                      }),
                    }}
                  />
                </div>
              )}
              {actionType === 3 && (
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
                        id: "Fields.ModalCreditCreateFinalizeAndSettleOptionInfo",
                      }),
                    }}
                  />
                </div>
              )}
            </div>
            {/* end::Modal body */}
            <InvoiceCreditModalFooter
              invoiceId={invoiceId}
              setCreditModalOpen={setCreditModalOpen}
              setRefresh={setRefresh}
              openDraftSwitch={openDraftSwitch}
              refresh={refresh}
              setAddModalOpen={setAddModalOpen}
              setEditModalId={setEditModalId}
              actionType={actionType}
              invoiceDate={invoiceDate}
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

export { InvoiceCreditModal };
