import { useIntl } from "react-intl";
import { KTIcon } from "../../../../../../../_metronic/helpers";
import { useNavigate } from "react-router-dom";
const FailurePage = () => {
  const intl = useIntl();
  const firstName = localStorage.getItem("firstName") || ""; // Default to empty string if null
  const supportEmail = localStorage.getItem("supportEmail") || ""; // Default to empty string if null
  console.log(supportEmail);
  const navigate = useNavigate();

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 max-w-sm mx-auto px-200">
      <div className="w-50 d-flex flex-row">
        <div className="col-6 ">
          <h2 className=" mb-3 fs-2x fw-bold">Oops!</h2>
          <p
            className="fs-lg"
            // key={Math.random()}
            // dangerouslySetInnerHTML={{
            //   __html: intl.formatMessage({
            //     id: "System.PaymentProcessing_FailedDescription",
            //   }),
            // }}
          >
            Het koppelen van één of meerdere rekeningen is helaas mislukt. Dit
            kan komen door dat je de koppeling zelf hebt geannulleerd of vanwege
            een applicatie fout tijdens het koppelen. In geval van het laatste
            vragen we je om contact op te nemen met onze support afdeling om je
            verder te helpen!
          </p>
          <div className="mt-11">
            <button
              type="submit"
              onClick={() => navigate("/admin/financialaccount")}
              className="btn btn-md btn-primary me-3"
            >
              <span className="indicator-label align-items-center d-flex justify-center">
                {/* {intl.formatMessage({
                  id: "LoginAndRegistration.LoginButtonText",
                })} */}
                rekeningen overzicht
                <KTIcon iconName="arrow-right" className="fs-3 ms-2 me-0" />
              </span>
            </button>
          </div>
        </div>

        <div className=" col-6 text-center">
          {" "}
          <img
            width={170}
            height={250}
            src="/media/auth/payment-failed.png"
            alt=""
          />
        </div>
      </div>
    </div>
  );
};

export { FailurePage };
