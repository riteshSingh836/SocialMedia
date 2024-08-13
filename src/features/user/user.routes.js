import express from 'express';
import UserController from './user.controller.js';
import jwtAuth from '../../middlewares/jwt.middleware.js';
import { fileupload } from '../../middlewares/fileupload.middleware.js';

const userRouter = express.Router();
const userController = new UserController();

// Authentication

userRouter.post('/signup', (req,res,next) => {
     userController.signUp(req,res,next);
});
userRouter.post('/signin', (req,res,next) => {
    userController.signIn(req,res,next);
});
userRouter.get('/logout', jwtAuth, (req,res,next) => {
    console.log("router")
    userController.logout(req,res,next);
});
userRouter.get('/logout-all-devices', jwtAuth, (req,res,next) => {
    userController.logoutAllDevices(req,res,next);
});

// profile

userRouter.get('/get-details/:userId', jwtAuth, (req,res,next) => {
    userController.getDetailsById(req,res,next);
});
userRouter.get('/get-all-details', jwtAuth, (req,res,next) => {
    userController.getAllDetails(req,res,next);
});
userRouter.put('/update-details/:userId', jwtAuth, (req,res,next) => {
    userController.updateDetailsById(req,res,next);
});

// Avatar

userRouter.post('/avatar-upload', jwtAuth, fileupload.single('avatar'), (req,res,next) => {
    userController.avatarUpload(req,res,next);
});

export default userRouter;