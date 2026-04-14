import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

// ==================== SCENE SETUP ====================
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1a2e);
scene.fog = new THREE.FogExp2(0x1a1a2e, 0.008);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 8, 18);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
const root = document.getElementById('root') ?? document.body;
root.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.maxPolarAngle = Math.PI / 2.1;
controls.minDistance = 5;
controls.maxDistance = 35;

// ==================== LIGHTING ====================
const ambientLight = new THREE.AmbientLight(0x404060, 0.6);
ambientLight.name = 'ambientLight';
scene.add(ambientLight);

const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
mainLight.name = 'mainLight';
mainLight.position.set(10, 20, 10);
mainLight.castShadow = true;
mainLight.shadow.mapSize.set(2048, 2048);
mainLight.shadow.camera.near = 0.5;
mainLight.shadow.camera.far = 50;
mainLight.shadow.camera.left = -20;
mainLight.shadow.camera.right = 20;
mainLight.shadow.camera.top = 20;
mainLight.shadow.camera.bottom = -20;
mainLight.shadow.bias = -0.001;
mainLight.shadow.normalBias = 0.02;
scene.add(mainLight);

const fillLight = new THREE.DirectionalLight(0x8888ff, 0.3);
fillLight.name = 'fillLight';
fillLight.position.set(-10, 10, -10);
scene.add(fillLight);

const pointLight1 = new THREE.PointLight(0x00ff88, 0.5, 20);
pointLight1.name = 'pointLight1';
pointLight1.position.set(-8, 5, 0);
scene.add(pointLight1);

const pointLight2 = new THREE.PointLight(0xff4488, 0.5, 20);
pointLight2.name = 'pointLight2';
pointLight2.position.set(8, 5, 0);
scene.add(pointLight2);

// ==================== MATERIALS ====================
const floorMat = new THREE.MeshStandardMaterial({ color: 0x2a2a3e, roughness: 0.3, metalness: 0.1 });
const tableMat = new THREE.MeshStandardMaterial({ color: 0x3a3a4e, roughness: 0.4, metalness: 0.2 });
const glassMat = new THREE.MeshPhysicalMaterial({ color: 0xaaddff, transparent: true, opacity: 0.3, roughness: 0.05, metalness: 0.0, transmission: 0.9, thickness: 0.5 });
const metalMat = new THREE.MeshStandardMaterial({ color: 0x888899, roughness: 0.2, metalness: 0.8 });
const glowGreen = new THREE.MeshStandardMaterial({ color: 0x00ff88, emissive: 0x00ff88, emissiveIntensity: 0.5 });
const glowBlue = new THREE.MeshStandardMaterial({ color: 0x4488ff, emissive: 0x4488ff, emissiveIntensity: 0.5 });
const glowRed = new THREE.MeshStandardMaterial({ color: 0xff4466, emissive: 0xff4466, emissiveIntensity: 0.5 });
const glowYellow = new THREE.MeshStandardMaterial({ color: 0xffcc00, emissive: 0xffcc00, emissiveIntensity: 0.5 });
const glowPurple = new THREE.MeshStandardMaterial({ color: 0xaa44ff, emissive: 0xaa44ff, emissiveIntensity: 0.5 });

// ==================== FLOOR & WALLS ====================
const floor = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), floorMat);
floor.name = 'floor';
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

// Grid lines on floor
const gridHelper = new THREE.GridHelper(60, 60, 0x333355, 0x222244);
gridHelper.name = 'gridHelper';
scene.add(gridHelper);

// Back wall
const wallMat = new THREE.MeshStandardMaterial({ color: 0x222238, roughness: 0.8 });
const backWall = new THREE.Mesh(new THREE.BoxGeometry(60, 15, 0.3), wallMat);
backWall.name = 'backWall';
backWall.position.set(0, 7.5, -15);
backWall.receiveShadow = true;
scene.add(backWall);

// ==================== LAB TABLES ====================
function createTable(x, z, w, d, name) {
  const group = new THREE.Group();
  group.name = name;
  // Tabletop
  const top = new THREE.Mesh(new THREE.BoxGeometry(w, 0.15, d), tableMat);
  top.name = name + '_top';
  top.position.y = 3.5;
  top.castShadow = true;
  top.receiveShadow = true;
  group.add(top);
  // Legs
  const legGeo = new THREE.CylinderGeometry(0.1, 0.1, 3.5, 8);
  const positions = [
    [-(w/2 - 0.3), 1.75, -(d/2 - 0.3)],
    [(w/2 - 0.3), 1.75, -(d/2 - 0.3)],
    [-(w/2 - 0.3), 1.75, (d/2 - 0.3)],
    [(w/2 - 0.3), 1.75, (d/2 - 0.3)]
  ];
  positions.forEach((p, i) => {
    const leg = new THREE.Mesh(legGeo, metalMat);
    leg.name = name + '_leg' + i;
    leg.position.set(...p);
    leg.castShadow = true;
    group.add(leg);
  });
  group.position.set(x, 0, z);
  scene.add(group);
  return group;
}

const bioTable = createTable(-10, -5, 8, 4, 'bioTable');
const chemTable = createTable(0, -5, 8, 4, 'chemTable');
const physTable = createTable(10, -5, 8, 4, 'physTable');
const centralTable = createTable(0, 5, 12, 5, 'centralTable');

// ==================== STATION LABELS (Sprite) ====================
function createLabel(text, position, color = '#00ff88') {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = 'rgba(0,0,0,0.7)';
  ctx.roundRect(0, 0, 512, 128, 20);
  ctx.fill();
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.roundRect(5, 5, 502, 118, 18);
  ctx.stroke();
  ctx.font = 'bold 48px Inter, Arial, sans-serif';
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 256, 64);
  const texture = new THREE.CanvasTexture(canvas);
  const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true });
  const sprite = new THREE.Sprite(spriteMat);
  sprite.name = 'label_' + text.replace(/\s/g, '_');
  sprite.scale.set(4, 1, 1);
  sprite.position.copy(position);
  scene.add(sprite);
  return sprite;
}

createLabel('🧬 BIOLOGY', new THREE.Vector3(-10, 7.5, -5), '#00ff88');
createLabel('⚗️ CHEMISTRY', new THREE.Vector3(0, 7.5, -5), '#4488ff');
createLabel('⚡ PHYSICS', new THREE.Vector3(10, 7.5, -5), '#ff4466');
createLabel('🔬 EXPERIMENT ZONE', new THREE.Vector3(0, 7.5, 5), '#ffcc00');

// ==================== BIOLOGY STATION ====================
// DNA Double Helix
const dnaGroup = new THREE.Group();
dnaGroup.name = 'dnaHelix';
const basePairColors = [0xff4466, 0x4488ff, 0x00ff88, 0xffcc00]; // A, T, G, C
const helixRadius = 0.8;
const helixHeight = 4;
const turns = 3;
const pointsPerTurn = 20;
const totalPoints = turns * pointsPerTurn;

for (let i = 0; i < totalPoints; i++) {
  const t = i / totalPoints;
  const angle = t * turns * Math.PI * 2;
  const y = t * helixHeight - helixHeight / 2;
  // Strand 1
  const x1 = Math.cos(angle) * helixRadius;
  const z1 = Math.sin(angle) * helixRadius;
  const sphere1 = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), glowGreen);
  sphere1.name = 'dna_strand1_' + i;
  sphere1.position.set(x1, y, z1);
  dnaGroup.add(sphere1);
  // Strand 2
  const x2 = Math.cos(angle + Math.PI) * helixRadius;
  const z2 = Math.sin(angle + Math.PI) * helixRadius;
  const sphere2 = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), glowBlue);
  sphere2.name = 'dna_strand2_' + i;
  sphere2.position.set(x2, y, z2);
  dnaGroup.add(sphere2);
  // Base pairs (rungs)
  if (i % 3 === 0) {
    const colorIdx = Math.floor(Math.random() * 4);
    const rungMat = new THREE.MeshStandardMaterial({
      color: basePairColors[colorIdx],
      emissive: basePairColors[colorIdx],
      emissiveIntensity: 0.3
    });
    const midX = (x1 + x2) / 2;
    const midZ = (z1 + z2) / 2;
    const length = Math.sqrt((x2 - x1) ** 2 + (z2 - z1) ** 2);
    const rung = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, length, 6), rungMat);
    rung.name = 'dna_rung_' + i;
    rung.position.set(midX, y, midZ);
    rung.rotation.z = Math.PI / 2;
    rung.lookAt(new THREE.Vector3(x1, y, z1));
    rung.rotateX(Math.PI / 2);
    dnaGroup.add(rung);
  }
}
dnaGroup.position.set(-10, 5.5, -5);
scene.add(dnaGroup);

