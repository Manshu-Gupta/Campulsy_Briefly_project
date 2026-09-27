export type SourceType = 
  | 'Report'
  | 'News Article'
  | 'Research Paper'
  | 'Policy Document'
  | 'Advisory'
  | 'Incident Report'
  | 'Announcement'
  | 'PRD & Architecture'
  | 'Technical Whitepaper'
  | 'Earnings Call Transcript'
  | 'Advisory Board Notes'
  | 'Executive Keynote'
  | 'Other';

export interface FactItem {
  text: string;
  source_context?: string;
  type?: string;
  confidence?: number;
}

export interface StatisticItem {
  value: string;
  context: string;
  source_context?: string;
}

export interface DateItem {
  date: string;
  event: string;
  source_context?: string;
}

export interface EntityItem {
  name: string;
  type?: string;
  context?: string;
}

export interface StructuredKnowledgeCore {
  facts: FactItem[];
  claims: Array<{ text: string; source_context?: string; confidence?: number }>;
  statistics: StatisticItem[];
  dates: DateItem[];
  entities: EntityItem[] | {
    organizations: string[];
    people: string[];
    locations: string[];
  };
  key_messages: string[];
  findings: string[];
  risks: string[];
  recommendations: string[];
  uncertainties: Array<{ text: string; reason?: string }>;
  summary: string;
  aiAssistedSourceFidelity?: number;
  fidelityMetrics?: {
    factsCount: number;
    claimsCount: number;
    statsCount: number;
    uncertaintiesCount: number;
    datesCount: number;
  };
}

export interface SourceItem {
  id: string;
  name: string;
  type: SourceType;
  date: string;
  factsCount: number;
  artifactsCount: number;
  fidelity: number;
  status: 'Synced' | 'Verified' | 'Compiling' | 'Draft';
  author: string;
  fileSize: string;
  summary: string;
  snippet: string;
  version?: number;
  knowledgeCore?: StructuredKnowledgeCore;
  previousVersions?: Array<{
    version: number;
    snippet: string;
    date: string;
    knowledgeCore?: StructuredKnowledgeCore;
  }>;
}

export type KnowledgeCategory = 'all' | 'facts' | 'claims' | 'entities' | 'statistics' | 'key_messages' | 'uncertainties';

export interface KnowledgeItem {
  id: string;
  category: 'facts' | 'claims' | 'entities' | 'statistics' | 'key_messages' | 'uncertainties';
  statement: string;
  confidence: number;
  sourceDoc: string;
  sourceLocation: string;
  sourceTextSnippet: string;
  verificationStatus: 'verified' | 'flagged' | 'pending';
  linkedArtifacts: string[];
}

export type ArtifactType = 
  | 'Executive Brief'
  | 'Public Advisory'
  | 'LinkedIn Post'
  | 'X/Twitter Thread'
  | 'Presentation'
  | 'Infographic'
  | 'Video Package'
  // Legacy aliases for backward compatibility
  | 'X Thread'
  | 'Advisory'
  | 'Video Storyboard';

export interface ExecutiveBriefData {
  title: string;
  summary?: string;
  keyFindings?: string[];
  statistics?: string[];
  implications?: string[];
  recommendedActions?: string[];
  takeaway?: string;
  // Backward compatibility
  executive_summary?: string;
  key_findings?: string[];
  important_statistics?: string[];
  risks?: string[];
  recommended_actions?: string[];
  key_takeaway?: string;
}

export interface PublicAdvisoryData {
  title: string;
  situation: string;
  whatHappened?: string;
  whoIsAffected?: string;
  whatPeopleShouldKnow?: string[];
  recommendedActions?: string[];
  warnings?: string[];
  // Backward compatibility
  what_happened?: string;
  who_is_affected?: string;
  what_people_should_know?: string[];
  recommended_actions?: string[];
  additional_information?: string;
}

export interface LinkedInPostData {
  hook: string;
  body: string;
  callToAction?: string;
  hashtags?: string[];
  // Backward compatibility
  key_insight?: string;
  call_to_action?: string;
}

export interface XThreadData {
  posts: Array<{
    number: number;
    text: string;
  }>;
}

export interface PresentationSlide {
  number: number;
  title: string;
  content: string[];
  visualRecommendation?: string;
  speakerNotes?: string;
  // Backward compatibility
  visual_recommendation?: string;
  speaker_notes?: string;
}

export interface PresentationData {
  slides: PresentationSlide[];
}

export interface InfographicData {
  title: string;
  headlineStatistic?: string;
  sections?: Array<{
    heading: string;
    points: string[];
  }>;
  keyNumbers?: Array<{
    label: string;
    value: string;
  }>;
  visualRecommendations?: string[];
  layout?: string;
  takeaway?: string;
  // Backward compatibility
  headline_statistic?: string;
  key_numbers?: Array<{
    label: string;
    value: string;
  }>;
  visual_recommendations?: string[];
  key_takeaway?: string;
}

