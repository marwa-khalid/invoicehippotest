import React, { useEffect, useRef, useState } from "react";
import { KTIcon } from "../../../_metronic/helpers";
import Step1 from "./components/Step1";
import Step2 from "./components/Step2";
import Step3 from "./components/Step3";
import { StepperComponent } from "../../../_metronic/assets/ts/components";
import { useNavigate, useLocation } from "react-router-dom";
import { ToolbarWrapper } from "../../../_metronic/layout/components/toolbar";
import { Content } from "../../../_metronic/layout/components/content";
import { checkSepaOdata } from "../auth/core/_requests";
import { handleToast } from "../auth/core/_toast";
import { useIntl } from "react-intl";
import { SepaResult } from "../auth";
import { toAbsoluteUrl } from "../../../_metronic/helpers";
import {
  createAccountSchemas,
  ICreateAccount,
  inits,
} from "./components/CreateAccountWizardHelper";
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

interface StoredValues {
 
  betweenName?: string;
  lastName?: string;
  ibanNumber?: string;
  emailAddress?: string;
}

const SepaValidation = () => {
  const stepperRef = useRef<HTMLDivElement | null>(null);
  const [stepper, setStepper] = useState<StepperComponent | null>(null);
  const [currentSchema, setCurrentSchema] = useState(createAccountSchemas[0]);
  const [initValues] = useState<ICreateAccount>(inits);
  const [storedValues, setStoredValues] = useState<StoredValues>({});
  const defaultSepaResult: SepaResult = {
    id: 0,
    taskId: 0,
    isBusiness: true,
    companyName: "",
    emailAddress: "",
    sepaIsAllreadyValidated: false,
    vatNumber: "",
    registrationNumber: "",
    ibanNumber: "",
    firstName: "",
    betweenName: "",
    lastName: "",
    subscriptionDescription: "",
    subscriberCompanyName: "",
    subscriberCompanySupportEmailAddress: "",
    subscriberCompanyWebUrl: "",
    subscriberCompanyLogoUrl: "",
    clientHasActiveSepaMandate: false,
    sepaMandateReference: "",
    sepaMandateSignatureDate: "",
    hasEmail: false,
    hasIbanNumber: false,
    hasVatNumber: false,
    hasRegistrationNumber: false,
    fullName: "",
    paymentRedirectUrl: "",
    resultType: 1,
  };

  // Set this as the initial state
  const [sepaResponse, setSepaResponse] =
    useState<SepaResult>(defaultSepaResult);

  const intl = useIntl();
  const navigate = useNavigate();
  const query = useQuery();
  const odata = query.get("odata");
  const reset_email = localStorage.getItem("reset_email");
  let num = 1;
  useEffect(() => {
    const checkOdata = async () => {
      const response = await checkSepaOdata(odata);

      if (response.hasErrors) {
        navigate("/");
      } else {
        setSepaResponse(response.result);
      }

      handleToast(response);
    };

    checkOdata();
  }, []);

  const loadStepper = () => {
    setStepper(
      StepperComponent.createInsance(stepperRef.current as HTMLDivElement)
    );
  };

  const prevStep = () => {
    if (!stepper) {
      return;
    }

    stepper.goPrev();

    setCurrentSchema(createAccountSchemas[stepper.currentStepIndex - 1]);
  };

  const nextStep = () => {
    if (!stepper) {
      return;
    }

    stepper.goNext();

    setCurrentSchema(createAccountSchemas[stepper.currentStepIndex + 1]);
  };

  useEffect(() => {
    if (!stepperRef.current) {
      return;
    }

    loadStepper();
  }, [stepperRef]);
  return (
    <div
      ref={stepperRef}
      className="stepper stepper-pills stepper-column d-flex flex-column flex-xl-row w-100 "
      id="kt_create_account_stepper"
      // style={{ overflow: "hidden" }}
    >
      {/* begin::Aside*/}
      <div
        className="d-flex flex-center flex-column justify-content-center bgi-size-cover justify-content-start w-100 w-xl-500px w-xxl-400px pt-20 overflow-auto"
        style={{
          backgroundImage: `url(${toAbsoluteUrl("media/auth/auth-bg.png")})`,
          position: "relative",
          height: "100vh",
        }}
      >
        {/* begin::header*/}
        <div className=" px-20 px-lg-10 px-xxl-15 pt-20">
          {sepaResponse.subscriberCompanyLogoUrl && (
            <div className="stepper-logo d-flex flex-center ">
              <img
                className="w-25 h-25"
                src={sepaResponse.subscriberCompanyLogoUrl}
                alt=""
              />
            </div>
          )}

          {/* end::header*/}
        </div>
        {/* begin::Wrapper*/}
        <div className="card-body  px-20 px-lg-10 px-xxl-15 py-20">
          {/* begin::Nav*/}
          <div className="stepper-nav">
            {/* begin::Step 1*/}
            <div className="stepper-item current" data-kt-stepper-element="nav">
              {/* begin::Wrapper*/}
              <div className="stepper-wrapper">
                {/* begin::Icon*/}
                <div
                  className={`stepper-icon w-40px h-40px ${
                    stepper?.currentStepIndex == 1
                      ? " bg-success"
                      : "bg-transparent"
                  }`}
                  style={{
                    border:
                      stepper?.currentStepIndex == 1
                        ? "none"
                        : "1px dashed white",
                    borderStyle:
                      stepper?.currentStepIndex == 1 ? "none" : "dashed",
                  }}
                >
                  <i className="stepper-check fas fa-check text-success"></i>
                  <span className="stepper-number text-white">1</span>
                </div>
                {/* end::Icon*/}

                {/* begin::Label*/}
                <div className="stepper-label">
                  <h3 className="stepper-title text-white">
                    {intl.formatMessage({
                      id: "LoginAndRegistration.SepaRegistrationWizardNavigationStep1",
                    })}
                  </h3>

                  <div className="stepper-desc fw-semibold text-gray-300">
                    Setup Your Account Details
                  </div>
                </div>
                {/* end::Label*/}
              </div>
              {/* end::Wrapper*/}

              {/* begin::Line*/}
              <div className="stepper-line h-40px"></div>
              {/* end::Line*/}
            </div>
            {/* end::Step 1*/}

            {/* begin::Step 2*/}
            <div className="stepper-item" data-kt-stepper-element="nav">
              {/* begin::Wrapper*/}
              <div className="stepper-wrapper">
                {/* begin::Icon*/}
                <div
                  className={`stepper-icon w-40px h-40px ${
                    stepper?.currentStepIndex == 2
                      ? " bg-success"
                      : "bg-transparent"
                  }`}
                  style={{
                    border:
                      stepper?.currentStepIndex == 2
                        ? "none"
                        : "1px dashed white",
                    borderStyle:
                      stepper?.currentStepIndex == 2 ? "none" : "dashed",
                  }}
                >
                  <i className="stepper-check fas fa-check text-success"></i>
                  <span className="stepper-number text-white">2</span>
                </div>
                {/* end::Icon*/}

                {/* begin::Label*/}
                <div className="stepper-label">
                  <h3 className="stepper-title text-white">
                    {intl.formatMessage({
                      id: "LoginAndRegistration.SepaRegistrationWizardNavigationStep2",
                    })}
                  </h3>
                  <div className="stepper-desc fw-semibold text-gray-300">
                    Setup Your Account Settings
                  </div>
                </div>
                {/* end::Label*/}
              </div>
              {/* end::Wrapper*/}

              {/* begin::Line*/}
              <div className="stepper-line h-40px"></div>
              {/* end::Line*/}
            </div>
            {/* end::Step 2*/}

            {/* begin::Step 3*/}
            <div className="stepper-item" data-kt-stepper-element="nav">
              {/* begin::Wrapper*/}
              <div className="stepper-wrapper">
                {/* begin::Icon*/}
                <div
                  className={`stepper-icon w-40px h-40px ${
                    stepper?.currentStepIndex == 3
                      ? " bg-success"
                      : "bg-transparent"
                  }`}
                  style={{
                    border:
                      stepper?.currentStepIndex == 3
                        ? "none"
                        : "1px dashed white",
                    borderStyle:
                      stepper?.currentStepIndex == 3 ? "none" : "dashed",
                  }}
                >
                  <i className="stepper-check fas fa-check text-success"></i>
                  <span className="stepper-number text-white">3</span>
                </div>
                {/* end::Icon*/}

                {/* begin::Label*/}
                <div className="stepper-label">
                  <h3 className="stepper-title text-white">
                    {" "}
                    {intl.formatMessage({
                      id: "LoginAndRegistration.SepaRegistrationWizardNavigationStep3",
                    })}
                  </h3>
                  <div className="stepper-desc fw-semibold text-gray-300">
                    Your Business Related Info
                  </div>
                </div>
                {/* end::Label*/}
              </div>
              {/* end::Wrapper*/}

              {/* begin::Line*/}
              <div className="stepper-line h-40px"></div>
              {/* end::Line*/}
            </div>
            {/* end::Step 3*/}
          </div>
          {/* end::Nav*/}
        </div>
        {/* end::Wrapper*/}
      </div>
      {/* begin::Aside*/}

      <div className="d-flex flex-row-fluid  bg-body pt-50 vh-100 overflow-auto">
        <div className=" w-100 w-xl-700px px-20" id="kt_create_account_form">
          <div className="current" data-kt-stepper-element="content">
            <Step1 sepaResponse={sepaResponse} nextStep={nextStep} />
          </div>

          <div data-kt-stepper-element="content">
            <Step2
              sepaResponse={sepaResponse}
              prevStep={prevStep}
              nextStep={nextStep}
              setStoredValues={setStoredValues}
            />
          </div>

          <div data-kt-stepper-element="content">
            <Step3
              sepaResponse={sepaResponse}
              prevStep={prevStep}
              nextStep={nextStep}
              storedValues={storedValues}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export { SepaValidation };
