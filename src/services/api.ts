import { 
  StructuredKnowledgeCore, 
  ArtifactStructuredPayload, 
  VerificationReport, 
  AudienceGap, 
  VersionDiffResult, 
  ClaimTraceResult 
} from '../types/dashboard';

export const SAMPLE_EWASTE_REPORT = {
  title: 'Urban E-Waste Management Report 2026',
  type: 'Report' as const,
  author: 'Global Circular Tech Institute & Municipal Resource Board',
  content: `URBAN E-WASTE MANAGEMENT & CRITICAL MINERAL RECOVERY: GLOBAL BENCHMARK 2026
Published: March 14, 2026
Lead Agency: International Clean Urbanism Alliance (ICUA)

1. EXECUTIVE OVERVIEW
In 2025, global urban municipal areas generated an estimated 62.4 million metric tons of electronic waste (e-waste), growing at 8.2% year-over-year. Without immediate intervention, municipal e-waste accumulation will reach 82 million metric tons annually by 2030. However, modern automated hydrometallurgical processing has demonstrated a 94.2% recovery yield for critical rare-earth elements (neodymium, dysprosium) and battery-grade lithium from discarded consumer hardware.

2. VERIFIED EMPIRICAL METRICS & AUDIT DATA
• Total e-waste generated globally in 2025: 62.4 million metric tons.
• Documented formal collection and recycling rate: only 22.3% globally.
• Unaccounted or informally handled e-waste: 48.5 million metric tons, representing $62 billion in unrecovered raw mineral value.
• High-yield automated recycling facility pilot in Neo-Munich: processed 12,500 metric tons in Q4 2025 with zero toxic wastewater leakage.
• Worker heavy-metal exposure reduction: down by 76% in facilities utilizing robotic optical sorting versus manual disassembly.
• Target mandate deadline: EU and Asian Pacific Municipal Compact requires 65% formal recovery compliance by November 15, 2028.

3. KEY FINDINGS
A. Critical Material Depletion: Consumer electronics discarded in 2025 contained 38 times more gold per ton than raw geological ore mined in traditional open-pit sites.
B. Informal Sector Hazards: Unregulated acid leaching in informal scrap hubs accounts for 180,000 tons of lead and cadmium contamination in urban river basins annually.
C. Economic Feasibility: Urban mining facilities achieve operational EBITDA break-even at 8,000 metric tons annual volume when subsidized with extended producer responsibility (EPR) fee credits.

4. IDENTIFIED SYSTEMIC RISKS
• Regulatory fragmentation: 42% of municipal jurisdictions still classify lithium-ion laptop cells under general combustible trash rather than hazardous e-scrap.
• Supply chain opacity: Illegal transboundary shipment of discarded server racks to non-OECD nations increased 14% between 2023 and 2025.
• Fire hazards: Battery-induced fires in municipal collection vehicles surged to 1,240 reported incidents in North America in 2025.

5. ACTIONABLE RECOMMENDATIONS
1. Mandate Universal QR Serial Tracking: Require all hardware manufacturers selling >10,000 units annually to embed tamper-proof digital disassembly passports by Q2 2027.
2. Establish Municipal Drop-Off Enclaves: Deploy automated reverse-vending recycling kiosks within 15 minutes of 80% of urban residents.
3. Subsidize Clean Hydrometallurgy: Allocate $1.2B in green infrastructure bonds to construct 14 regional urban mineral extraction hubs across Tier-1 metro regions before December 2028.`
};

export async function checkServerHealth(): Promise<boolean> {
  try {
    const res = await fetch('/api/health');
    const data = await res.json();
    return !!data.hasApiKey;
  } catch (e) {
    console.error('Failed to check health:', e);
    return false;
  }
}

