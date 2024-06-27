import * as THREE from "three";
import { TextGeometry } from "three/examples/jsm/Addons.js";

export const map0_data = {
  data: [
    [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
    [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
  ],
  path: [
    new THREE.Vector3(-11, 1.2, -10),
    new THREE.Vector3(-9, 1.2, -10),
    new THREE.Vector3(-7, 1.2, -10),
    new THREE.Vector3(-7, 1.2, -8),
    new THREE.Vector3(-7, 1.2, -6),
    new THREE.Vector3(-7, 1.2, -4),
    new THREE.Vector3(-7, 1.2, -2),
    new THREE.Vector3(-7, 1.2, 0),
    new THREE.Vector3(-7, 1.2, 2),
    new THREE.Vector3(-7, 1.2, 4),
    new THREE.Vector3(-7, 1.2, 6),
    new THREE.Vector3(-7, 1.2, 8),
    new THREE.Vector3(-7, 1.2, 10),
    new THREE.Vector3(-5, 1.2, 10), //14
    new THREE.Vector3(-3, 1.2, 10), //15
    new THREE.Vector3(-1, 1.2, 10), //16
    new THREE.Vector3(-1, 1.2, 8), //17
    new THREE.Vector3(-1, 1.2, 6), //18
    new THREE.Vector3(-1, 1.2, 4), //19
    new THREE.Vector3(-1, 1.2, 2), //20
    new THREE.Vector3(-1, 1.2, 0), //21
    new THREE.Vector3(-1, 1.2, -2), //22
    new THREE.Vector3(-1, 1.2, -4), //23
    new THREE.Vector3(-1, 1.2, -6), //24
    new THREE.Vector3(-1, 1.2, -8), //25
    new THREE.Vector3(-1, 1.2, -10), //26
    new THREE.Vector3(1, 1.2, -10), //27
    new THREE.Vector3(3, 1.2, -10),
    new THREE.Vector3(5, 1.2, -10),
    new THREE.Vector3(5, 1.2, -8),
    new THREE.Vector3(5, 1.2, -6),
    new THREE.Vector3(5, 1.2, -4),
    new THREE.Vector3(5, 1.2, -2),
    new THREE.Vector3(5, 1.2, 0),
    new THREE.Vector3(5, 1.2, 2),
    new THREE.Vector3(5, 1.2, 4),
    new THREE.Vector3(7, 1.2, 4),
    new THREE.Vector3(9, 1.2, 4),
    new THREE.Vector3(11, 1.2, 4),
  ],
};

function updateText(text, font) {
  const geometry = new TextGeometry(text, {
    font: font,
    size: 1, // Size of the text
    height: 0.2, // Thickness to extrude text
    curveSegments: 12, // Number of points on the curves
    bevelEnabled: true, // Enable beveling
    bevelThickness: 0.03, // Bevel thickness
    bevelSize: 0.02, // Bevel size
    bevelOffset: 0, // Bevel offset
    bevelSegments: 5, // Number of bevel segments
  });
  const textMesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial());
  return textMesh;
}

export function loadMap(mapdata, scene, clickableObjs) {
  // getting width and height
  const size_X = mapdata.data.length;
  const size_Y = mapdata.data[0].length;
  const path = [];

  // setting up basic mesh
  const road_group = new THREE.Group();
  const ground_group = new THREE.Group();
  scene.add(road_group, ground_group);

  const material = new THREE.MeshLambertMaterial();
  const geometry = new THREE.BoxGeometry(2, 2, 2);
  const basic_cube = new THREE.Mesh(geometry, material);
  let counter = 0;

  // setting up path for minions
  const road_material = new THREE.MeshPhongMaterial({
    color: 0x2c3e50,
    opacity: 1,
    // transparent: true,
    emissive: 0.5,
  });
  const road_cube = new THREE.Mesh(geometry, road_material);
  // const road_cube = updateText();

  for (let x = 0; x < size_X; x++) {
    for (let y = 0; y < size_Y; y++) {
      // code here to create path and terrain
      const pos_x = x * 2 - (size_X / 2) * 2; // position x
      const pos_y = y * 2 - (size_Y / 2) * 2;

      switch (mapdata.data[x][y]) {
        case 0:
          {
            const temp_block = basic_cube.clone();
            temp_block.position.set(pos_x, 0, pos_y);
            temp_block.name = `basic_cube_${x}-${y}`;
            // temp_block.material.wireframe = true;
            ground_group.add(temp_block);
            clickableObjs.push(temp_block);
          }
          break;

        case 1:
          {
            // counter++;
            // console.log(counter);
            // const temp_block = updateText(counter.toString(), font).clone();
            const temp_block = road_cube.clone();
            temp_block.scale.y = 0.8;
            temp_block.position.set(pos_x, -0.2, pos_y);
            const vector = new THREE.Vector3(pos_x, 1.2, pos_y);
            // path.push(vector);
            temp_block.name = `road_cube_${x}-${y}`;
            temp_block.material.opacity = 0.4;
            road_group.add(temp_block);
          }
          break;

        default:
          break;
      }
    }
  }
}
