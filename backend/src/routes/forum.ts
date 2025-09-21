import express from 'express'
import { requireAuth } from '../middleware/auth'
import { ForumPost } from '../models/ForumPost'
import { User } from '../models/user'
import { Types } from 'mongoose'

const router = express.Router()

// Create post
router.post('/', requireAuth, async (req, res) => {
  try {
    const { title, body, tags, isAnonymous, collegeName } = req.body
    if (!body) return res.status(400).json({ message: 'body required' })

    const post = new ForumPost({
      authorId: req.userId as any,
      title,
      body,
      tags,
      isAnonymous: !!isAnonymous,
      collegeName
    })

    await post.save()
    res.status(201).json(post)
  } catch (err) {
    console.log(err)
  }
})

// List posts (with optional college filter)
router.get('/', requireAuth, async (req, res) => {
  const { college } = req.query
  const filter: any = {}
  if (college) filter.collegeName = college

  // Populate author and comment authors
  const posts = await ForumPost.find(filter)
    .sort({ createdAt: -1 })
    .limit(100)
    .populate('authorId', 'name role')
    .populate('comments.authorId', 'name role')
  res.json(posts)
})

// Get single post
router.get('/:id', requireAuth, async (req, res) => {
  const post = await ForumPost.findById(req.params.id)
  if (!post) return res.status(404).json({ message: 'Not found' })
  res.json(post)
})

// Comment on post
router.post('/:id/comment', requireAuth, async (req, res) => {
  const { text } = req.body
  if (!text) return res.status(400).json({ message: 'text required' })

  const post = await ForumPost.findById(req.params.id)
  if (!post) return res.status(404).json({ message: 'Not found' })

  post.comments.push({
    authorId: req.userId as unknown as Types.ObjectId,
    text
  })

  await post.save()
  res.json(post)
})

router.post('/:id/upvote', requireAuth, async (req, res) => {
  const post = await ForumPost.findById(req.params.id)
  if (!post) return res.status(404).json({ message: 'Not found' })

  post.upvotes = (post.upvotes || 0) + 1
  await post.save()
  res.json({ upvotes: post.upvotes })
})

// Delete (author or admin)
router.delete('/:id', requireAuth, async (req, res) => {
  const post = await ForumPost.findById(req.params.id)
  if (!post) return res.status(404).json({ message: 'Not found' })

  const postAuthorId = (post.authorId as Types.ObjectId).toString()
  const currentUserId = (req.userId as any).toString()
  // Fetch user to check role
  const user = await User.findById(req.userId)
  if (!user) return res.status(401).json({ message: 'User not found' })
  if (user.role !== 'admin' && postAuthorId !== currentUserId) {
    return res.status(403).json({ message: 'Forbidden' })
  }

  await post.deleteOne()
  res.json({ message: 'Deleted' })
})

// Delete a specific comment/reply by commentId (admin or author)
router.delete('/:id/comment/:commentId', requireAuth, async (req, res) => {
  console.log('Delete commentId request for post:', req.params.id)
  console.log('Requested commentId:', req.params.commentId)

  const post = await ForumPost.findById(req.params.id)
  if (!post) return res.status(404).json({ message: 'Not found' })

  // Debug: log all comment IDs for this post
  try {
    console.log(
      'All comment _ids:',
      post.comments.map(c => (c._id ? c._id.toString() : '(no-id)'))
    )
  } catch (e) {
    console.log('Error logging comment ids', e)
  }

  const user = (await User.findById(req.userId)) as any // Cast to allow _id access
  if (!user) return res.status(401).json({ message: 'User not found' })

  const commentId = req.params.commentId
  const idx = post.comments.findIndex(
    c => c._id && c._id.toString() === commentId
  )
  if (idx === -1) {
    return res.status(404).json({ message: 'Comment not found' })
  }
  const comment = post.comments[idx]
  // Allow admin or comment author
  if (
    user.role !== 'admin' &&
    comment.authorId.toString() !== user._id.toString()
  ) {
    return res
      .status(403)
      .json({ message: 'Not authorized to delete this comment' })
  }
  post.comments.splice(idx, 1)
  await post.save()
  res.json({ message: 'Comment deleted' })
})

export default router
