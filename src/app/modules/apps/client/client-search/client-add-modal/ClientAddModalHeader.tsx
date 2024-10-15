import { toast } from "react-toastify";
import { KTIcon } from "../../../../../../_metronic/helpers";
import { useIntl } from "react-intl";
import { useState } from "react";

interface ComponentProps {
  setAddModalOpen: (type: boolean) => void;
  businessName: string;
  customerNr: string;
  disableTabs: boolean;
  hideTab4: boolean;
}
const ClientAddModalHeader = ({
  setAddModalOpen,
  customerNr,
  businessName,
  disableTabs,
  hideTab4,
}: ComponentProps) => {
  const intl = useIntl();
  const [showModal, setShowModal] = useState(false);
  const showDisabledTabToast = () => {
    setShowModal(true);
  };
  const handleTabClick = (e: any, isDisabled: boolean) => {
    if (isDisabled) {
      e.preventDefault(); // Prevent navigation
      showDisabledTabToast(); // Show toast message
    }
  };

  const CustomAlertModal: React.FC<{ show: boolean; onClose: () => void }> = ({
    show,
    onClose,
  }) => {
    if (!show) return null;

    return (
      <div
        className="modal fade show d-block"
        tabIndex={-1}
        style={{ display: "block" }}
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside the modal from closing it
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content w-450px">
            <div className="modal-body bg-light-warning">
              <div className="alert alert-dismissible bg-light-warning d-flex flex-center flex-column ">
                <button
                  type="button"
                  className="btn-close "
                  onClick={onClose}
                ></button>
              
                <span className="svg-icon svg-icon-5tx svg-icon-warning mb-5">
                  <i className="ki-duotone ki-information-3 text-warning fs-3x">
                    <span className="path1"></span>
                    <span className="path2"></span>
                    <span className="path3"></span>
                  </i>
                </span>

                <div className="text-center">
                  <div className="separator separator-dashed border-warning opacity-25 mb-5"></div>

                  <div className="mb-5">
                    Please complete <strong>Step 1: Client Settings</strong> in
                    order to proceed to the next step.
                  </div>
                  <div className="d-flex flex-center flex-wrap">
                    <a href="#" className="btn btn-warning" onClick={onClose}>
                      Ok, I got it
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="modal-header d-flex flex-column bg-primary pb-3 ">
      <CustomAlertModal show={showModal} onClose={() => setShowModal(false)} />
      {/* Modal title */}
      <div className="fv-row col-12 d-flex flex-row justify-content-between align-items-center mb-0">
        <div className="d-flex gap-4">
          {businessName ? (
            <h3 className=" mb-0 text-gray-300">
              {intl.formatMessage({ id: "Fields.ModalEditTitleClient" })}
            </h3>
          ) : (
            <h2 className="fw-bolder mb-0 text-white">
              {intl.formatMessage({ id: "Fields.ModalNewTitleClient" })}
            </h2>
          )}
          {businessName && (
            <h2 className="text-white me-2">
              ({customerNr} - {businessName})
            </h2>
          )}
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
      <ul
        style={{ borderBottom: "0" }}
        className="modal-header fv-row col-12 nav nav-tabs nav-line-tabs nav-line-tabs-2x p-0 fs-5 mt-4 d-flex justify-content-around text-white"
      >
        <li className="nav-item flex-fill text-center">
          <a
            className="nav-link active d-flex align-items-center justify-content-center"
            data-bs-toggle="tab"
            href="#kt_tab_pane_4"
          >
            <i className="ki-duotone ki-user fs-2 text-white me-2">
              <span className="path1"></span>
              <span className="path2"></span>
              <span className="path3"></span>
            </i>
            <span className="text-white">
              {intl.formatMessage({ id: "Fields.ClientSettings" })}
            </span>
          </a>
        </li>

        {/* Contact Person Settings Tab */}
        <li className="nav-item flex-fill text-center">
          <a
            className={`nav-link d-flex align-items-center justify-content-center ${
              disableTabs ? "disabled-tab" : ""
            }`}
            data-bs-toggle={disableTabs ? "" : "tab"}
            href={disableTabs ? "#kt_tab_pane_4" : "#kt_tab_pane_5"} // Prevent navigation when disabled
            onClick={(e) => handleTabClick(e, disableTabs)}
          >
            <i className="ki-duotone ki-people fs-1 text-white me-2">
              <span className="path1"></span>
              <span className="path2"></span>
              <span className="path3"></span>
              <span className="path4"></span>
              <span className="path5"></span>
            </i>
            <span
              className={` ${disableTabs ? "text-gray-400" : "text-white"}`}
            >
              {intl.formatMessage({ id: "Fields.ContactPersonSettings" })}
            </span>
          </a>
        </li>

        {/* overige instellingen Tab */}
        <li className="nav-item flex-fill text-center">
          <a
            className={`nav-link d-flex align-items-center justify-content-center ${
              disableTabs ? "disabled-tab" : ""
            }`}
            data-bs-toggle={disableTabs ? "" : "tab"}
            href={disableTabs ? "#kt_tab_pane_4" : "#kt_tab_pane_6"}
            onClick={(e) => handleTabClick(e, disableTabs)}
          >
            <i className="ki-duotone ki-bank fs-1 text-white me-2">
              <span className="path1"></span>
              <span className="path2"></span>
            </i>
            <span
              className={` ${disableTabs ? "text-gray-400" : "text-white"}`}
            >
              overige instellingen
            </span>
          </a>
        </li>

        {/* Custom Features Tab */}
        {!hideTab4 && (
          <li className="nav-item flex-fill text-center">
            <a
              className={`nav-link d-flex align-items-center justify-content-center ${
                disableTabs ? "disabled-tab" : ""
              }`}
              data-bs-toggle={disableTabs ? "" : "tab"}
              href={disableTabs ? "#kt_tab_pane_4" : "#kt_tab_pane_7"}
              onClick={(e) => handleTabClick(e, disableTabs)}
            >
              <i className="ki-duotone ki-information-4 fs-1 text-white me-2">
                <span className="path1"></span>
                <span className="path2"></span>
                <span className="path3"></span>
              </i>
              <span
                className={` ${disableTabs ? "text-gray-400" : "text-white"}`}
              >
                {intl.formatMessage({ id: "Fields.SideMenuCustomFeatures" })}
              </span>
            </a>
          </li>
        )}
      </ul>
    </div>
  );
};

export { ClientAddModalHeader };
