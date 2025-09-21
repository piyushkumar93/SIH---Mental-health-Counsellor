// Run this script with: npx ts-node backend/scripts/createAdmin.ts
// It will connect to MONGO_URL from .env (or default to localhost) and create admin@example.com / adminpass
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { User } from '../src/models/user'

dotenv.config()

// Prefer common env var names used across the project: MONGODB_URI, MONGO_URI, MONGO_URL
const MONGO =
  process.env.MONGODB_URI ||
  process.env.MONGO_URI ||
  process.env.MONGO_URL ||
  'mongodb://127.0.0.1:27017/sih'

async function run () {
  await mongoose.connect(MONGO)
  console.log('Connected to mongo')

  const email = 'admin@example.com'
  const existing = await User.findOne({ email })
  if (existing) {
    console.log('Admin already exists. Credentials:')
    console.log('email:', email)
    console.log('password: adminpass')
    process.exit(0)
  }

  const admin = new User({
    name: 'Admin User',
    email,
    password: 'adminpass',
    role: 'admin'
  })
  await admin.save()
  console.log('Created admin user:')
  console.log('email:', email)
  console.log('password: adminpass')
  process.exit(0)
}

run().catch(err => {
  console.error(err)
  process.exit(1)
})
