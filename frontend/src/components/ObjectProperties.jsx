import React from 'react';
import { Vector2 } from '../physics/Vector2';
import { Trash2, RotateCw } from 'lucide-react';

const ObjectProperties = ({ selectedObject, setObjects, selectedObjectIndex }) => {
  if (!selectedObject) {
    return (
      <div className="bg-white rounded-lg shadow-md border border-slate-200 p-4">
        <p className="text-gray-500 italic">Select an object to edit its properties</p>
      </div>
    );
  }
  
  const handleDelete = () => {
    setObjects(prevObjects => {
      const newObjects = [...prevObjects];
      newObjects.splice(selectedObjectIndex, 1);
      return newObjects;
    });
  };

  const handlePositionChange = (axis, value) => {
    setObjects(prevObjects => {
      const newObjects = [...prevObjects];
      const newPosition = new Vector2(
        axis === 'x' ? parseFloat(value) : selectedObject.position.x,
        axis === 'y' ? parseFloat(value) : selectedObject.position.y
      );
      
      newObjects[selectedObjectIndex] = {
        ...selectedObject,
        position: newPosition
      };
      
      return newObjects;
    });
  };

  const handleVelocityChange = (axis, value) => {
    setObjects(prevObjects => {
      const newObjects = [...prevObjects];
      const newVelocity = new Vector2(
        axis === 'x' ? parseFloat(value) : selectedObject.velocity.x,
        axis === 'y' ? parseFloat(value) : selectedObject.velocity.y
      );
      
      newObjects[selectedObjectIndex] = {
        ...selectedObject,
        velocity: newVelocity
      };
      
      return newObjects;
    });
  };

  const handleAccelerationChange = (axis, value) => {
    setObjects(prevObjects => {
      const newObjects = [...prevObjects];
      const newAcceleration = new Vector2(
        axis === 'x' ? parseFloat(value) : selectedObject.acceleration.x,
        axis === 'y' ? parseFloat(value) : selectedObject.acceleration.y
      );
      
      newObjects[selectedObjectIndex] = {
        ...selectedObject,
        acceleration: newAcceleration
      };
      
      return newObjects;
    });
  };

  const handleRotationChange = (value) => {
    setObjects(prevObjects => {
      const newObjects = [...prevObjects];
      const updatedObject = { ...newObjects[selectedObjectIndex] };
      updatedObject.rotation = parseFloat(value);
      newObjects[selectedObjectIndex] = updatedObject;
      return newObjects;
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-slate-200 p-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-medium text-lg">
          {selectedObject.shape.charAt(0).toUpperCase() + selectedObject.shape.slice(1)} Properties
        </h3>
        <button 
          onClick={handleDelete}
          className="p-1 text-red-500 hover:bg-red-100 rounded-full transition-colors"
          title="Delete object"
        >
          <Trash2 size={18} />
        </button>
      </div>
      
      <div className="space-y-4">
        <div>
          <h4 className="font-medium mb-2">Position</h4>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-sm text-gray-600 mb-1">X</label>
              <input 
                type="number" 
                className="w-full border rounded p-1 text-sm" 
                value={selectedObject.position.x}
                onChange={(e) => handlePositionChange('x', e.target.value)}
                step="0.1"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm text-gray-600 mb-1">Y</label>
              <input 
                type="number" 
                className="w-full border rounded p-1 text-sm" 
                value={selectedObject.position.y}
                onChange={(e) => handlePositionChange('y', e.target.value)}
                step="0.1"
              />
            </div>
          </div>
        </div>
        
        {selectedObject.shape === "triangle" && (
          <div>
            <h4 className="font-medium mb-2">Rotation</h4>
            <div className="flex items-center gap-2">
              <RotateCw size={16} className="text-gray-500" />
              <input
                type="range"
                min="0"
                max={Math.PI * 2}
                step="0.01"
                value={selectedObject.rotation || 0}
                onChange={(e) => handleRotationChange(e.target.value)}
                className="w-full"
              />
              <span className="text-sm text-gray-600">
                {Math.round((selectedObject.rotation || 0) * 180 / Math.PI)}°
              </span>
            </div>
          </div>
        )}

        <div>
          <h4 className="font-medium mb-2">Velocity</h4>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-sm text-gray-600 mb-1">X</label>
              <input 
                type="number" 
                className="w-full border rounded p-1 text-sm" 
                value={selectedObject.velocity.x}
                onChange={(e) => handleVelocityChange('x', e.target.value)}
                step="0.1"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm text-gray-600 mb-1">Y</label>
              <input 
                type="number" 
                className="w-full border rounded p-1 text-sm" 
                value={selectedObject.velocity.y}
                onChange={(e) => handleVelocityChange('y', e.target.value)}
                step="0.1"
              />
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-2">Acceleration</h4>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-sm text-gray-600 mb-1">X</label>
              <input 
                type="number" 
                className="w-full border rounded p-1 text-sm" 
                value={selectedObject.acceleration.x}
                onChange={(e) => handleAccelerationChange('x', e.target.value)}
                step="0.1"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm text-gray-600 mb-1">Y</label>
              <input 
                type="number" 
                className="w-full border rounded p-1 text-sm" 
                value={selectedObject.acceleration.y}
                onChange={(e) => handleAccelerationChange('y', e.target.value)}
                step="0.1"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ObjectProperties;