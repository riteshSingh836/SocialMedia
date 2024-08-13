import express from 'express';
import FriendController from './friends.controller.js';

const friendRouter = express.Router();
const friendController = new FriendController();

friendRouter.get('/get-friends/:userId', (req,res,next) => {
    friendController.getFriends(req,res,next);
})

friendRouter.get('/get-pending-requests', (req,res,next) => {
    friendController.getPendingRequests(req,res,next);
})

friendRouter.get('/toggle-friendship/:friendId', (req,res,next) => {
    friendController.toggleFriendship(req,res,next);
})

friendRouter.get('/response-to-request/:friendId', (req,res,next) => {
    friendController.responseToRequest(req,res,next);
})

export default friendRouter;