export async function analyzeSourceApi(params: {
  title: string;
  type: string;
  content: string;
  author?: string;
  inlineImage?: { mimeType: string; data: string };
}): Promise<{ knowledgeCore: StructuredKnowledgeCore }> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 28000);

  try {
    const res = await fetch('/api/analyze-source', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Analysis failed' }));
      throw new Error(err.error || `HTTP ${res.status}: Failed to analyze source`);
    }

    const data = await res.json();
    if (!data.knowledgeCore || typeof data.knowledgeCore !== 'object') {
      throw new Error('Server returned an invalid Knowledge Core payload');
    }

    return data;
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error('Gemini analysis timed out after 28 seconds. Please click "Retry Analysis".');
    }
    throw err;
  }
}

export async function generateArtifactsApi(params: {
  knowledgeCore: StructuredKnowledgeCore;
  sourceTitle: string;
  sourceType: string;
  selectedOutputs: string[];
  audience: string;
  tone: string;
  objective: string;
  detail: string;
  language: string;
}): Promise<{ artifacts: ArtifactStructuredPayload }> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 35000);

  try {
    const res = await fetch('/api/generate-artifacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Artifact generation failed' }));
      throw new Error(err.error || `HTTP ${res.status}: Generation failed`);
    }

    const data = await res.json();
    if (!data.artifacts || typeof data.artifacts !== 'object') {
      throw new Error('Server returned an invalid compiled artifacts payload');
    }

    return data;
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error('Gemini kit compilation timed out after 35 seconds. Please click "Retry Generation".');
    }
    throw err;
  }
}

export async function verifyConsistencyApi(params: {
  knowledgeCore: StructuredKnowledgeCore;
  artifacts: Record<string, any>;
}): Promise<{ report: VerificationReport }> {
  const res = await fetch('/api/verify-consistency', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Consistency verification failed' }));
    throw new Error(err.error || `HTTP ${res.status}: Verification failed`);
  }

  return await res.json();
}

export async function traceClaimApi(params: {
  claim: string;
  knowledgeCore: StructuredKnowledgeCore;
}): Promise<{ result: ClaimTraceResult }> {
  const res = await fetch('/api/trace-claim', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Claim trace failed' }));
    throw new Error(err.error || `HTTP ${res.status}: Trace failed`);
  }

  return await res.json();
}

export async function audienceGapApi(params: {
  knowledgeCore: StructuredKnowledgeCore;
  selectedAudiences: string[];
  generatedArtifactTypes: string[];
}): Promise<{ gaps: AudienceGap[] }> {
  const res = await fetch('/api/audience-gap', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Audience gap analysis failed' }));
    throw new Error(err.error || `HTTP ${res.status}: Analysis failed`);
  }

  return await res.json();
}

export async function versionDiffApi(params: {
  previousCore: StructuredKnowledgeCore;
  newCore: StructuredKnowledgeCore;
  existingArtifacts: string[];
}): Promise<{ diff: VersionDiffResult }> {
  const res = await fetch('/api/version-diff', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Version diff comparison failed' }));
    throw new Error(err.error || `HTTP ${res.status}: Version diff failed`);
  }

  return await res.json();
}

export async function generateVideoApi(params: {
  videoStoryboard?: any;
  knowledgeCore?: StructuredKnowledgeCore | null;
  audience?: string;
  objective?: string;
  tone?: string;
}): Promise<{ success: boolean; operationName: string; prompt: string; duration: string; notice?: string }> {
  const res = await fetch('/api/generate-video', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Video generation request failed' }));
    throw new Error(err.error || `HTTP ${res.status}: Failed to submit video generation`);
  }

  return await res.json();
}

export async function checkVideoStatusApi(operationName: string): Promise<{
  done: boolean;
  error?: string;
  status: 'generating' | 'ready' | 'error';
  duration?: string;
}> {
  const res = await fetch('/api/video-status', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ operationName }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Failed to check video status' }));
    throw new Error(err.error || `HTTP ${res.status}: Status check failed`);
  }

  return await res.json();
}

export function getVideoStreamUrl(operationName: string): string {
  return `/api/video-stream?operationName=${encodeURIComponent(operationName)}`;
}

export function getVideoDownloadUrl(operationName: string): string {
  return `/api/video-download?operationName=${encodeURIComponent(operationName)}`;
}

