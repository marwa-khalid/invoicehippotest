import React, { useState, useEffect } from "react";
import StepIndicator from "./components/StepIndicator";
import Step1 from "./components/Step1";
import Step2 from "./components/Step2";
import Step3 from "./components/Step3";
import { useLocation } from "react-router-dom";
import { handleToast } from "../auth/core/_toast";
import { useNavigate } from "react-router-dom";
import { checkSepaOdata } from "../auth/core/_requests";
import { useFormik } from "formik";
function useQuery() {
  return new URLSearchParams(useLocation().search);
}
const SepaValidation: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const navigate = useNavigate();
  const query = useQuery();
  const odata = query.get("odata");
  // const reset_email = localStorage.getItem('reset_email')

  useEffect(() => {
    const checkOdata = async () => {
      const response = await checkSepaOdata(odata);
      console.log(response);

      if (response.hasErrors) {
        navigate("/");
      }

      handleToast(response);
    };
    checkOdata();
  }, []);

  const steps = [
    { number: 1, name: "Step 1" },
    { number: 2, name: "Step 2" },
    { number: 3, name: "Step 3" },
  ];

  const renderForm = () => {
    switch (currentStep) {
      case 1:
        return <Step1 />;
      case 2:
        return <Step2 />;
      case 3:
        return <Step3 />;
      default:
        return <Step1 />;
    }
  };

  return (
    <div className="max-w-xl mx-auto my-8">
      <StepIndicator
        steps={steps}
        currentStep={currentStep}
        onStepClick={setCurrentStep}
      />
      <div className="form-content p-8 border border-gray-300 rounded">
        {renderForm()}
      </div>
    </div>
  );
};

export { SepaValidation };
