export type MessageSender = 'bot' | 'user';

export interface SpecialContent {
  type: string;
  data: any[];
}

export interface ChatMessageData {
  id: string;
  sender: MessageSender;
  content: string | React.ReactNode | SpecialContent;
  options?: { label: string; value: any }[];
  isAwaitingInput?: boolean;
}

export interface Pillar {
  title: string;
  description: string;
  actionItems: string[];
}

export interface Strategy {
  title: string;
  description: string;
  steps: string[];
}

export interface Step1Data {
  investmentDetails: string;
  industryInfo: string;
  toolPlatform: string;
  effort: string;
  friction: string;
  whatIf: string;
}

export interface Step2Data {
  expected: string;
  actual: string;
}

export interface Step3Data {
  pillars: Pillar[];
  anythingElse: string;
}

export interface Step4Data {
  strategies: Strategy[];
}

export interface Step5Data {
  integrationMethod: string | null;
}

export interface Step6Data {
  outcome: string | null;
}

export interface Step7Data {
  recircleActions: string[];
}

export interface WizardData {
  step1: Step1Data;
  step2: Step2Data;
  step3: Step3Data;
  step4: Step4Data;
  step5: Step5Data;
  step6: Step6Data;
  step7: Step7Data;
}