// Cell Model
const cellGroup = new THREE.Group();
cellGroup.name = 'cellModel';
// Cell membrane
const cellMembrane = new THREE.Mesh(
  new THREE.SphereGeometry(1.2, 32, 32),
  new THREE.MeshPhysicalMaterial({ color: 0x88ffaa, transparent: true, opacity: 0.25, roughness: 0.1, transmission: 0.8 })
);
cellMembrane.name = 'cellMembrane';
cellGroup.add(cellMembrane);
// Nucleus
const nucleus = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 24, 24),
  new THREE.MeshStandardMaterial({ color: 0xff6644, emissive: 0xff6644, emissiveIntensity: 0.3 })
);
nucleus.name = 'nucleus';
cellGroup.add(nucleus);
// Nucleolus
const nucleolus = new THREE.Mesh(
  new THREE.SphereGeometry(0.2, 16, 16),
  new THREE.MeshStandardMaterial({ color: 0xff2222, emissive: 0xff2222, emissiveIntensity: 0.4 })
);
nucleolus.name = 'nucleolus';
nucleolus.position.set(0.15, 0.1, 0);
cellGroup.add(nucleolus);
// Mitochondria
for (let i = 0; i < 5; i++) {
  const mito = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.12, 0.3, 8, 12),
    new THREE.MeshStandardMaterial({ color: 0xff8800, emissive: 0xff8800, emissiveIntensity: 0.2 })
  );
  mito.name = 'mitochondria_' + i;
  const angle = (i / 5) * Math.PI * 2;
  mito.position.set(Math.cos(angle) * 0.8, Math.sin(angle) * 0.3, Math.sin(angle) * 0.8);
  mito.rotation.set(Math.random(), Math.random(), Math.random());
  cellGroup.add(mito);
}
// Endoplasmic Reticulum
const erCurve = new THREE.CatmullRomCurve3([
  new THREE.Vector3(-0.8, 0.3, 0.2),
  new THREE.Vector3(-0.4, 0.5, -0.3),
  new THREE.Vector3(0.1, 0.4, 0.4),
  new THREE.Vector3(0.5, 0.6, -0.2),
  new THREE.Vector3(0.9, 0.3, 0.3)
]);
const erTube = new THREE.Mesh(
  new THREE.TubeGeometry(erCurve, 30, 0.05, 8, false),
  new THREE.MeshStandardMaterial({ color: 0x44aaff, emissive: 0x44aaff, emissiveIntensity: 0.2 })
);
erTube.name = 'endoplasmicReticulum';
cellGroup.add(erTube);
// Ribosomes
for (let i = 0; i < 15; i++) {
  const ribo = new THREE.Mesh(
    new THREE.SphereGeometry(0.04, 8, 8),
    new THREE.MeshStandardMaterial({ color: 0xffff00, emissive: 0xffff00, emissiveIntensity: 0.5 })
  );
  ribo.name = 'ribosome_' + i;
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.random() * Math.PI;
  const r = 0.6 + Math.random() * 0.5;
  ribo.position.set(r * Math.sin(phi) * Math.cos(theta), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta));
  cellGroup.add(ribo);
}
cellGroup.position.set(-12, 5.5, -3);
cellGroup.scale.setScalar(1.2);
scene.add(cellGroup);

// ==================== CHEMISTRY STATION ====================
// Beakers & Flasks
function createBeaker(x, y, z, liquidColor, liquidLevel, name) {
  const group = new THREE.Group();
  group.name = name;
  // Glass body
  const glass = new THREE.Mesh(
    new THREE.CylinderGeometry(0.4, 0.35, 1.2, 16, 1, true),
    glassMat
  );
  glass.name = name + '_glass';
  group.add(glass);
  // Bottom
  const bottom = new THREE.Mesh(new THREE.CircleGeometry(0.35, 16), glassMat);
  bottom.name = name + '_bottom';
  bottom.rotation.x = -Math.PI / 2;
  bottom.position.y = -0.6;
  group.add(bottom);
  // Liquid
  if (liquidLevel > 0) {
    const liqHeight = 1.2 * liquidLevel;
    const liqMat = new THREE.MeshStandardMaterial({
      color: liquidColor,
      emissive: liquidColor,
      emissiveIntensity: 0.4,
      transparent: true,
      opacity: 0.7
    });
    const liquid = new THREE.Mesh(new THREE.CylinderGeometry(0.33, 0.30, liqHeight, 16), liqMat);
    liquid.name = name + '_liquid';
    liquid.position.y = -0.6 + liqHeight / 2;
    group.add(liquid);
  }
  group.position.set(x, y, z);
  return group;
}

function createErlenmeyer(x, y, z, liquidColor, name) {
  const group = new THREE.Group();
  group.name = name;
  // Flask body using lathe
  const points = [];
  points.push(new THREE.Vector2(0.5, 0));
  points.push(new THREE.Vector2(0.5, 0.1));
  points.push(new THREE.Vector2(0.48, 0.4));
  points.push(new THREE.Vector2(0.3, 0.8));
  points.push(new THREE.Vector2(0.15, 1.2));
  points.push(new THREE.Vector2(0.15, 1.5));
  const flask = new THREE.Mesh(new THREE.LatheGeometry(points, 24), glassMat);
  flask.name = name + '_flask';
  group.add(flask);
  // Liquid
  const liqPoints = [];
  liqPoints.push(new THREE.Vector2(0.44, 0.05));
  liqPoints.push(new THREE.Vector2(0.44, 0.1));
  liqPoints.push(new THREE.Vector2(0.42, 0.35));
  liqPoints.push(new THREE.Vector2(0.25, 0.7));
  liqPoints.push(new THREE.Vector2(0, 0.7));
  const liqMat = new THREE.MeshStandardMaterial({
    color: liquidColor, emissive: liquidColor, emissiveIntensity: 0.5, transparent: true, opacity: 0.6
  });
  const liquid = new THREE.Mesh(new THREE.LatheGeometry(liqPoints, 24), liqMat);
  liquid.name = name + '_liquid';
  group.add(liquid);
  group.position.set(x, y, z);
  return group;
}

// Periodic Table Display (small)
function createMolecule(atomPositions, bonds, position, name) {
  const group = new THREE.Group();
  group.name = name;
  const atomGeos = {};
  atomPositions.forEach((atom, i) => {
    const mat = new THREE.MeshStandardMaterial({ color: atom.color, emissive: atom.color, emissiveIntensity: 0.3 });
    const sphere = new THREE.Mesh(new THREE.SphereGeometry(atom.radius || 0.15, 16, 16), mat);
    sphere.name = name + '_atom_' + i;
    sphere.position.set(atom.x, atom.y, atom.z);
    group.add(sphere);
  });
  bonds.forEach((bond, i) => {
    const a1 = atomPositions[bond[0]];
    const a2 = atomPositions[bond[1]];
    const start = new THREE.Vector3(a1.x, a1.y, a1.z);
    const end = new THREE.Vector3(a2.x, a2.y, a2.z);
    const mid = start.clone().add(end).multiplyScalar(0.5);
    const length = start.distanceTo(end);
    const bondMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.03, 0.03, length, 8),
      new THREE.MeshStandardMaterial({ color: 0xaaaaaa })
    );
    bondMesh.name = name + '_bond_' + i;
    bondMesh.position.copy(mid);
    bondMesh.lookAt(end);
    bondMesh.rotateX(Math.PI / 2);
    group.add(bondMesh);
  });
  group.position.copy(position);
  return group;
}

// Water molecule (H2O)
const waterMolecule = createMolecule(
  [
    { x: 0, y: 0, z: 0, color: 0xff0000, radius: 0.2 },  // O
    { x: -0.35, y: 0.25, z: 0, color: 0xffffff, radius: 0.12 },  // H
    { x: 0.35, y: 0.25, z: 0, color: 0xffffff, radius: 0.12 }   // H
  ],
  [[0, 1], [0, 2]],
  new THREE.Vector3(-2, 4.5, -5),
  'waterMolecule'
);
scene.add(waterMolecule);

// Benzene Ring (C6H6)
const benzeneAtoms = [];
const benzeneBonds = [];
for (let i = 0; i < 6; i++) {
  const angle = (i / 6) * Math.PI * 2;
  benzeneAtoms.push({ x: Math.cos(angle) * 0.5, y: Math.sin(angle) * 0.5, z: 0, color: 0x333333, radius: 0.12 });
  benzeneAtoms.push({ x: Math.cos(angle) * 0.85, y: Math.sin(angle) * 0.85, z: 0, color: 0xffffff, radius: 0.08 });
  benzeneBonds.push([i * 2, ((i + 1) % 6) * 2]);
  benzeneBonds.push([i * 2, i * 2 + 1]);
}
const benzene = createMolecule(benzeneAtoms, benzeneBonds, new THREE.Vector3(2, 4.5, -5), 'benzeneMolecule');
scene.add(benzene);

// Beakers on chem table
const beaker1 = createBeaker(-1, 4.2, -4.5, 0x00ff88, 0.6, 'beakerGreen');
chemTable.add(beaker1);
const beaker2 = createBeaker(0.5, 4.2, -4.5, 0x4488ff, 0.8, 'beakerBlue');
chemTable.add(beaker2);
const beaker3 = createBeaker(2, 4.2, -4.5, 0xff4466, 0.4, 'beakerRed');
chemTable.add(beaker3);

const flask1 = createErlenmeyer(-2.5, 3.6, -4.5, 0xffcc00, 'erlenmeyerYellow');
chemTable.add(flask1);

// Bunsen Burner
const bunsenGroup = new THREE.Group();
bunsenGroup.name = 'bunsenBurner';
const burnerBase = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.4, 0.2, 16), metalMat);
burnerBase.name = 'bunsenBase';
bunsenGroup.add(burnerBase);
const burnerTube = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1, 12), metalMat);
burnerTube.name = 'bunsenTube';
burnerTube.position.y = 0.6;
bunsenGroup.add(burnerTube);
// Flame
const flameMat = new THREE.MeshStandardMaterial({
  color: 0x4488ff, emissive: 0x4488ff, emissiveIntensity: 1, transparent: true, opacity: 0.8
});
const flame = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.5, 12), flameMat);
flame.name = 'bunsenFlame';
flame.position.y = 1.35;
bunsenGroup.add(flame);
const flameInner = new THREE.Mesh(
  new THREE.ConeGeometry(0.06, 0.3, 12),
  new THREE.MeshStandardMaterial({ color: 0xffff88, emissive: 0xffff88, emissiveIntensity: 1.5, transparent: true, opacity: 0.9 })
);
flameInner.name = 'bunsenFlameInner';
flameInner.position.y = 1.3;
bunsenGroup.add(flameInner);
bunsenGroup.position.set(3, 3.6, -4.5);
chemTable.add(bunsenGroup);

