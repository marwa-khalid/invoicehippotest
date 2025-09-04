import { useEffect, useState, useRef } from "react";
import { InboxPreviewModalHeader } from "./InboxPreviewModalHeader";
import { InboxPreviewModalFooter } from "./InboxPreviewModalFooter";
import { useIntl } from "react-intl";
import WebViewer from "@pdftron/webviewer";
import { ViewCanvas } from "../../../generic/ViewCanvas";

interface ComponentProps {
  inboxDetail: any;
  setActivateModalOpen: (type: boolean) => void;
  setRefresh: (type: boolean) => void;
  refresh: boolean;
}
const InboxPreviewModal = ({
  inboxDetail,
  setActivateModalOpen,
  setRefresh,
  refresh,
}: ComponentProps) => {
  // Initialize WebViewer if the file is a PDF
  const downloadUrl = inboxDetail?.downloadInfo?.downloadUrl;
  const [key, setKey] = useState<number>(1);

  return (
    <>
      <div
        className="modal fade show d-block"
        id="kt_modal_activate_inbox"
        role="dialog"
        tabIndex={-1}
        aria-modal="true"
      >
        {/* begin::Modal dialog */}
        <div className="modal-dialog modal-dialog-centered ">
          {/* begin::Modal content */}
          <div className="modal-content">
            <InboxPreviewModalHeader
              setActivateModalOpen={setActivateModalOpen}
            />
            {/* begin::Modal body */}
            <div className="modal-body p-10">
              <ViewCanvas downloadUrl={downloadUrl} keyy={key} />
            </div>

            {/* end::Modal body */}
            <InboxPreviewModalFooter
              setActivateModalOpen={setActivateModalOpen}
              setRefresh={setRefresh}
              refresh={refresh}
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

export { InboxPreviewModal };
