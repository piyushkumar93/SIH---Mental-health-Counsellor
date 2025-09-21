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
const ForumPost_1 = require("../models/ForumPost");
const user_1 = require("../models/user");
const router = express_1.default.Router();
// Create post
router.post('/', auth_1.requireAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, body, tags, isAnonymous, collegeName } = req.body;
        if (!body)
            return res.status(400).json({ message: 'body required' });
        const post = new ForumPost_1.ForumPost({
            authorId: req.userId,
            title,
            body,
            tags,
            isAnonymous: !!isAnonymous,
            collegeName
        });
        yield post.save();
        res.status(201).json(post);
    }
    catch (err) {
        console.log(err);
    }
}));
// List posts (with optional college filter)
router.get('/', auth_1.requireAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { college } = req.query;
    const filter = {};
    if (college)
        filter.collegeName = college;
    // Populate author and comment authors
    const posts = yield ForumPost_1.ForumPost.find(filter)
        .sort({ createdAt: -1 })
        .limit(100)
        .populate('authorId', 'name role')
        .populate('comments.authorId', 'name role');
    res.json(posts);
}));
// Get single post
router.get('/:id', auth_1.requireAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield ForumPost_1.ForumPost.findById(req.params.id);
    if (!post)
        return res.status(404).json({ message: 'Not found' });
    res.json(post);
}));
// Comment on post
router.post('/:id/comment', auth_1.requireAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { text } = req.body;
    if (!text)
        return res.status(400).json({ message: 'text required' });
    const post = yield ForumPost_1.ForumPost.findById(req.params.id);
    if (!post)
        return res.status(404).json({ message: 'Not found' });
    post.comments.push({
        authorId: req.userId,
        text
    });
    yield post.save();
    res.json(post);
}));
router.post('/:id/upvote', auth_1.requireAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield ForumPost_1.ForumPost.findById(req.params.id);
    if (!post)
        return res.status(404).json({ message: 'Not found' });
    post.upvotes = (post.upvotes || 0) + 1;
    yield post.save();
    res.json({ upvotes: post.upvotes });
}));
// Delete (author or admin)
router.delete('/:id', auth_1.requireAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const post = yield ForumPost_1.ForumPost.findById(req.params.id);
    if (!post)
        return res.status(404).json({ message: 'Not found' });
    const postAuthorId = post.authorId.toString();
    const currentUserId = req.userId.toString();
    // Fetch user to check role
    const user = yield user_1.User.findById(req.userId);
    if (!user)
        return res.status(401).json({ message: 'User not found' });
    if (user.role !== 'admin' && postAuthorId !== currentUserId) {
        return res.status(403).json({ message: 'Forbidden' });
    }
    yield post.deleteOne();
    res.json({ message: 'Deleted' });
}));
// Delete a specific comment/reply by commentId (admin or author)
router.delete('/:id/comment/:commentId', auth_1.requireAuth, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Delete commentId request for post:', req.params.id);
    console.log('Requested commentId:', req.params.commentId);
    const post = yield ForumPost_1.ForumPost.findById(req.params.id);
    if (!post)
        return res.status(404).json({ message: 'Not found' });
    // Debug: log all comment IDs for this post
    try {
        console.log('All comment _ids:', post.comments.map(c => (c._id ? c._id.toString() : '(no-id)')));
    }
    catch (e) {
        console.log('Error logging comment ids', e);
    }
    const user = (yield user_1.User.findById(req.userId)); // Cast to allow _id access
    if (!user)
        return res.status(401).json({ message: 'User not found' });
    const commentId = req.params.commentId;
    const idx = post.comments.findIndex(c => c._id && c._id.toString() === commentId);
    if (idx === -1) {
        return res.status(404).json({ message: 'Comment not found' });
    }
    const comment = post.comments[idx];
    // Allow admin or comment author
    if (user.role !== 'admin' &&
        comment.authorId.toString() !== user._id.toString()) {
        return res
            .status(403)
            .json({ message: 'Not authorized to delete this comment' });
    }
    post.comments.splice(idx, 1);
    yield post.save();
    res.json({ message: 'Comment deleted' });
}));
exports.default = router;
