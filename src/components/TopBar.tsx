import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  ChevronDown, 
  Layers, 
  Check, 
  Sparkles, 
  ShieldAlert, 
  FileCheck,
  X
} from 'lucide-react';
import { Workspace } from '../types/dashboard';

interface TopBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  workspaces: Workspace[];
  currentWorkspace: Workspace;
  onSelectWorkspace: (ws: Workspace) => void;
  onOpenNewSource: () => void;
  discrepanciesCount: number;
}

export const TopBar: React.FC<TopBarProps> = ({
  searchQuery,
  onSearchChange,
  workspaces,
  currentWorkspace,
  onSelectWorkspace,
  onOpenNewSource,
  discrepanciesCount
}) => {
  const [workspaceMenuOpen, setWorkspaceMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const notifications = [
    {
      id: 'notif-1',
      title: 'Consistency Guard Flag',
      description: '2 claims in draft advisory deviate from Architecture Spec v3.4.',
      time: '14m ago',
      type: 'warning',
      icon: ShieldAlert
    },
    {
      id: 'notif-2',
      title: 'Transformation Complete',
      description: 'Executive Brief and LinkedIn Post compiled with 99.1% fidelity.',
      time: '42m ago',
      type: 'success',
      icon: Sparkles
    },
    {
      id: 'notif-3',
      title: 'Source Ingested',
      description: 'Elena Rostova uploaded Architecture Spec (84 facts indexed).',
      time: '2h ago',
      type: 'info',
      icon: FileCheck
    }
  ];

  return (
    <header className="h-16 px-8 flex items-center justify-between border-b border-slate-200/70 bg-white/70 backdrop-blur-md sticky top-0 z-30">
      {/* Search Input Bar (Zone 1) */}
      <div className="flex items-center gap-3 w-80">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search sources, claims, artifacts..."
            className="w-full pl-9 pr-14 py-2 bg-slate-100/80 hover:bg-slate-100 focus:bg-white border border-transparent focus:border-indigo-200 text-xs text-slate-800 placeholder:text-slate-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all duration-150"
          />
          {searchQuery ? (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 rounded"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono font-medium text-slate-400 bg-white/90 px-1.5 py-0.5 rounded border border-slate-200/60 pointer-events-none shadow-2xs">
              ⌘K
            </span>
          )}
        </div>
      </div>

      {/* Workspace Selector (Zone 2) */}
      <div className="relative">
        <button
          onClick={() => setWorkspaceMenuOpen(!workspaceMenuOpen)}
          className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-slate-200/80 bg-white/90 hover:bg-white text-xs text-slate-700 shadow-2xs transition-colors"
        >
          <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
          <span className="font-semibold text-slate-900 tracking-tight max-w-[200px] truncate">
            {currentWorkspace.name}
          </span>
          <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
            {currentWorkspace.code}
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </button>

        {/* Workspace Dropdown */}
        {workspaceMenuOpen && (
          <div className="absolute left-0 mt-2 w-72 bg-white rounded-2xl border border-slate-200 shadow-lg py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
            <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Switch Project Workspace
            </div>
            <div className="divide-y divide-slate-100">
              {workspaces.map((ws) => (
                <button
                  key={ws.id}
                  onClick={() => {
                    onSelectWorkspace(ws);
                    setWorkspaceMenuOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2.5 flex items-start justify-between text-xs hover:bg-slate-50 transition-colors ${
                    ws.id === currentWorkspace.id ? 'bg-indigo-50/50' : ''
                  }`}
                >
                  <div>
                    <div className="font-semibold text-slate-900">{ws.name}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{ws.description}</div>
                    <div className="text-[10px] text-slate-400 font-mono mt-1">{ws.sourceCount} indexed sources</div>
                  </div>
                  {ws.id === currentWorkspace.id && (
                    <Check className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Actions & User Profile (Zone 3) */}
      <div className="flex items-center gap-4">
        {/* Quick CTA */}
        <button
          onClick={onOpenNewSource}
          className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-indigo-700 bg-indigo-50/80 hover:bg-indigo-100/70 border border-indigo-200/60 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>Ingest Source</span>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {discrepanciesCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white"></span>
            )}
          </button>

          {/* Notifications Flyout */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl border border-slate-200 shadow-xl p-3 z-50 animate-in fade-in duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                <span className="text-xs font-semibold text-slate-900">Notifications & Audits</span>
                <span className="text-[11px] font-mono text-indigo-600">{notifications.length} updates</span>
              </div>
              <div className="space-y-2">
                {notifications.map((n) => {
                  const Icon = n.icon;
                  return (
                    <div 
                      key={n.id}
                      className="p-2.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors flex items-start gap-2.5 text-left"
                    >
                      <div className={`p-1.5 rounded-lg shrink-0 ${
                        n.type === 'warning' ? 'bg-amber-50 text-amber-600' :
                        n.type === 'success' ? 'bg-emerald-50 text-emerald-600' :
                        'bg-indigo-50 text-indigo-600'
                      }`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-slate-800">{n.title}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{n.time}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">{n.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="h-6 w-px bg-slate-200"></div>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-1">
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-600 text-white flex items-center justify-center text-xs font-bold tracking-tight shadow-xs">
              SC
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
          </div>
          <div className="text-left hidden lg:block">
            <div className="text-xs font-semibold text-slate-900 leading-tight">Sarah Chen</div>
            <div className="text-[11px] text-slate-400 leading-tight font-medium">Lead Compiler Architect</div>
          </div>
        </div>
      </div>
    </header>
  );
};
