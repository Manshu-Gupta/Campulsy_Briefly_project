import React, { useState } from 'react';
import { 
  FileText, 
  Share2, 
  MessageSquare, 
  ShieldAlert, 
  Presentation, 
  PieChart, 
  Video, 
  ArrowUpRight, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  RotateCw,
  SlidersHorizontal,
  CheckSquare,
  Square,
  Globe,
  Radio,
  Users,
  AlertCircle,
  AlertTriangle,
  ShieldCheck,
  Check,
  Play,
  FileDown
} from 'lucide-react';
import { ArtifactItem, ArtifactType, TransformConfig } from '../types/dashboard';

interface TransformationSectionProps {
  artifacts: ArtifactItem[];
  isGeneratingAll?: boolean;
  generationStage?: string | null;
  generationError?: string | null;
  onClearError?: () => void;
  onOpenArtifact: (artifact: ArtifactItem) => void;
  onGenerateArtifact: (artifact: ArtifactItem, config: TransformConfig) => void;
  onGenerateBatch: (selectedTypes: string[], config: TransformConfig) => void;
  onVerifyArtifact?: (artifact: ArtifactItem) => void;
  onGenerateVideo?: (artifact: ArtifactItem) => void;
  onGeneratePptx?: (artifact: ArtifactItem) => void;
}

