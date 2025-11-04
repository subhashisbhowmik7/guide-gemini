import React from 'react';

interface PillarCardProps {
  title: string;
  description: string;
  actionItems: string[];
  index: number;
}

export const PillarCard: React.FC<PillarCardProps> = ({ title, description, actionItems, index }) => {
  const delay = index * 100;
  
  return (
    <div
      className="gradient-card rounded-2xl p-6 shadow-card border border-border transition-smooth hover:shadow-elevated hover:scale-[1.02] group animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0 shadow-glow">
          <span className="text-white font-bold text-lg">{index + 1}</span>
        </div>
        <h3 className="font-bold text-xl text-foreground group-hover:text-primary transition-smooth">
          {title}
        </h3>
      </div>
      <p className="text-muted-foreground leading-relaxed mb-4">{description}</p>
      {actionItems && actionItems.length > 0 && (
        <div className="space-y-2 pt-4 border-t border-border">
          <h4 className="text-sm font-semibold text-foreground uppercase tracking-wide">
            Action Items
          </h4>
          <ul className="space-y-2">
            {actionItems.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                <svg
                  className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="flex-1">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

interface StrategyCardProps {
  title: string;
  description: string;
  steps: string[];
  index: number;
}

export const StrategyCard: React.FC<StrategyCardProps> = ({ title, description, steps, index }) => {
  const delay = index * 150;
  
  return (
    <div
      className="gradient-card rounded-2xl p-6 shadow-card border border-border transition-smooth hover:shadow-elevated animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 rounded-xl gradient-secondary flex items-center justify-center flex-shrink-0 shadow-glow">
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
            />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-2xl font-bold text-foreground mb-2">{title}</h3>
          <p className="text-muted-foreground leading-relaxed">{description}</p>
        </div>
      </div>
      <div className="pt-4 border-t border-border">
        <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <svg
            className="w-5 h-5 text-accent"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          Action Steps
        </h4>
        <ul className="space-y-3">
          {steps.map((step, idx) => (
            <li key={idx} className="flex items-start gap-3 group">
              <span className="flex-shrink-0 w-8 h-8 rounded-lg gradient-primary text-white font-bold text-sm flex items-center justify-center shadow-sm group-hover:scale-110 transition-bounce">
                {idx + 1}
              </span>
              <span className="flex-1 text-muted-foreground leading-relaxed pt-1">
                {step}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
