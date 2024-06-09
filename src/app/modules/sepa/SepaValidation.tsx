// import React, { useState, useEffect } from "react";
// import StepIndicator from "./components/StepIndicator";
// import Step1 from "./components/Step1";
// import Step2 from "./components/Step2";
// import Step3 from "./components/Step3";
// import { useLocation } from "react-router-dom";
// import { handleToast } from "../auth/core/_toast";
// import { useNavigate } from "react-router-dom";
// import { checkSepaOdata } from "../auth/core/_requests";
// import { useFormik } from "formik";
// function useQuery() {
//   return new URLSearchParams(useLocation().search);
// }
// const SepaValidation: React.FC = () => {
//   const [currentStep, setCurrentStep] = useState<number>(1);
//   const navigate = useNavigate();
//   const query = useQuery();
//   const odata = query.get("odata");
//   // const reset_email = localStorage.getItem('reset_email')

//   // useEffect(() => {
//   //   const checkOdata = async () => {
//   //     const response = await checkSepaOdata(odata);
//   //     console.log(response);

//   //     if (response.hasErrors) {
//   //       navigate("/");
//   //     }

//   //     handleToast(response);
//   //   };
//   //   checkOdata();
//   // }, []);

//   const steps = [
//     { number: 1, name: "Step 1" },
//     { number: 2, name: "Step 2" },
//     { number: 3, name: "Step 3" },
//   ];

//   const renderForm = () => {
//     switch (currentStep) {
//       case 1:
//         return <Step1 />;
//       case 2:
//         return <Step2 />;
//       case 3:
//         return <Step3 />;
//       default:
//         return <Step1 />;
//     }
//   };

//   return (
//      <div className="mx-auto my-8">
//       <StepIndicator
//         steps={steps}
//         currentStep={currentStep}
//         onStepClick={setCurrentStep}
//       />
//       <>
//         {renderForm()}
//       </>
//     </div>
//   );
// };

// export { SepaValidation };

