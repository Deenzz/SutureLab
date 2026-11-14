import React from 'react';
import { StitchTechniqueSpec } from '../types/clinical';

interface StitchDiagramSVGProps {
  diagramType: StitchTechniqueSpec['diagramType'];
  showLabels?: boolean;
}

export const StitchDiagramSVG: React.FC<StitchDiagramSVGProps> = ({
  diagramType,
  showLabels = true
}) => {
  return (
    <div className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 p-3">
      <svg
        viewBox="0 0 420 220"
        className="w-full h-auto max-h-[240px]"
        role="img"
        aria-label={`Annotated surgical diagram for ${diagramType}`}
      >
        {/* Subtle Clinical Grid */}
        <defs>
          <pattern id={`grid-${diagramType}`} width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeOpacity="0.06" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="420" height="220" fill={`url(#grid-${diagramType})`} className="text-slate-500" />

        {/* Cross-section Tissue Base for cross-section diagrams */}
        {(diagramType === 'simple_interrupted' ||
          diagramType === 'vertical_mattress' ||
          diagramType === 'allgower' ||
          diagramType === 'tissue_glue') && (
          <g>
            {/* Left & Right Epidermis */}
            <rect x="20" y="64" width="184" height="18" rx="2" fill="#E8B89A" stroke="#C58E6D" strokeWidth="1" />
            <rect x="216" y="64" width="184" height="18" rx="2" fill="#E8B89A" stroke="#C58E6D" strokeWidth="1" />
            {/* Left & Right Dermis */}
            <rect x="20" y="82" width="184" height="44" fill="#D97B73" stroke="#B75850" strokeWidth="1" />
            <rect x="216" y="82" width="184" height="44" fill="#D97B73" stroke="#B75850" strokeWidth="1" />
            {/* Subcutaneous Fat */}
            <rect x="20" y="126" width="380" height="54" fill="#E5BE5C" fillOpacity="0.85" stroke="#C89E3A" strokeWidth="1" />
            {/* Central Incision Line */}
            <line x1="210" y1="58" x2="210" y2="144" stroke="#7F1D1D" strokeWidth="2.5" strokeDasharray="4 2" />

            {showLabels && (
              <g className="text-[10px] fill-slate-700 dark:fill-slate-300 font-mono">
                <text x="26" y="76">Epidermis</text>
                <text x="26" y="106">Dermis</text>
                <text x="26" y="156">Subcutis (Do NOT suture directly)</text>
              </g>
            )}
          </g>
        )}

        {/* Specific Technique Paths */}
        {diagramType === 'simple_interrupted' && (
          <g>
            {/* Brandy-glass wider deep bite path */}
            <path
              d="M 150 64 L 150 96 C 142 118, 178 124, 210 124 C 242 124, 278 118, 270 96 L 270 64"
              fill="none"
              stroke="#2563EB"
              strokeWidth="3"
              strokeDasharray="6 3"
            />
            {/* Surface bridge & knot off to left */}
            <path d="M 150 64 Q 210 42, 270 64" fill="none" stroke="#2563EB" strokeWidth="3.2" />
            <circle cx="150" cy="61" r="5" fill="#1D4ED8" stroke="#FFFFFF" strokeWidth="1.2" />
            <path d="M 150 61 L 130 48 M 150 61 L 135 42" stroke="#1D4ED8" strokeWidth="2.2" />
            {showLabels && (
              <g className="text-[10px] font-semibold">
                <text x="190" y="34" className="fill-sky-700 dark:fill-sky-300">90° Entry · 3–5 mm from edge</text>
                <text x="232" y="108" className="fill-slate-900">Wider deep bite (Brandy-glass)</text>
                <text x="44" y="34" className="fill-sky-700 dark:fill-sky-300">Knot off incision</text>
              </g>
            )}
          </g>
        )}

        {diagramType === 'vertical_mattress' && (
          <g>
            {/* Far-Far Deep Loop */}
            <path
              d="M 110 64 C 110 120, 165 130, 210 130 C 255 130, 310 120, 310 64"
              fill="none"
              stroke="#2563EB"
              strokeWidth="2.8"
              strokeDasharray="6 3"
            />
            {/* Near-Near Superficial Return */}
            <path
              d="M 310 64 Q 275 44, 240 64 L 240 84 Q 210 92, 180 84 L 180 64 Q 145 46, 110 64"
              fill="none"
              stroke="#0EA5E9"
              strokeWidth="2.8"
            />
            <circle cx="110" cy="62" r="5" fill="#1D4ED8" stroke="#FFFFFF" strokeWidth="1.2" />
            {showLabels && (
              <g className="text-[10px] fill-sky-700 dark:fill-sky-300 font-semibold">
                <text x="80" y="42">Far (8–10 mm)</text>
                <text x="168" y="42">Near (2–3 mm)</text>
                <text x="275" y="42">Far-Far / Near-Near</text>
              </g>
            )}
          </g>
        )}

        {diagramType === 'allgower' && (
          <g>
            {/* Percutaneous sturdy side + intradermal loop on delicate cosmetic side */}
            <path
              d="M 130 64 L 130 112 Q 210 124, 285 104 Q 295 86, 250 86 L 178 86 L 178 64"
              fill="none"
              stroke="#2563EB"
              strokeWidth="2.8"
              strokeDasharray="5 3"
            />
            <path d="M 130 64 Q 154 44, 178 64" fill="none" stroke="#2563EB" strokeWidth="3" />
            <circle cx="130" cy="62" r="5" fill="#1D4ED8" stroke="#FFFFFF" strokeWidth="1.2" />
            {showLabels && (
              <g className="text-[10px] fill-sky-700 dark:fill-sky-300 font-semibold">
                <text x="72" y="44">Single-side knot</text>
                <text x="235" y="54">Zero surface puncture on cosmetic flap</text>
              </g>
            )}
          </g>
        )}

        {diagramType === 'tissue_glue' && (
          <g>
            {/* Topical polymer bridge strictly over surface */}
            <path
              d="M 155 61 Q 210 52, 265 61"
              fill="none"
              stroke="#7C3AED"
              strokeWidth="8"
              strokeLinecap="round"
              strokeOpacity="0.72"
            />
            <path d="M 140 50 L 185 50" stroke="#059669" strokeWidth="2" markerEnd="url(#arrow)" />
            <path d="M 280 50 L 235 50" stroke="#059669" strokeWidth="2" />
            {showLabels && (
              <g className="text-[10px] fill-violet-700 dark:fill-violet-300 font-semibold">
                <text x="128" y="34">2-Octylcyanoacrylate surface bridge (hold 30s)</text>
                <text x="225" y="106">NEVER drip inside wound gap</text>
              </g>
            )}
          </g>
        )}

        {/* Top-Down Surface Diagrams */}
        {(diagramType === 'horizontal_mattress' ||
          diagramType === 'continuous_locked' ||
          diagramType === 'subcuticular') && (
          <g>
            {/* Skin surface top-down */}
            <rect x="28" y="38" width="364" height="148" rx="8" fill="#E8B89A" fillOpacity="0.88" stroke="#C58E6D" strokeWidth="1.5" />
            {/* Wound line */}
            <line x1="60" y1="112" x2="360" y2="112" stroke="#7F1D1D" strokeWidth="3" />

            {diagramType === 'horizontal_mattress' && (
              <g>
                {[110, 240].map((x) => (
                  <g key={x}>
                    <line x1={x} y1="74" x2={x} y2="150" stroke="#2563EB" strokeWidth="2.5" strokeDasharray="4 3" />
                    <line x1={x + 56} y1="74" x2={x + 56} y2="150" stroke="#2563EB" strokeWidth="2.5" strokeDasharray="4 3" />
                    <line x1={x} y1="150" x2={x + 56} y2="150" stroke="#2563EB" strokeWidth="3.2" />
                    <line x1={x} y1="74" x2={x + 56} y2="74" stroke="#2563EB" strokeWidth="3.2" />
                    <circle cx={x + 28} cy="74" r="5" fill="#1D4ED8" stroke="#FFFFFF" strokeWidth="1.2" />
                  </g>
                ))}
                {showLabels && (
                  <text x="68" y="56" className="text-[11px] fill-slate-900 font-semibold">
                    Top-Down U-Mattress: Parallel loops disperse tension on fragile skin
                  </text>
                )}
              </g>
            )}

            {diagramType === 'continuous_locked' && (
              <g>
                <circle cx="80" cy="84" r="5" fill="#1D4ED8" stroke="#FFFFFF" strokeWidth="1.2" />
                {[80, 130, 180, 230, 280].map((x) => (
                  <g key={x}>
                    <line x1={x} y1="84" x2={x + 25} y2="140" stroke="#2563EB" strokeWidth="3" />
                    <line x1={x + 25} y1="140" x2={x + 50} y2="84" stroke="#2563EB" strokeWidth="2.2" strokeDasharray="4 3" />
                    <circle cx={x + 25} cy="140" r="3.5" fill="none" stroke="#1D4ED8" strokeWidth="2" />
                  </g>
                ))}
                <circle cx="330" cy="84" r="5" fill="#1D4ED8" stroke="#FFFFFF" strokeWidth="1.2" />
                {showLabels && (
                  <text x="64" y="56" className="text-[11px] fill-slate-900 font-semibold">
                    Locked Continuous: Anchor knot · Pass through each loop · Clean wounds only
                  </text>
                )}
              </g>
            )}

            {diagramType === 'subcuticular' && (
              <g>
                <circle cx="52" cy="112" r="5" fill="#059669" stroke="#FFFFFF" strokeWidth="1.2" />
                <path
                  d="M 52 112 L 85 96 L 115 96 L 135 128 L 165 128 L 185 96 L 215 96 L 235 128 L 265 128 L 285 96 L 315 96 L 368 112"
                  fill="none"
                  stroke="#059669"
                  strokeWidth="2.8"
                  strokeDasharray="5 3"
                />
                <circle cx="368" cy="112" r="5" fill="#059669" stroke="#FFFFFF" strokeWidth="1.2" />
                {showLabels && (
                  <text x="64" y="56" className="text-[11px] fill-slate-900 font-semibold">
                    Subcuticular (Intracutaneous): Horizontal dermal snake bites · Zero surface marks
                  </text>
                )}
              </g>
            )}
          </g>
        )}

        {diagramType === 'instrument_knot' && (
          <g>
            <rect x="24" y="28" width="372" height="164" rx="10" fill="#0F172A" fillOpacity="0.06" stroke="currentColor" strokeOpacity="0.2" />
            {/* Needle holder shaft */}
            <rect x="175" y="34" width="16" height="122" rx="4" fill="#94A3B8" stroke="#475569" strokeWidth="1.5" />
            {/* Double clockwise loop around instrument */}
            <path d="M 65 130 C 120 120, 155 82, 198 86 C 210 92, 160 100, 198 106 C 210 112, 162 120, 200 124" fill="none" stroke="#2563EB" strokeWidth="3.5" />
            {/* Short tail */}
            <path d="M 285 140 L 183 148" stroke="#DC2626" strokeWidth="3.2" strokeDasharray="6 3" />
            <circle cx="183" cy="148" r="5" fill="#DC2626" />
            {showLabels && (
              <g className="text-[11px] fill-slate-800 dark:fill-slate-200 font-semibold">
                <text x="42" y="54">1. Holder BETWEEN strands</text>
                <text x="220" y="76">2. Wrap 2x Clockwise</text>
                <text x="220" y="114">3. Grasp short tail & pull 180°</text>
                <text x="42" y="176">4. Next throw: 1x Counter-clockwise (Square Knot)</text>
              </g>
            )}
          </g>
        )}
      </svg>
    </div>
  );
};
