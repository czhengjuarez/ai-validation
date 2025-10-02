export type Resource = {
  title: string;
  description: string;
  url: string;
};

export type EscalationPath = {
  id: string;
  name: string;
  description: string;
  action: string; // Can be 'verify', 'consult', 'avoid', or any custom action
  conditions: string[];
};

export type Contributor = {
  name: string;
  email: string;
};

export type Playbook = {
  id: string;
  title: string;
  description: string;
  escalationPaths: EscalationPath[];
  createdAt: string;
  updatedAt: string;
  category?: string;
  resources?: Resource[];
  contributor?: Contributor;
};

export const DEFAULT_AI_VALIDATION_TEMPLATE: Playbook = {
  id: 'default',
  title: 'Default AI Validation Playbook',
  description: 'An example framework for validating AI-generated content across different use cases. This template outlines a structured way to decide when AI content may need human review, expert input, or when it might be best to avoid using it.',
  createdAt: '2025-09-26',
  updatedAt: '2025-09-26',
  category: 'Built-in Template',
  escalationPaths: [
    {
      id: '1',
      name: 'Internal Verification',
      description: 'Content should be verified by internal team members before publication or use. This path ensures that AI-generated content aligns with organizational standards, brand voice, and factual accuracy.',
      action: 'verify',
      conditions: [
        'Sensitive business information or proprietary data',
        'Legal or compliance implications',
        'Customer-facing communications',
        'Financial data or projections',
        'Product specifications or technical documentation',
        'Marketing materials representing the brand',
        'Internal policies or procedures',
        'Performance metrics or analytics reports',
      ],
    },
    {
      id: '2',
      name: 'External Expert Review',
      description: 'Content should be reviewed by subject matter experts or external consultants. This path is critical for specialized domains where accuracy and expertise are paramount.',
      action: 'consult',
      conditions: [
        'Technical or specialized domain knowledge required',
        'High-impact business decisions',
        'Novel or complex subject matter',
        'Industry-specific regulations or standards',
        'Scientific or research-based content',
        'Strategic planning or forecasting',
        'Cross-functional initiatives requiring multiple perspectives',
        'Content that could impact stakeholder relationships',
      ],
    },
    {
      id: '3',
      name: 'Avoid AI Content',
      description: 'Do not use AI-generated content in these scenarios. Human judgment, expertise, and accountability are essential for these sensitive situations.',
      action: 'avoid',
      conditions: [
        'Highly sensitive personal information (PII, health records)',
        'Legal advice or binding legal documents',
        'Medical diagnosis or treatment recommendations',
        'Content requiring human empathy and emotional intelligence',
        'Situations where accuracy is absolutely critical',
        'Crisis communications or emergency responses',
        'Ethical decision-making or moral judgments',
        'Personnel decisions (hiring, firing, promotions)',
        'Content that could cause harm if incorrect',
      ],
    },
  ],
  resources: [
    {
      title: 'Systematic Literature Review of Validation Methods for AI Systems',
      description: 'Surveys many real-world methods (trials, simulation, expert review) for validating AI systems. Helps you see what others do and what is commonly missing.',
      url: 'https://arxiv.org/abs/2104.01562',
    },
    {
      title: 'Human-in-the-Loop Architectures for Validating GenAI Outputs in Clinical Settings',
      description: 'Deep dive into how human oversight can be built into workflows when the outputs have high stakes (in clinical settings). Useful ideas for checking model confidence, explainability, review checkpoints.',
      url: 'https://eajournals.org/ijhsse/vol12-issue-3-2024/human-in-the-loop-architectures-for-validating-genai-outputs-in-clinical-settings/',
    },
    {
      title: 'Improving the Efficiency of Human-in-the-Loop Systems: Adding Artificial to Human Experts',
      description: 'This one examines ways to reduce human burden by using "artificial experts" that learn from human corrections — good for scaling HITL workflows.',
      url: 'https://arxiv.org/abs/2106.05976',
    },
    {
      title: 'Validation of Artificial Intelligence Containing Products Across the Regulated Healthcare Industries',
      description: 'Focuses on methodologies for validation in regulated domains; good for compliance, safety, governance.',
      url: 'https://pubmed.ncbi.nlm.nih.gov/38234351/',
    },
    {
      title: 'Human-in-the-Loop AI in Document Workflows ‒ Best Practices & Common Pitfalls',
      description: 'Practical guide for setting up document review / content workflows where humans review or correct AI output. Includes metrics, scaling, audit trail, etc.',
      url: 'https://parseur.com/blog/human-in-the-loop-ai-in-document-workflows-best-practices-common-pitfalls',
    },
  ],
};

