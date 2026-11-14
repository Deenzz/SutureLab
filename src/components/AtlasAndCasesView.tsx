import React, { useMemo, useState } from 'react';
import {
  AlertTriangle,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  Layers,
  ShieldAlert,
  Stethoscope
} from 'lucide-react';
import { ANATOMICAL_STRUCTURES } from '../data/anatomyData';
import { CLINICAL_CASES } from '../data/clinicalCases';
import { BookmarkItem, ClinicalCaseScenario, Wound3DMode } from '../types/clinical';
import { AnatomyViewport3D } from './AnatomyViewport3D';

interface AtlasAndCasesViewProps {
  selectedAnatomyId: string;
  onSelectAnatomy: (id: string) => void;
  selectedCaseId: string;
  onSelectCase: (id: string) => void;
  woundMode: Wound3DMode;
  onChangeWoundMode: (mode: Wound3DMode) => void;
  isDark: boolean;
  bookmarks: BookmarkItem[];
  onToggleBookmark: (item: Omit<BookmarkItem, 'savedAt'>) => void;
  onMarkAnatomyInspected: (id: string) => void;
  onMarkCaseReviewed: (id: string) => void;
  reviewedCaseIds: string[];
}

export const AtlasAndCasesView: React.FC<AtlasAndCasesViewProps> = ({
  selectedAnatomyId,
  onSelectAnatomy,
  selectedCaseId,
  onSelectCase,
  woundMode,
  onChangeWoundMode,
  isDark,
  bookmarks,
  onToggleBookmark,
  onMarkAnatomyInspected,
  onMarkCaseReviewed,
  reviewedCaseIds
}) => {
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [inspectorTab, setInspectorTab] = useState<'case' | 'anatomy'>('case');

  const activeAnatomy = useMemo(
    () => ANATOMICAL_STRUCTURES.find((a) => a.id === selectedAnatomyId) ?? ANATOMICAL_STRUCTURES[0],
    [selectedAnatomyId]
  );

  const activeCase: ClinicalCaseScenario = useMemo(
    () => CLINICAL_CASES.find((c) => c.id === selectedCaseId) ?? CLINICAL_CASES[0],
    [selectedCaseId]
  );

  const categories = useMemo(
    () => ['ALL', ...Array.from(new Set(CLINICAL_CASES.map((c) => c.category)))],
    []
  );

  const filteredCases = useMemo(
    () => (categoryFilter === 'ALL' ? CLINICAL_CASES : CLINICAL_CASES.filter((c) => c.category === categoryFilter)),
    [categoryFilter]
  );

  const handleChooseCase = (c: ClinicalCaseScenario) => {
    onSelectCase(c.id);
    onChangeWoundMode(c.wound3DMode);
    onMarkCaseReviewed(c.id);
    if (c.exposedStructures.length > 0) {
      const deepTarget = c.exposedStructures[c.exposedStructures.length - 1];
      onSelectAnatomy(deepTarget);
      onMarkAnatomyInspected(deepTarget);
    }
    setInspectorTab('case');
  };

  const handleAnatomyClickFrom3D = (id: string) => {
    onSelectAnatomy(id);
    onMarkAnatomyInspected(id);
    setInspectorTab('anatomy');
  };

  const isCaseBookmarked = bookmarks.some((b) => b.id === `case:${activeCase.id}`);
  const isAnatomyBookmarked = bookmarks.some((b) => b.id === `anatomy:${activeAnatomy.id}`);

  const urgencyBadgeStyles = (decision: ClinicalCaseScenario['triageDecision']) => {
    switch (decision) {
      case 'IMMEDIATE_SURGICAL_CONSULT':
        return 'bg-rose-50 text-rose-800 border-rose-300 dark:bg-rose-950/60 dark:text-rose-200 dark:border-rose-800';
      case 'URGENT_DELAYED_CLOSURE':
        return 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-200 dark:border-amber-800';
      case 'CLINIC_PRIMARY_REPAIR':
        return 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-200 dark:border-emerald-800';
      default:
        return 'bg-sky-50 text-sky-800 border-sky-300 dark:bg-sky-950/60 dark:text-sky-200 dark:border-sky-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Clinical Scenario Filter & Horizontal Selector Strip */}
      <section className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Emergency & General Practice Clinical Cases ({CLINICAL_CASES.length})
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Select a scenario to synchronize the 3D wound pathology, deep structure exposure findings, and management protocol.
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer transition-colors border ${
                  categoryFilter === cat
                    ? 'bg-sky-600 text-white border-sky-600'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                {cat === 'ALL' ? 'All Scenarios' : cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-2.5 overflow-x-auto pb-1.5">
          {filteredCases.map((c) => {
            const isActive = c.id === activeCase.id;
            const isReviewed = reviewedCaseIds.includes(c.id);
            const isSurgical = c.triageDecision === 'IMMEDIATE_SURGICAL_CONSULT';
            return (
              <button
                key={c.id}
                type="button"
                data-testid={`case-card-${c.id}`}
                onClick={() => handleChooseCase(c)}
                className={`text-left p-2.5 rounded-lg border transition-all cursor-pointer flex flex-col justify-between gap-1 shrink-0 w-[230px] ${
                  isActive
                    ? 'border-sky-500 bg-sky-50/70 dark:bg-sky-950/40 ring-1 ring-sky-500'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/40 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-1.5">
                  <span
                    className={`text-[10px] font-semibold uppercase tracking-wider truncate ${
                      isSurgical ? 'text-rose-600 dark:text-rose-400' : 'text-sky-700 dark:text-sky-400'
                    }`}
                  >
                    {isSurgical ? '▲ SURGICAL CONSULT' : c.setting}
                  </span>
                  {isReviewed && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                </div>
                <div className="text-xs font-semibold text-slate-900 dark:text-slate-100 line-clamp-1">
                  {c.title}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono truncate">
                  {c.depthGrade.split(' ')[0]} {c.depthGrade.split(' ')[1]} · {c.contaminationClass}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Main Two-Zone Interactive Sandbox: 3D Stage (Left 60%) + Clinical Inspector Deck (Right 40%) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        <div className="xl:col-span-7 space-y-3">
          <AnatomyViewport3D
            woundMode={woundMode}
            selectedAnatomyId={selectedAnatomyId}
            onSelectAnatomy={handleAnatomyClickFrom3D}
            onChangeWoundMode={onChangeWoundMode}
            isDark={isDark}
          />

          {/* Quick Anatomical Layer Strip below viewport (keeps viewport center clear) */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-sky-600" />
                Anatomical Layers & Deep Exposure Targets (Click to Inspect)
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                ▲ Red markers require urgent surgical consultation when exposed
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {ANATOMICAL_STRUCTURES.map((a) => {
                const isSelected = a.id === activeAnatomy.id;
                const isCritical = a.deepExposureRisk === 'CRITICAL_SURGICAL_CONSULT';
                return (
                  <button
                    key={a.id}
                    type="button"
                    data-testid={`anatomy-chip-${a.id}`}
                    onClick={() => handleAnatomyClickFrom3D(a.id)}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer border transition-colors ${
                      isSelected
                        ? 'bg-sky-600 text-white border-sky-600'
                        : isCritical
                          ? 'bg-rose-50/70 dark:bg-rose-950/30 text-rose-800 dark:text-rose-200 border-rose-200 dark:border-rose-900 hover:bg-rose-100 dark:hover:bg-rose-950/60'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {isCritical ? '▲ ' : ''}
                    {a.name.split(' (')[0]}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Clinical Findings, Differential & Anatomy Inspector */}
        <div className="xl:col-span-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
          <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
            <button
              type="button"
              data-testid="inspector-tab-case"
              onClick={() => setInspectorTab('case')}
              className={`flex-1 py-3 px-4 text-xs font-semibold cursor-pointer flex items-center justify-center gap-2 border-b-2 transition-colors ${
                inspectorTab === 'case'
                  ? 'border-sky-600 text-sky-700 dark:text-sky-400 bg-white dark:bg-slate-900'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Stethoscope className="w-4 h-4" />
              Case Findings & Protocol
            </button>
            <button
              type="button"
              data-testid="inspector-tab-anatomy"
              onClick={() => setInspectorTab('anatomy')}
              className={`flex-1 py-3 px-4 text-xs font-semibold cursor-pointer flex items-center justify-center gap-2 border-b-2 transition-colors ${
                inspectorTab === 'anatomy'
                  ? 'border-sky-600 text-sky-700 dark:text-sky-400 bg-white dark:bg-slate-900'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <Layers className="w-4 h-4" />
              Selected Tissue Layer
            </button>
          </div>

          {inspectorTab === 'case' ? (
            <div className="p-5 space-y-4 max-h-[640px] overflow-y-auto">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-xs font-mono text-slate-500 dark:text-slate-400">
                    {activeCase.latinClassification}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                    {activeCase.title}
                  </h3>
                </div>
                <button
                  type="button"
                  data-testid="bookmark-case-btn"
                  onClick={() =>
                    onToggleBookmark({
                      id: `case:${activeCase.id}`,
                      type: 'case',
                      title: activeCase.title,
                      subtitle: activeCase.triageBadgeLabel,
                      targetTab: 'atlas',
                      targetId: `case:${activeCase.id}`
                    })
                  }
                  className={`p-2 rounded-lg border cursor-pointer shrink-0 ${
                    isCaseBookmarked
                      ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                  title={isCaseBookmarked ? 'Remove Bookmark' : 'Bookmark Case'}
                >
                  {isCaseBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                </button>
              </div>

              {/* Triage Disposition Banner */}
              <div className={`p-3 rounded-lg border ${urgencyBadgeStyles(activeCase.triageDecision)}`}>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide">
                  {activeCase.triageDecision === 'IMMEDIATE_SURGICAL_CONSULT' ? (
                    <ShieldAlert className="w-4 h-4 shrink-0" />
                  ) : (
                    <ClipboardCheck className="w-4 h-4 shrink-0" />
                  )}
                  {activeCase.triageBadgeLabel}
                </div>
                <p className="text-xs mt-1 opacity-90">{activeCase.timeWindowRule}</p>
              </div>

              {/* Vignette & Hemodynamics */}
              <div className="space-y-2">
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {activeCase.patientVignette}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-xs">
                  <div className="p-2 rounded bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] text-slate-500 block">HR</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">{activeCase.vitalSigns.hr}</span>
                  </div>
                  <div className="p-2 rounded bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] text-slate-500 block">BP</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">{activeCase.vitalSigns.bp}</span>
                  </div>
                  <div className="p-2 rounded bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] text-slate-500 block">Cap Refill</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">{activeCase.vitalSigns.capRefill}</span>
                  </div>
                  <div className="p-2 rounded bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700">
                    <span className="text-[10px] text-slate-500 block">Hemorrhage</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">{activeCase.vitalSigns.hemorrhageClass}</span>
                  </div>
                </div>
              </div>

              {/* Key Findings & Red Flags */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Key Detection Findings
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                  {activeCase.keyFindingsToDetect.map((f, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-sky-600 dark:text-sky-400 font-bold">•</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Differential Diagnosis Workflow */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Differential Diagnosis & Escalation Triggers
                </h4>
                <div className="space-y-2">
                  {activeCase.differentialDiagnoses.map((ddx, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 text-xs space-y-1"
                    >
                      <div className="font-semibold text-slate-900 dark:text-slate-100">{ddx.condition}</div>
                      <div className="text-slate-600 dark:text-slate-400">{ddx.distinguishingFeatures}</div>
                      <div className="text-sky-700 dark:text-sky-400 font-medium">Action: {ddx.actionIfConfirmed}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Wound Toilet & Closure Spec */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Wound Toilet & Closure Protocol
                </h4>
                <ol className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300 list-decimal list-inside">
                  {activeCase.woundToiletProtocol.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-1 font-mono">
                  <div>
                    <span className="text-slate-500">Closure:</span>{' '}
                    <span className="text-slate-900 dark:text-slate-100 font-semibold">{activeCase.closureAndSuturePlan.closureType}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Material & Gauge:</span>{' '}
                    <span className="text-slate-900 dark:text-slate-100">
                      {activeCase.closureAndSuturePlan.sutureMaterial} ({activeCase.closureAndSuturePlan.gauge})
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500">Needle & Technique:</span>{' '}
                    <span className="text-slate-900 dark:text-slate-100">
                      {activeCase.closureAndSuturePlan.needleType} · {activeCase.closureAndSuturePlan.technique}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500">Removal / Review:</span>{' '}
                    <span className="text-sky-700 dark:text-sky-400 font-semibold">{activeCase.closureAndSuturePlan.removalDays}</span>
                  </div>
                </div>
              </div>

              {/* Red Flags & PDF Citations */}
              <div className="p-3 rounded-lg bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/70 text-xs space-y-1">
                <div className="font-bold text-rose-800 dark:text-rose-200 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Red Flags Requiring Immediate Surgical Consultation
                </div>
                {activeCase.redFlagsForSurgicalConsult.map((rf, i) => (
                  <div key={i} className="text-rose-700 dark:text-rose-300">
                    • {rf}
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                <FileText className="w-3.5 h-3.5" />
                <span>Sources: {activeCase.pdfCitations.join(' · ')}</span>
              </div>
            </div>
          ) : (
            <div className="p-5 space-y-4 max-h-[640px] overflow-y-auto">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-xs font-mono text-slate-500 dark:text-slate-400">
                    Layer {activeAnatomy.depthOrder} · {activeAnatomy.latinName}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                    {activeAnatomy.name}
                  </h3>
                </div>
                <button
                  type="button"
                  data-testid="bookmark-anatomy-btn"
                  onClick={() =>
                    onToggleBookmark({
                      id: `anatomy:${activeAnatomy.id}`,
                      type: 'anatomy',
                      title: activeAnatomy.name,
                      subtitle: activeAnatomy.latinName,
                      targetTab: 'atlas',
                      targetId: activeAnatomy.id
                    })
                  }
                  className={`p-2 rounded-lg border cursor-pointer shrink-0 ${
                    isAnatomyBookmarked
                      ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300'
                      : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                  }`}
                  title={isAnatomyBookmarked ? 'Remove Bookmark' : 'Bookmark Structure'}
                >
                  {isAnatomyBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                </button>
              </div>

              <div
                className={`p-3 rounded-lg border text-xs font-semibold flex items-center gap-2 ${
                  activeAnatomy.deepExposureRisk === 'CRITICAL_SURGICAL_CONSULT'
                    ? 'bg-rose-50 text-rose-800 border-rose-300 dark:bg-rose-950/50 dark:text-rose-200 dark:border-rose-800'
                    : activeAnatomy.deepExposureRisk === 'MODERATE'
                      ? 'bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/50 dark:text-amber-200 dark:border-amber-800'
                      : 'bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/50 dark:text-emerald-200 dark:border-emerald-800'
                }`}
              >
                <ShieldAlert className="w-4 h-4 shrink-0" />
                {activeAnatomy.deepExposureRisk === 'CRITICAL_SURGICAL_CONSULT'
                  ? 'CRITICAL EXPOSURE: Immediate Surgical Consultation Required'
                  : activeAnatomy.deepExposureRisk === 'MODERATE'
                    ? 'MODERATE DEPTH: Explore Base Thoroughly Before Closure'
                    : 'SUPERFICIAL LAYER: Clinic Management Eligible (if Clean & <6–12h)'}
              </div>

              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{activeAnatomy.summary}</p>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                {activeAnatomy.histologyAndAnatomy}
              </p>

              <div className="space-y-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  How to Detect Clinical Findings
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                  {activeAnatomy.clinicalDetectionSigns.map((sign, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-sky-600 font-bold">•</span>
                      <span>{sign}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Wound Toilet & Suturing Rules
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                  {activeAnatomy.suturingAndToiletRules.map((rule, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Common Pathologies & Findings
                </h4>
                <div className="text-xs text-slate-700 dark:text-slate-300">
                  {activeAnatomy.commonFindings.join(' · ')}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                <FileText className="w-3.5 h-3.5" />
                <span>Sources: {activeAnatomy.pdfCitations.join(' · ')}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
