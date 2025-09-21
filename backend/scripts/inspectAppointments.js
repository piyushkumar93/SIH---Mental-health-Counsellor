/* Quick script to inspect appointments for Alice's counsellor and show userId shape.
Run: node backend/scripts/inspectAppointments.js
*/
const mongoose = require('mongoose')
require('dotenv').config()
const { Counsellor } = require('../src/models/Counsellor')
const { Appointment } = require('../src/models/Appointment')

const MONGO =
  process.env.MONGODB_URI ||
  process.env.MONGO_URL ||
  'mongodb://127.0.0.1:27017/sih'

async function run () {
  await mongoose.connect(MONGO)
  console.log('Connected to mongo')

  const counsellor = await Counsellor.findOne({ name: /Alice/i })
  if (!counsellor) {
    console.log('Alice counsellor not found')
    process.exit(1)
  }
  console.log('Counsellor id:', counsellor._id.toString())

  const list = await Appointment.find({ counsellorId: counsellor._id })
    .sort({ createdAt: -1 })
    .limit(10)
  console.log('Found', list.length, 'appointments')
  for (const a of list) {
    console.log({
      id: a._id.toString(),
      userIdType: typeof a.userId,
      userIdValue: a.userId
    })
  }
  process.exit(0)
}

run().catch(err => {
  console.error(err)
  process.exit(1)
})
