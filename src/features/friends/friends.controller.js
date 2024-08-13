import { ApplicationError } from "../../error-handler/applicationError.js";
import FriendRepository from "./friends.repository.js";


export default class FriendController {

    constructor() {
        this.friendRepository = new FriendRepository();
    }

    async getFriends(req,res,next) {
        try{
            const {userId} = req.params;
            if (!userId) {
                throw new ApplicationError("Please enter userId", 404);
            }
            const friends = await this.friendRepository.getFriends(userId);
            if(!friends) {
                throw new ApplicationError("friend not received", 404);
            }
            return res.status(200).send(friends);
        }catch(err) {
            next(err);
        }
    }

    async getPendingRequests(req,res,next) {
        try{
            const userId = req.userId;
            const pendingRequests = await this.friendRepository.getPendingRequests(userId);
            if (!pendingRequests) {
                throw new ApplicationError("Pending request couldn't be retrieved", 400);
            }
            return res.status(200).json({
                success: true,
                pendingRequests: pendingRequests,
                msg: "pending friend request retrieved"
            });
        }catch(err){
            next(err);
        }
    }

    async toggleFriendship(req,res,next) {
        try{
            const userId = req.userId;
            const {friendId} = req.params;
            if (!friendId) {
                throw new ApplicationError("Please enter friendId", 400);
            }
            const toggleFriendship = await this.friendRepository.toggleFriendship(userId, friendId);
            if (!toggleFriendship) {
                throw new ApplicationError("Something went wrong while toggling friendship", 400);
            }
            return res.status(200).json({
                success: true,
                msg: toggleFriendship.message
            })
        }catch(err) {
            next(err);
        }
    }

    async responseToRequest(req,res,next) {
        try{
            const userId = req.userId;
            const {friendId} = req.params;
            const {response} = req.body;
            if (!friendId) {
                throw new ApplicationError("Please enter friendId", 400);
            }
            if (!response) {
                throw new ApplicationError("Please enter response", 400);
            }
            const result = await this.friendRepository.responseToRequest(userId, friendId, response);
            if (!result) {
                throw new ApplicationError("Something went wrong while responding to request", 400);
            }
            return res.status(200).json({
                success: true,
                msg: result.message
            })
        }catch(err){
            next(err);
        }
    }

}