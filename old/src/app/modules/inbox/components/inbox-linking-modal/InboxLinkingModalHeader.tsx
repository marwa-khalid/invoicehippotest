import { KTIcon } from "../../../../../_metronic/helpers";
import { useIntl } from "react-intl";
import { InboxListResult } from "../core/_models";

interface ComponentProps {
  setLinkingModalOpen: (type: boolean) => void;
  inboxDetail: InboxListResult;
}

const InboxLinkingModalHeader = ({
  setLinkingModalOpen,
  inboxDetail,
}: ComponentProps) => {
  const intl = useIntl();

  return (
    <div className="modal-header bg-primary d-flex flex-column">
      {/* Modal title */}
      <div className="d-flex w-100 justify-content-between align-items-center">
        <h2 className="fw-bolder mb-0 text-white">
          {intl.formatMessage({
            id: "Fields.ModalInboxAttachOrProcessAsBooking",
          })}
        </h2>
        <div
          className="btn btn-icon btn-sm btn-active-icon-primary"
          data-kt-users-modal-action="close"
          onClick={() => {
            setLinkingModalOpen(false);
            localStorage.removeItem("ModalData");
          }}
          style={{ cursor: "pointer" }}
        >
          <KTIcon iconName="cross" className="fs-1 text-white" />
        </div>
      </div>

      {/* New table below the title */}
      <div className="w-100 mt-3" style={{ lineHeight: "0.5" }}>
        <table className="table text-white mt-0">
          <tbody>
            <tr className="my-0">
              <td className="fw-bold">
                {intl.formatMessage({ id: "Fields.DateOfUpload" })}
              </td>
              <td>: {inboxDetail?.dateOfUpload}</td>
            </tr>
            <tr>
              <td className="fw-bold">
                {intl.formatMessage({ id: "Fields.FileName" })}
              </td>
              <td>: {inboxDetail?.archiveTitle}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export { InboxLinkingModalHeader };
