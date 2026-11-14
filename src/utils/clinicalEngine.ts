import { ANATOMICAL_STRUCTURES } from '../data/anatomyData';
import { CLINICAL_CASES } from '../data/clinicalCases';
import {
  BODY_REGION_SUTURE_RULES,
  QUIZ_QUESTIONS,
  STITCH_TECHNIQUES,
  SUTURE_MATERIALS
} from '../data/protocolsData';
import {
  QuizQuestion,
  SearchResultItem,
  StudyProgress,
  TriageEvaluation,
  TriageInput
} from '../types/clinical';

/**
 * Computes maximum safe Lidocaine 1% (10 mg/mL) or 2% (20 mg/mL) volume in mL
 * grounded in Glasgow Suturing Guide (p. 7-8).
 */
export function calculateLidocaineMaxVolume(params: {
  weightKg: number;
  withAdrenaline: boolean;
  concentrationPercent: 1 | 2;
  anatomicalZone: 'standard' | 'end_artery';
}): {
  maxMgPerKg: number;
  maxTotalMg: number;
  maxVolumeMl: number;
  adrenalineAllowed: boolean;
  safetyAlert: string | null;
} {
  const safeWeight = Math.max(3, Math.min(180, params.weightKg));
  const adrenalineAllowed = params.anatomicalZone !== 'end_artery';
  const effectiveAdrenaline = params.withAdrenaline && adrenalineAllowed;

  // Glasgow p. 7-8: Plain = 3-4 mg/kg (use conservative 3 mg/kg floor or 3.5; we return 3 mg/kg conservative ceiling, or 7 with adrenaline)
  const maxMgPerKg = effectiveAdrenaline ? 7 : 3;
  const maxTotalMg = Math.round(safeWeight * maxMgPerKg);
  const mgPerMl = params.concentrationPercent === 1 ? 10 : 20;
  const maxVolumeMl = Number((maxTotalMg / mgPerMl).toFixed(1));

  let safetyAlert: string | null = null;
  if (params.withAdrenaline && !adrenalineAllowed) {
    safetyAlert =
      'CONTRAINDICATED: Adrenaline must NEVER be used in end-arterial zones (fingers, toes, ears, nose, penis). Reverted calculation to plain lidocaine (3 mg/kg).';
  } else if (params.concentrationPercent === 2) {
    safetyAlert = '2% Lidocaine (20 mg/mL) reaches toxic mg ceiling in half the volume of 1% solution—aspirate and monitor closely.';
  }

  return {
    maxMgPerKg,
    maxTotalMg,
    maxVolumeMl,
    adrenalineAllowed,
    safetyAlert
  };
}

/**
 * Classifies hemorrhage severity (ATLS / Pécs Manual Ch. 5).
 */
export function classifyHemorrhage(estimatedBloodLossMl: number): 'Class I' | 'Class II' | 'Class III' | 'Class IV' {
  if (estimatedBloodLossMl > 2000) return 'Class IV';
  if (estimatedBloodLossMl >= 1500) return 'Class III';
  if (estimatedBloodLossMl >= 750) return 'Class II';
  return 'Class I';
}

/**
 * Clinical differential triage & closure strategy engine grounded in WHO, Pécs, and Glasgow PDFs.
 */
