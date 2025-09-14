import express from "express";
import { requireAuth, requireAdmin } from "../middleware/auth";
import { Analytics } from "../models/Analytics";
import { Appointment } from "../models/Appointment";
import { ForumPost } from "../models/ForumPost";

const router = express.Router();

// Admin: create or log analytics event
router.post("/", requireAuth, requireAdmin, async (req, res) => {
  const data = req.body;
  const entry = new Analytics(data);
  await entry.save();
  res.status(201).json(entry);
});

// Admin: compute a simple snapshot (example)
router.get("/snapshot", requireAuth, requireAdmin, async (req, res) => {
  const totalAppointments = await Appointment.countDocuments();
  const forumPostsCount = await ForumPost.countDocuments();
  const snapshot = {
    timestamp: new Date(),
    totalAppointments,
    forumPostsCount
  };
  const entry = new Analytics(snapshot);
  await entry.save();
  res.json(snapshot);
});

// public: recent analytics (admin-only)
router.get("/", requireAuth, requireAdmin, async (req, res) => {
  const list = await Analytics.find().sort({ timestamp: -1 }).limit(50);
  res.json(list);
});

export default router;
