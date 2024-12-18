import { useIntl } from "react-intl";
import { KTIcon } from "../../../../../../../_metronic/helpers";
import { useNavigate } from "react-router-dom";
const SuccessPage = () => {
  const intl = useIntl();

  const navigate = useNavigate();
  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 max-w-sm mx-auto px-200">
      <div className="w-75">
        <h2 className=" mb-3 fs-2x fw-bold">Success!</h2>
        <p className="fs-lg">
          {intl.formatMessage({ id: "Fields.BankingConnectStatusSuccessInfo" })}
        </p>
        <div className="mt-11">
          <button
            type="submit"
            onClick={() => navigate("/admin/financialaccount")}
            className="btn btn-md btn-primary me-3"
          >
            <span className="indicator-label align-items-center d-flex justify-center">
              {intl.formatMessage({
                id: "Fields.ActionFinancialAccountsOverview",
              })}
              <KTIcon iconName="arrow-right" className="fs-3 ms-2 me-0" />
            </span>
          </button>
        </div>
        <div className="text-center">
          {" "}
          <img width={130} height={150} src="/media/auth/agency.png" alt="" />
        </div>
      </div>
    </div>
  );
};

export { SuccessPage };
