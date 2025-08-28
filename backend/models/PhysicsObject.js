import mongoose from "mongoose";

const physicsObjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  playground: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Playground',
    required: true
  },
  mass: {
    type: Number,
    required: true,
    default: 1
  },
  position: {
    x: { type: Number, required: true },
    y: { type: Number, required: true }
  },
  velocity: {
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 }
  },
  acceleration: {
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 }
  },
  appliedForce: {
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 }
  },
  coefficientOfRestitution: {
    type: Number,
    default: 1 // 1 = perfectly elastic, 0 = perfectly inelastic
  },
  collidable: {
    type: Boolean,
    default: true
  },
  shape: {
    type: String,
    enum: ['circle', 'rectangle'],
    default: 'circle'
  },
  radius: {
    type: Number, // for circles
    default: 10
  },
  width: {
    type: Number, // for rectangles
    default: 20
  },
  height: {
    type: Number,
    default: 20
  },
  color: {
    type: String,
    default: '#ff0000'
  },
  isStatic: {
    type: Boolean,
    default: false // If true, object doesn't move (like ground)
  }
}, { timestamps: true });

export default mongoose.model('PhysicsObject', physicsObjectSchema);