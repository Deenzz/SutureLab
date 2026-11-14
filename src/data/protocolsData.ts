import {
  BodyRegionSutureRule,
  OsceChecklistItem,
  QuizQuestion,
  StitchTechniqueSpec,
  SutureMaterialSpec
} from '../types/clinical';

export const WOUND_TOILET_PROTOCOL_STEPS = [
  {
    stepNumber: 1,
    title: 'ABC Priority, Hemostasis & Pre-Anesthesia Exam',
    detail:
      'Control active hemorrhage with direct firm sterile pressure + elevation. Perform and document distal motor, sensory (two-point discrimination), capillary refill, and tendon excursion BEFORE injecting local anesthetic.',
    criticalNote: 'Never blindly clamp bleeding vessels inside a deep wound—risk of crushing adjacent peripheral nerves.',
    source: 'Pécs Ch. 5 & 7; Glasgow p. 6–7'
  },
  {
    stepNumber: 2,
    title: 'History, Tetanus/Rabies & Glass Screening',
    detail:
      'Record time since injury (<6h ideal; >12h contraindicated except face 24–48h), mechanism (glass requires mandatory X-ray), tetanus vaccination status, rabies exposure (Rabipur days 0, 3, 7, 14, 30, 90), and comorbidities (diabetes, steroids, anticoagulants).',
    criticalNote: 'Practically all glass fragments >1–2 mm are radio-opaque on plain radiography.',
    source: 'Glasgow p. 6–7; Pécs Ch. 7'
  },
  {
    stepNumber: 3,
    title: 'Hand Scrub, Sterile Gown/Gloves & Aseptic Setup',
    detail:
      'Perform Ahlfeld-Fürbinger two-phase surgical scrub (3 min mechanical soap wash + 3–5 min alcoholic disinfectant rubbing up to elbows). Put on sterile gloves using closed/open aseptic technique and arrange instrument tray (needle holder, Adson toothed forceps, iris/Mayo scissors, 15/11 blade).',
    criticalNote: 'Touch ONLY sterile surfaces; keep hands above waist level.',
    source: 'Pécs Ch. 2 & 3; Glasgow Appendix A'
  },
  {
    stepNumber: 4,
    title: 'Skin Preparation & Sterile Fenestrated Draping',
    detail:
      'Scrub surrounding intact skin with broad-spectrum antiseptic (0.5% chlorhexidine, povidone-iodine, or 70% isopropanol): work centrifugally (inside-out) for clean/aseptic wounds and centripetally (outside-in) for septic wounds. Apply sterile fenestrated drape.',
    criticalNote: 'NEVER pour harsh skin antiseptics directly inside an open wound cavity—they cause chemical tissue necrosis.',
    source: 'Pécs Ch. 2 & 7; Glasgow p. 13'
  },
  {
    stepNumber: 5,
    title: 'Local Anesthesia (1% Lidocaine Plain)',
    detail:
      'Use 1% Lidocaine plain (10 mg/mL; max 3–4 mg/kg without adrenaline). Enter through the open subcutaneous wound margin rather than intact skin where clean, aspirate before injecting, and wait 5 minutes for full effect.',
    criticalNote: 'NEVER use adrenaline (epinephrine) on end-arteries: fingers, toes, ears, nose, or penis.',
    source: 'Glasgow p. 7–8; Pécs Ch. 7'
  },
  {
    stepNumber: 6,
    title: 'High-Volume Sterile 0.9% Normal Saline Irrigation',
    detail:
      'Mechanically flush the wound bed copiously with warm sterile 0.9% normal saline (using syringe/catheter tip or irrigation bottle) to dislodge bacteria, blood clots, soil, and microscopic debris.',
    criticalNote: 'Irrigation volume & mechanical pressure matter more than chemical additives.',
    source: 'WHO p. 2–3; Glasgow p. 8'
  },
  {
    stepNumber: 7,
    title: 'Exploration & Sharp Debridement (Friedrich Excision)',
    detail:
      'Gently inspect the entire wound depth through full range of motion matching posture at injury. Sharply excise ragged ischemic skin tags and all devitalized muscle (dark, soft, non-contractile when pinched, non-bleeding when cut).',
    criticalNote: 'If tendon, nerve, joint capsule, bone, or major artery is exposed/injured -> STOP and consult Surgery immediately.',
    source: 'WHO p. 2–3; Pécs Ch. 7; Glasgow p. 6–7'
  },
  {
    stepNumber: 8,
    title: 'Re-Irrigation & Closure Decision (Primary vs. DPC vs. Open)',
    detail:
      'Repeat 0.9% saline rinse after debridement. Close primarily ONLY if clean and within time window. Leave Contaminated (>6–12h), Bite, Puncture, Gunshot, or Infected (pus) wounds OPEN with damp saline gauze for Delayed Primary Closure (48h / 3–8d) or Secondary Intention.',
    criticalNote: 'Never suture subcutaneous fat directly (causes fat necrosis); never bury multifilament sutures in contaminated beds.',
    source: 'WHO p. 1–4; Pécs Ch. 7'
  }
];

