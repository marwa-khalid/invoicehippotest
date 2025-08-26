import { useState } from "react";
import { CreateAppModal, Dropdown1 } from "../../../../partials";
import { useLayout } from "../../../core";
import { useLocation } from "react-router-dom";
import { KTIcon } from "../../../../helpers";
import { useIntl } from "react-intl";
interface props {
  onSubmit?: any;
}
const ToolbarSubscriber = ({ onSubmit }: props) => {
  const { config } = useLayout();
  const [showCreateAppModal, setShowCreateAppModal] = useState<boolean>(false);
  const location = useLocation();
  const intl = useIntl();
  return (
    <div className="d-flex align-items-center gap-2 gap-lg-3">
      <a
        onClick={() => setShowCreateAppModal(true)}
        className="btn btn-sm fw-bold btn-light"
      >
        Upgrade
      </a>
      <div className="m-0">
        <button
          className="btn btn-sm btn-flex btn-primary fw-bold"
          type="submit"
          onClick={() => onSubmit()}
        >
          Save Changes
        </button>
        <Dropdown1 />
      </div>

      <CreateAppModal
        show={showCreateAppModal}
        handleClose={() => setShowCreateAppModal(false)}
      />
    </div>
  );
};

export { ToolbarSubscriber };
