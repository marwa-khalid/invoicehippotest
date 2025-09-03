import { KTIcon } from "../../../../../_metronic/helpers";
import { useIntl } from "react-intl";

interface ComponentProps {
  setAddModalOpen: any;
  editModalId: number;
}
const BudgetGroupsAddModalHeader = ({
  setAddModalOpen,
  editModalId,
}: ComponentProps) => {
  const intl = useIntl();

  return (
    <div className="modal-header d-flex justify-content-between align-items-center bg-primary ">
      {/* begin::Modal title */}
      <h2 className="fw-bolder mb-0 text-white">
        {editModalId != 0
          ? intl.formatMessage({ id: "Fields.ModalEditTitleBudgetGroup" })
          : intl.formatMessage({ id: "Fields.ModalNewTitleBudgetGroup" })}
      </h2>
      {/* begin::Close */}
      <div
        className="btn btn-icon btn-sm btn-active-icon-primary"
        data-kt-users-modal-action="close"
        onClick={() => setAddModalOpen()}
        style={{ cursor: "pointer" }}
      >
        <KTIcon iconName="cross" className="fs-1 text-white" />
      </div>
    </div>
  );
};

export { BudgetGroupsAddModalHeader };
