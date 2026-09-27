import React from 'react';
import { 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  ExternalLink, 
  ChevronRight,
  Plus,
  FileSpreadsheet,
  Headphones,
  FileCode2,
  FileCheck2
} from 'lucide-react';
import { SourceItem, SourceType } from '../types/dashboard';

interface RecentSourcesTableProps {
  sources: SourceItem[];
  onSelectSource: (source: SourceItem) => void;
  onOpenNewSource: () => void;
}

export const RecentSourcesTable: React.FC<RecentSourcesTableProps> = ({
  sources,
  onSelectSource,
  onOpenNewSource
}) => {
  const getFormatIcon = (type: SourceType) => {
    switch (type) {
      case 'PRD & Architecture':
        return FileCode2;
      case 'Technical Whitepaper':
        return FileText;
      case 'Earnings Call Transcript':
        return Headphones;
      case 'Advisory Board Notes':
        return FileSpreadsheet;
      case 'Executive Keynote':
        return FileCheck2;
      default:
        return FileText;
    }
  };

  return (
    <div className="bg-white/90 rounded-3xl p-6 border border-slate-200/70 shadow-[0_2px_12px_rgba(15,23,42,0.03)] backdrop-blur-sm space-y-4">
      {/* Table Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold tracking-tight text-slate-900">
              Recent Ground-Truth Sources
            </h3>
            <span className="text-[11px] font-mono text-slate-400">
              ({sources.length} indexed documents)
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Single-source repositories ingested into the Knowledge Core with cryptographic token anchoring.
          </p>
        </div>

        <button
          onClick={onOpenNewSource}
          className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-xs font-semibold shadow-[0_2px_8px_rgba(79,70,229,0.25)] flex items-center gap-1.5 transition-all self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Source</span>
        </button>
      </div>

      {/* Responsive Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              <th className="py-3 px-4">Source Name</th>
              <th className="py-3 px-3">Format Type</th>
              <th className="py-3 px-3">Ingested</th>
              <th className="py-3 px-3 text-right">Facts</th>
              <th className="py-3 px-3 text-right">Artifacts</th>
              <th className="py-3 px-4">Fidelity</th>
              <th className="py-3 px-3">Status</th>
              <th className="py-3 px-2 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100/80 text-xs">
            {sources.map((src) => {
              const Icon = getFormatIcon(src.type);
              const isVerified = src.status === 'Verified';
              const isSynced = src.status === 'Synced';

              return (
                <tr
                  key={src.id}
                  onClick={() => onSelectSource(src)}
                  className="group hover:bg-slate-50/80 transition-colors cursor-pointer"
                >
                  {/* Name + author */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-slate-100 group-hover:bg-indigo-50 text-slate-500 group-hover:text-indigo-600 flex items-center justify-center shrink-0 transition-colors">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0 max-w-[260px] md:max-w-[340px]">
                        <div className="font-semibold text-slate-900 group-hover:text-indigo-950 truncate transition-colors">
                          {src.name}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate">
                          {src.author} · {src.fileSize}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Type */}
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <span className="text-slate-600 font-medium text-[11px]">
                      {src.type}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="py-3.5 px-3 whitespace-nowrap text-slate-500 font-mono text-[11px]">
                    {src.date}
                  </td>

                  {/* Facts */}
                  <td className="py-3.5 px-3 text-right font-mono tabular-nums font-semibold text-slate-800">
                    {src.factsCount}
                  </td>

                  {/* Artifacts */}
                  <td className="py-3.5 px-3 text-right font-mono tabular-nums text-slate-600">
                    {src.artifactsCount}
                  </td>

                  {/* Fidelity Progress Bar */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-2.5">
                      <div className="w-20 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500"
                          style={{ width: `${src.fidelity}%` }}
                        ></div>
                      </div>
                      <span className="font-mono tabular-nums font-semibold text-[11px] text-slate-800">
                        {src.fidelity}%
                      </span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium ${
                        isVerified
                          ? 'bg-emerald-50 text-emerald-700'
                          : isSynced
                          ? 'bg-indigo-50 text-indigo-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isVerified
                            ? 'bg-emerald-500'
                            : isSynced
                            ? 'bg-indigo-500'
                            : 'bg-amber-500'
                        }`}
                      ></span>
                      {src.status}
                    </span>
                  </td>

                  {/* Action */}
                  <td className="py-3.5 px-2 text-right">
                    <button
                      type="button"
                      aria-label="View source details"
                      className="p-1.5 rounded-lg text-slate-300 group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
