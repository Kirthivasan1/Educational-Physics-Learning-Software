import React from "react";

const InfoPanel = ({ objectCount, canvasWidth, canvasHeight, simSpeed }) => {

  return (
    <div className="bg-white rounded-lg shadow-md border border-slate-200 p-4 flex flex-col gap-2">
      <div className="flex justify-between">
        <span className="text-slate-500">Objects</span>
        <span className="font-semibold text-black">{objectCount}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-slate-500">Canvas Size</span>
        <span className="font-semibold text-black">
          {canvasWidth} x {canvasHeight}
        </span>
      </div>
      <div className="flex justify-between gap-3">
        <span className="text-slate-500">Simulation Speed</span>
        <span className="font-semibold text-black">{simSpeed}x</span>
      </div>
    </div>
  );
};

export default InfoPanel;
