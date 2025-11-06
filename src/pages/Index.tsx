import React, { useState, useEffect, useCallback, useRef } from 'react';
import { WizardData, Pillar, ChatMessageData, MessageSender } from '../types';
import { generatePillarsAndStrategies, generateFinalActionPlan } from '../services/LLMService';
import { conversationFlow, ConversationPoint } from '../lib/conversationFlow';

import { useMsal } from "@azure/msal-react";
import StepIndicator from '../components/StepIndicator';
import ChatWindow from '../components/chat/ChatWindow';
import ChatInput from '../components/chat/ChatInput';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { set } from 'date-fns';

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
  const loadingMessageIdRef = useRef<string | null>(null);

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

  const addLoadingMessage = (message: string): string => {
    const loadingId = `loading-${Date.now()}-${Math.random()}`;
    loadingMessageIdRef.current = loadingId;
    
    setMessages((prev) => {
      const updatedMessages = prev.map((m) => ({ ...m, isAwaitingInput: false }));
      const newMessage: ChatMessageData = {
        id: loadingId,
        sender: BOT,
        content: (
          <div className="flex items-center gap-3">
            <LoadingSpinner />
            <span className="font-medium">{message}</span>
          </div>
        ),
        isAwaitingInput: false,
      };
      return [...updatedMessages, newMessage];
    });
    
    return loadingId;
  };

  const removeLoadingMessage = () => {
    if (loadingMessageIdRef.current) {
      setMessages((prev) => prev.filter(m => m.id !== loadingMessageIdRef.current));
      loadingMessageIdRef.current = null;
    }
  };

  const getNextBotMessage = useCallback((index: number) => {
    if (index >= conversationFlow.length) {
      // All steps completed - mark the final step as complete
      setCurrentStep(TOTAL_STEPS + 1);
      addMessage(BOT, "Thank you! You've completed the strategy session. You can now start over.", [], false);
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

    // HANDLE STEP 2 COMPLETION - Generate Pillars and Strategies
    if (currentPoint.key === 'actual') {
      setIsAwaitingApiResponse(true);
      const loadingId = addLoadingMessage('Generating your strategy with AI...');
      
      try {
        console.log('🔄 Calling API to generate pillars and strategies...');
        const result = await generatePillarsAndStrategies(updatedData.step1, updatedData.step2);
        console.log('✅ API returned result:', result);
        
        // Define default pillars that will be populated with API data
        const defaultPillarTitles = ['Governance', 'Efficiency', 'Security', 'Adoption', 'Usability'];
        
        // Create default pillars structure
        const defaultPillars: Pillar[] = [
          { 
            title: 'Governance', 
            description: 'Establish clear oversight, accountability, and decision-making frameworks to ensure strategic alignment and compliance.',
            actionItems: ['Define roles and responsibilities', 'Create governance committees', 'Establish approval workflows', 'Set up regular review cycles']
          },
          { 
            title: 'Efficiency', 
            description: 'Optimize processes and resources to maximize productivity while minimizing waste and redundancy.',
            actionItems: ['Identify process bottlenecks', 'Automate repetitive tasks', 'Streamline workflows', 'Measure and track KPIs']
          },
          { 
            title: 'Security', 
            description: 'Implement comprehensive security measures to protect data, systems, and operations from threats and vulnerabilities.',
            actionItems: ['Conduct security audits', 'Implement access controls', 'Establish data protection policies', 'Train staff on security protocols']
          },
          { 
            title: 'Adoption', 
            description: 'Drive user engagement and ensure successful implementation through effective change management and training.',
            actionItems: ['Develop training programs', 'Create user documentation', 'Establish support channels', 'Gather and act on user feedback']
          },
          { 
            title: 'Usability', 
            description: 'Enhance user experience through intuitive design, accessibility, and responsive interfaces that meet user needs.',
            actionItems: ['Conduct usability testing', 'Simplify user interfaces', 'Ensure accessibility standards', 'Optimize for mobile devices']
          },
        ];
        
        // Override default pillars with API-generated ones if they exist
        const pillarsFromAPI = result.pillars || [];
        console.log('📊 Pillars from API:', pillarsFromAPI);
        
        // Map to update defaults or add new ones
        const updatedDefaultPillars = defaultPillars.map(defaultPillar => {
          const apiPillar = pillarsFromAPI.find(
            p => p.title.toLowerCase() === defaultPillar.title.toLowerCase()
          );
          // If API returned data for this pillar, use it; otherwise keep default
          return apiPillar || defaultPillar;
        });
        
        // Add any additional pillars from API that aren't in defaults
        const additionalPillars = pillarsFromAPI.filter(
          apiPillar => !defaultPillarTitles.some(
            title => title.toLowerCase() === apiPillar.title.toLowerCase()
          )
        );
        
        const allPillars = [...updatedDefaultPillars, ...additionalPillars];
        console.log('📋 Final combined pillars:', allPillars);

        // Update wizard data with the combined pillars and strategies
        const newWizardData = {
          ...updatedData,
          step3: { ...updatedData.step3, pillars: allPillars },
          step4: { ...updatedData.step4, strategies: result.strategies || [] },
        };
        
        setWizardData(newWizardData);
        
        // Remove loading message and stop API state
        setMessages(prev => prev.filter(m => m.id !== loadingId));
        setIsAwaitingApiResponse(false);
        
        addMessage(BOT, "I've analyzed your input and generated the following strategic pillars and strategies based on it.");
        addMessage(BOT, { type: 'pillars', data: allPillars });
        addMessage(BOT, { type: 'strategies', data: result.strategies || [] });
        
      } catch (err) {
        console.error('❌ Error in handleUserInput:', err);
        removeLoadingMessage();
        setIsAwaitingApiResponse(false);
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
        addMessage(BOT, `Sorry, I encountered an error: ${errorMessage}. Please try again.`);
      }
      
      // Move to next question
      const nextIndex = conversationIndex + 1;
      setConversationIndex(nextIndex);
      getNextBotMessage(nextIndex);
      return; // Exit early to prevent duplicate progression
    }

    // HANDLE STEP 7 COMPLETION - Generate Final Action Plan
    if (currentPoint.key === 'recircleActions') {
        setIsAwaitingApiResponse(true);
        const loadingId = addLoadingMessage('Creating your comprehensive action plan...');
        
        try {
            console.log('📋 Generating final action plan after step 7');
            const finalPlan = await generateFinalActionPlan(updatedData);
            console.log('✅ Final plan received:', finalPlan);
            
            // Remove loading message and stop API state
            setMessages(prev => prev.filter(m => m.id !== loadingId));
            setIsAwaitingApiResponse(false);
            
            // Mark final step as complete by setting to next step
            setCurrentStep(TOTAL_STEPS + 1);
            
            addMessage(BOT, "Perfect! I've compiled everything into a comprehensive action plan for you.");
            addMessage(BOT, { type: 'actionPlan', data: finalPlan } as any);
            
        } catch (err) {
            console.error('❌ Error generating final plan:', err);
            removeLoadingMessage();
            setIsAwaitingApiResponse(false);
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
            addMessage(BOT, `Sorry, I encountered an error generating the final plan: ${errorMessage}`);
        }
        
        // Complete the wizard
        setConversationIndex(conversationFlow.length);
        setCurrentStep(TOTAL_STEPS + 1);
        addMessage(BOT, "Thank you! You've completed the strategy session. You can now start over.", [], false);
        return; // Exit early
    }
    
    // For all other steps, just move to next question normally
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
    loadingMessageIdRef.current = null;

    setTimeout(() => {
      addMessage(BOT, "Alright, let's start over from the beginning.", [], false);
      getNextBotMessage(0);
    }, 500);
  };

  const isInputDisabled = isBotTyping || isAwaitingApiResponse || conversationIndex >= conversationFlow.length;

  return (
    <div className="flex flex-col lg:flex-row items-stretch justify-center min-h-screen gap-6 p-2 md:p-4 max-w-[1600px] mx-auto">
      <div className="lg:w-80 flex-shrink-0 h-[95vh]">
        <StepIndicator currentStep={currentStep} totalSteps={TOTAL_STEPS} />
      </div>

      <div className="flex-1 h-[95vh] flex flex-col glass-effect rounded-3xl shadow-elevated overflow-hidden border border-border/30">
        <div className="p-6 border-b border-border bg-card/50 backdrop-blur-sm flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl gradient-primary shadow-glow flex items-center justify-center">
              <svg
                className="w-7 h-7 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <div className="flex flex-col">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Strategy Wizard
              </div>
              <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text">
                Strategic Advisory Platform
              </h1>
            </div>
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