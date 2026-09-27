import React from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Link2, 
  ArrowRight, 
  Sparkles, 
  FileSearch, 
  RotateCw,
  Users,
  Check,
  AlertCircle
} from 'lucide-react';
import { InconsistencyItem, AudienceGap } from '../types/dashboard';

interface VerificationSectionProps {
  inconsistencies: InconsistencyItem[];
  isVerifying?: boolean;
  verifiedClaimsCount?: number;
  verifiedStatsCount?: number;
  audienceGaps?: AudienceGap[];
  onRunVerification: () => void;
  onInspectInconsistencies: () => void;
  onAutoReconcile: () => void;
  onFillAudienceGap?: (gap: AudienceGap) => void;
}

export const VerificationSection: React.FC<VerificationSectionProps> = ({
  inconsistencies,
  isVerifying,
  verifiedClaimsCount = 42,
  verifiedStatsCount = 18,
  audienceGaps = [],
  onRunVerification,
  onInspectInconsistencies,
  onAutoReconcile,
  onFillAudienceGap
}) => {
  const unresolved = inconsistencies.filter(i => !i.resolved);

  return (
    <div className="space-y-4">
      <div className="bg-white/95 rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-[0_4px_24px_rgba(15,23,42,0.03)] relative overflow-hidden backdrop-blur-sm">
        {/* Subtle background ambient tint */}
        <div 
          className="absolute top-0 right-0 w-80 h-80 rounded-full pointer-events-none opacity-25 blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(167,243,208,0.4) 0%, rgba(224,231,255,0.2) 60%, transparent 80%)'
          }}
        ></div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-[0_2px_10px_rgba(16,185,129,0.25)]">
              <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold tracking-tight text-slate-900">
                  Consistency Guard
                </h3>
                <span className="text-[10px] font-mono font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
                  Real-Time Verification
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Continuously cross-checking all synthesized communication against source ground-truth.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={onRunVerification}
              disabled={isVerifying}
              className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-indigo-700 border border-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer disabled:opacity-60"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isVerifying ? 'animate-spin text-indigo-600' : ''}`} />
              <span>{isVerifying ? 'Running Consistency Guard...' : 'Run Consistency Guard'}</span>
            </button>

            {unresolved.length > 0 ? (
              <button
                onClick={onInspectInconsistencies}
                className="px-3.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100/80 text-amber-800 border border-amber-200 text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>Review {unresolved.length} Inconsistencies</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50/90 px-3 py-1.5 rounded-xl border border-emerald-200/60">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>All Channels In Sync</span>
              </div>
            )}
          </div>
        </div>

        {/* 4 Pillars of Verification */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-5">
          {/* Supported Claims */}
          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/60 flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-emerald-100/80 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-medium text-slate-500">Supported Claims</div>
              <div className="text-xl font-bold font-mono tabular-nums text-slate-900 mt-0.5">
                {verifiedClaimsCount} <span className="text-xs font-normal text-emerald-700 font-sans">verified</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Backed by source token hashes</p>
            </div>
          </div>

          {/* Verified Statistics */}
          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/60 flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-indigo-100/80 text-indigo-700 flex items-center justify-center shrink-0 mt-0.5">
              <FileSearch className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-medium text-slate-500">Verified Statistics</div>
              <div className="text-xl font-bold font-mono tabular-nums text-slate-900 mt-0.5">
                {verifiedStatsCount} <span className="text-xs font-normal text-indigo-700 font-sans">cross-checked</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Zero numeric variance</p>
            </div>
          </div>

          {/* Source-Linked Content */}
          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/60 flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-sky-100/80 text-sky-700 flex items-center justify-center shrink-0 mt-0.5">
              <Link2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-medium text-slate-500">Source-Linked Content</div>
              <div className="text-xl font-bold font-mono tabular-nums text-slate-900 mt-0.5">
                100% <span className="text-xs font-normal text-sky-700 font-sans">cited</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Interactive claim provenance</p>
            </div>
          </div>

          {/* Potential Inconsistencies */}
          <div className={`p-4 rounded-2xl border transition-all flex items-start gap-3 ${
            unresolved.length > 0 
              ? 'bg-amber-50/60 border-amber-200/80' 
              : 'bg-slate-50/80 border-slate-200/60'
          }`}>
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
              unresolved.length > 0 
                ? 'bg-amber-100 text-amber-700' 
                : 'bg-emerald-100 text-emerald-700'
            }`}>
              {unresolved.length > 0 ? (
                <AlertTriangle className="w-4 h-4" />
              ) : (
                <Check className="w-4 h-4" />
              )}
            </div>
            <div>
              <div className="text-xs font-medium text-slate-500">Inconsistencies</div>
              <div className="text-xl font-bold font-mono tabular-nums text-slate-900 mt-0.5">
                {unresolved.length}{' '}
                <span className={`text-xs font-normal font-sans ${
                  unresolved.length > 0 ? 'text-amber-700 font-semibold' : 'text-emerald-700'
                }`}>
                  {unresolved.length > 0 ? 'need review' : 'zero drift'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                {unresolved.length > 0 ? 'Review diff with raw source' : 'All assets pristine'}
              </p>
            </div>
          </div>
        </div>

        {/* Highlight Inconsistency Banner if any */}
        {unresolved.length > 0 && (
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-50/80 via-white to-amber-50/50 border border-amber-200/70 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0"></span>
              <div>
                <span className="font-semibold text-slate-900">
                  Drift Flagged in {unresolved[0].artifactTitle}:
                </span>{' '}
                <span className="text-slate-600">
                  "{unresolved[0].generatedClaim}" contradicts {unresolved[0].sourceDoc} ({unresolved[0].sourcePage}).
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
              <button
                onClick={onAutoReconcile}
                className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-medium transition-colors shadow-2xs cursor-pointer"
              >
                Reconcile to Source Truth
              </button>
              <button
                onClick={onInspectInconsistencies}
                className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold transition-colors shadow-2xs cursor-pointer"
              >
                Inspect Diff
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Audience Gap Analysis Box (Requirement #17) */}
      {audienceGaps.length > 0 && (
        <div className="bg-gradient-to-br from-indigo-50/80 via-white to-violet-50/60 rounded-3xl p-5 border border-indigo-150/80 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-indigo-100/70">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">
                  Audience Gap Analysis
                </h4>
                <p className="text-[11px] text-slate-500">
                  Stakeholder groups affected by this information who lack targeted communication.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2 mt-3 text-xs">
            {audienceGaps.map((gap, i) => (
              <div key={i} className="p-3.5 rounded-2xl bg-white border border-slate-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-indigo-950">{gap.audience}</span>
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                      Unaddressed Stakeholder
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px] mt-0.5">
                    {gap.reason}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onFillAudienceGap?.(gap)}
                  className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100/80 text-indigo-700 font-semibold text-xs border border-indigo-200/60 whitespace-nowrap self-start sm:self-auto cursor-pointer"
                >
                  Generate {gap.suggested_artifact}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
