import express from 'express'
import { requireAuth, requireAdmin } from '../middleware/auth'
import { Appointment } from '../models/Appointment'
import { User } from '../models/user'
import { Types } from 'mongoose'

const router = express.Router()

// Create appointment (requires auth)
router.post('/', requireAuth, async (req, res) => {
  const { collegeName, scheduledAt, counsellorId, notes } = req.body
  if (!collegeName || !scheduledAt) {
    return res.status(400).json({ message: 'Missing fields' })
  }
  const appt = new Appointment({
    collegeName,
    userId: req.userId,
    counsellorId,
    scheduledAt,
    notes
  })
  await appt.save()
  // populate userId and counsellorId so frontend has names immediately
  const populated = await Appointment.findById(appt._id)
    .populate('userId')
    .populate('counsellorId')
  console.log('Created appointment', {
    id: appt._id,
    userId: populated?.userId
  })
  res.status(201).json(populated)
})

// Get user's appointments (requires auth)
router.get('/me', requireAuth, async (req, res) => {
  const list = await Appointment.find({ userId: req.userId }).populate(
    'counsellorId'
  )
  res.json(list)
})

// Counsellor: list appointments assigned to the logged-in counsellor (by counsellor.userId)
router.get('/counsellor', requireAuth, async (req, res) => {
  try {
    // Find counsellor document linked to this user
    const counsellor = await require('../models/Counsellor').Counsellor.findOne(
      { userId: req.userId }
    )
    if (!counsellor) {
      return res.status(404).json({ message: 'Counsellor profile not found' })
    }
    const list = await Appointment.find({ counsellorId: counsellor._id })
      .populate('userId')
      .populate('counsellorId')
    console.log(
      'Counsellor appointments returned:',
      list.map(l => ({
        id: l._id,
        userId: (l.userId as any)?.name || l.userId
      }))
    )
    res.json(list)
  } catch (err) {
    console.error('Counsellor appointments error', err)
    res.status(500).json({ message: 'Server error' })
  }
})

// Admin: list all appointments (require authentication first)
router.get('/', requireAuth, requireAdmin, async (req, res) => {
  const list = await Appointment.find()
    .populate('userId')
    .populate('counsellorId')
  res.json(list)
})

// Update appointment status (user or admin)
router.put('/:id', requireAuth, async (req, res) => {
  const appt = await Appointment.findById(req.params.id)
  if (!appt) return res.status(404).json({ message: 'Not found' })
  const apptUserId = (appt.userId as Types.ObjectId).toString()
  const currentUserId = (req.userId as any).toString()
  // Fetch user to check role
  const user = await User.findById(req.userId)
  if (!user) return res.status(401).json({ message: 'User not found' })
  // allow updates by: admin, appointment owner, or counsellor assigned to this appointment
  let allowed = false
  if (user.role === 'admin') allowed = true
  if (apptUserId === currentUserId) allowed = true
  // check counsellor ownership
  if (!allowed && appt.counsellorId) {
    try {
      const Counsellor = require('../models/Counsellor').Counsellor
      const counsellor = await Counsellor.findById(appt.counsellorId)
      if (
        counsellor &&
        (counsellor.userId as any)?.toString() === currentUserId
      ) {
        allowed = true
      }
    } catch (err) {
      console.error('Error checking counsellor ownership (PUT)', err)
    }
  }
  if (!allowed) return res.status(403).json({ message: 'Forbidden' })

  Object.assign(appt, req.body)
  await appt.save()

  // Return populated appointment so frontend has names immediately
  const populated = await Appointment.findById(appt._id)
    .populate('userId')
    .populate('counsellorId')
  res.json(populated)
})

// Cancel appointment
router.delete('/:id', requireAuth, async (req, res) => {
  const appt = await Appointment.findById(req.params.id)
  if (!appt) return res.status(404).json({ message: 'Not found' })
  console.log(
    'DELETE /appointments/:id called, id=',
    req.params.id,
    'query=',
    req.query,
    'body sample=',
    { notes: req.body?.notes }
  )
  const apptUserId = (appt.userId as Types.ObjectId).toString()
  const currentUserId = (req.userId as any).toString()
  // Fetch user to check role
  const user = await User.findById(req.userId)
  console.log('Current user id=', currentUserId, 'role=', user?.role)
  if (!user) return res.status(401).json({ message: 'User not found' })
  // allow: admin, appointment owner, or counsellor assigned to this appointment
  let allowed = false
  if (user.role === 'admin') allowed = true
  if (apptUserId === currentUserId) allowed = true
  // check counsellor ownership
  if (!allowed && appt.counsellorId) {
    try {
      const Counsellor = require('../models/Counsellor').Counsellor
      const counsellor = await Counsellor.findById(appt.counsellorId)
      if (
        counsellor &&
        (counsellor.userId as any)?.toString() === currentUserId
      ) {
        allowed = true
      }
    } catch (err) {
      console.error('Error checking counsellor ownership', err)
    }
  }
  if (!allowed) return res.status(403).json({ message: 'Forbidden' })
  // If caller requested a hard delete, remove the document entirely
  const hardDelete =
    String(req.query.hardDelete || req.body?.hardDelete || '') === 'true'
  if (hardDelete) {
    await Appointment.findByIdAndDelete(appt._id)
    return res.json({ message: 'Deleted' })
  }

  appt.status = 'cancelled'
  await appt.save()
  res.json({ message: 'Cancelled', appt })
})

export default router
