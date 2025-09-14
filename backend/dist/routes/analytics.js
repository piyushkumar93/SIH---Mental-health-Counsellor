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
const Analytics_1 = require("../models/Analytics");
const Appointment_1 = require("../models/Appointment");
const ForumPost_1 = require("../models/ForumPost");
const router = express_1.default.Router();
// Admin: create or log analytics event
router.post("/", auth_1.requireAuth, auth_1.requireAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    const entry = new Analytics_1.Analytics(data);
    yield entry.save();
    res.status(201).json(entry);
}));
// Admin: compute a simple snapshot (example)
router.get("/snapshot", auth_1.requireAuth, auth_1.requireAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const totalAppointments = yield Appointment_1.Appointment.countDocuments();
    const forumPostsCount = yield ForumPost_1.ForumPost.countDocuments();
    const snapshot = {
        timestamp: new Date(),
        totalAppointments,
        forumPostsCount
    };
    const entry = new Analytics_1.Analytics(snapshot);
    yield entry.save();
    res.json(snapshot);
}));
// public: recent analytics (admin-only)
router.get("/", auth_1.requireAuth, auth_1.requireAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const list = yield Analytics_1.Analytics.find().sort({ timestamp: -1 }).limit(50);
    res.json(list);
}));
exports.default = router;
