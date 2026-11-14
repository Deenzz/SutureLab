import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import {
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Layers,
  RotateCcw,
  Tag
} from 'lucide-react';
import { ANATOMICAL_STRUCTURES } from '../data/anatomyData';
import { buildWoundAnatomyScene, WoundSceneHandles } from '../three/woundSceneBuilder';
import { CameraPresetId, Wound3DMode } from '../types/clinical';

interface AnatomyViewport3DProps {
  woundMode: Wound3DMode;
  selectedAnatomyId: string | null;
  onSelectAnatomy: (id: string) => void;
  onChangeWoundMode: (mode: Wound3DMode) => void;
  isDark: boolean;
}

interface AnnotationPin {
  id: string;
  label: string;
  x: number;
  y: number;
  visible: boolean;
  isCritical: boolean;
}

const CAMERA_PRESETS: Record<CameraPresetId, { pos: [number, number, number]; target: [number, number, number]; label: string }> = {
  perspective: { pos: [4.25, 2.95, 4.45], target: [0, 0.05, 0], label: '3/4 Clinical' },
  cross_section: { pos: [0.05, 0.4, 5.4], target: [0, 0.05, 0], label: 'Cross-Section' },
  top_down: { pos: [0.01, 5.4, 0.55], target: [0, 0.35, 0], label: 'Top-Down Wound' },
  deep_structures: { pos: [2.95, 0.45, 2.9], target: [0, -0.35, 0], label: 'Deep Structures' }
};

const WOUND_MODE_OPTIONS: Array<{ id: Wound3DMode; label: string }> = [
  { id: 'normal_intact', label: 'Intact Tissue' },
  { id: 'superficial_incised', label: 'Superficial' },
  { id: 'deep_subcutis_fascia', label: 'Subcutis/Fascia' },
  { id: 'deep_tendon_nerve_vessel', label: 'Deep Exposure' },
  { id: 'contaminated_crush_foreign', label: 'Foreign/Necrotic' },
  { id: 'bite_joint_capsule', label: 'Joint Bite' },
  { id: 'sutured_interrupted', label: 'Simple Sutured' },
  { id: 'sutured_mattress', label: 'Vertical Mattress' }
];

const _projVec = new THREE.Vector3();

