import { KTIcon } from "../../../../../_metronic/helpers";
import { useIntl } from "react-intl";
import Tippy from "@tippyjs/react";
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
      <Tippy
        content={intl.formatMessage({
          id: "Fields.ToolTipNew",
        })}
      >
        <button
          type="button"
          className="btn btn-primary mb-3"
          onClick={openAddUserModal}
        >
          <KTIcon iconName="plus" className="fs-2" />
          {intl.formatMessage({ id: "Fields.ModalNewTitleLedgerAccount" })}
        </button>
      </Tippy>
      {/* end::Add ledger account */}
    </div>
  );
};

export { LedgerListToolbar };
