import express from "express";
import { requireAuth, requireAdmin } from "../middleware/auth";
import { Counsellor } from "../models/Counceller";

const router = express.Router();

// Create counsellor (admin)
router.post("/", requireAuth, requireAdmin, async (req, res) => {
  const doc = new Counsellor(req.body);
  await doc.save();
  res.status(201).json(doc);
});

// Get all counsellors (optional filter by collegeName)
router.get("/", requireAuth, async (req, res) => {
  const { college } = req.query;
  const filter: any = {};
  if (college) filter.collegeName = String(college);
  const list = await Counsellor.find(filter);
  res.json(list);
});

// Get one
router.get("/:id", requireAuth, async (req, res) => {
  const c = await Counsellor.findById(req.params.id);
  if (!c) return res.status(404).json({ message: "Not found" });
  res.json(c);
});

// Update (admin)
router.put("/:id", requireAuth, requireAdmin, async (req, res) => {
  const c = await Counsellor.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(c);
});

// Delete (admin)
router.delete("/:id", requireAuth, requireAdmin, async (req, res) => {
  await Counsellor.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

export default router;
