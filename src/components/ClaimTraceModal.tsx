import React from 'react';
import { 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  Search, 
  FileText, 
  Link2,
  ShieldCheck,
  Check
} from 'lucide-react';
import { ClaimTraceResult } from '../types/dashboard';

interface ClaimTraceModalProps {
  isOpen: boolean;
  onClose: () => void;
  traceResult: ClaimTraceResult | null;
  isLoading?: boolean;
}

export const ClaimTraceModal: React.FC<ClaimTraceModalProps> = ({
  isOpen,
  onClose,
  traceResult,
  isLoading
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="w-full max-w-xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-150">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">Claim Traceability</h3>
                {traceResult && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                    traceResult.status === 'supported' 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {traceResult.status === 'supported' ? '✓ Supported' : '⚠ Needs Review'}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                Ground-truth provenance verification for synthesized statements.
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

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs">
          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center animate-spin">
                <Search className="w-5 h-5" />
              </div>
              <p className="text-xs text-slate-600 font-medium">Tracing claim back to source tokens...</p>
            </div>
          ) : traceResult ? (
            <div className="space-y-4">
              {/* Generated Claim */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Generated Claim in Artifact:
                </span>
                <p className="text-slate-900 font-semibold text-xs leading-relaxed">
                  "{traceResult.generatedClaim}"
                </p>
              </div>

              {/* Source Fact */}
              <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-150 space-y-1">
                <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider block">
                  Source Ground-Truth Fact:
                </span>
                <p className="text-indigo-950 font-medium text-xs leading-relaxed">
                  "{traceResult.sourceFact}"
                </p>
              </div>

              {/* Source Context */}
              <div className="p-4 rounded-2xl bg-slate-900 text-slate-200 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pb-1 border-b border-slate-800">
                  <span>RAW SOURCE CONTEXT SNIPPET</span>
                  <span>Confidence: {traceResult.confidence}%</span>
                </div>
                <p className="text-[11px] font-mono leading-relaxed pt-1">
                  "{traceResult.sourceContext || 'Directly grounded in source extraction graph.'}"
                </p>
              </div>

              {/* Status explanation */}
              <div className={`p-3 rounded-xl border flex items-center gap-2 ${
                traceResult.status === 'supported' 
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
                  : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}>
                {traceResult.status === 'supported' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                )}
                <span className="text-xs font-medium">
                  {traceResult.status === 'supported'
                    ? 'Verified: This statement directly matches the source document with zero factual drift.'
                    : 'Caution: This claim includes slight numeric or semantic variance compared to the source text.'
                  }
                </span>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400">
              No claim selected for inspection.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-end bg-slate-50/50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Close Trace
          </button>
        </div>
      </div>
    </div>
  );
};
