import { useEffect, useState } from "react";
import { QuoteValidateModalHeader } from "./QuoteValidateModalHeader";
import { QuoteValidateModalFooter } from "./QuoteValidateModalFooter";
import { useIntl } from "react-intl";
import { QuoteValidateStep1 } from "./QuoteValidateStep1";
import { QuoteValidateStep2 } from "./QuoteValidateStep2";
import { QuoteValidateStep3 } from "./QuoteValidateStep3";
import { QuoteValidateStep4 } from "./QuoteValidateStep4";
interface ComponentProps {
  quoteId: number;
  quoteNumber: string;
  setValidateModalOpen: (type: boolean) => void;
  setRefresh: (type: boolean) => void;
  refresh: boolean;
}
const QuoteValidateModal = ({
  quoteId,
  quoteNumber,
  setValidateModalOpen,
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
  const [mode, setMode] = useState<number>(1);
  const tabs = [
    {
      id: 1,
      label: "Selection",
      icon: <i className="fa-regular fa-address-book fs-3 hippo-tab-icon"></i>,
    },
    {
      id: 2,
      label: mode === 1 ? "Comments" : "Reason",
      icon: <i className="fa-solid fa-file-invoice fs-3 hippo-tab-icon"></i>,
    },
    {
      id: 3,
      label: "Personal Details",
      icon: (
        <i className="fa-regular fa-closed-captioning fs-3 hippo-tab-icon"></i>
      ),
    },
    {
      id: 4,
      label: "Sign Document",
      icon: (
        <i className="fa-regular fa-closed-captioning fs-3 hippo-tab-icon"></i>
      ),
    },
  ];

  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const handleTabClick = (tab: any) => {
    setActiveTab(tab);
    setCurrentIndex(tab.id - 1);
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
        <div className="modal-dialog mw-700px">
          {/* begin::Modal content */}
          <div className="modal-content">
            <QuoteValidateModalHeader
              setValidateModalOpen={setValidateModalOpen}
              quoteNumber={quoteNumber}
            />

            <div className="hippo-tab-manager d-flex justify-content-between p-5 flex-grow-1 bg-secondary">
              <div className="d-flex justify-content-start">
                {tabs.map((tab: any) => (
                  <div key={tab.id}>
                    {mode === 2 && (tab.id === 3 || tab.id === 4) ? (
                      <></>
                    ) : (
                      <button
                        key={tab.id}
                        onClick={() => {
                          handleTabClick(tab);
                        }}
                        className={`btn bg-light border-0 mx-2 px-4 ${
                          activeTab.id === tab.id
                            ? "hippo-selected-tab text-white bg-dark"
                            : "text-gray bg-body"
                        }  `}
                        data-bs-toggle="tab"
                        style={{ borderBottomColor: "1px solid black" }}
                      >
                        {tab.icon}
                        <span className="me-1">|</span>
                        {tab.label}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="hippo-tab-content" id="myTabContent">
              {activeTab.id === 1 && (
                <QuoteValidateStep1 mode={mode} setMode={setMode} />
              )}
              {activeTab.id === 2 && <QuoteValidateStep2 />}
              {activeTab.id === 3 && <QuoteValidateStep3 />}
              {activeTab.id === 4 && <QuoteValidateStep4 />}
            </div>

            {/* begin::Modal body */}

            {/* <div className="modal-body p-10">
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
                      id: "Fields.ValidateQuoteInfo",
                    }),
                  }}
                />
              </div>

              <div className="form-check form-check-custom form-check-success form-check-solid">
                <input
                  className="form-check-input"
                  type="radio"
                  value=""
                  checked
                  id="flexCheckboxSm"
                />
                <label className="form-check-label">
                  {intl.formatMessage({
                    id: "Fields.SelectOptionQuoteValidationStateTypeApproved",
                  })}
                </label>
              </div>
              <div className="form-check form-check-custom form-check-danger form-check-solid mt-5">
                <input
                  className="form-check-input"
                  type="radio"
                  value=""
                  id="flexCheckboxLg"
                />
                <label className="form-check-label">
                  {intl.formatMessage({
                    id: "Fields.SelectOptionQuoteValidationStateTypeDeclined",
                  })}
                </label>
              </div>

              <div className="separator border-gray-300 my-10"></div>
              <div className="row">
                <ReactQuill
                  theme="snow"
                  placeholder="Jouw tekst hier..."
                  style={{ height: "300px" }}
                  // onChange={handleQuillChange1}
                  // value={formik.values.comments.quoteComments}
                />
              </div>
              <div className="separator border-gray-300 mt-20 mb-10"></div>
              <div className="form-check form-switch mt-1 ms-2 d-flex align-items-center">
                <input
                  className="form-check-input h-25px w-45px me-5"
                  type="checkbox"
                  id="openDraftSwitch"
                  // checked={formik.values.customizations.useCustomQuoteNr}
                  // onChange={(e) => {
                  //   formik.setFieldValue(
                  //     "customizations.useCustomQuoteNr",
                  //     !formik.values.customizations.useCustomQuoteNr
                  //   );
                  // }}
                />
                <label
                  className="form-check-label fs-sm text-muted"
                  htmlFor="openDraftSwitch"
                >
                  verstuur de klant een notificatie van deze actie
                </label>
              </div>
            </div> */}

            {/* end::Modal body */}
            <QuoteValidateModalFooter
              quoteId={quoteId}
              setValidateModalOpen={setValidateModalOpen}
              setRefresh={setRefresh}
              refresh={refresh}
              tabs={tabs}
              setActiveTab={setActiveTab}
              mode={mode}
              activeTab={activeTab}
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

export { QuoteValidateModal };
