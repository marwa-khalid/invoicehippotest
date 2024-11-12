import clsx from "clsx";
import { useEffect, useState } from "react";
import { KTIcon } from "../../../../helpers";
import { CreateAppModal, Dropdown1 } from "../../../../partials";
import { useLayout } from "../../../core";
import { useIntl } from "react-intl";

interface Props {
  setAddModalOpen: boolean;
  setValidateModalOpen: boolean;
}
const ToolbarQuote = ({ setAddModalOpen, setValidateModalOpen }: Props) => {
  const { config } = useLayout();
  const [showCreateAppModal, setShowCreateAppModal] = useState<boolean>(false);
  const daterangepickerButtonClass = config.app?.toolbar?.fixed?.desktop
    ? "btn-light"
    : "bg-body btn-color-gray-700 btn-active-color-primary";
  const intl = useIntl();
  const currentQuote = JSON.parse(localStorage.getItem("currentQuote")!);
  return (
    <div className="d-flex align-items-center gap-2 gap-lg-3">
      {/* <div className="m-0">
        <a
          href="#"
          className={clsx(
            "btn btn-sm btn-flex fw-bold",
            daterangepickerButtonClass
          )}
          data-kt-menu-trigger="click"
          data-kt-menu-placement="bottom-end"
        >
          <KTIcon iconName="filter" className="fs-6 text-muted me-1" />
        </a>
        <Dropdown1 />
      </div> */}
      {/* <div
        data-kt-daterangepicker="true"
        data-kt-daterangepicker-opens="left"
        className={clsx(
          "btn btn-sm fw-bold  d-flex align-items-center px-4",
          daterangepickerButtonClass
        )}
      >
        <KTIcon iconName="calendar-8" className="fs-1 ms-2 me-0" />
      </div>

      <a href="#" className="btn btn-sm btn-flex btn-light fw-bold">
        Filter
      </a> */}
      {currentQuote?.actions.canApprove && (
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
