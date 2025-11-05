import React from 'react';
import { Check, Sparkles } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, totalSteps }) => {
  const steps = [
    { 
      number: 1, 
      label: 'Initial Assessment', 
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
    },
    { 
      number: 2, 
      label: 'Coverage Analysis', 
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
    },
    { 
      number: 3, 
      label: 'Strategic Pillars', 
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
    },
    { 
      number: 4, 
      label: 'Implementation Strategies', 
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
    },
    { 
      number: 5, 
      label: 'Integration Method', 
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
    },
    { 
      number: 6, 
      label: 'Expected Outcome', 
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
    },
    { 
      number: 7, 
      label: 'Priority Actions', 
      icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
    },
  ];

  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="h-full glass-effect rounded-3xl shadow-elevated p-6 border border-border/30 sticky top-4 overflow-y-auto relative">
      {/* Ambient background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
      
      <div className="relative z-10">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl gradient-primary shadow-glow flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Progress
            </h2>
          </div>
          <p className="text-sm text-muted-foreground ml-15">
            Step {currentStep} of {totalSteps}
          </p>
        </div>

        <div className="space-y-2 mb-8">
          {steps.map((step, index) => {
            const isCompleted = step.number < currentStep;
            const isCurrent = step.number === currentStep;

            return (
              <div
                key={step.number}
                className={`group relative flex items-start gap-4 p-3 rounded-xl transition-all duration-500 cursor-pointer ${
                  isCurrent ? 'bg-primary/10 scale-[1.02] shadow-card' : 'hover:bg-muted/30'
                }`}
                style={{ 
                  animationDelay: `${index * 100}ms`,
                }}
              >
                {/* Connecting Line */}
                {step.number < totalSteps && (
                  <div
                    className={`absolute left-[27px] top-[56px] w-0.5 h-8 transition-all duration-700 ${
                      isCompleted ? 'bg-gradient-to-b from-primary via-primary-glow to-primary' : 'bg-border'
                    }`}
                  />
                )}
                
                <div
                  className={`relative flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center font-bold transition-all duration-500 border-2 overflow-hidden ${
                    isCompleted
                      ? 'gradient-primary text-white shadow-glow border-transparent scale-110'
                      : isCurrent
                      ? 'bg-card border-primary text-primary shadow-glow'
                      : 'bg-muted/50 border-border text-muted-foreground group-hover:border-primary/30 group-hover:scale-105'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-6 h-6 animate-scale-in" />
                  ) : (
                    <div className={isCurrent ? 'text-primary' : 'text-current'}>{step.icon}</div>
                  )}
                  
                  {/* Ripple effect for current step */}
                  {isCurrent && (
                    <>
                      <span className="absolute inset-0 rounded-xl animate-ping opacity-20 gradient-primary" />
                      <span className="absolute inset-0 rounded-xl gradient-primary opacity-10" />
                    </>
                  )}
                  
                  {/* Shimmer effect on hover for upcoming */}
                  {!isCompleted && !isCurrent && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                  )}
                </div>
                
                <div className="flex-1 pt-1.5 min-w-0">
                  <p
                    className={`font-semibold transition-all duration-300 truncate ${
                      isCurrent
                        ? 'text-primary text-base'
                        : isCompleted
                        ? 'text-foreground'
                        : 'text-muted-foreground group-hover:text-foreground'
                    }`}
                  >
                    {step.label}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1.5">
                    {isCompleted && <span className="text-primary font-bold">✓</span>}
                    {isCurrent && (
                      <span className="flex gap-0.5">
                        <span className="w-1 h-1 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1 h-1 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1 h-1 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
                      </span>
                    )}
                    Step {step.number}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Progress Bar */}
        <div className="relative">
          <div className="flex justify-between text-xs text-muted-foreground mb-2">
            <span className="font-medium">Overall Progress</span>
            <span className="font-bold bg-gradient-primary bg-clip-text text-transparent">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="relative h-4 bg-gradient-to-r from-muted/80 to-muted/40 rounded-full overflow-hidden shadow-inner border border-border/50">
            <div
              className="h-full gradient-primary shadow-glow transition-all duration-700 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              {/* Animated shimmer */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
              {/* Gleam effect */}
              <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/50 blur-sm" />
              {/* Pulse at the end */}
              {progress > 0 && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full animate-pulse shadow-glow" />
              )}
            </div>
          </div>
          
          {/* Milestone markers */}
          <div className="flex justify-between mt-2 px-0.5">
            {[0, 25, 50, 75, 100].map((milestone) => (
              <div
                key={milestone}
                className={`text-[10px] font-bold transition-all duration-300 ${
                  progress >= milestone 
                    ? 'text-primary scale-110' 
                    : 'text-muted-foreground/50'
                }`}
              >
                {milestone === 100 ? '🎉' : `${milestone}%`}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepIndicator;
