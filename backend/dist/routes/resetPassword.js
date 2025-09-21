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
const user_1 = require("../models/user");
const router = express_1.default.Router();
// Reset password (no current password required)
router.post('/', auth_1.requireAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { newPassword, confirmPassword } = req.body;
    if (!newPassword || !confirmPassword)
        return res.status(400).json({ message: 'Missing fields' });
    if (newPassword !== confirmPassword)
        return res.status(400).json({ message: 'Passwords do not match' });
    if (newPassword.length < 6)
        return res.status(400).json({ message: 'Password too short' });
    const user = yield user_1.User.findById(req.userId);
    if (!user)
        return res.status(404).json({ message: 'User not found' });
    user.password = newPassword;
    yield user.save();
    res.json({ message: 'Password reset successful' });
}));
exports.default = router;
