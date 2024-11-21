import { KTIcon } from "../../../../../../../_metronic/helpers";
import { useIntl } from "react-intl";
import { Tooltip } from "@chakra-ui/react";
import Tippy from "@tippyjs/react";
interface ToolbarProps {
  totalRows: number;
  setAddModalOpen: (type: boolean) => void;
  setLinkModalOpen: (type: boolean) => void;
}

const FinancialAccountsToolbar = ({
  totalRows,
  setAddModalOpen,
  setLinkModalOpen,
}: ToolbarProps) => {
  const openAddFinancialAccountModal = () => {
    setAddModalOpen(true);
  };

  const openLinkBankAccountModal = () => {
    setLinkModalOpen(true);
  };
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
        {/* begin::Add financial account */}
        <Tippy
          content={intl.formatMessage({
            id: "Fields.ToolTipConnect",
          })}
        >
          <button
            type="button"
            className="btn btn-primary mb-3 me-2"
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
            className="btn btn-primary mb-3"
            onClick={openAddFinancialAccountModal}
          >
            <KTIcon iconName="plus" className="fs-1" />
            {intl.formatMessage({ id: "Fields.ModalNewTitleFinancialAccount" })}
          </button>
        </Tippy>
      </div>
      {/* end:: Add financial account */}
    </div>
  );
};

export { FinancialAccountsToolbar };
