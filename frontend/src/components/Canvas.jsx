// Canvas.js
import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";
import { Renderer } from "../physics/renderer";
import { SimulationManager } from "../physics/simulationManager";
import PhysicsObject from "./physicsObject";
import { Vector2 } from "../physics/Vector2";

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 500;

const Canvas = forwardRef(({ objects, setObjects, isRunning, gravity, onSelectObject, placementMode, onCanvasClick }, ref) => {
  const canvasRef = useRef(null);
  const simWidth = 20;
  const simHeight = 12;
  const [renderer] = useState(() => new Renderer(CANVAS_WIDTH, CANVAS_HEIGHT, simWidth, simHeight));
  const [simulationManager] = useState(() => new SimulationManager(simWidth, simHeight));
  
  // State for object selection and dragging
  const [selectedObject, setSelectedObject] = useState(null);
  const [selectedObjectIndex, setSelectedObjectIndex] = useState(-1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  // State for camera panning and zooming
  const [isPanning, setIsPanning] = useState(false);
  const [cameraOffset, setCameraOffset] = useState({ x: 0, y: 0 });
  const [panStartPos, setPanStartPos] = useState({ x: 0, y: 0 });
  const [zoomFactor, setZoomFactor] = useState(1.0);
  
  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    resetCamera: () => {
      const newOffset = { x: 0, y: 0 };
      setCameraOffset(newOffset);
      setZoomFactor(1.0);
      if (renderer) {
        renderer.resetCamera();
      }
    }
  }));
  
  // Handle mouse wheel for zooming
  const handleWheel = (e) => {
    if (isRunning) return; // Don't allow zooming while simulation is running
    
    e.preventDefault();
    
    // Determine zoom direction and factor
    const zoomChange = e.deltaY < 0 ? 0.1 : -0.1;
    const newZoomFactor = Math.max(0.5, Math.min(5.0, zoomFactor + zoomChange));
    
    setZoomFactor(newZoomFactor);
    
    if (renderer) {
      renderer.updateZoom(zoomChange);
    }
  };

  // Animation loop
  useEffect(() => {
    if (!isRunning) return;
    const ctx = canvasRef.current.getContext("2d");
    let animationFrameId;

    const timeScale = 1;

    const loop = () => {
      const deltaTime = (1.0 / 60.0) * timeScale;

      // Update physics simulation
      setObjects((prev) => simulationManager.update(prev, deltaTime, gravity));

      // Render the scene
      renderer.drawScene(ctx, objects);

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isRunning, setObjects, objects, renderer, simulationManager]);
  
  // Keyboard controls for panning
  useEffect(() => {
    const PAN_STEP = 0.5; // Pan step size in simulation units
    
    const handleKeyDown = (e) => {
      if (isRunning) return; // Don't allow panning while simulation is running
      
      let newOffset = { ...cameraOffset };
      
      switch (e.key) {
        case 'ArrowLeft':
          newOffset.x -= PAN_STEP;
          break;
        case 'ArrowRight':
          newOffset.x += PAN_STEP;
          break;
        case 'ArrowUp':
          newOffset.y += PAN_STEP;
          break;
        case 'ArrowDown':
          newOffset.y -= PAN_STEP;
          break;
        default:
          return; // Exit if not an arrow key
      }
      
      setCameraOffset(newOffset);
      renderer.updateCameraOffset(newOffset);
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [cameraOffset, isRunning, renderer]);

  useEffect(() => {
    const ctx = canvasRef.current.getContext("2d");
    renderer.drawScene(ctx, objects);
  }, [objects, renderer]);

  // Helper function to check if a point is inside a circle
  const isPointInCircle = (point, circle) => {
    const dx = point.x - circle.position.x;
    const dy = point.y - circle.position.y;
    return dx * dx + dy * dy <= circle.radius * circle.radius;
  };

  // Helper function to check if a point is inside a rectangle
  const isPointInRectangle = (point, rect) => {
    return (
      point.x >= rect.position.x - rect.width / 2 &&
      point.x <= rect.position.x + rect.width / 2 &&
      point.y >= rect.position.y - rect.height / 2 &&
      point.y <= rect.position.y + rect.height / 2
    );
  };

  // Find object under the mouse cursor
  const findObjectAtPosition = (x, y) => {
    const simX = renderer.toSimX(x);
    const simY = renderer.toSimY(y);
    const point = { x: simX, y: simY };

    // Check objects in reverse order (top to bottom)
    for (let i = objects.length - 1; i >= 0; i--) {
      const obj = objects[i];
      if (!obj?.position || obj.isStatic) continue;

      if (obj.shape === "circle" && isPointInCircle(point, obj)) {
        return { object: obj, index: i };
      } else if (obj.shape === "rectangle" && isPointInRectangle(point, obj)) {
        return { object: obj, index: i };
      }
    }
    return { object: null, index: -1 };
  };

  // Mouse event handlers
  const handleMouseDown = (e) => {
    if (isRunning) return; // Don't allow selection while simulation is running
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Middle mouse button for panning
    if (e.button === 1) {
      setIsPanning(true);
      setPanStartPos({ x, y });
      return;
    }
    
    // Convert canvas coordinates to simulation coordinates
    const simX = renderer.toSimX(x);
    const simY = renderer.toSimY(y);
    
    // If in placement mode, place an object and return
    if (placementMode && onCanvasClick) {
      onCanvasClick(new Vector2(simX, simY));
      return;
    }
    
    // Otherwise, handle object selection
    const { object, index } = findObjectAtPosition(x, y);
    
    if (object) {
      setSelectedObject(object);
      setSelectedObjectIndex(index);
      setIsDragging(true);
      
      // Notify parent component about selected object
      if (onSelectObject) {
        onSelectObject(object, index);
      }
      
      // Calculate offset from object center to click position
      setDragOffset({
        x: object.position.x - simX,
        y: object.position.y - simY
      });
    } else {
      setSelectedObject(null);
      setSelectedObjectIndex(-1);
      
      // Notify parent component about deselection
      if (onSelectObject) {
        onSelectObject(null, -1);
      }
    }
  };

  const handleMouseMove = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Handle panning with middle mouse button
    if (isPanning) {
      const dx = (x - panStartPos.x) / renderer.scale;
      const dy = (y - panStartPos.y) / renderer.scale * -1; // Invert Y axis
      
      const newOffset = {
        x: cameraOffset.x - dx,
        y: cameraOffset.y - dy
      };
      
      setCameraOffset(newOffset);
      setPanStartPos({ x, y });
      
      // Update renderer with new camera offset
      renderer.updateCameraOffset(newOffset);
      return;
    }
    
    if (!isDragging || !selectedObject || isRunning) return;
    
    const simX = renderer.toSimX(x);
    const simY = renderer.toSimY(y);
    
    // Update object position with drag offset
    setObjects(prevObjects => {
      const newObjects = [...prevObjects];
      const newPosition = new Vector2(
        simX + dragOffset.x,
        simY + dragOffset.y
      );
      
      // Create a new object with updated position
      newObjects[selectedObjectIndex] = {
        ...selectedObject,
        position: newPosition,
        velocity: new Vector2(0, 0) // Reset velocity when dragging
      };
      
      // Update selected object reference
      setSelectedObject(newObjects[selectedObjectIndex]);
      
      return newObjects;
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsPanning(false);
  };

  // Determine cursor style based on current mode
  const getCursorStyle = () => {
    if (isPanning) {
      return "move";
    } else if (placementMode) {
      return "crosshair";
    } else if (isDragging) {
      return "grabbing";
    } else if (selectedObject) {
      return "grab";
    } else {
      return "default";
    }
  };
  
  // Add a visual indicator for panning mode
  const renderPanningIndicator = () => {
    if (!isPanning) return null;
    
    return (
      <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded-md text-sm">
        Panning Mode (Middle Mouse Button)
      </div>
    );
  };
  
  // Add keyboard shortcut help
  const renderKeyboardHelp = () => {
    return (
      <div className="absolute bottom-2 right-2 bg-gray-700 text-white px-2 py-1 rounded-md text-xs opacity-70 hover:opacity-100 transition-opacity">
        Tip: Use arrow keys to pan
      </div>
    );
  };
  
  // Add zoom level indicator
  const renderZoomIndicator = () => {
    const zoomPercentage = Math.round(zoomFactor * 100);
    
    return (
      <div className="absolute top-2 left-2 bg-gray-700 text-white px-2 py-1 rounded-md text-xs opacity-70 hover:opacity-100 transition-opacity">
        Zoom: {zoomPercentage}%
      </div>
    );
  };

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="border border-slate-300 bg-white rounded shadow"
        style={{ cursor: getCursorStyle() }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      />
      {renderPanningIndicator()}
      {renderZoomIndicator()}
      {renderKeyboardHelp()}
      <div className="absolute bottom-2 left-2 bg-gray-700 text-white px-2 py-1 rounded-md text-xs opacity-70 hover:opacity-100 transition-opacity">
        Scroll to zoom in/out
      </div>
    </div>
  );
}

); // Close the forwardRef component

export default Canvas;
