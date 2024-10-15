import { KTIcon } from "../../../../../../../_metronic/helpers";
import { useIntl } from "react-intl";
import { Tooltip } from "@chakra-ui/react";
interface ToolbarProps {
  totalRows: number;
  setAddModalOpen: (type: boolean) => void;
  deleteSelectedButton: boolean;
  setDeleteModalOpen: (type: boolean) => void;
  setEditModalId: (type: number) => void;
}

const ProductGroupsToolbar = ({
  totalRows,
  setAddModalOpen,
  deleteSelectedButton,
  setDeleteModalOpen,
  setEditModalId,
}: ToolbarProps) => {
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
        <Tooltip
          label={intl.formatMessage({
            id: "Fields.ToolTipNew",
          })}
          fontSize="sm"
          className="bg-gray-800 text-white p-2 rounded "
          placement="top"
        >
          <button
            type="button"
            className="btn btn-primary mb-3"
            onClick={() => {
              setEditModalId(0);
              setAddModalOpen(true);
            }}
          >
            <KTIcon iconName="plus" className="fs-2" />
            {intl.formatMessage({ id: "Fields.ModalNewTitleProductGroup" })}
          </button>
        </Tooltip>
      )}
      {/* end:: Add product group */}
    </div>
  );
};

export { ProductGroupsToolbar };
