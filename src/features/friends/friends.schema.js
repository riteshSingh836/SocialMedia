import mongoose from "mongoose";

const friendSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    friend: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    status: {type: String, enum: ["pending", "accepted", "rejected"], default: "pending"},
},{timestamps: true});

export const FriendModel = mongoose.model('Friend', friendSchema);