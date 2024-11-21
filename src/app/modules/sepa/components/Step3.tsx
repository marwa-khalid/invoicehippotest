import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { Link } from "react-router-dom";
import { KTIcon } from "../../../../_metronic/helpers";
import { SepaResult } from "../../auth";
import { ConditionsModal } from "./ConditionsModal";
import { sepaRegisterConfirm } from "../../auth/core/_requests";
import { handleToast } from "../../auth/core/_toast";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";

interface StoredValues {
  firstName?: string;
  betweenName?: string;
  lastName?: string;
  ibanNumber?: string;
  emailAddress?: string;
}
interface Step3Props {
  sepaResponse: SepaResult;
  prevStep: () => void;
  nextStep: () => void;
  storedValues: StoredValues;
}

const Step3: React.FC<Step3Props> = ({
  sepaResponse,
  nextStep,
  prevStep,
  storedValues,
}) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const [isModalOpen, setModalOpen] = useState(false);
  const [isConsentGiven, setConsentGiven] = useState(false);

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const formik = useFormik({
    initialValues: {
      isConsentGiven: false,
    },
    onSubmit: async (values) => {
      const sepaConfirm = await sepaRegisterConfirm(
        sepaResponse,
        storedValues,
        values.isConsentGiven
      );
      handleToast(sepaConfirm);
      if (sepaConfirm.isValid) {
        if (sepaConfirm.result.paymentRedirectUrl) {
          window.location.href = sepaConfirm.result.paymentRedirectUrl;
        } else {
          localStorage.setItem(
            "supportEmail",
            sepaResponse.subscriberCompanySupportEmailAddress
          );
          if (typeof storedValues.firstName !== "undefined") {
            localStorage.setItem("firstName", storedValues.firstName);
          }
          navigate("/sepa/validate/success");
        }
      } else {
        handleToast(sepaConfirm);
      }
    },
  });

  return (
    <form
      className="form w-100 fv-plugins-bootstrap5 fv-plugins-framework py-20"
      noValidate
      id="kt_login_signup_form"
      onSubmit={formik.handleSubmit}
    >
      {/* begin::Heading */}
      <div className="text-start mb-2">
        {/* begin::Title */}
        <h1 className="text-gray-900 mb-3 fs-2x">
          {intl.formatMessage({
            id: "LoginAndRegistration.RegistrationStep3",
          })}
        </h1>
        {/* end::Title */}
      </div>
      <div
        className="text-gray-500 fw-semibold fs-6 mb-11"
        data-kt-translate="general-desc"
      >
        {intl.formatMessage({
          id: "LoginAndRegistration.SepaRegistrationStep3SubTitle",
        })}
      </div>

      {/* end::Heading */}

      <div className="text-start  mb-2">
        {/* begin::Title */}
        <h1 className="text-gray-900 mb-3 fs-sm">
          {intl.formatMessage({
            id: "LoginAndRegistration.SepaRegistrationStep3Heading1",
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
        <h1 className="text-gray-900 mb-3 fs-xl">
          {intl.formatMessage({
            id: "LoginAndRegistration.SepaRegistrationStep3Heading2",
          })}
          :
        </h1>
        {/* end::Title */}
      </div>

      <table className="table table-borderless mb-6">
        <tbody>
          {sepaResponse.isBusiness && (
            <tr className="space-x-2">
              <td className="text-gray-500 fw-bold ">
                {intl.formatMessage({ id: "Fields.CompanyName" })}:
              </td>
              <td className="text-gray-500">{sepaResponse.companyName}</td>
            </tr>
          )}
          <tr>
            <td className="text-gray-500 fw-bold">
              {intl.formatMessage({ id: "Fields.FullName" })}:
            </td>
            <td className="text-gray-500">
              {`${storedValues.firstName} ${storedValues.betweenName} ${storedValues.lastName}`.trim()}
            </td>
          </tr>
          <tr>
            <td className="text-gray-500 fw-bold">
              {intl.formatMessage({ id: "Fields.AccountNrIBAN" })}:
            </td>
            <td className="text-gray-500">{storedValues.ibanNumber}</td>
          </tr>
          <tr>
            <td className="text-gray-500 fw-bold">
              {intl.formatMessage({ id: "Fields.EmailAddress" })}:
            </td>
            <td className="text-gray-500">{storedValues.emailAddress}</td>
          </tr>
        </tbody>
      </table>

      {isModalOpen && (
        <ConditionsModal
          show={isModalOpen}
          handleClose={closeModal}
          companyName={sepaResponse.companyName}
        />
      )}
      {sepaResponse.isBusiness && (
        <>
          <div className="text-start  mb-2">
            {/* begin::Title */}
            <h1 className="text-gray-900 mb-3 fs-xl">
              {intl.formatMessage({
                id: "LoginAndRegistration.SepaRegistrationStep3Heading3",
              })}
              :
            </h1>
            {/* end::Title */}
          </div>
          <div className="d-flex items-center flex-row bg-light-primary p-5 rounded-lg ">
            {/* Exclamation Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="50"
              height="50"
              viewBox="0 0 24 24"
              className="bg-blue-500 rounded-full me-5"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="white"
                strokeWidth="0"
                fill="#1086ff"
              />
              <text
                x="50%"
                y="50%"
                dominantBaseline="middle"
                textAnchor="middle"
                fontSize="16"
                fill="white"
                fontFamily="monospace"
                fontWeight="bold"
              >
                i
              </text>
            </svg>

            {/* Paragraph Text */}
            <p className="text-primary text-base">
              {intl.formatMessage({
                id: "LoginAndRegistration.SepaIntroOnVerificationOnNew",
              })}
            </p>
          </div>

          <label className="form-check form-switch form-check-custom form-check-solid mt-4">
            <input
              className="form-check-input"
              type="checkbox"
              value={1}
              checked={isConsentGiven}
              onChange={() => setConsentGiven(!isConsentGiven)}
            />
            <Link
              onClick={() => openModal()}
              to="#"
              className="cursor-pointer ms-3"
              dangerouslySetInnerHTML={{
                __html: intl.formatMessage({
                  id: "LoginAndRegistration.SepaRegistrationStep3Agreement",
                }),
              }}
            ></Link>
          </label>
        </>
      )}

      {/* end::Login options */}
      <div className="d-flex flex-stack mt-11">
        <div className="mr-2">
          <button
            onClick={prevStep}
            type="button"
            className="btn btn-lg btn-light-primary me-3"
            data-kt-stepper-action="previous"
          >
            <KTIcon iconName="arrow-left" className="fs-4 me-1" />
            {intl.formatMessage({
              id: "Common.WizardStepPrevious",
            })}
          </button>
        </div>
        <div>
          <button
            type="submit"
            disabled={sepaResponse.isBusiness ? !isConsentGiven : false}
            className="btn btn-lg btn-primary me-3"
          >
            <span className="indicator-label align-items-center d-flex justify-center">
              {intl.formatMessage({
                id: "LoginAndRegistration.SepaBtnVerifyOnNew",
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
