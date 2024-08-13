import UserRepository from "./user.repository.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ApplicationError } from "../../error-handler/applicationError.js";

export default class UserController {

    constructor() {
        this.userRepository = new UserRepository();
    }

    // Authentication

    async signUp(req, res, next) {
        try {
            const { name, email, password, gender } = req.body;
            const hashPassword = await bcrypt.hash(password, 12);
            // User Object
            const user = { name, email, password: hashPassword, gender };  //we cannot use directly hashPassword here.
            // user.password = hashPassword;       //since property name is "password"
            await this.userRepository.signUp(user);
            const userCred = { name, email, gender };   // Don't send password to client
            res.status(201).send(userCred);
        } catch (err) {
            next(err);
        }
    }

    async signIn(req, res, next) {
        try {
            const { email, password } = req.body;
            const user = await this.userRepository.findByEmail(email);
            if (user) {
                const passwordMatched = await bcrypt.compare(password, user.password);
                if (passwordMatched) {
                    // token created
                    const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

                // finding user and appending token in its token array.

                    // user.token = token;     // since token is an array, if we do like this, everytime it will replace the older one
                    user.token.push(token);
                    await user.save();

                    // sending token
                    res.status(200).send(token);    //direct send status to client.
                } else {
                    throw new ApplicationError("Password not matched", 400);
                    //it requires next() in this middleware, so that it could pass & reach the application level middleware.
                    // and at last it will send the err.code and err.message from applicationError.js
                }
            }
        } catch (err) {
            next(err);
        }
    }

    async logout(req, res, next) {
        try {
            const token = req.headers["authorization"];
            const userId = req.userId;
            await this.userRepository.logout(token, userId);
            res.status(200).send("Logout Successfull");
        }catch (err){
            next(err);
        }
    }

    async logoutAllDevices(req, res, next) {
        try {
            const userId = req.userId;
            await this.userRepository.logoutAllDevices(userId);
            res.status(200).send("Logout from all devices is successfull");
        }catch (err){
            next(err);
        }
    }

    // Profile

    async getDetailsById(req, res, next) {
        try{
            const {userId} = req.params;
            const findUser = await this.userRepository.getDetailsById(userId);
            if (!findUser) {
                return res.status(400).send("User not found for the given details");
                // throw new ApplicationError("user not found - sended through ApplicationError", 400);     //we can write both
            }
            res.status(200).send(findUser);
        }catch(err) {
            next(err);
        }
    }

    async getAllDetails(req, res, next) {
        try{
            const findAllUser = await this.userRepository.getAllDetails();
            if (!findAllUser) {
                return res.status(400).send("No user found!!");
                // throw new ApplicationError("user not found - sended through ApplicationError", 400);     //we can write both
            }
            res.status(200).send(findAllUser);
        }catch(err) {
            next(err);
        }
    }

    async updateDetailsById(req, res) {
        try{
            const {id} = req.params;
            const userId = req.userId;
            const updatedUser = await this.userRepository.updateDetailsById(id, userId);
            if (!updatedUser) {
                return res.status(400).send("No user found to be updated!!");
            }
        }catch(err) {
            next(err);
        }
    }

    // Avatar

    async avatarUpload(req,res,next) {
        try{
            const avatar = req.file.filename;
            const userId = req.userId;
            const user = await this.userRepository.avatarUpload(avatar, userId);
            if (!user) {
                return res.status(400).send("Avatar not Uploaded");
            }
            res.status(201).send("Avatar uploaded successfully");
        }catch(err){
            next(err);
        }
    }

}