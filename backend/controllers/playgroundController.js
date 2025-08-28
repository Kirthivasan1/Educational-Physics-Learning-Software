import Playground from "../models/Playground.js";
import PhysicsObject from "../models/PhysicsObject.js";

export async function createPlayground(req, res) {
  try {
    const user = req.user._id;
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    // Step 1: Create the playground
    const playground = new Playground({ name, user });
    await playground.save();

    res
      .status(201)
      .json({ message: "Playground created", playgroundId: playground._id });
  } catch (error) {
    console.error("Error creating playground:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getPlaygrounds(req, res) {
  try {
    const playgrounds = await Playground.find({});
    res.status(200).json(playgrounds);
  } catch (error) {
    console.error("Error fetching playgrounds:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getPlaygroundById(req, res) {
  try {
    const { id } = req.params;

    const playground = await Playground.findById(id).populate("physicsObjects");

    if (!playground) {
      return res.status(404).json({ message: "Playground not found" });
    }

    res.status(200).json(playground);
  } catch (error) {
    console.error("Error fetching playground by ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function updatePlayground(req, res) {
  try {
    const { id } = req.params;
    const { addObject, removeObjectId } = req.body;

    const playground = await Playground.findById(id);
    if (!playground) {
      return res.status(404).json({ message: "Playground not found" });
    }

    let newObjectId = null;

    // 🟣 ADD PHYSICS OBJECT
    if (addObject) {
      const { type, position, name } = addObject;

      // Defensive checks
      if (!type || !position?.x || !position?.y) {
        return res.status(400).json({ message: "Invalid object data" });
      }

      const newPhysicsObject = new PhysicsObject({
        name: name || type,             // required
        playground: id,                 // required
        type,
        position,
        properties: {},                 // optional
      });

      const saved = await newPhysicsObject.save();
      playground.physicsObjects.push(saved._id);
      newObjectId = saved._id;
    }

    // 🟣 REMOVE PHYSICS OBJECT
    if (removeObjectId) {
      playground.physicsObjects = playground.physicsObjects.filter(
        (objId) => objId.toString() !== removeObjectId
      );
      await PhysicsObject.findByIdAndDelete(removeObjectId);
    }

    // Optional: Attach user if needed
    if (!playground.user && req.user?.id) {
      playground.user = req.user.id;
    }

    await playground.save();

    res.status(200).json({
      message: "Playground updated",
      addedObjectId: newObjectId,
      playground,
    });

  } catch (err) {
    console.error("Error updating playground:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function deletePlayground(req, res) {
  try {
    const { id } = req.params;

    const playground = await Playground.findById(id);
    if (!playground) {
      return res.status(404).json({ message: "Playground not found" });
    }

    await Playground.findByIdAndDelete(id);

    res.status(200).json({ message: "Playground deleted successfully" });
  } catch (error) {
    console.error("Error deleting playground:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
