import * as THREE from "three";
import { TransformControls } from "three/examples/jsm/Addons.js";
import {
  Brush,
  Evaluator,
  GridMaterial,
  INTERSECTION,
  HOLLOW_INTERSECTION,
} from "three-bvh-csg";

let csgEvaluator,
  brush1,
  brush2,
  resultObject,
  originalMaterial,
  needsUpdate = true;

export function createInterSection(scene, camera, renderer, controls) {
  const transformControls = new TransformControls(camera, renderer.domElement);
  transformControls.setSize(0.75);
  transformControls.addEventListener("dragging-changed", (e) => {
    controls.enabled = !e.value;
  });
  transformControls.addEventListener("objectChange", () => {
    needsUpdate = true;
  });
  scene.add(transformControls);

  // bunny mesh has no UVs so skip that attribute
  csgEvaluator = new Evaluator();
  csgEvaluator.attributes = ["position", "normal"];

  // initialize brushes
  const dim = Math.round(THREE.MathUtils.lerp(1, 10, 1));
  const geometry = new THREE.BoxGeometry(1, 1, 1, dim, dim, dim);

  brush1 = new Brush(geometry, new GridMaterial());
  brush2 = new Brush(geometry, new GridMaterial());

  brush2.position.set(-0.75, 0.75, 0);
  brush2.scale.setScalar(0.75);

  //   updateBrush(brush1);
  //   updateBrush(brush2);

  // initialize materials
  brush1.material.opacity = 0.15;
  brush1.material.transparent = true;
  brush1.material.depthWrite = false;
  brush1.material.polygonOffset = true;
  brush1.material.polygonOffsetFactor = 0.2;
  brush1.material.polygonOffsetUnits = 0.2;
  brush1.material.side = THREE.DoubleSide;
  brush1.material.premultipliedAlpha = true;

  brush2.material.opacity = 0.15;
  brush2.material.transparent = true;
  brush2.material.depthWrite = false;
  brush2.material.polygonOffset = true;
  brush2.material.polygonOffsetFactor = 0.2;
  brush2.material.polygonOffsetUnits = 0.2;
  brush2.material.side = THREE.DoubleSide;
  brush2.material.premultipliedAlpha = true;
  brush2.material.roughness = 0.25;
  brush2.material.color.set(0xe91e63);

  brush1.receiveShadow = true;
  brush2.receiveShadow = true;

  transformControls.attach(brush2);
  scene.add(brush1, brush2);

  // add object displaying the result
  resultObject = new THREE.Mesh(
    new THREE.BufferGeometry(),
    new THREE.MeshStandardMaterial({
      flatShading: false,
      polygonOffset: true,
      polygonOffsetUnits: 0.1,
      polygonOffsetFactor: 0.1,
    })
  );
  resultObject.castShadow = true;
  resultObject.receiveShadow = true;
  originalMaterial = resultObject.material;
  scene.add(resultObject);

  csgEvaluator = new Evaluator();
}

function updateBrush(brush) {
  //   const position = brush.geometry.attributes.position;
  //   const array = new Float32Array(position.count * 3);
  //   for (let i = 0, l = array.length; i < l; i += 9) {
  //     array[i + 0] = 1;
  //     array[i + 1] = 0;
  //     array[i + 2] = 0;

  //     array[i + 3] = 0;
  //     array[i + 4] = 1;
  //     array[i + 5] = 0;

  //     array[i + 6] = 0;
  //     array[i + 7] = 0;
  //     array[i + 8] = 1;
  //   }

  //   brush.geometry.setAttribute("color", new THREE.BufferAttribute(array, 3));
  //   brush.material.wireframe = true;
  //   brush.prepareGeometry();
  needsUpdate = true;
}

export function loopInterSection() {
  if (needsUpdate) {
    needsUpdate = false;

    brush1.updateMatrixWorld();
    brush2.updateMatrixWorld();

    csgEvaluator.debug.enabled = true;
    csgEvaluator.useGroups = false;
    const testObj = csgEvaluator.evaluate(brush1, brush2, INTERSECTION);
    resultObject.geometry.dispose();
    resultObject.geometry = testObj.geometry;

    resultObject.material = originalMaterial;
  }
}
