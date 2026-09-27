import React from 'react';
import { 
  X, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  RotateCw, 
  ShieldCheck, 
  FileText,
  Check
} from 'lucide-react';
import { InconsistencyItem } from '../types/dashboard';

interface DiscrepancyModalProps {
  isOpen: boolean;
  inconsistencies: InconsistencyItem[];
  onClose: () => void;
  onResolve: (id: string) => void;
  onResolveAll: () => void;
}

export const DiscrepancyModal: React.FC<DiscrepancyModalProps> = ({
  isOpen,
  inconsistencies,
  onClose,
  onResolve,
  onResolveAll
}) => {
  if (!isOpen) return null;

  const unresolved = inconsistencies.filter(i => !i.resolved);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="w-full max-w-2xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200/60">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">Consistency Guard Audit</h3>
                <span className="text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  {unresolved.length} flagged drifts
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Briefly detected factual discrepancies between generated draft claims and raw source documents.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* List of Discrepancies */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {unresolved.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">All Inconsistencies Resolved</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm">
                Every generated artifact now aligns with 100% precision against the ground-truth sources.
              </p>
            </div>
          ) : (
            unresolved.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl border border-amber-200/90 bg-amber-50/20 space-y-3"
              >
                {/* Channel / Document */}
                <div className="flex items-center justify-between text-xs pb-2 border-b border-amber-100/70">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900">{item.artifactTitle}</span>
                    <span className="text-slate-300">vs</span>
                    <span className="text-slate-600 font-medium">{item.sourceDoc}</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">{item.sourcePage}</span>
                </div>

                {/* Diff Comparison Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {/* Draft claim (Drift) */}
                  <div className="p-3 rounded-xl bg-red-50/60 border border-red-200/70">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-red-700 mb-1 flex items-center gap-1">
                      <span>⚠ Generated Draft Claim (Drift)</span>
                    </div>
                    <p className="text-slate-800 leading-relaxed font-mono text-[11px]">
                      "{item.generatedClaim}"
                    </p>
                  </div>

                  {/* Ground Truth */}
                  <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/70">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 mb-1 flex items-center gap-1">
                      <span>✓ Ground-Truth Source Invariant</span>
                    </div>
                    <p className="text-slate-800 leading-relaxed font-mono text-[11px]">
                      "{item.sourceTruth}"
                    </p>
                  </div>
                </div>

                {/* Resolve Action */}
                <div className="flex items-center justify-between pt-1 text-xs">
                  <span className="text-[11px] text-slate-400">
                    Resolution: Automatically rewrite draft claim to match exact source metrics.
                  </span>
                  <button
                    onClick={() => onResolve(item.id)}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Reconcile to Source</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
          <span className="text-xs text-slate-500">
            {unresolved.length} discrepancy remaining
          </span>
          <div className="flex items-center gap-2">
            {unresolved.length > 0 && (
              <button
                onClick={onResolveAll}
                className="px-4 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 rounded-xl transition-colors"
              >
                Reconcile All to Source
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
