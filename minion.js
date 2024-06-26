import * as THREE from "three";

class Minion {
  constructor(mesh) {
    this.mesh = mesh;
    this.pathIndex = 0;
  }

  moveTo(targetPosition, deltaTime) {
    // const direction = targetPosition
    //   .clone()
    //   .sub(this.mesh.position)
    //   .normalize();
    // const tangent = targetPosition.clone().normalize();
    // this.mesh.position.add(direction.multiplyScalar(deltaTime * 2)); // Adjust speed as needed
    this.mesh.position.copy(targetPosition); // Adjust speed as needed
    // this.mesh.lookAt(targetPosition.clone().add(tangent));
  }
}

export class MinionManager {
  constructor(scene, path) {
    this.minions = [];
    this.scene = scene;
    this.path = path;
    this.group = new THREE.Group();

    this.scene.add(this.group);
  }

  spawnMinion(position) {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0xf01159 });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = `minion-${this.minions.length + 1}`;
    mesh.position.copy(position);
    const minion = new Minion(mesh);
    this.minions.push(minion);
    this.group.add(mesh);
  }

  updateMinions(deltaTime) {
    this.minions.forEach((minion) => {
      if (minion.pathIndex < this.path.length) {
        const targetPosition = this.path[minion.pathIndex];
        minion.moveTo(targetPosition, deltaTime);
        // minion.position.copy(targetPosition);
        if (minion.mesh.position.distanceToSquared(targetPosition) < 0.1) {
          minion.pathIndex++;
        }
      } else {
        this.scene.remove(minion.mesh);
        this.minions.splice(this.minions.indexOf(minion), 1);
      }
    });
  }

  getClosestMinion(position, range) {
    let closestMinion = null;
    let closestDistance = range * range;
    this.minions.forEach((minion) => {
      const distance = position.distanceToSquared(minion.mesh.position);
      if (distance < closestDistance) {
        closestMinion = minion;
        closestDistance = distance;
      }
    });
    return closestMinion;
  }

  checkCollision(particle, onCollision) {
    this.minions.forEach((minion) => {
      if (particle.position.distanceToSquared(minion.mesh.position) < 0.5) {
        onCollision();
        this.group.remove(minion.mesh);
        this.minions.splice(this.minions.indexOf(minion), 1);
      }
    });
  }
}
