import React from 'react';
import { 
  X, 
  FileText, 
  CheckCircle2, 
  Sparkles, 
  ExternalLink,
  ShieldCheck,
  Binary,
  GitCommit
} from 'lucide-react';
import { SourceItem } from '../types/dashboard';

interface SourceDetailModalProps {
  source: SourceItem | null;
  onClose: () => void;
  onCompileFromSource: (source: SourceItem) => void;
  onOpenVersioning?: (source: SourceItem) => void;
}

export const SourceDetailModal: React.FC<SourceDetailModalProps> = ({
  source,
  onClose,
  onCompileFromSource,
  onOpenVersioning
}) => {
  if (!source) return null;

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
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">{source.name}</h3>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  {source.status}
                </span>
                {source.version && (
                  <span className="text-[10px] font-mono font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-150">
                    v{source.version}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                {source.type} · Ingested {source.date} · {source.fileSize}
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
          {/* Metrics overview */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
              <span className="text-[10px] text-slate-400 block mb-0.5">Facts Indexed</span>
              <span className="text-base font-bold font-mono text-slate-900">{source.factsCount}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
              <span className="text-[10px] text-slate-400 block mb-0.5">Artifacts Linked</span>
              <span className="text-base font-bold font-mono text-slate-900">{source.artifactsCount}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
              <span className="text-[10px] text-slate-400 block mb-0.5">AI-Assisted Fidelity</span>
              <span className="text-base font-bold font-mono text-indigo-600">{source.fidelity}%</span>
            </div>
          </div>

          {/* Custodian & Summary */}
          <div>
            <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Source Custodian
            </h4>
            <p className="text-slate-800 font-medium">{source.author}</p>
          </div>

          <div>
            <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Knowledge Extraction Summary
            </h4>
            <p className="text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200/70">
              {source.summary}
            </p>
          </div>

          {/* Raw Ground-Truth Snippet */}
          <div>
            <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
              Ground-Truth Excerpt (Cryptographically Hashed)
            </h4>
            <div className="font-mono text-[11px] bg-slate-900 text-slate-200 p-4 rounded-xl leading-relaxed max-h-48 overflow-y-auto">
              "{source.snippet}"
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            {onOpenVersioning && (
              <button
                type="button"
                onClick={() => {
                  onOpenVersioning(source);
                  onClose();
                }}
                className="px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <GitCommit className="w-3.5 h-3.5" />
                <span>Update Source Version</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={() => {
                onCompileFromSource(source);
                onClose();
              }}
              className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 rounded-xl shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Compile All Channels</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
