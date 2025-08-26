import { useState } from "react";
import { KTIcon } from "../../../../helpers";
import { useLayout } from "../../../core";
import { useIntl } from "react-intl";

interface Props {
  setAddModalOpen: boolean;
  setValidateModalOpen: boolean;
}
const ToolbarQuote = ({ setAddModalOpen, setValidateModalOpen }: Props) => {
  const { config } = useLayout();
  const [showCreateAppModal, setShowCreateAppModal] = useState<boolean>(false);
 
  const intl = useIntl();
  const currentItem = JSON.parse(localStorage.getItem("currentItem")!);
  return (
    <div className="d-flex align-items-center gap-2 gap-lg-3">
   
      {currentItem?.actions.canApprove && (
        <a
          href="#"
          onClick={() => setShowCreateAppModal(true)}
          className="btn btn-sm fw-bold btn-success d-flex align-items-center"
        >
          <i className="fa far fa-credit-card me-2 fs-2"></i>
          {intl.formatMessage({ id: "Fields.ActionApproveOrDecline" })}
        </a>
      )}
      <a
        href="#"
        onClick={() => setShowCreateAppModal(true)}
        className="btn btn-sm fw-bold btn-primary d-flex align-items-center"
      >
        <KTIcon iconName="plus" className="fs-1" />
        {intl.formatMessage({ id: "Menu.AddNewQuote" })}
      </a>
    </div>
  );
};

export { ToolbarQuote };