// ==================== PHYSICS STATION ====================
// Pendulum
const pendulumGroup = new THREE.Group();
pendulumGroup.name = 'pendulum';
const pendulumStand = new THREE.Mesh(new THREE.BoxGeometry(0.1, 3, 0.1), metalMat);
pendulumStand.name = 'pendulumStand';
pendulumStand.position.y = 1.5;
pendulumGroup.add(pendulumStand);
const pendulumTop = new THREE.Mesh(new THREE.BoxGeometry(2, 0.1, 0.1), metalMat);
pendulumTop.name = 'pendulumTop';
pendulumTop.position.y = 3;
pendulumGroup.add(pendulumTop);
const pendulumArm = new THREE.Group();
pendulumArm.name = 'pendulumArm';
const pendulumString = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 2, 6), new THREE.MeshStandardMaterial({ color: 0xcccccc }));
pendulumString.name = 'pendulumString';
pendulumString.position.y = -1;
pendulumArm.add(pendulumString);
const pendulumBob = new THREE.Mesh(
  new THREE.SphereGeometry(0.2, 16, 16),
  new THREE.MeshStandardMaterial({ color: 0xffcc00, emissive: 0xffcc00, emissiveIntensity: 0.3, metalness: 0.8, roughness: 0.2 })
);
pendulumBob.name = 'pendulumBob';
pendulumBob.position.y = -2;
pendulumArm.add(pendulumBob);
pendulumArm.position.y = 3;
pendulumGroup.add(pendulumArm);
pendulumGroup.position.set(10, 3.6, -5);
scene.add(pendulumGroup);

// Electromagnetic Coil
const coilGroup = new THREE.Group();
coilGroup.name = 'emCoil';
const coilCore = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 1.5, 12), metalMat);
coilCore.name = 'coilCore';
coilCore.rotation.z = Math.PI / 2;
coilGroup.add(coilCore);
for (let i = 0; i < 20; i++) {
  const coilRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.25, 0.02, 8, 16),
    new THREE.MeshStandardMaterial({ color: 0xcc6600, emissive: 0xcc3300, emissiveIntensity: 0.2 })
  );
  coilRing.name = 'coilRing_' + i;
  coilRing.position.x = -0.7 + (i / 19) * 1.4;
  coilRing.rotation.y = Math.PI / 2;
  coilGroup.add(coilRing);
}
// Magnetic field lines
for (let i = 0; i < 6; i++) {
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-1.2, 0, 0),
    new THREE.Vector3(-0.8, Math.sin((i / 6) * Math.PI) * 0.8, Math.cos((i / 6) * Math.PI) * 0.8),
    new THREE.Vector3(0, Math.sin((i / 6) * Math.PI) * 1, Math.cos((i / 6) * Math.PI) * 1),
    new THREE.Vector3(0.8, Math.sin((i / 6) * Math.PI) * 0.8, Math.cos((i / 6) * Math.PI) * 0.8),
    new THREE.Vector3(1.2, 0, 0),
  ]);
  const fieldLine = new THREE.Mesh(
    new THREE.TubeGeometry(curve, 30, 0.01, 6, false),
    new THREE.MeshStandardMaterial({ color: 0x00ffff, emissive: 0x00ffff, emissiveIntensity: 0.5, transparent: true, opacity: 0.4 })
  );
  fieldLine.name = 'fieldLine_' + i;
  coilGroup.add(fieldLine);
}
coilGroup.position.set(12, 5, -4);
scene.add(coilGroup);

// Prism with light dispersion
const prismGroup = new THREE.Group();
prismGroup.name = 'prism';
const prismShape = new THREE.Shape();
prismShape.moveTo(0, 0.6);
prismShape.lineTo(-0.5, -0.3);
prismShape.lineTo(0.5, -0.3);
prismShape.lineTo(0, 0.6);
const prismGeo = new THREE.ExtrudeGeometry(prismShape, { depth: 0.6, bevelEnabled: false });
const prismMesh = new THREE.Mesh(prismGeo, new THREE.MeshPhysicalMaterial({
  color: 0xffffff, transparent: true, opacity: 0.4, transmission: 0.9, roughness: 0, ior: 2.4
}));
prismMesh.name = 'prismMesh';
prismGroup.add(prismMesh);

// Rainbow beams
const rainbowColors = [0xff0000, 0xff8800, 0xffff00, 0x00ff00, 0x0088ff, 0x4400ff, 0x8800ff];
rainbowColors.forEach((c, i) => {
  const beam = new THREE.Mesh(
    new THREE.CylinderGeometry(0.015, 0.015, 2.5, 6),
    new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: 1, transparent: true, opacity: 0.7 })
  );
  beam.name = 'rainbowBeam_' + i;
  beam.rotation.z = Math.PI / 2 + (i - 3) * 0.06;
  beam.position.set(1.5, (i - 3) * 0.08, 0.3);
  prismGroup.add(beam);
});
// White light
const whiteBeam = new THREE.Mesh(
  new THREE.CylinderGeometry(0.03, 0.03, 2, 6),
  new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 1 })
);
whiteBeam.name = 'whiteBeam';
whiteBeam.rotation.z = Math.PI / 2;
whiteBeam.position.set(-1.2, 0.15, 0.3);
prismGroup.add(whiteBeam);
prismGroup.position.set(8, 5, -6);
scene.add(prismGroup);

// ==================== CENTRAL EXPERIMENT - ATP Synthesis ====================
const atpGroup = new THREE.Group();
atpGroup.name = 'atpSynthesis';
// ATP Synthase - Rotary Motor Enzyme
const synthaseBase = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 0.15, 24), 
  new THREE.MeshStandardMaterial({ color: 0x664488, emissive: 0x664488, emissiveIntensity: 0.2 })
);
synthaseBase.name = 'synthaseBase';
atpGroup.add(synthaseBase);

// Membrane
const membraneMat = new THREE.MeshStandardMaterial({ color: 0x886644, transparent: true, opacity: 0.5, side: THREE.DoubleSide });
const membrane = new THREE.Mesh(new THREE.BoxGeometry(4, 0.15, 3), membraneMat);
membrane.name = 'membrane';
atpGroup.add(membrane);

// F0 subunit (in membrane)
const f0 = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.5, 12), 
  new THREE.MeshStandardMaterial({ color: 0xaa66cc, emissive: 0xaa66cc, emissiveIntensity: 0.3 })
);
f0.name = 'f0Subunit';
atpGroup.add(f0);

// Central stalk (gamma subunit)
const gamma = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.5, 8),
  new THREE.MeshStandardMaterial({ color: 0xffaa00, emissive: 0xffaa00, emissiveIntensity: 0.3 })
);
gamma.name = 'gammaSubunit';
gamma.position.y = 0.82;
atpGroup.add(gamma);

// F1 head (alpha/beta subunits)
const f1Group = new THREE.Group();
f1Group.name = 'f1Head';
for (let i = 0; i < 6; i++) {
  const angle = (i / 6) * Math.PI * 2;
  const subunit = new THREE.Mesh(
    new THREE.SphereGeometry(0.25, 12, 12),
    new THREE.MeshStandardMaterial({ 
      color: i % 2 === 0 ? 0x4488ff : 0x44ff88, 
      emissive: i % 2 === 0 ? 0x4488ff : 0x44ff88, 
      emissiveIntensity: 0.2 
    })
  );
  subunit.name = 'f1Subunit_' + i;
  subunit.position.set(Math.cos(angle) * 0.4, 0, Math.sin(angle) * 0.4);
  f1Group.add(subunit);
}
f1Group.position.y = 1.6;
atpGroup.add(f1Group);

// Proton indicators
const protonGroup = new THREE.Group();
protonGroup.name = 'protons';
for (let i = 0; i < 12; i++) {
  const proton = new THREE.Mesh(
    new THREE.SphereGeometry(0.06, 8, 8),
    new THREE.MeshStandardMaterial({ color: 0xff4444, emissive: 0xff4444, emissiveIntensity: 0.8 })
  );
  proton.name = 'proton_' + i;
  proton.userData.angle = (i / 12) * Math.PI * 2;
  proton.userData.speed = 0.5 + Math.random() * 0.5;
  protonGroup.add(proton);
}
atpGroup.add(protonGroup);

// ATP molecules produced
for (let i = 0; i < 3; i++) {
  const atpMol = new THREE.Group();
  atpMol.name = 'atpMolecule_' + i;
  // Adenine base
  const adenine = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.15, 0.05), 
    new THREE.MeshStandardMaterial({ color: 0x00aa44, emissive: 0x00aa44, emissiveIntensity: 0.4 }));
  adenine.name = 'adenine_' + i;
  atpMol.add(adenine);
  // Ribose sugar
  const ribose = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.1, 0.05),
    new THREE.MeshStandardMaterial({ color: 0xffaa00, emissive: 0xffaa00, emissiveIntensity: 0.3 }));
  ribose.name = 'ribose_' + i;
  ribose.position.x = 0.15;
  atpMol.add(ribose);
  // Three phosphate groups
  for (let p = 0; p < 3; p++) {
    const phosphate = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8),
      new THREE.MeshStandardMaterial({ color: 0xff4444, emissive: 0xff4444, emissiveIntensity: 0.5 }));
    phosphate.name = 'phosphate_' + i + '_' + p;
    phosphate.position.x = 0.3 + p * 0.15;
    atpMol.add(phosphate);
  }
  atpMol.position.set(1.5 + i * 0.8, 2, 0);
  atpMol.userData.floatOffset = i * 2;
  atpGroup.add(atpMol);
}

atpGroup.position.set(0, 4, 5);
scene.add(atpGroup);

