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

  // 🧠 Reset state when question changes
  useEffect(() => {
    setCheckedItems([]);
    // 👇 only clear if no placeholder defined
    if (!currentQuestion?.placeholder) {
      setInputValue('');
    } else {
      setInputValue(currentQuestion.placeholder);
    }

    // focus only for free-text questions
    if (textareaRef.current && !isOptionType) {
      textareaRef.current.focus();
    }
  }, [currentQuestion, isOptionType]);

  // 🔠 Handle manual typing
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  // ✅ Checkbox handler
  const handleCheckboxChange = (value: string) => {
    setCheckedItems((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  // 🚀 Form submit logic
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

  // 💡 Option button click
  const handleOptionClick = (value: string) => {
    if (!disabled) {
      onSubmit(value);
    }
  };

  // ✨ Dynamic rendering for different question types
  const renderInputArea = () => {
    if (disabled && isBotTyping) {
      return (
        <div className="flex items-center gap-3 px-6 py-4">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full gradient-primary animate-bounce shadow-glow" style={{ animationDelay: '0ms' }}></span>
            <span className="w-2.5 h-2.5 rounded-full gradient-primary animate-bounce shadow-glow" style={{ animationDelay: '150ms' }}></span>
            <span className="w-2.5 h-2.5 rounded-full gradient-primary animate-bounce shadow-glow" style={{ animationDelay: '300ms' }}></span>
          </div>
          <span className="text-sm text-muted-foreground font-medium animate-pulse">AI is crafting your response...</span>
        </div>
      );
    }

    if (!currentQuestion || disabled) return null;

    // 🟦 Multiple-choice buttons
    if (currentQuestion.type === 'options') {
      return (
        <div className="flex flex-wrap gap-3 px-6 py-4">
          {currentQuestion.options?.map((opt, index) => (
            <button
              key={opt.value}
              onClick={() => handleOptionClick(opt.value)}
              className="group relative px-6 py-3.5 rounded-xl font-semibold transition-all duration-300 overflow-hidden hover:scale-105 hover:shadow-glow border-2 glass-effect animate-fade-in-up bg-card/90"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="absolute inset-0 gradient-primary opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
              <div className="absolute inset-0 border-2 border-primary/30 rounded-xl group-hover:border-primary transition-all duration-300"></div>
              <span className="relative z-10 text-primary group-hover:text-white transition-all duration-300 font-bold">
                {opt.label}
              </span>
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </button>
          ))}
        </div>
      );
    }

    // 🟩 Checkbox group
    if (currentQuestion.type === 'checkbox') {
      return (
        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          <div className="space-y-3">
            {currentQuestion.options?.map((opt, index) => (
              <label
                key={opt.value}
                className="flex items-center gap-4 p-4 rounded-xl border-2 border-border hover:border-primary/50 transition-all duration-300 cursor-pointer group glass-effect shadow-sm hover:shadow-card animate-fade-in-up hover:scale-[1.02] bg-card/90"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={checkedItems.includes(opt.value)}
                    onChange={() => handleCheckboxChange(opt.value)}
                    className="peer w-5 h-5 rounded-lg border-2 border-primary/40 text-primary focus:ring-2 focus:ring-primary/30 transition-all cursor-pointer checked:bg-primary checked:border-primary"
                  />
                  <div className="absolute inset-0 rounded-lg bg-gradient-primary opacity-0 peer-checked:opacity-20 transition-opacity pointer-events-none" />
                </div>
                <span className="flex-1 text-foreground font-medium group-hover:text-primary transition-all duration-300">
                  {opt.label}
                </span>
                {checkedItems.includes(opt.value) && (
                  <span className="text-primary font-bold animate-scale-in"></span>
                )}
              </label>
            ))}
          </div>
          <button
            type="submit"
            disabled={checkedItems.length === 0}
            className="relative w-full gradient-primary text-white font-bold py-4 px-6 rounded-xl shadow-glow hover:shadow-elevated transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] overflow-hidden group"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              Submit Selection {checkedItems.length > 0 && `(${checkedItems.length})`}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </button>
        </form>
      );
    }

    // 📝 Default text input
    return (
      <form onSubmit={handleSubmit} className="flex items-end gap-3 px-6 py-4">
        <div className="flex-1 relative group">
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
            placeholder={currentQuestion?.placeholder || 'Type your response here...'}
            rows={1}
            className="w-full p-4 pr-20 glass-effect border-2 border-border rounded-2xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 resize-none transition-all duration-300 text-foreground placeholder:text-muted-foreground hover:border-primary/30"
            disabled={disabled}
          />
          <div className="absolute right-3 bottom-3 text-xs text-muted-foreground/60 group-focus-within:text-primary transition-colors flex items-center gap-1">
            <span>Press</span>
            <kbd className="px-1.5 py-0.5 rounded bg-muted text-[10px] font-mono">Enter</kbd>
          </div>
        </div>
        <button
          type="submit"
          disabled={disabled || !inputValue.trim()}
          className="relative gradient-primary text-white p-4 rounded-2xl shadow-glow hover:shadow-elevated transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 hover:scale-110 overflow-hidden group"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 relative z-10 transform group-hover:translate-y-[-2px] group-hover:rotate-12 transition-transform duration-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
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
