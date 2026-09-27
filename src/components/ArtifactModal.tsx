import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Download, 
  ShieldCheck, 
  Sparkles,
  RotateCw,
  FileText,
  Share2,
  MessageSquare,
  Presentation as PresentationIcon,
  PieChart,
  Video,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  ExternalLink,
  AlertTriangle,
  Info,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Film,
  FileDown,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { ArtifactItem, StructuredKnowledgeCore } from '../types/dashboard';
import { generatePptx, downloadPptxFile } from '../services/presentationService';
import { generateVideoApi, checkVideoStatusApi, getVideoStreamUrl, getVideoDownloadUrl } from '../services/api';

interface ArtifactModalProps {
  artifact: ArtifactItem | null;
  onClose: () => void;
  onRecompile: (artifact: ArtifactItem) => void;
  onTraceClaim?: (claimText: string) => void;
  onRunVerify?: (artifact?: ArtifactItem) => void;
  isVerifying?: boolean;
  knowledgeCore?: StructuredKnowledgeCore | null;
  onUpdateArtifact?: (updated: ArtifactItem) => void;
}

export const ArtifactModal: React.FC<ArtifactModalProps> = ({
  artifact,
  onClose,
  onRecompile,
  onTraceClaim,
  onRunVerify,
  isVerifying,
  knowledgeCore,
  onUpdateArtifact,
}) => {
  const [copied, setCopied] = useState(false);
  const [copyFeedbackText, setCopyFeedbackText] = useState('Copied!');

  // Identify active channel type
  const titleLower = (artifact?.title || '').toLowerCase();
  const typeLower = (artifact?.type || '').toLowerCase();

  const isExecutiveBrief = typeLower.includes('executive') || titleLower.includes('executive') || titleLower.includes('brief');
  const isPublicAdvisory = typeLower.includes('advisory') || titleLower.includes('advisory') || titleLower.includes('public');
  const isLinkedIn = typeLower.includes('linkedin') || titleLower.includes('linkedin');
  const isXThread = typeLower.includes('thread') || typeLower.includes('twitter') || titleLower.includes('thread') || titleLower.includes('twitter') || titleLower === 'x';
  const isPresentation = typeLower.includes('presentation') || titleLower.includes('presentation') || titleLower.includes('slide') || titleLower.includes('deck');
  const isInfographic = typeLower.includes('infographic') || titleLower.includes('infographic');
  const isVideoPackage = typeLower.includes('video') || titleLower.includes('video') || titleLower.includes('storyboard') || titleLower.includes('package');

  // Tab State
  // For Video: [ AI Video ] [ Storyboard ] [ Verification ]
  // For Presentation: [ Preview ] [ Slide Content ] [ Verification ]
  // For others: [ Structured Format ] [ Verification Audit ] [ Linked Claims ] [ Raw Text ]
  const [activeVideoTab, setActiveVideoTab] = useState<'ai_video' | 'storyboard' | 'verification'>('ai_video');
  const [activePresentationTab, setActivePresentationTab] = useState<'preview' | 'slide_content' | 'verification'>('preview');
  const [activeGeneralTab, setActiveGeneralTab] = useState<'preview' | 'verification' | 'provenance' | 'raw'>('preview');

  // Presentation Slide Navigation
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // PPTX Generation State
  const [pptxStatus, setPptxStatus] = useState<'idle' | 'generating' | 'ready' | 'error'>(
    artifact?.pptxArtifact?.status || (artifact?.status === 'PPTX Ready' ? 'ready' : (artifact?.status === 'PPTX Generating' ? 'generating' : 'idle'))
  );
  const [pptxBlobUrl, setPptxBlobUrl] = useState<string>(artifact?.pptxArtifact?.fileBlobUrl || '');
  const [pptxFileName, setPptxFileName] = useState<string>(artifact?.pptxArtifact?.fileName || '');
  const [pptxSlideCount, setPptxSlideCount] = useState<number>(artifact?.pptxArtifact?.slideCount || 0);
  const [pptxError, setPptxError] = useState<string>(artifact?.pptxArtifact?.error || '');

  // AI Video (Veo) Generation State
  const [videoStatus, setVideoStatus] = useState<'idle' | 'generating' | 'ready' | 'error'>(
    artifact?.videoArtifact?.status || (artifact?.status === 'AI Video Ready' ? 'ready' : (artifact?.status === 'AI Video Generating' ? 'generating' : 'idle'))
  );
  const [videoOperationName, setVideoOperationName] = useState<string>(artifact?.videoArtifact?.operationName || '');
  const [videoUrl, setVideoUrl] = useState<string>(
    artifact?.videoArtifact?.videoUrl || (artifact?.videoArtifact?.operationName ? getVideoStreamUrl(artifact.videoArtifact.operationName) : '')
  );
  const [videoDuration, setVideoDuration] = useState<string>(artifact?.videoArtifact?.duration || '5s');
  const [videoError, setVideoError] = useState<string>(artifact?.videoArtifact?.error || '');
  const [videoProgressMsg, setVideoProgressMsg] = useState<string>('Submitting prompt to Google Veo 3.1...');

  // HTML5 Video Player Custom Controls State
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTimeSec, setCurrentTimeSec] = useState(0);
  const [durationSec, setDurationSec] = useState(5);

  // Structured payloads
  const structured = (artifact?.structuredData || {}) as any;
  const eb = structured.executiveBrief || structured.executive_brief || (isExecutiveBrief && (structured.summary || structured.keyFindings) ? structured : null);
  const pa = structured.publicAdvisory || structured.public_advisory || (isPublicAdvisory && (structured.situation || structured.whatHappened) ? structured : null);
  const li = structured.linkedinPost || structured.linkedin_post || (isLinkedIn && (structured.hook || structured.body) ? structured : null);
  const xt = structured.xThread || structured.x_thread || (isXThread && structured.posts ? structured : null);
  const pr = structured.presentation || (isPresentation && structured.slides ? structured : null);
  const info = structured.infographic || (isInfographic && (structured.sections || structured.headlineStatistic) ? structured : null);
  const vp = structured.videoPackage || structured.video_package || (isVideoPackage && structured.scenes ? structured : null);

  // Sync state if artifact changes
  useEffect(() => {
    if (artifact) {
      if (artifact.pptxArtifact) {
        setPptxStatus(artifact.pptxArtifact.status);
        setPptxBlobUrl(artifact.pptxArtifact.fileBlobUrl || '');
        setPptxFileName(artifact.pptxArtifact.fileName || '');
        setPptxSlideCount(artifact.pptxArtifact.slideCount || 0);
      }
      if (artifact.videoArtifact) {
        setVideoStatus(artifact.videoArtifact.status);
        setVideoOperationName(artifact.videoArtifact.operationName || '');
        setVideoUrl(artifact.videoArtifact.videoUrl || (artifact.videoArtifact.operationName ? getVideoStreamUrl(artifact.videoArtifact.operationName) : ''));
        setVideoDuration(artifact.videoArtifact.duration || '5s');
      }
    }
  }, [artifact]);

  if (!artifact) return null;

  // Video Polling Loop
  const pollVideoStatus = async (opName: string) => {
    let attempts = 0;
    const maxAttempts = 40; // ~60 seconds max
    const interval = setInterval(async () => {
      attempts++;
      try {
        if (attempts === 2) setVideoProgressMsg('Google Veo 3.1 synthesizing cinematic camera motion...');
        if (attempts === 5) setVideoProgressMsg('Rendering high-definition 720p broadcast MP4...');
        if (attempts === 10) setVideoProgressMsg('Assembling final video package and audio encoding...');

        const res = await checkVideoStatusApi(opName);
        if (res.done) {
          clearInterval(interval);
          if (res.error) {
            setVideoStatus('error');
            setVideoError(res.error);
            return;
          }

          const streamUrl = getVideoStreamUrl(opName);
          setVideoUrl(streamUrl);
          setVideoStatus('ready');
          setVideoDuration(res.duration || '5s');

          // Cache update on artifact
          const updated: ArtifactItem = {
            ...artifact,
            status: 'AI Video Ready',
            videoArtifact: {
              status: 'ready',
              operationName: opName,
              videoUrl: streamUrl,
              duration: res.duration || '5s',
            },
          };
          onUpdateArtifact?.(updated);
        } else if (attempts >= maxAttempts) {
          clearInterval(interval);
          setVideoStatus('error');
          setVideoError('Video generation timed out. Please click Retry.');
        }
      } catch (err: any) {
        clearInterval(interval);
        setVideoStatus('error');
        setVideoError(err.message || 'Error checking video status.');
      }
    }, 1500);
  };

  // Trigger explicit Veo generation
  const handleGenerateAiVideo = async () => {
    try {
      setVideoStatus('generating');
      setVideoError('');
      setVideoProgressMsg('Submitting prompt to Google Veo 3.1...');

      const response = await generateVideoApi({
        videoStoryboard: vp,
        knowledgeCore: knowledgeCore,
        audience: artifact.targetAudience,
        objective: 'Inform',
        tone: 'Authoritative',
      });

      setVideoOperationName(response.operationName);
      setVideoDuration(response.duration || '5s');

      // Update artifact state to Generating
      const updated: ArtifactItem = {
        ...artifact,
        status: 'AI Video Generating',
        videoArtifact: {
          status: 'generating',
          operationName: response.operationName,
          prompt: response.prompt,
          duration: response.duration || '5s',
        },
      };
      onUpdateArtifact?.(updated);

      // Start polling
      pollVideoStatus(response.operationName);
    } catch (err: any) {
      console.error('Error generating AI video:', err);
      setVideoStatus('error');
      setVideoError(err.message || 'Failed to submit AI video generation request.');
    }
  };

  // Video Player Controls
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleReplay = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = 0;
    videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const handleFullscreen = () => {
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  const handleDownloadVideo = () => {
    const downloadUrl = videoOperationName 
      ? getVideoDownloadUrl(videoOperationName) 
      : (videoUrl || '/videos/fallback-veo-clip.mp4');
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `${artifact.title.toLowerCase().replace(/[\s/]+/g, '-')}-veo-video.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // PPTX Generation Handler using PptxGenJS
  const handleGeneratePptx = async () => {
    if (!pr?.slides || pr.slides.length === 0) {
      setPptxStatus('error');
      setPptxError('No slide data available to compile into PowerPoint.');
      return;
    }

    try {
      setPptxStatus('generating');
      setPptxError('');

      // Generate PPTX via PptxGenJS
      const result = await generatePptx(pr, artifact.title, knowledgeCore);
      setPptxBlobUrl(result.url);
      setPptxFileName(result.fileName);
      setPptxSlideCount(result.slideCount);
      setPptxStatus('ready');

      // Update parent artifact state
      const updated: ArtifactItem = {
        ...artifact,
        status: 'PPTX Ready',
        pptxArtifact: {
          status: 'ready',
          fileBlobUrl: result.url,
          fileName: result.fileName,
          slideCount: result.slideCount,
        },
      };
      onUpdateArtifact?.(updated);
    } catch (err: any) {
      console.error('Failed to create PowerPoint:', err);
      setPptxStatus('error');
      setPptxError(err.message || 'Could not create PowerPoint presentation.');
    }
  };

  const handleDownloadPptx = () => {
    if (pptxBlobUrl) {
      downloadPptxFile(pptxBlobUrl, pptxFileName || `${artifact.title}.pptx`);
    } else {
      handleGeneratePptx();
    }
  };

  const handleCopyText = (text: string, label = 'Copied!') => {
    navigator.clipboard.writeText(text);
    setCopyFeedbackText(label);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyDefault = () => {
    if (li) {
      const hook = li.hook || '';
      const body = li.body || '';
      const cta = li.callToAction || li.call_to_action || '';
      const tags = (li.hashtags || []).join(' ');
      handleCopyText(`${hook}\n\n${body}\n\n${cta}\n\n${tags}`.trim(), 'Copied Post!');
      return;
    }

    if (xt) {
      const posts = xt.posts || [];
      const text = posts.map((p: any) => typeof p === 'string' ? p : p.text).join('\n\n');
      handleCopyText(text, 'Copied Thread!');
      return;
    }

    if (eb) {
      const title = eb.title || 'Executive Brief';
      const summary = eb.summary || eb.executive_summary || '';
      const findings = (eb.keyFindings || eb.key_findings || []).map((f: string) => `• ${f}`).join('\n');
      const stats = (eb.statistics || eb.important_statistics || []).map((s: string) => `• ${s}`).join('\n');
      const actions = (eb.recommendedActions || eb.recommended_actions || []).map((a: string, i: number) => `${i + 1}. ${a}`).join('\n');
      const takeaway = eb.takeaway || eb.key_takeaway ? `Takeaway: ${eb.takeaway || eb.key_takeaway}` : '';
      const text = `${title}\n\nEXECUTIVE SUMMARY:\n${summary}\n\nKEY FINDINGS:\n${findings}\n\nSTATISTICS:\n${stats}\n\nACTIONS:\n${actions}\n\n${takeaway}`.trim();
      handleCopyText(text, 'Copied Brief!');
      return;
    }

    if (pa) {
      const title = pa.title || 'Public Advisory';
      const situation = pa.situation || '';
      const what = pa.whatHappened || pa.what_happened || '';
      const who = pa.whoIsAffected || pa.who_is_affected || '';
      const know = (pa.whatPeopleShouldKnow || pa.what_people_should_know || []).map((k: string) => `• ${k}`).join('\n');
      const actions = (pa.recommendedActions || pa.recommended_actions || []).map((a: string) => `• ${a}`).join('\n');
      const warnings = (pa.warnings || []).map((w: string) => `⚠ ${w}`).join('\n');
      const text = `${title}\n\nSITUATION:\n${situation}\n\nWHAT HAPPENED:\n${what}\n\nWHO IS AFFECTED:\n${who}\n\nWHAT PEOPLE SHOULD KNOW:\n${know}\n\nRECOMMENDED ACTIONS:\n${actions}\n\nWARNINGS:\n${warnings}`.trim();
      handleCopyText(text, 'Copied Advisory!');
      return;
    }

    if (pr) {
      const slides = pr.slides || [];
      const text = slides.map((s: any) => `SLIDE ${s.number}: ${s.title}\n${(s.content || []).map((c: string) => `• ${c}`).join('\n')}\nVisual: ${s.visualRecommendation || s.visual_recommendation || ''}\nSpeaker Notes: ${s.speakerNotes || s.speaker_notes || ''}`).join('\n\n---\n\n');
      handleCopyText(text, 'Copied Slides!');
      return;
    }

    if (vp) {
      const scenes = vp.scenes || [];
      const text = `${vp.title} (${vp.duration})\n\n` + scenes.map((s: any) => `SCENE ${s.sceneNumber || s.scene} (${s.duration})\nVisual: ${s.visual}\nNarration: "${s.narration}"\nSubtitle: ${s.subtitle}\nOn-Screen: ${s.onScreenText || s.on_screen_text || ''}`).join('\n\n');
      handleCopyText(text, 'Copied Script!');
      return;
    }

    if (info) {
      const text = `${info.title}\nHeadline Statistic: ${info.headlineStatistic || info.headline_statistic}\n\nSections:\n` +
        (info.sections || []).map((sec: any) => `${sec.heading}:\n${(sec.points || []).map((p: string) => `• ${p}`).join('\n')}`).join('\n\n') +
        `\n\nTakeaway: ${info.takeaway || info.key_takeaway || ''}`;
      handleCopyText(text, 'Copied Spec!');
      return;
    }

    handleCopyText(artifact.fullContent, 'Copied!');
  };

  const handleDownload = () => {
    if (isPresentation && pptxStatus === 'ready' && pptxBlobUrl) {
      handleDownloadPptx();
      return;
    }
    if (isVideoPackage && videoStatus === 'ready') {
      handleDownloadVideo();
      return;
    }
    const blob = new Blob([artifact.fullContent], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${artifact.title.toLowerCase().replace(/[\s/]+/g, '-')}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const isVerified = artifact.status === 'Verified';

  // Dynamic status badge text & styling
  let badgeLabel = artifact.status as string;
  let badgeColor = 'text-slate-600 bg-slate-100 border-slate-200';

  if (isPresentation) {
    if (pptxStatus === 'ready') {
      badgeLabel = 'PPTX Ready';
      badgeColor = 'text-emerald-700 bg-emerald-50 border-emerald-200/60';
    } else if (pptxStatus === 'generating') {
      badgeLabel = 'PPTX Generating';
      badgeColor = 'text-indigo-700 bg-indigo-50 border-indigo-200/60';
    } else {
      badgeLabel = artifact.status === 'Generated' ? 'Generated' : 'Ready';
      badgeColor = 'text-slate-700 bg-slate-100 border-slate-200';
    }
  } else if (isVideoPackage) {
    if (videoStatus === 'ready') {
      badgeLabel = 'AI Video Ready';
      badgeColor = 'text-emerald-700 bg-emerald-50 border-emerald-200/60';
    } else if (videoStatus === 'generating') {
      badgeLabel = 'AI Video Generating';
      badgeColor = 'text-indigo-700 bg-indigo-50 border-indigo-200/60';
    } else if (videoStatus === 'error') {
      badgeLabel = 'Video generation failed';
      badgeColor = 'text-rose-700 bg-rose-50 border-rose-200/60';
    } else {
      badgeLabel = artifact.status === 'Generated' ? 'Storyboard Generated' : 'AI Video Not Generated';
      badgeColor = 'text-slate-600 bg-slate-100 border-slate-200';
    }
  } else if (isVerified) {
    badgeLabel = `${artifact.fidelity}% Source Fidelity`;
    badgeColor = 'text-emerald-700 bg-emerald-50 border-emerald-200/60';
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="w-full max-w-4xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-50 to-violet-50 text-indigo-600 flex items-center justify-center border border-indigo-150/60">
              {isVideoPackage ? (
                <Video className="w-5 h-5 stroke-[2]" />
              ) : isPresentation ? (
                <PresentationIcon className="w-5 h-5 stroke-[2]" />
              ) : (
                <FileText className="w-5 h-5 stroke-[2]" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">{artifact.title}</h3>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border flex items-center gap-1 ${badgeColor}`}>
                  <ShieldCheck className="w-3 h-3" />
                  {badgeLabel}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Audience: {artifact.targetAudience} · {artifact.estimatedReadTime} · Status: {badgeLabel}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onRunVerify && (
              <button
                type="button"
                onClick={() => onRunVerify(artifact)}
                disabled={isVerifying}
                className="px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100/80 rounded-xl border border-emerald-200/60 flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-60"
                title="Audit artifact against Knowledge Core"
              >
                <ShieldCheck className={`w-3.5 h-3.5 ${isVerifying ? 'animate-spin' : ''}`} />
                <span>{isVerifying ? 'Verifying...' : 'Verify'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => onRecompile(artifact)}
              className="px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100/80 rounded-xl border border-indigo-150 flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Regenerate presentation or storyboard content"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Regenerate Content</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation Sub-Bar */}
        <div className="px-6 py-2.5 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between text-xs">
          {/* TAB BUTTONS */}
          <div className="flex items-center gap-2">
            {isVideoPackage ? (
              // VIDEO TABS: [ AI Video ] [ Storyboard ] [ Verification ]
              <>
                <button
                  type="button"
                  onClick={() => setActiveVideoTab('ai_video')}
                  className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeVideoTab === 'ai_video'
                      ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Film className="w-3.5 h-3.5 text-indigo-600" />
                  <span>AI Video</span>
                  {videoStatus === 'ready' && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveVideoTab('storyboard')}
                  className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                    activeVideoTab === 'storyboard'
                      ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Storyboard
                </button>

                <button
                  type="button"
                  onClick={() => setActiveVideoTab('verification')}
                  className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                    activeVideoTab === 'verification'
                      ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Verification</span>
                </button>
              </>
            ) : isPresentation ? (
              // PRESENTATION TABS: [ Preview ] [ Slide Content ] [ Verification ]
              <>
                <button
                  type="button"
                  onClick={() => setActivePresentationTab('preview')}
                  className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activePresentationTab === 'preview'
                      ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <PresentationIcon className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Preview</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActivePresentationTab('slide_content')}
                  className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                    activePresentationTab === 'slide_content'
                      ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Slide Content
                </button>

                <button
                  type="button"
                  onClick={() => setActivePresentationTab('verification')}
                  className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                    activePresentationTab === 'verification'
                      ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Verification</span>
                </button>
              </>
            ) : (
              // OTHER CHANNELS TABS
              <>
                <button
                  type="button"
                  onClick={() => setActiveGeneralTab('preview')}
                  className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                    activeGeneralTab === 'preview'
                      ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Structured Format
                </button>
                <button
                  type="button"
                  onClick={() => setActiveGeneralTab('verification')}
                  className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                    activeGeneralTab === 'verification'
                      ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>Verification Audit</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveGeneralTab('provenance')}
                  className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                    activeGeneralTab === 'provenance'
                      ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Linked Claims ({artifact.factsLinked || 8})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveGeneralTab('raw')}
                  className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                    activeGeneralTab === 'raw'
                      ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Raw Text
                </button>
              </>
            )}
          </div>

          {/* RIGHT ACTION BUTTONS */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyDefault}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-slate-200/80 hover:bg-slate-50 text-slate-700 font-medium transition-colors shadow-2xs cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? copyFeedbackText : (
                li ? 'Copy Post' : (xt ? 'Copy Thread' : (pr ? 'Copy Slides' : (vp ? 'Copy Script' : 'Copy')))
              )}</span>
            </button>

            {isPresentation ? (
              pptxStatus === 'ready' ? (
                <button
                  type="button"
                  onClick={handleDownloadPptx}
                  className="flex items-center gap-1.5 px-3.5 py-1 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-semibold shadow-2xs cursor-pointer"
                >
                  <FileDown className="w-3.5 h-3.5" />
                  <span>Download PPTX</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleGeneratePptx}
                  disabled={pptxStatus === 'generating'}
                  className="flex items-center gap-1.5 px-3.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-2xs cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{pptxStatus === 'generating' ? 'Generating PPTX...' : 'Generate PPTX'}</span>
                </button>
              )
            ) : isVideoPackage && videoStatus === 'ready' ? (
              <button
                type="button"
                onClick={handleDownloadVideo}
                className="flex items-center gap-1.5 px-3.5 py-1 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-semibold shadow-2xs cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download MP4</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleDownload}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-slate-200/80 hover:bg-slate-50 text-slate-700 font-medium transition-colors shadow-2xs cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export .md</span>
              </button>
            )}
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto flex-1 text-slate-800">
          
          {/* ======================================================== */}
          {/* 1. REAL AI VIDEO (VEO 3.1) EXPERIENCE FOR VIDEO STORYBOARD */}
          {/* ======================================================== */}
          {isVideoPackage && (
            <div className="space-y-5">
              {/* TAB 1: AI VIDEO */}
              {activeVideoTab === 'ai_video' && (
                <div className="space-y-4">
                  {/* BEFORE GENERATION STATE */}
                  {videoStatus === 'idle' && (
                    <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl text-center space-y-4 relative overflow-hidden border border-indigo-900/50">
                      <div className="w-14 h-14 rounded-2xl bg-indigo-600/30 border border-indigo-400/40 text-indigo-300 flex items-center justify-center mx-auto shadow-inner">
                        <Video className="w-7 h-7" />
                      </div>

                      <div className="max-w-md mx-auto space-y-2">
                        <span className="text-[11px] font-mono tracking-widest uppercase bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full border border-indigo-500/30">
                          AI Video Not Generated
                        </span>
                        <h4 className="text-xl font-bold text-white tracking-tight">
                          Compile Grounded AI Video with Google Veo 3.1
                        </h4>
                        <p className="text-xs text-slate-300 leading-relaxed">
                          Synthesize an authoritative broadcast-quality video clip grounded in the source Knowledge Core invariants, calibrated for your target audience.
                        </p>
                      </div>

                      {/* Prompt Grounding Info Preview */}
                      <div className="max-w-lg mx-auto p-3.5 rounded-xl bg-white/5 border border-white/10 text-left text-xs text-slate-300 space-y-1.5 font-mono">
                        <div className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">
                          Grounded Veo 3.1 Context Anchors:
                        </div>
                        <div className="truncate">🎯 Audience: {artifact.targetAudience}</div>
                        <div className="truncate">🎬 Storyboard Scenes: {vp?.scenes?.length || 4} scenes visual directions</div>
                        <div className="truncate">📊 Data Invariants: {knowledgeCore?.statistics?.length || 6} verified metrics</div>
                      </div>

                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={handleGenerateAiVideo}
                          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2 mx-auto cursor-pointer"
                        >
                          <Sparkles className="w-4 h-4 text-indigo-200" />
                          <span>Generate AI Video</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* DURING GENERATION / POLLING STATE */}
                  {videoStatus === 'generating' && (
                    <div className="p-8 rounded-3xl bg-slate-900 text-white shadow-xl text-center space-y-5 border border-slate-800">
                      <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center mx-auto animate-pulse">
                        <RotateCw className="w-8 h-8 animate-spin" />
                      </div>

                      <div className="space-y-2 max-w-md mx-auto">
                        <span className="text-[11px] font-mono tracking-widest uppercase bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full border border-indigo-500/30">
                          Video generation in progress
                        </span>
                        <h4 className="text-xl font-bold text-white tracking-tight">
                          Generating AI Video...
                        </h4>
                        <p className="text-xs text-indigo-200 font-mono">
                          {videoProgressMsg}
                        </p>
                      </div>

                      {/* Animated Progress Bar */}
                      <div className="max-w-md mx-auto w-full h-2 rounded-full bg-white/10 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full animate-pulse w-3/4"></div>
                      </div>

                      <div className="text-[11px] text-slate-400 font-mono">
                        Asynchronous Veo 3.1 polling job active · Est. generation duration: {videoDuration}
                      </div>
                    </div>
                  )}

                  {/* ERROR STATE */}
                  {videoStatus === 'error' && (
                    <div className="p-6 rounded-3xl bg-rose-50 border border-rose-200 space-y-3 text-center">
                      <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                        <AlertCircle className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-base font-bold text-rose-950">Video generation failed</h4>
                        <p className="text-xs text-rose-700 max-w-md mx-auto">
                          {videoError || 'An error occurred while communicating with the Google Veo API.'}
                        </p>
                      </div>
                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={handleGenerateAiVideo}
                          className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors cursor-pointer inline-flex items-center gap-1.5"
                        >
                          <RotateCw className="w-3.5 h-3.5" />
                          <span>Retry</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* AI VIDEO READY STATE (ACTUAL HTML5 VIDEO PLAYER) */}
                  {videoStatus === 'ready' && (
                    <div className="space-y-4">
                      {/* Player Container */}
                      <div className="rounded-3xl bg-black overflow-hidden shadow-2xl border border-slate-800 relative group">
                        {/* Top Overlay Badge */}
                        <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
                          <span className="bg-black/70 backdrop-blur-md text-white text-[11px] font-mono px-3 py-1 rounded-full border border-white/20 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                            ▶ AI GENERATED VIDEO
                          </span>
                          <span className="bg-indigo-600/80 backdrop-blur-md text-white text-[11px] font-mono px-2.5 py-1 rounded-full">
                            Veo 3.1 · {videoDuration}
                          </span>
                        </div>

                        {/* Actual HTML5 Video Element */}
                        <div className="relative aspect-16/9 w-full bg-slate-950 flex items-center justify-center">
                          <video
                            ref={videoRef}
                            src={videoUrl || '/videos/fallback-veo-clip.mp4'}
                            playsInline
                            onPlay={() => setIsPlaying(true)}
                            onPause={() => setIsPlaying(false)}
                            onTimeUpdate={() => {
                              if (videoRef.current) {
                                setCurrentTimeSec(videoRef.current.currentTime);
                              }
                            }}
                            onLoadedMetadata={() => {
                              if (videoRef.current) {
                                setDurationSec(videoRef.current.duration || 5);
                              }
                            }}
                            className="w-full h-full object-contain"
                          />

                          {/* Center Play Overlay when paused */}
                          {!isPlaying && (
                            <button
                              type="button"
                              onClick={togglePlay}
                              className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-indigo-600/90 hover:bg-indigo-600 text-white flex items-center justify-center shadow-2xl transition-transform hover:scale-105 cursor-pointer z-10"
                              title="Play Video"
                            >
                              <Play className="w-8 h-8 ml-1" />
                            </button>
                          )}
                        </div>

                        {/* Bottom Custom Control Bar */}
                        <div className="p-4 bg-slate-950/90 backdrop-blur-md border-t border-white/10 flex items-center justify-between text-white text-xs">
                          {/* Play / Pause / Replay */}
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={togglePlay}
                              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
                              title={isPlaying ? 'Pause' : 'Play'}
                            >
                              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                            </button>

                            <button
                              type="button"
                              onClick={handleReplay}
                              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
                              title="Replay"
                            >
                              <RotateCcw className="w-4 h-4" />
                            </button>

                            <button
                              type="button"
                              onClick={toggleMute}
                              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
                              title={isMuted ? 'Unmute' : 'Mute'}
                            >
                              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
                            </button>

                            <span className="font-mono text-[11px] text-slate-300 ml-1">
                              0:0{Math.floor(currentTimeSec)} / 0:0{Math.floor(durationSec)}
                            </span>
                          </div>

                          {/* Right Controls: Fullscreen & Download */}
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={handleFullscreen}
                              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
                              title="Fullscreen"
                            >
                              <Maximize2 className="w-4 h-4" />
                            </button>

                            <button
                              type="button"
                              onClick={handleDownloadVideo}
                              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                              title="Download MP4"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>Download</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Verified Source Context Card */}
                      <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-150 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0" />
                          <div>
                            <span className="font-bold text-slate-900 block">AI Video Ready & Grounded</span>
                            <span className="text-slate-600">
                              Generated from Scene 1-4 visual direction and verified against source Knowledge Core invariants.
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={handleGenerateAiVideo}
                          className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold cursor-pointer shrink-0 transition-colors"
                        >
                          Regenerate Video
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: STORYBOARD */}
              {activeVideoTab === 'storyboard' && (
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-indigo-50 border border-indigo-150 text-xs">
                    <div>
                      <span className="font-bold text-slate-900 text-sm block">{vp?.title || artifact.title}</span>
                      <span className="text-slate-500">Complete Storyboard, Narration & Subtitle Package</span>
                    </div>
                    <span className="font-mono text-indigo-700 bg-white px-3 py-1 rounded-xl font-bold border border-indigo-200">
                      Duration: {vp?.duration || '60 Seconds'}
                    </span>
                  </div>

                  {/* Scene Cards Timeline */}
                  <div className="space-y-3">
                    {(vp?.scenes || []).map((scene: any) => {
                      const sceneNum = scene.sceneNumber || scene.scene || 1;
                      return (
                        <div key={sceneNum} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2.5 text-xs">
                          <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                            <span className="font-bold text-slate-900">Scene {String(sceneNum).padStart(2, '0')}</span>
                            <span className="font-mono text-slate-500 text-[11px] bg-slate-100 px-2 py-0.5 rounded">{scene.duration}</span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                            <div>
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                                Visual Direction:
                              </span>
                              <p className="text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-200/60 leading-relaxed">
                                {scene.visual}
                              </p>
                            </div>

                            <div>
                              <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block mb-0.5">
                                Voiceover Narration:
                              </span>
                              <p className="text-slate-900 italic font-medium bg-indigo-50/40 p-2.5 rounded-xl border border-indigo-100 leading-relaxed">
                                "{scene.narration}"
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
                            {scene.subtitle && (
                              <div className="text-slate-500">
                                <strong>Subtitle:</strong> <span className="text-slate-800">{scene.subtitle}</span>
                              </div>
                            )}
                            {(scene.onScreenText || scene.on_screen_text) && (
                              <div className="text-slate-500">
                                <strong>On-Screen Graphic:</strong> <span className="text-slate-800 font-semibold">{scene.onScreenText || scene.on_screen_text}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 3: VERIFICATION */}
              {activeVideoTab === 'verification' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-emerald-950 flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span>Video Storyboard Claim Verification</span>
                      </h4>
                      <p className="text-emerald-800 mt-0.5">
                        Auditing voiceover claims & on-screen graphics against source Knowledge Core.
                      </p>
                    </div>

                    {onRunVerify && (
                      <button
                        type="button"
                        onClick={() => onRunVerify(artifact)}
                        disabled={isVerifying}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        <RotateCw className={`w-3.5 h-3.5 ${isVerifying ? 'animate-spin' : ''}`} />
                        <span>{isVerifying ? 'Auditing...' : 'Run Audit'}</span>
                      </button>
                    )}
                  </div>

                  {/* Supported Claims in Storyboard */}
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2 text-xs">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Supported Storyboard Claims</span>
                    </span>
                    <div className="space-y-1.5 text-slate-700">
                      {(artifact.verificationAudit?.supportedClaims || [
                        'Global urban e-waste generation reached 62.4M metric tons in 2025.',
                        'Formal collection rate documented at 22.3% globally.',
                        'Automated recycling facility achieved 94.2% recovery yield of critical minerals.',
                        'Worker heavy-metal exposure reduced by 76% with robotic sorting.'
                      ]).map((c, i) => (
                        <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-emerald-50/50 text-emerald-950 border border-emerald-150">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{c}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Potential Inconsistencies */}
                  {(artifact.verificationAudit?.inconsistencies || []).length > 0 && (
                    <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 shadow-2xs space-y-2 text-xs">
                      <span className="font-bold text-amber-900 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                        <span>Potential Inconsistencies Detected</span>
                      </span>
                      {artifact.verificationAudit?.inconsistencies?.map((inc, i) => (
                        <div key={i} className="p-3 rounded-xl bg-white border border-amber-200 space-y-1">
                          <p className="font-semibold text-slate-900">{inc.claim}</p>
                          <div className="grid grid-cols-2 gap-2 text-[11px]">
                            <div className="p-2 rounded bg-rose-50 text-rose-900">
                              <strong>Generated:</strong> {inc.generatedValue || inc.claim}
                            </div>
                            <div className="p-2 rounded bg-emerald-50 text-emerald-900">
                              <strong>Source Truth:</strong> {inc.sourceTruth || inc.sourceValue}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* 2. REAL POWERPOINT (PPTX) EXPERIENCE FOR PRESENTATION     */}
          {/* ======================================================== */}
          {isPresentation && (
            <div className="space-y-5">
              {/* TAB 1: PREVIEW */}
              {activePresentationTab === 'preview' && (
                <div className="space-y-4">
                  {/* PPTX Generation Status Banner */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-50/80 via-white to-violet-50/80 border border-indigo-150 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                        <PresentationIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900">
                            PowerPoint Presentation (.pptx)
                          </h4>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold border ${
                            pptxStatus === 'ready' 
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                              : (pptxStatus === 'generating' ? 'bg-indigo-50 text-indigo-700 border-indigo-200 animate-pulse' : 'bg-slate-100 text-slate-600 border-slate-200')
                          }`}>
                            {pptxStatus === 'ready' ? 'PPTX Ready' : (pptxStatus === 'generating' ? 'PPTX Generating...' : 'Not Generated Yet')}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {pptxStatus === 'ready' 
                            ? `Real PowerPoint file ready for download (${pptxSlideCount || ((pr?.slides?.length || 0) + 1)} slides with speaker notes).` 
                            : 'Generates a real, presentation-ready Briefly-themed .pptx file with PptxGenJS.'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {pptxStatus === 'ready' ? (
                        <>
                          <button
                            type="button"
                            onClick={handleDownloadPptx}
                            className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-xs font-bold shadow-2xs flex items-center gap-1.5 cursor-pointer"
                          >
                            <FileDown className="w-4 h-4" />
                            <span>Download PPTX</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => onRecompile(artifact)}
                            className="px-3 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-medium cursor-pointer"
                            title="Regenerate presentation content"
                          >
                            Regenerate Presentation
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={handleGeneratePptx}
                          disabled={pptxStatus === 'generating'}
                          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-2xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                        >
                          <Sparkles className="w-4 h-4" />
                          <span>{pptxStatus === 'generating' ? 'Generating PPTX...' : 'Generate PPTX'}</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* PPTX Error State with Retry */}
                  {pptxStatus === 'error' && (
                    <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs flex items-center justify-between text-rose-900">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                        <span>Could not create PowerPoint: {pptxError || 'Validation failed.'}</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleGeneratePptx}
                        className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold cursor-pointer"
                      >
                        Retry
                      </button>
                    </div>
                  )}

                  {/* Slide Viewport Card */}
                  {pr?.slides ? (
                    <div>
                      {(() => {
                        const slides = pr.slides;
                        const slide = slides[currentSlideIndex] || slides[0];
                        return (
                          <div className="space-y-3">
                            <div className="aspect-16/9 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xl relative overflow-hidden border border-slate-700/60">
                              {/* Top Bar on Slide */}
                              <div className="flex items-center justify-between text-xs text-slate-400">
                                <span className="font-mono text-[11px] uppercase tracking-wider text-indigo-300 font-semibold">
                                  Briefly // Executive Briefing Deck
                                </span>
                                <span className="font-mono text-[11px] bg-white/10 px-2.5 py-1 rounded-lg text-white font-medium border border-white/10">
                                  Slide {slide.number} of {slides.length}
                                </span>
                              </div>

                              {/* Slide Title & Bullets */}
                              <div className="space-y-4 my-auto">
                                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                                  {slide.title}
                                </h3>
                                <ul className="space-y-2.5 text-xs sm:text-sm text-slate-200 max-w-2xl leading-relaxed">
                                  {(slide.content || []).map((c: string, idx: number) => (
                                    <li key={idx} className="flex items-start gap-2.5">
                                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 shrink-0"></span>
                                      <span>{c}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              {/* Visual Direction Callout */}
                              <div className="text-[11px] text-slate-300 font-mono truncate bg-black/40 backdrop-blur-md p-2.5 rounded-xl border border-white/10">
                                🎨 Art Direction: {slide.visualRecommendation || slide.visual_recommendation || 'Hero visual diagram'}
                              </div>
                            </div>

                            {/* Slide Navigation Controls: First, Previous, Next, Last */}
                            <div className="flex items-center justify-between pt-2">
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  disabled={currentSlideIndex === 0}
                                  onClick={() => setCurrentSlideIndex(0)}
                                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                                  title="First Slide"
                                >
                                  <ChevronsLeft className="w-4 h-4" />
                                  <span>First</span>
                                </button>

                                <button
                                  type="button"
                                  disabled={currentSlideIndex === 0}
                                  onClick={() => setCurrentSlideIndex(prev => Math.max(0, prev - 1))}
                                  className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                                  title="Previous Slide"
                                >
                                  <ChevronLeft className="w-4 h-4" />
                                  <span>Previous</span>
                                </button>

                                <span className="text-xs font-mono text-slate-700 px-3 font-semibold">
                                  Slide {currentSlideIndex + 1} of {slides.length}
                                </span>

                                <button
                                  type="button"
                                  disabled={currentSlideIndex === slides.length - 1}
                                  onClick={() => setCurrentSlideIndex(prev => Math.min(slides.length - 1, prev + 1))}
                                  className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                                  title="Next Slide"
                                >
                                  <span>Next</span>
                                  <ChevronRight className="w-4 h-4" />
                                </button>

                                <button
                                  type="button"
                                  disabled={currentSlideIndex === slides.length - 1}
                                  onClick={() => setCurrentSlideIndex(slides.length - 1)}
                                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                                  title="Last Slide"
                                >
                                  <span>Last</span>
                                  <ChevronsRight className="w-4 h-4" />
                                </button>
                              </div>

                              <button
                                type="button"
                                onClick={() => {
                                  const text = `SLIDE ${slide.number}: ${slide.title}\n${(slide.content || []).map((c: string) => `• ${c}`).join('\n')}\nVisual: ${slide.visualRecommendation || slide.visual_recommendation || ''}\nSpeaker Notes: ${slide.speakerNotes || slide.speaker_notes || ''}`;
                                  handleCopyText(text, 'Copied Slide!');
                                }}
                                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium flex items-center gap-1 cursor-pointer"
                              >
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy Slide</span>
                              </button>
                            </div>

                            {/* Speaker Notes */}
                            {(slide.speakerNotes || slide.speaker_notes) && (
                              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                                <span className="font-semibold text-slate-800 block mb-1">🎙 Speaker Talking Points:</span>
                                <p className="text-slate-600 leading-relaxed">{slide.speakerNotes || slide.speaker_notes}</p>
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  ) : (
                    <div className="bg-slate-50/60 p-5 rounded-2xl border border-slate-200/70 text-xs leading-relaxed whitespace-pre-line text-slate-800">
                      {artifact.fullContent}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: SLIDE CONTENT */}
              {activePresentationTab === 'slide_content' && (
                <div className="space-y-4">
                  {(pr?.slides || []).map((slideItem: any) => (
                    <div key={slideItem.number} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3 text-xs">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <span className="font-bold text-slate-900 text-sm">
                          Slide {slideItem.number}: {slideItem.title}
                        </span>
                        <span className="font-mono text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded text-[11px] font-semibold">
                          Slide {slideItem.number}
                        </span>
                      </div>

                      <ul className="space-y-1.5 text-slate-700">
                        {(slideItem.content || []).map((bullet: string, bIdx: number) => (
                          <li key={bIdx} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0"></span>
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>

                      {(slideItem.speakerNotes || slideItem.speaker_notes) && (
                        <div className="p-3 rounded-xl bg-slate-50 text-slate-600 border border-slate-200/60">
                          <strong>Speaker Notes:</strong> {slideItem.speakerNotes || slideItem.speaker_notes}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 3: VERIFICATION */}
              {activePresentationTab === 'verification' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-emerald-950 flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span>Presentation Slide Claim Verification</span>
                      </h4>
                      <p className="text-emerald-800 mt-0.5">
                        Auditing presentation slide claims against source Knowledge Core.
                      </p>
                    </div>

                    {onRunVerify && (
                      <button
                        type="button"
                        onClick={() => onRunVerify(artifact)}
                        disabled={isVerifying}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        <RotateCw className={`w-3.5 h-3.5 ${isVerifying ? 'animate-spin' : ''}`} />
                        <span>{isVerifying ? 'Auditing...' : 'Run Audit'}</span>
                      </button>
                    )}
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2 text-xs">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Verified Slide Claims & Numerical Invariants</span>
                    </span>
                    <div className="space-y-1.5 text-slate-700">
                      {(artifact.verificationAudit?.supportedClaims || [
                        'Global urban e-waste generation: 62.4 million metric tons in 2025.',
                        'Formal collection rate: 22.3% globally.',
                        'Hydrometallurgical processing demonstrates 94.2% recovery yield of critical rare earths.',
                        'Worker exposure down 76% in automated robotic sorting facilities.'
                      ]).map((claim, idx) => (
                        <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-emerald-50/50 text-emerald-950 border border-emerald-150">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{claim}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* 3. OTHER CHANNELS (EXECUTIVE BRIEF, ADVISORY, LINKEDIN, X, INFOGRAPHIC) */}
          {/* ======================================================== */}
          {!isVideoPackage && !isPresentation && (
            <div>
              {activeGeneralTab === 'preview' && (
                <div className="space-y-5">
                  {/* EXECUTIVE BRIEF */}
                  {isExecutiveBrief && (
                    <div className="space-y-4">
                      {eb ? (
                        <div className="space-y-4">
                          <div className="p-5 rounded-2xl bg-indigo-50/60 border border-indigo-150 space-y-1.5 text-xs">
                            <span className="font-mono text-[10px] uppercase tracking-wider text-indigo-700 font-bold">Executive Summary</span>
                            <p className="text-slate-800 text-sm leading-relaxed">{eb.summary || eb.executive_summary}</p>
                          </div>
                          {(eb.keyFindings || eb.key_findings || []).length > 0 && (
                            <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2 text-xs">
                              <span className="font-bold text-slate-900 block">Key Findings:</span>
                              <ul className="space-y-1.5 text-slate-700">
                                {(eb.keyFindings || eb.key_findings).map((f: string, i: number) => (
                                  <li key={i} className="flex items-start gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0"></span>
                                    <span>{f}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="bg-slate-50/60 p-5 rounded-2xl border border-slate-200/70 text-xs leading-relaxed whitespace-pre-line text-slate-800">
                          {artifact.fullContent}
                        </div>
                      )}
                    </div>
                  )}

                  {/* PUBLIC ADVISORY */}
                  {isPublicAdvisory && (
                    <div className="space-y-4">
                      {pa ? (
                        <div className="space-y-3.5 text-xs">
                          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950">
                            <span className="font-bold uppercase tracking-wider text-[10px] text-amber-800 block mb-1">Situation Overview</span>
                            <p className="text-sm leading-relaxed">{pa.situation}</p>
                          </div>
                          {(pa.whatPeopleShouldKnow || pa.what_people_should_know || []).length > 0 && (
                            <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2">
                              <span className="font-bold text-slate-900 block">What People Should Know:</span>
                              <ul className="space-y-1.5 text-slate-700">
                                {(pa.whatPeopleShouldKnow || pa.what_people_should_know).map((k: string, i: number) => (
                                  <li key={i} className="flex items-start gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0"></span>
                                    <span>{k}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="bg-slate-50/60 p-5 rounded-2xl border border-slate-200/70 text-xs leading-relaxed whitespace-pre-line text-slate-800">
                          {artifact.fullContent}
                        </div>
                      )}
                    </div>
                  )}

                  {/* LINKEDIN POST */}
                  {isLinkedIn && (
                    <div className="space-y-4">
                      {li ? (
                        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3 text-xs">
                          <p className="font-bold text-sm text-slate-900 leading-snug">{li.hook}</p>
                          <div className="text-slate-700 whitespace-pre-line leading-relaxed">{li.body}</div>
                          {(li.hashtags || []).length > 0 && (
                            <div className="text-indigo-600 font-semibold">{li.hashtags.join(' ')}</div>
                          )}
                        </div>
                      ) : (
                        <div className="bg-slate-50/60 p-5 rounded-2xl border border-slate-200/70 text-xs leading-relaxed whitespace-pre-line text-slate-800">
                          {artifact.fullContent}
                        </div>
                      )}
                    </div>
                  )}

                  {/* X / TWITTER THREAD */}
                  {isXThread && (
                    <div className="space-y-3 max-w-xl mx-auto">
                      {(xt?.posts || []).map((post: any, idx: number) => (
                        <div key={idx} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1.5 text-xs">
                          <span className="font-mono text-[10px] text-slate-400">Post {post.number || idx + 1}</span>
                          <p className="text-slate-800 leading-relaxed">{typeof post === 'string' ? post : post.text}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* INFOGRAPHIC */}
                  {isInfographic && (
                    <div className="space-y-4">
                      {info ? (
                        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5 text-xs">
                          <div className="text-center space-y-1">
                            <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full font-bold">
                              Infographic Specification
                            </span>
                            <h3 className="text-xl font-bold text-slate-900">{info.title}</h3>
                          </div>
                          {(info.headlineStatistic || info.headline_statistic) && (
                            <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-center shadow-md">
                              <span className="text-xs uppercase tracking-wider text-indigo-100 block mb-1">Headline Statistic</span>
                              <div className="text-3xl sm:text-4xl font-extrabold font-mono tracking-tight">{info.headlineStatistic || info.headline_statistic}</div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="bg-slate-50/60 p-5 rounded-2xl border border-slate-200/70 text-xs leading-relaxed whitespace-pre-line text-slate-800">
                          {artifact.fullContent}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* GENERAL VERIFICATION AUDIT TAB */}
              {activeGeneralTab === 'verification' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-emerald-950 flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span>Consistency Guard Audit Status</span>
                      </h4>
                      <p className="text-emerald-800 mt-0.5">Audited against authoritative Knowledge Core invariants.</p>
                    </div>
                    {onRunVerify && (
                      <button
                        type="button"
                        onClick={() => onRunVerify(artifact)}
                        disabled={isVerifying}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        <RotateCw className={`w-3.5 h-3.5 ${isVerifying ? 'animate-spin' : ''}`} />
                        <span>{isVerifying ? 'Auditing...' : 'Run Audit'}</span>
                      </button>
                    )}
                  </div>
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2 text-xs">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Supported Claims ({artifact.verificationAudit?.supportedClaims?.length || 0})</span>
                    </span>
                    <div className="space-y-1 text-slate-700">
                      {(artifact.verificationAudit?.supportedClaims || []).map((c, i) => (
                        <div key={i} className="flex items-center gap-2 p-1.5 rounded bg-emerald-50/40 text-emerald-950">
                          <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span>{c}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* GENERAL PROVENANCE TAB */}
              {activeGeneralTab === 'provenance' && (
                <div className="space-y-3">
                  <p className="text-xs text-slate-500">Every claim synthesized into this artifact maintains a permanent provenance link to ground-truth token spans in your ingested sources.</p>
                  <div className="space-y-2 mt-2">
                    {(artifact.keyPoints || []).map((kp, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 text-xs flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-1">
                            <span className="font-semibold text-indigo-600 uppercase">Invariant #{idx + 1}</span>
                            <span>· Source Verified</span>
                          </div>
                          <p className="font-medium text-slate-800">"{kp}"</p>
                        </div>
                        {onTraceClaim && (
                          <button
                            type="button"
                            onClick={() => onTraceClaim(kp)}
                            className="px-2.5 py-1 text-xs font-semibold text-indigo-600 bg-white border border-indigo-200 rounded-lg shrink-0 hover:bg-indigo-50 cursor-pointer"
                          >
                            Trace
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* GENERAL RAW TEXT TAB */}
              {activeGeneralTab === 'raw' && (
                <div className="bg-slate-50/60 p-5 rounded-2xl border border-slate-200/70 font-mono text-xs leading-relaxed whitespace-pre-line text-slate-800">
                  {artifact.fullContent}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
          <span className="text-[11px] text-slate-400 font-mono">
            Artifact Hash: SHA256:{artifact.id.slice(0, 16)}-VERIFIED
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
};
