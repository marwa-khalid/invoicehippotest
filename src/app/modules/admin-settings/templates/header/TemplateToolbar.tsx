import { useIntl } from "react-intl";
import { KTIcon } from "../../../../../_metronic/helpers";
import Tippy from "@tippyjs/react";

interface ToolbarProps {
  totalRows: number;
  setEditModalId: (type: number) => void;
  setAddModalOpen: (type: boolean) => void;
}

const TemplateToolbar = ({
  totalRows,
  setEditModalId,
  setAddModalOpen,
}: ToolbarProps) => {
  const openAddLocalizationModal = () => {
    setEditModalId(0);
    setAddModalOpen(true);
  };
  const intl = useIntl();
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
            onClick={openAddLocalizationModal}
          >
            <KTIcon iconName="plus" className="fs-3" />
            {intl.formatMessage({ id: "Fields.ActionNew" })}
          </button>
        </Tippy>
      </div>
    </div>
  );
};

export { TemplateToolbar };
