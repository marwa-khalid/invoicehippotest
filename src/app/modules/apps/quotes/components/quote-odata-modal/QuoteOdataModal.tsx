import { useEffect, useState } from "react";
import { QuoteOdataModalHeader } from "./QuoteOdataModalHeader";
import { QuoteOdataModalFooter } from "./QuoteOdataModalFooter";
import { useIntl } from "react-intl";

interface ComponentProps {
  setOdataModalOpen: (type: boolean) => void;
  setRefresh: (type: boolean) => void;
  refresh: boolean;
  odata: string;
  accessCode: string;
}

const QuoteOdataModal = ({
  setOdataModalOpen,
  setRefresh,
  refresh,
  odata,
  accessCode,
}: ComponentProps) => {
  useEffect(() => {
    document.body.classList.add("modal-open");
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, []);

  const intl = useIntl();
  const [copyOdataSuccess, setCopyOdataSuccess] = useState(false);
  const [copyAccessCodeSuccess, setCopyAccessCodeSuccess] = useState(false);

  const copyToClipboard = async (
    text: string,
    setSuccess: (val: boolean) => void
  ) => {
    try {
      await navigator.clipboard.writeText(text);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 1000); // Reset icon after 1 second
    } catch (error) {
      setSuccess(false);
    }
  };
  const parsedUrl = new URL(odata);

  // Extract the 'odata' query parameter
  const parsedUrll = parsedUrl.searchParams.get("odata");
  const odataUrl = `${window.location.origin}/customer?odata=${parsedUrll}`;

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
        <div className="modal-dialog modal-dialog-centered mw-600px">
          {/* begin::Modal content */}
          <div className="modal-content">
            <QuoteOdataModalHeader setOdataModalOpen={setOdataModalOpen} />
            {/* begin::Modal body */}
            <div className="modal-body p-10 px-15">
              {/* Odata section */}
              <div
                className="row alert alert-custom alert-default bg-secondary align-items-center"
                role="alert"
              >
                <div className="alert-icon col-1 me-4">
                  <i className="ki-duotone ki-information-4 fs-3x text-center text-info">
                    <span className="path1"></span>
                    <span className="path2"></span>
                    <span className="path3"></span>
                  </i>
                </div>
                <div className="alert-text col-10 d-flex flex-column">
                  <h3 className="mb-2 my-2">Share link:</h3>
                  <span
                    style={{ wordBreak: "break-all", whiteSpace: "normal" }}
                  >
                    {odataUrl}
                  </span>
                  <div className="text-end">
                    <button
                      className="btn btn-icon"
                      onClick={() =>
                        copyToClipboard(odataUrl, setCopyOdataSuccess)
                      }
                    >
                      {copyOdataSuccess ? (
                        <i className="ki-duotone ki-check fs-3x text-success"></i>
                      ) : (
                        <i className="ki-duotone ki-square-brackets fs-3x text-info">
                          <span className="path1"></span>
                          <span className="path2"></span>
                          <span className="path3"></span>
                          <span className="path4"></span>
                        </i>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Access code section */}
              <div
                className="row alert alert-custom alert-default bg-secondary align-items-center"
                role="alert"
              >
                <div className="alert-icon col-1 me-4">
                  <i className="ki-duotone ki-information-4 fs-3x text-center text-info">
                    <span className="path1"></span>
                    <span className="path2"></span>
                    <span className="path3"></span>
                  </i>
                </div>
                <div className="alert-text col-8 d-flex flex-column">
                  <h3 className="mb-2 my-2">
                    {intl.formatMessage({
                      id: "LoginAndRegistration.AnonymousAccessCodeLabel",
                    })}
                    :
                  </h3>
                  <span
                    style={{ wordBreak: "break-all", whiteSpace: "normal" }}
                  >
                    {accessCode}
                  </span>
                </div>
                <div className="alert-text col-2 text-end">
                  <button
                    className="btn btn-icon"
                    onClick={() =>
                      copyToClipboard(accessCode, setCopyAccessCodeSuccess)
                    }
                  >
                    {copyAccessCodeSuccess ? (
                      <i className="ki-duotone ki-check fs-3x text-success"></i>
                    ) : (
                      <i className="ki-duotone ki-square-brackets fs-3x text-info">
                        <span className="path1"></span>
                        <span className="path2"></span>
                        <span className="path3"></span>
                        <span className="path4"></span>
                      </i>
                    )}
                  </button>
                </div>
              </div>
            </div>
            {/* end::Modal body */}
            <QuoteOdataModalFooter
              setOdataModalOpen={setOdataModalOpen}
              setRefresh={setRefresh}
              refresh={refresh}
              odataUrl={odataUrl}
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

export { QuoteOdataModal };
