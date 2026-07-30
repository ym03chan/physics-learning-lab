"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Vec = { x: number; y: number };
type Source = {
  name: string;
  position: Vec;
  mu: number;
  radius: number;
  look: "ocean" | "rust" | "gas" | "star" | "ice" | "ringed" | "void";
  color: number;
  orbit?: { center: Vec; radius: number; speed: number; phase: number };
};
type Base = {
  id: string;
  name: string;
  role: string;
  position: Vec;
  radius: number;
  shape: "harbor" | "relay" | "needle" | "citadel";
  par: number;
  base: number;
  precision: number;
  fuel: number;
  crew: number;
  color: number;
};
type Mission = {
  id: number;
  system: string;
  sector: string;
  title: string;
  brief: string;
  concept: string;
  hint: string;
  formula: string;
  start: Vec;
  sources: Source[];
  bases: Base[];
};
type Flight = Vec & { vx: number; vy: number; time: number };
type Result = {
  ok: boolean;
  title: string;
  copy: string;
  score: number;
  precision: number;
  fuel: number;
};
type Log = { system: string; base: string; result: string; speed: number; score: number };
type ViewportMode = "wide" | "compact" | "touch";
type OpenPanel = "mission" | "bases" | null;
type SceneBounds = { minX: number; maxX: number; minY: number; maxY: number };
type SceneInsets = { top: number; right: number; bottom: number; left: number };
type CameraFit = SceneBounds & { centerX: number; centerY: number };

const MAX_PULL = 2.6;

function missionBounds(mission: Mission): SceneBounds {
  let minX = mission.start.x - MAX_PULL;
  let maxX = mission.start.x + MAX_PULL;
  let minY = mission.start.y - MAX_PULL;
  let maxY = mission.start.y + MAX_PULL;

  for (const source of mission.sources) {
    const visualRadius = source.radius * (source.look === "ringed" || source.look === "void" ? 2.25 : 1.18);
    if (source.orbit) {
      minX = Math.min(minX, source.orbit.center.x - source.orbit.radius - visualRadius);
      maxX = Math.max(maxX, source.orbit.center.x + source.orbit.radius + visualRadius);
      minY = Math.min(minY, source.orbit.center.y - source.orbit.radius - visualRadius);
      maxY = Math.max(maxY, source.orbit.center.y + source.orbit.radius + visualRadius);
    } else {
      minX = Math.min(minX, source.position.x - visualRadius);
      maxX = Math.max(maxX, source.position.x + visualRadius);
      minY = Math.min(minY, source.position.y - visualRadius);
      maxY = Math.max(maxY, source.position.y + visualRadius);
    }
  }

  for (const base of mission.bases) {
    const visualRadius = base.radius + 0.5;
    minX = Math.min(minX, base.position.x - visualRadius);
    maxX = Math.max(maxX, base.position.x + visualRadius);
    minY = Math.min(minY, base.position.y - visualRadius);
    maxY = Math.max(maxY, base.position.y + visualRadius);
  }

  return { minX: minX - 0.25, maxX: maxX + 0.25, minY: minY - 0.25, maxY: maxY + 0.25 };
}

function fitMissionCamera(mission: Mission, width: number, height: number, insets: SceneInsets): CameraFit {
  const bounds = missionBounds(mission);
  const safeWidth = Math.max(1, width - insets.left - insets.right);
  const safeHeight = Math.max(1, height - insets.top - insets.bottom);
  const aspect = width / Math.max(height, 1);
  const contentWidth = bounds.maxX - bounds.minX;
  const contentHeight = bounds.maxY - bounds.minY;
  const halfHeight = Math.max(
    contentHeight * 0.5 * height / safeHeight,
    contentWidth * 0.5 * width / safeWidth / aspect,
  ) * 1.035;
  const halfWidth = halfHeight * aspect;
  const contentCenterX = (bounds.minX + bounds.maxX) * 0.5;
  const contentCenterY = (bounds.minY + bounds.maxY) * 0.5;
  const insetCenterX = (insets.left - insets.right) / width;
  const insetCenterY = (insets.bottom - insets.top) / height;
  const centerX = contentCenterX - insetCenterX * halfWidth;
  const centerY = contentCenterY - insetCenterY * halfHeight;

  return {
    minX: centerX - halfWidth,
    maxX: centerX + halfWidth,
    minY: centerY - halfHeight,
    maxY: centerY + halfHeight,
    centerX,
    centerY,
  };
}

function getViewportMode(width: number, height: number, coarse: boolean): ViewportMode {
  if (coarse || width <= 820) return "touch";
  if (width >= 1440 && height >= 760) return "wide";
  return "compact";
}

const makeBases = (
  names: [string, string, string],
  roles: [string, string, string],
  positions: [Vec, Vec, Vec],
  crew: [number, number, number],
  scores: [number, number, number],
  colors: [number, number, number],
): Base[] => [
  { id: "A", name: names[0], role: roles[0], position: positions[0], radius: 0.62, shape: "harbor", par: 4.65, base: scores[0], precision: 350, fuel: 300, crew: crew[0], color: colors[0] },
  { id: "B", name: names[1], role: roles[1], position: positions[1], radius: 0.34, shape: "citadel", par: 4.3, base: scores[1], precision: 550, fuel: 450, crew: crew[1], color: colors[1] },
  { id: "C", name: names[2], role: roles[2], position: positions[2], radius: 0.19, shape: "needle", par: 4.05, base: scores[2], precision: 800, fuel: 650, crew: crew[2], color: colors[2] },
];

