import { KTIcon } from "../../../../../../../_metronic/helpers";
import { useIntl } from "react-intl";
import { Tooltip } from "@chakra-ui/react";
interface ToolbarProps {
  totalRows: number;
  setAddModalOpen: (type: boolean) => void;
  setEditModalId: (type: number) => void;
}

const ClientToolbar = ({
  totalRows,
  setAddModalOpen,
  setEditModalId,
}: ToolbarProps) => {
  const intl = useIntl();
  return (
    <div
      className="d-flex justify-content-between align-items-center"
      data-kt-user-table-toolbar="base"
    >
      <h5 className="ms-5 text-muted">
        {intl
          .formatMessage({ id: "Fields.SearchResultHeaderCount" })
          .replace("{0}", totalRows.toString())}
      </h5>
      <div>
        {/* begin::Add new client */}
        <Tooltip
          label={intl.formatMessage({
            id: "Fields.ToolTipConnect",
          })}
          fontSize="sm"
          className="bg-gray-800 text-white p-2 rounded "
          placement="top"
        >
          <button type="button" className="btn btn-primary mb-3 me-2">
            <i className="ki-duotone ki-cloud-download fs-1">
              <span className="path1"></span>
              <span className="path2"></span>
            </i>
            {intl.formatMessage({ id: "Fields.ActionDownloadExcel" })}
          </button>
        </Tooltip>
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
              setAddModalOpen(true);
              setEditModalId(0);
            }}
          >
            <KTIcon iconName="plus" className="fs-1" />
            {intl.formatMessage({ id: "Fields.ModalNewTitleClient" })}
          </button>
        </Tooltip>
      </div>
      {/* end:: Add new client */}
    </div>
  );
};

export { ClientToolbar };
