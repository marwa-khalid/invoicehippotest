import { KTIcon } from "../../../../../_metronic/helpers";
import { useIntl } from "react-intl";
import Tippy from "@tippyjs/react";
interface ToolbarProps {
  totalRows: number;
  setEditModalId: (type: number) => void;
  setAddModalOpen: (type: boolean) => void;
}

const ReminderListToolbar = ({
  totalRows,
  setAddModalOpen,
  setEditModalId,
}: ToolbarProps) => {
  const openNotificationModal = () => {
    setAddModalOpen(true);
    setEditModalId(0);
  };
  const intl = useIntl();
  return (
    <div
      className="d-flex justify-content-between align-items-center"
      data-kt-user-table-toolbar="base"
    >
      <h5 className="ms-5 text-muted">
        {intl
          .formatMessage({ id: "Fields.SearchResultHeaderCount" })
          .replace("{0}", totalRows.toString())}
      </h5>

      {/* begin::Add Reminder cycle*/}
      <Tippy
        content={intl.formatMessage({
          id: "Fields.ToolTipNew",
        })}
      >
        <button
          type="button"
          className="btn btn-primary mb-3"
          onClick={openNotificationModal}
        >
          <KTIcon iconName="plus" className="fs-2" />
          {intl.formatMessage({
            id: "Fields.ModalNewTitleNotificationCycle",
          })}
        </button>
      </Tippy>
      {/* end::Add Reminder cycle */}
    </div>
  );
};

export { ReminderListToolbar };
