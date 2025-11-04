import React, { useState, useRef, useEffect } from 'react';
import { ConversationPoint } from '../../lib/conversationFlow';

interface ChatInputProps {
  onSubmit: (value: string | string[]) => void;
  disabled: boolean;
  isBotTyping: boolean;
  currentQuestion: ConversationPoint | undefined;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSubmit, disabled, isBotTyping, currentQuestion }) => {
  const [inputValue, setInputValue] = useState('');
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isOptionType = currentQuestion?.type === 'options' || currentQuestion?.type === 'checkbox';

  useEffect(() => {
    setInputValue('');
    setCheckedItems([]);
    if (textareaRef.current && !isOptionType) {
      textareaRef.current.focus();
    }
  }, [currentQuestion, isOptionType]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleCheckboxChange = (value: string) => {
    setCheckedItems((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (currentQuestion?.type === 'checkbox') {
      if (checkedItems.length > 0) {
        onSubmit(checkedItems);
      }
    } else {
      if (inputValue.trim()) {
        onSubmit(inputValue.trim());
      }
    }
  };

  const handleOptionClick = (value: string) => {
    if (!disabled) {
      onSubmit(value);
    }
  };

  const renderInputArea = () => {
    if (disabled && isBotTyping) {
      return (
        <div className="flex items-center gap-3 px-6 py-4">
          <div className="flex gap-1.5">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: '0ms' }}></span>
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: '150ms' }}></span>
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: '300ms' }}></span>
          </div>
          <span className="text-sm text-muted-foreground font-medium">AI Assistant is thinking...</span>
        </div>
      );
    }

    if (!currentQuestion || disabled) {
      return null;
    }

    if (currentQuestion.type === 'options') {
      return (
        <div className="flex flex-wrap gap-3 px-6 py-4">
          {currentQuestion.options?.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleOptionClick(opt.value)}
              className="group relative px-6 py-3 rounded-xl font-semibold transition-smooth overflow-hidden hover:scale-105"
            >
              <div className="absolute inset-0 gradient-primary opacity-10 group-hover:opacity-100 transition-smooth"></div>
              <div className="absolute inset-0 border-2 border-primary/20 rounded-xl group-hover:border-primary/40 transition-smooth"></div>
              <span className="relative text-foreground group-hover:text-white transition-smooth">
                {opt.label}
              </span>
            </button>
          ))}
        </div>
      );
    }

    if (currentQuestion.type === 'checkbox') {
      return (
        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          <div className="space-y-2">
            {currentQuestion.options?.map((opt) => (
              <label
                key={opt.value}
                className="flex items-center gap-3 p-4 rounded-xl border border-border hover:border-primary/50 transition-smooth cursor-pointer group gradient-card shadow-sm hover:shadow-card"
              >
                <input
                  type="checkbox"
                  checked={checkedItems.includes(opt.value)}
                  onChange={() => handleCheckboxChange(opt.value)}
                  className="w-5 h-5 rounded-lg border-2 border-primary/30 text-primary focus:ring-2 focus:ring-primary/20 transition-smooth"
                />
                <span className="flex-1 text-foreground font-medium group-hover:text-primary transition-smooth">
                  {opt.label}
                </span>
              </label>
            ))}
          </div>
          <button
            type="submit"
            disabled={checkedItems.length === 0}
            className="w-full gradient-primary text-white font-semibold py-4 px-6 rounded-xl shadow-glow hover:shadow-elevated transition-smooth disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02]"
          >
            Submit Selection
          </button>
        </form>
      );
    }

    return (
      <form onSubmit={handleSubmit} className="flex items-end gap-3 px-6 py-4">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            placeholder="Type your response here..."
            rows={1}
            className="w-full p-4 bg-card border-2 border-border rounded-2xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 resize-none transition-smooth text-foreground placeholder:text-muted-foreground"
            disabled={disabled}
          />
        </div>
        <button
          type="submit"
          disabled={disabled || !inputValue.trim()}
          className="gradient-primary text-white p-4 rounded-2xl shadow-glow hover:shadow-elevated transition-smooth disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 hover:scale-105"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </form>
    );
  };

  return (
    <div className="border-t border-border bg-card/50 backdrop-blur-sm">
      {renderInputArea()}
    </div>
  );
};

export default ChatInput;