export const HEMORRHAGE_CLASSES = [
  {
    classLabel: 'Class I',
    bloodLossMl: '< 750 mL (< 15%)',
    heartRate: '< 100 bpm',
    bloodPressure: 'Normal',
    capRefill: '< 2 seconds',
    mentalStatus: 'Slightly anxious / normal',
    management: 'Direct sterile pressure, limb elevation, routine clinic wound toilet & repair.'
  },
  {
    classLabel: 'Class II',
    bloodLossMl: '750 – 1500 mL (15–30%)',
    heartRate: '100 – 120 bpm',
    bloodPressure: 'Normal (narrowed pulse pressure)',
    capRefill: '> 2 seconds (delayed)',
    mentalStatus: 'Mildly anxious / restless',
    management: 'Urgent hemostasis (pressure/ligation), IV crystalloid resuscitation, evaluate for deep vessel injury.'
  },
  {
    classLabel: 'Class III',
    bloodLossMl: '1500 – 2000 mL (30–40%)',
    heartRate: '120 – 140 bpm',
    bloodPressure: 'Decreased (MAP falling)',
    capRefill: '> 3 seconds',
    mentalStatus: 'Anxious, confused',
    management: 'IMMEDIATE SURGICAL / TRAUMA RESUSCITATION: large-bore IVs, blood transfusion, OR vascular control.'
  },
  {
    classLabel: 'Class IV',
    bloodLossMl: '> 2000 mL (> 40%)',
    heartRate: '> 140 bpm',
    bloodPressure: 'Severely decreased',
    capRefill: 'Absent / markedly prolonged',
    mentalStatus: 'Lethargic / comatose',
    management: 'LIFE-THREATENING SHOCK: Massive transfusion protocol + emergent OR surgical hemorrhage control.'
  }
];

export const SUTURE_MATERIALS: SutureMaterialSpec[] = [
  {
    id: 'nylon_ethilon',
    name: 'Nylon (Ethilon / Dermalon)',
    genericComposition: 'Polyamide Monofilament',
    category: 'Non-Absorbable',
    filament: 'Monofilament',
    tensileStrengthDuration: 'Long-term (~15–20% loss/yr via slow hydrolysis)',
    absorptionDuration: 'Non-absorbable (remove per region timeline)',
    tissueReaction: 'Minimal',
    primaryIndications: [
      'Gold-standard percutaneous interrupted & subcuticular skin closure',
      'Clean and delayed primary closure (low bacterial wicking)',
      'Microsurgery (8/0 – 10/0 nerve & vessel repair)'
    ],
    contraindicationsOrNotes: 'High memory requires extra knot throws (4–5 throws or surgeon’s knot); colored blue/black helps visibility in scalp.'
  },
  {
    id: 'prolene',
    name: 'Polypropylene (Prolene / Surgipro)',
    genericComposition: 'Isotactic Polypropylene',
    category: 'Non-Absorbable',
    filament: 'Monofilament',
    tensileStrengthDuration: 'Indefinite',
    absorptionDuration: 'Non-absorbable',
    tissueReaction: 'Minimal',
    primaryIndications: [
      'Pull-out intradermal / subcuticular running suture (low friction glide)',
      'Edematous crush lacerations (plasticity stretches slightly with swelling)',
      'Vascular anastomoses, tendon core repair, plastic facial closures'
    ],
    contraindicationsOrNotes: 'Very low tissue drag; smooth knot security requires careful square throws.'
  },
  {
    id: 'vicryl',
    name: 'Polyglactin 910 (Coated Vicryl)',
    genericComposition: 'Copolymer Glycolide / Lactide (90:10)',
    category: 'Synthetic Absorbable',
    filament: 'Multifilament (Braided)',
    tensileStrengthDuration: '~65% at 14 days, ~40% at 21 days (3–4 weeks)',
    absorptionDuration: '60 – 90 days (predictable hydrolysis)',
    tissueReaction: 'Low',
    primaryIndications: [
      'Deep dermal / superficial fascial approximation to relieve skin tension',
      'Subcutaneous dead-space closure (anchor fascia/dermis, never fat alone)',
      'Mucosal & GI/general soft-tissue approximation'
    ],
    contraindicationsOrNotes: 'Avoid leaving braided Vicryl buried in grossly contaminated or infected wounds.'
  },
  {
    id: 'vicryl_rapide',
    name: 'Irradiated Polyglactin (Vicryl Rapide)',
    genericComposition: 'Fast-absorbing Polyglactin 910',
    category: 'Synthetic Absorbable',
    filament: 'Multifilament (Braided)',
    tensileStrengthDuration: '50% at 5 days; 0% at 10–14 days',
    absorptionDuration: '42 days (surface loops fall off by 7–14 days)',
    tissueReaction: 'Low',
    primaryIndications: [
      'Pediatric facial/scalp skin closure (avoids traumatic stitch removal)',
      'Oral mucosa, nail bed, and scrotal/perineal skin'
    ],
    contraindicationsOrNotes: 'Do NOT use in high-tension trunk/joint wounds needing prolonged support.'
  },
  {
    id: 'monocryl',
    name: 'Poliglecaprone 25 (Monocryl)',
    genericComposition: 'Glycolide / Epsilon-caprolactone',
    category: 'Synthetic Absorbable',
    filament: 'Monofilament',
    tensileStrengthDuration: '50–60% at 7 days; ~20–30% at 14 days (21 days max)',
    absorptionDuration: '90 – 120 days',
    tissueReaction: 'Minimal',
    primaryIndications: [
      'Buried continuous subcuticular (intracutaneous) facial/trunk closure',
      'Subcutis / dermal approximation where minimal scarring is paramount'
    ],
    contraindicationsOrNotes: 'Avoid in high-tension fascia or slow-healing elderly tissues.'
  },
  {
    id: 'pds_ii',
    name: 'Polydioxanone (PDS II / Maxon)',
    genericComposition: 'Polydioxanone Polymer',
    category: 'Synthetic Absorbable',
    filament: 'Monofilament',
    tensileStrengthDuration: '~70% at 14 days; ~50% at 28 days (5–6 weeks)',
    absorptionDuration: '180 – 210 days',
    tissueReaction: 'Minimal',
    primaryIndications: [
      'High-tension deep fascia & abdominal wall closure',
      'Tendon sheath / pediatric vascular anastomoses allowing growth',
      'Clean-contaminated deep fascia (monofilament resists bacterial wicking)'
    ],
    contraindicationsOrNotes: 'Stiff handling; slow absorption makes it unsuitable for superficial epidermis.'
  },
  {
    id: 'silk_mersilk',
    name: 'Braided Silk (Mersilk)',
    genericComposition: 'Natural Fibroin Protein (Silkworm)',
    category: 'Non-Absorbable',
    filament: 'Multifilament (Braided)',
    tensileStrengthDuration: 'Gradual degradation over 1–2 years',
    absorptionDuration: 'Slow proteolytic encapsulation',
    tissueReaction: 'High (Avoid on Skin)',
    primaryIndications: [
      'Securing surgical drains / chest tubes to skin',
      'Vessel ligation ties in open surgery',
      'Mucocutaneous oral/ophthalmic temporary traction'
    ],
    contraindicationsOrNotes: 'HIGH capillarity ("wicking") & marked tissue reaction—AVOID for routine cosmetic cutaneous closure.'
  },
  {
    id: 'catgut_historical',
    name: 'Plain / Chromic Catgut (Historical Note)',
    genericComposition: 'Natural Collagen (Sheep/Bovine Submucosa)',
    category: 'Natural Absorbable',
    filament: 'Multifilament (Braided)',
    tensileStrengthDuration: 'Plain: 5–7 days | Chromic: 21–28 days',
    absorptionDuration: 'Unpredictable enzymatic digestion',
    tissueReaction: 'High (Avoid on Skin)',
    primaryIndications: [
      'Historical only — FORBIDDEN in Europe/Hungary since 2000 (Pécs Manual) due to BSE/prion & intense inflammatory reaction'
    ],
    contraindicationsOrNotes: 'Replaced universally by synthetic hydrolytic absorbables (Vicryl, Monocryl, PDS II).'
  }
];

