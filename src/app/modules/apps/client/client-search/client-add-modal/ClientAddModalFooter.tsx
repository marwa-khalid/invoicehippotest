import { FC, useEffect } from "react";
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
  setClose
}: Props) => {
  const intl = useIntl();
  const checkIdAndHandleTab = () => {
    // Check if businessName is empty (submit only if businessName is provided)
    if (!formik.values.businessName) {
      toast.info("Complete initial steps please.");

      // Find the tab element and cast it to an HTMLAnchorElement
      const tabElement = document.querySelector(
        'a[href="#kt_tab_pane_4"]'
      ) as HTMLAnchorElement | null;

      if (tabElement) {
        tabElement.click(); // Only call click if the element exists
      } else {
        console.error("Tab with href '#kt_tab_pane_4' not found.");
      }
    } else {
      // If businessName is present, submit the form even if id is not present
      formik.handleSubmit();
    }
  };

  // useEffect(() => {
  //   checkIdAndHandleTab();
  // }, [formik.values.id]);
  return (
    <>
      {" "}
      <div className="modal-footer flex-end">
        <button
          type="button"
          className="btn btn-light me-3"
          data-bs-dismiss="modal"
          data-bs-target="client_add_modal"
          onClick={() => {
            setAddModalOpen(false);
          }}
        >
          {intl.formatMessage({ id: "Fields.ActionCancel" })}
        </button>

        <button
          type="submit"
          className="btn btn-primary"
          onClick={() => checkIdAndHandleTab()}
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
            formik.handleSubmit();
            setClose(true);
          }}
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
    </>
  );
};

export { ClientAddModalFooter };
