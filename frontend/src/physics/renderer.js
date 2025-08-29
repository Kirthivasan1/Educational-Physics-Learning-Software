import { Vector2 } from "./Vector2";

/**
 * Handles rendering of physics objects on a canvas
 */
export class Renderer {
  /**
   * Creates a new renderer
   * @param {number} canvasWidth - Width of the canvas in pixels
   * @param {number} canvasHeight - Height of the canvas in pixels
   * @param {number} simWidth - Width of the simulation in meters
   * @param {number} simHeight - Height of the simulation in meters
   */
  constructor(canvasWidth, canvasHeight, simWidth, simHeight) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.simWidth = simWidth;
    this.simHeight = simHeight;
    this.baseScale = Math.min(canvasWidth / simWidth, canvasHeight / simHeight);
    this.scale = this.baseScale;
    this.zoomFactor = 1.0;
    this.cameraOffset = { x: 0, y: 0 };
  }

  /**
   * Updates the camera offset for panning
   * @param {Object} offset - The camera offset {x, y}
   */
  updateCameraOffset(offset) {
    this.cameraOffset = offset;
  }

  /**
   * Updates the zoom factor
   * @param {number} factor - The zoom factor to apply (positive for zoom in, negative for zoom out)
   */
  updateZoom(factor) {
    // Apply zoom factor with limits
    this.zoomFactor = Math.max(0.5, Math.min(5.0, this.zoomFactor + factor));
    this.scale = this.baseScale * this.zoomFactor;
  }

  /**
   * Resets the camera to default position and zoom
   */
  resetCamera() {
    this.cameraOffset = { x: 0, y: 0 };
    this.zoomFactor = 1.0;
    this.scale = this.baseScale;
  }

  /**
   * Converts simulation X coordinate to canvas X coordinate
   * @param {number} x - X coordinate in simulation space
   * @returns {number} - X coordinate in canvas space
   */
  toCanvasX(x) {
    return (x - this.cameraOffset.x) * this.scale;
  }

  /**
   * Converts simulation Y coordinate to canvas Y coordinate
   * @param {number} y - Y coordinate in simulation space
   * @returns {number} - Y coordinate in canvas space
   */
  toCanvasY(y) {
    return this.canvasHeight - (y - this.cameraOffset.y) * this.scale;
  }

  /**
   * Converts canvas X coordinate to simulation X coordinate
   * @param {number} canvasX - X coordinate in canvas space
   * @returns {number} - X coordinate in simulation space
   */
  toSimX(canvasX) {
    return canvasX / this.scale + this.cameraOffset.x;
  }

  /**
   * Converts canvas Y coordinate to simulation Y coordinate
   * @param {number} canvasY - Y coordinate in canvas space
   * @returns {number} - Y coordinate in simulation space
   */
  toSimY(canvasY) {
    return (this.canvasHeight - canvasY) / this.scale + this.cameraOffset.y;
  }

  /**
   * Draws a circle on the canvas
   * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
   * @param {Object} obj - Circle object to draw
   */
  drawCircle(ctx, obj) {
    ctx.beginPath();
    ctx.fillStyle = "blue";
    ctx.arc(
      this.toCanvasX(obj.position.x),
      this.toCanvasY(obj.position.y),
      obj.radius * this.scale,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }

  /**
   * Draws a rectangle on the canvas
   * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
   * @param {Object} obj - Rectangle object to draw
   */
  drawRect(ctx, obj) {
    ctx.fillStyle = obj.isStatic ? "#70543e" : "#8B4513";

    // Calculate top-left based on center position
    const topLeftX = this.toCanvasX(obj.position.x - obj.width / 2);
    const topLeftY = this.toCanvasY(obj.position.y + obj.height / 2);

    ctx.fillRect(
      topLeftX,
      topLeftY,
      obj.width * this.scale,
      obj.height * this.scale
    );

    // Border
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 1;
    ctx.strokeRect(
      topLeftX,
      topLeftY,
      obj.width * this.scale,
      obj.height * this.scale
    );
  }

  /**
   * Draws a triangle on the canvas
   * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
   * @param {Object} obj - Triangle object to draw
   */
  drawTriangle(ctx, obj) {
    ctx.fillStyle = "green";
    ctx.beginPath();

    // Save the current context state
    ctx.save();

    // Translate to the position of the triangle
    const centerX = this.toCanvasX(obj.position.x);
    const centerY = this.toCanvasY(obj.position.y);
    ctx.translate(centerX, centerY);

    // Apply rotation
    ctx.rotate(-obj.rotation); // Negative because canvas Y is inverted

    // Draw the triangle relative to the center position
    // We need to convert the points to canvas space but relative to the center
    ctx.beginPath();
    const points = obj.points;
    const firstPoint = {
      x: points[0].x * this.scale,
      y: -points[0].y * this.scale, // Negate Y because canvas Y is inverted
    };

    ctx.moveTo(firstPoint.x, firstPoint.y);

    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(
        points[i].x * this.scale,
        -points[i].y * this.scale // Negate Y because canvas Y is inverted
      );
    }

    ctx.closePath();
    ctx.fill();

    // Draw a border for better visibility
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 1;
    ctx.stroke();

    // Restore the context to its original state
    ctx.restore();
  }

  /**
   * Draws all objects in the scene
   * @param {CanvasRenderingContext2D} ctx - Canvas rendering context
   * @param {Array} objects - Array of physics objects to draw
   */
  drawScene(ctx, objects) {
    ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

    objects.forEach((obj) => {
      if (!obj?.position) {
        console.warn("⚠️ Skipping object without position", obj);
        return;
      }
      if (obj.shape === "circle") this.drawCircle(ctx, obj);
      if (obj.shape === "rectangle") this.drawRect(ctx, obj);
      if (obj.shape === "triangle") this.drawTriangle(ctx, obj);
    });
  }
}
