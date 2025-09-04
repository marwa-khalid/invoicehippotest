import { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { InboxAttachmentListModalHeader } from "./InboxAttachmentListModalHeader";
import { InboxAttachmentListModalFooter } from "./InboxAttachmentListModalFooter";
import { AttachmentListing } from "../../../generic/FileManager/AttachmentListing";

interface InboxLinkingModalProps {
  handleAttachment: () => void;
  setLinkingModalOpen: (type: boolean) => void;
  inboxDetail: any;
}

const InboxAttachmentListModal = ({
  inboxDetail,
  setLinkingModalOpen,
  handleAttachment,
}: InboxLinkingModalProps) => {
  useEffect(() => {
    document.body.classList.add("modal-open");
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, []);

  const intl = useIntl();
  const [key, setKey] = useState<number>(1);
  return (
    <>
      <div
        className="modal fade show d-block"
        id="kt_modal_copy_inbox"
        role="dialog"
        tabIndex={-1}
        aria-modal="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <InboxAttachmentListModalHeader
              setLinkingModalOpen={setLinkingModalOpen}
              inboxDetail={inboxDetail}
            />
            <div className="row">
              <div className="col-12">
                <div className="row d-flex align-items-center m-5">
                  <AttachmentListing
                    attachments={[inboxDetail]}
                    setKey={setKey}
                  ></AttachmentListing>
                </div>
              </div>
            </div>

            {/* Submit & Footer */}
            <InboxAttachmentListModalFooter
              setLinkingModalOpen={setLinkingModalOpen}
              handleAttachment={handleAttachment}
            />
          </div>
        </div>
      </div>

      {/* Modal Backdrop */}
      <div className="modal-backdrop fade show"></div>
    </>
  );
};

export { InboxAttachmentListModal };
