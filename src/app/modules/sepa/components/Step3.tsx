import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";

import clsx from "clsx";
import { Link } from "react-router-dom";
import { KTIcon } from "../../../../_metronic/helpers";
import { SepaResult } from "../../auth";

interface Step3Props {
  sepaResponse: SepaResult;
  prevStep: () => void;
  nextStep: () => void;
  refreshKey: Boolean;
}
interface StoredValues {
  firstName?: string;
  betweenName?: string;
  lastName?: string;
  ibanNumber?: string;
  emailAddress?: string;
}

const Step3: React.FC<Step3Props> = ({
  sepaResponse,
  nextStep,
  prevStep,
  refreshKey,
}) => {
  const intl = useIntl();
  // const storedValuesString = localStorage.getItem("sepaValues");
  // const test = localStorage.getItem("sepaValues");
  // const storedValuess = JSON.parse(test);
  const [storedValues, setStoredValues] = useState<StoredValues>({});

  useEffect(() => {
    const getValues = () => {
      const storedValuesString = localStorage.getItem("sepaValues");
      const test = localStorage.getItem("sepaValues");
      const storedValues = storedValuesString
        ? JSON.parse(storedValuesString)
        : {};
      console.log(test);
      setStoredValues(storedValues);
    };
    getValues();
  }, [refreshKey]);

  console.log(storedValues);
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
        {sepaResponse.subscriptionDescription}
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

      <table className="table table-borderless mb-6">
        <tbody>
          <tr>
            <td className="text-gray-500 fw-bold">
              {intl.formatMessage({ id: "FIELDS.FULLNAME" })}:
            </td>
            <td className="text-gray-500">
              {`${storedValues.firstName} ${storedValues.betweenName} ${storedValues.lastName}`.trim()}
            </td>
          </tr>
          <tr>
            <td className="text-gray-500 fw-bold">
              {intl.formatMessage({ id: "FIELDS.ACCOUNTNRIBAN" })}:
            </td>
            <td className="text-gray-500">{storedValues.ibanNumber}</td>
          </tr>
          <tr>
            <td className="text-gray-500 fw-bold">
              {intl.formatMessage({ id: "FIELDS.EMAILADDRESS" })}:
            </td>
            <td className="text-gray-500">{storedValues.emailAddress}</td>
          </tr>
        </tbody>
      </table>

      {/* end::Login options */}
      <div className="d-flex flex-stack">
        <div className="mr-2">
          <button
            onClick={prevStep}
            type="button"
            className="btn btn-lg btn-light-primary me-3"
            data-kt-stepper-action="previous"
          >
            <KTIcon iconName="arrow-left" className="fs-4 me-1" />
            {intl.formatMessage({
              id: "COMMON.WIZARDSTEPPREVIOUS",
            })}
          </button>
        </div>
        <div>
          <button onClick={nextStep} className="btn btn-lg btn-primary me-3">
            <span className="indicator-label align-items-center d-flex justify-center">
              {intl.formatMessage({
                id: "LOGINANDREGISTRATION.SEPABTNVERIFYONEXISTING",
              })}
              <KTIcon iconName="arrow-right" className="fs-3 ms-2 me-0" />
            </span>
          </button>
        </div>
      </div>
    </form>
  );
};

export default Step3;
