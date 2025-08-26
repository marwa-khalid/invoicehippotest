import { KTIcon, KTSVG } from "../../../../helpers";
import { useIntl } from "react-intl";
import { useAuth } from "../../../../../app/modules/auth";
interface props {
  quoteData?: any;
}
const ToolbarQuoteView = ({ quoteData }: props) => {
  const intl = useIntl();
  const auth = useAuth();
  return (
    <div className="d-flex align-items-center gap-2 gap-lg-3">
      {quoteData?.actions.canApprove && (
        <button
          className="btn btn-success btn-sm d-flex"
          onClick={() => quoteData?.openValidateModal()}
        >
          <KTSVG
            className="svg-icon svg-icon-2 me-2"
            path="media/svg/general/document-validation-white.svg"
          />
          {intl.formatMessage({ id: "Fields.ActionApproveOrDecline" })}
        </button>
      )}

      {!auth.currentUser?.result.isAnonymousUser &&
        quoteData?.actions.canEdit && (
          <button
            className="btn btn-primary btn-sm"
            onClick={() => {
              quoteData?.setAddModalOpen(true);
              quoteData?.setEditModalId(0);
            }}
          >
            <KTIcon iconName="plus" className="fs-2" />
            {intl.formatMessage({ id: "Menu.AddNewQuote" })}
          </button>
        )}
    </div>
  );
};

export { ToolbarQuoteView };
