import { useIntl } from "react-intl";
import { KTIcon } from "../../../../_metronic/helpers";

const ClientSuccessPage = () => {
  const intl = useIntl();
  const firstName = localStorage.getItem("firstName") || ""; // Default to empty string if null
  const supportEmail = localStorage.getItem("supportEmail") || ""; // Default to empty string if null

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100 max-w-sm mx-auto px-200">
      <div className="w-75">
        <p
          className="mb-3 fs-2x fw-bold"
          dangerouslySetInnerHTML={{
            __html: intl
              .formatMessage({
                id: "LoginAndRegistration.SepaPersonalThanks",
              })
              .replace("{0}", firstName),
          }}
        />
        <p
          className="fs-lg"
          dangerouslySetInnerHTML={{
            __html: intl
              .formatMessage({
                id: "LoginAndRegistration.SepaValidationInformation",
              })
              .replace(/\{0\}/g, supportEmail),
          }}
        />
        <div className="mt-11">
          <button
            type="submit"
            onClick={() =>
              (window.location.href = "https://www.invoicehippo.nl")
            }
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

export { ClientSuccessPage };
