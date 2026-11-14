export type TriageUrgency =
  | 'IMMEDIATE_SURGICAL_CONSULT'
  | 'URGENT_DELAYED_CLOSURE'
  | 'CLINIC_PRIMARY_REPAIR'
  | 'CONSERVATIVE_SECONDARY';

export type Wound3DMode =
  | 'normal_intact'
  | 'superficial_incised'
  | 'deep_subcutis_fascia'
  | 'deep_tendon_nerve_vessel'
  | 'contaminated_crush_foreign'
  | 'bite_joint_capsule'
  | 'sutured_interrupted'
  | 'sutured_mattress';

export type CameraPresetId = 'perspective' | 'cross_section' | 'top_down' | 'deep_structures';

export interface PdfSourceRef {
  id: string;
  title: string;
  shortLabel: string;
  filePath: string;
  pages: string;
  summary: string;
}

export interface AnatomicalStructure {
  id: string;
  layerGroup: 'epidermis' | 'dermis' | 'subcutis' | 'fascia_muscle' | 'deep_neurovascular' | 'deep_skeletal';
  name: string;
  latinName: string;
  depthOrder: number;
  baseY: number;
  anchor3D: [number, number, number];
  colorHex: string;
  summary: string;
  histologyAndAnatomy: string;
  clinicalDetectionSigns: string[];
  deepExposureRisk: 'NONE' | 'MODERATE' | 'CRITICAL_SURGICAL_CONSULT';
  suturingAndToiletRules: string[];
  commonFindings: string[];
  pdfCitations: string[];
}

export interface DifferentialOption {
  condition: string;
  distinguishingFeatures: string;
  actionIfConfirmed: string;
}

export interface ClinicalCaseScenario {
  id: string;
  title: string;
  latinClassification: string;
  category:
    | 'Clean / Acute'
    | 'Deep Structure Exposure'
    | 'Contaminated / Bite / Foreign Body'
    | 'High-Energy / Crush'
    | 'Pediatric / Adhesive'
    | 'Post-Op Complication';
  setting: 'Emergency Department' | 'General Practice Clinic' | 'Urgent Care / Minor Ops';
  wound3DMode: Wound3DMode;
  depthGrade: 'Grade I (Superficial)' | 'Grade II (Subcutaneous)' | 'Grade III (Fascia / Muscle)' | 'Grade IV (Deep / Compound)';
  contaminationClass: 'Clean' | 'Clean-Contaminated' | 'Contaminated' | 'Infected';
  timeWindowRule: string;
  triageDecision: TriageUrgency;
  triageBadgeLabel: string;
  patientVignette: string;
  vitalSigns: {
    hr: string;
    bp: string;
    capRefill: string;
    hemorrhageClass: 'Class I' | 'Class II' | 'Class III' | 'Class IV';
  };
  exposedStructures: string[];
  keyFindingsToDetect: string[];
  differentialDiagnoses: DifferentialOption[];
  redFlagsForSurgicalConsult: string[];
  woundToiletProtocol: string[];
  anesthesiaPlan: string;
  closureAndSuturePlan: {
    closureType: string;
    sutureMaterial: string;
    gauge: string;
    needleType: string;
    technique: string;
    removalDays: string;
  };
  prophylaxisAndFollowUp: string[];
  pdfCitations: string[];
}

export interface SutureMaterialSpec {
  id: string;
  name: string;
  genericComposition: string;
  category: 'Synthetic Absorbable' | 'Natural Absorbable' | 'Non-Absorbable';
  filament: 'Monofilament' | 'Multifilament (Braided)';
  tensileStrengthDuration: string;
  absorptionDuration: string;
  tissueReaction: 'Minimal' | 'Low' | 'Moderate' | 'High (Avoid on Skin)';
  primaryIndications: string[];
  contraindicationsOrNotes: string;
}

export interface BodyRegionSutureRule {
  region: string;
  adultGauge: string;
  childGauge: string;
  recommendedMaterial: string;
  needleRecommendation: string;
  removalTimeline: string;
  minDays: number;
  maxDays: number;
  clinicalNotes: string;
}

export interface StitchTechniqueSpec {
  id: string;
  name: string;
  alias?: string;
  diagramType:
    | 'simple_interrupted'
    | 'vertical_mattress'
    | 'allgower'
    | 'horizontal_mattress'
    | 'continuous_locked'
    | 'subcuticular'
    | 'tissue_glue'
    | 'instrument_knot';
  plane: string;
  eversonScore: string;
  indications: string[];
  contraindications: string[];
  steps: string[];
  pearls: string[];
  pdfCitation: string;
}

export interface OsceChecklistItem {
  id: number;
  phase: 'Preparation & Asepsis' | 'Anaesthesia & Wound Toilet' | 'Suturing & Knot Tying' | 'Completion & Aftercare';
  step: string;
  isCriticalSafetyStep: boolean;
}

export interface QuizQuestion {
  id: string;
  topic: 'Anatomy & Detection' | 'Wound Toilet & Asepsis' | 'Triage & Surgical Consult' | 'Sutures, Needles & Anesthesia' | 'OSCE & Aftercare';
  question: string;
  options: string[];
  correctIndex: number;
  rationale: string;
  pdfCitation: string;
}

export interface TriageInput {
  hoursSinceInjury: number;
  anatomicalRegion: 'face' | 'scalp' | 'trunk' | 'upper_limb' | 'hand_digit' | 'lower_limb';
  woundMechanism: 'incised' | 'laceration_crush' | 'puncture' | 'bite' | 'gunshot' | 'abscess';
  contamination: 'clean' | 'clean_contaminated' | 'contaminated' | 'infected_pus';
  exposedDeepStructures: Array<'tendon' | 'nerve' | 'major_vessel' | 'bone_fracture' | 'joint_capsule' | 'body_cavity'>;
  estimatedBloodLossMl: number;
  suspectedGlassOrRadioOpaqueFB: boolean;
  isPediatric: boolean;
}

export interface TriageEvaluation {
  urgency: TriageUrgency;
  headline: string;
  hemorrhageClass: 'Class I' | 'Class II' | 'Class III' | 'Class IV';
  closureStrategy: string;
  anesthesiaWarning: string;
  recommendedSuture: {
    material: string;
    gauge: string;
    needle: string;
    removalDays: string;
  };
  mandatoryActions: string[];
  contraindications: string[];
  rationaleBullets: string[];
}

export interface BookmarkItem {
  id: string;
  type: 'anatomy' | 'case' | 'protocol' | 'suture';
  title: string;
  subtitle: string;
  targetTab: 'atlas' | 'protocols' | 'triage' | 'osce';
  targetId: string;
  savedAt: string;
}

export interface StudyReminder {
  id: string;
  title: string;
  topic: string;
  timeHHMM: string;
  days: string[];
  enabled: boolean;
  lastTriggeredDate?: string;
}

export interface StudyProgress {
  inspectedAnatomyIds: string[];
  reviewedCaseIds: string[];
  completedOsceIds: number[];
  quizScores: Record<string, { correct: boolean; answeredAt: string }>;
}

export interface SearchResultItem {
  id: string;
  category: 'Anatomy' | 'Clinical Case' | 'Suture & Needle' | 'Technique & Protocol';
  title: string;
  subtitle: string;
  targetTab: 'atlas' | 'protocols' | 'triage' | 'osce';
  targetId: string;
  keywords: string[];
}
