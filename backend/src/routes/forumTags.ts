import express from 'express'
import { requireAuth, requireAdmin } from '../middleware/auth'
import { ForumTag } from '../models/ForumTag'

const router = express.Router()

// List all tags
router.get('/', requireAuth, async (req, res) => {
  const tags = await ForumTag.find().sort({ name: 1 })
  res.json(tags)
})

// Admin: create tag
router.post('/', requireAuth, requireAdmin, async (req, res) => {
  const { name, description } = req.body
  if (!name) return res.status(400).json({ message: 'Name required' })
  const tag = new ForumTag({ name, description, createdBy: req.userId })
  await tag.save()
  res.status(201).json(tag)
})

// Admin: delete tag
router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  await ForumTag.findByIdAndDelete(req.params.id)
  res.json({ message: 'Tag deleted' })
})

export default router
