import express from "express";
import { requireAuth, requireAdmin } from "../middleware/auth";
import { User } from "../models/user";

const router = express.Router();

// Get current profile
router.get("/me", requireAuth, (req, res) => {
  const user = req.user!;
  res.json({
    id: user._id,
    name: user.name,
    email: user.email,
    age: user.age,
    college: user.college,
    phone: user.phone,
    gender: user.gender,
    role: user.role
  });
});

// Admin: list users
router.get("/", requireAuth, requireAdmin, async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

export default router;
