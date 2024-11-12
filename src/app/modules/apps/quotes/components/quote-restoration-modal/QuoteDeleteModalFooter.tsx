import { FC, useState } from "react";
import { useIntl } from "react-intl";
import { deleteQuoteList } from "../core/_requests";
import { handleToast } from "../../../../auth/core/_toast";
import { FormikProps } from "formik";
import { FormValues } from "../quote-add-modal/QuoteAddStep1";

interface ComponentProps {
  setRestoreModalOpen: (type: boolean) => void;
  formik: FormikProps<FormValues>;
  attachment: any;
  restoreAttachment: boolean;
}

const QuoteDeleteModalFooter = ({
  setRestoreModalOpen,
  formik,
  attachment,
  restoreAttachment,
}: ComponentProps) => {
  // For localization support
  const intl = useIntl();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const deleteQuote = async () => {
    setIsSubmitting(true);
    const attachmentId = attachment.id;

    // Check if the attachmentId is already in attachmentsToLink
    const attachmentsToLink = formik.values.attachments.attachmentsToLink || [];

    const newAttachmentToLink = {
      inboxItemId: 0,
      attachmentId: attachmentId,
      isRemoved: true,
      restoreAttachment: restoreAttachment, // set based on user input
      isDirectFileReference: false,
    };

    // Append the new object to attachmentsToLink
    formik.setFieldValue("attachments.attachmentsToLink", [
      ...attachmentsToLink,
      newAttachmentToLink,
    ]);

    // Remove the current attachment from attachments.attachments
    const updatedAttachments = formik.values.attachments.attachments.filter(
      (item) => item.id !== attachmentId
    );

    formik.setFieldValue("attachments.attachments", updatedAttachments);
    setIsSubmitting(false);
    setRestoreModalOpen(false);
  };
  return (
    <div className="modal-footer d-flex justify-content-end align-items-center ">
      <div className="d-flex">
        {/* Cancel Button */}
        <button
          type="reset"
          onClick={() => {
            setRestoreModalOpen(false);
            localStorage.removeItem("DeleteData");
          }}
          className="btn btn-light me-3"
        >
          {intl.formatMessage({ id: "Fields.ActionClose" })}
        </button>

        {/* Save Button */}
        <button
          type="submit"
          className="btn btn-danger"
          onClick={deleteQuote}
          //   disabled={!isValid || isSubmitting || !touched}
        >
          {!isSubmitting && intl.formatMessage({ id: "Fields.ActionDelete" })}
          {isSubmitting && (
            <span className="indicator-progress" style={{ display: "block" }}>
              {intl.formatMessage({ id: "Common.Busy" })}
              <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
            </span>
          )}
        </button>
      </div>
    </div>
  );
};

export { QuoteDeleteModalFooter };
