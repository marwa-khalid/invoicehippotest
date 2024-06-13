import React from "react";
import clsx from "clsx";
import { Link } from "react-router-dom";
import { KTIcon } from "../../../../_metronic/helpers";
import { SepaResult } from "../../auth";
import { useIntl } from "react-intl";
interface Step1Props {
  sepaResponse: SepaResult;
  nextStep: () => void;
}
const Step1: React.FC<Step1Props> = ({ sepaResponse, nextStep }) => {
  const intl = useIntl();
  const goToNext = () => {
    nextStep();
  };
  
  return (
    <div className="d-flex flex-column pt-20">
      <form
        className="form w-100 fv-plugins-bootstrap5 fv-plugins-framework py-20"
        noValidate
        id="kt_login_signup_form"
      >
        {/* begin::Heading */}
        <div className="text-start mb-2">
          {/* begin::Title */}
          <h1 className="text-gray-900 mb-3 fs-2x">
            {intl.formatMessage({
              id: "LoginAndRegistration.SepaIntroTitle",
            })}
          </h1>
          {/* end::Title */}
        </div>
        {/* end::Heading */}
        <p
          className="text-gray-500 mb-11"
          dangerouslySetInnerHTML={{
            __html: sepaResponse.clientHasActiveSepaMandate
              ? intl
                  .formatMessage({
                    id: "LoginAndRegistration.SepaIntroOnUpdateExisting",
                  })
                  .replace(
                    "{0}",
                    `<strong>${sepaResponse.companyName}</strong>`
                  )
              : intl.formatMessage({
                  id: "LoginAndRegistration.SepaIntroOnVerificationOnNew",
                }),
          }}
        />

        <div className="text-start mb-2">
          {/* begin::Title */}
          <h1 className="text-gray-900 mb-3 fs-sm">
            {intl.formatMessage({
              id: "LoginAndRegistration.SepaIntroTitle",
            })}
          </h1>
          {/* end::Title */}
        </div>

        <p className="text-gray-500">{sepaResponse?.subscriptionDescription}</p>

        {/* end::Login options */}
      </form>
      <div className="d-flex flex-end">
        <button onClick={goToNext} className="btn btn-lg btn-primary me-3">
          <span className="indicator-label align-items-center d-flex justify-center">
            {intl.formatMessage({
              id: "Common.WizardStepNext",
            })}
            <KTIcon iconName="arrow-right" className="fs-3 ms-2 me-0" />
          </span>
        </button>
      </div>
    </div>
  );
};

export default Step1;