// ==================== PARTICLE SYSTEMS ====================
// Floating particles in lab
const particleCount = 500;
const particlesGeo = new THREE.BufferGeometry();
const particlePositions = new Float32Array(particleCount * 3);
const particleColors = new Float32Array(particleCount * 3);
for (let i = 0; i < particleCount; i++) {
  particlePositions[i * 3] = (Math.random() - 0.5) * 40;
  particlePositions[i * 3 + 1] = Math.random() * 12;
  particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 30;
  const c = new THREE.Color().setHSL(Math.random() * 0.3 + 0.5, 0.8, 0.6);
  particleColors[i * 3] = c.r;
  particleColors[i * 3 + 1] = c.g;
  particleColors[i * 3 + 2] = c.b;
}
particlesGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
particlesGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));
const particlesMat = new THREE.PointsMaterial({ size: 0.05, vertexColors: true, transparent: true, opacity: 0.6 });
const particles = new THREE.Points(particlesGeo, particlesMat);
particles.name = 'labParticles';
scene.add(particles);

// ==================== INTERACTIVITY ====================
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let selectedObject = null;
let hoveredObject = null;

// Clickable objects data
const interactiveData = {
  'dnaHelix': {
    title: '🧬 DNA Double Helix',
    info: 'Deoxyribonucleic acid (DNA) is a double-stranded helix held together by hydrogen bonds between complementary base pairs: Adenine-Thymine (2 H-bonds) and Guanine-Cytosine (3 H-bonds). The sugar-phosphate backbone runs antiparallel (5\'→3\' and 3\'→5\'). Each full turn = 3.4nm with ~10 base pairs.',
    concept: 'Central Dogma: DNA → mRNA (Transcription) → Protein (Translation). DNA replication is semi-conservative (Meselson-Stahl experiment).',
    experiment: 'Click to simulate DNA replication fork!'
  },
  'cellModel': {
    title: '🔬 Eukaryotic Cell',
    info: 'A eukaryotic cell contains membrane-bound organelles. The nucleus houses DNA, mitochondria perform oxidative phosphorylation (ATP synthesis via electron transport chain), the ER handles protein folding (rough ER) and lipid synthesis (smooth ER), and ribosomes translate mRNA into proteins.',
    concept: 'Mitochondria have their own circular DNA (mtDNA) — evidence of endosymbiotic theory (Lynn Margulis). The inner mitochondrial membrane creates the proton gradient for chemiosmosis.',
    experiment: 'Click to visualize electron transport chain!'
  },
  'waterMolecule': {
    title: '💧 Water (H₂O)',
    info: 'Water has a bent molecular geometry (bond angle 104.5°) due to two lone pairs on oxygen. It exhibits hydrogen bonding, giving it high specific heat (4.184 J/g·K), high heat of vaporization, and universal solvent properties.',
    concept: 'VSEPR Theory: 4 electron domains (2 bonding + 2 lone pairs) → bent shape. Oxygen is sp³ hybridized. Dipole moment = 1.85 D.',
    experiment: 'Explore hydrogen bonding network!'
  },
  'benzeneMolecule': {
    title: '⬡ Benzene (C₆H₆)',
    info: 'Benzene is an aromatic hydrocarbon with a planar hexagonal ring. All C-C bonds are equal (1.40 Å) due to resonance/delocalization of 6 π electrons across the ring. Each carbon is sp² hybridized.',
    concept: 'Hückel\'s Rule: Aromatic if (4n+2) π electrons, planar, cyclic, conjugated. Benzene: 6 π electrons → n=1 → aromatic! Resonance energy = 150 kJ/mol.',
    experiment: 'Visualize molecular orbitals!'
  },
  'pendulum': {
    title: '🔄 Simple Pendulum',
    info: 'Period T = 2π√(L/g), independent of mass and amplitude (for small angles < 15°). Demonstrates simple harmonic motion where restoring force F = -mg·sin(θ) ≈ -mgθ for small θ.',
    concept: 'Energy conservation: At max displacement, all energy is potential (mgh). At lowest point, all kinetic (½mv²). Total mechanical energy E = ½mL²ω² is conserved (no friction).',
    experiment: 'Adjust length and observe period change!'
  },
  'emCoil': {
    title: '🧲 Electromagnetic Coil',
    info: 'A solenoid creates a uniform magnetic field B = μ₀nI inside the coil (n = turns/length, I = current). Faraday\'s law: changing magnetic flux induces EMF = -dΦ/dt.',
    concept: 'Maxwell\'s Equations unify electricity and magnetism. Lenz\'s law: induced current opposes the change causing it. Applications: transformers, MRI machines, electric motors.',
    experiment: 'Adjust current and see field strength!'
  },
  'prism': {
    title: '🌈 Light Dispersion (Prism)',
    info: 'White light separates into spectrum (ROYGBIV) because refractive index depends on wavelength (dispersion). Snell\'s law: n₁sinθ₁ = n₂sinθ₂. Shorter wavelengths (violet) refract more.',
    concept: 'Cauchy\'s equation: n(λ) = A + B/λ² + C/λ⁴. This wavelength dependence causes chromatic aberration in lenses. Newton first demonstrated this with prisms in 1666.',
    experiment: 'Change prism material and angle!'
  },
  'atpSynthesis': {
    title: '⚡ ATP Synthase (Chemiosmosis)',
    info: 'ATP synthase is a molecular rotary motor enzyme. Protons (H⁺) flow through F0 subunit down electrochemical gradient, causing rotation of the γ-subunit, which drives conformational changes in F1 to catalyze: ADP + Pi → ATP.',
    concept: 'The proton-motive force (Δp = ΔΨ - 2.3RT/F · ΔpH) across the inner mitochondrial membrane drives ATP synthesis. ~4 H⁺ per ATP. Oxidative phosphorylation produces ~30-32 ATP per glucose.',
    experiment: 'Watch the molecular motor in action!'
  }
};

