import * as THREE from "three";

class Minion {
  constructor(mesh) {
    this.mesh = mesh;
    this.pathIndex = 0;
    this.speed = 2.0;
  }

  moveTo(targetPosition, deltaTime) {
    const direction = targetPosition
      .clone()
      .sub(this.mesh.position)
      .normalize();

    this.mesh.position.add(direction.multiplyScalar(deltaTime * this.speed)); // Adjust speed as needed
    // const tangent = targetPosition.clone();
    // this.mesh.lookAt(targetPosition);
    // this.mesh.position.copy(targetPosition); // Adjust speed as needed
    //  const direction = targetPosition.clone().sub(this.mesh.position);
    //     .normalize();
    // const distance = direction.length();
    // const moveDistance = Math.min(distance, this.speed * deltaTime);
    // this.mesh.position.add(direction.multiplyScalar(moveDistance));
  }
}

export class MinionManager {
  constructor(scene, path) {
    this.minions = [];
    this.scene = scene;
    this.path = path;
    this.group = new THREE.Group();
    this.textureLoader = new THREE.TextureLoader();
    this.minionSprite = undefined;

    this.scene.add(this.group);
  }

  createTexture() {
    console.log("called");
    this.textureLoader.load("textures/minion.png", (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;

      const material = new THREE.SpriteMaterial({ map: texture });
      this.minionSprite = new THREE.Sprite(material);
      // this.minionSprite = texture;
    });
  }

  spawnMinion(position) {
    if (!this.minionSprite) return;
    const mesh = this.minionSprite.clone();
    mesh.name = `minion-${this.minions.length + 1}`;
    mesh.position.copy(position);
    const minion = new Minion(mesh);
    this.minions.push(minion);
    this.group.add(mesh);
  }

  updateMinions(deltaTime) {
    this.minions.forEach((minion) => {
      console.log(minion.pathIndex, this.path.length);
      if (minion.pathIndex < this.path.length) {
        const targetPosition = this.path[minion.pathIndex];
        minion.moveTo(targetPosition, deltaTime);
        if (minion.mesh.position.distanceToSquared(targetPosition) < 0.1) {
          minion.pathIndex++;
        }
      } else {
        this.group.remove(minion.mesh);
        this.minions.splice(this.minions.indexOf(minion), 1);
        console.log("remove", this.scene);
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
