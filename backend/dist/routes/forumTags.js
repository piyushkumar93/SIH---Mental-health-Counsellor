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
const ForumTag_1 = require("../models/ForumTag");
const router = express_1.default.Router();
// List all tags
router.get('/', auth_1.requireAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tags = yield ForumTag_1.ForumTag.find().sort({ name: 1 });
    res.json(tags);
}));
// Admin: create tag
router.post('/', auth_1.requireAuth, auth_1.requireAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, description } = req.body;
    if (!name)
        return res.status(400).json({ message: 'Name required' });
    const tag = new ForumTag_1.ForumTag({ name, description, createdBy: req.userId });
    yield tag.save();
    res.status(201).json(tag);
}));
// Admin: delete tag
router.delete('/:id', auth_1.requireAuth, auth_1.requireAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield ForumTag_1.ForumTag.findByIdAndDelete(req.params.id);
    res.json({ message: 'Tag deleted' });
}));
exports.default = router;
