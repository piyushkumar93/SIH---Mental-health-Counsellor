import express from 'express'
import { requireAuth } from '../middleware/auth'
import { User } from '../models/user'

const router = express.Router()

// Reset password (no current password required)
router.post('/', requireAuth, async (req, res) => {
  const { newPassword, confirmPassword } = req.body
  if (!newPassword || !confirmPassword)
    return res.status(400).json({ message: 'Missing fields' })
  if (newPassword !== confirmPassword)
    return res.status(400).json({ message: 'Passwords do not match' })
  if (newPassword.length < 6)
    return res.status(400).json({ message: 'Password too short' })

  const user = await User.findById(req.userId)
  if (!user) return res.status(404).json({ message: 'User not found' })
  user.password = newPassword
  await user.save()
  res.json({ message: 'Password reset successful' })
})

export default router
