import { ApplicationError } from "../../error-handler/applicationError.js";
import OtpRepository from "./otp.repository.js";


export default class OtpController {

    constructor() {
        this.otpRepository = new OtpRepository();
    }

    async sendOtp(req,res,next) {
        try{
            const {email} = req.body;
            const otpSended = await this.otpRepository.sendOtp(email);
            if (!otpSended) {
                throw new ApplicationError("OTP executionn failed", 400);
            }else{
                return res.status(201).send("OTP send successfully");
            }
        }catch(err) {
            next(err);
        }
    }

    async verifyOtp(req,res,next) {
        try{
            const {email, otp} = req.body;
            const otpVerified = await this.otpRepository.verifyOtp(email, otp);
            if (!otpVerified) {
                throw new ApplicationError("OTP verification failed", 400);
            }else{
                return res.status(201).send("OTP verification successfully");
            }
        }catch(err) {
            next(err);
        }
    }

    async resetPassword(req,res,next) {
        try{
            const {email, password} = req.body;
            const userId = req.userId;
            if (!email || !password) {
                throw new ApplicationError("Please enter correct email & password", 400);
            }
            const passwordReset = await this.otpRepository.resetPassword(userId, email, password);
            if  (!passwordReset) {
                throw new ApplicationError("Password reset failed", 400);
            }
            res.status(200).send("Password reset successfull");
        }catch(err) {
            next(err);
        }
    }
}