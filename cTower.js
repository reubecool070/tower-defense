import * as THREE from "three";

class Tower {
  constructor() {
    this.mesh = undefined;
    this.range = 10; // Tower range
    this.fireRate = 1; // Particles per second
    this.lastFireTime = 0;
  }
}

export class TowerManager {
  constructor(scene) {
    this.towerArray = new Array();
    this.scene = scene;
    this.particles = []; // Array to store fire particles
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

  createFireParticle() {
    const particleGeometry = new THREE.SphereGeometry(0.1, 8, 8);
    const particleMaterial = new THREE.MeshStandardMaterial({
      color: 0xff4500,
    });
    return new THREE.Mesh(particleGeometry, particleMaterial);
  }

  shootParticles(deltaTime, minionManager) {
    this.towerArray.forEach((tower) => {
      if (tower.lastFireTime + 1 / tower.fireRate <= deltaTime) {
        const targetMinion = minionManager.getClosestMinion(
          tower.mesh.position,
          tower.range
        );
        if (targetMinion) {
          const particle = this.createFireParticle();
          particle.position.copy(tower.mesh.position);
          particle.velocity = targetMinion.mesh.position
            .clone()
            .sub(tower.mesh.position)
            .normalize()
            .multiplyScalar(2);
          this.scene.add(particle);
          this.particles.push(particle);
          tower.lastFireTime = deltaTime;
        }
      }
    });
  }

  updateParticles(deltaTime, minionManager) {
    this.particles.forEach((particle, index) => {
      particle.position.add(
        particle.velocity.clone().multiplyScalar(deltaTime)
      );
      if (particle.position.distanceToSquared(particle.startPos) > 100) {
        this.scene.remove(particle);
        this.particles.splice(index, 1);
      } else {
        minionManager.checkCollision(particle, () => {
          this.scene.remove(particle);
          this.particles.splice(index, 1);
        });
      }
    });
  }
}