const MISSIONS: Mission[] = [
  {
    id: 1,
    system: "SOL // LUNAR REACH",
    sector: "HOME SYSTEM",
    title: "The Last Ten Thousand Kilometres",
    brief: "Courier Astra-12 reached the Moon, but a reactor fault killed final-approach control. Bring its six crew home.",
    concept: "VECTOR CONTROL",
    hint: "Selene is a gentle first return. Pull opposite the harbor and release once the short guidance arc meets its beacon.",
    formula: "launch velocity = direction × pull",
    start: { x: -5.4, y: -0.4 },
    sources: [
      { name: "Luna", position: { x: 0.1, y: -1.15 }, mu: 4.5, radius: 0.58, look: "ice", color: 0xb8c7d9 },
      { name: "Earth", position: { x: 2.7, y: 2.65 }, mu: 1.2, radius: 0.38, look: "ocean", color: 0x2c8fff },
    ],
    bases: makeBases(
      ["Selene Harbor", "Tycho Citadel", "Far-Side Needle"],
      ["CIVILIAN", "COMMAND", "SCIENCE"],
      [{ x: 4.65, y: -1.35 }, { x: 4.95, y: 0.3 }, { x: 4.35, y: 1.85 }],
      [42, 18, 3],
      [800, 1300, 2050],
      [0x70f0ff, 0xffca70, 0xff7b9c],
    ),
  },
  {
    id: 2,
    system: "ARES // REDHAVEN",
    sector: "MARS CORRIDOR",
    title: "Dust over Redhaven",
    brief: "A medical shuttle is falling below its descent lane. Mars will bend the route south; recover the crew at a frontier base.",
    concept: "FIELD DEFLECTION",
    hint: "Aim above the selected base. Redhaven's gravity pulls the shuttle downward during the crossing.",
    formula: "gravity grows as distance shrinks",
    start: { x: -5.35, y: 0.8 },
    sources: [
      { name: "Mars", position: { x: 0, y: -1.0 }, mu: 5.8, radius: 0.68, look: "rust", color: 0xd95c36 },
      { name: "Phobos", position: { x: 1.55, y: 1.55 }, mu: 0.65, radius: 0.2, look: "ice", color: 0x8d8177 },
    ],
    bases: makeBases(
      ["Redhaven Port", "Ares Fuel Crown", "Valles Watch"],
      ["CIVILIAN", "DEPOT", "OUTPOST"],
      [{ x: 4.7, y: -1.8 }, { x: 4.95, y: -0.05 }, { x: 4.2, y: 1.75 }],
      [116, 16, 4],
      [900, 1450, 2200],
      [0xffa36f, 0xffd46e, 0x77d8ff],
    ),
  },
  {
    id: 3,
    system: "JOVIAN // GALILEO RUN",
    sector: "OUTER SYSTEM",
    title: "Beneath the Giant",
    brief: "The research ship Kestrel has one burn left. Use Jupiter's enormous pull to arc into a staffed station.",
    concept: "GRAVITY ASSIST",
    hint: "A close pass makes a strong turn, but the cloud deck is fatal. The guide shows only the opening moments.",
    formula: "closer flyby = stronger turn",
    start: { x: -5.25, y: -2.15 },
    sources: [
      { name: "Jupiter", position: { x: -0.05, y: -0.25 }, mu: 8.8, radius: 0.9, look: "gas", color: 0xd9a66c },
      { name: "Europa", position: { x: 2.15, y: 1.15 }, mu: 1.1, radius: 0.28, look: "ice", color: 0xbbe2ef },
    ],
    bases: makeBases(
      ["Callisto Haven", "Galileo Crown", "Io Survey Spire"],
      ["SANCTUARY", "ORBITAL", "SCIENCE"],
      [{ x: 4.75, y: -1.9 }, { x: 4.65, y: 0.05 }, { x: 3.65, y: 2.35 }],
      [204, 29, 5],
      [1050, 1600, 2400],
      [0xb5f4e0, 0xffd985, 0xff8b73],
    ),
  },
  {
    id: 4,
    system: "KEPLER-47 // TWINLIGHT",
    sector: "BINARY FRONTIER",
    title: "Between Two Suns",
    brief: "A colony tender emerged between paired stars. Thread the neutral corridor before either sun captures the ship.",
    concept: "SUPERPOSITION",
    hint: "The vertical pulls nearly cancel through the middle. Small angle changes matter more than raw launch power.",
    formula: "net gravity = sum of every field",
    start: { x: -5.4, y: 0 },
    sources: [
      { name: "Kepler A", position: { x: 0.15, y: 1.38 }, mu: 5.0, radius: 0.54, look: "star", color: 0xffd36a },
      { name: "Kepler B", position: { x: 0.42, y: -1.42 }, mu: 5.6, radius: 0.49, look: "star", color: 0xff7a50 },
    ],
    bases: makeBases(
      ["Pilgrim Anchorage", "Twinlight Hub", "Corona Relay"],
      ["COLONY", "CAPITAL", "WEATHER"],
      [{ x: 4.8, y: -1.75 }, { x: 5.0, y: 0.05 }, { x: 4.4, y: 1.9 }],
      [328, 91, 7],
      [1150, 1800, 2600],
      [0x7df2d6, 0x88dfff, 0xffc56e],
    ).map((base, index) => index === 2 ? { ...base, shape: "relay" as const } : base),
  },
  {
    id: 5,
    system: "CRONUS // RING PLANE",
    sector: "SATURNIAN LEAGUE",
    title: "The Ring-Plane Crossing",
    brief: "Debris closed every standard route. Bend around Saturn, clear the ring plane and dock before life support reaches reserve.",
    concept: "ORBITAL ENERGY",
    hint: "Enter fast enough to remain unbound. A slow launch falls into orbit; a precise fast launch escapes toward the bases.",
    formula: "energy = speed² ÷ 2 − gravity potential",
    start: { x: -5.05, y: -2.35 },
    sources: [
      { name: "Saturn", position: { x: 0, y: 0 }, mu: 8.1, radius: 0.78, look: "ringed", color: 0xe5c888 },
      { name: "Titan", position: { x: 2.45, y: -1.55 }, mu: 1.35, radius: 0.32, look: "rust", color: 0xd5a047 },
    ],
    bases: makeBases(
      ["Titan Commons", "Cassini Terminal", "Enceladus Needle"],
      ["HABITAT", "TRANSIT", "CRYOLAB"],
      [{ x: 4.7, y: -2.0 }, { x: 4.65, y: 0.05 }, { x: 2.95, y: 2.65 }],
      [512, 37, 6],
      [1250, 2000, 2900],
      [0xffbd62, 0x7ce7ff, 0xc3f5ff],
    ),
  },
  {
    id: 6,
    system: "NYX // BLACKWATER",
    sector: "DEEP FRONTIER",
    title: "The Nomad Window",
    brief: "A wandering planet crosses a collapsed star. Time the slingshot and return the Pathfinder crew to humanity.",
    concept: "MOVING GRAVITY",
    hint: "Nomad moves while you fly. Launch behind it to borrow momentum, then let Blackwater bend the final approach.",
    formula: "moving worlds exchange momentum",
    start: { x: -5.25, y: -1.65 },
    sources: [
      { name: "Blackwater", position: { x: 0.15, y: 0.05 }, mu: 5.1, radius: 0.5, look: "void", color: 0x6b5cff },
      { name: "Nomad", position: { x: 0, y: 0 }, mu: 3.4, radius: 0.4, look: "ocean", color: 0x28c8cb, orbit: { center: { x: 0.45, y: 0 }, radius: 1.65, speed: 0.34, phase: -1.0 } },
    ],
    bases: makeBases(
      ["Pathfinder Refuge", "Blackwater Citadel", "Edge Beacon"],
      ["RESCUE", "COMMAND", "LAST LIGHT"],
      [{ x: 4.75, y: -1.7 }, { x: 4.75, y: 0.15 }, { x: 3.9, y: 2.4 }],
      [81, 19, 2],
      [1400, 2250, 3350],
      [0x78f0cf, 0xa99cff, 0xff8dbe],
    ).map((base, index) => index === 2 ? { ...base, shape: "relay" as const, radius: 0.14 } : base),
  },
];

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
const maxScore = (base: Base) => base.base + base.precision + base.fuel + 300;
const difficulty = (radius: number) => radius >= 0.58 ? "FORGIVING" : radius >= 0.28 ? "EXPERT" : "PRECISION";
const hex = (color: number) => `#${color.toString(16).padStart(6, "0")}`;

function sourcePosition(source: Source, time: number): Vec {
  if (!source.orbit) return source.position;
  const angle = source.orbit.phase + source.orbit.speed * time;
  return {
    x: source.orbit.center.x + Math.cos(angle) * source.orbit.radius,
    y: source.orbit.center.y + Math.sin(angle) * source.orbit.radius,
  };
}

function gravity(position: Vec, mission: Mission, time: number): Vec {
  let x = 0;
  let y = 0;
  for (const source of mission.sources) {
    const center = sourcePosition(source, time);
    const dx = center.x - position.x;
    const dy = center.y - position.y;
    const distanceSq = Math.max(dx * dx + dy * dy, source.radius * source.radius * 0.72);
    const distance = Math.sqrt(distanceSq);
    const force = (0.92 * source.mu) / distanceSq;
    x += (dx / distance) * force;
    y += (dy / distance) * force;
  }
  return { x, y };
}

function integrate(state: Flight, mission: Mission, dt: number): Flight {
  const a = gravity(state, mission, state.time);
  const x = state.x + state.vx * dt + a.x * dt * dt * 0.5;
  const y = state.y + state.vy * dt + a.y * dt * dt * 0.5;
  const b = gravity({ x, y }, mission, state.time + dt);
  return {
    x,
    y,
    vx: state.vx + (a.x + b.x) * 0.5 * dt,
    vy: state.vy + (a.y + b.y) * 0.5 * dt,
    time: state.time + dt,
  };
}

