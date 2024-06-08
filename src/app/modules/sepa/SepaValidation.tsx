import React, { useState } from "react";
import StepIndicator from "./components/StepIndicator";
import Step1 from "./components/Step1";
import Step2 from "./components/Step2";
import Step3 from "./components/Step3";

const SepaValidation: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);

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
