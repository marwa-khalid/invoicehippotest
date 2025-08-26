import { FC } from "react";
import { useIntl } from "react-intl";
import { FormikProps } from "formik";
import { toast } from "react-toastify";

interface Props {
  isSubmitting: boolean;
  isSubmitting2: boolean;
  setAddModalOpen: (type: boolean) => void;
  formik: FormikProps<any>;
  setClose: (type: boolean) => void;
}

const ClientAddModalFooter = ({
  isSubmitting,
  setAddModalOpen,
  formik,
  isSubmitting2,
  setClose,
}: Props) => {
  const intl = useIntl();

  const checkIdAndHandleTab = () => {
    if (!formik.values.businessName) {
      toast.info(
        intl.formatMessage({
          id: "Fields.WizardValidation",
        })
      );

      const tabElement = document.querySelector(
        'a[href="#kt_tab_pane_4"]'
      ) as HTMLAnchorElement | null;

      if (tabElement) {
        tabElement.click();
      } else {
        console.error("Tab with href '#kt_tab_pane_4' not found.");
      }
    } else {
      formik.handleSubmit();
    }
  };

  const isAnySubmitting = isSubmitting || isSubmitting2;

  return (
    <div className="modal-footer flex-end">
      <button
        type="button"
        className="btn btn-secondary me-3"
        data-bs-dismiss="modal"
        data-bs-target="client_add_modal"
        onClick={() => {
          setAddModalOpen(false);
        }}
        disabled={isAnySubmitting} // Disable if any button is submitting
      >
        {intl.formatMessage({ id: "Fields.ActionCancel" })}
      </button>

      <button
        type="submit"
        className="btn btn-primary"
        onClick={() => checkIdAndHandleTab()}
        disabled={isAnySubmitting} // Disable if any button is submitting
      >
        {!isSubmitting && intl.formatMessage({ id: "Fields.ActionSave" })}
        {isSubmitting && (
          <span className="indicator-progress" style={{ display: "block" }}>
            {intl.formatMessage({ id: "Common.Busy" })}
            <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
          </span>
        )}
      </button>

      <button
        type="submit"
        className="btn btn-primary"
        onClick={() => {
          checkIdAndHandleTab()
          // formik.handleSubmit();
          setClose(true);
        }}
        disabled={isAnySubmitting} // Disable if any button is submitting
      >
        {!isSubmitting2 &&
          intl.formatMessage({ id: "Fields.ActionSaveAndClose" })}
        {isSubmitting2 && (
          <span className="indicator-progress" style={{ display: "block" }}>
            {intl.formatMessage({ id: "Common.Busy" })}
            <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
          </span>
        )}
      </button>
    </div>
  );
};

export { ClientAddModalFooter };
