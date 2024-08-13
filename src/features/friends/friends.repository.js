import { ObjectId } from "mongodb";
import { ApplicationError } from "../../error-handler/applicationError";
import { UserModel } from "../user/user.schema";
import { FriendModel } from "./friends.schema";


export default class FriendRepository {

    async getFriends(userId) {
        try{
            // search if any user exist with this userId
            const user = await UserModel.findById(userId);
            if (!user) {
                throw new ApplicationError("No user found", 400);
            }
            const friends = await FriendModel.find({
                $or: [
                    // since this userId is sended by the client in params, this id can be of "user" or of a "friend".
                    {user: new ObjectId(userId), status: "accepted"},
                    {friend: new ObjectId(userId), status: "accepted"}
                ]
            });
            if (friends.length === 0) {
                throw new ApplicationError("User has no friend yet", 400);
            }
            return friends;
        }catch(err){
            console.log(err);
            throw new ApplicationError("Something went wrong with the database", 500);
        }
    }

    async getPendingRequests(userId) {
        try{
            const pendingRequests = await FriendModel.find({
                // here jwtAuth user has requessted to become a friend of some other user, this will retrieve
                // jwtAuth user (to whomever he has sended request & that is still pending)
                friend: new ObjectId(userId), status: "pending"
            });
            if (pendingRequests.length === 0) {
                throw new ApplicationError("User has no pending requests", 400);
            }
            return pendingRequests;
        }catch(err) {
            console.log(err);
            throw new ApplicationError("Something went wrong with the database", 500);
        }
    }

    async toggleFriendship(userId, friendId) {
        try{
            const user = await UserModel.findById(userId);
            if (!user) {
                throw new ApplicationError("No user found", 400);
            }
            const existingFriendship = await FriendModel.find({
                $or: [
                    {user: new ObjectId(userId), friend: new ObjectId(friendId)},
                    {user: new ObjectId(friendId), friend: new ObjectId(userId)}
                ]
            });
            if (existingFriendship) {
                if (existingFriendship.status === "pending") {
                    // delete the pending request
                    await FriendModel.deleteOne({
                        $or: [
                            {user: new ObjectId(userId), friend: new ObjectId(friendId)},
                            {user: new ObjectId(friendId), friend: new ObjectId(userId)}
                        ]
                    });
                    return {message: "Friend request cancelled."}
                }else if (existingFriendship.status == "accepted") {
                    // friendship exits and is accepted, delete it
                    await FriendModel.deleteOne({
                        $or: [
                            {user: new ObjectId(userId), friend: new ObjectId(friendId)},
                            {user: new ObjectId(friendId), friend: new ObjectId(userId)}
                        ]
                    });
                    return {message: "Friend removed."}
                }else if (existingFriendship.status == "rejected") {
                    // friendship exits and is rejected.
                    return {message: "friend request rejected."}
                }
            }else{
                // create new friendship
                const newFriendship = new FriendModel({
                    user: new ObjectId(userId),
                    friend: new ObjectId(friendId),
                    status: "pending"
                });
                await newFriendship.save();
                return {message: "Friend request send"};
            }
        }catch(err) {
            console.log(err);
            throw new ApplicationError("Something went wrong with the database", 500);
        }
    }

    async responseToRequest(userId, friendId, response) {
        try{
            const friendship = await FriendModel.findOne({
                user: new ObjectId(friendId),
                friend: new ObjectId(userId),
                status: "pending"
            });
            if (!friendship) {
                throw new ApplicationError("friend request not found", 400);
            }
            friendship.status = response;
            await friendship.save();
            return {message: `Friend request ${response}.`}
        }catch(err) {
            console.log(err);
            throw new ApplicationError("Something went wrong with the database", 500);
        }
    }

}