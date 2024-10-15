import { KTIcon } from "../../../../../../../_metronic/helpers";
import { useIntl } from "react-intl";
import { Tooltip } from "@chakra-ui/react";
interface ToolbarProps {
  totalRows: number;
  setAddModalOpen: (type: boolean) => void;
  setEditModalId: (type: number) => void;
}

const FinancialAccountsToolbar = ({
  totalRows,
  setAddModalOpen,
  setEditModalId,
}: ToolbarProps) => {
  const openAddQuoteModal = () => {
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
      <div>
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
            onClick={openAddQuoteModal}
          >
            <KTIcon iconName="plus" className="fs-1" />
            {intl.formatMessage({ id: "Fields.ActionNew" })}
          </button>
        </Tooltip>
      </div>
    </div>
  );
};

export { FinancialAccountsToolbar };
