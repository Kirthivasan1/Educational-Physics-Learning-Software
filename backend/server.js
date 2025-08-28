import express from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import cors from "cors";

import playgroundRoutes from "./routes/playgroundRoutes.js";
import authRoutes from "./routes/auth.js";
import physicsObjectRoutes from "./routes/physicsObjectRoutes.js";
import { connectDB } from "./middleware/db.js";
import User from "./models/User.js"; // 🔑 Needed for JWT middleware


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());               // Enable if frontend is running separately
app.use(express.json()); 

app.use(async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "yoursecretkey");

      const user = await User.findById(decoded.id).select("-password");
      if (user) {
        req.user = user; // ✅ Attach user to request
      }
    }
  } catch (err) {
    console.warn("JWT middleware error:", err.message);
    // Don't throw — just skip attaching user
  }
  next(); // ✅ Always continue
});

// Routes
app.use("/auth", authRoutes);
app.use("/api/playground", playgroundRoutes);
app.use('/api/physics-object', physicsObjectRoutes);

// Start server
app.listen(PORT, () => {
  console.log(` Server listening on http://localhost:${PORT}`);
});

/*
Playground (e.g., kinematic playground)

Components (e.g., ball, ramp)
*/
