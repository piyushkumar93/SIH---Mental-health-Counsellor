"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const Appointment_1 = require("../models/Appointment");
const router = express_1.default.Router();
// Create appointment
router.post("/", auth_1.requireAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { collegeName, scheduledAt, counsellorId, notes } = req.body;
    if (!collegeName || !scheduledAt) {
        return res.status(400).json({ message: "Missing fields" });
    }
    const appt = new Appointment_1.Appointment({
        collegeName,
        userId: req.user._id,
        counsellorId,
        scheduledAt,
        notes,
    });
    yield appt.save();
    res.status(201).json(appt);
}));
// Get user's appointments
router.get("/me", auth_1.requireAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const list = yield Appointment_1.Appointment.find({ userId: req.user._id }).populate("counsellorId");
    res.json(list);
}));
// Admin: list all appointments
router.get("/", auth_1.requireAuth, auth_1.requireAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const list = yield Appointment_1.Appointment.find()
        .populate("userId")
        .populate("counsellorId");
    res.json(list);
}));
// Update appointment status (user or admin)
router.put("/:id", auth_1.requireAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const appt = yield Appointment_1.Appointment.findById(req.params.id);
    if (!appt)
        return res.status(404).json({ message: "Not found" });
    // Normalize ObjectIds to strings
    const apptUserId = appt.userId.toString();
    const currentUserId = req.user._id.toString();
    // only admin or owner can update
    if (req.user.role !== "admin" && apptUserId !== currentUserId) {
        return res.status(403).json({ message: "Forbidden" });
    }
    Object.assign(appt, req.body);
    yield appt.save();
    res.json(appt);
}));
// Cancel appointment
router.delete("/:id", auth_1.requireAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const appt = yield Appointment_1.Appointment.findById(req.params.id);
    if (!appt)
        return res.status(404).json({ message: "Not found" });
    const apptUserId = appt.userId.toString();
    const currentUserId = req.user._id.toString();
    if (req.user.role !== "admin" && apptUserId !== currentUserId) {
        return res.status(403).json({ message: "Forbidden" });
    }
    appt.status = "cancelled";
    yield appt.save();
    res.json({ message: "Cancelled", appt });
}));
exports.default = router;
