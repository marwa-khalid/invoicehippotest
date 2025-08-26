import { KTIcon } from "../../../../../_metronic/helpers";
import { useIntl } from "react-intl";

interface ComponentProps {
  setActivateModalOpen: (type: boolean) => void;
}

const InboxPreviewModalHeader = ({ setActivateModalOpen }: ComponentProps) => {
  const intl = useIntl();

  const parsedData = JSON.parse(localStorage.getItem("ModalData")!);

  return (
    <div className="modal-header bg-info d-flex flex-column">
      {/* Modal title */}
      <div className="d-flex w-100 justify-content-between align-items-center">
        <h2 className="fw-bolder mb-0 text-white">
          {intl.formatMessage({ id: "Fields.preview" })}
        </h2>
        <div
          className="btn btn-icon btn-sm btn-active-icon-primary"
          data-kt-users-modal-action="close"
          onClick={() => {
            setActivateModalOpen(false);
            localStorage.removeItem("ModalData");
          }}
          style={{ cursor: "pointer" }}
        >
          <KTIcon iconName="cross" className="fs-1 text-white" />
        </div>
      </div>
    </div>
  );
};

export { InboxPreviewModalHeader };
