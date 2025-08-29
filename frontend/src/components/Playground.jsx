import React, { useState, useEffect, useRef } from "react";
import Toolbox from "./Toolbox";
import InfoPanel from "./InfoPanel";
import ControlPanel from "./ControlPanel";
import Canvas from "./Canvas";
import ObjectProperties from "./ObjectProperties";
import PhysicsObject from "../physics/physicsObject";
import { Vector2 } from "../physics/Vector2";
import { SimulationManager } from "../physics/simulationManager";

const Playground = () => {
  const [selectedObject, setSelectedObject] = useState(null);
  const [selectedObjectIndex, setSelectedObjectIndex] = useState(-1);
  const [placementMode, setPlacementMode] = useState(null);
  const [showGround, setShowGround] = useState(true);
  const [gravity, setGravity] = useState(9.8);
  const [clickPoints, setClickPoints] = useState([]);
  const [objects, setObjects] = useState([
    new PhysicsObject({
      shape: "circle",
      position: new Vector2(5, 10),
      velocity: new Vector2(3, 0), // Moving right toward the other ball
      acceleration: new Vector2(0, 0),
      radius: 0.75, // Same size for both balls
      mass: 1,
    }),
    new PhysicsObject({
      shape: "circle",
      position: new Vector2(15, 10),
      velocity: new Vector2(-3, 0), // Moving left toward the first ball
      acceleration: new Vector2(0, 0),
      radius: 0.75, // Same size for both balls
      mass: 1,
    }),
  ]);
  if (typeof window !== "undefined") {
    window.debugObjects = objects;
    window.setDebugObjects = setObjects;
  }

  const [isRunning, setIsRunning] = useState(false);

  // Create ground object when showGround is true
  useEffect(() => {
    if (showGround) {
      // Add ground rectangle
      const groundObject = new PhysicsObject({
        shape: "rectangle",
        position: new Vector2(10, 0.5), // Position at bottom of screen
        velocity: new Vector2(0, 0),
        acceleration: new Vector2(0, 0),
        width: 20, // Width to cover the entire simulation area (20 meters wide)
        height: 1, // Height in meters (1 meter tall)
        mass: 100, // Higher mass for stability
        isStatic: true, // Mark as static object (floor) - prevents physics updates
      });

      setObjects((prev) => {
        // Filter out any existing ground objects to avoid duplicates
        const filteredObjects = prev.filter(
          (obj) =>
            !(obj.shape === "rectangle" && obj.isStatic && obj.position.y === 0.5)
        );
        return [...filteredObjects, groundObject];
      });
    } else {
      // Remove ground rectangle
      setObjects((prev) =>
        prev.filter(
          (obj) =>
            !(obj.shape === "rectangle" && obj.isStatic && obj.position.y === 0.5)
        )
      );
    }
  }, [showGround]);

  // Update gravity when it changes
  useEffect(() => {
    // This will be used when updating the simulation manager
    // The SimulationManager will need to be updated to accept a gravity parameter
  }, [gravity]);

  const addObject = (type) => {
    // Enable placement mode with the selected object type
    setPlacementMode(type);
  };

  const handleToggleGround = () => {
    setShowGround(!showGround);
  };

  const handleGravityChange = (value) => {
    setGravity(value);
  };

  const handleCanvasClick = (position) => {
    if (!placementMode) return;

    if (placementMode === "circle") {
      const newObject = new PhysicsObject({
        shape: "circle",
        position,
        radius: 0.5,
        velocity: new Vector2(0, 0),
        acceleration: new Vector2(0, 0),
        mass: 1,
      });
      setObjects([...objects, newObject]);
      setPlacementMode(null);
    }

    if (placementMode === "rectangle") {
      if (clickPoints.length === 0) {
        setClickPoints([position]);
      } else {
        const [first] = clickPoints;
        const width = Math.abs(position.x - first.x);
        const height = Math.abs(position.y - first.y);

        // Bottom-left corner (not center)
        const bottomLeft = new Vector2(
          Math.min(position.x, first.x),
          Math.min(position.y, first.y)
        );

        const newObject = new PhysicsObject({
          shape: "rectangle",
          position: bottomLeft, // ⬅️ now consistent with your renderer
          width,
          height,
          velocity: new Vector2(0, 0),
          acceleration: new Vector2(0, 0),
          mass: 1,
        });

        setObjects([...objects, newObject]);
        setClickPoints([]);
        setPlacementMode(null);
      }
    }

    if (placementMode === "triangle") {
      const newPoints = [...clickPoints, { x: position.x, y: position.y }];
      setClickPoints(newPoints);
      if (newPoints.length === 3) {
        const newTriangle = new PhysicsObject({
          shape: "triangle",
          position: new Vector2(0, 0), // not used here
          velocity: new Vector2(0, 0),
          acceleration: new Vector2(0, 0),
          points: newPoints, // the 3 vertices
          mass: 1,
        });

        setObjects([...objects, newTriangle]);
        setPlacementMode(null); // exit triangle mode
        setClickPoints([]); // reset for next triangle
      }
    }
  };

  const handlePlay = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  const handleClear = () => setObjects([]);
  const handleStep = () => {
    const simWidth = 20;
    const simHeight = 12;
    const simulationManager = new SimulationManager(
      simWidth,
      simHeight,
      gravity
    );

    setObjects((prev) => simulationManager.update(prev, 1 / 60));
  };

  const handleSelectObject = (object, index) => {
    setSelectedObject(object);
    setSelectedObjectIndex(index);
  };
  // Function to reset camera position
  const handleResetCamera = () => {
    // This function will be passed to Canvas component
    if (canvasRef.current) {
      canvasRef.current.resetCamera();
    }
  };

  // Create a ref for the Canvas component
  const canvasRef = useRef(null);

  return (
    <div className="flex bg-slate-100">
      {/* Left Sidebar */}
      <div className="w-1/5 bg-white border-r border-slate-300 p-4 flex flex-col">
        <h2 className="text-lg font-bold mb-4">Toolbox</h2>
        <Toolbox onAdd={addObject} placementMode={placementMode} />
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar: Info + Controls */}
        <div className="flex justify-between items-center p-4 border-b border-slate-300 bg-white">
          <InfoPanel
            objectCount={objects.length}
            canvasWidth={20}
            canvasHeight={12}
            simSpeed={1}
          />
          <ControlPanel
            isRunning={isRunning}
            onPlay={handlePlay}
            onPause={handlePause}
            onStep={handleStep}
            onClear={handleClear}
            showGround={showGround}
            onToggleGround={handleToggleGround}
            gravity={gravity}
            onGravityChange={handleGravityChange}
            onResetCamera={handleResetCamera}
          />
        </div>

        {/* Simulation Canvas */}
        <div className="flex-1 flex justify-center items-center p-4">
          <Canvas
            ref={canvasRef}
            objects={objects}
            setObjects={setObjects}
            isRunning={isRunning}
            gravity={gravity}
            onSelectObject={handleSelectObject}
            placementMode={placementMode}
            onCanvasClick={handleCanvasClick}
          />
        </div>
      </div>

      {/* Right Sidebar - Object Properties */}
      <div className="w-1/5 bg-white border-l border-slate-300 p-4 flex flex-col text-black">
        <h2 className="text-lg font-bold mb-4">Properties</h2>
        <ObjectProperties
          selectedObject={objects[selectedObjectIndex]}
          selectedObjectIndex={selectedObjectIndex}
          setObjects={setObjects}
        />
      </div>
    </div>
  );
};

export default Playground;
