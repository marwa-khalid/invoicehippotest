import { KTIcon } from "../../../../../../../_metronic/helpers";
import { useIntl } from "react-intl";
import Tippy from "@tippyjs/react";
import { useAuth } from "../../../../../auth";
interface ToolbarProps {
  totalRows: number;
  itemsCount: number;
  setEditModalId: (type: number) => void;
  setLinkModalOpen: (type: boolean) => void;
  setAutoProcessModalOpen: (type: boolean) => void;
}

const TransactionToolbar = ({
  totalRows,
  itemsCount,
  setEditModalId,
  setLinkModalOpen,
  setAutoProcessModalOpen,
}: ToolbarProps) => {
  const openLinkBankAccountModal = () => {
    setLinkModalOpen(true);
  };
  const openAutoProcessModal = () => {
    setAutoProcessModalOpen(true);
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
        {itemsCount > 0 && (
          <Tippy
            content={intl.formatMessage({
              id: "Fields.ActionAutoRoute",
            })}
          >
            <button
              type="button"
              className="btn btn-dark"
              onClick={openAutoProcessModal}
            >
              <i className="fa-solid fa-robot text-white fs-3" />

              {intl.formatMessage({
                id: "Fields.ActionAutoRoute",
              })}
            </button>
          </Tippy>
        )}
        <Tippy
          content={intl.formatMessage({
            id: "Fields.ToolTipConnect",
          })}
        >
          <button
            type="button"
            className="btn btn-primary"
            onClick={openLinkBankAccountModal}
          >
            <i className="fas fa-wifi fs-3" />

            {intl.formatMessage({ id: "Fields.ActionLinkFinancialAccounts" })}
          </button>
        </Tippy>

        <Tippy
          content={intl.formatMessage({
            id: "Fields.ToolTipNew",
          })}
        >
          <button
            type="button"
            className="btn btn-primary"
            // onClick={openAddQuoteModal}
          >
            <KTIcon iconName="plus" className="fs-3" />
            {intl.formatMessage({ id: "Fields.ActionNew" })}
          </button>
        </Tippy>
      </div>
    </div>
  );
};

export { TransactionToolbar };
