import * as THREE from "three";

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
};

export function loadMap(mapdata, scene, clickableObjs) {
  // getting width and height
  const size_Y = mapdata.data.length;
  const size_X = mapdata.data[0].length;

  // setting up basic mesh
  const material = new THREE.MeshLambertMaterial();
  const geometry = new THREE.BoxGeometry(2, 2, 2);
  const basic_cube = new THREE.Mesh(geometry, material);

  // setting up path for minions
  const road_material = new THREE.MeshPhongMaterial({
    color: 0x2c3e50,
    opacity: 1,
    // transparent: true,
    emissive: 0.5,
  });
  const road_cube = new THREE.Mesh(geometry, road_material);

  for (let x = 0; x < size_X; x++) {
    for (let y = 0; y < size_Y; y++) {
      // code here to create path and terrain
      const pos_x = x * 2 - (size_X / 2) * 2; // position x
      const pos_y = y * 2 - (size_Y / 2) * 2;

      switch (mapdata.data[y][x]) {
        case 0:
          {
            const temp_block = basic_cube.clone();
            temp_block.position.set(pos_x, 0, pos_y);
            temp_block.name = `basic_cube_${x}-${y}`;
            // temp_block.material.wireframe = true;
            scene.add(temp_block);
            clickableObjs.push(temp_block);
          }
          break;

        case 1:
          {
            const temp_block = road_cube.clone();
            temp_block.scale.y = 0.8;
            temp_block.position.set(pos_x, -0.2, pos_y);
            temp_block.name = `road_cube_${x}-${y}`;
            temp_block.material.opacity = 0.4;
            scene.add(temp_block);
          }
          break;

        default:
          break;
      }
    }
  }
}
