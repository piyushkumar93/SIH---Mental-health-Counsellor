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
exports.requireAdmin = exports.requireAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = require("../models/user");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const JWT_SECRET = process.env.JWT_SECRET || "";
const requireAuth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const auth = req.headers.authorization;
    if (!(auth === null || auth === void 0 ? void 0 : auth.startsWith("Bearer ")))
        return res.status(401).json({ message: "Unauthorized" });
    const token = auth.split(" ")[1];
    try {
        const payload = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const user = yield user_1.User.findById(payload.id);
        if (!user)
            return res.status(401).json({ message: "Invalid token user not found" });
        req.user = user;
        next();
    }
    catch (err) {
        return res.status(401).json({ message: "Invalid token", error: err });
    }
});
exports.requireAuth = requireAuth;
const requireAdmin = (req, res, next) => {
    if (!req.user)
        return res.status(401).json({ message: "Unauthorized" });
    if (req.user.role !== "admin")
        return res.status(403).json({ message: "Admin only" });
    next();
};
exports.requireAdmin = requireAdmin;
