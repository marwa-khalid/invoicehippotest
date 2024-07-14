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
      <h3>
        {intl
          .formatMessage({ id: "Fields.SearchResultHeaderCount" })
          .replace("{0}", totalRows.toString())}
      </h3>

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
        {intl.formatMessage({ id: "Fields.ModalNewTitleVatType" })}
      </button>
      {/* end::Add user */}
    </div>
  );
};

export { VatListToolbar };
