import { KTIcon } from "../../../../../_metronic/helpers";
import { useIntl } from "react-intl";

interface ComponentProps {
  setAddModalOpen: (type: boolean) => void;
  setEditModalId: (type: number) => void;
}

const LocalizationAddModalHeader = ({
  setAddModalOpen,
  setEditModalId,
}: ComponentProps) => {
  const intl = useIntl();
  const closeModal = () => {
    setEditModalId(0);
    setAddModalOpen(false);
  };
  return (
    <div className="modal-header d-flex flex-column bg-primary pb-3">
      <div className="d-flex flex-column align-items-center w-100">
        <div className="d-flex justify-content-between align-items-center w-100 mt-2">
          <div>
            <h2 className="fw-bold text-white">
              {intl.formatMessage({
                id: "Fields.ModalEditTitleTranslation",
              })}
            </h2>
          </div>
          {/* Close Button */}
          <div
            className="btn btn-icon btn-sm btn-active-icon-primary"
            onClick={closeModal}
            style={{ cursor: "pointer" }}
          >
            <KTIcon iconName="cross" className="fs-2x text-white mt-2" />
          </div>
        </div>
      </div>

      <div className="separator border-white mt-3"></div>
    </div>
  );
};

export { LocalizationAddModalHeader };
