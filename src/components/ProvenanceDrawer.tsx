import React from 'react';
import { 
  X, 
  Cpu, 
  CheckCircle2, 
  ExternalLink, 
  FileText, 
  Link2,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { KnowledgeItem } from '../types/dashboard';

interface ProvenanceDrawerProps {
  item: KnowledgeItem | null;
  onClose: () => void;
  onViewArtifact: (artifactTitle: string) => void;
}

export const ProvenanceDrawer: React.FC<ProvenanceDrawerProps> = ({
  item,
  onClose,
  onViewArtifact
}) => {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/30 backdrop-blur-2xs animate-in fade-in duration-150">
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl border-l border-slate-200 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          {/* Drawer Header */}
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-50 to-violet-50 text-indigo-600 flex items-center justify-center border border-indigo-150/60">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Knowledge Provenance</h3>
                <span className="text-[11px] font-mono text-slate-400">ID: {item.id}</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-6 space-y-5">
            {/* Statement Box */}
            <div>
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Indexed Statement
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 text-xs font-semibold text-slate-900 leading-relaxed">
                "{item.statement}"
              </div>
            </div>

            {/* Invariant Metrics */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/60">
                <span className="text-[10px] text-slate-400 block mb-0.5">Verification Score</span>
                <span className="text-sm font-bold font-mono text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 inline" />
                  {item.confidence}%
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/60">
                <span className="text-[10px] text-slate-400 block mb-0.5">Category</span>
                <span className="text-xs font-semibold text-indigo-700 capitalize">
                  {item.category.replace('_', ' ')}
                </span>
              </div>
            </div>

            {/* Source Truth Origin */}
            <div className="space-y-2">
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Ground-Truth Source Document
              </div>
              <div className="p-4 rounded-2xl bg-indigo-50/40 border border-indigo-150/70 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-indigo-950 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{item.sourceDoc}</span>
                  </div>
                  <span className="text-[11px] font-mono text-indigo-600 bg-white/80 px-2 py-0.5 rounded border border-indigo-100">
                    {item.sourceLocation}
                  </span>
                </div>

                <div className="mt-2 pt-2 border-t border-indigo-100 text-[11px] text-slate-600 italic font-mono bg-white/60 p-2.5 rounded-xl">
                  "{item.sourceTextSnippet}"
                </div>
              </div>
            </div>

            {/* Linked Artifacts */}
            <div>
              <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Downstream Artifacts Relying on this Fact
              </div>
              <div className="space-y-1.5">
                {item.linkedArtifacts.map((art, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      onViewArtifact(art);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-slate-50 text-xs text-left transition-colors"
                  >
                    <span className="font-medium text-slate-800">{art}</span>
                    <span className="text-[11px] text-indigo-600 font-semibold flex items-center gap-0.5">
                      <span>View</span>
                      <ExternalLink className="w-3 h-3" />
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 bg-slate-50/50">
          <button
            onClick={onClose}
            className="w-full py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 transition-colors"
          >
            Close Provenance View
          </button>
        </div>
      </div>
    </div>
  );
};
