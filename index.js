import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { loadMap, map0_data } from "./map";

// variables
let scene,
  camera,
  renderer,
  clock,
  controls,
  raycaster,
  mouse = new THREE.Vector2(),
  clickableObjs = new Array(),
  cursor_cube;
// tower_mesh,
// cursorValid = false,
// towerMngr = new TowerManager();

function init() {
  clock = new THREE.Clock();
  scene = new THREE.Scene();

  raycaster = new THREE.Raycaster();

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
  scene.add(camera);

  // controls
  controls = new OrbitControls(camera, renderer.domElement);
  controls.update();
  // controls.addEventListener("change", render);
  controls.enabled = false;

  //event
  document.addEventListener("mousedown", onMouseDown);
  document.addEventListener("mouseup", onMouseUp);

  //light
  const ambientLight = new THREE.AmbientLight(0xcccccc, 0.2);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
  directionalLight.position.set(-1, 0.9, 0.4);
  scene.add(directionalLight);

  // calling loading and init functions
  loadMap(map0_data, scene, clickableObjs);

  // initial mesh on cursor
  const cursor_material = new THREE.MeshLambertMaterial({
    transparent: true,
    opacity: 0,
    color: 0xc0392b,
  });
  const cursor_geometry = new THREE.BoxGeometry(1, 4, 1); // height 4
  cursor_cube = new THREE.Mesh(cursor_geometry, cursor_material);
  scene.add(cursor_cube);

  //loop
  render();
}

function onMouseUp(event) {
  // mouse.x = (event.clientX / innerWidth) * 2 - 1;
  // mouse.y = (event.clientX / innerHeight) * 2 + 1;
  // console.log("mouse up", mouse.x, mouse.y);
  cursor_cube.material.emissive.g = 0;
}

function onMouseDown(event) {
  event.preventDefault();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  console.log("mouse down", mouse.x, mouse.y);

  raycaster.setFromCamera(mouse, camera);

  console.log({ len: clickableObjs.length, clickableObjs });
  const intersects = raycaster.intersectObjects(clickableObjs);
  console.log(intersects.length);
  if (intersects.length) {
    const selected_block = intersects[0].object;
    cursor_cube.position.set(
      selected_block.position.x,
      selected_block.position.y + 2,
      selected_block.position.z
    );
    cursor_cube.material.opacity = 0.5;
    cursor_cube.material.emissive.g = 0.5;

    intersects.forEach((node) => console.log(node.object));
  } else {
    cursor_cube.material.opacity = 0;
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

  requestAnimationFrame(render);
}

init();
