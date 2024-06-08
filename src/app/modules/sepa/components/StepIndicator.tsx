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
    <div className="flex justify-around mb-8 space-x-8">
      {steps.map((step) => (
        <div
          key={step.number}
          className={`flex items-center cursor-pointer p-4 space-x-2 ${
            currentStep === step.number ? "text-green-500" : "text-gray-500"
          }`}
          onClick={() => onStepClick(step.number)}
        >
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              currentStep === step.number
                ? "bg-green-500 text-white"
                : "bg-blue-500 text-white"
            }`}
          >
            {step.number}
          </div>
          <div className="font-bold">{step.name}</div>
        </div>
      ))}
    </div>
  );
};

export default StepIndicator;
