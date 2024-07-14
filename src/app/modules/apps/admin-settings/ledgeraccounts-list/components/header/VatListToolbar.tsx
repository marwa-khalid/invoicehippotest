import { KTIcon } from "../../../../../../../_metronic/helpers";
import { useListView } from "../../core/ListViewProvider";
// import { VatListFilter } from "./VatListFilter";
import { useIntl } from "react-intl";

interface ToolbarProps {
  totalRows: number;
}

const VatListToolbar = ({ totalRows }: ToolbarProps) => {
  const { setItemIdForUpdate } = useListView();
  const openAddUserModal = () => {
    setItemIdForUpdate(null);
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

      {/* begin::Export */}
      {/* <button type="button" className="btn btn-light-primary me-3">
        <KTIcon iconName="exit-up" className="fs-2" />
        Export
      </button> */}
      {/* end::Export */}

      {/* begin::Add user */}
      <button
        type="button"
        className="btn btn-primary mb-3"
        onClick={openAddUserModal}
      >
        <KTIcon iconName="plus" className="fs-2" />
        {intl.formatMessage({ id: "Fields.ModalNewTitleLedgerAccount" })}
      </button>
      {/* end::Add user */}
    </div>
  );
};

export { VatListToolbar };
