import { KTIcon } from "../../../../../../../_metronic/helpers";
import { useIntl } from "react-intl";
import { Tooltip } from "@chakra-ui/react";
import Tippy from "@tippyjs/react";
import { useAuth } from "../../../../../auth";
interface ToolbarProps {
  totalRows: number;
  setAddModalOpen: (type: boolean) => void;
  setEditModalId: (type: number) => void;
}

const FinancialAccountsToolbar = ({
  totalRows,
  setAddModalOpen,
  setEditModalId,
}: ToolbarProps) => {
  const openAddQuoteModal = () => {
    localStorage.removeItem("contactResponse");
    localStorage.removeItem("clientResponse");
    setAddModalOpen(true);
    setEditModalId(0);
  };

  const intl = useIntl();
  const auth = useAuth();
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
      {!auth.currentUser?.result.isAnonymousUser && (
        <div>
          <Tippy
            content={intl.formatMessage({
              id: "Fields.ToolTipNew",
            })}
          >
            <button
              type="button"
              className="btn btn-primary mb-3"
              onClick={openAddQuoteModal}
            >
              <KTIcon iconName="plus" className="fs-1" />
              {intl.formatMessage({ id: "Fields.ActionNew" })}
            </button>
          </Tippy>
        </div>
      )}
    </div>
  );
};

export { FinancialAccountsToolbar };
