import React from "react";
import clsx from "clsx";
import { Link } from "react-router-dom";
import { KTIcon } from "../../../../_metronic/helpers";
import { SepaResult } from "../../auth";
import { useIntl } from "react-intl";
interface Step1Props {
  sepaResponse: SepaResult; // Adjust the type according to your actual data structure
}
const Step1 = (sepaResponse: Step1Props) => {
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
            id: "LOGINANDREGISTRATION.SEPAINTROTITLE",
          })}
        </h1>
        {/* end::Title */}
      </div>
      {/* end::Heading */}
      <p className="text-gray-500 mb-11">
        {sepaResponse.sepaResponse.clientHasActiveSepaMandate
          ? intl.formatMessage({
              id: "LOGINANDREGISTRATION.SEPAINTROONUPDATEEXISTING",
            })
          : intl.formatMessage({
              id: "LOGINANDREGISTRATION.SEPAINTROONVERIFICATIONONNEW",
            })}
      </p>

      <div className="text-start mb-2">
        {/* begin::Title */}
        <h1 className="text-gray-900 mb-3 fs-sm">
          {intl.formatMessage({
            id: "LOGINANDREGISTRATION.SEPAINTROTITLE",
          })}
        </h1>
        {/* end::Title */}
      </div>

      <p className="text-gray-500">
        {sepaResponse?.sepaResponse?.subscriptionDescription}
      </p>

      {/* end::Login options */}
    </form>
  );
};

export default Step1;
