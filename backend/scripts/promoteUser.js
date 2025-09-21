// Run: node backend/scripts/promoteUser.js alice@example.com
const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()

const User = require('../dist/models/user').User

const MONGO =
  process.env.MONGODB_URI ||
  process.env.MONGO_URI ||
  process.env.MONGO_URL ||
  'mongodb://127.0.0.1:27017/sih'

async function run () {
  await mongoose.connect(MONGO)
  const email = process.argv[2]
  if (!email) {
    console.error('Usage: node promoteUser.js <email>')
    process.exit(1)
  }
  const user = await User.findOne({ email })
  if (!user) {
    console.error('User not found', email)
    process.exit(1)
  }
  user.role = 'admin'
  await user.save()
  console.log('Promoted user to admin:', email)
  process.exit(0)
}

run().catch(err => {
  console.error(err)
  process.exit(1)
})
