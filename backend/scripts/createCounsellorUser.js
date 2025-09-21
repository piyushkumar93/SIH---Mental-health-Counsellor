// Run with: node backend/scripts/createCounsellorUser.js
const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()

const Counsellor = require('../dist/models/Counsellor').Counsellor
const User = require('../dist/models/user').User

const MONGO =
  process.env.MONGODB_URI ||
  process.env.MONGO_URI ||
  process.env.MONGO_URL ||
  'mongodb://127.0.0.1:27017/sih'

async function run () {
  await mongoose.connect(MONGO)
  console.log('Connected to mongo')

  const counsellorEmail = 'alice@example.com'
  const counsellor = await Counsellor.findOne({ email: counsellorEmail })
  if (!counsellor) {
    console.error('Counsellor not found:', counsellorEmail)
    process.exit(1)
  }

  const userEmail = counsellorEmail
  const existing = await User.findOne({ email: userEmail })
  if (existing) {
    console.log('User already exists for counsellor:', userEmail)
    console.log('email:', userEmail)
    console.log('password: counsellorpass')
    process.exit(0)
  }

  const user = new User({
    name: counsellor.name || 'Counsellor',
    email: userEmail,
    password: 'counsellorpass',
    role: 'user'
  })
  await user.save()

  counsellor.userId = user._id
  await counsellor.save()

  console.log('Created counsellor user:')
  console.log('email:', userEmail)
  console.log('password: counsellorpass')
  process.exit(0)
}

run().catch(err => {
  console.error(err)
  process.exit(1)
})
