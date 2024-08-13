import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    otp: {type: String, required: [true, "OTP is required"]},
    userEmail: {type: String, required: [true, "Email is required"]},
    createdAt: {type: Date, default: Date.now}
})

export const OtpModel = mongoose.model('Otp', otpSchema);