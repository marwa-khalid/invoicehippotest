import { KTIcon } from "../../../../../_metronic/helpers";
import { useIntl } from "react-intl";

interface ComponentProps {
  setDeleteModalOpen: (type: boolean) => void;
}

const TemplatePublishModalHeader = ({ setDeleteModalOpen }: ComponentProps) => {
  const intl = useIntl();

  return (
    <div className="modal-header bg-info d-flex flex-column">
      {/* Modal title */}
      <div className="d-flex w-100 justify-content-between align-items-center">
        <h2 className="fw-bolder mb-0 text-white">
          {/* {intl.formatMessage({ id: "Fields.ModalDeleteTitleTranslation" })} */}
          Publish Template
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

export { TemplatePublishModalHeader };
