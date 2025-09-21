/* Automated API test:
1) Register a temporary user (testuser+timestamp)
2) Login to get token
3) Find Alice counsellor id (by name)
4) Create appointment for that counsellor
5) Fetch /appointments/me (as test user) and /appointments/counsellor (as counsellor via direct DB lookup)

This script uses the backend API endpoints; it assumes the backend server is running at http://localhost:5000
Run: node backend/scripts/automatedAppointmentTest.js
*/
const axios = require('axios')
const mongoose = require('mongoose')
require('dotenv').config()

const API = process.env.VITE_API_URL || 'http://localhost:5000/api'
const MONGO = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sih'

async function run () {
  // create unique test user
  const ts = Date.now()
  const email = `testuser${ts}@example.com`
  const password = 'testpass'
  try {
    await axios.post(`${API}/auth/register`, {
      name: 'Test User',
      email,
      password
    })
  } catch (e) {
    // ignore if exists
  }
  const login = await axios.post(`${API}/auth/login`, { email, password })
  const token = login.data.token || login.data?.token || login.data
  console.log('Test user token length:', String(token).length)

  // find Alice's counsellor id directly from DB using plain schema
  await mongoose.connect(MONGO)
  const CounsellorSchema = new mongoose.Schema(
    { name: String, userId: mongoose.Schema.Types.ObjectId },
    { collection: 'counsellors' }
  )
  const Counsellor = mongoose.model('CounsellorPlain', CounsellorSchema)
  const counsellor = await Counsellor.findOne({ name: /Alice/i })
  if (!counsellor) {
    console.error('Alice counsellor not found in DB')
    process.exit(1)
  }
  console.log('Found counsellor id:', counsellor._id.toString())

  // Create appointment as test user
  const scheduledAt = new Date(Date.now() + 1000 * 60 * 60).toISOString()
  const payload = {
    collegeName: 'TestCollege',
    scheduledAt,
    counsellorId: counsellor._id.toString(),
    notes: 'Mode: video | automated test'
  }
  const res = await axios.post(`${API}/appointments`, payload, {
    headers: { Authorization: `Bearer ${token}` }
  })
  console.log(
    'Create appointment response (populated):',
    JSON.stringify(res.data, null, 2)
  )

  // Fetch appointments/me for test user
  const meList = await axios.get(`${API}/appointments/me`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  console.log('appointments/me:', JSON.stringify(meList.data, null, 2))

  // Now fetch counsellor appointments via API: we need a counsellor user token.
  // If counsellor has userId, we can login as that user (if password known). We'll instead fetch from DB populated for demonstration.
  const AppointmentSchema = new mongoose.Schema(
    {
      collegeName: String,
      userId: mongoose.Schema.Types.Mixed,
      counsellorId: mongoose.Schema.Types.ObjectId,
      scheduledAt: Date,
      status: String,
      notes: String
    },
    { collection: 'appointments' }
  )
  const Appointment = mongoose.model('AppointmentPlain', AppointmentSchema)
  const list = await Appointment.find({ counsellorId: counsellor._id })
    .sort({ createdAt: -1 })
    .limit(5)
    .lean()
  console.log(
    'Appointments (DB):',
    JSON.stringify(
      list.map(l => ({
        id: l._id,
        userId: l.userId,
        status: l.status,
        notes: l.notes
      })),
      null,
      2
    )
  )

  process.exit(0)
}

run().catch(err => {
  console.error(err.response?.data || err.message || err)
  process.exit(1)
})
