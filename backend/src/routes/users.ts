import express from 'express'
import { requireAuth, requireAdmin } from '../middleware/auth'
import { User } from '../models/user'

const router = express.Router()

// Get current profile
router.get('/me', requireAuth, async (req, res) => {
  const user = await User.findById(req.userId)
  if (!user) return res.status(404).json({ message: 'User not found' })
  res.json({
    id: user._id,
    name: user.name,
    email: user.email,
    age: user.age,
    college: user.college,
    phone: user.phone,
    gender: user.gender,
    role: user.role
  })
})

// Admin: list users
router.get('/', requireAuth, requireAdmin, async (req, res) => {
  const users = await User.find().select('-password')
  res.json(users)
})

// Get user by id (requires auth)
router.get('/:id', requireAuth, async (req, res) => {
  const user = await User.findById(req.params.id).select('-password')
  if (!user) return res.status(404).json({ message: 'User not found' })
  res.json({
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role
  })
})

export default router
