import { KTIcon } from "../../../../../_metronic/helpers";
import { useIntl } from "react-intl";

interface ComponentProps {
  setDeleteModalOpen: (type: boolean) => void;
  setDeleteModalId: (type: number[]) => void;
}

const BudgetDeleteModalHeader = ({
  setDeleteModalOpen,
  setDeleteModalId,
}: ComponentProps) => {
  const intl = useIntl();

  return (
    <div className="modal-header d-flex justify-content-between align-items-center bg-danger flex-column">
      <div className="d-flex w-100 justify-content-between align-items-center">
        {/* begin::Modal title */}
        <h2 className="fw-bolder mb-0 text-white">
          {intl.formatMessage({ id: "Fields.ModalDeleteTitleBudgetTopic" })}
        </h2>
        {/* end::Modal title */}

        {/* begin::Close */}
        <div
          className="btn btn-icon btn-sm btn-active-icon-primary"
          data-kt-users-modal-action="close"
          onClick={() => {
            setDeleteModalOpen(false);
            setDeleteModalId([]);
          }}
          style={{ cursor: "pointer" }}
        >
          <KTIcon iconName="cross" className="fs-1 text-white" />
        </div>
      </div>

      {/* end::Close */}
    </div>
  );
};

export { BudgetDeleteModalHeader };
