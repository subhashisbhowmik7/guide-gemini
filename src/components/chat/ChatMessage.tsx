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
      const content = message.content as { type: string; data: any[] };
      const { type, data } = content;
      if (type === 'pillars') {
        return (
          <div className="space-y-6 animate-fade-in-up">
            <h3 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Strategic Pillars
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {data.map((pillar, index) => (
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
            {data.map((strategy, index) => (
              <StrategyCard key={index} {...strategy} index={index} />
            ))}
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
