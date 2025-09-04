import { useEffect } from "react";
import { useIntl } from "react-intl";
import { KTIcon } from "../../../_metronic/helpers";
interface ComponentProps {
  setIsUpgradeAvailable: (type: boolean) => void;
  description: string;
}
const LimitationModal = ({
  setIsUpgradeAvailable,
  description,
}: ComponentProps) => {
  const intl = useIntl();
  const handleUpgrade = () => {
    window.location.href = "/dashboard";
  };
  useEffect(() => {
    document.body.classList.add("modal-open");
    return () => {
      document.body.classList.remove("modal-open");
    };
  }, []);

  return (
    <div
      className="modal fade show d-block"
      id="kt_modal_add_user"
      role="dialog"
      tabIndex={-1}
      aria-modal="true"
    >
      <div className="modal-dialog modal-dialog-centered mw-550px ">
        <div className="modal-content">
          <div className="modal-header d-flex justify-content-between align-items-center bg-warning">
            <h2 className="fw-bolder mb-0 text-white">
              {intl.formatMessage({ id: "Fields.ModalUsageMaxTitle" })}
            </h2>
            <div
              className="btn btn-icon btn-sm btn-active-icon-primary"
              data-kt-users-modal-action="close"
              onClick={() => setIsUpgradeAvailable(false)}
              style={{ cursor: "pointer" }}
            >
              <KTIcon iconName="cross" className="fs-1 text-white" />
            </div>
          </div>
          <div className="modal-body">
            <div
              className="row alert alert-custom alert-default align-items-center mt-8 mx-0"
              style={{ backgroundColor: "#fff8dc" }}
              role="alert"
            >
              <div className="alert-icon col-1 me-4">
                <i className="ki-duotone ki-information-4 fs-3x text-center text-warning">
                  <span className="path1"></span>
                  <span className="path2"></span>
                  <span className="path3"></span>
                </i>
              </div>
              <div className="alert-text col-10">
                <p className="my-0 p-3">{description}</p>
              </div>
            </div>
          </div>

          <div className="modal-footer d-flex justify-content-end align-items-center ">
            <div className="d-flex">
              <button
                className="btn btn-secondary me-3"
                onClick={() => setIsUpgradeAvailable(false)}
              >
                {intl.formatMessage({ id: "Fields.ActionCancel" })}
              </button>
              <button
                onClick={handleUpgrade}
                className="btn btn-warning"
                type="submit"
              >
                {intl.formatMessage({ id: "Fields.ActionUpgrade" })}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export { LimitationModal };