export default function OrbitGame() {
  const mountRef = useRef<HTMLDivElement>(null);
  const engine = useRef<any>(null);
  const introRef = useRef(true);
  const missionRef = useRef(0);
  const targetRef = useRef("A");
  const statusRef = useRef<"aiming" | "flying" | "result">("aiming");
  const flightRef = useRef<Flight>({ x: -5.4, y: -0.4, vx: 0, vy: 0, time: 0 });
  const launchRef = useRef<Vec>({ x: 0, y: 0 });
  const logsRef = useRef<Log[]>([]);
  const totalRef = useRef(0);
  const soundRef = useRef(true);
  const viewportRef = useRef<ViewportMode>("compact");

  const [intro, setIntro] = useState(true);
  const [viewportMode, setViewportMode] = useState<ViewportMode>("compact");
  const [openPanel, setOpenPanel] = useState<OpenPanel>(null);
  const [missionIndex, setMissionIndex] = useState(0);
  const [targetId, setTargetId] = useState("A");
  const [status, setStatus] = useState("AIMING");
  const [telemetry, setTelemetry] = useState({ speed: 0, gravity: 0, time: 0, distance: "—" });
  const [result, setResult] = useState<Result | null>(null);
  const [hint, setHint] = useState(false);
  const [logOpen, setLogOpen] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const [trajectory, setTrajectory] = useState(true);
  const [vectors, setVectors] = useState(true);
  const [sound, setSound] = useState(true);
  const [score, setScore] = useState(0);
  const [logs, setLogs] = useState<Log[]>([]);

  const mission = MISSIONS[missionIndex];
  const target = mission.bases.find((base) => base.id === targetId) ?? mission.bases[0];

  const closeIntro = () => {
    introRef.current = false;
    setIntro(false);
    requestAnimationFrame(() => {
      const shell = mountRef.current?.closest(".game-shell");
      shell?.scrollTo({ top: 0, left: 0 });
    });
  };

  useEffect(() => {
    const coarseQuery = matchMedia("(pointer: coarse)");
    const updateViewport = () => {
      const mode = getViewportMode(window.innerWidth, window.innerHeight, coarseQuery.matches);
      viewportRef.current = mode;
      setViewportMode(mode);
      if (mode === "wide") setOpenPanel(null);
      requestAnimationFrame(() => engine.current?.resize?.());
    };
    updateViewport();
    addEventListener("resize", updateViewport);
    coarseQuery.addEventListener?.("change", updateViewport);
    return () => {
      removeEventListener("resize", updateViewport);
      coarseQuery.removeEventListener?.("change", updateViewport);
    };
  }, []);

  const tone = useCallback((kind: "launch" | "success" | "crash" | "click") => {
    if (!soundRef.current || typeof window === "undefined") return;
    const Audio = window.AudioContext || (window as any).webkitAudioContext;
    if (!Audio) return;
    const context = new Audio();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const config = { launch: [150, 520, 0.22], success: [460, 920, 0.4], crash: [180, 52, 0.42], click: [320, 370, 0.07] }[kind];
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.type = kind === "crash" ? "sawtooth" : kind === "success" ? "triangle" : "sine";
    oscillator.frequency.setValueAtTime(config[0], context.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(config[1], context.currentTime + config[2]);
    gain.gain.setValueAtTime(kind === "click" ? 0.03 : 0.085, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + config[2]);
    oscillator.start();
    oscillator.stop(context.currentTime + config[2]);
  }, []);

  useEffect(() => { soundRef.current = sound; }, [sound]);

  useEffect(() => {
    let disposed = false;
    let dispose = () => {};

    async function initialize() {
      const THREE = await import("three");
      if (disposed || !mountRef.current) return;
      const mount = mountRef.current;
      const scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x02060b, 0.022);
      const camera = new THREE.OrthographicCamera(-7, 7, 4, -4, 0.1, 100);
      camera.position.z = 12;
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;
      renderer.domElement.className = "space-canvas";
      mount.appendChild(renderer.domElement);
      scene.add(new THREE.AmbientLight(0x7da8cc, 1.2));
      const key = new THREE.DirectionalLight(0xffffff, 2.5);
      key.position.set(-3, 4, 8);
      scene.add(key);
      const rim = new THREE.DirectionalLight(0x3158ff, 1.15);
      rim.position.set(6, -3, 4);
      scene.add(rim);

      const starGeo = new THREE.BufferGeometry();
      const starPos = new Float32Array(1500 * 3);
      const starColors = new Float32Array(1500 * 3);
      for (let i = 0; i < 1500; i += 1) {
        starPos[i * 3] = (Math.random() - 0.5) * 44;
        starPos[i * 3 + 1] = (Math.random() - 0.5) * 26;
        starPos[i * 3 + 2] = -3 - Math.random() * 14;
        const tint = 0.68 + Math.random() * 0.32;
        starColors[i * 3] = tint;
        starColors[i * 3 + 1] = tint * 0.92;
        starColors[i * 3 + 2] = 1;
      }
      starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
      starGeo.setAttribute("color", new THREE.BufferAttribute(starColors, 3));
      const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ size: 0.038, vertexColors: true, transparent: true, opacity: 0.84 }));
      scene.add(stars);

      const world = new THREE.Group();
      const field = new THREE.Group();
      scene.add(world, field);

      const textureCache = new Map<string, any>();
      const material = (color: number, selected = false, emissive = color, roughness = 0.4, metalness = 0.68) =>
        new THREE.MeshStandardMaterial({
          color,
          emissive,
          emissiveIntensity: selected ? 1.05 : 0.2,
          roughness,
          metalness,
        });

      function seededRandom(seedText: string) {
        let seed = 2166136261;
        for (let i = 0; i < seedText.length; i += 1) {
          seed ^= seedText.charCodeAt(i);
          seed = Math.imul(seed, 16777619);
        }
        return () => {
          seed += 0x6d2b79f5;
          let value = seed;
          value = Math.imul(value ^ value >>> 15, value | 1);
          value ^= value + Math.imul(value ^ value >>> 7, value | 61);
          return ((value ^ value >>> 14) >>> 0) / 4294967296;
        };
      }

      function surfaceTexture(source: Source) {
        const key = `${source.name}-${source.look}-${source.color}`;
        if (textureCache.has(key)) return textureCache.get(key);
        const canvas = document.createElement("canvas");
        canvas.width = viewportRef.current === "touch" ? 384 : 512;
        canvas.height = canvas.width / 2;
        const context = canvas.getContext("2d")!;
        const random = seededRandom(key);
        const width = canvas.width;
        const height = canvas.height;
        const palettes: Record<Source["look"], string[]> = {
          ocean: ["#082d61", "#0d6e9d", "#25a9b8", "#7bbf88", "#d8d4a2"],
          rust: ["#3c1713", "#7d2d20", "#bd5835", "#e38a58", "#54201b"],
          gas: ["#4b2d29", "#936044", "#e3ba86", "#f4ddbd", "#704235"],
          star: ["#d13d16", "#ff7b21", "#ffd563", "#fff2b0", "#a91b0f"],
          ice: ["#263b57", "#7394b5", "#bfd3e2", "#eef8ff", "#536f91"],
          ringed: ["#55442e", "#9b8258", "#d9c493", "#f0dfb8", "#6d5a3c"],
          void: ["#010106", "#09051b", "#1e0f45", "#3f2180", "#020107"],
        };
        const palette = palettes[source.look];
        const gradient = context.createLinearGradient(0, 0, 0, height);
        palette.forEach((color, index) => gradient.addColorStop(index / (palette.length - 1), color));
        context.fillStyle = gradient;
        context.fillRect(0, 0, width, height);

        if (source.look === "gas" || source.look === "ringed" || source.look === "star") {
          for (let band = 0; band < 34; band += 1) {
            const y = random() * height;
            const bandHeight = 1 + random() * 12;
            context.fillStyle = palette[Math.floor(random() * palette.length)];
            context.globalAlpha = 0.12 + random() * 0.3;
            context.fillRect(0, y, width, bandHeight);
            context.globalAlpha = 1;
          }
          for (let storm = 0; storm < (source.look === "star" ? 42 : 9); storm += 1) {
            context.beginPath();
            context.ellipse(random() * width, random() * height, 8 + random() * 35, 2 + random() * 10, random() * Math.PI, 0, Math.PI * 2);
            context.fillStyle = palette[Math.floor(random() * palette.length)];
            context.globalAlpha = 0.18 + random() * 0.28;
            context.fill();
          }
        } else if (source.look === "ocean") {
          context.fillStyle = palette[3];
          for (let land = 0; land < 46; land += 1) {
            context.beginPath();
            context.ellipse(random() * width, random() * height, 7 + random() * 32, 3 + random() * 15, random() * Math.PI, 0, Math.PI * 2);
            context.globalAlpha = 0.3 + random() * 0.48;
            context.fill();
          }
          context.strokeStyle = "#e8fbff";
          context.lineCap = "round";
          for (let cloud = 0; cloud < 24; cloud += 1) {
            context.beginPath();
            context.moveTo(random() * width, random() * height);
            context.bezierCurveTo(random() * width, random() * height, random() * width, random() * height, random() * width, random() * height);
            context.globalAlpha = 0.12 + random() * 0.25;
            context.lineWidth = 1 + random() * 3;
            context.stroke();
          }
        } else {
          for (let crater = 0; crater < 90; crater += 1) {
            const radius = 1 + random() * (source.look === "ice" ? 9 : 13);
            context.beginPath();
            context.arc(random() * width, random() * height, radius, 0, Math.PI * 2);
            context.fillStyle = palette[Math.floor(random() * palette.length)];
            context.globalAlpha = 0.12 + random() * 0.34;
            context.fill();
            context.strokeStyle = "rgba(255,255,255,.2)";
            context.lineWidth = Math.max(0.5, radius * 0.08);
            context.stroke();
          }
          if (source.look === "ice") {
            context.strokeStyle = "rgba(220,248,255,.44)";
            context.lineWidth = 1;
            for (let crack = 0; crack < 34; crack += 1) {
              context.beginPath();
              const x = random() * width;
              const y = random() * height;
              context.moveTo(x, y);
              context.lineTo(x + (random() - 0.5) * 70, y + (random() - 0.5) * 42);
              context.lineTo(x + (random() - 0.5) * 110, y + (random() - 0.5) * 60);
              context.globalAlpha = 0.25 + random() * 0.35;
              context.stroke();
            }
          }
        }
        context.globalAlpha = 1;
        const texture = new THREE.CanvasTexture(canvas);
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.wrapS = THREE.RepeatWrapping;
        texture.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
        textureCache.set(key, texture);
        return texture;
      }

      function planet(source: Source) {
        const group = new THREE.Group();
        group.userData.source = source;
        const segments = viewportRef.current === "touch" ? 32 : 48;
        const surface = new THREE.Mesh(
          new THREE.SphereGeometry(source.radius, segments, Math.max(20, segments / 1.5)),
          new THREE.MeshStandardMaterial({
            map: surfaceTexture(source),
            color: source.look === "void" ? 0x090414 : 0xffffff,
            emissive: source.look === "star" ? source.color : source.look === "void" ? 0x17093b : 0x02070b,
            emissiveIntensity: source.look === "star" ? 1.2 : source.look === "void" ? 0.7 : 0.08,
            roughness: source.look === "ice" ? 0.8 : source.look === "gas" ? 0.72 : 0.6,
            metalness: source.look === "void" ? 0.65 : 0.02,
          }),
        );
        group.add(surface);
        group.userData.surface = surface;

        if (source.look !== "void") {
          const atmosphere = new THREE.Mesh(
            new THREE.SphereGeometry(source.radius * 1.075, segments, Math.max(20, segments / 1.5)),
            new THREE.MeshBasicMaterial({
              color: source.look === "star" ? source.color : source.look === "rust" ? 0xff8a53 : source.look === "ice" ? 0xa8e4ff : 0x52bde8,
              transparent: true,
              opacity: source.look === "star" ? 0.17 : 0.1,
              blending: THREE.AdditiveBlending,
              side: THREE.BackSide,
              depthWrite: false,
            }),
          );
          group.add(atmosphere);
          group.userData.atmosphere = atmosphere;
        }
        if (source.look === "ringed") {
          const rings = new THREE.Mesh(
            new THREE.RingGeometry(source.radius * 1.28, source.radius * 2.15, 112),
            new THREE.MeshStandardMaterial({
              color: 0xd9bd82,
              emissive: 0x4a351d,
              emissiveIntensity: 0.2,
              side: THREE.DoubleSide,
              transparent: true,
              opacity: 0.72,
              roughness: 0.88,
              depthWrite: false,
            }),
          );
          rings.rotation.set(0.88, 0.22, 0.12);
          group.add(rings);
          group.userData.rings = rings;
        }
        if (source.look === "star") {
          group.add(new THREE.Mesh(
            new THREE.SphereGeometry(source.radius * 1.34, 28, 20),
            new THREE.MeshBasicMaterial({ color: source.color, transparent: true, opacity: 0.1, side: THREE.BackSide, blending: THREE.AdditiveBlending }),
          ));
          group.add(new THREE.PointLight(source.color, 2.6, 8));
        }
        if (source.look === "void") {
          const disk = new THREE.Mesh(
            new THREE.RingGeometry(source.radius * 1.08, source.radius * 2.25, 112),
            new THREE.MeshBasicMaterial({ color: 0x7b5cff, transparent: true, opacity: 0.52, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false }),
          );
          disk.rotation.x = 0.96;
          group.add(disk);
          const hot = new THREE.Mesh(
            new THREE.TorusGeometry(source.radius * 1.32, source.radius * 0.1, 12, 96),
            new THREE.MeshBasicMaterial({ color: 0xffa94f, transparent: true, opacity: 0.86, blending: THREE.AdditiveBlending }),
          );
          hot.rotation.x = 0.96;
          group.add(hot);
          group.userData.rings = disk;
        }
        return group;
      }

      function label(text: string, color: number) {
        const canvas = document.createElement("canvas");
        canvas.width = 320;
        canvas.height = 96;
        const context = canvas.getContext("2d")!;
        context.fillStyle = "rgba(3,8,15,.82)";
        context.beginPath();
        context.roundRect(7, 7, 306, 80, 18);
        context.fill();
        context.strokeStyle = hex(color);
        context.lineWidth = 3;
        context.stroke();
        context.fillStyle = "#f5fbff";
        context.font = "700 32px Arial";
        context.textAlign = "center";
        context.fillText(text, 160, 58);
        const texture = new THREE.CanvasTexture(canvas);
        texture.colorSpace = THREE.SRGBColorSpace;
        const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false }));
        sprite.scale.set(1.45, 0.44, 1);
        return sprite;
      }

      function station(base: Base, selected: boolean) {
        const group = new THREE.Group();
        const rotors: any[] = [];
        group.userData = { base, rotors };
        const scale = Math.max(base.radius, 0.16);
        const bright = material(selected ? base.color : 0x7b8c9c, selected, base.color, 0.31, 0.78);
        const hull = material(0xbcc8d1, false, 0x132331, 0.36, 0.82);
        const dark = material(0x1a2631, false, 0x07111a, 0.48, 0.76);
        const solar = material(0x123b5b, false, 0x147ea0, 0.25, 0.55);
        const zone = new THREE.Mesh(
          new THREE.RingGeometry(base.radius * 0.72, base.radius, 72),
          new THREE.MeshBasicMaterial({ color: base.color, transparent: true, opacity: selected ? 0.22 : 0.055, side: THREE.DoubleSide, depthWrite: false }),
        );
        zone.position.z = -0.22;
        group.add(zone);

        const core = new THREE.Mesh(new THREE.CylinderGeometry(scale * 0.13, scale * 0.16, scale * 0.34, 16), hull);
        core.rotation.x = Math.PI / 2;
        group.add(core);

        if (base.shape === "harbor") {
          const rotor = new THREE.Group();
          rotor.add(new THREE.Mesh(new THREE.TorusGeometry(scale * 0.49, scale * 0.075, 12, 64), hull));
          rotor.add(new THREE.Mesh(new THREE.TorusGeometry(scale * 0.36, scale * 0.022, 8, 56), bright));
          for (let i = 0; i < 8; i += 1) {
            const spoke = new THREE.Mesh(new THREE.BoxGeometry(scale * 0.75, scale * 0.026, scale * 0.035), dark);
            spoke.rotation.z = Math.PI * i / 8;
            rotor.add(spoke);
          }
          group.add(rotor);
          rotors.push(rotor);
          const dock = new THREE.Mesh(new THREE.BoxGeometry(scale * 0.58, scale * 0.12, scale * 0.11), hull);
          dock.position.x = scale * 0.48;
          group.add(dock);
        } else if (base.shape === "relay") {
          const mast = new THREE.Mesh(new THREE.CylinderGeometry(scale * 0.035, scale * 0.055, scale * 1.08, 10), hull);
          group.add(mast);
          for (let i = 0; i < 3; i += 1) {
            const ring = new THREE.Mesh(new THREE.TorusGeometry(scale * (0.22 + i * 0.1), scale * 0.024, 8, 40), bright);
            ring.rotation.set(0.4 + i * 0.35, i * 0.7, 0);
            group.add(ring);
            rotors.push(ring);
          }
          [-1, 1].forEach((side) => {
            const panel = new THREE.Mesh(new THREE.BoxGeometry(scale * 0.4, scale * 0.18, scale * 0.025), solar);
            panel.position.x = side * scale * 0.34;
            group.add(panel);
          });
        } else if (base.shape === "needle") {
          const spine = new THREE.Mesh(new THREE.CylinderGeometry(scale * 0.035, scale * 0.09, scale * 1.5, 12), hull);
          spine.rotation.z = Math.PI / 2;
          group.add(spine);
          [-1, 1].forEach((side) => {
            const panel = new THREE.Mesh(new THREE.BoxGeometry(scale * 0.42, scale * 0.34, scale * 0.028), solar);
            panel.position.set(-scale * 0.12, side * scale * 0.31, 0);
            group.add(panel);
          });
          const dish = new THREE.Mesh(new THREE.ConeGeometry(scale * 0.2, scale * 0.12, 24, 1, true), bright);
          dish.position.x = scale * 0.62;
          dish.rotation.z = -Math.PI / 2;
          group.add(dish);
          rotors.push(dish);
        } else {
          const command = new THREE.Group();
          command.add(new THREE.Mesh(new THREE.IcosahedronGeometry(scale * 0.23, 1), hull));
          for (let i = 0; i < 4; i += 1) {
            const arm = new THREE.Group();
            const beam = new THREE.Mesh(new THREE.BoxGeometry(scale * 0.62, scale * 0.07, scale * 0.065), dark);
            beam.position.x = scale * 0.31;
            arm.add(beam);
            const pod = new THREE.Mesh(new THREE.BoxGeometry(scale * 0.22, scale * 0.16, scale * 0.13), hull);
            pod.position.x = scale * 0.62;
            arm.add(pod);
            const panel = new THREE.Mesh(new THREE.BoxGeometry(scale * 0.28, scale * 0.11, scale * 0.025), solar);
            panel.position.x = scale * 0.83;
            arm.add(panel);
            arm.rotation.z = Math.PI * i / 2;
            command.add(arm);
          }
          group.add(command);
          rotors.push(command);
        }

        const beacon = new THREE.Mesh(new THREE.SphereGeometry(scale * 0.055, 10, 8), bright);
        beacon.position.z = scale * 0.22;
        group.add(beacon);
        if (selected) group.add(new THREE.PointLight(base.color, 1.1, 1.8));
        const tag = label(`${base.id} · ${base.role}`, base.color);
        tag.position.set(0, base.radius + 0.42, 0.2);
        tag.scale.multiplyScalar(base.radius < 0.2 ? 0.72 : 0.88);
        group.add(tag);
        return group;
      }

      function shuttle() {
        const group = new THREE.Group();
        const white = material(0xe7edf0, false, 0x253846, 0.3, 0.74);
        const graphite = material(0x25303a, false, 0x071019, 0.4, 0.82);
        const glass = material(0x2fd5f1, true, 0x16b9d8, 0.12, 0.42);
        const orange = material(0xe67831, false, 0x51210a, 0.42, 0.72);
        const fuselage = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.13, 0.4, 24), white);
        fuselage.rotation.z = -Math.PI / 2;
        fuselage.position.x = -0.02;
        group.add(fuselage);
        const nose = new THREE.Mesh(new THREE.ConeGeometry(0.105, 0.2, 24), white);
        nose.rotation.z = -Math.PI / 2;
        nose.position.x = 0.28;
        group.add(nose);
        const cockpit = new THREE.Mesh(new THREE.SphereGeometry(0.092, 20, 14), glass);
        cockpit.scale.set(1.25, 0.72, 0.6);
        cockpit.position.set(0.12, 0, 0.065);
        group.add(cockpit);
        [-1, 1].forEach((side) => {
          const wing = new THREE.Mesh(new THREE.BoxGeometry(0.27, 0.14, 0.025), white);
          wing.position.set(-0.08, side * 0.145, -0.015);
          wing.rotation.z = side * 0.18;
          group.add(wing);
          const tip = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.045, 0.035), orange);
          tip.position.set(-0.07, side * 0.235, 0);
          group.add(tip);
        });
        const flames: any[] = [];
        [-1, 1].forEach((side) => {
          const engineBell = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.062, 0.1, 16), graphite);
          engineBell.rotation.z = Math.PI / 2;
          engineBell.position.set(-0.26, side * 0.065, 0);
          group.add(engineBell);
          const flame = new THREE.Mesh(
            new THREE.ConeGeometry(0.045, 0.22, 14),
            new THREE.MeshBasicMaterial({ color: side > 0 ? 0x59e7ff : 0xffb45f, transparent: true, opacity: 0.74, blending: THREE.AdditiveBlending, depthWrite: false }),
          );
          flame.rotation.z = Math.PI / 2;
          flame.position.set(-0.4, side * 0.065, 0);
          group.add(flame);
          flames.push(flame);
        });
        const nav = new THREE.Mesh(new THREE.SphereGeometry(0.025, 10, 8), new THREE.MeshBasicMaterial({ color: 0x64f6ff }));
        nav.position.set(0.02, 0.23, 0.02);
        group.add(nav);
        const hitProxy = new THREE.Mesh(new THREE.SphereGeometry(0.24, 12, 8), new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }));
        hitProxy.userData.interactionProxy = true;
        group.add(hitProxy);
        group.userData.flames = flames;
        group.scale.setScalar(1.08);
        return group;
      }

      const ship = shuttle();
      scene.add(ship);
      const trail = new THREE.Line(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({ color: 0x66eaff, transparent: true, opacity: 0.78 }));
      const predictor = new THREE.Line(new THREE.BufferGeometry(), new THREE.LineDashedMaterial({ color: 0xffcb73, transparent: true, opacity: 0.74, dashSize: 0.11, gapSize: 0.1 }));
      const pullLine = new THREE.Line(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({ color: 0xffcf70, transparent: true, opacity: 0.94 }));
      scene.add(trail, predictor, pullLine);

      const state = {
        dragging: false,
        dragPoint: new THREE.Vector3(),
        trail: [] as any[],
        planets: [] as any[],
        bases: [] as any[],
        last: performance.now(),
        closest: Infinity,
        frame: 0,
        fieldUpdatedAt: 0,
      };
      const clear = (group: any) => { while (group.children.length) group.remove(group.children[0]); };

      function buildField(active: Mission, time = 0) {
        field.traverse((item: any) => {
          item.geometry?.dispose?.();
          if (Array.isArray(item.material)) item.material.forEach((entry: any) => entry.dispose?.());
          else item.material?.dispose?.();
        });
        clear(field);
        if (!engine.current?.vectors) return;
        const mode = viewportRef.current;
        const columns = mode === "wide" ? 12 : mode === "compact" ? 10 : 8;
        const rows = mode === "wide" ? 7 : mode === "compact" ? 6 : 5;
        const bounds = missionBounds(active);
        const maxInstances = columns * rows;
        const shaftMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.27, depthWrite: false });
        const headMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.34, depthWrite: false });
        const shafts = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.012, 0.012, 1, 6), shaftMaterial, maxInstances);
        const heads = new THREE.InstancedMesh(new THREE.ConeGeometry(0.05, 0.14, 7), headMaterial, maxInstances);
        const dummy = new THREE.Object3D();
        const color = new THREE.Color();
        const low = new THREE.Color(0x3c92a1);
        const high = new THREE.Color(0xffb85d);
        let count = 0;
        for (let column = 0; column < columns; column += 1) {
          const x = bounds.minX + (column + 0.5) / columns * (bounds.maxX - bounds.minX);
          for (let row = 0; row < rows; row += 1) {
            const y = bounds.minY + (row + 0.5) / rows * (bounds.maxY - bounds.minY);
            const insideBody = active.sources.some((source) => {
              const center = sourcePosition(source, time);
              return Math.hypot(center.x - x, center.y - y) <= source.radius * 1.16;
            });
            if (insideBody) continue;
            const g = gravity({ x, y }, active, time);
            const magnitude = Math.hypot(g.x, g.y);
            if (magnitude < 0.035) continue;
            const dx = g.x / magnitude;
            const dy = g.y / magnitude;
            const length = clamp(0.13 + Math.log1p(magnitude) * 0.14, 0.17, 0.48);
            const angle = Math.atan2(dy, dx) - Math.PI / 2;
            const strength = clamp(Math.log1p(magnitude) / 2.6, 0, 1);
            color.copy(low).lerp(high, strength);

            dummy.position.set(x + dx * length * 0.48, y + dy * length * 0.48, -0.34);
            dummy.rotation.set(0, 0, angle);
            dummy.scale.set(1, length * 0.78, 1);
            dummy.updateMatrix();
            shafts.setMatrixAt(count, dummy.matrix);
            shafts.setColorAt(count, color);

            dummy.position.set(x + dx * length, y + dy * length, -0.34);
            dummy.scale.set(0.75 + strength * 0.42, 0.75 + strength * 0.42, 0.75 + strength * 0.42);
            dummy.updateMatrix();
            heads.setMatrixAt(count, dummy.matrix);
            heads.setColorAt(count, color);
            count += 1;
          }
        }
        shafts.count = count;
        heads.count = count;
        shafts.instanceMatrix.needsUpdate = true;
        heads.instanceMatrix.needsUpdate = true;
        if (shafts.instanceColor) shafts.instanceColor.needsUpdate = true;
        if (heads.instanceColor) heads.instanceColor.needsUpdate = true;
        shafts.frustumCulled = false;
        heads.frustumCulled = false;
        field.userData.materials = [shaftMaterial, headMaterial];
        field.add(shafts, heads);
      }

      function reset() {
        const active = MISSIONS[missionRef.current];
        statusRef.current = "aiming";
        flightRef.current = { ...active.start, vx: 0, vy: 0, time: 0 };
        launchRef.current = { x: 0, y: 0 };
        ship.position.set(active.start.x, active.start.y, 0.2);
        ship.rotation.z = 0;
        ship.visible = true;
        state.trail = [];
        state.closest = Infinity;
        trail.geometry.dispose();
        trail.geometry = new THREE.BufferGeometry();
        predictor.visible = false;
        pullLine.visible = false;
        setStatus("AIMING");
        setTelemetry({ speed: 0, gravity: 0, time: 0, distance: "—" });
      }

      function build(index: number) {
        clear(world);
        state.planets = [];
        state.bases = [];
        const active = MISSIONS[index];
        active.sources.forEach((source) => {
          const body = planet(source);
          const p = sourcePosition(source, 0);
          body.position.set(p.x, p.y, 0);
          world.add(body);
          state.planets.push(body);
          if (source.orbit) {
            const points = Array.from({ length: 90 }, (_, i) => {
              const angle = i / 90 * Math.PI * 2;
              return new THREE.Vector3(source.orbit!.center.x + Math.cos(angle) * source.orbit!.radius, source.orbit!.center.y + Math.sin(angle) * source.orbit!.radius, -0.25);
            });
            world.add(new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(points), new THREE.LineBasicMaterial({ color: 0x53637c, transparent: true, opacity: 0.25 })));
          }
        });
        active.bases.forEach((base) => {
          const dock = station(base, base.id === targetRef.current);
          dock.position.set(base.position.x, base.position.y, 0);
          world.add(dock);
          state.bases.push(dock);
        });
        buildField(active);
        reset();
        resize();
      }

      function selectBase() {
        const active = MISSIONS[missionRef.current];
        active.bases.forEach((base, index) => {
          if (state.bases[index]) world.remove(state.bases[index]);
          const dock = station(base, base.id === targetRef.current);
          dock.position.set(base.position.x, base.position.y, 0);
          world.add(dock);
          state.bases[index] = dock;
        });
      }

      function predict() {
        if (!engine.current?.trajectory || statusRef.current !== "aiming") {
          predictor.visible = false;
          return;
        }
        const speed = Math.hypot(launchRef.current.x, launchRef.current.y);
        if (speed < 0.18) {
          predictor.visible = false;
          return;
        }
        const active = MISSIONS[missionRef.current];
        let sample: Flight = { ...active.start, vx: launchRef.current.x, vy: launchRef.current.y, time: 0 };
        const points = [new THREE.Vector3(sample.x, sample.y, 0.06)];
        for (let i = 0; i < 76; i += 1) {
          sample = integrate(sample, active, 0.026);
          if (i % 3 === 0) points.push(new THREE.Vector3(sample.x, sample.y, 0.06));
          if (active.sources.some((source) => {
            const p = sourcePosition(source, sample.time);
            return Math.hypot(p.x - sample.x, p.y - sample.y) <= source.radius;
          })) break;
        }
        predictor.geometry.dispose();
        predictor.geometry = new THREE.BufferGeometry().setFromPoints(points);
        predictor.computeLineDistances();
        predictor.visible = true;
      }

      function point(event: PointerEvent) {
        const rect = renderer.domElement.getBoundingClientRect();
        const vector = new THREE.Vector3((event.clientX - rect.left) / rect.width * 2 - 1, -(event.clientY - rect.top) / rect.height * 2 + 1, 0);
        return vector.unproject(camera);
      }

      function pointerDown(event: PointerEvent) {
        if (statusRef.current !== "aiming" || introRef.current) return;
        const p = point(event);
        const start = MISSIONS[missionRef.current].start;
        const rect = renderer.domElement.getBoundingClientRect();
        const worldPerPixel = (camera.right - camera.left) / Math.max(rect.width, 1);
        const minimumPixels = viewportRef.current === "touch" ? 44 : 28;
        const hitRadius = Math.max(0.34, worldPerPixel * minimumPixels);
        if (Math.hypot(p.x - start.x, p.y - start.y) > hitRadius) return;
        setOpenPanel(null);
        state.dragging = true;
        renderer.domElement.setPointerCapture(event.pointerId);
      }

      function pointerMove(event: PointerEvent) {
        if (!state.dragging) return;
        const p = point(event);
        const start = MISSIONS[missionRef.current].start;
        const dx = start.x - p.x;
        const dy = start.y - p.y;
        const length = Math.hypot(dx, dy);
        const scale = length > MAX_PULL ? MAX_PULL / length : 1;
        state.dragPoint.set(start.x - dx * scale, start.y - dy * scale, 0.05);
        launchRef.current = { x: dx * scale * 1.75, y: dy * scale * 1.75 };
        pullLine.geometry.dispose();
        pullLine.geometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(start.x, start.y, 0.04), state.dragPoint]);
        pullLine.visible = true;
        predict();
        setTelemetry((current) => ({ ...current, speed: Math.hypot(launchRef.current.x, launchRef.current.y) }));
      }

      function pointerUp(event: PointerEvent) {
        if (!state.dragging) return;
        state.dragging = false;
        renderer.domElement.releasePointerCapture(event.pointerId);
        pullLine.visible = false;
        const speed = Math.hypot(launchRef.current.x, launchRef.current.y);
        if (speed < 0.34) {
          launchRef.current = { x: 0, y: 0 };
          predict();
          return;
        }
        const active = MISSIONS[missionRef.current];
        flightRef.current = { ...active.start, vx: launchRef.current.x, vy: launchRef.current.y, time: 0 };
        statusRef.current = "flying";
        predictor.visible = false;
        setStatus("IN FLIGHT");
        tone("launch");
      }

      function win(base: Base, distance: number) {
        if (statusRef.current !== "flying") return;
        statusRef.current = "result";
        const speed = Math.hypot(launchRef.current.x, launchRef.current.y);
        const precisionRatio = clamp(1 - distance / base.radius, 0, 1);
        const efficiencyRatio = clamp((base.par * 1.22 - speed) / (base.par * 0.32), 0, 1);
        const score = base.base + Math.round(base.precision * precisionRatio) + Math.round(base.fuel * efficiencyRatio) + (base.id === targetRef.current ? 300 : 0);
        totalRef.current += score;
        const log: Log = { system: MISSIONS[missionRef.current].system, base: base.name, score, speed, result: base.id === targetRef.current ? "Assigned dock secured" : "Alternate base reached" };
        logsRef.current = [log, ...logsRef.current].slice(0, 20);
        setLogs(logsRef.current);
        setScore(totalRef.current);
        setStatus("DOCKED");
        setResult({
          ok: true,
          title: base.id === targetRef.current ? "Crew safely home" : "Emergency reroute complete",
          copy: base.id === targetRef.current ? `${base.name} has hard-docked and assumed life-support control.` : `${base.name} accepted the shuttle, but the assigned-route bonus was missed.`,
          score,
          precision: Math.round(precisionRatio * 100),
          fuel: Math.round(efficiencyRatio * 100),
        });
        tone("success");
      }

      function lose(copy: string) {
        if (statusRef.current !== "flying") return;
        statusRef.current = "result";
        const active = MISSIONS[missionRef.current];
        const base = active.bases.find((item) => item.id === targetRef.current)!;
        const speed = Math.hypot(launchRef.current.x, launchRef.current.y);
        const log: Log = { system: active.system, base: base.name, score: 0, speed, result: copy };
        logsRef.current = [log, ...logsRef.current].slice(0, 20);
        setLogs(logsRef.current);
        setStatus("LOST");
        setResult({ ok: false, title: "Approach aborted", copy, score: 0, precision: 0, fuel: 0 });
        tone("crash");
      }

      function resize() {
        const width = Math.max(mount.clientWidth, 1);
        const height = Math.max(mount.clientHeight, 1);
        const mode = viewportRef.current;
        const insets: SceneInsets = mode === "compact"
          ? { top: 14, right: 54, bottom: 14, left: 54 }
          : mode === "touch"
            ? { top: 14, right: 14, bottom: 62, left: 14 }
            : { top: 12, right: 12, bottom: 12, left: 12 };
        const fit = fitMissionCamera(MISSIONS[missionRef.current], width, height, insets);
        camera.position.set(fit.centerX, fit.centerY, 12);
        camera.left = fit.minX - fit.centerX;
        camera.right = fit.maxX - fit.centerX;
        camera.top = fit.maxY - fit.centerY;
        camera.bottom = fit.minY - fit.centerY;
        camera.updateProjectionMatrix();
        renderer.setPixelRatio(Math.min(devicePixelRatio, mode === "touch" ? 1.5 : 2));
        renderer.setSize(width, height, false);
      }

      function animate(now: number) {
        if (disposed) return;
        requestAnimationFrame(animate);
        const dt = Math.min((now - state.last) / 1000, 0.04);
        state.last = now;
        state.frame += 1;
        const active = MISSIONS[missionRef.current];
        stars.rotation.z += dt * 0.002;
        state.bases.forEach((dock, index) => {
          dock.userData.rotors?.forEach((rotor: any, rotorIndex: number) => {
            rotor.rotation.z += dt * (0.18 + index * 0.035 + rotorIndex * 0.04);
          });
          const pulse = 1 + Math.sin(now * 0.002 + index) * 0.025;
          dock.scale.setScalar(active.bases[index].id === targetRef.current ? pulse : 1);
        });
        state.planets.forEach((body, index) => {
          const source = active.sources[index];
          const p = sourcePosition(source, flightRef.current.time);
          body.position.set(p.x, p.y, 0);
          if (body.userData.surface) body.userData.surface.rotation.y += dt * (source.look === "gas" ? 0.3 : 0.09);
          if (body.userData.atmosphere) body.userData.atmosphere.rotation.y -= dt * 0.035;
          if (body.userData.rings) body.userData.rings.rotation.z += dt * 0.018;
        });
        ship.userData.flames?.forEach((flame: any, index: number) => {
          const thrust = statusRef.current === "flying" ? 1 : 0.42;
          flame.scale.set(0.86 + Math.sin(now * 0.022 + index) * 0.1, thrust * (0.82 + Math.sin(now * 0.031 + index) * 0.16), 0.86);
          flame.visible = statusRef.current !== "result";
        });
        const fieldOpacity = statusRef.current === "aiming" ? 1 : 0.34;
        field.userData.materials?.forEach((fieldMaterial: any) => {
          fieldMaterial.opacity = (fieldMaterial === field.userData.materials[0] ? 0.27 : 0.34) * fieldOpacity;
        });
        if (engine.current?.vectors && active.sources.some((source) => source.orbit) && now - state.fieldUpdatedAt > 166) {
          state.fieldUpdatedAt = now;
          buildField(active, flightRef.current.time);
        }
        if (statusRef.current === "flying") {
          let flight = flightRef.current;
          for (let i = 0; i < 6; i += 1) {
            flight = integrate(flight, active, dt / 6);
            for (const source of active.sources) {
              const p = sourcePosition(source, flight.time);
              const distance = Math.hypot(p.x - flight.x, p.y - flight.y);
              state.closest = Math.min(state.closest, distance);
              if (distance <= source.radius) lose(`Collision with ${source.name}. Rescue control is ready for another trajectory.`);
            }
            if (statusRef.current !== "flying") break;
            for (const base of active.bases) {
              const distance = Math.hypot(base.position.x - flight.x, base.position.y - flight.y);
              if (distance <= base.radius) win(base, distance);
            }
            if (statusRef.current !== "flying") break;
            if (Math.abs(flight.x) > 8.2 || Math.abs(flight.y) > 5.1 || flight.time > 18) lose("The shuttle left the controlled corridor before reaching a base.");
          }
          flightRef.current = flight;
          ship.position.set(flight.x, flight.y, 0.2);
          ship.rotation.z = Math.atan2(flight.vy, flight.vx);
          state.trail.push(new THREE.Vector3(flight.x, flight.y, 0.02));
          if (state.trail.length > 260) state.trail.shift();
          trail.geometry.dispose();
          trail.geometry = new THREE.BufferGeometry().setFromPoints(state.trail);
          if (state.frame % 5 === 0) {
            const g = gravity(flight, active, flight.time);
            setTelemetry({ speed: Math.hypot(flight.vx, flight.vy), gravity: Math.hypot(g.x, g.y), time: flight.time, distance: Number.isFinite(state.closest) ? state.closest.toFixed(2) : "—" });
          }
        }
        renderer.render(scene, camera);
      }

      engine.current = {
        build,
        reset,
        selectBase,
        predict,
        trajectory,
        vectors,
        rebuildField: () => buildField(MISSIONS[missionRef.current]),
        resize,
      };
      renderer.domElement.addEventListener("pointerdown", pointerDown);
      renderer.domElement.addEventListener("pointermove", pointerMove);
      renderer.domElement.addEventListener("pointerup", pointerUp);
      renderer.domElement.addEventListener("pointercancel", pointerUp);
      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(mount);
      resize();
      build(0);
      animate(performance.now());

      dispose = () => {
        disposed = true;
        renderer.domElement.removeEventListener("pointerdown", pointerDown);
        renderer.domElement.removeEventListener("pointermove", pointerMove);
        renderer.domElement.removeEventListener("pointerup", pointerUp);
        renderer.domElement.removeEventListener("pointercancel", pointerUp);
        resizeObserver.disconnect();
        renderer.dispose();
        if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
      };
    }

    initialize();
    return () => dispose();
  }, [tone]);

  useEffect(() => {
    if (engine.current) {
      engine.current.trajectory = trajectory;
      engine.current.predict();
    }
  }, [trajectory]);

  useEffect(() => {
    if (engine.current) {
      engine.current.vectors = vectors;
      engine.current.rebuildField();
    }
  }, [vectors]);

  useEffect(() => {
    if (engine.current) {
      engine.current.resize();
      engine.current.rebuildField();
    }
  }, [viewportMode]);

  const chooseMission = (index: number) => {
    setResult(null);
    setOpenPanel(null);
    setMissionIndex(index);
    missionRef.current = index;
    setTargetId("A");
    targetRef.current = "A";
    statusRef.current = "aiming";
    setStatus("AIMING");
    setHint(false);
    engine.current?.build(index);
    tone("click");
  };

  const chooseBase = (id: string) => {
    if (statusRef.current !== "aiming") return;
    setOpenPanel(null);
    setTargetId(id);
    targetRef.current = id;
    engine.current?.selectBase();
    engine.current?.predict();
    tone("click");
  };

  const retry = useCallback(() => {
    setResult(null);
    setOpenPanel(null);
    statusRef.current = "aiming";
    engine.current?.reset();
  }, []);

  useEffect(() => {
    const keyboard = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "r" && !introRef.current) retry();
      if (event.key === "Escape") {
        setResult(null);
        setLogOpen(false);
        setGuideOpen(false);
        setOpenPanel(null);
      }
    };
    addEventListener("keydown", keyboard);
    return () => removeEventListener("keydown", keyboard);
  }, [retry]);

  return (
    <main className={`game-shell viewport-${viewportMode}`}>
      <div className="nebula nebula-one" />
      <div className="nebula nebula-two" />

      {intro && (
        <section className="prologue" aria-label="Mission prologue">
          <div className="prologue-art" aria-hidden="true" />
          <div className="prologue-shade" aria-hidden="true" />
          <button className="skip-intro" onClick={closeIntro}>SKIP TRANSMISSION</button>
          <div className="story-window">
            <p className="eyebrow">ARCHIVE // 27 OCTOBER 2300</p>
            <h1>HUMANITY<br />OUTGREW THE SKY.</h1>
            <div className="story-copy">
              <p>Across six star systems, our bases became small islands in a very large dark.</p>
              <p>Every launch is bent by worlds, suns, and forces no engine can ignore.</p>
              <p>When crews lose their final burn, one navigator brings them home.</p>
            </div>
            <div className="role-stamp"><span>YOUR CALLSIGN</span><strong>ORBIT MASTER</strong></div>
            <button className="primary-button begin-button" onClick={closeIntro}>ACCEPT RETURN-TO-BASE COMMAND <span>→</span></button>
          </div>
          <p className="prologue-caption">A FRONTIER RESCUE COMMAND STORY</p>
        </section>
      )}

      <div className={`hud ${intro ? "hud-hidden" : ""}`}>
        <header className="topbar">
          <div className="brand">
            <div className="brand-mark"><span>OM</span></div>
            <div><p>ORBIT MASTER</p><strong>RETURN TO BASE</strong></div>
          </div>
          <nav className="mission-tabs" aria-label="Mission selection">
            {MISSIONS.map((item, index) => (
              <button key={item.id} className={index === missionIndex ? "active" : ""} onClick={() => chooseMission(index)} aria-label={`Mission ${item.id}: ${item.system}`}>
                <span>{String(item.id).padStart(2, "0")}</span><small>{item.sector}</small>
              </button>
            ))}
          </nav>
          <div className="compact-mission-control">
            <button onClick={() => chooseMission((missionIndex + MISSIONS.length - 1) % MISSIONS.length)} aria-label="Previous mission">‹</button>
            <label>
              <span className="sr-only">Current mission</span>
              <select value={missionIndex} onChange={(event) => chooseMission(Number(event.target.value))}>
                {MISSIONS.map((item, index) => <option key={item.id} value={index}>{String(item.id).padStart(2, "0")} · {item.sector}</option>)}
              </select>
            </label>
            <button onClick={() => chooseMission((missionIndex + 1) % MISSIONS.length)} aria-label="Next mission">›</button>
          </div>
          <div className="header-actions">
            <div className="score-chip"><span>COMMAND SCORE</span><strong>{score.toLocaleString()}</strong></div>
            <button className="icon-button" onClick={() => setGuideOpen(true)} aria-label="Open flight guide">?</button>
            <button className="compact-button" onClick={() => setLogOpen(true)} aria-label="Open flight log"><span className="log-label">FLIGHT LOG</span><span className="log-glyph">LOG</span></button>
          </div>
        </header>

        <div className="play-layout">
          {openPanel && viewportMode !== "wide" && <button className="panel-scrim" onClick={() => setOpenPanel(null)} aria-label="Close information panel" />}

          <aside className={`briefing-panel panel ${openPanel === "mission" ? "panel-open" : ""}`} aria-hidden={viewportMode !== "wide" && openPanel !== "mission"}>
            <button className="panel-close" onClick={() => setOpenPanel(null)} aria-label="Close mission briefing">×</button>
            <div className="panel-kicker"><span>MISSION {String(mission.id).padStart(2, "0")}</span><em>{mission.concept}</em></div>
            <p className="system-name">{mission.system}</p>
            <h2>{mission.title}</h2>
            <p className="mission-brief">{mission.brief}</p>
            <div className="formula-chip"><span>FLIGHT PRINCIPLE</span>{mission.formula}</div>
            <div className="source-list">
              <p className="section-label">ACTIVE GRAVITY WELLS</p>
              {mission.sources.map((source) => (
                <div className="source-row" key={source.name}>
                  <span className="source-orb" style={{ background: hex(source.color) }} />
                  <strong>{source.name}</strong>
                  <small>μ {source.mu.toFixed(1)} · r {source.radius.toFixed(2)}</small>
                </div>
              ))}
            </div>
            <button className="hint-toggle" onClick={() => setHint(!hint)}><span>CO-PILOT NOTE</span><b>{hint ? "−" : "+"}</b></button>
            {hint && <p className="hint-copy">{mission.hint}</p>}
          </aside>

          <section className="arena-shell" aria-label="Orbital rescue arena">
            <div ref={mountRef} className="space-stage" aria-label="Three-dimensional orbital rescue scene" />
            <div className="arena-panel-controls">
              <button className="arena-panel-button mission-button" onClick={() => setOpenPanel(openPanel === "mission" ? null : "mission")} aria-expanded={openPanel === "mission"}>
                <span>MISSION</span><strong>{String(mission.id).padStart(2, "0")}</strong>
              </button>
              <button className="arena-panel-button bases-button" onClick={() => setOpenPanel(openPanel === "bases" ? null : "bases")} aria-expanded={openPanel === "bases"}>
                <span>RETURN BASE</span><strong>{targetId}</strong>
              </button>
            </div>
            {status === "AIMING" && <div className="launch-callout"><span className="ship-pulse">◆</span><div><strong>DRAG SHUTTLE BACK</strong><small>Release to launch · short guide only</small></div></div>}
            <div className="field-legend" aria-hidden={!vectors}><span>G-FIELD</span><i /><small>WEAK</small><b /><small>STRONG</small></div>
          </section>

          <aside className={`target-panel panel ${openPanel === "bases" ? "panel-open" : ""}`} aria-hidden={viewportMode !== "wide" && openPanel !== "bases"}>
            <button className="panel-close" onClick={() => setOpenPanel(null)} aria-label="Close docking manifest">×</button>
            <div className="target-heading">
              <div><p className="section-label">CHOOSE RETURN BASE</p><h3>Docking manifest</h3></div>
              <span className="live-pill"><i /> LIVE</span>
            </div>
            <div className="target-list">
              {mission.bases.map((base) => (
                <button key={base.id} className={`target-card ${base.id === targetId ? "selected" : ""}`} onClick={() => chooseBase(base.id)} disabled={status !== "AIMING"}>
                  <span className="target-id" style={{ color: hex(base.color) }}>{base.id}</span>
                  <span className="target-copy"><strong>{base.name}</strong><small>{base.role} · {base.crew} crew</small></span>
                  <span className="target-stats"><strong>{maxScore(base).toLocaleString()}</strong><small>MAX PTS</small></span>
                  <span className="difficulty-tag">{difficulty(base.radius)} · Ø {(base.radius * 2).toFixed(2)}</span>
                </button>
              ))}
            </div>
            <div className="score-explainer">
              <p className="section-label">HOW THIS BASE SCORES</p>
              <div><span>Dock secured</span><strong>+{target.base.toLocaleString()}</strong></div>
              <div><span>Precision, up to</span><strong>+{target.precision}</strong></div>
              <div><span>Fuel saved, up to</span><strong>+{target.fuel}</strong></div>
              <div><span>Assigned route</span><strong>+300</strong></div>
            </div>
          </aside>
        </div>

        <footer className="telemetry-bar panel">
          <div className={`status-block status-${status.toLowerCase().replace(" ", "-")}`}><i /><span>FLIGHT STATE</span><strong>{status}</strong></div>
          <div className="telemetry-item"><span>VELOCITY</span><strong>{telemetry.speed.toFixed(2)}</strong><small>u/s</small></div>
          <div className="telemetry-item"><span>GRAVITY</span><strong>{telemetry.gravity.toFixed(2)}</strong><small>u/s²</small></div>
          <div className="telemetry-item"><span>CLOSEST PASS</span><strong>{telemetry.distance}</strong><small>u</small></div>
          <div className="telemetry-item"><span>FLIGHT TIME</span><strong>{telemetry.time.toFixed(1)}</strong><small>s</small></div>
          <div className="toggle-cluster">
            <label><input type="checkbox" checked={trajectory} onChange={(event) => setTrajectory(event.target.checked)} /><span data-short="PATH">SHORT GUIDE</span></label>
            <label><input type="checkbox" checked={vectors} onChange={(event) => setVectors(event.target.checked)} /><span data-short="FIELD">G-FIELD</span></label>
            <label><input type="checkbox" checked={sound} onChange={(event) => setSound(event.target.checked)} /><span data-short="SND">SOUND</span></label>
          </div>
          <button className="reset-button" onClick={retry}>RESET <kbd>R</kbd></button>
        </footer>
      </div>

      {result && (
        <div className="modal-backdrop">
          <section className={`result-card ${result.ok ? "success" : "failure"}`}>
            <p className="eyebrow">{result.ok ? "RETURN CONFIRMED" : "TRAJECTORY LOST"}</p>
            <div className="result-emblem">{result.ok ? "✓" : "×"}</div>
            <h2>{result.title}</h2><p>{result.copy}</p>
            {result.ok && <div className="result-score">
              <div><span>FLIGHT SCORE</span><strong>{result.score.toLocaleString()}</strong></div>
              <div><span>DOCK PRECISION</span><strong>{result.precision}%</strong></div>
              <div><span>FUEL EFFICIENCY</span><strong>{result.fuel}%</strong></div>
            </div>}
            <div className="result-actions">
              <button className="secondary-button" onClick={retry}>ADJUST & RETRY</button>
              <button className="primary-button" onClick={() => chooseMission((missionIndex + 1) % MISSIONS.length)}>{result.ok ? "NEXT RESCUE" : "TRY NEXT SYSTEM"} <span>→</span></button>
            </div>
          </section>
        </div>
      )}

      {logOpen && (
        <div className="modal-backdrop">
          <section className="manifest-card">
            <div className="modal-header"><div><p className="eyebrow">COMMAND ARCHIVE</p><h2>Return-to-base flight log</h2></div><button className="icon-button" onClick={() => setLogOpen(false)}>×</button></div>
            <div className="manifest-score"><span>TOTAL COMMAND SCORE</span><strong>{score.toLocaleString()}</strong></div>
            {logs.length === 0 ? <div className="empty-log"><span>◌</span><p>No flight records yet.</p><small>Launch a shuttle to begin the archive.</small></div> :
              <div className="log-table">
                <div className="log-row log-head"><span>System</span><span>Base</span><span>Result</span><span>Speed</span><span>Score</span></div>
                {logs.map((entry, index) => <div className="log-row" key={`${entry.system}-${index}`}><span>{entry.system}</span><strong>{entry.base}</strong><span>{entry.result}</span><span>{entry.speed.toFixed(2)} u/s</span><b>{entry.score.toLocaleString()}</b></div>)}
              </div>}
          </section>
        </div>
      )}

      {guideOpen && (
        <div className="modal-backdrop">
          <section className="guide-card">
            <div className="modal-header"><div><p className="eyebrow">PILOT QUICKSTART</p><h2>Bring every crew home</h2></div><button className="icon-button" onClick={() => setGuideOpen(false)}>×</button></div>
            <div className="guide-steps">
              <div><span>01</span><p><strong>Pick a base.</strong> Large bases are safer. Small bases pay far more.</p></div>
              <div><span>02</span><p><strong>Drag the shuttle backward.</strong> Direction sets angle; distance sets launch speed.</p></div>
              <div><span>03</span><p><strong>Read only the first moments.</strong> The amber guide is deliberately short—gravity must be judged, not traced.</p></div>
              <div><span>04</span><p><strong>Use the worlds.</strong> A close flyby bends the route more, but touching any gravity source aborts the approach.</p></div>
            </div>
            <button className="primary-button" onClick={() => setGuideOpen(false)}>RETURN TO COMMAND</button>
          </section>
        </div>
      )}
    </main>
  );
}
