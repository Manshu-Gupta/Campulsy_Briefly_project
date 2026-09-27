import React, { useState, useRef } from 'react';
import { 
  X, 
  Upload, 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  AlertTriangle,
  RotateCw,
  FileUp,
  Image,
  FileCheck2
} from 'lucide-react';
import { SourceItem, SourceType, StructuredKnowledgeCore } from '../types/dashboard';
import { analyzeSourceApi, SAMPLE_EWASTE_REPORT } from '../services/api';

interface NewSourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSource: (newSource: SourceItem) => void;
  onNavigateToKnowledgeCore?: () => void;
}

export const NewSourceModal: React.FC<NewSourceModalProps> = ({
  isOpen,
  onClose,
  onAddSource,
  onNavigateToKnowledgeCore
}) => {
  const [sourceName, setSourceName] = useState('');
  const [sourceType, setSourceType] = useState<SourceType>('Report');
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [loadingStage, setLoadingStage] = useState('Connecting to Gemini 3.8 Flash...');
  const [step, setStep] = useState<'input' | 'extracting' | 'error' | 'complete'>('input');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [inlineImage, setInlineImage] = useState<{ mimeType: string; data: string } | undefined>(undefined);
  const [extractedStats, setExtractedStats] = useState({ facts: 0, claims: 0, stats: 0, entities: 0 });

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleApplySampleSource = () => {
    setSourceName(SAMPLE_EWASTE_REPORT.title);
    setSourceType(SAMPLE_EWASTE_REPORT.type);
    setAuthor(SAMPLE_EWASTE_REPORT.author);
    setContent(SAMPLE_EWASTE_REPORT.content);
    setUploadedFileName(null);
    setInlineImage(undefined);
    setErrorMessage(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    if (!sourceName) {
      setSourceName(file.name.replace(/\.[^/.]+$/, ''));
    }

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        setInlineImage({
          mimeType: file.type,
          data: base64,
        });
        if (!content) {
          setContent(`[Uploaded Image: ${file.name}]`);
        }
      };
      reader.readAsDataURL(file);
    } else {
      // Text, PDF, markdown, or code
      const reader = new FileReader();
      reader.onload = () => {
        const text = reader.result as string;
        setContent(text);
      };
      reader.readAsText(file);
    }
  };

  const executeAnalysis = async () => {
    if (!sourceName.trim() || (!content.trim() && !inlineImage)) {
      setErrorMessage('Please provide a source document title and text or upload a document.');
      setStep('input');
      return;
    }

    setErrorMessage(null);
    setIsProcessing(true);
    setStep('extracting');
    setLoadingStage('Analyzing source document with Gemini 3.8 Flash...');

    try {
      const response = await analyzeSourceApi({
        title: sourceName.trim(),
        type: sourceType,
        content: content.trim(),
        author: author.trim() || 'Authoritative Custodian',
        inlineImage,
      });

      const core: StructuredKnowledgeCore = response.knowledgeCore;
      const factsCount = (core.facts || []).length;
      const claimsCount = (core.claims || []).length;
      const statsCount = (core.statistics || []).length;
      const entitiesCount = Array.isArray(core.entities) ? core.entities.length : 0;

      setExtractedStats({
        facts: factsCount,
        claims: claimsCount,
        stats: statsCount,
        entities: entitiesCount,
      });

      setStep('complete');

      const newSource: SourceItem = {
        id: `src-${Date.now()}`,
        name: sourceName.trim(),
        type: sourceType,
        date: 'Just now',
        factsCount,
        artifactsCount: 0,
        fidelity: 96.0,
        status: 'Verified',
        author: author.trim() || 'Authoritative Custodian',
        fileSize: `${Math.max(1, Math.round(content.length / 1024))} KB · Ingested`,
        summary: core.summary || content.slice(0, 160) + '...',
        snippet: content.slice(0, 800),
        version: 1,
        knowledgeCore: core,
      };

      setTimeout(() => {
        onAddSource(newSource);
        setIsProcessing(false);
        setStep('input');
        onClose();
        if (onNavigateToKnowledgeCore) {
          onNavigateToKnowledgeCore();
        }
      }, 1200);
    } catch (err: any) {
      console.error('Gemini extraction error:', err);
      setIsProcessing(false);
      setStep('error');
      setErrorMessage(err.message || 'Gemini analysis failed. Please verify your connection.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeAnalysis();
  };

  const handleRetry = () => {
    executeAnalysis();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="w-full max-w-2xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Ingest Ground-Truth Source</h3>
              <p className="text-xs text-slate-500">Extract immutable facts into the Knowledge Core</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body: Input Step */}
        {step === 'input' && (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
            {errorMessage && (
              <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Quick Demo Sample Source CTA */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-indigo-50/90 via-violet-50/50 to-indigo-50/40 border border-indigo-150/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-indigo-950">Try Sample Source</span>
                  <span className="text-[10px] font-mono text-indigo-700 bg-white/90 px-1.5 py-0.5 rounded border border-indigo-150">
                    Live Demo
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Load "Urban E-Waste Management Report 2026" with real metrics, risks, and findings.
                </p>
              </div>

              <button
                type="button"
                onClick={handleApplySampleSource}
                className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-indigo-700 border border-indigo-200/80 text-xs font-semibold shadow-2xs transition-colors shrink-0 self-start sm:self-auto cursor-pointer"
              >
                Load Sample Report
              </button>
            </div>

            {/* Upload or Drop Area */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Upload File or Document
                </label>
                {uploadedFileName && (
                  <span className="text-[11px] font-mono text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    {uploadedFileName}
                  </span>
                )}
              </div>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-200 hover:border-indigo-300 rounded-2xl p-4 text-center cursor-pointer bg-slate-50/50 hover:bg-indigo-50/30 transition-colors"
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  className="hidden" 
                  accept=".txt,.md,.pdf,.json,.csv,image/*" 
                />
                <div className="flex flex-col items-center justify-center gap-1">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center mb-1">
                    <Upload className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-medium text-slate-700">
                    {uploadedFileName ? 'Click to replace file' : 'Click to upload PDF, Report, or Image'}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Supported: PDF, Text, Markdown, Image (PNG, JPG, WebP)
                  </span>
                </div>
              </div>
            </div>

            {/* Source Name & Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Source Title *
                </label>
                <input
                  type="text"
                  required
                  value={sourceName}
                  onChange={(e) => setSourceName(e.target.value)}
                  placeholder="e.g. Urban E-Waste Management Report 2026"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-indigo-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Source Classification *
                </label>
                <select
                  value={sourceType}
                  onChange={(e) => setSourceType(e.target.value as SourceType)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-indigo-400"
                >
                  <option value="Report">Report</option>
                  <option value="News Article">News Article</option>
                  <option value="Research Paper">Research Paper</option>
                  <option value="Policy Document">Policy Document</option>
                  <option value="Advisory">Advisory</option>
                  <option value="Incident Report">Incident Report</option>
                  <option value="Announcement">Announcement</option>
                  <option value="PRD & Architecture">PRD & Architecture</option>
                  <option value="Technical Whitepaper">Technical Whitepaper</option>
                  <option value="Earnings Call Transcript">Earnings Call Transcript</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Author */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Author / Custodian Agency
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="e.g. International Clean Urbanism Alliance"
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-indigo-400"
              />
            </div>

            {/* Content Textarea */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Source Text & Ground-Truth Specifications *
              </label>
              <textarea
                required={!inlineImage}
                rows={5}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Paste the ground-truth technical spec, numbers, findings, and claims to be compiled without drift..."
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-indigo-400 font-mono leading-relaxed"
              ></textarea>
            </div>

            {/* Actions */}
            <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isProcessing}
                className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 rounded-xl shadow-xs flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Analyze Source</span>
              </button>
            </div>
          </form>
        )}

        {/* Modal Body: Extracting / Loading Step */}
        {step === 'extracting' && (
          <div className="p-12 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-150 flex items-center justify-center animate-spin">
              <Sparkles className="w-7 h-7 text-indigo-600" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Extracting Knowledge Core</h4>
              <p className="text-xs text-indigo-600 font-medium mt-1">
                {loadingStage}
              </p>
              <p className="text-[11px] text-slate-400 mt-1 max-w-sm">
                Gemini 3.8 Flash is extracting immutable facts, claims, statistics, and entities directly from your source.
              </p>
            </div>
            <div className="w-56 h-1.5 rounded-full bg-slate-100 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-indigo-600 to-violet-600 animate-pulse w-3/4"></div>
            </div>
          </div>
        )}

        {/* Modal Body: Error Step with Retry */}
        {step === 'error' && (
          <div className="p-8 sm:p-10 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center shadow-xs">
              <AlertCircle className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h4 className="text-base font-bold text-slate-900">Gemini analysis failed</h4>
              <p className="text-xs text-slate-500 max-w-md">
                The Gemini extraction request could not be completed. Your input source has been preserved.
              </p>
            </div>

            {/* Error reason box */}
            <div className="w-full max-w-md p-3.5 rounded-xl bg-rose-50/70 border border-rose-200/80 text-left">
              <div className="text-[11px] font-semibold text-rose-900 mb-1 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                <span>Error details</span>
              </div>
              <p className="text-xs font-mono text-rose-700 break-words leading-relaxed">
                {errorMessage || 'Unknown server error or request timeout.'}
              </p>
            </div>

            {/* Action buttons */}
            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setStep('input')}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/70 rounded-xl transition-colors cursor-pointer"
              >
                Edit Source Input
              </button>

              <button
                type="button"
                onClick={handleRetry}
                className="px-5 py-2 text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 rounded-xl shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Retry Analysis</span>
              </button>
            </div>
          </div>
        )}

        {/* Modal Body: Complete Step */}
        {step === 'complete' && (
          <div className="p-12 flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">Knowledge Core Extracted</h4>
            <p className="text-xs text-slate-500">
              Extracted <span className="font-semibold text-slate-800">{extractedStats.facts} facts</span>, <span className="font-semibold text-slate-800">{extractedStats.claims} claims</span>, and <span className="font-semibold text-slate-800">{extractedStats.stats} statistics</span>.
            </p>
            <p className="text-[11px] text-slate-400">
              Opening Knowledge Core view...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
