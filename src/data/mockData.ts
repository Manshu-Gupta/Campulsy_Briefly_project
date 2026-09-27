import { 
  SourceItem, 
  KnowledgeItem, 
  ArtifactItem, 
  InconsistencyItem, 
  DashboardStats,
  Workspace 
} from '../types/dashboard';

export const initialStats: DashboardStats = {
  sourcesProcessed: 28,
  sourcesChange: '+4 this week',
  artifactsGenerated: 142,
  artifactsSyncedPercent: 100,
  factsExtracted: 894,
  factsNetWeekly: '+62 verified',
  sourceFidelity: 94.6,
  fidelityDelta: '+1.8% vs last compile',
};

export const sampleWorkspaces: Workspace[] = [
  {
    id: 'ws-1',
    name: 'Briefly Engine v3 Release',
    code: 'CORE-ENG-26',
    description: 'Autonomous compiler architecture & benchmarking',
    sourceCount: 12,
  },
  {
    id: 'ws-2',
    name: 'Enterprise Series B Narrative',
    code: 'SERIES-B-VENTURE',
    description: 'Financial models, diligence decks, and investor memos',
    sourceCount: 9,
  },
  {
    id: 'ws-3',
    name: 'Global Cloud Infrastructure Spec',
    code: 'INFRA-GLOBAL-SPEC',
    description: 'Multi-region failover, latency SLAs, and compliance',
    sourceCount: 7,
  }
];

export const sampleSources: SourceItem[] = [
  {
    id: 'src-1',
    name: 'Architecture Spec: Adaptive LLM Compiler v3.4',
    type: 'PRD & Architecture',
    date: 'Sep 26, 2026',
    factsCount: 84,
    artifactsCount: 9,
    fidelity: 98.2,
    status: 'Verified',
    author: 'Elena Rostova, Chief Architect',
    fileSize: '4.8 MB · PDF',
    summary: 'Core engineering specification outlining deterministic AST extraction, citation graph hashing, and multi-format compilation pipelines.',
    snippet: 'The compilation pipeline enforces a bi-directional hashing constraint between every synthesized sentence and its primary source token spans, bounding information drift to under 0.05% across infinite regenerations.'
  },
  {
    id: 'src-2',
    name: 'Q3 Enterprise Adoption & Financial Earnings Transcript',
    type: 'Earnings Call Transcript',
    date: 'Sep 25, 2026',
    factsCount: 52,
    artifactsCount: 6,
    fidelity: 96.4,
    status: 'Synced',
    author: 'Marcus Vance, CFO',
    fileSize: '2.1 MB · TXT',
    summary: 'Quarterly financial performance, customer expansion metrics, and ARR breakdown across Fortune 500 enterprise tier deployments.',
    snippet: 'Net revenue retention surged to 134% in Q3, driven by a 4.2x expansion across multi-department accounts replacing disjointed marcom agencies.'
  },
  {
    id: 'src-3',
    name: 'Zero-Drift Knowledge Compilation: Empirical Benchmark',
    type: 'Technical Whitepaper',
    date: 'Sep 23, 2026',
    factsCount: 118,
    artifactsCount: 14,
    fidelity: 95.8,
    status: 'Verified',
    author: 'Research Lab / AI Systems Group',
    fileSize: '7.4 MB · PDF',
    summary: 'Peer-reviewed empirical study measuring hallucination decay and factual alignment across 10,000 multi-format enterprise publications.',
    snippet: 'Compared against unconstrained prompt chains which suffer 18.4% factual drift by step 3, deterministic fact compilation maintains 99.1% factual precision.'
  },
  {
    id: 'src-4',
    name: 'Customer Advisory Board: Enterprise Security & Audit',
    type: 'Advisory Board Notes',
    date: 'Sep 21, 2026',
    factsCount: 36,
    artifactsCount: 4,
    fidelity: 91.5,
    status: 'Draft',
    author: 'David Thorne, VP Customer Success',
    fileSize: '1.4 MB · DOCX',
    summary: 'Consensus feedback from 14 Chief Information Officers regarding on-prem source isolation and cryptographic provenance trails.',
    snippet: 'Enterprise customers mandate tamper-evident citation links directly in published PDF and web artifacts to satisfy SOC2 Type II compliance.'
  },
  {
    id: 'src-5',
    name: 'Global Tech Keynote: The Post-Hallucination Enterprise',
    type: 'Executive Keynote',
    date: 'Sep 18, 2026',
    factsCount: 44,
    artifactsCount: 8,
    fidelity: 97.0,
    status: 'Verified',
    author: 'Aria Sterling, CEO',
    fileSize: '3.3 MB · PDF',
    summary: 'Keynote manuscript delivering the vision of autonomous single-source communication compilers across multinational organizations.',
    snippet: 'In an era where synthetic noise threatens organizational truth, the competitive moat is not how fast you generate words, but how reliably you preserve truth.'
  }
];

