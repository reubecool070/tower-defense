import * as THREE from "three";
import { OrbitControls as MapControls } from "three/examples/jsm/Addons.js";
import { loadMap, map0_data } from "./map";
// import { TowerManager } from "./tower";
// import {
//   createTowerGui_open,
//   createTowerGui_close,
//   infoTowerGui_open,
//   infoTowerGui_close,
// } from "./gui.js";

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

  camera = new THREE.OrthographicCamera(
    (frustumSize * aspect) / -2,
    (frustumSize * aspect) / 2,
    frustumSize / 2,
    frustumSize / -2,
    1,
    1000
  );
  camera.position.set(-15, 15, -15);
  scene.add(camera);

  // controls
  controls = new MapControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.screenSpacePanning = false;
  controls.minDistance = 2;
  controls.maxDistance = 20;
  controls.maxPolarAngle = Math.PI / 2;

  //event
  // document.addEventListener("pointerdown", onMouseDown, false);
  // document.addEventListener("pointerup", onMouseUp, false);

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
  const cursor_geometry = new THREE.BoxGeometry(0.5, 4, 0.5); // height 4
  cursor_cube = new THREE.Mesh(cursor_geometry, cursor_material);
  scene.add(cursor_cube);

  // TOWER MESH
  // const material = new THREE.MeshLambertMaterial({ color: 0xc0392b });
  // const tower_geometry = new THREE.BoxGeometry(1, 3, 1);
  // tower_mesh = new THREE.Mesh(tower_geometry, material);

  // document.getElementById("buttonyes").addEventListener("click", function () {
  //   event.stopPropagation();

  //   var tmpTower = towerMngr.newTowerMeshToCreate;
  //   scene.add(tmpTower);
  //   towerMngr.addTower(tmpTower);

  //   towerMngr.newTowerMeshToCreate = undefined;
  //   createTowerGui_close();
  // });

  // document.getElementById("buttonno").addEventListener("click", function () {
  //   event.stopPropagation();
  //   towerMngr.newTowerMeshToCreate = undefined;
  //   createTowerGui_close();
  // });

  // document
  //   .getElementById("buttondelete")
  //   .addEventListener("click", function () {
  //     event.stopPropagation();
  //     towerMngr.deleteTower(towerMngr.selectedTower);
  //     scene.remove(towerMngr.selectedTower.mesh);

  //     infoTowerGui_close();
  //     towerMngr.selectedTower = undefined;
  //   });

  // document.getElementById("buttonclose").addEventListener("click", function () {
  //   event.stopPropagation();
  //   infoTowerGui_close();
  // });

  //loop
  render();
}

// function onMouseUp(event) {
//   cursor_cube.material.emissive.g = 0;
//   towerMngr.newTowerMeshToCreate = undefined;
//   towerMngr.selectedTower = undefined;

//   mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
//   mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

//   if (cursorValid) {
//     var checkTower = towerMngr.getTowerAtPosition(
//       cursor_cube.position.x,
//       cursor_cube.position.z
//     );

//     if (checkTower == null) {
//       var newtower = tower_mesh.clone();
//       newtower.position.set(cursor_cube.position.x, 1, cursor_cube.position.z);
//       towerMngr.newTowerMeshToCreate = newtower;

//       infoTowerGui_close();
//       createTowerGui_open();
//     } else {
//       towerMngr.selectedTower = checkTower;
//       createTowerGui_close();
//       infoTowerGui_open(checkTower.mesh.position.x, checkTower.mesh.position.z);
//     }
//   }
// }

// function onMouseDown(event) {
//   event.preventDefault();
//   mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
//   mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

//   raycaster.setFromCamera(mouse, camera);
//   var intersects = raycaster.intersectObjects(clickableObjs);

//   if (intersects.length > 0) {
//     // If there is a match mouse/block (if the array is not empty)
//     var SelectedBloc = intersects[0].object; // we choose the first targetable element
//     cursor_cube.position.set(
//       SelectedBloc.position.x,
//       SelectedBloc.position.y,
//       SelectedBloc.position.z
//     );
//     cursor_cube.material.opacity = 0.5;
//     cursor_cube.material.emissive.g = 0.5;

//     cursorValid = true;
//   } else {
//     cursor_cube.material.opacity = 0;
//     cursorValid = false;
//   }
// }

function render() {
  const delta = clock.getDelta();
  const elapsed = clock.elapsedTime;

  controls.update();
  renderer.render(scene, camera);

  requestAnimationFrame(render);
}

init();
