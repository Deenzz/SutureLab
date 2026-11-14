import React, { useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, ClipboardList, ShieldAlert, Stethoscope } from 'lucide-react';
import { TriageInput } from '../types/clinical';
import { evaluateClinicalTriage } from '../utils/clinicalEngine';

export const DifferentialTriageView: React.FC = () => {
  const [input, setInput] = useState<TriageInput>({
    hoursSinceInjury: 3,
    anatomicalRegion: 'upper_limb',
    woundMechanism: 'incised',
    contamination: 'clean',
    exposedDeepStructures: [],
    estimatedBloodLossMl: 150,
    suspectedGlassOrRadioOpaqueFB: false,
    isPediatric: false
  });

  const evaluation = useMemo(() => evaluateClinicalTriage(input), [input]);

  const toggleDeepStructure = (
    item: TriageInput['exposedDeepStructures'][number]
  ) => {
    setInput((prev) => {
      const exists = prev.exposedDeepStructures.includes(item);
      return {
        ...prev,
        exposedDeepStructures: exists
          ? prev.exposedDeepStructures.filter((x) => x !== item)
          : [...prev.exposedDeepStructures, item]
      };
    });
  };

  const applyPresetScenario = (preset: 'clean_gp' | 'deep_tendon' | 'dirty_15h' | 'cat_hand') => {
    if (preset === 'clean_gp') {
      setInput({
        hoursSinceInjury: 2,
        anatomicalRegion: 'face',
        woundMechanism: 'incised',
        contamination: 'clean',
        exposedDeepStructures: [],
        estimatedBloodLossMl: 40,
        suspectedGlassOrRadioOpaqueFB: false,
        isPediatric: true
      });
    } else if (preset === 'deep_tendon') {
      setInput({
        hoursSinceInjury: 1,
        anatomicalRegion: 'hand_digit',
        woundMechanism: 'incised',
        contamination: 'clean_contaminated',
        exposedDeepStructures: ['tendon', 'nerve'],
        estimatedBloodLossMl: 250,
        suspectedGlassOrRadioOpaqueFB: true,
        isPediatric: false
      });
    } else if (preset === 'dirty_15h') {
      setInput({
        hoursSinceInjury: 15,
        anatomicalRegion: 'lower_limb',
        woundMechanism: 'laceration_crush',
        contamination: 'contaminated',
        exposedDeepStructures: [],
        estimatedBloodLossMl: 120,
        suspectedGlassOrRadioOpaqueFB: false,
        isPediatric: false
      });
    } else {
      setInput({
        hoursSinceInjury: 4,
        anatomicalRegion: 'hand_digit',
        woundMechanism: 'bite',
        contamination: 'contaminated',
        exposedDeepStructures: ['joint_capsule'],
        estimatedBloodLossMl: 30,
        suspectedGlassOrRadioOpaqueFB: false,
        isPediatric: false
      });
    }
  };

  const urgencyBannerStyle = () => {
    switch (evaluation.urgency) {
      case 'IMMEDIATE_SURGICAL_CONSULT':
        return 'bg-rose-50 border-rose-300 text-rose-900 dark:bg-rose-950/50 dark:border-rose-800 dark:text-rose-100';
      case 'URGENT_DELAYED_CLOSURE':
        return 'bg-amber-50 border-amber-300 text-amber-900 dark:bg-amber-950/50 dark:border-amber-800 dark:text-amber-100';
      case 'CONSERVATIVE_SECONDARY':
        return 'bg-sky-50 border-sky-300 text-sky-900 dark:bg-sky-950/50 dark:border-sky-800 dark:text-sky-100';
      default:
        return 'bg-emerald-50 border-emerald-300 text-emerald-900 dark:bg-emerald-950/50 dark:border-emerald-800 dark:text-emerald-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick Clinical Vignette Presets */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
            Differential Diagnosis & Surgical Consultation Triage Simulator
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Configure clinical findings to determine Primary Clinic Closure vs. Delayed Closure vs. Immediate OR Surgical Consultation.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => applyPresetScenario('clean_gp')}
            className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
          >
            Preset: Pediatric Face Cut
          </button>
          <button
            type="button"
            data-testid="preset-deep-tendon"
            onClick={() => applyPresetScenario('deep_tendon')}
            className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200 border border-rose-200 dark:border-rose-800 hover:bg-rose-100 cursor-pointer"
          >
            Preset: Glass Wrist Tendon/Nerve
          </button>
          <button
            type="button"
            onClick={() => applyPresetScenario('dirty_15h')}
            className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 cursor-pointer"
          >
            Preset: 15h Dirty Calf
          </button>
          <button
            type="button"
            onClick={() => applyPresetScenario('cat_hand')}
            className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
          >
            Preset: Hand Joint Bite
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Clinical Parameters Form */}
        <div className="lg:col-span-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <ClipboardList className="w-4 h-4 text-sky-600" />
            1. Wound Examination Parameters
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Hours Since Injury: <span className="font-mono text-sky-600">{input.hoursSinceInjury}h</span>
              <input
                type="range"
                min={0.5}
                max={48}
                step={0.5}
                value={input.hoursSinceInjury}
                onChange={(e) => setInput((p) => ({ ...p, hoursSinceInjury: Number(e.target.value) }))}
                className="w-full mt-1.5 accent-sky-600 cursor-pointer"
              />
            </label>

            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Est. Blood Loss: <span className="font-mono text-rose-600">{input.estimatedBloodLossMl} mL</span>
              <input
                type="range"
                min={10}
                max={2400}
                step={25}
                value={input.estimatedBloodLossMl}
                onChange={(e) => setInput((p) => ({ ...p, estimatedBloodLossMl: Number(e.target.value) }))}
                className="w-full mt-1.5 accent-rose-600 cursor-pointer"
              />
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <label className="block">
              <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Region</span>
              <select
                value={input.anatomicalRegion}
                onChange={(e) =>
                  setInput((p) => ({ ...p, anatomicalRegion: e.target.value as TriageInput['anatomicalRegion'] }))
                }
                className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              >
                <option value="face">Face / Eyelid</option>
                <option value="scalp">Scalp</option>
                <option value="upper_limb">Upper Limb</option>
                <option value="hand_digit">Hand / Digit (End-Artery)</option>
                <option value="trunk">Trunk</option>
                <option value="lower_limb">Lower Limb / Joint</option>
              </select>
            </label>

            <label className="block">
              <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Mechanism</span>
              <select
                value={input.woundMechanism}
                onChange={(e) =>
                  setInput((p) => ({ ...p, woundMechanism: e.target.value as TriageInput['woundMechanism'] }))
                }
                className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              >
                <option value="incised">Clean Incised (Knife)</option>
                <option value="laceration_crush">Laceration / Crush</option>
                <option value="puncture">Puncture (Nail/Needle)</option>
                <option value="bite">Animal / Human Bite</option>
                <option value="gunshot">Gunshot / Ballistic</option>
                <option value="abscess">Fluctuant Abscess</option>
              </select>
            </label>

            <label className="block">
              <span className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Contamination</span>
              <select
                value={input.contamination}
                onChange={(e) =>
                  setInput((p) => ({ ...p, contamination: e.target.value as TriageInput['contamination'] }))
                }
                className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
              >
                <option value="clean">Clean</option>
                <option value="clean_contaminated">Clean-Contaminated</option>
                <option value="contaminated">Contaminated (Soil/Debris)</option>
                <option value="infected_pus">Infected (Pus Present)</option>
              </select>
            </label>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
            <span className="block text-xs font-bold text-rose-700 dark:text-rose-400">
              Deep Structure Exposure / Injury Findings (Check all detected)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              {(
                [
                  { id: 'tendon', label: 'Tendon / Sheath' },
                  { id: 'nerve', label: 'Peripheral Nerve' },
                  { id: 'major_vessel', label: 'Major Artery' },
                  { id: 'bone_fracture', label: 'Bone / Fracture' },
                  { id: 'joint_capsule', label: 'Joint Capsule' },
                  { id: 'body_cavity', label: 'Thorax / Abdomen' }
                ] as const
              ).map((item) => {
                const active = input.exposedDeepStructures.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    data-testid={`triage-deep-${item.id}`}
                    onClick={() => toggleDeepStructure(item.id)}
                    className={`p-2 rounded-lg border text-left font-medium cursor-pointer transition-colors ${
                      active
                        ? 'bg-rose-600 text-white border-rose-600'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {active ? '✓ ' : '+ '}
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-wrap gap-4 pt-2 border-t border-slate-200 dark:border-slate-800 text-xs">
            <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={input.suspectedGlassOrRadioOpaqueFB}
                onChange={(e) => setInput((p) => ({ ...p, suspectedGlassOrRadioOpaqueFB: e.target.checked }))}
                className="rounded accent-sky-600 w-4 h-4"
              />
              Glass / Metal Foreign Body Risk (X-ray check)
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={input.isPediatric}
                onChange={(e) => setInput((p) => ({ ...p, isPediatric: e.target.checked }))}
                className="rounded accent-sky-600 w-4 h-4"
              />
              Pediatric Patient (Reduce Suture Gauge)
            </label>
          </div>
        </div>

        {/* Right Clinical Decision Output */}
        <div className="lg:col-span-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Stethoscope className="w-4 h-4 text-sky-600" />
            2. Automated Clinical Triage & Protocol Output
          </h3>

          <div data-testid="triage-result-banner" className={`p-4 rounded-xl border ${urgencyBannerStyle()}`}>
            <div className="flex items-center gap-2 text-sm font-bold">
              {evaluation.urgency === 'IMMEDIATE_SURGICAL_CONSULT' ? (
                <ShieldAlert className="w-5 h-5 shrink-0" />
              ) : (
                <CheckCircle2 className="w-5 h-5 shrink-0" />
              )}
              {evaluation.headline}
            </div>
            <div className="text-xs mt-1.5 font-mono">
              Hemorrhage Status: {evaluation.hemorrhageClass} · Strategy: {evaluation.closureStrategy}
            </div>
          </div>

          <div className="space-y-1.5 text-xs">
            <h4 className="font-bold uppercase tracking-wider text-slate-500">Clinical Rationale</h4>
            {evaluation.rationaleBullets.map((b, i) => (
              <div key={i} className="text-slate-700 dark:text-slate-300">
                • {b}
              </div>
            ))}
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-xs font-mono space-y-1">
            <div>
              <span className="text-slate-500">Anesthesia:</span>{' '}
              <span className="text-slate-900 dark:text-slate-100">{evaluation.anesthesiaWarning}</span>
            </div>
            <div>
              <span className="text-slate-500">Material / Gauge:</span>{' '}
              <span className="text-sky-700 dark:text-sky-400 font-semibold">
                {evaluation.recommendedSuture.material} · {evaluation.recommendedSuture.gauge}
              </span>
            </div>
            <div>
              <span className="text-slate-500">Needle & Removal:</span>{' '}
              <span className="text-slate-900 dark:text-slate-100">
                {evaluation.recommendedSuture.needle} · {evaluation.recommendedSuture.removalDays}
              </span>
            </div>
          </div>

          <div className="space-y-1.5 text-xs">
            <h4 className="font-bold uppercase tracking-wider text-slate-500">Mandatory Next Actions</h4>
            {evaluation.mandatoryActions.map((a, i) => (
              <div key={i} className="text-emerald-700 dark:text-emerald-300">
                ✓ {a}
              </div>
            ))}
          </div>

          <div className="p-3 rounded-lg bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-xs space-y-1">
            <div className="font-bold text-rose-800 dark:text-rose-200 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              Strict Contraindications
            </div>
            {evaluation.contraindications.map((c, i) => (
              <div key={i} className="text-rose-700 dark:text-rose-300">
                ✕ {c}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
