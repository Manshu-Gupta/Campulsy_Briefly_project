import React from 'react';
import { 
  FileText, 
  Sparkles, 
  Binary, 
  ShieldCheck, 
  MoreHorizontal,
  ArrowUpRight
} from 'lucide-react';
import { DashboardStats } from '../types/dashboard';

interface StatCardsProps {
  stats: DashboardStats;
  onCardClick?: (statType: string) => void;
}

export const StatCards: React.FC<StatCardsProps> = ({ stats, onCardClick }) => {
  const cards = [
    {
      id: 'sources',
      title: 'Sources Processed',
      icon: FileText,
      value: stats.sourcesProcessed,
      suffix: '',
      change: stats.sourcesChange,
      changeType: 'positive',
      subtext: '4 formats indexed'
    },
    {
      id: 'artifacts',
      title: 'Artifacts Generated',
      icon: Sparkles,
      value: stats.artifactsGenerated,
      suffix: '',
      change: `${stats.artifactsSyncedPercent}% in active sync`,
      changeType: 'neutral',
      subtext: 'across 7 channels'
    },
    {
      id: 'facts',
      title: 'Facts Extracted',
      icon: Binary,
      value: stats.factsExtracted,
      suffix: '',
      change: stats.factsNetWeekly,
      changeType: 'positive',
      subtext: '100% token hashed'
    },
    {
      id: 'fidelity',
      title: 'Source Fidelity',
      icon: ShieldCheck,
      value: stats.sourceFidelity,
      suffix: '%',
      change: stats.fidelityDelta,
      changeType: 'positive',
      subtext: 'Zero information drift'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            onClick={() => onCardClick?.(card.id)}
            className="group relative bg-white/90 hover:bg-white p-5 rounded-2xl border border-slate-200/70 hover:border-indigo-200/80 shadow-[0_2px_12px_rgba(15,23,42,0.03)] hover:shadow-[0_8px_24px_rgba(79,70,229,0.06)] transition-all duration-200 cursor-pointer backdrop-blur-sm"
          >
            {/* Top row: Icon + Title and menu */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-slate-100/90 group-hover:bg-indigo-50 text-slate-500 group-hover:text-indigo-600 flex items-center justify-center transition-colors">
                  <Icon className="w-3.5 h-3.5 stroke-[2.2]" />
                </div>
                <span className="text-xs font-medium text-slate-500 group-hover:text-slate-700 transition-colors">
                  {card.title}
                </span>
              </div>
              <button 
                type="button"
                aria-label="Card options"
                onClick={(e) => e.stopPropagation()} 
                className="text-slate-300 hover:text-slate-500 transition-colors p-1"
              >
                <MoreHorizontal className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Metric row */}
            <div className="flex items-baseline gap-1 mt-1 mb-2">
              <span className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900 font-mono tabular-nums">
                {card.value}
              </span>
              {card.suffix && (
                <span className="text-lg font-semibold text-slate-500 font-mono">
                  {card.suffix}
                </span>
              )}
            </div>

            {/* Bottom row: Trend badge & micro subtext */}
            <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-indigo-700">
                <span className="inline-block">
                  <ArrowUpRight className="w-3 h-3 text-emerald-600 inline" />
                </span>
                <span className="font-mono tabular-nums text-slate-600">{card.change}</span>
              </div>
              <span className="text-[11px] text-slate-400 font-normal">
                {card.subtext}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