export const BODY_REGION_SUTURE_RULES: BodyRegionSutureRule[] = [
  {
    region: 'Face / Eyebrow / Chin',
    adultGauge: '5/0 – 6/0',
    childGauge: '6/0 – 7/0',
    recommendedMaterial: 'Monofilament Nylon / Prolene (or Vicryl Rapide / Tissue Glue in children)',
    needleRecommendation: '3/8 Circle Reverse Cutting (fine P-3/FS-2)',
    removalTimeline: '3 – 5 days (Eyelids 3 days; Neck 3–4 days)',
    minDays: 3,
    maxDays: 5,
    clinicalNotes: 'Rich blood supply allows primary closure up to 24–48h; early removal prevents permanent stitch hatch-marks.'
  },
  {
    region: 'Scalp',
    adultGauge: '3/0 – 4/0',
    childGauge: '4/0 – 5/0',
    recommendedMaterial: 'Blue/Black Nylon, Prolene, or Surgical Staples',
    needleRecommendation: '3/8 Circle Reverse Cutting',
    removalTimeline: '7 – 10 days (up to 14 days if under tension)',
    minDays: 7,
    maxDays: 14,
    clinicalNotes: 'Use colored sutures for visibility in hair; Vertical Mattress achieves hemostasis of scalp plexuses.'
  },
  {
    region: 'Upper Limbs & Hand',
    adultGauge: '4/0 (Hand/dorsum 4/0–5/0)',
    childGauge: '5/0',
    recommendedMaterial: 'Monofilament Nylon / Prolene',
    needleRecommendation: '3/8 Circle Reverse Cutting',
    removalTimeline: '7 – 10 days (Palmar hand/knuckle up to 10–12 days)',
    minDays: 7,
    maxDays: 10,
    clinicalNotes: 'ALWAYS test FDS/FDP/extensor tendons and digital nerves before lidocaine; NEVER use adrenaline in digits.'
  },
  {
    region: 'Trunk (Chest / Abdomen / Back)',
    adultGauge: '3/0 (Back high tension 2/0–3/0)',
    childGauge: '4/0',
    recommendedMaterial: 'Nylon / Prolene skin + Vicryl 3/0 deep dermal',
    needleRecommendation: '3/8 Circle Reverse Cutting',
    removalTimeline: '8 – 12 days (Back up to 12–14 days)',
    minDays: 8,
    maxDays: 12,
    clinicalNotes: 'Layered closure with buried Vicryl reduces epidermal tension and prevents widening scars.'
  },
  {
    region: 'Lower Limbs & Over Joints',
    adultGauge: '3/0',
    childGauge: '4/0',
    recommendedMaterial: 'Nylon / Prolene (or Vertical Mattress for joint tension)',
    needleRecommendation: '3/8 Circle Reverse Cutting',
    removalTimeline: '10 – 14 days (Over knee/elbow/ankle 12–14 days)',
    minDays: 10,
    maxDays: 14,
    clinicalNotes: 'Slow healing & high tensile mobility over joints require longer suture retention and immobilization.'
  }
];