export const CONTENT_MODERATION_WORKFLOW: Playbook = {
  id: 'content-moderation',
  title: 'Content Moderation Workflow',
  description: 'A specialized workflow for moderating user-generated content with AI assistance. This playbook helps teams efficiently review and manage community content while maintaining safety and quality standards.',
  createdAt: '2025-09-25',
  updatedAt: '2025-09-25',
  category: 'Built-in Template',
  escalationPaths: [
    {
      id: '1',
      name: 'Automated Approval',
      description: 'Content that passes all automated checks and can be approved without human review. This path handles low-risk, clearly acceptable content.',
      action: 'verify',
      conditions: [
        'Content flagged as safe by AI moderation tools',
        'User has good standing history',
        'Content type is low-risk (e.g., general discussion)',
        'No sensitive topics or keywords detected',
        'Complies with community guidelines automatically',
        'Similar to previously approved content',
      ],
    },
    {
      id: '2',
      name: 'Human Moderator Review',
      description: 'Content that requires human moderator review due to potential policy violations or ambiguous context. Moderators make final decisions on approval, editing, or removal.',
      action: 'consult',
      conditions: [
        'AI confidence score is below threshold',
        'Content contains borderline language or imagery',
        'User has previous warnings or violations',
        'Content involves sensitive topics (politics, religion, health)',
        'Multiple users have reported the content',
        'Content is in a gray area of community guidelines',
        'New content type or format not well-trained in AI models',
        'Context requires cultural or situational understanding',
      ],
    },
    {
      id: '3',
      name: 'Immediate Removal & Escalation',
      description: 'Content that violates clear policies and should be immediately removed. These cases may require further action such as user suspension or legal review.',
      action: 'avoid',
      conditions: [
        'Explicit violence, gore, or graphic content',
        'Hate speech or targeted harassment',
        'Sexual content involving minors',
        'Illegal activities or content',
        'Doxxing or sharing private information',
        'Credible threats of harm',
        'Spam or malicious links',
        'Copyright infringement or intellectual property violations',
        'Coordinated inauthentic behavior',
      ],
    },
    {
      id: '4',
      name: 'Appeal Review Process',
      description: 'Content that users have appealed after initial moderation decisions. Requires senior moderator or policy team review.',
      action: 'consult',
      conditions: [
        'User has submitted an appeal',
        'Original decision was made by automated system',
        'Content has high engagement or visibility',
        'Decision involves interpretation of new or updated policies',
        'Multiple moderators have disagreed on the decision',
        'Content creator is a verified or high-profile user',
      ],
    },
  ],
};

export const CODE_REVIEW_WORKFLOW: Playbook = {
  id: 'code-review',
  title: 'AI-Assisted Code Review Workflow',
  description: 'An example workflow for reviewing AI-generated code in software development. Helps teams decide when AI code suggestions need human review, testing, or should be avoided.',
  createdAt: '2025-10-01',
  updatedAt: '2025-10-01',
  category: 'Built-in Template',
  escalationPaths: [
    {
      id: '1',
      name: 'Auto-Merge with Tests',
      description: 'Low-risk code changes that can be merged after automated testing passes. Suitable for routine refactoring and simple updates.',
      action: 'approve',
      conditions: [
        'Code formatting or style improvements',
        'Documentation updates or comments',
        'Simple bug fixes with clear test coverage',
        'Dependency version updates (minor/patch)',
        'Refactoring with no logic changes',
        'Adding logging or debugging statements',
      ],
    },
    {
      id: '2',
      name: 'Peer Code Review',
      description: 'Code that requires human developer review before merging. Standard review process with at least one approval needed.',
      action: 'review',
      conditions: [
        'New feature implementation',
        'Business logic changes',
        'Database schema modifications',
        'API endpoint changes',
        'Performance optimizations',
        'Code affecting multiple modules',
        'Changes to authentication or authorization',
        'Third-party integrations',
      ],
    },
    {
      id: '3',
      name: 'Senior/Architect Review',
      description: 'Critical code that requires review by senior developers or architects. May need design discussion before implementation.',
      action: 'escalate',
      conditions: [
        'Security-sensitive code (encryption, authentication)',
        'Core infrastructure or framework changes',
        'Major architectural decisions',
        'Changes affecting system scalability',
        'Database migration scripts',
        'Payment processing or financial transactions',
        'Data privacy or compliance-related code',
        'Breaking API changes',
      ],
    },
    {
      id: '4',
      name: 'Manual Implementation Required',
      description: 'Scenarios where AI-generated code should not be used. Requires human expertise and careful implementation.',
      action: 'avoid',
      conditions: [
        'Cryptographic implementations',
        'Security vulnerability fixes',
        'Regulatory compliance code (HIPAA, GDPR, SOC2)',
        'Production incident hotfixes',
        'Code involving personal health information',
        'Financial calculations or billing logic',
        'Access control or permission systems',
        'Code that could cause data loss',
      ],
    },
  ],
};

