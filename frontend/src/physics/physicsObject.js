import { Vector2 } from "../physics/Vector2";

export default class PhysicsObject {
  constructor({
    position = new Vector2(0, 0),
    velocity = new Vector2(0, 0),
    acceleration = new Vector2(0, 0),
    radius = null, // for circles
    shape = "circle", // 'circle', 'rectangle', 'triangle', 'polygon'
    mass = 1,
    width = null, // for rectangles
    height = null, // for rectangles
    points = null, // for polygons (array of {x, y})
    rotation = 0, // rotation in radians
    isStatic = false, // whether the object is affected by physics
  } = {}) {
    this.shape = shape;
    // Clone the vectors to prevent shared references
    this.position =
      position instanceof Vector2
        ? position.clone()
        : new Vector2(position.x, position.y);
    this.velocity =
      velocity instanceof Vector2
        ? velocity.clone()
        : new Vector2(velocity.x, velocity.y);
    this.acceleration =
      acceleration instanceof Vector2
        ? acceleration.clone()
        : new Vector2(acceleration.x, acceleration.y);
    this.mass = mass;
    this.isStatic = isStatic;
    this.rotation = rotation; // rotation in radians

    // Shape-specific properties
    if (shape === "circle") {
      this.radius = radius ?? 20;
    } else if (shape === "rectangle") {
      this.width = width ?? 50;
      this.height = height ?? 50;
    } else if (shape === "triangle") {
      this.points = points ?? [
        { x: 0, y: 0 },
        { x: 50, y: 0 },
        { x: 25, y: 50 },
      ];
    } else if (shape === "polygon") {
      this.points = points ?? [];
    }
  }

  add(v, s = 1.0) {
    this.position.x += v.x * s;
    this.position.y += v.y * s;
    return this;
  }
}
