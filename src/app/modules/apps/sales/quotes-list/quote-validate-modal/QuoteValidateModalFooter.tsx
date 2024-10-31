import { useState } from "react";
import { useIntl } from "react-intl";
import { deleteQuoteList } from "../core/_requests";

import { handleToast } from "../../../../auth/core/_toast";
import { FormValues } from "./QuoteValidateStep1";
import { FormikProps } from "formik";

interface ComponentProps {
  setValidateModalOpen: (type: boolean) => void;
  quoteId: number;
  setRefresh: (type: boolean) => void;
  refresh: boolean;
  setActiveTab: any;
  tabs: any;
  activeTab: any;
  formik: FormikProps<FormValues>;
  isSubmitting: boolean;
}

const QuoteValidateModalFooter = ({
  quoteId,
  setValidateModalOpen,
  setRefresh,
  refresh,
  setActiveTab,
  tabs,
  formik,
  activeTab,
  isSubmitting,
}: ComponentProps) => {
  // For localization support
  const intl = useIntl();
  const handleContinue = () => {
    setActiveTab((prevTab: any) => {
      const currentIndex = tabs.findIndex((tab: any) => tab.id === prevTab.id);
      // setCurrentIndex(currentIndex);
      const nextIndex =
        currentIndex < tabs.length - 1 ? currentIndex + 1 : currentIndex;
      return tabs[nextIndex];
    });
  };

  return (
    <div className="modal-footer d-flex justify-content-end align-items-center ">
      <div className="d-flex">
        {/* Cancel Button */}
        <button
          type="reset"
          onClick={() => {
            setValidateModalOpen(false);
            localStorage.removeItem("ModalData");
          }}
          className="btn btn-secondary me-3"
        >
          {intl.formatMessage({ id: "Fields.ActionClose" })}
        </button>

        {/* Continue Button */}
        {console.log(formik.values)!}
        {activeTab.id === 4 ? (
          <button
            type="button"
            className="btn btn-success"
            onClick={() => formik.handleSubmit()}
            disabled={isSubmitting || !formik.isValid}
          >
            Approve
          </button>
        ) : activeTab.id === 2 && formik.values.validationStateType === 2 ? (
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => formik.handleSubmit()}
            disabled={isSubmitting || !formik.isValid}
          >
            Decline
          </button>
        ) : (
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleContinue}
            disabled={formik.values.validationStateType === 0}
          >
            Continue
          </button>
        )}

        {/* Save Button */}
        {/* <button
          type="submit"
          className="btn btn-primary"
          onClick={deleteQuote}
          //   disabled={!isValid || isSubmitting || !touched}
        >
          {!isSubmitting && intl.formatMessage({ id: "Fields.ActionApprove" })}
          {isSubmitting && (
            <span className="indicator-progress" style={{ display: "block" }}>
              {intl.formatMessage({ id: "Common.Busy" })}
              <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
            </span>
          )}


        </button> */}
      </div>
    </div>
  );
};

export { QuoteValidateModalFooter };
