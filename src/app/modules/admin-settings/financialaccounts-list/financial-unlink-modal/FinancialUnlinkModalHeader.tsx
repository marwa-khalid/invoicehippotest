import { KTIcon } from "../../../../../_metronic/helpers";
import { useIntl } from "react-intl";

interface ComponentProps {
  setDeleteModalOpen: (type: boolean) => void;
}

const FinancialUnlinkModalHeader = ({ setDeleteModalOpen }: ComponentProps) => {
  const intl = useIntl();

  return (
    <div className="modal-header d-flex justify-content-between align-items-center bg-danger ">
      {/* begin::Modal title */}
      <h2 className="fw-bolder mb-0 text-white">
        {intl.formatMessage({
          id: "Fields.ModalRemoveSyncConsensusTitleFinancialAccount",
        })}
      </h2>
      {/* end::Modal title */}

      {/* begin::Close */}
      <div
        className="btn btn-icon btn-sm btn-active-icon-primary"
        data-kt-users-modal-action="close"
        onClick={() => setDeleteModalOpen(false)}
        style={{ cursor: "pointer" }}
      >
        <KTIcon iconName="cross" className="fs-1 text-white" />
      </div>
      {/* end::Close */}
    </div>
  );
};

export { FinancialUnlinkModalHeader };
