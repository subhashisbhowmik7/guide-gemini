import React, { useEffect, useState } from 'react';
import { ChatMessageData } from '../../types';
import { PillarCard, StrategyCard } from './ContentCards';

interface ChatMessageProps {
  message: ChatMessageData;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const [isVisible, setIsVisible] = useState(false);
  const isBot = message.sender === 'bot';

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const renderContent = () => {
    if (typeof message.content === 'object' && message.content !== null && 'type' in message.content) {
      const content = message.content as { type: string; data: any };
      const { type, data } = content;
      if (type === 'pillars') {
        return (
          <div className="space-y-6 animate-fade-in-up">
            <h3 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Strategic Pillars
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {data.map((pillar: any, index: number) => (
                <PillarCard key={index} {...pillar} index={index} />
              ))}
            </div>
          </div>
        );
      }
      if (type === 'strategies') {
        return (
          <div className="space-y-6 animate-fade-in-up">
            <h3 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent mt-4">
              Implementation Strategies
            </h3>
            {data.map((strategy: any, index: number) => (
              <StrategyCard key={index} {...strategy} index={index} />
            ))}
          </div>
        );
      }
      if (type === 'actionPlan') {
        return (
          <div className="space-y-6 animate-fade-in-up">
            <h3 className="text-2xl font-bold bg-gradient-primary bg-clip-text">
              Here's your Strategic Action Plan
            </h3>
            <div className="gradient-card p-6 rounded-2xl border border-border">
              <p className="text-foreground leading-relaxed mb-6 text-lg">{data.summary}</p>
              <div className="space-y-6">
                {data.actionPlan.map((category: any, idx: number) => (
                  <div key={idx} className="animate-fade-in-up" style={{ animationDelay: `${idx * 100}ms` }}>
                    <h4 className="text-lg font-bold text-secondary mb-3 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg gradient-secondary flex items-center justify-center shadow-glow">
                        <span className="text-white font-bold text-sm">{idx + 1}</span>
                      </div>
                      {category.category}
                    </h4>
                    <ul className="space-y-2 ml-10">
                      {category.actions.map((action: string, actionIdx: number) => (
                        <li key={actionIdx} className="flex items-start gap-2 text-muted-foreground">
                          <svg className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="flex-1">{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      }
    }
    // Render regular content (string or ReactNode)
    if (typeof message.content === 'string') {
      return <div className="whitespace-pre-wrap leading-relaxed">{message.content}</div>;
    }
    return <div className="whitespace-pre-wrap leading-relaxed">{message.content as React.ReactNode}</div>;
  };

  return (
    <div
      className={`flex items-end gap-3 transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      } ${isBot ? 'justify-start' : 'justify-end'}`}
    >
      {isBot && (
        <div className="w-10 h-10 rounded-2xl gradient-primary flex items-center justify-center text-white font-bold flex-shrink-0 shadow-glow">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
          </svg>
        </div>
      )}
      <div
        className={`max-w-2xl p-4 rounded-3xl transition-smooth ${
          isBot
            ? 'bg-card text-card-foreground shadow-card border border-border rounded-bl-sm'
            : 'gradient-primary text-white shadow-glow rounded-br-sm'
        }`}
      >
        {renderContent()}
      </div>
      {!isBot && (
        <div className="w-10 h-10 rounded-2xl bg-muted flex items-center justify-center text-foreground font-semibold flex-shrink-0">
          U
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
