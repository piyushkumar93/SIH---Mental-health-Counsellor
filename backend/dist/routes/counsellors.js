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
const Counceller_1 = require("../models/Counceller");
const router = express_1.default.Router();
// Create counsellor (admin)
router.post("/", auth_1.requireAuth, auth_1.requireAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const doc = new Counceller_1.Counsellor(req.body);
    yield doc.save();
    res.status(201).json(doc);
}));
// Get all counsellors (optional filter by collegeName)
router.get("/", auth_1.requireAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { college } = req.query;
    const filter = {};
    if (college)
        filter.collegeName = String(college);
    const list = yield Counceller_1.Counsellor.find(filter);
    res.json(list);
}));
// Get one
router.get("/:id", auth_1.requireAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const c = yield Counceller_1.Counsellor.findById(req.params.id);
    if (!c)
        return res.status(404).json({ message: "Not found" });
    res.json(c);
}));
// Update (admin)
router.put("/:id", auth_1.requireAuth, auth_1.requireAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const c = yield Counceller_1.Counsellor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(c);
}));
// Delete (admin)
router.delete("/:id", auth_1.requireAuth, auth_1.requireAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield Counceller_1.Counsellor.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
}));
exports.default = router;