export const TransformationSection: React.FC<TransformationSectionProps> = ({
  artifacts,
  isGeneratingAll,
  generationStage,
  generationError,
  onClearError,
  onOpenArtifact,
  onGenerateArtifact,
  onGenerateBatch,
  onVerifyArtifact,
  onGenerateVideo,
  onGeneratePptx,
}) => {
  const [filter, setFilter] = useState<'all' | 'verified' | 'ready' | 'draft'>('all');
  const [showConfig, setShowConfig] = useState(true);

  // Configuration state
  const [audience, setAudience] = useState<TransformConfig['audience']>('Executive');
  const [customAudience, setCustomAudience] = useState('');
  const [tone, setTone] = useState<TransformConfig['tone']>('Professional');
  const [objective, setObjective] = useState<TransformConfig['objective']>('Inform');
  const [detail, setDetail] = useState<TransformConfig['detail']>('Balanced');
  const [language, setLanguage] = useState<TransformConfig['language']>('English');

  // Selected outputs for batch kit generation (all 7 canonical outputs)
  const allOutputTitles = [
    'Executive Brief',
    'Public Advisory',
    'LinkedIn Post',
    'X/Twitter Thread',
    'Presentation',
    'Infographic',
    'Video Storyboard'
  ];

  const [selectedOutputs, setSelectedOutputs] = useState<string[]>([
    'Executive Brief',
    'Public Advisory',
    'LinkedIn Post',
    'Presentation'
  ]);

  // Robust title-matching helper to normalize aliases (e.g. "Advisory", "Video Package", "X Thread")
  const isArtifactSelected = (artTitle: string, selected: string[]): boolean => {
    return selected.some(sel => {
      if (sel === artTitle) return true;
      const s1 = sel.toLowerCase().replace(/[\s\-_/]/g, '');
      const s2 = artTitle.toLowerCase().replace(/[\s\-_/]/g, '');
      if (s1 === s2) return true;
      if ((s1.includes('advisory') || s1.includes('public')) && (s2.includes('advisory') || s2.includes('public'))) return true;
      if ((s1.includes('thread') || s1.includes('twitter') || s1 === 'x') && (s2.includes('thread') || s2.includes('twitter') || s2 === 'x')) return true;
      if ((s1.includes('video') || s1.includes('storyboard') || s1.includes('package')) && (s2.includes('video') || s2.includes('storyboard') || s2.includes('package'))) return true;
      if (s1.includes('executive') && s2.includes('executive')) return true;
      if (s1.includes('linkedin') && s2.includes('linkedin')) return true;
      if (s1.includes('presentation') && s2.includes('presentation')) return true;
      if (s1.includes('infographic') && s2.includes('infographic')) return true;
      return false;
    });
  };

  const toggleSelectOutput = (type: string) => {
    // Find canonical name or toggle directly
    const matchedCanonical = allOutputTitles.find(t => isArtifactSelected(t, [type])) || type;
    setSelectedOutputs(prev => {
      const alreadySelected = prev.some(p => isArtifactSelected(p, [matchedCanonical]));
      if (alreadySelected) {
        return prev.filter(p => !isArtifactSelected(p, [matchedCanonical]));
      } else {
        return [...prev, matchedCanonical];
      }
    });
  };

  const areAllSelected = allOutputTitles.every(t => isArtifactSelected(t, selectedOutputs));

  const toggleSelectAll = () => {
    if (areAllSelected) {
      setSelectedOutputs([]);
    } else {
      setSelectedOutputs(allOutputTitles);
    }
  };

  const getIconForType = (type: ArtifactType) => {
    switch (type) {
      case 'Executive Brief':
        return FileText;
      case 'Public Advisory':
      case 'Advisory':
        return ShieldAlert;
      case 'LinkedIn Post':
        return Share2;
      case 'X/Twitter Thread':
      case 'X Thread':
        return MessageSquare;
      case 'Presentation':
        return Presentation;
      case 'Infographic':
        return PieChart;
      case 'Video Package':
      case 'Video Storyboard':
        return Video;
      default:
        return FileText;
    }
  };

  const currentConfig: TransformConfig = {
    audience,
    customAudience: audience === 'Custom' ? customAudience : undefined,
    tone,
    objective,
    detail,
    language
  };

  const filteredArtifacts = artifacts.filter(art => {
    if (filter === 'all') return true;
    if (filter === 'verified') return art.status === 'Verified';
    if (filter === 'ready') return art.status === 'Ready';
    if (filter === 'draft') return art.status === 'Draft' || art.status === 'Generated';
    return true;
  });

  return (
    <div className="space-y-5">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold tracking-tight text-slate-900">
              Transformation Pipelines
            </h3>
            <span className="text-[11px] font-medium text-slate-400">
              ({artifacts.length} compiled channels)
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Compile single source truth into audience-calibrated communication artifacts with zero drift.
          </p>
        </div>

        {/* Filter buttons & Config toggle */}
        <div className="flex items-center gap-2 flex-wrap">
          {!showConfig && (
            <button
              onClick={() => onGenerateBatch(selectedOutputs, currentConfig)}
              disabled={selectedOutputs.length === 0 || isGeneratingAll}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-xs font-bold shadow-[0_2px_8px_rgba(79,70,229,0.25)] flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap disabled:opacity-60"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isGeneratingAll ? (generationStage || 'Compiling Kit...') : 'Generate Communication Kit'}</span>
            </button>
          )}

          <button
            onClick={() => setShowConfig(!showConfig)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
              showConfig 
                ? 'bg-indigo-50 border-indigo-200 text-indigo-700' 
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Audience & Tone Config</span>
          </button>

          <div className="flex items-center gap-1 p-1 bg-slate-100/90 rounded-xl">
            {(['all', 'verified', 'ready', 'draft'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setFilter(mode)}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg capitalize transition-colors cursor-pointer ${
                  filter === mode
                    ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Compiler Configuration Drawer / Bar */}
      {showConfig && (
        <div className="p-5 rounded-2xl bg-white/95 border border-indigo-150/70 shadow-2xs space-y-4 animate-in fade-in duration-150">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 text-xs">
            {/* AUDIENCE */}
            <div>
              <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Audience
              </label>
              <select
                value={audience}
                onChange={(e) => setAudience(e.target.value as any)}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-indigo-400 font-medium"
              >
                <option value="Executive">Executive</option>
                <option value="Technical Team">Technical Team</option>
                <option value="General Public">General Public</option>
                <option value="Students">Students</option>
                <option value="Customers">Customers</option>
                <option value="Employees">Employees</option>
                <option value="Media">Media</option>
                <option value="Government/Policy">Government/Policy</option>
                <option value="Custom">Custom</option>
              </select>
              {audience === 'Custom' && (
                <input
                  type="text"
                  value={customAudience}
                  onChange={(e) => setCustomAudience(e.target.value)}
                  placeholder="Specify audience..."
                  className="w-full mt-1.5 px-2.5 py-1 text-[11px] bg-white border border-slate-200 rounded-lg"
                />
              )}
            </div>

            {/* TONE */}
            <div>
              <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Tone
              </label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value as any)}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-indigo-400 font-medium"
              >
                <option value="Professional">Professional</option>
                <option value="Simple">Simple</option>
                <option value="Technical">Technical</option>
                <option value="Formal">Formal</option>
                <option value="Conversational">Conversational</option>
                <option value="Urgent">Urgent</option>
                <option value="Educational">Educational</option>
              </select>
            </div>

            {/* OBJECTIVE */}
            <div>
              <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Objective
              </label>
              <select
                value={objective}
                onChange={(e) => setObjective(e.target.value as any)}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-indigo-400 font-medium"
              >
                <option value="Inform">Inform</option>
                <option value="Explain">Explain</option>
                <option value="Alert">Alert</option>
                <option value="Educate">Educate</option>
                <option value="Promote">Promote</option>
                <option value="Summarize">Summarize</option>
                <option value="Request Action">Request Action</option>
              </select>
            </div>

            {/* DETAIL */}
            <div>
              <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Detail Level
              </label>
              <select
                value={detail}
                onChange={(e) => setDetail(e.target.value as any)}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-indigo-400 font-medium"
              >
                <option value="Concise">Concise</option>
                <option value="Balanced">Balanced</option>
                <option value="Detailed">Detailed</option>
              </select>
            </div>

            {/* LANGUAGE */}
            <div>
              <label className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Globe className="w-3 h-3 text-slate-400" />
                <span>Language</span>
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-indigo-400 font-medium"
              >
                <option value="English">English</option>
                <option value="Hindi">Hindi (हिंदी)</option>
                <option value="Hinglish">Hinglish</option>
              </select>
            </div>
          </div>

          {/* Batch Selector Bar */}
          <div className="pt-3 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-semibold text-slate-500">Outputs to compile:</span>
              {allOutputTitles.map(outType => {
                const checked = isArtifactSelected(outType, selectedOutputs);
                return (
                  <button
                    key={outType}
                    type="button"
                    onClick={() => toggleSelectOutput(outType)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                      checked 
                        ? 'bg-indigo-50 text-indigo-900 border border-indigo-200 font-semibold' 
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200/70 border border-transparent'
                    }`}
                  >
                    <span className={`w-3.5 h-3.5 rounded flex items-center justify-center text-[10px] ${checked ? 'bg-indigo-600 text-white' : 'border border-slate-300 bg-white'}`}>
                      {checked && '✓'}
                    </span>
                    <span>{outType}</span>
                  </button>
                );
              })}
              <button
                type="button"
                onClick={toggleSelectAll}
                className="text-[11px] text-indigo-600 hover:underline font-semibold ml-1 cursor-pointer"
              >
                {areAllSelected ? 'Deselect all' : 'Select all'}
              </button>
            </div>

            <button
              onClick={() => onGenerateBatch(selectedOutputs, currentConfig)}
              disabled={selectedOutputs.length === 0 || isGeneratingAll}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-xs font-bold shadow-[0_2px_8px_rgba(79,70,229,0.25)] flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap disabled:opacity-60"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isGeneratingAll ? (generationStage || 'Compiling Kit...') : 'Generate Communication Kit'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Active Compilation Multi-Step Progress Banner */}
      {isGeneratingAll && (
        <div className="p-4 rounded-2xl bg-indigo-50/90 border border-indigo-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center animate-spin shrink-0">
              <RotateCw className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <span>Single-Pass Communication Kit Compiler</span>
                <span className="text-[10px] font-mono text-indigo-700 bg-white px-2 py-0.5 rounded font-semibold border border-indigo-200">
                  {selectedOutputs.length} channels
                </span>
              </div>
              <p className="text-xs text-indigo-700 font-medium mt-0.5">
                {generationStage || 'Compiling communication kit...'}
              </p>
            </div>
          </div>

          <div className="w-full sm:w-48 h-2 rounded-full bg-indigo-100 overflow-hidden shrink-0">
            <div className="h-full bg-gradient-to-r from-indigo-600 to-violet-600 rounded-full animate-pulse w-3/4"></div>
          </div>
        </div>
      )}

      {/* Generation Error Banner with Retry */}
      {generationError && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs animate-in fade-in duration-150">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
            <div>
              <div className="font-bold text-rose-950">Generation failed</div>
              <p className="text-rose-700 mt-0.5">{generationError}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {onClearError && (
              <button
                type="button"
                onClick={onClearError}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 text-xs font-medium cursor-pointer"
              >
                Dismiss
              </button>
            )}
            <button
              type="button"
              onClick={() => onGenerateBatch(selectedOutputs, currentConfig)}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white text-xs font-bold shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Retry Generation</span>
            </button>
          </div>
        </div>
      )}

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredArtifacts.map((artifact) => {
          const Icon = getIconForType(artifact.type);
          const isVerified = artifact.status === 'Verified';
          const isGenerating = artifact.status === 'Generating...' || artifact.status === 'Compiling';
          const isGenerated = artifact.status === 'Generated';
          const isReady = artifact.status === 'Ready';
          const isError = artifact.status === 'Error';
          const isSelected = isArtifactSelected(artifact.title, selectedOutputs);

          const isVideoCard = artifact.type === 'Video Storyboard' || artifact.type === 'Video Package' || artifact.title.toLowerCase().includes('video');
          const isPresentationCard = artifact.type === 'Presentation' || artifact.title.toLowerCase().includes('presentation');

          // Canonical badge text and styling
          let badgeClass = 'bg-slate-100 text-slate-600 border border-slate-200/60';
          let dotClass = 'bg-slate-400';
          let displayStatus = artifact.status as string;

          if (isVideoCard) {
            if (artifact.videoArtifact?.status === 'ready' || artifact.status === 'AI Video Ready') {
              badgeClass = 'bg-emerald-50 text-emerald-700 border border-emerald-200/60';
              dotClass = 'bg-emerald-500';
              displayStatus = 'AI Video Ready';
            } else if (artifact.videoArtifact?.status === 'generating' || artifact.status === 'AI Video Generating') {
              badgeClass = 'bg-indigo-50 text-indigo-700 border border-indigo-200/60';
              dotClass = 'bg-indigo-500 animate-spin';
              displayStatus = 'AI Video Generating';
            } else if (artifact.videoArtifact?.status === 'error') {
              badgeClass = 'bg-rose-50 text-rose-700 border border-rose-200/60';
              dotClass = 'bg-rose-500';
              displayStatus = 'Video failed';
            } else if (artifact.status === 'Generated') {
              badgeClass = 'bg-violet-50 text-violet-700 border border-violet-200/60';
              dotClass = 'bg-violet-500';
              displayStatus = 'Storyboard Generated';
            } else {
              badgeClass = 'bg-slate-100 text-slate-600 border border-slate-200';
              dotClass = 'bg-slate-400';
              displayStatus = 'Draft';
            }
          } else if (isPresentationCard) {
            if (artifact.pptxArtifact?.status === 'ready' || artifact.status === 'PPTX Ready') {
              badgeClass = 'bg-emerald-50 text-emerald-700 border border-emerald-200/60';
              dotClass = 'bg-emerald-500';
              displayStatus = 'PPTX Ready';
            } else if (artifact.pptxArtifact?.status === 'generating' || artifact.status === 'PPTX Generating') {
              badgeClass = 'bg-indigo-50 text-indigo-700 border border-indigo-200/60';
              dotClass = 'bg-indigo-500 animate-spin';
              displayStatus = 'PPTX Generating';
            } else if (artifact.status === 'Generated') {
              badgeClass = 'bg-violet-50 text-violet-700 border border-violet-200/60';
              dotClass = 'bg-violet-500';
              displayStatus = 'Generated';
            } else {
              badgeClass = 'bg-slate-100 text-slate-700 border border-slate-200';
              dotClass = 'bg-slate-400';
              displayStatus = 'Ready';
            }
          } else if (isVerified) {
            badgeClass = 'bg-emerald-50 text-emerald-700 border border-emerald-200/60';
            dotClass = 'bg-emerald-500';
            displayStatus = 'Verified';
          } else if (isGenerating) {
            badgeClass = 'bg-indigo-50 text-indigo-700 border border-indigo-200/60';
            dotClass = 'bg-indigo-500 animate-spin';
            displayStatus = 'Generating...';
          } else if (isGenerated) {
            badgeClass = 'bg-violet-50 text-violet-700 border border-violet-200/60';
            dotClass = 'bg-violet-500';
            displayStatus = 'Generated';
          } else if (isError) {
            badgeClass = 'bg-rose-50 text-rose-700 border border-rose-200/60';
            dotClass = 'bg-rose-500';
            displayStatus = 'Error';
          } else if (isReady) {
            badgeClass = 'bg-slate-100 text-slate-700 border border-slate-200';
            dotClass = 'bg-slate-400';
            displayStatus = 'Ready';
          }

          return (
            <div
              key={artifact.id}
              onClick={() => onOpenArtifact(artifact)}
              className="group relative bg-white/90 hover:bg-white rounded-2xl p-5 border border-slate-200/70 hover:border-indigo-200/90 shadow-[0_2px_12px_rgba(15,23,42,0.03)] hover:shadow-[0_8px_24px_rgba(79,70,229,0.06)] transition-all duration-200 flex flex-col justify-between cursor-pointer backdrop-blur-sm"
            >
              <div>
                {/* Header row: Icon, Checkbox & Status */}
                <div className="flex items-center justify-between mb-3.5">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      aria-label={`Select ${artifact.title}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSelectOutput(artifact.title);
                      }}
                      className="text-slate-400 hover:text-indigo-600 p-0.5 cursor-pointer"
                    >
                      <span className={`w-4 h-4 rounded flex items-center justify-center text-[10px] ${isSelected ? 'bg-indigo-600 text-white' : 'border border-slate-300 bg-white'}`}>
                        {isSelected && '✓'}
                      </span>
                    </button>
                    <div className="w-9 h-9 rounded-xl bg-slate-100/80 group-hover:bg-gradient-to-tr group-hover:from-indigo-50 group-hover:to-violet-50 text-slate-600 group-hover:text-indigo-600 flex items-center justify-center transition-all">
                      <Icon className="w-4 h-4 stroke-[2]" />
                    </div>
                  </div>

                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${badgeClass}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${dotClass}`}></span>
                    {displayStatus}
                  </span>
                </div>

                {/* Title & Description */}
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-950 transition-colors">
                  {artifact.title}
                </h4>
                <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                  {artifact.description}
                </p>

                {/* Key metadata: Source Fidelity or Not Verified */}
                <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5 text-[11px] text-slate-500">
                  <div className="flex items-center justify-between">
                    <span>Source Fidelity</span>
                    <span className="font-mono tabular-nums font-semibold text-slate-800">
                      {isVerified ? `${artifact.fidelity}%` : (isGenerated ? 'Generated (Pending Audit)' : 'Not verified')}
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${isVerified ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : 'bg-gradient-to-r from-indigo-500 to-violet-500'}`}
                      style={{ width: isVerified ? `${artifact.fidelity}%` : (isGenerated ? '90%' : '20%') }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Bottom Row Actions */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="text-[11px] text-slate-400 font-mono">
                  {artifact.factsLinked} facts linked
                </div>

                <div className="flex items-center gap-1.5">
                  {/* Dedicated Action for Video: "Generate AI Video" or "Play AI Video" */}
                  {isVideoCard && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onGenerateVideo) {
                          onGenerateVideo(artifact);
                        } else {
                          onOpenArtifact(artifact);
                        }
                      }}
                      className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-colors flex items-center gap-1 cursor-pointer ${
                        artifact.videoArtifact?.status === 'ready' || artifact.status === 'AI Video Ready'
                          ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/60'
                          : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-2xs'
                      }`}
                      title={artifact.videoArtifact?.status === 'ready' ? 'Play AI Video' : 'Generate AI Video with Veo 3.1'}
                    >
                      {artifact.videoArtifact?.status === 'ready' || artifact.status === 'AI Video Ready' ? (
                        <>
                          <Play className="w-3 h-3 fill-current" />
                          <span>Play Video</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3 h-3 text-indigo-200" />
                          <span>Generate AI Video</span>
                        </>
                      )}
                    </button>
                  )}

                  {/* Dedicated Action for Presentation: "Generate PPTX" or "Download PPTX" */}
                  {isPresentationCard && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onGeneratePptx) {
                          onGeneratePptx(artifact);
                        } else {
                          onOpenArtifact(artifact);
                        }
                      }}
                      className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-colors flex items-center gap-1 cursor-pointer ${
                        artifact.pptxArtifact?.status === 'ready' || artifact.status === 'PPTX Ready'
                          ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/60'
                          : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200/60'
                      }`}
                      title={artifact.pptxArtifact?.status === 'ready' ? 'Download PowerPoint presentation' : 'Generate PowerPoint PPTX'}
                    >
                      {artifact.pptxArtifact?.status === 'ready' || artifact.status === 'PPTX Ready' ? (
                        <>
                          <FileDown className="w-3 h-3" />
                          <span>PPTX Ready</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3 h-3" />
                          <span>Generate PPTX</span>
                        </>
                      )}
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onGenerateArtifact(artifact, currentConfig);
                    }}
                    className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                    title="Regenerate this artifact content"
                  >
                    <RotateCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin text-indigo-600' : ''}`} />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenArtifact(artifact);
                    }}
                    className="px-2.5 py-1 text-xs font-semibold text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100/80 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>View</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

