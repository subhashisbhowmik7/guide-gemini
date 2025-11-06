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
Analyze the provided data and generate strategic recommendations. You MUST provide content for ALL 5 standard pillars plus 2-3 additional context-specific pillars.

Generate a JSON object with:
1. 'pillars': A list containing ALL of these pillars with context-specific descriptions and action items:
   - Governance: Customize for this specific context
   - Efficiency: Customize for this specific context  
   - Security: Customize for this specific context
   - Adoption: Customize for this specific context
   - Usability: Customize for this specific context
   - Plus 2-3 additional NEW pillars specific to the investment/industry context

Each pillar MUST have:
- title: The pillar name
- description: Detailed description (minimum 25 words) customized to the specific context
- actionItems: Array of 4-5 concrete, actionable items

2. 'strategies': Exactly 3 strategies with these exact titles:
   - "Generate Use Cases to Test"
   - "Verify Design Effectiveness"
   - "Isolate Operational Blockers"

Each strategy MUST have:
- title: Exact title as listed above
- description: Detailed description (minimum 25 words) 
- steps: Array of 4-6 specific actionable steps

Return ONLY valid JSON in this exact format:
{
  "pillars": [
    {
      "title": "Governance",
      "description": "detailed contextual description here (25+ words)",
      "actionItems": ["action1", "action2", "action3", "action4"]
    },
    {
      "title": "Efficiency",
      "description": "detailed contextual description here (25+ words)",
      "actionItems": ["action1", "action2", "action3", "action4"]
    }
  ],
  "strategies": [
    {
      "title": "Generate Use Cases to Test",
      "description": "detailed description here",
      "steps": ["step1", "step2", "step3", "step4", "step5"]
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
        max_tokens: 3000
      })
    });

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

    // Validate that we have the required pillars
    const requiredPillarTitles = ['Governance', 'Efficiency', 'Security', 'Adoption', 'Usability'];
    const missingPillars = requiredPillarTitles.filter(
      title => !parsedData.pillars.some((p: Pillar) => p.title.toLowerCase() === title.toLowerCase())
    );

    if (missingPillars.length > 0) {
      console.warn('⚠️ API did not return all required pillars. Missing:', missingPillars);
    }

    return parsedData;
  } catch (error) {
    console.error('❌ Error calling AZUREOPENAI API:', error);
    
    // Return fallback with ALL pillars populated
    console.warn('⚠️ Using fallback data with all pillars');
    return {
      pillars: [
        {
          title: 'Governance',
          description: 'Establish clear oversight, accountability, and decision-making frameworks tailored to your organization to ensure strategic alignment, regulatory compliance, and effective resource allocation across all initiatives.',
          actionItems: [
            'Define roles and responsibilities for key stakeholders',
            'Create governance committees with clear mandates',
            'Establish approval workflows for decisions and changes',
            'Set up regular review cycles and performance metrics'
          ]
        },
        {
          title: 'Efficiency',
          description: 'Optimize processes and resources across your operations to maximize productivity while minimizing waste, redundancy, and operational costs through systematic improvement and automation initiatives.',
          actionItems: [
            'Identify and document process bottlenecks',
            'Automate repetitive and manual tasks',
            'Streamline workflows across departments',
            'Measure and track key performance indicators'
          ]
        },
        {
          title: 'Security',
          description: 'Implement comprehensive security measures and protocols to protect data, systems, and operations from internal and external threats, vulnerabilities, and compliance risks in an evolving threat landscape.',
          actionItems: [
            'Conduct thorough security audits and assessments',
            'Implement role-based access controls',
            'Establish data protection and privacy policies',
            'Train staff on security best practices and protocols'
          ]
        },
        {
          title: 'Adoption',
          description: 'Drive user engagement and ensure successful implementation through effective change management, comprehensive training programs, and continuous support to maximize tool utilization and ROI.',
          actionItems: [
            'Develop role-specific training programs',
            'Create comprehensive user documentation',
            'Establish dedicated support channels',
            'Gather and act on user feedback regularly'
          ]
        },
        {
          title: 'Usability',
          description: 'Enhance user experience through intuitive design, accessibility standards, and responsive interfaces that meet diverse user needs while reducing friction and increasing satisfaction across all touchpoints.',
          actionItems: [
            'Conduct regular usability testing sessions',
            'Simplify user interfaces and workflows',
            'Ensure compliance with accessibility standards',
            'Optimize performance for mobile devices'
          ]
        },
        {
          title: 'Innovation',
          description: 'Foster a culture of continuous improvement and innovation through experimentation, rapid prototyping, and systematic adoption of emerging technologies to maintain competitive advantage.',
          actionItems: [
            'Establish innovation labs or pilot programs',
            'Create feedback loops for continuous improvement',
            'Implement rapid prototyping methodologies',
            'Allocate resources for research and development'
          ]
        },
        {
          title: 'Scalability',
          description: 'Build flexible, future-proof systems and processes that can grow seamlessly with your organization while maintaining performance, reliability, and cost-effectiveness.',
          actionItems: [
            'Design modular and extensible architecture',
            'Implement cloud-native solutions where appropriate',
            'Plan for future growth in infrastructure',
            'Document scaling strategies and triggers'
          ]
        },
      ],
      strategies: [
        {
          title: 'Generate Use Cases to Test',
          description: 'Develop comprehensive test scenarios and use cases that validate your strategic approach across different contexts, ensuring the solution meets diverse stakeholder requirements and handles edge cases effectively.',
          steps: [
            'Identify key stakeholder requirements and pain points',
            'Map detailed user journeys and interaction patterns',
            'Create test scenarios covering normal and edge cases',
            'Document expected outcomes for each use case',
            'Prioritize use cases by business impact and risk'
          ]
        },
        {
          title: 'Verify Design Effectiveness',
          description: 'Systematically evaluate whether your design and implementation meet business objectives and user needs through rigorous testing, measurement, and iterative refinement based on real-world feedback.',
          steps: [
            'Conduct usability testing with representative users',
            'Gather feedback from all key stakeholders',
            'Measure performance against defined success metrics',
            'Identify gaps and areas for improvement',
            'Iterate based on findings and retest'
          ]
        },
        {
          title: 'Isolate Operational Blockers',
          description: 'Proactively identify, document, and address obstacles, dependencies, and bottlenecks that prevent successful implementation, ensuring smooth operations and minimizing risks to project success.',
          steps: [
            'Map current operational workflows in detail',
            'Identify bottlenecks, dependencies, and constraints',
            'Assess impact and urgency of each blocker',
            'Prioritize blockers by business impact',
            'Develop and implement mitigation strategies',
            'Monitor progress and adjust as needed'
          ]
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
Create a super comprehensive and detailed final action plan with:
1. A summary paragraph explaining the overall strategic direction and approach
2. 5-7 actionable categories such as:
   - "Immediate Actions (Week 1-2)"
   - "30-Day Plan"
   - "90-Day Goals"
   - "Key Stakeholders & Responsibilities"
   - "Success Metrics & KPIs"
   - "Risk Mitigation"
   - "Long-term Vision"
3. Each category should have 3-6 specific, actionable items that are measurable and time-bound

Return ONLY valid JSON in this exact format:
{
  "summary": "comprehensive summary paragraph here (150-170 words)",
  "actionPlan": [
    {
      "category": "Immediate Actions (Week 1-2)",
      "actions": ["specific action 1", "specific action 2", "specific action 3"]
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
          { 
            role: 'system', 
            content: 'You are a strategic assistant that outputs structured JSON with detailed, actionable recommendations.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 3000
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ AZUREOPENAI API error:', response.status, errorText);
      throw new Error(`AZUREOPENAI API returned ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ AZUREOPENAI API final plan response:', data);

    const textContent = data.choices?.[0]?.message?.content?.trim();
    if (!textContent) {
      console.error('❌ No text content in AZUREOPENAI response:', data);
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
    
    // Comprehensive fallback
    return {
      summary: "Based on your strategic inputs, we've developed a comprehensive roadmap that addresses your investment priorities, operational challenges, and desired outcomes. This plan integrates key pillars of governance, efficiency, security, adoption, and usability while focusing on measurable results and sustainable implementation. The approach emphasizes quick wins in the first 30 days while building toward long-term transformation goals.",
      actionPlan: [
        {
          category: "Immediate Actions (Week 1-2)",
          actions: [
            "Schedule kickoff meeting with all key stakeholders",
            "Document current state baseline metrics and KPIs",
            "Identify and secure necessary resources and budget",
            "Set up project tracking and communication channels"
          ]
        },
        {
          category: "30-Day Plan",
          actions: [
            "Launch pilot program with selected user group",
            "Implement initial training sessions for early adopters",
            "Establish weekly feedback loops and review meetings",
            "Deploy quick wins to build momentum and confidence",
            "Document lessons learned and adjust approach"
          ]
        },
        {
          category: "90-Day Goals",
          actions: [
            "Complete full rollout across target departments",
            "Achieve 70% user adoption rate",
            "Demonstrate measurable improvements in efficiency metrics",
            "Finalize all documentation and training materials",
            "Conduct comprehensive review and optimization"
          ]
        },
        {
          category: "Key Stakeholders & Responsibilities",
          actions: [
            "Executive sponsors: Provide strategic direction and remove blockers",
            "Project manager: Coordinate activities and track progress",
            "Technical team: Handle implementation and integration",
            "Change management lead: Drive adoption and training",
            "End users: Provide feedback and participate in testing"
          ]
        },
        {
          category: "Success Metrics & KPIs",
          actions: [
            "User adoption rate: Target 80% within 90 days",
            "Process efficiency: 30% reduction in manual tasks",
            "User satisfaction: 4+ rating in feedback surveys",
            "ROI achievement: Meet projected financial targets",
            "Incident reduction: 50% fewer operational issues"
          ]
        },
        {
          category: "Risk Mitigation",
          actions: [
            "Maintain detailed risk register with mitigation plans",
            "Establish rollback procedures for critical changes",
            "Create contingency budget (15-20% of total)",
            "Schedule regular risk review meetings",
            "Build redundancy in critical path activities"
          ]
        }
      ]
    };
  }
};