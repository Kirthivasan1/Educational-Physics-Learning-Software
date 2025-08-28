import { Vector2 } from "./Vector2";

/**
 * Handles collision detection and response between two physics objects
 */
export class CollisionDetector {
  /**
   * Detects and resolves collisions between two objects
   * @param {Object} a - First physics object
   * @param {Object} b - Second physics object
   * @returns {boolean} - Whether a collision was detected and resolved
   */
  static detectAndResolve(a, b) {
    if (!a.position || !b.position) return false;
    
    // Handle circle-to-circle collisions
    if (a.shape === "circle" && b.shape === "circle") {
      return this.resolveCircleToCircle(a, b);
    }
    // Handle circle-to-rectangle collisions
    else if ((a.shape === "circle" && b.shape === "rectangle") || 
             (a.shape === "rectangle" && b.shape === "circle")) {
      // Make sure a is the circle and b is the rectangle
      if (a.shape === "rectangle") {
        [a, b] = [b, a];
      }
      return this.resolveCircleToRectangle(a, b);
    }
    
    return false;
  }
  
  /**
   * Resolves collision between two circles
   * @param {Object} a - First circle
   * @param {Object} b - Second circle
   * @returns {boolean} - Whether a collision was detected and resolved
   */
  static resolveCircleToCircle(a, b) {
    let dir = new Vector2(b.position.x - a.position.x, b.position.y - a.position.y);
    let d = dir.magnitude();
    if (d === 0 || d > a.radius + b.radius) return false;

    dir = new Vector2(dir.x / d, dir.y / d);
    let corr = (a.radius + b.radius - d) / 2.0;

    // Don't move static objects
    if (!a.isStatic && !b.isStatic) {
      // Position correction
      a.position = new Vector2(a.position.x - dir.x * corr, a.position.y - dir.y * corr);
      b.position = new Vector2(b.position.x + dir.x * corr, b.position.y + dir.y * corr);
      
      // Velocity exchange for elastic collision
      this.exchangeVelocities(a, b, dir);
    } else if (!a.isStatic) {
      // Position correction
      a.position = new Vector2(a.position.x - dir.x * corr * 2, a.position.y - dir.y * corr * 2);
      
      // Velocity reflection off static object
      this.reflectVelocity(a, dir);
    } else if (!b.isStatic) {
      // Position correction
      b.position = new Vector2(b.position.x + dir.x * corr * 2, b.position.y + dir.y * corr * 2);
      
      // Velocity reflection off static object
      this.reflectVelocity(b, dir);
    }
    
    return true;
  }
  
  /**
   * Resolves collision between a circle and a rectangle
   * @param {Object} circle - Circle object
   * @param {Object} rect - Rectangle object
   * @returns {boolean} - Whether a collision was detected and resolved
   */
  static resolveCircleToRectangle(circle, rect) {
    // Circle center
    const circleX = circle.position.x;
    const circleY = circle.position.y;
    const radius = circle.radius;
    
    // Rectangle bounds (position.y is the bottom of the rectangle)
    const rectX = rect.position.x;
    const rectY = rect.position.y;
    const rectWidth = rect.width;
    const rectHeight = rect.height;
    
    // Calculate rectangle corners
    const rectTop = rectY + rectHeight;
    const rectRight = rectX + rectWidth;
    
    // Find closest point on rectangle to circle center
    const closestX = Math.max(rectX, Math.min(circleX, rectRight));
    const closestY = Math.max(rectY, Math.min(circleY, rectTop));
    
    // Calculate distance between closest point and circle center
    const distX = circleX - closestX;
    const distY = circleY - closestY;
    const distance = Math.sqrt(distX * distX + distY * distY);
    
    // Check for collision
    if (distance < radius) {
      // Don't move static objects
      if (!circle.isStatic && !rect.isStatic) {
        // Both objects can move
        const correctionMagnitude = radius - distance;
        const correctionX = distX === 0 ? 0 : (distX / distance) * correctionMagnitude / 2;
        const correctionY = distY === 0 ? 0 : (distY / distance) * correctionMagnitude / 2;
        
        circle.position = new Vector2(circle.position.x + correctionX, circle.position.y + correctionY);
        rect.position = new Vector2(rect.position.x - correctionX, rect.position.y - correctionY);
      } 
      else if (!circle.isStatic) {
        // Only circle can move
        const correctionMagnitude = radius - distance;
        const correctionX = distX === 0 ? 0 : (distX / distance) * correctionMagnitude;
        const correctionY = distY === 0 ? 0 : (distY / distance) * correctionMagnitude;
        
        circle.position = new Vector2(circle.position.x + correctionX, circle.position.y + correctionY);
        
        // If this is a floor collision (static rectangle), bounce the circle
        if (rect.isStatic) {
          // Determine which side of the rectangle was hit
          const isTopCollision = Math.abs(circleY - rectTop) < radius && circleY > rectTop;
          const isBottomCollision = Math.abs(circleY - rectY) < radius && circleY < rectY;
          
          if (isTopCollision || isBottomCollision) {
            // Vertical collision - bounce with damping
            circle.velocity.y = Math.abs(circle.velocity.y) * (isTopCollision ? 1 : -1) * 0.7;
          } else {
            // Horizontal collision - bounce with damping
            circle.velocity.x = Math.abs(circle.velocity.x) * (circleX < rectX ? -1 : 1) * 0.7;
          }
        }
      }
      return true;
    }
    
    return false;
  }
  
  /**
   * Exchanges velocities between two objects for elastic collision
   * @param {Object} a - First object
   * @param {Object} b - Second object
   * @param {Vector2} dir - Collision normal direction
   */
  static exchangeVelocities(a, b, dir) {
    // Calculate velocity along the collision normal
    const v1 = a.velocity.x * dir.x + a.velocity.y * dir.y;
    const v2 = b.velocity.x * dir.x + b.velocity.y * dir.y;
    
    // Calculate impulse
    const impulse = 2.0 * (v1 - v2) / (a.mass + b.mass);
    
    // Apply impulse to velocities
    const dampingFactor = 0.9; // Slight energy loss in collision
    
    a.velocity = new Vector2(
      a.velocity.x - impulse * b.mass * dir.x * dampingFactor,
      a.velocity.y - impulse * b.mass * dir.y * dampingFactor
    );
    
    b.velocity = new Vector2(
      b.velocity.x + impulse * a.mass * dir.x * dampingFactor,
      b.velocity.y + impulse * a.mass * dir.y * dampingFactor
    );
  }
  
  /**
   * Reflects velocity off a static object
   * @param {Object} obj - Object to reflect velocity for
   * @param {Vector2} dir - Collision normal direction
   */
  static reflectVelocity(obj, dir) {
    const v = obj.velocity.x * dir.x + obj.velocity.y * dir.y;
    const dampingFactor = 0.9;
    
    obj.velocity = new Vector2(
      obj.velocity.x - 2 * v * dir.x * dampingFactor,
      obj.velocity.y - 2 * v * dir.y * dampingFactor
    );
  }
}