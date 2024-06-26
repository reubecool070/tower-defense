import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { loadMap, map0_data } from "./map";
// import { createInterSection, loopInterSection } from "./intersection";
import { TowerManager } from "./tower";
import { MinionManager } from "./minion";

// LIST of TODOS
// Do not let towers be added in the same place
// Change tower sprite with multiple as per choice
// Tower fire system animation
// Add minions sprite -> animation following path

// variables
let camera,
  renderer,
  clock,
  controls,
  raycaster,
  mouse = new THREE.Vector2(),
  clickableObjs = new Array(),
  cursor_cube,
  addedToScene = false,
  towerMngr,
  minionMngr;

// cursorValid = false,
const scene = new THREE.Scene();

function init() {
  clock = new THREE.Clock();

  raycaster = new THREE.Raycaster();
  towerMngr = new TowerManager(scene);

  //renderer
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // camera
  const aspect = window.innerWidth / window.innerHeight;
  const frustumSize = 10;

  camera = new THREE.PerspectiveCamera(20, aspect, 0.1, 5000);
  camera.position.set(0, 70, 40);
  // camera.position.set(1, 1, 5);
  scene.add(camera);

  // controls
  controls = new OrbitControls(camera, renderer.domElement);
  controls.update();
  // controls.addEventListener("change", render);
  // controls.enabled = false;

  // //event
  document.addEventListener("mousedown", onMouseDown);
  document.addEventListener("mouseup", onMouseUp);
  document.addEventListener("mousemove", onMouseMove);

  //light
  const ambientLight = new THREE.AmbientLight(0xcccccc, 0.2);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
  directionalLight.position.set(-1, 0.9, 0.4);
  scene.add(directionalLight);

  // calling loading and init functions
  const path = loadMap(map0_data, scene, clickableObjs);

  cursor_cube = towerMngr.createTower();
  // scene.add(cursor_cube);

  minionMngr = new MinionManager(scene, path);
  minionMngr.spawnMinion(new THREE.Vector3(path[0].x, path[0].y, path[0].z));
  // Spawn minions every 2 seconds
  // setInterval(() => {
  // }, 2000);

  //loop
  render();
}

function onMouseMove(event) {
  event.preventDefault();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(clickableObjs);

  if (intersects.length) {
    const selected_block = intersects[0].object;
    cursor_cube.position.set(
      selected_block.position.x,
      selected_block.position.y + 2,
      selected_block.position.z
    );
  }
}

function onMouseUp(event) {
  // mouse.x = (event.clientX / innerWidth) * 2 - 1;
  // mouse.y = (event.clientX / innerHeight) * 2 + 1;
  if (addedToScene) {
    const mesh = towerMngr.getLastTower();
    mesh.material.emissive.g = 0;
    addedToScene = false;
  }
}

function onMouseDown(event) {
  event.preventDefault();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(clickableObjs);
  if (intersects.length) {
    const selected_block = intersects[0].object;
    // Remove the road from raycasting where the tower is placed.
    // Do not let towers be added in the same place
    const findObjIndex = clickableObjs.findIndex(
      (obj) => obj.id === selected_block.id
    );
    clickableObjs.splice(findObjIndex, 1);

    const tower = towerMngr.createTower();
    towerMngr.setTowerPosition(tower, selected_block.position);
    tower.material.opacity = 1;
    tower.material.emissive.g = 0.5;
    towerMngr.addTower(tower);

    addedToScene = true;
  } else {
    addedToScene = false;
  }
}

window.onresize = function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
};

function render() {
  const delta = clock.getDelta();
  const elapsed = clock.elapsedTime;

  // controls.update();
  renderer.render(scene, camera);

  minionMngr.updateMinions(delta);

  // loopInterSection();

  requestAnimationFrame(render);
}

init();
