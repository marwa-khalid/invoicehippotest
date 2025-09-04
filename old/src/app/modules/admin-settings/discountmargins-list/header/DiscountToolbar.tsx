import { KTIcon } from "../../../../../_metronic/helpers";
import { useIntl } from "react-intl";
import Tippy from "@tippyjs/react";
interface ToolbarProps {
  totalRows: number;
  setAddModalOpen: (type: boolean) => void;
  deleteSelectedButton: boolean;
  setDeleteModalOpen: (type: boolean) => void;
}

const DiscountToolbar = ({
  totalRows,
  setAddModalOpen,
  deleteSelectedButton,
  setDeleteModalOpen,
}: ToolbarProps) => {
  const openAddModal = () => {
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

      {/* begin::Add product group */}
      {deleteSelectedButton ? (
        <button
          type="button"
          className="btn btn-danger mb-3"
          onClick={() => setDeleteModalOpen(true)}
        >
          {intl.formatMessage({
            id: "Fields.ActionDeleteMultiSelect",
          })}
        </button>
      ) : (
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
            {intl.formatMessage({ id: "Fields.ModalNewTitleDiscountMargin" })}
          </button>
        </Tippy>
      )}
      {/* end:: Add product group */}
    </div>
  );
};

export { DiscountToolbar };
