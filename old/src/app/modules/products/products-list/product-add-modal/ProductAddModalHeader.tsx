import { KTIcon } from "../../../../../_metronic/helpers";
import { useIntl } from "react-intl";

interface ComponentProps {
  setAddModalOpen: (type: boolean) => void;
  editModalId: number;
}
const ProductAddModalHeader = ({
  setAddModalOpen,
  editModalId,
}: ComponentProps) => {
  const intl = useIntl();

  return (
    <div className="modal-header d-flex justify-content-between align-items-center bg-primary">
      {/* begin::Modal title */}
      <h2 className="fw-bolder mb-0 text-white">
        {editModalId != 0
          ? intl.formatMessage({ id: "Fields.ModalEditTitleProduct" })
          : intl.formatMessage({ id: "Fields.ModalNewTitleProduct" })}
      </h2>
      {/* begin::Close */}
      <div
        className="btn btn-icon btn-sm btn-active-icon-primary"
        data-kt-users-modal-action="close"
        onClick={() => setAddModalOpen(false)}
        style={{ cursor: "pointer" }}
      >
        <KTIcon iconName="cross" className="fs-1 text-white" />
      </div>
    </div>
  );
};

export { ProductAddModalHeader };
