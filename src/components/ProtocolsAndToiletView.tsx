import React, { useMemo, useState } from 'react';
import {
  AlertOctagon,
  Bookmark,
  BookmarkCheck,
  Calculator,
  Droplets,
  Scissors,
  ShieldCheck
} from 'lucide-react';
import {
  BODY_REGION_SUTURE_RULES,
  HEMORRHAGE_CLASSES,
  STITCH_TECHNIQUES,
  SUTURE_MATERIALS,
  WOUND_TOILET_PROTOCOL_STEPS
} from '../data/protocolsData';
import { BookmarkItem } from '../types/clinical';
import { calculateLidocaineMaxVolume } from '../utils/clinicalEngine';
import { StitchDiagramSVG } from './StitchDiagramSVG';

interface ProtocolsAndToiletViewProps {
  initialSubTab?: 'toilet' | 'sutures' | 'stitches' | 'anesthesia';
  initialStitchId?: string;
  bookmarks: BookmarkItem[];
  onToggleBookmark: (item: Omit<BookmarkItem, 'savedAt'>) => void;
}

export const ProtocolsAndToiletView: React.FC<ProtocolsAndToiletViewProps> = ({
  initialSubTab = 'toilet',
  initialStitchId = 'simple_interrupted',
  bookmarks,
  onToggleBookmark
}) => {
  const [subTab, setSubTab] = useState<'toilet' | 'sutures' | 'stitches' | 'anesthesia'>(initialSubTab);
  const [selectedStitchId, setSelectedStitchId] = useState<string>(initialStitchId);

  // Anesthesia Calculator state
  const [weightKg, setWeightKg] = useState<number>(70);
  const [concentration, setConcentration] = useState<1 | 2>(1);
  const [withAdrenaline, setWithAdrenaline] = useState<boolean>(false);
  const [zone, setZone] = useState<'standard' | 'end_artery'>('standard');

  const lidocaineResult = useMemo(
    () =>
      calculateLidocaineMaxVolume({
        weightKg,
        withAdrenaline,
        concentrationPercent: concentration,
        anatomicalZone: zone
      }),
    [weightKg, withAdrenaline, concentration, zone]
  );

  const activeStitch = useMemo(
    () => STITCH_TECHNIQUES.find((s) => s.id === selectedStitchId) ?? STITCH_TECHNIQUES[0],
    [selectedStitchId]
  );

  const isStitchBookmarked = bookmarks.some((b) => b.id === `protocol:${activeStitch.id}`);

  return (
    <div className="space-y-6">
      {/* Sub-navigation Tabs */}
      <div className="flex flex-wrap gap-2 p-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-fit">
        {(
          [
            { id: 'toilet', label: 'Wound Toilet & Hemorrhage' },
            { id: 'stitches', label: 'Stitch & Knot Diagrams' },
            { id: 'sutures', label: 'Suture Materials & Gauges' },
            { id: 'anesthesia', label: 'Lidocaine Dose & Safety' }
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            data-testid={`protocol-subtab-${tab.id}`}
            onClick={() => setSubTab(tab.id)}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
              subTab === tab.id
                ? 'bg-sky-600 text-white'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 1. WOUND TOILET & HEMORRHAGE */}
      {subTab === 'toilet' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {WOUND_TOILET_PROTOCOL_STEPS.map((st) => (
              <div
                key={st.stepNumber}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 flex flex-col justify-between gap-3"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-mono text-xs font-bold text-sky-700 dark:text-sky-400">
                      STEP 0{st.stepNumber}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">{st.source}</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1.5">{st.title}</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{st.detail}</p>
                </div>
                <div className="p-2.5 rounded-lg bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 text-[11px] text-amber-900 dark:text-amber-200">
                  <span className="font-bold">Critical Rule:</span> {st.criticalNote}
                </div>
              </div>
            ))}
          </div>

          {/* Hemorrhage Classes I-IV Table */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 overflow-x-auto">
            <div className="flex items-center gap-2 mb-3">
              <Droplets className="w-4 h-4 text-rose-600" />
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Hemorrhage Classification & Resuscitation Triage (Pécs Ch. 5 / ATLS)
              </h3>
            </div>
            <table className="w-full text-left text-xs border-collapse min-w-[680px]">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase text-[11px]">
                  <th className="py-2 pr-3">Class</th>
                  <th className="py-2 pr-3">Blood Loss</th>
                  <th className="py-2 pr-3">Heart Rate</th>
                  <th className="py-2 pr-3">BP / MAP</th>
                  <th className="py-2 pr-3">Cap Refill</th>
                  <th className="py-2">Clinical Disposition</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70">
                {HEMORRHAGE_CLASSES.map((h) => (
                  <tr key={h.classLabel} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-2.5 pr-3 font-mono font-bold text-slate-900 dark:text-slate-100">{h.classLabel}</td>
                    <td className="py-2.5 pr-3 font-mono">{h.bloodLossMl}</td>
                    <td className="py-2.5 pr-3 font-mono">{h.heartRate}</td>
                    <td className="py-2.5 pr-3">{h.bloodPressure}</td>
                    <td className="py-2.5 pr-3 font-mono">{h.capRefill}</td>
                    <td className="py-2.5 text-slate-700 dark:text-slate-300">{h.management}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. STITCH & KNOT DIAGRAMS */}
      {subTab === 'stitches' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-4 space-y-2">
            {STITCH_TECHNIQUES.map((tech) => (
              <button
                key={tech.id}
                type="button"
                data-testid={`stitch-select-${tech.id}`}
                onClick={() => setSelectedStitchId(tech.id)}
                className={`w-full text-left p-3.5 rounded-xl border cursor-pointer transition-all ${
                  activeStitch.id === tech.id
                    ? 'border-sky-500 bg-sky-50/70 dark:bg-sky-950/40 ring-1 ring-sky-500'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                }`}
              >
                <div className="text-sm font-bold text-slate-900 dark:text-slate-100">{tech.name}</div>
                {tech.alias && <div className="text-[11px] text-sky-700 dark:text-sky-400">{tech.alias}</div>}
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{tech.plane}</div>
              </button>
            ))}
          </div>

          <div className="lg:col-span-8 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">{activeStitch.name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Plane: {activeStitch.plane} · Eversion: {activeStitch.eversonScore} · {activeStitch.pdfCitation}
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  onToggleBookmark({
                    id: `protocol:${activeStitch.id}`,
                    type: 'protocol',
                    title: activeStitch.name,
                    subtitle: activeStitch.plane,
                    targetTab: 'protocols',
                    targetId: `stitch:${activeStitch.id}`
                  })
                }
                className={`p-2 rounded-lg border cursor-pointer ${
                  isStitchBookmarked
                    ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-300 text-amber-700'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                {isStitchBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
              </button>
            </div>

            <StitchDiagramSVG diagramType={activeStitch.diagramType} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900">
                <h4 className="font-bold text-emerald-800 dark:text-emerald-300 mb-1.5">Indications</h4>
                <ul className="space-y-1 text-slate-700 dark:text-slate-300">
                  {activeStitch.indications.map((ind, i) => (
                    <li key={i}>• {ind}</li>
                  ))}
                </ul>
              </div>
              <div className="p-3.5 rounded-lg bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900">
                <h4 className="font-bold text-rose-800 dark:text-rose-300 mb-1.5">Contraindications / Avoid</h4>
                <ul className="space-y-1 text-slate-700 dark:text-slate-300">
                  {activeStitch.contraindications.map((c, i) => (
                    <li key={i}>• {c}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Step-by-Step Technique
              </h4>
              <ol className="space-y-2 text-xs text-slate-700 dark:text-slate-300 list-decimal list-inside">
                {activeStitch.steps.map((s, i) => (
                  <li key={i} className="leading-relaxed">
                    {s}
                  </li>
                ))}
              </ol>
            </div>

            <div className="p-3 rounded-lg bg-sky-50/60 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-900 text-xs space-y-1">
              <div className="font-bold text-sky-900 dark:text-sky-200">Clinical Pearls & Instrument Ergonomics</div>
              {activeStitch.pearls.map((p, i) => (
                <div key={i} className="text-slate-700 dark:text-slate-300">
                  • {p}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. SUTURE MATERIALS & BODY REGION GAUGES */}
      {subTab === 'sutures' && (
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 overflow-x-auto">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-3">
              Body Region Suture Gauges (Adult vs. Child) & Removal Timelines (Glasgow & BCEMN)
            </h3>
            <table className="w-full text-left text-xs border-collapse min-w-[680px]">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 uppercase text-[11px]">
                  <th className="py-2 pr-3">Region</th>
                  <th className="py-2 pr-3">Adult Gauge</th>
                  <th className="py-2 pr-3">Child Gauge</th>
                  <th className="py-2 pr-3">Material & Needle</th>
                  <th className="py-2 pr-3">Removal Window</th>
                  <th className="py-2">Key Clinical Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {BODY_REGION_SUTURE_RULES.map((r) => (
                  <tr key={r.region} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-2.5 pr-3 font-semibold text-slate-900 dark:text-slate-100">{r.region}</td>
                    <td className="py-2.5 pr-3 font-mono font-semibold text-sky-700 dark:text-sky-400">{r.adultGauge}</td>
                    <td className="py-2.5 pr-3 font-mono text-emerald-700 dark:text-emerald-400">{r.childGauge}</td>
                    <td className="py-2.5 pr-3 text-slate-700 dark:text-slate-300">
                      {r.recommendedMaterial} · {r.needleRecommendation}
                    </td>
                    <td className="py-2.5 pr-3 font-mono font-semibold">{r.removalTimeline}</td>
                    <td className="py-2.5 text-slate-600 dark:text-slate-400">{r.clinicalNotes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SUTURE_MATERIALS.map((mat) => (
              <div
                key={mat.id}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 space-y-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{mat.name}</h4>
                    <div className="text-[11px] font-mono text-slate-500">
                      {mat.genericComposition} · {mat.category} · {mat.filament}
                    </div>
                  </div>
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${
                      mat.tissueReaction === 'High (Avoid on Skin)'
                        ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800'
                        : 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
                    }`}
                  >
                    Reaction: {mat.tissueReaction}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono bg-slate-50 dark:bg-slate-950/50 p-2 rounded border border-slate-200 dark:border-slate-800">
                  <div>
                    <span className="text-slate-500 block">Tensile Strength</span>
                    <span className="text-slate-800 dark:text-slate-200">{mat.tensileStrengthDuration}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Absorption</span>
                    <span className="text-slate-800 dark:text-slate-200">{mat.absorptionDuration}</span>
                  </div>
                </div>
                <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1">
                  {mat.primaryIndications.map((ind, i) => (
                    <li key={i}>• {ind}</li>
                  ))}
                </ul>
                <p className="text-[11px] text-amber-800 dark:text-amber-300">{mat.contraindicationsOrNotes}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. LOCAL ANESTHESIA CALCULATOR & SAFETY */}
      {subTab === 'anesthesia' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-sky-600" />
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Lidocaine Safe Maximum Volume Calculator
              </h3>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Patient Weight: <span className="font-mono text-sky-600">{weightKg} kg</span>
                <input
                  type="range"
                  min={5}
                  max={130}
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  data-testid="lido-weight-slider"
                  className="w-full mt-1.5 accent-sky-600 cursor-pointer"
                />
              </label>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Lidocaine Concentration
                  </span>
                  <div className="flex gap-2">
                    {([1, 2] as const).map((pct) => (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => setConcentration(pct)}
                        className={`flex-1 py-2 rounded-lg text-xs font-mono font-semibold border cursor-pointer ${
                          concentration === pct
                            ? 'bg-sky-600 text-white border-sky-600'
                            : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {pct}% ({pct * 10} mg/mL)
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Anatomical Vascular Zone
                  </span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setZone('standard')}
                      className={`flex-1 py-2 rounded-lg text-xs font-semibold border cursor-pointer ${
                        zone === 'standard'
                          ? 'bg-sky-600 text-white border-sky-600'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      Standard
                    </button>
                    <button
                      type="button"
                      data-testid="lido-zone-end-artery"
                      onClick={() => setZone('end_artery')}
                      className={`flex-1 py-2 rounded-lg text-xs font-semibold border cursor-pointer ${
                        zone === 'end_artery'
                          ? 'bg-rose-600 text-white border-rose-600'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      Digit/Ear/Nose
                    </button>
                  </div>
                </div>
              </div>

              <label className="flex items-center gap-2.5 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={withAdrenaline}
                  onChange={(e) => setWithAdrenaline(e.target.checked)}
                  className="rounded accent-sky-600 w-4 h-4"
                />
                Include Adrenaline (Epinephrine) in calculation
              </label>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 grid grid-cols-3 gap-3 font-mono">
              <div>
                <span className="text-[11px] text-slate-500 block">Safe Ceiling</span>
                <span className="text-lg font-bold text-slate-900 dark:text-slate-100">{lidocaineResult.maxMgPerKg} mg/kg</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">Max Total Dose</span>
                <span className="text-lg font-bold text-slate-900 dark:text-slate-100">{lidocaineResult.maxTotalMg} mg</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">Max Volume</span>
                <span data-testid="lido-max-vol" className="text-lg font-bold text-sky-600 dark:text-sky-400">
                  {lidocaineResult.maxVolumeMl} mL
                </span>
              </div>
            </div>

            {lidocaineResult.safetyAlert && (
              <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 text-xs text-rose-800 dark:text-rose-200 flex items-start gap-2">
                <AlertOctagon className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{lidocaineResult.safetyAlert}</span>
              </div>
            )}
          </div>

          <div className="lg:col-span-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              Anesthesia Technique & Systemic Toxicity Recognition (Glasgow p. 7–10)
            </h3>
            <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
              <li>• <strong>Route:</strong> For clean open wounds, insert needle into subcutaneous tissue via the raw wound edge (less painful than piercing intact skin).</li>
              <li>• <strong>Inflamed/Infected Tissue:</strong> Do NOT inject directly into pus/cellulitis—acidic tissue neutralizes lidocaine and risks spreading bacteria. Use circumferential field block around healthy margin.</li>
              <li>• <strong>End-Artery Contraindication:</strong> NEVER use adrenaline in fingers, toes, pinna of ear, tip of nose, or penis.</li>
              <li>• <strong>Bupivacaine Alternative:</strong> Max 2 mg/kg plain (3 mg/kg with adrenaline); slower onset, longer analgesia.</li>
            </ul>
            <div className="p-3.5 rounded-lg bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-xs space-y-1">
              <div className="font-bold text-rose-800 dark:text-rose-200">Local Anesthetic Systemic Toxicity (LAST) Warning Signs</div>
              <p className="text-rose-700 dark:text-rose-300">
                Perioral tingling, metallic taste, tinnitus, lightheadedness, slurred speech → progressing to convulsions, respiratory arrest, severe bradycardia & cardiac collapse. Stop injection immediately, apply 100% O2, and initiate emergency resuscitation.
              </p>
            </div>
            <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-1">
              <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <Scissors className="w-3.5 h-3.5 text-sky-600" />
                Needle & Suture Removal Technique (Glasgow p. 25–26)
              </div>
              <p className="text-slate-600 dark:text-slate-300">
                Cleanse dried serum crust with antiseptic/H2O2. Lift knot gently with non-toothed forceps, cut flush BELOW the knot right at skin entry, and pull toward the opposite side so exposed outer thread NEVER drags through the clean stitch tract.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
