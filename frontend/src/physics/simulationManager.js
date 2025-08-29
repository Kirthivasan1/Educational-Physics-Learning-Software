import { PhysicsEngine } from "./engine";
import { CollisionDetector } from "./collisionDetection";
import { BoundaryHandler } from "./boundaryHandler";
import { Vector2 } from "./Vector2";

/**
 * Manages the physics simulation
 */
export class SimulationManager {
  /**
   * Creates a new simulation manager
   * @param {number} simWidth - Width of the simulation in meters
   * @param {number} simHeight - Height of the simulation in meters
   * @param {number} gravity - Gravity acceleration in m/s^2
   */
  constructor(simWidth, simHeight, gravity = 9.8) {
    this.simWidth = simWidth;
    this.simHeight = simHeight;
    this.gravity = gravity;
  }

  /**
   * Updates all objects in the simulation
   * @param {Array} objects - Array of physics objects
   * @param {number} deltaTime - Time step in seconds
   * @param {number} gravity - Gravity acceleration in m/s^2
   * @returns {Array} - Updated objects
   */
  update(objects, deltaTime, gravity = this.gravity) {
    this.gravity = gravity;
    // First handle collisions
    this.resolveCollisions(objects);

    // Then update physics for each object
    return this.updatePhysics(objects, deltaTime);
  }

  /**
   * Resolves collisions between objects
   * @param {Array} objects - Array of physics objects
   */
  resolveCollisions(objects) {
    for (let i = 0; i < objects.length; i++) {
      for (let j = i + 1; j < objects.length; j++) {
        // Detect and resolve collisions between objects
        CollisionDetector.detectAndResolve(objects[i], objects[j]);
      }
    }
  }

  /**
   * Updates physics for all objects
   * @param {Array} objects - Array of physics objects
   * @param {number} deltaTime - Time step in seconds
   * @param {number} gravity - Gravity acceleration in m/s^2
   * @returns {Array} - Updated objects
   */
  updatePhysics(objects, deltaTime) {
    // Create deep copies of all objects to avoid reference issues
    const objectsCopy = objects.map((obj) => {
      if (!obj?.position) {
        console.warn("Object without position found:", obj);
        return obj;
      }
      return {
        ...obj,
        position: obj.position.clone(),
        velocity: obj.velocity.clone(),
        acceleration: obj.acceleration.clone(),
      };
    });

    // Update physics for each object
    return objectsCopy.map((obj) => {
      // Skip objects without position
      if (!obj?.position) return obj;

      // Apply gravity if not static
      if (!obj.isStatic) {
        obj.acceleration.y = -this.gravity; // Negative because y-axis points up
      }

      // Apply physics update

      const next = PhysicsEngine.update(obj, deltaTime, this.gravity, 1);

      // Apply boundary constraints
      BoundaryHandler.applyBoundaries(next, this.simWidth, this.simHeight);

      return next;
    });
  }
}