import { useEffect, useRef, useState } from "react";
import { KTIcon } from "../../../_metronic/helpers";
import Step1 from "./components/Step1";
import Step2 from "./components/Step2";
import Step3 from "./components/Step3";
import { StepperComponent } from "../../../_metronic/assets/ts/components";
import { Form, Formik, FormikValues } from "formik";
import {
  createAccountSchemas,
  ICreateAccount,
  inits,
} from "./components/CreateAccountWizardHelper";
import { useNavigate, useLocation } from "react-router-dom";
import { ToolbarWrapper } from "../../../_metronic/layout/components/toolbar";
import { Content } from "../../../_metronic/layout/components/content";
import { checkSepaOdata } from "../auth/core/_requests";
import { handleToast } from "../auth/core/_toast";
import { useIntl } from "react-intl";
import { SepaResult } from "../auth";
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const SepaValidation = () => {
  const stepperRef = useRef<HTMLDivElement | null>(null);
  const [stepper, setStepper] = useState<StepperComponent | null>(null);
  const [currentSchema, setCurrentSchema] = useState(createAccountSchemas[0]);
  const [initValues] = useState<ICreateAccount>(inits);
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
  };

  // Set this as the initial state
  const [sepaResponse, setSepaResponse] =
    useState<SepaResult>(defaultSepaResult);

  const intl = useIntl();
  const navigate = useNavigate();
  const query = useQuery();
  const odata = query.get("odata");
  const reset_email = localStorage.getItem("reset_email");

  useEffect(() => {
    const checkOdata = async () => {
      const response = await checkSepaOdata(odata);
      console.log(response.result);

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

  const submitStep = (values: ICreateAccount, actions: FormikValues) => {
    if (!stepper) {
      return;
    }

    if (stepper.currentStepIndex !== stepper.totalStepsNumber) {
      stepper.goNext();
    } else {
      stepper.goto(1);
      actions.resetForm();
    }

    console.log(values);

    setCurrentSchema(createAccountSchemas[stepper.currentStepIndex - 1]);
  };

  useEffect(() => {
    if (!stepperRef.current) {
      return;
    }

    loadStepper();
  }, [stepperRef]);
  return (
    <>
      <ToolbarWrapper />
      <Content>
        <div
          ref={stepperRef}
          className="stepper stepper-pills stepper-column d-flex flex-column flex-xl-row flex-row-fluid"
          id="kt_create_account_stepper"
        >
          {/* begin::Aside*/}
          <div className="card d-flex justify-content-center justify-content-xl-start flex-row-auto w-100 w-xl-300px w-xxl-400px me-9">
            {/* begin::Wrapper*/}
            <div className="card-body px-6 px-lg-10 px-xxl-15 py-20">
              {/* begin::Nav*/}
              <div className="stepper-nav">
                {/* begin::Step 1*/}
                <div
                  className="stepper-item current"
                  data-kt-stepper-element="nav"
                >
                  {/* begin::Wrapper*/}
                  <div className="stepper-wrapper">
                    {/* begin::Icon*/}
                    <div className="stepper-icon w-40px h-40px">
                      <i className="stepper-check fas fa-check"></i>
                      <span className="stepper-number">1</span>
                    </div>
                    {/* end::Icon*/}

                    {/* begin::Label*/}
                    <div className="stepper-label">
                      <h3 className="stepper-title">
                        {intl.formatMessage({
                          id: "LOGINANDREGISTRATION.REGISTRATIONSTEP1",
                        })}
                      </h3>

                      <div className="stepper-desc fw-semibold">
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
                    <div className="stepper-icon w-40px h-40px">
                      <i className="stepper-check fas fa-check"></i>
                      <span className="stepper-number">2</span>
                    </div>
                    {/* end::Icon*/}

                    {/* begin::Label*/}
                    <div className="stepper-label">
                      <h3 className="stepper-title">
                        {intl.formatMessage({
                          id: "LOGINANDREGISTRATION.SEPAREGISTRATIONSTEP2",
                        })}
                      </h3>
                      <div className="stepper-desc fw-semibold">
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
                    <div className="stepper-icon w-40px h-40px">
                      <i className="stepper-check fas fa-check"></i>
                      <span className="stepper-number">3</span>
                    </div>
                    {/* end::Icon*/}

                    {/* begin::Label*/}
                    <div className="stepper-label">
                      <h3 className="stepper-title">
                        {" "}
                        {intl.formatMessage({
                          id: "LOGINANDREGISTRATION.SEPAREGISTRATIONSTEP3",
                        })}
                      </h3>
                      <div className="stepper-desc fw-semibold">
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

          <div className="d-flex flex-row-fluid flex-center bg-body rounded">
            <Formik
              validationSchema={currentSchema}
              initialValues={initValues}
              onSubmit={submitStep}
            >
              {() => (
                <Form
                  className=" w-100 w-xl-700px px-9"
                  noValidate
                  id="kt_create_account_form"
                  placeholder={undefined}
                >
                  <div className="current" data-kt-stepper-element="content">
                    <Step1 sepaResponse={sepaResponse} />
                  </div>

                  <div data-kt-stepper-element="content">
                    <Step2 sepaResponse={sepaResponse} />
                  </div>

                  <div data-kt-stepper-element="content">
                    <Step3 />
                  </div>

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
                      <button
                        type="submit"
                        className="btn btn-lg btn-primary me-3"
                      >
                        <span className="indicator-label align-items-center d-flex justify-center">
                          {stepper?.currentStepIndex !==
                          stepper?.totalStepsNumber
                            ? intl.formatMessage({
                                id: "COMMON.WIZARDSTEPNEXT",
                              })
                            : intl.formatMessage({
                                id: "LOGINANDREGISTRATION.SEPABTNVERIFYONEXISTING",
                              })}
                          {/* {stepper?.currentStepIndex == 2 &&
                           
                            intl.formatMessage({
                              id: "COMMON.WIZARDSTEPNEXT",
                            })}
                          {stepper?.currentStepIndex ===
                            (stepper?.totalStepsNumber || 2) - 1 &&
                            intl.formatMessage({
                              id: "LOGINANDREGISTRATION.SEPABTNVERIFYONEXISTING",
                            })} */}
                          <KTIcon
                            iconName="arrow-right"
                            className="fs-3 ms-2 me-0"
                          />
                        </span>
                      </button>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </Content>
    </>
  );
};

export { SepaValidation };
