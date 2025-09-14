import express from "express";
import { requireAuth, requireAdmin } from "../middleware/auth";
import { Appointment } from "../models/Appointment";
import { Types } from "mongoose";

const router = express.Router();

// Create appointment
router.post("/", requireAuth, async (req, res) => {
  const { collegeName, scheduledAt, counsellorId, notes } = req.body;
  if (!collegeName || !scheduledAt) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const appt = new Appointment({
    collegeName,
    userId: req.user!._id,
    counsellorId,
    scheduledAt,
    notes,
  });

  await appt.save();
  res.status(201).json(appt);
});

// Get user's appointments
router.get("/me", requireAuth, async (req, res) => {
  const list = await Appointment.find({ userId: req.user!._id }).populate(
    "counsellorId"
  );
  res.json(list);
});

// Admin: list all appointments
router.get("/", requireAuth, requireAdmin, async (req, res) => {
  const list = await Appointment.find()
    .populate("userId")
    .populate("counsellorId");
  res.json(list);
});

// Update appointment status (user or admin)
router.put("/:id", requireAuth, async (req, res) => {
  const appt = await Appointment.findById(req.params.id);
  if (!appt) return res.status(404).json({ message: "Not found" });

  // Normalize ObjectIds to strings
  const apptUserId = (appt.userId as Types.ObjectId).toString();
  const currentUserId = (req.user!._id as Types.ObjectId).toString();

  // only admin or owner can update
  if (req.user!.role !== "admin" && apptUserId !== currentUserId) {
    return res.status(403).json({ message: "Forbidden" });
  }

  Object.assign(appt, req.body);
  await appt.save();
  res.json(appt);
});

// Cancel appointment
router.delete("/:id", requireAuth, async (req, res) => {
  const appt = await Appointment.findById(req.params.id);
  if (!appt) return res.status(404).json({ message: "Not found" });

  const apptUserId = (appt.userId as Types.ObjectId).toString();
  const currentUserId = (req.user!._id as Types.ObjectId).toString();

  if (req.user!.role !== "admin" && apptUserId !== currentUserId) {
    return res.status(403).json({ message: "Forbidden" });
  }

  appt.status = "cancelled";
  await appt.save();

  res.json({ message: "Cancelled", appt });
});

export default router;
