import { Vector2 } from "./Vector2";

/**
 * Handles boundary checks and constraints for physics objects
 */
export class BoundaryHandler {
  /**
   * Applies boundary constraints to an object
   * @param {Object} obj - Physics object to check
   * @param {number} simWidth - Simulation width
   * @param {number} simHeight - Simulation height
   * @returns {Object} - Updated object
   */
  static applyBoundaries(obj, simWidth, simHeight) {
    // Skip static objects
    if (obj.isStatic) return obj;
    
    // Handle circle boundaries
    if (obj.shape === "circle") {
      this.applyCircleBoundaries(obj, simWidth, simHeight);
    }
    // Handle rectangle boundaries
    else if (obj.shape === "rectangle") {
      this.applyRectangleBoundaries(obj, simWidth, simHeight);
    }
    
    return obj;
  }
  
  /**
   * Applies boundary constraints to a circle
   * @param {Object} circle - Circle object
   * @param {number} simWidth - Simulation width
   * @param {number} simHeight - Simulation height
   */
  static applyCircleBoundaries(circle, simWidth, simHeight) {
    const dampingFactor = 0.7; // Energy loss on collision with boundaries
    
    // Left boundary
    if (circle.position.x - circle.radius < 0) {
      circle.position.x = circle.radius;
      circle.velocity.x = -circle.velocity.x * dampingFactor;
    }
    // Right boundary
    else if (circle.position.x + circle.radius > simWidth) {
      circle.position.x = simWidth - circle.radius;
      circle.velocity.x = -circle.velocity.x * dampingFactor;
    }
    
    // Top boundary
    if (circle.position.y + circle.radius > simHeight) {
      circle.position.y = simHeight - circle.radius;
      circle.velocity.y = -circle.velocity.y * dampingFactor;
    }
  }
  
  /**
   * Applies boundary constraints to a rectangle
   * @param {Object} rect - Rectangle object
   * @param {number} simWidth - Simulation width
   * @param {number} simHeight - Simulation height
   */
  static applyRectangleBoundaries(rect, simWidth, simHeight) {
    const dampingFactor = 0.7; // Energy loss on collision with boundaries
    
    // Left boundary
    if (rect.position.x < 0) {
      rect.position.x = 0;
      rect.velocity.x = -rect.velocity.x * dampingFactor;
    }
    // Right boundary
    else if (rect.position.x + rect.width > simWidth) {
      rect.position.x = simWidth - rect.width;
      rect.velocity.x = -rect.velocity.x * dampingFactor;
    }
    
    // Bottom boundary
    if (rect.position.y < 0) {
      rect.position.y = 0;
      rect.velocity.y = -rect.velocity.y * dampingFactor;
    }
    // Top boundary
    else if (rect.position.y + rect.height > simHeight) {
      rect.position.y = simHeight - rect.height;
      rect.velocity.y = -rect.velocity.y * dampingFactor;
    }
  }
}