export const STITCH_TECHNIQUES: StitchTechniqueSpec[] = [
  {
    id: 'simple_interrupted',
    name: 'Simple Interrupted Suture',
    diagramType: 'simple_interrupted',
    plane: 'Epidermis + Mid-Dermis ("Brandy-glass" flask profile)',
    eversonScore: 'Good (when deep bite > superficial entry)',
    indications: [
      'Most acute traumatic skin lacerations in ED & GP clinics',
      'Irregular or curved lacerations needing differential tension adjustment',
      'Wounds at mild infection risk (allows removing 1–2 stitches to drain)'
    ],
    contraindications: ['Extreme skin tension without deep dermal approximation'],
    steps: [
      'Mount 3/8 reverse-cutting needle 1/3 to 2/3 from swage; hold needle holder with 1st & 4th fingers.',
      'Enter skin perpendicularly (90°), 3–5 mm from wound margin; sweep outward slightly in dermis so deep bite is wider than surface entry ("brandy-glass").',
      'Exit at identical depth in wound center or pass symmetrically across opposite dermis, exiting equidistant (5 mm) on opposite side.',
      'Tie instrument square knot (2 clockwise throws + 1 counter-clockwise + 1 clockwise), place knot to ONE side of incision, cut ~1 cm tails.'
    ],
    pearls: [
      'Rule of halves: place first stitch at midpoint of linear laceration to prevent "dog-ears".',
      'Space stitches ~5–10 mm apart; approximate gently—do NOT strangulate swollen edges.'
    ],
    pdfCitation: 'Glasgow p. 16–20; UQU p. 12–16; Pécs Ch. 6'
  },
  {
    id: 'vertical_mattress',
    name: 'Vertical Mattress Suture',
    alias: 'Donati Suture (Far-Far, Near-Near)',
    diagramType: 'vertical_mattress',
    plane: 'Deep Dermis/Subcutis (Far) + Superficial Epidermis (Near)',
    eversonScore: 'Maximum Eversion & Tension Relief',
    indications: [
      'Deep or high-tension wounds (scalp, joints, trunk)',
      'Lax skin prone to edge inversion (dorsum of hand, elderly skin)',
      'Briskly oozing scalp margins needing simultaneous hemostasis'
    ],
    contraindications: ['Delicate facial cosmetic zones (high risk of cross-hatch marks if left >5 days)'],
    steps: [
      'FAR-FAR pass: Enter 8–10 mm from edge, pass deeply across wound base, exit 8–10 mm on opposite side.',
      'Reverse needle in holder (forehand/backhand) and re-enter same side NEAR-NEAR: 2–3 mm from wound edge, very shallow dermal pass.',
      'Exit 2–3 mm on original side, then tie knot off to one side without over-tightening.'
    ],
    pearls: [
      'Produces crisp epidermal eversion while obliterating superficial dead space.',
      'Alternate with simple interrupted stitches to reduce crosshatch scarring.'
    ],
    pdfCitation: 'Pécs Ch. 6; Glasgow p. 20–21; AkiNik p. 33–35'
  },
  {
    id: 'allgower',
    name: 'Allgöwer-Donati Half-Buried Mattress',
    diagramType: 'allgower',
    plane: 'Intradermal far loop on one side + percutaneous near-far on opposite',
    eversonScore: 'High Eversion + Minimal Scar',
    indications: [
      'Cosmetically sensitive high-tension areas where crosshatch marks must be minimized',
      'Fragile flap apex or thin skin edge on one side of wound'
    ],
    contraindications: ['Infected wounds'],
    steps: [
      'Enter percutaneously 6–8 mm from wound edge on the sturdy side, travel deeply to opposite side.',
      'Instead of exiting skin on the delicate/cosmetic side, loop strictly intradermally back across wound.',
      'Exit skin 2–3 mm from edge on the original side and tie knot on that single side.'
    ],
    pearls: ['Leaves zero suture track marks on the contralateral cosmetic flap/side.'],
    pdfCitation: 'Pécs Ch. 6'
  },
  {
    id: 'horizontal_mattress',
    name: 'Horizontal Mattress (U-Suture)',
    diagramType: 'horizontal_mattress',
    plane: 'Parallel horizontal dermal-epidermal mattress',
    eversonScore: 'Strong Eversion & Hemostasis',
    indications: [
      'Thin/fragile skin edges that tear with simple sutures',
      'Gap closure under moderate tension or brisk margin oozing'
    ],
    contraindications: ['Do NOT tie tightly (risk of horizontal edge strangulation & ischemia)'],
    steps: [
      'Enter 5 mm from wound margin and exit symmetrically 5 mm on opposite side (like simple interrupted).',
      'Advance 5–8 mm longitudinally along the wound edge on the far side, re-enter and pass back across.',
      'Tie parallel loop lightly on the starting side.'
    ],
    pearls: ['Effective for hemostasis, but loosen slightly if blanching occurs.'],
    pdfCitation: 'Pécs Ch. 6; UQU p. 20; AkiNik p. 36'
  },
  {
    id: 'continuous_locked',
    name: 'Continuous Simple & Locked (Blanket) Suture',
    diagramType: 'continuous_locked',
    plane: 'Continuous dermal / fascial / peritoneal running line',
    eversonScore: 'Moderate (Locked prevents slippage)',
    indications: [
      'Long clean linear surgical incisions, fascia, peritoneum, or scalp hemostasis',
      'Rapid closure when wound tension is low and infection risk is minimal'
    ],
    contraindications: [
      'CONTRAINDICATED in contaminated, bite, or high-infection-risk skin wounds (failure of one point unravels entire wound!)'
    ],
    steps: [
      'Place and tie a simple interrupted anchor stitch at one apex; cut ONLY the short tail.',
      'Take diagonal/perpendicular bites down the wound length; for Locked (Blanket) pass, bring needle through the preceding loop before tightening.',
      'Terminate with an Aberdeen knot or loop-to-tail instrument tie.'
    ],
    pearls: ['Distributes tension evenly along entire incision, saving time and suture material.'],
    pdfCitation: 'Pécs Ch. 6; Glasgow p. 21; AkiNik p. 31–33'
  },
  {
    id: 'subcuticular',
    name: 'Continuous Subcuticular (Intracutaneous)',
    diagramType: 'subcuticular',
    plane: 'Strictly horizontal within mid-dermis (never piercing epidermis mid-run)',
    eversonScore: 'Flush Cosmetic Alignment',
    indications: [
      'Clean elective or facial/trunk incisions requiring minimal visible scarring (zero hatch marks)',
      'Pediatric clean lacerations using Monocryl (buried) or Prolene (pull-out)'
    ],
    contraindications: ['Contaminated/dirty wounds, high tension without deep dermal layer'],
    steps: [
      'Anchor knot deeply in wound apex (buried if Monocryl/Vicryl) or enter 5 mm beyond apex (if Prolene pull-out).',
      'Take horizontal dermal bites strictly parallel to skin surface, entering opposite dermis slightly behind previous exit point.',
      'Finish with buried Aberdeen knot at distal apex (or bring Prolene out 5 mm past distal apex and tape/bead).'
    ],
    pearls: ['Keep every bite at identical dermal depth so skin edges neither step-off nor invert.'],
    pdfCitation: 'Glasgow p. 21–22; Pécs Ch. 6; UQU p. 22–24'
  },
  {
    id: 'tissue_glue',
    name: 'Tissue Adhesive (Dermabond / Histoacryl)',
    diagramType: 'tissue_glue',
    plane: 'Topical surface polymer bridge (2-octylcyanoacrylate)',
    eversonScore: 'Needs manual edge opposition during polymerization',
    indications: [
      'Clean, dry, low-tension linear lacerations < 4 cm (especially pediatric forehead/scalp)',
      'Clean incisions where needle-free closure reduces distress'
    ],
    contraindications: [
      'Deep bleeding, contaminated/infected wounds, bite wounds, high-tension joints, mucosa, or immediately adjacent to eye/eyelid'
    ],
    steps: [
      'Irrigate with saline, achieve complete hemostasis, and pat skin completely dry.',
      'Protect eyes with gauze/barrier; pinch edges flush together with gloved fingers or Adson forceps.',
      'Apply 2–3 thin coats strictly OVER the approximated surface (NEVER drip inside the wound gap—foreign body granuloma).',
      'Hold wound edges steady for 30–60 seconds while exothermic polymerization sets.'
    ],
    pearls: ['Warn patient/child of mild brief warmth; do NOT apply petroleum ointment over glue (dissolves it).'],
    pdfCitation: 'Glasgow p. 12, 23–24; BCEMN p. 1–2'
  },
  {
    id: 'instrument_knot',
    name: 'Instrument Square Knot (2+1+1 Throws)',
    diagramType: 'instrument_knot',
    plane: 'Surface tie positioned off the incision line',
    eversonScore: 'Controlled flat square lie',
    indications: [
      'Routine interrupted cutaneous closure with minimal suture waste',
      'Limited depth or small needle-holder procedures'
    ],
    contraindications: ['Avoid tying granny knots (same wrap direction twice -> slips!)'],
    steps: [
      'Pull suture through until ~3–4 cm short tail remains; hold long end in non-dominant hand.',
      'Throw 1 (Surgeons/Double or Single): Wrap long thread TWICE clockwise around needle holder tips positioned BETWEEN the two strands; grasp short tail and pull hands in opposite directions so knot lies flat.',
      'Throw 2: Place needle holder between strands, wrap ONCE counter-clockwise (opposite direction!), pull opposite hands to lock square knot.',
      'Throw 3 (+4 for monofilament): Repeat alternating wrap direction; slide knot to one side of wound and cut ~1 cm tails.'
    ],
    pearls: ['Always cross hands 180° on alternate throws so each half-hitch lies flat rather than twisting into a slip-prone granny knot.'],
    pdfCitation: 'Glasgow p. 17–19; UQU p. 25–28; Pécs Ch. 6'
  }
];

