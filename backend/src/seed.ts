import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { Counsellor } from './models/Counsellor'
import { Appointment } from './models/Appointment'

// Load environment variables
dotenv.config()

const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/mentalhealth'

async function seed () {
  await mongoose.connect(MONGODB_URI)
  console.log('Connected to MongoDB')

  // Clear existing data
  await Counsellor.deleteMany({})
  await Appointment.deleteMany({})

  // Insert dummy counsellors
  const counsellors = await Counsellor.insertMany([
    {
      collegeName: 'Test College',
      name: 'Dr. Alice Smith',
      phone: '1234567890',
      roomNumber: '101',
      email: 'alice@example.com',
      gender: 'Female',
      designation: 'Senior Counsellor',
      rating: 4.8
    },
    {
      collegeName: 'Test College',
      name: 'Mr. Bob Johnson',
      phone: '9876543210',
      roomNumber: '102',
      email: 'bob@example.com',
      gender: 'Male',
      designation: 'Counsellor',
      rating: 4.5
    }
  ])

  // Insert dummy appointments (no userId, as you have no login)
  await Appointment.insertMany([
    {
      collegeName: 'Test College',
      userId: new mongoose.Types.ObjectId(), // Dummy user
      counsellorId: counsellors[0]._id,
      scheduledAt: new Date(Date.now() + 86400000), // Tomorrow
      status: 'confirmed',
      notes: 'First appointment'
    },
    {
      collegeName: 'Test College',
      userId: new mongoose.Types.ObjectId(),
      counsellorId: counsellors[1]._id,
      scheduledAt: new Date(Date.now() + 2 * 86400000), // Day after tomorrow
      status: 'pending',
      notes: 'Second appointment'
    }
  ])

  console.log('Dummy data inserted!')
  await mongoose.disconnect()
}

seed().catch(err => {
  console.error(err)
  process.exit(1)
})
