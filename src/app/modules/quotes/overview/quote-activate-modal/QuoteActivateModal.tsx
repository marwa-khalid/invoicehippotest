import { useEffect, useState } from "react";
import { QuoteActivateModalHeader } from "./QuoteActivateModalHeader";
import { QuoteActivateModalFooter } from "./QuoteActivateModalFooter";
import { useIntl } from "react-intl";
interface ComponentProps {
  quoteId: number;
  quoteNumber: string;
  setActivateModalOpen: (type: boolean) => void;
  setRefresh: (type: boolean) => void;
  refresh: boolean;
}
const QuoteActivateModal = ({
  quoteId,
  quoteNumber,
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
  const [adjustQuoteDateToToday, setAdjustDate] = useState<boolean>(false);
  const [dontSendRemindersOnlyTrackStatus, setDontSendReminders] =
    useState<boolean>(false);

  const modalData = JSON.parse(localStorage.getItem("ModalData")!);
  const quoteDateAsString = modalData?.quoteDateAsString;

  // Get today's date in "YYYY-MM-DD" format
  const today = new Date();
  const formattedToday = `${String(today.getDate()).padStart(2, "0")}-${String(
    today.getMonth() + 1
  ).padStart(2, "0")}-${today.getFullYear()}`;

  // Format as "YYYY-MM-DD"
  useEffect(() => {
    if (quoteDateAsString === formattedToday) {
      setIsTodayDate(true);
    } else {
      setIsTodayDate(false);
    }
  }, [quoteDateAsString]);
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
        id="kt_modal_copy_quote"
        role="dialog"
        tabIndex={-1}
        aria-modal="true"
      >
        {/* begin::Modal dialog */}
        <div className="modal-dialog modal-dialog-centered ">
          {/* begin::Modal content */}
          <div className="modal-content">
            <QuoteActivateModalHeader
              setActivateModalOpen={setActivateModalOpen}
              quoteNumber={quoteNumber}
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
                      id: "Fields.ModalFinalizeQuoteInfo",
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
                            id: "Fields.ModalFinalizeAdjustQuoteDateInfo",
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
                      checked={adjustQuoteDateToToday}
                      onChange={(e) => {
                        setAdjustDate(!adjustQuoteDateToToday);
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
            <QuoteActivateModalFooter
              quoteId={quoteId}
              setActivateModalOpen={setActivateModalOpen}
              setRefresh={setRefresh}
              refresh={refresh}
              dontSendRemindersOnlyTrackStatus={
                dontSendRemindersOnlyTrackStatus
              }
              adjustQuoteDateToToday={adjustQuoteDateToToday}
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

export { QuoteActivateModal };
