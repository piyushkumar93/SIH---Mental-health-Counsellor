// Standalone inspector: connects to Mongo and inspects appointments for counsellor named 'Alice'
// Run: node backend/scripts/inspectAppointmentsPlain.js
const mongoose = require('mongoose')
require('dotenv').config()

const MONGO =
  process.env.MONGODB_URI ||
  process.env.MONGO_URL ||
  'mongodb://127.0.0.1:27017/sih'

async function run () {
  await mongoose.connect(MONGO, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  console.log('Connected to mongo')

  const CounsellorSchema = new mongoose.Schema(
    {
      name: String,
      userId: mongoose.Schema.Types.ObjectId
    },
    { collection: 'counsellors' }
  )
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

  const Counsellor = mongoose.model('CounsellorPlain', CounsellorSchema)
  const Appointment = mongoose.model('AppointmentPlain', AppointmentSchema)

  const counsellor = await Counsellor.findOne({ name: /Alice/i })
  if (!counsellor) {
    console.log('Alice counsellor not found')
    return process.exit(1)
  }
  console.log(
    'Counsellor id:',
    counsellor._id.toString(),
    'userId:',
    counsellor.userId
  )

  const list = await Appointment.find({ counsellorId: counsellor._id })
    .sort({ createdAt: -1 })
    .limit(20)
    .lean()
  console.log('Found', list.length, 'appointments for counsellor')
  list.forEach(a => {
    console.log('---')
    console.log('id:', a._id)
    console.log('userId type:', typeof a.userId, 'value:', a.userId)
    try {
      console.log('userId as string:', String(a.userId))
    } catch (e) {}
    console.log('counsellorId:', a.counsellorId)
    console.log('status:', a.status)
    console.log('scheduledAt:', a.scheduledAt)
    console.log('notes:', a.notes)
  })
  process.exit(0)
}

run().catch(err => {
  console.error(err)
  process.exit(1)
})
