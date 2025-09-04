import { KTIcon } from "../../../../../_metronic/helpers";
import { useIntl } from "react-intl";
import Tippy from "@tippyjs/react";
import { useAuth } from "../../../auth";
interface ToolbarProps {
  totalRows: number;
  setAttachmentsModalOpen: (type: boolean) => void;
}

const InboxToolbar = ({ totalRows, setAttachmentsModalOpen }: ToolbarProps) => {
  const openAddQuoteModal = () => {
    localStorage.removeItem("contactResponse");
    localStorage.removeItem("clientResponse");
    setAttachmentsModalOpen(true);
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
              <i className="fa-solid fa-cloud-arrow-up fs-1"></i>
              upload
            </button>
          </Tippy>
        </div>
      )}
    </div>
  );
};

export { InboxToolbar };