// ==================== UI SYSTEM ====================
const uiContainer = document.createElement('div');
uiContainer.id = 'ui-container';
uiContainer.innerHTML = `
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
  
  * { box-sizing: border-box; margin: 0; padding: 0; }
  
  #ui-container {
    font-family: 'Inter', sans-serif;
    position: fixed;
    top: 0; left: 0; width: 100%; height: 100%;
    pointer-events: none;
    z-index: 100;
    overflow: hidden;
  }
  
  #top-bar {
    position: fixed;
    top: 10px; left: 50%;
    transform: translateX(-50%);
    background: rgba(20, 20, 40, 0.85);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(100, 100, 200, 0.2);
    border-radius: 12px;
    padding: 10px 24px;
    display: flex;
    align-items: center;
    gap: 16px;
    pointer-events: auto;
    max-width: 95vw;
  }
  
  #top-bar h1 {
    font-size: 16px;
    font-weight: 600;
    color: #fff;
    white-space: nowrap;
  }
  
  #top-bar .subtitle {
    font-size: 11px;
    color: rgba(255,255,255,0.5);
    white-space: nowrap;
  }
  
  .btn {
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.12);
    color: #fff;
    padding: 6px 14px;
    border-radius: 8px;
    font-size: 12px;
    font-family: 'Inter', sans-serif;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
    pointer-events: auto;
  }
  
  .btn:hover { background: rgba(255,255,255,0.12); border-color: rgba(255,255,255,0.25); }
  .btn.active { background: rgba(0, 255, 136, 0.15); border-color: rgba(0, 255, 136, 0.4); color: #00ff88; }
  
  #info-panel {
    position: fixed;
    right: 10px;
    top: 60px;
    width: 320px;
    max-height: calc(100vh - 140px);
    background: rgba(20, 20, 40, 0.9);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(100, 100, 200, 0.2);
    border-radius: 12px;
    padding: 16px;
    pointer-events: auto;
    overflow-y: auto;
    display: none;
    scrollbar-width: thin;
    scrollbar-color: rgba(255,255,255,0.2) transparent;
  }
  
  #info-panel::-webkit-scrollbar { width: 4px; }
  #info-panel::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 4px; }
  
  #info-panel h2 {
    font-size: 16px;
    font-weight: 600;
    color: #fff;
    margin-bottom: 10px;
  }
  
  #info-panel .info-section {
    margin-bottom: 12px;
  }
  
  #info-panel .info-label {
    font-size: 10px;
    font-weight: 600;
    color: rgba(0, 255, 136, 0.8);
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 4px;
  }
  
  #info-panel .info-text {
    font-size: 12px;
    color: rgba(255,255,255,0.75);
    line-height: 1.6;
  }
  
  #info-panel .close-btn {
    position: absolute;
    top: 10px;
    right: 12px;
    background: none;
    border: none;
    color: rgba(255,255,255,0.4);
    font-size: 18px;
    cursor: pointer;
    pointer-events: auto;
  }
  
  #info-panel .close-btn:hover { color: #fff; }
  
  #chatbot {
    position: fixed;
    left: 10px;
    bottom: 10px;
    width: 360px;
    max-height: 420px;
    background: rgba(20, 20, 40, 0.92);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(100, 100, 200, 0.2);
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    pointer-events: auto;
    overflow: hidden;
    transition: all 0.3s ease;
  }
  
  #chatbot.minimized {
    max-height: 44px;
    width: 200px;
  }
  
  #chatbot-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 14px;
    border-bottom: 1px solid rgba(255,255,255,0.08);
    cursor: pointer;
  }
  
  #chatbot-header span {
    font-size: 13px;
    font-weight: 600;
    color: #fff;
  }
  
  #chatbot-header .toggle-btn {
    background: none;
    border: none;
    color: rgba(255,255,255,0.5);
    font-size: 16px;
    cursor: pointer;
  }
  
  #chat-messages {
    flex: 1;
    overflow-y: auto;
    padding: 10px 14px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    max-height: 300px;
    scrollbar-width: thin;
    scrollbar-color: rgba(255,255,255,0.2) transparent;
  }
  
  #chat-messages::-webkit-scrollbar { width: 4px; }
  #chat-messages::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 4px; }
  
  .chat-msg {
    font-size: 12px;
    line-height: 1.5;
    padding: 8px 10px;
    border-radius: 8px;
    max-width: 90%;
    word-wrap: break-word;
  }
  
  .chat-msg.bot {
    background: rgba(0, 255, 136, 0.08);
    border: 1px solid rgba(0, 255, 136, 0.15);
    color: rgba(255,255,255,0.85);
    align-self: flex-start;
  }
  
  .chat-msg.user {
    background: rgba(68, 136, 255, 0.12);
    border: 1px solid rgba(68, 136, 255, 0.2);
    color: rgba(255,255,255,0.9);
    align-self: flex-end;
  }
  
  #chat-input-area {
    display: flex;
    gap: 6px;
    padding: 10px;
    border-top: 1px solid rgba(255,255,255,0.08);
  }
  
  #chat-input {
    flex: 1;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 8px;
    padding: 8px 10px;
    color: #fff;
    font-size: 12px;
    font-family: 'Inter', sans-serif;
    outline: none;
    transition: border-color 0.2s;
  }
  
  #chat-input:focus { border-color: rgba(0, 255, 136, 0.4); }
  #chat-input::placeholder { color: rgba(255,255,255,0.3); }
  
  #chat-send {
    background: rgba(0, 255, 136, 0.15);
    border: 1px solid rgba(0, 255, 136, 0.3);
    color: #00ff88;
    padding: 8px 14px;
    border-radius: 8px;
    font-size: 12px;
    font-family: 'Inter', sans-serif;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  #chat-send:hover { background: rgba(0, 255, 136, 0.25); }

  
  #ai-guide {
    position: fixed;
    bottom: 70px;
    right: 10px;
    width: 280px;
    background: rgba(20, 20, 40, 0.92);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 204, 0, 0.25);
    border-radius: 12px;
    padding: 12px 14px;
    pointer-events: auto;
    display: none;
    transition: all 0.3s;
  }
  
  #ai-guide .guide-header {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 8px;
  }
  
  #ai-guide .guide-header span {
    font-size: 12px;
    font-weight: 600;
    color: #ffcc00;
  }
  
  #ai-guide .guide-text {
    font-size: 11px;
    color: rgba(255,255,255,0.75);
    line-height: 1.6;
  }
  
  #ai-guide .close-guide {
    position: absolute;
    top: 8px;
    right: 10px;
    background: none;
    border: none;
    color: rgba(255,255,255,0.3);
    font-size: 14px;
    cursor: pointer;
  }
  
  #experiment-controls {
    position: fixed;
    left: 10px;
    top: 60px;
    background: rgba(20, 20, 40, 0.9);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(100, 100, 200, 0.2);
    border-radius: 12px;
    padding: 14px;
    pointer-events: auto;
    width: 220px;
    display: none;
  }
  
  #experiment-controls h3 {
    font-size: 13px;
    color: #fff;
    margin-bottom: 10px;
  }
  
  .slider-group {
    margin-bottom: 10px;
  }
  
  .slider-group label {
    font-size: 10px;
    color: rgba(255,255,255,0.5);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  .slider-group input[type="range"] {
    width: 100%;
    margin-top: 4px;
    -webkit-appearance: none;
    height: 4px;
    border-radius: 2px;
    background: rgba(255,255,255,0.1);
    outline: none;
  }
  
  .slider-group input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: #00ff88;
    cursor: pointer;
  }
  
  .slider-value {
    font-size: 11px;
    color: #00ff88;
    float: right;
  }
  
  #tooltip {
    position: fixed;
    background: rgba(0,0,0,0.8);
    border: 1px solid rgba(255,255,255,0.15);
    border-radius: 6px;
    padding: 6px 10px;
    font-size: 11px;
    color: #fff;
    font-family: 'Inter', sans-serif;
    pointer-events: none;
    display: none;
    z-index: 200;
    max-width: 200px;
  }
  
  #notification {
    position: fixed;
    top: 60px;
    left: 50%;
    transform: translateX(-50%) translateY(-20px);
    background: rgba(0, 255, 136, 0.15);
    border: 1px solid rgba(0, 255, 136, 0.3);
    border-radius: 10px;
    padding: 10px 20px;
    color: #00ff88;
    font-size: 13px;
    font-family: 'Inter', sans-serif;
    pointer-events: none;
    opacity: 0;
    transition: all 0.4s ease;
    z-index: 300;
  }
  
  #notification.show {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
</style>

<div id="top-bar">
  <div>
    <h1>🔬 STREAM</h1>
    <div class="subtitle">Biochemistry Simulation</div>
  </div>
  <button class="btn" onclick="focusStation('bio')">🧬 Biology</button>
  <button class="btn" onclick="focusStation('chem')">⚗️ Chemistry</button>
  <button class="btn" onclick="focusStation('phys')">⚡ Physics</button>
  <button class="btn" onclick="focusStation('central')">🔬 Experiment</button>
  <button class="btn" onclick="resetCamera()">↻ Reset</button>
</div>

<div id="info-panel">
  <button class="close-btn" onclick="closeInfoPanel()">✕</button>
  <h2 id="info-title"></h2>
  <div class="info-section">
    <div class="info-label">Description</div>
    <div class="info-text" id="info-desc"></div>
  </div>
  <div class="info-section">
    <div class="info-label">Key Concept</div>
    <div class="info-text" id="info-concept"></div>
  </div>
  <div class="info-section">
    <div class="info-label">Experiment</div>
    <div class="info-text" id="info-experiment" style="color: #ffcc00;"></div>
  </div>
</div>

<div id="experiment-controls">
  <h3>⚙️ Experiment Controls</h3>
  <div class="slider-group">
    <label>Pendulum Length <span class="slider-value" id="pendLenVal">2.0m</span></label>
    <input type="range" min="0.5" max="4" step="0.1" value="2" id="pendulumLength" oninput="updatePendulum()">
  </div>
  <div class="slider-group">
    <label>Gravity (g) <span class="slider-value" id="gravVal">9.81</span></label>
    <input type="range" min="1" max="25" step="0.1" value="9.81" id="gravitySlider" oninput="updateGravity()">
  </div>
  <div class="slider-group">
    <label>Reaction Temp (°C) <span class="slider-value" id="tempVal">25°C</span></label>
    <input type="range" min="0" max="200" step="1" value="25" id="tempSlider" oninput="updateTemp()">
  </div>
  <div class="slider-group">
    <label>pH Level <span class="slider-value" id="phVal">7.0</span></label>
    <input type="range" min="0" max="14" step="0.1" value="7" id="phSlider" oninput="updatePH()">
  </div>
  <div class="slider-group">
    <label>ATP Synthase Speed <span class="slider-value" id="atpSpeedVal">1.0x</span></label>
    <input type="range" min="0.1" max="5" step="0.1" value="1" id="atpSpeedSlider" oninput="updateATPSpeed()">
  </div>
</div>

<div id="chatbot">
  <div id="chatbot-header" onclick="toggleChat()">
    <span>🤖 AI Lab Assistant</span>
    <button class="toggle-btn" id="chat-toggle">−</button>
  </div>
  <div id="chat-messages">
    <div class="chat-msg bot">Welcome to the BioChemPhys Lab! 🔬 I can help with:<br>
    • Biology (DNA, cells, ATP synthesis, genetics)<br>
    • Chemistry (molecular geometry, reactions, pH)<br>
    • Physics (mechanics, E&M, optics)<br><br>
  </div>
  </div>
  <div id="chat-input-area">
    <input type="text" id="chat-input" placeholder="Ask about any concept..." onkeydown="if(event.key==='Enter')sendChat()">
    <button id="chat-send" onclick="sendChat()">Send</button>
  </div>
</div>

<div id="ai-guide">
  <button class="close-guide" onclick="hideGuide()">✕</button>
  <div class="guide-header">
    <span>💡 AI Guide</span>
  </div>
  <div class="guide-text" id="guide-text"></div>
</div>

<div id="tooltip"></div>
<div id="notification"></div>
`;
document.body.appendChild(uiContainer);

// ==================== EXPERIMENT STATE ====================
let pendulumLengthVal = 2;
let gravityVal = 9.81;
let tempVal = 25;
let phVal = 7;
let atpSpeedVal = 1;
let pendulumAngle = Math.PI / 4;
let pendulumAngularVelocity = 0;

window.updatePendulum = () => {
  pendulumLengthVal = parseFloat(document.getElementById('pendulumLength').value);
  document.getElementById('pendLenVal').textContent = pendulumLengthVal.toFixed(1) + 'm';
  const period = 2 * Math.PI * Math.sqrt(pendulumLengthVal / gravityVal);
  showGuide(`Pendulum length: ${pendulumLengthVal.toFixed(1)}m\nPeriod T = 2π√(L/g) = ${period.toFixed(2)}s\nFrequency f = ${(1/period).toFixed(2)} Hz`);
};

window.updateGravity = () => {
  gravityVal = parseFloat(document.getElementById('gravitySlider').value);
  document.getElementById('gravVal').textContent = gravityVal.toFixed(1);
  const period = 2 * Math.PI * Math.sqrt(pendulumLengthVal / gravityVal);
  let planet = 'Custom';
  if (Math.abs(gravityVal - 9.81) < 0.5) planet = 'Earth';
  else if (Math.abs(gravityVal - 1.62) < 0.5) planet = 'Moon';
  else if (Math.abs(gravityVal - 3.72) < 0.5) planet = 'Mars';
  else if (Math.abs(gravityVal - 24.79) < 0.5) planet = 'Jupiter';
  showGuide(`Gravity: ${gravityVal.toFixed(1)} m/s² (${planet})\nPendulum period: ${period.toFixed(2)}s\nHigher gravity → faster oscillation`);
};

