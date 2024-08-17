import { useEffect } from "react";
import { useIntl } from "react-intl";
import { KTIcon } from "../../../../../../../_metronic/helpers";
interface ComponentProps {
  setIsUpgradeAvailable: (type: boolean) => void;
}
const UpgradeModal = ({ setIsUpgradeAvailable }: ComponentProps) => {
  const intl = useIntl();
  const handleUpgrade = () => {
    window.location.href = "/dashboard"; // Replace with your upgrade page URL
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
      <div className="modal-dialog modal-dialog-centered mw-400px">
        <div className="modal-content">
          <div className="modal-header d-flex justify-content-between align-items-center bg-primary ">
            <h2 className="fw-bolder mb-0 text-white">No Access</h2>
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
            You do not have access to create new users.
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
                className="btn btn-primary"
                type="submit"
              >
                {/* {intl.formatMessage({ id: "Fields.UpgradeNow" })} */}
                Upgrade
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export { UpgradeModal };