export const AnatomyViewport3D: React.FC<AnatomyViewport3DProps> = ({
  woundMode,
  selectedAnatomyId,
  onSelectAnatomy,
  onChangeWoundMode,
  isDark
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [explodeLevel, setExplodeLevel] = useState<number>(0.18);
  const [activePreset, setActivePreset] = useState<CameraPresetId>('perspective');
  const [showAnnotations, setShowAnnotations] = useState<boolean>(true);
  const [dockCollapsed, setDockCollapsed] = useState<boolean>(false);
  const [dockTab, setDockTab] = useState<'layers' | 'wound' | 'camera'>('wound');
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [webglError, setWebglError] = useState<string | null>(null);
  const [pins, setPins] = useState<AnnotationPin[]>([]);
  const [visibleLayers, setVisibleLayers] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    ANATOMICAL_STRUCTURES.forEach((a) => {
      initial[a.id] = true;
    });
    return initial;
  });

  // Mutable refs for zero-teardown React -> Three.js synchronization
  const onSelectRef = useRef(onSelectAnatomy);
  onSelectRef.current = onSelectAnatomy;

  const sceneStateRef = useRef<{
    woundMode: Wound3DMode;
    selectedAnatomyId: string | null;
    hoveredId: string | null;
    targetExplode: number;
    currentExplode: number;
    visibleLayers: Record<string, boolean>;
    showAnnotations: boolean;
    dockCollapsed: boolean;
    isDark: boolean;
    camTargetPos: THREE.Vector3 | null;
    camTargetLook: THREE.Vector3 | null;
    requestRender?: () => void;
    handles?: WoundSceneHandles;
    scene?: THREE.Scene;
    hemisphereLight?: THREE.HemisphereLight;
  }>({
    woundMode,
    selectedAnatomyId,
    hoveredId: null,
    targetExplode: explodeLevel,
    currentExplode: explodeLevel,
    visibleLayers,
    showAnnotations,
    dockCollapsed,
    isDark,
    camTargetPos: null,
    camTargetLook: null
  });

  useEffect(() => {
    const s = sceneStateRef.current;
    s.woundMode = woundMode;
    s.handles?.applyWoundMode(woundMode);
    s.requestRender?.();
  }, [woundMode]);

  useEffect(() => {
    const s = sceneStateRef.current;
    s.selectedAnatomyId = selectedAnatomyId;
    s.handles?.highlightAnatomy(selectedAnatomyId, s.hoveredId);
    s.requestRender?.();
  }, [selectedAnatomyId]);

  useEffect(() => {
    const s = sceneStateRef.current;
    s.hoveredId = hoveredId;
    s.handles?.highlightAnatomy(s.selectedAnatomyId, hoveredId);
    s.requestRender?.();
  }, [hoveredId]);

  useEffect(() => {
    const s = sceneStateRef.current;
    s.targetExplode = explodeLevel;
    s.requestRender?.();
  }, [explodeLevel]);

  useEffect(() => {
    const s = sceneStateRef.current;
    s.visibleLayers = visibleLayers;
    s.handles?.setLayerVisibility(visibleLayers);
    s.requestRender?.();
  }, [visibleLayers]);

  useEffect(() => {
    const s = sceneStateRef.current;
    s.showAnnotations = showAnnotations;
    s.requestRender?.();
  }, [showAnnotations]);

  useEffect(() => {
    const s = sceneStateRef.current;
    s.dockCollapsed = dockCollapsed;
    s.requestRender?.();
  }, [dockCollapsed]);

  useEffect(() => {
    const s = sceneStateRef.current;
    s.isDark = isDark;
    if (s.scene) {
      const bgHex = isDark ? 0x0b1220 : 0xf1f5f9;
      s.scene.background = new THREE.Color(bgHex);
      s.scene.fog = new THREE.FogExp2(bgHex, 0.042);
    }
    s.requestRender?.();
  }, [isDark]);

  // Mount Three.js scene ONCE
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let frameId = 0;
    let isDisposed = false;

    const isSoftwareGl = (() => {
      try {
        const probe = document.createElement('canvas');
        const gl = probe.getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return true;
      }
    })();

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        powerPreference: 'high-performance',
        preserveDrawingBuffer: true
      });
    } catch {
      setWebglError('Interactive 3D WebGL context unavailable on this device.');
      return;
    }

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const width = Math.max(container.clientWidth, 320);
    const height = Math.max(container.clientHeight, 320);
    renderer.setSize(width, height);
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const initBg = sceneStateRef.current.isDark ? 0x0b1220 : 0xf1f5f9;
    scene.background = new THREE.Color(initBg);
    scene.fog = new THREE.FogExp2(initBg, 0.042);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envTex = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;
    pmremGenerator.dispose();

    const initAspect = width / height;
    const camera = new THREE.PerspectiveCamera(initAspect < 1.0 ? 58 : 42, initAspect, 0.1, 80);
    const startPreset = CAMERA_PRESETS.perspective;
    camera.position.set(...startPreset.pos);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(...startPreset.target);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.08;
    controls.autoRotate = false;
    controls.minDistance = 2.2;
    controls.maxDistance = 11.5;
    controls.maxPolarAngle = Math.PI * 0.54;
    controls.update();

    // Three-point surgical studio lighting with warm/cool contrast
    const keyLight = new THREE.DirectionalLight(0xfff7ed, 1.85);
    keyLight.position.set(4.5, 6.5, 4.2);
    keyLight.castShadow = !isSoftwareGl;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far = 18;
    keyLight.shadow.camera.left = -4.5;
    keyLight.shadow.camera.right = 4.5;
    keyLight.shadow.camera.top = 4.5;
    keyLight.shadow.camera.bottom = -4.5;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    const hemiLight = new THREE.HemisphereLight(0xdbeafe, 0x334155, 0.72);
    scene.add(hemiLight);

    const rimLight = new THREE.DirectionalLight(0xbae6fd, 0.85);
    rimLight.position.set(-4.2, 3.8, -4.5);
    scene.add(rimLight);

    const maxAniso = renderer.capabilities.getMaxAnisotropy();
    const handles = buildWoundAnatomyScene(maxAniso);
    scene.add(handles.rootGroup);
    handles.applyWoundMode(sceneStateRef.current.woundMode);
    handles.updateExplode(sceneStateRef.current.currentExplode);
    handles.setLayerVisibility(sceneStateRef.current.visibleLayers);
    handles.highlightAnatomy(sceneStateRef.current.selectedAnatomyId, null);

    sceneStateRef.current.handles = handles;
    sceneStateRef.current.scene = scene;
    sceneStateRef.current.hemisphereLight = hemiLight;

    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    const updateProjectedPins = () => {
      if (!sceneStateRef.current.showAnnotations) {
        setPins([]);
        return;
      }
      const w = container.clientWidth || width;
      const h = container.clientHeight || height;
      const maxPinY = sceneStateRef.current.dockCollapsed ? h - 72 : h - 188;
      const nextPins: AnnotationPin[] = [];
      for (const entry of handles.layerEntries) {
        const meta = ANATOMICAL_STRUCTURES.find((a) => a.id === entry.anatomyId);
        if (!meta) continue;
        if (!entry.group.visible) continue;
        _projVec.copy(entry.anchorLocal);
        entry.group.localToWorld(_projVec);
        _projVec.project(camera);
        if (_projVec.z > 1) continue;
        const sx = ((_projVec.x + 1) / 2) * w;
        const sy = ((-_projVec.y + 1) / 2) * h;
        if (sx < 40 || sx > w - 40 || sy < 62 || sy > maxPinY) continue;
        nextPins.push({
          id: entry.anatomyId,
          label: meta.name.split(' (')[0],
          x: sx,
          y: sy,
          visible: true,
          isCritical: meta.deepExposureRisk === 'CRITICAL_SURGICAL_CONSULT'
        });
      }
      // Simple greedy vertical de-overlap so adjacent labels never stack directly on top of each other
      nextPins.sort((a, b) => a.y - b.y);
      for (let i = 0; i < nextPins.length; i++) {
        for (let j = 0; j < i; j++) {
          const dx = Math.abs(nextPins[i].x - nextPins[j].x);
          const dy = nextPins[i].y - nextPins[j].y;
          if (dx < 145 && Math.abs(dy) < 26) {
            nextPins[i].y = Math.min(maxPinY, nextPins[j].y + 27);
          }
        }
      }
      setPins(nextPins);
    };

    let renderBusy = false;
    let renderDirty = false;
    let lastTimestamp = performance.now();

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync ? gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0) : null;
      gl.flush();
      const poll = () => {
        if (isDisposed) return;
        const state = sync ? gl.getSyncParameter(sync, gl.SYNC_STATUS) : gl.ALREADY_SIGNALED;
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          if (sync) gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function requestRender() {
      if (isDisposed) return;
      if (renderBusy) {
        renderDirty = true;
        return;
      }
      renderBusy = true;
      frameId = requestAnimationFrame((now) => {
        if (isDisposed) return;
        const dt = Math.min((now - lastTimestamp) / 1000, 0.1);
        lastTimestamp = now;
        renderDirty = false;

        const st = sceneStateRef.current;
        let stillAnimating = false;

        // Smooth explode-layer damping (or direct snap on software WebGL if needed, damped smoothly)
        if (Math.abs(st.currentExplode - st.targetExplode) > 0.002) {
          st.currentExplode = isSoftwareGl
            ? st.targetExplode
            : THREE.MathUtils.damp(st.currentExplode, st.targetExplode, 9, Math.max(dt, 0.016));
          handles.updateExplode(st.currentExplode);
          if (Math.abs(st.currentExplode - st.targetExplode) > 0.002) {
            stillAnimating = true;
          } else {
            st.currentExplode = st.targetExplode;
            handles.updateExplode(st.currentExplode);
          }
        }

        // Smooth camera preset glide
        if (st.camTargetPos && st.camTargetLook) {
          if (isSoftwareGl) {
            camera.position.copy(st.camTargetPos);
            controls.target.copy(st.camTargetLook);
            st.camTargetPos = null;
            st.camTargetLook = null;
          } else {
            const alpha = 1 - Math.exp(-8 * Math.max(dt, 0.016));
            camera.position.lerp(st.camTargetPos, alpha);
            controls.target.lerp(st.camTargetLook, alpha);
            if (
              camera.position.distanceTo(st.camTargetPos) < 0.02 &&
              controls.target.distanceTo(st.camTargetLook) < 0.02
            ) {
              camera.position.copy(st.camTargetPos);
              controls.target.copy(st.camTargetLook);
              st.camTargetPos = null;
              st.camTargetLook = null;
            } else {
              stillAnimating = true;
            }
          }
        }

        controls.update();
        renderer.render(scene, camera);
        updateProjectedPins();

        const done = () => {
          viewportRef.current?.setAttribute('data-webgl-ready', 'true');
          renderBusy = false;
          if (renderDirty || stillAnimating) {
            requestRender();
          }
        };

        if (isSoftwareGl) afterDraw(done);
        else done();
      });
    }

    sceneStateRef.current.requestRender = requestRender;

    // Cancel camera glide if user takes over OrbitControls
    const onControlStart = () => {
      sceneStateRef.current.camTargetPos = null;
      sceneStateRef.current.camTargetLook = null;
    };
    const onControlChange = () => {
      requestRender();
    };
    controls.addEventListener('start', onControlStart);
    controls.addEventListener('change', onControlChange);

    // Raycasting for anatomy selection & hover
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let downPos = { x: 0, y: 0 };
    let lastHoverCheck = 0;

    const onPointerDown = (e: PointerEvent) => {
      downPos = { x: e.clientX, y: e.clientY };
    };

    const onPointerUp = (e: PointerEvent) => {
      const dist = Math.hypot(e.clientX - downPos.x, e.clientY - downPos.y);
      if (dist > 6) return; // ignore orbit drag
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(handles.interactables, false).filter((h) => {
        let obj: THREE.Object3D | null = h.object;
        while (obj) {
          if (!obj.visible) return false;
          obj = obj.parent;
        }
        return true;
      });
      if (hits.length > 0 && hits[0].object.userData.anatomyId) {
        onSelectRef.current(hits[0].object.userData.anatomyId as string);
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      const now = performance.now();
      if (now - lastHoverCheck < 55) return;
      lastHoverCheck = now;
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(handles.interactables, false).filter((h) => {
        let obj: THREE.Object3D | null = h.object;
        while (obj) {
          if (!obj.visible) return false;
          obj = obj.parent;
        }
        return true;
      });
      const hitId = hits.length > 0 ? (hits[0].object.userData.anatomyId as string) : null;
      renderer.domElement.style.cursor = hitId ? 'pointer' : 'grab';
      setHoveredId((prev) => (prev === hitId ? prev : hitId));
    };

    let lastW = width;
    let lastH = height;
    const onResize = () => {
      if (!container) return;
      const w = Math.max(container.clientWidth, 320);
      const h = Math.max(container.clientHeight, 320);
      if (w === lastW && h === lastH) return;
      lastW = w;
      lastH = h;
      const aspect = w / h;
      camera.fov = aspect < 1.0 ? 58 : 42;
      camera.aspect = aspect;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      requestRender();
    };

    const onContextLost = (e: Event) => {
      e.preventDefault();
      setWebglError('WebGL context interrupted. Restoring scene...');
    };
    const onContextRestored = () => {
      setWebglError(null);
      requestRender();
    };

    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('pointerup', onPointerUp);
    renderer.domElement.addEventListener('pointermove', onPointerMove);
    renderer.domElement.addEventListener('webglcontextlost', onContextLost);
    renderer.domElement.addEventListener('webglcontextrestored', onContextRestored);

    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(container);

    // Initial render
    requestRender();

    return () => {
      isDisposed = true;
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      resizeObserver.disconnect();
      controls.removeEventListener('start', onControlStart);
      controls.removeEventListener('change', onControlChange);
      controls.dispose();
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.domElement.removeEventListener('pointerup', onPointerUp);
      renderer.domElement.removeEventListener('pointermove', onPointerMove);
      renderer.domElement.removeEventListener('webglcontextlost', onContextLost);
      renderer.domElement.removeEventListener('webglcontextrestored', onContextRestored);

      handles.disposables.geometries.forEach((g) => g.dispose());
      handles.disposables.materials.forEach((m) => m.dispose());
      handles.disposables.textures.forEach((t) => t.dispose());
      envTex.dispose();
      renderer.dispose();
    };
  }, []);

  const handleSelectCameraPreset = (presetId: CameraPresetId) => {
    setActivePreset(presetId);
    const p = CAMERA_PRESETS[presetId];
    sceneStateRef.current.camTargetPos = new THREE.Vector3(...p.pos);
    sceneStateRef.current.camTargetLook = new THREE.Vector3(...p.target);
    sceneStateRef.current.requestRender?.();
  };

  const toggleLayerVisibility = (id: string) => {
    setVisibleLayers((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const resetAllLayers = () => {
    const allTrue: Record<string, boolean> = {};
    ANATOMICAL_STRUCTURES.forEach((a) => {
      allTrue[a.id] = true;
    });
    setVisibleLayers(allTrue);
    setExplodeLevel(0.22);
    handleSelectCameraPreset('perspective');
  };

  const visibleCount = Object.values(visibleLayers).filter(Boolean).length;

  return (
    <div
      ref={viewportRef}
      data-testid="anatomy-3d-viewport"
      data-wound-mode={woundMode}
      data-selected-anatomy={selectedAnatomyId ?? 'none'}
      data-explode={explodeLevel.toFixed(2)}
      data-layer-count={visibleCount}
      className="relative w-full h-[460px] lg:h-[580px] rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 select-none"
    >
      {/* Dedicated isolated WebGL canvas mount */}
      <div ref={mountRef} className="w-full h-full" />

      {/* WebGL unavailable fallback */}
      {webglError && (
        <div className="absolute inset-0 flex items-center justify-center p-6 bg-slate-100 dark:bg-slate-900 text-center">
          <p className="text-sm text-slate-600 dark:text-slate-300">{webglError}</p>
        </div>
      )}

      {/* Minimal Top-Left Viewport Title & Interaction Hint */}
      <div className="absolute top-3 left-3 z-10 pointer-events-none flex flex-col gap-1">
        <div className="px-3 py-1.5 rounded-lg bg-slate-900/85 text-white border border-white/10 text-xs font-medium tracking-wide">
          3D Surgical Tissue Cross-Section · {WOUND_MODE_OPTIONS.find((w) => w.id === woundMode)?.label}
        </div>
        <span className="hidden sm:inline-block px-2.5 py-1 rounded-md bg-slate-900/75 text-slate-200 text-[11px] w-fit">
          Drag to orbit · Scroll to zoom · Click any layer to inspect
        </span>
      </div>

      {/* Projected 2D Semantic Anatomical Labels (No backdrop-blur over WebGL) */}
      {showAnnotations && (
        <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
          {pins.map((pin) => {
            const isSelected = selectedAnatomyId === pin.id;
            return (
              <button
                key={pin.id}
                type="button"
                data-testid={`pin-${pin.id}`}
                onClick={() => onSelectAnatomy(pin.id)}
                style={{
                  left: `${pin.x}px`,
                  top: `${pin.y}px`,
                  transform: 'translate(-50%, -50%)'
                }}
                className={`pointer-events-auto absolute px-2 py-0.5 rounded text-[11px] font-medium transition-colors border whitespace-nowrap ${
                  isSelected
                    ? 'bg-sky-600 text-white border-sky-300 shadow-sm'
                    : pin.isCritical
                      ? 'bg-rose-950/90 text-rose-100 border-rose-500/60 hover:bg-rose-900'
                      : 'bg-slate-900/85 text-slate-100 border-slate-600/70 hover:bg-slate-800'
                }`}
              >
                {pin.isCritical ? '▲ ' : ''}
                {pin.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Collapsible Bottom Control Dock (Zero center viewport occlusion, no backdrop-blur) */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 w-[94%] max-w-[820px] flex flex-col items-center">
        <button
          type="button"
          data-testid="toggle-3d-dock"
          onClick={() => setDockCollapsed((c) => !c)}
          className="mb-1.5 px-3 py-1 rounded-t-lg rounded-b-md bg-slate-900/90 text-slate-100 border border-slate-700 text-xs font-medium flex items-center gap-1.5 hover:bg-slate-800 cursor-pointer"
        >
          {dockCollapsed ? (
            <>
              <ChevronUp className="w-3.5 h-3.5" />
              Show 3D Controls
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5" />
              Hide 3D Controls
            </>
          )}
        </button>

        {!dockCollapsed && (
          <div className="w-full rounded-xl bg-slate-900/92 text-slate-100 border border-slate-700/80 p-3 shadow-lg">
            {/* Compact Header Bar inside Dock */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 mb-2.5 border-b border-slate-800">
              <div className="flex items-center gap-1">
                {(
                  [
                    { id: 'wound', label: 'Wound Scenario' },
                    { id: 'layers', label: 'Tissue Layers' },
                    { id: 'camera', label: 'Camera & Reset' }
                  ] as const
                ).map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setDockTab(t.id)}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer transition-colors ${
                      dockTab === t.id
                        ? 'bg-sky-600 text-white'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-xs text-slate-200">
                  <Layers className="w-3.5 h-3.5 text-sky-400" />
                  <span>Explode: {Math.round(explodeLevel * 100)}%</span>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.02}
                    value={explodeLevel}
                    onChange={(e) => setExplodeLevel(parseFloat(e.target.value))}
                    aria-label="Explode tissue layers"
                    data-testid="explode-slider"
                    className="w-24 accent-sky-500 cursor-pointer"
                  />
                </label>

                <button
                  type="button"
                  onClick={() => setShowAnnotations((v) => !v)}
                  className={`px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1 cursor-pointer border ${
                    showAnnotations
                      ? 'bg-sky-950/90 border-sky-500/60 text-sky-200'
                      : 'bg-slate-800 border-slate-700 text-slate-300'
                  }`}
                >
                  <Tag className="w-3 h-3" />
                  Labels
                </button>
              </div>
            </div>

            {/* Dock Tab Content */}
            {dockTab === 'wound' && (
              <div className="flex flex-wrap gap-1.5">
                {WOUND_MODE_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    data-testid={`wound-mode-${opt.id}`}
                    onClick={() => onChangeWoundMode(opt.id)}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer transition-colors ${
                      woundMode === opt.id
                        ? 'bg-sky-600 text-white'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}

            {dockTab === 'layers' && (
              <div className="flex flex-wrap gap-1.5">
                {ANATOMICAL_STRUCTURES.map((a) => {
                  const isVis = visibleLayers[a.id] !== false;
                  return (
                    <button
                      key={a.id}
                      type="button"
                      data-testid={`toggle-layer-${a.id}`}
                      onClick={() => toggleLayerVisibility(a.id)}
                      className={`px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 cursor-pointer border transition-colors ${
                        isVis
                          ? 'bg-slate-800 border-slate-600 text-slate-100'
                          : 'bg-slate-950 border-slate-800 text-slate-500 line-through'
                      }`}
                    >
                      {isVis ? <Eye className="w-3 h-3 text-sky-400" /> : <EyeOff className="w-3 h-3" />}
                      {a.name.split(' (')[0]}
                    </button>
                  );
                })}
              </div>
            )}

            {dockTab === 'camera' && (
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap gap-1.5">
                  {(Object.keys(CAMERA_PRESETS) as CameraPresetId[]).map((presetKey) => (
                    <button
                      key={presetKey}
                      type="button"
                      data-testid={`camera-${presetKey}`}
                      onClick={() => handleSelectCameraPreset(presetKey)}
                      className={`px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer ${
                        activePreset === presetKey
                          ? 'bg-sky-600 text-white'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {CAMERA_PRESETS[presetKey].label}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={resetAllLayers}
                  className="px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset View
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
