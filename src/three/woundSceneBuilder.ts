import * as THREE from 'three';
import { Wound3DMode } from '../types/clinical';

export interface LayerGroupEntry {
  id: string;
  anatomyId: string;
  group: THREE.Group;
  baseY: number;
  explodeFactor: number;
  anchorLocal: THREE.Vector3;
}

export interface WoundSceneHandles {
  rootGroup: THREE.Group;
  layerEntries: LayerGroupEntry[];
  interactables: THREE.Object3D[];
  woundOverlayGroups: Record<Wound3DMode, THREE.Group>;
  leftMarginGroups: THREE.Group[];
  rightMarginGroups: THREE.Group[];
  disposables: {
    geometries: THREE.BufferGeometry[];
    materials: THREE.Material[];
    textures: THREE.Texture[];
  };
  applyWoundMode: (mode: Wound3DMode) => void;
  setLayerVisibility: (visibleLayers: Record<string, boolean>) => void;
  highlightAnatomy: (selectedId: string | null, hoveredId: string | null) => void;
  updateExplode: (explodeAmount: number) => void;
}

function createProceduralCanvasTexture(
  width: number,
  height: number,
  drawFn: (ctx: CanvasRenderingContext2D, w: number, h: number) => void,
  isColorMap: boolean,
  anisotropy: number
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    drawFn(ctx, width, height);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  if (isColorMap) {
    tex.colorSpace = THREE.SRGBColorSpace;
  }
  tex.anisotropy = anisotropy;
  tex.needsUpdate = true;
  return tex;
}

