import React from "react";
import { useIntl } from "react-intl";
import clsx from "clsx";
import { Link } from "react-router-dom";
import { KTIcon } from "../../../../_metronic/helpers";
const Step3: React.FC = () => {
  const intl = useIntl();
  return (
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
            id: "LOGINANDREGISTRATION.REGISTRATIONSTEP3",
          })}
        </h1>
        {/* end::Title */}
      </div>
      <div
        className="text-gray-500 fw-semibold fs-6 mb-11"
        data-kt-translate="general-desc"
      >
        {intl.formatMessage({
          id: "LOGINANDREGISTRATION.SEPAREGISTRATIONSTEP3SUBTITLE",
        })}
      </div>

      {/* end::Heading */}

      <div className="text-start  mb-2">
        {/* begin::Title */}
        <h1 className="text-gray-900 mb-3 fs-sm">
          {intl.formatMessage({
            id: "LOGINANDREGISTRATION.SEPAINTROSUBTITLE",
          })}
          :
        </h1>
        {/* end::Title */}
      </div>

      <p className="text-gray-500 mb-10">
        Dummytekst kan ook helpen bij het zorgen dat de lay-out en het ontwerp
        van het materiaal zijn geoptimaliseerd voor leesbaarheid en
        gebruikersengagement.
      </p>

      <div className="text-start mb-2">
        {/* begin::Title */}
        <h1 className="text-gray-900 mb-3 fs-sm">
          {intl.formatMessage({
            id: "LOGINANDREGISTRATION.SEPAREGISTRATIONSTEP3Sub",
          })}
          :
        </h1>
        {/* end::Title */}
      </div>

      <p className="text-gray-500 mb-6">
        {intl.formatMessage({
          id: "FIELDS.FULLNAME",
        })}{" "}
        : Marwa
      </p>
      <p className="text-gray-500 mb-2">
        {intl.formatMessage({
          id: "FIELDS.ACCOUNTNRIBAN",
        })}{" "}
        : Marwa
      </p>
      <p className="text-gray-500">
        {intl.formatMessage({
          id: "FIELDS.EMAILADDRESS",
        })}{" "}
        : Marwa
      </p>

      {/* end::Login options */}
    </form>
  );
};

export default Step3;
