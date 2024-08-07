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
          Je hebt met success één of meerdere rekeningen gekoppeld. In het
          rekeningen overzicht zul je nu zien dat deze rekeningen zijn opgenomen
          en dat ze automatisch gesynchroniseerd zullen worden. Het
          synchroniseren kan soms pas de volgende dag data opleveren! Houdt daar
          a.u.b. rekening mee!
        </p>
        <div className="mt-11">
          <button
            type="submit"
            onClick={() => navigate("/admin/financialaccount")}
            className="btn btn-md btn-primary me-3"
          >
            <span className="indicator-label align-items-center d-flex justify-center">
              {intl.formatMessage({
                id: "LoginAndRegistration.SepaBtnVisitSite",
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