export function evaluateClinicalTriage(input: TriageInput): TriageEvaluation {
  const hemorrhageClass = classifyHemorrhage(input.estimatedBloodLossMl);
  const hasDeepExposure = input.exposedDeepStructures.length > 0;
  const isEndArtery = input.anatomicalRegion === 'hand_digit';

  const regionMap: Record<
    TriageInput['anatomicalRegion'],
    { material: string; adultGauge: string; childGauge: string; removal: string }
  > = {
    face: {
      material: input.isPediatric ? 'Monofilament Nylon / Vicryl Rapide / Tissue Glue' : 'Monofilament Nylon or Prolene',
      adultGauge: '5/0 – 6/0',
      childGauge: '6/0 – 7/0',
      removal: '3 – 5 days'
    },
    scalp: {
      material: 'Colored Nylon / Prolene or Surgical Staples',
      adultGauge: '3/0 – 4/0',
      childGauge: '4/0 – 5/0',
      removal: '7 – 10 days (up to 14d)'
    },
    trunk: {
      material: 'Nylon / Prolene skin (+ Vicryl deep dermal if gape)',
      adultGauge: '3/0',
      childGauge: '4/0',
      removal: '8 – 12 days'
    },
    upper_limb: {
      material: 'Monofilament Nylon or Prolene',
      adultGauge: '4/0',
      childGauge: '5/0',
      removal: '7 – 10 days'
    },
    hand_digit: {
      material: 'Monofilament Nylon (4/0–5/0)',
      adultGauge: '4/0 – 5/0',
      childGauge: '5/0',
      removal: '7 – 10 days'
    },
    lower_limb: {
      material: 'Monofilament Nylon / Prolene',
      adultGauge: '3/0',
      childGauge: '4/0',
      removal: '10 – 14 days'
    }
  };

  const rSpec = regionMap[input.anatomicalRegion];
  const recommendedGauge = input.isPediatric ? rSpec.childGauge : rSpec.adultGauge;

  const mandatoryActions: string[] = [
    'Document distal neurovascular, motor, and tendon status BEFORE injecting any local anesthetic.'
  ];
  const contraindications: string[] = [
    'Do NOT pour harsh skin antiseptics inside open wound cavity (use 0.9% normal saline internally).',
    'Do NOT suture subcutaneous fat directly (risk of ischemic fat necrosis).'
  ];
  const rationaleBullets: string[] = [];

  if (input.suspectedGlassOrRadioOpaqueFB) {
    mandatoryActions.push('Order plain X-ray before closure/transfer to rule out retained glass/metallic fragments.');
  }

  if (isEndArtery) {
    contraindications.push('NEVER use adrenaline (epinephrine) in digits/hand end-arteries—use 1% Lidocaine PLAIN.');
  }

  const anesthesiaWarning = isEndArtery
    ? '1% Lidocaine PLAIN ONLY (3–4 mg/kg max). Adrenaline strictly contraindicated in fingers/hand end-arteries.'
    : '1% Lidocaine plain via wound margins (3–4 mg/kg max; avoid injecting into inflamed/pus core).';

  // 1. Immediate Surgical Consultation Triggers
  if (
    hasDeepExposure ||
    hemorrhageClass === 'Class III' ||
    hemorrhageClass === 'Class IV' ||
    input.woundMechanism === 'gunshot' ||
    (input.woundMechanism === 'bite' && isEndArtery)
  ) {
    if (hasDeepExposure) {
      rationaleBullets.push(
        `Deep critical structure involvement detected (${input.exposedDeepStructures
          .map((s) => s.replace('_', ' '))
          .join(', ')}) mandates formal Operating Theatre exploration.`
      );
    }
    if (hemorrhageClass === 'Class III' || hemorrhageClass === 'Class IV') {
      rationaleBullets.push(
        `${hemorrhageClass} hemorrhagic shock (${input.estimatedBloodLossMl} mL) requires immediate ATLS resuscitation & surgical hemorrhage control.`
      );
    }
    if (input.woundMechanism === 'gunshot') {
      rationaleBullets.push('WHO Rule: War/gunshot wounds (vulnus sclopetarium) require surgical debridement and must NEVER be closed primarily (except penetrating skull/thorax/abdomen).');
    }
    if (input.woundMechanism === 'bite' && isEndArtery) {
      rationaleBullets.push('Bites over the hand/digits carry high risk of septic arthritis & flexor tenosynovitis—leave open & consult Hand Surgery.');
    }

    mandatoryActions.push('Apply direct sterile pressure, cover exposed structures with moist 0.9% saline gauze, splint, and escalate to Surgical Team immediately.');
    contraindications.push('Do NOT attempt primary clinic skin closure over unrepaired tendon, nerve, joint, or bone exposure.');

    return {
      urgency: 'IMMEDIATE_SURGICAL_CONSULT',
      headline: 'Immediate Surgical Consultation Required (OR Exploration)',
      hemorrhageClass,
      closureStrategy: 'Do NOT close in clinic — Formal OR Exploration / Surgical Washout + Delayed or Specialist Repair',
      anesthesiaWarning,
      recommendedSuture: {
        material: 'OR Specialist Selection (Prolene / PDS / Microsurgical Nylon)',
        gauge: recommendedGauge,
        needle: 'Taper-cut / Micro / 3/8 Reverse Cutting (OR)',
        removalDays: rSpec.removal
      },
      mandatoryActions,
      contraindications,
      rationaleBullets
    };
  }

  // 2. Infected / Pus or Puncture Wounds -> Conservative / Secondary Intention
  if (input.contamination === 'infected_pus' || input.woundMechanism === 'abscess' || input.woundMechanism === 'puncture') {
    if (input.contamination === 'infected_pus' || input.woundMechanism === 'abscess') {
      rationaleBullets.push('Pus or active infection present: primary suturing is strictly contraindicated; perform Incision & Drainage / debridement.');
    }
    if (input.woundMechanism === 'puncture') {
      rationaleBullets.push('Punctured wounds (vulnus punctum) trap anaerobic flora and Pseudomonas deep beneath a small orifice—leave open for drainage.');
    }
    mandatoryActions.push('Cleanse intact perimeter, irrigate thoroughly with 0.9% normal saline, leave OPEN with sterile wick/dressing, and verify Tetanus.');
    contraindications.push('NEVER suture an infected/purulent wound or puncture tract closed.');

    return {
      urgency: 'CONSERVATIVE_SECONDARY',
      headline: 'Open Management & Secondary Intention Healing',
      hemorrhageClass,
      closureStrategy: 'Secondary Intention (Open Drainage / I&D + Saline Dressings)',
      anesthesiaWarning,
      recommendedSuture: {
        material: 'None — Leave open (secondary granulation)',
        gauge: 'N/A',
        needle: 'N/A',
        removalDays: 'Reassess dressing at 24–48 hours'
      },
      mandatoryActions,
      contraindications,
      rationaleBullets
    };
  }

  // 3. Time window or Contamination / Bite / Severe Crush -> Delayed Primary Closure
  const maxPrimaryHours = input.anatomicalRegion === 'face' ? 24 : 12;
  const isOverTimeWindow = input.hoursSinceInjury > maxPrimaryHours;
  const isHighContamination =
    input.contamination === 'contaminated' ||
    input.woundMechanism === 'bite' ||
    (input.contamination === 'clean_contaminated' && input.hoursSinceInjury > 6);

  if (isOverTimeWindow || isHighContamination) {
    if (isOverTimeWindow) {
      rationaleBullets.push(
        `${input.hoursSinceInjury}h elapsed exceeds the safe primary closure window (${maxPrimaryHours}h for ${input.anatomicalRegion.replace('_', ' ')}).`
      );
    }
    if (input.woundMechanism === 'bite') {
      rationaleBullets.push('Animal/human bites have high polymicrobial oral flora; avoid primary closure, give Co-amoxiclav, verify Tetanus & Rabipur schedule.');
    }
    if (input.contamination === 'contaminated') {
      rationaleBullets.push('Grossly contaminated wounds must undergo sharp debridement of devitalized tissue + copious 0.9% saline irrigation before Delayed Primary Closure.');
    }

    mandatoryActions.push('Perform full surgical wound toilet, sharp debridement of devitalized tissue, pack loosely with damp 0.9% saline gauze, and review at 48 hours (DPC).');
    contraindications.push('Do NOT place buried multifilament sutures or seal contaminated tissue immediately.');

    return {
      urgency: 'URGENT_DELAYED_CLOSURE',
      headline: 'Wound Toilet, Debridement & Delayed Primary Closure (48h–5d)',
      hemorrhageClass,
      closureStrategy: 'Delayed Primary Closure (DPC) after 48 hours (WHO) to 3–8 days (Pécs) once clean',
      anesthesiaWarning,
      recommendedSuture: {
        material: rSpec.material,
        gauge: recommendedGauge,
        needle: '3/8 Circle Reverse Cutting',
        removalDays: `${rSpec.removal} post-DPC`
      },
      mandatoryActions,
      contraindications,
      rationaleBullets
    };
  }

  // 4. Clean Acute Superficial/Moderate Laceration -> Clinic Primary Repair
  rationaleBullets.push(
    `Clean/clean-contaminated wound within safe primary window (${input.hoursSinceInjury}h) with zero deep structure exposure.`
  );
  if (input.anatomicalRegion === 'face' && input.hoursSinceInjury > 6) {
    rationaleBullets.push('Face exception applies: rich facial vascularity permits primary closure up to 24–48h when meticulously debrided.');
  }
  mandatoryActions.push('Scrub surrounding intact skin, irrigate with warm 0.9% normal saline, approximate cleanly with slight eversion, and provide BCEMN red-flag advice.');

  return {
    urgency: 'CLINIC_PRIMARY_REPAIR',
    headline: 'Eligible for Clinic Wound Toilet & Primary Repair',
    hemorrhageClass,
    closureStrategy:
      input.isPediatric && input.anatomicalRegion === 'face'
        ? 'Primary Intention: Tissue Adhesive (Histoacryl/Dermabond) if dry & low-tension, or 6/0–7/0 Nylon/Vicryl Rapide'
        : 'Primary Intention: Simple Interrupted (or Vertical Mattress if tension)',
    anesthesiaWarning,
    recommendedSuture: {
      material: rSpec.material,
      gauge: recommendedGauge,
      needle: '3/8 Circle Reverse Cutting',
      removalDays: rSpec.removal
    },
    mandatoryActions,
    contraindications,
    rationaleBullets
  };
}

