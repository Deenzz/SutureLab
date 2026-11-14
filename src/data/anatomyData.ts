import { AnatomicalStructure, PdfSourceRef } from '../types/clinical';

export const PDF_SOURCES: PdfSourceRef[] = [
  {
    id: 'pecs',
    title: 'Basic Surgical Techniques (University of Pécs Medical School, 2008)',
    shortLabel: 'Pécs Surgical Manual',
    filePath: '/assets/aistudio/BASIC_SURGICAL_TECHNIQUES_7a982a24.pdf',
    pages: '111 pp',
    summary: 'Asepsis, surgical instruments, wound classification, surgical toilet, hemorrhage classes, suture materials, knots, and drains.'
  },
  {
    id: 'glasgow',
    title: 'Suturing Procedures Guidance & 36-Point OSCE Checklist (University of Glasgow)',
    shortLabel: 'Glasgow Suturing Guide',
    filePath: '/assets/aistudio/Media_678215_smxx_fa1f74f5.pdf',
    pages: '36 pp',
    summary: 'Skin anatomy, wound assessment, lidocaine dosing, adult/child suture gauges, tissue glue, Steri-Strips, removal & Appendix A OSCE checklist.'
  },
  {
    id: 'uqu',
    title: 'Basic Suturing Skills Booklet (UQU Medical Students Club)',
    shortLabel: 'UQU Suturing Booklet',
    filePath: '/assets/aistudio/Basic_suturing_skills_booklet__2d736496.pdf',
    pages: '34 pp',
    summary: 'Needle anatomy & curvature, instrument grip, interrupted/mattress/subcuticular stitch mechanics, and knot tying.'
  },
  {
    id: 'who',
    title: 'WHO Wound Management Clinical Protocol (s16369e)',
    shortLabel: 'WHO Wound Protocol',
    filePath: '/assets/aistudio/s16369e_9f296a96.pdf',
    pages: '4 pp',
    summary: 'Clean vs. clean-contaminated vs. contaminated vs. infected wound healing, delayed primary closure at 48 hours, and war/gunshot injury rules.'
  },
  {
    id: 'bcemn',
    title: 'Wound Care — Sutures (Stitches) Patient Discharge Guide (BCEMN)',
    shortLabel: 'BCEMN Patient Sheet',
    filePath: '/assets/aistudio/Wound-Care-Sutures_cd5fc143.pdf',
    pages: '2 pp',
    summary: '24-hour dry rule, gentle washing, suture removal timelines by region, and red-flag infection warning signs.'
  },
  {
    id: 'aki',
    title: 'Handbook of Basic Surgical Suturing (Dr. Jan M. Rather, 2023)',
    shortLabel: 'AkiNik Suturing Handbook',
    filePath: '/assets/aistudio/Book_49b7a307.pdf',
    pages: '61 pp',
    summary: 'USP/metric gauges, synthetic vs. natural polymers, Halsted principles, specialty needles, knot security, and laparoscopic suturing.'
  },
  {
    id: 'who_alt',
    title: 'WHO Wound Management Reference Copy (s16369e-1)',
    shortLabel: 'WHO Reference Copy',
    filePath: '/assets/aistudio/s16369e__1__9f296a96.pdf',
    pages: '4 pp',
    summary: 'Mirror clinical reference of WHO surgical wound dressing, debridement, and secondary closure guidance.'
  }
];

