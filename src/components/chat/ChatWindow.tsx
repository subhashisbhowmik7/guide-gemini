import React, { useRef, useEffect } from 'react';
import { ChatMessageData } from '../../types';
import ChatMessage from './ChatMessage';

interface ChatWindowProps {
  messages: ChatMessageData[];
  onOptionClick: (value: any) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ messages, onOptionClick }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  return (
    <div
      ref={scrollRef}
      className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto custom-scrollbar"
    >
      {messages.map((msg) => (
        <ChatMessage key={msg.id} message={msg} />
      ))}
    </div>
  );
};

export default ChatWindow;
