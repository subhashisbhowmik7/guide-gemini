export interface ConversationPoint {
  step: number;
  key: string;
  question: string;
  type: 'text' | 'options' | 'checkbox';
  options?: { label: string; value: string }[];
  dataPath: string;
}

export const conversationFlow: ConversationPoint[] = [
  {
    step: 1,
    key: 'investmentDetails',
    question: 'What investment details would you like to share?',
    type: 'text',
    dataPath: 'step1.investmentDetails',
  },
  {
    step: 1,
    key: 'industryInfo',
    question: 'What industry-specific information can you provide?',
    type: 'text',
    dataPath: 'step1.industryInfo',
  },
  {
    step: 1,
    key: 'toolPlatform',
    question: 'What tool or platform are you using?',
    type: 'text',
    dataPath: 'step1.toolPlatform',
  },
  {
    step: 1,
    key: 'effort',
    question: 'What is the estimated effort required?',
    type: 'text',
    dataPath: 'step1.effort',
  },
  {
    step: 1,
    key: 'friction',
    question: 'What are the known friction points?',
    type: 'text',
    dataPath: 'step1.friction',
  },
  {
    step: 1,
    key: 'whatIf',
    question: 'What are your what-if scenarios?',
    type: 'text',
    dataPath: 'step1.whatIf',
  },
  {
    step: 2,
    key: 'expected',
    question: 'What was expected from this initiative?',
    type: 'text',
    dataPath: 'step2.expected',
  },
  {
    step: 2,
    key: 'actual',
    question: 'What is the current situation?',
    type: 'text',
    dataPath: 'step2.actual',
  },
  {
    step: 3,
    key: 'anythingElse',
    question: 'Is there anything else you would like to add about the strategic pillars?',
    type: 'text',
    dataPath: 'step3.anythingElse',
  },
  {
    step: 5,
    key: 'integrationMethod',
    question: 'What integration method would you prefer?',
    type: 'options',
    options: [
      { label: 'API Integration', value: 'api' },
      { label: 'Manual Process', value: 'manual' },
      { label: 'Automated Workflow', value: 'automated' },
    ],
    dataPath: 'step5.integrationMethod',
  },
  {
    step: 6,
    key: 'outcome',
    question: 'What is your desired outcome?',
    type: 'options',
    options: [
      { label: 'Increased Efficiency', value: 'efficiency' },
      { label: 'Cost Reduction', value: 'cost' },
      { label: 'Better User Experience', value: 'ux' },
      { label: 'All of the Above', value: 'all' },
    ],
    dataPath: 'step6.outcome',
  },
  {
    step: 7,
    key: 'recircleActions',
    question: 'Which actions would you like to prioritize? (Select multiple)',
    type: 'checkbox',
    options: [
      { label: 'Review current processes', value: 'review' },
      { label: 'Implement new strategies', value: 'implement' },
      { label: 'Train team members', value: 'train' },
      { label: 'Monitor progress', value: 'monitor' },
    ],
    dataPath: 'step7.recircleActions',
  },
];
