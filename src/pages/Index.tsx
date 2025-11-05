import React, { useState, useEffect, useCallback, useRef } from 'react';
import { WizardData, Pillar, ChatMessageData, MessageSender } from '../types';
import { generatePillarsAndStrategies, generateFinalActionPlan } from '../services/LLMService';
import { conversationFlow, ConversationPoint } from '../lib/conversationFlow';

import { useMsal } from "@azure/msal-react";
import StepIndicator from '../components/StepIndicator';
import ChatWindow from '../components/chat/ChatWindow';
import ChatInput from '../components/chat/ChatInput';
import LoadingSpinner from '../components/common/LoadingSpinner';

const TOTAL_STEPS = 7;

const BOT: MessageSender = 'bot';
const USER: MessageSender = 'user';

export default function Index() {
  const [messages, setMessages] = useState<ChatMessageData[]>([]);
  const [wizardData, setWizardData] = useState<WizardData>({
    step1: { investmentDetails: '', industryInfo: '', toolPlatform: '', effort: '', friction: '', whatIf: '' },
    step2: { expected: '', actual: '' },
    step3: { pillars: [], anythingElse: '' },
    step4: { strategies: [] },
    step5: { integrationMethod: null },
    step6: { outcome: null },
    step7: { recircleActions: [] },
    
  });

  const [conversationIndex, setConversationIndex] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [isAwaitingApiResponse, setIsAwaitingApiResponse] = useState(false);
  const wizardDataRef = useRef(wizardData);

  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    wizardDataRef.current = wizardData;
  }, [wizardData]);

  const addMessage = (sender: MessageSender, content: ChatMessageData['content'], options?: { label: string; value: any }[], isAwaitingInput = false) => {
    setMessages((prev) => {
      const updatedMessages = prev.map((m) => ({ ...m, isAwaitingInput: false }));
      const newMessage: ChatMessageData = {
        id: `${Date.now()}-${Math.random()}`,
        sender,
        content,
        options,
        isAwaitingInput,
      };
      return [...updatedMessages, newMessage];
    });
  };

  const getNextBotMessage = useCallback((index: number) => {
    if (index >= conversationFlow.length) {
      addMessage(BOT, "Thank you! You've completed the strategy session. You can now start over.", [], false);
      setCurrentStep(TOTAL_STEPS + 1);
      return;
    }
    const point = conversationFlow[index];
    setCurrentStep(point.step);

    setTimeout(() => {
      setIsBotTyping(false);
      addMessage(BOT, point.question, point.options, true);
    }, 1000);
    setIsBotTyping(true);
  }, []);

  useEffect(() => {
    addMessage(BOT, "Hello! I'm here to help you build a strategic roadmap. Let's begin.", [], false);
    getNextBotMessage(0);
  }, [getNextBotMessage]);

  const handleUserInput = async (value: string | string[]) => {
    const currentPoint = conversationFlow[conversationIndex];
    if (!currentPoint) return;

    const displayValue = Array.isArray(value) ? value.join(', ') : value;
    addMessage(USER, displayValue, [], false);

    const updatedData = { ...wizardDataRef.current };
    const keys = currentPoint.dataPath.split('.');
    let currentObject: any = updatedData;
    keys.forEach((key, index) => {
      if (index === keys.length - 1) {
        currentObject[key] = value;
      } else {
        currentObject = currentObject[key];
      }
    });
    setWizardData(updatedData);

    if (currentPoint.key === 'actual') {
      setIsAwaitingApiResponse(true);
      addMessage(
        BOT,
        <div className="flex items-center gap-3">
          <LoadingSpinner />
          <span className="font-medium">Generating your strategy with AI...</span>
        </div>,
        [],
        false
      );
      try {
        const result = await generatePillarsAndStrategies(updatedData.step1, updatedData.step2);
        const defaultPillars: Pillar[] = [
          { title: 'Governance', description: '', actionItems: [] },
          { title: 'Efficiency', description: '', actionItems: [] },
          { title: 'Security', description: '', actionItems: [] },
          { title: 'Adoption', description: '', actionItems: [] },
          { title: 'Usability', description: '', actionItems: [] },
        ];
        const uniqueGeneratedPillars = result.pillars.filter(
          (p) => !defaultPillars.some((dp) => dp.title.toLowerCase() === p.title.toLowerCase())
        );
        const combinedPillars = [...defaultPillars, ...uniqueGeneratedPillars];

        setWizardData((prev) => ({
          ...prev,
          step3: { ...prev.step3, pillars: combinedPillars },
          step4: { ...prev.step4, strategies: result.strategies },
        }));

        addMessage(BOT, "I've analyzed your input and generated the following strategic pillars and strategies based on it.");
        addMessage(BOT, { type: 'pillars', data: combinedPillars });
        addMessage(BOT, { type: 'strategies', data: result.strategies });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
        addMessage(BOT, `Sorry, I encountered an error: ${errorMessage}. Please try again.`);
        } finally {
            setIsAwaitingApiResponse(false);
        }
    }

    // After Step 7 (last question), generate final action plan
    if (currentPoint.key === 'recircleActions') {
        setIsAwaitingApiResponse(true);
        addMessage(BOT, <div className="flex items-center gap-3"><LoadingSpinner /> <span className="font-medium">Creating your comprehensive action plan...</span></div>, [], false);
        try {
            console.log('📋 Generating final action plan after step 7');
            const finalPlan = await generateFinalActionPlan(updatedData);
            
            addMessage(BOT, "Perfect! I've compiled everything into a comprehensive action plan for you.");
            addMessage(BOT, { type: 'actionPlan', data: finalPlan } as any);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
            addMessage(BOT, `Sorry, I encountered an error generating the final plan: ${errorMessage}`);
        } finally {
            setIsAwaitingApiResponse(false);
        }
    }
    
    const nextIndex = conversationIndex + 1;
    setConversationIndex(nextIndex);
    getNextBotMessage(nextIndex);
  };

  const handleRestart = () => {
    setMessages([]);
    setWizardData({
      step1: { investmentDetails: '', industryInfo: '', toolPlatform: '', effort: '', friction: '', whatIf: '' },
      step2: { expected: '', actual: '' },
      step3: { pillars: [], anythingElse: '' },
      step4: { strategies: [] },
      step5: { integrationMethod: null },
      step6: { outcome: null },
      step7: { recircleActions: [] },
    });
    setConversationIndex(0);
    setCurrentStep(1);
    setIsBotTyping(false);
    setIsAwaitingApiResponse(false);

    setTimeout(() => {
      addMessage(BOT, "Alright, let's start over from the beginning.", [], false);
      getNextBotMessage(0);
    }, 500);
  };

  const isInputDisabled = isBotTyping || isAwaitingApiResponse || conversationIndex >= conversationFlow.length;

  return (
    <div className="flex flex-col lg:flex-row items-stretch justify-center min-h-screen gap-6 p-4 md:p-8 max-w-[1600px] mx-auto">
      <div className="lg:w-80 flex-shrink-0">
        <StepIndicator currentStep={currentStep > TOTAL_STEPS ? TOTAL_STEPS : currentStep} totalSteps={TOTAL_STEPS} />
      </div>

      <div className="flex-1 h-[85vh] flex flex-col glass-effect rounded-3xl shadow-elevated overflow-hidden border border-border/30">
        <div className="p-6 border-b border-border bg-card/50 backdrop-blur-sm flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-primary shadow-glow flex items-center justify-center">
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
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              AI Strategy Assistant
            </h1>
          </div>
          <button
            onClick={handleRestart}
            className="px-4 py-2 rounded-xl bg-muted hover:bg-muted/80 text-foreground font-semibold transition-smooth hover:scale-105 flex items-center gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Start Over
          </button>
        </div>

        <ChatWindow messages={messages} onOptionClick={handleUserInput} />

        <ChatInput
          onSubmit={handleUserInput}
          disabled={isInputDisabled}
          isBotTyping={isBotTyping}
          currentQuestion={conversationFlow[conversationIndex]}
        />
      </div>
    </div>
  );
}