/**
 * Instant search across anatomy, clinical cases, sutures/regions, and techniques/protocols.
 */
export function buildSearchIndex(): SearchResultItem[] {
  const items: SearchResultItem[] = [];

  for (const a of ANATOMICAL_STRUCTURES) {
    items.push({
      id: `anatomy:${a.id}`,
      category: 'Anatomy',
      title: a.name,
      subtitle: `${a.latinName} · ${a.deepExposureRisk === 'CRITICAL_SURGICAL_CONSULT' ? 'Surgical Consult Flag' : 'Layer ' + a.depthOrder}`,
      targetTab: 'atlas',
      targetId: a.id,
      keywords: [a.name, a.latinName, a.summary, ...a.commonFindings, ...a.clinicalDetectionSigns]
    });
  }

  for (const c of CLINICAL_CASES) {
    items.push({
      id: `case:${c.id}`,
      category: 'Clinical Case',
      title: c.title,
      subtitle: `${c.latinClassification} · ${c.triageBadgeLabel}`,
      targetTab: 'atlas',
      targetId: `case:${c.id}`,
      keywords: [c.title, c.latinClassification, c.category, c.patientVignette, ...c.keyFindingsToDetect, ...c.redFlagsForSurgicalConsult]
    });
  }

  for (const s of SUTURE_MATERIALS) {
    items.push({
      id: `suture:${s.id}`,
      category: 'Suture & Needle',
      title: s.name,
      subtitle: `${s.category} · ${s.filament} · Strength: ${s.tensileStrengthDuration}`,
      targetTab: 'protocols',
      targetId: 'sutures',
      keywords: [s.name, s.genericComposition, s.category, ...s.primaryIndications]
    });
  }

  for (const r of BODY_REGION_SUTURE_RULES) {
    items.push({
      id: `region:${r.region}`,
      category: 'Suture & Needle',
      title: `${r.region} Suture Gauge & Removal`,
      subtitle: `Adult ${r.adultGauge} / Child ${r.childGauge} · Remove ${r.removalTimeline}`,
      targetTab: 'protocols',
      targetId: 'sutures',
      keywords: [r.region, r.adultGauge, r.childGauge, r.recommendedMaterial, r.removalTimeline]
    });
  }

  for (const t of STITCH_TECHNIQUES) {
    items.push({
      id: `tech:${t.id}`,
      category: 'Technique & Protocol',
      title: t.name,
      subtitle: `${t.plane} · ${t.eversonScore}`,
      targetTab: 'protocols',
      targetId: `stitch:${t.id}`,
      keywords: [t.name, t.alias ?? '', t.plane, ...t.indications, ...t.steps]
    });
  }

  return items;
}

