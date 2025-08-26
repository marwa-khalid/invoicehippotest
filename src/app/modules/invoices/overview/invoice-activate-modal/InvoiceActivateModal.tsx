import { useEffect, useState } from "react";
import { InvoiceActivateModalHeader } from "./InvoiceActivateModalHeader";
import { InvoiceActivateModalFooter } from "./InvoiceActivateModalFooter";
import { useIntl } from "react-intl";
interface ComponentProps {
  invoiceId: number;
  invoiceNr: string;
  setActivateModalOpen: (type: boolean) => void;
  setRefresh: (type: boolean) => void;
  refresh: boolean;
}
const InvoiceActivateModal = ({
  invoiceId,
  invoiceNr,
  setActivateModalOpen,
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

  const [isTodayDate, setIsTodayDate] = useState<boolean>(false);
  const [adjustInvoiceDateToToday, setAdjustDate] = useState<boolean>(false);
  const [dontSendRemindersOnlyTrackStatus, setDontSendReminders] =
    useState<boolean>(false);

  const modalData = JSON.parse(localStorage.getItem("ModalData")!);
  const invoiceDateAsString = modalData?.invoiceDateAsString;

  // Get today's date in "YYYY-MM-DD" format
  const today = new Date();
  const formattedToday = `${String(today.getDate()).padStart(2, "0")}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}-${today.getFullYear()}`;

  // Format as "YYYY-MM-DD"
  useEffect(() => {
    if (invoiceDateAsString === formattedToday) {
      setIsTodayDate(true);
    } else {
      setIsTodayDate(false);
    }
  }, []);
  // Check if the dates are the same

  const formatExpirationDate = () => {
    // "25-10-2024"

    const days = [
      "Zondag",
      "Maandag",
      "Dinsdag",
      "Woensdag",
      "Donderdag",
      "Vrijdag",
      "Zaterdag",
    ];
    const months = [
      "Januari",
      "Februari",
      "Maart",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Augustus",
      "September",
      "Oktober",
      "November",
      "December",
    ];

    const dayName = days[today.getDay()];
    const dayy = today.getDate();
    const monthName = months[today.getMonth()];
    const yearFormatted = today.getFullYear();

    return `${dayName} ${dayy} ${monthName} ${yearFormatted}`;
  };

  return (
    <>
      <div
        className="modal fade show d-block"
        id="kt_modal_activate_invoice"
        role="dialog"
        tabIndex={-1}
        aria-modal="true"
      >
        {/* begin::Modal dialog */}
        <div className="modal-dialog modal-dialog-centered ">
          {/* begin::Modal content */}
          <div className="modal-content">
            <InvoiceActivateModalHeader
              setActivateModalOpen={setActivateModalOpen}
              invoiceNr={invoiceNr}
            />
            {/* begin::Modal body */}
            <div className="modal-body p-10">
              <div className="row d-flex form-wrapper bg-secondary p-5 rounded mb-7">
                <div className="col-2">
                  <i className="ki-duotone ki-information-4 fs-3x text-center text-info">
                    <span className="path1"></span>
                    <span className="path2"></span>
                    <span className="path3"></span>
                  </i>
                </div>
                <span
                  className="col-10"
                  dangerouslySetInnerHTML={{
                    __html: intl.formatMessage({
                      id: "Fields.ModalFinalizeDescriptionInvoice",
                    }),
                  }}
                />
              </div>
              <div className="separator border-gray-300 my-10"></div>
              {!isTodayDate && (
                <>
                  <div className="row d-flex form-wrapper bg-danger text-white p-5 rounded mb-7">
                    <span
                      dangerouslySetInnerHTML={{
                        __html: intl
                          .formatMessage({
                            id: "Fields.ModalFinalizeAdjustInvoiceDateInfo",
                          })
                          .replace("{0}", formatExpirationDate()),
                      }}
                    />
                  </div>
                  <div className="form-check form-switch  mt-1 ms-2 d-flex align-items-center mb-10">
                    <input
                      className="form-check-input h-25px w-45px me-5 cursor-pointer"
                      type="checkbox"
                      id="changeDateSwitch"
                      checked={adjustInvoiceDateToToday}
                      onChange={(e) => {
                        setAdjustDate(!adjustInvoiceDateToToday);
                      }}
                    />
                    <label
                      className="form-check-label fs-sm text-muted"
                      htmlFor="changeDateSwitch"
                    >
                      {intl.formatMessage({
                        id: "Fields.AdjustDocumentDateToToday",
                      })}
                    </label>
                  </div>
                </>
              )}

              <div className="form-check form-switch mt-1 ms-2 d-flex align-items-center">
                <input
                  className="form-check-input h-25px w-45px me-5 cursor-pointer"
                  type="checkbox"
                  id="dontSendRemindersSwitch"
                  checked={dontSendRemindersOnlyTrackStatus}
                  onChange={() =>
                    setDontSendReminders(!dontSendRemindersOnlyTrackStatus)
                  }
                />
                <label
                  className="form-check-label fs-sm text-muted"
                  htmlFor="dontSendRemindersSwitch"
                >
                  {intl.formatMessage({
                    id: "Fields.DontSendRemindersOnlyTrackStatus",
                  })}
                </label>
              </div>
            </div>

            {/* end::Modal body */}
            <InvoiceActivateModalFooter
              invoiceId={invoiceId}
              setActivateModalOpen={setActivateModalOpen}
              setRefresh={setRefresh}
              refresh={refresh}
              dontSendRemindersOnlyTrackStatus={
                dontSendRemindersOnlyTrackStatus
              }
              modalData={modalData}
              adjustInvoiceDateToToday={adjustInvoiceDateToToday}
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

export { InvoiceActivateModal };
