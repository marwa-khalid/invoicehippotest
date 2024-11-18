import { useEffect } from "react";
import { useIntl } from "react-intl";
import { FormikProps } from "formik";
import { useAuth } from "../../../../auth";
import { FormValues } from "./QuoteValidateStep1";

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
  setValidateModalOpen,
  setActiveTab,
  tabs,
  activeTab,
  formik,
  isSubmitting,
}: ComponentProps) => {
  const intl = useIntl();
  const auth = useAuth();

  const handleNavigate = (direction: "next" | "back") => {
    setActiveTab((prevTab: any) => {
      const currentIndex = tabs.findIndex((tab: any) => tab.id === prevTab.id);
      const newIndex =
        direction === "next"
          ? Math.min(currentIndex + 1, tabs.length - 1)
          : Math.max(currentIndex - 1, 0);
      return tabs[newIndex];
    });
  };

  const isApproved =
    (activeTab.id === 2 &&
      !auth.currentUser?.result.isAnonymousUser &&
      formik.values.validationStateType === 1) ||
    activeTab.id === 4;

  const isDeclined =
    activeTab.id === 2 && formik.values.validationStateType === 2;

  useEffect(() => {
    formik.validateForm();
  }, [activeTab]);
  console.log(activeTab);

  return (
    <div className="modal-footer d-flex justify-content-between align-items-center">
      {!auth.currentUser?.result?.isAnonymousUser ? (
        <div className="form-check form-switch form-check-success form-check-solid ms-2 d-flex align-items-center">
          <input
            className="form-check-input h-25px w-45px me-5 cursor-pointer"
            type="checkbox"
            id="notifyClientSwitch"
            checked={formik.values.notifyClient}
            onChange={(e) => {
              formik.setFieldValue("notifyClient", !formik.values.notifyClient);
            }}
          />
          <label
            className="form-check-label fs-sm text-muted"
            htmlFor="notifyClientSwitch"
          >
            {intl.formatMessage({
              id: "Fields.NotifyClient",
            })}
          </label>
        </div>
      ) : (
        <div></div>
      )}
      <div className="d-flex">
        {activeTab.id === 1 ? (
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
        ) : (
          <>
            <button
              type="button"
              className="btn btn-secondary me-5"
              onClick={() => handleNavigate("back")}
            >
              {intl.formatMessage({
                id: "Common.WizardStepPrevious",
              })}
            </button>
            <button
              type="button"
              className={`btn ${
                isApproved
                  ? "btn-success"
                  : isDeclined
                  ? "btn-danger"
                  : "btn-primary"
              }`}
              onClick={() => {
                isApproved || isDeclined
                  ? formik.handleSubmit()
                  : handleNavigate("next");
              }}
              disabled={
                isSubmitting ||
                (!isApproved &&
                  !isDeclined &&
                  formik.values.validationStateType === 0) ||
                (activeTab.id === 3 && !formik.isValid)
              }
            >
              {isApproved
                ? intl.formatMessage({
                    id: "Fields.ActionApprove",
                  })
                : isDeclined
                ? intl.formatMessage({
                    id: "Fields.ActionDecline",
                  })
                : intl.formatMessage({
                    id: "Common.WizardStepNext",
                  })}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export { QuoteValidateModalFooter };
