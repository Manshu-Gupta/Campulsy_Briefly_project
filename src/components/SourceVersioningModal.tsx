import React, { useState } from 'react';
import { 
  X, 
  RotateCw, 
  AlertTriangle, 
  Sparkles, 
  CheckCircle2, 
  FileText,
  ArrowRight,
  GitCommit
} from 'lucide-react';
import { SourceItem, VersionDiffResult, StructuredKnowledgeCore } from '../types/dashboard';
import { analyzeSourceApi, versionDiffApi } from '../services/api';

interface SourceVersioningModalProps {
  isOpen: boolean;
  source: SourceItem | null;
  existingArtifacts: string[];
  onClose: () => void;
  onUpdateSource: (updatedSource: SourceItem, diff: VersionDiffResult) => void;
}

export const SourceVersioningModal: React.FC<SourceVersioningModalProps> = ({
  isOpen,
  source,
  existingArtifacts,
  onClose,
  onUpdateSource
}) => {
  const [updatedContent, setUpdatedContent] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [diffResult, setDiffResult] = useState<VersionDiffResult | null>(null);
  const [step, setStep] = useState<'edit' | 'analyzing' | 'diff'>('edit');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  React.useEffect(() => {
    if (source) {
      setUpdatedContent(source.snippet || '');
      setStep('edit');
      setDiffResult(null);
      setErrorMessage(null);
    }
  }, [source]);

  if (!isOpen || !source) return null;

  const handleRunUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!updatedContent.trim()) return;

    setIsProcessing(true);
    setStep('analyzing');
    setErrorMessage(null);

    try {
      // 1. Analyze new source version with Gemini to build updated Knowledge Core
      const newAnalysis = await analyzeSourceApi({
        title: source.name,
        type: source.type,
        content: updatedContent.trim(),
        author: source.author,
      });

      const newCore = newAnalysis.knowledgeCore;
      const prevCore = source.knowledgeCore || {
        facts: [],
        claims: [],
        statistics: [],
        dates: [],
        entities: { organizations: [], people: [], locations: [] },
        key_messages: [],
        findings: [],
        risks: [],
        recommendations: [],
        uncertainties: [],
        summary: source.summary
      };

      // 2. Compute Version Diff with Gemini
      const diffResponse = await versionDiffApi({
        previousCore: prevCore,
        newCore,
        existingArtifacts,
      });

      const diff = diffResponse.diff;
      setDiffResult(diff);
      setStep('diff');
      setIsProcessing(false);

      const nextVersion = (source.version || 1) + 1;
      const updatedSourceItem: SourceItem = {
        ...source,
        version: nextVersion,
        snippet: updatedContent.trim(),
        summary: newCore.summary || source.summary,
        factsCount: (newCore.facts || []).length,
        fidelity: newCore.aiAssistedSourceFidelity || source.fidelity,
        date: 'Just now (v' + nextVersion + ')',
        knowledgeCore: newCore,
        previousVersions: [
          ...(source.previousVersions || []),
          {
            version: source.version || 1,
            snippet: source.snippet,
            date: source.date,
            knowledgeCore: source.knowledgeCore
          }
        ]
      };

      onUpdateSource(updatedSourceItem, diff);
    } catch (err: any) {
      console.error('Failed to update source version:', err);
      setIsProcessing(false);
      setStep('edit');
      setErrorMessage(err.message || 'Failed to analyze source version diff.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="w-full max-w-2xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-150">
              <GitCommit className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">Source Versioning & Invariant Audit</h3>
                <span className="text-[11px] font-mono text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded font-semibold">
                  v{source.version || 1} → v{(source.version || 1) + 1}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Updating source text rebuilds the Knowledge Core and flags affected communication artifacts.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs">
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700">
              {errorMessage}
            </div>
          )}

          {step === 'edit' && (
            <form onSubmit={handleRunUpdate} className="space-y-4">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-600">
                <strong>Current Document:</strong> {source.name} ({source.type})
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Update Source Text (e.g. adjust numbers, dates, or SLAs):
                </label>
                <textarea
                  required
                  rows={8}
                  value={updatedContent}
                  onChange={(e) => setUpdatedContent(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-indigo-400 font-mono leading-relaxed"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Rebuild Knowledge Core & Compare</span>
                </button>
              </div>
            </form>
          )}

          {step === 'analyzing' && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center animate-spin">
                <RotateCw className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Rebuilding Knowledge Core & Calculating Delta...</h4>
              <p className="text-xs text-slate-500 max-w-sm">
                Gemini is identifying changed metrics and detecting which communication channels require regeneration.
              </p>
            </div>
          )}

          {step === 'diff' && diffResult && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-150">
                <h4 className="text-xs font-bold text-indigo-950 uppercase tracking-wider mb-1">
                  Source Updated Successfully (v{(source.version || 1) + 1})
                </h4>
                <p className="text-slate-700 text-xs">
                  {diffResult.summary}
                </p>
              </div>

              {/* Identified Changes */}
              <div className="space-y-2">
                <h5 className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                  Changed Invariants Detected:
                </h5>
                <div className="space-y-2">
                  {diffResult.changes?.map((chg, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <span className="font-semibold text-slate-900">{chg.description}</span>
                        <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                          {chg.previous && <span className="line-through text-red-500 mr-2">{chg.previous}</span>}
                          {chg.current && <span className="text-emerald-600 font-semibold">{chg.current}</span>}
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-indigo-600 bg-white px-2 py-0.5 rounded border border-slate-200 self-start sm:self-auto">
                        {chg.type}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Potentially Affected Artifacts */}
              {diffResult.affectedArtifacts?.length > 0 && (
                <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-2">
                  <div className="flex items-center gap-2 text-amber-800 font-bold text-xs">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>Potentially Affected Artifacts ({diffResult.affectedArtifacts.length})</span>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    The following generated outputs cite modified metrics and should be recompiled:
                  </p>
                  <div className="flex items-center gap-2 flex-wrap pt-1">
                    {diffResult.affectedArtifacts.map((art, idx) => (
                      <span key={idx} className="px-2.5 py-1 bg-white text-amber-900 border border-amber-200 rounded-lg font-semibold text-xs flex items-center gap-1 shadow-2xs">
                        <span>⚠</span>
                        <span>{art}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl cursor-pointer"
                >
                  Done Reviewing Diff
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
