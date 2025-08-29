import { KTIcon } from "../../../../../_metronic/helpers";
import { useIntl } from "react-intl";
import Tippy from "@tippyjs/react";
import { useAuth } from "../../../auth";
import * as Tooltip from "@radix-ui/react-tooltip";
interface ToolbarProps {
  totalRows: number;
  setAddModalOpen: (type: boolean) => void;
  setEditModalId: (type: number) => void;
}

const QuoteToolbar = ({
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

  const auth = useAuth();
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
      {!auth.currentUser?.result.isAnonymousUser && (
        <Tooltip.Provider delayDuration={0}>
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <button
                type="button"
                className="btn btn-primary mb-3"
                onClick={openAddQuoteModal}
              >
                <KTIcon iconName="plus" className="fs-1" />
                {intl.formatMessage({ id: "Fields.ActionNew" })}
              </button>
            </Tooltip.Trigger>

            <Tooltip.Portal>
              <Tooltip.Content side="top" className="app-tooltip">
                {intl.formatMessage({
                  id: "Fields.ToolTipNew",
                })}
                <Tooltip.Arrow className="app-tooltip-arrow" />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        </Tooltip.Provider>
      )}
    </div>
  );
};

export { QuoteToolbar };
