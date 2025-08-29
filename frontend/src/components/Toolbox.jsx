import React from "react";
import { Circle, Square, Triangle } from "lucide-react";

const Toolbox = ({ onAdd, placementMode }) => {
  const tools = [
    { type: "circle", label: "Circle", icon: <Circle size={20} /> },
    { type: "rectangle", label: "Rectangle", icon: <Square size={20} /> },
    { type: "triangle", label: "Triangle", icon: <Triangle size={20} /> },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md border border-slate-200 p-4 flex flex-col gap-3">
      <h2 className="text-lg font-semibold text-slate-800 mb-2">Toolbox</h2>
      {tools.map((tool) => (
        <button
          key={tool.type}
          onClick={() => onAdd(tool.type)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg transition ${placementMode === tool.type ? 'bg-blue-200 hover:bg-blue-300' : 'bg-slate-100 hover:bg-slate-200'}`}
        >
          {tool.icon}
          <span>{tool.label}</span>
        </button>
      ))}
    </div>
  );
};

export default Toolbox;
