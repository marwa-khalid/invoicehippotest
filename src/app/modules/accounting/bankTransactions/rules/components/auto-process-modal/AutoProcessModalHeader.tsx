import { KTIcon } from "../../../../../../../_metronic/helpers";
import { useIntl } from "react-intl";

interface ComponentProps {
  setDeleteModalOpen: (type: boolean) => void;
  itemsCount: number;
}

const AutoProcessModalHeader = ({
  setDeleteModalOpen,
  itemsCount,
}: ComponentProps) => {
  const intl = useIntl();

  return (
    <div className="modal-header bg-primary d-flex flex-column">
      {/* Modal title */}
      <div className="d-flex w-100 justify-content-between align-items-center">
        <h2 className="fw-bolder mb-0 text-white">
          {intl
            .formatMessage({ id: "Fields.ModalAutoRouteTransactionsTitle" })
            .replace("{0}", itemsCount.toString())}
        </h2>
        <div
          className="btn btn-icon btn-sm btn-active-icon-primary"
          data-kt-users-modal-action="close"
          onClick={() => {
            setDeleteModalOpen(false);
          }}
          style={{ cursor: "pointer" }}
        >
          <KTIcon iconName="cross" className="fs-1 text-white" />
        </div>
      </div>
    </div>
  );
};

export { AutoProcessModalHeader };
