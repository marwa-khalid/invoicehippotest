import { KTIcon } from "../../../../../_metronic/helpers";
import { useIntl } from "react-intl";

interface ToolbarProps {
  totalRows: number;
  setAddModalOpen: any;
  setEditModalId: (type: number) => void;
}

const VatListToolbar = ({
  totalRows,
  setAddModalOpen,
  setEditModalId,
}: ToolbarProps) => {
  const openAddModal = () => {
    setAddModalOpen(true);
    setEditModalId(0);
  };
  const intl = useIntl();
  return (
    <div
      className="d-flex justify-content-between align-items-center"
      data-kt-user-table-toolbar="base"
    >
      <h3>
        {intl
          .formatMessage({ id: "Fields.SearchResultHeaderCount" })
          .replace("{0}", totalRows.toString())}
      </h3>

      {/* begin::Add vat type */}
      <button
        type="button"
        className="btn btn-primary mb-3"
        onClick={openAddModal}
      >
        <KTIcon iconName="plus" className="fs-2" />
        {intl.formatMessage({ id: "Fields.ModalNewTitleVatType" })}
      </button>
      {/* end::Add vat type  */}
    </div>
  );
};

export { VatListToolbar };
