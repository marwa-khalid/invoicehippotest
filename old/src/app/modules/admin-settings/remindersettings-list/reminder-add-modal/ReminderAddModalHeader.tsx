import { KTIcon } from "../../../../../_metronic/helpers";
import { useIntl } from "react-intl";

interface ComponentProps {
  setAddModalOpen: (type: boolean) => void;
  editModalId: number;
}
const ReminderAddModalHeader = ({
  setAddModalOpen,
  editModalId,
}: ComponentProps) => {
  const intl = useIntl();

  return (
    <div className="modal-header d-flex justify-content-between align-items-center bg-primary ">
      {/* begin::Modal title */}
      <h2 className="fw-bolder mb-0 text-white">
        {editModalId != 0
          ? intl.formatMessage({ id: "Fields.ModalEditTitleNotificationCycle" })
          : intl.formatMessage({ id: "Fields.ModalNewTitleNotificationCycle" })}
      </h2>
      {/* end::Modal title */}

      {/* begin::Close */}
      <div
        className="btn btn-icon btn-sm btn-active-icon-primary"
        data-kt-users-modal-action="close"
        onClick={() => setAddModalOpen(false)}
        style={{ cursor: "pointer" }}
      >
        <KTIcon iconName="cross" className="fs-1 text-white" />
      </div>
      {/* end::Close */}
    </div>
  );
};

export { ReminderAddModalHeader };
