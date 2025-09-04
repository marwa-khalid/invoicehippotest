import { KTIcon } from "../../../../../_metronic/helpers";
import { useIntl } from "react-intl";
import { useState } from "react";
import { CustomAlertModal } from "./CustomAlertModal";

interface ComponentProps {
  setAddModalOpen: (type: boolean) => void;
  businessName: string;
  customerNr: string;
}
const ClientAddModalHeader = ({
  setAddModalOpen,
  customerNr,
  businessName,
}: ComponentProps) => {
  const intl = useIntl();
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="modal-header d-flex flex-column bg-primary pb-3 ">
      {showModal && (
        <CustomAlertModal
          show={showModal}
          onClose={() => setShowModal(false)}
        />
      )}
      {/* Modal title */}
      <div className="fv-row col-12 d-flex flex-row justify-content-between align-items-center mb-0">
        <div className="gap-2">
          <div>
            {businessName ? (
              <h3 className="fw-bolder mb-0 text-white">
                {intl.formatMessage({ id: "Fields.ModalEditTitleClient" })}
              </h3>
            ) : (
              <h2 className="fw-bolder mb-0 text-white">
                {intl.formatMessage({ id: "Fields.ModalNewTitleClient" })}
              </h2>
            )}
          </div>
          <div>
            {businessName && (
              <small className="text-gray-300 me-2 fw-bold">
                {customerNr} - {businessName}
              </small>
            )}
          </div>
        </div>
        {/* Close */}
        <div
          className="btn btn-icon btn-sm btn-active-icon-primary"
          onClick={() => {
            setAddModalOpen(false);
          }}
          style={{ cursor: "pointer" }}
        >
          <KTIcon iconName="cross" className="fs-1 text-white" />
        </div>
      </div>
    </div>
  );
};

export { ClientAddModalHeader };
