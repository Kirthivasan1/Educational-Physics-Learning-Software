export class Vector2 {
  constructor(x = 0, y = 0) {
    this.x = Number.isFinite(x) ? x : 0;
    this.y = Number.isFinite(y) ? y : 0;
  }

  // Returns a new Vector2 that is a copy of this one
  clone() {
    return new Vector2(this.x, this.y);
  }

  // Adds another vector to this one
  add(v, s = 1.0) {
    if (v && typeof v.x === "number" && typeof v.y === "number") {
      this.x += v.x * s;
      this.y += v.y * s;
    }
    return this;
  }

  // Subtracts another vector from this one
  subtract(v) {
    this.x -= v.x;
    this.y -= v.y;
    return this;
  }

  // Scales this vector by a scalar value
  scale(s) {
    this.x *= s;
    this.y *= s;
    return this;
  }

  // Returns the dot product of this vector with another vector
  dot(v) {
    return this.x * v.x + this.y * v.y;
  }

  // Returns the magnitude (length) of this vector
  magnitude() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  // Returns the squared magnitude (useful for comparing lengths without sqrt)
  magnitudeSquared() {
    return this.x * this.x + this.y * this.y;
  }

  // Normalizes this vector (makes it unit length)
  normalize() {
    const mag = this.magnitude();
    if (mag === 0) return this;
    return this.scale(1 / mag);
  }

  // Static method to create a vector from an angle (in radians)
  static fromAngle(angle) {
    return new Vector2(Math.cos(angle), Math.sin(angle));
  }

  // Static method to create a vector from one point to another
  static subtract(v1, v2) {
    return new Vector2(v1.x - v2.x, v1.y - v2.y);
  }

  subtractVectors(a, b) {
    this.x = a.x - b.x;
    this.y = a.y - b.y;
    return this;
  }
}