window.updateTemp = () => {
  tempVal = parseFloat(document.getElementById('tempSlider').value);
  document.getElementById('tempVal').textContent = tempVal + '°C';
  const kelvin = tempVal + 273.15;
  const rateMultiplier = Math.pow(2, (tempVal - 25) / 10); // Van't Hoff rule
  showGuide(`Temperature: ${tempVal}°C (${kelvin.toFixed(1)}K)\nVan't Hoff Rule: Rate ≈ ${rateMultiplier.toFixed(1)}x baseline\n(Rate doubles every 10°C increase)\nArrhenius: k = Ae^(-Ea/RT)`);
};

window.updatePH = () => {
  phVal = parseFloat(document.getElementById('phSlider').value);
  document.getElementById('phVal').textContent = phVal.toFixed(1);
  const hConc = Math.pow(10, -phVal);
  const ohConc = Math.pow(10, -(14 - phVal));
  let nature = 'Neutral';
  if (phVal < 6.8) nature = 'Acidic';
  else if (phVal > 7.2) nature = 'Basic/Alkaline';
  showGuide(`pH: ${phVal.toFixed(1)} — ${nature}\n[H⁺] = ${hConc.toExponential(2)} M\n[OH⁻] = ${ohConc.toExponential(2)} M\npH + pOH = 14 (Kw = 10⁻¹⁴)`);
  // Update beaker colors based on pH
  updateBeakerColors();
};

window.updateATPSpeed = () => {
  atpSpeedVal = parseFloat(document.getElementById('atpSpeedSlider').value);
  document.getElementById('atpSpeedVal').textContent = atpSpeedVal.toFixed(1) + 'x';
  const atpPerSec = (100 * atpSpeedVal).toFixed(0);
  showGuide(`ATP Synthase rotation: ${atpSpeedVal.toFixed(1)}x speed\n~${atpPerSec} ATP molecules/sec\nNatural speed: ~100 rotations/sec\nEach rotation produces ~3 ATP`);
};

function updateBeakerColors() {
  const hue = phVal / 14;
  const color = new THREE.Color().setHSL(hue * 0.8, 0.9, 0.5);
  const beakerLiquids = ['beakerGreen_liquid', 'beakerBlue_liquid', 'beakerRed_liquid'];
  chemTable.traverse(child => {
    if (child.name && child.name.includes('_liquid')) {
      child.material.color.copy(color);
      child.material.emissive.copy(color);
    }
  });
}

// ==================== NAVIGATION ====================
window.focusStation = (station) => {
  let target, pos;
  switch (station) {
    case 'bio':
      target = new THREE.Vector3(-10, 5, -5);
      pos = new THREE.Vector3(-10, 7, 3);
      showNotification('📍 Biology Station — Click objects to explore');
      break;
    case 'chem':
      target = new THREE.Vector3(0, 5, -5);
      pos = new THREE.Vector3(0, 7, 3);
      showNotification('📍 Chemistry Station — Click objects to explore');
      break;
    case 'phys':
      target = new THREE.Vector3(10, 5, -5);
      pos = new THREE.Vector3(10, 7, 3);
      showNotification('📍 Physics Station — Click objects to explore');
      break;
    case 'central':
      target = new THREE.Vector3(0, 5, 5);
      pos = new THREE.Vector3(0, 8, 14);
      showNotification('📍 Experiment Zone — ATP Synthesis');
      break;
  }
  animateCamera(pos, target);
  document.getElementById('experiment-controls').style.display = 'block';
};

window.resetCamera = () => {
  animateCamera(new THREE.Vector3(0, 8, 18), new THREE.Vector3(0, 3, 0));
  document.getElementById('experiment-controls').style.display = 'none';
};

function animateCamera(targetPos, lookAt) {
  const startPos = camera.position.clone();
  const startTarget = controls.target.clone();
  let progress = 0;
  const duration = 60;
  function step() {
    progress++;
    const t = Math.min(progress / duration, 1);
    const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    camera.position.lerpVectors(startPos, targetPos, ease);
    controls.target.lerpVectors(startTarget, lookAt, ease);
    controls.update();
    if (t < 1) requestAnimationFrame(step);
  }
  step();
}

// ==================== INFO PANEL ====================
window.closeInfoPanel = () => {
  document.getElementById('info-panel').style.display = 'none';
};

function showInfoPanel(key) {
  const data = interactiveData[key];
  if (!data) return;
  document.getElementById('info-title').textContent = data.title;
  document.getElementById('info-desc').textContent = data.info;
  document.getElementById('info-concept').textContent = data.concept;
  document.getElementById('info-experiment').textContent = data.experiment;
  document.getElementById('info-panel').style.display = 'block';
}

// ==================== NOTIFICATION ====================
function showNotification(text) {
  const el = document.getElementById('notification');
  el.textContent = text;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 3000);
}

// ==================== AI GUIDE ====================
function showGuide(text) {
  const el = document.getElementById('ai-guide');
  document.getElementById('guide-text').textContent = text;
  el.style.display = 'block';
  clearTimeout(el._hideTimer);
  el._hideTimer = setTimeout(() => { el.style.display = 'none'; }, 8000);
}

window.hideGuide = () => {
  document.getElementById('ai-guide').style.display = 'none';
};

