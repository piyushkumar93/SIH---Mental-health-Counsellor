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
exports.requireAuth = exports.requireAdmin = void 0;
const user_1 = require("../models/user");
const requireAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.userId)
        return res.status(401).json({ message: 'Unauthorized' });
    const user = yield user_1.User.findById(req.userId);
    if (!user)
        return res.status(401).json({ message: 'User not found' });
    if (user.role !== 'admin')
        return res.status(403).json({ message: 'Admin only' });
    next();
});
exports.requireAdmin = requireAdmin;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Use same fallback secret as auth route so tokens signed without env var remain valid
const JWT_SECRET = process.env.JWT_SECRET || 'MentalHealthSecret';
const requireAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader)
        return res.status(401).json({ message: 'No token provided' });
    // Remove Bearer prefix if present
    const token = authHeader.startsWith('Bearer ')
        ? authHeader.slice(7)
        : authHeader;
    try {
        const payload = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        // Attach userId to request for downstream use
        req.userId = payload.id;
        next();
    }
    catch (err) {
        return res.status(401).json({ message: 'Invalid token', error: err });
    }
};
exports.requireAuth = requireAuth;