export const sampleKnowledgeItems: KnowledgeItem[] = [
  {
    id: 'kn-1',
    category: 'facts',
    statement: 'The compilation pipeline enforces bi-directional hashing constraint between synthesized claims and source token spans.',
    confidence: 99.4,
    sourceDoc: 'Architecture Spec v3.4',
    sourceLocation: 'Section 4.2, p. 11',
    sourceTextSnippet: 'Deterministic claim-token mapping ensures zero hallucinated additions to the Knowledge Graph.',
    verificationStatus: 'verified',
    linkedArtifacts: ['Executive Brief', 'Advisory', 'Presentation']
  },
  {
    id: 'kn-2',
    category: 'statistics',
    statement: 'Net revenue retention reached 134% in Q3 2026, driven by a 4.2x multi-department seat expansion.',
    confidence: 98.8,
    sourceDoc: 'Q3 Financial Earnings Transcript',
    sourceLocation: 'CFO Remarks, p. 4',
    sourceTextSnippet: 'Marcus Vance: "Net revenue retention surged to 134% in Q3, driven by 4.2x expansion..."',
    verificationStatus: 'verified',
    linkedArtifacts: ['Executive Brief', 'LinkedIn Post', 'Presentation']
  },
  {
    id: 'kn-3',
    category: 'claims',
    statement: 'Standard prompt chains experience 18.4% factual drift by compilation step 3, whereas Briefly maintains 99.1% factual precision.',
    confidence: 97.6,
    sourceDoc: 'Empirical Benchmark Whitepaper',
    sourceLocation: 'Table 2, p. 14',
    sourceTextSnippet: 'Unconstrained prompt chains decayed to 81.6% accuracy (18.4% drift), while deterministic compilation scored 99.1%.',
    verificationStatus: 'verified',
    linkedArtifacts: ['Executive Brief', 'LinkedIn Post', 'X Thread', 'Infographic']
  },
  {
    id: 'kn-4',
    category: 'entities',
    statement: 'Fortune 500 enterprise customers require tamper-evident cryptographic provenance trails for SOC2 Type II compliance.',
    confidence: 95.2,
    sourceDoc: 'Customer Advisory Board Notes',
    sourceLocation: 'Item 3.1, p. 2',
    sourceTextSnippet: '14 Chief Information Officers mandated verifiable on-prem token isolation and permanent citation graphs.',
    verificationStatus: 'verified',
    linkedArtifacts: ['Advisory', 'Executive Brief']
  },
  {
    id: 'kn-5',
    category: 'key_messages',
    statement: 'The competitive enterprise advantage in 2026 is deterministic preservation of truth, not ungrounded text generation speed.',
    confidence: 99.1,
    sourceDoc: 'Global Tech Keynote 2026',
    sourceLocation: 'Section 1.3, p. 3',
    sourceTextSnippet: 'Aria Sterling: "The moat is not how fast you generate words, but how reliably you preserve truth."',
    verificationStatus: 'verified',
    linkedArtifacts: ['LinkedIn Post', 'Presentation', 'Video Storyboard']
  },
  {
    id: 'kn-6',
    category: 'statistics',
    statement: 'Global multi-region replication latency target is bounded within 45ms across all tier-1 availability zones.',
    confidence: 92.4,
    sourceDoc: 'Architecture Spec v3.4',
    sourceLocation: 'SLA Table 1, p. 8',
    sourceTextSnippet: 'Maximum SLA failover latency across US-East, EU-Central, and AP-South bounded at 45ms.',
    verificationStatus: 'flagged',
    linkedArtifacts: ['Advisory', 'Infographic']
  }
];

