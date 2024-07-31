import { KTIcon } from "../../../../../../../_metronic/helpers";
import { useIntl } from "react-intl";

interface ToolbarProps {
  totalRows: number;
  setAddModalOpen: (type: boolean) => void;
}

const FinancialAccountsToolbar = ({
  totalRows,
  setAddModalOpen,
}: ToolbarProps) => {
  const openAddFinancialAccountModal = () => {
    setAddModalOpen(true);
  };
  const intl = useIntl();
  return (
    <div
      className="d-flex justify-content-between align-items-center mb-6"
      data-kt-user-table-toolbar="base"
    >
      <h5 className="ms-5 text-muted">
        {intl
          .formatMessage({ id: "Fields.SearchResultHeaderCount" })
          .replace("{0}", totalRows.toString())}
      </h5>

      {/* begin::Add financial account */}
      <button
        type="button"
        className="btn btn-primary mb-3"
        onClick={openAddFinancialAccountModal}
      >
        <KTIcon iconName="plus" className="fs-2" />
        {intl.formatMessage({ id: "Fields.ModalNewTitleUnitType" })}
      </button>
      {/* end:: Add financial account */}
    </div>
  );
};

export { FinancialAccountsToolbar };
