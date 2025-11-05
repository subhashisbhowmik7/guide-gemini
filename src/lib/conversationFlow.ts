export interface ConversationPoint {
  step: number;
  key: string;
  question: string;
  type: 'text' | 'options' | 'checkbox';
  options?: { label: string; value: string }[];
  dataPath: string;
  placeholder?: string;
}

export const conversationFlow: ConversationPoint[] = [
  // 🟦 Step 1: Data Collection
  {
    step: 1,
    key: 'investmentDetails',
    question: 'What investment details would you like to share?',
    type: 'text',
    dataPath: 'step1.investmentDetails',
    placeholder: 'Example: AI-powered analytics platform upgrade for retail operations.'
  },
  {
    step: 1,
    key: 'industryInfo',
    question: 'What industry-specific information can you provide?',
    type: 'text',
    dataPath: 'step1.industryInfo',
    placeholder: 'Example: Retail sector with focus on digital adoption and customer analytics.'
  },
  {
    step: 1,
    key: 'toolPlatform',
    question: 'What tool or platform are you using?',
    type: 'text',
    dataPath: 'step1.toolPlatform',
    placeholder: 'Example: Microsoft Azure AI Studio or Power BI integration.'
  },
  {
    step: 1,
    key: 'effort',
    question: 'What is the estimated effort required?',
    type: 'text',
    dataPath: 'step1.effort',
    placeholder: 'Example: 6-week project involving 3 data engineers and 1 consultant.'
  },
  {
    step: 1,
    key: 'friction',
    question: 'What are the known friction points?',
    type: 'text',
    dataPath: 'step1.friction',
    placeholder: 'Example: Data quality issues and inconsistent data formats across sources.'
  },
  {
    step: 1,
    key: 'whatIf',
    question: 'What are your what-if scenarios?',
    type: 'text',
    dataPath: 'step1.whatIf',
    placeholder: 'Example: What if the data pipeline doesn’t scale during the pilot rollout?'
  },

  // 🟨 Step 2: Coverage Calculation
  {
    step: 2,
    key: 'expected',
    question: 'What was expected from this initiative?',
    type: 'text',
    dataPath: 'step2.expected',
    placeholder: 'Example: Achieve 30% faster report generation and improved customer insights.'
  },
  {
    step: 2,
    key: 'actual',
    question: 'What is the current situation?',
    type: 'text',
    dataPath: 'step2.actual',
    placeholder: 'Example: Reports still require manual intervention and data latency remains high.'
  },

  // 🟩 Step 3: Prepare Pillars
  {
    step: 3,
    key: 'anythingElse',
    question: 'Is there anything else to consider when preparing your strategic pillars?',
    type: 'text',
    dataPath: 'step3.anythingElse',
    placeholder: 'Example: Include governance and data literacy training for business users.'
  },

  // 🟦 Step 4: Generate Strategies
  {
    step: 4,
    key: 'strategies',
    question: 'Which strategies would you like to prioritize?',
    type: 'options',
    options: [
      { label: 'Generate Use Cases to Test', value: 'useCases' },
      { label: 'Verify Design Effectiveness', value: 'designEffectiveness' },
      { label: 'Isolate Operational Blockers', value: 'operationalBlockers' },
    ],
    dataPath: 'step4.strategies',
  },

  // 🟪 Step 5: Integrate / Associate
  {
    step: 5,
    key: 'integrationMethod',
    question: 'What integration method would you prefer?',
    type: 'options',
    options: [
      { label: 'Consultant Led Execution', value: 'consultant' },
      { label: 'API Led Application', value: 'api' },
    ],
    dataPath: 'step5.integrationMethod',
  },

  // 🟧 Step 6: Outcome
  {
    step: 6,
    key: 'outcome',
    question: 'What is your desired outcome from this process?',
    type: 'options',
    options: [
      { label: 'Operation Playbook', value: 'playbook' },
      { label: 'Adoption Roadmap', value: 'adoption' },
    ],
    dataPath: 'step6.outcome',
  },

  // 🟥 Step 7: Recircle
  {
    step: 7,
    key: 'recircleActions',
    question: 'Which actions would you like to prioritize for continuous improvement?',
    type: 'checkbox',
    options: [
      { label: 'Recheck on progress', value: 'recheck' },
      { label: 'Reenforce roadmap', value: 'reenforce' },
      { label: 'User Training', value: 'training' },
    ],
    dataPath: 'step7.recircleActions',
  },
];
