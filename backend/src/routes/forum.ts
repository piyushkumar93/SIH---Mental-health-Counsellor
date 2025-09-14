import express from "express";
import { requireAuth } from "../middleware/auth";
import { ForumPost } from "../models/ForumPost";
import { Types } from "mongoose";

const router = express.Router();

// Create post
router.post("/", requireAuth, async (req, res) => {
  const { title, body, tags, isAnonymous, collegeName } = req.body;
  if (!body) return res.status(400).json({ message: "body required" });

  const post = new ForumPost({
    authorId: req.user!._id as Types.ObjectId, 
    title,
    body,
    tags,
    isAnonymous: !!isAnonymous,
    collegeName,
  });

  await post.save();
  res.status(201).json(post);
});

// List posts (with optional college filter)
router.get("/", requireAuth, async (req, res) => {
  const { college } = req.query;
  const filter: any = {};
  if (college) filter.collegeName = college;

  const posts = await ForumPost.find(filter).sort({ createdAt: -1 }).limit(100);
  res.json(posts);
});

// Get single post
router.get("/:id", requireAuth, async (req, res) => {
  const post = await ForumPost.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "Not found" });
  res.json(post);
});

// Comment on post
router.post("/:id/comment", requireAuth, async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ message: "text required" });

  const post = await ForumPost.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "Not found" });

  post.comments.push({
    authorId: req.user!._id as Types.ObjectId, // ✅ cast fixes TS error
    text,
  });

  await post.save();
  res.json(post);
});

// Upvote
router.post("/:id/upvote", requireAuth, async (req, res) => {
  const post = await ForumPost.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "Not found" });

  post.upvotes = (post.upvotes || 0) + 1;
  await post.save();
  res.json({ upvotes: post.upvotes });
});

// Delete (author or admin)
router.delete("/:id", requireAuth, async (req, res) => {
  const post = await ForumPost.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "Not found" });

  const postAuthorId = (post.authorId as Types.ObjectId).toString();
  const currentUserId = (req.user!._id as Types.ObjectId).toString();

  if (req.user!.role !== "admin" && postAuthorId !== currentUserId) {
    return res.status(403).json({ message: "Forbidden" });
  }

  await post.deleteOne();
  res.json({ message: "Deleted" });
});

export default router;
