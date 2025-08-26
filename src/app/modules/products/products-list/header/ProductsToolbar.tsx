import { KTIcon } from "../../../../../_metronic/helpers";
import { useIntl } from "react-intl";
import Tippy from "@tippyjs/react";
interface ToolbarProps {
  totalRows: number;
  setAddModalOpen: (type: boolean) => void;
  setEditModalId: (type: number) => void;
}

const ProductsToolbar = ({
  totalRows,
  setAddModalOpen,
  setEditModalId,
}: ToolbarProps) => {
  const openAddProductModal = () => {
    localStorage.removeItem("contactResponse");
    localStorage.removeItem("clientResponse");
    setAddModalOpen(true);
    setEditModalId(0);
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

      <Tippy
        content={intl.formatMessage({
          id: "Fields.ToolTipNew",
        })}
      >
        <button
          type="button"
          className="btn btn-primary mb-3"
          onClick={() => {
            openAddProductModal();
          }}
        >
          <KTIcon iconName="plus" className="fs-2" />
          {intl.formatMessage({ id: "Fields.ModalNewTitleProduct" })}
        </button>
      </Tippy>
    </div>
  );
};

export { ProductsToolbar };