// ==================== CHATBOT AI ====================
const knowledgeBase = {
  // Biology
  dna: `DNA (Deoxyribonucleic Acid) is a double helix with antiparallel strands. Base pairing: A-T (2 H-bonds), G-C (3 H-bonds). Chargaff's rules: %A=%T, %G=%C. Replication: helicase unwinds, primase adds RNA primer, DNA polymerase III synthesizes (5'→3'), ligase seals Okazaki fragments on lagging strand. PCR amplification uses Taq polymerase (thermostable from Thermus aquaticus).`,
  rna: `RNA types: mRNA (carries genetic code), tRNA (carries amino acids, has anticodon), rRNA (ribosomal structure). Transcription: RNA polymerase reads template 3'→5', synthesizes mRNA 5'→3'. mRNA processing: 5' cap (7-methylguanosine), 3' poly-A tail, splicing (introns removed by spliceosome). Codon: 3 nucleotides = 1 amino acid. 64 codons, 20 amino acids → degeneracy.`,
  cell: `Eukaryotic cell organelles: Nucleus (DNA storage, transcription), Mitochondria (oxidative phosphorylation, ~30-32 ATP/glucose), ER (rough: protein synthesis, smooth: lipid synthesis), Golgi (protein modification/sorting), Lysosomes (pH 5, hydrolytic enzymes), Peroxisomes (H₂O₂ metabolism). Membrane: phospholipid bilayer with embedded proteins (fluid mosaic model by Singer & Nicolson, 1972).`,
  atp: `ATP (Adenosine Triphosphate) is the energy currency. ATP synthase is a rotary molecular motor with F0 (proton channel in membrane) and F1 (catalytic head). Chemiosmotic theory (Peter Mitchell, 1961): proton-motive force drives ATP synthesis. Electron Transport Chain: Complex I (NADH→Q), II (FADH₂→Q), III (Q→CytC), IV (CytC→O₂). ~10 H⁺ per NADH, ~6 per FADH₂. P/O ratio: ~2.5 (NADH), ~1.5 (FADH₂).`,
  genetics: `Mendelian genetics: Law of Segregation (alleles separate in meiosis), Law of Independent Assortment (genes on different chromosomes). Extensions: incomplete dominance (blending), codominance (both expressed), epistasis (gene interaction), polygenic traits (multiple genes). Hardy-Weinberg: p² + 2pq + q² = 1 (no evolution). Deviations: mutation, selection, drift, migration, non-random mating.`,
  protein: `Protein structure: Primary (AA sequence), Secondary (α-helix, β-sheet — H-bonds), Tertiary (3D fold — hydrophobic core, disulfide bonds, ionic interactions), Quaternary (multi-subunit). Enzyme kinetics: Michaelis-Menten: v = Vmax[S]/(Km+[S]). Km = substrate conc at ½Vmax. Lineweaver-Burk: 1/v vs 1/[S]. Competitive inhibitor: ↑Km, same Vmax. Non-competitive: same Km, ↓Vmax.`,
  photosynthesis: `Photosynthesis: 6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂. Light reactions (thylakoid): PSII absorbs 680nm, splits H₂O (photolysis), PSI absorbs 700nm, produces NADPH. Calvin Cycle (stroma): CO₂ fixation by RuBisCO, 3PG → G3P, regeneration of RuBP. C4 plants: PEP carboxylase (no photorespiration). CAM plants: temporal separation (stomata open at night).`,
  
  // Chemistry
  bonding: `Chemical bonding: Ionic (electron transfer, high mp, conducts in solution), Covalent (electron sharing, directional), Metallic (electron sea, malleable). VSEPR: electron domains determine geometry. sp=linear(180°), sp²=trigonal planar(120°), sp³=tetrahedral(109.5°), sp³d=TBP, sp³d²=octahedral. Molecular orbital theory: bonding (σ,π) and antibonding (σ*,π*). Bond order = (bonding-antibonding)/2.`,
  organic: `Organic chemistry: Functional groups determine reactivity. Alkanes (-C-C-), Alkenes (C=C, addition rxns), Alkynes (C≡C), Alcohols (-OH), Aldehydes (-CHO), Ketones (C=O), Carboxylic acids (-COOH), Amines (-NH₂), Esters (-COO-). SN1: 3°>2°, polar protic solvent, racemization. SN2: CH₃>1°>2°, polar aprotic, inversion (Walden). E1/E2: Zaitsev's rule (more substituted alkene preferred).`,
  equilibrium: `Chemical equilibrium: K = [products]/[reactants]. Le Chatelier's principle: system shifts to counteract stress. ΔG = ΔG° + RTlnQ. At equilibrium: ΔG = 0, Q = K. ΔG° = -RTlnK. Temperature effect: exothermic → ↑T → K decreases. Pressure: affects gaseous equilibria (shift toward fewer moles of gas). Catalyst: speeds both directions equally, doesn't change K.`,
  acid_base: `Acids & Bases: Arrhenius (H⁺/OH⁻), Brønsted-Lowry (proton donor/acceptor), Lewis (e⁻ pair acceptor/donor). pH = -log[H⁺]. Strong acids: HCl, H₂SO₄, HNO₃, etc (fully dissociate). Buffers: weak acid + conjugate base. Henderson-Hasselbalch: pH = pKa + log([A⁻]/[HA]). Buffer capacity best when pH ≈ pKa. Titration: equivalence point (moles acid = moles base).`,
  thermo_chem: `Thermochemistry: ΔH (enthalpy), ΔS (entropy), ΔG (Gibbs free energy). ΔG = ΔH - TΔS. Spontaneous: ΔG < 0. Hess's Law: ΔH is path-independent. Bond energy: ΔH = Σ(bonds broken) - Σ(bonds formed). Calorimetry: q = mcΔT. Standard conditions: 25°C, 1 atm, 1M. Entropy: S = kB·ln(W). 2nd law: ΔSuniverse > 0 for spontaneous processes.`,
  redox: `Redox: Oxidation = loss of electrons (OIL), Reduction = gain (RIG). Oxidation states: assign using rules. Balancing redox in acidic/basic solution: half-reaction method. Electrochemistry: E°cell = E°cathode - E°anode. Nernst: E = E° - (RT/nF)lnQ. ΔG° = -nFE°. Faraday's law: m = (MIt)/(nF). Standard hydrogen electrode (SHE): E° = 0V by convention.`,

  // Physics
  mechanics: `Classical mechanics: Newton's laws — 1) Inertia (F=0 → constant v), 2) F=ma (acceleration proportional to net force), 3) Action-reaction (equal and opposite). Work: W = F·d·cosθ. KE = ½mv². PE(gravity) = mgh. Conservation of energy: ΔKE + ΔPE = Wnet. Momentum: p = mv, conserved in collisions. Elastic: KE conserved. Inelastic: KE not conserved but p is.`,
  waves: `Waves: v = fλ. Transverse (perpendicular oscillation) vs Longitudinal (parallel). Electromagnetic spectrum: radio, micro, IR, visible, UV, X-ray, gamma. E = hf = hc/λ. Superposition → interference (constructive: path diff = nλ, destructive: (n+½)λ). Diffraction: single slit minimum at sinθ = nλ/a. Double slit (Young's): bright fringes at dsinθ = nλ.`,
  electromagnetism: `Electromagnetism: Coulomb's law: F = kq₁q₂/r². Electric field E = F/q. Gauss's law: ∮E·dA = Qenc/ε₀. Magnetic force: F = qv×B. Solenoid: B = μ₀nI. Faraday: EMF = -dΦB/dt. Maxwell's equations unify E&M. EM waves: c = 1/√(μ₀ε₀) ≈ 3×10⁸ m/s. LC circuits: oscillation at f = 1/(2π√LC).`,
  quantum: `Quantum mechanics: Wave-particle duality (de Broglie: λ = h/p). Heisenberg uncertainty: ΔxΔp ≥ ℏ/2. Schrödinger equation: Ĥψ = Eψ. Hydrogen atom: Eₙ = -13.6/n² eV. Quantum numbers: n (principal), l (angular, 0→n-1), ml (-l→+l), ms (±½). Pauli exclusion: no two electrons same 4 quantum numbers. Electron configuration: Aufbau, Hund's rule.`,
  thermodynamics: `Thermodynamics: 0th law (thermal equilibrium → temperature), 1st law (ΔU = Q - W, energy conservation), 2nd law (entropy always increases in isolated system), 3rd law (S→0 as T→0K). Ideal gas: PV = nRT. Processes: isothermal (ΔT=0), adiabatic (Q=0), isobaric (ΔP=0), isochoric (ΔV=0). Carnot efficiency: η = 1 - Tc/Th. Heat engines, refrigerators.`,
  optics: `Optics: Reflection (θi = θr), Refraction (Snell: n₁sinθ₁ = n₂sinθ₂). Total internal reflection: θc = sin⁻¹(n₂/n₁). Lenses: 1/f = 1/do + 1/di. Magnification: m = -di/do. Converging lens (convex): real image if do>f. Diverging lens (concave): always virtual. Dispersion: n depends on λ. Polarization: Malus' law: I = I₀cos²θ.`,
  nuclear: `Nuclear physics: Binding energy: E = Δmc². Strong nuclear force holds nucleus together (short range ~1fm). Radioactive decay: α (He-4 nucleus), β⁻ (n→p+e⁻+ν̄), β⁺ (p→n+e⁺+ν), γ (photon). Half-life: N(t) = N₀(½)^(t/t½). Nuclear fission: heavy nuclei split (U-235). Fusion: light nuclei combine (H→He, powers the sun). E=mc² energy-mass equivalence.`,

  // Biochemistry
  enzymes: `Enzymes are biological catalysts. Lock-and-key model (Fischer) vs Induced fit (Koshland). Michaelis-Menten: v = Vmax[S]/(Km+[S]). Km is the substrate concentration at half-maximum velocity — lower Km = higher affinity. Allosteric regulation: positive (enhances) or negative (inhibits) effectors bind at allosteric site. Feedback inhibition: end-product inhibits first enzyme in pathway.`,
  metabolism: `Central metabolic pathways: Glycolysis (glucose → 2 pyruvate, 2 ATP, 2 NADH), Pyruvate dehydrogenase → Acetyl-CoA, Krebs/TCA cycle (2 CO₂, 3 NADH, 1 FADH₂, 1 GTP per turn), Oxidative phosphorylation (ETC + chemiosmosis → ~30-32 ATP). Gluconeogenesis: pyruvate → glucose (irreversible steps bypassed). Pentose phosphate pathway: NADPH + ribose-5-phosphate.`,
  molecular_bio: `Central Dogma: DNA → RNA → Protein. DNA replication: semi-conservative, bidirectional from origins of replication. Transcription: initiation (promoter + TFs + RNA pol), elongation, termination. Translation: initiation (small subunit + mRNA + initiator tRNA at AUG), elongation (A-site, P-site, E-site), termination (release factors at stop codons). Post-translational modifications: phosphorylation, glycosylation, ubiquitination.`
};

function getAIResponse(query) {
  const q = query.toLowerCase();
  let responses = [];
  
  // Check knowledge base
  for (const [key, value] of Object.entries(knowledgeBase)) {
    const keywords = key.split('_');
    if (keywords.some(kw => q.includes(kw)) || q.includes(key)) {
      responses.push(value);
    }
  }
  
  // Contextual keyword matching
  if (q.includes('dna') || q.includes('double helix') || q.includes('nucleotide')) responses.push(knowledgeBase.dna);
  if (q.includes('rna') || q.includes('transcription') || q.includes('mrna') || q.includes('codon')) responses.push(knowledgeBase.rna);
  if (q.includes('cell') || q.includes('organelle') || q.includes('mitochondri')) responses.push(knowledgeBase.cell);
  if (q.includes('atp') || q.includes('synthase') || q.includes('chemiosmosis') || q.includes('phosphorylation')) responses.push(knowledgeBase.atp);
  if (q.includes('gene') || q.includes('mendel') || q.includes('allele') || q.includes('heredit')) responses.push(knowledgeBase.genetics);
  if (q.includes('protein') || q.includes('enzyme') || q.includes('michaelis') || q.includes('kinase')) responses.push(knowledgeBase.protein);
  if (q.includes('photo') && q.includes('synth')) responses.push(knowledgeBase.photosynthesis);
  if (q.includes('bond') || q.includes('vsepr') || q.includes('hybridiz')) responses.push(knowledgeBase.bonding);
  if (q.includes('organic') || q.includes('sn1') || q.includes('sn2') || q.includes('alkene') || q.includes('functional group')) responses.push(knowledgeBase.organic);
  if (q.includes('equilibrium') || q.includes('le chatelier') || q.includes('gibbs')) responses.push(knowledgeBase.equilibrium);
  if (q.includes('acid') || q.includes('base') || q.includes('ph') || q.includes('buffer') || q.includes('titrat')) responses.push(knowledgeBase.acid_base);
  if (q.includes('thermo') && (q.includes('chem') || q.includes('enthalp') || q.includes('entropy') || q.includes('hess'))) responses.push(knowledgeBase.thermo_chem);
  if (q.includes('redox') || q.includes('oxidation') || q.includes('reduction') || q.includes('electroch')) responses.push(knowledgeBase.redox);
  if (q.includes('newton') || q.includes('force') || q.includes('momentum') || q.includes('mechanic')) responses.push(knowledgeBase.mechanics);
  if (q.includes('wave') || q.includes('frequency') || q.includes('diffraction') || q.includes('interference')) responses.push(knowledgeBase.waves);
  if (q.includes('electromagnet') || q.includes('maxwell') || q.includes('faraday') || q.includes('coulomb') || q.includes('magnetic')) responses.push(knowledgeBase.electromagnetism);
  if (q.includes('quantum') || q.includes('schrodinger') || q.includes('heisenberg') || q.includes('orbital')) responses.push(knowledgeBase.quantum);
  if ((q.includes('thermo') && q.includes('dynamic')) || q.includes('carnot') || q.includes('entropy') || q.includes('ideal gas')) responses.push(knowledgeBase.thermodynamics);
  if (q.includes('optic') || q.includes('lens') || q.includes('refract') || q.includes('prism') || q.includes('light') || q.includes('snell')) responses.push(knowledgeBase.optics);
  if (q.includes('nuclear') || q.includes('radioact') || q.includes('fission') || q.includes('fusion') || q.includes('decay')) responses.push(knowledgeBase.nuclear);
  if (q.includes('metabol') || q.includes('glycol') || q.includes('krebs') || q.includes('tca')) responses.push(knowledgeBase.metabolism);
  if (q.includes('central dogma') || q.includes('translation') || q.includes('replicat')) responses.push(knowledgeBase.molecular_bio);
  
  // Mistake detection and guidance
  if (q.includes('mistake') || q.includes('wrong') || q.includes('error') || q.includes('help') || q.includes('confused')) {
    return "🔍 Let me help! Here are common mistakes to watch for:\n\n" +
      "• Biology: Remember DNA polymerase only works 5'→3'. The lagging strand needs Okazaki fragments!\n" +
      "• Chemistry: Don't confuse Ksp with Ka/Kb. Check stoichiometry!\n" +
      "• Physics: Always draw free body diagrams first. Check units!\n\n" +
      "Tell me specifically what concept you're struggling with, and I'll give detailed guidance.";
  }
  
  if (q.includes('experiment') || q.includes('try') || q.includes('simulate')) {
    return "🧪 Available experiments:\n\n" +
      "1. Use the sliders to adjust pendulum length and observe T = 2π√(L/g)\n" +
      "2. Change gravity to simulate different planets\n" +
      "3. Adjust temperature to see Van't Hoff rate changes\n" +
      "4. Change pH and watch solution colors shift\n" +
      "5. Speed up ATP synthase to study proton flow\n\n" +
      "Click on any 3D object for detailed information!";
  }
  
  // Remove duplicates
  responses = [...new Set(responses)];
  
  if (responses.length > 0) {
    return responses.slice(0, 2).join('\n\n');
  }
  
  return "I can help with biology (DNA, cells, genetics, enzymes, metabolism), chemistry (bonding, organic, equilibrium, acids/bases, redox), and physics (mechanics, waves, E&M, quantum, thermodynamics, optics, nuclear). Please ask about a specific topic! 🔬";
}

