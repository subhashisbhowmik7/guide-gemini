import React from 'react';
import { Check, Sparkles } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, totalSteps }) => {
  const steps = [
    { number: 1, label: 'Initial Assessment', icon: '🎯', emoji: '🎯' },
    { number: 2, label: 'Coverage Analysis', icon: '📊', emoji: '📊' },
    { number: 3, label: 'Strategic Pillars', icon: '🏛️', emoji: '🏛️' },
    { number: 4, label: 'Implementation Strategies', icon: '🚀', emoji: '🚀' },
    { number: 5, label: 'Integration Method', icon: '🔗', emoji: '🔗' },
    { number: 6, label: 'Expected Outcome', icon: '✨', emoji: '✨' },
    { number: 7, label: 'Priority Actions', icon: '⚡', emoji: '⚡' },
  ];

  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="h-full glass-effect rounded-3xl shadow-elevated p-6 border border-border/30 sticky top-4 overflow-hidden relative">
      {/* Ambient background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none" />
      
      <div className="relative z-10">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl gradient-primary shadow-glow flex items-center justify-center animate-pulse-glow">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Progress
            </h2>
          </div>
          <p className="text-sm text-muted-foreground ml-13">
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
                    <span className="text-xl">{step.icon}</span>
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
