import { Step1Data, Step2Data, Pillar, Strategy, WizardData } from '../types';

const VITE_AZUREOPENAI_API_KEY = import.meta.env.VITE_AZUREOPENAI_API_KEY;
const VITE_GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/AZUREOPENAI-2.0-flash-exp:generateContent';
const AZUREOPENAI_API_URL = 'https://iao-poc-dev.openai.azure.com/openai/deployments/gpt-4.1/chat/completions?api-version=2025-01-01-preview';


export const generatePillarsAndStrategies = async (
  step1: Step1Data,
  step2: Step2Data
): Promise<{ pillars: Pillar[]; strategies: Strategy[] }> => {
  console.log('🔄 Calling AZUREOPENAI API for pillars and strategies...', { step1, step2 });

  if (!VITE_AZUREOPENAI_API_KEY) {
    console.error('❌ VITE_AZUREOPENAI_API_KEY not found in environment variables');
    throw new Error('AZUREOPENAI API key is not configured. Please add VITE_AZUREOPENAI_API_KEY to your .env file');
  }

  const prompt = `Based on the following investment and tool details, generate strategic pillars and implementation strategies.

**Step 1: Data Collection**
- Investment Details: ${step1.investmentDetails}
- Industry Specific Information: ${step1.industryInfo}
- Tool/Platform Details: ${step1.toolPlatform}
- Estimated Effort: ${step1.effort}
- Known Friction Points: ${step1.friction}
- What-If Scenarios: ${step1.whatIf}

**Step 2: Coverage Calculation**
- What was expected: ${step2.expected}
- What is the current situation: ${step2.actual}

**Task:**
Analyze the provided data to identify key areas of focus. Generate a JSON object containing:
1. 'pillars': A list of 2-3 strategic pillars derived from the input data. Do NOT include 'Governance', 'Efficiency', 'Security', 'Adoption', or 'Usability' as these are defaults. Focus on new, context-specific pillars. Each pillar MUST have a title, a detailed description (minimum 20 words), and a list of 3-5 concrete action items.
2. 'strategies': A list of exactly 3 strategies titled "Generate Use Cases to Test", "Verify Design Effectiveness", and "Isolate Operational Blockers". Each strategy MUST have a title, a detailed description (minimum 20 words), and a list of 4-6 specific actionable steps.

Return ONLY valid JSON in this exact format:
{
  "pillars": [
    {
      "title": "string",
      "description": "detailed description here",
      "actionItems": ["item1", "item2", "item3"]
    }
  ],
  "strategies": [
    {
      "title": "Generate Use Cases to Test",
      "description": "detailed description here",
      "steps": ["step1", "step2", "step3", "step4"]
    }
  ]
}`;

  console.log('🔄 AZUREOPENAI prompt:', prompt )

  try {
    const response = await fetch(AZUREOPENAI_API_URL, {
        method: 'POST',
        headers: {
      'Content-Type': 'application/json',
      'api-key': VITE_AZUREOPENAI_API_KEY,

    },
      body: JSON.stringify({
      messages: [
        { role: 'system', content: 'You are a strategic assistant that outputs structured JSON.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 2048
    })});

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ AZUREOPENAI API error:', response.status, errorText);
      throw new Error(`AZUREOPENAI API returned ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ AZUREOPENAI API raw response:', data);

    const textContent = data.choices?.[0]?.message?.content?.trim();
    if (!textContent) {
      console.error('❌ No text content in AZUREOPENAI response:', data);
      throw new Error('Invalid response format from AZUREOPENAI API');
    }

    // Extract JSON from markdown code blocks if present
    let jsonText = textContent.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '');
    }

    const parsedData = JSON.parse(jsonText);
    console.log('✅ Parsed AZUREOPENAI data:', parsedData);

    return parsedData;
  } catch (error) {
    console.error('❌ Error calling AZUREOPENAI API:', error);
    
    // Fallback to mock data if API fails
    console.warn('⚠️ Using fallback mock data');
    return {
      pillars: [
        {
          title: 'Innovation',
          description: 'Drive continuous improvement and innovation across all processes',
          actionItems: [
            'Establish innovation labs',
            'Create feedback loops',
            'Implement rapid prototyping',
          ],
        },
        {
          title: 'Scalability',
          description: 'Build systems that can grow with your organization',
          actionItems: [
            'Design modular architecture',
            'Implement cloud-native solutions',
            'Plan for future growth',
          ],
        },
      ],
      strategies: [
        {
          title: 'Generate Use Cases to Test',
          description: 'Develop comprehensive test scenarios to validate your strategic approach',
          steps: [
            'Identify key stakeholder requirements',
            'Map user journeys and pain points',
            'Create test scenarios covering edge cases',
            'Document expected outcomes for each use case',
          ],
        },
        {
          title: 'Verify Design Effectiveness',
          description: 'Ensure your design meets business objectives and user needs',
          steps: [
            'Conduct usability testing with target users',
            'Gather feedback from stakeholders',
            'Measure against defined success metrics',
            'Iterate based on findings',
          ],
        },
        {
          title: 'Isolate Operational Blockers',
          description: 'Identify and address obstacles preventing successful implementation',
          steps: [
            'Map current operational workflows',
            'Identify bottlenecks and dependencies',
            'Prioritize blockers by impact',
            'Develop mitigation strategies',
          ],
        },
      ],
    };
  }
};

export const generateFinalActionPlan = async (
  wizardData: WizardData
): Promise<{ actionPlan: { category: string; actions: string[] }[]; summary: string }> => {
  console.log('🔄 Calling AZUREOPENAI API for final action plan...', { wizardData });

  if (!VITE_AZUREOPENAI_API_KEY) {
    console.error('❌ VITE_AZUREOPENAI_API_KEY not found');
    throw new Error('AZUREOPENAI API key is not configured');
  }

  const prompt = `Based on all the collected data from this strategic planning session, generate a comprehensive final action plan.

**Collected Data:**

**Step 1 - Initial Assessment:**
- Investment Details: ${wizardData.step1.investmentDetails}
- Industry Info: ${wizardData.step1.industryInfo}
- Tool/Platform: ${wizardData.step1.toolPlatform}
- Effort: ${wizardData.step1.effort}
- Friction Points: ${wizardData.step1.friction}
- What-If Scenarios: ${wizardData.step1.whatIf}

**Step 2 - Gap Analysis:**
- Expected: ${wizardData.step2.expected}
- Actual: ${wizardData.step2.actual}

**Step 3 - Strategic Input:**
${wizardData.step3.anythingElse}

**Step 5 - Integration Preference:**
${wizardData.step5.integrationMethod}

**Step 6 - Desired Outcome:**
${wizardData.step6.outcome}

**Step 7 - Priority Actions:**
${Array.isArray(wizardData.step7.recircleActions) ? wizardData.step7.recircleActions.join(', ') : wizardData.step7.recircleActions}

**Strategic Pillars Already Identified:**
${Array.isArray(wizardData.step3.pillars) ? wizardData.step3.pillars.map(p => `- ${p.title}: ${p.description}`).join('\n') : 'None yet'}

**Strategies Already Defined:**
${Array.isArray(wizardData.step4.strategies) ? wizardData.step4.strategies.map(s => `- ${s.title}: ${s.description}`).join('\n') : 'None yet'}

**Task:**
Create a comprehensive final action plan with:
1. A summary paragraph (50-100 words) explaining the strategic direction
2. 4-6 actionable categories (e.g., "Immediate Actions", "30-Day Plan", "90-Day Goals", "Key Stakeholders", "Success Metrics", "Risk Mitigation")
3. Each category should have 3-5 specific, actionable items

Return ONLY valid JSON in this exact format:
{
  "summary": "comprehensive summary paragraph here",
  "actionPlan": [
    {
      "category": "Immediate Actions",
      "actions": ["action 1", "action 2", "action 3"]
    }
  ]
}`;

  try {
    const response = await fetch(AZUREOPENAI_API_URL, {
        method: 'POST',
        headers: {
      'Content-Type': 'application/json',
      'api-key': VITE_AZUREOPENAI_API_KEY,

    },
      body: JSON.stringify({
      messages: [
        { role: 'system', content: 'You are a strategic assistant that outputs structured JSON.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 2048
    })});

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ AZUREOPENAI API error:', response.status, errorText);
      throw new Error(`AZUREOPENAI API returned ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ AZUREOPENAI API final plan response:', data);

    const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!textContent) {
      throw new Error('Invalid response format from AZUREOPENAI API');
    }

    let jsonText = textContent.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '');
    }

    const parsedData = JSON.parse(jsonText);
    console.log('✅ Parsed final action plan:', parsedData);

    return parsedData;
  } catch (error) {
    console.error('❌ Error generating final action plan:', error);
    
    // Fallback
    return {
      summary: "Based on your inputs, we've created a strategic roadmap focused on your key priorities and desired outcomes.",
      actionPlan: [
        {
          category: "Immediate Actions",
          actions: [
            "Set up project kickoff meeting with key stakeholders",
            "Document current state and baseline metrics",
            "Identify quick wins for early momentum"
          ]
        },
        {
          category: "30-Day Plan",
          actions: [
            "Implement initial pilot program",
            "Establish feedback loops with users",
            "Review and adjust based on early results"
          ]
        },
        {
          category: "Success Metrics",
          actions: [
            "Define KPIs aligned with desired outcomes",
            "Set up monitoring and reporting dashboards",
            "Schedule regular review cadence"
          ]
        }
      ]
    };
  }
};
