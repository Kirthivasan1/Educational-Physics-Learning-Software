import { Vector2 } from "./Vector2";

/**
 * Physics engine for updating object positions and velocities
 */
export class PhysicsEngine {
  /**
   * Updates a physics object's position and velocity
   * @param {Object} obj - Physics object to update
   * @param {number} dt - Delta time in seconds
   * @param {boolean} gravityOn - Whether gravity is enabled
   * @param {number} bounce - Bounce factor (default: 1)
   * @returns {Object} - Updated object
   */
  static update(obj, dt, gravityValue = 9.8, bounce = 1) {
    if (obj.isStatic) return obj;

    // Apply gravity as a constant acceleration in the negative y direction
    const gravity = -gravityValue; // use whatever SimulationManager gives us

    // Create a new acceleration vector
    const acceleration = new Vector2(
      obj.acceleration.x,
      obj.acceleration.y + gravity
    );

    // Update velocity v = u + a * dt
    obj.velocity = obj.velocity.add(acceleration, dt);

    // Update position y = y0 + v * dt
    obj.position = obj.position.add(obj.velocity, dt);

    return obj;
  }
}

// For backward compatibility
export function update(obj, dt, gravityOn, bounce = 1) {
  return PhysicsEngine.update(obj, dt, gravityOn, bounce);
}
