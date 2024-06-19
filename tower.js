import * as THREE from "three";

class Tower {
  constructor() {
    this.mesh = undefined;
  }
}

export class TowerManager {
  constructor(scene) {
    // ---- Tower List ----
    this.towerArray = new Array();

    // ---- Temporary variables ----
    this.newTowerMeshToCreate = undefined;
    this.selectedTower = undefined;
    this.scene = scene;
  }

  addTower(newtowermesh) {
    var newtower = new Tower();
    newtower.mesh = newtowermesh;
    this.towerArray.push(newtower);
    this.scene.add(newtower.mesh);
  }

  deleteTower(TowerObj) {
    const index = this.towerArray.indexOf(TowerObj);
    if (index > -1) {
      this.towerArray.splice(index, 1);
    }
  }

  createTower() {
    const cursor_material = new THREE.MeshLambertMaterial({
      transparent: true,
      opacity: 1,
      color: 0xc0392b,
    });
    const cursor_geometry = new THREE.BoxGeometry(1.5, 4, 1.5); // height 4
    return new THREE.Mesh(cursor_geometry, cursor_material);
  }

  getLastTower() {
    return this.towerArray[this.towerArray.length - 1].mesh;
  }

  setTowerPosition(tower, pos) {
    tower.position.set(pos.x, pos.y + 2, pos.z);
    // tower.material.opacity = 1;
    // tower.material.emissive.g = 0.5;
  }

  getTowerAtPosition(x, z) {
    for (var i = 0; i < this.towerArray.length; i++) {
      if (
        this.towerArray[i].mesh.position.x == x &&
        this.towerArray[i].mesh.position.z == z
      ) {
        return this.towerArray[i];
      }
    }
    return null;
  }
}
