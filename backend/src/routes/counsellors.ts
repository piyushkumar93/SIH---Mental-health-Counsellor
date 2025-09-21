import express from 'express'
import { requireAuth, requireAdmin } from '../middleware/auth'
import { Counsellor } from '../models/Counsellor'

const router = express.Router()

// Create counsellor (admin) — require auth then admin
router.post('/', requireAuth, requireAdmin, async (req, res) => {
  const doc = new Counsellor(req.body)
  await doc.save()
  res.status(201).json(doc)
})

// Get all counsellors (optional filter by collegeName)
router.get('/', async (req, res) => {
  const { college } = req.query
  const filter: any = {}
  if (college) filter.collegeName = String(college)
  const list = await Counsellor.find(filter)
  res.json(list)
})

// Get counsellor profile for current logged-in user
router.get('/me', requireAuth, async (req, res) => {
  try {
    const c = await Counsellor.findOne({ userId: req.userId })
    if (!c)
      return res.status(404).json({ message: 'Counsellor profile not found' })
    res.json(c)
  } catch (err) {
    console.error('Counsellors /me error', err)
    res.status(500).json({ message: 'Server error' })
  }
})

// Get one
router.get('/:id', async (req, res) => {
  const c = await Counsellor.findById(req.params.id)
  if (!c) return res.status(404).json({ message: 'Not found' })
  res.json(c)
})

// Update (admin)
router.put('/:id', requireAuth, requireAdmin, async (req, res) => {
  const c = await Counsellor.findByIdAndUpdate(req.params.id, req.body, {
    new: true
  })
  res.json(c)
})

// Delete (admin)
router.delete('/:id', requireAuth, requireAdmin, async (req, res) => {
  await Counsellor.findByIdAndDelete(req.params.id)
  res.json({ message: 'Deleted' })
})

export default router
