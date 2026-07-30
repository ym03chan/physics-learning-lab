import { a as require_react, o as __toESM, t as require_jsx_runtime } from "../index.js";
//#region app/OrbitGame.tsx
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var import_jsx_runtime = require_jsx_runtime();
var MAX_PULL = 2.6;
function missionBounds(mission) {
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
		const visualRadius = base.radius + .5;
		minX = Math.min(minX, base.position.x - visualRadius);
		maxX = Math.max(maxX, base.position.x + visualRadius);
		minY = Math.min(minY, base.position.y - visualRadius);
		maxY = Math.max(maxY, base.position.y + visualRadius);
	}
	return {
		minX: minX - .25,
		maxX: maxX + .25,
		minY: minY - .25,
		maxY: maxY + .25
	};
}
function fitMissionCamera(mission, width, height, insets) {
	const bounds = missionBounds(mission);
	const safeWidth = Math.max(1, width - insets.left - insets.right);
	const safeHeight = Math.max(1, height - insets.top - insets.bottom);
	const aspect = width / Math.max(height, 1);
	const contentWidth = bounds.maxX - bounds.minX;
	const contentHeight = bounds.maxY - bounds.minY;
	const halfHeight = Math.max(contentHeight * .5 * height / safeHeight, contentWidth * .5 * width / safeWidth / aspect) * 1.035;
	const halfWidth = halfHeight * aspect;
	const contentCenterX = (bounds.minX + bounds.maxX) * .5;
	const contentCenterY = (bounds.minY + bounds.maxY) * .5;
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
		centerY
	};
}
function getViewportMode(width, height, coarse) {
	if (coarse || width <= 820) return "touch";
	if (width >= 1440 && height >= 760) return "wide";
	return "compact";
}
var makeBases = (names, roles, positions, crew, scores, colors) => [
	{
		id: "A",
		name: names[0],
		role: roles[0],
		position: positions[0],
		radius: .62,
		shape: "harbor",
		par: 4.65,
		base: scores[0],
		precision: 350,
		fuel: 300,
		crew: crew[0],
		color: colors[0]
	},
	{
		id: "B",
		name: names[1],
		role: roles[1],
		position: positions[1],
		radius: .34,
		shape: "citadel",
		par: 4.3,
		base: scores[1],
		precision: 550,
		fuel: 450,
		crew: crew[1],
		color: colors[1]
	},
	{
		id: "C",
		name: names[2],
		role: roles[2],
		position: positions[2],
		radius: .19,
		shape: "needle",
		par: 4.05,
		base: scores[2],
		precision: 800,
		fuel: 650,
		crew: crew[2],
		color: colors[2]
	}
];
var MISSIONS = [
	{
		id: 1,
		system: "SOL // LUNAR REACH",
		sector: "HOME SYSTEM",
		title: "The Last Ten Thousand Kilometres",
		brief: "Courier Astra-12 reached the Moon, but a reactor fault killed final-approach control. Bring its six crew home.",
		concept: "VECTOR CONTROL",
		hint: "Selene is a gentle first return. Pull opposite the harbor and release once the short guidance arc meets its beacon.",
		formula: "launch velocity = direction × pull",
		start: {
			x: -5.4,
			y: -.4
		},
		sources: [{
			name: "Luna",
			position: {
				x: .1,
				y: -1.15
			},
			mu: 4.5,
			radius: .58,
			look: "ice",
			color: 12109785
		}, {
			name: "Earth",
			position: {
				x: 2.7,
				y: 2.65
			},
			mu: 1.2,
			radius: .38,
			look: "ocean",
			color: 2920447
		}],
		bases: makeBases([
			"Selene Harbor",
			"Tycho Citadel",
			"Far-Side Needle"
		], [
			"CIVILIAN",
			"COMMAND",
			"SCIENCE"
		], [
			{
				x: 4.65,
				y: -1.35
			},
			{
				x: 4.95,
				y: .3
			},
			{
				x: 4.35,
				y: 1.85
			}
		], [
			42,
			18,
			3
		], [
			800,
			1300,
			2050
		], [
			7401727,
			16763504,
			16743324
		])
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
		start: {
			x: -5.35,
			y: .8
		},
		sources: [{
			name: "Mars",
			position: {
				x: 0,
				y: -1
			},
			mu: 5.8,
			radius: .68,
			look: "rust",
			color: 14244918
		}, {
			name: "Phobos",
			position: {
				x: 1.55,
				y: 1.55
			},
			mu: .65,
			radius: .2,
			look: "ice",
			color: 9273719
		}],
		bases: makeBases([
			"Redhaven Port",
			"Ares Fuel Crown",
			"Valles Watch"
		], [
			"CIVILIAN",
			"DEPOT",
			"OUTPOST"
		], [
			{
				x: 4.7,
				y: -1.8
			},
			{
				x: 4.95,
				y: -.05
			},
			{
				x: 4.2,
				y: 1.75
			}
		], [
			116,
			16,
			4
		], [
			900,
			1450,
			2200
		], [
			16753519,
			16766062,
			7854335
		])
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
		start: {
			x: -5.25,
			y: -2.15
		},
		sources: [{
			name: "Jupiter",
			position: {
				x: -.05,
				y: -.25
			},
			mu: 8.8,
			radius: .9,
			look: "gas",
			color: 14263916
		}, {
			name: "Europa",
			position: {
				x: 2.15,
				y: 1.15
			},
			mu: 1.1,
			radius: .28,
			look: "ice",
			color: 12313327
		}],
		bases: makeBases([
			"Callisto Haven",
			"Galileo Crown",
			"Io Survey Spire"
		], [
			"SANCTUARY",
			"ORBITAL",
			"SCIENCE"
		], [
			{
				x: 4.75,
				y: -1.9
			},
			{
				x: 4.65,
				y: .05
			},
			{
				x: 3.65,
				y: 2.35
			}
		], [
			204,
			29,
			5
		], [
			1050,
			1600,
			2400
		], [
			11924704,
			16767365,
			16747379
		])
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
		start: {
			x: -5.4,
			y: 0
		},
		sources: [{
			name: "Kepler A",
			position: {
				x: .15,
				y: 1.38
			},
			mu: 5,
			radius: .54,
			look: "star",
			color: 16765802
		}, {
			name: "Kepler B",
			position: {
				x: .42,
				y: -1.42
			},
			mu: 5.6,
			radius: .49,
			look: "star",
			color: 16742992
		}],
		bases: makeBases([
			"Pilgrim Anchorage",
			"Twinlight Hub",
			"Corona Relay"
		], [
			"COLONY",
			"CAPITAL",
			"WEATHER"
		], [
			{
				x: 4.8,
				y: -1.75
			},
			{
				x: 5,
				y: .05
			},
			{
				x: 4.4,
				y: 1.9
			}
		], [
			328,
			91,
			7
		], [
			1150,
			1800,
			2600
		], [
			8254166,
			8970239,
			16762222
		]).map((base, index) => index === 2 ? {
			...base,
			shape: "relay"
		} : base)
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
		start: {
			x: -5.05,
			y: -2.35
		},
		sources: [{
			name: "Saturn",
			position: {
				x: 0,
				y: 0
			},
			mu: 8.1,
			radius: .78,
			look: "ringed",
			color: 15059080
		}, {
			name: "Titan",
			position: {
				x: 2.45,
				y: -1.55
			},
			mu: 1.35,
			radius: .32,
			look: "rust",
			color: 14000199
		}],
		bases: makeBases([
			"Titan Commons",
			"Cassini Terminal",
			"Enceladus Needle"
		], [
			"HABITAT",
			"TRANSIT",
			"CRYOLAB"
		], [
			{
				x: 4.7,
				y: -2
			},
			{
				x: 4.65,
				y: .05
			},
			{
				x: 2.95,
				y: 2.65
			}
		], [
			512,
			37,
			6
		], [
			1250,
			2e3,
			2900
		], [
			16760162,
			8185855,
			12842495
		])
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
		start: {
			x: -5.25,
			y: -1.65
		},
		sources: [{
			name: "Blackwater",
			position: {
				x: .15,
				y: .05
			},
			mu: 5.1,
			radius: .5,
			look: "void",
			color: 7036159
		}, {
			name: "Nomad",
			position: {
				x: 0,
				y: 0
			},
			mu: 3.4,
			radius: .4,
			look: "ocean",
			color: 2672843,
			orbit: {
				center: {
					x: .45,
					y: 0
				},
				radius: 1.65,
				speed: .34,
				phase: -1
			}
		}],
		bases: makeBases([
			"Pathfinder Refuge",
			"Blackwater Citadel",
			"Edge Beacon"
		], [
			"RESCUE",
			"COMMAND",
			"LAST LIGHT"
		], [
			{
				x: 4.75,
				y: -1.7
			},
			{
				x: 4.75,
				y: .15
			},
			{
				x: 3.9,
				y: 2.4
			}
		], [
			81,
			19,
			2
		], [
			1400,
			2250,
			3350
		], [
			7925967,
			11115775,
			16747966
		]).map((base, index) => index === 2 ? {
			...base,
			shape: "relay",
			radius: .14
		} : base)
	}
];
var clamp = (value, min, max) => Math.max(min, Math.min(max, value));
var maxScore = (base) => base.base + base.precision + base.fuel + 300;
var difficulty = (radius) => radius >= .58 ? "FORGIVING" : radius >= .28 ? "EXPERT" : "PRECISION";
var hex = (color) => `#${color.toString(16).padStart(6, "0")}`;
function sourcePosition(source, time) {
	if (!source.orbit) return source.position;
	const angle = source.orbit.phase + source.orbit.speed * time;
	return {
		x: source.orbit.center.x + Math.cos(angle) * source.orbit.radius,
		y: source.orbit.center.y + Math.sin(angle) * source.orbit.radius
	};
}
function gravity(position, mission, time) {
	let x = 0;
	let y = 0;
	for (const source of mission.sources) {
		const center = sourcePosition(source, time);
		const dx = center.x - position.x;
		const dy = center.y - position.y;
		const distanceSq = Math.max(dx * dx + dy * dy, source.radius * source.radius * .72);
		const distance = Math.sqrt(distanceSq);
		const force = .92 * source.mu / distanceSq;
		x += dx / distance * force;
		y += dy / distance * force;
	}
	return {
		x,
		y
	};
}
function integrate(state, mission, dt) {
	const a = gravity(state, mission, state.time);
	const x = state.x + state.vx * dt + a.x * dt * dt * .5;
	const y = state.y + state.vy * dt + a.y * dt * dt * .5;
	const b = gravity({
		x,
		y
	}, mission, state.time + dt);
	return {
		x,
		y,
		vx: state.vx + (a.x + b.x) * .5 * dt,
		vy: state.vy + (a.y + b.y) * .5 * dt,
		time: state.time + dt
	};
}
function OrbitGame() {
	const mountRef = (0, import_react.useRef)(null);
	const engine = (0, import_react.useRef)(null);
	const introRef = (0, import_react.useRef)(true);
	const missionRef = (0, import_react.useRef)(0);
	const targetRef = (0, import_react.useRef)("A");
	const statusRef = (0, import_react.useRef)("aiming");
	const flightRef = (0, import_react.useRef)({
		x: -5.4,
		y: -.4,
		vx: 0,
		vy: 0,
		time: 0
	});
	const launchRef = (0, import_react.useRef)({
		x: 0,
		y: 0
	});
	const logsRef = (0, import_react.useRef)([]);
	const totalRef = (0, import_react.useRef)(0);
	const soundRef = (0, import_react.useRef)(true);
	const viewportRef = (0, import_react.useRef)("compact");
	const [intro, setIntro] = (0, import_react.useState)(true);
	const [viewportMode, setViewportMode] = (0, import_react.useState)("compact");
	const [openPanel, setOpenPanel] = (0, import_react.useState)(null);
	const [missionIndex, setMissionIndex] = (0, import_react.useState)(0);
	const [targetId, setTargetId] = (0, import_react.useState)("A");
	const [status, setStatus] = (0, import_react.useState)("AIMING");
	const [telemetry, setTelemetry] = (0, import_react.useState)({
		speed: 0,
		gravity: 0,
		time: 0,
		distance: "—"
	});
	const [result, setResult] = (0, import_react.useState)(null);
	const [hint, setHint] = (0, import_react.useState)(false);
	const [logOpen, setLogOpen] = (0, import_react.useState)(false);
	const [guideOpen, setGuideOpen] = (0, import_react.useState)(false);
	const [trajectory, setTrajectory] = (0, import_react.useState)(true);
	const [vectors, setVectors] = (0, import_react.useState)(true);
	const [sound, setSound] = (0, import_react.useState)(true);
	const [score, setScore] = (0, import_react.useState)(0);
	const [logs, setLogs] = (0, import_react.useState)([]);
	const mission = MISSIONS[missionIndex];
	const target = mission.bases.find((base) => base.id === targetId) ?? mission.bases[0];
	const closeIntro = () => {
		introRef.current = false;
		setIntro(false);
		requestAnimationFrame(() => {
			(mountRef.current?.closest(".game-shell"))?.scrollTo({
				top: 0,
				left: 0
			});
		});
	};
	(0, import_react.useEffect)(() => {
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
	const tone = (0, import_react.useCallback)((kind) => {
		if (!soundRef.current || typeof window === "undefined") return;
		const Audio = window.AudioContext || window.webkitAudioContext;
		if (!Audio) return;
		const context = new Audio();
		const oscillator = context.createOscillator();
		const gain = context.createGain();
		const config = {
			launch: [
				150,
				520,
				.22
			],
			success: [
				460,
				920,
				.4
			],
			crash: [
				180,
				52,
				.42
			],
			click: [
				320,
				370,
				.07
			]
		}[kind];
		oscillator.connect(gain);
		gain.connect(context.destination);
		oscillator.type = kind === "crash" ? "sawtooth" : kind === "success" ? "triangle" : "sine";
		oscillator.frequency.setValueAtTime(config[0], context.currentTime);
		oscillator.frequency.exponentialRampToValueAtTime(config[1], context.currentTime + config[2]);
		gain.gain.setValueAtTime(kind === "click" ? .03 : .085, context.currentTime);
		gain.gain.exponentialRampToValueAtTime(1e-4, context.currentTime + config[2]);
		oscillator.start();
		oscillator.stop(context.currentTime + config[2]);
	}, []);
	(0, import_react.useEffect)(() => {
		soundRef.current = sound;
	}, [sound]);
	(0, import_react.useEffect)(() => {
		let disposed = false;
		let dispose = () => {};
		async function initialize() {
			const THREE = await import("./three.module-BDPZr46Y.js");
			if (disposed || !mountRef.current) return;
			const mount = mountRef.current;
			const scene = new THREE.Scene();
			scene.fog = new THREE.FogExp2(132619, .022);
			const camera = new THREE.OrthographicCamera(-7, 7, 4, -4, .1, 100);
			camera.position.z = 12;
			const renderer = new THREE.WebGLRenderer({
				antialias: true,
				alpha: true
			});
			renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
			renderer.outputColorSpace = THREE.SRGBColorSpace;
			renderer.toneMapping = THREE.ACESFilmicToneMapping;
			renderer.toneMappingExposure = 1.15;
			renderer.domElement.className = "space-canvas";
			mount.appendChild(renderer.domElement);
			scene.add(new THREE.AmbientLight(8235212, 1.2));
			const key = new THREE.DirectionalLight(16777215, 2.5);
			key.position.set(-3, 4, 8);
			scene.add(key);
			const rim = new THREE.DirectionalLight(3234047, 1.15);
			rim.position.set(6, -3, 4);
			scene.add(rim);
			const starGeo = new THREE.BufferGeometry();
			const starPos = new Float32Array(1500 * 3);
			const starColors = new Float32Array(1500 * 3);
			for (let i = 0; i < 1500; i += 1) {
				starPos[i * 3] = (Math.random() - .5) * 44;
				starPos[i * 3 + 1] = (Math.random() - .5) * 26;
				starPos[i * 3 + 2] = -3 - Math.random() * 14;
				const tint = .68 + Math.random() * .32;
				starColors[i * 3] = tint;
				starColors[i * 3 + 1] = tint * .92;
				starColors[i * 3 + 2] = 1;
			}
			starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
			starGeo.setAttribute("color", new THREE.BufferAttribute(starColors, 3));
			const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({
				size: .038,
				vertexColors: true,
				transparent: true,
				opacity: .84
			}));
			scene.add(stars);
			const world = new THREE.Group();
			const field = new THREE.Group();
			scene.add(world, field);
			const textureCache = /* @__PURE__ */ new Map();
			const material = (color, selected = false, emissive = color, roughness = .4, metalness = .68) => new THREE.MeshStandardMaterial({
				color,
				emissive,
				emissiveIntensity: selected ? 1.05 : .2,
				roughness,
				metalness
			});
			function seededRandom(seedText) {
				let seed = 2166136261;
				for (let i = 0; i < seedText.length; i += 1) {
					seed ^= seedText.charCodeAt(i);
					seed = Math.imul(seed, 16777619);
				}
				return () => {
					seed += 1831565813;
					let value = seed;
					value = Math.imul(value ^ value >>> 15, value | 1);
					value ^= value + Math.imul(value ^ value >>> 7, value | 61);
					return ((value ^ value >>> 14) >>> 0) / 4294967296;
				};
			}
			function surfaceTexture(source) {
				const key = `${source.name}-${source.look}-${source.color}`;
				if (textureCache.has(key)) return textureCache.get(key);
				const canvas = document.createElement("canvas");
				canvas.width = viewportRef.current === "touch" ? 384 : 512;
				canvas.height = canvas.width / 2;
				const context = canvas.getContext("2d");
				const random = seededRandom(key);
				const width = canvas.width;
				const height = canvas.height;
				const palette = {
					ocean: [
						"#082d61",
						"#0d6e9d",
						"#25a9b8",
						"#7bbf88",
						"#d8d4a2"
					],
					rust: [
						"#3c1713",
						"#7d2d20",
						"#bd5835",
						"#e38a58",
						"#54201b"
					],
					gas: [
						"#4b2d29",
						"#936044",
						"#e3ba86",
						"#f4ddbd",
						"#704235"
					],
					star: [
						"#d13d16",
						"#ff7b21",
						"#ffd563",
						"#fff2b0",
						"#a91b0f"
					],
					ice: [
						"#263b57",
						"#7394b5",
						"#bfd3e2",
						"#eef8ff",
						"#536f91"
					],
					ringed: [
						"#55442e",
						"#9b8258",
						"#d9c493",
						"#f0dfb8",
						"#6d5a3c"
					],
					void: [
						"#010106",
						"#09051b",
						"#1e0f45",
						"#3f2180",
						"#020107"
					]
				}[source.look];
				const gradient = context.createLinearGradient(0, 0, 0, height);
				palette.forEach((color, index) => gradient.addColorStop(index / (palette.length - 1), color));
				context.fillStyle = gradient;
				context.fillRect(0, 0, width, height);
				if (source.look === "gas" || source.look === "ringed" || source.look === "star") {
					for (let band = 0; band < 34; band += 1) {
						const y = random() * height;
						const bandHeight = 1 + random() * 12;
						context.fillStyle = palette[Math.floor(random() * palette.length)];
						context.globalAlpha = .12 + random() * .3;
						context.fillRect(0, y, width, bandHeight);
						context.globalAlpha = 1;
					}
					for (let storm = 0; storm < (source.look === "star" ? 42 : 9); storm += 1) {
						context.beginPath();
						context.ellipse(random() * width, random() * height, 8 + random() * 35, 2 + random() * 10, random() * Math.PI, 0, Math.PI * 2);
						context.fillStyle = palette[Math.floor(random() * palette.length)];
						context.globalAlpha = .18 + random() * .28;
						context.fill();
					}
				} else if (source.look === "ocean") {
					context.fillStyle = palette[3];
					for (let land = 0; land < 46; land += 1) {
						context.beginPath();
						context.ellipse(random() * width, random() * height, 7 + random() * 32, 3 + random() * 15, random() * Math.PI, 0, Math.PI * 2);
						context.globalAlpha = .3 + random() * .48;
						context.fill();
					}
					context.strokeStyle = "#e8fbff";
					context.lineCap = "round";
					for (let cloud = 0; cloud < 24; cloud += 1) {
						context.beginPath();
						context.moveTo(random() * width, random() * height);
						context.bezierCurveTo(random() * width, random() * height, random() * width, random() * height, random() * width, random() * height);
						context.globalAlpha = .12 + random() * .25;
						context.lineWidth = 1 + random() * 3;
						context.stroke();
					}
				} else {
					for (let crater = 0; crater < 90; crater += 1) {
						const radius = 1 + random() * (source.look === "ice" ? 9 : 13);
						context.beginPath();
						context.arc(random() * width, random() * height, radius, 0, Math.PI * 2);
						context.fillStyle = palette[Math.floor(random() * palette.length)];
						context.globalAlpha = .12 + random() * .34;
						context.fill();
						context.strokeStyle = "rgba(255,255,255,.2)";
						context.lineWidth = Math.max(.5, radius * .08);
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
							context.lineTo(x + (random() - .5) * 70, y + (random() - .5) * 42);
							context.lineTo(x + (random() - .5) * 110, y + (random() - .5) * 60);
							context.globalAlpha = .25 + random() * .35;
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
			function planet(source) {
				const group = new THREE.Group();
				group.userData.source = source;
				const segments = viewportRef.current === "touch" ? 32 : 48;
				const surface = new THREE.Mesh(new THREE.SphereGeometry(source.radius, segments, Math.max(20, segments / 1.5)), new THREE.MeshStandardMaterial({
					map: surfaceTexture(source),
					color: source.look === "void" ? 590868 : 16777215,
					emissive: source.look === "star" ? source.color : source.look === "void" ? 1509691 : 132875,
					emissiveIntensity: source.look === "star" ? 1.2 : source.look === "void" ? .7 : .08,
					roughness: source.look === "ice" ? .8 : source.look === "gas" ? .72 : .6,
					metalness: source.look === "void" ? .65 : .02
				}));
				group.add(surface);
				group.userData.surface = surface;
				if (source.look !== "void") {
					const atmosphere = new THREE.Mesh(new THREE.SphereGeometry(source.radius * 1.075, segments, Math.max(20, segments / 1.5)), new THREE.MeshBasicMaterial({
						color: source.look === "star" ? source.color : source.look === "rust" ? 16747091 : source.look === "ice" ? 11068671 : 5422568,
						transparent: true,
						opacity: source.look === "star" ? .17 : .1,
						blending: THREE.AdditiveBlending,
						side: THREE.BackSide,
						depthWrite: false
					}));
					group.add(atmosphere);
					group.userData.atmosphere = atmosphere;
				}
				if (source.look === "ringed") {
					const rings = new THREE.Mesh(new THREE.RingGeometry(source.radius * 1.28, source.radius * 2.15, 112), new THREE.MeshStandardMaterial({
						color: 14269826,
						emissive: 4863261,
						emissiveIntensity: .2,
						side: THREE.DoubleSide,
						transparent: true,
						opacity: .72,
						roughness: .88,
						depthWrite: false
					}));
					rings.rotation.set(.88, .22, .12);
					group.add(rings);
					group.userData.rings = rings;
				}
				if (source.look === "star") {
					group.add(new THREE.Mesh(new THREE.SphereGeometry(source.radius * 1.34, 28, 20), new THREE.MeshBasicMaterial({
						color: source.color,
						transparent: true,
						opacity: .1,
						side: THREE.BackSide,
						blending: THREE.AdditiveBlending
					})));
					group.add(new THREE.PointLight(source.color, 2.6, 8));
				}
				if (source.look === "void") {
					const disk = new THREE.Mesh(new THREE.RingGeometry(source.radius * 1.08, source.radius * 2.25, 112), new THREE.MeshBasicMaterial({
						color: 8084735,
						transparent: true,
						opacity: .52,
						side: THREE.DoubleSide,
						blending: THREE.AdditiveBlending,
						depthWrite: false
					}));
					disk.rotation.x = .96;
					group.add(disk);
					const hot = new THREE.Mesh(new THREE.TorusGeometry(source.radius * 1.32, source.radius * .1, 12, 96), new THREE.MeshBasicMaterial({
						color: 16755023,
						transparent: true,
						opacity: .86,
						blending: THREE.AdditiveBlending
					}));
					hot.rotation.x = .96;
					group.add(hot);
					group.userData.rings = disk;
				}
				return group;
			}
			function label(text, color) {
				const canvas = document.createElement("canvas");
				canvas.width = 320;
				canvas.height = 96;
				const context = canvas.getContext("2d");
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
				const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
					map: texture,
					transparent: true,
					depthTest: false
				}));
				sprite.scale.set(1.45, .44, 1);
				return sprite;
			}
			function station(base, selected) {
				const group = new THREE.Group();
				const rotors = [];
				group.userData = {
					base,
					rotors
				};
				const scale = Math.max(base.radius, .16);
				const bright = material(selected ? base.color : 8096924, selected, base.color, .31, .78);
				const hull = material(12372177, false, 1254193, .36, .82);
				const dark = material(1713713, false, 463130, .48, .76);
				const solar = material(1194843, false, 1343136, .25, .55);
				const zone = new THREE.Mesh(new THREE.RingGeometry(base.radius * .72, base.radius, 72), new THREE.MeshBasicMaterial({
					color: base.color,
					transparent: true,
					opacity: selected ? .22 : .055,
					side: THREE.DoubleSide,
					depthWrite: false
				}));
				zone.position.z = -.22;
				group.add(zone);
				const core = new THREE.Mesh(new THREE.CylinderGeometry(scale * .13, scale * .16, scale * .34, 16), hull);
				core.rotation.x = Math.PI / 2;
				group.add(core);
				if (base.shape === "harbor") {
					const rotor = new THREE.Group();
					rotor.add(new THREE.Mesh(new THREE.TorusGeometry(scale * .49, scale * .075, 12, 64), hull));
					rotor.add(new THREE.Mesh(new THREE.TorusGeometry(scale * .36, scale * .022, 8, 56), bright));
					for (let i = 0; i < 8; i += 1) {
						const spoke = new THREE.Mesh(new THREE.BoxGeometry(scale * .75, scale * .026, scale * .035), dark);
						spoke.rotation.z = Math.PI * i / 8;
						rotor.add(spoke);
					}
					group.add(rotor);
					rotors.push(rotor);
					const dock = new THREE.Mesh(new THREE.BoxGeometry(scale * .58, scale * .12, scale * .11), hull);
					dock.position.x = scale * .48;
					group.add(dock);
				} else if (base.shape === "relay") {
					const mast = new THREE.Mesh(new THREE.CylinderGeometry(scale * .035, scale * .055, scale * 1.08, 10), hull);
					group.add(mast);
					for (let i = 0; i < 3; i += 1) {
						const ring = new THREE.Mesh(new THREE.TorusGeometry(scale * (.22 + i * .1), scale * .024, 8, 40), bright);
						ring.rotation.set(.4 + i * .35, i * .7, 0);
						group.add(ring);
						rotors.push(ring);
					}
					[-1, 1].forEach((side) => {
						const panel = new THREE.Mesh(new THREE.BoxGeometry(scale * .4, scale * .18, scale * .025), solar);
						panel.position.x = side * scale * .34;
						group.add(panel);
					});
				} else if (base.shape === "needle") {
					const spine = new THREE.Mesh(new THREE.CylinderGeometry(scale * .035, scale * .09, scale * 1.5, 12), hull);
					spine.rotation.z = Math.PI / 2;
					group.add(spine);
					[-1, 1].forEach((side) => {
						const panel = new THREE.Mesh(new THREE.BoxGeometry(scale * .42, scale * .34, scale * .028), solar);
						panel.position.set(-scale * .12, side * scale * .31, 0);
						group.add(panel);
					});
					const dish = new THREE.Mesh(new THREE.ConeGeometry(scale * .2, scale * .12, 24, 1, true), bright);
					dish.position.x = scale * .62;
					dish.rotation.z = -Math.PI / 2;
					group.add(dish);
					rotors.push(dish);
				} else {
					const command = new THREE.Group();
					command.add(new THREE.Mesh(new THREE.IcosahedronGeometry(scale * .23, 1), hull));
					for (let i = 0; i < 4; i += 1) {
						const arm = new THREE.Group();
						const beam = new THREE.Mesh(new THREE.BoxGeometry(scale * .62, scale * .07, scale * .065), dark);
						beam.position.x = scale * .31;
						arm.add(beam);
						const pod = new THREE.Mesh(new THREE.BoxGeometry(scale * .22, scale * .16, scale * .13), hull);
						pod.position.x = scale * .62;
						arm.add(pod);
						const panel = new THREE.Mesh(new THREE.BoxGeometry(scale * .28, scale * .11, scale * .025), solar);
						panel.position.x = scale * .83;
						arm.add(panel);
						arm.rotation.z = Math.PI * i / 2;
						command.add(arm);
					}
					group.add(command);
					rotors.push(command);
				}
				const beacon = new THREE.Mesh(new THREE.SphereGeometry(scale * .055, 10, 8), bright);
				beacon.position.z = scale * .22;
				group.add(beacon);
				if (selected) group.add(new THREE.PointLight(base.color, 1.1, 1.8));
				const tag = label(`${base.id} · ${base.role}`, base.color);
				tag.position.set(0, base.radius + .42, .2);
				tag.scale.multiplyScalar(base.radius < .2 ? .72 : .88);
				group.add(tag);
				return group;
			}
			function shuttle() {
				const group = new THREE.Group();
				const white = material(15199728, false, 2439238, .3, .74);
				const graphite = material(2437178, false, 462873, .4, .82);
				const glass = material(3134961, true, 1489368, .12, .42);
				const orange = material(15104049, false, 5316874, .42, .72);
				const fuselage = new THREE.Mesh(new THREE.CylinderGeometry(.1, .13, .4, 24), white);
				fuselage.rotation.z = -Math.PI / 2;
				fuselage.position.x = -.02;
				group.add(fuselage);
				const nose = new THREE.Mesh(new THREE.ConeGeometry(.105, .2, 24), white);
				nose.rotation.z = -Math.PI / 2;
				nose.position.x = .28;
				group.add(nose);
				const cockpit = new THREE.Mesh(new THREE.SphereGeometry(.092, 20, 14), glass);
				cockpit.scale.set(1.25, .72, .6);
				cockpit.position.set(.12, 0, .065);
				group.add(cockpit);
				[-1, 1].forEach((side) => {
					const wing = new THREE.Mesh(new THREE.BoxGeometry(.27, .14, .025), white);
					wing.position.set(-.08, side * .145, -.015);
					wing.rotation.z = side * .18;
					group.add(wing);
					const tip = new THREE.Mesh(new THREE.BoxGeometry(.1, .045, .035), orange);
					tip.position.set(-.07, side * .235, 0);
					group.add(tip);
				});
				const flames = [];
				[-1, 1].forEach((side) => {
					const engineBell = new THREE.Mesh(new THREE.CylinderGeometry(.045, .062, .1, 16), graphite);
					engineBell.rotation.z = Math.PI / 2;
					engineBell.position.set(-.26, side * .065, 0);
					group.add(engineBell);
					const flame = new THREE.Mesh(new THREE.ConeGeometry(.045, .22, 14), new THREE.MeshBasicMaterial({
						color: side > 0 ? 5892095 : 16757855,
						transparent: true,
						opacity: .74,
						blending: THREE.AdditiveBlending,
						depthWrite: false
					}));
					flame.rotation.z = Math.PI / 2;
					flame.position.set(-.4, side * .065, 0);
					group.add(flame);
					flames.push(flame);
				});
				const nav = new THREE.Mesh(new THREE.SphereGeometry(.025, 10, 8), new THREE.MeshBasicMaterial({ color: 6616831 }));
				nav.position.set(.02, .23, .02);
				group.add(nav);
				const hitProxy = new THREE.Mesh(new THREE.SphereGeometry(.24, 12, 8), new THREE.MeshBasicMaterial({
					transparent: true,
					opacity: 0,
					depthWrite: false
				}));
				hitProxy.userData.interactionProxy = true;
				group.add(hitProxy);
				group.userData.flames = flames;
				group.scale.setScalar(1.08);
				return group;
			}
			const ship = shuttle();
			scene.add(ship);
			const trail = new THREE.Line(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({
				color: 6744831,
				transparent: true,
				opacity: .78
			}));
			const predictor = new THREE.Line(new THREE.BufferGeometry(), new THREE.LineDashedMaterial({
				color: 16763763,
				transparent: true,
				opacity: .74,
				dashSize: .11,
				gapSize: .1
			}));
			const pullLine = new THREE.Line(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({
				color: 16764784,
				transparent: true,
				opacity: .94
			}));
			scene.add(trail, predictor, pullLine);
			const state = {
				dragging: false,
				dragPoint: new THREE.Vector3(),
				trail: [],
				planets: [],
				bases: [],
				last: performance.now(),
				closest: Infinity,
				frame: 0,
				fieldUpdatedAt: 0
			};
			const clear = (group) => {
				while (group.children.length) group.remove(group.children[0]);
			};
			function buildField(active, time = 0) {
				field.traverse((item) => {
					item.geometry?.dispose?.();
					if (Array.isArray(item.material)) item.material.forEach((entry) => entry.dispose?.());
					else item.material?.dispose?.();
				});
				clear(field);
				if (!engine.current?.vectors) return;
				const mode = viewportRef.current;
				const columns = mode === "wide" ? 12 : mode === "compact" ? 10 : 8;
				const rows = mode === "wide" ? 7 : mode === "compact" ? 6 : 5;
				const bounds = missionBounds(active);
				const maxInstances = columns * rows;
				const shaftMaterial = new THREE.MeshBasicMaterial({
					color: 16777215,
					transparent: true,
					opacity: .27,
					depthWrite: false
				});
				const headMaterial = new THREE.MeshBasicMaterial({
					color: 16777215,
					transparent: true,
					opacity: .34,
					depthWrite: false
				});
				const shafts = new THREE.InstancedMesh(new THREE.CylinderGeometry(.012, .012, 1, 6), shaftMaterial, maxInstances);
				const heads = new THREE.InstancedMesh(new THREE.ConeGeometry(.05, .14, 7), headMaterial, maxInstances);
				const dummy = new THREE.Object3D();
				const color = new THREE.Color();
				const low = new THREE.Color(3969697);
				const high = new THREE.Color(16758877);
				let count = 0;
				for (let column = 0; column < columns; column += 1) {
					const x = bounds.minX + (column + .5) / columns * (bounds.maxX - bounds.minX);
					for (let row = 0; row < rows; row += 1) {
						const y = bounds.minY + (row + .5) / rows * (bounds.maxY - bounds.minY);
						if (active.sources.some((source) => {
							const center = sourcePosition(source, time);
							return Math.hypot(center.x - x, center.y - y) <= source.radius * 1.16;
						})) continue;
						const g = gravity({
							x,
							y
						}, active, time);
						const magnitude = Math.hypot(g.x, g.y);
						if (magnitude < .035) continue;
						const dx = g.x / magnitude;
						const dy = g.y / magnitude;
						const length = clamp(.13 + Math.log1p(magnitude) * .14, .17, .48);
						const angle = Math.atan2(dy, dx) - Math.PI / 2;
						const strength = clamp(Math.log1p(magnitude) / 2.6, 0, 1);
						color.copy(low).lerp(high, strength);
						dummy.position.set(x + dx * length * .48, y + dy * length * .48, -.34);
						dummy.rotation.set(0, 0, angle);
						dummy.scale.set(1, length * .78, 1);
						dummy.updateMatrix();
						shafts.setMatrixAt(count, dummy.matrix);
						shafts.setColorAt(count, color);
						dummy.position.set(x + dx * length, y + dy * length, -.34);
						dummy.scale.set(.75 + strength * .42, .75 + strength * .42, .75 + strength * .42);
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
				flightRef.current = {
					...active.start,
					vx: 0,
					vy: 0,
					time: 0
				};
				launchRef.current = {
					x: 0,
					y: 0
				};
				ship.position.set(active.start.x, active.start.y, .2);
				ship.rotation.z = 0;
				ship.visible = true;
				state.trail = [];
				state.closest = Infinity;
				trail.geometry.dispose();
				trail.geometry = new THREE.BufferGeometry();
				predictor.visible = false;
				pullLine.visible = false;
				setStatus("AIMING");
				setTelemetry({
					speed: 0,
					gravity: 0,
					time: 0,
					distance: "—"
				});
			}
			function build(index) {
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
							return new THREE.Vector3(source.orbit.center.x + Math.cos(angle) * source.orbit.radius, source.orbit.center.y + Math.sin(angle) * source.orbit.radius, -.25);
						});
						world.add(new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(points), new THREE.LineBasicMaterial({
							color: 5464956,
							transparent: true,
							opacity: .25
						})));
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
				MISSIONS[missionRef.current].bases.forEach((base, index) => {
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
				if (Math.hypot(launchRef.current.x, launchRef.current.y) < .18) {
					predictor.visible = false;
					return;
				}
				const active = MISSIONS[missionRef.current];
				let sample = {
					...active.start,
					vx: launchRef.current.x,
					vy: launchRef.current.y,
					time: 0
				};
				const points = [new THREE.Vector3(sample.x, sample.y, .06)];
				for (let i = 0; i < 76; i += 1) {
					sample = integrate(sample, active, .026);
					if (i % 3 === 0) points.push(new THREE.Vector3(sample.x, sample.y, .06));
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
			function point(event) {
				const rect = renderer.domElement.getBoundingClientRect();
				return new THREE.Vector3((event.clientX - rect.left) / rect.width * 2 - 1, -(event.clientY - rect.top) / rect.height * 2 + 1, 0).unproject(camera);
			}
			function pointerDown(event) {
				if (statusRef.current !== "aiming" || introRef.current) return;
				const p = point(event);
				const start = MISSIONS[missionRef.current].start;
				const rect = renderer.domElement.getBoundingClientRect();
				const worldPerPixel = (camera.right - camera.left) / Math.max(rect.width, 1);
				const minimumPixels = viewportRef.current === "touch" ? 44 : 28;
				const hitRadius = Math.max(.34, worldPerPixel * minimumPixels);
				if (Math.hypot(p.x - start.x, p.y - start.y) > hitRadius) return;
				setOpenPanel(null);
				state.dragging = true;
				renderer.domElement.setPointerCapture(event.pointerId);
			}
			function pointerMove(event) {
				if (!state.dragging) return;
				const p = point(event);
				const start = MISSIONS[missionRef.current].start;
				const dx = start.x - p.x;
				const dy = start.y - p.y;
				const length = Math.hypot(dx, dy);
				const scale = length > MAX_PULL ? MAX_PULL / length : 1;
				state.dragPoint.set(start.x - dx * scale, start.y - dy * scale, .05);
				launchRef.current = {
					x: dx * scale * 1.75,
					y: dy * scale * 1.75
				};
				pullLine.geometry.dispose();
				pullLine.geometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(start.x, start.y, .04), state.dragPoint]);
				pullLine.visible = true;
				predict();
				setTelemetry((current) => ({
					...current,
					speed: Math.hypot(launchRef.current.x, launchRef.current.y)
				}));
			}
			function pointerUp(event) {
				if (!state.dragging) return;
				state.dragging = false;
				renderer.domElement.releasePointerCapture(event.pointerId);
				pullLine.visible = false;
				if (Math.hypot(launchRef.current.x, launchRef.current.y) < .34) {
					launchRef.current = {
						x: 0,
						y: 0
					};
					predict();
					return;
				}
				flightRef.current = {
					...MISSIONS[missionRef.current].start,
					vx: launchRef.current.x,
					vy: launchRef.current.y,
					time: 0
				};
				statusRef.current = "flying";
				predictor.visible = false;
				setStatus("IN FLIGHT");
				tone("launch");
			}
			function win(base, distance) {
				if (statusRef.current !== "flying") return;
				statusRef.current = "result";
				const speed = Math.hypot(launchRef.current.x, launchRef.current.y);
				const precisionRatio = clamp(1 - distance / base.radius, 0, 1);
				const efficiencyRatio = clamp((base.par * 1.22 - speed) / (base.par * .32), 0, 1);
				const score = base.base + Math.round(base.precision * precisionRatio) + Math.round(base.fuel * efficiencyRatio) + (base.id === targetRef.current ? 300 : 0);
				totalRef.current += score;
				logsRef.current = [{
					system: MISSIONS[missionRef.current].system,
					base: base.name,
					score,
					speed,
					result: base.id === targetRef.current ? "Assigned dock secured" : "Alternate base reached"
				}, ...logsRef.current].slice(0, 20);
				setLogs(logsRef.current);
				setScore(totalRef.current);
				setStatus("DOCKED");
				setResult({
					ok: true,
					title: base.id === targetRef.current ? "Crew safely home" : "Emergency reroute complete",
					copy: base.id === targetRef.current ? `${base.name} has hard-docked and assumed life-support control.` : `${base.name} accepted the shuttle, but the assigned-route bonus was missed.`,
					score,
					precision: Math.round(precisionRatio * 100),
					fuel: Math.round(efficiencyRatio * 100)
				});
				tone("success");
			}
			function lose(copy) {
				if (statusRef.current !== "flying") return;
				statusRef.current = "result";
				const active = MISSIONS[missionRef.current];
				const base = active.bases.find((item) => item.id === targetRef.current);
				const speed = Math.hypot(launchRef.current.x, launchRef.current.y);
				logsRef.current = [{
					system: active.system,
					base: base.name,
					score: 0,
					speed,
					result: copy
				}, ...logsRef.current].slice(0, 20);
				setLogs(logsRef.current);
				setStatus("LOST");
				setResult({
					ok: false,
					title: "Approach aborted",
					copy,
					score: 0,
					precision: 0,
					fuel: 0
				});
				tone("crash");
			}
			function resize() {
				const width = Math.max(mount.clientWidth, 1);
				const height = Math.max(mount.clientHeight, 1);
				const mode = viewportRef.current;
				const insets = mode === "compact" ? {
					top: 14,
					right: 54,
					bottom: 14,
					left: 54
				} : mode === "touch" ? {
					top: 14,
					right: 14,
					bottom: 62,
					left: 14
				} : {
					top: 12,
					right: 12,
					bottom: 12,
					left: 12
				};
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
			function animate(now) {
				if (disposed) return;
				requestAnimationFrame(animate);
				const dt = Math.min((now - state.last) / 1e3, .04);
				state.last = now;
				state.frame += 1;
				const active = MISSIONS[missionRef.current];
				stars.rotation.z += dt * .002;
				state.bases.forEach((dock, index) => {
					dock.userData.rotors?.forEach((rotor, rotorIndex) => {
						rotor.rotation.z += dt * (.18 + index * .035 + rotorIndex * .04);
					});
					const pulse = 1 + Math.sin(now * .002 + index) * .025;
					dock.scale.setScalar(active.bases[index].id === targetRef.current ? pulse : 1);
				});
				state.planets.forEach((body, index) => {
					const source = active.sources[index];
					const p = sourcePosition(source, flightRef.current.time);
					body.position.set(p.x, p.y, 0);
					if (body.userData.surface) body.userData.surface.rotation.y += dt * (source.look === "gas" ? .3 : .09);
					if (body.userData.atmosphere) body.userData.atmosphere.rotation.y -= dt * .035;
					if (body.userData.rings) body.userData.rings.rotation.z += dt * .018;
				});
				ship.userData.flames?.forEach((flame, index) => {
					const thrust = statusRef.current === "flying" ? 1 : .42;
					flame.scale.set(.86 + Math.sin(now * .022 + index) * .1, thrust * (.82 + Math.sin(now * .031 + index) * .16), .86);
					flame.visible = statusRef.current !== "result";
				});
				const fieldOpacity = statusRef.current === "aiming" ? 1 : .34;
				field.userData.materials?.forEach((fieldMaterial) => {
					fieldMaterial.opacity = (fieldMaterial === field.userData.materials[0] ? .27 : .34) * fieldOpacity;
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
					ship.position.set(flight.x, flight.y, .2);
					ship.rotation.z = Math.atan2(flight.vy, flight.vx);
					state.trail.push(new THREE.Vector3(flight.x, flight.y, .02));
					if (state.trail.length > 260) state.trail.shift();
					trail.geometry.dispose();
					trail.geometry = new THREE.BufferGeometry().setFromPoints(state.trail);
					if (state.frame % 5 === 0) {
						const g = gravity(flight, active, flight.time);
						setTelemetry({
							speed: Math.hypot(flight.vx, flight.vy),
							gravity: Math.hypot(g.x, g.y),
							time: flight.time,
							distance: Number.isFinite(state.closest) ? state.closest.toFixed(2) : "—"
						});
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
				resize
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
	(0, import_react.useEffect)(() => {
		if (engine.current) {
			engine.current.trajectory = trajectory;
			engine.current.predict();
		}
	}, [trajectory]);
	(0, import_react.useEffect)(() => {
		if (engine.current) {
			engine.current.vectors = vectors;
			engine.current.rebuildField();
		}
	}, [vectors]);
	(0, import_react.useEffect)(() => {
		if (engine.current) {
			engine.current.resize();
			engine.current.rebuildField();
		}
	}, [viewportMode]);
	const chooseMission = (index) => {
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
	const chooseBase = (id) => {
		if (statusRef.current !== "aiming") return;
		setOpenPanel(null);
		setTargetId(id);
		targetRef.current = id;
		engine.current?.selectBase();
		engine.current?.predict();
		tone("click");
	};
	const retry = (0, import_react.useCallback)(() => {
		setResult(null);
		setOpenPanel(null);
		statusRef.current = "aiming";
		engine.current?.reset();
	}, []);
	(0, import_react.useEffect)(() => {
		const keyboard = (event) => {
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: `game-shell viewport-${viewportMode}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "nebula nebula-one" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "nebula nebula-two" }),
			intro && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "prologue",
				"aria-label": "Mission prologue",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "prologue-art",
						"aria-hidden": "true"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "prologue-shade",
						"aria-hidden": "true"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "skip-intro",
						onClick: closeIntro,
						children: "SKIP TRANSMISSION"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "story-window",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "eyebrow",
								children: "ARCHIVE // 27 OCTOBER 2300"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", { children: [
								"HUMANITY",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
								"OUTGREW THE SKY."
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "story-copy",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Across six star systems, our bases became small islands in a very large dark." }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Every launch is bent by worlds, suns, and forces no engine can ignore." }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "When crews lose their final burn, one navigator brings them home." })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "role-stamp",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "YOUR CALLSIGN" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "ORBIT MASTER" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: "primary-button begin-button",
								onClick: closeIntro,
								children: ["ACCEPT RETURN-TO-BASE COMMAND ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "→" })]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "prologue-caption",
						children: "A FRONTIER RESCUE COMMAND STORY"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: `hud ${intro ? "hud-hidden" : ""}`,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
						className: "topbar",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "brand",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "brand-mark",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "OM" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "ORBIT MASTER" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "RETURN TO BASE" })] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
								className: "mission-tabs",
								"aria-label": "Mission selection",
								children: MISSIONS.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									className: index === missionIndex ? "active" : "",
									onClick: () => chooseMission(index),
									"aria-label": `Mission ${item.id}: ${item.system}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: String(item.id).padStart(2, "0") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: item.sector })]
								}, item.id))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "compact-mission-control",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => chooseMission((missionIndex + MISSIONS.length - 1) % MISSIONS.length),
										"aria-label": "Previous mission",
										children: "‹"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "sr-only",
										children: "Current mission"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
										value: missionIndex,
										onChange: (event) => chooseMission(Number(event.target.value)),
										children: MISSIONS.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
											value: index,
											children: [
												String(item.id).padStart(2, "0"),
												" · ",
												item.sector
											]
										}, item.id))
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => chooseMission((missionIndex + 1) % MISSIONS.length),
										"aria-label": "Next mission",
										children: "›"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "header-actions",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "score-chip",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "COMMAND SCORE" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: score.toLocaleString() })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "icon-button",
										onClick: () => setGuideOpen(true),
										"aria-label": "Open flight guide",
										children: "?"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										className: "compact-button",
										onClick: () => setLogOpen(true),
										"aria-label": "Open flight log",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "log-label",
											children: "FLIGHT LOG"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "log-glyph",
											children: "LOG"
										})]
									})
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "play-layout",
						children: [
							openPanel && viewportMode !== "wide" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "panel-scrim",
								onClick: () => setOpenPanel(null),
								"aria-label": "Close information panel"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
								className: `briefing-panel panel ${openPanel === "mission" ? "panel-open" : ""}`,
								"aria-hidden": viewportMode !== "wide" && openPanel !== "mission",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "panel-close",
										onClick: () => setOpenPanel(null),
										"aria-label": "Close mission briefing",
										children: "×"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "panel-kicker",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["MISSION ", String(mission.id).padStart(2, "0")] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: mission.concept })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "system-name",
										children: mission.system
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: mission.title }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mission-brief",
										children: mission.brief
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "formula-chip",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "FLIGHT PRINCIPLE" }), mission.formula]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "source-list",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "section-label",
											children: "ACTIVE GRAVITY WELLS"
										}), mission.sources.map((source) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "source-row",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "source-orb",
													style: { background: hex(source.color) }
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: source.name }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [
													"μ ",
													source.mu.toFixed(1),
													" · r ",
													source.radius.toFixed(2)
												] })
											]
										}, source.name))]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										className: "hint-toggle",
										onClick: () => setHint(!hint),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "CO-PILOT NOTE" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: hint ? "−" : "+" })]
									}),
									hint && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "hint-copy",
										children: mission.hint
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
								className: "arena-shell",
								"aria-label": "Orbital rescue arena",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										ref: mountRef,
										className: "space-stage",
										"aria-label": "Three-dimensional orbital rescue scene"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "arena-panel-controls",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											className: "arena-panel-button mission-button",
											onClick: () => setOpenPanel(openPanel === "mission" ? null : "mission"),
											"aria-expanded": openPanel === "mission",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "MISSION" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: String(mission.id).padStart(2, "0") })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											className: "arena-panel-button bases-button",
											onClick: () => setOpenPanel(openPanel === "bases" ? null : "bases"),
											"aria-expanded": openPanel === "bases",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "RETURN BASE" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: targetId })]
										})]
									}),
									status === "AIMING" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "launch-callout",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "ship-pulse",
											children: "◆"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "DRAG SHUTTLE BACK" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Release to launch · short guide only" })] })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "field-legend",
										"aria-hidden": !vectors,
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "G-FIELD" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "WEAK" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", {}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "STRONG" })
										]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
								className: `target-panel panel ${openPanel === "bases" ? "panel-open" : ""}`,
								"aria-hidden": viewportMode !== "wide" && openPanel !== "bases",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										className: "panel-close",
										onClick: () => setOpenPanel(null),
										"aria-label": "Close docking manifest",
										children: "×"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "target-heading",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "section-label",
											children: "CHOOSE RETURN BASE"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", { children: "Docking manifest" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "live-pill",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {}), " LIVE"]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "target-list",
										children: mission.bases.map((base) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											className: `target-card ${base.id === targetId ? "selected" : ""}`,
											onClick: () => chooseBase(base.id),
											disabled: status !== "AIMING",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "target-id",
													style: { color: hex(base.color) },
													children: base.id
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "target-copy",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: base.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("small", { children: [
														base.role,
														" · ",
														base.crew,
														" crew"
													] })]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "target-stats",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: maxScore(base).toLocaleString() }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "MAX PTS" })]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "difficulty-tag",
													children: [
														difficulty(base.radius),
														" · Ø ",
														(base.radius * 2).toFixed(2)
													]
												})
											]
										}, base.id))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "score-explainer",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "section-label",
												children: "HOW THIS BASE SCORES"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Dock secured" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: ["+", target.base.toLocaleString()] })] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Precision, up to" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: ["+", target.precision] })] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Fuel saved, up to" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: ["+", target.fuel] })] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Assigned route" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "+300" })] })
										]
									})
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
						className: "telemetry-bar panel",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: `status-block status-${status.toLowerCase().replace(" ", "-")}`,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("i", {}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "FLIGHT STATE" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: status })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "telemetry-item",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "VELOCITY" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: telemetry.speed.toFixed(2) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "u/s" })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "telemetry-item",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "GRAVITY" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: telemetry.gravity.toFixed(2) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "u/s²" })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "telemetry-item",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "CLOSEST PASS" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: telemetry.distance }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "u" })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "telemetry-item",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "FLIGHT TIME" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: telemetry.time.toFixed(1) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "s" })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "toggle-cluster",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "checkbox",
										checked: trajectory,
										onChange: (event) => setTrajectory(event.target.checked)
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										"data-short": "PATH",
										children: "SHORT GUIDE"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "checkbox",
										checked: vectors,
										onChange: (event) => setVectors(event.target.checked)
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										"data-short": "FIELD",
										children: "G-FIELD"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "checkbox",
										checked: sound,
										onChange: (event) => setSound(event.target.checked)
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										"data-short": "SND",
										children: "SOUND"
									})] })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: "reset-button",
								onClick: retry,
								children: ["RESET ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("kbd", { children: "R" })]
							})
						]
					})
				]
			}),
			result && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "modal-backdrop",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: `result-card ${result.ok ? "success" : "failure"}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "eyebrow",
							children: result.ok ? "RETURN CONFIRMED" : "TRAJECTORY LOST"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "result-emblem",
							children: result.ok ? "✓" : "×"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: result.title }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: result.copy }),
						result.ok && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "result-score",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "FLIGHT SCORE" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: result.score.toLocaleString() })] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "DOCK PRECISION" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [result.precision, "%"] })] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "FUEL EFFICIENCY" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [result.fuel, "%"] })] })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "result-actions",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "secondary-button",
								onClick: retry,
								children: "ADJUST & RETRY"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: "primary-button",
								onClick: () => chooseMission((missionIndex + 1) % MISSIONS.length),
								children: [
									result.ok ? "NEXT RESCUE" : "TRY NEXT SYSTEM",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "→" })
								]
							})]
						})
					]
				})
			}),
			logOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "modal-backdrop",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "manifest-card",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "modal-header",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "eyebrow",
								children: "COMMAND ARCHIVE"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Return-to-base flight log" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "icon-button",
								onClick: () => setLogOpen(false),
								children: "×"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "manifest-score",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "TOTAL COMMAND SCORE" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: score.toLocaleString() })]
						}),
						logs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "empty-log",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "◌" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "No flight records yet." }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("small", { children: "Launch a shuttle to begin the archive." })
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "log-table",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "log-row log-head",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "System" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Base" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Result" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Speed" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Score" })
								]
							}), logs.map((entry, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "log-row",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: entry.system }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: entry.base }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: entry.result }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [entry.speed.toFixed(2), " u/s"] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: entry.score.toLocaleString() })
								]
							}, `${entry.system}-${index}`))]
						})
					]
				})
			}),
			guideOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "modal-backdrop",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "guide-card",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "modal-header",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "eyebrow",
								children: "PILOT QUICKSTART"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Bring every crew home" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "icon-button",
								onClick: () => setGuideOpen(false),
								children: "×"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "guide-steps",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "01" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Pick a base." }), " Large bases are safer. Small bases pay far more."] })] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "02" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Drag the shuttle backward." }), " Direction sets angle; distance sets launch speed."] })] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "03" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Read only the first moments." }), " The amber guide is deliberately short—gravity must be judged, not traced."] })] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "04" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Use the worlds." }), " A close flyby bends the route more, but touching any gravity source aborts the approach."] })] })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "primary-button",
							onClick: () => setGuideOpen(false),
							children: "RETURN TO COMMAND"
						})
					]
				})
			})
		]
	});
}
//#endregion
export { OrbitGame as default };
