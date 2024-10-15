import { KTIcon } from "../../../../../../../_metronic/helpers";
import { useIntl } from "react-intl";
import { Tooltip } from "@chakra-ui/react";
interface ToolbarProps {
  totalRows: number;
  setAddModalOpen: (type: boolean) => void;
}

const LedgerListToolbar = ({ totalRows, setAddModalOpen }: ToolbarProps) => {
  const openAddUserModal = () => {
    setAddModalOpen(true);
  };
  const intl = useIntl();
  return (
    <div
      className="d-flex justify-content-between align-items-center"
      data-kt-user-table-toolbar="base"
    >
      {/* <VatListFilter /> */}
      <h5 className="ms-5 text-muted">
        {intl
          .formatMessage({ id: "Fields.SearchResultHeaderCount" })
          .replace("{0}", totalRows.toString())}
      </h5>

      {/* begin::Add ledger account*/}
      <Tooltip
        label={intl.formatMessage({
          id: "Fields.ToolTipNew",
        })}
        fontSize="sm"
        className="bg-gray-800 text-white p-2 rounded "
        placement="top"
      >
        <button
          type="button"
          className="btn btn-primary mb-3"
          onClick={openAddUserModal}
        >
          <KTIcon iconName="plus" className="fs-2" />
          {intl.formatMessage({
            id: "Fields.ModalNewTitleNotificationCycle",
          })}
        </button>
      </Tooltip>
      {/* end::Add ledger account */}
    </div>
  );
};

export { LedgerListToolbar };