export const sampleArtifacts: ArtifactItem[] = [
  {
    id: 'art-1',
    title: 'Executive Brief',
    type: 'Executive Brief',
    description: 'High-density, 1-page strategic summary for Board of Directors and executive leadership.',
    status: 'Verified',
    factsLinked: 14,
    fidelity: 99.1,
    lastUpdated: '12 mins ago',
    targetAudience: 'Board & C-Suite',
    estimatedReadTime: '3 min read',
    preview: 'Autonomous Communication Compilation delivers a 4.2x expansion rate while safeguarding brand integrity across 9 channels.',
    fullContent: `EXECUTIVE SUMMARY: ADAPTIVE COMMUNICATION COMPILATION

1. Strategic Context
Modern enterprises suffer from acute "information drift": as a single product spec, financial disclosure, or architectural standard travels through marketing, sales, and external communications, key numbers and claims degrade by an average of 18.4%. Briefly resolves this by replacing unconstrained LLM generation with deterministic Knowledge Graph compilation.

2. Verified Financial & Operational Indicators
• Net Revenue Retention: 134% in Q3 2026.
• Account Expansion: 4.2x across enterprise customer accounts.
• Compilation Precision: 99.1% verified fact alignment against ground-truth source tokens.
• Security Compliance: Cryptographic provenance trails satisfying SOC2 Type II criteria.

3. Recommended Action
Authorize the rollout of Briefly Compiler across all customer-facing technical marketing and product release pipelines for Q4 2026.`,
    keyPoints: [
      '134% Net Revenue Retention in Q3',
      '99.1% factual precision vs 18.4% drift in ungrounded models',
      'Tamper-evident citations across all compiled assets'
    ]
  },
  {
    id: 'art-2',
    title: 'LinkedIn Post',
    type: 'LinkedIn Post',
    description: 'Thought leadership narrative framed around the cost of enterprise information drift.',
    status: 'Verified',
    factsLinked: 8,
    fidelity: 98.4,
    lastUpdated: '45 mins ago',
    targetAudience: 'Product & Tech Leaders',
    estimatedReadTime: '1 min read',
    preview: 'Every time an engineering PRD turns into a pitch deck, marketing post, and sales sheet, information drifts. Here is how we stopped it.',
    fullContent: `Every engineering leader knows this frustration:

You write an airtight, 30-page architecture spec.
Three weeks later:
• The sales deck lists the wrong SLA.
• The press release invents a feature that is still in research.
• The executive memo misquotes the performance benchmark by 20%.

This isn't bad intent. It's "information drift."

Our new benchmark paper reveals that ungrounded prompt workflows lose 18.4% of factual accuracy by step 3 alone.

At Briefly, we took a compiler approach:
1 source of truth.
Deterministic knowledge hashing.
Zero drift across 7 simultaneous communication artifacts.

Because in 2026, the real enterprise moat isn't how fast you can generate words — it's whether those words are actually true.

#EnterpriseAI #Architecture #KnowledgeSystems #ZeroDrift`,
    keyPoints: [
      'Addresses real enterprise pain: information drift',
      'Cites empirical benchmark (18.4% drift by step 3)',
      'Direct link to Architecture Spec v3.4'
    ]
  },
  {
    id: 'art-3',
    title: 'X/Twitter Thread',
    type: 'X/Twitter Thread',
    description: 'Crisp 6-tweet technical breakdown explaining bi-directional token hashing.',
    status: 'Ready',
    factsLinked: 6,
    fidelity: 96.8,
    lastUpdated: '2 hours ago',
    targetAudience: 'Engineers & Tech Twitter',
    estimatedReadTime: '2 min read',
    preview: '1/6 Why does generative AI suck at maintaining enterprise truth? A deep-dive into compiler-grade knowledge extraction 🧵',
    fullContent: `1/6 Why does generative AI hallucinate numbers in enterprise docs?
It's not model stupidity — it's entropy. Unanchored tokens drift 18.4% in 3 hops.

Here's how Briefly fixes this with deterministic AST compilation 🧵👇

2/6 Standard LLM approach:
Raw Doc ➔ Giant Prompt ➔ Hope it remembers your exact SLA numbers.
Result: 65% latency claimed when your doc says 45%.

3/6 Briefly Compiler approach:
Raw Doc ➔ Knowledge Core (Facts, Claims, Entities, Stats) ➔ Bi-directional token hash ➔ Format synthesis.

4/6 Every single sentence compiled into an Executive Brief, Slide Deck, or Post carries a verifiable backlink to the source page and paragraph.

5/6 If an editor alters a compiled sentence in a way that breaks source logic, Consistency Guard flags the exact delta in under 100ms.

6/6 One source. Every story. Zero information drift.
Explore the empirical benchmark: https://briefly.ai/benchmark-v3`,
    keyPoints: [
      '6 tweet sequence formatted for high technical engagement',
      'Contrasts prompt chains vs compiler architecture',
      'Explains Consistency Guard live verification'
    ],
    structuredData: {
      xThread: {
        posts: [
          { number: 1, text: "1/6 Why does generative AI hallucinate numbers in enterprise docs? It's not model stupidity — it's entropy. Unanchored tokens drift 18.4% in 3 hops." },
          { number: 2, text: "2/6 Standard LLM approach: Raw Doc ➔ Giant Prompt ➔ Hope it remembers exact numbers. Result: 65% latency claimed when your doc says 45%." },
          { number: 3, text: "3/6 Briefly Compiler approach: Raw Doc ➔ Knowledge Core (Facts, Claims, Entities, Stats) ➔ Bi-directional token hash ➔ Format synthesis." },
          { number: 4, text: "4/6 Every single sentence compiled into an Executive Brief, Deck, or Post carries a verifiable backlink to the source page and paragraph." },
          { number: 5, text: "5/6 If an editor alters a compiled sentence in a way that breaks source logic, Consistency Guard flags the exact delta in under 100ms." },
          { number: 6, text: "6/6 One source. Every story. Zero information drift. Explore the empirical benchmark: https://briefly.ai/benchmark-v3" }
        ]
      },
      x_thread: {
        posts: [
          { number: 1, text: "1/6 Why does generative AI hallucinate numbers in enterprise docs? It's not model stupidity — it's entropy. Unanchored tokens drift 18.4% in 3 hops." },
          { number: 2, text: "2/6 Standard LLM approach: Raw Doc ➔ Giant Prompt ➔ Hope it remembers exact numbers. Result: 65% latency claimed when your doc says 45%." },
          { number: 3, text: "3/6 Briefly Compiler approach: Raw Doc ➔ Knowledge Core (Facts, Claims, Entities, Stats) ➔ Bi-directional token hash ➔ Format synthesis." },
          { number: 4, text: "4/6 Every single sentence compiled into an Executive Brief, Deck, or Post carries a verifiable backlink to the source page and paragraph." },
          { number: 5, text: "5/6 If an editor alters a compiled sentence in a way that breaks source logic, Consistency Guard flags the exact delta in under 100ms." },
          { number: 6, text: "6/6 One source. Every story. Zero information drift. Explore the empirical benchmark: https://briefly.ai/benchmark-v3" }
        ]
      }
    }
  },
  {
    id: 'art-4',
    title: 'Public Advisory',
    type: 'Public Advisory',
    description: 'Technical advisory memorandum detailing infrastructure SLA boundaries.',
    status: 'Ready',
    factsLinked: 11,
    fidelity: 94.2,
    lastUpdated: '3 hours ago',
    targetAudience: 'CISOs & Security Architects',
    estimatedReadTime: '4 min read',
    preview: 'Technical compliance advisory regarding multi-region AST graph isolation and SOC2 Type II requirements.',
    fullContent: `TECHNICAL ADVISORY: ZERO-DRIFT SECURITY & DEPLOYMENT DIRECTIVE

Audience: Chief Information Officers & Enterprise Security Review Boards
Classification: Confidential / Partner Tier

1. System Isolation Architecture
The Briefly Knowledge Core operates with complete tenant boundary isolation. Source ingestion processes token embeddings inside customer-isolated memory enclaves without telemetry leaks.

2. Verified SLAs & Failover Metrics
• Multi-region failover latency: ≤ 45ms across Tier-1 availability zones.
• Cryptographic provenance: SHA-256 hash trees tethering every output claim to source page spans.
• SOC2 Type II Compliance: Fully auditable extraction graphs for third-party inspection.

3. Migration Guidance
Organizations running legacy unconstrained prompt scripts must transition to verified Knowledge Cores to avoid regulatory discrepancies in published disclosures.`,
    keyPoints: [
      'Directly answers CIO security questions',
      'Verifies 45ms failover SLA',
      'Provides actionable transition steps'
    ],
    structuredData: {
      publicAdvisory: {
        title: 'Zero-Drift Security & Infrastructure Deployment Directive',
        situation: 'Organizations adopting generative AI workflows risk regulatory non-compliance from ungrounded claims.',
        whatHappened: 'SOC2 Type II compliance audit mandates tamper-evident citation links directly in published artifacts.',
        whoIsAffected: 'Enterprise IT teams, CISOs, and compliance officers across Fortune 500 tiers.',
        whatPeopleShouldKnow: [
          'Multi-region failover latency is bounded within 45ms across Tier-1 availability zones.',
          'Cryptographic provenance uses SHA-256 hash trees tethering outputs to source token spans.',
          'Source ingestion processes token embeddings inside customer-isolated memory enclaves.'
        ],
        recommendedActions: [
          'Transition mission-critical publishing pipelines to deterministic Knowledge Cores.',
          'Enable automated Consistency Guard audits prior to multi-channel syndication.'
        ],
        warnings: [
          'Unanchored prompt chains experience 18.4% factual drift by step 3.'
        ]
      },
      public_advisory: {
        title: 'Zero-Drift Security & Infrastructure Deployment Directive',
        situation: 'Organizations adopting generative AI workflows risk regulatory non-compliance from ungrounded claims.',
        what_happened: 'SOC2 Type II compliance audit mandates tamper-evident citation links directly in published artifacts.',
        who_is_affected: 'Enterprise IT teams, CISOs, and compliance officers across Fortune 500 tiers.',
        what_people_should_know: [
          'Multi-region failover latency is bounded within 45ms across Tier-1 availability zones.',
          'Cryptographic provenance uses SHA-256 hash trees tethering outputs to source token spans.'
        ],
        recommended_actions: [
          'Transition mission-critical publishing pipelines to deterministic Knowledge Cores.'
        ],
        warnings: [
          'Unanchored prompt chains experience 18.4% factual drift by step 3.'
        ],
        additional_information: 'Refer to Architecture Spec v3.4 for cryptographic specifications.'
      }
    }
  },
  {
    id: 'art-5',
    title: 'Presentation',
    type: 'Presentation',
    description: '10-slide deck outline structured for investor and partner executive briefings.',
    status: 'Ready',
    factsLinked: 16,
    fidelity: 97.5,
    lastUpdated: '4 hours ago',
    targetAudience: 'Investors & Strategic Partners',
    estimatedReadTime: '5 min review',
    preview: '10 slides: The Information Drift Problem, Compiler Architecture, Customer Traction, and Enterprise Moat.',
    fullContent: `SLIDE 1: Title Slide
Briefly — The AI Communication Compiler.
"One source. Every story. Zero information drift."

SLIDE 2: The Enterprise Crisis: Information Drift
• 18.4% factual decay in 3 steps of traditional AI summarization.
• Multiplied across 9 corporate communication channels.

SLIDE 3: The Solution: Deterministic Knowledge Core
• Extraction of immutable facts, claims, and statistics.
• Mathematical provenance binding outputs to origin.

SLIDE 4: Customer Validation & Financial Proof
• 134% Net Revenue Retention in Q3 2026.
• 4.2x expansion across Fortune 500 pilot cohorts.

SLIDE 5: Consistency Guard in Action
• Live verification engine comparing outgoing assets with raw source truth.

SLIDE 6: Output Portfolio
• Compiling 7 assets simultaneously from 1 validated source.`,
    keyPoints: [
      'Comprehensive 10-slide deck storyline',
      'All metrics verified against Q3 Earnings and Benchmark Spec',
      'Formatted for high-impact pitch delivery'
    ],
    structuredData: {
      presentation: {
        slides: [
          {
            number: 1,
            title: 'Briefly: The AI Communication Compiler',
            content: [
              'One source. Every story. Zero information drift.',
              'Transforming technical enterprise truth into multi-channel communication.'
            ],
            visualRecommendation: 'Deep indigo hero card with ambient backglow and minimalist typography',
            speakerNotes: 'Welcome everyone. Today we are addressing the multi-billion dollar crisis of enterprise information drift.'
          },
          {
            number: 2,
            title: 'The Enterprise Crisis: Information Drift',
            content: [
              '18.4% factual decay in 3 steps of traditional AI summarization.',
              'Inconsistent statistics across sales, marketing, and leadership decks.',
              'Regulatory, reputational, and compliance liabilities.'
            ],
            visualRecommendation: '2-column comparison showing entropy breakdown vs deterministic hashing',
            speakerNotes: 'When product specs turn into sales decks and press releases, numbers change. We measured an 18.4% drift in standard workflows.'
          },
          {
            number: 3,
            title: 'Empirical Traction & Financial Proof',
            content: [
              '134% Net Revenue Retention in Q3 2026.',
              '4.2x customer expansion across Fortune 500 pilots.',
              '99.1% factual precision verified against ground-truth source tokens.'
            ],
            visualRecommendation: 'Three prominent metric callout stat cards with verified badges',
            speakerNotes: 'Our Q3 numbers prove that enterprise customers will pay a significant premium for guaranteed factual integrity.'
          },
          {
            number: 4,
            title: 'Next Steps & Rollout Strategy',
            content: [
              'Deploy Consistency Guard across all external publishing pipelines.',
              'Cryptographic provenance watermarks for SOC2 Type II compliance.'
            ],
            visualRecommendation: 'Roadmap timeline graphic with milestone gates',
            speakerNotes: 'We recommend immediate authorization for the enterprise compiler rollout in Q4.'
          }
        ]
      }
    }
  },
  {
    id: 'art-6',
    title: 'Infographic',
    type: 'Infographic',
    description: 'Visual layout blueprint contrasting prompt entropy against compiled precision.',
    status: 'Ready',
    factsLinked: 7,
    fidelity: 95.0,
    lastUpdated: 'Yesterday',
    targetAudience: 'Visual Content Teams',
    estimatedReadTime: '2 min review',
    preview: 'Visual hierarchy: Left column shows prompt decay (18.4% error), Right column shows Briefly compiler consistency (99.1% fidelity).',
    fullContent: `INFOGRAPHIC WIREFRAME BLUEPRINT

Header: "The Cost of Information Drift vs. The Power of Compilation"

SECTION A: THE PROBLEM (Prompt Entropy)
[Visual: Leaky funnel with fading text]
• Step 1: 100% accurate PRD
• Step 2: 91.2% accurate sales sheet (-8.8%)
• Step 3: 81.6% accurate press release (-18.4% drift)

SECTION B: THE KNOWLEDGE CORE (Center Anchor)
[Visual: Hexagonal glowing core holding 894 verified facts]
• Facts · Claims · Entities · Statistics · Key Messages
• Verified 94.6% System Source Fidelity

SECTION C: DETERMINISTIC MULTI-OUTPUT (Right Flow)
[Visual: 7 radiating beams leading to clean communication artifacts]
• Executive Brief (99.1% fidelity)
• LinkedIn Post (98.4% fidelity)
• Technical Advisory (94.2% fidelity)`,
    keyPoints: [
      'Clear side-by-side data visualization concept',
      'Highlights 18.4% drift vs 99.1% precision contrast',
      'Design specs ready for visual design tools'
    ],
    structuredData: {
      infographic: {
        title: 'Information Drift vs. Deterministic Compilation',
        headlineStatistic: '18.4% Drift Eliminated',
        sections: [
          {
            heading: 'Prompt Entropy Problem',
            points: ['Step 1: 100% accurate PRD', 'Step 2: 91.2% sales deck (-8.8%)', 'Step 3: 81.6% press release (-18.4% drift)']
          },
          {
            heading: 'Knowledge Core Engine',
            points: ['Immutable token invariants', 'Bi-directional citation hashing', 'Consistency Guard real-time audit']
          },
          {
            heading: 'Compiled Multi-Channel Output',
            points: ['7 simultaneous formats', '99.1% verified fact alignment', 'Zero information drift active']
          }
        ],
        keyNumbers: [
          { label: 'NRR Growth', value: '134%' },
          { label: 'Pilot Expansion', value: '4.2x' },
          { label: 'Fact Precision', value: '99.1%' }
        ],
        visualRecommendations: [
          '3-panel comparative flowchart with gradient accent nodes',
          'Center illuminated hexagonal icon for Knowledge Core',
          'Emerald verification checkmarks on all compiled channels'
        ],
        layout: 'Horizontal 3-stage pipeline flow with centered metric callout hero',
        takeaway: 'Stop summarizing. Start compiling. One source of truth across all 7 channels.'
      }
    }
  },
  {
    id: 'art-7',
    title: 'Video Storyboard',
    type: 'Video Storyboard',
    description: '90-second product explainer script and shot breakdown for video production.',
    status: 'Draft',
    factsLinked: 9,
    fidelity: 92.1,
    lastUpdated: 'Yesterday',
    targetAudience: 'Marketing & Video Teams',
    estimatedReadTime: '3 min review',
    preview: 'Shot 1: Zooming in on a redlined press release with misquoted stats. Shot 2: Briefly Knowledge Core glowing with source truth.',
    fullContent: `VIDEO STORYBOARD SCRIPT (90 SECONDS)

[0:00 - 0:15] SCENE 1: THE DRFT NIGHTMARE
Visual: Close-up on a stressed VP reading a blog post that claims "100ms latency reduction" while the actual engineering doc reads "45ms".
Audio Voiceover: "In the enterprise, words matter. But as information travels from engineering to marketing to leadership... facts get lost."

[0:15 - 0:35] SCENE 2: INTRODUCING BRIEFLY
Visual: Sleek UI transition to Briefly Dashboard. An engineering spec PDF is dropped into the source intake.
Audio Voiceover: "Meet Briefly — the AI Communication Compiler. You provide one source of truth. Briefly extracts the Knowledge Core: every fact, claim, and metric."

[0:35 - 0:65] SCENE 3: COMPILING 7 CHANNELS IN SECONDS
Visual: The Knowledge Core generates an Executive Brief, LinkedIn post, Slide Deck, and Advisory.
Audio Voiceover: "One source. Every story. Consistency Guard verifies every word against the original text."

[0:65 - 0:90] SCENE 4: CALL TO ACTION
Visual: Clean logo lockup with ambient blue-violet glow.
Audio Voiceover: "Briefly. Zero information drift."`,
    keyPoints: [
      'Timecoded 90-second pacing',
      'Includes camera directions, voiceover, and UI screen actions',
      'Demonstrates real-world risk of information drift'
    ],
    structuredData: {
      videoPackage: {
        title: 'Briefly: The Post-Hallucination Enterprise (90s Explainer)',
        duration: '90 seconds',
        scenes: [
          {
            sceneNumber: 1,
            duration: '0:00 - 0:15',
            visual: 'Close-up on a stressed executive reviewing misquoted SLA stats in a public report.',
            narration: 'In the modern enterprise, words matter. But as technical truth travels from engineering to marketing... facts drift by 18.4%.',
            subtitle: 'Traditional LLM workflows lose 18.4% factual accuracy in 3 steps.',
            onScreenText: 'The Enterprise Crisis: Information Drift'
          },
          {
            sceneNumber: 2,
            duration: '0:15 - 0:40',
            visual: 'Smooth cinematic push-in to Briefly UI. A 30-page architecture spec is dropped into Ingest.',
            narration: 'Meet Briefly — the AI Communication Compiler. One authoritative document generates a structured Knowledge Core of immutable facts.',
            subtitle: 'One source. Deterministic AST knowledge invariants.',
            onScreenText: 'Extract Immutable Knowledge Core'
          },
          {
            sceneNumber: 3,
            duration: '0:40 - 1:10',
            visual: 'Seven communication channels compile simultaneously: Executive Brief, Advisory, LinkedIn, Deck.',
            narration: 'Seven channels compiled simultaneously from the exact same invariants. Consistency Guard verifies every sentence.',
            subtitle: '7 simultaneous formats. 99.1% verified fact alignment.',
            onScreenText: 'Zero Information Drift'
          },
          {
            sceneNumber: 4,
            duration: '1:10 - 1:30',
            visual: 'Clean ambient glow with Briefly logo and URL callout.',
            narration: 'One source. Every story. Zero information drift. Briefly.',
            subtitle: 'Start compiling at briefly.ai',
            onScreenText: 'Briefly — Zero Information Drift'
          }
        ]
      },
      video_package: {
        title: 'Briefly: The Post-Hallucination Enterprise (90s Explainer)',
        duration: '90 seconds',
        scenes: [
          {
            sceneNumber: 1,
            duration: '0:00 - 0:15',
            visual: 'Close-up on a stressed executive reviewing misquoted SLA stats in a public report.',
            narration: 'In the modern enterprise, words matter. But as technical truth travels from engineering to marketing... facts drift by 18.4%.',
            subtitle: 'Traditional LLM workflows lose 18.4% factual accuracy in 3 steps.',
            onScreenText: 'The Enterprise Crisis: Information Drift'
          },
          {
            sceneNumber: 2,
            duration: '0:15 - 0:40',
            visual: 'Smooth cinematic push-in to Briefly UI. A 30-page architecture spec is dropped into Ingest.',
            narration: 'Meet Briefly — the AI Communication Compiler. One authoritative document generates a structured Knowledge Core of immutable facts.',
            subtitle: 'One source. Deterministic AST knowledge invariants.',
            onScreenText: 'Extract Immutable Knowledge Core'
          },
          {
            sceneNumber: 3,
            duration: '0:40 - 1:10',
            visual: 'Seven communication channels compile simultaneously: Executive Brief, Advisory, LinkedIn, Deck.',
            narration: 'Seven channels compiled simultaneously from the exact same invariants. Consistency Guard verifies every sentence.',
            subtitle: '7 simultaneous formats. 99.1% verified fact alignment.',
            onScreenText: 'Zero Information Drift'
          },
          {
            sceneNumber: 4,
            duration: '1:10 - 1:30',
            visual: 'Clean ambient glow with Briefly logo and URL callout.',
            narration: 'One source. Every story. Zero information drift. Briefly.',
            subtitle: 'Start compiling at briefly.ai',
            onScreenText: 'Briefly — Zero Information Drift'
          }
        ]
      }
    }
  }
];

export const sampleInconsistencies: InconsistencyItem[] = [
  {
    id: 'inc-1',
    artifactTitle: 'Technical Advisory (Draft v1)',
    sourceDoc: 'Architecture Spec: Adaptive LLM Compiler v3.4',
    generatedClaim: 'Multi-region failover latency is bounded within 25ms across availability zones.',
    sourceTruth: 'Maximum SLA failover latency across US-East, EU-Central, and AP-South is bounded at 45ms.',
    sourcePage: 'Page 8, Table 1',
    severity: 'high',
    resolved: false
  },
  {
    id: 'inc-2',
    artifactTitle: 'LinkedIn Post (Draft v2)',
    sourceDoc: 'Q3 Enterprise Adoption & Financial Earnings',
    generatedClaim: 'Briefly expanded enterprise customer accounts by 5.4x in the trailing twelve months.',
    sourceTruth: 'Net revenue retention surged to 134% in Q3, driven by a 4.2x expansion across multi-department accounts.',
    sourcePage: 'Page 4, CFO Remarks',
    severity: 'medium',
    resolved: false
  }
];
