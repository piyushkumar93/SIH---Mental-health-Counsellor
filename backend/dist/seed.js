"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const Counsellor_1 = require("./models/Counsellor");
const Appointment_1 = require("./models/Appointment");
// Load environment variables
dotenv_1.default.config();
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mentalhealth';
function seed() {
    return __awaiter(this, void 0, void 0, function* () {
        yield mongoose_1.default.connect(MONGODB_URI);
        console.log('Connected to MongoDB');
        // Clear existing data
        yield Counsellor_1.Counsellor.deleteMany({});
        yield Appointment_1.Appointment.deleteMany({});
        // Insert dummy counsellors
        const counsellors = yield Counsellor_1.Counsellor.insertMany([
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
        ]);
        // Insert dummy appointments (no userId, as you have no login)
        yield Appointment_1.Appointment.insertMany([
            {
                collegeName: 'Test College',
                userId: new mongoose_1.default.Types.ObjectId(), // Dummy user
                counsellorId: counsellors[0]._id,
                scheduledAt: new Date(Date.now() + 86400000), // Tomorrow
                status: 'confirmed',
                notes: 'First appointment'
            },
            {
                collegeName: 'Test College',
                userId: new mongoose_1.default.Types.ObjectId(),
                counsellorId: counsellors[1]._id,
                scheduledAt: new Date(Date.now() + 2 * 86400000), // Day after tomorrow
                status: 'pending',
                notes: 'Second appointment'
            }
        ]);
        console.log('Dummy data inserted!');
        yield mongoose_1.default.disconnect();
    });
}
seed().catch(err => {
    console.error(err);
    process.exit(1);
});
