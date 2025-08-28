// controllers/physicsObjectController.js
import PhysicsObject from "../models/PhysicsObject.js";

export async function createPhysicsObject(req, res) {
  try {
    
    const object = new PhysicsObject(req.body);
    await object.save();
    res.status(201).json({ message: "PhysicsObject created", object });
  } catch (err) {
    console.error("Error creating PhysicsObject:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getAllPhysicsObjects(req, res) {
  try {
    console.log(req.user.id);
    const objects = await PhysicsObject.find();
    res.status(200).json(objects);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch objects" });
  }
}
