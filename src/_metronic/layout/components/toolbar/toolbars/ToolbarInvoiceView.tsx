import { KTIcon } from "../../../../helpers";
import { useIntl } from "react-intl";
import { useAuth } from "../../../../../app/modules/auth";
interface props {
  invoiceData?: any;
}
const ToolbarInvoiceView = ({ invoiceData }: props) => {
  const intl = useIntl();
  const auth = useAuth();
  return (
    <div className="d-flex align-items-center gap-2 gap-lg-3">
      {invoiceData?.actions.canInvokeOnlinePayment && (
        <button
          className="btn btn-success btn-sm"
          onClick={() => invoiceData?.getPayOnlineUrl()}
        >
          {invoiceData?.spinner ? (
            <span className="indicator-progress" style={{ display: "block" }}>
              {intl.formatMessage({ id: "Common.Busy" })}
              <span className="spinner-border spinner-border-sm align-middle ms-2"></span>
            </span>
          ) : (
            <>
              {
                auth.currentUser?.result.activeCompanyDefaults.defaultValuta
                  .sign
              }{" "}
              {intl.formatMessage({
                id: "Fields.ActionInvokeOnlinePayment",
              })}
            </>
          )}
        </button>
      )}

      {!auth.currentUser?.result.isAnonymousUser &&
        invoiceData?.actions.canEdit && (
          <button
            className="btn btn-primary btn-sm"
            onClick={() => {
              invoiceData?.setAddModalOpen(true);
              invoiceData?.setEditModalId(0);
            }}
          >
            <KTIcon iconName="plus" className="fs-2" />
            {intl.formatMessage({ id: "Menu.AddNewInvoice" })}
          </button>
        )}
    </div>
  );
};

export { ToolbarInvoiceView };