export const DESIGN_REVIEW_WORKFLOW: Playbook = {
  id: 'design-review',
  title: 'AI-Generated Design Review Workflow',
  description: 'An example framework for reviewing AI-generated designs, mockups, and visual assets. Helps design teams maintain quality and brand consistency.',
  createdAt: '2025-10-01',
  updatedAt: '2025-10-01',
  category: 'Built-in Template',
  escalationPaths: [
    {
      id: '1',
      name: 'Quick Approval',
      description: 'Low-risk design assets that align with brand guidelines and can be approved with minimal review.',
      action: 'approve',
      conditions: [
        'Internal presentation slides',
        'Social media graphics (non-promotional)',
        'Stock image selection or curation',
        'Basic icon or illustration variations',
        'Template-based designs',
        'Internal documentation visuals',
      ],
    },
    {
      id: '2',
      name: 'Design Team Review',
      description: 'Designs that need review by the design team to ensure quality, consistency, and alignment with brand standards.',
      action: 'review',
      conditions: [
        'Marketing materials or campaigns',
        'Website or app UI components',
        'Brand-adjacent visual content',
        'Customer-facing graphics',
        'Product packaging concepts',
        'Email templates or newsletters',
        'Infographics or data visualizations',
      ],
    },
    {
      id: '3',
      name: 'Brand/Creative Director Approval',
      description: 'High-impact designs requiring approval from brand or creative leadership. May need multiple iterations.',
      action: 'escalate',
      conditions: [
        'Logo or brand identity elements',
        'Major campaign creative',
        'Product launch materials',
        'Brand guideline updates',
        'High-visibility public communications',
        'Partnership or co-branding materials',
        'Trade show or event branding',
      ],
    },
    {
      id: '4',
      name: 'Human Designer Required',
      description: 'Design work that requires human creativity, cultural sensitivity, or cannot be delegated to AI.',
      action: 'avoid',
      conditions: [
        'Designs involving cultural or religious symbolism',
        'Sensitive social or political topics',
        'Accessibility-critical interfaces',
        'Legal or regulatory required disclosures',
        'Designs requiring emotional intelligence',
        'Crisis communication visuals',
        'Designs involving real people or testimonials',
      ],
    },
  ],
};

export const COMMUNICATIONS_WORKFLOW: Playbook = {
  id: 'communications',
  title: 'Communications & PR Review Workflow',
  description: 'An example workflow for validating AI-generated communications, press releases, and public statements. Ensures messaging is accurate, on-brand, and appropriate.',
  createdAt: '2025-10-01',
  updatedAt: '2025-10-01',
  category: 'Built-in Template',
  escalationPaths: [
    {
      id: '1',
      name: 'Internal Communications',
      description: 'Routine internal messages that can be sent with light review. Suitable for team updates and operational communications.',
      action: 'verify',
      conditions: [
        'Team meeting notes or summaries',
        'Internal newsletter content',
        'Routine status updates',
        'Event invitations or reminders',
        'General company announcements',
        'Internal FAQ responses',
      ],
    },
    {
      id: '2',
      name: 'Communications Team Review',
      description: 'External communications requiring review by communications professionals before publication.',
      action: 'review',
      conditions: [
        'Blog posts or articles',
        'Social media posts',
        'Customer email campaigns',
        'Product update announcements',
        'Partner communications',
        'Community forum responses',
        'Media kit materials',
      ],
    },
    {
      id: '3',
      name: 'Executive/Legal Review',
      description: 'High-stakes communications requiring executive approval and potentially legal review before release.',
      action: 'escalate',
      conditions: [
        'Press releases or media statements',
        'Crisis communications',
        'Earnings or financial announcements',
        'Merger or acquisition communications',
        'Regulatory filings or responses',
        'Executive thought leadership',
        'Policy position statements',
        'Responses to media inquiries',
      ],
    },
    {
      id: '4',
      name: 'Human-Only Communications',
      description: 'Sensitive communications that require human judgment, empathy, and cannot be AI-generated.',
      action: 'avoid',
      conditions: [
        'Apologies or crisis responses',
        'Layoff or restructuring announcements',
        'Condolences or sympathy messages',
        'Legal disputes or litigation',
        'Whistleblower or ethics concerns',
        'Personal employee matters',
        'Responses to serious incidents or accidents',
        'Communications involving minors or vulnerable populations',
      ],
    },
  ],
};

export const PLAYBOOK_TEMPLATES: Playbook[] = [
  DEFAULT_AI_VALIDATION_TEMPLATE,
  CONTENT_MODERATION_WORKFLOW,
  CODE_REVIEW_WORKFLOW,
  DESIGN_REVIEW_WORKFLOW,
  COMMUNICATIONS_WORKFLOW,
];

// Helper function to check if a playbook is a built-in template
export const isBuiltInTemplate = (id: string): boolean => {
  return PLAYBOOK_TEMPLATES.some(template => template.id === id);
};
