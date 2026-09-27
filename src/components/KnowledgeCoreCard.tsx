import React, { useState } from 'react';
import { 
  Cpu, 
  ShieldCheck, 
  ExternalLink, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  Layers, 
  Sparkles,
  ArrowRight,
  Filter,
  AlertTriangle
} from 'lucide-react';
import { KnowledgeItem, KnowledgeCategory, StructuredKnowledgeCore } from '../types/dashboard';

interface KnowledgeCoreCardProps {
  items: KnowledgeItem[];
  fidelityScore: number;
  activeSourceTitle?: string;
  underlyingMetrics?: {
    factsCount: number;
    claimsCount: number;
    statsCount: number;
    uncertaintiesCount: number;
  };
  onInspectItem: (item: KnowledgeItem) => void;
  onCompileArtifacts: () => void;
}

export const KnowledgeCoreCard: React.FC<KnowledgeCoreCardProps> = ({
  items,
  fidelityScore,
  activeSourceTitle,
  underlyingMetrics,
  onInspectItem,
  onCompileArtifacts
}) => {
  const [selectedCategory, setSelectedCategory] = useState<KnowledgeCategory>('all');
  const [filterQuery, setFilterQuery] = useState('');

  const categories: { key: KnowledgeCategory; label: string; count: number }[] = [
    { key: 'all', label: 'All Entries', count: items.length },
    { key: 'facts', label: 'Facts', count: items.filter(i => i.category === 'facts').length },
    { key: 'claims', label: 'Claims', count: items.filter(i => i.category === 'claims').length },
    { key: 'statistics', label: 'Statistics', count: items.filter(i => i.category === 'statistics').length },
    { key: 'entities', label: 'Entities', count: items.filter(i => i.category === 'entities').length },
    { key: 'key_messages', label: 'Key Messages', count: items.filter(i => i.category === 'key_messages').length },
    { key: 'uncertainties', label: 'Uncertainties', count: items.filter(i => i.category === 'uncertainties').length },
  ];

  const filteredItems = items.filter(item => {
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesQuery = !filterQuery || 
      item.statement.toLowerCase().includes(filterQuery.toLowerCase()) ||
      item.sourceDoc.toLowerCase().includes(filterQuery.toLowerCase()) ||
      item.sourceLocation.toLowerCase().includes(filterQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const factsCount = underlyingMetrics?.factsCount ?? items.filter(i => i.category === 'facts').length;
  const claimsCount = underlyingMetrics?.claimsCount ?? items.filter(i => i.category === 'claims').length;
  const statsCount = underlyingMetrics?.statsCount ?? items.filter(i => i.category === 'statistics').length;
  const uncertaintiesCount = underlyingMetrics?.uncertaintiesCount ?? items.filter(i => i.category === 'uncertainties').length;

  return (
    <div className="relative rounded-3xl border border-indigo-200/80 bg-white/95 overflow-hidden shadow-[0_4px_30px_rgba(99,102,241,0.07)] backdrop-blur-md">
      {/* Subtle blue-to-violet ambient glow inside the centerpiece */}
      <div 
        className="absolute -top-24 -right-24 w-96 h-96 rounded-full pointer-events-none opacity-40 blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(165,180,252,0.6) 0%, rgba(224,231,255,0.3) 50%, transparent 70%)'
        }}
      ></div>
      <div 
        className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full pointer-events-none opacity-30 blur-3xl"
        style={{
          background: 'radial-gradient(circle, rgba(196,181,253,0.5) 0%, rgba(243,232,255,0.2) 60%, transparent 80%)'
        }}
      ></div>

      <div className="relative p-6 sm:p-7">
        {/* Top Header Row */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-indigo-50">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center shadow-[0_2px_10px_rgba(79,70,229,0.3)]">
                <Cpu className="w-4 h-4 stroke-[2.2]" />
              </div>
              <h2 className="text-xl font-bold tracking-tight text-slate-900">
                Knowledge Core
              </h2>
              <span className="text-[11px] font-medium text-indigo-700 bg-indigo-50/90 px-2.5 py-0.5 rounded-full border border-indigo-150/60 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Your source of truth
              </span>
            </div>
            <p className="text-xs text-slate-500">
              {activeSourceTitle 
                ? `Authoritative invariants extracted from "${activeSourceTitle}"`
                : 'Deterministic AST compiler preserving immutable facts across every generated story.'
              }
            </p>
          </div>

          {/* AI-Assisted Source Fidelity Indicator Card */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-gradient-to-r from-indigo-50/90 via-white to-violet-50/70 p-3.5 rounded-2xl border border-indigo-150/70 shadow-2xs shrink-0">
            <div className="flex items-center gap-3">
              {/* Clean Progress Meter */}
              <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
                <svg className="w-12 h-12 -rotate-90" viewBox="0 0 48 48">
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    fill="transparent"
                    stroke="#E2E8F0"
                    strokeWidth="3.5"
                  />
                  <circle
                    cx="24"
                    cy="24"
                    r="20"
                    fill="transparent"
                    stroke="url(#fidelityGradient)"
                    strokeWidth="3.5"
                    strokeDasharray={`${(fidelityScore / 100) * 125.6} 125.6`}
                    strokeLinecap="round"
                    className="transition-all duration-700 ease-out"
                  />
                  <defs>
                    <linearGradient id="fidelityGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#4F46E5" />
                      <stop offset="100%" stopColor="#8B5CF6" />
                    </linearGradient>
                  </defs>
                </svg>
                <ShieldCheck className="w-5 h-5 text-indigo-600 absolute stroke-[2.2]" />
              </div>

              <div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl font-bold font-mono tabular-nums text-slate-900">
                    {fidelityScore}%
                  </span>
                  <span className="text-xs font-semibold text-indigo-900">
                    AI-assisted source fidelity
                  </span>
                </div>
                {/* Measurable underlying metrics */}
                <div className="text-[11px] text-slate-500 font-mono mt-0.5 flex items-center gap-2 flex-wrap">
                  <span>{factsCount} facts</span>
                  <span>·</span>
                  <span>{statsCount} stats</span>
                  <span>·</span>
                  <span>{claimsCount} claims</span>
                  <span>·</span>
                  <span className={uncertaintiesCount > 0 ? 'text-amber-600 font-semibold' : 'text-emerald-600'}>
                    {uncertaintiesCount} uncertainties
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={onCompileArtifacts}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white text-xs font-semibold shadow-[0_2px_8px_rgba(79,70,229,0.25)] flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap self-stretch sm:self-auto justify-center"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Compile All</span>
            </button>
          </div>
        </div>

        {/* Filter Tabs and In-Core Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 pb-4">
          {/* Segmented Filter Control */}
          <div className="flex items-center gap-1 p-1 bg-slate-100/90 rounded-xl overflow-x-auto max-w-full">
            {categories.map((cat) => {
              const active = selectedCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  onClick={() => setSelectedCategory(cat.key)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    active
                      ? 'bg-white text-slate-900 shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>{cat.label}</span>
                  <span className={`text-[10px] font-mono px-1 rounded ${
                    active ? 'bg-indigo-50 text-indigo-700' : 'text-slate-400'
                  }`}>
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick Search */}
          <div className="relative w-full sm:w-60">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Search indexed claims..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200/80 rounded-xl focus:outline-none focus:border-indigo-300 transition-colors"
            />
          </div>
        </div>

        {/* Knowledge Items Grid / Scannable List */}
        <div className="space-y-2.5 mt-1 max-h-[380px] overflow-y-auto pr-1">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              No knowledge statements match your filter query.
            </div>
          ) : (
            filteredItems.map((item) => {
              const categoryColorMap: Record<string, string> = {
                facts: 'text-indigo-600 bg-indigo-50 border-indigo-150/60',
                claims: 'text-violet-600 bg-violet-50 border-violet-150/60',
                entities: 'text-sky-600 bg-sky-50 border-sky-150/60',
                statistics: 'text-emerald-700 bg-emerald-50 border-emerald-150/60',
                key_messages: 'text-amber-700 bg-amber-50 border-amber-150/60',
                uncertainties: 'text-rose-700 bg-rose-50 border-rose-150/60',
              };

              const isUncertainty = item.category === 'uncertainties';

              return (
                <div
                  key={item.id}
                  onClick={() => onInspectItem(item)}
                  className="group p-4 rounded-2xl bg-white hover:bg-gradient-to-r hover:from-white hover:to-indigo-50/30 border border-slate-200/70 hover:border-indigo-200/90 shadow-2xs hover:shadow-sm transition-all duration-150 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 cursor-pointer"
                >
                  <div className="flex-1 min-w-0 pr-2">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md border ${categoryColorMap[item.category] || 'text-slate-600 bg-slate-50 border-slate-200'}`}>
                        {item.category.replace('_', ' ')}
                      </span>
                      <span className="text-slate-300">·</span>
                      <span className="text-[11px] font-medium text-slate-500 truncate max-w-[220px]">
                        {item.sourceDoc}
                      </span>
                      <span className="text-slate-300">·</span>
                      <span className="text-[11px] font-mono text-slate-400">
                        {item.sourceLocation}
                      </span>
                    </div>

                    <p className="text-xs font-medium text-slate-800 leading-relaxed group-hover:text-slate-950">
                      {item.statement}
                    </p>

                    {/* Metadata line */}
                    <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400">
                      <span className={`flex items-center gap-1 font-medium ${isUncertainty ? 'text-amber-600' : 'text-emerald-600'}`}>
                        {isUncertainty ? (
                          <AlertTriangle className="w-3 h-3" />
                        ) : (
                          <CheckCircle2 className="w-3 h-3" />
                        )}
                        <span className="font-mono tabular-nums">{item.confidence}% confidence</span>
                      </span>
                      <span>·</span>
                      <span>Linked to {item.linkedArtifacts.length} artifacts</span>
                      <span>·</span>
                      <span className="text-indigo-600 font-medium group-hover:underline">
                        Trace claim ↗
                      </span>
                    </div>
                  </div>

                  {/* Right Action Affordance */}
                  <div className="shrink-0 flex items-center gap-2 self-end md:self-center">
                    <button
                      type="button"
                      aria-label="Inspect knowledge provenance"
                      onClick={(e) => {
                        e.stopPropagation();
                        onInspectItem(item);
                      }}
                      className="p-2 rounded-xl text-slate-400 group-hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
