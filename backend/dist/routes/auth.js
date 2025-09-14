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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = require("../models/user");
const validators_1 = require("../utils/validators");
const router = express_1.default.Router();
const JWT_SECRET = process.env.JWT_SECRET || "changeme";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
router.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password, college, age, phone, gender, role } = req.body;
    if (!name || !email || !password)
        return res.status(400).json({ message: "Missing fields" });
    if (!(0, validators_1.isValidEmail)(email))
        return res.status(400).json({ message: "Invalid email" });
    const existing = yield user_1.User.findOne({ email });
    if (existing)
        return res.status(409).json({ message: "Email already registered" });
    const user = new user_1.User({ name, email, password, college, age, phone, gender, role });
    yield user.save();
    const token = jsonwebtoken_1.default.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ token, user: { id: user._id, email: user.email, name: user.name, role: user.role } });
}));
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password)
        return res.status(400).json({ message: "Missing fields" });
    const user = yield user_1.User.findOne({ email });
    if (!user)
        return res.status(401).json({ message: "Invalid credentials" });
    const matched = yield user.comparePassword(password);
    if (!matched)
        return res.status(401).json({ message: "Invalid credentials" });
    const token = jsonwebtoken_1.default.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { id: user._id, email: user.email, name: user.name, role: user.role } });
}));
exports.default = router;
