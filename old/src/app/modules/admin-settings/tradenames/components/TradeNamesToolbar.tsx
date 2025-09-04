import { KTIcon } from "../../../../../_metronic/helpers";
import { useIntl } from "react-intl";
import Tippy from "@tippyjs/react";
interface ToolbarProps {
  totalRows: number;
  setAddModalOpen: (type: boolean) => void;
  setTradeNameId: (type: number) => void;
}

const TradeNamesToolbar = ({
  totalRows,
  setAddModalOpen,
  setTradeNameId,
}: ToolbarProps) => {
  const openAddModal = () => {
    setTradeNameId(0);
    setAddModalOpen(true);
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

      <Tippy
        content={intl.formatMessage({
          id: "Fields.ToolTipNew",
        })}
      >
        <button
          type="button"
          className="btn btn-primary mb-3"
          onClick={openAddModal}
        >
          <KTIcon iconName="plus" className="fs-2" />
          {intl.formatMessage({ id: "Fields.ActionNew" })}
        </button>
      </Tippy>
    </div>
  );
};

export { TradeNamesToolbar };
