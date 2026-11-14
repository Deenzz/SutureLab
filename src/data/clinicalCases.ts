import { ClinicalCaseScenario } from '../types/clinical';

export const CLINICAL_CASES: ClinicalCaseScenario[] = [
  {
    id: 'clean_forearm_incised',
    title: 'Clean Forearm Incised Laceration (<4 Hours)',
    latinClassification: 'Vulnus scissum (Grade II — Clean)',
    category: 'Clean / Acute',
    setting: 'General Practice Clinic',
    wound3DMode: 'deep_subcutis_fascia',
    depthGrade: 'Grade II (Subcutaneous)',
    contaminationClass: 'Clean',
    timeWindowRule: 'Presented at 2.5 hours (< 6–8h primary closure window)',
    triageDecision: 'CLINIC_PRIMARY_REPAIR',
    triageBadgeLabel: 'Clinic Wound Toilet & Primary Repair',
    patientVignette:
      'A 29-year-old chef presents 2.5 hours after slicing his volar forearm with a clean stainless-steel kitchen knife. The laceration is 4.5 cm long, linear, and gaping into subcutaneous fat with moderate venous ooze.',
    vitalSigns: { hr: '78 bpm', bp: '122/76 mmHg', capRefill: '< 2 sec', hemorrhageClass: 'Class I' },
    exposedStructures: ['epidermis', 'dermis', 'subcutis'],
    keyFindingsToDetect: [
      'Sharp, clean wound edges without devitalized crushed margins',
      'Subcutaneous adipose lobules visible, deep fascia intact at wound base',
      'Normal FDS/FDP & FCR/FCU tendon strength against resistance; intact radial/ulnar pulses and median/ulnar sensation'
    ],
    differentialDiagnoses: [
      {
        condition: 'Superficial Grade II Laceration (No Deep Injury)',
        distinguishingFeatures: 'Intact fascia floor, full active wrist/finger flexion against resistance, intact distal 2-point discrimination.',
        actionIfConfirmed: 'Proceed with clinic wound toilet, local anesthesia, and primary interrupted repair.'
      },
      {
        condition: 'Occult Flexor Tendon / Median Nerve Injury',
        distinguishingFeatures: 'Loss of isolated DIP/PIP flexion, abnormal resting finger cascade, or paresthesia in thumb-index-middle digits.',
        actionIfConfirmed: 'HALT primary clinic closure; escalate immediately to Hand/Orthopedic Surgery.'
      }
    ],
    redFlagsForSurgicalConsult: [
      'Any fascial defect with muscle/tendon visualization',
      'Distal sensory deficit or pain/weakness on resisted wrist/finger flexion',
      'Pulsatile bright-red bleeding'
    ],
    woundToiletProtocol: [
      'Perform distal neurovascular & tendon exam BEFORE injecting local anesthetic.',
      'Scrub surrounding intact skin centrifugally with 0.5% chlorhexidine or povidone-iodine (never pour antiseptic inside wound).',
      'Infiltrate 1% Lidocaine plain via wound margins (max 3–4 mg/kg; ~21 mL for 70 kg adult).',
      'Copiously irrigate wound cavity with warm sterile 0.9% normal saline; confirm intact deep fascia.'
    ],
    anesthesiaPlan: '1% Lidocaine plain (10 mg/mL) infiltrated subcutaneously along wound margins; max safe dose 3–4 mg/kg.',
    closureAndSuturePlan: {
      closureType: 'Primary Intention (Single-layer cutaneous; avoid suturing adipose directly)',
      sutureMaterial: 'Monofilament Nylon (Ethilon) or Prolene',
      gauge: '4/0 (Adult upper limb)',
      needleType: '3/8 Circle Reverse Cutting',
      technique: 'Simple Interrupted (90° entry, 5 mm from edge, 5–10 mm spacing, brandy-glass eversion)',
      removalDays: '7–10 days'
    },
    prophylaxisAndFollowUp: [
      'Verify tetanus immunization status (Tdap booster if > 5–10 years).',
      'Keep dry for first 24 hours; gentle soap-and-water wash after 24h; no soaking/swimming.',
      'Return immediately if BCEMN red flags appear (increasing redness, warmth, pus, fever, red streaks).'
    ],
    pdfCitations: ['Glasgow Suturing Guide (p. 5–15, 25)', 'Pécs Surgical Manual (Ch. 7)', 'BCEMN Patient Sheet (p. 1–2)']
  },
  {
    id: 'deep_wrist_glass_tendon_nerve',
    title: 'Volar Wrist Glass Laceration with Exposed Tendon & Nerve',
    latinClassification: 'Vulnus scissum profundum (Grade IV — Compound)',
    category: 'Deep Structure Exposure',
    setting: 'Emergency Department',
    wound3DMode: 'deep_tendon_nerve_vessel',
    depthGrade: 'Grade IV (Deep / Compound)',
    contaminationClass: 'Clean-Contaminated',
    timeWindowRule: 'Emergency Surgical Exploration — Do NOT close in primary care',
    triageDecision: 'IMMEDIATE_SURGICAL_CONSULT',
    triageBadgeLabel: 'Immediate Surgical Consultation (OR)',
    patientVignette:
      'A 24-year-old falls through a glass door, sustaining a 3.5 cm transverse laceration over the volar distal forearm/wrist. Bright pulsatile bleeding was partially controlled by direct pressure; patient reports numbness in the radial 3.5 digits and inability to flex the index DIP joint.',
    vitalSigns: { hr: '108 bpm', bp: '104/68 mmHg', capRefill: '2.5 sec', hemorrhageClass: 'Class II' },
    exposedStructures: ['epidermis', 'dermis', 'subcutis', 'fascia', 'tendon', 'nerve', 'artery_vein'],
    keyFindingsToDetect: [
      'Exposed glistening white flexor tendon with retracted proximal edge & loss of normal digital cascade',
      'Pale-yellow fasciculated median nerve trunk partially transected at wound base',
      'Pulsatile arterial bleeding risk + suspected retained glass shards (mandatory X-ray)'
    ],
    differentialDiagnoses: [
      {
        condition: 'Grade IV Compound Neurovascular & Tendon Transection',
        distinguishingFeatures: 'Absent active FDP flexion, median sensory loss, pulsatile arterial bleed.',
        actionIfConfirmed: 'Immediate Hand/Plastic/Vascular Surgical consult for OR exploration under tourniquet & loupe magnification.'
      },
      {
        condition: 'Retained Intra-wound Glass Fragment',
        distinguishingFeatures: 'History of shattering glass; almost all glass (>1–2 mm) is radio-opaque on plain X-ray.',
        actionIfConfirmed: 'Order 2-view wrist radiograph before formal OR transfer; never probe blindly.'
      }
    ],
    redFlagsForSurgicalConsult: [
      'Exposed or severed tendon / tendon sheath',
      'Peripheral nerve sensory or motor deficit distal to wound',
      'Major arterial bleeding (never blindly clamp hemostats inside wound!)'
    ],
    woundToiletProtocol: [
      'Maintain direct sterile pressure + limb elevation (do NOT blindly clamp deep vessels near median nerve).',
      'Document distal motor (FDS/FDP/FPL/APB) and sensory status clearly BEFORE any anesthesia.',
      'Obtain plain X-ray to screen for retained glass fragments.',
      'Irrigate gently with sterile 0.9% normal saline, dress with moist saline gauze, splint wrist in neutral/intrinsic-plus, and transfer to OR.'
    ],
    anesthesiaPlan: 'Regional block or General Anesthesia in Operating Theatre; do NOT infiltrate locally in clinic before surgical assessment.',
    closureAndSuturePlan: {
      closureType: 'Formal OR Microsurgical & Tendon Repair + Layered Closure',
      sutureMaterial: 'Prolene / PDS II (tendon core), 8/0–9/0 Nylon (epineurial nerve), 4/0–5/0 Nylon (skin)',
      gauge: '3/0–4/0 (Tendon) / 8/0–9/0 (Nerve) / 4/0 (Skin)',
      needleType: 'Taper-cut (tendon) / Spatula-Micro (nerve) / 3/8 Reverse Cutting (skin)',
      technique: 'Modified Kessler tendon core + epineurial coaptation in OR',
      removalDays: '10–14 days (skin); splint 4–6 weeks'
    },
    prophylaxisAndFollowUp: [
      'NPO status immediately for OR; IV broad-spectrum antibiotic prophylaxis + tetanus update.',
      'Monitor distal capillary refill and compartment status hourly pre-op.'
    ],
    pdfCitations: ['Glasgow Suturing Guide (p. 6–7)', 'Pécs Surgical Manual (Ch. 5, 7)', 'WHO Wound Protocol (p. 2)']
  },
  {
    id: 'open_tibial_fracture_bone',
    title: 'Pretibial Laceration with Exposed Periosteum & Bone Cortex',
    latinClassification: 'Vulnus lacerum / Open Fracture (Grade IV)',
    category: 'Deep Structure Exposure',
    setting: 'Emergency Department',
    wound3DMode: 'deep_tendon_nerve_vessel',
    depthGrade: 'Grade IV (Deep / Compound)',
    contaminationClass: 'Contaminated',
    timeWindowRule: 'Urgent Orthopedic OR Washout (<6h ideal) — Never close in clinic',
    triageDecision: 'IMMEDIATE_SURGICAL_CONSULT',
    triageBadgeLabel: 'Immediate Surgical Consultation (Ortho)',
    patientVignette:
      'A 41-year-old cyclist strikes a concrete curb, presenting with a 6 cm pretibial laceration with road grit contamination, stripped periosteum, and visible ivory tibial cortex at the wound base.',
    vitalSigns: { hr: '102 bpm', bp: '112/72 mmHg', capRefill: '2 sec', hemorrhageClass: 'Class II' },
    exposedStructures: ['epidermis', 'dermis', 'subcutis', 'fascia', 'muscle', 'bone_periosteum'],
    keyFindingsToDetect: [
      'Direct exposure of cortical bone and stripped periosteum in wound floor',
      'Road gravel/debris embedded in subcutaneous fat and crushed anterior compartment fascia',
      'Must evaluate dorsalis pedis / posterior tibial pulses and compartment tension'
    ],
    differentialDiagnoses: [
      {
        condition: 'Open Tibial Fracture (Grade IV Compound Wound)',
        distinguishingFeatures: 'Visible cortical bone, bony step-off/crepitus, periosteal stripping.',
        actionIfConfirmed: 'Immediate Orthopedic Surgery consult, X-ray, IV antibiotics, sterile saline-soaked dressing.'
      },
      {
        condition: 'Pretibial Flap Hematoma / Necrosis without Fracture',
        distinguishingFeatures: 'Intact cortex on X-ray, thin elderly skin flap without periosteal breach.',
        actionIfConfirmed: 'If no bone exposure/fracture, conservative Steri-Strip approximation or specialist skin-graft evaluation.'
      }
    ],
    redFlagsForSurgicalConsult: [
      'Any exposed bone or periosteal breach',
      'Crepitus or bony deformity',
      'Tense painful compartment (acute compartment syndrome)'
    ],
    woundToiletProtocol: [
      'Remove gross surface debris gently without pushing dirt deeper into bone/marrow.',
      'Photograph wound once to prevent repeated dressing removals; cover with sterile 0.9% saline-soaked gauze.',
      'Immobilize limb with splint and obtain AP/Lateral tibia-fibula X-rays.',
      'Transfer to OR for high-volume pulse lavage, sharp debridement, and fixation.'
    ],
    anesthesiaPlan: 'OR Spinal/General anesthesia; IV analgesia in ED.',
    closureAndSuturePlan: {
      closureType: 'OR Debridement + Delayed Closure / Flap Coverage (Never primary clinic closure)',
      sutureMaterial: 'Vicryl (deep fascia if viable) / Monofilament Nylon or Vacuum Dressing',
      gauge: '3/0 (Lower limb)',
      needleType: '3/8 Reverse Cutting / Taper-cut',
      technique: 'Delayed primary closure or local muscle/skin flap in OR',
      removalDays: '10–14 days (post-definitive closure)'
    },
    prophylaxisAndFollowUp: [
      'Urgent IV cephalosporin (+ aminoglycoside if severe contamination) + Tetanus prophylaxis.',
      'Serial neurovascular & compartment checks.'
    ],
    pdfCitations: ['Glasgow Suturing Guide (p. 6–7)', 'WHO Wound Protocol (p. 2–3)', 'Pécs Surgical Manual (Ch. 7)']
  },
  {
    id: 'cat_dog_bite_hand_joint',
    title: 'Cat / Dog Bite Over Dorsal MCP Joint Capsule',
    latinClassification: 'Vulnus morsum (High-Risk Contaminated)',
    category: 'Contaminated / Bite / Foreign Body',
    setting: 'Emergency Department',
    wound3DMode: 'bite_joint_capsule',
    depthGrade: 'Grade IV (Deep / Compound)',
    contaminationClass: 'Contaminated',
    timeWindowRule: 'Do NOT primarily suture — Joint exploration + Rabies/Tetanus protocol',
    triageDecision: 'IMMEDIATE_SURGICAL_CONSULT',
    triageBadgeLabel: 'Surgical Hand Consult (Never Primary Close)',
    patientVignette:
      'A 36-year-old veterinary technician presents 5 hours after a deep cat bite over the dorsal 3rd MCP knuckle. Two small puncture marks exude serosanguinous fluid; passive extension triggers sharp deep joint pain and mild erythema.',
    vitalSigns: { hr: '86 bpm', bp: '124/78 mmHg', capRefill: '< 2 sec', hemorrhageClass: 'Class I' },
    exposedStructures: ['epidermis', 'dermis', 'subcutis', 'tendon', 'joint_capsule'],
    keyFindingsToDetect: [
      'Deceptively small surface puncture (vulnus punctum/morsum) overlying MCP extensor tendon and joint capsule',
      'Pain on passive axial loading or slight range of motion -> suspect septic arthritis / tenosynovitis',
      'High polymicrobial inoculation risk (Pasteurella multocida, anaerobes, Staph/Strep)'
    ],
    differentialDiagnoses: [
      {
        condition: 'Penetrating Bite with Joint Capsule / Tendon Sheath Breach',
        distinguishingFeatures: 'Overlying MCP/PIP joint, severe pain on micromotion, synovial fluid leak.',
        actionIfConfirmed: 'Immediate Hand Surgery consult for OR washout; leave wound OPEN.'
      },
      {
        condition: 'Superficial Uncomplicated Bite (Non-joint, non-hand)',
        distinguishingFeatures: 'No deep structure/joint involvement, low-risk trunk/leg site.',
        actionIfConfirmed: 'Thorough wound toilet, copiously irrigate 0.9% saline, leave open for secondary healing or DPC + oral amoxicillin-clavulanate.'
      }
    ],
    redFlagsForSurgicalConsult: [
      'Any animal or human bite over a hand, wrist, or joint capsule ("fight bite")',
      'Escaping synovial fluid or flexor tendon sheath tenderness (Kanavel signs)',
      'Rapidly spreading cellulitis or lymphangitis'
    ],
    woundToiletProtocol: [
      'Scrub surrounding intact skin with antiseptic; NEVER suture animal/human bite wounds primarily (except select low-risk facial wounds managed by specialists).',
      'Irrigate puncture tract copiously with sterile 0.9% normal saline using an 18G catheter tip (gentle pressure).',
      'Debride ragged devitalized margins if superficial; leave OPEN with sterile moist dressing.',
      'Elevate hand in splint and consult Hand Surgery if joint/sheath proximity confirmed.'
    ],
    anesthesiaPlan: 'Regional wrist/digital block WITHOUT adrenaline (never use epinephrine in fingers/hands) or OR anesthesia.',
    closureAndSuturePlan: {
      closureType: 'Leave OPEN (Secondary Intention or Delayed Primary Closure after 48–72h clean)',
      sutureMaterial: 'None acutely (avoid trapping Pasteurella/anaerobes)',
      gauge: 'N/A acutely (4/0 Nylon only if specialist DPC)',
      needleType: '3/8 Reverse Cutting (if delayed)',
      technique: 'Open saline wick/dressing; splinted elevation',
      removalDays: 'Delayed closure review at 48–72 hours'
    },
    prophylaxisAndFollowUp: [
      'Empiric Co-amoxiclav (amoxicillin-clavulanate) prophylaxis.',
      'Tetanus toxoid booster if indicated.',
      'Rabies prophylaxis (Pécs protocol): Rabipur vaccine days 0, 3, 7, 14, 30, 90 (+ human rabies Ig if indicated).'
    ],
    pdfCitations: ['Pécs Surgical Manual (Ch. 7 — Vulnus morsum & Rabipur)', 'Glasgow Suturing Guide (p. 6–7)', 'WHO Wound Protocol (p. 2–3)']
  },
  {
    id: 'contaminated_old_laceration_14h',
    title: '14-Hour Contaminated Soil Laceration (Calf)',
    latinClassification: 'Vulnus lacerum contaminatum (>12 Hours)',
    category: 'Contaminated / Bite / Foreign Body',
    setting: 'Urgent Care / Minor Ops',
    wound3DMode: 'contaminated_crush_foreign',
    depthGrade: 'Grade III (Fascia / Muscle)',
    contaminationClass: 'Contaminated',
    timeWindowRule: '> 12 hours elapsed — Primary closure CONTRAINDICATED (Delayed Primary Closure)',
    triageDecision: 'URGENT_DELAYED_CLOSURE',
    triageBadgeLabel: 'Wound Toilet + Delayed Primary Closure (48h+)',
    patientVignette:
      'A 52-year-old gardener presents 14 hours after lacerating his lateral calf on a rusty metal garden stake. The 5 cm wound contains embedded soil, grass fragments, and bruised edges; no pus yet, and distal pulses/peroneal nerve/ankle dorsiflexion are intact.',
    vitalSigns: { hr: '82 bpm', bp: '132/80 mmHg', capRefill: '< 2 sec', hemorrhageClass: 'Class I' },
    exposedStructures: ['epidermis', 'dermis', 'subcutis', 'fascia', 'muscle'],
    keyFindingsToDetect: [
      'Time elapsed > 6–12h with gross soil/organic foreign material contamination',
      'Bruised/devitalized dermal edges and dark non-contractile muscle tags at surface',
      'Intact deep neurovascular and Achilles/peroneal tendon function'
    ],
    differentialDiagnoses: [
      {
        condition: 'Contaminated >12h Wound Suitable for Delayed Primary Closure',
        distinguishingFeatures: 'No pus, viable deep bed once debrided, intact distal neurovascular status.',
        actionIfConfirmed: 'Surgical toilet, sharp debridement, high-volume saline irrigation, pack open with damp saline gauze; review at 48 hours for DPC.'
      },
      {
        condition: 'Frankly Infected / Purulent Wound (Abscess / Necrotizing)',
        distinguishingFeatures: 'Pus, foul odor, crepitus, systemic fever/tachycardia, spreading cellulitis.',
        actionIfConfirmed: 'Debride & heal strictly by Secondary Intention + antibiotics (or OR if necrotizing).'
      }
    ],
    redFlagsForSurgicalConsult: [
      'Subcutaneous crepitus or foul dishwater exudate (clostridial/necrotizing infection)',
      'Extensive non-viable muscle requiring deep OR debridement',
      'Suspected retained deep metallic/wooden fragment on X-ray/ultrasound'
    ],
    woundToiletProtocol: [
      'Scrub surrounding intact skin with 0.5% chlorhexidine or povidone-iodine.',
      'Infiltrate 1% Lidocaine plain along margins (never inject into inflamed/infected core).',
      'Remove all grass, soil, and foreign debris; sharply excise dark, soft, non-bleeding, non-contractile devitalized tissue (WHO/Pécs).',
      'Irrigate copiously with > 500–1000 mL warm sterile 0.9% normal saline.',
      'Pack loosely with saline-dampened sterile gauze; DO NOT suture primarily.'
    ],
    anesthesiaPlan: '1% Lidocaine plain infiltrated via clean peripheral skin border (avoid injecting directly through contaminated wound bed).',
    closureAndSuturePlan: {
      closureType: 'Delayed Primary Closure (DPC) at 48 hours (WHO) or 3–8 days (Pécs) once clean granulation appears',
      sutureMaterial: 'Monofilament Nylon or Prolene at DPC (no buried multifilament sutures)',
      gauge: '3/0 (Adult lower limb)',
      needleType: '3/8 Circle Reverse Cutting',
      technique: 'Spaced Simple Interrupted sutures at 48h–5d re-evaluation if clean',
      removalDays: '10–14 days post-DPC'
    },
    prophylaxisAndFollowUp: [
      'Mandatory Tetanus toxoid (+ TIG if incomplete primary series & dirty wound).',
      '48-hour wound inspection: close if clean and free of erythema/pus; continue saline wet-to-dry / secondary intention if exudative.'
    ],
    pdfCitations: ['WHO Wound Protocol (p. 1–3)', 'Glasgow Suturing Guide (p. 6, 8)', 'Pécs Surgical Manual (Ch. 7)']
  },
  {
    id: 'crush_blunt_laceration',
    title: 'Blunt Crush Laceration with Wound Stupor',
    latinClassification: 'Vulnus contusum (Blunt Crush Injury)',
    category: 'High-Energy / Crush',
    setting: 'Emergency Department',
    wound3DMode: 'contaminated_crush_foreign',
    depthGrade: 'Grade III (Fascia / Muscle)',
    contaminationClass: 'Clean-Contaminated',
    timeWindowRule: 'Requires sharp debridement of crushed margins before closure or DPC',
    triageDecision: 'URGENT_DELAYED_CLOSURE',
    triageBadgeLabel: 'Sharp Debridement & Layered / Delayed Closure',
    patientVignette:
      'A 44-year-old warehouse worker has a heavy steel crate fall onto his dorsal forearm, creating a stellate, ragged 5 cm laceration with swollen, cyanotic skin edges and initial numb "wound stupor" transitioning to severe throbbing pain.',
    vitalSigns: { hr: '94 bpm', bp: '138/84 mmHg', capRefill: '< 2 sec', hemorrhageClass: 'Class I' },
    exposedStructures: ['epidermis', 'dermis', 'subcutis', 'fascia', 'muscle'],
    keyFindingsToDetect: [
      'Ragged, undermined, ecchymotic skin margins ("wound stupor" temporary nerve stunning)',
      'Patchy duskiness of crushed superficial muscle belly (test contractility & bleeding)',
      'Screen X-ray for underlying occult radius/ulna fracture'
    ],
    differentialDiagnoses: [
      {
        condition: 'Crush Laceration without Fracture or Compartment Syndrome',
        distinguishingFeatures: 'Normal forearm X-ray, soft compartments, pain proportional after analgesia.',
        actionIfConfirmed: 'Conservative sharp debridement of ischemic flaps (Friedrich excision within 6–8h) or DPC if heavily swollen.'
      },
      {
        condition: 'Developing Acute Compartment Syndrome',
        distinguishingFeatures: 'Pain out of proportion, pain on passive finger stretch, tense wooden forearm.',
        actionIfConfirmed: 'Immediate Orthopedic Surgery consult for emergent fasciotomy.'
      }
    ],
    redFlagsForSurgicalConsult: [
      'Tense compartment or pain on passive stretch of fingers',
      'Underlying bone fracture on X-ray',
      'Extensive degloving flap requiring plastic surgical reconstruction'
    ],
    woundToiletProtocol: [
      'Obtain X-ray to rule out underlying fracture.',
      'Cleanse surrounding skin; irrigate thoroughly with warm 0.9% normal saline.',
      'Perform meticulous sharp debridement of obviously necrotic, crushed skin tags and non-contractile dark muscle.',
      'If tension or severe edema prevents tension-free closure, leave open for Delayed Primary Closure at 48–72h.'
    ],
    anesthesiaPlan: '1% Lidocaine plain regional field block (after documenting radial/ulnar/median sensory & motor exam).',
    closureAndSuturePlan: {
      closureType: 'Delayed Primary Closure (preferred if edematous) or Tension-Free Interrupted / Vertical Mattress',
      sutureMaterial: 'Prolene (plasticity accommodates post-traumatic swelling) or Nylon',
      gauge: '4/0 (Upper limb)',
      needleType: '3/8 Reverse Cutting',
      technique: 'Vertical Mattress (Donati) or spaced Simple Interrupted without strangulation',
      removalDays: '8–10 days'
    },
    prophylaxisAndFollowUp: [
      'Strict elevation above heart level for 48 hours to limit edema.',
      'Written compartment-syndrome & infection return precautions.'
    ],
    pdfCitations: ['Pécs Surgical Manual (Ch. 7 — Vulnus contusum, Prolene plasticity)', 'Glasgow Suturing Guide (p. 6–10)']
  },
  {
    id: 'pediatric_facial_glue',
    title: 'Pediatric Clean Forehead Laceration (Tissue Adhesive)',
    latinClassification: 'Vulnus scissum faciei (Pediatric Grade I–II)',
    category: 'Pediatric / Adhesive',
    setting: 'General Practice Clinic',
    wound3DMode: 'superficial_incised',
    depthGrade: 'Grade I (Superficial)',
    contaminationClass: 'Clean',
    timeWindowRule: 'Face exception: closes cleanly up to 24–48h if clean; child <3h ideal for glue',
    triageDecision: 'CLINIC_PRIMARY_REPAIR',
    triageBadgeLabel: 'Clinic Toilet & Tissue Adhesive (or 6/0–7/0)',
    patientVignette:
      'A 5-year-old child falls against a coffee table, sustaining a clean, linear 1.8 cm superficial laceration on the mid-forehead above the eyebrow. Edges approximate easily with gentle finger pressure; minimal bleeding.',
    vitalSigns: { hr: '112 bpm', bp: '96/60 mmHg', capRefill: '< 2 sec', hemorrhageClass: 'Class I' },
    exposedStructures: ['epidermis', 'dermis'],
    keyFindingsToDetect: [
      'Clean linear edges under low tension that oppose smoothly without gaping',
      'Not crossing eyebrow vermilion/eyelid margin and NOT active arterial bleeding',
      'Face rich vascularity allows extended closure window (up to 24–48h) and excellent healing'
    ],
    differentialDiagnoses: [
      {
        condition: 'Superficial Low-Tension Facial Laceration',
        distinguishingFeatures: 'Length < 3–4 cm, dry bed after pressure, edges oppose effortlessly.',
        actionIfConfirmed: 'Saline cleanse + 2-octylcyanoacrylate tissue adhesive (Dermabond / Histoacryl) or Steri-Strips.'
      },
      {
        condition: 'Deep / Tension / Eyelid / Vermilion Border Facial Laceration',
        distinguishingFeatures: 'Gaping frontalis muscle, crosses lip vermilion or eyelid tarsal plate.',
        actionIfConfirmed: 'Sutured layered closure (6/0–7/0 Nylon or Vicryl Rapide; specialist if eyelid/vermilion).'
      }
    ],
    redFlagsForSurgicalConsult: [
      'Involvement of eyelid margin, lacrimal duct, facial nerve branches, or parotid duct',
      'Complex vermilion border misalignment of the lip',
      'Uncooperative child needing sedation for deep layered repair'
    ],
    woundToiletProtocol: [
      'Achieve complete hemostasis with gentle sterile gauze pressure for 3–5 minutes.',
      'Irrigate gently with sterile 0.9% normal saline; pat surrounding skin completely dry.',
      'Protect eyes with sterile gauze/petroleum jelly barrier below forehead so liquid glue CANNOT drip into eyes.',
      'Hold wound edges closely opposed with fingers/forceps while applying 2–3 thin layers of tissue adhesive OVER the surface (never INSIDE the wound gap) and hold 30–60 seconds.'
    ],
    anesthesiaPlan: 'Topical LET gel (if available) or no injection required when tissue adhesive is selected; warn child/parent of mild exothermic warmth during polymerization.',
    closureAndSuturePlan: {
      closureType: 'Tissue Adhesive (2-octylcyanoacrylate / Histoacryl) or Vicryl Rapide if sutured',
      sutureMaterial: 'Dermabond / Histoacryl (or 6/0–7/0 Nylon / Vicryl Rapide in children)',
      gauge: '6/0 – 7/0 (Child face: reduce adult 5/0–6/0 by 1–2 gauges)',
      needleType: '3/8 Reverse Cutting (if sutured)',
      technique: 'Surface polymer bridge held 30 seconds; no suture removal needed',
      removalDays: 'Glue sloughs naturally in 5–10 days (if sutured face: 3–5 days)'
    },
    prophylaxisAndFollowUp: [
      'Advise parents: do NOT apply ointments/creams (dissolves cyanoacrylate glue) and avoid picking crust.',
      'Quick shower allowed after 24 hours; pat dry; avoid swimming/soaking.'
    ],
    pdfCitations: ['Glasgow Suturing Guide (p. 6, 12, 23–25)', 'BCEMN Patient Sheet (p. 1–2)']
  },
  {
    id: 'plantar_puncture_shoe',
    title: 'Plantar Nail Puncture Through Rubber-Soled Shoe',
    latinClassification: 'Vulnus punctum (Deceptive Deep Tract)',
    category: 'Contaminated / Bite / Foreign Body',
    setting: 'Emergency Department',
    wound3DMode: 'contaminated_crush_foreign',
    depthGrade: 'Grade III (Fascia / Muscle)',
    contaminationClass: 'Contaminated',
    timeWindowRule: 'Never suture puncture orifice — Explore/irrigate & screen for Pseudomonas / retained sole',
    triageDecision: 'URGENT_DELAYED_CLOSURE',
    triageBadgeLabel: 'Do Not Suture — Decompression, X-Ray & Targeted Abx',
    patientVignette:
      'A 33-year-old construction worker steps on a nail penetrating his rubber sneaker into the plantar forefoot 18 hours ago. Surface shows only a 3 mm pinhole, yet patient has deep throbbing pain and swelling.',
    vitalSigns: { hr: '90 bpm', bp: '126/78 mmHg', capRefill: '< 2 sec', hemorrhageClass: 'Class I' },
    exposedStructures: ['epidermis', 'dermis', 'subcutis', 'fascia', 'tendon'],
    keyFindingsToDetect: [
      'Classic vulnus punctum: tiny benign-appearing surface opening masking deep plantar fascia inoculation',
      'Risk of retained rubber sneaker core or rust fragment (order foot X-ray / ultrasound)',
      'Classic Pseudomonas aeruginosa osteochondritis risk (through moist rubber sole) + Clostridium tetani anaerobic risk'
    ],
    differentialDiagnoses: [
      {
        condition: 'Deep Plantar Puncture with Retained Foreign Core / Early Pseudomonas',
        distinguishingFeatures: 'Pain >12–24h post-injury through sneaker, deep tenderness over metatarsal head.',
        actionIfConfirmed: 'X-ray, open skin unroofing if needed, saline irrigation, leave OPEN, anti-pseudomonal coverage if osteochondritis suspected, or Surgical consult if deep abscess/bone.'
      },
      {
        condition: 'Deep Plantar Abscess / Septic Arthritis of MTP Joint',
        distinguishingFeatures: 'Fluctuance, dorsal foot edema, pain on passive toe dorsiflexion, fever.',
        actionIfConfirmed: 'Immediate Surgical I&D in OR.'
      }
    ],
    redFlagsForSurgicalConsult: [
      'MTP joint pain on passive motion or bone involvement on X-ray',
      'Deep plantar space abscess / fluctuance',
      'Plantar digital nerve numbness or flexor hallucis loss'
    ],
    woundToiletProtocol: [
      'NEVER suture a punctured wound closed (seals anaerobic bacteria and Pseudomonas inside).',
      'Obtain foot X-rays to exclude retained metallic tip or osteomyelitis.',
      'Prep intact plantar skin with antiseptic, infiltrate posterior tibial block or clean peripheral border, sharply pare/unroof calloused entry to allow drainage, and irrigate gently.',
      'Leave OPEN with sterile absorbent dressing.'
    ],
    anesthesiaPlan: 'Posterior tibial nerve block or peripheral 1% Lidocaine plain (never adrenaline in toes/distal forefoot).',
    closureAndSuturePlan: {
      closureType: 'Heal by Secondary Intention (NEVER suture punctured wounds)',
      sutureMaterial: 'None — open drainage',
      gauge: 'N/A',
      needleType: 'N/A',
      technique: 'Open saline irrigation & non-adherent dressing',
      removalDays: 'Re-evaluate at 48 hours for escalating pain/erythema'
    },
    prophylaxisAndFollowUp: [
      'Mandatory Tetanus status verification.',
      'Advise off-loading crutches; strict 24–48h follow-up for Pseudomonas osteochondritis signs.'
    ],
    pdfCitations: ['Pécs Surgical Manual (Ch. 7 — Vulnus punctum)', 'WHO Wound Protocol (p. 2–3)']
  },
  {
    id: 'war_gunshot_high_energy',
    title: 'High-Energy Ballistic / Gunshot Thigh Wound',
    latinClassification: 'Vulnus sclopetarium (High-Energy Cavitation)',
    category: 'High-Energy / Crush',
    setting: 'Emergency Department',
    wound3DMode: 'contaminated_crush_foreign',
    depthGrade: 'Grade IV (Deep / Compound)',
    contaminationClass: 'Contaminated',
    timeWindowRule: 'WHO Rule: War/gunshot wounds are NEVER closed primarily (except penetrating skull/thorax/abdomen)',
    triageDecision: 'IMMEDIATE_SURGICAL_CONSULT',
    triageBadgeLabel: 'Immediate Trauma Surgery (OR Debridement & DPC)',
    patientVignette:
      'A 28-year-old sustains a through-and-through gunshot wound to the lateral thigh. Entry hole is 1 cm; exit wound is 5 cm with pulped muscle, clothing fibers sucked into the tract, and brisk venous bleeding.',
    vitalSigns: { hr: '126 bpm', bp: '88/58 mmHg', capRefill: '3.5 sec', hemorrhageClass: 'Class III' },
    exposedStructures: ['epidermis', 'dermis', 'subcutis', 'fascia', 'muscle', 'artery_vein'],
    keyFindingsToDetect: [
      'Class III hemorrhage (>1500 mL, HR >120, falling BP, prolonged cap refill) — ABC resuscitation first',
      'Cavitation necrosis far wider than skin opening; dark soft non-contractile non-bleeding quadriceps muscle',
      'Embedded clothing/wadding; check femoral/popliteal pulses & sciatic nerve'
    ],
    differentialDiagnoses: [
      {
        condition: 'Class III Hemorrhagic Shock + Deep Ballistic Myonecrosis',
        distinguishingFeatures: 'Tachycardia >120, hypotension, massive deep soft-tissue cavitation.',
        actionIfConfirmed: 'Immediate ATLS resuscitation + Trauma Surgery OR for radical debridement & DPC.'
      },
      {
        condition: 'Femoral Vascular Injury / Pseudoaneurysm',
        distinguishingFeatures: 'Absent pedal pulses, ABI <0.9, expanding pulsatile thigh hematoma.',
        actionIfConfirmed: 'Immediate Vascular Surgery / OR exploration.'
      }
    ],
    redFlagsForSurgicalConsult: [
      'Class III–IV Hemorrhagic Shock',
      'Any gunshot/blast injury (universal surgical OR debridement)',
      'Distal vascular or nerve compromise'
    ],
    woundToiletProtocol: [
      'ABC priority: direct pressure / hemostatic packing + 2 large-bore IV crystalloids / blood products.',
      'In OR: wide longitudinal skin & fascia incision to decompress tract, extract foreign clothing/missile fragments.',
      'Sharply excise all devitalized muscle (dark, soft, non-contractile, non-bleeding) and irrigate with liters of warm 0.9% normal saline.',
      'WHO Rule: Leave wound widely OPEN packed with fluffed dry/saline gauze — NEVER close primarily (exception: penetrating skull, thorax, or abdomen).'
    ],
    anesthesiaPlan: 'General Anesthesia in Operating Theatre following hemodynamic resuscitation.',
    closureAndSuturePlan: {
      closureType: 'WHO Delayed Primary Closure at 48h–5 days (once clean) or Skin Graft',
      sutureMaterial: 'Heavy Nylon / Retention or Vacuum-assisted dressing in OR',
      gauge: '2/0 – 3/0 (Lower limb)',
      needleType: '3/8 Reverse Cutting',
      technique: 'Delayed primary closure only after infection-free interval',
      removalDays: '12–14 days post-DPC'
    },
    prophylaxisAndFollowUp: [
      'IV Penicillin/Metronidazole/Cephalosporin + Tetanus toxoid & TIG.',
      'Planned second-look OR dressing change at 48 hours.'
    ],
    pdfCitations: ['WHO Wound Protocol (p. 2–4)', 'Pécs Surgical Manual (Ch. 5, 7 — Hemorrhage Classes & Vulnus sclopetarium)']
  },
  {
    id: 'infected_abscess_pus',
    title: 'Fluctuant Cutaneous Abscess with Purulent Discharge',
    latinClassification: 'Abscessus cutaneus (Infected Wound)',
    category: 'Contaminated / Bite / Foreign Body',
    setting: 'General Practice Clinic',
    wound3DMode: 'contaminated_crush_foreign',
    depthGrade: 'Grade II (Subcutaneous)',
    contaminationClass: 'Infected',
    timeWindowRule: 'Pus present -> NEVER suture; Incision, Drainage (I&D) & Secondary Intention',
    triageDecision: 'CONSERVATIVE_SECONDARY',
    triageBadgeLabel: 'Incision & Drainage + Secondary Intention Healing',
    patientVignette:
      'A 38-year-old diabetic patient presents with a painful, warm, erythematous, fluctuant 4 cm mass on the posterior trunk draining thick yellow pus from a central punctum.',
    vitalSigns: { hr: '92 bpm', bp: '134/82 mmHg', capRefill: '< 2 sec', hemorrhageClass: 'Class I' },
    exposedStructures: ['epidermis', 'dermis', 'subcutis'],
    keyFindingsToDetect: [
      'Classic 5 signs of inflammation (rubor, tumor, calor, dolor, functio laesa) + central fluctuance and pus',
      'CRITICAL RULE: Infected wounds with pus are NEVER sutured primarily',
      'Systemic diabetes increases necrotizing soft-tissue infection risk — check for crepitus or rapidly advancing borders'
    ],
    differentialDiagnoses: [
      {
        condition: 'Localized Subcutaneous Abscess',
        distinguishingFeatures: 'Well-demarcated fluctuant collection, intact fascia below.',
        actionIfConfirmed: 'Field-block anesthesia around perimeter, generous incision along Langer lines, break up loculations, saline washout, wick/pack open.'
      },
      {
        condition: 'Necrotizing Fasciitis',
        distinguishingFeatures: 'Pain disproportionate to skin findings, bullae, grey dishwater fluid, systemic toxicity, crepitus.',
        actionIfConfirmed: 'Immediate Surgical Consult for emergent OR radical debridement + broad-spectrum IV antibiotics.'
      }
    ],
    redFlagsForSurgicalConsult: [
      'Perianal / perineal (Fournier gangrene) or deep neck/hand space abscess',
      'Subcutaneous crepitus, skin anesthesia, hemorrhagic bullae, or sepsis',
      'Failure to resolve or immunocompromised state with deep extension'
    ],
    woundToiletProtocol: [
      'Apply skin antiseptic in septic inward-spiraling or clean-to-dirty zone prep.',
      'Do NOT inject local anesthetic directly into inflamed/acidic pus cavity (ineffective & spreads infection); infiltrate circumferential field block in healthy perimeter skin.',
      'Make dependent incision, evacuate pus (send swab for C&S), break up internal loculations gently with hemostat/finger, irrigate with 0.9% saline.',
      'Insert loose gauze wick or Penrose drain; NEVER place sutures.'
    ],
    anesthesiaPlan: 'Field block with 1% Lidocaine plain in healthy surrounding margin (acidic inflamed tissue neutralizes lidocaine).',
    closureAndSuturePlan: {
      closureType: 'Secondary Intention (Granulation & Contraction from base upward)',
      sutureMaterial: 'None — open drainage pack/wick',
      gauge: 'N/A',
      needleType: 'N/A',
      technique: 'Open I&D + regular dressing changes',
      removalDays: 'Remove/exchange pack at 24–48 hours'
    },
    prophylaxisAndFollowUp: [
      'Strict glycemic control check; oral antibiotics if surrounding cellulitis or diabetes/systemic signs.',
      'Daily warm saline/shower rinses once pack removed.'
    ],
    pdfCitations: ['WHO Wound Protocol (p. 1–2)', 'Pécs Surgical Manual (Ch. 4, 7)', 'Glasgow Suturing Guide (p. 7–8)']
  },
  {
    id: 'postop_hematoma_dehiscence',
    title: 'Post-Operative Wound Hematoma & Partial Dehiscence',
    latinClassification: 'Dehiscentia vulneris & Haematoma (Day 4)',
    category: 'Post-Op Complication',
    setting: 'General Practice Clinic',
    wound3DMode: 'sutured_interrupted',
    depthGrade: 'Grade II (Subcutaneous)',
    contaminationClass: 'Clean-Contaminated',
    timeWindowRule: 'Day 4 post-op: Evacuate tense hematoma/seroma; assess fascia before re-closing',
    triageDecision: 'URGENT_DELAYED_CLOSURE',
    triageBadgeLabel: 'Evacuate Clot, Inspect Fascia & Manage Open / Re-approximate',
    patientVignette:
      'A 61-year-old on aspirin returns 4 days after an inguinal/trunk excisional closure complaining of sudden dark bloody ooze, tense swelling beneath the suture line, and two popped simple interrupted sutures.',
    vitalSigns: { hr: '84 bpm', bp: '136/80 mmHg', capRefill: '< 2 sec', hemorrhageClass: 'Class I' },
    exposedStructures: ['epidermis', 'dermis', 'subcutis', 'fascia'],
    keyFindingsToDetect: [
      'Tense subcutaneous clot separating dermal edges (hematoma acts as bacterial culture medium)',
      'Rule out fascial dehiscence / evisceration ("pink salmon fluid" sign in abdominal wounds)',
      'Evaluate for surgical site infection (pus, warmth, systemic fever)'
    ],
    differentialDiagnoses: [
      {
        condition: 'Superficial Subcutaneous Hematoma & Skin Dehiscence',
        distinguishingFeatures: 'Intact deep fascia beneath clot, dark blood clot without purulence.',
        actionIfConfirmed: 'Remove offending sutures to evacuate clot, irrigate with 0.9% saline, achieve hemostasis, and manage by secondary intention or DPC.'
      },
      {
        condition: 'Deep Fascial Dehiscence / Abdominal Evisceration',
        distinguishingFeatures: 'Serosanguinous "salmon-pink" gush, palpable fascial gap or bowel loops.',
        actionIfConfirmed: 'Immediate Surgical Consultation; cover with sterile warm saline-soaked towels and return to OR.'
      }
    ],
    redFlagsForSurgicalConsult: [
      'Deep fascial defect or exposed viscera / mesh / prosthesis',
      'Ongoing arterial bleeding requiring OR exploration',
      'Spreading necrotizing infection or deep space abscess'
    ],
    woundToiletProtocol: [
      'Cleanse surrounding skin with antiseptic.',
      'Remove 2–3 sutures over the tense bulge using sterile stitch cutter/iris scissors (cut below knot, pull cleanly).',
      'Gently express liquefied/clotted hematoma and irrigate cavity with warm 0.9% normal saline; confirm intact deep fascia.',
      'Pack loosely with saline gauze if deep pocket; allow secondary healing or DPC once dry.'
    ],
    anesthesiaPlan: 'Topical or peripheral margin 1% Lidocaine plain if gentle exploration causes discomfort.',
    closureAndSuturePlan: {
      closureType: 'Open Drainage -> Secondary Intention or Delayed Closure once hemostatic & clean',
      sutureMaterial: 'Monofilament Nylon / Steri-Strips (only if clean & shallow)',
      gauge: '3/0 (Trunk)',
      needleType: '3/8 Reverse Cutting',
      technique: 'Evacuate clot; avoid re-suturing over an un-drained pocket',
      removalDays: 'Remaining intact sutures removed at 8–12 days'
    },
    prophylaxisAndFollowUp: [
      'Review antiplatelet/anticoagulant bleeding risk with prescribing clinician.',
      'Monitor daily for superinfection of residual hematoma.'
    ],
    pdfCitations: ['Pécs Surgical Manual (Ch. 7 — Seroma, Hematoma, Dehiscence)', 'BCEMN Patient Sheet (p. 2)']
  },
  {
    id: 'scalp_laceration_staples_mattress',
    title: 'Bleeding Occipital Scalp Laceration (Galea Intact)',
    latinClassification: 'Vulnus lacerum capitis (High Vascularity)',
    category: 'Clean / Acute',
    setting: 'Emergency Department',
    wound3DMode: 'sutured_mattress',
    depthGrade: 'Grade II (Subcutaneous)',
    contaminationClass: 'Clean',
    timeWindowRule: 'Presented at 3 hours (< 6–12h window); scalp vascularity resists infection',
    triageDecision: 'CLINIC_PRIMARY_REPAIR',
    triageBadgeLabel: 'Clinic Toilet & Vertical Mattress / Staples / 3-0 Nylon',
    patientVignette:
      'A 47-year-old hits the back of his head on a cabinet door, sustaining a briskly bleeding 4 cm linear occipital scalp laceration. Neurologic exam is normal (GCS 15, no skull step-off); galea aponeurotica is intact.',
    vitalSigns: { hr: '80 bpm', bp: '128/78 mmHg', capRefill: '< 2 sec', hemorrhageClass: 'Class I' },
    exposedStructures: ['epidermis', 'dermis', 'subcutis', 'fascia'],
    keyFindingsToDetect: [
      'Profuse bleeding from dense scalp dermal capillary/arterial plexus (control with pressure/mattress hemostasis)',
      'Palpate gently with gloved finger during exploration to exclude skull fracture step-off or galeal tear',
      'Use blue/dark-colored suture (e.g., Nylon/Prolene) so stitches are easily visible against hair during removal'
    ],
    differentialDiagnoses: [
      {
        condition: 'Superficial Scalp Laceration (Intact Galea)',
        distinguishingFeatures: 'GCS 15, intact galea aponeurotica, no palpable skull step-off.',
        actionIfConfirmed: 'Irrigate, clip minimal hair if obstructing (avoid shaving with razor — increases SSI), close with 3/0–4/0 Nylon or staples.'
      },
      {
        condition: 'Depressed Skull Fracture / Galeal Breach / Intracranial Injury',
        distinguishingFeatures: 'Palpable bone step-off, GCS <15, Battle sign, CSF leak, anticoagulation.',
        actionIfConfirmed: 'Urgent Head CT & Neurosurgery consultation.'
      }
    ],
    redFlagsForSurgicalConsult: [
      'Palpable skull fracture or exposed cranium/dura',
      'Neurological deficit, loss of consciousness, or anticoagulated head trauma',
      'Wide galeal defect (>5 mm) needing absorbable galeal repair before skin'
    ],
    woundToiletProtocol: [
      'Apply direct pressure for 5–10 minutes to slow scalp bleeding; trim (clip, do NOT razor-shave) hair 2–3 mm around edges if tangling.',
      'Scrub surrounding scalp with chlorhexidine/povidone-iodine; infiltrate 1% Lidocaine plain into wound edges (consider adrenaline only if no contraindication and severe ooze, though plain + vertical mattress hemostasis suffices).',
      'Irrigate with sterile 0.9% saline and palpate galea/cranium gently with sterile gloved finger.'
    ],
    anesthesiaPlan: '1% Lidocaine plain infiltrated directly through wound margins into subcutaneous galeal plane.',
    closureAndSuturePlan: {
      closureType: 'Primary Intention with Hemostatic Eversion',
      sutureMaterial: 'Colored Monofilament Nylon / Prolene (visible against hair) or Surgical Staples',
      gauge: '3/0 – 4/0 (Adult scalp; child 4/0–5/0)',
      needleType: '3/8 Circle Reverse Cutting',
      technique: 'Vertical Mattress (Donati) for hemostasis + eversion, or Simple Interrupted / Staples',
      removalDays: '7–10 days (up to 14 days if high tension)'
    },
    prophylaxisAndFollowUp: [
      'Written head-injury warning sheet + BCEMN wound care instructions.',
      'Gentle hair wash allowed after 24 hours; remove staples with dedicated staple remover.'
    ],
    pdfCitations: ['Glasgow Suturing Guide (p. 6, 13, 25)', 'Pécs Surgical Manual (Ch. 7)', 'BCEMN Patient Sheet (p. 1–2)']
  }
];
