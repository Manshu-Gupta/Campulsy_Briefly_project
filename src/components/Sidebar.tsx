import React from 'react';
import { 
  LayoutDashboard, 
  FileStack, 
  Cpu, 
  Sparkles, 
  ShieldCheck, 
  History, 
  Settings, 
  Layers,
  ArrowUpRight,
  Shield,
  HelpCircle
} from 'lucide-react';

export type NavTab = 
  | 'dashboard' 
  | 'sources' 
  | 'knowledge_core' 
  | 'transform' 
  | 'verification' 
  | 'history' 
  | 'settings';

interface SidebarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  discrepanciesCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  onTabChange,
  discrepanciesCount
}) => {
  const navItems: { id: NavTab; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string | number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'sources', label: 'Sources', icon: FileStack, badge: '5' },
    { id: 'knowledge_core', label: 'Knowledge Core', icon: Cpu },
    { id: 'transform', label: 'Transform', icon: Sparkles, badge: '7' },
    { id: 'verification', label: 'Verification', icon: ShieldCheck, badge: discrepanciesCount > 0 ? `${discrepanciesCount} review` : undefined },
    { id: 'history', label: 'History', icon: History },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 shrink-0 flex flex-col justify-between h-screen sticky top-0 px-4 py-6 border-r border-slate-200/70 bg-white/70 backdrop-blur-md select-none z-20">
      <div className="flex flex-col gap-6">
        {/* Briefly Brand Header */}
        <div className="px-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-[0_2px_8px_rgba(79,70,229,0.28)]">
              <Layers className="w-5 h-5 text-white stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-bold tracking-tight text-slate-900">Briefly</span>
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
              </div>
              <p className="text-[11px] font-medium text-slate-400 tracking-tight">Communication Compiler</p>
            </div>
          </div>
        </div>

        {/* Compiler Pipeline Status */}
        <div className="mx-2 px-3 py-2.5 rounded-xl bg-gradient-to-br from-indigo-50/70 to-violet-50/50 border border-indigo-100/60">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-semibold text-indigo-900 tracking-tight flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Zero-Drift Guard
            </span>
            <span className="text-[10px] font-mono tabular-nums text-indigo-700 bg-white/90 px-1.5 py-0.5 rounded shadow-xs border border-indigo-100/60">
              Active
            </span>
          </div>
          <p className="text-[11px] text-slate-500 leading-tight">
            Deterministic claim hash linked to source tokens
          </p>
        </div>

        {/* Navigation Section */}
        <nav className="flex flex-col gap-1">
          <div className="px-3 pb-1.5 pt-1 text-[11px] font-semibold text-slate-400 tracking-wider uppercase">
            Platform
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`group flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-50/90 to-violet-50/70 text-indigo-950 font-semibold border border-indigo-150/70 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon 
                    className={`w-4 h-4 transition-colors ${
                      isActive 
                        ? 'text-indigo-600 stroke-[2.2]' 
                        : 'text-slate-400 group-hover:text-slate-600'
                    }`} 
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[11px] font-medium px-2 py-0.5 rounded-md tabular-nums ${
                      item.id === 'verification' && discrepanciesCount > 0
                        ? 'bg-amber-100 text-amber-800 font-semibold'
                        : isActive
                        ? 'bg-indigo-100/80 text-indigo-700'
                        : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200/70'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer Info */}
      <div className="flex flex-col gap-3 pt-4 border-t border-slate-200/60">
        <div className="px-3 py-2.5 rounded-xl bg-slate-50/80 border border-slate-200/60">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-800 mb-1">
            <Shield className="w-3.5 h-3.5 text-indigo-600" />
            <span>Fidelity SLA</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1.5">
            <span>Overall Alignment</span>
            <span className="font-mono tabular-nums font-semibold text-slate-800">94.6%</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-200/80 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 w-[94.6%]"></div>
          </div>
        </div>

        <div className="flex items-center justify-between px-3 text-xs text-slate-400">
          <span className="text-[11px]">Briefly Core v3.4</span>
          <button 
            onClick={() => onTabChange('settings')}
            className="hover:text-slate-600 transition-colors flex items-center gap-1 text-[11px]"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Specs</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
