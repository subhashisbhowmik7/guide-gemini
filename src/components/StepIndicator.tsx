import React from 'react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, totalSteps }) => {
  const stepLabels = [
    'Investment Details',
    'Coverage Analysis',
    'Strategic Pillars',
    'Implementation',
    'Integration',
    'Outcomes',
    'Action Plan',
  ];

  return (
    <div className="w-full md:w-80 gradient-card rounded-2xl p-6 shadow-elevated border border-border">
      <div className="mb-6">
        <h2 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
          Your Progress
        </h2>
        <p className="text-sm text-muted-foreground">
          Step {currentStep} of {totalSteps}
        </p>
      </div>

      <div className="space-y-4">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => {
          const isCompleted = step < currentStep;
          const isCurrent = step === currentStep;
          const isUpcoming = step > currentStep;

          return (
            <div key={step} className="flex items-center gap-4 group">
              <div className="relative">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg transition-smooth ${
                    isCompleted
                      ? 'gradient-primary text-white shadow-glow'
                      : isCurrent
                      ? 'gradient-secondary text-white shadow-glow animate-pulse-glow'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {isCompleted ? (
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    step
                  )}
                </div>
                {step < totalSteps && (
                  <div
                    className={`absolute left-1/2 top-full w-0.5 h-4 -ml-px transition-smooth ${
                      isCompleted ? 'bg-primary' : 'bg-border'
                    }`}
                  />
                )}
              </div>

              <div className="flex-1">
                <h3
                  className={`font-semibold transition-smooth ${
                    isCurrent
                      ? 'text-primary'
                      : isCompleted
                      ? 'text-foreground'
                      : 'text-muted-foreground'
                  }`}
                >
                  {stepLabels[step - 1]}
                </h3>
                {isCurrent && (
                  <p className="text-xs text-muted-foreground mt-1">In progress...</p>
                )}
                {isCompleted && (
                  <p className="text-xs text-primary mt-1">Completed ✓</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 pt-6 border-t border-border">
        <div className="relative h-3 bg-muted rounded-full overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 gradient-primary rounded-full transition-all duration-500 ease-out shadow-glow"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
        <p className="text-center text-sm text-muted-foreground mt-3 font-medium">
          {Math.round((currentStep / totalSteps) * 100)}% Complete
        </p>
      </div>
    </div>
  );
};

export default StepIndicator;
