import { ApplicationError } from "../../error-handler/applicationError.js";
import sendEmail from "../../middlewares/sendMail.middleware.js";
import { UserModel } from "../user/user.schema.js";
import { OtpModel } from "./otp.schema.js";
import otpGenerator from 'otp-generator';
import bcrypt from 'bcrypt';

export default class OtpRepository {

    async sendOtp(email) {
        try{
            const verifyEmail = await UserModel.findOne({email: email});
            if (!verifyEmail) {
                throw new ApplicationError("email not found", 400);
            }else{
                // generate 6 digit OTP
                const otp = otpGenerator.generate(6, {digits: true, lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false});
                
                const newOtp = new OtpModel({otp: otp, userEmail: email});
                await newOtp.save();
    
                // send email
                sendEmail(email, otp);
                return otp;
            }
        }catch(err) {
            console.log(err);
            throw new ApplicationError("Something went wrong with the database", 500);
        }
    }

    async verifyOtp(email, otp) {
        try{
            const verifyEmail = await UserModel.findOne({email: email});
            if (!verifyEmail) {
                throw new ApplicationError("email not found", 400);
            }else{
                const otpRecord = await OtpModel.findOne({userEmail: email, otp: otp});
                if (!otpRecord) {
                    throw new ApplicationError("OTP not matched", 400);
                }else{
                    return true;
                }
            }
        }catch(err) {
            console.log(err);
            throw new ApplicationError("Something went wrong with the database", 500);
        }
    }

    async resetPassword(userId, email, password) {
        try{
            // first do hashing the password
            const hashPassword = await bcrypt.hash(password, 12);
            const passwordReset = await UserModel.findOneAndUpdate({email}, {password: hashPassword}, {new: true});
            // const passwordReset = await UserModel.findByIdAndUpdate(userId, {password: hashPassword}, {new: true});
            // Any of the above is true
            if (!passwordReset) {
                throw new ApplicationError("User not found", 400);
            }
            return true;
        }catch(err) {
            console.log(err);
            throw new ApplicationError("Something went wrong with the database", 500);
        }
    }

}