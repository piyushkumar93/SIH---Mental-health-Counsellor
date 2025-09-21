import express from 'express'
import jwt from 'jsonwebtoken'
import { User } from '../models/user'
import { isValidEmail } from '../utils/validators'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const router = express.Router()

// Use a hardcoded secret if env variable is not available
const JWT_SECRET = process.env.JWT_SECRET || 'MentalHealthSecret'

// Verify secret is available
if (!JWT_SECRET) {
  console.error('JWT_SECRET is not set')
  process.exit(1)
}

router.post('/register', async (req, res) => {
  const { name, email, password, college, age, phone, gender, role } = req.body
  if (!name || !email || !password)
    return res.status(400).json({ message: 'Missing fields' })
  if (!isValidEmail(email))
    return res.status(400).json({ message: 'Invalid email' })

  const existing = await User.findOne({ email })
  if (existing)
    return res.status(409).json({ message: 'Email already registered' })

  const user = new User({
    name,
    email,
    password,
    college,
    age,
    phone,
    gender,
    role
  })
  await user.save()
  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' })
  res.status(201).json({
    token,
    user: {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role
    }
  })
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password)
    return res.status(400).json({ message: 'Missing fields' })
  const user = await User.findOne({ email })
  if (!user) return res.status(401).json({ message: 'Invalid credentials' })
  const matched = await user.comparePassword(password)
  if (!matched) return res.status(401).json({ message: 'Invalid credentials' })
  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' })
  res.json({
    token,
    user: { id: user._id, email: user.email, name: user.name, role: user.role }
  })
})

export default router