export interface VideoScene {
  sceneNumber: number;
  duration: string;
  visual: string;
  narration: string;
  subtitle: string;
  onScreenText: string;
  // Backward compatibility
  scene?: number;
  on_screen_text?: string;
}

export interface VideoPackageData {
  title: string;
  duration: string;
  scenes: VideoScene[];
}

export interface ArtifactStructuredPayload {
  executiveBrief?: ExecutiveBriefData;
  publicAdvisory?: PublicAdvisoryData;
  linkedinPost?: LinkedInPostData;
  xThread?: XThreadData;
  presentation?: PresentationData;
  infographic?: InfographicData;
  videoPackage?: VideoPackageData;
  // snake_case aliases
  executive_brief?: ExecutiveBriefData;
  public_advisory?: PublicAdvisoryData;
  linkedin_post?: LinkedInPostData;
  x_thread?: XThreadData;
  video_package?: VideoPackageData;
}

export type ArtifactStatus = 
  | 'Ready' 
  | 'Generating...' 
  | 'Generated' 
  | 'Verified' 
  | 'Error' 
  | 'Compiling' 
  | 'Draft'
  | 'PPTX Generating'
  | 'PPTX Ready'
  | 'Storyboard Generated'
  | 'AI Video Generating'
  | 'AI Video Ready';

export interface ArtifactItem {
  id: string;
  title: string;
  type: ArtifactType;
  description: string;
  status: ArtifactStatus;
  factsLinked: number;
  fidelity: number;
  lastUpdated: string;
  targetAudience: string;
  estimatedReadTime: string;
  preview: string;
  fullContent: string;
  keyPoints: string[];
  structuredData?: ArtifactStructuredPayload;
  videoArtifact?: {
    status: 'idle' | 'generating' | 'ready' | 'error';
    operationName?: string;
    videoUrl?: string;
    duration?: string;
    prompt?: string;
    error?: string;
  };
  pptxArtifact?: {
    status: 'idle' | 'generating' | 'ready' | 'error';
    fileBlobUrl?: string;
    fileName?: string;
    slideCount?: number;
    error?: string;
  };
  verificationAudit?: {
    verifiedAt?: string;
    supportedClaims?: string[];
    inconsistencies?: Array<{
      claim: string;
      sourceTruth: string;
      generatedValue?: string;
      sourceValue?: string;
      reason?: string;
      severity?: 'low' | 'medium' | 'high';
    }>;
    verifiedStatistics?: string[];
  };
}

export interface ConsistencyIssue {
  artifact: string;
  claim: string;
  generated_value: string;
  source_value: string;
  reason: string;
  severity: 'low' | 'medium' | 'high';
}

export interface VerificationReport {
  overall_status: 'pass' | 'review';
  issues: ConsistencyIssue[];
  verified_claims: number;
  issues_found: number;
}

export interface InconsistencyItem {
  id: string;
  artifactTitle: string;
  sourceDoc: string;
  generatedClaim: string;
  sourceTruth: string;
  sourcePage: string;
  severity: 'high' | 'medium' | 'low';
  resolved: boolean;
}

export interface DashboardStats {
  sourcesProcessed: number;
  sourcesChange: string;
  artifactsGenerated: number;
  artifactsSyncedPercent: number;
  factsExtracted: number;
  factsNetWeekly: string;
  sourceFidelity: number;
  fidelityDelta: string;
  claimsVerified?: number;
  issuesDetected?: number;
}

export interface Workspace {
  id: string;
  name: string;
  code: string;
  description: string;
  sourceCount: number;
}

export interface TransformConfig {
  audience: 'Executive' | 'Technical Team' | 'General Public' | 'Students' | 'Customers' | 'Employees' | 'Media' | 'Government/Policy' | 'Custom';
  customAudience?: string;
  tone: 'Professional' | 'Simple' | 'Technical' | 'Formal' | 'Conversational' | 'Urgent' | 'Educational';
  objective: 'Inform' | 'Explain' | 'Alert' | 'Educate' | 'Promote' | 'Summarize' | 'Request Action';
  detail: 'Concise' | 'Balanced' | 'Detailed';
  language: 'English' | 'Hindi' | 'Hinglish';
}

export interface AudienceGap {
  audience: string;
  reason: string;
  suggested_artifact: string;
}

export interface VersionChangeItem {
  type: 'statistic' | 'fact' | 'date' | 'general';
  description: string;
  previous?: string;
  current?: string;
}

export interface VersionDiffResult {
  changes: VersionChangeItem[];
  affectedArtifacts: string[];
  summary: string;
}

export interface ClaimTraceResult {
  generatedClaim: string;
  sourceFact: string;
  sourceContext: string;
  status: 'supported' | 'needs_review';
  confidence: number;
}
