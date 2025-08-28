import React from "react";
import { Play, Pause, StepForward, Trash2, Square, Maximize } from "lucide-react";

const ControlsPanel = ({ onPlay, onPause, onStep, onClear, isRunning, showGround, onToggleGround, gravity, onGravityChange, onResetCamera }) => {
  return (
    <div className="bg-white p-3 rounded-lg shadow-md border border-slate-200">
      <div className="flex gap-3 items-center mb-3">
        {isRunning ? (
          <button
            onClick={onPause}
            className="flex items-center gap-1 px-3 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
          >
            <Pause size={18} /> Pause
          </button>
        ) : (
          <button
            onClick={onPlay}
            className="flex items-center gap-1 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            <Play size={18} /> Play
          </button>
        )}

        <button
          onClick={onStep}
          className="flex items-center gap-1 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          <StepForward size={18} /> Step
        </button>

        <button
          onClick={onClear}
          className="flex items-center gap-1 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          <Trash2 size={18} /> Clear
        </button>
        
        <button
          onClick={onResetCamera}
          className="flex items-center gap-1 px-3 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
        >
          <Maximize size={18} /> Reset Camera
        </button>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="showGround"
            checked={showGround}
            onChange={onToggleGround}
            className="h-4 w-4"
          />
          <label htmlFor="showGround" className="flex items-center gap-1 text-sm">
            <Square size={16} className="text-gray-500" /> Show Ground
          </label>
        </div>
        
        <div>
          <label htmlFor="gravity" className="block text-sm mb-1">Gravity: {gravity.toFixed(1)}</label>
          <input
            type="range"
            id="gravity"
            min="0"
            max="10"
            step="0.1"
            value={gravity}
            onChange={(e) => onGravityChange(parseFloat(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>Space (0)</span>
            <span>Earth (9.8)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlsPanel;
