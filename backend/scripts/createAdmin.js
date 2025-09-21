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
// Run this script with: npx ts-node backend/scripts/createAdmin.ts
// It will connect to MONGO_URL from .env (or default to localhost) and create admin@example.com / adminpass
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const user_1 = require("../src/models/user");
dotenv_1.default.config();
// Prefer common env var names used across the project: MONGODB_URI, MONGO_URI, MONGO_URL
const MONGO = process.env.MONGODB_URI ||
    process.env.MONGO_URI ||
    process.env.MONGO_URL ||
    'mongodb://127.0.0.1:27017/sih';
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        yield mongoose_1.default.connect(MONGO);
        console.log('Connected to mongo');
        const email = 'admin@example.com';
        const existing = yield user_1.User.findOne({ email });
        if (existing) {
            console.log('Admin already exists. Credentials:');
            console.log('email:', email);
            console.log('password: adminpass');
            process.exit(0);
        }
        const admin = new user_1.User({
            name: 'Admin User',
            email,
            password: 'adminpass',
            role: 'admin'
        });
        yield admin.save();
        console.log('Created admin user:');
        console.log('email:', email);
        console.log('password: adminpass');
        process.exit(0);
    });
}
run().catch(err => {
    console.error(err);
    process.exit(1);
});
