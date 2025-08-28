import express from "express";

import {
  createPlayground,
  getPlaygrounds,
  getPlaygroundById,
  updatePlayground,
  deletePlayground
} from "../controllers/playgroundController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getPlaygrounds);
router.post("/", protect, createPlayground);
router.get("/:id", getPlaygroundById);
router.patch("/:id", updatePlayground);
router.delete("/:id", deletePlayground);

export default router;