export function buildWoundAnatomyScene(maxAnisotropy: number): WoundSceneHandles {
  const rootGroup = new THREE.Group();
  const layerEntries: LayerGroupEntry[] = [];
  const interactables: THREE.Object3D[] = [];
  const leftMarginGroups: THREE.Group[] = [];
  const rightMarginGroups: THREE.Group[] = [];

  const geometries: THREE.BufferGeometry[] = [];
  const materials: THREE.Material[] = [];
  const textures: THREE.Texture[] = [];

  const trackGeo = <T extends THREE.BufferGeometry>(g: T): T => {
    geometries.push(g);
    return g;
  };
  const trackMat = <T extends THREE.Material>(m: T): T => {
    materials.push(m);
    return m;
  };
  const trackTex = <T extends THREE.Texture>(t: T): T => {
    textures.push(t);
    return t;
  };

  // --- Procedural Textures ---
  const skinBumpTex = trackTex(
    createProceduralCanvasTexture(
      256,
      256,
      (ctx, w, h) => {
        ctx.fillStyle = '#808080';
        ctx.fillRect(0, 0, w, h);
        for (let i = 0; i < 650; i++) {
          const x = (Math.sin(i * 12.9898) * 43758.5453) % 1;
          const y = (Math.cos(i * 78.233) * 19341.123) % 1;
          const px = Math.abs(x) * w;
          const py = Math.abs(y) * h;
          ctx.fillStyle = i % 2 === 0 ? 'rgba(220,220,220,0.22)' : 'rgba(40,40,40,0.22)';
          ctx.beginPath();
          ctx.arc(px, py, 2 + (i % 3), 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.strokeStyle = 'rgba(60,60,60,0.18)';
        ctx.lineWidth = 1;
        for (let k = 0; k < 24; k++) {
          ctx.beginPath();
          ctx.moveTo(0, (k / 24) * h);
          ctx.lineTo(w, (k / 24) * h + 18);
          ctx.stroke();
        }
      },
      false,
      maxAnisotropy
    )
  );

  const muscleColorTex = trackTex(
    createProceduralCanvasTexture(
      256,
      256,
      (ctx, w, h) => {
        ctx.fillStyle = '#992b30';
        ctx.fillRect(0, 0, w, h);
        for (let y = 0; y < h; y += 6) {
          ctx.fillStyle = y % 12 === 0 ? 'rgba(195,70,74,0.35)' : 'rgba(95,20,24,0.35)';
          ctx.fillRect(0, y, w, 3);
        }
        for (let x = 0; x < w; x += 28) {
          ctx.strokeStyle = 'rgba(240,210,210,0.16)';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x + 8, h);
          ctx.stroke();
        }
      },
      true,
      maxAnisotropy
    )
  );

  const fasciaColorTex = trackTex(
    createProceduralCanvasTexture(
      256,
      256,
      (ctx, w, h) => {
        ctx.fillStyle = '#dde6ee';
        ctx.fillRect(0, 0, w, h);
        for (let i = 0; i < 42; i++) {
          ctx.strokeStyle = i % 2 === 0 ? 'rgba(255,255,255,0.45)' : 'rgba(180,196,214,0.35)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(0, (i / 42) * h);
          ctx.lineTo(w, ((i + 3) / 42) * h);
          ctx.stroke();
        }
      },
      true,
      maxAnisotropy
    )
  );

  const drapeGridTex = trackTex(
    createProceduralCanvasTexture(
      512,
      512,
      (ctx, w, h) => {
        ctx.fillStyle = '#14303c';
        ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.14)';
        ctx.lineWidth = 1;
        const step = 32;
        for (let x = 0; x <= w; x += step) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, h);
          ctx.stroke();
        }
        for (let y = 0; y <= h; y += step) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(w, y);
          ctx.stroke();
        }
      },
      true,
      maxAnisotropy
    )
  );
  drapeGridTex.repeat.set(3, 3);

  // --- Grounded Surgical Specimen Base Tray & Contact Shadow (Zero floating void) ---
  const trayGroup = new THREE.Group();
  const drapeMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: drapeGridTex,
      roughness: 0.85,
      metalness: 0.05
    })
  );
  const trayRimMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.28,
      metalness: 0.72
    })
  );
  const contactShadowMat = trackMat(
    new THREE.MeshBasicMaterial({
      color: 0x020617,
      transparent: true,
      opacity: 0.35,
      depthWrite: false
    })
  );

  const drapePlate = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(7.2, 0.08, 5.2)), drapeMat);
  drapePlate.position.set(0, -1.62, 0);
  drapePlate.receiveShadow = true;
  trayGroup.add(drapePlate);

  const trayRim = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(7.36, 0.1, 5.36)), trayRimMat);
  trayRim.position.set(0, -1.67, 0);
  trayRim.receiveShadow = true;
  trayGroup.add(trayRim);

  const contactShadow = new THREE.Mesh(trackGeo(new THREE.CircleGeometry(2.8, 40)), contactShadowMat);
  contactShadow.rotation.x = -Math.PI / 2;
  contactShadow.position.set(0, -1.56, 0);
  trayGroup.add(contactShadow);

  rootGroup.add(trayGroup);

  const registerSelectable = (mesh: THREE.Object3D, anatomyId: string) => {
    mesh.userData.anatomyId = anatomyId;
    interactables.push(mesh);
  };

  const makeHalfSlabGeo = (width: number, height: number, depth: number, bevel = 0.04) => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.lineTo(width, 0);
    shape.lineTo(width, height);
    shape.lineTo(0, height);
    shape.closePath();
    const g = new THREE.ExtrudeGeometry(shape, {
      depth: depth - bevel * 2,
      bevelEnabled: true,
      bevelThickness: bevel,
      bevelSize: bevel,
      bevelSegments: 2,
      steps: 1
    });
    g.center();
    return trackGeo(g);
  };

  // --- 1. EPIDERMIS (Composite Group: Left/Right beveled slabs + hair shafts + basal ridge) ---
  const epidermisGroup = new THREE.Group();
  const epidermisMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xe6b698,
      roughness: 0.62,
      metalness: 0.0,
      bumpMap: skinBumpTex,
      bumpScale: 0.015
    })
  );
  const hairMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x3b2a22,
      roughness: 0.35,
      metalness: 0.05
    })
  );
  const epiHalfGeo = makeHalfSlabGeo(1.75, 0.16, 2.75, 0.025);

  const epiLeft = new THREE.Group();
  const epiLeftMesh = new THREE.Mesh(epiHalfGeo, epidermisMat);
  epiLeftMesh.position.set(-0.92, 0, 0);
  epiLeftMesh.castShadow = true;
  epiLeftMesh.receiveShadow = true;
  registerSelectable(epiLeftMesh, 'epidermis');
  epiLeft.add(epiLeftMesh);

  const epiRight = new THREE.Group();
  const epiRightMesh = new THREE.Mesh(epiHalfGeo, epidermisMat);
  epiRightMesh.position.set(0.92, 0, 0);
  epiRightMesh.castShadow = true;
  epiRightMesh.receiveShadow = true;
  registerSelectable(epiRightMesh, 'epidermis');
  epiRight.add(epiRightMesh);

  // Add subtle anatomical hair shafts (3-12 part detail)
  for (let i = 0; i < 6; i++) {
    const zPos = -0.95 + i * 0.38;
    const hairCurveL = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.7 - (i % 2) * 0.4, 0.05, zPos),
      new THREE.Vector3(-0.78 - (i % 2) * 0.4, 0.24, zPos + 0.04),
      new THREE.Vector3(-0.9 - (i % 2) * 0.4, 0.38, zPos + 0.08)
    ]);
    const hairMeshL = new THREE.Mesh(trackGeo(new THREE.TubeGeometry(hairCurveL, 6, 0.012, 5, false)), hairMat);
    epiLeft.add(hairMeshL);

    const hairCurveR = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.65 + (i % 2) * 0.38, 0.05, zPos),
      new THREE.Vector3(0.75 + (i % 2) * 0.38, 0.23, zPos - 0.03),
      new THREE.Vector3(0.86 + (i % 2) * 0.38, 0.37, zPos - 0.06)
    ]);
    const hairMeshR = new THREE.Mesh(trackGeo(new THREE.TubeGeometry(hairCurveR, 6, 0.012, 5, false)), hairMat);
    epiRight.add(hairMeshR);
  }

  epidermisGroup.add(epiLeft, epiRight);
  leftMarginGroups.push(epiLeft);
  rightMarginGroups.push(epiRight);
  epidermisGroup.position.set(0, 1.32, 0);
  rootGroup.add(epidermisGroup);
  layerEntries.push({
    id: 'epidermis',
    anatomyId: 'epidermis',
    group: epidermisGroup,
    baseY: 1.32,
    explodeFactor: 1.35,
    anchorLocal: new THREE.Vector3(-1.1, 0.08, 0.85)
  });

  // --- 2. DERMIS (Living vascular layer + capillary loops + sweat gland coils) ---
  const dermisGroup = new THREE.Group();
  const dermisMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xd9756d,
      roughness: 0.4,
      metalness: 0.02,
      bumpMap: skinBumpTex,
      bumpScale: 0.01
    })
  );
  const capillaryMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xb91c1c,
      roughness: 0.25,
      metalness: 0.05
    })
  );
  const glandMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x93c5fd,
      roughness: 0.35,
      metalness: 0.0
    })
  );

  const dermHalfGeo = makeHalfSlabGeo(1.75, 0.3, 2.75, 0.025);
  const dermLeft = new THREE.Group();
  const dermLeftMesh = new THREE.Mesh(dermHalfGeo, dermisMat);
  dermLeftMesh.position.set(-0.92, 0, 0);
  dermLeftMesh.castShadow = true;
  dermLeftMesh.receiveShadow = true;
  registerSelectable(dermLeftMesh, 'dermis');
  dermLeft.add(dermLeftMesh);

  const dermRight = new THREE.Group();
  const dermRightMesh = new THREE.Mesh(dermHalfGeo, dermisMat);
  dermRightMesh.position.set(0.92, 0, 0);
  dermRightMesh.castShadow = true;
  dermRightMesh.receiveShadow = true;
  registerSelectable(dermRightMesh, 'dermis');
  dermRight.add(dermRightMesh);

  // Dermal capillary plexus & sweat gland coils
  for (let i = 0; i < 4; i++) {
    const zPos = -0.8 + i * 0.55;
    const capCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1.55, -0.08, zPos),
      new THREE.Vector3(-1.15, 0.05, zPos + 0.1),
      new THREE.Vector3(-0.75, 0.02, zPos - 0.05)
    ]);
    const capMesh = new THREE.Mesh(trackGeo(new THREE.TubeGeometry(capCurve, 10, 0.022, 6, false)), capillaryMat);
    registerSelectable(capMesh, 'dermis');
    dermLeft.add(capMesh);

    const gland = new THREE.Mesh(trackGeo(new THREE.TorusKnotGeometry(0.06, 0.018, 24, 6, 2, 3)), glandMat);
    gland.position.set(0.95 + (i % 2) * 0.35, -0.02, zPos);
    registerSelectable(gland, 'dermis');
    dermRight.add(gland);
  }

  dermisGroup.add(dermLeft, dermRight);
  leftMarginGroups.push(dermLeft);
  rightMarginGroups.push(dermRight);
  dermisGroup.position.set(0, 1.03, 0);
  rootGroup.add(dermisGroup);
  layerEntries.push({
    id: 'dermis',
    anatomyId: 'dermis',
    group: dermisGroup,
    baseY: 1.03,
    explodeFactor: 0.9,
    anchorLocal: new THREE.Vector3(1.1, 0.04, 0.7)
  });

  // --- 3. SUBCUTANEOUS ADIPOSE TISSUE (Lobulated yellow fat clusters + superficial vein) ---
  const subcutisGroup = new THREE.Group();
  const fatMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xe8c15a,
      roughness: 0.32,
      metalness: 0.02
    })
  );
  const subHalfGeo = makeHalfSlabGeo(1.75, 0.42, 2.75, 0.03);

  const subLeft = new THREE.Group();
  const subLeftMesh = new THREE.Mesh(subHalfGeo, fatMat);
  subLeftMesh.position.set(-0.92, 0, 0);
  subLeftMesh.castShadow = true;
  subLeftMesh.receiveShadow = true;
  registerSelectable(subLeftMesh, 'subcutis');
  subLeft.add(subLeftMesh);

  const subRight = new THREE.Group();
  const subRightMesh = new THREE.Mesh(subHalfGeo, fatMat);
  subRightMesh.position.set(0.92, 0, 0);
  subRightMesh.castShadow = true;
  subRightMesh.receiveShadow = true;
  registerSelectable(subRightMesh, 'subcutis');
  subRight.add(subRightMesh);

  // Lobulated fat pearls along exposed cross-section edge
  const lobuleGeo = trackGeo(new THREE.SphereGeometry(0.11, 12, 10));
  for (let i = 0; i < 8; i++) {
    const z = -1.05 + i * 0.3;
    const lobL = new THREE.Mesh(lobuleGeo, fatMat);
    lobL.scale.set(1.1, 0.78, 1.0);
    lobL.position.set(-0.18 - (i % 2) * 0.08, (i % 3 - 1) * 0.08, z);
    registerSelectable(lobL, 'subcutis');
    subLeft.add(lobL);

    const lobR = new THREE.Mesh(lobuleGeo, fatMat);
    lobR.scale.set(1.1, 0.78, 1.0);
    lobR.position.set(0.18 + ((i + 1) % 2) * 0.08, ((i + 1) % 3 - 1) * 0.08, z);
    registerSelectable(lobR, 'subcutis');
    subRight.add(lobR);
  }

  subcutisGroup.add(subLeft, subRight);
  leftMarginGroups.push(subLeft);
  rightMarginGroups.push(subRight);
  subcutisGroup.position.set(0, 0.62, 0);
  rootGroup.add(subcutisGroup);
  layerEntries.push({
    id: 'subcutis',
    anatomyId: 'subcutis',
    group: subcutisGroup,
    baseY: 0.62,
    explodeFactor: 0.45,
    anchorLocal: new THREE.Vector3(-1.25, 0.0, -0.45)
  });

  // --- 4. SUPERFICIAL / DEEP FASCIA ---
  const fasciaGroup = new THREE.Group();
  const fasciaMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: fasciaColorTex,
      roughness: 0.28,
      metalness: 0.08
    })
  );
  const fasciaHalfGeo = makeHalfSlabGeo(1.75, 0.1, 2.75, 0.015);
  const fasciaLeft = new THREE.Group();
  const fasciaLeftMesh = new THREE.Mesh(fasciaHalfGeo, fasciaMat);
  fasciaLeftMesh.position.set(-0.92, 0, 0);
  fasciaLeftMesh.castShadow = true;
  fasciaLeftMesh.receiveShadow = true;
  registerSelectable(fasciaLeftMesh, 'fascia');
  fasciaLeft.add(fasciaLeftMesh);

  const fasciaRight = new THREE.Group();
  const fasciaRightMesh = new THREE.Mesh(fasciaHalfGeo, fasciaMat);
  fasciaRightMesh.position.set(0.92, 0, 0);
  fasciaRightMesh.castShadow = true;
  fasciaRightMesh.receiveShadow = true;
  registerSelectable(fasciaRightMesh, 'fascia');
  fasciaRight.add(fasciaRightMesh);

  fasciaGroup.add(fasciaLeft, fasciaRight);
  leftMarginGroups.push(fasciaLeft);
  rightMarginGroups.push(fasciaRight);
  fasciaGroup.position.set(0, 0.31, 0);
  rootGroup.add(fasciaGroup);
  layerEntries.push({
    id: 'fascia',
    anatomyId: 'fascia',
    group: fasciaGroup,
    baseY: 0.31,
    explodeFactor: 0.08,
    anchorLocal: new THREE.Vector3(1.25, 0.02, -0.55)
  });

  // --- 5. SKELETAL MUSCLE LAYER (Striated red muscle belly + fascicle cylinders) ---
  const muscleGroup = new THREE.Group();
  const muscleMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: muscleColorTex,
      roughness: 0.56,
      metalness: 0.02
    })
  );
  const muscleSlabGeo = trackGeo(new THREE.BoxGeometry(3.45, 0.46, 2.72));
  const muscleSlab = new THREE.Mesh(muscleSlabGeo, muscleMat);
  muscleSlab.castShadow = true;
  muscleSlab.receiveShadow = true;
  registerSelectable(muscleSlab, 'muscle');
  muscleGroup.add(muscleSlab);

  const fascicleGeo = trackGeo(new THREE.CylinderGeometry(0.11, 0.11, 2.74, 12));
  fascicleGeo.rotateX(Math.PI / 2);
  for (let i = -3; i <= 3; i++) {
    if (Math.abs(i) === 0) continue; // leave central trough channel for deep neurovascular/tendon visibility
    const fascicle = new THREE.Mesh(fascicleGeo, muscleMat);
    fascicle.position.set(i * 0.48, 0.16, 0);
    registerSelectable(fascicle, 'muscle');
    muscleGroup.add(fascicle);
  }

  muscleGroup.position.set(0, -0.04, 0);
  rootGroup.add(muscleGroup);
  layerEntries.push({
    id: 'muscle',
    anatomyId: 'muscle',
    group: muscleGroup,
    baseY: -0.04,
    explodeFactor: -0.28,
    anchorLocal: new THREE.Vector3(-1.35, 0.12, 0.35)
  });

  // --- 6. MAJOR ARTERY & VEIN BUNDLE (Deep neurovascular composite) ---
  const vesselGroup = new THREE.Group();
  const arteryMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xdc2626,
      roughness: 0.24,
      metalness: 0.06
    })
  );
  const veinMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x1d4ed8,
      roughness: 0.28,
      metalness: 0.06
    })
  );

  const arteryCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.34, 0.02, -1.38),
    new THREE.Vector3(-0.28, 0.04, -0.4),
    new THREE.Vector3(-0.3, 0.03, 0.45),
    new THREE.Vector3(-0.36, 0.0, 1.38)
  ]);
  const arteryMain = new THREE.Mesh(trackGeo(new THREE.TubeGeometry(arteryCurve, 28, 0.085, 12, false)), arteryMat);
  arteryMain.castShadow = true;
  registerSelectable(arteryMain, 'artery_vein');
  vesselGroup.add(arteryMain);

  const arteryBranchCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.3, 0.04, -0.15),
    new THREE.Vector3(-0.65, 0.08, 0.3),
    new THREE.Vector3(-0.98, 0.04, 0.95)
  ]);
  const arteryBranch = new THREE.Mesh(trackGeo(new THREE.TubeGeometry(arteryBranchCurve, 16, 0.045, 10, false)), arteryMat);
  registerSelectable(arteryBranch, 'artery_vein');
  vesselGroup.add(arteryBranch);

  const veinCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.52, -0.02, -1.38),
    new THREE.Vector3(-0.46, 0.0, 0.0),
    new THREE.Vector3(-0.54, -0.02, 1.38)
  ]);
  const veinMain = new THREE.Mesh(trackGeo(new THREE.TubeGeometry(veinCurve, 24, 0.075, 12, false)), veinMat);
  registerSelectable(veinMain, 'artery_vein');
  vesselGroup.add(veinMain);

  vesselGroup.position.set(0, -0.25, 0);
  rootGroup.add(vesselGroup);
  layerEntries.push({
    id: 'artery_vein',
    anatomyId: 'artery_vein',
    group: vesselGroup,
    baseY: -0.25,
    explodeFactor: -0.62,
    anchorLocal: new THREE.Vector3(-0.62, 0.08, 0.92)
  });

  // --- 7. PERIPHERAL NERVE TRUNK (3-fascicle pale-yellow cord + epineurium sheath) ---
  const nerveGroup = new THREE.Group();
  const nerveFascicleMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      roughness: 0.35,
      metalness: 0.05,
      emissive: 0x713f12,
      emissiveIntensity: 0.15
    })
  );
  const epineuriumMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      roughness: 0.25,
      transparent: true,
      opacity: 0.48
    })
  );

  const nerveOffsets = [
    [0.34, 0.02],
    [0.4, 0.05],
    [0.42, -0.01]
  ];
  for (const [nx, ny] of nerveOffsets) {
    const nCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(nx, ny, -1.38),
      new THREE.Vector3(nx - 0.04, ny + 0.02, 0),
      new THREE.Vector3(nx + 0.02, ny, 1.38)
    ]);
    const fascicleMesh = new THREE.Mesh(trackGeo(new THREE.TubeGeometry(nCurve, 22, 0.028, 8, false)), nerveFascicleMat);
    registerSelectable(fascicleMesh, 'nerve');
    nerveGroup.add(fascicleMesh);
  }

  const epiSleeveCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.38, 0.02, -1.38),
    new THREE.Vector3(0.35, 0.04, 0),
    new THREE.Vector3(0.39, 0.02, 1.38)
  ]);
  const epiSleeve = new THREE.Mesh(trackGeo(new THREE.TubeGeometry(epiSleeveCurve, 22, 0.072, 12, false)), epineuriumMat);
  registerSelectable(epiSleeve, 'nerve');
  nerveGroup.add(epiSleeve);

  nerveGroup.position.set(0, -0.24, 0);
  rootGroup.add(nerveGroup);
  layerEntries.push({
    id: 'nerve',
    anatomyId: 'nerve',
    group: nerveGroup,
    baseY: -0.24,
    explodeFactor: -0.62,
    anchorLocal: new THREE.Vector3(0.48, 0.08, 0.88)
  });

  // --- 8. TENDON & TENDON SHEATH (Central glistening collagen cord + synovial sheath collar) ---
  const tendonGroup = new THREE.Group();
  const tendonMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xf5f5f0,
      roughness: 0.16,
      metalness: 0.12
    })
  );
  const sheathMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xcbd5e1,
      roughness: 0.25,
      transparent: true,
      opacity: 0.55
    })
  );

  const tendonCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0.02, -1.42),
    new THREE.Vector3(0, 0.04, 0),
    new THREE.Vector3(0, 0.02, 1.42)
  ]);
  const tendonCord = new THREE.Mesh(trackGeo(new THREE.TubeGeometry(tendonCurve, 28, 0.11, 14, false)), tendonMat);
  tendonCord.castShadow = true;
  registerSelectable(tendonCord, 'tendon');
  tendonGroup.add(tendonCord);

  // Synovial sheath collars at proximal and distal ends
  const sheathCollarGeo = trackGeo(new THREE.CylinderGeometry(0.145, 0.145, 0.65, 16, 1, true));
  sheathCollarGeo.rotateX(Math.PI / 2);
  const sheathProx = new THREE.Mesh(sheathCollarGeo, sheathMat);
  sheathProx.position.set(0, 0.025, -0.88);
  registerSelectable(sheathProx, 'tendon');
  const sheathDist = new THREE.Mesh(sheathCollarGeo, sheathMat);
  sheathDist.position.set(0, 0.025, 0.88);
  registerSelectable(sheathDist, 'tendon');
  tendonGroup.add(sheathProx, sheathDist);

  tendonGroup.position.set(0, -0.44, 0);
  rootGroup.add(tendonGroup);
  layerEntries.push({
    id: 'tendon',
    anatomyId: 'tendon',
    group: tendonGroup,
    baseY: -0.44,
    explodeFactor: -0.95,
    anchorLocal: new THREE.Vector3(0, 0.1, -0.25)
  });

  // --- 9. JOINT CAPSULE & SYNOVIUM (Articular cartilage + fibrous capsular collar at distal pole) ---
  const jointGroup = new THREE.Group();
  const cartilageMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xbae6fd,
      roughness: 0.14,
      metalness: 0.08
    })
  );
  const capsuleMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      roughness: 0.55,
      metalness: 0.02
    })
  );

  const condyleA = new THREE.Mesh(trackGeo(new THREE.SphereGeometry(0.32, 20, 16)), cartilageMat);
  condyleA.scale.set(1.3, 0.85, 0.9);
  condyleA.position.set(0, 0.02, -1.18);
  registerSelectable(condyleA, 'joint_capsule');

  const capsuleRing = new THREE.Mesh(trackGeo(new THREE.TorusGeometry(0.36, 0.08, 12, 24)), capsuleMat);
  capsuleRing.position.set(0, 0.02, -1.18);
  registerSelectable(capsuleRing, 'joint_capsule');

  jointGroup.add(condyleA, capsuleRing);
  jointGroup.position.set(0, -0.82, 0);
  rootGroup.add(jointGroup);
  layerEntries.push({
    id: 'joint_capsule',
    anatomyId: 'joint_capsule',
    group: jointGroup,
    baseY: -0.82,
    explodeFactor: -1.28,
    anchorLocal: new THREE.Vector3(0.18, 0.14, -1.22)
  });

  // --- 10. BONE CORTEX & PERIOSTEUM (Composite cortical cylinder + marrow core + periosteal cuff) ---
  const boneGroup = new THREE.Group();
  const boneCortexMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xebe3ce,
      roughness: 0.42,
      metalness: 0.02
    })
  );
  const marrowMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x881337,
      roughness: 0.72,
      metalness: 0.0
    })
  );
  const periosteumMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xd6cfc2,
      roughness: 0.65,
      metalness: 0.02
    })
  );

  const cortexCylinder = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.36, 0.36, 2.75, 24)), boneCortexMat);
  cortexCylinder.rotation.x = Math.PI / 2;
  cortexCylinder.castShadow = true;
  cortexCylinder.receiveShadow = true;
  registerSelectable(cortexCylinder, 'bone_periosteum');

  const marrowCore = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.18, 0.18, 2.78, 16)), marrowMat);
  marrowCore.rotation.x = Math.PI / 2;
  registerSelectable(marrowCore, 'bone_periosteum');

  const periosteumWrap = new THREE.Mesh(
    trackGeo(new THREE.CylinderGeometry(0.378, 0.378, 2.1, 24, 1, true)),
    periosteumMat
  );
  periosteumWrap.rotation.x = Math.PI / 2;
  registerSelectable(periosteumWrap, 'bone_periosteum');

  boneGroup.add(cortexCylinder, marrowCore, periosteumWrap);
  boneGroup.position.set(0, -1.04, 0);
  rootGroup.add(boneGroup);
  layerEntries.push({
    id: 'bone_periosteum',
    anatomyId: 'bone_periosteum',
    group: boneGroup,
    baseY: -1.04,
    explodeFactor: -1.55,
    anchorLocal: new THREE.Vector3(0.0, 0.15, 0.78)
  });

  // --- WOUND PATHOLOGY & SUTURE OVERLAY GROUPS ---
  const woundOverlayGroups = {} as Record<Wound3DMode, THREE.Group>;
  const allModes: Wound3DMode[] = [
    'normal_intact',
    'superficial_incised',
    'deep_subcutis_fascia',
    'deep_tendon_nerve_vessel',
    'contaminated_crush_foreign',
    'bite_joint_capsule',
    'sutured_interrupted',
    'sutured_mattress'
  ];
  for (const m of allModes) {
    const g = new THREE.Group();
    g.visible = false;
    woundOverlayGroups[m] = g;
    rootGroup.add(g);
  }

  // Blood / hemorrhage pool for deep exposure
  const bloodPoolMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x991b1b,
      roughness: 0.12,
      metalness: 0.1
    })
  );
  const bloodPool = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.34, 0.38, 0.04, 24)), bloodPoolMat);
  bloodPool.position.set(-0.26, -0.18, 0.12);
  const severedGapMarker = new THREE.Mesh(
    trackGeo(new THREE.TorusGeometry(0.14, 0.032, 10, 20)),
    trackMat(new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0x991b1b, emissiveIntensity: 0.55 }))
  );
  severedGapMarker.position.set(0, -0.4, 0.12);
  woundOverlayGroups.deep_tendon_nerve_vessel.add(bloodPool, severedGapMarker);

  // Glass / soil foreign bodies & necrotic dark muscle patches for contaminated_crush_foreign
  const glassMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xa5f3fc,
      roughness: 0.08,
      metalness: 0.2,
      transparent: true,
      opacity: 0.85
    })
  );
  const necroticMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x3b1f22,
      roughness: 0.92,
      metalness: 0.0
    })
  );
  for (let i = 0; i < 4; i++) {
    const shard = new THREE.Mesh(trackGeo(new THREE.OctahedronGeometry(0.11, 0)), glassMat);
    shard.scale.set(1.3, 0.5, 1.8);
    shard.position.set((i % 2 === 0 ? -0.15 : 0.16), 0.35 + (i % 2) * 0.25, -0.65 + i * 0.45);
    shard.rotation.set(i * 0.6, i * 0.9, 0.3);
    woundOverlayGroups.contaminated_crush_foreign.add(shard);
  }
  const necroticPatch = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.85, 0.1, 1.35)), necroticMat);
  necroticPatch.position.set(0.05, 0.18, 0.1);
  woundOverlayGroups.contaminated_crush_foreign.add(necroticPatch);

  // Bite puncture indicators over joint capsule
  const biteRimMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0xdc2626,
      emissive: 0x7f1d1d,
      emissiveIntensity: 0.45,
      roughness: 0.4
    })
  );
  for (const xOff of [-0.14, 0.14]) {
    const punctureRing = new THREE.Mesh(trackGeo(new THREE.TorusGeometry(0.09, 0.025, 10, 20)), biteRimMat);
    punctureRing.rotation.x = Math.PI / 2;
    punctureRing.position.set(xOff, -0.62, -1.08);
    woundOverlayGroups.bite_joint_capsule.add(punctureRing);
  }

  // Sutured Simple Interrupted (5 crisp blue nylon loops + side-offset knots)
  const nylonThreadMat = trackMat(
    new THREE.MeshStandardMaterial({
      color: 0x2563eb,
      roughness: 0.22,
      metalness: 0.12
    })
  );
  const knotGeo = trackGeo(new THREE.SphereGeometry(0.045, 10, 10));
  for (let i = 0; i < 5; i++) {
    const z = -0.95 + i * 0.48;
    const stitchCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.34, 1.44, z),
      new THREE.Vector3(-0.15, 1.54, z),
      new THREE.Vector3(0.0, 1.56, z),
      new THREE.Vector3(0.15, 1.54, z),
      new THREE.Vector3(0.34, 1.44, z)
    ]);
    const stitchLoop = new THREE.Mesh(trackGeo(new THREE.TubeGeometry(stitchCurve, 16, 0.024, 8, false)), nylonThreadMat);
    const knot = new THREE.Mesh(knotGeo, nylonThreadMat);
    knot.position.set(-0.28, 1.48, z);
    const tail1 = new THREE.Mesh(
      trackGeo(
        new THREE.TubeGeometry(
          new THREE.LineCurve3(new THREE.Vector3(-0.28, 1.48, z), new THREE.Vector3(-0.46, 1.53, z + 0.07)),
          4,
          0.016,
          6,
          false
        )
      ),
      nylonThreadMat
    );
    const tail2 = new THREE.Mesh(
      trackGeo(
        new THREE.TubeGeometry(
          new THREE.LineCurve3(new THREE.Vector3(-0.28, 1.48, z), new THREE.Vector3(-0.44, 1.51, z - 0.07)),
          4,
          0.016,
          6,
          false
        )
      ),
      nylonThreadMat
    );
    woundOverlayGroups.sutured_interrupted.add(stitchLoop, knot, tail1, tail2);
  }

  // Sutured Vertical Mattress (Donati: Far-Far + Near-Near loops)
  for (let i = 0; i < 4; i++) {
    const z = -0.82 + i * 0.55;
    const farCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.56, 1.44, z),
      new THREE.Vector3(-0.25, 1.53, z),
      new THREE.Vector3(0.0, 1.55, z),
      new THREE.Vector3(0.25, 1.53, z),
      new THREE.Vector3(0.56, 1.44, z)
    ]);
    const nearCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.18, 1.45, z),
      new THREE.Vector3(0.0, 1.58, z),
      new THREE.Vector3(0.18, 1.45, z)
    ]);
    const farMesh = new THREE.Mesh(trackGeo(new THREE.TubeGeometry(farCurve, 18, 0.022, 8, false)), nylonThreadMat);
    const nearMesh = new THREE.Mesh(trackGeo(new THREE.TubeGeometry(nearCurve, 12, 0.019, 8, false)), nylonThreadMat);
    const knot = new THREE.Mesh(knotGeo, nylonThreadMat);
    knot.position.set(-0.44, 1.48, z);
    woundOverlayGroups.sutured_mattress.add(farMesh, nearMesh, knot);
  }

  // --- Dynamic Wound Mode Application ---
  const applyWoundMode = (mode: Wound3DMode) => {
    Object.entries(woundOverlayGroups).forEach(([k, g]) => {
      g.visible = k === mode;
    });

    // Determine wound margin gap width along X so deeper layers become visibly exposed
    let gapHalfOffset = 0;
    if (mode === 'superficial_incised') gapHalfOffset = 0.22;
    else if (mode === 'deep_subcutis_fascia') gapHalfOffset = 0.42;
    else if (mode === 'deep_tendon_nerve_vessel') gapHalfOffset = 0.65;
    else if (mode === 'contaminated_crush_foreign') gapHalfOffset = 0.55;
    else if (mode === 'bite_joint_capsule') gapHalfOffset = 0.48;
    else if (mode === 'sutured_interrupted' || mode === 'sutured_mattress') gapHalfOffset = 0.04;

    leftMarginGroups.forEach((g, idx) => {
      // Superficial layers open wider than fascia for realistic tapered surgical exposure
      const layerScale = idx === 0 ? 1.0 : idx === 1 ? 0.92 : idx === 2 ? 0.78 : 0.55;
      g.position.x = -gapHalfOffset * layerScale;
    });
    rightMarginGroups.forEach((g, idx) => {
      const layerScale = idx === 0 ? 1.0 : idx === 1 ? 0.92 : idx === 2 ? 0.78 : 0.55;
      g.position.x = gapHalfOffset * layerScale;
    });
  };

  const setLayerVisibility = (visibleLayers: Record<string, boolean>) => {
    for (const entry of layerEntries) {
      if (visibleLayers[entry.anatomyId] !== undefined) {
        entry.group.visible = visibleLayers[entry.anatomyId];
      }
    }
  };

  const highlightAnatomy = (selectedId: string | null, hoveredId: string | null) => {
    for (const entry of layerEntries) {
      const isSelected = entry.anatomyId === selectedId;
      const isHovered = entry.anatomyId === hoveredId;
      entry.group.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mat = (child as THREE.Mesh).material as THREE.MeshStandardMaterial;
          if (mat && 'emissive' in mat && mat.emissive) {
            if (isSelected) {
              mat.emissive.setHex(0x0284c7);
              mat.emissiveIntensity = 0.35;
            } else if (isHovered) {
              mat.emissive.setHex(0x38bdf8);
              mat.emissiveIntensity = 0.2;
            } else if (entry.anatomyId === 'nerve') {
              mat.emissive.setHex(0x713f12);
              mat.emissiveIntensity = 0.15;
            } else {
              mat.emissive.setHex(0x000000);
              mat.emissiveIntensity = 0;
            }
          }
        }
      });
    }
  };

  const updateExplode = (explodeAmount: number) => {
    for (const entry of layerEntries) {
      entry.group.position.y = entry.baseY + entry.explodeFactor * explodeAmount;
    }
    woundOverlayGroups.sutured_interrupted.position.y = 1.35 * explodeAmount;
    woundOverlayGroups.sutured_mattress.position.y = 1.35 * explodeAmount;
  };

  applyWoundMode('deep_tendon_nerve_vessel');

  return {
    rootGroup,
    layerEntries,
    interactables,
    woundOverlayGroups,
    leftMarginGroups,
    rightMarginGroups,
    disposables: { geometries, materials, textures },
    applyWoundMode,
    setLayerVisibility,
    highlightAnatomy,
    updateExplode
  };
}