function addChatMessage(text, type) {
  const messages = document.getElementById('chat-messages');
  const msg = document.createElement('div');
  msg.className = 'chat-msg ' + type;
  msg.innerHTML = text.replace(/\n/g, '<br>');
  messages.appendChild(msg);
  messages.scrollTop = messages.scrollHeight;
}

window.sendChat = () => {
  const input = document.getElementById('chat-input');
  const text = input.value.trim();
  if (!text) return;
  addChatMessage(text, 'user');
  input.value = '';
  // Simulate typing delay
  setTimeout(() => {
    const response = getAIResponse(text);
    addChatMessage(response, 'bot');
  }, 300 + Math.random() * 500);
};

window.toggleChat = () => {
  const chatbot = document.getElementById('chatbot');
  chatbot.classList.toggle('minimized');
  document.getElementById('chat-toggle').textContent = chatbot.classList.contains('minimized') ? '+' : '−';
};

// ==================== CLICK INTERACTION ====================
function getParentInteractable(object) {
  let current = object;
  while (current) {
    if (current.name && interactiveData[current.name]) return current.name;
    current = current.parent;
  }
  // Check by name proximity
  const name = object.name || '';
  for (const key of Object.keys(interactiveData)) {
    if (name.includes(key) || (object.parent && object.parent.name && object.parent.name.includes(key))) {
      return key;
    }
  }
  return null;
}

renderer.domElement.addEventListener('click', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children, true);
  if (intersects.length > 0) {
    const hit = intersects[0].object;
    const key = getParentInteractable(hit);
    if (key) {
      showInfoPanel(key);
      showNotification(`📖 ${interactiveData[key].title}`);
    }
  }
});

// Hover tooltip
renderer.domElement.addEventListener('mousemove', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children, true);
  const tooltip = document.getElementById('tooltip');
  if (intersects.length > 0) {
    const key = getParentInteractable(intersects[0].object);
    if (key) {
      tooltip.textContent = interactiveData[key].title + ' — Click to learn';
      tooltip.style.display = 'block';
      tooltip.style.left = event.clientX + 15 + 'px';
      tooltip.style.top = event.clientY + 15 + 'px';
      renderer.domElement.style.cursor = 'pointer';
      return;
    }
  }
  tooltip.style.display = 'none';
  renderer.domElement.style.cursor = 'default';
});

// ==================== ANIMATION LOOP ====================
const clock = new THREE.Clock();

function animate() {
  const elapsed = clock.getElapsedTime();
  const delta = clock.getDelta();
  
  // DNA rotation
  dnaGroup.rotation.y = elapsed * 0.3;
  
  // Cell model gentle float
  cellGroup.position.y = 5.5 + Math.sin(elapsed * 0.8) * 0.3;
  cellGroup.rotation.y = elapsed * 0.15;
  
  // Mitochondria movement
  cellGroup.children.forEach(child => {
    if (child.name && child.name.startsWith('mitochondria')) {
      child.rotation.x += 0.005;
      child.rotation.z += 0.003;
    }
  });
  
  // Water molecule vibration
  waterMolecule.rotation.y = elapsed * 0.5;
  waterMolecule.position.y = 4.5 + Math.sin(elapsed * 1.5) * 0.1;
  
  // Benzene rotation
  benzene.rotation.z = elapsed * 0.4;
  benzene.rotation.y = elapsed * 0.2;
  
  // Pendulum physics simulation
  const angularAcceleration = -(gravityVal / pendulumLengthVal) * Math.sin(pendulumAngle);
  pendulumAngularVelocity += angularAcceleration * 0.016;
  pendulumAngularVelocity *= 0.999; // Slight damping
  pendulumAngle += pendulumAngularVelocity * 0.016;
  pendulumArm.rotation.z = pendulumAngle;
  
  // Update pendulum visual length
  const stringMesh = pendulumArm.children.find(c => c.name === 'pendulumString');
  const bobMesh = pendulumArm.children.find(c => c.name === 'pendulumBob');
  if (stringMesh && bobMesh) {
    stringMesh.scale.y = pendulumLengthVal / 2;
    stringMesh.position.y = -pendulumLengthVal / 2;
    bobMesh.position.y = -pendulumLengthVal;
  }
  
  // EM coil field animation
  coilGroup.children.forEach(child => {
    if (child.name && child.name.startsWith('fieldLine')) {
      child.material.opacity = 0.2 + Math.sin(elapsed * 2 + parseInt(child.name.split('_')[1]) * 0.5) * 0.2;
    }
    if (child.name && child.name.startsWith('coilRing')) {
      child.material.emissiveIntensity = 0.1 + Math.sin(elapsed * 3 + parseInt(child.name.split('_')[1]) * 0.3) * 0.2;
    }
  });
  
  // Prism rainbow animation
  prismGroup.children.forEach(child => {
    if (child.name && child.name.startsWith('rainbowBeam')) {
      child.material.opacity = 0.5 + Math.sin(elapsed * 2) * 0.3;
    }
  });
  
  // ATP Synthase rotation
  const f1Head = atpGroup.children.find(c => c.name === 'f1Head');
  const gammaSubunit = atpGroup.children.find(c => c.name === 'gammaSubunit');
  const f0Subunit = atpGroup.children.find(c => c.name === 'f0Subunit');
  if (f1Head) f1Head.rotation.y = elapsed * atpSpeedVal * 2;
  if (gammaSubunit) gammaSubunit.rotation.y = elapsed * atpSpeedVal * 2;
  if (f0Subunit) f0Subunit.rotation.y = elapsed * atpSpeedVal * 2;
  
  // Proton flow
  protonGroup.children.forEach(child => {
    if (child.userData.angle !== undefined) {
      child.userData.angle += 0.02 * atpSpeedVal * child.userData.speed;
      const r = 1.2;
      child.position.x = Math.cos(child.userData.angle) * r;
      child.position.z = Math.sin(child.userData.angle) * r;
      child.position.y = -0.5 + Math.sin(child.userData.angle * 2) * 0.3;
    }
  });
  
  // ATP molecules float
  atpGroup.children.forEach(child => {
    if (child.name && child.name.startsWith('atpMolecule')) {
      child.position.y = 2 + Math.sin(elapsed * 0.5 + child.userData.floatOffset) * 0.3;
      child.rotation.y = elapsed * 0.3;
    }
  });
  
  // Bunsen burner flame flicker
  const flameObj = bunsenGroup.children.find(c => c.name === 'bunsenFlame');
  const flameInnerObj = bunsenGroup.children.find(c => c.name === 'bunsenFlameInner');
  if (flameObj) {
    flameObj.scale.x = 1 + Math.sin(elapsed * 15) * 0.15;
    flameObj.scale.z = 1 + Math.cos(elapsed * 12) * 0.15;
    flameObj.scale.y = 1 + Math.sin(elapsed * 10) * 0.1;
  }
  if (flameInnerObj) {
    flameInnerObj.scale.x = 1 + Math.cos(elapsed * 18) * 0.1;
    flameInnerObj.scale.z = 1 + Math.sin(elapsed * 14) * 0.1;
  }
  
  // Floating particles
  const positions = particles.geometry.attributes.position.array;
  for (let i = 0; i < particleCount; i++) {
    positions[i * 3 + 1] += Math.sin(elapsed + i) * 0.002;
    if (positions[i * 3 + 1] > 12) positions[i * 3 + 1] = 0;
  }
  particles.geometry.attributes.position.needsUpdate = true;
  
  // Temperature effect on flame
  const tempIntensity = tempVal / 200;
  if (flameObj) {
    flameObj.material.emissiveIntensity = 0.5 + tempIntensity * 1.5;
    flameObj.scale.y = 0.5 + tempIntensity * 1.5;
  }
  
  // Ambient light pulsing
  pointLight1.intensity = 0.3 + Math.sin(elapsed) * 0.15;
  pointLight2.intensity = 0.3 + Math.cos(elapsed * 0.7) * 0.15;
  
  controls.update();
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

// ==================== RESIZE ====================
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ==================== INITIAL GUIDE ====================
setTimeout(() => {
  showGuide('Welcome! 🔬 Click objects to learn, use sliders to experiment, chat with AI, or use voice commands (🎤). Navigate with the top bar buttons.');
}, 1500);