export const GLASGOW_OSCE_CHECKLIST: OsceChecklistItem[] = [
  { id: 1, phase: 'Preparation & Asepsis', step: 'Introduce yourself, confirm patient identity, and explain the suturing procedure clearly.', isCriticalSafetyStep: false },
  { id: 2, phase: 'Preparation & Asepsis', step: 'Obtain verbal/written informed consent including scar, infection, and numbness risks.', isCriticalSafetyStep: false },
  { id: 3, phase: 'Preparation & Asepsis', step: 'Check allergies (lidocaine, chlorhexidine, iodine, latex) and tetanus/rabies immunization status.', isCriticalSafetyStep: true },
  { id: 4, phase: 'Preparation & Asepsis', step: 'Take mechanism/time history (<6–12h window; glass exposure -> order X-ray).', isCriticalSafetyStep: true },
  { id: 5, phase: 'Preparation & Asepsis', step: 'Examine distal perfusion, pulse, motor tendon power, and sensory 2-point discrimination BEFORE anesthesia.', isCriticalSafetyStep: true },
  { id: 6, phase: 'Preparation & Asepsis', step: 'Position patient comfortably with good overhead lighting and sharps bin within reach.', isCriticalSafetyStep: false },
  { id: 7, phase: 'Preparation & Asepsis', step: 'Perform hand hygiene / surgical scrub and open sterile suture pack without contaminating inner field.', isCriticalSafetyStep: true },
  { id: 8, phase: 'Preparation & Asepsis', step: 'Select appropriate suture material, gauge (face 5/0–6/0, limb 3/0–4/0), and 3/8 reverse-cutting needle.', isCriticalSafetyStep: false },
  { id: 9, phase: 'Preparation & Asepsis', step: 'Don sterile gloves using aseptic technique without touching outer sterile surfaces.', isCriticalSafetyStep: true },
  { id: 10, phase: 'Anaesthesia & Wound Toilet', step: 'Cleanse surrounding intact skin with broad-spectrum antiseptic (avoid pouring into open wound).', isCriticalSafetyStep: true },
  { id: 11, phase: 'Anaesthesia & Wound Toilet', step: 'Apply sterile fenestrated drape leaving wound cleanly exposed.', isCriticalSafetyStep: false },
  { id: 12, phase: 'Anaesthesia & Wound Toilet', step: 'Draw up 1% Lidocaine plain (check expiry/concentration; confirm NO adrenaline in digits/ears/nose).', isCriticalSafetyStep: true },
  { id: 13, phase: 'Anaesthesia & Wound Toilet', step: 'Calculate and stay below maximum safe lidocaine dose (3–4 mg/kg plain).', isCriticalSafetyStep: true },
  { id: 14, phase: 'Anaesthesia & Wound Toilet', step: 'Infiltrate smoothly via wound margins, aspirating to avoid intravascular injection.', isCriticalSafetyStep: false },
  { id: 15, phase: 'Anaesthesia & Wound Toilet', step: 'Wait sufficient time (3–5 min) and test pain sensation gently before proceeding.', isCriticalSafetyStep: false },
  { id: 16, phase: 'Anaesthesia & Wound Toilet', step: 'Copiously irrigate wound cavity with sterile 0.9% normal saline.', isCriticalSafetyStep: true },
  { id: 17, phase: 'Anaesthesia & Wound Toilet', step: 'Explore wound depth thoroughly for foreign bodies, fascia breach, tendon, nerve, or bone exposure.', isCriticalSafetyStep: true },
  { id: 18, phase: 'Anaesthesia & Wound Toilet', step: 'Sharply debride obviously non-viable tissue tags and confirm hemostasis.', isCriticalSafetyStep: false },
  { id: 19, phase: 'Suturing & Knot Tying', step: 'Mount needle safely using needle holder (NEVER bare fingers) at 1/3–2/3 from swage.', isCriticalSafetyStep: true },
  { id: 20, phase: 'Suturing & Knot Tying', step: 'Hold needle holder and scissors with thumb (1st) and ring (4th) finger rule; index stabilizes shaft.', isCriticalSafetyStep: false },
  { id: 21, phase: 'Suturing & Knot Tying', step: 'Hold toothed Adson forceps gently in pencil grip without crushing skin edges.', isCriticalSafetyStep: false },
  { id: 22, phase: 'Suturing & Knot Tying', step: 'Enter skin at 90° perpendicular angle, 3–5 mm from wound margin.', isCriticalSafetyStep: false },
  { id: 23, phase: 'Suturing & Knot Tying', step: 'Follow needle curvature with wrist pronation/supination (never force needle straight).', isCriticalSafetyStep: false },
  { id: 24, phase: 'Suturing & Knot Tying', step: 'Achieve wider deep dermal bite than surface entry ("brandy-glass" profile) for edge eversion.', isCriticalSafetyStep: false },
  { id: 25, phase: 'Suturing & Knot Tying', step: 'Match identical depth and equidistant exit (5 mm) on opposite wound margin.', isCriticalSafetyStep: false },
  { id: 26, phase: 'Suturing & Knot Tying', step: 'Pull suture leaving ~3–4 cm short tail; never touch needle tip with fingers.', isCriticalSafetyStep: true },
  { id: 27, phase: 'Suturing & Knot Tying', step: 'Tie secure instrument square knot (2 throws + 1 opposite + 1 opposite + 1 opposite for nylon).', isCriticalSafetyStep: false },
  { id: 28, phase: 'Suturing & Knot Tying', step: 'Position knot neatly to ONE side of the wound line with tension that approximates without blanching.', isCriticalSafetyStep: false },
  { id: 29, phase: 'Suturing & Knot Tying', step: 'Cut suture ends cleanly leaving ~1 cm tails (preventing untying or painful short bristles).', isCriticalSafetyStep: false },
  { id: 30, phase: 'Suturing & Knot Tying', step: 'Space subsequent sutures evenly (~5–10 mm apart; rule of halves) ensuring symmetrical alignment.', isCriticalSafetyStep: false },
  { id: 31, phase: 'Completion & Aftercare', step: 'Dispose of all needles and blades immediately into sharps bin (NEVER re-sheath or leave on drape).', isCriticalSafetyStep: true },
  { id: 32, phase: 'Completion & Aftercare', step: 'Cleanse dried blood around suture line with sterile saline gauze and pat dry.', isCriticalSafetyStep: false },
  { id: 33, phase: 'Completion & Aftercare', step: 'Apply sterile non-adherent dressing.', isCriticalSafetyStep: false },
  { id: 34, phase: 'Completion & Aftercare', step: 'Give clear wound-care advice: keep dry 24 hours, gentle wash after 24h, avoid soaking/swimming.', isCriticalSafetyStep: false },
  { id: 35, phase: 'Completion & Aftercare', step: 'Specify exact suture removal date by anatomical region (face 3–5d, limb 7–10d, lower limb/joint 10–14d).', isCriticalSafetyStep: false },
  { id: 36, phase: 'Completion & Aftercare', step: 'Explain red-flag infection symptoms (increasing redness, swelling, warmth, pus, red streaks, fever) & document.', isCriticalSafetyStep: true }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    topic: 'Anatomy & Detection',
    question: 'Which layer of the skin is the ONLY layer that bleeds when incised and provides reliable structural suture anchor?',
    options: ['Epidermis (Stratum corneum)', 'Dermis (Corium)', 'Subcutaneous adipose tissue', 'Stratum basale'],
    correctIndex: 1,
    rationale: 'The epidermis is completely avascular; the dermis contains the capillary vascular plexus and dense collagen-elastin matrix capable of holding suture tension.',
    pdfCitation: 'Glasgow Suturing Guide (p. 4–5)'
  },
  {
    id: 'q2',
    topic: 'Anatomy & Detection',
    question: 'During sharp debridement of a contaminated crush wound, which four clinical markers identify DEVITALIZED skeletal muscle that must be excised?',
    options: [
      'Bright red, firm, briskly contracts, bleeds freely',
      'Dark/dusky color, soft consistency, fails to contract when pinched, does NOT bleed when cut',
      'Pale pink, tense, twitches on suction, oozes dark venous blood',
      'Glistening pearly white, fibrous, resilient, avascular'
    ],
    correctIndex: 1,
    rationale: 'Per WHO & Pécs manuals, non-viable muscle is dark, mushy/soft, non-contractile on forceps pinch, and non-bleeding when incised.',
    pdfCitation: 'WHO Wound Protocol (p. 2–3); Pécs Manual (Ch. 7)'
  },
  {
    id: 'q3',
    topic: 'Wound Toilet & Asepsis',
    question: 'When performing wound toilet on an open traumatic laceration, how should skin antiseptics (chlorhexidine / povidone-iodine) and 0.9% normal saline be used?',
    options: [
      'Pour undiluted povidone-iodine directly into the deep wound cavity',
      'Scrub surrounding intact skin with antiseptic, and irrigate inside the wound ONLY with warm sterile 0.9% normal saline',
      'Wash inside the wound with hydrogen peroxide and 70% isopropanol',
      'Suture subcutaneous fat tightly first, then wipe skin with saline'
    ],
    correctIndex: 1,
    rationale: 'Toxic skin antiseptics damage exposed fibroblasts and delay healing; scrub only intact surrounding skin and irrigate the wound cavity copiously with 0.9% normal saline.',
    pdfCitation: 'Glasgow p. 8, 13; Pécs Ch. 7; WHO p. 2'
  },
  {
    id: 'q4',
    topic: 'Triage & Surgical Consult',
    question: 'A patient presents with a 3 cm glass laceration over the volar wrist with brisk bleeding and reduced sensation in the index finger. What is the mandatory first clinical action regarding wound closure?',
    options: [
      'Infiltrate lidocaine with adrenaline, clamp the bleeding vessel blindly, and close with 4/0 Nylon',
      'Explore only superficially and apply Steri-Strips',
      'Obtain X-ray for retained glass, apply direct pressure + moist saline dressing, and arrange IMMEDIATE Surgical Consultation (OR exploration)',
      'Suture the skin quickly and refer for elective clinic follow-up in 5 days'
    ],
    correctIndex: 2,
    rationale: 'Glass requires X-ray screening; sensory loss + volar wrist location raises critical suspicion of median nerve, tendon, or arterial injury requiring formal OR exploration—never blindly clamp deep bleeders.',
    pdfCitation: 'Glasgow Suturing Guide (p. 6–7); Pécs Manual (Ch. 7)'
  },
  {
    id: 'q5',
    topic: 'Sutures, Needles & Anesthesia',
    question: 'What is the maximum safe dose of 1% Lidocaine PLAIN (without adrenaline) in an adult, and where is adrenaline strictly CONTRAINDICATED?',
    options: [
      '7 mg/kg; contraindicated on the scalp',
      '3–4 mg/kg; strictly contraindicated on end-arteries (fingers, toes, ears, nose, penis)',
      '10 mg/kg; contraindicated on the trunk',
      '1 mg/kg; contraindicated on the forearm'
    ],
    correctIndex: 1,
    rationale: '1% Lidocaine plain max dose is 3–4 mg/kg (7 mg/kg only when adrenaline is added). Adrenaline is strictly contraindicated in end-arterial zones (digits, toes, ears, nose, penis) due to ischemic necrosis risk.',
    pdfCitation: 'Glasgow Suturing Guide (p. 7–8)'
  },
  {
    id: 'q6',
    topic: 'Triage & Surgical Consult',
    question: 'A gardener presents 15 hours after sustaining a soil-contaminated calf laceration. Neurovascular and tendon exams are intact, and there is no pus. What is the correct management?',
    options: [
      'Immediate primary interrupted skin closure after brief wipe',
      'Continuous locked suture to seal out bacteria',
      'Wound toilet, sharp debridement, high-volume 0.9% saline irrigation, pack open with damp saline gauze for Delayed Primary Closure at 48h+ (+ Tetanus check)',
      'Close with Dermabond tissue glue'
    ],
    correctIndex: 2,
    rationale: 'Wounds >12 hours old (outside the face) or soil-contaminated must NEVER be closed primarily; perform thorough toilet/debridement and pack for Delayed Primary Closure at 48 hours (WHO) or 3–8 days (Pécs).',
    pdfCitation: 'WHO Wound Protocol (p. 1–3); Glasgow p. 6; Pécs Ch. 7'
  },
  {
    id: 'q7',
    topic: 'Triage & Surgical Consult',
    question: 'Which statement regarding gunshot/war wounds (vulnus sclopetarium) and animal/human bite wounds is TRUE according to WHO & Pécs guidelines?',
    options: [
      'Primary closure is standard for all extremity gunshot wounds if <4 hours',
      'Cat bites over the dorsal MCP joint should be tightly sutured with 4/0 Nylon',
      'War/gunshot wounds are NEVER closed primarily (except penetrating skull/thorax/abdomen), and hand/joint bites are left OPEN with urgent surgical evaluation',
      'Punctured plantar wounds through shoes heal best when sealed with horizontal mattress stitches'
    ],
    correctIndex: 2,
    rationale: 'WHO specifies war/gunshot injuries must never undergo primary skin closure (except penetrating head/thorax/abdomen). Joint/hand bites carry massive septic arthritis risk and must never be closed primarily.',
    pdfCitation: 'WHO Wound Protocol (p. 2–4); Pécs Ch. 7; Glasgow p. 6'
  },
  {
    id: 'q8',
    topic: 'Sutures, Needles & Anesthesia',
    question: 'Which needle geometry is specifically designed for cutaneous suturing because its third cutting edge sits on the outer convexity, preventing upward "cutout" through skin?',
    options: ['Taper-point (round-bodied) needle', 'Conventional cutting needle', 'Reverse-cutting 3/8 circle needle', 'Blunt-taper hepatic needle'],
    correctIndex: 2,
    rationale: 'A 3/8-circle reverse-cutting needle places the third cutting edge along the outer curve, leaving a stronger flat tissue bridge toward the wound edge and eliminating suture cutout.',
    pdfCitation: 'UQU Booklet (p. 8–10); AkiNik Handbook (p. 25–28); Glasgow p. 11'
  },
  {
    id: 'q9',
    topic: 'Sutures, Needles & Anesthesia',
    question: 'Why must subcutaneous adipose tissue NEVER be sutured directly?',
    options: [
      'Fat is completely avascular and dissolves nylon immediately',
      'Suturing fat directly causes ischemic fat necrosis, seroma formation, and heightened infection risk',
      'Fat causes anaphylactic shock when contacted by Vicryl',
      'Fat is harder than dermis and bends reverse-cutting needles'
    ],
    correctIndex: 1,
    rationale: 'Adipose tissue holds sutures poorly and readily undergoes ischemic necrosis under tension; deep dead space should be approximated at the fascia/deep dermal junction instead.',
    pdfCitation: 'Pécs Surgical Manual (Ch. 7); Glasgow p. 5, 19'
  },
  {
    id: 'q10',
    topic: 'OSCE & Aftercare',
    question: 'For a clean facial laceration in an adult vs. a 6-year-old child, what suture gauge and removal timeline are recommended?',
    options: [
      'Adult 2/0, Child 3/0 — remove at 14 days',
      'Adult 5/0–6/0, Child 6/0–7/0 — remove at 3–5 days',
      'Adult 4/0, Child 4/0 — remove at 10–12 days',
      'Adult 3/0 Silk, Child 3/0 Catgut — remove at 21 days'
    ],
    correctIndex: 1,
    rationale: 'Facial skin requires fine 5/0–6/0 monofilament in adults (reduced by one gauge to 6/0–7/0 in children) and early removal at 3–5 days to prevent permanent stitch marks.',
    pdfCitation: 'Glasgow Suturing Guide (p. 11, 25); BCEMN Sheet (p. 1)'
  },
  {
    id: 'q11',
    topic: 'OSCE & Aftercare',
    question: 'When removing simple interrupted skin sutures, how should you cut and pull the thread to prevent dragging surface bacteria through the subcutaneous tract?',
    options: [
      'Cut directly above the knot and pull the knot through the wound track',
      'Lift the knot gently with forceps, cut flush below the knot right at the skin entry point, and pull toward the opposite side so no external exposed thread passes beneath the skin',
      'Cut both tails flush and leave the loop inside to absorb',
      'Pull firmly upward before cutting to snap the loop'
    ],
    correctIndex: 1,
    rationale: 'Cutting flush below the knot at skin level ensures only clean internal suture slides out, preventing bacterial seeding of the stitch canal.',
    pdfCitation: 'Glasgow Suturing Guide (p. 25–26); Pécs Ch. 6'
  },
  {
    id: 'q12',
    topic: 'Triage & Surgical Consult',
    question: 'A trauma patient presents with blood loss ~1700 mL, HR 132 bpm, falling blood pressure, capillary refill >3s, and confusion. Which hemorrhage class is this?',
    options: ['Class I', 'Class II', 'Class III', 'Class IV'],
    correctIndex: 2,
    rationale: 'Class III hemorrhage represents 1500–2000 mL (30–40%) blood loss characterized by HR 120–140, decreased BP/MAP, delayed cap refill, and confusion—requiring immediate resuscitation and surgical control.',
    pdfCitation: 'Pécs Surgical Manual (Ch. 5)'
  }
];