export const ANATOMICAL_STRUCTURES: AnatomicalStructure[] = [
  {
    id: 'epidermis',
    layerGroup: 'epidermis',
    name: 'Epidermis',
    latinName: 'Stratum corneum – Stratum basale',
    depthOrder: 1,
    baseY: 1.45,
    anchor3D: [0, 1.56, 0.4],
    colorHex: '#E8B89A',
    summary: 'Avascular outer keratinized stratified squamous epithelium with 5 cellular layers; houses melanocytes and repairs via basal cell proliferation.',
    histologyAndAnatomy:
      'No blood vessels and no nerve endings reside within the epidermis itself. Only superficial abrasions confined to epidermis heal without scarring via regeneration from the basal germinal layer.',
    clinicalDetectionSigns: [
      'Abrasion or superficial graze with serous ooze and NO frank arterial/venous bleeding',
      'Preserved skin turgor and absence of gaping dermal edges',
      'Intact capillary refill beneath translucent outer layer'
    ],
    deepExposureRisk: 'NONE',
    suturingAndToiletRules: [
      'Pure epidermal wounds do NOT require suturing — clean with sterile 0.9% normal saline and apply non-adherent dressing or Steri-Strips if linear.',
      'During cutaneous suturing, evert epidermal margins cleanly ("brandy-glass" bite wider at base than apex) to prevent step-off inversion and depressed scarring.',
      'Skin antiseptics (chlorhexidine 0.5%, povidone-iodine, 70% isopropanol) are applied ONLY to surrounding intact epidermis — never poured into deeper layers.'
    ],
    commonFindings: ['Superficial abrasion (excoriation)', 'Epidermal avulsion flap', 'Crusting serum around healing stitches (clean with H2O2 before removal)'],
    pdfCitations: ['Glasgow Suturing Guide (p. 4–5)', 'Pécs Surgical Manual (Ch. 7)']
  },
  {
    id: 'dermis',
    layerGroup: 'dermis',
    name: 'Dermis (Corium)',
    latinName: 'Stratum papillare & reticulare',
    depthOrder: 2,
    baseY: 1.05,
    anchor3D: [-0.7, 1.12, 0.55],
    colorHex: '#D97B73',
    summary: 'Tough, living vascular collagen-elastin matrix containing capillary plexuses, sensory nerve endings, hair follicles, sweat glands, and sebaceous glands.',
    histologyAndAnatomy:
      'The dermis is the ONLY layer of skin that bleeds when cut and holds suture tension reliably. Once breached, dermal healing relies on granulation tissue and leaves a dry fibrous scar devoid of sweat glands and hair follicles.',
    clinicalDetectionSigns: [
      'Gaping wound margins exposing glistening pink-white fibrous corium with punctate capillary bleeding',
      'Intact distal sensation & tendon motion despite sharp pain at wound edges',
      'Visible hair follicle bases and dermal papillae on close inspection'
    ],
    deepExposureRisk: 'NONE',
    suturingAndToiletRules: [
      'Primary structural anchor for skin closure: pass 3/8-circle reverse-cutting needle perpendicular (90°) through epidermis into mid-dermis.',
      'Subcuticular (intracutaneous) sutures run strictly horizontally within the dermal plane for minimal cosmetic scarring.',
      'Leave knots off the incision line (to one side) so suture tracks do not scar over the wound apex.'
    ],
    commonFindings: ['Simple linear laceration (Grade I–II)', 'Dermal step-off / inverted edges', 'Tension gape along Langer lines'],
    pdfCitations: ['Glasgow Suturing Guide (p. 4–5, 19–22)', 'AkiNik Handbook (p. 11–18)']
  },
  {
    id: 'subcutis',
    layerGroup: 'subcutis',
    name: 'Subcutaneous Tissue (Adipose)',
    latinName: 'Tela subcutanea / Hypodermis',
    depthOrder: 3,
    baseY: 0.55,
    anchor3D: [0.85, 0.62, 0.52],
    colorHex: '#E5BE5C',
    summary: 'Lobulated yellow adipose tissue traversed by superficial cutaneous veins, lymphatic channels, and sensory cutaneous nerves.',
    histologyAndAnatomy:
      'Provides thermal insulation, cushioning, and mobility over deeper fascia. Poor vascularity relative to dermis makes fat vulnerable to ischemia, necrosis, and bacterial seeding if crushed or strangulated by tight sutures.',
    clinicalDetectionSigns: [
      'Yellow lobulated fat protruding into the gaping wound floor',
      'Venous oozing from superficial subcutaneous tributaries',
      'Must inspect base carefully to rule out deeper fascial breach or foreign debris trapped between fat lobules'
    ],
    deepExposureRisk: 'MODERATE',
    suturingAndToiletRules: [
      'CRITICAL RULE (Pécs & Glasgow): Subcutaneous fat itself MUST NOT be sutured directly — tight stitches through fat cause ischemic fat necrosis and seroma/infection.',
      'Close deep dead space only by anchoring the superficial fascia / deep dermal junction with interrupted absorbable Vicryl (3/0 or 4/0) buried knots.',
      'Copiously irrigate fat recesses with warm sterile 0.9% normal saline to flush out particulate debris and clot.'
    ],
    commonFindings: ['Dead-space seroma or hematoma risk', 'Retained glass shards hidden in fat lobules (X-ray required)', 'Wound dehiscence if deep dermal tension unrelieved'],
    pdfCitations: ['Pécs Surgical Manual (Ch. 7–8)', 'Glasgow Suturing Guide (p. 5, 19)']
  },
  {
    id: 'fascia',
    layerGroup: 'fascia_muscle',
    name: 'Superficial & Deep Fascia',
    latinName: 'Fascia superficialis / profunda',
    depthOrder: 4,
    baseY: 0.12,
    anchor3D: [-1.05, 0.18, 0.45],
    colorHex: '#DCE4EC',
    summary: 'Dense pearly-white collagenous fibrous sheet investing skeletal muscle compartments and transmitting mechanical tensile load.',
    histologyAndAnatomy:
      'Strongest soft-tissue layer for holding deep tension sutures. A breach in deep fascia elevates wound depth to Grade III and mandates systematic exploration for underlying muscle, tendon, or neurovascular injury.',
    clinicalDetectionSigns: [
      'Glistening pearly-white fibrous aponeurotic sheet visible beneath yellow fat',
      'Distinct linear tear or defect allowing dark red muscle belly to herniate through',
      'High-tension gape requiring layered closure'
    ],
    deepExposureRisk: 'MODERATE',
    suturingAndToiletRules: [
      'Approximate torn fascia cleanly using synthetic absorbable suture (Vicryl / Dexon or PDS II for high-tension fascia) with a taper-cut or heavy taper needle.',
      'Do NOT close fascia under severe tension over swollen traumatized muscle (compartment syndrome risk -> surgical consultation).',
      'Inspect beneath any fascial laceration before closing.'
    ],
    commonFindings: ['Fascial rent with muscle herniation', 'Deep pocket hematoma beneath fascia', 'Grade III laceration'],
    pdfCitations: ['Pécs Surgical Manual (Ch. 6–7)', 'AkiNik Handbook (p. 21–24)']
  },
  {
    id: 'muscle',
    layerGroup: 'fascia_muscle',
    name: 'Skeletal Muscle Layer',
    latinName: 'Musculus skeletalis',
    depthOrder: 5,
    baseY: -0.35,
    anchor3D: [0.95, -0.28, 0.4],
    colorHex: '#9E3136',
    summary: 'Vascular striated contractile muscle fibers arranged in fascicles; crucial indicator of tissue viability during wound debridement.',
    histologyAndAnatomy:
      'Healthy muscle is bright beefy red, firm, contracts briskly when pinched with forceps, and bleeds freely when cut (the 4 C’s: Color, Consistency, Contractility, Circulation/Bleeding).',
    clinicalDetectionSigns: [
      'Viable muscle: bright red, firm, contracts on forceps pinch, bleeds on sharp cut',
      'DEVITALIZED / NECROTIC muscle (4 signs from Pécs/WHO): dark/dusky color, soft/mushy consistency, fails to contract when pinched, does NOT bleed when cut',
      'Significant venous/arteriolar oozing in lacerated muscle bellies'
    ],
    deepExposureRisk: 'CRITICAL_SURGICAL_CONSULT',
    suturingAndToiletRules: [
      'WHO & Pécs Protocol: Sharply excise ALL devitalized/necrotic muscle until bright red, bleeding, contractile tissue is reached.',
      'Muscle bellies themselves are NEVER tightly sutured across fibers (causes necrosis); approximate only the overlying epimysium/fascia if clean and viable.',
      'Extensive muscle crush (vulnus contusum) or high-energy blast/gunshot requires immediate surgical OR debridement and delayed primary closure.'
    ],
    commonFindings: ['Devitalized muscle in crush/gunshot wounds', 'Anaerobic myonecrosis (gas gangrene) risk if closed primarily', 'Intramuscular hematoma'],
    pdfCitations: ['WHO Wound Protocol (p. 2–3)', 'Pécs Surgical Manual (Ch. 7)']
  },
  {
    id: 'artery_vein',
    layerGroup: 'deep_neurovascular',
    name: 'Major Artery & Vein Bundle',
    latinName: 'Arteria & Vena profunda',
    depthOrder: 6,
    baseY: -0.45,
    anchor3D: [-0.45, -0.38, 0.15],
    colorHex: '#C81E2B',
    summary: 'Deep arterial and venous conduits. Pulsatile bright-red arterial bleeding or distal ischemia is an absolute surgical consultation emergency.',
    histologyAndAnatomy:
      'Arteries exhibit thick elastic muscular walls and pulsatile bright-red high-pressure hemorrhage; veins exhibit thinner walls and dark-red continuous flow. Digital end-arteries (fingers, toes, ears, nose, penis) have zero collateral tolerance for vasoconstrictors.',
    clinicalDetectionSigns: [
      'Bright red pulsatile jetting or expanding hematoma -> arterial laceration',
      'Distal pallor, coolness, absent/diminished pulse, capillary refill > 2 seconds',
      'Class III–IV hemorrhagic shock signs (>1500 mL loss, HR > 120, falling BP/MAP)'
    ],
    deepExposureRisk: 'CRITICAL_SURGICAL_CONSULT',
    suturingAndToiletRules: [
      'IMMEDIATE SURGICAL / VASCULAR CONSULTATION: Never blindly clamp deep bleeding structures with hemostats (risk of crushing adjacent nerve).',
      'First-aid hemostasis: direct firm sterile pressure + limb elevation + targeted arterial pressure points while preparing OR.',
      'CRITICAL ANESTHESIA RULE: NEVER inject adrenaline (epinephrine) into digits, toes, ears, nose, or penis — causes irreversible end-artery ischemia and necrosis.'
    ],
    commonFindings: ['Partial or complete arterial transection', 'Expanding pseudoaneurysm / hematoma', 'Class II–IV hypovolemic shock'],
    pdfCitations: ['Pécs Surgical Manual (Ch. 5, 7)', 'Glasgow Suturing Guide (p. 7–8)']
  },
  {
    id: 'nerve',
    layerGroup: 'deep_neurovascular',
    name: 'Peripheral Nerve Trunk',
    latinName: 'Nervus periphericus (Fasciculi)',
    depthOrder: 6,
    baseY: -0.42,
    anchor3D: [0.42, -0.36, 0.22],
    colorHex: '#E9C440',
    summary: 'Glistening pale-yellow fasciculated nerve trunk conducting distal motor and sensory signals; easily severed in deep lacerations and punctures.',
    histologyAndAnatomy:
      'Surrounded by epineurium and perineurium. Severed peripheral nerves may produce surprisingly little ongoing wound pain, causing missed diagnosis unless active sensory (two-point discrimination) and motor testing are performed BEFORE local anesthesia.',
    clinicalDetectionSigns: [
      'Distal sensory loss (light touch / pinprick / 2-point discrimination) tested BEFORE lidocaine infiltration',
      'Distal motor weakness or loss of intrinsic muscle power',
      'Visible pale-yellow longitudinal fasciculated cord within deep wound floor'
    ],
    deepExposureRisk: 'CRITICAL_SURGICAL_CONSULT',
    suturingAndToiletRules: [
      'IMMEDIATE SURGICAL CONSULTATION (Plastic / Hand / Orthopedic Microsurgery): Primary epineurial repair in OR under magnification is required.',
      'ALWAYS document distal sensory and motor exam BEFORE injecting local anesthetic.',
      'Never blindly place hemostats or deep sutures near a bleeding vessel next to a nerve trunk.'
    ],
    commonFindings: ['Digital nerve transection in palmar/finger glass cuts', 'Neuropraxia from crush/contusion', 'Iatrogenic nerve injury from blind clamping'],
    pdfCitations: ['Glasgow Suturing Guide (p. 6–7)', 'Pécs Surgical Manual (Ch. 7)']
  },
  {
    id: 'tendon',
    layerGroup: 'deep_neurovascular',
    name: 'Tendon & Tendon Sheath',
    latinName: 'Tendo & Vagina tendinis',
    depthOrder: 7,
    baseY: -0.58,
    anchor3D: [0.0, -0.52, -0.15],
    colorHex: '#F1EFE7',
    summary: 'Dense, avascular, glistening white collagen cord enclosed in a synovial tendon sheath; partial (>50%) or complete division causes functional loss.',
    histologyAndAnatomy:
      'Tendons glide through synovial sheaths with low blood supply. Note Glasgow & Pécs warning: a completely severed tendon often hurts LESS than a partial tear and may retract proximally out of the wound field when the limb is in a different position than at injury.',
    clinicalDetectionSigns: [
      'Loss of active flexion or extension against resistance distal to the wound (e.g., FDS vs FDP isolation in digits)',
      'Abnormal resting cascade / posture of fingers or foot',
      'Pain on resisted movement suggests partial tendon laceration; visible white striated fibers in wound base'
    ],
    deepExposureRisk: 'CRITICAL_SURGICAL_CONSULT',
    suturingAndToiletRules: [
      'IMMEDIATE SURGICAL CONSULTATION (Hand / Orthopedic Surgery): Do NOT close skin over an unrecognized partial or complete tendon laceration.',
      'Inspect the wound through the full range of motion matching the posture at the time of injury so retracted tendon ends are not missed.',
      'Operative tendon repair uses non-absorbable Prolene/nylon or long-acting PDS with taper-cut/round needles (Kessler/Bunnell core suture in OR).'
    ],
    commonFindings: ['Flexor/extensor tendon laceration in wrist/hand', 'Retracted proximal tendon stump', 'Purulent tenosynovitis after puncture/bite'],
    pdfCitations: ['Glasgow Suturing Guide (p. 6–7)', 'Pécs Surgical Manual (Ch. 6–7)']
  },
  {
    id: 'joint_capsule',
    layerGroup: 'deep_skeletal',
    name: 'Joint Capsule & Synovium',
    latinName: 'Capsula articularis',
    depthOrder: 8,
    baseY: -0.78,
    anchor3D: [-0.88, -0.74, -0.25],
    colorHex: '#A7C4D8',
    summary: 'Fibrous capsular envelope sealing the sterile synovial joint cavity; any breach creates an open joint emergency with septic arthritis risk.',
    histologyAndAnatomy:
      'Commonly violated in MCP "fight bites" (human tooth strike over flexed knuckle), cat bites on dorsal hands/wrists, or deep periarticular lacerations.',
    clinicalDetectionSigns: [
      'Escaping clear/viscid straw-colored synovial fluid or fat globules from wound',
      'Visible articular cartilage or torn shiny white capsular margin',
      'Saline load test or air in joint on X-ray confirming intra-articular communication'
    ],
    deepExposureRisk: 'CRITICAL_SURGICAL_CONSULT',
    suturingAndToiletRules: [
      'IMMEDIATE ORTHOPEDIC / HAND SURGICAL CONSULTATION for formal joint washout in OR and IV antibiotics.',
      'NEVER suture a fight bite or periarticular bite wound in primary care — trapping oral flora inside a joint capsule leads to rapid cartilage destruction (septic arthritis).',
      'Splint joint in position of function pending surgical exploration.'
    ],
    commonFindings: ['MCP fight-bite capsular penetration', 'Cat-bite septic arthritis', 'Open traumatic arthrotomy'],
    pdfCitations: ['Glasgow Suturing Guide (p. 6–7)', 'WHO Wound Protocol (p. 2)']
  },
  {
    id: 'bone_periosteum',
    layerGroup: 'deep_skeletal',
    name: 'Bone Cortex & Periosteum',
    latinName: 'Os corticale & Periosteum',
    depthOrder: 9,
    baseY: -1.05,
    anchor3D: [0.0, -0.98, -0.05],
    colorHex: '#EBE4D1',
    summary: 'Rigid cortical bone invested by vascular, pain-sensitive periosteum; exposed bone or cortical breach defines a Grade IV open fracture.',
    histologyAndAnatomy:
      'Periosteum supplies outer cortical nutrition and contains dense nociceptive fibers. Exposed bone without soft-tissue coverage desiccates and undergoes osteomyelitis if not promptly irrigated and covered.',
    clinicalDetectionSigns: [
      'Grating crepitus, palpable bony step-off, or visible pale ivory cortex / bleeding marrow',
      'Visible bony fragment or open fracture line (Gustilo-Anderson open fracture protocol)',
      'Radio-opaque foreign body (glass) or cortical chip on mandatory radiograph'
    ],
    deepExposureRisk: 'CRITICAL_SURGICAL_CONSULT',
    suturingAndToiletRules: [
      'IMMEDIATE ORTHOPEDIC / TRAUMA SURGICAL CONSULTATION (Grade IV Compound Wound): Requires OR washout, fracture stabilization, IV antibiotics, and tetanus update.',
      'In clinic/ED initial stabilization: cover exposed bone with sterile moist normal saline gauze, splint limb, obtain X-ray, and avoid blind probing.',
      'Do NOT pull out impaled objects compressing deep bone/vessels outside OR.'
    ],
    commonFindings: ['Open fracture (compound wound)', 'Periosteal stripping over tibia/forearm', 'Glass fragment embedded adjacent to bone'],
    pdfCitations: ['Glasgow Suturing Guide (p. 5–7)', 'Pécs Surgical Manual (Ch. 7)', 'WHO Wound Protocol (p. 2–3)']
  }
];