export function searchClinicalTopics(query: string, limit = 12): SearchResultItem[] {
  const trimmed = query.trim().toLowerCase();
  const index = buildSearchIndex();
  if (!trimmed) return index.slice(0, limit);

  const tokens = trimmed.split(/\s+/).filter(Boolean);
  const scored = index
    .map((item) => {
      const titleLower = item.title.toLowerCase();
      const subtitleLower = item.subtitle.toLowerCase();
      const haystack = `${titleLower} ${subtitleLower} ${item.keywords.join(' ').toLowerCase()}`;

      let score = 0;
      for (const tok of tokens) {
        if (!haystack.includes(tok)) return { item, score: -1 };
        if (titleLower.includes(tok)) score += 10;
        if (titleLower.startsWith(tok)) score += 8;
        if (subtitleLower.includes(tok)) score += 4;
        score += 1;
      }
      return { item, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, limit).map((s) => s.item);
}

/**
 * Computes study mastery percentage across Anatomy, Cases, OSCE, and Quiz.
 */
export function computeStudyMastery(
  progress: StudyProgress,
  totalAnatomy = ANATOMICAL_STRUCTURES.length,
  totalCases = CLINICAL_CASES.length,
  totalOsce = 36,
  totalQuizzes: number = QUIZ_QUESTIONS.length
): {
  overallPercent: number;
  quizCorrectCount: number;
  quizAnsweredCount: number;
  oscePercent: number;
  anatomyPercent: number;
  casesPercent: number;
} {
  const anatomyRatio = totalAnatomy > 0 ? Math.min(1, progress.inspectedAnatomyIds.length / totalAnatomy) : 0;
  const casesRatio = totalCases > 0 ? Math.min(1, progress.reviewedCaseIds.length / totalCases) : 0;
  const osceRatio = totalOsce > 0 ? Math.min(1, progress.completedOsceIds.length / totalOsce) : 0;

  const quizEntries = Object.values(progress.quizScores);
  const quizAnsweredCount = quizEntries.length;
  const quizCorrectCount = quizEntries.filter((q) => q.correct).length;
  const quizRatio = totalQuizzes > 0 ? Math.min(1, quizCorrectCount / totalQuizzes) : 0;

  const overallPercent = Math.round(((anatomyRatio + casesRatio + osceRatio + quizRatio) / 4) * 100);

  return {
    overallPercent,
    quizCorrectCount,
    quizAnsweredCount,
    oscePercent: Math.round(osceRatio * 100),
    anatomyPercent: Math.round(anatomyRatio * 100),
    casesPercent: Math.round(casesRatio * 100)
  };
}

export function gradeQuizAttempt(
  answers: Record<string, number>,
  questions: QuizQuestion[] = QUIZ_QUESTIONS
): { correct: number; total: number; percentage: number } {
  let correct = 0;
  for (const q of questions) {
    if (answers[q.id] === q.correctIndex) correct++;
  }
  const total = questions.length;
  return {
    correct,
    total,
    percentage: total > 0 ? Math.round((correct / total) * 100) : 0
  };
}
