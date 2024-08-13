import { ApplicationError } from "../../error-handler/applicationError.js";
import { UserModel } from "./user.schema.js";

export default class UserRepository {

    // Authentication

    async signUp(user) {
        try{
            const newUser = new UserModel(user);
            await newUser.save();
            return newUser;
        }catch(err){
            console.log(err);
            throw new ApplicationError("Something went wrong with the database", 500);
        }
    }

    async findByEmail(email) {
        try{
            const userFound = await UserModel.findOne({email});
            if (!userFound){
                throw new ApplicationError("User not found", 400);
            }else{
                return userFound;
            }
        }catch(err){
            console.log(err);
            throw new ApplicationError("Something went wrong with the database", 500);
        }

    }

    async logout(token,userId) {
        try{
            const user = await UserModel.findById(userId);
            if (!user) {
                throw new ApplicationError("User not found for logout", 400);
            }else{
                const tokenIndex = user.token.findIndex((t) => t.token == token);
                user.token.splice(tokenIndex,1);
                await user.save();
            }
        }catch(err){
            console.log(err);
            throw new ApplicationError("Something went wrong with the database", 500);
        }
    }

    async logoutAllDevices(userId) {
        try{
            const user = await UserModel.findById(userId);
            if (!user) {
                throw new ApplicationError("User not found for logout", 400);
            }else{
                user.token = []     //assigning token to empty array.
                await user.save();
            }
        }catch(err){
            console.log(err);
            throw new ApplicationError("Something went wrong with the database", 500);
        }
    }


    // Profile

    async getDetailsById(userId) {
        try{
            const findUser = await UserModel.findById(userId);
            return findUser;
        }catch(err){
            console.log(err);
            throw new ApplicationError("Something went wrong with the database", 500);
        }
    }

    async getAllDetails() {
        try{
            const findAllUser = await UserModel.find();
            return findAllUser;
        }catch(err){
            console.log(err);
            throw new ApplicationError("Something went wrong with the database", 500);
        }
    }

    async updateDetailsById(id, userId) {
        try{
            const updatedUser = await UserModel.findByIdAndUpdate(id, userId, {new: true}); // this will return document as an Object after update.
            return updatedUser;
        }catch(err){
            console.log(err);
            throw new ApplicationError("Something went wrong with the database", 500);
        }
    }

    // Avatar

    async avatarUpload(avatar, userId) {
        try{
            const user = await UserModel.findById(userId);
            user.avatar = avatar;
            await user.save();
            return user;
        }catch(err){
            console.log(err);
            throw new ApplicationError("Something went wrong with the database", 500);
        }
    }

}