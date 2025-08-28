// models/Playground.js

import mongoose from "mongoose";

const PlaygroundSchema = new mongoose.Schema({
  name: { type: String, required: true },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  physicsObjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "PhysicsObject" }]
  // other fields as needed...
});

export default mongoose.model("Playground", PlaygroundSchema);
