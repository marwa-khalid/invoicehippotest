import { KTIcon } from "../../../../../../../_metronic/helpers";
import { useIntl } from "react-intl";
import Tippy from "@tippyjs/react";
import { useAuth } from "../../../../../auth";
interface ToolbarProps {
  totalRows: number;
  setEditModalId: (type: number) => void;
  setAddModalOpen: (type: boolean) => void;
}

const RuleToolbar = ({
  totalRows,
  setEditModalId,
  setAddModalOpen,
}: ToolbarProps) => {
  const openAddModal = () => {
    setEditModalId(0);
    setAddModalOpen(true);
    localStorage.removeItem("ModalData");
  };
  const intl = useIntl();
  const auth = useAuth();
  return (
    <div
      className="d-flex justify-content-between align-items-center mb-5"
      data-kt-user-table-toolbar="base"
    >
      <h5 className="ms-5 text-muted">
        {intl
          .formatMessage({ id: "Fields.SearchResultHeaderCount" })
          .replace("{0}", totalRows.toString())}
      </h5>
      <div className="d-flex flex-end gap-3 mb-3">
        <Tippy
          content={intl.formatMessage({
            id: "Fields.ToolTipNew",
          })}
        >
          <button
            type="button"
            className="btn btn-primary"
            onClick={openAddModal}
          >
            <KTIcon iconName="plus" className="fs-3" />
            {intl.formatMessage({ id: "Fields.ActionNew" })}
          </button>
        </Tippy>
      </div>
    </div>
  );
};

export { RuleToolbar };
