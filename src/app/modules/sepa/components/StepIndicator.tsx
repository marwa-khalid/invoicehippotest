import React from "react";

type Step = {
  number: number;
  name: string;
};

type StepIndicatorProps = {
  steps: Step[];
  currentStep: number;
  onStepClick: (stepNumber: number) => void;
};

const StepIndicator: React.FC<StepIndicatorProps> = ({
  steps,
  currentStep,
  onStepClick,
}) => {
  return (
    <div className=" d-flex flex-row align-items-center justify-center">
      {steps.map((step) => (
        <div
          key={step.number}
          className={`mx-2 space-2  ${
            currentStep === step.number ? "text-success" : "text-secondary"
          }`}
          onClick={() => onStepClick(step.number)}
        >
          <span
            className={`rounded-full px-4 py-1 ${
              currentStep === step.number
                ? "bg-success text-white"
                : "bg-primary text-white"
            }`}
          >
            {step.number}
          </span>
          <span className="ml-2 font-bold">{step.name}</span>
        </div>
      ))}
    </div>
  );
};

export default StepIndicator;
